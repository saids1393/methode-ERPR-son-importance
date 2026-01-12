'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, AlertCircle, Play, Pause, Volume2, Loader2, ChevronDown } from 'lucide-react';
import PageNavigation from '@/app/components/PageNavigation';

const IntroductionPage = () => {
  return (
    <div className="p-4 md:p-8 bg-gray-900">
      <div className="w-full bg-gray-800 rounded-lg p-6 md:p-8">
        <div className="text-white space-y-6 text-lg md:text-xl leading-relaxed">
          <h2 className="text-3xl font-bold text-amber-400 mb-4">Erreur Mineure (لحن خفي) - Perte de beauté</h2>

          <p>
            L'erreur mineure <span className="text-amber-300 font-semibold">لحن خفي</span> (Lahn Khafî) est une faute
            subtile qui <span className="text-amber-300 font-semibold">n'affecte pas le sens</span> mais altère la
            beauté et l'harmonie de la récitation.
          </p>

          <div className="bg-amber-900/30 border border-amber-500/50 rounded-lg p-4 md:p-6 my-6">
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle className="text-amber-400 w-6 h-6" />
              <span className="font-semibold text-amber-200">Types d'erreurs mineures :</span>
            </div>
            <ul className="ml-4 space-y-2">
              <li>⚠️ Mauvaise <span className="text-amber-300">durée du Madd</span></li>
              <li>⚠️ <span className="text-amber-300">Ghunna</span> oubliée ou mal exécutée</li>
              <li>⚠️ <span className="text-amber-300">Tafkhîm/Tarqîq</span> non respecté</li>
              <li>⚠️ <span className="text-amber-300">Qalqala</span> absente ou exagérée</li>
            </ul>
          </div>

          <div className="bg-teal-900/30 border border-teal-500/50 rounded-lg p-4">
            <p className="text-teal-300">
              💡 <span className="font-semibold">Conseil :</span> Les erreurs mineures se corrigent avec la pratique 
              régulière et l'écoute de récitateurs confirmés. Soyez patient !
            </p>
          </div>
        </div>
      </div>

      <div className="px-4 md:px-8">
        <PageNavigation currentChapter={8} currentPage={30} module="TAJWID" className="mt-6 mb-4" />
      </div>

      <footer className="border-t-1 text-white text-center p-4 md:p-6 mt-8 flex-shrink-0 font-semibold text-base md:text-lg">
        <div>Chapitre 8 - Page 30</div>
        <div className="mt-1">© 2025 Tous droits réservés</div>
      </footer>
    </div>
  );
};

// Données des exemples - Erreurs de Madd
const exemplesMadd = [
  { 
    letter: '⚠️', 
    verse: 'Madd trop court',
    translation: 'Moins de 2 temps au lieu de 4-5',
    color: 'amber'
  },
  { 
    letter: '⚠️', 
    verse: 'Madd trop long',
    translation: 'Plus de temps que requis',
    color: 'amber'
  },
  { 
    letter: '✓', 
    verse: 'Madd correct',
    translation: 'Durée appropriée selon la règle',
    color: 'green'
  },
  { 
    letter: '⚠️', 
    verse: 'Madd irrégulier',
    translation: 'Durée variable incohérente',
    color: 'amber'
  }
];

// Données des exemples - Erreurs de Ghunna
const exemplesGhunna = [
  { 
    letter: '⚠️', 
    verse: 'Ghunna absente',
    translation: 'Nasalisation oubliée dans Idghâm',
    color: 'amber'
  },
  { 
    letter: '⚠️', 
    verse: 'Ghunna trop courte',
    translation: 'Moins de 2 temps dans Ikhfâ\'',
    color: 'amber'
  },
  { 
    letter: '✓', 
    verse: 'Ghunna correcte',
    translation: '2 temps de nasalisation',
    color: 'green'
  },
  { 
    letter: '⚠️', 
    verse: 'Ghunna exagérée',
    translation: 'Nasalisation trop prononcée',
    color: 'amber'
  }
];

// Données des exemples - Autres erreurs
const exemplesAutres = [
  { 
    letter: '⚠️', 
    verse: 'Tafkhîm manqué',
    translation: 'Lettre emphatique trop légère',
    color: 'amber'
  },
  { 
    letter: '⚠️', 
    verse: 'Tarqîq manqué',
    translation: 'Lettre fine trop épaisse',
    color: 'amber'
  },
  { 
    letter: '⚠️', 
    verse: 'Qalqala absente',
    translation: 'Écho non prononcé sur قطبجد',
    color: 'amber'
  },
  { 
    letter: '⚠️', 
    verse: 'Idghâm non appliqué',
    translation: 'Fusion des lettres oubliée',
    color: 'amber'
  }
];

const ExamplesPage = () => {
  const [currentMaddIndex, setCurrentMaddIndex] = useState(0);
  const [currentGhunnaIndex, setCurrentGhunnaIndex] = useState(0);
  const [currentAutresIndex, setCurrentAutresIndex] = useState(0);

  const currentMaddExample = exemplesMadd[currentMaddIndex];
  const currentGhunnaExample = exemplesGhunna[currentGhunnaIndex];
  const currentAutresExample = exemplesAutres[currentAutresIndex];

  const getColorClasses = (color: string) => {
    switch(color) {
      case 'green': return { border: 'border-green-500', text: 'text-green-400', bg: 'bg-green-900/30', hover: 'hover:bg-green-500' };
      case 'amber': return { border: 'border-amber-500', text: 'text-amber-400', bg: 'bg-amber-900/30', hover: 'hover:bg-amber-500' };
      default: return { border: 'border-purple-500', text: 'text-purple-400', bg: 'bg-purple-900/30', hover: 'hover:bg-purple-500' };
    }
  };

  const maddColors = getColorClasses(currentMaddExample.color);
  const ghunnaColors = getColorClasses(currentGhunnaExample.color);

  return (
    <div className="p-2 md:p-4 lg:p-6 bg-gray-900">
      
      {/* Slider Erreurs de Madd */}
      <div className={`${maddColors.bg} border ${maddColors.border} rounded-lg p-3 md:p-4 lg:p-6 mb-3 transition-all duration-300`}>
        <h3 className="text-base md:text-lg font-bold text-amber-400 mb-2 text-center">Erreurs de Madd (durée)</h3>
        
        <div className="flex items-center justify-center gap-2 sm:gap-3 md:gap-4">
          <button
            onClick={() => setCurrentMaddIndex((prev) => (prev - 1 + exemplesMadd.length) % exemplesMadd.length)}
            className={`w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full border-2 ${maddColors.border} ${maddColors.text} ${maddColors.hover} hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-110 flex-shrink-0`}
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          <div className="flex-1 flex flex-col items-center justify-center min-h-[120px] sm:min-h-[140px] md:min-h-[160px] max-w-[400px]">
            <div className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold ${maddColors.text} mb-1`}>
              {currentMaddExample.letter}
            </div>
            <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-amber-300 font-bold leading-relaxed mb-1 text-center">
              {currentMaddExample.verse}
            </div>
            <div className="text-xs sm:text-sm md:text-base text-gray-300 italic text-center">
              {currentMaddExample.translation}
            </div>
            <div className="flex gap-1.5 mt-3">
              {exemplesMadd.map((ex, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentMaddIndex(index)}
                  className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all ${
                    index === currentMaddIndex ? `${getColorClasses(ex.color).text.replace('text', 'bg')} scale-125` : 'bg-gray-600'
                  }`}
                />
              ))}
            </div>
          </div>

          <button
            onClick={() => setCurrentMaddIndex((prev) => (prev + 1) % exemplesMadd.length)}
            className={`w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full border-2 ${maddColors.border} ${maddColors.text} ${maddColors.hover} hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-110 flex-shrink-0`}
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>

      {/* Slider Erreurs de Ghunna */}
      <div className={`${ghunnaColors.bg} border ${ghunnaColors.border} rounded-lg p-3 md:p-4 lg:p-6 mb-3 transition-all duration-300`}>
        <h3 className="text-base md:text-lg font-bold text-blue-400 mb-2 text-center">Erreurs de Ghunna (nasalisation)</h3>
        
        <div className="flex items-center justify-center gap-2 sm:gap-3 md:gap-4">
          <button
            onClick={() => setCurrentGhunnaIndex((prev) => (prev - 1 + exemplesGhunna.length) % exemplesGhunna.length)}
            className={`w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full border-2 ${ghunnaColors.border} ${ghunnaColors.text} ${ghunnaColors.hover} hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-110 flex-shrink-0`}
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          <div className="flex-1 flex flex-col items-center justify-center min-h-[120px] sm:min-h-[140px] md:min-h-[160px] max-w-[400px]">
            <div className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold ${ghunnaColors.text} mb-1`}>
              {currentGhunnaExample.letter}
            </div>
            <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-amber-300 font-bold leading-relaxed mb-1 text-center">
              {currentGhunnaExample.verse}
            </div>
            <div className="text-xs sm:text-sm md:text-base text-gray-300 italic text-center">
              {currentGhunnaExample.translation}
            </div>
            <div className="flex gap-1.5 mt-3">
              {exemplesGhunna.map((ex, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentGhunnaIndex(index)}
                  className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all ${
                    index === currentGhunnaIndex ? `${getColorClasses(ex.color).text.replace('text', 'bg')} scale-125` : 'bg-gray-600'
                  }`}
                />
              ))}
            </div>
          </div>

          <button
            onClick={() => setCurrentGhunnaIndex((prev) => (prev + 1) % exemplesGhunna.length)}
            className={`w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full border-2 ${ghunnaColors.border} ${ghunnaColors.text} ${ghunnaColors.hover} hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-110 flex-shrink-0`}
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>

      {/* Slider Autres erreurs */}
      <div className="bg-purple-900/30 border border-purple-500/50 rounded-lg p-3 md:p-4 lg:p-6 mb-6">
        <h3 className="text-base md:text-lg font-bold text-purple-400 mb-2 text-center">Autres erreurs mineures</h3>
        
        <div className="flex items-center justify-center gap-2 sm:gap-3 md:gap-4">
          <button
            onClick={() => setCurrentAutresIndex((prev) => (prev - 1 + exemplesAutres.length) % exemplesAutres.length)}
            className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full border-2 border-purple-500 text-purple-500 hover:bg-purple-500 hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-110 flex-shrink-0"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          <div className="flex-1 flex flex-col items-center justify-center min-h-[120px] sm:min-h-[140px] md:min-h-[160px] max-w-[400px]">
            <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-amber-400 mb-1">
              {currentAutresExample.letter}
            </div>
            <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-purple-300 font-bold leading-relaxed mb-1 text-center">
              {currentAutresExample.verse}
            </div>
            <div className="text-xs sm:text-sm md:text-base text-gray-300 italic text-center">
              {currentAutresExample.translation}
            </div>
            <div className="flex gap-1.5 mt-3">
              {exemplesAutres.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentAutresIndex(index)}
                  className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all ${
                    index === currentAutresIndex ? 'bg-purple-500 scale-125' : 'bg-gray-600'
                  }`}
                />
              ))}
            </div>
          </div>

          <button
            onClick={() => setCurrentAutresIndex((prev) => (prev + 1) % exemplesAutres.length)}
            className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full border-2 border-purple-500 text-purple-500 hover:bg-purple-500 hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-110 flex-shrink-0"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>

      <div className="px-4 md:px-8">
        <PageNavigation currentChapter={8} currentPage={30} module="TAJWID" className="mt-4 mb-4" />
      </div>

      <footer className="border-t-1 text-white text-center p-4 md:p-6 flex-shrink-0 font-semibold text-sm md:text-base">
        <div>Chapitre 8 - Page 30 : Erreur Mineure</div>
        <div className="mt-1">© 2025 Tous droits réservés</div>
      </footer>
    </div>
  );
};

export default function Page30() {
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = 2;

  const goToNextPage = () => {
    if (currentPage < totalPages - 1) setCurrentPage(currentPage + 1);
  };

  const goToPreviousPage = () => {
    if (currentPage > 0) setCurrentPage(currentPage - 1);
  };

  const pageTitle = currentPage === 0 
    ? 'Leçon : Erreur Mineure (لحن خفي)' 
    : 'Exemples d\'erreurs mineures';

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
