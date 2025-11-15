// app/api/auth/signup-free/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { generateToken } from '@/lib/auth';
import { sendFreeTrialWelcomeEmail } from '@/lib/email';
import { createHash } from 'crypto';

// ==================== VALIDATION D'EMAIL ====================
const ALLOWED_EMAIL_DOMAINS = [
  'orange.fr', 'wanadoo.fr', 'sfr.fr', 'neuf.fr', 'bbox.fr',
  'laposte.net', 'free.fr', 'numericable.fr', 'mailo.com', 'mail.fr',
  'pm.me', 'proton.me'
];

const TRUSTED_PROVIDERS = [
  'gmail', 'yahoo', 'outlook', 'hotmail', 'live', 'msn',
  'icloud', 'protonmail'
];

const TRUSTED_TLDS = [
  'fr', 'de', 'es', 'it', 'be', 'nl', 'ch', 'pt', 'uk', 'ie',
  'pl', 'cz', 'se', 'no', 'fi', 'dk', 'at'
];

const BLOCKED_DOMAINS = [
  'tempmail.com', 'mailinator.com', '10minutemail.com',
  'yopmail.com', 'guerrillamail.com', 'trashmail.com',
  'throwaway.email', 'temp-mail.org', 'fakeinbox.com'
];

function validateEmailDomain(email: string): { valid: boolean; error?: string } {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { valid: false, error: 'Format email invalide' };
  }

  const domain = email.split('@')[1].toLowerCase();
  const base = domain.split('.')[0];
  const tld = domain.split('.').pop();

  // Bloquer les domaines jetables
  if (BLOCKED_DOMAINS.includes(domain)) {
    return { valid: false, error: 'Adresse email jetable non autorisée' };
  }

  // Vérifier domaines autorisés
  if (ALLOWED_EMAIL_DOMAINS.includes(domain)) {
    return { valid: true };
  }

  // Vérifier fournisseurs de confiance
  if (TRUSTED_PROVIDERS.some(p => domain.startsWith(p + '.') || base === p)) {
    return { valid: true };
  }

  // Vérifier TLD de confiance
  if (TRUSTED_TLDS.includes(tld || '')) {
    return { valid: true };
  }

  return {
    valid: false,
    error: `Le domaine ${domain} n'est pas autorisé.`
  };
}

// ==================== DEVICE FINGERPRINT ====================
function generateDeviceFingerprint(request: NextRequest): string {
  const userAgent = request.headers.get('user-agent') || '';
  const acceptLanguage = request.headers.get('accept-language') || '';
  const acceptEncoding = request.headers.get('accept-encoding') || '';
  const clientIp = 
    request.headers.get('x-forwarded-for')?.split(',')[0] ||
    request.headers.get('x-real-ip') ||
    '0.0.0.0';

  const fingerprint = `${userAgent}|${acceptLanguage}|${acceptEncoding}|${clientIp}`;
  return createHash('sha256').update(fingerprint).digest('hex');
}

// ==================== RATE LIMITING ====================
const signupAttempts = new Map<string, { count: number; timestamp: number }>();

function checkRateLimit(fingerprintHash: string): { allowed: boolean; error?: string } {
  const now = Date.now();
  const attempt = signupAttempts.get(fingerprintHash);

  // Nettoyer les anciennes tentatives (> 1 heure)
  if (attempt && now - attempt.timestamp > 3600000) {
    signupAttempts.delete(fingerprintHash);
    return { allowed: true };
  }

  if (attempt && attempt.count >= 5) {
    const waitTime = Math.ceil((3600000 - (now - attempt.timestamp)) / 60000);
    return { 
      allowed: false, 
      error: `Trop de tentatives. Réessayez dans ${waitTime} minutes.` 
    };
  }

  if (attempt) {
    attempt.count++;
  } else {
    signupAttempts.set(fingerprintHash, { count: 1, timestamp: now });
  }

  return { allowed: true };
}

// ==================== ROUTE HANDLER ====================
export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    // ========== VALIDATIONS DE BASE ==========
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Email requis' },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();

    // ========== VALIDATION DE FORMAT D'EMAIL ==========
    const emailValidation = validateEmailDomain(cleanEmail);
    if (!emailValidation.valid) {
      return NextResponse.json(
        { error: emailValidation.error || 'Email invalide' },
        { status: 400 }
      );
    }

    // ========== DEVICE FINGERPRINT & RATE LIMITING ==========
    const serverFingerprint = generateDeviceFingerprint(request);
    const rateLimitCheck = checkRateLimit(serverFingerprint);

    if (!rateLimitCheck.allowed) {
      return NextResponse.json(
        { error: rateLimitCheck.error },
        { status: 429 }
      );
    }

    // ========== VÉRIFIER DOUBLON EMAIL ==========
    const existingUser = await prisma.user.findUnique({
      where: { email: cleanEmail }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Un compte existe déjà avec cet email' },
        { status: 400 }
      );
    }

    // ========== VÉRIFIER TENTATIVES DE COMPTE MULTIPLES PAR DEVICE ==========
    const recentFreeTrialAccounts = await prisma.user.findMany({
      where: {
        deviceFingerprint: serverFingerprint,
        accountType: 'FREE_TRIAL',
        createdAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // 30 jours
        }
      },
      take: 1
    });

    if (recentFreeTrialAccounts.length > 0) {
      return NextResponse.json(
        { 
          error: "Vous avez déjà bénéficié d'un essai gratuit. Veuillez passer à un compte payant pour continuer."
        },
        { status: 400 }
      );
    }

    // ========== VÉRIFIER LIMITE D'EMAIL SIMILAIRES ==========
    const emailBase = cleanEmail.split('@')[0];
    const similarEmails = await prisma.user.findMany({
      where: {
        email: {
          startsWith: emailBase
        },
        accountType: 'FREE_TRIAL',
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 7 jours
        }
      }
    });

    if (similarEmails.length >= 2) {
      return NextResponse.json(
        { error: 'Trop de comptes créés avec cet email. Veuillez contacter le support.' },
        { status: 400 }
      );
    }

    // ========== CRÉER L'UTILISATEUR ==========
    const now = new Date();
    const trialEndDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 jours

    const user = await prisma.user.create({
      data: {
        email: cleanEmail,
        isActive: true,
        accountType: 'FREE_TRIAL',
        trialStartDate: now,
        trialEndDate: trialEndDate,
        trialExpired: false,
        deviceFingerprint: serverFingerprint,
        stripeCustomerId: `free_7days_${Date.now()}`,
        stripeSessionId: `free_session_7days_${Date.now()}`,
      },
    });

    // ========== GÉNÉRER TOKEN ==========
    const token = await generateToken({
      userId: user.id,
      email: user.email,
      username: user.username,
    });

    // ========== ENVOYER EMAIL ==========
    await sendFreeTrialWelcomeEmail(user.email, user.username || undefined).catch(error => {
      console.error('❌ Erreur envoi email de bienvenue FREE_TRIAL:', error);
    });

    const response = NextResponse.json(
      {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          accountType: user.accountType,
          trialEndDate: user.trialEndDate,
        }
      },
      { status: 201 }
    );

    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 30,
      path: '/',
    });

    return response;

  } catch (error) {
    console.error('Signup free error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création du compte' },
      { status: 500 }
    );
  }
}