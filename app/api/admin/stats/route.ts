import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin-auth';

export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request);

    // Statistiques générales
    const totalUsers = await prisma.user.count();
    const activeUsers = await prisma.user.count({
      where: { isActive: true }
    });
    const paidUsers = await prisma.user.count({
      where: { 
        isActive: true,
        stripeCustomerId: { not: null }
      }
    });

    // Statistiques de progression
    const usersWithProgress = await prisma.user.findMany({
      where: { isActive: true },
      select: {
        completedPages: true,
        completedQuizzes: true,
        studyTimeSeconds: true,
      }
    });

    // Calculs de progression
    const totalPossiblePages = 29; // Pages 1-29 (excluant 0 et 30)
    const totalPossibleQuizzes = 11; // Chapitres 0-10

    let totalCompletedPages = 0;
    let totalCompletedQuizzes = 0;
    let totalStudyTime = 0;
    let usersWithFullCompletion = 0;

    usersWithProgress.forEach(user => {
      const completedPages = user.completedPages.filter(p => p !== 0 && p !== 30).length;
      const completedQuizzes = user.completedQuizzes.filter(q => q !== 11).length;
      
      totalCompletedPages += completedPages;
      totalCompletedQuizzes += completedQuizzes;
      totalStudyTime += user.studyTimeSeconds;

      if (completedPages === totalPossiblePages && completedQuizzes === totalPossibleQuizzes) {
        usersWithFullCompletion++;
      }
    });

    const avgCompletedPages = activeUsers > 0 ? Math.round(totalCompletedPages / activeUsers) : 0;
    const avgCompletedQuizzes = activeUsers > 0 ? Math.round(totalCompletedQuizzes / activeUsers) : 0;
    const avgStudyTime = activeUsers > 0 ? Math.round(totalStudyTime / activeUsers) : 0;

    // Utilisateurs récents (7 derniers jours)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentUsers = await prisma.user.count({
      where: {
        createdAt: { gte: sevenDaysAgo }
      }
    });

    // Top utilisateurs par temps d'étude
    const topStudyUsers = await prisma.user.findMany({
      where: { 
        isActive: true,
        studyTimeSeconds: { gt: 0 }
      },
      select: {
        email: true,
        username: true,
        studyTimeSeconds: true,
        completedPages: true,
        completedQuizzes: true,
      },
      orderBy: { studyTimeSeconds: 'desc' },
      take: 10
    });

    return NextResponse.json({
      overview: {
        totalUsers,
        activeUsers,
        paidUsers,
        recentUsers,
        usersWithFullCompletion,
        completionRate: activeUsers > 0 ? Math.round((usersWithFullCompletion / activeUsers) * 100) : 0
      },
      progress: {
        avgCompletedPages,
        avgCompletedQuizzes,
        avgStudyTime,
        totalStudyTime,
        totalPossiblePages,
        totalPossibleQuizzes
      },
      topUsers: topStudyUsers.map(user => ({
        email: user.email,
        username: user.username,
        studyTimeSeconds: user.studyTimeSeconds,
        completedPages: user.completedPages.filter(p => p !== 0 && p !== 30).length,
        completedQuizzes: user.completedQuizzes.filter(q => q !== 11).length,
        progressPercentage: Math.round(
          ((user.completedPages.filter(p => p !== 0 && p !== 30).length + 
            user.completedQuizzes.filter(q => q !== 11).length) / 
           (totalPossiblePages + totalPossibleQuizzes)) * 100
        )
      }))
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    return NextResponse.json(
      { error: 'Accès non autorisé' },
      { status: 403 }
    );
  }
}