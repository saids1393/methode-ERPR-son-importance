'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useUserProgress } from './useUserProgress';
import { usePathname } from 'next/navigation';

interface UseAutoProgressOptions {
  minTimeOnPage?: number; // Temps minimum en ms (par défaut 6000)
  enabled?: boolean;      // Activer/désactiver l’auto-progression
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

  // Récupérer les infos de la page actuelle
  const getCurrentPageInfo = useCallback(() => {
    const pathParts = pathname.split('/');

    if (pathParts[1] === 'chapitres') {
      const chapterNumber = parseInt(pathParts[2], 10);

      if (pathParts[3] === 'quiz') {
        return {
          type: 'quiz' as const,
          chapterNumber,
          pageNumber: null,
          isCompleted: completedQuizzes.has(chapterNumber),
        };
      } else if (pathParts[3] === 'introduction' || pathParts[3] === 'video') {
        // Pas d’auto-validation pour intro/vidéo
        return null;
      } else {
        const pageNumber = parseInt(pathParts[3], 10);
        return {
          type: 'page' as const,
          chapterNumber,
          pageNumber,
          isCompleted: completedPages.has(pageNumber),
        };
      }
    }

    return null;
  }, [pathname, completedPages, completedQuizzes]);

  // Valider la page si temps minimum écoulé
  const validateCurrentPageIfTimeElapsed = useCallback(async () => {
    if (!enabled || isProfessorMode || hasValidatedRef.current) return false;

    const currentTime = Date.now();
    const timeOnPage = currentTime - pageStartTimeRef.current;

    if (timeOnPage < minTimeOnPage) return false;

    const pageInfo = getCurrentPageInfo();
    if (!pageInfo || pageInfo.isCompleted) return false;

    hasValidatedRef.current = true;

    try {
      if (pageInfo.type === 'page' && pageInfo.pageNumber !== null) {
        // Exclure certaines pages spécifiques
        if (
          pageInfo.pageNumber === 0 ||
          pageInfo.pageNumber === 30 ||
          pageInfo.chapterNumber === 0 ||
          pageInfo.chapterNumber === 11
        ) {
          return false;
        }

        await togglePageCompletion(pageInfo.pageNumber);
      } else if (pageInfo.type === 'quiz') {
        if (pageInfo.chapterNumber === 11) return false;
        await toggleQuizCompletion(pageInfo.chapterNumber);
      }

      return true;
    } catch (error) {
      hasValidatedRef.current = false;
      return false;
    }
  }, [enabled, isProfessorMode, minTimeOnPage, getCurrentPageInfo, togglePageCompletion, toggleQuizCompletion]);

  // Démarrer le timer à chaque changement de page
  useEffect(() => {
    pageStartTimeRef.current = Date.now();
    hasValidatedRef.current = false;
  }, [pathname]);

  // Validation manuelle exposée
  const validateIfTimeElapsed = useCallback(() => {
    return validateCurrentPageIfTimeElapsed();
  }, [validateCurrentPageIfTimeElapsed]);

  // Temps passé sur la page actuelle
  const getTimeOnCurrentPage = useCallback(() => {
    return Date.now() - pageStartTimeRef.current;
  }, []);

  return {
    isEnabled: enabled && !isProfessorMode,
    currentPageInfo: getCurrentPageInfo(),
    validateIfTimeElapsed,
    getTimeOnCurrentPage,
    hasValidated: hasValidatedRef.current,
  };
}
