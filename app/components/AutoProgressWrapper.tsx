'use client';

import { useAutoProgress } from '@/hooks/useAutoProgress';
import { useEffect, useState, useRef } from 'react';
import RealtimeProgressIndicator from './RealtimeProgressIndicator';

interface AutoProgressWrapperProps {
  children: React.ReactNode;
  minTimeOnPage?: number;
}

export default function AutoProgressWrapper({ 
  children, 
  minTimeOnPage = 6000 
}: AutoProgressWrapperProps) {
  
  const [timeOnPage, setTimeOnPage] = useState(0);

  // ✅ Ref pour tracker le temps (pas de state!)
  const timeTrackerRef = useRef<NodeJS.Timeout | null>(null);
  
  // ✅ UTILISE useAutoProgress
  const {
    currentPageInfo,
    hasValidated,
    getTimeOnCurrentPage,
  } = useAutoProgress({
    minTimeOnPage,
    enabled: true
  });

  // ✅ SIMPLIFIÉ: Update le temps SEULEMENT si pas validé
  // Et s'arrête une fois validé
  useEffect(() => {
    console.log('🔄 [WRAPPER] Setup time tracker');
    
    // ✅ Si déjà validé au mount, ne rien faire
    if (hasValidated) {
      console.log('⏸️ [WRAPPER] Déjà validé, pas de timer');
      return;
    }

    timeTrackerRef.current = setInterval(() => {
      const elapsed = getTimeOnCurrentPage();
      setTimeOnPage(elapsed);
      
      // ✅ Si atteint 6 sec, arrêter le timer
      if (elapsed >= minTimeOnPage) {
        console.log('⏸️ [WRAPPER] 6 sec atteintes, arrêt du timer');
        if (timeTrackerRef.current) {
          clearInterval(timeTrackerRef.current);
          timeTrackerRef.current = null;
        }
      }
    }, 100);

    return () => {
      if (timeTrackerRef.current) {
        clearInterval(timeTrackerRef.current);
      }
    };
  }, []);  // ✅ VIDE! Pas de dépendances!

  // ✅ Quand on change de page (hasValidated devient FALSE)
  // Reset tout
  useEffect(() => {
    if (!hasValidated) {
      console.log('🔄 [WRAPPER] Page change detected, reset');
      setTimeOnPage(0);

      // Redémarrer le timer
      if (timeTrackerRef.current) {
        clearInterval(timeTrackerRef.current);
      }

      timeTrackerRef.current = setInterval(() => {
        const elapsed = getTimeOnCurrentPage();
        setTimeOnPage(elapsed);

        if (elapsed >= minTimeOnPage) {
          console.log('⏸️ [WRAPPER] 6 sec atteintes, arrêt du timer');
          if (timeTrackerRef.current) {
            clearInterval(timeTrackerRef.current);
            timeTrackerRef.current = null;
          }
        }
      }, 100);

      return () => {
        if (timeTrackerRef.current) {
          clearInterval(timeTrackerRef.current);
        }
      };
    }
  }, [hasValidated, getTimeOnCurrentPage, minTimeOnPage]);

  // Ne pas afficher le wrapper si pas de page validable
  if (!currentPageInfo) {
    console.log('ℹ️ [WRAPPER] Pas de currentPageInfo');
    return <>{children}</>;
  }

  return (
    <div className="relative">
      {children}
      
      <RealtimeProgressIndicator
        timeOnPage={timeOnPage}
        isValidated={hasValidated}
        showCheckmark={hasValidated}
        canValidate={timeOnPage >= minTimeOnPage && !hasValidated}
        minTime={minTimeOnPage}
      />
    </div>
  );
}