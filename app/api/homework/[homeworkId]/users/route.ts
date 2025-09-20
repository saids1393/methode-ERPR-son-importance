//app/api/homework/[homeworkId]/users/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { prisma } from '@/lib/prisma';

// GET - Récupérer les utilisateurs qui ont reçu un devoir spécifique
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ homeworkId: string }> }
) {
  try {
    await requireAdmin(request);
    const { homeworkId } = await params;

    // Récupérer le devoir avec ses envois
    const homework = await prisma.homework.findUnique({
      where: { id: homeworkId },
      include: {
        homeworkSends: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                username: true,
                gender: true,
                completedPages: true,
                completedQuizzes: true,
                studyTimeSeconds: true,
                isActive: true,
                stripeCustomerId: true,
                createdAt: true,
              }
            }
          },
          orderBy: { sentAt: 'desc' }
        }
      }
    });

    if (!homework) {
      return NextResponse.json(
        { error: 'Devoir non trouvé' },
        { status: 404 }
      );
    }

    // Enrichir les données utilisateur
    const enrichedSends = homework.homeworkSends.map(send => {
      const user = send.user;
      const completedPagesCount = user.completedPages.filter(p => p !== 0 && p !== 30).length;
      const completedQuizzesCount = user.completedQuizzes.filter(q => q !== 11).length;
      const totalPossibleItems = 29 + 11;
      const progressPercentage = Math.round(
        ((completedPagesCount + completedQuizzesCount) / totalPossibleItems) * 100
      );

      const formatStudyTime = (seconds: number): string => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        
        if (hours > 0) {
          return `${hours}h ${minutes}min`;
        }
        if (minutes > 0) {
          return `${minutes}min`;
        }
        return `${seconds}s`;
      };

      return {
        id: send.id,
        sentAt: send.sentAt.toISOString(),
        emailSent: send.emailSent,
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          gender: user.gender,
          completedPagesCount,
          completedQuizzesCount,
          progressPercentage,
          studyTimeFormatted: formatStudyTime(user.studyTimeSeconds),
          isActive: user.isActive,
          isPaid: !!user.stripeCustomerId,
          createdAt: user.createdAt.toISOString(),
        }
      };
    });

    // Calculer les statistiques
    const stats = {
      totalSends: homework.homeworkSends.length,
      successfulSends: homework.homeworkSends.filter(s => s.emailSent).length,
      failedSends: homework.homeworkSends.filter(s => !s.emailSent).length,
      successRate: homework.homeworkSends.length > 0 
        ? Math.round((homework.homeworkSends.filter(s => s.emailSent).length / homework.homeworkSends.length) * 100)
        : 0
    };

    return NextResponse.json({
      id: homework.id,
      chapterId: homework.chapterId,
      title: homework.title,
      content: homework.content,
      createdAt: homework.createdAt.toISOString(),
      sends: enrichedSends,
      stats
    });
  } catch (error) {
    console.error('Get homework users error:', error);
    return NextResponse.json(
      { error: 'Erreur lors du chargement des utilisateurs' },
      { status: 500 }
    );
  }
}