//app/components/SidebarContent.tsx

'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useMemo, useCallback } from "react";
import { ChevronDown, ChevronRight, BookOpen, CheckCircle, Circle, Home, Play } from "lucide-react";
import { chapters } from "@/lib/chapters";
import { useUserProgress } from "@/hooks/useUserProgress";
import { useChapterVideos } from "@/hooks/useChapterVideos";
import { useAutoProgress } from "@/hooks/useAutoProgress";
import { useRouter } from "next/navigation";

// Fonction de calcul de progression synchronisée avec le dashboard
const calculateProgress = (completedPages: Set<number>, completedQuizzes: Set<number>) => {
  console.log('📊 [CALCULATE_PROGRESS] ===== CALCUL PROGRESSION =====');
  console.log('📊 [CALCULATE_PROGRESS] Pages complétées reçues:', Array.from(completedPages));
  console.log('📊 [CALCULATE_PROGRESS] Quiz complétés reçus:', Array.from(completedQuizzes));
  
  // Pages des chapitres 1-10 seulement (exclut chapitres 0 et 11)
  const totalPages = chapters
    .filter(ch => ch.chapterNumber !== 0 && ch.chapterNumber !== 11)
    .reduce((total, ch) => total + ch.pages.length, 0);
  
  // Quiz des chapitres 0-10 (inclut chapitre 0, exclut chapitre 11)
  const totalQuizzes = chapters
    .filter(ch => ch.quiz && ch.quiz.length > 0 && ch.chapterNumber !== 11)
    .length;
  
  const totalItems = totalPages + totalQuizzes;
  console.log('📊 [CALCULATE_PROGRESS] Total items:', totalItems, '(Pages:', totalPages, ', Quiz:', totalQuizzes, ')');
  
  // Pages complétées (exclut pages 0 et 30)
  const completedPagesFiltered = Array.from(completedPages).filter(pageNum => pageNum !== 0 && pageNum !== 30);
  console.log('📊 [CALCULATE_PROGRESS] Pages filtrées (sans 0 et 30):', completedPagesFiltered);
  
  // Quiz complétés (exclut chapitre 11)
  const completedQuizzesFiltered = Array.from(completedQuizzes).filter(quizNum => quizNum !== 11);
  console.log('📊 [CALCULATE_PROGRESS] Quiz filtrés (sans 11):', completedQuizzesFiltered);
  
  const completedItems = completedPagesFiltered.length + completedQuizzesFiltered.length;
  console.log('📊 [CALCULATE_PROGRESS] Items complétés:', completedItems);
  
  const percentage = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
  console.log('📊 [CALCULATE_PROGRESS] Pourcentage calculé:', percentage, '%');
  console.log('📊 [CALCULATE_PROGRESS] ===== FIN CALCUL =====');
  
  return percentage;
};

export default function SidebarContent() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState<Record<number, boolean>>({});
  
  const {
    completedPages,
    completedQuizzes,
    isLoading,
    togglePageCompletion,
    toggleQuizCompletion,
    isProfessorMode,
    updateTrigger,
    updateFromExternal,
  } = useUserProgress();

  const { getVideoByChapter } = useChapterVideos();

  // Hook d'auto-progression avec validation sur navigation
  const { isEnabled: autoProgressEnabled, currentPageInfo, validateIfTimeElapsed, getTimeOnCurrentPage } = useAutoProgress({
    minTimeOnPage: 6000, // 6 secondes
    enabled: true 
  });

  // ========== TOUS LES useMemo ET useCallback D'ABORD ==========
  
  // Mémoriser la vérification de chapitre ouvert
  const currentOpenChapter = useMemo(() => {
    const chapter = chapters.find(ch =>
      ch.pages.some(p => p.href === pathname)
    )?.chapterNumber;
    console.log('📂 [SIDEBAR_CHAPTER] Chapitre actuel ouvert:', chapter);
    return chapter;
  }, [pathname]);

  // Mémoriser le calcul de progression
  const progressPercentage = useMemo(() => {
    console.log('📈 [SIDEBAR_PROGRESS] ===== RECALCUL PROGRESSION =====');
    console.log('📈 [SIDEBAR_PROGRESS] Trigger de mise à jour:', updateTrigger);
    const percentage = calculateProgress(completedPages, completedQuizzes);
    console.log('📈 [SIDEBAR_PROGRESS] Nouveau pourcentage:', percentage, '%');
    console.log('📈 [SIDEBAR_PROGRESS] ===== FIN RECALCUL =====');
    return percentage;
  }, [completedPages, completedQuizzes, updateTrigger]);

  // Callback pour vérifier si un chapitre est complété
  const isChapterCompleted = useCallback((chapter: typeof chapters[0]) => {
    const completed = chapter.pages.every(page => completedPages.has(page.pageNumber));
    console.log('✅ [SIDEBAR_CHAPTER] Chapitre', chapter.chapterNumber, 'complété?', completed);
    return completed;
  }, [completedPages]);

  // Intercepter la navigation pour valider automatiquement
  const handleNavigation = useCallback(async (href: string, e: React.MouseEvent) => {
    console.log('🧭 [SIDEBAR_NAV] ===== NAVIGATION INTERCEPTÉE =====');
    console.log('🧭 [SIDEBAR_NAV] Destination:', href);
    console.log('🧭 [SIDEBAR_NAV] Page actuelle:', pathname);
    console.log('🧭 [SIDEBAR_NAV] Mode professeur:', isProfessorMode);
    
    const timeOnPage = getTimeOnCurrentPage();
    console.log('⏱️ [SIDEBAR_NAV] Temps passé sur la page:', timeOnPage, 'ms');
    console.log('⏱️ [SIDEBAR_NAV] Seuil requis: 6000 ms');
    
    if (!isProfessorMode && timeOnPage >= 6000) {
      console.log('✅ [SIDEBAR_NAV] Temps suffisant ET mode élève - validation automatique...');
      
      // Empêcher la navigation immédiate
      e.preventDefault();
      
      // Valider la page courante
      console.log('🎯 [SIDEBAR_NAV] Appel de validateIfTimeElapsed()...');
      const validated = await validateIfTimeElapsed();
      console.log('🎯 [SIDEBAR_NAV] Validation résultat:', validated);
      console.log('🎯 [SIDEBAR_NAV] Pages complétées après validation:', Array.from(completedPages));
      
      // Attendre un peu pour que l'UI se mette à jour
      setTimeout(() => {
        console.log('🚀 [SIDEBAR_NAV] Navigation vers:', href);
        router.push(href);
      }, 100);
    } else {
      console.log('⏱️ [SIDEBAR_NAV] Temps insuffisant OU mode professeur - navigation normale');
      console.log('⏱️ [SIDEBAR_NAV] Raison: timeOnPage:', timeOnPage, '< 6000 OU isProfessorMode:', isProfessorMode);
    }
    
    console.log('🧭 [SIDEBAR_NAV] ===== FIN NAVIGATION =====');
  }, [pathname, getTimeOnCurrentPage, validateIfTimeElapsed, router, isProfessorMode, completedPages]);

  // Gestion du retour au dashboard avec nettoyage
  const handleDashboardReturn = useCallback(() => {
    console.log('🏠 [SIDEBAR_DASHBOARD] ===== RETOUR AU DASHBOARD =====');
    console.log('🏠 [SIDEBAR_DASHBOARD] Mode professeur:', isProfessorMode);
    
    if (!isProfessorMode) {
      console.log('🏠 [SIDEBAR_DASHBOARD] Mode élève - arrêt du chrono');
      // Arrêter le chrono seulement pour les élèves
      fetch('/api/auth/time/stop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      }).then(response => {
        console.log('⏹️ [SIDEBAR_DASHBOARD] Réponse stop timer:', response.status);
        if (response.ok) {
          response.json().then(data => {
            console.log('✅ [SIDEBAR_DASHBOARD] Chrono arrêté:', data);
          });
        }
      }).catch(error => {
        console.error('❌ [SIDEBAR_DASHBOARD] Erreur stop timer:', error);
      });
    }
    console.log('🏠 [SIDEBAR_DASHBOARD] ===== FIN RETOUR =====');
  }, [isProfessorMode]);

  const handleTogglePageCompletion = (pageNumber: number, e: React.MouseEvent) => {
    console.log('👆 [SIDEBAR_TOGGLE] ===== TOGGLE MANUEL =====');
    console.log('👆 [SIDEBAR_TOGGLE] Page number:', pageNumber);
    console.log('👆 [SIDEBAR_TOGGLE] État avant:', completedPages.has(pageNumber));
    e.preventDefault();
    e.stopPropagation();
    togglePageCompletion(pageNumber);
    console.log('👆 [SIDEBAR_TOGGLE] Toggle effectué');
    console.log('👆 [SIDEBAR_TOGGLE] ===== FIN TOGGLE =====');
  };

  // ========== TOUS LES useEffect APRÈS ==========

  // Ouvrir automatiquement le chapitre courant
  useEffect(() => {
    if (currentOpenChapter !== undefined) {
      console.log('📂 [SIDEBAR_CHAPTER] Ouverture automatique du chapitre:', currentOpenChapter);
      setOpen(prev => ({ ...prev, [currentOpenChapter]: true }));
    }
  }, [currentOpenChapter]);

  // Debug: Logger l'état actuel toutes les secondes
  useEffect(() => {
    console.log('⏰ [SIDEBAR_DEBUG] Installation du timer de debug');
    const debugInterval = setInterval(() => {
      console.log('⏰ [SIDEBAR_DEBUG] ===== ÉTAT ACTUEL (toutes les secondes) =====');
      console.log('⏰ [SIDEBAR_DEBUG] Auto-progression activée:', autoProgressEnabled);
      console.log('⏰ [SIDEBAR_DEBUG] Page actuelle:', pathname);
      console.log('⏰ [SIDEBAR_DEBUG] Info page actuelle:', currentPageInfo);
      console.log('⏰ [SIDEBAR_DEBUG] Temps sur la page:', getTimeOnCurrentPage(), 'ms');
      console.log('⏰ [SIDEBAR_DEBUG] Pages complétées:', Array.from(completedPages));
      console.log('⏰ [SIDEBAR_DEBUG] Progression:', progressPercentage, '%');
      console.log('⏰ [SIDEBAR_DEBUG] Mode professeur:', isProfessorMode);
      console.log('⏰ [SIDEBAR_DEBUG] ===== FIN ÉTAT =====');
    }, 1000);

    return () => {
      console.log('⏰ [SIDEBAR_DEBUG] Nettoyage du timer de debug');
      clearInterval(debugInterval);
    };
  }, [autoProgressEnabled, pathname, currentPageInfo, getTimeOnCurrentPage, completedPages, progressPercentage, isProfessorMode]);

  // Debug: Logger quand validateIfTimeElapsed est appelé
  useEffect(() => {
    if (!isProfessorMode && autoProgressEnabled) {
      console.log('🔄 [SIDEBAR_AUTO] ===== VÉRIFICATION AUTO-PROGRESSION =====');
      console.log('🔄 [SIDEBAR_AUTO] Mode professeur:', isProfessorMode);
      console.log('🔄 [SIDEBAR_AUTO] Auto activée:', autoProgressEnabled);
      console.log('🔄 [SIDEBAR_AUTO] Page info:', currentPageInfo);
      
      const checkInterval = setInterval(async () => {
        const timeOnPage = getTimeOnCurrentPage();
        console.log('🔄 [SIDEBAR_AUTO] Temps actuel sur la page:', timeOnPage, 'ms');
        
        if (timeOnPage >= 6000 && currentPageInfo && !currentPageInfo.isCompleted) {
          console.log('✅ [SIDEBAR_AUTO] 6 SECONDES ATTEINTES! Validation automatique...');
          const result = await validateIfTimeElapsed();
          console.log('✅ [SIDEBAR_AUTO] Résultat validation:', result);
          
          if (result) {
            console.log('🎉 [SIDEBAR_AUTO] PAGE VALIDÉE AUTOMATIQUEMENT!');
            console.log('🎉 [SIDEBAR_AUTO] Pages complétées après validation:', Array.from(completedPages));
          }
        }
      }, 500); // Vérifier toutes les 500ms

      return () => {
        console.log('🔄 [SIDEBAR_AUTO] Nettoyage de l\'intervalle de vérification');
        clearInterval(checkInterval);
      };
    }
  }, [isProfessorMode, autoProgressEnabled, currentPageInfo, getTimeOnCurrentPage, validateIfTimeElapsed, completedPages]);

  // Logger les mises à jour de progression
  useEffect(() => {
    console.log('🔄 [SIDEBAR_UPDATE] ===== MISE À JOUR DÉTECTÉE =====');
    console.log('🔄 [SIDEBAR_UPDATE] Pages complétées:', Array.from(completedPages));
    console.log('🔄 [SIDEBAR_UPDATE] Taille Set pages:', completedPages.size);
    console.log('🔄 [SIDEBAR_UPDATE] Quiz complétés:', Array.from(completedQuizzes));
    console.log('🔄 [SIDEBAR_UPDATE] Taille Set quiz:', completedQuizzes.size);
    console.log('🔄 [SIDEBAR_UPDATE] Pourcentage calculé:', progressPercentage, '%');
    console.log('🔄 [SIDEBAR_UPDATE] Update trigger:', updateTrigger);
    console.log('🔄 [SIDEBAR_UPDATE] ===== FIN MISE À JOUR =====');
  }, [completedPages, completedQuizzes, progressPercentage, updateTrigger]);

  // Écouter les mises à jour en temps réel via SSE
  useEffect(() => {
    if (isProfessorMode) {
      console.log('📡 [SIDEBAR_SSE] Mode professeur - pas de SSE');
      return;
    }

    console.log('📡 [SIDEBAR_SSE] ===== CONNEXION SSE =====');
    console.log('📡 [SIDEBAR_SSE] Connexion à /api/progress/stream');
    
    const eventSource = new EventSource('/api/progress/stream');
    
    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('📡 [SIDEBAR_SSE] Message reçu:', data);
        
        if (data.type === 'progress_update') {
          console.log('📡 [SIDEBAR_SSE] Mise à jour de progression détectée');
          console.log('📡 [SIDEBAR_SSE] Nouvelles pages:', data.completedPages);
          console.log('📡 [SIDEBAR_SSE] Nouveaux quiz:', data.completedQuizzes);
          console.log('📡 [SIDEBAR_SSE] Appel de updateFromExternal()...');
          updateFromExternal({
            completedPages: data.completedPages,
            completedQuizzes: data.completedQuizzes
          });
          console.log('📡 [SIDEBAR_SSE] updateFromExternal() appelé');
        }
      } catch (error) {
        console.error('❌ [SIDEBAR_SSE] Erreur parsing:', error);
      }
    };
    
    eventSource.onerror = (error) => {
      console.error('❌ [SIDEBAR_SSE] Erreur connexion:', error);
    };
    
    return () => {
      console.log('📡 [SIDEBAR_SSE] Fermeture connexion SSE');
      eventSource.close();
    };
  }, [isProfessorMode, updateFromExternal]);

  if (isLoading) {
    console.log('⏳ [SIDEBAR] Chargement en cours...');
    return (
      <div className="flex flex-col h-full text-zinc-300">
        <div className="px-6 py-5 border-b border-zinc-700 flex-shrink-0">
          <div className="animate-pulse">
            <div className="h-6 bg-zinc-700 rounded mb-3"></div>
            <div className="h-4 bg-zinc-700 rounded w-3/4"></div>
          </div>
        </div>
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
        </div>
      </div>
    );
  }

  console.log('🎨 [SIDEBAR_RENDER] ===== RENDU SIDEBAR =====');
  console.log('🎨 [SIDEBAR_RENDER] Progression:', progressPercentage, '%');
  console.log('🎨 [SIDEBAR_RENDER] Pages complétées:', completedPages.size);
  console.log('🎨 [SIDEBAR_RENDER] Quiz complétés:', completedQuizzes.size);

  return (
    <div className="flex flex-col h-full text-zinc-300">
      {/* Header */}
      <div className="px-6 py-5 border-b border-zinc-700 flex-shrink-0">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <BookOpen className="text-blue-400" size={20} />
          <span>Sommaire du Cours</span>
        </h1>
        <div className="mt-3">
          <Link
            href={isProfessorMode ? "/professor" : "/dashboard"}
            onClick={handleDashboardReturn}
            className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors text-zinc-300 hover:bg-zinc-700/30 hover:text-white"
          >
            <Home size={16} className="text-blue-400" />
            <span>
              Retour au tableau de bord
            </span>
          </Link>
        </div>
        
        {/* Afficher la progression seulement pour les élèves */}
        {!isProfessorMode && (
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-zinc-300">Progression</span>
              <span className="font-medium text-blue-300">
                {progressPercentage}%
              </span>
            </div>
            <div className="w-full bg-zinc-700 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-400 to-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
        )}
        
        {/* Indicateur mode professeur */}
        {isProfessorMode && (
          <div className="mt-4 bg-purple-500/20 border border-purple-500/30 rounded-lg p-3">
            <div className="flex items-center gap-2 text-purple-300">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">Mode Professeur</span>
            </div>
            <p className="text-purple-200 text-xs mt-1">
              Consultation du contenu pédagogique
            </p>
            <Link
              href="/professor"
              className="inline-flex items-center gap-1 text-purple-300 hover:text-purple-200 text-xs mt-2 transition-colors"
            >
              <Home size={12} />
              Retour à l'espace professeur
            </Link>
          </div>
        )}
        
        {/* Indicateur auto-progression pour les élèves */}
        {!isProfessorMode && autoProgressEnabled && currentPageInfo && !currentPageInfo.isCompleted && (
          <div className="mt-4 bg-green-500/20 border border-green-500/30 rounded-lg p-3">
            <div className="flex items-center gap-2 text-green-300 mb-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-sm font-medium">Auto-progression</span>
            </div>
            <p className="text-green-200 text-xs">
              Restez 6 secondes puis naviguez pour valider automatiquement
            </p>
          </div>
        )}
      </div>

      <nav
        className="flex-grow overflow-y-auto touch-auto overscroll-contain scrollbar-thin scrollbar-thumb-zinc-600 scrollbar-track-transparent"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        <ul className="space-y-1 px-3">
          {chapters.map((chapter) => {
            const chapterComplete = isChapterCompleted(chapter);

            return (
              <li key={chapter.chapterNumber} className="rounded-lg">
                <button
                  onClick={() => {
                    console.log('📁 [SIDEBAR_CHAPTER] Toggle chapitre:', chapter.chapterNumber);
                    setOpen((prev) => ({
                      ...prev,
                      [chapter.chapterNumber]: !prev[chapter.chapterNumber],
                    }));
                  }}
                  className={`w-full text-left px-3 py-3 flex justify-between items-center rounded-lg transition-colors ${
                    open[chapter.chapterNumber]
                      ? 'bg-zinc-700/50 text-white'
                      : 'hover:bg-zinc-700/30 text-zinc-200'
                  } ${chapterComplete && !isProfessorMode ? '!text-green-400/90' : ''}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-bold">
                      {chapter.chapterNumber === 0
                        ? 'Phase préparatoire'
                        : `${chapter.chapterNumber}.`}{' '}
                      {chapter.title}
                    </span>
                  </div>
                  {open[chapter.chapterNumber] ? (
                    <ChevronDown
                      size={18}
                      className={`${chapterComplete && !isProfessorMode ? 'text-green-400/70' : 'text-zinc-400'}`}
                    />
                  ) : (
                    <ChevronRight
                      size={18}
                      className={`${chapterComplete && !isProfessorMode ? 'text-green-400/70' : 'text-zinc-400'}`}
                    />
                  )}
                </button>

                {open[chapter.chapterNumber] && (
                  <ul className="ml-8 mt-1 space-y-1 py-1 border-l-2 border-zinc-700">
                    {/* Vidéo du chapitre */}
                    {getVideoByChapter(chapter.chapterNumber) && (
                      <li key={`video-${chapter.chapterNumber}`}>
                        <Link
                          href={`/chapitres/${chapter.chapterNumber}/video`}
                          className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors ${
                            pathname === `/chapitres/${chapter.chapterNumber}/video`
                              ? 'bg-purple-900/50 text-white border-l-2 border-purple-400'
                              : 'hover:bg-zinc-700/30 text-zinc-300'
                          }`}
                        >
                          <Play size={14} className="text-purple-400" />
                          <span className="text-zinc-200 font-semibold">Vidéo du chapitre</span>
                          {pathname === `/chapitres/${chapter.chapterNumber}/video` && (
                            <span className="ml-auto h-2 w-2 rounded-full bg-purple-400"></span>
                          )}
                        </Link>
                      </li>
                    )}

                    {chapter.introduction && (
                      <li key={`intro-${chapter.chapterNumber}`}>
                        <Link
                          href={`/chapitres/${chapter.chapterNumber}/introduction`}
                          className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors ${
                            pathname === `/chapitres/${chapter.chapterNumber}/introduction`
                              ? 'bg-blue-900/50 text-white border-l-2 border-blue-400'
                              : 'hover:bg-zinc-700/30 text-zinc-300'
                          }`}
                        >
                          <BookOpen size={14} className="text-blue-400" />
                          <span className="text-zinc-200">Introduction</span>
                          {pathname === `/chapitres/${chapter.chapterNumber}/introduction` && (
                            <span className="ml-auto h-2 w-2 rounded-full bg-blue-400"></span>
                          )}
                        </Link>
                      </li>
                    )}

                    {chapter.pages.map((page) => {
                      const isCompleted = completedPages.has(page.pageNumber);
                      console.log(`🔍 [SIDEBAR_PAGE] Page ${page.pageNumber} complétée:`, isCompleted);
                      return (
                        <li key={page.pageNumber}>
                          <Link
                            href={page.href}
                            onClick={(e) => handleNavigation(page.href, e)}
                            className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors ${
                              pathname === page.href
                                ? 'bg-blue-900/50 text-white border-l-2 border-blue-400'
                                : 'hover:bg-zinc-700/30 text-zinc-300'
                            }`}
                          >
                            {/* Afficher les checkboxes seulement pour les élèves */}
                            {!isProfessorMode && chapter.chapterNumber !== 0 && chapter.chapterNumber !== 11 && (
                              <button
                                onClick={(e) => handleTogglePageCompletion(page.pageNumber, e)}
                                className="flex-shrink-0"
                                aria-label={
                                  isCompleted
                                    ? 'Marquer comme non complété'
                                    : 'Marquer comme complété'
                                }
                              >
                                {isCompleted ? (
                                  <CheckCircle className="text-green-400" size={14} />
                                ) : (
                                  <Circle className="text-zinc-500 hover:text-zinc-300" size={14} />
                                )}
                              </button>
                            )}
                            <span>
                              <span className="font-medium text-zinc-200">{page.pageNumber}.</span>{' '}
                              {page.title}
                            </span>
                            {pathname === page.href && (
                              <span className="ml-auto h-2 w-2 rounded-full bg-blue-400"></span>
                            )}
                          </Link>
                        </li>
                      );
                    })}

                    {chapter.quiz && chapter.quiz.length > 0 && (
                      <li key={`quiz-${chapter.chapterNumber}`}>
                        <Link
                          href={`/chapitres/${chapter.chapterNumber}/quiz`}
                          onClick={(e) => handleNavigation(`/chapitres/${chapter.chapterNumber}/quiz`, e)}
                          className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors ${
                            pathname === `/chapitres/${chapter.chapterNumber}/quiz`
                              ? 'bg-blue-900/50 text-white border-l-2 border-blue-400'
                              : 'hover:bg-zinc-700/30 text-zinc-300'
                          }`}
                        >
                          {/* Afficher les checkboxes seulement pour les élèves et pour les chapitres appropriés */}
                          {!isProfessorMode && chapter.chapterNumber !== 11 && (
                            <button
                              onClick={(e) => {
                                console.log('👆 [SIDEBAR_QUIZ] Toggle quiz chapitre:', chapter.chapterNumber);
                                e.preventDefault();
                                e.stopPropagation();
                                toggleQuizCompletion(chapter.chapterNumber);
                              }}
                              className="flex-shrink-0"
                              aria-label={
                                completedQuizzes.has(chapter.chapterNumber)
                                  ? 'Marquer le quiz comme non complété'
                                  : 'Marquer le quiz comme complété'
                              }
                            >
                              {completedQuizzes.has(chapter.chapterNumber) ? (
                                <CheckCircle className="text-green-400" size={14} />
                              ) : (
                                <Circle className="text-zinc-500 hover:text-zinc-300" size={14} />
                              )}
                            </button>
                          )}
                          <BookOpen size={14} className="text-yellow-400" />
                          <span className="text-zinc-200 font-semibold">Quiz</span>
                          <span className="ml-auto flex items-center gap-1">
                            {pathname === `/chapitres/${chapter.chapterNumber}/quiz` && (
                              <span className="h-2 w-2 rounded-full bg-yellow-400"></span>
                            )}
                          </span>
                        </Link>
                      </li>
                    )}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer - Afficher les stats seulement pour les élèves */}
      {!isProfessorMode && (
        <div className="border-t border-zinc-700 px-6 py-3 text-xs text-zinc-400 flex justify-between">
          <span>Pages complétées: {completedPages.size}</span>
          <span>Quiz complétés: {completedQuizzes.size}</span>
        </div>
      )}
    </div>
  );
}