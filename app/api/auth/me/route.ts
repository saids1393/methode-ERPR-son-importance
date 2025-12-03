import { NextRequest, NextResponse } from 'next/server';
import { getAuthUserFromRequest } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUserFromRequest(request);

    if (!user || !user.isActive) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    // ⭐ OPTIMISÉ : Fetch seulement gender, password et accountType
    // Au lieu de refetcher tout l'user
    const userExtra = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        gender: true,
        password: true,
        accountType: true,
      },
    });

    // Récupérer les modules achetés
    const purchases = await prisma.levelPurchase.findMany({
      where: { userId: user.id },
      include: {
        level: {
          select: { module: true }
        }
      }
    });

    const modules = purchases.map(p => p.level.module);
    const hasLecture = modules.includes('LECTURE');
    const hasTajwid = modules.includes('TAJWID');

    return NextResponse.json({
      id: user.id,
      email: user.email,
      username: user.username,
      gender: userExtra?.gender || null,
      isActive: user.isActive,
      hasPassword: userExtra?.password !== null,
      accountType: userExtra?.accountType || 'PAID_FULL',
      modules,
      hasLecture,
      hasTajwid
    });
  } catch (error) {
    console.error('Auth me error:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}