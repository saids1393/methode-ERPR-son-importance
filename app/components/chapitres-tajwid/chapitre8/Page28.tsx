'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, AlertTriangle, AlertCircle, Play, Pause, Volume2, Loader2, ChevronDown } from 'lucide-react';
import PageNavigation from '@/app/components/PageNavigation';

const IntroductionPage = () => {
  return (
    <div className="p-4 md:p-8 bg-gray-900">
      <div className="w-full bg-gray-800 rounded-lg p-6 md:p-8">
        <div className="text-white space-y-6 text-lg md:text-xl leading-relaxed">
          <h2 className="text-3xl font-bold text-red-400 mb-4">Les Erreurs à Éviter (اللحن - Al-Lahn)</h2>

          <p>
            Le mot <span className="text-red-300 font-semibold">اللحن</span> (Al-Lahn) signifie « erreur » ou « faute »
            dans la récitation du Coran. Le Tajwid vise à éliminer ces erreurs pour une récitation correcte et respectueuse.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
            <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="text-red-400 w-6 h-6" />
                <h3 className="text-red-400 font-bold text-xl">Erreur Majeure (لحن جلي)</h3>
              </div>
              <p className="text-gray-300">Change le sens du Coran</p>
              <p className="text-red-300 font-semibold mt-2">⛔ INTERDITE</p>
            </div>

            <div className="bg-amber-900/30 border border-amber-500/50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="text-amber-400 w-6 h-6" />
                <h3 className="text-amber-400 font-bold text-xl">Erreur Mineure (لحن خفي)</h3>
              </div>
              <p className="text-gray-300">Affecte la beauté, pas le sens</p>
              <p className="text-amber-300 font-semibold mt-2">⚠️ À corriger</p>
            </div>
          </div>

          <div className="bg-teal-900/30 border border-teal-500/50 rounded-lg p-4">
            <p className="text-teal-300">
              💡 <span className="font-semibold">Objectif :</span> Atteindre une récitation correcte (sans erreur majeure) 
              et magnifique (sans erreur mineure).
            </p>
          </div>
        </div>
      </div>

      <div className="px-4 md:px-8">
        <PageNavigation currentChapter={8} currentPage={28} module="TAJWID" className="mt-6 mb-4" />
      </div>

      <footer className="border-t-1 text-white text-center p-4 md:p-6 mt-8 flex-shrink-0 font-semibold text-base md:text-lg">
        <div>Chapitre 8 - Page 28</div>
        <div className="mt-1">© 2025 Tous droits réservés</div>
      </footer>
    </div>
  );
};

// Données des exemples - Lahn Jalî (erreur majeure)
const examplesJali = [
  { 
    letter: '❌', 
    verse: 'أنعمتُ ≠ أنعمتَ',
    translation: 'Changer la voyelle finale'
  },
  { 
    letter: '❌', 
    verse: 'السِّراط ≠ الصِّراط',
    translation: 'Remplacer ص par س'
  },
  { 
    letter: '❌', 
    verse: 'يَعْلَمُ ≠ يَعْلِمُ',
    translation: 'Changer la structure du verbe'
  },
  { 
    letter: '❌', 
    verse: 'رَبِّ ≠ رَبَّ',
    translation: 'Modifier le cas grammatical'
  }
];

// Données des exemples - Lahn Khafî (erreur mineure)
const examplesKhafi = [
  { 
    letter: '⚠️', 
    verse: 'Madd trop court',
    translation: 'Durée incorrecte du prolongement'
  },
  { 
    letter: '⚠️', 
    verse: 'Ghunna oubliée',
    translation: 'Nasalisation manquante'
  },
  { 
    letter: '⚠️', 
    verse: 'Tafkhîm manqué',
    translation: 'Lettre emphatique trop légère'
  },
  { 
    letter: '⚠️', 
    verse: 'Qalqalah absente',
    translation: 'Écho non prononcé'
  }
];

// Données des exemples - Correct vs Incorrect
const examplesCorrect = [
  { 
    letter: '✓', 
    verse: 'أَنْعَمْتَ',
    translation: 'Correct - fat-ha finale',
    color: 'green'
  },
  { 
    letter: '✗', 
    verse: 'أَنْعَمْتُ',
    translation: 'Incorrect - damma finale',
    color: 'red'
  },
  { 
    letter: '✓', 
    verse: 'الصِّرَاطَ',
    translation: 'Correct - avec Sâd',
    color: 'green'
  },
  { 
    letter: '✗', 
    verse: 'السِّرَاطَ',
    translation: 'Incorrect - avec Sîn',
    color: 'red'
  }
];

const ExamplesPage = () => {
  const [currentJaliIndex, setCurrentJaliIndex] = useState(0);
  const [currentKhafiIndex, setCurrentKhafiIndex] = useState(0);
  const [currentCorrectIndex, setCurrentCorrectIndex] = useState(0);

  const currentJaliExample = examplesJali[currentJaliIndex];
  const currentKhafiExample = examplesKhafi[currentKhafiIndex];
  const currentCorrectExample = examplesCorrect[currentCorrectIndex];

  const getColorClasses = (color: string) => {
    switch(color) {
      case 'green': return { border: 'border-green-500', text: 'text-green-400', bg: 'bg-green-900/30', hover: 'hover:bg-green-500' };
      case 'red': return { border: 'border-red-500', text: 'text-red-400', bg: 'bg-red-900/30', hover: 'hover:bg-red-500' };
      default: return { border: 'border-amber-500', text: 'text-amber-400', bg: 'bg-amber-900/30', hover: 'hover:bg-amber-500' };
    }
  };

  const correctColors = getColorClasses(currentCorrectExample.color);

  return (
    <div className="p-2 md:p-4 lg:p-6 bg-gray-900">
      
      {/* Slider Lahn Jalî */}
      <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-3 md:p-4 lg:p-6 mb-3">
        <h3 className="text-base md:text-lg font-bold text-red-400 mb-2 text-center">Lahn Jalî (لحن جلي) - Erreur Majeure</h3>
        
        <div className="flex items-center justify-center gap-2 sm:gap-3 md:gap-4">
          <button
            onClick={() => setCurrentJaliIndex((prev) => (prev - 1 + examplesJali.length) % examplesJali.length)}
            className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-110 flex-shrink-0"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          <div className="flex-1 flex flex-col items-center justify-center min-h-[120px] sm:min-h-[140px] md:min-h-[160px] max-w-[400px]">
            <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-red-400 mb-1">
              {currentJaliExample.letter}
            </div>
            <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-red-300 font-bold leading-relaxed mb-1 text-center">
              {currentJaliExample.verse}
            </div>
            <div className="text-xs sm:text-sm md:text-base text-gray-300 italic">
              {currentJaliExample.translation}
            </div>
            <div className="flex gap-1.5 mt-3">
              {examplesJali.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentJaliIndex(index)}
                  className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all ${
                    index === currentJaliIndex ? 'bg-red-500 scale-125' : 'bg-gray-600'
                  }`}
                />
              ))}
            </div>
          </div>

          <button
            onClick={() => setCurrentJaliIndex((prev) => (prev + 1) % examplesJali.length)}
            className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-110 flex-shrink-0"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>

      {/* Slider Lahn Khafî */}
      <div className="bg-amber-900/30 border border-amber-500/50 rounded-lg p-3 md:p-4 lg:p-6 mb-3">
        <h3 className="text-base md:text-lg font-bold text-amber-400 mb-2 text-center">Lahn Khafî (لحن خفي) - Erreur Mineure</h3>
        
        <div className="flex items-center justify-center gap-2 sm:gap-3 md:gap-4">
          <button
            onClick={() => setCurrentKhafiIndex((prev) => (prev - 1 + examplesKhafi.length) % examplesKhafi.length)}
            className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full border-2 border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-110 flex-shrink-0"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          <div className="flex-1 flex flex-col items-center justify-center min-h-[120px] sm:min-h-[140px] md:min-h-[160px] max-w-[400px]">
            <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-amber-400 mb-1">
              {currentKhafiExample.letter}
            </div>
            <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-amber-300 font-bold leading-relaxed mb-1 text-center">
              {currentKhafiExample.verse}
            </div>
            <div className="text-xs sm:text-sm md:text-base text-gray-300 italic">
              {currentKhafiExample.translation}
            </div>
            <div className="flex gap-1.5 mt-3">
              {examplesKhafi.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentKhafiIndex(index)}
                  className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all ${
                    index === currentKhafiIndex ? 'bg-amber-500 scale-125' : 'bg-gray-600'
                  }`}
                />
              ))}
            </div>
          </div>

          <button
            onClick={() => setCurrentKhafiIndex((prev) => (prev + 1) % examplesKhafi.length)}
            className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full border-2 border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-110 flex-shrink-0"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>

      {/* Slider Correct vs Incorrect */}
      <div className={`${correctColors.bg} border ${correctColors.border} rounded-lg p-3 md:p-4 lg:p-6 mb-6 transition-all duration-300`}>
        <h3 className="text-base md:text-lg font-bold text-center mb-2">
          <span className="text-green-400">Correct</span> vs <span className="text-red-400">Incorrect</span>
        </h3>
        
        <div className="flex items-center justify-center gap-2 sm:gap-3 md:gap-4">
          <button
            onClick={() => setCurrentCorrectIndex((prev) => (prev - 1 + examplesCorrect.length) % examplesCorrect.length)}
            className={`w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full border-2 ${correctColors.border} ${correctColors.text} ${correctColors.hover} hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-110 flex-shrink-0`}
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          <div className="flex-1 flex flex-col items-center justify-center min-h-[120px] sm:min-h-[140px] md:min-h-[160px] max-w-[400px]">
            <div className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold ${correctColors.text} mb-1`}>
              {currentCorrectExample.letter}
            </div>
            <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-amber-300 font-bold leading-relaxed mb-1 text-center">
              {currentCorrectExample.verse}
            </div>
            <div className={`text-xs sm:text-sm md:text-base ${correctColors.text} font-semibold`}>
              {currentCorrectExample.translation}
            </div>
            <div className="flex gap-1.5 mt-3">
              {examplesCorrect.map((ex, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentCorrectIndex(index)}
                  className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all ${
                    index === currentCorrectIndex ? `${getColorClasses(ex.color).text.replace('text', 'bg')} scale-125` : 'bg-gray-600'
                  }`}
                />
              ))}
            </div>
          </div>

          <button
            onClick={() => setCurrentCorrectIndex((prev) => (prev + 1) % examplesCorrect.length)}
            className={`w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full border-2 ${correctColors.border} ${correctColors.text} ${correctColors.hover} hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-110 flex-shrink-0`}
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>

      <div className="px-4 md:px-8">
        <PageNavigation currentChapter={8} currentPage={28} module="TAJWID" className="mt-4 mb-4" />
      </div>

      <footer className="border-t-1 text-white text-center p-4 md:p-6 flex-shrink-0 font-semibold text-sm md:text-base">
        <div>Chapitre 8 - Page 28 : Les Erreurs</div>
        <div className="mt-1">© 2025 Tous droits réservés</div>
      </footer>
    </div>
  );
};

export default function Page28() {
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = 2;

  const goToNextPage = () => {
    if (currentPage < totalPages - 1) setCurrentPage(currentPage + 1);
  };

  const goToPreviousPage = () => {
    if (currentPage > 0) setCurrentPage(currentPage - 1);
  };

  const pageTitle = currentPage === 0 
    ? 'Leçon : Les Erreurs (اللحن)' 
    : 'Exemples d\'erreurs';

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
