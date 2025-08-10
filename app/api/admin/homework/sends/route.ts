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

    const skip = (page - 1) * limit;

    // Construire les conditions de recherche
    const whereConditions: any = {};
    if (chapterId) {
      whereConditions.homework = { chapterId: parseInt(chapterId) };
    }
    if (userId) {
      whereConditions.userId = userId;
    }

    const [sends, totalCount] = await Promise.all([
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
      prisma.homeworkSend.count({ where: whereConditions })
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
      }
    });
  } catch (error) {
    console.error('Get homework sends error:', error);
    return NextResponse.json(
      { error: 'Erreur lors du chargement des envois' },
      { status: 500 }
    );
  }
}