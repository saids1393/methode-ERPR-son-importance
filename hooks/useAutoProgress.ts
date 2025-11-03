'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useUserProgress } from '@/hooks/useUserProgress';
import { usePathname } from 'next/navigation';

interface UseAutoProgressOptions {
  minTimeOnPage?: number;
  enabled?: boolean;
}

export function useAutoProgress(options: UseAutoProgressOptions = {}) {
  const { minTimeOnPage = 6000, enabled = true } = options;
  const pathname = usePathname();
  
  // ✅ ÉTAT pour la validation
  const [hasValidated, setHasValidated] = useState(false);
  
  const pageStartTimeRef = useRef<number>(0);
  const validationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isValidatingRef = useRef<boolean>(false);
  const hasValidatedRef = useRef<boolean>(false);

  const { 
    togglePageCompletion, 
    toggleQuizCompletion,
    isProfessorMode,
    completedPages,
    completedQuizzes,
  } = useUserProgress();

  // Parser l'URL pour obtenir les infos de la page
  const getCurrentPageInfo = useCallback(() => {
    const pathParts = pathname.split('/');

    if (pathParts[1] === 'chapitres') {
      const chapterNumber = parseInt(pathParts[2], 10);

      if (pathParts[3] === 'quiz') {
        return { type: 'quiz' as const, chapterNumber };
      } else if (pathParts[3] === 'introduction' || pathParts[3] === 'video') {
        return null;
      } else {
        const pageNumber = parseInt(pathParts[3], 10);
        return { type: 'page' as const, chapterNumber, pageNumber };
      }
    }

    return null;
  }, [pathname]);

  // Fonction pour valider
  const validatePage = useCallback(async () => {
    console.log('🔍 [AUTO-PROGRESS] validatePage appelé');
    console.log('  hasValidatedRef.current:', hasValidatedRef.current);
    console.log('  isProfessorMode:', isProfessorMode);
    console.log('  enabled:', enabled);
    console.log('  isValidatingRef.current:', isValidatingRef.current);

    // ✅ CRUCIAL: Si déjà validé (via ref), arrêter IMMÉDIATEMENT!
    if (hasValidatedRef.current) {
      console.log('❌ [AUTO-PROGRESS] Déjà validé, abandon');
      return false;
    }

    // ✅ Si déjà en train de valider, ne pas relancer!
    if (isValidatingRef.current) {
      console.log('⚠️ [AUTO-PROGRESS] Déjà en validation, abandon');
      return false;
    }

    // Si conditions non remplies, ne rien faire
    if (isProfessorMode || !enabled) {
      console.log('❌ [AUTO-PROGRESS] Conditions non remplies');
      return false;
    }

    const pageInfo = getCurrentPageInfo();
    console.log('📍 [AUTO-PROGRESS] Page info:', pageInfo);

    if (!pageInfo) {
      console.log('❌ [AUTO-PROGRESS] Pas de page info');
      return false;
    }

    // Exclure certaines pages
    if (pageInfo.type === 'page') {
      if (pageInfo.pageNumber === 0 || pageInfo.pageNumber === 30 || pageInfo.chapterNumber === 0 || pageInfo.chapterNumber === 11) {
        console.log('❌ [AUTO-PROGRESS] Page exclue');
        return false;
      }
    } else if (pageInfo.type === 'quiz' && pageInfo.chapterNumber === 11) {
      console.log('❌ [AUTO-PROGRESS] Quiz chapitre 11 exclu');
      return false;
    }

    // ✅ Marquer comme en validation
    isValidatingRef.current = true;

    try {
      console.log('📞 [AUTO-PROGRESS] Appel validation...');
      
      if (pageInfo.type === 'page') {
        console.log('  togglePageCompletion:', pageInfo.pageNumber);
        
        // ✅ IMPORTANT: Vérifier si déjà complété avant d'appeler l'API!
        if (completedPages.has(pageInfo.pageNumber)) {
          console.log('  ✅ Page déjà complétée, pas d\'appel API');
        } else {
          console.log('  ❌ Page pas complétée, appel API');
          await togglePageCompletion(pageInfo.pageNumber);
        }
      } else if (pageInfo.type === 'quiz') {
        console.log('  toggleQuizCompletion:', pageInfo.chapterNumber);
        
        // ✅ IMPORTANT: Vérifier si déjà complété avant d'appeler l'API!
        if (completedQuizzes.has(pageInfo.chapterNumber)) {
          console.log('  ✅ Quiz déjà complété, pas d\'appel API');
        } else {
          console.log('  ❌ Quiz pas complété, appel API');
          await toggleQuizCompletion(pageInfo.chapterNumber);
        }
      }

      console.log('✅ [AUTO-PROGRESS] Validation réussie!');
      
      // ✅ Mettre à jour AUSSI la ref!
      hasValidatedRef.current = true;
      setHasValidated(true);
      
      console.log('✅ [AUTO-PROGRESS] VALIDATION COMPLÈTE - Plus aucune validation jusqu\'au prochain changement de page');
      return true;
    } catch (error) {
      console.error('❌ [AUTO-PROGRESS] Erreur:', error);
      return false;
    } finally {
      // ✅ Toujours reset le flag
      isValidatingRef.current = false;
    }
  }, [isProfessorMode, enabled, getCurrentPageInfo, togglePageCompletion, toggleQuizCompletion, completedPages, completedQuizzes]);

  // Quand on arrive sur une nouvelle page
  useEffect(() => {
    console.log('🔄 [AUTO-PROGRESS] Nouvelle page:', pathname);
    
    pageStartTimeRef.current = Date.now();
    setHasValidated(false);
    hasValidatedRef.current = false;
    isValidatingRef.current = false;

    // ✅ Nettoyer l'ancien timeout
    if (validationTimeoutRef.current) {
      clearTimeout(validationTimeoutRef.current);
      validationTimeoutRef.current = null;
    }

    console.log('⏰ [AUTO-PROGRESS] Programmation validation dans:', minTimeOnPage, 'ms');

    // Programmer la validation automatique UNE SEULE FOIS
    validationTimeoutRef.current = setTimeout(() => {
      console.log('⏰ [AUTO-PROGRESS] ===== TIMEOUT DÉCLENCHÉ! =====');
      validatePage();
    }, minTimeOnPage);

    return () => {
      if (validationTimeoutRef.current) {
        clearTimeout(validationTimeoutRef.current);
        validationTimeoutRef.current = null;
      }
    };
  }, [pathname, minTimeOnPage, validatePage]);

  // ✅ Fonction pour valider manuellement (appelée par SidebarContent)
  const validateIfTimeElapsed = useCallback(async () => {
    const timeOnPage = Date.now() - pageStartTimeRef.current;
    
    console.log('🔍 [AUTO-PROGRESS] validateIfTimeElapsed appelé');
    console.log('  timeOnPage:', timeOnPage, 'ms');
    console.log('  minTimeOnPage:', minTimeOnPage, 'ms');
    console.log('  hasValidatedRef.current:', hasValidatedRef.current);
    
    // ✅ CRUCIAL: Ne valider que si pas déjà validé (via ref!)
    if (hasValidatedRef.current) {
      console.log('⚠️ [AUTO-PROGRESS] Déjà validé, abandon');
      return false;
    }
    
    if (timeOnPage >= minTimeOnPage) {
      console.log('⏱️ [AUTO-PROGRESS] Temps suffisant, validation lancée');
      const result = await validatePage();
      console.log('✅ [AUTO-PROGRESS] validatePage résultat:', result);
      return result;
    } else {
      console.log('❌ [AUTO-PROGRESS] Temps insuffisant');
      return false;
    }
  }, [minTimeOnPage, validatePage]);

  // Retourner les valeurs
  return {
    hasValidated,
    isEnabled: enabled && !isProfessorMode,
    currentPageInfo: getCurrentPageInfo(),
    getTimeOnCurrentPage: () => Date.now() - pageStartTimeRef.current,
    validateIfTimeElapsed,
  };
}