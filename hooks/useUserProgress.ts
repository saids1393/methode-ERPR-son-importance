'use client';

import { useEffect, useState, useCallback, useRef } from 'react';

export function useUserProgress() {
  const [completedPages, setCompletedPages] = useState<Set<number>>(new Set());
  const [completedQuizzes, setCompletedQuizzes] = useState<Set<number>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [isProfessorMode, setIsProfessorMode] = useState(false);
  const [updateTrigger, setUpdateTrigger] = useState(0);

  const sendingHomeworkLock = useRef<Set<number>>(new Set());

  // Détecter si on est en mode professeur
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const cookies = document.cookie.split(';');
      const professorCookie = cookies.find(cookie => 
        cookie.trim().startsWith('professor-course-token=') && 
        cookie.trim() !== 'professor-course-token='
      );
      const isProfessor = !!professorCookie;
      console.log('🎓 PROGRESS HOOK - Mode professeur détecté:', isProfessor);
      setIsProfessorMode(isProfessor);
    }
  }, []);

  const forceUpdate = useCallback(() => {
    setUpdateTrigger(prev => prev + 1);
  }, []);

  const updateFromExternal = useCallback((data: { completedPages?: number[]; completedQuizzes?: number[] }) => {
    if (data.completedPages) setCompletedPages(new Set(data.completedPages));
    if (data.completedQuizzes) setCompletedQuizzes(new Set(data.completedQuizzes));
    forceUpdate();
  }, [forceUpdate]);

  const isChapterCompleted = useCallback((chapterNumber: number): boolean => {
    const chapterPages: { [key: number]: number[] } = {
      1: [0, 1, 2, 3, 4, 5, 6, 7],
      2: [8, 9, 10, 11],
      3: [12, 13, 14, 15],
      4: [16],
      5: [17],
      6: [18, 19, 20],
      7: [21],
      8: [22, 23],
      9: [24],
      10: [25, 26, 27, 28, 29]
    };

    const requiredPages = chapterPages[chapterNumber];
    if (!requiredPages) return false;

    const allPagesCompleted = requiredPages.every(pageNum => completedPages.has(pageNum));
    const quizCompleted = completedQuizzes.has(chapterNumber);

    return allPagesCompleted && quizCompleted;
  }, [completedPages, completedQuizzes]);

  const triggerHomeworkSend = useCallback(async (chapterNumber: number) => {
    if (isProfessorMode) return;

    try {
      const response = await fetch('/api/homework/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chapterNumber }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.sent) console.log(`✅ Devoir envoyé pour le chapitre ${chapterNumber}`);
        else console.log(`ℹ️ Devoir non envoyé:`, data.message);
      } else {
        console.log(`❌ Erreur API:`, response.status);
      }
    } catch (error) {
      console.error('❌ Erreur lors de l\'envoi du devoir:', error);
    }
  }, [isProfessorMode]);

  const loadProgress = useCallback(async () => {
    if (isProfessorMode) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/progress');
      if (response.ok) {
        const data = await response.json();
        setCompletedPages(new Set(data.completedPages || []));
        setCompletedQuizzes(new Set(data.completedQuizzes || []));
        forceUpdate();
      }
    } catch (error) {
      console.error('Erreur de chargement de la progression:', error);
    } finally {
      setIsLoading(false);
    }
  }, [isProfessorMode, forceUpdate]);

  const saveProgress = useCallback(async (pageNumber?: number, quizNumber?: number, action: 'add' | 'remove' = 'add') => {
    if (isProfessorMode) return false;

    try {
      const body: any = { action };
      if (pageNumber !== undefined) body.pageNumber = pageNumber;
      if (quizNumber !== undefined) body.quizNumber = quizNumber;

      const response = await fetch('/api/auth/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.completedPages) setCompletedPages(new Set(data.completedPages));
        if (data.completedQuizzes) setCompletedQuizzes(new Set(data.completedQuizzes));
        forceUpdate();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Erreur de sauvegarde:', error);
      return false;
    }
  }, [isProfessorMode, forceUpdate]);

  // Toggle page completion – page 0 autorisée
  const togglePageCompletion = useCallback(async (pageNumber: number) => {
    if (isProfessorMode || pageNumber === 30) return; // page 0 autorisée

    const isCompleted = completedPages.has(pageNumber);
    const action = isCompleted ? 'remove' : 'add';

    setCompletedPages(prev => {
      const newSet = new Set(prev);
      if (isCompleted) newSet.delete(pageNumber);
      else newSet.add(pageNumber);
      return newSet;
    });

    forceUpdate();
    const success = await saveProgress(pageNumber, undefined, action);

    if (!success) {
      setCompletedPages(prev => {
        const revertSet = new Set(prev);
        if (isCompleted) revertSet.add(pageNumber);
        else revertSet.delete(pageNumber);
        return revertSet;
      });
      forceUpdate();
    }
  }, [completedPages, saveProgress, isProfessorMode, forceUpdate]);

  const toggleQuizCompletion = useCallback(async (quizNumber: number) => {
    if (isProfessorMode || quizNumber === 11) return;

    const isCompleted = completedQuizzes.has(quizNumber);
    const action = isCompleted ? 'remove' : 'add';

    setCompletedQuizzes(prev => {
      const newSet = new Set(prev);
      if (isCompleted) newSet.delete(quizNumber);
      else newSet.add(quizNumber);
      return newSet;
    });

    forceUpdate();
    const success = await saveProgress(undefined, quizNumber, action);

    if (!success) {
      setCompletedQuizzes(prev => {
        const revertSet = new Set(prev);
        if (isCompleted) revertSet.add(quizNumber);
        else revertSet.delete(quizNumber);
        return revertSet;
      });
      forceUpdate();
    }
  }, [completedQuizzes, saveProgress, isProfessorMode, forceUpdate]);

  // Vérification automatique des chapitres complétés
  useEffect(() => {
    const chapterPages: { [key: number]: number[] } = {
      1: [0, 1, 2, 3, 4, 5, 6, 7],
      2: [8, 9, 10, 11],
      3: [12, 13, 14, 15],
      4: [16],
      5: [17],
      6: [18, 19, 20],
      7: [21],
      8: [22, 23],
      9: [24],
      10: [25, 26, 27, 28, 29],
    };

    Object.entries(chapterPages).forEach(([chapterStr, pages]) => {
      const chapterNumber = parseInt(chapterStr);
      const allPagesCompleted = pages.every(p => completedPages.has(p));
      const quizCompleted = completedQuizzes.has(chapterNumber);

      if (allPagesCompleted && quizCompleted) {
        if (!sendingHomeworkLock.current.has(chapterNumber)) {
          sendingHomeworkLock.current.add(chapterNumber);
          triggerHomeworkSend(chapterNumber);
        }
      }
    });
  }, [completedPages, completedQuizzes, triggerHomeworkSend]);

  useEffect(() => {
    loadProgress();
  }, [loadProgress]);

  return {
    completedPages,
    completedQuizzes,
    isLoading,
    togglePageCompletion,
    toggleQuizCompletion,
    refreshProgress: loadProgress,
    isProfessorMode,
    isChapterCompleted,
    forceUpdate,
    updateTrigger,
    updateFromExternal,
  };
}
