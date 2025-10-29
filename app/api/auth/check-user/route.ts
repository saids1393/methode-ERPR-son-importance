// app/api/auth/check-user/route.ts
import { NextResponse } from 'next/server';
import { getUserByEmail } from '@/lib/auth';

// Liste blanche des domaines d'email fiables et utilisés en France (sans spam)
const ALLOWED_EMAIL_DOMAINS = [
  // Fournisseurs internationaux fiables
  'gmail.com',
  'yahoo.com',
  'outlook.com',
  'hotmail.com',
  'icloud.com',
  'protonmail.com',
  'proton.me',

  // Fournisseurs français grand public
  'orange.fr',
  'wanadoo.fr',
  'sfr.fr',
  'neuf.fr',
  'bbox.fr',
  'laposte.net',
  'free.fr',
  'numericable.fr',

  // Fournisseurs français sécurisés / respectueux de la vie privée
  'mailo.com',        // ex-netcourrier
  'mail.fr',

  // Aliases sécurisés
  'pm.me',            // ProtonMail alias

  // Adresses académiques françaises
  'ac-paris.fr',
  'ac-versailles.fr',
  'ac-lyon.fr',
  'ac-toulouse.fr',
  'ac-aix-marseille.fr',
  'ac-nice.fr',
  'ac-lille.fr',
  'ac-bordeaux.fr',
  'ac-strasbourg.fr',
  'ac-nantes.fr',
];

function validateEmailDomain(email: string): { valid: boolean; error?: string } {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { valid: false, error: 'Format email invalide' };
  }

  const domain = email.split('@')[1].toLowerCase();
  
  if (!ALLOWED_EMAIL_DOMAINS.includes(domain)) {
    return { 
      valid: false, 
      error: `Le domaine ${domain} n'est pas autorisé` 
    };
  }

  return { valid: true };
}

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email requis' },
        { status: 400 }
      );
    }

    // Normaliser l'email
    const normalizedEmail = email.toLowerCase().trim();

    // Valider le domaine email
    const emailValidation = validateEmailDomain(normalizedEmail);
    if (!emailValidation.valid) {
      return NextResponse.json(
        { error: emailValidation.error },
        { status: 400 }
      );
    }

    const user = await getUserByEmail(normalizedEmail);

    // Retourner uniquement si l'utilisateur existe
    return NextResponse.json({
      exists: !!user
    });

  } catch (error) {
    console.error('Check user error:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}