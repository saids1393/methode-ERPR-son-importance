'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useUserProgress } from './useUserProgress';
import { usePathname } from 'next/navigation';

interface UseAutoProgressOptions {
  delay?: number; // Délai en millisecondes (défaut: 6000ms = 6s)
  enabled?: boolean; // Activer/désactiver l'auto-progression
}

export function useAutoProgress(options: UseAutoProgressOptions = {}) {
  const { delay = 6000, enabled = true } = options;
  const pathname = usePathname();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasTriggeredRef = useRef<boolean>(false);
  
  const { 
    completedPages, 
    completedQuizzes, 
    togglePageCompletion, 
    toggleQuizCompletion,
    isProfessorMode 
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

  // Fonction pour marquer automatiquement comme complété
  const markAsCompleted = useCallback(() => {
    if (!enabled || isProfessorMode) return;
    
    const pageInfo = getCurrentPageInfo();
    if (!pageInfo || pageInfo.isCompleted) return;

    console.log('🎯 [AUTO-PROGRESS] ===== VALIDATION AUTOMATIQUE =====');
    console.log('📍 [AUTO-PROGRESS] Page actuelle:', pageInfo);
    console.log('⏱️ [AUTO-PROGRESS] Délai écoulé:', delay, 'ms');

    if (pageInfo.type === 'page' && pageInfo.pageNumber !== null) {
      // Exclure les pages spéciales (0, 30) et les chapitres spéciaux (0, 11)
      if (pageInfo.pageNumber === 0 || pageInfo.pageNumber === 30 || 
          pageInfo.chapterNumber === 0 || pageInfo.chapterNumber === 11) {
        console.log('🚫 [AUTO-PROGRESS] Page exclue de l\'auto-progression');
        return;
      }
      
      console.log('📚 [AUTO-PROGRESS] Marquage automatique page', pageInfo.pageNumber);
      togglePageCompletion(pageInfo.pageNumber);
    } else if (pageInfo.type === 'quiz') {
      // Exclure le chapitre 11
      if (pageInfo.chapterNumber === 11) {
        console.log('🚫 [AUTO-PROGRESS] Quiz chapitre 11 exclu de l\'auto-progression');
        return;
      }
      
      console.log('🏆 [AUTO-PROGRESS] Marquage automatique quiz chapitre', pageInfo.chapterNumber);
      toggleQuizCompletion(pageInfo.chapterNumber);
    }

    console.log('✅ [AUTO-PROGRESS] ===== VALIDATION TERMINÉE =====');
  }, [enabled, isProfessorMode, getCurrentPageInfo, delay, togglePageCompletion, toggleQuizCompletion]);

  // Démarrer le timer quand on arrive sur une nouvelle page
  const startTimer = useCallback(() => {
    if (!enabled || isProfessorMode) return;
    
    const pageInfo = getCurrentPageInfo();
    if (!pageInfo) return;

    // Ne pas démarrer le timer si déjà complété
    if (pageInfo.isCompleted) {
      console.log('✅ [AUTO-PROGRESS] Page/Quiz déjà complété - pas de timer');
      return;
    }

    console.log('⏱️ [AUTO-PROGRESS] ===== DÉMARRAGE TIMER =====');
    console.log('📍 [AUTO-PROGRESS] Page:', pageInfo);
    console.log('⏰ [AUTO-PROGRESS] Délai configuré:', delay, 'ms');

    // Nettoyer le timer précédent
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Réinitialiser le flag
    hasTriggeredRef.current = false;

    // Démarrer le nouveau timer
    timeoutRef.current = setTimeout(() => {
      if (!hasTriggeredRef.current) {
        hasTriggeredRef.current = true;
        markAsCompleted();
      }
    }, delay);

    console.log('🚀 [AUTO-PROGRESS] Timer démarré pour', delay, 'ms');
  }, [enabled, isProfessorMode, getCurrentPageInfo, delay, markAsCompleted]);

  // Arrêter le timer
  const stopTimer = useCallback(() => {
    if (timeoutRef.current) {
      console.log('⏹️ [AUTO-PROGRESS] Timer arrêté');
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    hasTriggeredRef.current = false;
  }, []);

  // Redémarrer le timer quand la page change
  useEffect(() => {
    console.log('🔄 [AUTO-PROGRESS] Changement de page détecté:', pathname);
    stopTimer();
    
    // Petit délai pour laisser React se stabiliser
    const initTimer = setTimeout(() => {
      startTimer();
    }, 100);

    return () => {
      clearTimeout(initTimer);
      stopTimer();
    };
  }, [pathname, startTimer, stopTimer]);

  // Redémarrer le timer si l'état de completion change
  useEffect(() => {
    const pageInfo = getCurrentPageInfo();
    if (pageInfo && !pageInfo.isCompleted) {
      console.log('🔄 [AUTO-PROGRESS] État de completion changé - redémarrage timer');
      stopTimer();
      startTimer();
    }
  }, [completedPages, completedQuizzes, getCurrentPageInfo, startTimer, stopTimer]);

  // Nettoyer au démontage
  useEffect(() => {
    return () => {
      stopTimer();
    };
  }, [stopTimer]);

  // Gestion des événements d'activité utilisateur pour redémarrer le timer
  useEffect(() => {
    if (!enabled || isProfessorMode) return;

    const resetTimer = () => {
      console.log('👆 [AUTO-PROGRESS] Activité utilisateur détectée - redémarrage timer');
      stopTimer();
      startTimer();
    };

    // Événements qui indiquent une activité utilisateur
    const events = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart'];
    
    events.forEach(event => {
      document.addEventListener(event, resetTimer, { passive: true });
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, resetTimer);
      });
    };
  }, [enabled, isProfessorMode, startTimer, stopTimer]);

  return {
    isEnabled: enabled && !isProfessorMode,
    currentPageInfo: getCurrentPageInfo(),
    stopTimer,
    startTimer
  };
}