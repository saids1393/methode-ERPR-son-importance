import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    // Vérifier l'authentification
    const token = cookies().get('auth-token')?.value;
    if (!token) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    const { priceId, successUrl, cancelUrl } = await req.json();

    if (!priceId) {
      return NextResponse.json(
        { error: 'Price ID requis' },
        { status: 400 }
      );
    }

    // Créer la session de checkout Stripe
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription', // ou 'payment' pour un paiement unique
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: successUrl || `${process.env.NEXTAUTH_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${process.env.NEXTAUTH_URL}/cancel`,
      metadata: {
        userId: decoded.userId,
      },
      customer_email: decoded.email,
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création de la session de paiement' },
      { status: 500 }
    );
  }
}