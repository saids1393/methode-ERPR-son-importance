// app/api/homework/tajwid-mine/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUserFromRequest } from '@/lib/auth';

// GET - Récupérer les devoirs Tajwid envoyés à l'utilisateur connecté
export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUserFromRequest(request);

    if (!user) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    const tajwidHomeworkSends = await prisma.tajwidHomeworkSend.findMany({
      where: { userId: user.id },
      include: {
        tajwidHomework: {
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

    const tajwidHomeworks = tajwidHomeworkSends.map((send) => ({
      id: send.tajwidHomework.id,
      title: send.tajwidHomework.title,
      content: send.tajwidHomework.content,
      chapterId: send.tajwidHomework.chapterId,
      createdAt: send.tajwidHomework.createdAt,
      sentAt: send.sentAt,
      emailSent: send.emailSent,
      submission: {
        type: send.type,
        textContent: send.textContent,
        fileUrls: send.fileUrls,
        status: send.status,
        feedback: send.feedback,
        correctedAt: send.correctedAt,
      },
    }));

    return NextResponse.json(tajwidHomeworks);
  } catch (error) {
    console.error('Erreur récupération devoirs Tajwid utilisateur:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
