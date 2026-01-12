'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Play, Pause, Volume2, Loader2, ChevronDown } from 'lucide-react';
import PageNavigation from '@/app/components/PageNavigation';

const MuttasilPage = () => {
  return (
    <div className="p-4 md:p-8 bg-gray-900">
      <div className="w-full bg-gray-800 rounded-lg p-6 md:p-8">
        <div className="text-white space-y-6 text-lg md:text-xl leading-relaxed">
          <h2 className="text-3xl font-bold text-amber-400 mb-4">Madd Muttaṣil (المد المتصل)</h2>
          
          <p>
            Le <span className="text-amber-400 font-semibold">Madd Muttaṣil</span> (Madd lié/connecté) se produit quand 
            la lettre de Madd et la Hamza sont <span className="text-green-400 font-semibold">dans le même mot</span>.
          </p>
          
          <div className="text-center my-6">
            <div className="inline-block bg-amber-900/50 border-2 border-amber-500 rounded-xl p-6">
              <p className="text-gray-300 text-lg mb-2">Durée :</p>
              <p className="text-4xl text-amber-400 font-bold">4-5 temps (واجب)</p>
              <p className="text-gray-400 text-sm mt-2">Obligatoire</p>
            </div>
          </div>
          
          <div className="bg-amber-900/30 border border-amber-500/50 rounded-lg p-4 my-6">
            <p>
              💡 <span className="font-semibold">Pourquoi "Muttaṣil" ?</span> Parce que le Madd et sa cause (la Hamza) 
              sont <strong>connectés</strong> dans le même mot, donc on ne peut jamais les séparer.
            </p>
          </div>
        </div>
      </div>
      
      <div className="px-4 md:px-8">
        <PageNavigation currentChapter={4} currentPage={14} module="TAJWID" className="mt-6 mb-4" />
      </div>

      <footer className="border-t-1 text-white text-center p-4 md:p-6 mt-8 flex-shrink-0 font-semibold text-base md:text-lg">
        <div>Chapitre 4 - Page 14</div>
        <div className="mt-1">© 2025 Tous droits réservés</div>
      </footer>
    </div>
  );
};

// Données des exemples - Madd Muttaṣil
const examplesMuttasil = [
  { letter: 'ء', verse: 'جَاءَ', translation: 'Il est venu', surah: 110, ayah: 1 },
  { letter: 'ء', verse: 'سُوءٌ', translation: 'Mal', surah: 4, ayah: 17 },
  { letter: 'ء', verse: 'شَاءَ', translation: 'Il a voulu', surah: 2, ayah: 20 },
  { letter: 'ء', verse: 'سِيئَتْ', translation: 'Elle a été enlaidie', surah: 67, ayah: 27 },
  { letter: 'ء', verse: 'هَنِيئًا', translation: 'Agréablement', surah: 4, ayah: 4 },
  { letter: 'ء', verse: 'بَرِيئًا', translation: 'Innocent', surah: 33, ayah: 69 }
];

// Données des exemples - Madd Munfaṣil
const examplesMunfasil = [
  { letter: 'ء', verse: 'فِي أَنفُسِهِمْ', translation: 'En eux-mêmes', surah: 4, ayah: 64 },
  { letter: 'ء', verse: 'قَالُوا آمَنَّا', translation: 'Ils dirent : nous croyons', surah: 2, ayah: 14 },
  { letter: 'ء', verse: 'يَا أَيُّهَا', translation: 'Ô vous', surah: 2, ayah: 21 },
  { letter: 'ء', verse: 'إِنَّا أَنزَلْنَاهُ', translation: "Certes nous l'avons révélé", surah: 97, ayah: 1 },
  { letter: 'ء', verse: 'بِمَا أُنزِلَ', translation: 'Ce qui a été révélé', surah: 2, ayah: 4 },
  { letter: 'ء', verse: 'هَا أَنتُمْ', translation: 'Vous voilà', surah: 3, ayah: 66 }
];

// Récitateurs disponibles
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
  const dropdownRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => { if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setIsOpen(false); };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  const selected = reciters.find(r => r.id === selectedReciter);
  return (
    <div className="relative" ref={dropdownRef}>
      <button onClick={() => setIsOpen(!isOpen)} className="flex items-center gap-1 bg-gray-700 hover:bg-gray-600 text-white px-2 py-1 rounded-lg min-w-[140px] justify-between text-xs">
        <div className="flex items-center gap-1"><Volume2 className={`w-3 h-3 text-${color}-400`} /><span>{selected?.name}</span></div>
        <ChevronDown className={`w-3 h-3 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-gray-800 border border-gray-600 rounded-lg shadow-xl z-50 min-w-[160px]">
          {reciters.map(r => (
            <button key={r.id} onClick={() => { onReciterChange(r.id); setIsOpen(false); }}
              className={`w-full px-3 py-2 text-left hover:bg-gray-700 flex flex-col ${selectedReciter === r.id ? `bg-${color}-900/50` : ''}`}>
              <span className="text-white text-xs">{r.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const ExamplesPage = () => {
  const [currentMuttasilIndex, setCurrentMuttasilIndex] = useState(0);
  const [currentMunfasilIndex, setCurrentMunfasilIndex] = useState(0);
  
  const [reciterMuttasil, setReciterMuttasil] = useState('abdul-basit');
  const [playingMuttasil, setPlayingMuttasil] = useState(false);
  const [loadingMuttasil, setLoadingMuttasil] = useState(false);
  const audioMuttasilRef = useRef<HTMLAudioElement | null>(null);
  
  const [reciterMunfasil, setReciterMunfasil] = useState('abdul-basit');
  const [playingMunfasil, setPlayingMunfasil] = useState(false);
  const [loadingMunfasil, setLoadingMunfasil] = useState(false);
  const audioMunfasilRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioMuttasilRef.current) { audioMuttasilRef.current.pause(); audioMuttasilRef.current = null; }
    setPlayingMuttasil(false); setLoadingMuttasil(false);
  }, [currentMuttasilIndex, reciterMuttasil]);

  useEffect(() => {
    if (audioMunfasilRef.current) { audioMunfasilRef.current.pause(); audioMunfasilRef.current = null; }
    setPlayingMunfasil(false); setLoadingMunfasil(false);
  }, [currentMunfasilIndex, reciterMunfasil]);

  const playMuttasil = () => {
    const ex = examplesMuttasil[currentMuttasilIndex];
    if (playingMuttasil && audioMuttasilRef.current) { audioMuttasilRef.current.pause(); setPlayingMuttasil(false); return; }
    setLoadingMuttasil(true);
    const audio = new Audio(`/api/quran/audio?reciterId=${reciterMuttasil}&surah=${ex.surah}&ayah=${ex.ayah}`);
    audioMuttasilRef.current = audio;
    audio.oncanplaythrough = () => { setLoadingMuttasil(false); audio.play(); setPlayingMuttasil(true); };
    audio.onended = () => setPlayingMuttasil(false);
    audio.onerror = () => { setLoadingMuttasil(false); setPlayingMuttasil(false); };
    audio.load();
  };

  const playMunfasil = () => {
    const ex = examplesMunfasil[currentMunfasilIndex];
    if (playingMunfasil && audioMunfasilRef.current) { audioMunfasilRef.current.pause(); setPlayingMunfasil(false); return; }
    setLoadingMunfasil(true);
    const audio = new Audio(`/api/quran/audio?reciterId=${reciterMunfasil}&surah=${ex.surah}&ayah=${ex.ayah}`);
    audioMunfasilRef.current = audio;
    audio.oncanplaythrough = () => { setLoadingMunfasil(false); audio.play(); setPlayingMunfasil(true); };
    audio.onended = () => setPlayingMunfasil(false);
    audio.onerror = () => { setLoadingMunfasil(false); setPlayingMunfasil(false); };
    audio.load();
  };

  const currentMuttasilExample = examplesMuttasil[currentMuttasilIndex];
  const currentMunfasilExample = examplesMunfasil[currentMunfasilIndex];

  return (
    <div className="p-2 md:p-4 lg:p-8 bg-gray-900">
      
      {/* Slider Madd Muttaṣil */}
      <div className="bg-amber-900/30 border border-amber-500/50 rounded-lg p-4 md:p-6 lg:p-8 mb-4">
        <h3 className="text-lg md:text-xl font-bold text-amber-400 mb-3 text-center">Madd Muttaṣil (المد المتصل)</h3>
        
        <div className="flex items-center justify-center gap-2 sm:gap-4 md:gap-6">
          <button
            onClick={() => setCurrentMuttasilIndex((prev) => (prev - 1 + examplesMuttasil.length) % examplesMuttasil.length)}
            className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full border-2 border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-110 flex-shrink-0"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
          </button>

          <div className="flex-1 flex flex-col items-center justify-center min-h-[160px] sm:min-h-[180px] md:min-h-[200px] max-w-[500px]">
            <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-amber-400 mb-2">
              {currentMuttasilExample.letter}
            </div>
            <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-amber-300 font-bold leading-relaxed mb-2 text-center">
              {currentMuttasilExample.verse}
            </div>
            <div className="text-sm sm:text-base md:text-lg text-gray-300 italic">
              {currentMuttasilExample.translation}
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-2 mt-3">
              <button onClick={playMuttasil} disabled={loadingMuttasil}
                className="flex items-center gap-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-3 py-1 rounded-full text-xs">
                {loadingMuttasil ? <Loader2 className="w-4 h-4 animate-spin" /> : playingMuttasil ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{loadingMuttasil ? '...' : playingMuttasil ? 'Pause' : 'Écouter'}</span>
              </button>
              <ReciterSelect selectedReciter={reciterMuttasil} onReciterChange={setReciterMuttasil} color="amber" />
            </div>
            <div className="text-[10px] text-gray-500 mt-1">Sourate {currentMuttasilExample.surah}, Verset {currentMuttasilExample.ayah}</div>
            <div className="flex gap-2 mt-4">
              {examplesMuttasil.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentMuttasilIndex(index)}
                  className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full transition-all ${
                    index === currentMuttasilIndex ? 'bg-amber-500 scale-125' : 'bg-gray-600'
                  }`}
                />
              ))}
            </div>
          </div>

          <button
            onClick={() => setCurrentMuttasilIndex((prev) => (prev + 1) % examplesMuttasil.length)}
            className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full border-2 border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-110 flex-shrink-0"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
          </button>
        </div>
      </div>

      {/* Slider Madd Munfaṣil */}
      <div className="bg-blue-900/30 border border-blue-500/50 rounded-lg p-4 md:p-6 lg:p-8 mb-6">
        <h3 className="text-lg md:text-xl font-bold text-blue-400 mb-3 text-center">Madd Munfaṣil (المد المنفصل)</h3>
        
        <div className="flex items-center justify-center gap-2 sm:gap-4 md:gap-6">
          <button
            onClick={() => setCurrentMunfasilIndex((prev) => (prev - 1 + examplesMunfasil.length) % examplesMunfasil.length)}
            className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-110 flex-shrink-0"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
          </button>

          <div className="flex-1 flex flex-col items-center justify-center min-h-[160px] sm:min-h-[180px] md:min-h-[200px] max-w-[500px]">
            <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-blue-400 mb-2">
              {currentMunfasilExample.letter}
            </div>
            <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-amber-300 font-bold leading-relaxed mb-2 text-center">
              {currentMunfasilExample.verse}
            </div>
            <div className="text-sm sm:text-base md:text-lg text-gray-300 italic">
              {currentMunfasilExample.translation}
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-2 mt-3">
              <button onClick={playMunfasil} disabled={loadingMunfasil}
                className="flex items-center gap-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-3 py-1 rounded-full text-xs">
                {loadingMunfasil ? <Loader2 className="w-4 h-4 animate-spin" /> : playingMunfasil ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{loadingMunfasil ? '...' : playingMunfasil ? 'Pause' : 'Écouter'}</span>
              </button>
              <ReciterSelect selectedReciter={reciterMunfasil} onReciterChange={setReciterMunfasil} color="blue" />
            </div>
            <div className="text-[10px] text-gray-500 mt-1">Sourate {currentMunfasilExample.surah}, Verset {currentMunfasilExample.ayah}</div>
            <div className="flex gap-2 mt-4">
              {examplesMunfasil.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentMunfasilIndex(index)}
                  className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full transition-all ${
                    index === currentMunfasilIndex ? 'bg-blue-500 scale-125' : 'bg-gray-600'
                  }`}
                />
              ))}
            </div>
          </div>

          <button
            onClick={() => setCurrentMunfasilIndex((prev) => (prev + 1) % examplesMunfasil.length)}
            className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-110 flex-shrink-0"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
          </button>
        </div>
      </div>

      <div className="px-4 md:px-8">
        <PageNavigation currentChapter={4} currentPage={14} module="TAJWID" className="mt-6 mb-4" />
      </div>

      <footer className="border-t-1 text-white text-center p-4 md:p-6 flex-shrink-0 font-semibold text-sm md:text-base">
        <div>Chapitre 4 - Page 14 : Madd Muttaṣil & Munfaṣil</div>
        <div className="mt-1">© 2025 Tous droits réservés</div>
      </footer>
    </div>
  );
};

const Page15 = () => {
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
    ? "Leçon : Madd Muttaṣil (المد المتصل)"
    : "Exemples de Madd Muttaṣil & Munfaṣil";

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
        {currentPage === 0 && <MuttasilPage />}
        {currentPage === 1 && <ExamplesPage />}
      </div>
    </div>
  );
};

export default Page15;
