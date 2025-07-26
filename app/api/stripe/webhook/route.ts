import { NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { getUserByEmail, createUser } from "@/lib/auth";
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = req.headers.get("stripe-signature");
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!signature || !endpointSecret) {
      return NextResponse.json(
        { error: 'Configuration webhook manquante' },
        { status: 400 }
      );
    }

    const event = stripe.webhooks.constructEvent(body, signature, endpointSecret);

    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutSessionCompleted(session);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error('Webhook error:', err);
    return NextResponse.json(
      { error: 'Erreur webhook' },
      { status: 400 }
    );
  }
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  try {
    const email = session.customer_email || session.metadata?.email;
    if (!email) {
      console.error('No email in session');
      return;
    }

    console.log(`Paiement réussi pour l'email ${email}`);

    // Vérifier si l'utilisateur existe
    let user = await getUserByEmail(email);

    if (!user) {
      // Créer un nouvel utilisateur
      user = await createUser({
        email: email,
        stripeCustomerId: session.customer as string,
        stripeSessionId: session.id,
      });
      console.log(`Nouvel utilisateur créé: ${user.id}`);
    } else {
      // Activer l'utilisateur existant
      await prisma.user.update({
        where: { id: user.id },
        data: { 
          isActive: true,
          stripeCustomerId: session.customer as string,
          stripeSessionId: session.id,
        }
      });
      console.log(`Utilisateur activé: ${user.id}`);
    }
  } catch (error) {
    console.error('Error handling checkout session completed:', error);
  }
}