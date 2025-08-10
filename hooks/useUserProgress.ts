//hooks/useUserProgress.ts

'use client';

import { useEffect, useState, useCallback } from 'react';

export function useUserProgress() {
  const [completedPages, setCompletedPages] = useState<Set<number>>(new Set());
  const [completedQuizzes, setCompletedQuizzes] = useState<Set<number>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [isProfessorMode, setIsProfessorMode] = useState(false);
  const [updateTrigger, setUpdateTrigger] = useState(0);

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

  // Fonction pour forcer la mise à jour de tous les composants
  const forceUpdate = useCallback(() => {
    console.log('🔄 [PROGRESS] FORCE UPDATE déclenchée');
    setUpdateTrigger(prev => prev + 1);
  }, []);

  // Fonction pour mettre à jour depuis des données externes (SSE, API, etc.)
  const updateFromExternal = useCallback((data: {
    completedPages?: number[];
    completedQuizzes?: number[];
  }) => {
    console.log('🔄 [PROGRESS] Mise à jour externe:', data);
    
    if (data.completedPages) {
      setCompletedPages(new Set(data.completedPages));
    }
    
    if (data.completedQuizzes) {
      setCompletedQuizzes(new Set(data.completedQuizzes));
    }
    
    forceUpdate();
  }, [forceUpdate]);
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
    
    console.log(`🚀 [HOOK] ===== DÉCLENCHEMENT ENVOI DEVOIR CHAPITRE ${chapterNumber} =====`);
    console.log(`🚀 [HOOK] Utilisateur: ${chapterNumber}, Mode professeur: ${isProfessorMode}`);
    
    try {
      const response = await fetch('/api/homework/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chapterNumber }),
      });

      console.log(`📡 [HOOK] Réponse API:`, response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log(`📧 [HOOK] Données reçues:`, data);
        if (data.sent) {
          console.log(`✅ [HOOK] Devoir envoyé pour le chapitre ${chapterNumber}`);
        } else {
          console.log(`ℹ️ [HOOK] Devoir non envoyé:`, data.message);
        }
      } else {
        console.log(`❌ [HOOK] Erreur API:`, response.status);
        const errorText = await response.text();
        console.log(`❌ [HOOK] Détails erreur:`, errorText);
      }
    } catch (error) {
      console.error('❌ [HOOK] Erreur lors de l\'envoi du devoir:', error);
    }
    
    console.log(`🚀 [HOOK] ===== FIN DÉCLENCHEMENT ENVOI DEVOIR =====`);
  }, [isProfessorMode]);
  // Charger la progression depuis la base de données
  const loadProgress = useCallback(async () => {
    // Si c'est un professeur, ne pas charger la progression
    if (isProfessorMode) {
      console.log('👨‍🏫 [PROGRESS] Mode professeur détecté - pas de chargement de progression');
      setIsLoading(false);
      return;
    }

    console.log('📥 [PROGRESS] Chargement de la progression depuis la DB...');
    try {
      const response = await fetch('/api/auth/progress');
      if (response.ok) {
        const data = await response.json();
        console.log('📊 [PROGRESS] Progression chargée:', data);
        setCompletedPages(new Set(data.completedPages || []));
        setCompletedQuizzes(new Set(data.completedQuizzes || []));
        forceUpdate(); // Forcer la mise à jour après chargement
      } else {
        console.error('❌ [PROGRESS] Erreur HTTP lors du chargement:', response.status);
      }
    } catch (error) {
      console.error('Erreur de chargement de la progression:', error);
    } finally {
      setIsLoading(false);
    }
  }, [isProfessorMode]);

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
        // Forcer la mise à jour après sauvegarde
        forceUpdate();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Erreur de sauvegarde de la progression:', error);
      return false;
    }
  }, [isProfessorMode]);

  // Toggle page completion
  const togglePageCompletion = useCallback(async (pageNumber: number) => {
    // Si c'est un professeur, ne rien faire
    if (isProfessorMode) {
      return;
    }

    // Exclure la page 0 (chapitre 0) et le chapitre 11 de la progression
    if (pageNumber === 0 || pageNumber === 30) {
      return;
    }
    
    console.log(`🔄 [PROGRESS] ===== TOGGLE PAGE ${pageNumber} =====`);
    console.log(`📊 [PROGRESS] État actuel pages:`, Array.from(completedPages));
    
    const isCompleted = completedPages.has(pageNumber);
    console.log(`🔍 [PROGRESS] Page ${pageNumber} déjà complétée:`, isCompleted);
    const action = isCompleted ? 'remove' : 'add';
    
    // MISE À JOUR IMMÉDIATE DE L'UI AVANT LA SAUVEGARDE
    setCompletedPages(prev => {
      const newSet = new Set(prev);
      if (isCompleted) {
        console.log(`➖ [HOOK] Suppression immédiate page ${pageNumber} de l'UI`);
        newSet.delete(pageNumber);
      } else {
        console.log(`➕ [HOOK] Ajout immédiat page ${pageNumber} à l'UI`);
        newSet.add(pageNumber);
      }
      console.log(`📊 [PROGRESS] Nouvel état pages:`, Array.from(newSet));
      return newSet;
    });
    
    // Forcer immédiatement la mise à jour de l'UI
    forceUpdate();
    
    // Sauvegarde en base puis mise à jour de l'UI
    const success = await saveProgress(pageNumber, undefined, action);
      console.log(`💾 [PROGRESS] Sauvegarde page ${pageNumber} réussie:`, success);
      if (!success) {
        // En cas d'échec de sauvegarde, revenir à l'état précédent
        console.log(`❌ [HOOK] Échec sauvegarde page ${pageNumber} - restauration état précédent`);
        setCompletedPages(prev => {
          const revertSet = new Set(prev);
          if (isCompleted) {
            revertSet.add(pageNumber); // Remettre si c'était supprimé
          } else {
            revertSet.delete(pageNumber); // Enlever si c'était ajouté
          }
          return revertSet;
        });
        forceUpdate();
      }
    
    console.log(`🔄 [PROGRESS] ===== FIN TOGGLE PAGE =====`);
  }, [completedPages, saveProgress, isProfessorMode, forceUpdate]);

  // Toggle quiz completion
  const toggleQuizCompletion = useCallback(async (quizNumber: number) => {
    // Si c'est un professeur, ne rien faire
    if (isProfessorMode) {
      console.log('👨‍🏫 [HOOK] Mode professeur - pas de sauvegarde quiz');
      return;
    }

    // Exclure le chapitre 11 de la progression
    if (quizNumber === 11) {
      console.log('🚫 [HOOK] Chapitre 11 exclu de la progression');
      return;
    }
    
    console.log(`🎯 [HOOK] ===== TOGGLE QUIZ ${quizNumber} =====`);
    console.log(`📊 [HOOK] État actuel - Pages:`, Array.from(completedPages));
    console.log(`🏆 [HOOK] État actuel - Quiz:`, Array.from(completedQuizzes));
    
    const isCompleted = completedQuizzes.has(quizNumber);
    console.log(`🔍 [HOOK] Quiz ${quizNumber} déjà complété:`, isCompleted);
    const action = isCompleted ? 'remove' : 'add';
    
    // MISE À JOUR IMMÉDIATE DE L'UI AVANT LA SAUVEGARDE
    setCompletedQuizzes(prev => {
      const newSet = new Set(prev);
      if (isCompleted) {
        console.log(`➖ [HOOK] Suppression immédiate quiz ${quizNumber} de l'UI`);
        newSet.delete(quizNumber);
      } else {
        console.log(`➕ [HOOK] Ajout immédiat quiz ${quizNumber} à l'UI`);
        newSet.add(quizNumber);
        
        // VÉRIFICATION IMMÉDIATE avec le nouveau state
        console.log(`🔍 [HOOK] VÉRIFICATION IMMÉDIATE - Quiz ${quizNumber} ajouté`);
        
        // Créer un Set temporaire avec le nouveau quiz pour la vérification
        const tempQuizSet = new Set(prev);
        tempQuizSet.add(quizNumber);
        
        console.log(`🔍 [HOOK] État temporaire quiz pour vérification:`, Array.from(tempQuizSet));
        
        // Vérifier immédiatement avec l'état temporaire
        setTimeout(() => {
          checkChapterCompletionWithState(quizNumber, completedPages, tempQuizSet);
        }, 100);
      }
      console.log(`🏆 [PROGRESS] Nouvel état quiz:`, Array.from(newSet));
      return newSet;
    });
    
    // Forcer immédiatement la mise à jour de l'UI
    forceUpdate();
    
    // Sauvegarde en base puis mise à jour de l'UI
    const success = await saveProgress(undefined, quizNumber, action);
      console.log(`💾 [HOOK] Sauvegarde quiz ${quizNumber} réussie:`, success);
      if (!success) {
        // En cas d'échec de sauvegarde, revenir à l'état précédent
        console.log(`❌ [HOOK] Échec sauvegarde - restauration état précédent`);
        setCompletedQuizzes(prev => {
          const revertSet = new Set(prev);
          if (isCompleted) {
            revertSet.add(quizNumber); // Remettre si c'était supprimé
          } else {
            revertSet.delete(quizNumber); // Enlever si c'était ajouté
          }
          return revertSet;
        });
        forceUpdate();
      }
    
    console.log(`🎯 [PROGRESS] ===== FIN TOGGLE QUIZ =====`);
  }, [completedQuizzes, saveProgress, isProfessorMode, completedPages, forceUpdate]);

  // Fonction séparée pour vérifier la completion d'un chapitre avec état spécifique
  const checkChapterCompletionWithState = useCallback((
    chapterNumber: number, 
    pagesSet: Set<number>, 
    quizzesSet: Set<number>
  ) => {
    console.log(`🔍 [HOOK] ===== VÉRIFICATION COMPLETION CHAPITRE ${chapterNumber} =====`);
    
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
    if (!requiredPages) {
      console.log(`❌ [HOOK] Chapitre ${chapterNumber} non trouvé dans la configuration`);
      return;
    }
    
    console.log(`📚 [HOOK] Pages requises pour chapitre ${chapterNumber}:`, requiredPages);
    console.log(`📊 [HOOK] Pages actuellement complétées:`, Array.from(pagesSet));
    console.log(`🏆 [HOOK] Quiz actuellement complétés:`, Array.from(quizzesSet));
    
    const allPagesCompleted = requiredPages.every(pageNum => pagesSet.has(pageNum));
    const quizCompleted = quizzesSet.has(chapterNumber);
    
    console.log(`📚 [HOOK] Chapitre ${chapterNumber} - Pages complétées:`, allPagesCompleted, requiredPages);
    console.log(`🏆 [HOOK] Chapitre ${chapterNumber} - Quiz complété:`, quizCompleted);
    
    // Vérification détaillée page par page
    requiredPages.forEach(pageNum => {
      const hasPage = pagesSet.has(pageNum);
      console.log(`📄 [HOOK] Page ${pageNum}: ${hasPage ? '✅' : '❌'}`);
    });
    
    if (allPagesCompleted && quizCompleted) {
      console.log(`🎉 [HOOK] CHAPITRE ${chapterNumber} TERMINÉ ! Envoi du devoir...`);
      triggerHomeworkSend(chapterNumber);
    } else {
      console.log(`⏳ [HOOK] Chapitre ${chapterNumber} pas encore terminé:`);
      console.log(`   - Pages: ${allPagesCompleted ? '✅' : '❌'} (${requiredPages.filter(p => completedPages.has(p)).length}/${requiredPages.length})`);
      console.log(`   - Quiz: ${quizCompleted ? '✅' : '❌'}`);
    }
    
    console.log(`🔍 [HOOK] ===== FIN VÉRIFICATION COMPLETION =====`);
  }, [triggerHomeworkSend]);

  // Fonction de vérification avec l'état actuel (pour compatibilité)
  const checkChapterCompletion = useCallback((chapterNumber: number) => {
    checkChapterCompletionWithState(chapterNumber, completedPages, completedQuizzes);
  }, [completedPages, completedQuizzes, checkChapterCompletionWithState]);

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
    updateTrigger, // Exposer le trigger pour forcer les re-renders
    updateFromExternal, // Nouvelle fonction pour mise à jour externe
  };
}