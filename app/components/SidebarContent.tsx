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
import FreeTrialRestrictionModal from "./FreeTrialRestrictionModal";


const calculateProgress = (completedPages: Set<number>, completedQuizzes: Set<number>) => {
  // Count total pages (excluding only chapter 11 and page 30)
  const totalPages = chapters
    .filter(ch => ch.chapterNumber !== 11)
    .reduce((total, ch) => total + ch.pages.filter(p => p.pageNumber !== 30).length, 0);

  // Count total quizzes (excluding only chapter 11)
  const totalQuizzes = chapters
    .filter(ch => ch.quiz && ch.quiz.length > 0 && ch.chapterNumber !== 11)
    .length;

  const totalItems = totalPages + totalQuizzes;

  // Count only completed pages that are not page 30
  const completedPagesFiltered = Array.from(completedPages).filter(pageNum => pageNum !== 30);

  // Count only completed quizzes that are not chapter 11
  const completedQuizzesFiltered = Array.from(completedQuizzes).filter(quizNum => quizNum !== 11);

  const completedItems = completedPagesFiltered.length + completedQuizzesFiltered.length;
  return totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
};


export default function SidebarContent() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState<Record<number, boolean>>({});
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fonction pour récupérer l'utilisateur avec les restrictions actuelles
  const fetchUser = async () => {
    try {
      const res = await fetch('/api/auth/get-user', {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        }
      });
      
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.user) {
          setUser(data.user);
          console.log('✅ User fetched in SidebarContent:', {
            email: data.user.email,
            accountType: data.user.accountType,
            trialExpired: data.user.trialExpired,
          });
        }
      }
    } catch (error) {
      console.error('❌ Erreur lors de la récupération de l\'utilisateur:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour vérifier si un chapitre est verrouillé
  const isChapterLocked = (chapterNumber: number) => {
    if (!user) return false;
    
    // Si compte payant complet, rien n'est verrouillé
    if (user.accountType === 'PAID_FULL') return false;
    
    // Si FREE_TRIAL
    if (user.accountType === 'FREE_TRIAL') {
      // Si trial expiré: tout verrouillé sauf chapitres 0 et notice (mais on est pas sur notice ici)
      if (user.trialExpired) {
        return true; // Tous les chapitres verrouillés après expiration
      }
      
      // Si trial actif: chapitres 2-11 verrouillés, 0-1 accessibles
      return chapterNumber > 1;
    }
    
    return false;
  };

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
  
  // ✅ Extraire validateIfTimeElapsed et getTimeOnCurrentPage
  const autoProgressHook = useAutoProgress({
    minTimeOnPage: 6000,
    enabled: true 
  });
  
  const { 
    isEnabled: autoProgressEnabled, 
    currentPageInfo, 
    validateIfTimeElapsed, 
    getTimeOnCurrentPage,
    hasValidated  // ✅ AJOUTÉ: Récupérer hasValidated pour arrêter le setInterval
  } = autoProgressHook;

  const currentOpenChapter = useMemo(() => {
    const chapter = chapters.find(ch =>
      ch.pages.some(p => p.href === pathname)
    )?.chapterNumber;
    return chapter;
  }, [pathname]);

  const progressPercentage = useMemo(() => {
    return calculateProgress(completedPages, completedQuizzes);
  }, [completedPages, completedQuizzes, updateTrigger]);

  // ✅ Fonction ajustée pour vérifier pages + quiz, avec cas spécial pour chapitre 0
  const isChapterCompleted = useCallback((chapter: typeof chapters[0]) => {
    const pagesCompleted = chapter.pages.filter(p => p.pageNumber !== 30).every(page => completedPages.has(page.pageNumber));
    const quizCompleted = chapter.quiz ? completedQuizzes.has(chapter.chapterNumber) : true;

    // Cas spécial pour le chapitre 0 : pas de pages, seulement le quiz
    if (chapter.chapterNumber === 0) {
      return quizCompleted;
    }

    return pagesCompleted && quizCompleted;
  }, [completedPages, completedQuizzes]);

  const [showRestrictionModal, setShowRestrictionModal] = useState(false);
  const [restrictedChapterName, setRestrictedChapterName] = useState('');

  useEffect(() => {
    fetchUser();
  }, []);

  // Mettre à jour à chaque focus (tab switch, reconnexion)
  useEffect(() => {
    const handleFocus = () => {
      console.log('🔄 SidebarContent focus - Rafraîchissement utilisateur');
      fetchUser();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        console.log('🔄 SidebarContent tab visible - Rafraîchissement utilisateur');
        fetchUser();
      }
    };

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Mettre à jour aussi quand le pathname change (navigation)
  useEffect(() => {
    console.log('🔄 SidebarContent pathname changed - Rafraîchissement utilisateur');
    fetchUser();
  }, [pathname]);

  const handleChapterClick = (chapterNumber: number, chapterTitle: string) => {
    if (isChapterLocked(chapterNumber)) {
      setRestrictedChapterName(`Chapitre ${chapterNumber} - ${chapterTitle}`);
      setShowRestrictionModal(true);
    } else {
      setOpen(prev => ({ ...prev, [chapterNumber]: !prev[chapterNumber] }));
    }
  };

  const handleNavigation = useCallback(async (href: string, e: React.MouseEvent) => {
    const timeOnPage = getTimeOnCurrentPage();

    if (!isProfessorMode && timeOnPage >= 6000) {
      e.preventDefault();

      // ✅ CORRIGÉ: Vérifier que validateIfTimeElapsed existe avant de l'appeler
      if (validateIfTimeElapsed && typeof validateIfTimeElapsed === 'function') {
        console.log('📞 [SIDEBAR] Appel validateIfTimeElapsed');
        const validated = await validateIfTimeElapsed();
        console.log('✅ [SIDEBAR] Validation résultat:', validated);
      }
      
      setTimeout(() => {
        router.push(href);
      }, 100);
    }
  }, [getTimeOnCurrentPage, validateIfTimeElapsed, router, isProfessorMode]);

  const handleDashboardReturn = useCallback(() => {
    if (!isProfessorMode) {
      fetch('/api/auth/time/stop', { method: 'POST', headers: { 'Content-Type': 'application/json' } }).catch(console.error);
    }
  }, [isProfessorMode]);

  const handleTogglePageCompletion = (pageNumber: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    togglePageCompletion(pageNumber);
  };

  useEffect(() => {
    if (currentOpenChapter !== undefined) {
      setOpen(prev => ({ ...prev, [currentOpenChapter]: true }));
    }
  }, [currentOpenChapter]);

  // ✅ CORRIGÉ: setInterval qui s'arrête UNE FOIS que hasValidated = TRUE
  useEffect(() => {
    if (!isProfessorMode && autoProgressEnabled) {
      const checkInterval = setInterval(async () => {
        const timeOnPage = getTimeOnCurrentPage();
        
        console.log('⏱️ [SIDEBAR] Check interval:', {
          timeOnPage,
          hasValidated,
          minTimeOnPage: 6000
        });
        
        // ✅ IMPORTANT: Si déjà validé, arrêter le setInterval!
        if (hasValidated) {
          console.log('✅ [SIDEBAR] Déjà validé, arrêt du setInterval');
          clearInterval(checkInterval);
          return;
        }
        
        // ✅ Valider seulement si temps suffisant et pas encore validé
        if (validateIfTimeElapsed && typeof validateIfTimeElapsed === 'function' && timeOnPage >= 6000) {
          console.log('📞 [SIDEBAR] Auto-validation via setInterval');
          await validateIfTimeElapsed();
        }
      }, 500);
      
      return () => clearInterval(checkInterval);
    }
  }, [isProfessorMode, autoProgressEnabled, getTimeOnCurrentPage, validateIfTimeElapsed, hasValidated]);

  useEffect(() => {
    if (isProfessorMode) return;
    const eventSource = new EventSource('/api/progress/stream');
    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'progress_update') {
          updateFromExternal({
            completedPages: data.completedPages,
            completedQuizzes: data.completedQuizzes
          });
        }
      } catch (error) {
        console.error(error);
      }
    };
    return () => eventSource.close();
  }, [isProfessorMode, updateFromExternal]);

  if (isLoading) {
    return (
      <div className="flex flex-col h-full text-white bg-gray-900">
        <div className="px-6 py-5 border-b border-gray-800 flex-shrink-0">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-700 rounded mb-3"></div>
            <div className="h-4 bg-gray-700 rounded w-3/4"></div>
          </div>
        </div>
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full text-gray-100 bg-gray-900">
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-800 flex-shrink-0">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <BookOpen className="text-blue-400" size={20} />
          <span>Sommaire du Cours</span>
        </h1>
        <div className="mt-3">
          <Link
            href={isProfessorMode ? "/professor" : "/dashboard"}
            onClick={handleDashboardReturn}
            className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors text-gray-200 hover:bg-gray-800"
          >
            <Home size={16} className="text-blue-400" />
            <span>Retour au tableau de bord</span>
          </Link>
        </div>

        {!isProfessorMode && (
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-1">
              <span>Progression</span>
              <span className="font-medium text-blue-400">{progressPercentage}%</span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-grow overflow-y-auto touch-auto overscroll-contain scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
        <ul className="space-y-1 px-3">
          {chapters.map((chapter) => {
            const chapterComplete = isChapterCompleted(chapter);
            const isLocked = isChapterLocked(chapter.chapterNumber);
            return (
              <li key={chapter.chapterNumber} className="rounded-lg">
                <button
                  onClick={() => handleChapterClick(chapter.chapterNumber, chapter.title)}
                  className={`w-full text-left px-3 py-3 flex justify-between items-center rounded-lg transition-colors ${
                    open[chapter.chapterNumber]
                      ? 'bg-gray-800 text-gray-100'
                      : 'hover:bg-gray-800 text-gray-200'
                  } ${chapterComplete && !isProfessorMode ? '!text-blue-400' : ''}`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`font-bold ${isLocked ? 'blur-sm opacity-75' : ''}`}>
                      {chapter.chapterNumber === 0 ? 'Phase préparatoire' : `${chapter.chapterNumber}.`} {chapter.title}
                    </span>
                  </div>
                  {!isLocked && (open[chapter.chapterNumber] ? (
                    <ChevronDown className={`${chapterComplete && !isProfessorMode ? 'text-blue-400' : 'text-gray-400'}`} size={18} />
                  ) : (
                    <ChevronRight className={`${chapterComplete && !isProfessorMode ? 'text-blue-400' : 'text-gray-400'}`} size={18} />
                  ))}
                </button>

                {open[chapter.chapterNumber] && (
                  <ul className="ml-8 mt-1 space-y-1 py-1 border-l-2 border-gray-700">
                    {getVideoByChapter(chapter.chapterNumber) && (
                      <li key={`video-${chapter.chapterNumber}`}>
                        <Link
                          href={`/chapitres/${chapter.chapterNumber}/video`}
                          className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors ${
                            pathname === `/chapitres/${chapter.chapterNumber}/video`
                              ? 'bg-gray-800 text-blue-400 border-l-2 border-blue-500'
                              : 'hover:bg-gray-800 text-gray-200'
                          }`}
                        >
                          <Play size={14} className="text-blue-400" />
                          <span className="font-semibold">Vidéo explicative</span>
                        </Link>
                      </li>
                    )}

                    {chapter.introduction && (
                      <li key={`intro-${chapter.chapterNumber}`}>
                        <Link
                          href={`/chapitres/${chapter.chapterNumber}/introduction`}
                          className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors ${
                            pathname === `/chapitres/${chapter.chapterNumber}/introduction`
                              ? 'bg-gray-800 text-blue-400 border-l-2 border-blue-500'
                              : 'hover:bg-gray-800 text-gray-200'
                          }`}
                        >
                          <BookOpen size={14} className="text-blue-400" />
                          <span>Synthèse</span>
                        </Link>
                      </li>
                    )}

                    {chapter.pages.map((page) => {
                      const isCompleted = completedPages.has(page.pageNumber);
                      return (
                        <li key={page.pageNumber}>
                          <Link
                            href={page.href}
                            onClick={(e) => handleNavigation(page.href, e)}
                            className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors ${
                              pathname === page.href
                                ? 'bg-gray-800 text-blue-400 border-l-2 border-blue-500'
                                : 'hover:bg-gray-800 text-gray-200'
                            }`}
                          >
                            {!isProfessorMode && chapter.chapterNumber !== 11 && page.pageNumber !== 30 && (
                              <button
                                onClick={(e) => handleTogglePageCompletion(page.pageNumber, e)}
                                className="flex-shrink-0"
                              >
                                {isCompleted ? (
                                  <CheckCircle className="text-green-500" size={14} />
                                ) : (
                                  <Circle className="text-gray-500 hover:text-green-400" size={14} />
                                )}
                              </button>
                            )}
                            <span>
                              <span className="font-medium">{page.pageNumber}.</span> {page.title}
                            </span>
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
                              ? 'bg-gray-800 text-blue-400 border-l-2 border-blue-500'
                              : 'hover:bg-gray-800 text-gray-200'
                          }`}
                        >
                          {!isProfessorMode && chapter.chapterNumber !== 11 && (
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                toggleQuizCompletion(chapter.chapterNumber);
                              }}
                              className="flex-shrink-0"
                            >
                              {completedQuizzes.has(chapter.chapterNumber) ? (
                                <CheckCircle className="text-green-500" size={14} />
                              ) : (
                                <Circle className="text-gray-500 hover:text-green-400" size={14} />
                              )}
                            </button>
                          )}
                          <BookOpen size={14} className="text-blue-400" />
                          <span className="font-semibold">Quiz</span>
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

      {!isProfessorMode && (
        <div className="border-t border-gray-800 px-6 py-3 text-xs text-gray-400 flex justify-between">
          <span>Pages complétées: {completedPages.size}</span>
          <span>Quiz complétés: {completedQuizzes.size}</span>
        </div>
      )}

      <FreeTrialRestrictionModal
        isOpen={showRestrictionModal}
        onClose={() => setShowRestrictionModal(false)}
        contentName={restrictedChapterName}
      />
    </div>
  );
}