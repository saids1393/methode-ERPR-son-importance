'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Play, Pause, Volume2, Loader2, ChevronDown } from 'lucide-react';
import PageNavigation from '@/app/components/PageNavigation';

const IntroductionPage = () => {
  const letters = ['خ', 'ص', 'ض', 'غ', 'ط', 'ق', 'ظ'];

  return (
    <div className="p-4 md:p-8 bg-gray-900">
      <div className="w-full bg-gray-800 rounded-lg p-6 md:p-8">
        <div className="text-white space-y-6 text-lg md:text-xl leading-relaxed">
          <h2 className="text-3xl font-bold text-amber-400 mb-4">Tafkhîm - Les Lettres Emphatiques (التفخيم)</h2>

          <p>
            Le <span className="text-amber-300 font-semibold">Tafkhîm</span> (التفخيم) signifie « emphase » ou « épaississement ».
            C'est une qualité de prononciation où le son est <span className="text-red-300 font-semibold">plein et épais</span>,
            produit avec la bouche plus ouverte et la langue relevée vers le palais.
          </p>

          <div className="bg-amber-900/30 border border-amber-500/50 rounded-lg p-4 md:p-6 my-6">
            <h3 className="text-xl font-bold text-amber-300 mb-4 text-center">Les 7 lettres emphatiques permanentes</h3>
            <div className="flex justify-center gap-3 flex-wrap">
              {letters.map((letter, index) => (
                <div key={index} className="w-12 h-12 md:w-14 md:h-14 bg-amber-600 rounded-xl flex items-center justify-center text-2xl md:text-3xl text-white font-bold shadow-lg">
                  {letter}
                </div>
              ))}
            </div>
            <p className="text-center text-amber-300 mt-4 text-lg">
              خُصَّ ضَغْطٍ قِظْ (Khussa daghtin qidh)
            </p>
          </div>

          <div className="bg-teal-900/30 border border-teal-500/50 rounded-lg p-4">
            <p className="text-teal-300">
              💡 <span className="font-semibold">Opposé :</span> Le <span className="text-amber-300 font-semibold">Tarqîq (الترقيق)</span> 
              est l'opposé - prononciation légère et fine (les autres lettres).
            </p>
          </div>
        </div>
      </div>

      <div className="px-4 md:px-8">
        <PageNavigation currentChapter={7} currentPage={24} module="TAJWID" className="mt-6 mb-4" />
      </div>

      <footer className="border-t-1 text-white text-center p-4 md:p-6 mt-8 flex-shrink-0 font-semibold text-base md:text-lg">
        <div>Chapitre 7 - Page 24</div>
        <div className="mt-1">© 2025 Tous droits réservés</div>
      </footer>
    </div>
  );
};

// Données des exemples - Lettres emphatiques
const examplesTafkhim = [
  { 
    letter: 'خ', 
    verse: 'خَالِدِينَ',
    translation: 'Éternels',
    surah: 2,
    ayah: 25
  },
  { 
    letter: 'ص', 
    verse: 'صَلاة',
    translation: 'Prière',
    surah: 2,
    ayah: 3
  },
  { 
    letter: 'ض', 
    verse: 'ضَرَبَ',
    translation: 'Il a frappé',
    surah: 2,
    ayah: 26
  },
  { 
    letter: 'غ', 
    verse: 'غَفُورٌ',
    translation: 'Pardonneur',
    surah: 2,
    ayah: 173
  },
  { 
    letter: 'ط', 
    verse: 'طَيِّب',
    translation: 'Bon',
    surah: 2,
    ayah: 267
  },
  { 
    letter: 'ق', 
    verse: 'قُلْ',
    translation: 'Dis',
    surah: 112,
    ayah: 1
  },
  { 
    letter: 'ظ', 
    verse: 'ظَالِمِينَ',
    translation: 'Injustes',
    surah: 2,
    ayah: 35
  }
];

const reciters = [
  { id: 'abdul-basit', name: 'Abdoul Basit Abdous-Samad' },
  { id: 'ayman-suwaid', name: 'Ayman Souwayd' },
  { id: 'minshawi', name: 'Mohammad Siddiq Al-Minshawi' },
  { id: 'hudhaify', name: 'Ali Al-Houdhaïfi' },
  { id: 'sudais', name: 'Abdour-Rahman As-Soudaïs' },
  { id: 'afasy', name: 'Mishari Rachid Al-Afassy' },
];

const ReciterSelect = ({ selectedReciter, onReciterChange, color = 'amber' }: {
  selectedReciter: string; onReciterChange: (id: string) => void; color?: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false); };
    document.addEventListener('mousedown', handler); return () => document.removeEventListener('mousedown', handler);
  }, []);
  const sel = reciters.find(r => r.id === selectedReciter);
  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setIsOpen(!isOpen)} className="flex items-center gap-1 bg-gray-700 hover:bg-gray-600 text-white px-2 py-1 rounded text-[10px] min-w-[100px] justify-between">
        <div className="flex items-center gap-1"><Volume2 className={`w-3 h-3 text-${color}-400`} /><span className="truncate">{sel?.name}</span></div>
        <ChevronDown className={`w-3 h-3 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-gray-800 border border-gray-600 rounded shadow-xl z-50 min-w-[130px]">
          {reciters.map(r => (
            <button key={r.id} onClick={() => { onReciterChange(r.id); setIsOpen(false); }}
              className={`w-full px-2 py-1 text-left hover:bg-gray-700 ${selectedReciter === r.id ? `bg-${color}-900/50` : ''}`}>
              <span className="text-white text-[10px]">{r.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// Données des exemples - Comparaison Tafkhîm vs Tarqîq
const examplesComparison = [
  { 
    letter: 'ص / س', 
    verse: 'صَبَرَ ≠ سَبَقَ',
    translation: 'Emphatique vs Léger',
    color: 'amber'
  },
  { 
    letter: 'ط / ت', 
    verse: 'طَابَ ≠ تَابَ',
    translation: 'Emphatique vs Léger',
    color: 'red'
  },
  { 
    letter: 'ظ / ذ', 
    verse: 'ظَلَّ ≠ ذَلَّ',
    translation: 'Emphatique vs Léger',
    color: 'purple'
  },
  { 
    letter: 'ق / ك', 
    verse: 'قَالَ ≠ كَانَ',
    translation: 'Emphatique vs Léger',
    color: 'blue'
  }
];

const ExamplesPage = () => {
  const [currentTafkhimIndex, setCurrentTafkhimIndex] = useState(0);
  const [currentComparisonIndex, setCurrentComparisonIndex] = useState(0);

  const [recTafkhim, setRecTafkhim] = useState('abdul-basit');
  const [playTafkhim, setPlayTafkhim] = useState(false);
  const [loadTafkhim, setLoadTafkhim] = useState(false);
  const audioTafkhimRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => { if (audioTafkhimRef.current) { audioTafkhimRef.current.pause(); audioTafkhimRef.current = null; } setPlayTafkhim(false); setLoadTafkhim(false); }, [currentTafkhimIndex, recTafkhim]);

  const toggleTafkhim = () => {
    const ex = examplesTafkhim[currentTafkhimIndex];
    if (playTafkhim && audioTafkhimRef.current) { audioTafkhimRef.current.pause(); setPlayTafkhim(false); return; }
    setLoadTafkhim(true);
    const a = new Audio(`/api/quran/audio?reciterId=${recTafkhim}&surah=${ex.surah}&ayah=${ex.ayah}`);
    audioTafkhimRef.current = a;
    a.oncanplaythrough = () => { setLoadTafkhim(false); a.play(); setPlayTafkhim(true); };
    a.onended = () => setPlayTafkhim(false);
    a.onerror = () => { setLoadTafkhim(false); setPlayTafkhim(false); };
    a.load();
  };

  const currentTafkhimExample = examplesTafkhim[currentTafkhimIndex];
  const currentComparisonExample = examplesComparison[currentComparisonIndex];

  const getColorClasses = (color: string) => {
    switch(color) {
      case 'amber': return { border: 'border-amber-500', text: 'text-amber-400', bg: 'bg-amber-900/30', hover: 'hover:bg-amber-500' };
      case 'red': return { border: 'border-red-500', text: 'text-red-400', bg: 'bg-red-900/30', hover: 'hover:bg-red-500' };
      case 'purple': return { border: 'border-purple-500', text: 'text-purple-400', bg: 'bg-purple-900/30', hover: 'hover:bg-purple-500' };
      case 'blue': return { border: 'border-blue-500', text: 'text-blue-400', bg: 'bg-blue-900/30', hover: 'hover:bg-blue-500' };
      default: return { border: 'border-amber-500', text: 'text-amber-400', bg: 'bg-amber-900/30', hover: 'hover:bg-amber-500' };
    }
  };

  const comparisonColors = getColorClasses(currentComparisonExample.color);

  return (
    <div className="p-2 md:p-4 lg:p-8 bg-gray-900">
      
      {/* Slider Tafkhîm */}
      <div className="bg-amber-900/30 border border-amber-500/50 rounded-lg p-4 md:p-6 lg:p-8 mb-4">
        <h3 className="text-lg md:text-xl font-bold text-amber-400 mb-3 text-center">Les 7 lettres emphatiques</h3>
        
        <div className="flex items-center justify-center gap-2 sm:gap-4 md:gap-6">
          <button
            onClick={() => setCurrentTafkhimIndex((prev) => (prev - 1 + examplesTafkhim.length) % examplesTafkhim.length)}
            className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full border-2 border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-110 flex-shrink-0"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
          </button>

          <div className="flex-1 flex flex-col items-center justify-center min-h-[160px] sm:min-h-[180px] md:min-h-[200px] max-w-[500px]">
            <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-amber-400 mb-2">
              {currentTafkhimExample.letter}
            </div>
            <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-amber-300 font-bold leading-relaxed mb-2 text-center">
              {currentTafkhimExample.verse}
            </div>
            <div className="text-sm sm:text-base md:text-lg text-gray-300 italic">
              {currentTafkhimExample.translation}
            </div>
            <div className="flex items-center gap-2 mt-2">
              <button onClick={toggleTafkhim} disabled={loadTafkhim} className="flex items-center gap-1 bg-amber-600 hover:bg-amber-700 disabled:bg-gray-600 text-white px-2 py-1 rounded-full text-[10px]">
                {loadTafkhim ? <Loader2 className="w-3 h-3 animate-spin" /> : playTafkhim ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                <span>{playTafkhim ? 'Pause' : 'Écouter'}</span>
              </button>
              <ReciterSelect selectedReciter={recTafkhim} onReciterChange={setRecTafkhim} color="amber" />
            </div>
            <div className="text-[9px] text-gray-500 mt-1">S{currentTafkhimExample.surah}:V{currentTafkhimExample.ayah}</div>
            <div className="flex gap-2 mt-2">
              {examplesTafkhim.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTafkhimIndex(index)}
                  className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full transition-all ${
                    index === currentTafkhimIndex ? 'bg-amber-500 scale-125' : 'bg-gray-600'
                  }`}
                />
              ))}
            </div>
          </div>

          <button
            onClick={() => setCurrentTafkhimIndex((prev) => (prev + 1) % examplesTafkhim.length)}
            className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full border-2 border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-110 flex-shrink-0"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
          </button>
        </div>
      </div>

      {/* Slider Comparaison Tafkhîm vs Tarqîq */}
      <div className={`${comparisonColors.bg} border ${comparisonColors.border} rounded-lg p-4 md:p-6 lg:p-8 mb-6 transition-all duration-300`}>
        <h3 className="text-lg md:text-xl font-bold text-center mb-3">
          <span className="text-amber-400">Tafkhîm</span> vs <span className="text-teal-400">Tarqîq</span>
        </h3>
        
        <div className="flex items-center justify-center gap-2 sm:gap-4 md:gap-6">
          <button
            onClick={() => setCurrentComparisonIndex((prev) => (prev - 1 + examplesComparison.length) % examplesComparison.length)}
            className={`w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full border-2 ${comparisonColors.border} ${comparisonColors.text} ${comparisonColors.hover} hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-110 flex-shrink-0`}
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
          </button>

          <div className="flex-1 flex flex-col items-center justify-center min-h-[160px] sm:min-h-[180px] md:min-h-[200px] max-w-[500px]">
            <div className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold ${comparisonColors.text} mb-2`}>
              {currentComparisonExample.letter}
            </div>
            <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-amber-300 font-bold leading-relaxed mb-2 text-center">
              {currentComparisonExample.verse}
            </div>
            <div className={`text-sm sm:text-base md:text-lg ${comparisonColors.text} font-semibold`}>
              {currentComparisonExample.translation}
            </div>
            <div className="flex gap-2 mt-4">
              {examplesComparison.map((ex, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentComparisonIndex(index)}
                  className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full transition-all ${
                    index === currentComparisonIndex ? `${getColorClasses(ex.color).text.replace('text', 'bg')} scale-125` : 'bg-gray-600'
                  }`}
                />
              ))}
            </div>
          </div>

          <button
            onClick={() => setCurrentComparisonIndex((prev) => (prev + 1) % examplesComparison.length)}
            className={`w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full border-2 ${comparisonColors.border} ${comparisonColors.text} ${comparisonColors.hover} hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-110 flex-shrink-0`}
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
          </button>
        </div>
      </div>

      <div className="px-4 md:px-8">
        <PageNavigation currentChapter={7} currentPage={24} module="TAJWID" className="mt-6 mb-4" />
      </div>

      <footer className="border-t-1 text-white text-center p-4 md:p-6 flex-shrink-0 font-semibold text-sm md:text-base">
        <div>Chapitre 7 - Page 24 : Tafkhîm</div>
        <div className="mt-1">© 2025 Tous droits réservés</div>
      </footer>
    </div>
  );
};

export default function Page24() {
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = 2;

  const goToNextPage = () => {
    if (currentPage < totalPages - 1) setCurrentPage(currentPage + 1);
  };

  const goToPreviousPage = () => {
    if (currentPage > 0) setCurrentPage(currentPage - 1);
  };

  const pageTitle = currentPage === 0 
    ? 'Leçon : Tafkhîm (التفخيم)' 
    : 'Exemples de Tafkhîm';

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
