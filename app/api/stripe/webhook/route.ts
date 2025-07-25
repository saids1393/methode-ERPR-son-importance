import { NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

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
      
      case 'customer.subscription.created':
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionCreated(subscription);
        break;
      
      case 'customer.subscription.updated':
        const updatedSubscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdated(updatedSubscription);
        break;
      
      case 'customer.subscription.deleted':
        const deletedSubscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(deletedSubscription);
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
    const userId = session.metadata?.userId;
    if (!userId) {
      console.error('No userId in session metadata');
      return;
    }

    // Mettre à jour l'utilisateur pour marquer comme premium
    // Vous devrez ajouter un champ 'isPremium' à votre modèle User
    console.log(`Paiement réussi pour l'utilisateur ${userId}`);
    
    // Exemple: await prisma.user.update({
    //   where: { id: userId },
    //   data: { isPremium: true }
    // });
  } catch (error) {
    console.error('Error handling checkout session completed:', error);
  }
}

async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  console.log('Subscription created:', subscription.id);
  // Logique pour gérer la création d'abonnement
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  console.log('Subscription updated:', subscription.id);
  // Logique pour gérer la mise à jour d'abonnement
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  console.log('Subscription deleted:', subscription.id);
  // Logique pour gérer la suppression d'abonnement
}