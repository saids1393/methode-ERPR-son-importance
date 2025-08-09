'use client';

import { useEffect, useState, useCallback } from 'react';
import { checkAndSendHomework } from '@/lib/homework-email';

export function useUserProgress() {
  const [completedPages, setCompletedPages] = useState<Set<number>>(new Set());
  const [completedQuizzes, setCompletedQuizzes] = useState<Set<number>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [isProfessorMode, setIsProfessorMode] = useState(false);

  // Détecter si on est en mode professeur
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Vérifier spécifiquement le cookie professor-course-token
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

  // Fonction pour vérifier si un chapitre est complété
  const isChapterCompleted = useCallback((chapterNumber: number): boolean => {
    // Définir les pages par chapitre selon la structure existante
    const chapterPages: { [key: number]: number[] } = {
      1: [1, 2, 3, 4, 5, 6, 7],
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

    // Vérifier que toutes les pages du chapitre sont complétées
    const allPagesCompleted = requiredPages.every(pageNum => completedPages.has(pageNum));
    
    // Vérifier que le quiz du chapitre est complété (si applicable)
    const quizCompleted = completedQuizzes.has(chapterNumber);
    
    return allPagesCompleted && quizCompleted;
  }, [completedPages, completedQuizzes]);

  // Fonction pour déclencher l'envoi de devoir
  const triggerHomeworkSend = useCallback(async (chapterNumber: number) => {
    if (isProfessorMode) return; // Pas d'envoi pour les professeurs
    
    try {
      const response = await fetch('/api/homework/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chapterNumber }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.sent) {
          console.log(`✅ Devoir envoyé pour le chapitre ${chapterNumber}`);
        }
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi du devoir:', error);
    }
  }, [isProfessorMode]);
  // Charger la progression depuis la base de données
  const loadProgress = useCallback(async () => {
    // Si c'est un professeur, ne pas charger la progression
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
    // Si c'est un professeur, ne pas sauvegarder la progression
    if (isProfessorMode) {
      return false;
    }

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
  }, [isProfessorMode]);

  // Toggle page completion
  const togglePageCompletion = useCallback((pageNumber: number) => {
    // Si c'est un professeur, ne rien faire
    if (isProfessorMode) {
      return;
    }

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
  }, [completedPages, saveProgress, isProfessorMode]);

  // Toggle quiz completion
  const toggleQuizCompletion = useCallback((quizNumber: number) => {
    // Si c'est un professeur, ne rien faire
    if (isProfessorMode) {
      return;
    }

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
          // Vérifier si le chapitre est maintenant complété
          setTimeout(() => {
            if (isChapterCompleted(quizNumber)) {
              console.log(`🎉 Chapitre ${quizNumber} terminé ! Vérification du devoir...`);
              triggerHomeworkSend(quizNumber);
            }
          }, 1000); // Délai pour s'assurer que l'état est mis à jour
          }
          return newSet;
        });
      }
    });
  }, [completedQuizzes, saveProgress, isProfessorMode]);

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
  };
}