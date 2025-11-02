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
      case 'charge.succeeded':
        console.log('✅ Paiement réussi:', event.data.object.id);
        
        // ✅ AJOUTER: Créer l'entrée SecondPayment si c'est un paiement 2x
        const charge = event.data.object as any;
        
        if (charge.metadata?.paymentPlan === '2x' && charge.metadata?.paymentNumber === '1') {
          console.log(`✅ 1er paiement 2x détecté pour ${charge.metadata.email}`);

          const customerId = charge.customer as string;
          const firstPaymentIntentId = charge.payment_intent as string;
          const email = charge.metadata.email;

          try {
            // ✅ CRÉER L'ENTRÉE dans SecondPayment
            const secondPayment = await prisma.secondPayment.create({
              data: {
                customerId,
                firstPaymentIntentId,
                status: 'PENDING',
              },
            });

            console.log(`✅ Entry créée dans SecondPayment: ${secondPayment.id}`);
            console.log(`📅 Sera traité le: ${new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}`);
          } catch (dbErr: any) {
            // ⚠️ Si l'entry existe déjà (UNIQUE constraint), c'est OK
            if (dbErr.code === 'P2002') {
              console.log(`⚠️ Entry déjà existe pour ${firstPaymentIntentId}`);
            } else {
              console.error('❌ Erreur DB:', dbErr.message);
            }
          }
        }
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