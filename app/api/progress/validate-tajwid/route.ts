import { NextRequest, NextResponse } from 'next/server';
import { getAuthUserFromRequest } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { chaptersTajwid } from '@/lib/chapters-tajwid';
import { logPageCompletionTajwid, logQuizCompletionTajwid } from '@/lib/progressTracking';

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUserFromRequest(request);

    if (!user) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    const { pageNumber, quizNumber, chapterNumber, action = 'add' } = await request.json();

    console.log('🎯 [API TAJWID] VALIDATION - Données reçues:', { pageNumber, quizNumber, chapterNumber, action, userId: user.id });

    if (pageNumber !== undefined) {
      const currentUser = await prisma.user.findUnique({
        where: { id: user.id },
        select: { completedPagesTajwid: true, completedQuizzesTajwid: true },
      });

      let updatedPages = currentUser?.completedPagesTajwid || [];

      if (action === 'remove') {
        // Supprimer la page de la progression
        updatedPages = updatedPages.filter((p: number) => p !== pageNumber);
        console.log(`➖ [API TAJWID] Suppression page ${pageNumber}`);

        await prisma.user.update({
          where: { id: user.id },
          data: { completedPagesTajwid: updatedPages },
        });

        const response = NextResponse.json({
          success: true,
          type: 'page',
          action: 'remove',
          pageNumber,
          completedPagesTajwid: updatedPages,
          completedQuizzesTajwid: currentUser?.completedQuizzesTajwid || [],
          message: `Page Tajwid ${pageNumber} retirée de la progression`
        });

        response.headers.set('X-Progress-Update', 'true');
        return response;
      } else if (!updatedPages.includes(pageNumber)) {
        // Ajouter la page à la progression
        updatedPages.push(pageNumber);
        console.log(`✅ [API TAJWID] Ajout page ${pageNumber}`);

        await prisma.user.update({
          where: { id: user.id },
          data: { completedPagesTajwid: updatedPages },
        });

        // Enregistrer dans le tracking pour les graphiques
        try {
          await logPageCompletionTajwid(user.id, pageNumber, chapterNumber || 0);
        } catch (trackingError) {
          console.error('⚠️ [API TAJWID] Erreur tracking (non bloquante):', trackingError);
        }

        const response = NextResponse.json({
          success: true,
          type: 'page',
          action: 'add',
          pageNumber,
          completedPagesTajwid: updatedPages,
          completedQuizzesTajwid: currentUser?.completedQuizzesTajwid || [],
          message: `Page Tajwid ${pageNumber} validée`
        });

        response.headers.set('X-Progress-Update', 'true');
        return response;
      }
    }

    if (quizNumber !== undefined) {
      const currentUser = await prisma.user.findUnique({
        where: { id: user.id },
        select: { completedPagesTajwid: true, completedQuizzesTajwid: true },
      });

      let updatedQuizzes = currentUser?.completedQuizzesTajwid || [];

      if (action === 'remove') {
        // Supprimer le quiz de la progression
        updatedQuizzes = updatedQuizzes.filter((q: number) => q !== quizNumber);
        console.log(`➖ [API TAJWID] Suppression quiz ${quizNumber}`);

        await prisma.user.update({
          where: { id: user.id },
          data: { completedQuizzesTajwid: updatedQuizzes },
        });

        const response = NextResponse.json({
          success: true,
          type: 'quiz',
          action: 'remove',
          quizNumber,
          completedPagesTajwid: currentUser?.completedPagesTajwid || [],
          completedQuizzesTajwid: updatedQuizzes,
          message: `Quiz Tajwid ${quizNumber} retiré de la progression`
        });

        response.headers.set('X-Progress-Update', 'true');
        return response;
      } else if (!updatedQuizzes.includes(quizNumber)) {
        // Ajouter le quiz à la progression
        updatedQuizzes.push(quizNumber);
        console.log(`✅ [API TAJWID] Ajout quiz ${quizNumber}`);

        await prisma.user.update({
          where: { id: user.id },
          data: { completedQuizzesTajwid: updatedQuizzes },
        });

        // Enregistrer dans le tracking pour les graphiques
        try {
          await logQuizCompletionTajwid(user.id, quizNumber);
        } catch (trackingError) {
          console.error('⚠️ [API TAJWID] Erreur tracking quiz (non bloquante):', trackingError);
        }

        const response = NextResponse.json({
          success: true,
          type: 'quiz',
          action: 'add',
          quizNumber,
          completedPagesTajwid: currentUser?.completedPagesTajwid || [],
          completedQuizzesTajwid: updatedQuizzes,
          message: `Quiz Tajwid ${quizNumber} validé`
        });

        response.headers.set('X-Progress-Update', 'true');
        return response;
      }
    }

    return NextResponse.json({
      success: false,
      message: 'Déjà validé ou paramètres invalides'
    });
  } catch (error) {
    console.error('❌ [API TAJWID] VALIDATION - Erreur:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
