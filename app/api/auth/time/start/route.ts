import { NextRequest, NextResponse } from 'next/server';
import { getAuthUserFromRequest } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 [API] ===== DÉMARRAGE CHRONO =====');
    
    const user = await getAuthUserFromRequest(request);
    
    if (!user) {
      console.log('❌ [API] UTILISATEUR NON AUTHENTIFIÉ');
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    console.log('👤 [API] UTILISATEUR AUTHENTIFIÉ:', user.id);

    // Enregistrer l'heure de début dans la DB
    const startTime = new Date();
    console.log('⏰ [API] HEURE DE DÉBUT:', startTime.toISOString());

    // Ajouter un champ pour l'heure de début (on va l'ajouter au schéma)
    // Pour l'instant, on utilise un champ temporaire
    await prisma.user.update({
      where: { id: user.id },
      data: { 
        updatedAt: startTime // On utilise updatedAt comme marqueur temporaire
      },
    });

    console.log('✅ [API] CHRONO DÉMARRÉ ET ENREGISTRÉ EN DB');

    return NextResponse.json({ 
      success: true, 
      startTime: startTime.toISOString(),
      message: 'Chrono démarré'
    });
  } catch (error) {
    console.error('❌ [API] ERREUR START CHRONO:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}