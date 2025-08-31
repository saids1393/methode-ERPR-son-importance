import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUserFromRequest } from '@/lib/auth';
import { NextRequest } from 'next/server';

// GET - Récupérer toutes les vidéos actives
export async function GET(request: NextRequest) {
  try {
    // Vérifier que l'utilisateur est connecté
    const user = await getAuthUserFromRequest(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    const videos = await prisma.chapterVideo.findMany({
      where: { isActive: true },
      orderBy: { chapterNumber: 'asc' },
      select: {
        id: true,
        chapterNumber: true,
        title: true,
        cloudflareVideoId: true,
        thumbnailUrl: true,
        duration: true,
      },
    });

    return NextResponse.json(videos);
  } catch (error) {
    console.error('Get videos error:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

// POST - Créer ou mettre à jour une vidéo (pour l'admin)
export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUserFromRequest(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    const { chapterNumber, title, cloudflareVideoId, thumbnailUrl, duration } = await request.json();

    // Validation des données
    if (chapterNumber == null || !title || !cloudflareVideoId) {
      return NextResponse.json(
        { error: 'Données manquantes' },
        { status: 400 }
      );
    }

    // Créer ou mettre à jour la vidéo
    const video = await prisma.chapterVideo.upsert({
      where: { chapterNumber },
      update: {
        title,
        cloudflareVideoId,
        thumbnailUrl,
        duration,
        updatedAt: new Date(),
      },
      create: {
        chapterNumber,
        title,
        cloudflareVideoId,
        thumbnailUrl,
        duration,
      },
    });

    return NextResponse.json(video);
  } catch (error) {
    console.error('Create/Update video error:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
