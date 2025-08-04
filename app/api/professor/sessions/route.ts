import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - Récupérer les séances d'un professeur
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('professor-token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    const decoded = await verifyToken(token);
    const professorId = decoded.userId;

    const sessions = await prisma.session.findMany({
      where: { professorId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            username: true,
            gender: true,
          }
        },
        availability: {
          select: {
            dayOfWeek: true,
            startTime: true,
            endTime: true,
          }
        },
        cancellation: {
          include: {
            reason: true
          }
        }
      },
      orderBy: { scheduledAt: 'desc' }
    });

    return NextResponse.json({ sessions });
  } catch (error) {
    console.error('Get professor sessions error:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}