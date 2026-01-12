'use client';

import { use, useEffect, useState } from 'react';
import { chaptersTajwid } from "@/lib/chapters-tajwid";
import CloudflareVideoPlayer from "@/app/components/CloudflareVideoPlayer";
import { notFound } from "next/navigation";
import { useAutoProgress } from "@/hooks/useAutoProgress";
import UniversalNavigation from "@/app/components/UniversalNavigation";
import { useTajwidChapterVideo } from "@/hooks/useTajwidChapterVideos";

interface VideoPageProps {
  params: Promise<{
    chapitres: string;
  }>;
}

export default function VideoPage({ params }: VideoPageProps) {
  const resolvedParams = use(params);
  const chapterNumber = parseInt(resolvedParams.chapitres, 10);

  const chapter = chaptersTajwid.find(ch => ch.chapterNumber === chapterNumber);
  
  // Récupérer la vidéo depuis la base de données
  const { video, isLoading, error } = useTajwidChapterVideo(chapterNumber);

  // Activer l'auto-progression pour les vidéos
  useAutoProgress({
    minTimeOnPage: 6000, // 6 secondes
    enabled: true
  });

  // 🔴 Si le chapitre n'existe pas → 404
  if (!chapter) {
    return notFound();
  }

  // Affichage pendant le chargement
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-400 mx-auto mb-6"></div>
          <p className="text-lg">Chargement de la vidéo...</p>
        </div>
      </div>
    );
  }

  // 🔁 Si pas de vidéo dans la BDD → affichage placeholder
  if (!video) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <div className="p-8 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="text-6xl mb-4">📺</div>
            <p className="text-white text-lg font-medium">Aucune vidéo disponible pour ce chapitre Tajwid</p>
            <p className="text-gray-400 text-sm mt-4">La vidéo sera ajoutée prochainement.</p>
            <div className="mt-8">
              <UniversalNavigation
                currentChapter={chapterNumber}
                currentType="video"
                className="mt-6 mb-4"
                module="TAJWID"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ✅ Affichage normal si vidéo trouvée dans la BDD
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="text-white p-4 md:p-6 text-center border-b-2 border-white/10">
        <div className="text-2xl md:text-3xl font-bold mb-2">
          {chapter.title}
        </div>
        <p className="text-gray-400">{video.title}</p>
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
            module="TAJWID"
          />
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 text-center p-4 text-sm text-gray-500">
        © 2024 Méthode ERPR - Tous droits réservés
      </footer>
    </div>
  );
}
