'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import PageNavigation from '@/app/components/PageNavigation';

// Mapping audio pour la définition du Noon Sâkin et Tanwîn
const chapter2Page2AudioMappings: { [key: string]: string } = {
  'نْ': 'noon_sakin',
  'ــًــٍــٌ': 'tanwin',
  'Fathatan': 'fathatan',
  'Dammatan': 'dammatan',
  'Kasratan': 'kasratan'
};

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

const IntroductionPage = () => {
  return (
    <div className="p-4 md:p-8 bg-gray-900">
      <div className="w-full bg-gray-800 rounded-lg p-6 md:p-8">
        <div className="text-white space-y-6 text-lg md:text-xl leading-relaxed">
          <h2 className="text-3xl font-bold text-blue-400 mb-4">Définition du Noon Sâkin et du Tanwîn</h2>
          
          <p>
            Le <span className="text-blue-400 font-semibold">Noon Sâkin (نْ)</span> est la lettre Noon (ن) portant un Soukoun (ْ), 
            c'est-à-dire sans voyelle. Elle se prononce avec un son nasal clair et net.
          </p>
          
          <p>
            Le <span className="text-purple-400 font-semibold">Tanwîn (التنوين)</span> est un doublement des voyelles à la fin d'un mot. 
            Il produit un son "n" à la fin et existe en trois formes :
          </p>
          
          <ul className="ml-4 space-y-2">
            <li>✓ <span className="text-green-400 font-semibold">Fathatan (ـًـ)</span> : double fatha → son "an"</li>
            <li>✓ <span className="text-green-400 font-semibold">Dammatan (ـٌ)</span> : double damma → son "oun"</li>
            <li>✓ <span className="text-green-400 font-semibold">Kasratan (ـٍ)</span> : double kasra → son "in"</li>
          </ul>
          
          <div className="bg-blue-900/30 border border-blue-500/50 rounded-lg p-4 md:p-6 my-6">
            <p>
              💡 <span className="font-semibold">Point Important :</span> Le Noon Sâkin et le Tanwîn partagent les mêmes règles 
              de prononciation (Idh-hâr, Idghâm, Iqlâb, Ikhfâ'). Ces règles dépendent de la lettre qui suit.
            </p>
          </div>
          
          <p>
            Ces quatre règles sont essentielles pour une récitation correcte du Coran et seront étudiées 
            en détail dans les pages suivantes.
          </p>
        </div>
      </div>
      
      <div className="px-4 md:px-8">
        <PageNavigation currentChapter={2} currentPage={2} module="TAJWID" className="mt-6 mb-4" />
      </div>

      <footer className="border-t-1 text-white text-center p-4 md:p-6 mt-8 flex-shrink-0 font-semibold text-base md:text-lg">
        <div>Chapitre 2 - Page 2</div>
        <div className="mt-1">© 2025 Tous droits réservés</div>
      </footer>
    </div>
  );
};

const RulesPage = ({ playRuleAudio, activeIndex, setActiveIndex }: {
  playRuleAudio: (ruleKey: string, index?: number) => void;
  activeIndex: number;
  setActiveIndex: (index: number) => void;
}) => {
  const rules = [
    { 
      letter: 'نْ', 
      title: 'Noon Sâkin', 
      description: 'ن avec soukoun',
      audioKey: 'نْ',
      color: 'blue' as const
    },
    { 
      letter: 'ــًــٍــٌ', 
      title: 'Tanwîn', 
      description: 'Signes diacritiques',
      audioKey: 'ــًــٍــٌ',
      color: 'purple' as const
    },
    { 
      letter: 'ـًـ', 
      title: 'Fathatan', 
      description: 'Double fatha → "an"',
      audioKey: 'Fathatan',
      color: 'green' as const
    },
    { 
      letter: 'ـٌ', 
      title: 'Dammatan', 
      description: 'Double damma → "oun"',
      audioKey: 'Dammatan',
      color: 'green' as const
    },
    { 
      letter: 'ـٍ', 
      title: 'Kasratan', 
      description: 'Double kasra → "in"',
      audioKey: 'Kasratan',
      color: 'green' as const
    }
  ];

  return (
    <div className="p-2 md:p-4 lg:p-8 bg-gray-900">
      <h2 className="text-2xl md:text-3xl font-bold text-blue-400 mb-6 text-center">Les éléments du Noon Sâkin et Tanwîn</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4 lg:gap-5 mb-6">
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
      
      {/* Explication des quatre règles */}
      <div className="bg-gray-800 rounded-lg p-4 md:p-6 mb-6">
        <div className="text-white space-y-4">
          <h3 className="text-xl md:text-2xl font-bold text-amber-300 mb-4">Les quatre règles du Noon Sâkin et Tanwîn</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-4">
              <h4 className="text-red-400 font-bold text-lg">1. Idh-hâr (الإظهار)</h4>
              <p className="text-gray-300 mt-2">Prononciation claire devant 6 lettres de gorge</p>
            </div>
            
            <div className="bg-amber-900/30 border border-amber-500/50 rounded-lg p-4">
              <h4 className="text-amber-400 font-bold text-lg">2. Idghâm (الإدغام)</h4>
              <p className="text-gray-300 mt-2">Fusion avec 6 lettres : ي ر م ل و ن</p>
            </div>
            
            <div className="bg-purple-900/30 border border-purple-500/50 rounded-lg p-4">
              <h4 className="text-purple-400 font-bold text-lg">3. Iqlâb (الإقلاب)</h4>
              <p className="text-gray-300 mt-2">Transformation en Mîm devant ب</p>
            </div>
            
            <div className="bg-blue-900/30 border border-blue-500/50 rounded-lg p-4">
              <h4 className="text-blue-400 font-bold text-lg">4. Ikhfâ' (الإخفاء)</h4>
              <p className="text-gray-300 mt-2">Dissimulation devant 15 lettres restantes</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="px-4 md:px-8">
        <PageNavigation currentChapter={2} currentPage={2} module="TAJWID" className="mt-6 mb-4" />
      </div>

      <footer className="border-t-1 text-white text-center p-4 md:p-6 mt-8 flex-shrink-0 font-semibold text-base md:text-lg">
        <div>Chapitre 2 - Page 2</div>
        <div className="mt-1">© 2025 Tous droits réservés</div>
      </footer>
    </div>
  );
};

const Page2 = () => {
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
    
    const audioFileName = chapter2Page2AudioMappings[ruleKey];
    if (audioFileName) {
      const audio = new Audio(`/audio/chapitre2/${audioFileName}.mp3`);
      
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
    ? "Leçon : Définition du Noon Sâkin et du Tanwîn"
    : "Les éléments et règles";

  return (
    <div className="font-arabic min-h-screen bg-gray-900">
      <div className="w-full h-full overflow-hidden bg-gray-900">
        
        {/* Header */}
        <div className="text-white p-4 md:p-6 text-center border-b-2">
          <div className="text-2xl md:text-3xl font-bold mb-2">
            {pageTitle}
          </div>
          {currentPage === 1 && (
            <div className="text-md md:text-lg text-blue-300">
              Cliquez pour écouter chaque élément
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
        {currentPage === 0 && <IntroductionPage />}
        {currentPage === 1 && <RulesPage playRuleAudio={playRuleAudio} activeIndex={activeIndex} setActiveIndex={setActiveIndex} />}
      </div>
    </div>
  );
};

export default Page2;
