'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import PageNavigation from '@/app/components/PageNavigation';

const chapter1Page1AudioMappings: { [key: string]: string } = {};

const Cell = ({ letter, title, description, audioKey, color, onClick, isActive }: {
  letter: string;
  title: string;
  description: string;
  audioKey: string;
  color: 'red' | 'purple' | 'amber' | 'blue' | 'green';
  onClick?: () => void;
  isActive?: boolean;
}) => {
  const colorClasses = {
    red: 'text-red-400',
    purple: 'text-purple-400',
    amber: 'text-amber-400',
    blue: 'text-blue-400',
    green: 'text-green-400'
  };

  return (
    <div
      className={`border border-zinc-500 rounded-xl p-3 md:p-4 lg:p-5 text-center min-h-[120px] md:min-h-[130px] lg:min-h-[140px] flex flex-col justify-center items-center hover:bg-zinc-700 transition-all duration-300 hover:scale-105 cursor-pointer mx-1 ${
        isActive ? 'pulse-active' : ''
      }`}
      onClick={onClick}
    >
      <div className={`text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-bold transition-colors leading-tight ${colorClasses[color]}`}>
        {letter}
      </div>
      <div className="text-white text-sm md:text-base font-semibold mt-2">
        {title}
      </div>
      <div className="text-gray-300 text-xs md:text-sm mt-1">
        {description}
      </div>
    </div>
  );
};

const IntroductionPage = ({ showNavigation }: { showNavigation: boolean }) => {
  return (
    <div className="p-4 md:p-8 bg-gray-900">
      <div className="w-full bg-gray-800 rounded-lg p-6 md:p-8">
        <div className="text-white space-y-6 text-lg md:text-xl leading-relaxed">
          <h2 className="text-3xl font-bold text-amber-300 mb-4">Qu'est-ce que les Makhârij al-Hurûf ?</h2>
          <p>Les <strong>Makhârij al-Hurûf</strong> désignent les points de sortie des lettres arabes - les lieux précis d'où provient chaque lettre lors de sa prononciation.</p>
          <p>Il existe dix-sept points de sortie principaux classifiés selon leur zone articulatoire: gorge, lèvres, dents, palais et nasalisation.</p>
        </div>
      </div>
      
      {showNavigation && (
        <div className="px-4 md:px-8 mt-6">
          <PageNavigation currentChapter={1} currentPage={1} module="TAJWID" className="mt-6 mb-4" />
        </div>
      )}

      <footer className="border-t-1 text-white text-center p-4 md:p-6 mt-8 flex-shrink-0 font-semibold text-base md:text-lg">
        <div>Chapitre 1 - Page 1</div>
        <div className="mt-1">© 2025 Tous droits réservés</div>
      </footer>
    </div>
  );
};

const RulesPage = ({ playRuleAudio, activeIndex, setActiveIndex, showNavigation }: {
  playRuleAudio: (ruleKey: string, index?: number) => void;
  activeIndex: number;
  setActiveIndex: (index: number) => void;
  showNavigation: boolean;
}) => {
  const rules: any[] = [];

  return (
    <div className="p-2 md:p-4 lg:p-8 bg-gray-900">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-5 mb-6">
        {rules.map((rule, index) => (
          <Cell
            key={index}
            letter={rule.letter}
            title={rule.title}
            description={rule.description}
            audioKey={rule.audioKey}
            color={rule.color}
            isActive={activeIndex === index}
            onClick={() => {
              playRuleAudio(rule.audioKey, index);
            }}
          />
        ))}
      </div>
      
      <div className="bg-gray-800 rounded-lg p-4 md:p-6 mb-6">
        <div className="text-white">
          <p className="text-gray-200">Contenu du Chapitre 1 - Page 1</p>
        </div>
      </div>

      {showNavigation && (
        <div className="px-4 md:px-8">
          <PageNavigation currentChapter={1} currentPage={1} module="TAJWID" className="mt-6 mb-4" />
        </div>
      )}

      <footer className="border-t-1 text-white text-center p-4 md:p-6 flex-shrink-0 font-semibold text-sm md:text-base">
        <div>Chapitre 1 - Contenu Interactif</div>
        <div className="mt-1">© 2025 Tous droits réservés</div>
      </footer>
    </div>
  );
};

const Page1 = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const totalPages = 2;

  const playRuleAudio = (ruleKey: string, index: number = 0) => {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }
    setActiveIndex(index);
  };

  const goToNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const pageTitle = currentPage === 0 
    ? "Leçon : Makhârij al-Hurûf"
    : "Contenu Interactif";

  return (
    <div className="font-arabic min-h-screen bg-gray-900">
      <div className="w-full h-full overflow-hidden bg-gray-900">
        
        {/* Header */}
        <div className="text-white p-4 md:p-6 text-center border-b-2">
          <div className="text-2xl md:text-3xl font-bold mb-2">
            {pageTitle}
          </div>
          {currentPage === 1 && (
            <div className="text-md md:text-lg text-amber-300">
              Contenu interactif
            </div>
          )}
        </div>
        
        {/* Navigation Buttons */}
        <div className="flex justify-between items-center px-2 md:px-4 lg:px-8 py-4">
          <button
            onClick={goToPreviousPage}
            disabled={currentPage === 0}
            className={`w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 rounded-full border-2 flex items-center justify-center transition-all ${
              currentPage === 0
                ? 'border-gray-600 text-gray-600 cursor-not-allowed'
                : 'border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white hover:scale-110'
            }`}
          >
            <ChevronLeft size={16} className="md:w-5 md:h-5 lg:w-6 lg:h-6" />
          </button>

          <div className="text-white font-semibold text-xs md:text-sm lg:text-base">
            Page {currentPage + 1} / {totalPages}
          </div>

          <button
            onClick={goToNextPage}
            disabled={currentPage === totalPages - 1}
            className={`w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 rounded-full border-2 flex items-center justify-center transition-all ${
              currentPage === totalPages - 1
                ? 'border-gray-600 text-gray-600 cursor-not-allowed'
                : 'border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white hover:scale-110'
            }`}
          >
            <ChevronRight size={16} className="md:w-5 md:h-5 lg:w-6 lg:h-6" />
          </button>
        </div>

        {/* Content */}
        {currentPage === 0 && <IntroductionPage showNavigation={currentPage === totalPages - 1} />}
        {currentPage === 1 && <RulesPage playRuleAudio={playRuleAudio} activeIndex={activeIndex} setActiveIndex={setActiveIndex} showNavigation={currentPage === totalPages - 1} />}
      </div>
    </div>
  );
};

export default Page1;
