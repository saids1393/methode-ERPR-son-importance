'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Play, Pause, Volume2, Loader2, ChevronDown } from 'lucide-react';
import PageNavigation from '@/app/components/PageNavigation';

const LazimPage = () => {
  return (
    <div className="p-4 md:p-8 bg-gray-900">
      <div className="w-full bg-gray-800 rounded-lg p-6 md:p-8 mb-6">
        <div className="text-white space-y-6 text-lg md:text-xl leading-relaxed">
          <h2 className="text-3xl font-bold text-red-400 mb-4">Madd Lâzim (المد اللازم)</h2>
          
          <p>
            Le <span className="text-red-400 font-semibold">Madd Lâzim</span> (Madd obligatoire/nécessaire) se produit quand 
            une lettre de Madd est suivie d'un <span className="text-amber-400 font-semibold">Sukûn fixe (أصلي)</span> 
            qui ne change jamais, même lors de la liaison.
          </p>
          
          <div className="text-center my-6">
            <div className="inline-block bg-red-900/50 border-2 border-red-500 rounded-xl p-6">
              <p className="text-gray-300 text-lg mb-2">Durée :</p>
              <p className="text-5xl text-red-400 font-bold">6 temps (لازم)</p>
              <p className="text-gray-400 text-sm mt-2">Obligatoire - ne change jamais</p>
            </div>
          </div>
          
          <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-4 my-6">
            <p>
              💡 <span className="font-semibold">Deux types :</span> Madd Lâzim Kalimî (dans un mot) et 
              Madd Lâzim Ḥarfî (dans les lettres isolées au début des sourates).
            </p>
          </div>
        </div>
      </div>

      <div className="px-4 md:px-8">
        <PageNavigation currentChapter={4} currentPage={15} module="TAJWID" className="mt-6 mb-4" />
      </div>

      <footer className="border-t-1 text-white text-center p-4 md:p-6 mt-8 flex-shrink-0 font-semibold text-base md:text-lg">
        <div>Chapitre 4 - Page 15</div>
        <div className="mt-1">© 2025 Tous droits réservés</div>
      </footer>
    </div>
  );
};

// Données des exemples - Madd Lâzim
const examplesLazim = [
  { letter: 'ْ', verse: 'الْحَاقَّةُ', translation: "L'inévitable", surah: 69, ayah: 1 },
  { letter: 'ْ', verse: 'الصَّاخَّةُ', translation: 'Le fracas', surah: 80, ayah: 33 },
  { letter: 'ْ', verse: 'الطَّامَّةُ', translation: 'Le grand cataclysme', surah: 79, ayah: 34 },
  { letter: 'ْ', verse: 'الم', translation: 'Alif Lâm Mîm', surah: 2, ayah: 1 },
  { letter: 'ْ', verse: 'طسم', translation: 'Ṭâ Sîn Mîm', surah: 26, ayah: 1 }
];

// Données des exemples - Madd 'Âriḍ
const examplesArid = [
  { letter: 'ْ', verse: 'الْعَالَمِينْ', translation: 'Les mondes', surah: 1, ayah: 2 },
  { letter: 'ْ', verse: 'نَسْتَعِينْ', translation: 'Nous implorons', surah: 1, ayah: 5 },
  { letter: 'ْ', verse: 'الرَّحِيمْ', translation: 'Le Miséricordieux', surah: 1, ayah: 3 },
  { letter: 'ْ', verse: 'يَعْلَمُونْ', translation: 'Ils savent', surah: 2, ayah: 13 }
];

// Données des exemples - Madd Lîn
const examplesLin = [
  { letter: 'وْ', verse: 'خَوْف', translation: 'Peur', surah: 106, ayah: 4 },
  { letter: 'يْ', verse: 'بَيْت', translation: 'Maison', surah: 106, ayah: 3 },
  { letter: 'يْ', verse: 'قُرَيْش', translation: 'Quraysh', surah: 106, ayah: 1 },
  { letter: 'وْ', verse: 'صَوْم', translation: 'Jeûne', surah: 2, ayah: 183 }
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
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);
  const sel = reciters.find(r => r.id === selectedReciter);
  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setIsOpen(!isOpen)} className="flex items-center gap-1 bg-gray-700 hover:bg-gray-600 text-white px-2 py-1 rounded text-[10px] min-w-[120px] justify-between">
        <div className="flex items-center gap-1"><Volume2 className={`w-3 h-3 text-${color}-400`} /><span>{sel?.name}</span></div>
        <ChevronDown className={`w-3 h-3 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-gray-800 border border-gray-600 rounded shadow-xl z-50 min-w-[140px]">
          {reciters.map(r => (
            <button key={r.id} onClick={() => { onReciterChange(r.id); setIsOpen(false); }}
              className={`w-full px-2 py-1.5 text-left hover:bg-gray-700 flex flex-col ${selectedReciter === r.id ? `bg-${color}-900/50` : ''}`}>
              <span className="text-white text-[10px]">{r.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const ExamplesPage = () => {
  const [currentLazimIndex, setCurrentLazimIndex] = useState(0);
  const [currentAridIndex, setCurrentAridIndex] = useState(0);
  const [currentLinIndex, setCurrentLinIndex] = useState(0);

  const [recLazim, setRecLazim] = useState('abdul-basit');
  const [playLazim, setPlayLazim] = useState(false);
  const [loadLazim, setLoadLazim] = useState(false);
  const audioLazimRef = useRef<HTMLAudioElement | null>(null);

  const [recArid, setRecArid] = useState('abdul-basit');
  const [playArid, setPlayArid] = useState(false);
  const [loadArid, setLoadArid] = useState(false);
  const audioAridRef = useRef<HTMLAudioElement | null>(null);

  const [recLin, setRecLin] = useState('abdul-basit');
  const [playLin, setPlayLin] = useState(false);
  const [loadLin, setLoadLin] = useState(false);
  const audioLinRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => { if (audioLazimRef.current) { audioLazimRef.current.pause(); audioLazimRef.current = null; } setPlayLazim(false); setLoadLazim(false); }, [currentLazimIndex, recLazim]);
  useEffect(() => { if (audioAridRef.current) { audioAridRef.current.pause(); audioAridRef.current = null; } setPlayArid(false); setLoadArid(false); }, [currentAridIndex, recArid]);
  useEffect(() => { if (audioLinRef.current) { audioLinRef.current.pause(); audioLinRef.current = null; } setPlayLin(false); setLoadLin(false); }, [currentLinIndex, recLin]);

  const toggleLazim = () => {
    const ex = examplesLazim[currentLazimIndex];
    if (playLazim && audioLazimRef.current) { audioLazimRef.current.pause(); setPlayLazim(false); return; }
    setLoadLazim(true);
    const a = new Audio(`/api/quran/audio?reciterId=${recLazim}&surah=${ex.surah}&ayah=${ex.ayah}`);
    audioLazimRef.current = a;
    a.oncanplaythrough = () => { setLoadLazim(false); a.play(); setPlayLazim(true); };
    a.onended = () => setPlayLazim(false);
    a.onerror = () => { setLoadLazim(false); setPlayLazim(false); };
    a.load();
  };

  const toggleArid = () => {
    const ex = examplesArid[currentAridIndex];
    if (playArid && audioAridRef.current) { audioAridRef.current.pause(); setPlayArid(false); return; }
    setLoadArid(true);
    const a = new Audio(`/api/quran/audio?reciterId=${recArid}&surah=${ex.surah}&ayah=${ex.ayah}`);
    audioAridRef.current = a;
    a.oncanplaythrough = () => { setLoadArid(false); a.play(); setPlayArid(true); };
    a.onended = () => setPlayArid(false);
    a.onerror = () => { setLoadArid(false); setPlayArid(false); };
    a.load();
  };

  const toggleLin = () => {
    const ex = examplesLin[currentLinIndex];
    if (playLin && audioLinRef.current) { audioLinRef.current.pause(); setPlayLin(false); return; }
    setLoadLin(true);
    const a = new Audio(`/api/quran/audio?reciterId=${recLin}&surah=${ex.surah}&ayah=${ex.ayah}`);
    audioLinRef.current = a;
    a.oncanplaythrough = () => { setLoadLin(false); a.play(); setPlayLin(true); };
    a.onended = () => setPlayLin(false);
    a.onerror = () => { setLoadLin(false); setPlayLin(false); };
    a.load();
  };

  const currentLazimExample = examplesLazim[currentLazimIndex];
  const currentAridExample = examplesArid[currentAridIndex];
  const currentLinExample = examplesLin[currentLinIndex];

  return (
    <div className="p-2 md:p-4 lg:p-6 bg-gray-900">
      
      {/* Slider Madd Lâzim */}
      <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-3 md:p-4 lg:p-6 mb-3">
        <h3 className="text-base md:text-lg font-bold text-red-400 mb-2 text-center">Madd Lâzim - 6 temps</h3>
        
        <div className="flex items-center justify-center gap-2 sm:gap-3 md:gap-4">
          <button
            onClick={() => setCurrentLazimIndex((prev) => (prev - 1 + examplesLazim.length) % examplesLazim.length)}
            className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-110 flex-shrink-0"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          <div className="flex-1 flex flex-col items-center justify-center min-h-[120px] sm:min-h-[140px] md:min-h-[160px] max-w-[400px]">
            <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-red-400 mb-1">
              {currentLazimExample.letter}
            </div>
            <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-amber-300 font-bold leading-relaxed mb-1 text-center">
              {currentLazimExample.verse}
            </div>
            <div className="text-xs sm:text-sm md:text-base text-gray-300 italic">
              {currentLazimExample.translation}
            </div>            <div className="flex items-center gap-2 mt-2">
              <button onClick={toggleLazim} disabled={loadLazim} className="flex items-center gap-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-2 py-1 rounded-full text-[10px]">
                {loadLazim ? <Loader2 className="w-3 h-3 animate-spin" /> : playLazim ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                <span>{playLazim ? 'Pause' : 'Écouter'}</span>
              </button>
              <ReciterSelect selectedReciter={recLazim} onReciterChange={setRecLazim} color="red" />
            </div>
            <div className="text-[9px] text-gray-500 mt-1">S{currentLazimExample.surah}:V{currentLazimExample.ayah}</div>            <div className="flex gap-1.5 mt-3">
              {examplesLazim.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentLazimIndex(index)}
                  className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all ${
                    index === currentLazimIndex ? 'bg-red-500 scale-125' : 'bg-gray-600'
                  }`}
                />
              ))}
            </div>
          </div>

          <button
            onClick={() => setCurrentLazimIndex((prev) => (prev + 1) % examplesLazim.length)}
            className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-110 flex-shrink-0"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>

      {/* Slider Madd 'Âriḍ */}
      <div className="bg-blue-900/30 border border-blue-500/50 rounded-lg p-3 md:p-4 lg:p-6 mb-3">
        <h3 className="text-base md:text-lg font-bold text-blue-400 mb-2 text-center">Madd 'Âriḍ - 2, 4 ou 6 temps</h3>
        
        <div className="flex items-center justify-center gap-2 sm:gap-3 md:gap-4">
          <button
            onClick={() => setCurrentAridIndex((prev) => (prev - 1 + examplesArid.length) % examplesArid.length)}
            className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-110 flex-shrink-0"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          <div className="flex-1 flex flex-col items-center justify-center min-h-[120px] sm:min-h-[140px] md:min-h-[160px] max-w-[400px]">
            <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-blue-400 mb-1">
              {currentAridExample.letter}
            </div>
            <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-amber-300 font-bold leading-relaxed mb-1 text-center">
              {currentAridExample.verse}
            </div>
            <div className="text-xs sm:text-sm md:text-base text-gray-300 italic">
              {currentAridExample.translation}
            </div>
            <div className="flex items-center gap-2 mt-2">
              <button onClick={toggleArid} disabled={loadArid} className="flex items-center gap-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-2 py-1 rounded-full text-[10px]">
                {loadArid ? <Loader2 className="w-3 h-3 animate-spin" /> : playArid ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                <span>{playArid ? 'Pause' : 'Écouter'}</span>
              </button>
              <ReciterSelect selectedReciter={recArid} onReciterChange={setRecArid} color="blue" />
            </div>
            <div className="text-[9px] text-gray-500 mt-1">S{currentAridExample.surah}:V{currentAridExample.ayah}</div>
            <div className="flex gap-1.5 mt-3">
              {examplesArid.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentAridIndex(index)}
                  className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all ${
                    index === currentAridIndex ? 'bg-blue-500 scale-125' : 'bg-gray-600'
                  }`}
                />
              ))}
            </div>
          </div>

          <button
            onClick={() => setCurrentAridIndex((prev) => (prev + 1) % examplesArid.length)}
            className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-110 flex-shrink-0"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>

      {/* Slider Madd Lîn */}
      <div className="bg-green-900/30 border border-green-500/50 rounded-lg p-3 md:p-4 lg:p-6 mb-6">
        <h3 className="text-base md:text-lg font-bold text-green-400 mb-2 text-center">Madd Lîn - 2, 4 ou 6 temps</h3>
        
        <div className="flex items-center justify-center gap-2 sm:gap-3 md:gap-4">
          <button
            onClick={() => setCurrentLinIndex((prev) => (prev - 1 + examplesLin.length) % examplesLin.length)}
            className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full border-2 border-green-500 text-green-500 hover:bg-green-500 hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-110 flex-shrink-0"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          <div className="flex-1 flex flex-col items-center justify-center min-h-[120px] sm:min-h-[140px] md:min-h-[160px] max-w-[400px]">
            <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-green-400 mb-1">
              {currentLinExample.letter}
            </div>
            <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-amber-300 font-bold leading-relaxed mb-1 text-center">
              {currentLinExample.verse}
            </div>
            <div className="text-xs sm:text-sm md:text-base text-gray-300 italic">
              {currentLinExample.translation}
            </div>
            <div className="flex items-center gap-2 mt-2">
              <button onClick={toggleLin} disabled={loadLin} className="flex items-center gap-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-2 py-1 rounded-full text-[10px]">
                {loadLin ? <Loader2 className="w-3 h-3 animate-spin" /> : playLin ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                <span>{playLin ? 'Pause' : 'Écouter'}</span>
              </button>
              <ReciterSelect selectedReciter={recLin} onReciterChange={setRecLin} color="green" />
            </div>
            <div className="text-[9px] text-gray-500 mt-1">S{currentLinExample.surah}:V{currentLinExample.ayah}</div>
            <div className="flex gap-1.5 mt-3">
              {examplesLin.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentLinIndex(index)}
                  className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all ${
                    index === currentLinIndex ? 'bg-green-500 scale-125' : 'bg-gray-600'
                  }`}
                />
              ))}
            </div>
          </div>

          <button
            onClick={() => setCurrentLinIndex((prev) => (prev + 1) % examplesLin.length)}
            className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full border-2 border-green-500 text-green-500 hover:bg-green-500 hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-110 flex-shrink-0"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>

      <div className="px-4 md:px-8">
        <PageNavigation currentChapter={4} currentPage={15} module="TAJWID" className="mt-4 mb-4" />
      </div>

      <footer className="border-t-1 text-white text-center p-4 md:p-6 flex-shrink-0 font-semibold text-sm md:text-base">
        <div>Chapitre 4 - Page 15 : Madd Lâzim, 'Âriḍ & Lîn</div>
        <div className="mt-1">© 2025 Tous droits réservés</div>
      </footer>
    </div>
  );
};

const Page16 = () => {
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
    ? "Leçon : Madd Lâzim (المد اللازم)"
    : "Exemples de Madd Lâzim, 'Âriḍ & Lîn";

  return (
    <div className="font-arabic min-h-screen bg-gray-900">
      <div className="w-full h-full overflow-hidden bg-gray-900">
        
        {/* Header */}
        <div className="text-white p-4 md:p-6 text-center border-b-2">
          <div className="text-2xl md:text-3xl font-bold mb-2">
            {pageTitle}
          </div>
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
        {currentPage === 0 && <LazimPage />}
        {currentPage === 1 && <ExamplesPage />}
      </div>
    </div>
  );
};

export default Page16;
