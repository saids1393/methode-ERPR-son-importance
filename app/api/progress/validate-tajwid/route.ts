import { NextRequest, NextResponse } from 'next/server';
import { getAuthUserFromRequest } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { checkAndSendTajwidHomework } from '@/lib/homework-email';
import { chaptersTajwid } from '@/lib/chapters-tajwid';

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUserFromRequest(request);

    if (!user) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    const { pageNumber, quizNumber, chapterNumber } = await request.json();

    console.log('🎯 [API TAJWID] VALIDATION AUTO - Données reçues:', { pageNumber, quizNumber, chapterNumber, userId: user.id });

    if (pageNumber !== undefined) {
      const currentUser = await prisma.user.findUnique({
        where: { id: user.id },
        select: { completedPagesTajwid: true, completedQuizzesTajwid: true },
      });

      let updatedPages = currentUser?.completedPagesTajwid || [];

      if (!updatedPages.includes(pageNumber)) {
        updatedPages.push(pageNumber);
        console.log(`✅ [API TAJWID] VALIDATION AUTO - Ajout page ${pageNumber}`);

        await prisma.user.update({
          where: { id: user.id },
          data: { completedPagesTajwid: updatedPages },
        });

        const response = NextResponse.json({
          success: true,
          type: 'page',
          pageNumber,
          completedPagesTajwid: updatedPages,
          message: `Page Tajwid ${pageNumber} validée automatiquement`
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
      let completedPages = currentUser?.completedPagesTajwid || [];

      if (!updatedQuizzes.includes(quizNumber)) {
        updatedQuizzes.push(quizNumber);
        console.log(`✅ [API TAJWID] VALIDATION AUTO - Ajout quiz ${quizNumber}`);

        await prisma.user.update({
          where: { id: user.id },
          data: { completedQuizzesTajwid: updatedQuizzes },
        });

        console.log(`📊 [API TAJWID] Vérification de complétion du chapitre ${quizNumber}`);

        const chapter = chaptersTajwid.find(c => c.chapterNumber === quizNumber);

        if (chapter) {
          const allPagesOfChapter = chapter.pages.map(p => p.pageNumber);
          const allPagesCompleted = allPagesOfChapter.every(pageNum =>
            completedPages.includes(pageNum)
          );

          if (allPagesCompleted) {
            console.log(`🎉 [API TAJWID] Chapitre ${quizNumber} terminé! Envoi du devoir...`);

            try {
              const homeworkSent = await checkAndSendTajwidHomework(user.id, quizNumber);

              if (homeworkSent) {
                console.log(`📧 [API TAJWID] Devoir Tajwid du chapitre ${quizNumber} envoyé avec succès!`);
              } else {
                console.log(`⚠️ [API TAJWID] Devoir Tajwid du chapitre ${quizNumber} non envoyé (déjà envoyé ou inexistant)`);
              }
            } catch (homeworkError) {
              console.error(`❌ [API TAJWID] Erreur envoi devoir chapitre ${quizNumber}:`, homeworkError);
            }
          } else {
            const missingPages = allPagesOfChapter.filter(p => !completedPages.includes(p));
            console.log(`⏳ [API TAJWID] Chapitre ${quizNumber} pas encore terminé. Pages manquantes:`, missingPages);
          }
        }

        const response = NextResponse.json({
          success: true,
          type: 'quiz',
          quizNumber,
          completedQuizzesTajwid: updatedQuizzes,
          message: `Quiz Tajwid ${quizNumber} validé automatiquement`
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
    console.error('❌ [API TAJWID] VALIDATION AUTO - Erreur:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
