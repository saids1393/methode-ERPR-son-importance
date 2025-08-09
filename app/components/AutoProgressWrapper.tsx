'use client';

import { useAutoProgress } from '@/hooks/useAutoProgress';
import { useEffect } from 'react';

interface AutoProgressWrapperProps {
  children: React.ReactNode;
  delay?: number;
}

export default function AutoProgressWrapper({ 
  children, 
  delay = 6000 
}: AutoProgressWrapperProps) {
  // Activer l'auto-progression pour toutes les pages de contenu
  const { isEnabled, currentPageInfo } = useAutoProgress({ 
    delay, 
    enabled: true 
  });

  useEffect(() => {
    if (isEnabled && currentPageInfo) {
      console.log('🎯 [AUTO-WRAPPER] Auto-progression activée pour:', currentPageInfo);
    }
  }, [isEnabled, currentPageInfo]);

  return (
    <div className="relative">
      {/* Indicateur visuel d'auto-progression */}
      {isEnabled && currentPageInfo && !currentPageInfo.isCompleted && (
        <div className="fixed top-4 right-4 z-50 bg-green-500/90 backdrop-blur-sm text-white px-4 py-2 rounded-lg shadow-lg border border-green-400/30">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">
              Auto-validation dans 6s
            </span>
          </div>
          <div className="mt-1 w-full bg-green-700 rounded-full h-1">
            <div 
              className="bg-white h-1 rounded-full transition-all duration-6000 ease-linear"
              style={{
                animation: 'progress-bar 6s linear forwards'
              }}
            ></div>
          </div>
        </div>
      )}
      
      {children}
      
      <style jsx>{`
        @keyframes progress-bar {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </div>
  );
}