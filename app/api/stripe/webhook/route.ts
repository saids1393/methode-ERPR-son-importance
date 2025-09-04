import { stripe, handleCheckoutSessionCompleted } from '@/lib/stripe';
import Stripe from 'stripe';

export const POST = async (req: Request) => {
  const sig = req.headers.get('stripe-signature')!;
  const body = await req.text(); // webhook Stripe raw body

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error('Erreur webhook Stripe:', err.message);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    try {
      await handleCheckoutSessionCompleted(session);
    } catch (err) {
      console.error('Erreur handleCheckoutSessionCompleted:', err);
      return new Response('Erreur interne', { status: 500 });
    }
  }

  return new Response('Webhook reçu', { status: 200 });
};
