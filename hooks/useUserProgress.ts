'use client';

import { useEffect, useState, useCallback } from 'react';

export function useUserProgress() {
  const [completedPages, setCompletedPages] = useState<Set<number>>(new Set());
  const [completedQuizzes, setCompletedQuizzes] = useState<Set<number>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  // Charger la progression depuis la base de données
  const loadProgress = useCallback(async () => {
    try {
      const response = await fetch('/api/auth/progress');
      if (response.ok) {
        const data = await response.json();
        setCompletedPages(new Set(data.completedPages || []));
        setCompletedQuizzes(new Set(data.completedQuizzes || []));
      }
    } catch (error) {
      console.error('Erreur de chargement de la progression:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Sauvegarder la progression en base de données
  const saveProgress = useCallback(async (
    pageNumber?: number, 
    quizNumber?: number, 
    action: 'add' | 'remove' = 'add'
  ) => {
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
        if (data.completedPages) {
          setCompletedPages(new Set(data.completedPages));
        }
        if (data.completedQuizzes) {
          setCompletedQuizzes(new Set(data.completedQuizzes));
        }
        return true;
      }
      return false;
    } catch (error) {
      console.error('Erreur de sauvegarde de la progression:', error);
      return false;
    }
  }, []);

  // Toggle page completion
  const togglePageCompletion = useCallback((pageNumber: number) => {
    // Exclure la page 0 (chapitre 0) et le chapitre 11 de la progression
    if (pageNumber === 0 || pageNumber === 30) {
      return;
    }
    
    const isCompleted = completedPages.has(pageNumber);
    const action = isCompleted ? 'remove' : 'add';
    
    // Sauvegarde en base puis mise à jour de l'UI
    saveProgress(pageNumber, undefined, action).then((success) => {
      if (success) {
        setCompletedPages(prev => {
          const newSet = new Set(prev);
          if (isCompleted) {
            newSet.delete(pageNumber);
          } else {
            newSet.add(pageNumber);
          }
          return newSet;
        });
      }
    });
  }, [completedPages, saveProgress]);

  // Toggle quiz completion
  const toggleQuizCompletion = useCallback((quizNumber: number) => {
    // Exclure le chapitre 11 de la progression
    if (quizNumber === 11) {
      return;
    }
    
    const isCompleted = completedQuizzes.has(quizNumber);
    const action = isCompleted ? 'remove' : 'add';
    
    // Sauvegarde en base puis mise à jour de l'UI
    saveProgress(undefined, quizNumber, action).then((success) => {
      if (success) {
        setCompletedQuizzes(prev => {
          const newSet = new Set(prev);
          if (isCompleted) {
            newSet.delete(quizNumber);
          } else {
            newSet.add(quizNumber);
          }
          return newSet;
        });
      }
    });
  }, [completedQuizzes, saveProgress]);

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
  };
}