// app/api/stripe/webhook/route.ts
// Webhook pour gérer les abonnements mensuels
import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import Stripe from 'stripe';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error('❌ Webhook signature verification failed:', err.message);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  try {
    switch (event.type) {
      // Abonnement créé avec succès
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdate(subscription);
        break;
      }

      // Abonnement annulé
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionCancelled(subscription);
        break;
      }

      // Paiement réussi (renouvellement)
      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        if ((invoice as any).subscription) {
          await handlePaymentSucceeded(invoice);
        }
        break;
      }

      // Paiement échoué
      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        await handlePaymentFailed(invoice);
        break;
      }

      default:
        console.log(`⚪ Événement non géré: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('❌ Erreur webhook:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

async function handleSubscriptionUpdate(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;
  
  const user = await prisma.user.findFirst({
    where: { stripeCustomerId: customerId }
  });

  if (!user) {
    console.error('❌ Utilisateur non trouvé pour customer:', customerId);
    return;
  }

  // Déterminer le plan basé sur le price ID
  const priceId = subscription.items.data[0]?.price.id;
  let subscriptionPlan: 'SOLO' | 'COACHING' = 'SOLO';
  
  if (priceId === process.env.PLAN_COACHING_MONTHLY_PRICE_ID) {
    subscriptionPlan = 'COACHING';
  }

  // Déterminer le statut du compte
  // Note: 'cancel_at_period_end' means subscription is still active until period ends
  let accountType: 'ACTIVE' | 'EXPIRED' = 'ACTIVE';
  
  if (subscription.status === 'canceled' || subscription.status === 'unpaid') {
    accountType = 'EXPIRED';
  }

  const subscriptionItem = subscription.items.data[0];
  const currentPeriodStart = subscriptionItem?.current_period_start ?? subscription.start_date;
  const currentPeriodEnd = subscriptionItem?.current_period_end ?? (subscription.start_date + 30 * 24 * 60 * 60);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      accountType,
      subscriptionPlan,
      stripeSubscriptionId: subscription.id,
      subscriptionStartDate: new Date(currentPeriodStart * 1000),
      subscriptionEndDate: new Date(currentPeriodEnd * 1000),
      isActive: accountType !== 'EXPIRED',
    }
  });

  console.log(`✅ Abonnement mis à jour pour ${user.email}: ${accountType} - ${subscriptionPlan}`);
}

async function handleSubscriptionCancelled(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;
  
  const user = await prisma.user.findFirst({
    where: { stripeCustomerId: customerId }
  });

  if (!user) return;

  await prisma.user.update({
    where: { id: user.id },
    data: {
      accountType: 'EXPIRED',
      isActive: false,
    }
  });

  console.log(`🚫 Abonnement expiré pour ${user.email}`);
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  const customerId = invoice.customer as string;
  
  const user = await prisma.user.findFirst({
    where: { stripeCustomerId: customerId }
  });

  if (!user) return;

  // Réactiver le compte si paiement réussi
  await prisma.user.update({
    where: { id: user.id },
    data: {
      accountType: 'ACTIVE',
      isActive: true,
    }
  });

  console.log(`💰 Paiement réussi pour ${user.email}`);
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  const customerId = invoice.customer as string;
  
  const user = await prisma.user.findFirst({
    where: { stripeCustomerId: customerId }
  });

  if (!user) return;

  console.log(`❌ Paiement échoué pour ${user.email}`);
  // Optionnel: envoyer un email de relance
}
