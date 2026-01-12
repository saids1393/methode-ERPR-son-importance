'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, XCircle, Play, Pause, Volume2, Loader2, ChevronDown } from 'lucide-react';
import PageNavigation from '@/app/components/PageNavigation';

const IntroductionPage = () => {
  return (
    <div className="p-4 md:p-8 bg-gray-900">
      <div className="w-full bg-gray-800 rounded-lg p-6 md:p-8">
        <div className="text-white space-y-6 text-lg md:text-xl leading-relaxed">
          <h2 className="text-3xl font-bold text-red-400 mb-4">Erreur Majeure (لحن جلي) - Changement de sens</h2>

          <p>
            L'erreur majeure <span className="text-red-300 font-semibold">لحن جلي</span> (Lahn Jalî) est une faute
            qui <span className="text-red-300 font-semibold">change le sens</span> du verset coranique.
            Elle est <span className="text-red-400 font-bold">absolument interdite</span>.
          </p>

          <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-4 md:p-6 my-6">
            <div className="flex items-center gap-2 mb-3">
              <XCircle className="text-red-400 w-6 h-6" />
              <span className="font-semibold text-red-200">Types d'erreurs majeures :</span>
            </div>
            <ul className="ml-4 space-y-2">
              <li>✗ Changer une <span className="text-red-300">voyelle</span> (fat-ha ↔ damma ↔ kasra)</li>
              <li>✗ Remplacer une <span className="text-red-300">lettre</span> par une autre</li>
              <li>✗ Ajouter ou supprimer une <span className="text-red-300">lettre</span></li>
              <li>✗ Modifier la <span className="text-red-300">grammaire</span> (i'rab)</li>
            </ul>
          </div>

          <div className="bg-teal-900/30 border border-teal-500/50 rounded-lg p-4">
            <p className="text-teal-300">
              💡 <span className="font-semibold">Important :</span> Une erreur majeure dans la prière peut 
              l'invalider si elle change le sens du verset de manière significative.
            </p>
          </div>
        </div>
      </div>

      <div className="px-4 md:px-8">
        <PageNavigation currentChapter={8} currentPage={29} module="TAJWID" className="mt-6 mb-4" />
      </div>

      <footer className="border-t-1 text-white text-center p-4 md:p-6 mt-8 flex-shrink-0 font-semibold text-base md:text-lg">
        <div>Chapitre 8 - Page 29</div>
        <div className="mt-1">© 2025 Tous droits réservés</div>
      </footer>
    </div>
  );
};

// Données des exemples - Erreurs de voyelles
const examplesVoyelles = [
  { 
    letter: '✓ / ✗', 
    verse: 'أَنْعَمْتَ ≠ أَنْعَمْتُ',
    translation: 'Tu as favorisé ≠ J\'ai favorisé',
    color: 'green'
  },
  { 
    letter: '✓ / ✗', 
    verse: 'غَيْرِ ≠ غَيْرُ',
    translation: 'Autre que (génitif) ≠ Erreur grammaticale',
    color: 'green'
  },
  { 
    letter: '✓ / ✗', 
    verse: 'إِيَّاكَ ≠ إِيَّاكِ',
    translation: 'Toi (masc.) ≠ Toi (fém.)',
    color: 'green'
  },
  { 
    letter: '✓ / ✗', 
    verse: 'نَسْتَعِينُ ≠ نَسْتَعِينَ',
    translation: 'Nous implorons ≠ Erreur grammaticale',
    color: 'green'
  }
];

// Données des exemples - Erreurs de lettres
const examplesLettres = [
  { 
    letter: '✓ / ✗', 
    verse: 'الصِّرَاطَ ≠ السِّرَاطَ',
    translation: 'Avec Sâd ≠ Avec Sîn'
  },
  { 
    letter: '✓ / ✗', 
    verse: 'الضَّالِّينَ ≠ الظَّالِّينَ',
    translation: 'Avec Dâd ≠ Avec Dhâ'
  },
  { 
    letter: '✓ / ✗', 
    verse: 'الْحَمْدُ ≠ الْهَمْدُ',
    translation: 'Avec Hâ\' ≠ Avec Hâ\''
  },
  { 
    letter: '✓ / ✗', 
    verse: 'رَبِّ ≠ رَبِي',
    translation: 'Mon Seigneur ≠ Ajout incorrect'
  }
];

// Données des exemples - Conséquences
const examplesConsequences = [
  { 
    letter: '⛔', 
    verse: 'أَنْعَمْتُ',
    translation: 'Change "Tu" en "Je" - GRAVE',
    color: 'red'
  },
  { 
    letter: '⛔', 
    verse: 'إِيَّاكِ',
    translation: 'Change le genre du pronom - GRAVE',
    color: 'red'
  },
  { 
    letter: '⚠️', 
    verse: 'غَيْرُ',
    translation: 'Erreur de cas grammatical',
    color: 'amber'
  },
  { 
    letter: '⚠️', 
    verse: 'السِّرَاطَ',
    translation: 'Lettre incorrecte',
    color: 'amber'
  }
];

const ExamplesPage = () => {
  const [currentVoyellesIndex, setCurrentVoyellesIndex] = useState(0);
  const [currentLettresIndex, setCurrentLettresIndex] = useState(0);
  const [currentConsequencesIndex, setCurrentConsequencesIndex] = useState(0);

  const currentVoyellesExample = examplesVoyelles[currentVoyellesIndex];
  const currentLettresExample = examplesLettres[currentLettresIndex];
  const currentConsequencesExample = examplesConsequences[currentConsequencesIndex];

  const getColorClasses = (color: string) => {
    switch(color) {
      case 'green': return { border: 'border-green-500', text: 'text-green-400', bg: 'bg-green-900/30', hover: 'hover:bg-green-500' };
      case 'red': return { border: 'border-red-500', text: 'text-red-400', bg: 'bg-red-900/30', hover: 'hover:bg-red-500' };
      case 'amber': return { border: 'border-amber-500', text: 'text-amber-400', bg: 'bg-amber-900/30', hover: 'hover:bg-amber-500' };
      default: return { border: 'border-purple-500', text: 'text-purple-400', bg: 'bg-purple-900/30', hover: 'hover:bg-purple-500' };
    }
  };

  const consequencesColors = getColorClasses(currentConsequencesExample.color);

  return (
    <div className="p-2 md:p-4 lg:p-6 bg-gray-900">
      
      {/* Slider Erreurs de voyelles */}
      <div className="bg-green-900/30 border border-green-500/50 rounded-lg p-3 md:p-4 lg:p-6 mb-3">
        <h3 className="text-base md:text-lg font-bold text-green-400 mb-2 text-center">Erreurs de voyelles (harakât)</h3>
        
        <div className="flex items-center justify-center gap-2 sm:gap-3 md:gap-4">
          <button
            onClick={() => setCurrentVoyellesIndex((prev) => (prev - 1 + examplesVoyelles.length) % examplesVoyelles.length)}
            className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full border-2 border-green-500 text-green-500 hover:bg-green-500 hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-110 flex-shrink-0"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          <div className="flex-1 flex flex-col items-center justify-center min-h-[120px] sm:min-h-[140px] md:min-h-[160px] max-w-[400px]">
            <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-green-400 mb-1">
              {currentVoyellesExample.letter}
            </div>
            <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-amber-300 font-bold leading-relaxed mb-1 text-center">
              {currentVoyellesExample.verse}
            </div>
            <div className="text-xs sm:text-sm md:text-base text-gray-300 italic text-center">
              {currentVoyellesExample.translation}
            </div>
            <div className="flex gap-1.5 mt-3">
              {examplesVoyelles.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentVoyellesIndex(index)}
                  className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all ${
                    index === currentVoyellesIndex ? 'bg-green-500 scale-125' : 'bg-gray-600'
                  }`}
                />
              ))}
            </div>
          </div>

          <button
            onClick={() => setCurrentVoyellesIndex((prev) => (prev + 1) % examplesVoyelles.length)}
            className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full border-2 border-green-500 text-green-500 hover:bg-green-500 hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-110 flex-shrink-0"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>

      {/* Slider Erreurs de lettres */}
      <div className="bg-purple-900/30 border border-purple-500/50 rounded-lg p-3 md:p-4 lg:p-6 mb-3">
        <h3 className="text-base md:text-lg font-bold text-purple-400 mb-2 text-center">Erreurs de lettres (hurûf)</h3>
        
        <div className="flex items-center justify-center gap-2 sm:gap-3 md:gap-4">
          <button
            onClick={() => setCurrentLettresIndex((prev) => (prev - 1 + examplesLettres.length) % examplesLettres.length)}
            className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full border-2 border-purple-500 text-purple-500 hover:bg-purple-500 hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-110 flex-shrink-0"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          <div className="flex-1 flex flex-col items-center justify-center min-h-[120px] sm:min-h-[140px] md:min-h-[160px] max-w-[400px]">
            <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-purple-400 mb-1">
              {currentLettresExample.letter}
            </div>
            <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-amber-300 font-bold leading-relaxed mb-1 text-center">
              {currentLettresExample.verse}
            </div>
            <div className="text-xs sm:text-sm md:text-base text-gray-300 italic text-center">
              {currentLettresExample.translation}
            </div>
            <div className="flex gap-1.5 mt-3">
              {examplesLettres.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentLettresIndex(index)}
                  className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all ${
                    index === currentLettresIndex ? 'bg-purple-500 scale-125' : 'bg-gray-600'
                  }`}
                />
              ))}
            </div>
          </div>

          <button
            onClick={() => setCurrentLettresIndex((prev) => (prev + 1) % examplesLettres.length)}
            className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full border-2 border-purple-500 text-purple-500 hover:bg-purple-500 hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-110 flex-shrink-0"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>

      {/* Slider Conséquences */}
      <div className={`${consequencesColors.bg} border ${consequencesColors.border} rounded-lg p-3 md:p-4 lg:p-6 mb-6 transition-all duration-300`}>
        <h3 className="text-base md:text-lg font-bold text-red-400 mb-2 text-center">Conséquences des erreurs</h3>
        
        <div className="flex items-center justify-center gap-2 sm:gap-3 md:gap-4">
          <button
            onClick={() => setCurrentConsequencesIndex((prev) => (prev - 1 + examplesConsequences.length) % examplesConsequences.length)}
            className={`w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full border-2 ${consequencesColors.border} ${consequencesColors.text} ${consequencesColors.hover} hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-110 flex-shrink-0`}
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          <div className="flex-1 flex flex-col items-center justify-center min-h-[120px] sm:min-h-[140px] md:min-h-[160px] max-w-[400px]">
            <div className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold ${consequencesColors.text} mb-1`}>
              {currentConsequencesExample.letter}
            </div>
            <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-amber-300 font-bold leading-relaxed mb-1 text-center">
              {currentConsequencesExample.verse}
            </div>
            <div className={`text-xs sm:text-sm md:text-base ${consequencesColors.text} font-semibold`}>
              {currentConsequencesExample.translation}
            </div>
            <div className="flex gap-1.5 mt-3">
              {examplesConsequences.map((ex, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentConsequencesIndex(index)}
                  className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all ${
                    index === currentConsequencesIndex ? `${getColorClasses(ex.color).text.replace('text', 'bg')} scale-125` : 'bg-gray-600'
                  }`}
                />
              ))}
            </div>
          </div>

          <button
            onClick={() => setCurrentConsequencesIndex((prev) => (prev + 1) % examplesConsequences.length)}
            className={`w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full border-2 ${consequencesColors.border} ${consequencesColors.text} ${consequencesColors.hover} hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-110 flex-shrink-0`}
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>

      <div className="px-4 md:px-8">
        <PageNavigation currentChapter={8} currentPage={29} module="TAJWID" className="mt-4 mb-4" />
      </div>

      <footer className="border-t-1 text-white text-center p-4 md:p-6 flex-shrink-0 font-semibold text-sm md:text-base">
        <div>Chapitre 8 - Page 29 : Erreur Majeure</div>
        <div className="mt-1">© 2025 Tous droits réservés</div>
      </footer>
    </div>
  );
};

export default function Page29() {
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = 2;

  const goToNextPage = () => {
    if (currentPage < totalPages - 1) setCurrentPage(currentPage + 1);
  };

  const goToPreviousPage = () => {
    if (currentPage > 0) setCurrentPage(currentPage - 1);
  };

  const pageTitle = currentPage === 0 
    ? 'Leçon : Erreur Majeure (لحن جلي)' 
    : 'Exemples d\'erreurs majeures';

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
