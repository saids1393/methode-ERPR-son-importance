import { NextRequest, NextResponse } from 'next/server';
import { getAuthUserFromRequest } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUserFromRequest(request);
    
    if (!user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    // Récupérer le plan actuel depuis la base de données
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { subscriptionPlan: true }
    });

    return NextResponse.json({
      subscriptionPlan: dbUser?.subscriptionPlan || null,
    });
  } catch (error) {
    console.error('Erreur check-coaching:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
