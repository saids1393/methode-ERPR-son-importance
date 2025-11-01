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

const calculateProgress = (completedPages: Set<number>, completedQuizzes: Set<number>) => {
  // Count total pages (excluding chapter 0, 11, and page 30)
  const totalPages = chapters
    .filter(ch => ch.chapterNumber !== 0 && ch.chapterNumber !== 11)
    .reduce((total, ch) => total + ch.pages.filter(p => p.pageNumber !== 30).length, 0);

  // Count total quizzes (excluding chapter 0 and 11)
  const totalQuizzes = chapters
    .filter(ch => ch.quiz && ch.quiz.length > 0 && ch.chapterNumber !== 0 && ch.chapterNumber !== 11)
    .length;

  const totalItems = totalPages + totalQuizzes;

  // Count only completed pages that are not page 30
  const completedPagesFiltered = Array.from(completedPages).filter(pageNum => pageNum !== 30);
  
  // Count only completed quizzes that are not chapter 0 or 11
  const completedQuizzesFiltered = Array.from(completedQuizzes).filter(quizNum => quizNum !== 0 && quizNum !== 11);

  const completedItems = completedPagesFiltered.length + completedQuizzesFiltered.length;
  return totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
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
  const { isEnabled: autoProgressEnabled, currentPageInfo, validateIfTimeElapsed, getTimeOnCurrentPage } = useAutoProgress({
    minTimeOnPage: 6000,
    enabled: true 
  });

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

  const handleNavigation = useCallback(async (href: string, e: React.MouseEvent) => {
    const timeOnPage = getTimeOnCurrentPage();
    
    if (!isProfessorMode && timeOnPage >= 6000) {
      e.preventDefault();
      const validated = await validateIfTimeElapsed();
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

  useEffect(() => {
    if (!isProfessorMode && autoProgressEnabled) {
      const checkInterval = setInterval(async () => {
        const timeOnPage = getTimeOnCurrentPage();
        if (timeOnPage >= 6000 && currentPageInfo && !currentPageInfo.isCompleted) {
          await validateIfTimeElapsed();
        }
      }, 500);
      return () => clearInterval(checkInterval);
    }
  }, [isProfessorMode, autoProgressEnabled, currentPageInfo, getTimeOnCurrentPage, validateIfTimeElapsed]);

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
            return (
              <li key={chapter.chapterNumber} className="rounded-lg">
                <button
                  onClick={() => setOpen(prev => ({ ...prev, [chapter.chapterNumber]: !prev[chapter.chapterNumber] }))}
                  className={`w-full text-left px-3 py-3 flex justify-between items-center rounded-lg transition-colors ${
                    open[chapter.chapterNumber]
                      ? 'bg-gray-800 text-gray-100'
                      : 'hover:bg-gray-800 text-gray-200'
                  } ${chapterComplete && !isProfessorMode ? '!text-blue-400' : ''}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-bold">
                      {chapter.chapterNumber === 0 ? 'Phase préparatoire' : `${chapter.chapterNumber}.`} {chapter.title}
                    </span>
                  </div>
                  {open[chapter.chapterNumber] ? (
                    <ChevronDown className={`${chapterComplete && !isProfessorMode ? 'text-blue-400' : 'text-gray-400'}`} size={18} />
                  ) : (
                    <ChevronRight className={`${chapterComplete && !isProfessorMode ? 'text-blue-400' : 'text-gray-400'}`} size={18} />
                 

                  )}
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
                            {!isProfessorMode && chapter.chapterNumber !== 0 && chapter.chapterNumber !== 11 && page.pageNumber !== 30 && (
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
    </div>
  );
}