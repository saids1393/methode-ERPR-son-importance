//hooks/useRealtimeProgress.ts

'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { usePathname } from 'next/navigation';

interface ProgressUpdate {
  type: 'page' | 'quiz';
  pageNumber?: number;
  quizNumber?: number;
  completedPages?: number[];
  completedQuizzes?: number[];
  message: string;
}

interface UseRealtimeProgressOptions {
  minTimeOnPage?: number;
  onProgressUpdate?: (update: ProgressUpdate) => void;
}

export function useRealtimeProgress(options: UseRealtimeProgressOptions = {}) {
  const { minTimeOnPage = 6000, onProgressUpdate } = options;
  const pathname = usePathname();
  const [timeOnPage, setTimeOnPage] = useState(0);
  const [isValidated, setIsValidated] = useState(false);
  const [showCheckmark, setShowCheckmark] = useState(false);
  
  const pageStartTimeRef = useRef<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const validationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Fonction pour extraire les informations de la page actuelle
  const getCurrentPageInfo = useCallback(() => {
    const pathParts = pathname.split('/');
    
    if (pathParts[1] === 'chapitres') {
      const chapterNumber = parseInt(pathParts[2], 10);
      
      if (pathParts[3] === 'quiz') {
        return {
          type: 'quiz' as const,
          chapterNumber,
          pageNumber: null
        };
      } else if (pathParts[3] === 'introduction' || pathParts[3] === 'video') {
        return null; // Pas de validation pour ces pages
      } else {
        const pageNumber = parseInt(pathParts[3], 10);
        return {
          type: 'page' as const,
          chapterNumber,
          pageNumber
        };
      }
    }
    
    return null;
  }, [pathname]);

  // Fonction de validation automatique
  const validateCurrentPage = useCallback(async () => {
    const pageInfo = getCurrentPageInfo();
    if (!pageInfo || isValidated) return false;

    console.log('🎯 [REALTIME] ===== VALIDATION AUTOMATIQUE =====');
    console.log('📍 [REALTIME] Page info:', pageInfo);
    console.log('⏱️ [REALTIME] Temps passé:', timeOnPage, 'ms');

    try {
      const response = await fetch('/api/progress/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pageNumber: pageInfo.type === 'page' ? pageInfo.pageNumber : undefined,
          quizNumber: pageInfo.type === 'quiz' ? pageInfo.chapterNumber : undefined,
          chapterNumber: pageInfo.chapterNumber
        }),
      });

      if (response.ok) {
        const result = await response.json();
        
        if (result.success) {
          console.log('✅ [REALTIME] Validation réussie:', result.message);
          
          setIsValidated(true);
          setShowCheckmark(true);
          
          // Appeler le callback avec les nouvelles données
          if (onProgressUpdate) {
            onProgressUpdate({
              type: result.type,
              pageNumber: result.pageNumber,
              quizNumber: result.quizNumber,
              completedPages: result.completedPages,
              completedQuizzes: result.completedQuizzes,
              message: result.message
            });
          }

          // Masquer la coche après 3 secondes
          setTimeout(() => {
            setShowCheckmark(false);
          }, 3000);

          return true;
        } else {
          console.log('ℹ️ [REALTIME] Validation non nécessaire:', result.message);
        }
      }
    } catch (error) {
      console.error('❌ [REALTIME] Erreur validation:', error);
    }
    
    return false;
  }, [getCurrentPageInfo, isValidated, timeOnPage, onProgressUpdate]);

  // Démarrer le timer quand on arrive sur une nouvelle page
  useEffect(() => {
    console.log('🔄 [REALTIME] Nouvelle page détectée:', pathname);
    
    // Reset des états
    pageStartTimeRef.current = Date.now();
    setTimeOnPage(0);
    setIsValidated(false);
    setShowCheckmark(false);
    
    // Nettoyer les anciens timers
    if (timerRef.current) clearInterval(timerRef.current);
    if (validationTimeoutRef.current) clearTimeout(validationTimeoutRef.current);
    
    // Démarrer le compteur de temps
    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - pageStartTimeRef.current;
      setTimeOnPage(elapsed);
    }, 100); // Mise à jour toutes les 100ms pour fluidité
    
    // Programmer la validation automatique après 6 secondes
    validationTimeoutRef.current = setTimeout(() => {
      console.log('⏰ [REALTIME] 6 secondes écoulées - validation automatique');
      validateCurrentPage();
    }, minTimeOnPage);
    
    console.log('⏰ [REALTIME] Timer démarré pour:', pathname);
    
    // Nettoyage
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (validationTimeoutRef.current) clearTimeout(validationTimeoutRef.current);
    };
  }, [pathname, minTimeOnPage, validateCurrentPage]);

  // Fonction pour valider manuellement si le temps est suffisant
  const validateIfTimeElapsed = useCallback(async () => {
    if (timeOnPage >= minTimeOnPage && !isValidated) {
      return await validateCurrentPage();
    }
    return false;
  }, [timeOnPage, minTimeOnPage, isValidated, validateCurrentPage]);

  return {
    timeOnPage,
    isValidated,
    showCheckmark,
    canValidate: timeOnPage >= minTimeOnPage && !isValidated,
    validateIfTimeElapsed,
    currentPageInfo: getCurrentPageInfo()
  };
}