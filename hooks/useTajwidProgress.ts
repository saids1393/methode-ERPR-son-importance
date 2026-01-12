'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { chaptersTajwid } from '@/lib/chapters-tajwid';

export function useTajwidProgress() {
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
      console.log('🎓 TAJWID PROGRESS HOOK - Mode professeur détecté:', isProfessor);
      setIsProfessorMode(isProfessor);
    }
  }, []);

  const forceUpdate = useCallback(() => {
    setUpdateTrigger(prev => prev + 1);
  }, []);

  const triggerHomeworkSend = useCallback(async (chapterNumber: number) => {
    if (isProfessorMode) return;

    try {
      const response = await fetch('/api/homework/tajwid/auto-send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chapterNumber }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.sent) console.log(`✅ Devoir Tajwid envoyé pour le chapitre ${chapterNumber}`);
        else console.log(`ℹ️ Devoir Tajwid non envoyé:`, data.message);
      } else {
        console.log(`❌ Erreur API Tajwid:`, response.status);
      }
    } catch (error) {
      console.error('❌ Erreur lors de l\'envoi du devoir Tajwid:', error);
    }
  }, [isProfessorMode]);

  const loadProgress = useCallback(async () => {
    if (isProfessorMode) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/get-user');
      if (response.ok) {
        const data = await response.json();
        const userData = data.user;
        setCompletedPages(new Set(userData.completedPagesTajwid || []));
        setCompletedQuizzes(new Set(userData.completedQuizzesTajwid || []));
        forceUpdate();
      }
    } catch (error) {
      console.error('Erreur de chargement de la progression Tajwid:', error);
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

      const response = await fetch('/api/progress/validate-tajwid', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.completedPagesTajwid) setCompletedPages(new Set(data.completedPagesTajwid));
        if (data.completedQuizzesTajwid) setCompletedQuizzes(new Set(data.completedQuizzesTajwid));
        forceUpdate();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Erreur de sauvegarde Tajwid:', error);
      return false;
    }
  }, [isProfessorMode, forceUpdate]);

  const togglePageCompletion = useCallback(async (pageNumber: number) => {
    // Page 0 (intro) et page 33 (évaluation finale) n'ont pas de validation
    if (isProfessorMode || pageNumber === 0 || pageNumber === 33) return;

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
    chaptersTajwid.forEach(chapter => {
      // Exclure le chapitre 9 (évaluation finale) - pas de devoir à envoyer
      if (chapter.chapterNumber === 9) return;
      
      // Pour le chapitre 1, exclure la page 0 car elle n'a pas de validation
      const pagesToCheck = chapter.chapterNumber === 1 
        ? chapter.pages.filter(p => p.pageNumber !== 0)
        : chapter.pages;
      
      const allPagesCompleted = pagesToCheck.every(p => completedPages.has(p.pageNumber));
      const quizCompleted = completedQuizzes.has(chapter.chapterNumber);

      if (allPagesCompleted && quizCompleted) {
        if (!sendingHomeworkLock.current.has(chapter.chapterNumber)) {
          sendingHomeworkLock.current.add(chapter.chapterNumber);
          triggerHomeworkSend(chapter.chapterNumber);
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
    forceUpdate,
    updateTrigger,
  };
}
