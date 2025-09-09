import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUserFromRequest } from '@/lib/auth';
import { NextRequest } from 'next/server';

type Params = { chapterNumber: string };

// GET - Récupérer la vidéo d'un chapitre spécifique
export async function GET(
  request: NextRequest,
  context: { params: Promise<Params> }
) {
  try {
    const user = await getAuthUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { chapterNumber } = await context.params;
    const chapterNum = parseInt(chapterNumber, 10);

    if (isNaN(chapterNum)) {
      return NextResponse.json({ error: 'Numéro de chapitre invalide' }, { status: 400 });
    }

    const video = await prisma.chapterVideo.findFirst({
      where: { 
        isActive: true,
        chapter: {
          chapterNumber: chapterNum,
        },
      },
      select: {
        id: true,
        title: true, // titre vidéo
        cloudflareVideoId: true,
        thumbnailUrl: true,
        duration: true,
        chapter: {
          select: {
            chapterNumber: true,
            title: true, // titre chapitre
          },
        },
      },
    });

    if (!video) {
      return NextResponse.json({ error: 'Vidéo non trouvée' }, { status: 404 });
    }

    return NextResponse.json(video);
  } catch (error) {
    console.error('Get chapter video error:', error);
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 });
  }
}

// DELETE - Supprimer une vidéo (pour l'admin)
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<Params> }
) {
  try {
    const user = await getAuthUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { chapterNumber } = await context.params;
    const chapterNum = parseInt(chapterNumber, 10);

    if (isNaN(chapterNum)) {
      return NextResponse.json({ error: 'Numéro de chapitre invalide' }, { status: 400 });
    }

    const chapter = await prisma.chapter.findUnique({
      where: { chapterNumber: chapterNum },
    });

    if (!chapter) {
      return NextResponse.json({ error: 'Chapitre introuvable' }, { status: 404 });
    }

    const updated = await prisma.chapterVideo.updateMany({
      where: { chapterId: chapter.id, isActive: true },
      data: { isActive: false },
    });

    return NextResponse.json({ success: true, updated });
  } catch (error) {
    console.error('Delete chapter video error:', error);
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 });
  }
}