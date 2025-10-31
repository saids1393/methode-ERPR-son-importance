'use client';

import { use } from 'react';
import { getChapterByNumber } from "@/lib/chapters";
import { useChapterVideo } from "@/hooks/useChapterVideos";
import CloudflareVideoPlayer from "@/app/components/CloudflareVideoPlayer";
import { notFound, useRouter } from "next/navigation";
import { useAutoProgress } from "@/hooks/useAutoProgress";
import UniversalNavigation from "@/app/components/UniversalNavigation";
import { useEffect } from "react";

interface VideoPageProps {
  params: Promise<{
    chapitres: string;
  }>;
}

export default function VideoPage({ params }: VideoPageProps) {
  const resolvedParams = use(params);
  const chapterNumber = parseInt(resolvedParams.chapitres, 10);

  const router = useRouter();
  const chapter = getChapterByNumber(chapterNumber);
  const { video, isLoading, error } = useChapterVideo(chapterNumber);

  // Activer l'auto-progression pour les vidéos
  useAutoProgress({
    minTimeOnPage: 6000, // 6 secondes
    enabled: true
  });

  // 🔴 Si le chapitre n'existe pas → 404
  if (!chapter) {
    return notFound();
  }

  // 🔁 Si le chapitre n’a pas de vidéo → redirection automatique
  useEffect(() => {
    if (!isLoading && (!video || error)) {
      // Si le chapitre a des leçons, redirige vers la première
      if (chapter.pages && chapter.pages.length > 0) {
        router.replace(chapter.pages[0].href);
      }
      // Sinon, s’il a une introduction
      else if (chapter.introduction) {
        router.replace(`/chapitres/${chapterNumber}/introduction`);
      }
    }
  }, [isLoading, video, error, chapter, chapterNumber, router]);

  // Tant qu'on vérifie la vidéo → affichage de chargement
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <div className="p-8 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-400 mx-auto mb-6"></div>
            <p className="text-white text-lg font-medium">Chargement de la vidéo...</p>
          </div>
        </div>
      </div>
    );
  }

  // Pendant la redirection (petit écran vide pour éviter clignotement)
  if (!video || error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <p className="text-gray-400 animate-pulse">Redirection en cours...</p>
      </div>
    );
  }

  // ✅ Affichage normal si vidéo trouvée
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="text-white p-4 md:p-6 text-center border-b-2">
        <div className="text-2xl md:text-3xl font-bold mb-2">
          {video.title}
        </div>
      </div>

      {/* Lecteur vidéo */}
      <div className="w-full">
        <CloudflareVideoPlayer
          videoId={video.cloudflareVideoId}
          title={video.title}
          thumbnailUrl={video.thumbnailUrl}
          className="w-full"
        />
      </div>

      {/* Navigation */}
      <div className="p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <UniversalNavigation
            currentChapter={chapterNumber}
            currentType="video"
            className="mt-6 mb-4"
          />
        </div>
      </div>
    </div>
  );
}
