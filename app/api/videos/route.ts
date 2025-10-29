// app/api/videos/route.ts
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
      include: {
        chapter: {
          select: {
            chapterNumber: true,
            title: true,
          },
        },
      },
    });

    // Trier les vidéos par chapterNumber côté application
    const sortedVideos = videos.sort((a, b) => {
      const chapterA = a.chapter?.chapterNumber || 0;
      const chapterB = b.chapter?.chapterNumber || 0;
      return chapterA - chapterB;
    });

    // Formater les données
    const formattedVideos = sortedVideos.map(video => ({
      id: video.id,
      chapterNumber: video.chapter?.chapterNumber,
      chapterTitle: video.chapter?.title,
      title: video.title,
      cloudflareVideoId: video.cloudflareVideoId,
      thumbnailUrl: video.thumbnailUrl,
      duration: video.duration,
    }));

    return NextResponse.json(formattedVideos);
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

    console.log('📹 [API] Création/mise à jour vidéo:', {
      chapterNumber,
      title,
      cloudflareVideoId,
      thumbnailUrl,
      duration
    });
    
    // Validation des données
    if (chapterNumber === null || chapterNumber === undefined || !title || !cloudflareVideoId) {
      console.log('❌ [API] Données manquantes:', { chapterNumber, title, cloudflareVideoId });
      return NextResponse.json(
        { error: 'Données manquantes' },
        { status: 400 }
      );
    }

    // Validation du numéro de chapitre
    if (typeof chapterNumber !== 'number' || chapterNumber < 0 || chapterNumber > 11) {
      console.log('❌ [API] Numéro de chapitre invalide:', chapterNumber);
      return NextResponse.json(
        { error: 'Numéro de chapitre invalide (0-11)' },
        { status: 400 }
      );
    }

    // Validation de l'ID Cloudflare
    if (typeof cloudflareVideoId !== 'string' || cloudflareVideoId.trim().length === 0) {
      console.log('❌ [API] ID Cloudflare invalide:', cloudflareVideoId);
      return NextResponse.json(
        { error: 'ID Cloudflare vidéo invalide' },
        { status: 400 }
      );
    }

    // Validation du titre
    if (typeof title !== 'string' || title.trim().length === 0) {
      console.log('❌ [API] Titre invalide:', title);
      return NextResponse.json(
        { error: 'Titre invalide' },
        { status: 400 }
      );
    }

    // 1. D'abord, trouver ou créer le chapitre
    let chapter = await prisma.chapter.findUnique({
      where: { chapterNumber }
    });

    if (!chapter) {
      // Créer le chapitre s'il n'existe pas
      console.log('➕ [API] Création du chapitre', chapterNumber);
      chapter = await prisma.chapter.create({
        data: {
          chapterNumber,
          title: `Chapitre ${chapterNumber}`,
          isActive: true,
        },
      });
    }

    // 2. Vérifier si une vidéo existe déjà pour ce chapitre
    const existingVideo = await prisma.chapterVideo.findFirst({
      where: { 
        chapterId: chapter.id 
      }
    });

    console.log('🔍 [API] Vidéo existante trouvée:', existingVideo ? 'Oui' : 'Non');

    let video;
    
    if (existingVideo) {
      // Mise à jour de la vidéo existante
      console.log('🔄 [API] Mise à jour de la vidéo existante pour le chapitre', chapterNumber);
      video = await prisma.chapterVideo.update({
        where: { id: existingVideo.id },
        data: {
          title: title.trim(),
          cloudflareVideoId: cloudflareVideoId.trim(),
          thumbnailUrl: thumbnailUrl?.trim() || null,
          duration: duration || null,
          isActive: true,
          updatedAt: new Date(),
        },
      });
    } else {
      // Création d'une nouvelle vidéo
      console.log('➕ [API] Création d\'une nouvelle vidéo pour le chapitre', chapterNumber);
      video = await prisma.chapterVideo.create({
        data: {
          chapterId: chapter.id,
          title: title.trim(),
          cloudflareVideoId: cloudflareVideoId.trim(),
          thumbnailUrl: thumbnailUrl?.trim() || null,
          duration: duration || null,
          isActive: true,
        },
      });
    }

    // Récupérer la vidéo avec les données du chapitre pour la réponse
    const videoWithChapter = await prisma.chapterVideo.findUnique({
      where: { id: video.id },
      include: {
        chapter: {
          select: {
            chapterNumber: true,
            title: true,
          },
        },
      },
    });

    console.log('✅ [API] Vidéo sauvegardée:', videoWithChapter);
    return NextResponse.json(videoWithChapter);
  } catch (error) {
    console.error('❌ [API] Erreur Create/Update video:', error);
    
    // Gestion des erreurs spécifiques de Prisma
    if (error instanceof Error) {
      if (error.message.includes('Unique constraint')) {
        return NextResponse.json(
          { error: 'Cet ID Cloudflare est déjà utilisé par une autre vidéo' },
          { status: 400 }
        );
      }
    }
    
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}