import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { prisma } from '@/lib/prisma';

// GET - Statistiques des envois de devoirs
export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request);

    // Statistiques générales
    const [totalHomeworks, totalSends, uniqueUsers] = await Promise.all([
      prisma.homework.count(),
      prisma.homeworkSend.count({ where: { emailSent: true } }),
      prisma.homeworkSend.groupBy({
        by: ['userId'],
        where: { emailSent: true },
        _count: { userId: true }
      })
    ]);

    // Statistiques par chapitre
    const homeworkStats = await prisma.homework.findMany({
      select: {
        id: true,
        chapterId: true,
        title: true,
        createdAt: true,
        _count: {
          select: {
            homeworkSends: {
              where: { emailSent: true }
            }
          }
        }
      },
      orderBy: { chapterId: 'asc' }
    });

    // Envois récents (derniers 30 jours)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const recentSends = await prisma.homeworkSend.count({
      where: {
        sentAt: { gte: thirtyDaysAgo },
        emailSent: true
      }
    });

    // Top utilisateurs par nombre de devoirs reçus
    const topUsers = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        username: true,
        _count: {
          select: {
            homeworkSends: {
              where: { emailSent: true }
            }
          }
        }
      },
      orderBy: {
        homeworkSends: {
          _count: 'desc'
        }
      },
      take: 10
    });

    // Évolution des envois par jour (derniers 7 jours)
    const dailyStats = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const startOfDay = new Date(date.setHours(0, 0, 0, 0));
      const endOfDay = new Date(date.setHours(23, 59, 59, 999));

      const count = await prisma.homeworkSend.count({
        where: {
          sentAt: {
            gte: startOfDay,
            lte: endOfDay
          },
          emailSent: true
        }
      });

      dailyStats.push({
        date: startOfDay.toISOString().split('T')[0],
        sends: count
      });
    }

    return NextResponse.json({
      overview: {
        totalHomeworks,
        totalSends,
        uniqueUsersWithHomework: uniqueUsers.length,
        recentSends,
        averageSendsPerHomework: totalHomeworks > 0 ? Math.round(totalSends / totalHomeworks) : 0
      },
      homeworkStats: homeworkStats.map(hw => ({
        id: hw.id,
        chapterId: hw.chapterId,
        title: hw.title,
        createdAt: hw.createdAt,
        sentCount: hw._count.homeworkSends
      })),
      topUsers: topUsers.map(user => ({
        id: user.id,
        email: user.email,
        username: user.username,
        homeworkCount: user._count.homeworkSends
      })),
      dailyStats
    });
  } catch (error) {
    console.error('Homework stats error:', error);
    return NextResponse.json(
      { error: 'Erreur lors du chargement des statistiques' },
      { status: 500 }
    );
  }
}