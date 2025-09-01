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
  const [isMobile, setIsMobile] = useState(false);

  const hlsUrl = `https://customer-5yz20vgnhpok0kcp.cloudflarestream.com/${videoId}/manifest/video.m3u8`;
  const dashUrl = `https://customer-5yz20vgnhpok0kcp.cloudflarestream.com/${videoId}/manifest/video.mpd`;
  const thumbnailApiUrl = `https://customer-5yz20vgnhpok0kcp.cloudflarestream.com/${videoId}/thumbnails/thumbnail.jpg`;
  const STORAGE_KEY = `video-progress-${videoId}`;

  const speedOptions = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2];

  // Détection mobile simple
  useEffect(() => {
    const checkMobile = () => {
      const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      setIsMobile(isMobileDevice);
    };
    checkMobile();
  }, []);

  useEffect(() => {
    document.body.style.overflow = isFullscreen ? 'hidden' : '';
  }, [isFullscreen]);

  useEffect(() => {
    if (!videoRef.current) return;
    const video = videoRef.current;

    // Configuration spécifique mobile AVANT tout le reste
    if (isMobile) {
      video.setAttribute('playsinline', 'true');
      video.setAttribute('webkit-playsinline', 'true');
      video.setAttribute('x5-playsinline', 'true');
      video.setAttribute('x5-video-player-type', 'h5');
      video.muted = true; // Force muted sur mobile pour l'autoload
      video.preload = 'metadata'; // Charge au moins les métadonnées
    }

    const savedTime = parseFloat(localStorage.getItem(STORAGE_KEY) || '0');

    // Event listeners avec gestion mobile améliorée
    const handleLoadedMetadata = () => {
      console.log('Metadata loaded, duration:', video.duration);
      setDuration(video.duration || 0);
      if (!isNaN(savedTime) && savedTime > 0) {
        video.currentTime = savedTime;
      }
    };

    const handleCanPlay = () => {
      console.log('Can play - duration:', video.duration);
      if (!duration && video.duration) {
        setDuration(video.duration);
      }
    };

    const handleLoadedData = () => {
      console.log('Data loaded - duration:', video.duration);
      if (!duration && video.duration) {
        setDuration(video.duration);
      }
    };

    const handleDurationChange = () => {
      console.log('Duration changed:', video.duration);
      if (video.duration && video.duration !== Infinity) {
        setDuration(video.duration);
      }
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('durationchange', handleDurationChange);
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

    // Logique de chargement vidéo
    const loadVideo = () => {
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        console.log('Using native HLS support');
        video.src = hlsUrl;
        setStreamType('native');
        
        // Force le chargement des métadonnées sur mobile
        if (isMobile) {
          video.load();
        }
      } else {
        import('hls.js').then(HlsLib => {
          if (HlsLib.default.isSupported()) {
            console.log('Using HLS.js');
            const hls = new HlsLib.default({ 
              debug: false,
              startLevel: -1,
              capLevelToPlayerSize: true,
              maxBufferLength: 30
            });
            
            hls.on(HlsLib.default.Events.MANIFEST_PARSED, () => {
              console.log('HLS manifest parsed');
            });
            
            hls.on(HlsLib.default.Events.ERROR, (event: any, data: any) => {
              if (data.fatal) {
                console.log('HLS fatal error, fallback to native');
                hls.destroy();
                video.src = hlsUrl;
                setStreamType('native');
                if (isMobile) video.load();
              }
            });
            
            hls.loadSource(hlsUrl);
            hls.attachMedia(video);
            setHlsInstance(hls);
            setStreamType('hls');
          } else {
            console.log('HLS.js not supported, trying DASH');
            import('dashjs').then(dashLib => {
              const player = dashLib.MediaPlayer().create();
              player.initialize(video, dashUrl, false);
              setDashInstance(player);
              setStreamType('dash');
            }).catch(() => {
              console.log('DASH failed, using native fallback');
              video.src = hlsUrl;
              setStreamType('native');
              if (isMobile) video.load();
            });
          }
        }).catch(() => {
          console.log('HLS.js loading failed, using native fallback');
          video.src = hlsUrl;
          setStreamType('native');
          if (isMobile) video.load();
        });
      }
    };

    loadVideo();

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('durationchange', handleDurationChange);
      video.removeEventListener('play', () => setIsPlaying(true));
      video.removeEventListener('pause', () => setIsPlaying(false));
      video.removeEventListener('timeupdate', () => {
        setCurrentTime(video.currentTime);
        localStorage.setItem(STORAGE_KEY, video.currentTime.toString());
      });
      video.removeEventListener('volumechange', () => {
        setVolume(video.volume);
        setIsMuted(video.muted);
      });
      
      if (hlsInstance) hlsInstance.destroy();
      if (dashInstance) dashInstance.destroy();
    };
  }, [videoId, isMobile, duration]);

  const handleMouseMove = () => {
    if (!isMobile) {
      setShowControls(true);
      if (controlsTimeout) clearTimeout(controlsTimeout);
      const timeout = setTimeout(() => {
        if (isPlaying) setShowControls(false);
      }, 3000);
      setControlsTimeout(timeout);
    }
  };

  const handleTouchStart = () => {
    if (isMobile) {
      setShowControls(true);
      if (controlsTimeout) clearTimeout(controlsTimeout);
      const timeout = setTimeout(() => {
        if (isPlaying) setShowControls(false);
      }, 4000);
      setControlsTimeout(timeout);
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile && controlsTimeout) {
      clearTimeout(controlsTimeout);
      if (isPlaying) {
        const timeout = setTimeout(() => setShowControls(false), 1000);
        setControlsTimeout(timeout);
      }
    }
  };

  const togglePlay = async () => {
    if (!videoRef.current) return;
    try {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        // Sur mobile, force le chargement si pas encore fait
        if (isMobile && (!duration || duration === 0)) {
          console.log('Forcing video load on mobile');
          videoRef.current.load();
          // Attendre un peu que les métadonnées se chargent
          await new Promise(resolve => setTimeout(resolve, 500));
        }
        
        await videoRef.current.play();
        
        // Unmute après le premier play réussi sur mobile
        if (isMobile && videoRef.current.muted) {
          setTimeout(() => {
            if (videoRef.current) {
              videoRef.current.muted = false;
            }
          }, 1000);
        }
      }
    } catch (err) {
      console.log("Erreur de lecture:", err);
      // Retry avec load() sur mobile
      if (isMobile && !isPlaying) {
        try {
          videoRef.current.load();
          await new Promise(resolve => setTimeout(resolve, 1000));
          videoRef.current.muted = true;
          await videoRef.current.play();
        } catch (mutedErr) {
          console.log("Échec même avec reload:", mutedErr);
        }
      }
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
  };

  const setVideoVolume = (newVolume: number) => {
    if (!videoRef.current) return;
    videoRef.current.volume = Math.max(0, Math.min(1, newVolume));
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
    } else if (isMobile && (videoRef.current as any).webkitEnterFullscreen) {
      // Fullscreen natif sur iOS
      (videoRef.current as any).webkitEnterFullscreen();
      setIsFullscreen(true);
    } else {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true));
    }
  }

  const handleVideoClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isMobile) {
      // Sur mobile, simple toggle play/pause
      togglePlay();
      return;
    }

    // Comportement desktop original
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
      style={{ 
        aspectRatio: isFullscreen ? undefined : '16/9', 
        maxHeight: isFullscreen ? '100vh' : '80vh',
        touchAction: isMobile ? 'manipulation' : 'auto'
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
    >
      <video
        ref={videoRef}
        className={`w-full h-full ${isFullscreen ? 'object-contain' : 'object-cover rounded-xl'}`}
        autoPlay={false}
        muted={isMobile}
        playsInline={true}
        poster={thumbnailUrl || thumbnailApiUrl}
        preload={isMobile ? "metadata" : "auto"}
        controls={false}
        crossOrigin="anonymous"
      />

      <div 
        className="absolute inset-0 cursor-pointer z-10" 
        onClick={handleVideoClick}
        style={{ touchAction: isMobile ? 'manipulation' : 'auto' }}
      />

      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
          <div 
            className={`bg-black/70 rounded-full p-6 pointer-events-auto cursor-pointer ${
              isMobile ? 'scale-110' : ''
            }`} 
            onClick={togglePlay}
            style={{ touchAction: 'manipulation' }}
          >
            <Play size={isMobile ? 56 : 48} className="text-white ml-2" />
          </div>
        </div>
      )}

      <div
        className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent ${
          isMobile ? 'p-3' : 'p-4'
        } z-30 transition-opacity duration-300 ${
          showControls || !isPlaying ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className={isMobile ? 'mb-3' : 'mb-4'}>
          <div
            className={`w-full ${isMobile ? 'h-2' : 'h-1'} bg-gray-600 rounded-full cursor-pointer hover:h-2 transition-all duration-200`}
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const perc = (e.clientX - rect.left) / rect.width;
              seekTo(perc * duration);
            }}
            style={{ touchAction: 'manipulation' }}
          >
            <div className="h-full bg-blue-400 rounded-full relative" style={{ width: `${progressPercentage}%` }}>
              <div className={`absolute right-0 top-1/2 transform -translate-y-1/2 ${
                isMobile ? 'w-4 h-4' : 'w-3 h-3'
              } bg-blue-400 rounded-full opacity-0 hover:opacity-100 transition-opacity`} />
            </div>
          </div>
        </div>

        <div className={`flex items-center ${isMobile ? 'space-x-3' : 'space-x-4'} relative`}>
          <button 
            onClick={togglePlay} 
            className="text-white hover:text-gray-300 transition-colors"
            style={{ touchAction: 'manipulation' }}
          >
            {isPlaying ? <Pause size={isMobile ? 28 : 24} /> : <Play size={isMobile ? 28 : 24} />}
          </button>

          {/* Contrôles audio - cachés sur très petit écran mobile */}
          {!isMobile && (
            <>
              <button
                onClick={toggleMute}
                className={`transition-colors ${isMuted ? 'text-white hover:text-gray-300' : 'text-blue-400 hover:text-blue-300'}`}
              >
                {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </button>

              <div className="flex items-center space-x-2">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={volume}
                  onChange={(e) => setVideoVolume(parseFloat(e.target.value))}
                  className="w-20 h-1 bg-gray-600 rounded-full appearance-none cursor-pointer
                           [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 
                           [&::-webkit-slider-thumb]:bg-blue-400 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #60a5fa 0%, #60a5fa ${volume * 100}%, #4b5563 ${volume * 100}%, #4b5563 100%)`
                  }}
                />
              </div>
            </>
          )}

          <div className={`text-white ${isMobile ? 'text-xs' : 'text-sm'} font-mono`}>
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>

          <div className="flex-1" />

          {/* Menu des paramètres - caché sur mobile pour économiser l'espace */}
          {!isMobile && (
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
          )}

          <button 
            onClick={toggleFullscreen} 
            className="text-white hover:text-gray-300 transition-colors"
            style={{ touchAction: 'manipulation' }}
          >
            {isFullscreen ? <Minimize size={isMobile ? 24 : 20} /> : <Maximize size={isMobile ? 24 : 20} />}
          </button>
        </div>
      </div>
    </div>
  );
}