import { NextRequest, NextResponse } from 'next/server';
import { getAuthUserFromRequest } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUserFromRequest(request);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    const userData = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        completedPages: true,
        completedQuizzes: true,
      },
    });

    console.log('Progress loaded from DB:', userData);
    return NextResponse.json({
      completedPages: userData?.completedPages || [],
      completedQuizzes: userData?.completedQuizzes || [],
    });
  } catch (error) {
    console.error('Get progress error:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('💾 [API] POST /api/auth/progress - Sauvegarde de la progression');
    
    if (!user) {
      return NextResponse.json(
        { error: 'Non autorisé' },
      console.log('❌ [API] PROGRESS - Utilisateur non authentifié');
      );
    }

    console.log('👤 [API] PROGRESS - Utilisateur authentifié:', user.id);

    console.log('📊 [API] PROGRESS - Demande de mise à jour:', { pageNumber, quizNumber, action, userId: user.id });
    
    if (pageNumber !== undefined) {
      const currentUser = await prisma.user.findUnique({
        where: { id: user.id },
        select: { completedPages: true },
      });

      let updatedPages = currentUser?.completedPages || [];

      if (action === 'add' && !updatedPages.includes(pageNumber)) {
        updatedPages.push(pageNumber);
        console.log(`➕ [API] PROGRESS - Ajout page ${pageNumber}`);
      } else if (action === 'remove') {
        updatedPages = updatedPages.filter((p: any) => p !== pageNumber);
        console.log(`➖ [API] PROGRESS - Suppression page ${pageNumber}`);
      }

      console.log('📚 [API] PROGRESS - Mise à jour pages:', { 
        before: currentUser?.completedPages, 
        after: updatedPages,
        pageNumber,
        action 
      });
      
      await prisma.user.update({
        where: { id: user.id },
        data: { completedPages: updatedPages },
      });

      return NextResponse.json({ 
        success: true, 
        completedPages: updatedPages 
      });
    }

    if (quizNumber !== undefined) {
      const currentUser = await prisma.user.findUnique({
        where: { id: user.id },
        select: { completedQuizzes: true },
      });

      let updatedQuizzes = currentUser?.completedQuizzes || [];

      if (action === 'add' && !updatedQuizzes.includes(quizNumber)) {
        updatedQuizzes.push(quizNumber);
        console.log(`➕ [API] PROGRESS - Ajout quiz ${quizNumber}`);
      } else if (action === 'remove') {
        updatedQuizzes = updatedQuizzes.filter((q: any) => q !== quizNumber);
        console.log(`➖ [API] PROGRESS - Suppression quiz ${quizNumber}`);
      }

      console.log('🏆 [API] PROGRESS - Mise à jour quiz:', { 
        before: currentUser?.completedQuizzes, 
        after: updatedQuizzes,
        quizNumber,
        action 
      });
      
      await prisma.user.update({
        where: { id: user.id },
        data: { completedQuizzes: updatedQuizzes },
      });

      return NextResponse.json({ 
        success: true, 
        completedQuizzes: updatedQuizzes 
      });
    }

    return NextResponse.json(
      { error: 'Paramètres invalides' },
      { status: 400 }
    );
  } catch (error) {
    console.error('❌ [API] PROGRESS - Erreur mise à jour:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}