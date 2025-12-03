// app/api/homework/tajwid-submit/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUserFromRequest } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUserFromRequest(request);

    if (!user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const formData = await request.formData();
    const tajwidHomeworkId = formData.get('tajwidHomeworkId') as string;
    const type = (formData.get('type') as string) || 'TEXT';
    const textContent = formData.get('textContent') as string | null;

    if (!tajwidHomeworkId) {
      return NextResponse.json({ error: 'tajwidHomeworkId requis' }, { status: 400 });
    }

    // Vérifier que le devoir existe
    const tajwidHomework = await prisma.tajwidHomework.findUnique({
      where: { id: tajwidHomeworkId },
    });

    if (!tajwidHomework) {
      return NextResponse.json({ error: 'Devoir non trouvé' }, { status: 404 });
    }

    // Vérifier si l'utilisateur a déjà soumis ce devoir
    const existingSend = await prisma.tajwidHomeworkSend.findUnique({
      where: {
        userId_tajwidHomeworkId: {
          userId: user.id,
          tajwidHomeworkId,
        },
      },
    });

    if (existingSend) {
      // Mise à jour de la soumission existante
      const updatedSend = await prisma.tajwidHomeworkSend.update({
        where: {
          userId_tajwidHomeworkId: {
            userId: user.id,
            tajwidHomeworkId,
          },
        },
        data: {
          type: type as any,
          textContent: type === 'TEXT' ? textContent : null,
          sentAt: new Date(),
        },
      });

      return NextResponse.json(updatedSend, { status: 200 });
    }

    // Création d'une nouvelle soumission
    const send = await prisma.tajwidHomeworkSend.create({
      data: {
        userId: user.id,
        tajwidHomeworkId,
        type: type as any,
        textContent: type === 'TEXT' ? textContent : null,
      },
    });

    return NextResponse.json(send, { status: 201 });
  } catch (error) {
    console.error('Erreur soumission devoir Tajwid:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
