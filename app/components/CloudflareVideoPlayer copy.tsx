'use client';

import { useEffect, useRef, useState } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize, Settings } from 'lucide-react';

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
  const videoRef = useRef<HTMLVideoElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [streamType, setStreamType] = useState<'hls' | 'dash' | 'native'>('hls');
  const [hlsInstance, setHlsInstance] = useState<any>(null);
  const [dashInstance, setDashInstance] = useState<any>(null);
  const [showControls, setShowControls] = useState(true);
  const [controlsTimeout, setControlsTimeout] = useState<NodeJS.Timeout | null>(null);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);

  const hlsUrl = `https://customer-5yz20vgnhpok0kcp.cloudflarestream.com/${videoId}/manifest/video.m3u8`;
  const dashUrl = `https://customer-5yz20vgnhpok0kcp.cloudflarestream.com/${videoId}/manifest/video.mpd`;
  const thumbnailApiUrl = `https://customer-5yz20vgnhpok0kcp.cloudflarestream.com/${videoId}/thumbnails/thumbnail.jpg`;
  const STORAGE_KEY = `video-progress-${videoId}`;

  const speedOptions = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2];

  useEffect(() => {
    document.body.style.overflow = isFullscreen ? 'hidden' : '';
  }, [isFullscreen]);

  useEffect(() => {
    if (!videoRef.current) return;
    const video = videoRef.current;

    const savedTime = parseFloat(localStorage.getItem(STORAGE_KEY) || '0');
    if (!isNaN(savedTime)) video.currentTime = savedTime;

    video.addEventListener('loadedmetadata', () => setDuration(video.duration || 0));
    video.addEventListener('play', () => setIsPlaying(true));
    video.addEventListener('pause', () => setIsPlaying(false));
    video.addEventListener('timeupdate', () => {
      setCurrentTime(video.currentTime);
      localStorage.setItem(STORAGE_KEY, video.currentTime.toString());
    });
    video.addEventListener('volumechange', () => {
      setVolume(video.volume);
      setIsMuted(video.muted);
    });

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = hlsUrl;
    } else {
      import('hls.js').then(HlsLib => {
        if (HlsLib.default.isSupported()) {
          const hls = new HlsLib.default({ debug: false });
          hls.loadSource(hlsUrl);
          hls.attachMedia(video);
          setHlsInstance(hls);
          setStreamType('hls');
        } else {
          import('dashjs').then(dashLib => {
            const player = dashLib.MediaPlayer().create();
            player.initialize(video, dashUrl, autoplay);
            setDashInstance(player);
            setStreamType('dash');
          });
        }
      });
    }

    return () => {
      if (hlsInstance) hlsInstance.destroy();
      if (dashInstance) dashInstance.destroy();
    };
  }, [videoId]);

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeout) clearTimeout(controlsTimeout);
    const timeout = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3000);
    setControlsTimeout(timeout);
  };

  const handleMouseLeave = () => {
    if (controlsTimeout) clearTimeout(controlsTimeout);
    if (isPlaying) {
      const timeout = setTimeout(() => setShowControls(false), 1000);
      setControlsTimeout(timeout);
    }
  };

  const togglePlay = async () => {
    if (!videoRef.current) return;
    try {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        await videoRef.current.play();
      }
    } catch (err) {
      console.log("Erreur de lecture :", err);
    }
  };

  // Fonction pour le toggle du son
  const toggleMute = () => {
    if (!videoRef.current) return;
    
    if (isMuted) {
      // Démuter : on remet le son et on s'assure que le volume soit audible
      videoRef.current.muted = false;
      if (videoRef.current.volume < 0.1) {
        videoRef.current.volume = 0.5; // Volume par défaut quand on démute
        setVolume(0.5);
      }
      setIsMuted(false);
    } else {
      // Muter
      videoRef.current.muted = true;
      setIsMuted(true);
    }
  };

  const setVideoVolume = (newVolume: number) => {
    if (!videoRef.current) return;
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    videoRef.current.volume = clampedVolume;
    
    // Si on change le volume et qu'il est > 0, on démute automatiquement
    if (clampedVolume > 0 && isMuted) {
      videoRef.current.muted = false;
      setIsMuted(false);
    }
    
    setVolume(clampedVolume);
  };

  const seekTo = (time: number) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = Math.max(0, Math.min(duration, time));
  };

  const skip = (seconds: number) => {
    if (!videoRef.current) return;
    const newTime = videoRef.current.currentTime + seconds;
    seekTo(newTime);
  };

  const changePlaybackRate = (rate: number) => {
    if (!videoRef.current) return;
    videoRef.current.playbackRate = rate;
    setPlaybackRate(rate);
    setShowSpeedMenu(false);
    setShowSettingsMenu(false);
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  function toggleFullscreen(event: React.MouseEvent<HTMLButtonElement>): void {
    if (!containerRef.current || !videoRef.current) return;

    if (document.fullscreenElement) {
      document.exitFullscreen().then(() => setIsFullscreen(false));
    } else if ((videoRef.current as any).webkitEnterFullscreen) {
      (videoRef.current as any).webkitEnterFullscreen();
      setIsFullscreen(true);
    } else {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true));
    }
  }

  const handleVideoClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;

    if (clickX < width * 0.3) skip(-10);
    else if (clickX > width * 0.7) skip(10);
    else togglePlay();
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full overflow-hidden bg-black group ${className} ${
        isFullscreen ? 'fixed top-0 left-0 w-screen h-screen z-[9999] flex items-center justify-center' : 'rounded-xl'
      }`}
      style={{ aspectRatio: isFullscreen ? undefined : '16/9', maxHeight: isFullscreen ? '100vh' : '80vh' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleMouseMove}
      onTouchEnd={handleMouseLeave}
    >
      <video
        ref={videoRef}
        className={`w-full h-full ${isFullscreen ? 'object-contain' : 'object-cover rounded-xl'}`}
        autoPlay={autoplay}
        muted={false}
        playsInline
        webkit-playsinline="true"
        x5-playsinline="true"
        poster={thumbnailUrl || thumbnailApiUrl}
        preload="auto"
        controls={false}
      />

      <div className="absolute inset-0 cursor-pointer z-10" onClick={handleVideoClick} />

      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
          <div className="bg-black/70 rounded-full p-6" onClick={togglePlay}>
            <Play size={48} className="text-white ml-2" />
          </div>
        </div>
      )}

      <div
        className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4 z-30 transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="mb-4">
          <div
            className="w-full h-1 bg-gray-600 rounded-full cursor-pointer hover:h-2 transition-all duration-200"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const perc = (e.clientX - rect.left) / rect.width;
              seekTo(perc * duration);
            }}
          >
            <div className="h-full bg-blue-400 rounded-full relative" style={{ width: `${progressPercentage}%` }}>
              <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-blue-400 rounded-full opacity-0 hover:opacity-100 transition-opacity" />
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4 relative">
          <button onClick={togglePlay} className="text-white hover:text-gray-300 transition-colors">
            {isPlaying ? <Pause size={24} /> : <Play size={24} />}
          </button>

          <button
            onClick={toggleMute}
            className={`transition-colors ${isMuted ? 'text-gray-400 hover:text-gray-300' : 'text-white hover:text-blue-300'}`}
          >
            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>

          <div className="flex items-center space-x-2">
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={isMuted ? 0 : volume} // Affiche 0 quand muted
              onChange={(e) => setVideoVolume(parseFloat(e.target.value))}
              className="w-20 h-1 bg-gray-600 rounded-full appearance-none cursor-pointer
                       [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 
                       [&::-webkit-slider-thumb]:bg-blue-400 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer"
              style={{
                background: `linear-gradient(to right, #60a5fa 0%, #60a5fa ${(isMuted ? 0 : volume) * 100}%, #4b5563 ${(isMuted ? 0 : volume) * 100}%, #4b5563 100%)`
              }}
            />
          </div>

          <div className="text-white text-sm font-mono">
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>

          <div className="flex-1" />

          <div className="relative flex items-center">
            <button
              onClick={() => {
                setShowSettingsMenu(!showSettingsMenu);
                setShowSpeedMenu(false);
              }}
              className="text-white hover:text-gray-300 transition-colors flex items-center relative"
            >
              <Settings size={20} />
              <span className="absolute -top-3 -right-3 bg-blue-400 text-black text-[10px] font-bold px-0.5 py-0.5 rounded leading-none">
                HD
              </span>
            </button>

            {showSettingsMenu && (
              <div className="absolute bottom-full right-0 mb-2 bg-black/90 rounded-lg p-2 min-w-48">
                <button
                  onClick={() => {
                    setShowSpeedMenu(true);
                    setShowSettingsMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 text-white hover:bg-gray-700 rounded flex justify-between items-center"
                >
                  <span>Vitesse de lecture</span>
                  <span className="text-gray-400">{playbackRate}x</span>
                </button>
              </div>
            )}

            {showSpeedMenu && (
              <div className="absolute bottom-full right-0 mb-2 bg-black/90 rounded-lg p-2 min-w-32">
                <div className="px-3 py-2 text-gray-300 text-sm border-b border-gray-600 mb-1">Vitesse</div>
                {speedOptions.map((speed) => (
                  <button
                    key={speed}
                    onClick={() => changePlaybackRate(speed)}
                    className={`w-full text-left px-3 py-2 text-white hover:bg-gray-700 rounded ${
                      playbackRate === speed ? 'bg-blue-500' : ''
                    }`}
                  >
                    {speed}x {speed === 1 ? '(Normal)' : ''}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button onClick={toggleFullscreen} className="text-white hover:text-gray-300 transition-colors">
            {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
          </button>
        </div>
      </div>
    </div>
  );
}