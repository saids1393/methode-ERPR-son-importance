import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email requis' },
        { status: 400 }
      );
    }

    // Déterminer l'URL de base selon l'environnement
    const baseUrl =
      process.env.NODE_ENV === 'production'
        ? process.env.NEXTAUTH_URL // ta prod
        : 'http://localhost:3000'; // local

    // Créer la session Stripe Checkout
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: 'Méthode ERPR - Cours d\'arabe complet',
              description: 'Apprenez à lire et écrire l\'arabe à votre rythme',
              images: ['https://images.pexels.com/photos/256417/pexels-photo-256417.jpeg'],
            },
            unit_amount: 8900, // 89€ en centimes
          },
          quantity: 1,
        },
      ],
      customer_email: email,
      success_url: `${baseUrl}/merci?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/checkout`,
      metadata: { email },
      expires_at: Math.floor(Date.now() / 1000) + 30 * 60, // 30 minutes
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
