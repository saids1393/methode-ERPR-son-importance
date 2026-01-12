import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { prisma } from '@/lib/prisma';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-secret');

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    // Vérifier le token JWT
    let payload;
    try {
      const verified = await jwtVerify(token, JWT_SECRET);
      payload = verified.payload;
    } catch (error) {
      return NextResponse.json(
        { error: 'Token invalide ou expiré' },
        { status: 401 }
      );
    }

    if (!payload?.userId) {
      return NextResponse.json(
        { error: 'Token invalide' },
        { status: 401 }
      );
    }

    // Récupérer l'utilisateur depuis la base de données
    const user = await prisma.user.findUnique({
      where: { id: payload.userId as string },
      select: {
        id: true,
        email: true,
        username: true,
        gender: true,
        isActive: true,
        accountType: true,
        subscriptionPlan: true,
        subscriptionStartDate: true,
        subscriptionEndDate: true,
        stripeCustomerId: true,
        completedPages: true,
        completedQuizzes: true,
        completedPagesTajwid: true,
        completedQuizzesTajwid: true,
        studyTimeSeconds: true,
        createdAt: true,
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    // Vérifier si l'abonnement est actif
    const hasActiveSubscription = checkActiveSubscription(user);
    
    // Si l'utilisateur a un abonnement actif, il a accès à tous les modules
    const hasLecture = hasActiveSubscription;
    const hasTajwid = hasActiveSubscription;

    return NextResponse.json({
      ...user,
      hasActiveSubscription,
      hasLecture,
      hasTajwid,
    });

  } catch (error: any) {
    console.error('Auth me error:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

function checkActiveSubscription(user: {
  accountType: string;
  subscriptionEndDate: Date | null;
}): boolean {
  // Liste des types de compte qui ont accès
  const activeAccountTypes = ['ACTIVE', 'PAID', 'PAID_FULL', 'PAID_LEGACY', 'FREE_TRIAL'];
  
  if (activeAccountTypes.includes(user.accountType)) {
    // Si date de fin définie, vérifier qu'elle n'est pas expirée
    if (user.subscriptionEndDate) {
      return new Date(user.subscriptionEndDate) > new Date();
    }
    // Pas de date de fin = accès illimité
    return true;
  }

  // Compte annulé mais encore dans la période payée
  if (user.accountType === 'CANCELLED' && user.subscriptionEndDate) {
    return new Date(user.subscriptionEndDate) > new Date();
  }

  return false;
}