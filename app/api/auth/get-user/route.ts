// app/api/auth/get-user/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { getAuthUserFromRequest } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    // Récupérer l'utilisateur depuis le token (votre lib custom)
    const user = await getAuthUserFromRequest(req);

    if (!user) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    // Récupérer les infos complètes incluant trialExpired
    const completeUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        email: true,
        username: true,
        gender: true,
        isActive: true,
        accountType: true,
        trialExpired: true,
      },
    });

    if (!completeUser) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        user: completeUser,
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}