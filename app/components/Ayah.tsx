//app/components/Ayah.tsx
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, Loader2 } from 'lucide-react';

interface AyahProps {
  surah: number;
  ayah: number;
  reciterId: number;
  verseText?: string;
  translation?: string;
  className?: string;
  showPlayButton?: boolean;
  autoFetch?: boolean;
}

const Ayah: React.FC<AyahProps> = ({
  surah,
  ayah,
  reciterId,
  verseText,
  translation,
  className = '',
  showPlayButton = true,
  autoFetch = true,
}) => {
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Récupérer l'URL audio quand le récitateur change
  useEffect(() => {
    if (autoFetch && reciterId) {
      fetchAudioUrl();
    }
  }, [reciterId, surah, ayah, autoFetch]);

  // Gérer la fin de la lecture
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      const handleEnded = () => setIsPlaying(false);
      audio.addEventListener('ended', handleEnded);
      return () => audio.removeEventListener('ended', handleEnded);
    }
  }, [audioUrl]);

  const fetchAudioUrl = async () => {
    if (!reciterId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(
        `/api/quran/ayah?reciterId=${reciterId}&surah=${surah}&ayah=${ayah}`
      );
      const data = await response.json();
      
      if (data.success && data.audioUrl) {
        setAudioUrl(data.audioUrl);
      } else {
        setError(data.error || 'Erreur lors du chargement');
      }
    } catch (err) {
      setError('Impossible de charger l\'audio');
      console.error('Erreur fetch audio:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePlay = async () => {
    if (!audioUrl && !isLoading) {
      await fetchAudioUrl();
      return;
    }

    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        try {
          await audioRef.current.play();
          setIsPlaying(true);
        } catch (err) {
          console.error('Erreur lecture audio:', err);
          setError('Impossible de lire l\'audio');
        }
      }
    }
  };

  return (
    <div className={`flex flex-col items-center gap-3 ${className}`}>
      {/* Texte du verset */}
      {verseText && (
        <div className="text-center">
          <div className="text-3xl md:text-4xl lg:text-5xl text-amber-300 font-bold leading-relaxed mb-2">
            {verseText}
          </div>
          {translation && (
            <div className="text-sm md:text-base text-gray-400 italic">
              {translation}
            </div>
          )}
        </div>
      )}

      {/* Bouton de lecture */}
      {showPlayButton && (
        <button
          onClick={togglePlay}
          disabled={isLoading}
          className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${
            isPlaying
              ? 'bg-amber-500 text-gray-900'
              : 'bg-gray-700 text-amber-400 hover:bg-gray-600'
          } ${isLoading ? 'opacity-50 cursor-wait' : 'hover:scale-105'}`}
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : isPlaying ? (
            <Pause className="w-5 h-5" />
          ) : (
            <Play className="w-5 h-5" />
          )}
          <Volume2 className="w-4 h-4" />
        </button>
      )}

      {/* Message d'erreur */}
      {error && (
        <p className="text-red-400 text-sm">{error}</p>
      )}

      {/* Élément audio caché */}
      {audioUrl && (
        <audio ref={audioRef} src={audioUrl} preload="auto" />
      )}
    </div>
  );
};

export default Ayah;
