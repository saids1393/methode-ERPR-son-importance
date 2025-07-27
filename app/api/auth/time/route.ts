import { NextRequest, NextResponse } from 'next/server';
import { getAuthUserFromRequest } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    console.log('📥 [API] GET /api/auth/time - Récupération du temps');
    
    const user = await getAuthUserFromRequest(request);
    
    if (!user) {
      console.log('❌ [API] Utilisateur non authentifié');
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    console.log('👤 [API] Utilisateur authentifié:', user.id);

    const userData = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        studyTimeSeconds: true,
      },
    });

    const timeSeconds = userData?.studyTimeSeconds || 0;
    console.log('✅ [API] Temps récupéré:', timeSeconds, 'secondes pour user', user.id);

    return NextResponse.json({
      studyTimeSeconds: timeSeconds,
    });
  } catch (error) {
    console.error('❌ [API] Erreur GET time:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('💾 [API] POST /api/auth/time - Sauvegarde du temps');
    
    const user = await getAuthUserFromRequest(request);
    
    if (!user) {
      console.log('❌ [API] Utilisateur non authentifié');
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    console.log('👤 [API] Utilisateur authentifié:', user.id);

    const { timeToAdd } = await request.json();

    console.log('⏱️ [API] Temps à ajouter:', timeToAdd, 'secondes');

    if (typeof timeToAdd !== 'number' || timeToAdd < 0) {
      console.log('❌ [API] Valeur de temps invalide:', timeToAdd);
      return NextResponse.json(
        { error: 'Temps invalide' },
        { status: 400 }
      );
    }

    const currentUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { studyTimeSeconds: true },
    });

    const currentTime = currentUser?.studyTimeSeconds || 0;
    const newTime = currentTime + timeToAdd;

    console.log('📊 [API] Calcul:', currentTime, '+', timeToAdd, '=', newTime);

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { studyTimeSeconds: newTime },
      select: { studyTimeSeconds: true },
    });

    console.log('✅ [API] Temps sauvegardé en DB:', updatedUser.studyTimeSeconds);

    return NextResponse.json({ 
      success: true, 
      studyTimeSeconds: updatedUser.studyTimeSeconds 
    });
  } catch (error) {
    console.error('❌ [API] Erreur POST time:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}