import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin-auth';

export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request);

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    const skip = (page - 1) * limit;

    // Construire les conditions de recherche
    const whereConditions: any = {};
    if (search) {
      whereConditions.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { username: { contains: search, mode: 'insensitive' } }
      ];
    }

    // Construire l'ordre de tri
    const orderBy: any = {};
    orderBy[sortBy] = sortOrder;

    const [users, totalCount] = await Promise.all([
      prisma.user.findMany({
        where: whereConditions,
        select: {
          id: true,
          email: true,
          username: true,
          gender: true,
          isActive: true,
          stripeCustomerId: true,
          completedPages: true,
          completedQuizzes: true,
          studyTimeSeconds: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy,
        skip,
        take: limit,
      }),
      prisma.user.count({ where: whereConditions })
    ]);

    // Enrichir les données utilisateur
    const enrichedUsers = users.map((user: { completedPages: { filter: (arg0: (p: any) => boolean) => { (): any; new(): any; length: any; }; }; completedQuizzes: { filter: (arg0: (q: any) => boolean) => { (): any; new(): any; length: any; }; }; stripeCustomerId: any; studyTimeSeconds: number; }) => {
      const completedPagesCount = user.completedPages.filter((p: number) => p !== 0 && p !== 30).length;
      const completedQuizzesCount = user.completedQuizzes.filter((q: number) => q !== 11).length;
      const totalPossibleItems = 29 + 11; // 29 pages + 11 quiz
      const progressPercentage = Math.round(
        ((completedPagesCount + completedQuizzesCount) / totalPossibleItems) * 100
      );

      return {
        ...user,
        completedPagesCount,
        completedQuizzesCount,
        progressPercentage,
        isPaid: !!user.stripeCustomerId, // Seulement si stripeCustomerId existe
        studyTimeFormatted: formatStudyTime(user.studyTimeSeconds)
      };
    });

    return NextResponse.json({
      users: enrichedUsers,
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
    console.error('Admin users error:', error);
    return NextResponse.json(
      { error: 'Accès non autorisé' },
      { status: 403 }
    );
  }
}

function formatStudyTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hours > 0) {
    return `${hours}h ${minutes}min`;
  }
  if (minutes > 0) {
    return `${minutes}min ${secs}s`;
  }
  return `${secs}s`;
}