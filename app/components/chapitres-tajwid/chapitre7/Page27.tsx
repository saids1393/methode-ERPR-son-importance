'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Play, Pause, Volume2, Loader2, ChevronDown } from 'lucide-react';
import PageNavigation from '@/app/components/PageNavigation';

const IntroductionPage = () => {
  return (
    <div className="p-4 md:p-8 bg-gray-900">
      <div className="w-full bg-gray-800 rounded-lg p-6 md:p-8">
        <div className="text-white space-y-6 text-lg md:text-xl leading-relaxed">
          <h2 className="text-3xl font-bold text-blue-400 mb-4">Tarqîq (الترقيق) - Raffinement des sons</h2>

          <p>
            Le <span className="text-blue-300 font-semibold">Tarqîq</span> (الترقيق) est l'opposé du Tafkhîm.
            Il signifie « raffinement » ou « allègement » du son. La lettre est prononcée de manière
            <span className="text-blue-300 font-semibold"> fine et légère</span>.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
            <div className="bg-amber-900/30 border border-amber-500/50 rounded-lg p-4">
              <h3 className="text-amber-400 font-bold text-xl mb-2">Tafkhîm (épaisseur)</h3>
              <p className="text-gray-300">Son plein et épais</p>
              <p className="text-3xl text-center mt-2 font-arabic text-amber-300">رَ طَ قَ</p>
            </div>

            <div className="bg-blue-900/30 border border-blue-500/50 rounded-lg p-4">
              <h3 className="text-blue-400 font-bold text-xl mb-2">Tarqîq (finesse)</h3>
              <p className="text-gray-300">Son léger et fin</p>
              <p className="text-3xl text-center mt-2 font-arabic text-blue-300">رِ لِ سِ</p>
            </div>
          </div>

          <div className="bg-teal-900/30 border border-teal-500/50 rounded-lg p-4">
            <p className="text-teal-300">
              💡 <span className="font-semibold">À retenir :</span> Toutes les lettres sont Tarqîq (fines) 
              sauf les 7 emphatiques permanentes et la Râ'/Lâm selon le contexte.
            </p>
          </div>
        </div>
      </div>

      <div className="px-4 md:px-8">
        <PageNavigation currentChapter={7} currentPage={27} module="TAJWID" className="mt-6 mb-4" />
      </div>

      <footer className="border-t-1 text-white text-center p-4 md:p-6 mt-8 flex-shrink-0 font-semibold text-base md:text-lg">
        <div>Chapitre 7 - Page 27</div>
        <div className="mt-1">© 2025 Tous droits réservés</div>
      </footer>
    </div>
  );
};

// Données des exemples - Tarqîq (lettres fines)
const examplesTarqiq = [
  { 
    letter: 'ب', 
    verse: 'بِسْمِ',
    translation: 'Au nom de',
    surah: 1,
    ayah: 1
  },
  { 
    letter: 'س', 
    verse: 'سَمِيعٌ',
    translation: 'Audient',
    surah: 2,
    ayah: 127
  },
  { 
    letter: 'ل', 
    verse: 'لِلّٰهِ',
    translation: 'Pour Allah',
    surah: 1,
    ayah: 2
  },
  { 
    letter: 'م', 
    verse: 'مُؤْمِنِينَ',
    translation: 'Croyants',
    surah: 2,
    ayah: 223
  },
  { 
    letter: 'ن', 
    verse: 'نَصْرُ',
    translation: 'Secours',
    surah: 110,
    ayah: 1
  },
  { 
    letter: 'ك', 
    verse: 'كَرِيمٌ',
    translation: 'Généreux',
    surah: 27,
    ayah: 40
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
    translation: 'Tafkhîm vs Tarqîq',
    color: 'amber'
  },
  { 
    letter: 'ط / ت', 
    verse: 'طَابَ ≠ تَابَ',
    translation: 'Tafkhîm vs Tarqîq',
    color: 'amber'
  },
  { 
    letter: 'رَ / رِ', 
    verse: 'رَبِّ ≠ رِجَالٌ',
    translation: 'Tafkhîm vs Tarqîq',
    color: 'blue'
  },
  { 
    letter: 'لَ / لِ', 
    verse: 'قَالَ اللهُ ≠ لِلّٰهِ',
    translation: 'Tafkhîm vs Tarqîq',
    color: 'blue'
  }
];

const ExamplesPage = () => {
  const [currentTarqiqIndex, setCurrentTarqiqIndex] = useState(0);
  const [currentComparisonIndex, setCurrentComparisonIndex] = useState(0);

  // Audio states for Tarqiq
  const [recTarqiq, setRecTarqiq] = useState('abdul-basit');
  const [playTarqiq, setPlayTarqiq] = useState(false);
  const [loadTarqiq, setLoadTarqiq] = useState(false);
  const audioTarqiqRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => { if (audioTarqiqRef.current) { audioTarqiqRef.current.pause(); audioTarqiqRef.current = null; } setPlayTarqiq(false); setLoadTarqiq(false); }, [currentTarqiqIndex, recTarqiq]);

  const toggleTarqiq = () => {
    const ex = examplesTarqiq[currentTarqiqIndex];
    if (playTarqiq && audioTarqiqRef.current) { audioTarqiqRef.current.pause(); setPlayTarqiq(false); return; }
    setLoadTarqiq(true);
    const a = new Audio(`/api/quran/audio?reciterId=${recTarqiq}&surah=${ex.surah}&ayah=${ex.ayah}`);
    audioTarqiqRef.current = a;
    a.oncanplaythrough = () => { setLoadTarqiq(false); a.play(); setPlayTarqiq(true); };
    a.onended = () => setPlayTarqiq(false);
    a.onerror = () => { setLoadTarqiq(false); setPlayTarqiq(false); };
    a.load();
  };

  const currentTarqiqExample = examplesTarqiq[currentTarqiqIndex];
  const currentComparisonExample = examplesComparison[currentComparisonIndex];

  const getColorClasses = (color: string) => {
    switch(color) {
      case 'amber': return { border: 'border-amber-500', text: 'text-amber-400', bg: 'bg-amber-900/30', hover: 'hover:bg-amber-500' };
      case 'blue': return { border: 'border-blue-500', text: 'text-blue-400', bg: 'bg-blue-900/30', hover: 'hover:bg-blue-500' };
      default: return { border: 'border-purple-500', text: 'text-purple-400', bg: 'bg-purple-900/30', hover: 'hover:bg-purple-500' };
    }
  };

  const comparisonColors = getColorClasses(currentComparisonExample.color);

  return (
    <div className="p-2 md:p-4 lg:p-8 bg-gray-900">
      
      {/* Slider Tarqîq */}
      <div className="bg-blue-900/30 border border-blue-500/50 rounded-lg p-4 md:p-6 lg:p-8 mb-4">
        <h3 className="text-lg md:text-xl font-bold text-blue-400 mb-3 text-center">Lettres Tarqîq (fines)</h3>
        
        <div className="flex items-center justify-center gap-2 sm:gap-4 md:gap-6">
          <button
            onClick={() => setCurrentTarqiqIndex((prev) => (prev - 1 + examplesTarqiq.length) % examplesTarqiq.length)}
            className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-110 flex-shrink-0"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
          </button>

          <div className="flex-1 flex flex-col items-center justify-center min-h-[160px] sm:min-h-[180px] md:min-h-[200px] max-w-[500px]">
            <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-blue-400 mb-2">
              {currentTarqiqExample.letter}
            </div>
            <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-amber-300 font-bold leading-relaxed mb-2 text-center">
              {currentTarqiqExample.verse}
            </div>
            <div className="text-sm sm:text-base md:text-lg text-gray-300 italic">
              {currentTarqiqExample.translation}
            </div>
            <div className="flex items-center gap-2 mt-2">
              <button onClick={toggleTarqiq} disabled={loadTarqiq} className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-2 py-1 rounded-full text-[10px]">
                {loadTarqiq ? <Loader2 className="w-3 h-3 animate-spin" /> : playTarqiq ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                <span>{playTarqiq ? 'Pause' : 'Écouter'}</span>
              </button>
              <ReciterSelect selectedReciter={recTarqiq} onReciterChange={setRecTarqiq} color="blue" />
            </div>
            <div className="text-[9px] text-gray-500 mt-1">S{currentTarqiqExample.surah}:V{currentTarqiqExample.ayah}</div>
            <div className="flex gap-2 mt-2">
              {examplesTarqiq.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTarqiqIndex(index)}
                  className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full transition-all ${
                    index === currentTarqiqIndex ? 'bg-blue-500 scale-125' : 'bg-gray-600'
                  }`}
                />
              ))}
            </div>
          </div>

          <button
            onClick={() => setCurrentTarqiqIndex((prev) => (prev + 1) % examplesTarqiq.length)}
            className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-110 flex-shrink-0"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
          </button>
        </div>
      </div>

      {/* Slider Comparaison */}
      <div className={`${comparisonColors.bg} border ${comparisonColors.border} rounded-lg p-4 md:p-6 lg:p-8 mb-6 transition-all duration-300`}>
        <h3 className="text-lg md:text-xl font-bold text-center mb-3">
          <span className="text-amber-400">Tafkhîm</span> vs <span className="text-blue-400">Tarqîq</span>
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
        <PageNavigation currentChapter={7} currentPage={27} module="TAJWID" className="mt-6 mb-4" />
      </div>

      <footer className="border-t-1 text-white text-center p-4 md:p-6 flex-shrink-0 font-semibold text-sm md:text-base">
        <div>Chapitre 7 - Page 27 : Tarqîq</div>
        <div className="mt-1">© 2025 Tous droits réservés</div>
      </footer>
    </div>
  );
};

export default function Page27() {
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = 2;

  const goToNextPage = () => {
    if (currentPage < totalPages - 1) setCurrentPage(currentPage + 1);
  };

  const goToPreviousPage = () => {
    if (currentPage > 0) setCurrentPage(currentPage - 1);
  };

  const pageTitle = currentPage === 0 
    ? 'Leçon : Tarqîq (الترقيق)' 
    : 'Exemples de Tarqîq';

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
