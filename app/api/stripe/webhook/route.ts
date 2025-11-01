// app/api/webhook/stripe/route.ts
import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = req.headers.get('stripe-signature')!;

    // Vérifier que c'est vraiment Stripe
    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret);

    // Traiter les événements
    switch (event.type) {
      case 'charge.succeeded':
        console.log('✅ Paiement réussi:', event.data.object);
        // Met à jour ta BD, envoie un email, etc.
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