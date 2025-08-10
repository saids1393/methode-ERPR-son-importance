import { NextRequest, NextResponse } from 'next/server';
import { getAuthUserFromRequest } from '@/lib/auth';
import { checkAndSendHomework } from '@/lib/homework-email';
import { prisma } from '@/lib/prisma';

// Variable pour stocker les requêtes en cours par utilisateur
const processingRequests = new Map<string, boolean>();

// POST - Déclencher l'envoi d'un devoir pour un chapitre
export async function POST(request: NextRequest) {
  let userId: string | null = null;
  let chapterNumber: number | null = null;

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

    userId = user.id;

    const body = await request.json();
    chapterNumber = body.chapterNumber;

    if (typeof chapterNumber !== 'number' || chapterNumber < 0 || chapterNumber > 11) {
      console.log(`❌ [API] Numéro de chapitre invalide:`, chapterNumber);
      return NextResponse.json(
        { error: 'Numéro de chapitre invalide' },
        { status: 400 }
      );
    }

    // PROTECTION CONTRE LES REQUÊTES SIMULTANÉES
    const requestKey = `${userId}-${chapterNumber}`;

    if (processingRequests.get(requestKey)) {
      console.log(`⚠️ [API] Requête déjà en cours pour ${requestKey}`);
      return NextResponse.json({
        success: true,
        sent: false,
        message: `Traitement déjà en cours pour le chapitre ${chapterNumber}`
      });
    }

    // Marquer la requête comme en cours
    processingRequests.set(requestKey, true);

    console.log(`📝 [API] Demande d'envoi de devoir pour utilisateur ${userId}, chapitre ${chapterNumber}`);

    // VÉRIFICATION PRÉALABLE RENFORCÉE : Éviter les appels multiples
    console.log(`🔍 [API] VÉRIFICATION PRÉALABLE - Recherche envoi existant...`);

    const existingCheck = await prisma.homeworkSend.findFirst({
      where: {
        userId: userId,
        homework: {
          chapterId: chapterNumber
        }
      }
    });

    if (existingCheck) {
      console.log(`🚫 [API] Devoir déjà envoyé - ID: ${existingCheck.id}`);
      console.log(`📝 [API] ===== FIN ENVOI DEVOIR (DOUBLON DÉTECTÉ) =====`);

      // Libérer le verrou
      processingRequests.delete(requestKey);

      return NextResponse.json({
        success: true,
        sent: false,
        message: `Devoir du chapitre ${chapterNumber} déjà envoyé`,
        alreadySent: true
      });
    }

    console.log(`✅ [API] Aucun envoi existant trouvé - Poursuite du traitement`);

    // Vérifier et envoyer le devoir
    const sent = await checkAndSendHomework(userId, chapterNumber);

    console.log(`📧 [API] Résultat envoi devoir chapitre ${chapterNumber}:`, sent);
    console.log(`📝 [API] ===== FIN ENVOI DEVOIR =====`);

    // Libérer le verrou
    processingRequests.delete(requestKey);

    return NextResponse.json({
      success: true,
      sent,
      message: sent 
        ? `Devoir du chapitre ${chapterNumber} envoyé avec succès`
        : `Aucun devoir à envoyer pour le chapitre ${chapterNumber}`,
      alreadySent: false
    });

  } catch (error) {
    console.error('❌ [API] Send homework error:', error);

    // Libérer le verrou en cas d'erreur
    if (userId !== null && chapterNumber !== null) {
      const requestKey = `${userId}-${chapterNumber}`;
      processingRequests.delete(requestKey);
    }

    return NextResponse.json(
      { error: 'Erreur lors de l\'envoi du devoir' },
      { status: 500 }
    );
  }
}
