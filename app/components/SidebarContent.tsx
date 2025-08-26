// app/components/SidebarContent.tsx

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
  const totalPages = chapters
    .filter(ch => ch.chapterNumber !== 0 && ch.chapterNumber !== 11)
    .reduce((total, ch) => total + ch.pages.length, 0);

  const totalQuizzes = chapters
    .filter(ch => ch.quiz && ch.quiz.length > 0 && ch.chapterNumber !== 11)
    .length;

  const totalItems = totalPages + totalQuizzes;

  const completedPagesFiltered = Array.from(completedPages).filter(pageNum => pageNum !== 0 && pageNum !== 30);
  const completedQuizzesFiltered = Array.from(completedQuizzes).filter(quizNum => quizNum !== 11);

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

  const isChapterCompleted = useCallback((chapter: typeof chapters[0]) => {
    return chapter.pages.every(page => completedPages.has(page.pageNumber));
  }, [completedPages]);

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
      <div className="flex flex-col h-full text-black bg-white">
        <div className="px-6 py-5 border-b border-gray-200 flex-shrink-0">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded mb-3"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full text-black bg-white">
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-200 flex-shrink-0">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <BookOpen className="text-blue-700" size={20} />
          <span>Sommaire du Cours</span>
        </h1>
        <div className="mt-3">
          <Link
            href={isProfessorMode ? "/professor" : "/dashboard"}
            onClick={handleDashboardReturn}
            className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors text-black hover:bg-gray-200"
          >
            <Home size={16} className="text-blue-700" />
            <span>Retour au tableau de bord</span>
          </Link>
        </div>

        {!isProfessorMode && (
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-black">Progression</span>
              <span className="font-medium text-blue-700">{progressPercentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-700 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-grow overflow-y-auto touch-auto overscroll-contain scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent">
        <ul className="space-y-1 px-3">
          {chapters.map((chapter) => {
            const chapterComplete = isChapterCompleted(chapter);
            return (
              <li key={chapter.chapterNumber} className="rounded-lg">
                <button
                  onClick={() => setOpen(prev => ({ ...prev, [chapter.chapterNumber]: !prev[chapter.chapterNumber] }))}
                  className={`w-full text-left px-3 py-3 flex justify-between items-center rounded-lg transition-colors ${
                    open[chapter.chapterNumber]
                      ? 'bg-gray-200 text-black'
                      : 'hover:bg-gray-100 text-black'
                  } ${chapterComplete && !isProfessorMode ? '!text-blue-700' : ''}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-bold">
                      {chapter.chapterNumber === 0 ? 'Phase préparatoire' : `${chapter.chapterNumber}.`} {chapter.title}
                    </span>
                  </div>
                  {open[chapter.chapterNumber] ? (
                    <ChevronDown className={`${chapterComplete && !isProfessorMode ? 'text-blue-700' : 'text-gray-700'}`} size={18} />
                  ) : (
                    <ChevronRight className={`${chapterComplete && !isProfessorMode ? 'text-blue-700' : 'text-gray-700'}`} size={18} />
                  )}
                </button>

                {open[chapter.chapterNumber] && (
                  <ul className="ml-8 mt-1 space-y-1 py-1 border-l-2 border-gray-200">
                    {getVideoByChapter(chapter.chapterNumber) && (
                      <li key={`video-${chapter.chapterNumber}`}>
                        <Link
                          href={`/chapitres/${chapter.chapterNumber}/video`}
                          className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors ${
                            pathname === `/chapitres/${chapter.chapterNumber}/video`
                              ? 'bg-blue-100 text-black border-l-2 border-blue-700'
                              : 'hover:bg-gray-100 text-black'
                          }`}
                        >
                          <Play size={14} className="text-blue-700" />
                          <span className="font-semibold">Vidéo du chapitre</span>
                        </Link>
                      </li>
                    )}

                    {chapter.introduction && (
                      <li key={`intro-${chapter.chapterNumber}`}>
                        <Link
                          href={`/chapitres/${chapter.chapterNumber}/introduction`}
                          className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors ${
                            pathname === `/chapitres/${chapter.chapterNumber}/introduction`
                              ? 'bg-blue-100 text-black border-l-2 border-blue-700'
                              : 'hover:bg-gray-100 text-black'
                          }`}
                        >
                          <BookOpen size={14} className="text-blue-700" />
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
                                ? 'bg-blue-100 text-black border-l-2 border-blue-700'
                                : 'hover:bg-gray-100 text-black'
                            }`}
                          >
                            {!isProfessorMode && chapter.chapterNumber !== 0 && chapter.chapterNumber !== 11 && (
                              <button
                                onClick={(e) => handleTogglePageCompletion(page.pageNumber, e)}
                                className="flex-shrink-0"
                              >
                                {isCompleted ? (
                                  <CheckCircle className="text-green-700" size={14} />
                                ) : (
                                  <Circle className="text-gray-400 hover:text-green-700" size={14} />
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
                              ? 'bg-blue-100 text-black border-l-2 border-blue-700'
                              : 'hover:bg-gray-100 text-black'
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
                                <CheckCircle className="text-green-700" size={14} />
                              ) : (
                                <Circle className="text-gray-400 hover:text-green-700" size={14} />
                              )}
                            </button>
                          )}
                          <BookOpen size={14} className="text-blue-700" />
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
        <div className="border-t border-gray-200 px-6 py-3 text-xs text-blue-500 flex justify-between">
          <span>Pages complétées: {completedPages.size}</span>
          <span>Quiz complétés: {completedQuizzes.size}</span>
        </div>
      )}
    </div>
  );
}
