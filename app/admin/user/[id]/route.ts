import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin-auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin(request);
    const { id } = await params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        username: true,
        isActive: true,
        stripeCustomerId: true,
        stripeSessionId: true,
        completedPages: true,
        completedQuizzes: true,
        studyTimeSeconds: true,
        createdAt: true,
        updatedAt: true,
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    // Enrichir les données
    const completedPagesCount = user.completedPages.filter(p => p !== 0 && p !== 30).length;
    const completedQuizzesCount = user.completedQuizzes.filter(q => q !== 11).length;
    const totalPossibleItems = 29 + 11;
    const progressPercentage = Math.round(
      ((completedPagesCount + completedQuizzesCount) / totalPossibleItems) * 100
    );

    return NextResponse.json({
      ...user,
      completedPagesCount,
      completedQuizzesCount,
      progressPercentage,
      isPaid: !!user.stripeCustomerId,
      studyTimeFormatted: formatStudyTime(user.studyTimeSeconds)
    });
  } catch (error) {
    console.error('Admin user detail error:', error);
    return NextResponse.json(
      { error: 'Accès non autorisé' },
      { status: 403 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin(request);
    const { id } = await params;
    const body = await request.json();

    const allowedFields = ['isActive', 'username'];
    const updateData: any = {};

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    }

    const user = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        email: true,
        username: true,
        isActive: true,
        stripeCustomerId: true,
        completedPages: true,
        completedQuizzes: true,
        studyTimeSeconds: true,
        createdAt: true,
        updatedAt: true,
      }
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error('Admin user update error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour' },
      { status: 500 }
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