// app/api/videos-tajwid/[chapterNumber]/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUserFromRequest } from '@/lib/auth';
import { NextRequest } from 'next/server';

interface RouteParams {
  params: Promise<{
    chapterNumber: string;
  }>;
}

// GET - Récupérer la vidéo d'un chapitre Tajwid spécifique
export async function GET(request: NextRequest, { params }: RouteParams) {
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
    
    console.log(`🎬 [API TAJWID] Récupération vidéo chapitre ${chapterNum}`);

    if (isNaN(chapterNum)) {
      return NextResponse.json(
        { error: 'Numéro de chapitre invalide' },
        { status: 400 }
      );
    }

    const video = await prisma.tajwidChapterVideo.findUnique({
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
      console.log(`📹 [API TAJWID] Aucune vidéo pour le chapitre ${chapterNum}`);
      return NextResponse.json(
        { error: 'Vidéo non trouvée' },
        { status: 404 }
      );
    }

    console.log(`✅ [API TAJWID] Vidéo trouvée:`, video);
    return NextResponse.json(video);
  } catch (error) {
    console.error('Get Tajwid video error:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer la vidéo d'un chapitre Tajwid
export async function DELETE(request: NextRequest, { params }: RouteParams) {
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

    console.log(`🗑️ [API TAJWID] Suppression vidéo chapitre ${chapterNum}`);

    if (isNaN(chapterNum)) {
      return NextResponse.json(
        { error: 'Numéro de chapitre invalide' },
        { status: 400 }
      );
    }

    // Vérifier si la vidéo existe
    const existingVideo = await prisma.tajwidChapterVideo.findUnique({
      where: { chapterNumber: chapterNum }
    });

    if (!existingVideo) {
      return NextResponse.json(
        { error: 'Vidéo non trouvée' },
        { status: 404 }
      );
    }

    // Supprimer la vidéo
    await prisma.tajwidChapterVideo.delete({
      where: { chapterNumber: chapterNum }
    });

    console.log(`✅ [API TAJWID] Vidéo supprimée pour le chapitre ${chapterNum}`);
    return NextResponse.json({ success: true, message: 'Vidéo supprimée avec succès' });
  } catch (error) {
    console.error('Delete Tajwid video error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression' },
      { status: 500 }
    );
  }
}
