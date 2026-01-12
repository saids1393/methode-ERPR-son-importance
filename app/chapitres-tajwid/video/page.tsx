'use client';

import { use } from 'react';
import { chaptersTajwid } from "@/lib/chapters-tajwid";
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
  const chapter = chaptersTajwid.find(ch => ch.chapterNumber === chapterNumber);

  // Activer l'auto-progression pour les vidéos
  useAutoProgress({
    minTimeOnPage: 6000, // 6 secondes
    enabled: true
  });

  // 🔴 Si le chapitre n'existe pas → 404
  if (!chapter) {
    return notFound();
  }

  // 🔁 Si le chapitre n'a pas de vidéo → affichage du contenu placeholder
  // Pour Tajwid, nous affichons un placeholder au lieu de rediriger
  if (!chapter.videoId && !chapter.pages) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <div className="p-8 flex items-center justify-center">
          <div className="text-center">
            <p className="text-white text-lg font-medium">Aucune vidéo disponible pour ce chapitre Tajwid</p>
            <p className="text-gray-400 text-sm mt-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            <div className="mt-8">
              <UniversalNavigation
                currentChapter={chapterNumber}
                currentType="video"
                className="mt-6 mb-4"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ✅ Affichage normal si vidéo ou contenu trouvé
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="text-white p-4 md:p-6 text-center border-b-2">
        <div className="text-2xl md:text-3xl font-bold mb-2">
          {chapter.title}
        </div>
      </div>

      {/* Lecteur vidéo ou placeholder */}
      <div className="w-full">
        {chapter.videoId ? (
          <CloudflareVideoPlayer
            videoId={chapter.videoId}
            title={chapter.title}
            thumbnailUrl={chapter.thumbnail}
            className="w-full"
          />
        ) : (
          <div className="w-full bg-gradient-to-br from-gray-800 to-gray-900 p-8 md:p-16 flex items-center justify-center min-h-96">
            <div className="text-center">
              <div className="text-6xl mb-4">📺</div>
              <p className="text-gray-300 text-xl">Vidéo à venir</p>
              <p className="text-gray-500 text-sm mt-2">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            </div>
          </div>
        )}
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
        <div>Méthode ERPR - Tajwid</div>
        <div className="mt-1">© 2025 Tous droits réservés</div>
      </footer>
    </div>
  );
}
