import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateAuthToken, comparePassword } from '@/lib/auth';
import { rateLimit, getClientIP, sanitizeInput, secureLog, getSecurityHeaders } from '@/lib/security';

// --- CONFIGURATION DE SÉCURITÉ ET DE VALIDATION ---

// Fournisseurs français grand public et sécurisés
const ALLOWED_EMAIL_DOMAINS = [
  'orange.fr', 'wanadoo.fr', 'sfr.fr', 'neuf.fr', 'bbox.fr',
  'laposte.net', 'free.fr', 'numericable.fr', 'mailo.com', 'mail.fr',
  'pm.me', 'proton.me'
];

// Fournisseurs internationaux de confiance
const TRUSTED_PROVIDERS = [
  'gmail', 'yahoo', 'outlook', 'hotmail', 'live', 'msn',
  'icloud', 'protonmail'
];

// Extensions de domaines européens (TLD)
const TRUSTED_TLDS = [
  'fr', 'de', 'es', 'it', 'be', 'nl', 'ch', 'pt', 'uk', 'ie',
  'pl', 'cz', 'se', 'no', 'fi', 'dk', 'at'
];

// Domaines jetables connus (à enrichir si besoin)
const BLOCKED_DOMAINS = [
  'tempmail.com', 'mailinator.com', '10minutemail.com',
  'yopmail.com', 'guerrillamail.com', 'trashmail.com'
];

// --- VALIDATION EMAIL AVANCÉE ---
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

  // Accepter domaines explicitement whitelistés
  if (ALLOWED_EMAIL_DOMAINS.includes(domain)) {
    return { valid: true };
  }

  // Accepter les grands fournisseurs connus (toutes extensions locales)
  if (TRUSTED_PROVIDERS.some(p => domain.startsWith(p + '.') || base === p)) {
    return { valid: true };
  }

  // Accepter les TLD européens
  if (TRUSTED_TLDS.includes(tld || '')) {
    return { valid: true };
  }

  return {
    valid: false,
    error: `Le domaine ${domain} n'est pas autorisé.`
  };
}

// --- ROUTE POST /api/auth/login ---
export async function POST(req: Request) {
  try {
    // Protection contre le brute-force
    const clientIP = getClientIP(req as any);
    const rateLimitResult = rateLimit(`login:${clientIP}`, {
      windowMs: 15 * 60 * 1000,
      maxAttempts: 5,
    });

    if (!rateLimitResult.success) {
      secureLog('LOGIN_RATE_LIMITED', { ip: clientIP });
      return NextResponse.json(
        {
          error: 'Trop de tentatives. Réessayez dans 15 minutes.',
          retryAfter: Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000),
        },
        { status: 429 }
      );
    }

    const { identifier, password } = await req.json();
    if (!identifier || !password) {
      secureLog('LOGIN_MISSING_FIELDS', { ip: clientIP });
      return NextResponse.json({ error: 'Identifiant et mot de passe requis' }, { status: 400 });
    }

    const cleanIdentifier = sanitizeInput(identifier).toLowerCase().trim();
    const cleanPassword = password;

    if (!cleanIdentifier || !cleanPassword) {
      secureLog('LOGIN_INVALID_INPUT', { ip: clientIP });
      return NextResponse.json({ error: 'Données invalides' }, { status: 400 });
    }

    // Vérifier le domaine email si applicable
    if (cleanIdentifier.includes('@')) {
      const emailValidation = validateEmailDomain(cleanIdentifier);
      if (!emailValidation.valid) {
        secureLog('LOGIN_INVALID_EMAIL_DOMAIN', { ip: clientIP, email: cleanIdentifier });
        return NextResponse.json({ error: emailValidation.error }, { status: 400 });
      }
    }

    // Recherche utilisateur
    // Pour email : recherche case-insensitive exacte
    // Pour username : recherche case-insensitive (transformer en minuscules)
    // NOTE: Utiliser 'insensitive' mode pour supporter les usernames en majuscules
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: cleanIdentifier },
          { username: { equals: cleanIdentifier, mode: 'insensitive' } },
        ],
      },
      select: { id: true, email: true, username: true, password: true, isActive: true },
    });

    if (!user || !user.isActive || !user.password) {
      secureLog('LOGIN_FAILED', {
        ip: clientIP,
        identifier: cleanIdentifier,
        reason: !user
          ? 'user_not_found'
          : !user.isActive
          ? 'user_inactive'
          : 'no_password',
      });
      return NextResponse.json(
        { error: 'Identifiants incorrects ou compte inactif' },
        { status: 401 }
      );
    }

    const isValidPassword = await comparePassword(cleanPassword, user.password);
    if (!isValidPassword) {
      secureLog('LOGIN_INVALID_PASSWORD', { ip: clientIP, userId: user.id });
      return NextResponse.json({ error: 'Identifiants incorrects' }, { status: 401 });
    }

    secureLog('LOGIN_SUCCESS', { ip: clientIP, userId: user.id });

    const token = await generateAuthToken({
      id: user.id,
      email: user.email,
      accountType: user.accountType,
      subscriptionPlan: user.subscriptionPlan,
      subscriptionEndDate: user.subscriptionEndDate,
    });

    const response = NextResponse.json(
      {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          isActive: user.isActive,
        },
      },
      { headers: getSecurityHeaders() }
    );

    response.cookies.set({
      name: 'auth-token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 30 * 24 * 60 * 60, // 30 jours
      path: '/',
      sameSite: 'lax',
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    secureLog('LOGIN_ERROR', { error: error instanceof Error ? error.message : 'Unknown error' });
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 });
  }
}