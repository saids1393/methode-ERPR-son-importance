// app/api/auth/check-user/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sanitizeInput, secureLog, getSecurityHeaders } from '@/lib/security';

// --- CONFIGURATION DE SÉCURITÉ (ALIGNÉE AVEC LE BACKEND) ---

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

// Domaines jetables connus
const BLOCKED_DOMAINS = [
  'tempmail.com', 'mailinator.com', '10minutemail.com',
  'yopmail.com', 'guerrillamail.com', 'trashmail.com'
];

// --- VALIDATION EMAIL AVANCÉE (IDENTIQUE AU BACKEND) ---
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

// --- ROUTE POST /api/auth/check-user ---
export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    // Vérifier que l'email est fourni
    if (!email) {
      secureLog('CHECK_USER_MISSING_EMAIL', {});
      return NextResponse.json(
        { error: 'Email requis' },
        { status: 400 }
      );
    }

    // Sanitiser et normaliser l'email
    const cleanEmail = sanitizeInput(email).toLowerCase().trim();

    // Vérifier que l'email n'est pas vide après sanitisation
    if (!cleanEmail) {
      secureLog('CHECK_USER_INVALID_EMAIL', { email: email });
      return NextResponse.json(
        { error: 'Email invalide' },
        { status: 400 }
      );
    }

    // Valider le domaine email (même logique que le backend login)
    const emailValidation = validateEmailDomain(cleanEmail);
    if (!emailValidation.valid) {
      secureLog('CHECK_USER_INVALID_EMAIL_DOMAIN', { email: cleanEmail });
      return NextResponse.json(
        { error: emailValidation.error },
        { status: 400 }
      );
    }

    // Rechercher l'utilisateur par email (case-insensitive)
    const user = await prisma.user.findUnique({
      where: { email: cleanEmail },
      select: {
        id: true,
        accountType: true,
        isActive: true,
      },
    });

    // Si l'utilisateur existe ET est FREE_TRIAL, permettre la mise à niveau
    if (user && user.accountType === 'FREE_TRIAL') {
      secureLog('CHECK_USER_FREE_TRIAL_UPGRADE', {
        email: cleanEmail,
        userId: user.id
      });

      return NextResponse.json(
        {
          exists: false,
          canUpgrade: true,
          message: 'Mise à niveau disponible'
        },
        {
          status: 200,
          headers: getSecurityHeaders()
        }
      );
    }

    // Si l'utilisateur existe et est PAID_FULL, bloquer
    if (user && user.accountType === 'PAID_FULL') {
      secureLog('CHECK_USER_ALREADY_PAID', {
        email: cleanEmail,
        userId: user.id
      });

      return NextResponse.json(
        {
          exists: true,
          message: 'Cet email est déjà utilisé'
        },
        {
          status: 200,
          headers: getSecurityHeaders()
        }
      );
    }

    secureLog('CHECK_USER_SUCCESS', {
      email: cleanEmail,
      exists: !!user
    });

    // Retourner uniquement si l'utilisateur existe
    return NextResponse.json(
      {
        exists: !!user,
        message: user ? 'Cet email est déjà utilisé' : 'Email disponible'
      },
      {
        status: 200,
        headers: getSecurityHeaders()
      }
    );

  } catch (error) {
    console.error('Check user error:', error);
    secureLog('CHECK_USER_ERROR', { error: error instanceof Error ? error.message : 'Unknown error' });
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}