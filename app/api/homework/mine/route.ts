import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUserFromRequest } from '@/lib/auth';

// GET - Récupérer les devoirs envoyés à l'utilisateur connecté
export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUserFromRequest(request);

    if (!user) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    const homeworkSends = await prisma.homeworkSend.findMany({
      where: { userId: user.id },
      include: {
        homework: {
          select: {
            id: true,
            title: true,
            content: true,
            chapterId: true,
            createdAt: true,
          },
        },
      },
      orderBy: {
        sentAt: 'desc',
      },
    });

    const homeworks = homeworkSends.map((send) => ({
      id: send.homework.id,
      title: send.homework.title,
      content: send.homework.content,
      chapterId: send.homework.chapterId,
      createdAt: send.homework.createdAt,
      sentAt: send.sentAt,
      emailSent: send.emailSent,
    }));

    return NextResponse.json(homeworks);
  } catch (error) {
    console.error('Erreur récupération devoirs utilisateur:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
