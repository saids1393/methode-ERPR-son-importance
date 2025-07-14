'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { ChevronDown, ChevronRight, Menu, X } from "lucide-react";
import { chapters } from "@/lib/chapters";

export default function Sidebar() {
  const pathname = usePathname();
  const [openChapters, setOpenChapters] = useState<Record<number, boolean>>({});
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    const currentChapter = chapters.find(ch => ch.pages.some(p => p.href === pathname));
    if (currentChapter) {
      setOpenChapters(prev => ({ ...prev, [currentChapter.chapterNumber]: true }));
    }
  }, [pathname]);

  return (
    <>
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="md:hidden fixed top-4 left-4 z-50 bg-zinc-800 p-2 rounded-lg text-white"
        aria-label="Menu"
      >
        {mobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {mobileOpen && (
        <div 
          onClick={() => setMobileOpen(false)}
          className="md:hidden fixed inset-0 bg-black/50 z-40"
        />
      )}

      <aside className={`
        fixed md:sticky 
        top-0 left-0 
        h-screen 
        w-72
        bg-zinc-900 
        text-white
        z-40
        transform 
        transition-transform 
        duration-300
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="h-full flex flex-col">
          <div className="p-4 flex-1 overflow-y-auto">
            <h2 className="text-xl font-bold mb-4 px-2">Sommaire</h2>
            
            <nav>
              <ul className="space-y-1">
                {chapters.map(chapter => (
                  <li key={chapter.chapterNumber}>
                    <button
                      onClick={() => setOpenChapters(prev => ({
                        ...prev,
                        [chapter.chapterNumber]: !prev[chapter.chapterNumber]
                      }))}
                      className="w-full text-left px-3 py-2 hover:bg-zinc-800 rounded flex justify-between items-center"
                    >
                      <span className="font-medium">
                        {chapter.chapterNumber === 0 ? "Commencement" : `${chapter.chapterNumber}.`} {chapter.title}
                      </span>
                      {openChapters[chapter.chapterNumber] ? (
                        <ChevronDown size={18} />
                      ) : (
                        <ChevronRight size={18} />
                      )}
                    </button>

                    {openChapters[chapter.chapterNumber] && (
                      <ul className="ml-4 pl-2 border-l border-zinc-700">
                        {chapter.pages.map(page => (
                          <li key={page.pageNumber}>
                            <Link
                              href={page.href}
                              className={`block px-3 py-2 text-sm rounded ${
                                pathname === page.href 
                                  ? 'bg-blue-800 text-white' 
                                  : 'hover:bg-zinc-800 text-zinc-300'
                              }`}
                            >
                              {page.pageNumber}. {page.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </aside>
    </>
  );
}