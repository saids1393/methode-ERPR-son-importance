// app/api/auth/check-user/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

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
export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email requis' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        username: true,
        accountType: true,
        subscriptionPlan: true,
        subscriptionEndDate: true,
        isActive: true,
      }
    });

    if (!user) {
      return NextResponse.json({ 
        exists: false,
        message: 'Utilisateur non trouvé'
      });
    }

    // Vérifier si l'abonnement est actif
    const hasActiveSubscription = 
      (user.accountType === 'ACTIVE') ||
      (user.accountType === 'CANCELLED' && user.subscriptionEndDate && new Date(user.subscriptionEndDate) > new Date());

    return NextResponse.json({
      exists: true,
      hasActiveSubscription,
      accountType: user.accountType,
      subscriptionPlan: user.subscriptionPlan,
      needsPassword: !user.username, // Si pas de username, c'est un nouveau compte Stripe
    });

  } catch (error: any) {
    console.error('Erreur check-user:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}