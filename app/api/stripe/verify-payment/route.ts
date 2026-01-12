import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createUser, generateAuthToken } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { sendWelcomeEmail } from '@/lib/email';

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

    // Vérifier le statut du paiement (pour abonnement, c'est 'paid' après le premier paiement)
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

    // Récupérer le plan d'abonnement
    const plan = session.metadata?.plan as 'SOLO' | 'COACHING' || 'SOLO';
    const subscriptionId = session.subscription as string;
    const customerId = session.customer as string;

    console.log(`📦 Vérification paiement pour ${email}`);
    console.log(`   Plan: ${plan}`);
    console.log(`   Subscription ID: ${subscriptionId}`);

    // Récupérer les détails de l'abonnement pour la date de fin
    let subscriptionEndDate: Date | null = null;
    if (subscriptionId) {
      try {
        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        if (subscription && 'current_period_end' in subscription && typeof subscription.current_period_end === 'number') {
          subscriptionEndDate = new Date(subscription.current_period_end * 1000);
          console.log(`   Fin d'abonnement: ${subscriptionEndDate.toLocaleDateString()}`);
        }
      } catch (e) {
        console.error('Erreur récupération abonnement:', e);
      }
    }

    // Vérifier si l'utilisateur existe déjà (directement avec Prisma)
    let user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        username: true,
        password: true,
        isActive: true,
        accountType: true,
        subscriptionPlan: true,
      }
    });
    
    let isNewAccount = false;

    if (!user) {
      // Créer un nouvel utilisateur avec abonnement actif
      const newUser = await createUser({
        email: email,
        stripeCustomerId: customerId,
        stripeSessionId: sessionId,
        subscriptionPlan: plan,
        stripeSubscriptionId: subscriptionId,
      });
      
      // Mettre à jour avec les infos d'abonnement
      user = await prisma.user.update({
        where: { id: newUser.id },
        data: {
          isActive: true,
          accountType: 'ACTIVE',
          subscriptionPlan: plan,
          subscriptionStartDate: new Date(),
          subscriptionEndDate: subscriptionEndDate,
          stripeSubscriptionId: subscriptionId,
        },
        select: {
          id: true,
          email: true,
          username: true,
          password: true,
          isActive: true,
          accountType: true,
          subscriptionPlan: true,
        }
      });
      
      isNewAccount = true;
      console.log(`✅ Nouveau compte créé avec abonnement ${plan}`);
    } else {
      // Mettre à jour l'utilisateur existant
      await prisma.user.update({
        where: { id: user.id },
        data: {
          isActive: true,
          accountType: 'ACTIVE',
          subscriptionPlan: plan,
          subscriptionStartDate: new Date(),
          subscriptionEndDate: subscriptionEndDate,
          stripeCustomerId: customerId,
          stripeSessionId: sessionId,
          stripeSubscriptionId: subscriptionId,
        }
      });
      console.log(`✅ Abonnement ${plan} activé pour compte existant`);
    }

    // Enregistrer le paiement
    try {
      await prisma.payment.upsert({
        where: { stripeSessionId: sessionId },
        create: {
          stripeSessionId: sessionId,
          stripePaymentIntentId: session.payment_intent as string || `sub_${subscriptionId}`,
          amount: session.amount_total || 0,
          currency: session.currency || 'eur',
          status: 'SUCCEEDED',
          userId: user.id,
        },
        update: {
          status: 'SUCCEEDED',
        }
      });
    } catch (e) {
      console.error('Erreur enregistrement paiement:', e);
    }

    // Récupérer l'utilisateur mis à jour pour le token
    const updatedUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        email: true,
        username: true,
        password: true,
        accountType: true,
        subscriptionPlan: true,
        subscriptionEndDate: true,
      }
    });

    if (!updatedUser) {
      return NextResponse.json(
        { error: 'Erreur lors de la récupération de l\'utilisateur' },
        { status: 500 }
      );
    }

    // Générer un token JWT avec generateAuthToken (pas generateToken)
    const token = await generateAuthToken({
      id: updatedUser.id,
      email: updatedUser.email,
      accountType: updatedUser.accountType,
      subscriptionPlan: updatedUser.subscriptionPlan,
      subscriptionEndDate: updatedUser.subscriptionEndDate,
    });

    // Email de bienvenue pour les nouveaux comptes
    if (isNewAccount) {
      const claim = await prisma.user.updateMany({
        where: { id: updatedUser.id, welcomeEmailSent: false },
        data: { welcomeEmailSent: true },
      });

      if (claim.count === 1) {
        await sendWelcomeEmail(updatedUser.email, updatedUser.username || undefined).catch(error => {
          console.error('❌ Erreur envoi email de bienvenue:', error);
        });
        console.log(`📧 Email de bienvenue envoyé à ${email}`);
      }
    }

    // Créer la réponse avec le cookie d'authentification
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        isActive: true,
        subscriptionPlan: plan,
      },
      needsProfileCompletion: !updatedUser.username || !updatedUser.password,
      redirectTo: !updatedUser.username || !updatedUser.password ? '/complete-profile' : '/dashboard'
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
