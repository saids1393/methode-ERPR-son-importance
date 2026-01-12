import { NextRequest, NextResponse } from 'next/server';
import { getAuthUserFromRequest } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { stripe } from '@/lib/stripe';

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUserFromRequest(request);
    
    if (!user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const body = await request.json();
    const { newPlan } = body;

    if (!newPlan || !['SOLO', 'COACHING'].includes(newPlan)) {
      return NextResponse.json({ error: 'Plan invalide' }, { status: 400 });
    }

    // Récupérer l'utilisateur avec ses infos Stripe
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        stripeSubscriptionId: true,
        stripeCustomerId: true,
        subscriptionPlan: true,
      },
    });

    if (!dbUser?.stripeSubscriptionId) {
      return NextResponse.json({ error: 'Aucun abonnement actif trouvé' }, { status: 400 });
    }

    if (dbUser.subscriptionPlan === newPlan) {
      return NextResponse.json({ error: 'Vous êtes déjà sur ce plan' }, { status: 400 });
    }

    // Déterminer le nouveau price ID
    const newPriceId = newPlan === 'COACHING' 
      ? process.env.PLAN_COACHING_MONTHLY_PRICE_ID 
      : process.env.PLAN_SOLO_MONTHLY_PRICE_ID;

    if (!newPriceId) {
      return NextResponse.json({ error: 'Configuration de prix manquante' }, { status: 500 });
    }

    // Récupérer l'abonnement actuel
    const currentSubscription = await stripe.subscriptions.retrieve(dbUser.stripeSubscriptionId);
    
    // Mettre à jour l'abonnement avec le nouveau prix
    const updatedSubscription = await stripe.subscriptions.update(dbUser.stripeSubscriptionId, {
      items: [
        {
          id: currentSubscription.items.data[0].id,
          price: newPriceId,
        },
      ],
      proration_behavior: 'create_prorations', // Proratiser le changement
      cancel_at_period_end: false, // S'assurer que l'abonnement continue
    });

    const currentPeriodEnd = (updatedSubscription as any).current_period_end;

    // Mettre à jour la base de données
    await prisma.user.update({
      where: { id: user.id },
      data: {
        subscriptionPlan: newPlan,
        subscriptionEndDate: currentPeriodEnd ? new Date(currentPeriodEnd * 1000) : null,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Abonnement changé vers ${newPlan}`,
      newPlan,
    });
  } catch (error) {
    console.error('Erreur changement de plan:', error);
    return NextResponse.json({ error: 'Erreur lors du changement de plan' }, { status: 500 });
  }
}
