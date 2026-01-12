'use client';

import { useEffect, useState } from 'react';

interface TajwidChapterVideo {
  id: string;
  chapterNumber: number;
  title: string;
  cloudflareVideoId: string;
  thumbnailUrl?: string;
  duration?: number;
}

export function useTajwidChapterVideos() {
  const [videos, setVideos] = useState<TajwidChapterVideo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch('/api/videos-tajwid');
        if (response.ok) {
          const data = await response.json();
          setVideos(data);
        } else {
          setError('Erreur lors du chargement des vidéos Tajwid');
        }
      } catch (err) {
        setError('Erreur de connexion');
        console.error('Error fetching Tajwid videos:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVideos();
  }, []);

  const getVideoByChapter = (chapterNumber: number): TajwidChapterVideo | undefined => {
    return videos.find(video => video.chapterNumber === chapterNumber);
  };

  return {
    videos,
    isLoading,
    error,
    getVideoByChapter,
  };
}

export function useTajwidChapterVideo(chapterNumber: number) {
  const [video, setVideo] = useState<TajwidChapterVideo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVideo = async () => {
      console.log(`🎬 [HOOK TAJWID] Récupération vidéo chapitre ${chapterNumber}`);
      try {
        const response = await fetch(`/api/videos-tajwid/${chapterNumber}`);
        console.log(`📡 [HOOK TAJWID] Réponse API: ${response.status}`);
        
        if (response.ok) {
          const data = await response.json();
          console.log(`✅ [HOOK TAJWID] Vidéo reçue:`, data);
          setVideo(data);
        } else if (response.status === 404) {
          console.log(`📹 [HOOK TAJWID] Aucune vidéo pour le chapitre ${chapterNumber}`);
          setVideo(null); // Pas de vidéo pour ce chapitre
        } else {
          console.log(`❌ [HOOK TAJWID] Erreur HTTP ${response.status}`);
          const errorText = await response.text();
          console.log(`❌ [HOOK TAJWID] Détails erreur:`, errorText);
          setError('Erreur lors du chargement de la vidéo');
        }
      } catch (err) {
        console.error(`❌ [HOOK TAJWID] Erreur de connexion:`, err);
        setError('Erreur de connexion');
      } finally {
        console.log(`🏁 [HOOK TAJWID] Fin du chargement vidéo chapitre ${chapterNumber}`);
        setIsLoading(false);
      }
    };

    fetchVideo();
  }, [chapterNumber]);

  return {
    video,
    isLoading,
    error,
  };
}
