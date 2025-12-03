import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

export async function GET(req: NextRequest) {
  try {
    await requireAdmin(req);

    const totalHomeworks = await prisma.tajwidHomework.count();

    const totalSends = await prisma.tajwidHomeworkSend.count();

    const uniqueUsersWithHomework = await prisma.tajwidHomeworkSend.groupBy({
      by: ['userId'],
    });

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentSends = await prisma.tajwidHomeworkSend.count({
      where: {
        sentAt: {
          gte: thirtyDaysAgo
        }
      }
    });

    const homeworkStats = await prisma.tajwidHomework.findMany({
      select: {
        id: true,
        chapterId: true,
        title: true,
        tajwidHomeworkSends: {
          select: {
            id: true
          }
        }
      }
    });

    const formattedHomeworkStats = homeworkStats.map(hw => ({
      id: hw.id,
      chapterId: hw.chapterId,
      title: hw.title,
      sentCount: hw.tajwidHomeworkSends.length
    }));

    const topUsers = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        username: true,
        tajwidHomeworkSends: {
          select: {
            id: true
          }
        }
      },
      orderBy: {
        tajwidHomeworkSends: {
          _count: 'desc'
        }
      },
      take: 10
    });

    const formattedTopUsers = topUsers
      .filter(user => user.tajwidHomeworkSends.length > 0)
      .map(user => ({
        id: user.id,
        email: user.email,
        username: user.username,
        homeworkCount: user.tajwidHomeworkSends.length
      }));

    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      return date.toISOString().split('T')[0];
    });

    const dailyStats = await Promise.all(
      last30Days.map(async (date) => {
        const startOfDay = new Date(date);
        const endOfDay = new Date(date);
        endOfDay.setDate(endOfDay.getDate() + 1);

        const sends = await prisma.tajwidHomeworkSend.count({
          where: {
            sentAt: {
              gte: startOfDay,
              lt: endOfDay
            }
          }
        });

        return { date, sends };
      })
    );

    const stats = {
      overview: {
        totalHomeworks,
        totalSends,
        uniqueUsersWithHomework: uniqueUsersWithHomework.length,
        recentSends,
        averageSendsPerHomework: totalHomeworks > 0
          ? Math.round(totalSends / totalHomeworks)
          : 0
      },
      homeworkStats: formattedHomeworkStats,
      topUsers: formattedTopUsers,
      dailyStats
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Erreur GET /admin/homework/tajwid/stats:", error);
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  }
}
