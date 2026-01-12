// app/api/videos-tajwid/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { jwtVerify } from 'jose';
import { NextRequest } from 'next/server';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-secret');

// Fonction helper pour vérifier l'authentification
async function getAuthUser(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value;
  
  if (!token) {
    return null;
  }

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    
    if (!payload?.userId) {
      return null;
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId as string },
      select: {
        id: true,
        email: true,
        username: true,
        accountType: true,
        subscriptionPlan: true,
      }
    });

    return user;
  } catch (error) {
    return null;
  }
}

// GET - Récupérer toutes les vidéos Tajwid actives
export async function GET(request: NextRequest) {
  try {
    // Vérifier que l'utilisateur est connecté
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    const videos = await prisma.tajwidChapterVideo.findMany({
      where: { isActive: true },
      orderBy: { chapterNumber: 'asc' },
    });

    // Formater les données
    const formattedVideos = videos.map(video => ({
      id: video.id,
      chapterNumber: video.chapterNumber,
      title: video.title,
      cloudflareVideoId: video.cloudflareVideoId,
      thumbnailUrl: video.thumbnailUrl,
      duration: video.duration,
    }));

    return NextResponse.json(formattedVideos);
  } catch (error) {
    console.error('Get Tajwid videos error:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

// POST - Créer ou mettre à jour une vidéo Tajwid (pour l'admin)
export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    const { chapterNumber, title, cloudflareVideoId, thumbnailUrl, duration } = await request.json();

    console.log('📹 [API TAJWID] Création/mise à jour vidéo:', {
      chapterNumber,
      title,
      cloudflareVideoId,
      thumbnailUrl,
      duration
    });
    
    // Validation des données
    if (chapterNumber === null || chapterNumber === undefined || !title || !cloudflareVideoId) {
      console.log('❌ [API TAJWID] Données manquantes:', { chapterNumber, title, cloudflareVideoId });
      return NextResponse.json(
        { error: 'Données manquantes' },
        { status: 400 }
      );
    }

    // Validation du numéro de chapitre (1-10 pour Tajwid)
    if (typeof chapterNumber !== 'number' || chapterNumber < 1 || chapterNumber > 10) {
      console.log('❌ [API TAJWID] Numéro de chapitre invalide:', chapterNumber);
      return NextResponse.json(
        { error: 'Numéro de chapitre invalide (1-10)' },
        { status: 400 }
      );
    }

    // Validation de l'ID Cloudflare
    if (typeof cloudflareVideoId !== 'string' || cloudflareVideoId.trim().length === 0) {
      console.log('❌ [API TAJWID] ID Cloudflare invalide:', cloudflareVideoId);
      return NextResponse.json(
        { error: 'ID Cloudflare vidéo invalide' },
        { status: 400 }
      );
    }

    // Validation du titre
    if (typeof title !== 'string' || title.trim().length === 0) {
      console.log('❌ [API TAJWID] Titre invalide:', title);
      return NextResponse.json(
        { error: 'Titre invalide' },
        { status: 400 }
      );
    }

    // Vérifier si une vidéo existe déjà pour ce chapitre
    const existingVideo = await prisma.tajwidChapterVideo.findUnique({
      where: { chapterNumber }
    });

    console.log('🔍 [API TAJWID] Vidéo existante trouvée:', existingVideo ? 'Oui' : 'Non');

    let video;
    
    if (existingVideo) {
      // Mise à jour de la vidéo existante
      console.log('🔄 [API TAJWID] Mise à jour de la vidéo existante pour le chapitre', chapterNumber);
      video = await prisma.tajwidChapterVideo.update({
        where: { chapterNumber },
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
      console.log('➕ [API TAJWID] Création d\'une nouvelle vidéo pour le chapitre', chapterNumber);
      video = await prisma.tajwidChapterVideo.create({
        data: {
          chapterNumber,
          title: title.trim(),
          cloudflareVideoId: cloudflareVideoId.trim(),
          thumbnailUrl: thumbnailUrl?.trim() || null,
          duration: duration || null,
          isActive: true,
        },
      });
    }

    console.log('✅ [API TAJWID] Vidéo sauvegardée:', video);
    return NextResponse.json(video);
  } catch (error) {
    console.error('❌ [API TAJWID] Erreur Create/Update video:', error);
  
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
      { error: 'Erreur lors de la sauvegarde' },
      { status: 500 }
    );
  }
}

