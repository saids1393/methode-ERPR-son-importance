import { NextRequest, NextResponse } from 'next/server';
import { getAuthUserFromRequest } from '@/lib/auth';
import { checkAndSendTajwidHomework } from '@/lib/homework-email';

export async function POST(request: NextRequest) {
  try {
    console.log('📧 [API] ===== DÉBUT ENVOI DEVOIR TAJWID =====');

    const user = await getAuthUserFromRequest(request);
    if (!user) {
      console.log('❌ [API] Utilisateur non authentifié');
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    console.log('👤 [API] Utilisateur authentifié:', user.id);

    const { chapterNumber } = await request.json();

    if (typeof chapterNumber !== 'number' || chapterNumber < 1) {
      console.log('❌ [API] Numéro de chapitre invalide:', chapterNumber);
      return NextResponse.json(
        { error: 'Numéro de chapitre invalide' },
        { status: 400 }
      );
    }

    console.log('📚 [API] Tentative d\'envoi devoir Tajwid pour chapitre:', chapterNumber);

    const sent = await checkAndSendTajwidHomework(user.id, chapterNumber);

    console.log('📧 [API] Résultat envoi devoir Tajwid:', sent);
    console.log('📧 [API] ===== FIN ENVOI DEVOIR TAJWID =====');

    return NextResponse.json({
      success: true,
      sent,
      message: sent
        ? `Devoir Tajwid du chapitre ${chapterNumber} envoyé avec succès`
        : `Devoir Tajwid du chapitre ${chapterNumber} non envoyé (déjà envoyé ou inexistant)`
    });
  } catch (error) {
    console.error('❌ [API] Erreur envoi devoir Tajwid:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'envoi du devoir Tajwid' },
      { status: 500 }
    );
  }
}
