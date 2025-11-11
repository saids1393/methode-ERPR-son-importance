import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword, generateToken } from '@/lib/auth';
import { rateLimit, getClientIP, sanitizeInput, secureLog, getSecurityHeaders } from '@/lib/security';

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
  'yopmail.com', 'guerrillamail.com', 'trashmail.com'
];

function validateEmailDomain(email: string): { valid: boolean; error?: string } {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { valid: false, error: 'Format email invalide' };
  }

  const domain = email.split('@')[1].toLowerCase();
  const base = domain.split('.')[0];
  const tld = domain.split('.').pop();

  if (BLOCKED_DOMAINS.includes(domain)) {
    return { valid: false, error: 'Adresse email jetable non autorisée' };
  }

  if (ALLOWED_EMAIL_DOMAINS.includes(domain)) {
    return { valid: true };
  }

  if (TRUSTED_PROVIDERS.some(p => domain.startsWith(p + '.') || base === p)) {
    return { valid: true };
  }

  if (TRUSTED_TLDS.includes(tld || '')) {
    return { valid: true };
  }

  return {
    valid: false,
    error: `Le domaine ${domain} n'est pas autorisé.`
  };
}

function calculateTrialEndDate(): Date {
  const now = new Date();
  const parisTime = new Date(now.toLocaleString('en-US', { timeZone: 'Europe/Paris' }));

  const endDate = new Date(parisTime);
  endDate.setDate(endDate.getDate() + 14);
  endDate.setHours(23, 59, 59, 999);

  return endDate;
}

export async function POST(req: Request) {
  try {
    const clientIP = getClientIP(req as any);
    const rateLimitResult = rateLimit(`signup:${clientIP}`, {
      windowMs: 15 * 60 * 1000,
      maxAttempts: 3,
    });

    if (!rateLimitResult.success) {
      secureLog('SIGNUP_RATE_LIMITED', { ip: clientIP });
      return NextResponse.json(
        {
          error: 'Trop de tentatives. Réessayez dans 15 minutes.',
          retryAfter: Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000),
        },
        { status: 429 }
      );
    }

    const { email, password } = await req.json();

    if (!email || !password) {
      secureLog('SIGNUP_MISSING_FIELDS', { ip: clientIP });
      return NextResponse.json({ error: 'Email et mot de passe requis' }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: 'Le mot de passe doit contenir au moins 8 caractères' }, { status: 400 });
    }

    const cleanEmail = sanitizeInput(email).toLowerCase().trim();
    const emailValidation = validateEmailDomain(cleanEmail);
    if (!emailValidation.valid) {
      secureLog('SIGNUP_INVALID_EMAIL_DOMAIN', { ip: clientIP, email: cleanEmail });
      return NextResponse.json({ error: emailValidation.error }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (existingUser) {
      secureLog('SIGNUP_EMAIL_EXISTS', { ip: clientIP, email: cleanEmail });
      return NextResponse.json({ error: 'Un compte existe déjà avec cet email' }, { status: 409 });
    }

    const hashedPassword = await hashPassword(password);
    const trialStartDate = new Date();
    const trialEndDate = calculateTrialEndDate();

    const user = await prisma.user.create({
      data: {
        email: cleanEmail,
        password: hashedPassword,
        isActive: true,
        accountType: 'FREE_TRIAL',
        trialStartDate,
        trialEndDate,
        trialExpired: false,
      },
      select: {
        id: true,
        email: true,
        username: true,
        isActive: true,
        accountType: true,
        trialStartDate: true,
        trialEndDate: true,
      },
    });

    secureLog('SIGNUP_SUCCESS', { ip: clientIP, userId: user.id, accountType: 'FREE_TRIAL' });

    const token = await generateToken({
      userId: user.id,
      email: user.email,
      username: user.username,
    });

    const response = NextResponse.json(
      {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          isActive: user.isActive,
          accountType: user.accountType,
          trialEndDate: user.trialEndDate,
        },
      },
      { headers: getSecurityHeaders() }
    );

    response.cookies.set({
      name: 'auth-token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 30 * 24 * 60 * 60,
      path: '/',
      sameSite: 'lax',
    });

    return response;
  } catch (error) {
    console.error('Signup error:', error);
    secureLog('SIGNUP_ERROR', { error: error instanceof Error ? error.message : 'Unknown error' });
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 });
  }
}
