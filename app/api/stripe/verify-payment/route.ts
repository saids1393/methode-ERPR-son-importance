import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { getUserByEmail, createUser, generateToken } from '@/lib/auth';
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

    const module = (session.metadata?.module || 'LECTURE').toUpperCase();

    if (session.metadata?.paymentPlan === '2x' && session.metadata?.paymentNumber === '1' && module !== 'TAJWID') {
      const customerId = session.customer as string;
      const paymentIntentId = session.payment_intent as string;

      console.log(`💳 1er paiement 2x détecté pour ${email} (verify-payment)`);
      console.log(`   Customer ID: ${customerId}`);
      console.log(`   Payment Intent: ${paymentIntentId}`);

      try {
        const existing = await prisma.secondPayment.findUnique({
          where: { firstPaymentIntentId: paymentIntentId },
        });

        if (!existing) {
          const secondPayment = await prisma.secondPayment.create({
            data: {
              customerId,
              firstPaymentIntentId: paymentIntentId,
              status: 'PENDING',
            },
          });

          console.log(`✅ SecondPayment créé: ${secondPayment.id}`);
          console.log(`📅 2e paiement prévu le: ${new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}`);
        } else {
          console.log(`⚠️ SecondPayment existe déjà pour ${paymentIntentId}`);
        }
      } catch (dbErr: any) {
        console.error('❌ Erreur création SecondPayment:', dbErr.message);
      }
    }

    // Vérifier si l'utilisateur existe déjà
    let user = await getUserByEmail(email);
    let isNewAccount = false;
    let wasFreeTrial = false;

    if (!user) {
      // Créer un nouvel utilisateur (ne pas forcer PAID_FULL si achat TAJWID)
      user = await createUser({
        email: email,
        stripeCustomerId: session.customer as string,
        stripeSessionId: sessionId,
        accountType: module === 'TAJWID' ? 'PAID_LEGACY' : 'PAID_FULL',
      });
      isNewAccount = true;
    } else if (!user.isActive) {
      // Activer l'utilisateur existant
      await prisma.user.update({
        where: { id: user.id },
        data: {
          isActive: true,
          stripeCustomerId: session.customer as string,
          stripeSessionId: sessionId,
          ...(module !== 'TAJWID' ? { accountType: 'PAID_FULL' } : {}),
        }
      });
      user.isActive = true;
    } else if (module !== 'TAJWID') {
      // Utilisateur existant et actif - Mettre à niveau si FREE_TRIAL (uniquement module Lecture)
      const existingUser = await prisma.user.findUnique({
        where: { id: user.id },
        select: {
          accountType: true,
          username: true,
          password: true,
        },
      });

      if (existingUser?.accountType === 'FREE_TRIAL') {
        wasFreeTrial = true;
        console.log(`🔄 Mise à niveau FREE_TRIAL → PAID_FULL pour ${email}`);
        await prisma.user.update({
          where: { id: user.id },
          data: {
            accountType: 'PAID_FULL',
            stripeCustomerId: session.customer as string,
            stripeSessionId: sessionId,
            trialEndDate: null,
            trialExpired: false,
            conversionDate: new Date(),
          }
        });

        // Mettre à jour les données utilisateur avec les nouvelles infos
        user.username = existingUser.username;
        console.log(`✅ Compte mis à niveau avec succès`);
      }
    }

    // Lier l'achat au Level correspondant (TAJWID ou LECTURE)
    try {
      let level = await prisma.level.findFirst({
        where: { module: module as any },
      });

      if (!level) {
        // Créer automatiquement si manquant
        level = await prisma.level.create({
          data: {
            title: module === 'TAJWID' ? 'Module Tajwid' : 'Méthode Lecture',
            price: module === 'TAJWID' ? 29 : 89,
            module: module as any,
          },
        });
      }

      // Créer l'achat si pas déjà présent
      await prisma.levelPurchase.upsert({
        where: { userId_levelId: { userId: user.id, levelId: level.id } },
        create: { userId: user.id, levelId: level.id },
        update: {},
      });
    } catch (e) {
      console.error('❌ Erreur LevelPurchase:', e);
    }

    // Générer un token JWT
    const token = await generateToken({
      userId: user.id,
      email: user.email,
    });

    // ======= ANTI-DOUBLON EMAIL =======
    // Email de bienvenue SEULEMENT pour les nouveaux comptes PAID_FULL
    if (isNewAccount && module !== 'TAJWID') {
      const claim = await prisma.user.updateMany({
        where: { id: user.id, welcomeEmailSent: false, accountType: 'PAID_FULL' },
        data: { welcomeEmailSent: true },
      });

      if (claim.count === 1) {
        await sendWelcomeEmail(user.email, user.username || undefined).catch(error => {
          console.error('❌ Erreur envoi email de bienvenue (payment):', error);
        });
      }
    }

    // ======= EMAIL DE BIENVENUE POUR CONVERSION FREE_TRIAL -> PAID_FULL =======
    if (wasFreeTrial) {
      const claim = await prisma.user.updateMany({
        where: { id: user.id, welcomeEmailSent: false },
        data: { welcomeEmailSent: true },
      });

      if (claim.count === 1) {
        await sendWelcomeEmail(user.email, user.username || undefined).catch(error => {
          console.error('❌ Erreur envoi email de bienvenue (conversion):', error);
        });
      }
    }

    // Créer la réponse et y attacher le cookie
    // Si l'utilisateur vient d'un FREE_TRIAL, il a déjà un profil complet
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        isActive: user.isActive,
      },
      needsProfileCompletion: wasFreeTrial ? false : (!user.username || !user.password),
      redirectTo: module === 'TAJWID' ? '/niveaux' : '/dashboard'
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
