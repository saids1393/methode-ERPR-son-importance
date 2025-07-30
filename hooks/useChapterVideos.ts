'use client';

import { useEffect, useState } from 'react';

interface ChapterVideo {
  id: string;
  chapterNumber: number;
  title: string;
  cloudflareVideoId: string;
  thumbnailUrl?: string;
  duration?: number;
}

export function useChapterVideos() {
  const [videos, setVideos] = useState<ChapterVideo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch('/api/videos');
        if (response.ok) {
          const data = await response.json();
          setVideos(data);
        } else {
          setError('Erreur lors du chargement des vidéos');
        }
      } catch (err) {
        setError('Erreur de connexion');
        console.error('Error fetching videos:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVideos();
  }, []);

  const getVideoByChapter = (chapterNumber: number): ChapterVideo | undefined => {
    return videos.find(video => video.chapterNumber === chapterNumber);
  };

  return {
    videos,
    isLoading,
    error,
    getVideoByChapter,
  };
}

export function useChapterVideo(chapterNumber: number) {
  const [video, setVideo] = useState<ChapterVideo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const response = await fetch(`/api/videos/${chapterNumber}`);
        if (response.ok) {
          const data = await response.json();
          setVideo(data);
        } else if (response.status === 404) {
          setVideo(null); // Pas de vidéo pour ce chapitre
        } else {
          setError('Erreur lors du chargement de la vidéo');
        }
      } catch (err) {
        setError('Erreur de connexion');
        console.error('Error fetching chapter video:', err);
      } finally {
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