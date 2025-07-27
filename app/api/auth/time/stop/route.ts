import { NextRequest, NextResponse } from 'next/server';
import { getAuthUserFromRequest } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    console.log('⏹️ [API] ===== ARRÊT CHRONO =====');
    
    const user = await getAuthUserFromRequest(request);
    
    if (!user) {
      console.log('❌ [API] UTILISATEUR NON AUTHENTIFIÉ');
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    console.log('👤 [API] UTILISATEUR AUTHENTIFIÉ:', user.id);

    // Récupérer l'utilisateur avec l'heure de début
    const userData = await prisma.user.findUnique({
      where: { id: user.id },
      select: { 
        studyTimeSeconds: true,
        updatedAt: true // Notre marqueur temporaire
      },
    });

    if (!userData) {
      console.log('❌ [API] UTILISATEUR NON TROUVÉ');
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    // Calculer le temps écoulé
    const endTime = new Date();
    const startTime = userData.updatedAt;
    const sessionSeconds = Math.floor((endTime.getTime() - startTime.getTime()) / 1000);
    
    console.log('📊 [API] TEMPS DE SESSION:', sessionSeconds, 'secondes');
    console.log('📊 [API] TEMPS ACTUEL EN DB:', userData.studyTimeSeconds);

    // Ajouter le temps de session au total
    const newTotalTime = userData.studyTimeSeconds + sessionSeconds;
    
    console.log('📊 [API] NOUVEAU TEMPS TOTAL:', newTotalTime);

    // Mettre à jour en DB
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { studyTimeSeconds: newTotalTime },
      select: { studyTimeSeconds: true },
    });

    console.log('✅ [API] CHRONO ARRÊTÉ ET TEMPS SAUVEGARDÉ:', updatedUser.studyTimeSeconds);

    return NextResponse.json({ 
      success: true, 
      sessionSeconds,
      totalSeconds: updatedUser.studyTimeSeconds,
      message: 'Chrono arrêté et sauvegardé'
    });
  } catch (error) {
    console.error('❌ [API] ERREUR STOP CHRONO:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}