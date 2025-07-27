'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { usePathname } from 'next/navigation';

export function useTimeTracking() {
  const [totalTime, setTotalTime] = useState(0); // en secondes
  const [isActive, setIsActive] = useState(true);
  const [showInactivityWarning, setShowInactivityWarning] = useState(false);
  const pathname = usePathname();
  
  const startTimeRef = useRef<number>(Date.now());
  const lastActivityRef = useRef<number>(Date.now());
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const inactivityTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const warningTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Vérifier si on est dans une page de chapitre
  const isInChapter = useCallback(() => {
    return pathname.startsWith('/chapitres/') && 
           !pathname.includes('/introduction') &&
           !pathname.includes('/quiz');
  }, [pathname]);

  // Sauvegarder le temps en localStorage
  const saveTime = useCallback((timeToAdd: number) => {
    const currentTotal = parseInt(localStorage.getItem('totalChapterTime') || '0');
    const newTotal = currentTotal + timeToAdd;
    localStorage.setItem('totalChapterTime', newTotal.toString());
    setTotalTime(newTotal);
  }, []);

  // Charger le temps depuis localStorage
  const loadTime = useCallback(() => {
    const savedTime = parseInt(localStorage.getItem('totalChapterTime') || '0');
    setTotalTime(savedTime);
  }, []);

  // Réinitialiser l'activité
  const resetActivity = useCallback(() => {
    lastActivityRef.current = Date.now();
    setIsActive(true);
    setShowInactivityWarning(false);
    
    // Nettoyer les timeouts existants
    if (warningTimeoutRef.current) {
      clearTimeout(warningTimeoutRef.current);
    }
    if (inactivityTimeoutRef.current) {
      clearTimeout(inactivityTimeoutRef.current);
    }

    // Programmer l'avertissement à 8 minutes (8 * 60 * 1000 ms)
    warningTimeoutRef.current = setTimeout(() => {
      if (isInChapter()) {
        setShowInactivityWarning(true);
      }
    }, 8 * 60 * 1000);

    // Programmer l'arrêt du temps à 10 minutes (10 * 60 * 1000 ms)
    inactivityTimeoutRef.current = setTimeout(() => {
      if (isInChapter()) {
        setIsActive(false);
        setShowInactivityWarning(false);
      }
    }, 10 * 60 * 1000);
  }, [isInChapter]);

  // Gestionnaires d'événements pour détecter l'activité
  const handleActivity = useCallback(() => {
    resetActivity();
  }, [resetActivity]);

  // Formater le temps en heures:minutes
  const formatTime = useCallback((seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}min`;
    }
    return `${minutes}min`;
  }, []);

  // Continuer l'activité (fermer l'avertissement)
  const continueActivity = useCallback(() => {
    resetActivity();
  }, [resetActivity]);

  // Effet principal pour gérer le suivi du temps
  useEffect(() => {
    loadTime();

    if (isInChapter()) {
      startTimeRef.current = Date.now();
      resetActivity();

      // Démarrer l'intervalle de suivi du temps
      intervalRef.current = setInterval(() => {
        if (isActive) {
          const now = Date.now();
          const timeSpent = Math.floor((now - startTimeRef.current) / 1000);
          
          if (timeSpent > 0) {
            saveTime(timeSpent);
            startTimeRef.current = now;
          }
        }
      }, 30000); // Sauvegarder toutes les 30 secondes

      // Ajouter les écouteurs d'événements
      const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
      events.forEach(event => {
        document.addEventListener(event, handleActivity, true);
      });

      return () => {
        // Sauvegarder le temps restant avant de quitter
        if (isActive) {
          const now = Date.now();
          const timeSpent = Math.floor((now - startTimeRef.current) / 1000);
          if (timeSpent > 0) {
            saveTime(timeSpent);
          }
        }

        // Nettoyer les intervalles et timeouts
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
        if (inactivityTimeoutRef.current) {
          clearTimeout(inactivityTimeoutRef.current);
        }
        if (warningTimeoutRef.current) {
          clearTimeout(warningTimeoutRef.current);
        }

        // Supprimer les écouteurs d'événements
        events.forEach(event => {
          document.removeEventListener(event, handleActivity, true);
        });
      };
    } else {
      // Si on n'est pas dans un chapitre, sauvegarder le temps accumulé
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (isActive) {
        const now = Date.now();
        const timeSpent = Math.floor((now - startTimeRef.current) / 1000);
        if (timeSpent > 0) {
          saveTime(timeSpent);
        }
      }
    }
  }, [pathname, isActive, isInChapter, resetActivity, handleActivity, saveTime, loadTime]);

  return {
    totalTime,
    formattedTime: formatTime(totalTime),
    isActive,
    showInactivityWarning,
    continueActivity,
    isInChapter: isInChapter()
  };
}