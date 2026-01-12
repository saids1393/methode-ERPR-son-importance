'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Play, Pause, Volume2, Loader2, ChevronDown } from 'lucide-react';
import PageNavigation from '@/app/components/PageNavigation';

const TawassutPage = () => {
  const letters = ['ل', 'ن', 'ع', 'م', 'ر'];

  return (
    <div className="p-4 md:p-8 bg-gray-900">
      <div className="w-full bg-gray-800 rounded-lg p-6 md:p-8">
        <div className="text-white space-y-6 text-lg md:text-xl leading-relaxed">
          <h2 className="text-3xl font-bold text-teal-400 mb-4">Tawassut (التوسط) - L'Intermédiaire</h2>
          
          <p>
            Le <span className="text-teal-400 font-semibold">Tawassut</span> signifie "intermédiaire" ou "milieu". 
            C'est une caractéristique entre la Shiddah et la Rakhâwah - le son n'est 
            <span className="text-amber-400 font-semibold"> ni complètement bloqué ni totalement libre</span>.
          </p>
          
          <div className="bg-teal-900/30 border border-teal-500/50 rounded-lg p-4 md:p-6 my-6">
            <h3 className="text-xl font-bold text-teal-300 mb-4 text-center">Les 5 lettres de Tawassut</h3>
            <div className="flex justify-center gap-4 flex-wrap">
              {letters.map((letter, index) => (
                <div key={index} className="w-14 h-14 md:w-16 md:h-16 bg-teal-600 rounded-xl flex items-center justify-center text-3xl md:text-4xl text-white font-bold shadow-lg">
                  {letter}
                </div>
              ))}
            </div>
            <p className="text-center text-teal-300 mt-4 text-lg">
              لِنْ عُمَرْ (Lin 'Umar)
            </p>
          </div>
          
          <div className="bg-amber-900/30 border border-amber-500/50 rounded-lg p-4">
            <p className="text-amber-300">
              💡 <span className="font-semibold">Note :</span> Les lettres م et ن peuvent produire un 
              <span className="text-teal-300 font-semibold"> son nasal (Ghunnah)</span> en plus du Tawassut.
            </p>
          </div>
        </div>
      </div>
      
      <div className="px-4 md:px-8">
        <PageNavigation currentChapter={6} currentPage={23} module="TAJWID" className="mt-6 mb-4" />
      </div>

      <footer className="border-t-1 text-white text-center p-4 md:p-6 mt-8 flex-shrink-0 font-semibold text-base md:text-lg">
        <div>Chapitre 6 - Page 23</div>
        <div className="mt-1">© 2025 Tous droits réservés</div>
      </footer>
    </div>
  );
};

// Données des exemples - Shiddah (force)
const examplesShiddah = [
  { letter: 'ق', verse: 'الْحَقُّ', translation: 'La vérité', surah: 69, ayah: 1 },
  { letter: 'ب', verse: 'بَصِيرٌ', translation: 'Clairvoyant', surah: 17, ayah: 1 },
  { letter: 'ت', verse: 'تَوَّابٌ', translation: 'Celui qui accepte le repentir', surah: 2, ayah: 37 }
];

// Données des exemples - Tawassut (intermédiaire)
const examplesTawassut = [
  { letter: 'ل', verse: 'أَلَمْ', translation: "N'est-ce pas", surah: 94, ayah: 1 },
  { letter: 'ن', verse: 'مِنْ', translation: 'De', surah: 1, ayah: 5 },
  { letter: 'ع', verse: 'عَلَيْكَ', translation: 'Sur toi', surah: 5, ayah: 105 },
  { letter: 'م', verse: 'الْحَمْدُ', translation: 'La louange', surah: 1, ayah: 2 },
  { letter: 'ر', verse: 'الرَّحْمَٰنِ', translation: 'Le Tout Miséricordieux', surah: 1, ayah: 1 }
];

// Données des exemples - Rakhâwah (douceur)
const examplesRakhawah = [
  { letter: 'ش', verse: 'الشَّمْسِ', translation: 'Le soleil', surah: 91, ayah: 1 },
  { letter: 'ص', verse: 'الصَّابِرِينَ', translation: 'Les patients', surah: 2, ayah: 153 },
  { letter: 'ف', verse: 'الْفَلَقِ', translation: "L'aube naissante", surah: 113, ayah: 1 }
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

const ExamplesPage = () => {
  const [currentShiddahIndex, setCurrentShiddahIndex] = useState(0);
  const [currentTawassutIndex, setCurrentTawassutIndex] = useState(0);
  const [currentRakhawahIndex, setCurrentRakhawahIndex] = useState(0);

  const [recShiddah, setRecShiddah] = useState('abdul-basit');
  const [playShiddah, setPlayShiddah] = useState(false);
  const [loadShiddah, setLoadShiddah] = useState(false);
  const audioShiddahRef = useRef<HTMLAudioElement | null>(null);

  const [recTawassut, setRecTawassut] = useState('abdul-basit');
  const [playTawassut, setPlayTawassut] = useState(false);
  const [loadTawassut, setLoadTawassut] = useState(false);
  const audioTawassutRef = useRef<HTMLAudioElement | null>(null);

  const [recRakhawah, setRecRakhawah] = useState('abdul-basit');
  const [playRakhawah, setPlayRakhawah] = useState(false);
  const [loadRakhawah, setLoadRakhawah] = useState(false);
  const audioRakhawahRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => { if (audioShiddahRef.current) { audioShiddahRef.current.pause(); audioShiddahRef.current = null; } setPlayShiddah(false); setLoadShiddah(false); }, [currentShiddahIndex, recShiddah]);
  useEffect(() => { if (audioTawassutRef.current) { audioTawassutRef.current.pause(); audioTawassutRef.current = null; } setPlayTawassut(false); setLoadTawassut(false); }, [currentTawassutIndex, recTawassut]);
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

  const toggleTawassut = () => {
    const ex = examplesTawassut[currentTawassutIndex];
    if (playTawassut && audioTawassutRef.current) { audioTawassutRef.current.pause(); setPlayTawassut(false); return; }
    setLoadTawassut(true);
    const a = new Audio(`/api/quran/audio?reciterId=${recTawassut}&surah=${ex.surah}&ayah=${ex.ayah}`);
    audioTawassutRef.current = a;
    a.oncanplaythrough = () => { setLoadTawassut(false); a.play(); setPlayTawassut(true); };
    a.onended = () => setPlayTawassut(false);
    a.onerror = () => { setLoadTawassut(false); setPlayTawassut(false); };
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
  const currentTawassutExample = examplesTawassut[currentTawassutIndex];
  const currentRakhawahExample = examplesRakhawah[currentRakhawahIndex];

  return (
    <div className="p-2 md:p-4 lg:p-6 bg-gray-900">
      
      {/* Slider Shiddah */}
      <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-3 md:p-4 lg:p-6 mb-3">
        <h3 className="text-base md:text-lg font-bold text-red-400 mb-2 text-center">Shiddah (الشدة) - 8 lettres - Bloqué</h3>
        
        <div className="flex items-center justify-center gap-2 sm:gap-3 md:gap-4">
          <button
            onClick={() => setCurrentShiddahIndex((prev) => (prev - 1 + examplesShiddah.length) % examplesShiddah.length)}
            className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-110 flex-shrink-0"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          <div className="flex-1 flex flex-col items-center justify-center min-h-[120px] sm:min-h-[140px] md:min-h-[160px] max-w-[400px]">
            <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-red-400 mb-1">
              {currentShiddahExample.letter}
            </div>
            <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-amber-300 font-bold leading-relaxed mb-1 text-center">
              {currentShiddahExample.verse}
            </div>
            <div className="text-xs sm:text-sm md:text-base text-gray-300 italic">
              {currentShiddahExample.translation}
            </div>
            <div className="flex items-center gap-2 mt-2">
              <button onClick={toggleShiddah} disabled={loadShiddah} className="flex items-center gap-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white px-2 py-1 rounded-full text-[10px]">
                {loadShiddah ? <Loader2 className="w-3 h-3 animate-spin" /> : playShiddah ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                <span>{playShiddah ? 'Pause' : 'Écouter'}</span>
              </button>
              <ReciterSelect selectedReciter={recShiddah} onReciterChange={setRecShiddah} color="red" />
            </div>
            <div className="text-[9px] text-gray-500 mt-1">S{currentShiddahExample.surah}:V{currentShiddahExample.ayah}</div>
            <div className="flex gap-1.5 mt-2">
              {examplesShiddah.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentShiddahIndex(index)}
                  className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all ${
                    index === currentShiddahIndex ? 'bg-red-500 scale-125' : 'bg-gray-600'
                  }`}
                />
              ))}
            </div>
          </div>

          <button
            onClick={() => setCurrentShiddahIndex((prev) => (prev + 1) % examplesShiddah.length)}
            className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-110 flex-shrink-0"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>

      {/* Slider Tawassut */}
      <div className="bg-teal-900/30 border border-teal-500/50 rounded-lg p-3 md:p-4 lg:p-6 mb-3">
        <h3 className="text-base md:text-lg font-bold text-teal-400 mb-2 text-center">Tawassut (التوسط) - 5 lettres - Partiel</h3>
        
        <div className="flex items-center justify-center gap-2 sm:gap-3 md:gap-4">
          <button
            onClick={() => setCurrentTawassutIndex((prev) => (prev - 1 + examplesTawassut.length) % examplesTawassut.length)}
            className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full border-2 border-teal-500 text-teal-500 hover:bg-teal-500 hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-110 flex-shrink-0"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          <div className="flex-1 flex flex-col items-center justify-center min-h-[120px] sm:min-h-[140px] md:min-h-[160px] max-w-[400px]">
            <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-teal-400 mb-1">
              {currentTawassutExample.letter}
            </div>
            <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-amber-300 font-bold leading-relaxed mb-1 text-center">
              {currentTawassutExample.verse}
            </div>
            <div className="text-xs sm:text-sm md:text-base text-gray-300 italic">
              {currentTawassutExample.translation}
            </div>
            <div className="flex items-center gap-2 mt-2">
              <button onClick={toggleTawassut} disabled={loadTawassut} className="flex items-center gap-1 bg-teal-600 hover:bg-teal-700 disabled:bg-gray-600 text-white px-2 py-1 rounded-full text-[10px]">
                {loadTawassut ? <Loader2 className="w-3 h-3 animate-spin" /> : playTawassut ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                <span>{playTawassut ? 'Pause' : 'Écouter'}</span>
              </button>
              <ReciterSelect selectedReciter={recTawassut} onReciterChange={setRecTawassut} color="teal" />
            </div>
            <div className="text-[9px] text-gray-500 mt-1">S{currentTawassutExample.surah}:V{currentTawassutExample.ayah}</div>
            <div className="flex gap-1.5 mt-2">
              {examplesTawassut.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTawassutIndex(index)}
                  className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all ${
                    index === currentTawassutIndex ? 'bg-teal-500 scale-125' : 'bg-gray-600'
                  }`}
                />
              ))}
            </div>
          </div>

          <button
            onClick={() => setCurrentTawassutIndex((prev) => (prev + 1) % examplesTawassut.length)}
            className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full border-2 border-teal-500 text-teal-500 hover:bg-teal-500 hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-110 flex-shrink-0"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>

      {/* Slider Rakhâwah */}
      <div className="bg-purple-900/30 border border-purple-500/50 rounded-lg p-3 md:p-4 lg:p-6 mb-6">
        <h3 className="text-base md:text-lg font-bold text-purple-400 mb-2 text-center">Rakhâwah (الرخاوة) - 16 lettres - Libre</h3>
        
        <div className="flex items-center justify-center gap-2 sm:gap-3 md:gap-4">
          <button
            onClick={() => setCurrentRakhawahIndex((prev) => (prev - 1 + examplesRakhawah.length) % examplesRakhawah.length)}
            className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full border-2 border-purple-500 text-purple-500 hover:bg-purple-500 hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-110 flex-shrink-0"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          <div className="flex-1 flex flex-col items-center justify-center min-h-[120px] sm:min-h-[140px] md:min-h-[160px] max-w-[400px]">
            <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-purple-400 mb-1">
              {currentRakhawahExample.letter}
            </div>
            <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-amber-300 font-bold leading-relaxed mb-1 text-center">
              {currentRakhawahExample.verse}
            </div>
            <div className="text-xs sm:text-sm md:text-base text-gray-300 italic">
              {currentRakhawahExample.translation}
            </div>
            <div className="flex items-center gap-2 mt-2">
              <button onClick={toggleRakhawah} disabled={loadRakhawah} className="flex items-center gap-1 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white px-2 py-1 rounded-full text-[10px]">
                {loadRakhawah ? <Loader2 className="w-3 h-3 animate-spin" /> : playRakhawah ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                <span>{playRakhawah ? 'Pause' : 'Écouter'}</span>
              </button>
              <ReciterSelect selectedReciter={recRakhawah} onReciterChange={setRecRakhawah} color="purple" />
            </div>
            <div className="text-[9px] text-gray-500 mt-1">S{currentRakhawahExample.surah}:V{currentRakhawahExample.ayah}</div>
            <div className="flex gap-1.5 mt-2">
              {examplesRakhawah.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentRakhawahIndex(index)}
                  className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all ${
                    index === currentRakhawahIndex ? 'bg-purple-500 scale-125' : 'bg-gray-600'
                  }`}
                />
              ))}
            </div>
          </div>

          <button
            onClick={() => setCurrentRakhawahIndex((prev) => (prev + 1) % examplesRakhawah.length)}
            className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full border-2 border-purple-500 text-purple-500 hover:bg-purple-500 hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-110 flex-shrink-0"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>

      <div className="px-4 md:px-8">
        <PageNavigation currentChapter={6} currentPage={23} module="TAJWID" className="mt-4 mb-4" />
      </div>

      <footer className="border-t-1 text-white text-center p-4 md:p-6 flex-shrink-0 font-semibold text-sm md:text-base">
        <div>Chapitre 6 - Page 23 : Les trois niveaux</div>
        <div className="mt-1">© 2025 Tous droits réservés</div>
      </footer>
    </div>
  );
};

const Page25 = () => {
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
    ? "Leçon : Tawassut (التوسط)"
    : "Exemples des trois niveaux";

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

        {currentPage === 0 && <TawassutPage />}
        {currentPage === 1 && <ExamplesPage />}
      </div>
    </div>
  );
};

export default Page25;
