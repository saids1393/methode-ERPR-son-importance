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

    // Récupérer l'utilisateur avec ses infos Stripe
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        stripeSubscriptionId: true,
        stripeCustomerId: true,
      },
    });

    if (!dbUser?.stripeSubscriptionId) {
      return NextResponse.json({ error: 'Aucun abonnement actif trouvé' }, { status: 400 });
    }

    // Annuler l'abonnement à la fin de la période (pas immédiatement)
    const subscription = await stripe.subscriptions.update(dbUser.stripeSubscriptionId, {
      cancel_at_period_end: true,
    });

    const currentPeriodEnd = (subscription as any).current_period_end;

    // Mettre à jour la base de données
    await prisma.user.update({
      where: { id: user.id },
      data: {
        // On garde l'abonnement actif jusqu'à la fin de la période
        subscriptionEndDate: currentPeriodEnd ? new Date(currentPeriodEnd * 1000) : null,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Abonnement annulé avec succès',
      cancelAt: currentPeriodEnd ? new Date(currentPeriodEnd * 1000).toISOString() : null,
    });
  } catch (error) {
    console.error('Erreur annulation abonnement:', error);
    return NextResponse.json({ error: 'Erreur lors de l\'annulation' }, { status: 500 });
  }
}
