import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { prisma } from '@/lib/prisma';

// GET - Récupérer tous les envois de devoirs avec détails
export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request);

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const chapterId = searchParams.get('chapterId');
    const userId = searchParams.get('userId');
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    const skip = (page - 1) * limit;

    // Construire les conditions de recherche
    const whereConditions: any = {};
    if (chapterId) {
      whereConditions.homework = { chapterId: parseInt(chapterId) };
    }
    if (userId) {
      whereConditions.userId = userId;
    }
    if (status === 'success') {
      whereConditions.emailSent = true;
    } else if (status === 'failed') {
      whereConditions.emailSent = false;
    }
    if (search) {
      whereConditions.user = {
        OR: [
          { email: { contains: search, mode: 'insensitive' } },
          { username: { contains: search, mode: 'insensitive' } }
        ]
      };
    }

    const [sends, totalCount, stats] = await Promise.all([
      prisma.homeworkSend.findMany({
        where: whereConditions,
        include: {
          user: {
            select: {
              id: true,
              email: true,
              username: true,
              gender: true
            }
          },
          homework: {
            select: {
              id: true,
              chapterId: true,
              title: true
            }
          }
        },
        orderBy: { sentAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.homeworkSend.count({ where: whereConditions }),
      // Statistiques globales
      prisma.homeworkSend.aggregate({
        _count: {
          id: true,
          userId: true
        },
        where: whereConditions
      }).then(async (agg) => {
        const [successfulSends, failedSends, uniqueUsers] = await Promise.all([
          prisma.homeworkSend.count({ 
            where: { ...whereConditions, emailSent: true } 
          }),
          prisma.homeworkSend.count({ 
            where: { ...whereConditions, emailSent: false } 
          }),
          prisma.homeworkSend.groupBy({
            by: ['userId'],
            where: whereConditions,
            _count: { userId: true }
          }).then(groups => groups.length)
        ]);
        
        return {
          totalSends: agg._count.id,
          successfulSends,
          failedSends,
          uniqueUsers
        };
      })
    ]);

    return NextResponse.json({
      sends: sends.map(send => ({
        id: send.id,
        sentAt: send.sentAt.toISOString(),
        emailSent: send.emailSent,
        user: send.user,
        homework: send.homework
      })),
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        hasNext: page * limit < totalCount,
        hasPrev: page > 1
      },
      stats
    });
  } catch (error) {
    console.error('Get homework sends error:', error);
    return NextResponse.json(
      { error: 'Erreur lors du chargement des envois' },
      { status: 500 }
    );
  }
}