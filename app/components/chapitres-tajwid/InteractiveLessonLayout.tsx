'use client';

import React, { useState, ReactNode } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import PageNavigation from '@/app/components/PageNavigation';

interface InteractiveLessonLayoutProps {
  currentChapter: number;
  currentPage: number;
  totalPages: number;
  pageTitles: string[];
  introductionPage: ReactNode;
  rulesPage: ReactNode;
  audioMappings: { [key: string]: string };
  audioPath: string;
}

const InteractiveLessonLayout = ({
  currentChapter,
  currentPage,
  totalPages,
  pageTitles,
  introductionPage,
  rulesPage,
  audioMappings,
  audioPath
}: InteractiveLessonLayoutProps) => {
  const [activePage, setActivePage] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);

  const playRuleAudio = (ruleKey: string, index: number = 0) => {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }
    
    setActiveIndex(index);
    
    const audioFileName = audioMappings[ruleKey];
    if (audioFileName) {
      const audio = new Audio(`/audio/${audioPath}/${audioFileName}.mp3`);
      
      audio.addEventListener('ended', () => {
        setCurrentAudio(null);
      });
      
      setCurrentAudio(audio);
      audio.play().catch(error => {
        console.error('Erreur lors de la lecture audio:', error);
        setCurrentAudio(null);
      });
    }
  };

  const goToNextPage = () => {
    if (activePage < totalPages - 1) {
      setActivePage(activePage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (activePage > 0) {
      setActivePage(activePage - 1);
    }
  };

  const pageTitle = pageTitles[activePage] || '';

  const enrichedRulesPage = React.isValidElement(rulesPage) 
    ? React.cloneElement(rulesPage as React.ReactElement<any>, { playRuleAudio, activeIndex, setActiveIndex })
    : rulesPage;

  return (
    <div className="font-arabic min-h-screen bg-gray-900">
      <div className="w-full h-full overflow-hidden bg-gray-900">
        
        {/* Header */}
        <div className="text-white p-4 md:p-6 text-center border-b-2">
          <div className="text-2xl md:text-3xl font-bold mb-2">
            {pageTitle}
          </div>
          {activePage === 1 && (
            <div className="text-md md:text-lg text-amber-300">
              Cliquez pour écouter chaque règle et élément
            </div>
          )}
        </div>
        
        {/* Navigation Buttons */}
        <div className="flex justify-between items-center px-2 md:px-4 lg:px-8 py-4">
          <button
            onClick={goToPreviousPage}
            disabled={activePage === 0}
            className={`w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 rounded-full border-2 flex items-center justify-center transition-all ${
              activePage === 0
                ? 'border-gray-600 text-gray-600 cursor-not-allowed'
                : 'border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white hover:scale-110'
            }`}
          >
            <ChevronLeft size={16} className="md:w-5 md:h-5 lg:w-6 lg:h-6" />
          </button>

          <div className="text-white font-semibold text-xs md:text-sm lg:text-base">
            Page {activePage + 1} / {totalPages}
          </div>

          <button
            onClick={goToNextPage}
            disabled={activePage === totalPages - 1}
            className={`w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 rounded-full border-2 flex items-center justify-center transition-all ${
              activePage === totalPages - 1
                ? 'border-gray-600 text-gray-600 cursor-not-allowed'
                : 'border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white hover:scale-110'
            }`}
          >
            <ChevronRight size={16} className="md:w-5 md:h-5 lg:w-6 lg:h-6" />
          </button>
        </div>

        {/* Content */}
        {activePage === 0 && introductionPage}
        {activePage === 1 && enrichedRulesPage}

        <div className="px-4 md:px-8">
            <PageNavigation currentChapter={currentChapter} currentPage={currentPage} className="mt-6 mb-4" module="TAJWID" />
        </div>
      </div>
    </div>
  );
};

export default InteractiveLessonLayout;
