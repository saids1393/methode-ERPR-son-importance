//app/api/homework/user-sends/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getAuthUserFromRequest } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - Récupérer les devoirs envoyés à un utilisateur
export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUserFromRequest(request);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    const sends = await prisma.homeworkSend.findMany({
      where: {
        userId: user.id,
        emailSent: true
      },
      include: {
        homework: {
          select: {
            id: true,
            chapterId: true,
            title: true
          }
        }
      },
      orderBy: { sentAt: 'desc' }
    });

    return NextResponse.json({
      sends: sends.map(send => ({
        id: send.id,
        sentAt: send.sentAt.toISOString(),
        homework: send.homework
      }))
    });
  } catch (error) {
    console.error('Get user homework sends error:', error);
    return NextResponse.json(
      { error: 'Erreur lors du chargement des devoirs' },
      { status: 500 }
    );
  }
}