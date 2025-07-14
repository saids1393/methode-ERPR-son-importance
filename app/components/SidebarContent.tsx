'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { ChevronDown, ChevronRight, BookOpen, CheckCircle, Circle } from "lucide-react";
import { chapters } from "@/lib/chapters";

const calculateProgress = (completedPages: Set<number>) => {
  const totalPages = chapters.reduce((total, ch) => total + ch.pages.length, 0);
  return Math.round((completedPages.size / totalPages) * 100);
};

export default function SidebarContent() {
  const pathname = usePathname();
  const [open, setOpen] = useState<Record<number, boolean>>({});
  const [completedPages, setCompletedPages] = useState<Set<number>>(new Set());
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const initStorage = () => {
      try {
        const saved = window.localStorage?.getItem('completedPages') || 
                     sessionStorage.getItem('completedPages_mobile_fallback');
        if (saved) {
          setCompletedPages(new Set(JSON.parse(saved)));
        }
      } catch (e) {
        console.error("Erreur d'accès au stockage:", e);
      } finally {
        setIsReady(true);
      }
    };

    const timer = setTimeout(initStorage, 150);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isReady) return;

    const saveData = () => {
      const data = JSON.stringify(Array.from(completedPages));
      try {
        localStorage.setItem('completedPages', data);
        sessionStorage.setItem('completedPages_mobile_fallback', data);
      } catch (e) {
        console.error("Erreur de sauvegarde:", e);
        try {
          sessionStorage.setItem('completedPages', data);
        } catch (err) {
          console.error("Échec complet de sauvegarde:", err);
        }
      }
    };

    saveData();
  }, [completedPages, isReady]);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key?.startsWith('completedPages') && e.newValue) {
        setCompletedPages(new Set(JSON.parse(e.newValue)));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const togglePageCompletion = (pageNumber: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setCompletedPages(prev => {
      const newSet = new Set(prev);
      if (newSet.has(pageNumber)) {
        newSet.delete(pageNumber);
      } else {
        newSet.add(pageNumber);
      }
      return newSet;
    });
  };

  useEffect(() => {
    const currentChapter = chapters.find(ch => 
      ch.pages.some(p => p.href === pathname)
    );
    if (currentChapter) {
      setOpen(prev => ({ ...prev, [currentChapter.chapterNumber]: true }));
    }
  }, [pathname]);

  const isChapterCompleted = (chapter: typeof chapters[0]) => {
    return chapter.pages.every(page => completedPages.has(page.pageNumber));
  };

  return (
    <div className="flex flex-col h-full text-zinc-300">
      {/* Header */}
      <div className="px-6 py-5 border-b border-zinc-700 flex-shrink-0">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <BookOpen className="text-blue-400" size={20} />
          <span>Sommaire du Cours</span>
        </h1>
        <div className="mt-4">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-zinc-300">Progression</span>
            <span className="font-medium text-blue-300">
              {calculateProgress(completedPages)}%
            </span>
          </div>
          <div className="w-full bg-zinc-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-400 to-blue-600 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${calculateProgress(completedPages)}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Navigation scrollable */}
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
                  onClick={() => setOpen(prev => ({ 
                    ...prev, 
                    [chapter.chapterNumber]: !prev[chapter.chapterNumber] 
                  }))}
                  className={`w-full text-left px-3 py-3 flex justify-between items-center rounded-lg transition-colors ${
                    open[chapter.chapterNumber] 
                      ? 'bg-zinc-700/50 text-white' 
                      : 'hover:bg-zinc-700/30 text-zinc-200'
                  } ${
                    chapterComplete ? '!text-green-400/90' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-bold">
                      {chapter.chapterNumber === 0 ? "Phase préparatoire" : `${chapter.chapterNumber}.`} {chapter.title}
                    </span>
                  </div>
                  {open[chapter.chapterNumber] ? 
                    <ChevronDown size={18} className={`${chapterComplete ? 'text-green-400/70' : 'text-zinc-400'}`} /> : 
                    <ChevronRight size={18} className={`${chapterComplete ? 'text-green-400/70' : 'text-zinc-400'}`} />
                  }
                </button>
                
                {open[chapter.chapterNumber] && (
                  <ul className="ml-8 mt-1 space-y-1 py-1 border-l-2 border-zinc-700">
                    {chapter.pages.map((page) => {
                      const isCompleted = completedPages.has(page.pageNumber);
                      return (
                        <li key={page.pageNumber}>
                          <Link
                            href={page.href}
                            className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors ${
                              pathname === page.href
                                ? 'bg-blue-900/50 text-white border-l-2 border-blue-400'
                                : 'hover:bg-zinc-700/30 text-zinc-300'
                            }`}
                          >
                            <button
                              onClick={(e) => togglePageCompletion(page.pageNumber, e)}
                              className="flex-shrink-0"
                              aria-label={isCompleted ? "Marquer comme non complété" : "Marquer comme complété"}
                            >
                              {isCompleted ? (
                                <CheckCircle className="text-green-400" size={14} />
                              ) : (
                                <Circle className="text-zinc-500 hover:text-zinc-300" size={14} />
                              )}
                            </button>
                            <span>
                              <span className="font-medium text-zinc-200">{page.pageNumber}.</span> {page.title}
                            </span>
                            {pathname === page.href && (
                              <span className="ml-auto h-2 w-2 rounded-full bg-blue-400"></span>
                            )}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="border-t border-zinc-700 p-4 text-sm bg-zinc-800/50 flex-shrink-0">
        <div className="flex justify-between text-zinc-400">
          <div className="flex items-center gap-1">
            <CheckCircle className="text-green-400" size={14} />
            <span>
              {completedPages.size} complétés
            </span>
          </div>
          <div className="flex items-center gap-1">
            <BookOpen size={14} className="text-blue-400" />
            <span>
              {chapters.reduce((total, ch) => total + ch.pages.length, 0)} leçons
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
