import { NextRequest, NextResponse } from 'next/server';
import { getAuthUserFromRequest } from '@/lib/auth';
import { checkAndSendHomework } from '@/lib/homework-email';

// POST - Déclencher l'envoi d'un devoir pour un chapitre
export async function POST(request: NextRequest) {
  try {
    console.log(`📝 [API] ===== DÉBUT ENVOI DEVOIR =====`);
    
    const user = await getAuthUserFromRequest(request);
    
    if (!user) {
      console.log(`❌ [API] Utilisateur non authentifié`);
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    const { chapterNumber } = await request.json();

    if (typeof chapterNumber !== 'number' || chapterNumber < 0 || chapterNumber > 11) {
      console.log(`❌ [API] Numéro de chapitre invalide:`, chapterNumber);
      return NextResponse.json(
        { error: 'Numéro de chapitre invalide' },
        { status: 400 }
      );
    }

    console.log(`📝 [API] Demande d'envoi de devoir pour utilisateur ${user.id}, chapitre ${chapterNumber}`);

    // VÉRIFICATION PRÉALABLE RENFORCÉE : Éviter les appels multiples
    console.log(`🔍 [API] VÉRIFICATION PRÉALABLE - Recherche envoi existant...`);
    const existingCheck = await prisma.homeworkSend.findFirst({
      where: {
        userId: user.id,
        homework: {
          chapterId: chapterNumber
        }
      }
    });

    if (existingCheck) {
      console.log(`🚫 [API] Devoir déjà envoyé - ID: ${existingCheck.id}`);
      console.log(`📝 [API] ===== FIN ENVOI DEVOIR (DOUBLON DÉTECTÉ) =====`);
      return NextResponse.json({
        success: true,
        sent: false,
        message: `Devoir du chapitre ${chapterNumber} déjà envoyé`
      });
    }
    
    console.log(`✅ [API] Aucun envoi existant trouvé - Poursuite du traitement`);

    // Vérifier et envoyer le devoir
    const sent = await checkAndSendHomework(user.id, chapterNumber);

    console.log(`📧 [API] Résultat envoi devoir chapitre ${chapterNumber}:`, sent);
    console.log(`📝 [API] ===== FIN ENVOI DEVOIR =====`);
    
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