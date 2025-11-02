// app/api/webhook/stripe/route.ts (AMÉLIORÉ)
import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma'; // ✅ AJOUTER
import { headers } from 'next/headers';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const sig = (await headers()).get('stripe-signature')!;

    // Vérifier que c'est vraiment Stripe
    const event = stripe.webhooks.constructEvent(body, sig, webhookSecret);

    // Traiter les événements
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as any;
        console.log('✅ Checkout session complété:', session.id);

        if (session.metadata?.paymentPlan === '2x' && session.metadata?.paymentNumber === '1') {
          const customerId = session.customer as string;
          const paymentIntentId = session.payment_intent as string;
          const email = session.metadata.email;

          console.log(`💳 1er paiement 2x détecté pour ${email}`);
          console.log(`   Customer ID: ${customerId}`);
          console.log(`   Payment Intent: ${paymentIntentId}`);

          try {
            const secondPayment = await prisma.secondPayment.create({
              data: {
                customerId,
                firstPaymentIntentId: paymentIntentId,
                status: 'PENDING',
              },
            });

            console.log(`✅ SecondPayment créé: ${secondPayment.id}`);
            console.log(`📅 2e paiement prévu le: ${new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}`);
          } catch (dbErr: any) {
            if (dbErr.code === 'P2002') {
              console.log(`⚠️ Entry existe déjà pour ${paymentIntentId}`);
            } else {
              console.error('❌ Erreur DB:', dbErr.message);
            }
          }
        }
        break;

      case 'charge.succeeded':
        console.log('✅ Paiement réussi:', event.data.object.id);
        break;

      case 'charge.failed':
        console.log('❌ Paiement échoué:', event.data.object);
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('❌ Webhook error:', error.message);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}