import { NextRequest, NextResponse } from 'next/server';
import { getAuthUserFromRequest } from '@/lib/auth';
import { checkAndSendHomework } from '@/lib/homework-email';

// POST - Déclencher l'envoi d'un devoir pour un chapitre
export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUserFromRequest(request);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    const { chapterNumber } = await request.json();

    if (typeof chapterNumber !== 'number' || chapterNumber < 0 || chapterNumber > 11) {
      return NextResponse.json(
        { error: 'Numéro de chapitre invalide' },
        { status: 400 }
      );
    }

    console.log(`📝 Demande d'envoi de devoir pour utilisateur ${user.id}, chapitre ${chapterNumber}`);

    // Vérifier et envoyer le devoir
    const sent = await checkAndSendHomework(user.id, chapterNumber);

    console.log(`📧 Résultat envoi devoir chapitre ${chapterNumber}:`, sent);
    return NextResponse.json({
      success: true,
      sent,
      message: sent 
        ? `Devoir du chapitre ${chapterNumber} envoyé avec succès`
        : `Aucun devoir à envoyer pour le chapitre ${chapterNumber}`
    });
  } catch (error) {
    console.error('Send homework error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'envoi du devoir' },
      { status: 500 }
    );
  }
}