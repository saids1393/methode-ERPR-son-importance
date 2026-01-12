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
        email: true,
        stripeCustomerId: true,
        stripeSubscriptionId: true,
      },
    });

    if (!dbUser) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 400 });
    }

    let customerId = dbUser.stripeCustomerId;

    // Si pas de customer ID valide ou si le customer n'existe pas sur Stripe, en créer un
    if (!customerId || !customerId.startsWith('cus_')) {
      try {
        // Vérifier si un customer existe déjà avec cet email
        const existingCustomers = await stripe.customers.list({
          email: dbUser.email,
          limit: 1,
        });

        if (existingCustomers.data.length > 0) {
          customerId = existingCustomers.data[0].id;
        } else {
          // Créer un nouveau customer Stripe
          const newCustomer = await stripe.customers.create({
            email: dbUser.email,
            metadata: {
              userId: user.id,
            },
          });
          customerId = newCustomer.id;
        }

        // Mettre à jour le stripeCustomerId dans la base de données
        await prisma.user.update({
          where: { id: user.id },
          data: { stripeCustomerId: customerId },
        });
      } catch (stripeError) {
        console.error('Erreur création customer Stripe:', stripeError);
        return NextResponse.json({ 
          error: 'Impossible de créer votre profil de paiement. Veuillez contacter le support.' 
        }, { status: 500 });
      }
    }

    // Vérifier que le customer existe sur Stripe
    try {
      await stripe.customers.retrieve(customerId);
    } catch (retrieveError: any) {
      if (retrieveError.code === 'resource_missing') {
        // Le customer n'existe plus, en créer un nouveau
        const newCustomer = await stripe.customers.create({
          email: dbUser.email,
          metadata: {
            userId: user.id,
          },
        });
        customerId = newCustomer.id;
        
        await prisma.user.update({
          where: { id: user.id },
          data: { stripeCustomerId: customerId },
        });
      } else {
        throw retrieveError;
      }
    }

    // Créer une session du portail client Stripe
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/abonnement`,
    });

    return NextResponse.json({
      url: portalSession.url,
    });
  } catch (error) {
    console.error('Erreur création portail:', error);
    return NextResponse.json({ error: 'Erreur lors de la création du portail' }, { status: 500 });
  }
}
