'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Search, Play, Pause, Volume2, Loader2, ChevronDown } from 'lucide-react';
import PageNavigation from '@/app/components/PageNavigation';

const IntroductionPage = () => {
  return (
    <div className="p-4 md:p-8 bg-gray-900">
      <div className="w-full bg-gray-800 rounded-lg p-6 md:p-8">
        <div className="text-white space-y-6 text-lg md:text-xl leading-relaxed">
          <h2 className="text-3xl font-bold text-blue-400 mb-4">Reconnaissance des erreurs dans les versets</h2>

          <p>
            Pour éviter les erreurs, il faut d'abord savoir les <span className="text-blue-300 font-semibold">reconnaître</span>.
            Cette leçon vous apprend à identifier les points sensibles dans les versets où les erreurs sont fréquentes.
          </p>

          <div className="bg-blue-900/30 border border-blue-500/50 rounded-lg p-4 md:p-6 my-6">
            <div className="flex items-center gap-2 mb-3">
              <Search className="text-blue-400 w-6 h-6" />
              <span className="font-semibold text-blue-200">Points à surveiller :</span>
            </div>
            <ul className="ml-4 space-y-2">
              <li>🔍 Les <span className="text-amber-300">voyelles finales</span> (fat-ha, damma, kasra)</li>
              <li>🔍 Les <span className="text-amber-300">lettres similaires</span> (ص/س, ط/ت, ق/ك)</li>
              <li>🔍 Les <span className="text-amber-300">règles de Tajwid</span> (madd, ghunna, idghâm)</li>
            </ul>
          </div>

          <div className="bg-teal-900/30 border border-teal-500/50 rounded-lg p-4">
            <p className="text-teal-300">
              💡 <span className="font-semibold">Méthode :</span> Écouter un récitateur de référence, 
              comparer avec votre récitation, noter les différences, corriger et répéter.
            </p>
          </div>
        </div>
      </div>

      <div className="px-4 md:px-8">
        <PageNavigation currentChapter={8} currentPage={31} module="TAJWID" className="mt-6 mb-4" />
      </div>

      <footer className="border-t-1 text-white text-center p-4 md:p-6 mt-8 flex-shrink-0 font-semibold text-base md:text-lg">
        <div>Chapitre 8 - Page 31</div>
        <div className="mt-1">© 2025 Tous droits réservés</div>
      </footer>
    </div>
  );
};

// Données des exemples - Voyelles à surveiller
const exemplesVoyelles = [
  { 
    letter: '🔍', 
    verse: 'أَنْعَمْتَ',
    translation: 'Fat-ha finale (pas damma)'
  },
  { 
    letter: '🔍', 
    verse: 'غَيْرِ',
    translation: 'Kasra finale (pas damma)'
  },
  { 
    letter: '🔍', 
    verse: 'نَسْتَعِينُ',
    translation: 'Damma finale obligatoire'
  },
  { 
    letter: '🔍', 
    verse: 'إِيَّاكَ',
    translation: 'Fat-ha finale (masculin)'
  }
];

// Données des exemples - Lettres emphatiques
const exemplesLettres = [
  { 
    letter: 'ص', 
    verse: 'الصِّرَاطَ',
    translation: 'Sâd emphatique (pas Sîn)'
  },
  { 
    letter: 'ض', 
    verse: 'الْمَغْضُوبِ',
    translation: 'Dâd emphatique (pas Dâl)'
  },
  { 
    letter: 'ض', 
    verse: 'الضَّالِّينَ',
    translation: 'Dâd avec shaddah'
  },
  { 
    letter: 'ط', 
    verse: 'طَيِّب',
    translation: 'Tâ\' emphatique (pas Tâ\')'
  }
];

// Données des exemples - Règles de Tajwid
const exemplesTajwid = [
  { 
    letter: 'مَدّ', 
    verse: 'الرَّحْمٰنِ',
    translation: 'Madd naturel + kasra finale',
    color: 'green'
  },
  { 
    letter: 'مَدّ', 
    verse: 'الرَّحِيمِ',
    translation: 'Madd naturel + kasra finale',
    color: 'green'
  },
  { 
    letter: 'إدغام', 
    verse: 'يَوْمِ الدِّينِ',
    translation: 'Idghâm du Lâm',
    color: 'purple'
  },
  { 
    letter: 'شدّة', 
    verse: 'الضَّالِّينَ',
    translation: 'Shaddah + Madd 6 temps',
    color: 'amber'
  }
];

const ExamplesPage = () => {
  const [currentVoyellesIndex, setCurrentVoyellesIndex] = useState(0);
  const [currentLettresIndex, setCurrentLettresIndex] = useState(0);
  const [currentTajwidIndex, setCurrentTajwidIndex] = useState(0);

  const currentVoyellesExample = exemplesVoyelles[currentVoyellesIndex];
  const currentLettresExample = exemplesLettres[currentLettresIndex];
  const currentTajwidExample = exemplesTajwid[currentTajwidIndex];

  const getColorClasses = (color: string) => {
    switch(color) {
      case 'green': return { border: 'border-green-500', text: 'text-green-400', bg: 'bg-green-900/30', hover: 'hover:bg-green-500' };
      case 'purple': return { border: 'border-purple-500', text: 'text-purple-400', bg: 'bg-purple-900/30', hover: 'hover:bg-purple-500' };
      case 'amber': return { border: 'border-amber-500', text: 'text-amber-400', bg: 'bg-amber-900/30', hover: 'hover:bg-amber-500' };
      default: return { border: 'border-blue-500', text: 'text-blue-400', bg: 'bg-blue-900/30', hover: 'hover:bg-blue-500' };
    }
  };

  const tajwidColors = getColorClasses(currentTajwidExample.color);

  return (
    <div className="p-2 md:p-4 lg:p-6 bg-gray-900">
      
      {/* Slider Voyelles à surveiller */}
      <div className="bg-amber-900/30 border border-amber-500/50 rounded-lg p-3 md:p-4 lg:p-6 mb-3">
        <h3 className="text-base md:text-lg font-bold text-amber-400 mb-2 text-center">Voyelles à surveiller</h3>
        
        <div className="flex items-center justify-center gap-2 sm:gap-3 md:gap-4">
          <button
            onClick={() => setCurrentVoyellesIndex((prev) => (prev - 1 + exemplesVoyelles.length) % exemplesVoyelles.length)}
            className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full border-2 border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-110 flex-shrink-0"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          <div className="flex-1 flex flex-col items-center justify-center min-h-[120px] sm:min-h-[140px] md:min-h-[160px] max-w-[400px]">
            <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-amber-400 mb-1">
              {currentVoyellesExample.letter}
            </div>
            <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-amber-300 font-bold leading-relaxed mb-1 text-center">
              {currentVoyellesExample.verse}
            </div>
            <div className="text-xs sm:text-sm md:text-base text-gray-300 italic text-center">
              {currentVoyellesExample.translation}
            </div>
            <div className="flex gap-1.5 mt-3">
              {exemplesVoyelles.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentVoyellesIndex(index)}
                  className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all ${
                    index === currentVoyellesIndex ? 'bg-amber-500 scale-125' : 'bg-gray-600'
                  }`}
                />
              ))}
            </div>
          </div>

          <button
            onClick={() => setCurrentVoyellesIndex((prev) => (prev + 1) % exemplesVoyelles.length)}
            className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full border-2 border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-110 flex-shrink-0"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>

      {/* Slider Lettres emphatiques */}
      <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-3 md:p-4 lg:p-6 mb-3">
        <h3 className="text-base md:text-lg font-bold text-red-400 mb-2 text-center">Lettres emphatiques à distinguer</h3>
        
        <div className="flex items-center justify-center gap-2 sm:gap-3 md:gap-4">
          <button
            onClick={() => setCurrentLettresIndex((prev) => (prev - 1 + exemplesLettres.length) % exemplesLettres.length)}
            className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-110 flex-shrink-0"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          <div className="flex-1 flex flex-col items-center justify-center min-h-[120px] sm:min-h-[140px] md:min-h-[160px] max-w-[400px]">
            <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-red-400 mb-1">
              {currentLettresExample.letter}
            </div>
            <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-amber-300 font-bold leading-relaxed mb-1 text-center">
              {currentLettresExample.verse}
            </div>
            <div className="text-xs sm:text-sm md:text-base text-gray-300 italic text-center">
              {currentLettresExample.translation}
            </div>
            <div className="flex gap-1.5 mt-3">
              {exemplesLettres.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentLettresIndex(index)}
                  className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all ${
                    index === currentLettresIndex ? 'bg-red-500 scale-125' : 'bg-gray-600'
                  }`}
                />
              ))}
            </div>
          </div>

          <button
            onClick={() => setCurrentLettresIndex((prev) => (prev + 1) % exemplesLettres.length)}
            className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-110 flex-shrink-0"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>

      {/* Slider Règles de Tajwid */}
      <div className={`${tajwidColors.bg} border ${tajwidColors.border} rounded-lg p-3 md:p-4 lg:p-6 mb-6 transition-all duration-300`}>
        <h3 className="text-base md:text-lg font-bold text-blue-400 mb-2 text-center">Règles de Tajwid à appliquer</h3>
        
        <div className="flex items-center justify-center gap-2 sm:gap-3 md:gap-4">
          <button
            onClick={() => setCurrentTajwidIndex((prev) => (prev - 1 + exemplesTajwid.length) % exemplesTajwid.length)}
            className={`w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full border-2 ${tajwidColors.border} ${tajwidColors.text} ${tajwidColors.hover} hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-110 flex-shrink-0`}
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          <div className="flex-1 flex flex-col items-center justify-center min-h-[120px] sm:min-h-[140px] md:min-h-[160px] max-w-[400px]">
            <div className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold ${tajwidColors.text} mb-1`}>
              {currentTajwidExample.letter}
            </div>
            <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-amber-300 font-bold leading-relaxed mb-1 text-center">
              {currentTajwidExample.verse}
            </div>
            <div className={`text-xs sm:text-sm md:text-base ${tajwidColors.text} font-semibold text-center`}>
              {currentTajwidExample.translation}
            </div>
            <div className="flex gap-1.5 mt-3">
              {exemplesTajwid.map((ex, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTajwidIndex(index)}
                  className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all ${
                    index === currentTajwidIndex ? `${getColorClasses(ex.color).text.replace('text', 'bg')} scale-125` : 'bg-gray-600'
                  }`}
                />
              ))}
            </div>
          </div>

          <button
            onClick={() => setCurrentTajwidIndex((prev) => (prev + 1) % exemplesTajwid.length)}
            className={`w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full border-2 ${tajwidColors.border} ${tajwidColors.text} ${tajwidColors.hover} hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-110 flex-shrink-0`}
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>

      <div className="px-4 md:px-8">
        <PageNavigation currentChapter={8} currentPage={31} module="TAJWID" className="mt-4 mb-4" />
      </div>

      <footer className="border-t-1 text-white text-center p-4 md:p-6 flex-shrink-0 font-semibold text-sm md:text-base">
        <div>Chapitre 8 - Page 31 : Reconnaissance</div>
        <div className="mt-1">© 2025 Tous droits réservés</div>
      </footer>
    </div>
  );
};

export default function Page31() {
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = 2;

  const goToNextPage = () => {
    if (currentPage < totalPages - 1) setCurrentPage(currentPage + 1);
  };

  const goToPreviousPage = () => {
    if (currentPage > 0) setCurrentPage(currentPage - 1);
  };

  const pageTitle = currentPage === 0 
    ? 'Leçon : Reconnaissance des erreurs' 
    : 'Points sensibles dans Al-Fatiha';

  return (
    <div className="font-arabic min-h-screen bg-gray-900">
      <div className="w-full h-full overflow-hidden bg-gray-900">
        <div className="text-white p-4 md:p-6 text-center border-b-2">
          <div className="text-2xl md:text-3xl font-bold mb-2">{pageTitle}</div>
        </div>

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

        {currentPage === 0 && <IntroductionPage />}
        {currentPage === 1 && <ExamplesPage />}
      </div>
    </div>
  );
}
