'use client';

import { useEffect, useRef, useState } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize, ExternalLink } from 'lucide-react';

interface CloudflareVideoPlayerProps {
  videoId: string;
  title: string;
  thumbnailUrl?: string;
  autoplay?: boolean;
  controls?: boolean;
  className?: string;
  primaryColor?: string;
}

declare global {
  interface Window {
    Hls: any;
    dashjs: any;
  }
}

export default function CloudflareVideoPlayer({
  videoId,
  title,
  thumbnailUrl,
  autoplay = false,
  controls = true,
  className = '',
  primaryColor = '#10b981'
}: CloudflareVideoPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [streamType, setStreamType] = useState<'hls' | 'dash' | 'native'>('hls');
  const [hlsInstance, setHlsInstance] = useState<any>(null);
  const [dashInstance, setDashInstance] = useState<any>(null);
  const [videoElement, setVideoElement] = useState<HTMLVideoElement | null>(null);

  const hlsUrl = `https://customer-5yz20vgnhpok0kcp.cloudflarestream.com/${videoId}/manifest/video.m3u8`;
  const dashUrl = `https://customer-5yz20vgnhpok0kcp.cloudflarestream.com/${videoId}/manifest/video.mpd`;
  const thumbnailApiUrl = `https://customer-5yz20vgnhpok0kcp.cloudflarestream.com/${videoId}/thumbnails/thumbnail.jpg`;
  const watchUrl = `https://customer-5yz20vgnhpok0kcp.cloudflarestream.com/${videoId}/watch`;

  const STORAGE_KEY = `video-progress-${videoId}`;

  const addDebugLog = (message: string) => console.log(`[Player] ${message}`);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const video = document.createElement('video');
    video.className = 'w-full h-full object-cover rounded-xl';
    video.controls = controls;
    video.autoplay = autoplay;
    video.muted = autoplay;
    video.poster = thumbnailUrl || thumbnailApiUrl;
    video.preload = 'auto';

    // Récupérer la position sauvegardée
    const savedTime = parseFloat(localStorage.getItem(STORAGE_KEY) || '0');
    if (!isNaN(savedTime)) video.currentTime = savedTime;

    video.addEventListener('loadedmetadata', () => {
      setDuration(video.duration || 0);
      setIsLoading(false);
    });

    video.addEventListener('canplay', () => setIsLoading(false));
    video.addEventListener('play', () => setIsPlaying(true));
    video.addEventListener('pause', () => setIsPlaying(false));
    video.addEventListener('timeupdate', () => {
      setCurrentTime(video.currentTime);
      // Sauvegarder la position en continu
      localStorage.setItem(STORAGE_KEY, video.currentTime.toString());
    });
    video.addEventListener('volumechange', () => {
      setVolume(video.volume);
      setIsMuted(video.muted);
    });

    setVideoElement(video);
    if (containerRef.current) containerRef.current.appendChild(video);
    tryHlsPlayback(video);

    // Stopper la vidéo si l’utilisateur quitte ou refresh la page
    const handleBeforeUnload = () => {
      if (video) video.pause();
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      if (hlsInstance) hlsInstance.destroy();
      if (dashInstance) dashInstance.destroy();
      if (video.parentNode) video.parentNode.removeChild(video);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [videoId]);

  const tryHlsPlayback = (video: HTMLVideoElement) => {
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = hlsUrl;
      return;
    }

    import('hls.js').then(HlsLib => {
      if (HlsLib.default.isSupported()) {
        const hls = new HlsLib.default({ debug: false });
        hls.loadSource(hlsUrl);
        hls.attachMedia(video);
        setHlsInstance(hls);
        setStreamType('hls');
        hls.on(HlsLib.default.Events.MANIFEST_PARSED, () => setIsLoading(false));
      } else {
        tryDashPlayback(video);
      }
    });
  };

  const tryDashPlayback = (video: HTMLVideoElement) => {
    import('dashjs').then(dashLib => {
      const player = dashLib.MediaPlayer().create();
      player.initialize(video, dashUrl, autoplay);
      setDashInstance(player);
      setStreamType('dash');
      player.on('streamInitialized', () => setIsLoading(false));
    });
  };

  const togglePlay = () => { if (!videoElement) return; isPlaying ? videoElement.pause() : videoElement.play(); };
  const toggleMute = () => { if (videoElement) videoElement.muted = !isMuted; };
  const setVideoVolume = (newVolume: number) => { if (videoElement) videoElement.volume = Math.max(0, Math.min(1, newVolume)); };
  const seekTo = (time: number) => { if (videoElement) videoElement.currentTime = Math.max(0, Math.min(duration, time)); };
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) containerRef.current.requestFullscreen().then(() => setIsFullscreen(true));
    else document.exitFullscreen().then(() => setIsFullscreen(false));
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      ref={containerRef}
      className={`relative w-full rounded-xl overflow-hidden bg-black ${className}`}
      style={{ aspectRatio: '16/9', maxHeight: '80vh' }}
    >
      {isLoading && (
        <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mb-4 mx-auto"></div>
            <p className="text-white text-sm">Chargement {streamType.toUpperCase()}...</p>
            <p className="text-zinc-400 text-xs mt-2">{title || `Video ${videoId}`}</p>
          </div>
        </div>
      )}

      {videoElement && !controls && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity z-20">
          <div className="mb-3">
            <div
              className="w-full h-1 bg-gray-600 rounded-full cursor-pointer"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const percentage = (e.clientX - rect.left) / rect.width;
                seekTo(percentage * duration);
              }}
            >
              <div className="h-full bg-blue-500 rounded-full transition-all duration-150" style={{ width: `${progressPercentage}%` }} />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button onClick={togglePlay} className="text-white hover:text-gray-300 transition-colors">
              {isPlaying ? <Pause size={24} /> : <Play size={24} />}
            </button>

            <button onClick={toggleMute} className="text-white hover:text-gray-300 transition-colors">
              {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>

            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={(e) => setVideoVolume(parseFloat(e.target.value))}
              className="w-20 h-1 bg-gray-600 rounded-full"
            />

            <div className="flex-1 text-white text-sm font-mono">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>

            <button onClick={toggleFullscreen} className="text-white hover:text-gray-300 transition-colors">
              {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
            </button>

            <button
              onClick={() => window.open(watchUrl, '_blank')}
              className="text-white hover:text-gray-300 transition-colors"
              title="Ouvrir dans nouvel onglet"
            >
              <ExternalLink size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
