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
    const user = await getAuthUserFromRequest(request);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    const { pageNumber, quizNumber, action } = await request.json();

    if (pageNumber !== undefined) {
      const currentUser = await prisma.user.findUnique({
        where: { id: user.id },
        select: { completedPages: true },
      });

      let updatedPages = currentUser?.completedPages || [];

      if (action === 'add' && !updatedPages.includes(pageNumber)) {
        updatedPages.push(pageNumber);
      } else if (action === 'remove') {
        updatedPages = updatedPages.filter((p: any) => p !== pageNumber);
      }

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
      } else if (action === 'remove') {
        updatedQuizzes = updatedQuizzes.filter((q: any) => q !== quizNumber);
      }

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
    console.error('Update progress error:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}