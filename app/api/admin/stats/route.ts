import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin-auth';

type UserWithProgress = {
  id: string;
  email: string;
  username: string | null;
  gender: string | null;
  completedPages: number[];
  completedQuizzes: number[];
  studyTimeSeconds: number;
  stripeCustomerId: string | null;
  createdAt: Date;
};

export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request);

    // Statistiques générales
    const [totalUsers, activeUsers, paidUsers, recentUsers] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { isActive: true } }),
      prisma.user.count({
        where: {
          isActive: true,
          stripeCustomerId: { not: null }
        }
      }),
      prisma.user.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          }
        }
      })
    ]);

    // Statistiques de progression détaillées
    const usersWithProgress: UserWithProgress[] = await prisma.user.findMany({
      where: { isActive: true },
      select: {
        id: true,
        email: true,
        username: true,
        gender: true,
        completedPages: true,
        completedQuizzes: true,
        studyTimeSeconds: true,
        stripeCustomerId: true,
        createdAt: true
      }
    });

    // Calculs de progression
    const totalPossiblePages = 29;
    const totalPossibleQuizzes = 11;
    const totalPossibleItems = totalPossiblePages + totalPossibleQuizzes;

    let totalCompletedPages = 0;
    let totalCompletedQuizzes = 0;
    let totalStudyTime = 0;
    let usersWithFullCompletion = 0;
    let totalRevenue = paidUsers * 64.99;

    const userStats = usersWithProgress.map((user) => {
      const completedPages = user.completedPages.filter(p => p !== 0 && p !== 30).length;
      const completedQuizzes = user.completedQuizzes.filter(q => q !== 11).length;
      const progressPercentage = Math.round(
        ((completedPages + completedQuizzes) / totalPossibleItems) * 100
      );

      totalCompletedPages += completedPages;
      totalCompletedQuizzes += completedQuizzes;
      totalStudyTime += user.studyTimeSeconds;

      if (completedPages === totalPossiblePages && completedQuizzes === totalPossibleQuizzes) {
        usersWithFullCompletion++;
      }

      return {
        id: user.id,
        email: user.email,
        username: user.username,
        gender: user.gender,
        completedPages,
        completedQuizzes,
        progressPercentage,
        studyTimeSeconds: user.studyTimeSeconds,
        isPaid: !!user.stripeCustomerId,
        createdAt: user.createdAt
      };
    });

    const avgCompletedPages = activeUsers > 0 ? Math.round(totalCompletedPages / activeUsers) : 0;
    const avgCompletedQuizzes = activeUsers > 0 ? Math.round(totalCompletedQuizzes / activeUsers) : 0;
    const avgStudyTime = activeUsers > 0 ? Math.round(totalStudyTime / activeUsers) : 0;
    const completionRate = activeUsers > 0 ? Math.round((usersWithFullCompletion / activeUsers) * 100) : 0;
    const conversionRate = totalUsers > 0 ? Math.round((paidUsers / totalUsers) * 100) : 0;

    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const dailyStats = await generateDailyStats(thirtyDaysAgo);
    const weeklyStats = await generateWeeklyStats();

    const topStudyUsers = userStats
      .filter(u => u.studyTimeSeconds > 0)
      .sort((a, b) => b.studyTimeSeconds - a.studyTimeSeconds)
      .slice(0, 10);

    const topProgressUsers = [...userStats]
      .sort((a, b) => b.progressPercentage - a.progressPercentage)
      .slice(0, 10);

    const genderStats = {
      homme: userStats.filter(u => u.gender === 'HOMME').length,
      femme: userStats.filter(u => u.gender === 'FEMME').length,
      nonSpecifie: userStats.filter(u => !u.gender).length
    };

    const progressDistribution = {
      debutant: userStats.filter(u => u.progressPercentage < 25).length,
      intermediaire: userStats.filter(u => u.progressPercentage >= 25 && u.progressPercentage < 75).length,
      avance: userStats.filter(u => u.progressPercentage >= 75 && u.progressPercentage < 100).length,
      complete: userStats.filter(u => u.progressPercentage === 100).length
    };

    return NextResponse.json({
      overview: {
        totalUsers,
        activeUsers,
        paidUsers,
        recentUsers,
        usersWithFullCompletion,
        completionRate,
        conversionRate,
        totalRevenue: Math.round(totalRevenue * 100) / 100
      },
      progress: {
        avgCompletedPages,
        avgCompletedQuizzes,
        avgStudyTime,
        totalStudyTime,
        totalPossiblePages,
        totalPossibleQuizzes,
        progressDistribution
      },
      demographics: {
        genderStats,
        averageProgressByGender: {
          homme: genderStats.homme > 0
            ? Math.round(
                userStats.filter(u => u.gender === 'HOMME')
                  .reduce((sum, u) => sum + u.progressPercentage, 0) / genderStats.homme
              )
            : 0,
          femme: genderStats.femme > 0
            ? Math.round(
                userStats.filter(u => u.gender === 'FEMME')
                  .reduce((sum, u) => sum + u.progressPercentage, 0) / genderStats.femme
              )
            : 0
        }
      },
      topUsers: {
        byStudyTime: topStudyUsers.map(user => ({
          id: user.id,
          email: user.email,
          username: user.username,
          gender: user.gender,
          studyTimeSeconds: user.studyTimeSeconds,
          studyTimeFormatted: formatStudyTime(user.studyTimeSeconds),
          completedPages: user.completedPages,
          completedQuizzes: user.completedQuizzes,
          progressPercentage: user.progressPercentage,
          isPaid: !!user.stripeCustomerId
        })),
        byProgress: topProgressUsers.map(user => ({
          id: user.id,
          email: user.email,
          username: user.username,
          gender: user.gender,
          progressPercentage: user.progressPercentage,
          completedPages: user.completedPages,
          completedQuizzes: user.completedQuizzes,
          studyTimeSeconds: user.studyTimeSeconds,
          isPaid: !!user.stripeCustomerId
        }))
      },
      chartData: {
        daily: dailyStats,
        weekly: weeklyStats
      },
      financial: {
        totalRevenue,
        averageRevenuePerUser: paidUsers > 0 ? Math.round((totalRevenue / paidUsers) * 100) / 100 : 64.99,
        conversionRate,
        paidUsersPercentage: totalUsers > 0 ? Math.round((paidUsers / totalUsers) * 100) : 0
      }
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    return NextResponse.json(
      { error: 'Erreur lors du chargement des statistiques' },
      { status: 500 }
    );
  }
}

async function generateDailyStats(startDate: Date) {
  const stats = [];
  const now = new Date();

  for (let i = 0; i < 30; i++) {
    const date = new Date(startDate.getTime() + i * 86400000);
    const nextDate = new Date(date.getTime() + 86400000);

    if (date > now) break;

    const [newUsers, newPaidUsers] = await Promise.all([
      prisma.user.count({ where: { createdAt: { gte: date, lt: nextDate } } }),
      prisma.user.count({
        where: { createdAt: { gte: date, lt: nextDate }, stripeCustomerId: { not: null } }
      })
    ]);

    stats.push({
      date: date.toISOString().split('T')[0],
      users: newUsers,
      paidUsers: newPaidUsers,
      revenue: newPaidUsers * 64.99
    });
  }

  return stats;
}

async function generateWeeklyStats() {
  const stats = [];
  const now = new Date();
  const startDate = new Date(now.getTime() - 12 * 7 * 86400000);

  for (let i = 0; i < 12; i++) {
    const weekStart = new Date(startDate.getTime() + i * 7 * 86400000);
    const weekEnd = new Date(weekStart.getTime() + 7 * 86400000);

    if (weekStart > now) break;

    const [newUsers, newPaidUsers] = await Promise.all([
      prisma.user.count({ where: { createdAt: { gte: weekStart, lt: weekEnd } } }),
      prisma.user.count({
        where: { createdAt: { gte: weekStart, lt: weekEnd }, stripeCustomerId: { not: null } }
      })
    ]);

    const weekNumber = Math.ceil((weekStart.getTime() - new Date(weekStart.getFullYear(), 0, 1).getTime()) / (7 * 86400000));

    stats.push({
      week: `S${weekNumber}`,
      weekEnd: weekEnd.toISOString().split('T')[0],
      users: newUsers,
      paidUsers: newPaidUsers,
      revenue: newPaidUsers * 64.99
    });
  }

  return stats;
}

function formatStudyTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) return `${hours}h ${minutes}min ${secs}s`;
  if (minutes > 0) return `${minutes}min ${secs}s`;
  return `${secs}s`;
}
