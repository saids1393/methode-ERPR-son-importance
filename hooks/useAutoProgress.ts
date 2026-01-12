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

    if (pathParts[1] === 'chapitres' || pathParts[1] === 'chapitres-tajwid') {
      const chapterNumber = parseInt(pathParts[2], 10);
      const isTajwid = pathParts[1] === 'chapitres-tajwid';

      if (pathParts[3] === 'quiz') {
        return { type: 'quiz' as const, chapterNumber, isTajwid };
      } else if (pathParts[3] === 'introduction' || pathParts[3] === 'video') {
        return null;
      } else {
        const pageNumber = parseInt(pathParts[3], 10);
        return { type: 'page' as const, chapterNumber, pageNumber, isTajwid };
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

    if (hasValidatedRef.current) {
      console.log('❌ [AUTO-PROGRESS] Déjà validé, abandon');
      return false;
    }

    if (isValidatingRef.current) {
      console.log('⚠️ [AUTO-PROGRESS] Déjà en validation, abandon');
      return false;
    }

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

    // Exclure certaines pages (page 30 et chapitre 11) - uniquement pour Lecture
    if (!pageInfo.isTajwid) {
      if (pageInfo.type === 'page') {
        if (pageInfo.pageNumber === 28 || pageInfo.chapterNumber === 11) {
          console.log('❌ [AUTO-PROGRESS] Page exclue');
          return false;
        }
      } else if (pageInfo.type === 'quiz' && pageInfo.chapterNumber === 11) {
        console.log('❌ [AUTO-PROGRESS] Quiz chapitre 11 exclu');
        return false;
      }
    }

    // Exclure la page 33 et le chapitre 9 pour Tajwid (évaluation finale)
    if (pageInfo.isTajwid) {
      if (pageInfo.type === 'page' && pageInfo.pageNumber === 33) {
        console.log('❌ [AUTO-PROGRESS] Page 33 Tajwid exclue (évaluation finale)');
        return false;
      }
      if (pageInfo.chapterNumber === 9) {
        console.log('❌ [AUTO-PROGRESS] Chapitre 9 Tajwid exclu (évaluation finale)');
        return false;
      }
    }

    isValidatingRef.current = true;

    try {
      console.log('📞 [AUTO-PROGRESS] Appel validation...');
      console.log('  Module:', pageInfo.isTajwid ? 'TAJWID' : 'LECTURE');

      // Si c'est Tajwid, appeler l'API Tajwid directement
      if (pageInfo.isTajwid) {
        const body: any = { chapterNumber: pageInfo.chapterNumber };

        if (pageInfo.type === 'page') {
          body.pageNumber = pageInfo.pageNumber;
          console.log('  📝 Validation page Tajwid:', pageInfo.pageNumber);
        } else if (pageInfo.type === 'quiz') {
          body.quizNumber = pageInfo.chapterNumber;
          console.log('  📝 Validation quiz Tajwid:', pageInfo.chapterNumber);
        }

        const response = await fetch('/api/progress/validate-tajwid', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });

        if (response.ok) {
          const data = await response.json();
          console.log('✅ [AUTO-PROGRESS] Validation Tajwid réussie:', data);

          // 🔄 Dispatcher un événement custom pour notifier la sidebar immédiatement
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('progressUpdated', {
              detail: {
                type: pageInfo.type === 'page' ? 'page-tajwid' : 'quiz-tajwid',
                number: pageInfo.type === 'page' ? pageInfo.pageNumber : pageInfo.chapterNumber,
                module: 'TAJWID'
              }
            }));
          }
        }
      } else {
        // Module Lecture - comportement existant
        if (pageInfo.type === 'page') {
          console.log('  togglePageCompletion:', pageInfo.pageNumber);

          if (completedPages.has(pageInfo.pageNumber)) {
            console.log('  ✅ Page déjà complétée, pas d\'appel API');
          } else {
            console.log('  ❌ Page pas complétée, appel API');
            await togglePageCompletion(pageInfo.pageNumber);

            if (typeof window !== 'undefined') {
              window.dispatchEvent(new CustomEvent('progressUpdated', {
                detail: { type: 'page', number: pageInfo.pageNumber }
              }));
            }
          }
        } else if (pageInfo.type === 'quiz') {
          console.log('  toggleQuizCompletion:', pageInfo.chapterNumber);

          if (completedQuizzes.has(pageInfo.chapterNumber)) {
            console.log('  ✅ Quiz déjà complété, pas d\'appel API');
          } else {
            console.log('  ❌ Quiz pas complété, appel API');
            await toggleQuizCompletion(pageInfo.chapterNumber);

            if (typeof window !== 'undefined') {
              window.dispatchEvent(new CustomEvent('progressUpdated', {
                detail: { type: 'quiz', number: pageInfo.chapterNumber }
              }));
            }
          }
        }
      }

      console.log('✅ [AUTO-PROGRESS] Validation réussie!');

      hasValidatedRef.current = true;
      setHasValidated(true);

      console.log('✅ [AUTO-PROGRESS] VALIDATION COMPLÈTE - Plus aucune validation jusqu\'au prochain changement de page');
      return true;
    } catch (error) {
      console.error('❌ [AUTO-PROGRESS] Erreur:', error);
      return false;
    } finally {
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

    if (validationTimeoutRef.current) {
      clearTimeout(validationTimeoutRef.current);
      validationTimeoutRef.current = null;
    }

    console.log('⏰ [AUTO-PROGRESS] Programmation validation dans:', minTimeOnPage, 'ms');

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

  const validateIfTimeElapsed = useCallback(async () => {
    const timeOnPage = Date.now() - pageStartTimeRef.current;

    console.log('🔍 [AUTO-PROGRESS] validateIfTimeElapsed appelé');
    console.log('  timeOnPage:', timeOnPage, 'ms');
    console.log('  minTimeOnPage:', minTimeOnPage, 'ms');
    console.log('  hasValidatedRef.current:', hasValidatedRef.current);

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

  return {
    hasValidated,
    isEnabled: enabled && !isProfessorMode,
    currentPageInfo: getCurrentPageInfo(),
    getTimeOnCurrentPage: () => Date.now() - pageStartTimeRef.current,
    validateIfTimeElapsed,
  };
}
