// app/api/stripe/manage-subscription/route.ts
// API pour gérer les abonnements (annulation, changement de plan)
import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

// GET - Récupérer les infos d'abonnement
export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload?.userId) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const userData = await prisma.user.findUnique({
      where: { id: payload.userId as string },
      select: {
        subscriptionPlan: true,
        subscriptionStartDate: true,
        subscriptionEndDate: true,
        stripeSubscriptionId: true,
        stripeCustomerId: true,
        accountType: true,
      }
    });

    if (!userData?.stripeSubscriptionId) {
      return NextResponse.json({ 
        hasSubscription: false,
        accountType: userData?.accountType 
      });
    }

    // Récupérer les détails depuis Stripe
    try {
      const subscription = await stripe.subscriptions.retrieve(userData.stripeSubscriptionId);
      const currentPeriodEnd = (subscription as any).current_period_end;
      
      return NextResponse.json({
        hasSubscription: true,
        plan: userData.subscriptionPlan,
        status: subscription.status,
        currentPeriodEnd: currentPeriodEnd ? new Date(currentPeriodEnd * 1000) : null,
        cancelAtPeriodEnd: (subscription as any).cancel_at_period_end,
        accountType: userData.accountType,
      });
    } catch (stripeError) {
      // L'abonnement n'existe plus sur Stripe
      return NextResponse.json({ 
        hasSubscription: false,
        accountType: userData.accountType 
      });
    }
  } catch (error: any) {
    console.error('Erreur récupération abonnement:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST - Annuler l'abonnement
export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload?.userId) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { action } = await req.json();

    const userData = await prisma.user.findUnique({
      where: { id: payload.userId as string },
      select: {
        stripeSubscriptionId: true,
        stripeCustomerId: true,
      }
    });

    if (!userData?.stripeSubscriptionId) {
      return NextResponse.json({ error: 'Aucun abonnement actif' }, { status: 400 });
    }

    if (action === 'cancel') {
      // Annuler à la fin de la période
      await stripe.subscriptions.update(userData.stripeSubscriptionId, {
        cancel_at_period_end: true
      });

      console.log(`🚫 Abonnement ${userData.stripeSubscriptionId} sera annulé à la fin de la période`);

      return NextResponse.json({ 
        success: true, 
        message: 'Votre abonnement sera annulé à la fin de la période en cours.' 
      });
    }

    if (action === 'reactivate') {
      // Réactiver un abonnement annulé
      await stripe.subscriptions.update(userData.stripeSubscriptionId, {
        cancel_at_period_end: false
      });

      console.log(`✅ Abonnement ${userData.stripeSubscriptionId} réactivé`);

      return NextResponse.json({ 
        success: true, 
        message: 'Votre abonnement a été réactivé.' 
      });
    }

    if (action === 'portal') {
      // Créer un lien vers le portail client Stripe
      const portalSession = await stripe.billingPortal.sessions.create({
        customer: userData.stripeCustomerId!,
        return_url: `${process.env.NEXTAUTH_URL}/dashboard`,
      });

      return NextResponse.json({ url: portalSession.url });
    }

    return NextResponse.json({ error: 'Action non reconnue' }, { status: 400 });
  } catch (error: any) {
    console.error('Erreur gestion abonnement:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
