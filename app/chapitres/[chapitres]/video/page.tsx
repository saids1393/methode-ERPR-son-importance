'use client';

import { use } from 'react';
import { getChapterByNumber } from "@/lib/chapters";
import { useChapterVideo } from "@/hooks/useChapterVideos";
import CloudflareVideoPlayer from "@/app/components/CloudflareVideoPlayer";
import { notFound } from "next/navigation";
import { useAutoProgress } from "@/hooks/useAutoProgress";

interface VideoPageProps {
  params: Promise<{
    chapitres: string;
  }>;
}

export default function VideoPage({ params }: VideoPageProps) {
  const resolvedParams = use(params);
  const chapterNumber = parseInt(resolvedParams.chapitres, 10);
  
  const chapter = getChapterByNumber(chapterNumber);
  const { video, isLoading, error } = useChapterVideo(chapterNumber);
  
  // Activer l'auto-progression pour les vidéos
  useAutoProgress({ 
    delay: 6000, // 6 secondes
    enabled: true 
  });

  if (!chapter) {
    return notFound();
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-900 text-white">
        <div className="bg-arabic-gradient text-white p-6 text-center">
          <div className="text-3xl font-bold mb-4">
            Vidéo - {chapter.title}
          </div>
        </div>
        
        <div className="p-8 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-400 mx-auto mb-6"></div>
            <p className="text-white text-lg font-medium">Chargement de la vidéo...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !video) {
    return (
      <div className="min-h-screen bg-zinc-900 text-white">
        <div className="bg-arabic-gradient text-white p-6 text-center">
          <div className="text-3xl font-bold mb-4">
            Vidéo - {chapter.title}
          </div>
        </div>
        
        <div className="p-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-8">
              <div className="text-yellow-400 text-6xl mb-4">🎬</div>
              <h3 className="text-2xl font-bold text-white mb-4">
                Vidéo bientôt disponible
              </h3>
              <p className="text-zinc-300 text-lg leading-relaxed">
                La vidéo pour ce chapitre sera ajoutée prochainement. 
                En attendant, vous pouvez consulter l'introduction et les leçons du chapitre.
              </p>
              
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                {chapter.introduction && (
                  <a
                    href={`/chapitres/${chapterNumber}/introduction`}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
                  >
                    📖 Lire l'introduction
                  </a>
                )}
                
                {chapter.pages.length > 0 && (
                  <a
                    href={chapter.pages[0].href}
                    className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
                  >
                    🚀 Commencer les leçons
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-900 text-white">
      {/* Header */}
      <div className="bg-arabic-gradient text-white p-6 text-center">
        <div className="text-3xl font-bold mb-4">
          {video.title}
        </div>
        <div className="text-lg text-purple-200">
          Chapitre {chapterNumber} - {chapter.title}
        </div>
      </div>

      {/* Lecteur vidéo pleine largeur */}
      <div className="w-full">
        <CloudflareVideoPlayer
          videoId={video.cloudflareVideoId}
          title={video.title}
          thumbnailUrl={video.thumbnailUrl}
          className="w-full h-[50vh] md:h-[60vh] lg:h-[80vh]"
          controls={true}
        />
      </div>
    </div>
  );
}