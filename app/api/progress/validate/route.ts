//app/api/progress/validate/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getAuthUserFromRequest } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

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

    console.log('🎯 [API] VALIDATION AUTO - Données reçues:', { pageNumber, quizNumber, chapterNumber, userId: user.id });

    if (pageNumber !== undefined) {
      // Exclure les pages spéciales
      if (pageNumber === 0 || pageNumber === 30) {
        return NextResponse.json({ success: false, message: 'Page exclue' });
      }

      const currentUser = await prisma.user.findUnique({
        where: { id: user.id },
        select: { completedPages: true },
      });

      let updatedPages = currentUser?.completedPages || [];

      if (!updatedPages.includes(pageNumber)) {
        updatedPages.push(pageNumber);
        console.log(`✅ [API] VALIDATION AUTO - Ajout page ${pageNumber}`);
        
        await prisma.user.update({
          where: { id: user.id },
          data: { completedPages: updatedPages },
        });

        return NextResponse.json({ 
          success: true, 
          type: 'page',
          pageNumber,
          completedPages: updatedPages,
          message: `Page ${pageNumber} validée automatiquement`
        });
      }
    }

    if (quizNumber !== undefined) {
      // Exclure le chapitre 11
      if (quizNumber === 11) {
        return NextResponse.json({ success: false, message: 'Quiz exclu' });
      }

      const currentUser = await prisma.user.findUnique({
        where: { id: user.id },
        select: { completedQuizzes: true },
      });

      let updatedQuizzes = currentUser?.completedQuizzes || [];

      if (!updatedQuizzes.includes(quizNumber)) {
        updatedQuizzes.push(quizNumber);
        console.log(`✅ [API] VALIDATION AUTO - Ajout quiz ${quizNumber}`);
        
        await prisma.user.update({
          where: { id: user.id },
          data: { completedQuizzes: updatedQuizzes },
        });

        return NextResponse.json({ 
          success: true, 
          type: 'quiz',
          quizNumber,
          completedQuizzes: updatedQuizzes,
          message: `Quiz ${quizNumber} validé automatiquement`
        });
      }
    }

    return NextResponse.json({ 
      success: false, 
      message: 'Déjà validé ou paramètres invalides' 
    });
  } catch (error) {
    console.error('❌ [API] VALIDATION AUTO - Erreur:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}