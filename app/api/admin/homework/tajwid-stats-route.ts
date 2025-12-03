import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

// GET - Récupérer les statistiques Tajwid Homework
export async function GET(req: NextRequest) {
  try {
    await requireAdmin(req);

    const totalTajwidHomeworks = await prisma.tajwidHomework.count();
    const totalSends = await prisma.tajwidHomeworkSend.count();
    
    const uniqueUsers = await prisma.tajwidHomeworkSend.findMany({
      distinct: ['userId'],
      select: { userId: true },
    });
    
    const recentSends = await prisma.tajwidHomeworkSend.count({
      where: {
        sentAt: {
          gte: new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000),
        },
      },
    });

    const homeworkStats = await prisma.tajwidHomework.findMany({
      select: {
        id: true,
        chapterId: true,
        title: true,
        _count: {
          select: { tajwidHomeworkSends: true },
        },
      },
      orderBy: { chapterId: 'asc' },
    });

    const topUsers = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        username: true,
        tajwidHomeworkSends: {
          select: { id: true },
        },
      },
      where: {
        tajwidHomeworkSends: {
          some: {},
        },
      },
      orderBy: {
        tajwidHomeworkSends: {
          _count: 'desc',
        },
      },
      take: 10,
    });

    const dailyStats = await prisma.tajwidHomeworkSend.groupBy({
      by: ['sentAt'],
      _count: true,
      orderBy: {
        sentAt: 'desc',
      },
      take: 30,
    });

    return NextResponse.json({
      overview: {
        totalTajwidHomeworks,
        totalSends,
        uniqueUsersWithHomework: uniqueUsers.length,
        recentSends,
        averageSendsPerHomework: totalTajwidHomeworks > 0 ? Math.round(totalSends / totalTajwidHomeworks) : 0,
      },
      homeworkStats: homeworkStats.map(hw => ({
        id: hw.id,
        chapterId: hw.chapterId,
        title: hw.title,
        sentCount: hw._count.tajwidHomeworkSends,
      })),
      topUsers: topUsers.map(user => ({
        id: user.id,
        email: user.email,
        username: user.username,
        homeworkCount: user.tajwidHomeworkSends.length,
      })),
      dailyStats: dailyStats.map(stat => ({
        date: new Date(stat.sentAt).toISOString().split('T')[0],
        sends: stat._count,
      })),
    });
  } catch (error) {
    console.error("Erreur GET /admin/homework/tajwid-stats:", error);
    return NextResponse.json({ error: "Erreur lors de la récupération des statistiques" }, { status: 500 });
  }
}
