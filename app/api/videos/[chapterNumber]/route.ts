import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUserFromRequest } from '@/lib/auth';
import { NextRequest } from 'next/server';

// GET - Récupérer la vidéo d'un chapitre spécifique
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ chapterNumber: string }> }
) {
  try {
    const user = await getAuthUserFromRequest(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    const { chapterNumber } = await params;
    const chapterNum = parseInt(chapterNumber, 10);

    if (isNaN(chapterNum)) {
      return NextResponse.json(
        { error: 'Numéro de chapitre invalide' },
        { status: 400 }
      );
    }

    const video = await prisma.chapterVideo.findUnique({
      where: { 
        chapterNumber: chapterNum,
        isActive: true 
      },
      select: {
        id: true,
        chapterNumber: true,
        title: true,
        cloudflareVideoId: true,
        thumbnailUrl: true,
        duration: true,
      },
    });

    if (!video) {
      return NextResponse.json(
        { error: 'Vidéo non trouvée' },
        { status: 404 }
      );
    }

    return NextResponse.json(video);
  } catch (error) {
    console.error('Get chapter video error:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer une vidéo (pour l'admin)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ chapterNumber: string }> }
) {
  try {
    const user = await getAuthUserFromRequest(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    const { chapterNumber } = await params;
    const chapterNum = parseInt(chapterNumber, 10);

    if (isNaN(chapterNum)) {
      return NextResponse.json(
        { error: 'Numéro de chapitre invalide' },
        { status: 400 }
      );
    }

    // Marquer comme inactif plutôt que supprimer
    const video = await prisma.chapterVideo.update({
      where: { chapterNumber: chapterNum },
      data: { isActive: false },
    });

    return NextResponse.json({ success: true, video });
  } catch (error) {
    console.error('Delete chapter video error:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}