'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useUserProgress } from './useUserProgress';
import { usePathname } from 'next/navigation';

interface UseAutoProgressOptions {
  minTimeOnPage?: number; // Temps minimum en millisecondes (défaut: 6000ms = 6s)
  enabled?: boolean; // Activer/désactiver l'auto-progression
}

export function useAutoProgress(options: UseAutoProgressOptions = {}) {
  const { minTimeOnPage = 6000, enabled = true } = options;
  const pathname = usePathname();
  const pageStartTimeRef = useRef<number>(0);
  const hasValidatedRef = useRef<boolean>(false);
  
  const { 
    completedPages, 
    completedQuizzes, 
    togglePageCompletion, 
    toggleQuizCompletion,
    isProfessorMode,
    forceUpdate
  } = useUserProgress();

  // Fonction pour extraire les informations de la page actuelle
  const getCurrentPageInfo = useCallback(() => {
    const pathParts = pathname.split('/');
    
    if (pathParts[1] === 'chapitres') {
      const chapterNumber = parseInt(pathParts[2], 10);
      
      if (pathParts[3] === 'quiz') {
        return {
          type: 'quiz' as const,
          chapterNumber,
          pageNumber: null,
          isCompleted: completedQuizzes.has(chapterNumber)
        };
      } else if (pathParts[3] === 'introduction' || pathParts[3] === 'video') {
        // Pour les introductions et vidéos, pas de validation automatique
        return null;
      } else {
        const pageNumber = parseInt(pathParts[3], 10);
        return {
          type: 'page' as const,
          chapterNumber,
          pageNumber,
          isCompleted: completedPages.has(pageNumber)
        };
      }
    }
    
    return null;
  }, [pathname, completedPages, completedQuizzes]);

  // Fonction pour valider la page courante si le temps minimum est écoulé
  const validateCurrentPageIfTimeElapsed = useCallback(async () => {
    if (!enabled || isProfessorMode || hasValidatedRef.current) return false;
    
    const currentTime = Date.now();
    const timeOnPage = currentTime - pageStartTimeRef.current;
    
    console.log('🕐 [AUTO-PROGRESS] Vérification temps écoulé:', {
      timeOnPage,
      minTimeRequired: minTimeOnPage,
      canValidate: timeOnPage >= minTimeOnPage
    });
    
    if (timeOnPage < minTimeOnPage) {
      console.log('⏱️ [AUTO-PROGRESS] Temps insuffisant sur la page');
      return false;
    }
    
    const pageInfo = getCurrentPageInfo();
    if (!pageInfo || pageInfo.isCompleted) {
      console.log('🚫 [AUTO-PROGRESS] Page non éligible ou déjà complétée');
      return false;
    }

    console.log('🎯 [AUTO-PROGRESS] ===== VALIDATION AUTOMATIQUE =====');
    console.log('📍 [AUTO-PROGRESS] Page actuelle:', pageInfo);
    console.log('⏱️ [AUTO-PROGRESS] Temps passé:', timeOnPage, 'ms');

    hasValidatedRef.current = true;

    try {
      if (pageInfo.type === 'page' && pageInfo.pageNumber !== null) {
        // Exclure les pages spéciales
        if (pageInfo.pageNumber === 0 || pageInfo.pageNumber === 30 || 
            pageInfo.chapterNumber === 0 || pageInfo.chapterNumber === 11) {
          console.log('🚫 [AUTO-PROGRESS] Page exclue de l\'auto-progression');
          return false;
        }
        
        console.log('📄 [AUTO-PROGRESS] Validation page:', pageInfo.pageNumber);
        await togglePageCompletion(pageInfo.pageNumber);
      } else if (pageInfo.type === 'quiz') {
        // Exclure le chapitre 11
        if (pageInfo.chapterNumber === 11) {
          console.log('🚫 [AUTO-PROGRESS] Quiz chapitre 11 exclu');
          return false;
        }
        
        console.log('🎯 [AUTO-PROGRESS] Validation quiz:', pageInfo.chapterNumber);
        await toggleQuizCompletion(pageInfo.chapterNumber);
      }
      
      console.log('✅ [AUTO-PROGRESS] Validation réussie');
      return true;
    } catch (error) {
      console.error('❌ [AUTO-PROGRESS] Erreur lors de la validation:', error);
      hasValidatedRef.current = false;
      return false;
    }
  }, [enabled, isProfessorMode, minTimeOnPage, getCurrentPageInfo, togglePageCompletion, toggleQuizCompletion]);

  // Réinitialiser le timer quand on arrive sur une nouvelle page
  useEffect(() => {
    console.log('🔄 [AUTO-PROGRESS] Nouvelle page détectée:', pathname);
    pageStartTimeRef.current = Date.now();
    hasValidatedRef.current = false;
    
    console.log('⏰ [AUTO-PROGRESS] Timer démarré à:', new Date(pageStartTimeRef.current).toLocaleTimeString());
  }, [pathname]);

  // Fonction exposée pour valider manuellement (appelée lors de la navigation)
  const validateIfTimeElapsed = useCallback(() => {
    return validateCurrentPageIfTimeElapsed();
  }, [validateCurrentPageIfTimeElapsed]);

  // Fonction pour obtenir le temps passé sur la page courante
  const getTimeOnCurrentPage = useCallback(() => {
    return Date.now() - pageStartTimeRef.current;
  }, []);

  return {
    isEnabled: enabled && !isProfessorMode,
    currentPageInfo: getCurrentPageInfo(),
    validateIfTimeElapsed,
    getTimeOnCurrentPage,
    hasValidated: hasValidatedRef.current
  };
}