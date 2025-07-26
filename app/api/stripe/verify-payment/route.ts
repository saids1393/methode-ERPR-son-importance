import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { getUserByEmail, createUser, generateToken } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { sessionId } = await req.json();

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID requis' },
        { status: 400 }
      );
    }

    // Récupérer la session Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== 'paid') {
      return NextResponse.json(
        { error: 'Paiement non confirmé' },
        { status: 400 }
      );
    }

    const email = session.customer_email || session.metadata?.email;

    if (!email) {
      return NextResponse.json(
        { error: 'Email non trouvé dans la session' },
        { status: 400 }
      );
    }

    // Vérifier si l'utilisateur existe déjà
    let user = await getUserByEmail(email);

    if (!user) {
      // Créer un nouvel utilisateur
      user = await createUser({
        email: email,
        stripeCustomerId: session.customer as string,
        stripeSessionId: sessionId,
      });
    } else if (!user.isActive) {
      // Activer l'utilisateur existant
      await prisma.user.update({
        where: { id: user.id },
        data: { 
          isActive: true,
          stripeCustomerId: session.customer as string,
          stripeSessionId: sessionId,
        }
      });
      user.isActive = true;
    }

    // Générer un token JWT
    const token = await generateToken({
      userId: user.id,
      email: user.email,
    });

    // Créer la réponse et y attacher le cookie
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        isActive: user.isActive,
      },
      needsProfileCompletion: !user.username || !user.password
    });

    response.cookies.set({
      name: 'auth-token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 30 * 24 * 60 * 60, // 30 jours
      path: '/',
      sameSite: 'lax',
    });

    return response;
  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la vérification du paiement' },
      { status: 500 }
    );
  }
}
