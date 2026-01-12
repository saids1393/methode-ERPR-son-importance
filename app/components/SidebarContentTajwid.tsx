'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useMemo, useCallback } from "react";
import { ChevronDown, ChevronRight, BookOpen, CheckCircle, Circle, Home, Play, PenTool } from "lucide-react";
import { chaptersTajwid } from "@/lib/chapters-tajwid";
import { useTajwidProgress } from "@/hooks/useTajwidProgress";
import { useTajwidChapterVideos } from "@/hooks/useTajwidChapterVideos";
import { useAutoProgress } from "@/hooks/useAutoProgress";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  email: string;
  username: string | null;
  gender: 'HOMME' | 'FEMME' | null;
  isActive: boolean;
  accountType?: 'ACTIVE' | 'INACTIVE' | 'PAID_LEGACY';
  subscriptionPlan?: 'SOLO' | 'COACHING' | null;
}


const calculateProgress = (completedPages: Set<number>, completedQuizzes: Set<number>) => {
  // Récupérer toutes les pages valides des chapitres Tajwid (1-8), exclure page 0
  const validPageNumbers = new Set<number>();
  chaptersTajwid.forEach(ch => {
    ch.pages.forEach(p => {
      if (p.pageNumber !== 0) {
        validPageNumbers.add(p.pageNumber);
      }
    });
  });
  
  // Récupérer tous les numéros de chapitres qui ont un quiz
  const validQuizChapters = new Set<number>();
  chaptersTajwid.forEach(ch => {
    if (ch.quiz && ch.quiz.length > 0) {
      validQuizChapters.add(ch.chapterNumber);
    }
  });

  // Total = nombre de pages (sans page 28) + nombre de quizzes
  const totalPages = validPageNumbers.size; // 32 pages (0-32 sans 28)
  const totalQuizzes = validQuizChapters.size; // 8 quizzes (chapitres 1-8)
  const totalItems = totalPages + totalQuizzes; // 40 items

  // Compter uniquement les pages complétées qui existent dans Tajwid (sans page 28)
  let completedPagesCount = 0;
  completedPages.forEach(pageNum => {
    if (validPageNumbers.has(pageNum)) {
      completedPagesCount++;
    }
  });

  // Compter uniquement les quizzes complétés qui existent dans Tajwid
  let completedQuizzesCount = 0;
  completedQuizzes.forEach(quizNum => {
    if (validQuizChapters.has(quizNum)) {
      completedQuizzesCount++;
    }
  });

  const completedItems = completedPagesCount + completedQuizzesCount;
  
  // 0% si rien validé, 100% si tout validé
  if (completedItems === 0) return 0;
  if (completedItems >= totalItems) return 100;
  return Math.round((completedItems / totalItems) * 100);
};


export default function SidebarContentTajwid() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState<Record<number, boolean>>({});
  const [user, setUser] = useState<User | null>(null);
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
          console.log('✅ User fetched in SidebarContentTajwid:', {
            email: data.user.email,
            accountType: data.user.accountType,
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
    
    // Si compte actif (ACTIVE ou PAID_LEGACY), rien n'est verrouillé
    if (user.isActive || user.accountType === 'ACTIVE' || user.accountType === 'PAID_LEGACY') return false;
    
    // Si compte inactif, tous les chapitres sont verrouillés
    if (user.accountType === 'INACTIVE' || !user.isActive) {
      return true;
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
  } = useTajwidProgress();

  const { getVideoByChapter } = useTajwidChapterVideos();
  
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
    const chapter = chaptersTajwid.find(ch =>
      ch.pages.some(p => p.href === pathname)
    )?.chapterNumber;
    return chapter;
  }, [pathname]);

  const progressPercentage = useMemo(() => {
    return calculateProgress(completedPages, completedQuizzes);
  }, [completedPages, completedQuizzes, updateTrigger]);

  // ✅ Fonction ajustée pour vérifier pages + quiz, avec cas spécial pour chapitre 1
  const isChapterCompleted = useCallback((chapter: typeof chaptersTajwid[0]) => {
    const pagesCompleted = chapter.pages.filter(p => p.pageNumber !== 0).every(page => completedPages.has(page.pageNumber));
    const quizCompleted = chapter.quiz ? completedQuizzes.has(chapter.chapterNumber) : true;

    // Cas spécial pour le chapitre 1 : toutes les pages et le quiz
    if (chapter.chapterNumber === 1) {
      return pagesCompleted && quizCompleted;
    }

    return pagesCompleted && quizCompleted;
  }, [completedPages, completedQuizzes]);

  const [showRestrictionModal, setShowRestrictionModal] = useState(false);
  const [restrictedChapterName, setRestrictedChapterName] = useState('');

  // Charger l'utilisateur une seule fois au montage
  useEffect(() => {
    fetchUser();
  }, []);

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
        console.log('📞 [SIDEBAR TAJWID] Appel validateIfTimeElapsed');
        const validated = await validateIfTimeElapsed();
        console.log('✅ [SIDEBAR TAJWID] Validation résultat:', validated);
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
        
        console.log('⏱️ [SIDEBAR TAJWID] Check interval:', {
          timeOnPage,
          hasValidated,
          minTimeOnPage: 6000
        });
        
        // ✅ IMPORTANT: Si déjà validé, arrêter le setInterval!
        if (hasValidated) {
          console.log('✅ [SIDEBAR TAJWID] Déjà validé, arrêt du setInterval');
          clearInterval(checkInterval);
          return;
        }
        
        // ✅ Valider seulement si temps suffisant et pas encore validé
        if (validateIfTimeElapsed && typeof validateIfTimeElapsed === 'function' && timeOnPage >= 6000) {
          console.log('📞 [SIDEBAR TAJWID] Auto-validation via setInterval');
          await validateIfTimeElapsed();
        }
      }, 10000); // Vérifier toutes les 10 secondes au lieu de 2
      
      return () => clearInterval(checkInterval);
    }
  }, [isProfessorMode, autoProgressEnabled, getTimeOnCurrentPage, validateIfTimeElapsed, hasValidated]);

  // Removed EventSource listener - using local state updates instead

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
          <span>Sommaire du Cours Tajwid</span>
        </h1>
        <div className="mt-3 space-y-1">
          <Link
            href={isProfessorMode ? "/professor" : "/dashboard"}
            onClick={handleDashboardReturn}
            className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors text-gray-200 hover:bg-gray-800"
          >
            <Home size={16} className="text-blue-400" />
            <span>Retour au tableau de bord</span>
          </Link>
          <Link
            href="/devoirs-tajwid"
            className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors text-gray-200 hover:bg-gray-800"
          >
            <BookOpen size={16} className="text-green-400" />
            <span>Mes devoirs Tajwid</span>
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
      <nav className="flex-grow overflow-y-auto touch-auto overscroll-contain scrollbar-thin scrollbar-thumb-transparent hover:scrollbar-thumb-gray-700 scrollbar-track-transparent transition-colors">
        <ul className="space-y-1 px-3">
          {chaptersTajwid.map((chapter) => {
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
                      {chapter.chapterNumber === 1 ? 'Chapitre 1' : `${chapter.chapterNumber}.`} {chapter.title}
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
                          href={`/chapitres-tajwid/${chapter.chapterNumber}/video`}
                          className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors ${
                            pathname === `/chapitres-tajwid/${chapter.chapterNumber}/video`
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
                          href={`/chapitres-tajwid/${chapter.chapterNumber}/introduction`}
                          className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors ${
                            pathname === `/chapitres-tajwid/${chapter.chapterNumber}/introduction`
                              ? 'bg-gray-800 text-blue-400 border-l-2 border-blue-500'
                              : 'hover:bg-gray-800 text-gray-200'
                          }`}
                        >
                          <BookOpen size={14} className="text-blue-400" />
                          <span>Introduction</span>
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
                            {!isProfessorMode && chapter.chapterNumber !== 10 && chapter.chapterNumber !== 9 && page.pageNumber !== 0 && page.pageNumber !== 33 && (
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
                          href={`/chapitres-tajwid/${chapter.chapterNumber}/quiz`}
                          onClick={(e) => handleNavigation(`/chapitres-tajwid/${chapter.chapterNumber}/quiz`, e)}
                          className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors ${
                            pathname === `/chapitres-tajwid/${chapter.chapterNumber}/quiz`
                              ? 'bg-gray-800 text-blue-400 border-l-2 border-blue-500'
                              : 'hover:bg-gray-800 text-gray-200'
                          }`}
                        >
                          {!isProfessorMode && chapter.chapterNumber !== 10 && (
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

                    {chapter.chapterNumber !== 10 && chapter.chapterNumber !== 9 && (
                      <li key={`exercise-${chapter.chapterNumber}`}>
                        <Link
                          href={`/chapitres-tajwid/exercice/${chapter.chapterNumber}`}
                          onClick={(e) => handleNavigation(`/chapitres-tajwid/exercice/${chapter.chapterNumber}`, e)}
                          className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors ${
                            pathname === `/chapitres-tajwid/exercice/${chapter.chapterNumber}`
                              ? 'bg-gray-800 text-blue-400 border-l-2 border-blue-500'
                              : 'hover:bg-gray-800 text-gray-200'
                          }`}
                        >
                          <PenTool size={14} className="text-blue-400" />
                          <span className="font-semibold">Exercice {chapter.chapterNumber}</span>
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
    </div>
  );
}
