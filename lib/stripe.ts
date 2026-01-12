import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';
import { createUser, getUserByEmail } from '@/lib/auth';
import { sendWelcomeEmail } from '@/lib/email';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not defined');
}

// 🔧 Version API Stripe pour TypeScript
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-07-30.basil',
  typescript: true,
});

// Fonction côté client
export const getStripe = () => {
  if (typeof window !== 'undefined') {
    const { loadStripe } = require('@stripe/stripe-js');
    return loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
  }
  return null;
};

// --- Fonction pour traiter la session Stripe ---
export async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  try {
    const email = session.customer_email || session.metadata?.email;
    if (!email) {
      console.error("❌ Aucun email trouvé dans la session Stripe");
      return;
    }

    console.log(`✅ Paiement réussi pour l'email ${email}`);

    // Vérifier si le paiement est déjà enregistré
    const existingPayment = await prisma.payment.findUnique({
      where: { stripeSessionId: session.id },
    });
    if (existingPayment) {
      console.log(`⚠️ Paiement déjà traité pour la session ${session.id}`);
      return;
    }

    // Vérifier ou créer l'utilisateur
    const existingUser = await getUserByEmail(email);
    let userId: string;
    let userEmail: string;
    let username: string | null = null;
    let isNewAccount = false;

    if (!existingUser) {
      const newUser = await createUser({
        email,
        stripeCustomerId: session.customer as string,
        stripeSessionId: session.id,
      });
      userId = newUser.id;
      userEmail = newUser.email;
      username = newUser.username;
      console.log(`🆕 Nouvel utilisateur créé: ${userId}`);
      isNewAccount = true;
    } else {
      await prisma.user.update({
        where: { id: existingUser.id },
        data: {
          isActive: true,
          stripeCustomerId: session.customer as string,
          stripeSessionId: session.id,
        },
      });
      userId = existingUser.id;
      userEmail = existingUser.email;
      username = existingUser.username;
      console.log(`🔓 Utilisateur activé: ${userId}`);
    }

    // Enregistrer le paiement dans Prisma
    await prisma.payment.create({
      data: {
        stripeSessionId: session.id,
        stripePaymentIntentId: session.payment_intent as string,
        amount: session.amount_total || 0,
        currency: session.currency || 'eur',
        userId: userId,
      },
    });

    // Envoyer uniquement le mail de bienvenue si nouvel utilisateur
    if (isNewAccount) {
      try {
        await sendWelcomeEmail(userEmail, username || undefined);
        console.log('📧 Email de bienvenue envoyé à:', email);
      } catch (emailError) {
        console.error('❌ Erreur lors de l\'envoi de l\'email de bienvenue:', emailError);
      }
    }
  } catch (err) {
    console.error('❌ Erreur handleCheckoutSessionCompleted:', err);
  }
}
