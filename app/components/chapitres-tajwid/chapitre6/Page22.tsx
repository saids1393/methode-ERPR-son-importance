'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Play, Pause, Volume2, Loader2, ChevronDown } from 'lucide-react';
import PageNavigation from '@/app/components/PageNavigation';

const ShiddahPage = () => {
  const letters = ['ء', 'ج', 'د', 'ق', 'ط', 'ب', 'ك', 'ت'];

  return (
    <div className="p-4 md:p-8 bg-gray-900">
      <div className="w-full bg-gray-800 rounded-lg p-6 md:p-8">
        <div className="text-white space-y-6 text-lg md:text-xl leading-relaxed">
          <h2 className="text-3xl font-bold text-red-400 mb-4">Shiddah (الشدة) - La Force</h2>
          
          <p>
            La <span className="text-red-400 font-semibold">Shiddah</span> signifie "force" ou "intensité". 
            C'est une caractéristique des lettres où le son est <span className="text-amber-400 font-semibold">complètement bloqué</span> 
            puis libéré brusquement.
          </p>
          
          <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-4 md:p-6 my-6">
            <h3 className="text-xl font-bold text-red-300 mb-4 text-center">Les 8 lettres de Shiddah</h3>
            <div className="flex justify-center gap-3 flex-wrap">
              {letters.map((letter, index) => (
                <div key={index} className="w-12 h-12 md:w-14 md:h-14 bg-red-600 rounded-xl flex items-center justify-center text-2xl md:text-3xl text-white font-bold shadow-lg">
                  {letter}
                </div>
              ))}
            </div>
            <p className="text-center text-red-300 mt-4 text-lg">
              أَجِدْ قِطٍّ بَكَتْ (Ajid qittin bakat)
            </p>
          </div>
          
          <div className="bg-teal-900/30 border border-teal-500/50 rounded-lg p-4">
            <p className="text-teal-300">
              💡 <span className="font-semibold">Opposé :</span> La <span className="text-amber-300 font-semibold">Rakhâwah (الرخاوة)</span> 
              est l'opposé - le son coule librement sans blocage (16 lettres).
            </p>
          </div>
        </div>
      </div>
      
      <div className="px-4 md:px-8">
        <PageNavigation currentChapter={6} currentPage={22} module="TAJWID" className="mt-6 mb-4" />
      </div>

      <footer className="border-t-1 text-white text-center p-4 md:p-6 mt-8 flex-shrink-0 font-semibold text-base md:text-lg">
        <div>Chapitre 6 - Page 22</div>
        <div className="mt-1">© 2025 Tous droits réservés</div>
      </footer>
    </div>
  );
};

// Données des exemples - Shiddah (force)
const examplesShiddah = [
  { letter: 'د', verse: 'أَحَدٌ', translation: 'Un seul', surah: 112, ayah: 1 },
  { letter: 'ق', verse: 'الْحَقُّ', translation: 'La vérité', surah: 69, ayah: 1 },
  { letter: 'ك', verse: 'يَكْتُبُ', translation: 'Il écrit', surah: 2, ayah: 282 },
  { letter: 'ب', verse: 'بَصِيرٌ', translation: 'Clairvoyant', surah: 17, ayah: 1 },
  { letter: 'ت', verse: 'تَوَّابٌ', translation: 'Celui qui accepte le repentir', surah: 2, ayah: 37 },
  { letter: 'ط', verse: 'الطَّارِقُ', translation: "L'astre nocturne", surah: 86, ayah: 1 }
];

// Données des exemples - Rakhâwah (douceur)
const examplesRakhawah = [
  { letter: 'ذ', verse: 'الذَّاهِبُ', translation: 'Celui qui part', surah: 3, ayah: 145 },
  { letter: 'ش', verse: 'الشَّمْسِ', translation: 'Le soleil', surah: 91, ayah: 1 },
  { letter: 'ح', verse: 'الْحَسَنَاتِ', translation: 'Les bonnes actions', surah: 11, ayah: 114 },
  { letter: 'ص', verse: 'الصَّابِرِينَ', translation: 'Les patients', surah: 2, ayah: 153 },
  { letter: 'ف', verse: 'الْفَلَقِ', translation: "L'aube naissante", surah: 113, ayah: 1 },
  { letter: 'س', verse: 'السَّمَاءِ', translation: 'Le ciel', surah: 2, ayah: 19 }
];

const reciters = [
  { id: 'abdul-basit', name: 'Abdoul Basit Abdous-Samad' },
  { id: 'ayman-suwaid', name: 'Ayman Souwayd' },
  { id: 'minshawi', name: 'Mohammad Siddiq Al-Minshawi' },
  { id: 'hudhaify', name: 'Ali Al-Houdhaïfi' },
  { id: 'sudais', name: 'Abdour-Rahman As-Soudaïs' },
  { id: 'afasy', name: 'Mishari Rachid Al-Afassy' },
];

const ReciterSelect = ({ selectedReciter, onReciterChange, color = 'red' }: {
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
      <button onClick={() => setIsOpen(!isOpen)} className="flex items-center gap-1 bg-gray-700 hover:bg-gray-600 text-white px-2 py-1 rounded text-xs min-w-[130px] justify-between">
        <div className="flex items-center gap-1"><Volume2 className={`w-3 h-3 text-${color}-400`} /><span>{sel?.name}</span></div>
        <ChevronDown className={`w-3 h-3 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-gray-800 border border-gray-600 rounded shadow-xl z-50 min-w-[150px]">
          {reciters.map(r => (
            <button key={r.id} onClick={() => { onReciterChange(r.id); setIsOpen(false); }}
              className={`w-full px-2 py-1.5 text-left hover:bg-gray-700 flex flex-col ${selectedReciter === r.id ? `bg-${color}-900/50` : ''}`}>
              <span className="text-white text-xs">{r.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const ExamplesPage = () => {
  const [currentShiddahIndex, setCurrentShiddahIndex] = useState(0);
  const [currentRakhawahIndex, setCurrentRakhawahIndex] = useState(0);

  const [recShiddah, setRecShiddah] = useState('abdul-basit');
  const [playShiddah, setPlayShiddah] = useState(false);
  const [loadShiddah, setLoadShiddah] = useState(false);
  const audioShiddahRef = useRef<HTMLAudioElement | null>(null);

  const [recRakhawah, setRecRakhawah] = useState('abdul-basit');
  const [playRakhawah, setPlayRakhawah] = useState(false);
  const [loadRakhawah, setLoadRakhawah] = useState(false);
  const audioRakhawahRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => { if (audioShiddahRef.current) { audioShiddahRef.current.pause(); audioShiddahRef.current = null; } setPlayShiddah(false); setLoadShiddah(false); }, [currentShiddahIndex, recShiddah]);
  useEffect(() => { if (audioRakhawahRef.current) { audioRakhawahRef.current.pause(); audioRakhawahRef.current = null; } setPlayRakhawah(false); setLoadRakhawah(false); }, [currentRakhawahIndex, recRakhawah]);

  const toggleShiddah = () => {
    const ex = examplesShiddah[currentShiddahIndex];
    if (playShiddah && audioShiddahRef.current) { audioShiddahRef.current.pause(); setPlayShiddah(false); return; }
    setLoadShiddah(true);
    const a = new Audio(`/api/quran/audio?reciterId=${recShiddah}&surah=${ex.surah}&ayah=${ex.ayah}`);
    audioShiddahRef.current = a;
    a.oncanplaythrough = () => { setLoadShiddah(false); a.play(); setPlayShiddah(true); };
    a.onended = () => setPlayShiddah(false);
    a.onerror = () => { setLoadShiddah(false); setPlayShiddah(false); };
    a.load();
  };

  const toggleRakhawah = () => {
    const ex = examplesRakhawah[currentRakhawahIndex];
    if (playRakhawah && audioRakhawahRef.current) { audioRakhawahRef.current.pause(); setPlayRakhawah(false); return; }
    setLoadRakhawah(true);
    const a = new Audio(`/api/quran/audio?reciterId=${recRakhawah}&surah=${ex.surah}&ayah=${ex.ayah}`);
    audioRakhawahRef.current = a;
    a.oncanplaythrough = () => { setLoadRakhawah(false); a.play(); setPlayRakhawah(true); };
    a.onended = () => setPlayRakhawah(false);
    a.onerror = () => { setLoadRakhawah(false); setPlayRakhawah(false); };
    a.load();
  };

  const currentShiddahExample = examplesShiddah[currentShiddahIndex];
  const currentRakhawahExample = examplesRakhawah[currentRakhawahIndex];

  return (
    <div className="p-2 md:p-4 lg:p-8 bg-gray-900">
      
      {/* Slider Shiddah */}
      <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-4 md:p-6 lg:p-8 mb-4">
        <h3 className="text-lg md:text-xl font-bold text-red-400 mb-3 text-center">Shiddah (الشدة) - 8 lettres</h3>
        
        <div className="flex items-center justify-center gap-2 sm:gap-4 md:gap-6">
          <button
            onClick={() => setCurrentShiddahIndex((prev) => (prev - 1 + examplesShiddah.length) % examplesShiddah.length)}
            className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-110 flex-shrink-0"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
          </button>

          <div className="flex-1 flex flex-col items-center justify-center min-h-[160px] sm:min-h-[180px] md:min-h-[200px] max-w-[500px]">
            <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-red-400 mb-2">
              {currentShiddahExample.letter}
            </div>
            <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-amber-300 font-bold leading-relaxed mb-2 text-center">
              {currentShiddahExample.verse}
            </div>
            <div className="text-sm sm:text-base md:text-lg text-gray-300 italic">
              {currentShiddahExample.translation}
            </div>
            <div className="flex items-center gap-2 mt-3">
              <button onClick={toggleShiddah} disabled={loadShiddah} className="flex items-center gap-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white px-3 py-1 rounded-full text-xs">
                {loadShiddah ? <Loader2 className="w-4 h-4 animate-spin" /> : playShiddah ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{playShiddah ? 'Pause' : 'Écouter'}</span>
              </button>
              <ReciterSelect selectedReciter={recShiddah} onReciterChange={setRecShiddah} color="red" />
            </div>
            <div className="text-[10px] text-gray-500 mt-1">S{currentShiddahExample.surah}:V{currentShiddahExample.ayah}</div>
            <div className="flex gap-2 mt-4">
              {examplesShiddah.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentShiddahIndex(index)}
                  className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full transition-all ${
                    index === currentShiddahIndex ? 'bg-red-500 scale-125' : 'bg-gray-600'
                  }`}
                />
              ))}
            </div>
          </div>

          <button
            onClick={() => setCurrentShiddahIndex((prev) => (prev + 1) % examplesShiddah.length)}
            className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-110 flex-shrink-0"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
          </button>
        </div>
      </div>

      {/* Slider Rakhâwah */}
      <div className="bg-purple-900/30 border border-purple-500/50 rounded-lg p-4 md:p-6 lg:p-8 mb-6">
        <h3 className="text-lg md:text-xl font-bold text-purple-400 mb-3 text-center">Rakhâwah (الرخاوة) - 16 lettres</h3>
        
        <div className="flex items-center justify-center gap-2 sm:gap-4 md:gap-6">
          <button
            onClick={() => setCurrentRakhawahIndex((prev) => (prev - 1 + examplesRakhawah.length) % examplesRakhawah.length)}
            className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full border-2 border-purple-500 text-purple-500 hover:bg-purple-500 hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-110 flex-shrink-0"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
          </button>

          <div className="flex-1 flex flex-col items-center justify-center min-h-[160px] sm:min-h-[180px] md:min-h-[200px] max-w-[500px]">
            <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-purple-400 mb-2">
              {currentRakhawahExample.letter}
            </div>
            <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-amber-300 font-bold leading-relaxed mb-2 text-center">
              {currentRakhawahExample.verse}
            </div>
            <div className="text-sm sm:text-base md:text-lg text-gray-300 italic">
              {currentRakhawahExample.translation}
            </div>
            <div className="flex items-center gap-2 mt-3">
              <button onClick={toggleRakhawah} disabled={loadRakhawah} className="flex items-center gap-1 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white px-3 py-1 rounded-full text-xs">
                {loadRakhawah ? <Loader2 className="w-4 h-4 animate-spin" /> : playRakhawah ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{playRakhawah ? 'Pause' : 'Écouter'}</span>
              </button>
              <ReciterSelect selectedReciter={recRakhawah} onReciterChange={setRecRakhawah} color="purple" />
            </div>
            <div className="text-[10px] text-gray-500 mt-1">S{currentRakhawahExample.surah}:V{currentRakhawahExample.ayah}</div>
            <div className="flex gap-2 mt-4">
              {examplesRakhawah.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentRakhawahIndex(index)}
                  className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full transition-all ${
                    index === currentRakhawahIndex ? 'bg-purple-500 scale-125' : 'bg-gray-600'
                  }`}
                />
              ))}
            </div>
          </div>

          <button
            onClick={() => setCurrentRakhawahIndex((prev) => (prev + 1) % examplesRakhawah.length)}
            className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full border-2 border-purple-500 text-purple-500 hover:bg-purple-500 hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-110 flex-shrink-0"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
          </button>
        </div>
      </div>

      <div className="px-4 md:px-8">
        <PageNavigation currentChapter={6} currentPage={22} module="TAJWID" className="mt-6 mb-4" />
      </div>

      <footer className="border-t-1 text-white text-center p-4 md:p-6 flex-shrink-0 font-semibold text-sm md:text-base">
        <div>Chapitre 6 - Page 22 : Shiddah & Rakhâwah</div>
        <div className="mt-1">© 2025 Tous droits réservés</div>
      </footer>
    </div>
  );
};

const Page24 = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = 2;

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
    ? "Leçon : Shiddah (الشدة)"
    : "Exemples de Shiddah & Rakhâwah";

  return (
    <div className="font-arabic min-h-screen bg-gray-900">
      <div className="w-full h-full overflow-hidden bg-gray-900">
        
        <div className="text-white p-4 md:p-6 text-center border-b-2">
          <div className="text-2xl md:text-3xl font-bold mb-2">
            {pageTitle}
          </div>
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

        {currentPage === 0 && <ShiddahPage />}
        {currentPage === 1 && <ExamplesPage />}
      </div>
    </div>
  );
};

export default Page24;
