'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Play, Pause, Volume2, Loader2, ChevronDown } from 'lucide-react';
import PageNavigation from '@/app/components/PageNavigation';

const IntroductionPage = () => {
  return (
    <div className="p-4 md:p-8 bg-gray-900">
      <div className="w-full bg-gray-800 rounded-lg p-6 md:p-8">
        <div className="text-white space-y-6 text-lg md:text-xl leading-relaxed">
          <h2 className="text-3xl font-bold text-purple-400 mb-4">Madd Far'î (المد الفرعي) - Madd Secondaire</h2>
          
          <p>
            Le <span className="text-purple-400 font-semibold">Madd Far'î</span> (Madd secondaire ou dérivé) 
            est tout prolongement qui <span className="text-amber-400 font-semibold">dépasse les 2 temps</span> du Madd Ṭabî'î.
          </p>
          
          <p>
            <span className="text-green-400 font-semibold">Cause du Madd Far'î :</span> Il se produit lorsque la lettre de Madd 
            est suivie de l'une des deux choses suivantes :
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
            <div className="bg-amber-900/30 border-2 border-amber-500 rounded-xl p-5 text-center">
              <div className="text-5xl text-amber-400 font-bold mb-2">ء</div>
              <p className="text-amber-400 font-bold">Hamza (همزة)</p>
              <p className="text-gray-300 text-sm mt-2">Madd causé par une Hamza</p>
            </div>
            <div className="bg-red-900/30 border-2 border-red-500 rounded-xl p-5 text-center">
              <div className="text-5xl text-red-400 font-bold mb-2">ْ</div>
              <p className="text-red-400 font-bold">Sukûn (سكون)</p>
              <p className="text-gray-300 text-sm mt-2">Madd causé par un Sukûn</p>
            </div>
          </div>
          
          <div className="bg-purple-900/30 border border-purple-500/50 rounded-lg p-4 md:p-6 my-6">
            <p>
              💡 <span className="font-semibold">À retenir :</span> Le Madd Far'î n'existe pas par lui-même. 
              Il est toujours <strong>dérivé</strong> du Madd Ṭabî'î et nécessite une cause (Hamza ou Sukûn).
            </p>
          </div>
        </div>
      </div>
      
      <div className="px-4 md:px-8">
        <PageNavigation currentChapter={4} currentPage={13} module="TAJWID" className="mt-6 mb-4" />
      </div>

      <footer className="border-t-1 text-white text-center p-4 md:p-6 mt-8 flex-shrink-0 font-semibold text-base md:text-lg">
        <div>Chapitre 4 - Page 13</div>
        <div className="mt-1">© 2025 Tous droits réservés</div>
      </footer>
    </div>
  );
};

// Données des exemples - Madd causé par Hamza
const examplesHamza = [
  { 
    letter: 'ء', 
    verse: 'جَاءَ',
    translation: 'Il est venu (Muttaṣil)',
    surah: 110,
    ayah: 1
  },
  { 
    letter: 'ء', 
    verse: 'سُوءٌ',
    translation: 'Mal (Muttaṣil)',
    surah: 4,
    ayah: 17
  },
  { 
    letter: 'ء', 
    verse: 'فِي أَنفُسِهِمْ',
    translation: 'En eux-mêmes (Munfaṣil)',
    surah: 4,
    ayah: 64
  },
  { 
    letter: 'ء', 
    verse: 'آمَنُوا',
    translation: 'Ils ont cru (Badal)',
    surah: 2,
    ayah: 3
  }
];

// Données des exemples - Madd causé par Sukûn
const examplesSukun = [
  { 
    letter: 'ْ', 
    verse: 'الْحَاقَّةُ',
    translation: "L'inévitable (Lâzim)",
    surah: 69,
    ayah: 1
  },
  { 
    letter: 'ْ', 
    verse: 'الصَّاخَّةُ',
    translation: 'Le fracas (Lâzim)',
    surah: 80,
    ayah: 33
  },
  { 
    letter: 'ْ', 
    verse: 'الْعَالَمِينْ',
    translation: 'Les mondes (ʿÂriḍ)',
    surah: 1,
    ayah: 2
  },
  { 
    letter: 'ْ', 
    verse: 'نَسْتَعِينْ',
    translation: 'Nous implorons (ʿÂriḍ)',
    surah: 1,
    ayah: 5
  }
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

// Composant ReciterSelect
const ReciterSelect = ({ selectedReciter, onReciterChange, color = 'amber' }: {
  selectedReciter: string;
  onReciterChange: (reciterId: string) => void;
  color?: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedReciterData = reciters.find(r => r.id === selectedReciter);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-2 py-1 rounded-lg transition-colors min-w-[140px] justify-between text-xs"
      >
        <div className="flex items-center gap-1">
          <Volume2 className={`w-3 h-3 text-${color}-400`} />
          <span className="text-xs">{selectedReciterData?.name}</span>
        </div>
        <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-gray-800 border border-gray-600 rounded-lg shadow-xl z-50 min-w-[160px] overflow-hidden">
          {reciters.map((reciter) => (
            <button
              key={reciter.id}
              onClick={() => {
                onReciterChange(reciter.id);
                setIsOpen(false);
              }}
              className={`w-full px-3 py-2 text-left hover:bg-gray-700 transition-colors flex flex-col ${
                selectedReciter === reciter.id ? `bg-${color}-900/50` : ''
              }`}
            >
              <span className="text-white text-xs">{reciter.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const ExamplesPage = () => {
  const [currentHamzaIndex, setCurrentHamzaIndex] = useState(0);
  const [currentSukunIndex, setCurrentSukunIndex] = useState(0);
  
  // États audio pour Hamza
  const [selectedReciterHamza, setSelectedReciterHamza] = useState('abdul-basit');
  const [isPlayingHamza, setIsPlayingHamza] = useState(false);
  const [isLoadingHamza, setIsLoadingHamza] = useState(false);
  const audioHamzaRef = useRef<HTMLAudioElement | null>(null);
  
  // États audio pour Sukun
  const [selectedReciterSukun, setSelectedReciterSukun] = useState('abdul-basit');
  const [isPlayingSukun, setIsPlayingSukun] = useState(false);
  const [isLoadingSukun, setIsLoadingSukun] = useState(false);
  const audioSukunRef = useRef<HTMLAudioElement | null>(null);

  // Reset audio quand on change d'exemple
  useEffect(() => {
    if (audioHamzaRef.current) { audioHamzaRef.current.pause(); audioHamzaRef.current = null; }
    setIsPlayingHamza(false); setIsLoadingHamza(false);
  }, [currentHamzaIndex, selectedReciterHamza]);

  useEffect(() => {
    if (audioSukunRef.current) { audioSukunRef.current.pause(); audioSukunRef.current = null; }
    setIsPlayingSukun(false); setIsLoadingSukun(false);
  }, [currentSukunIndex, selectedReciterSukun]);

  const togglePlayHamza = async () => {
    const example = examplesHamza[currentHamzaIndex];
    if (isPlayingHamza && audioHamzaRef.current) { audioHamzaRef.current.pause(); setIsPlayingHamza(false); return; }
    setIsLoadingHamza(true);
    try {
      const audio = new Audio(`/api/quran/audio?reciterId=${selectedReciterHamza}&surah=${example.surah}&ayah=${example.ayah}`);
      audioHamzaRef.current = audio;
      audio.oncanplaythrough = () => { setIsLoadingHamza(false); audio.play(); setIsPlayingHamza(true); };
      audio.onended = () => setIsPlayingHamza(false);
      audio.onerror = () => { setIsLoadingHamza(false); setIsPlayingHamza(false); };
      audio.load();
    } catch { setIsLoadingHamza(false); }
  };

  const togglePlaySukun = async () => {
    const example = examplesSukun[currentSukunIndex];
    if (isPlayingSukun && audioSukunRef.current) { audioSukunRef.current.pause(); setIsPlayingSukun(false); return; }
    setIsLoadingSukun(true);
    try {
      const audio = new Audio(`/api/quran/audio?reciterId=${selectedReciterSukun}&surah=${example.surah}&ayah=${example.ayah}`);
      audioSukunRef.current = audio;
      audio.oncanplaythrough = () => { setIsLoadingSukun(false); audio.play(); setIsPlayingSukun(true); };
      audio.onended = () => setIsPlayingSukun(false);
      audio.onerror = () => { setIsLoadingSukun(false); setIsPlayingSukun(false); };
      audio.load();
    } catch { setIsLoadingSukun(false); }
  };

  const currentHamzaExample = examplesHamza[currentHamzaIndex];
  const currentSukunExample = examplesSukun[currentSukunIndex];

  return (
    <div className="p-2 md:p-4 lg:p-8 bg-gray-900">
      
      {/* Slider Madd causé par Hamza */}
      <div className="bg-amber-900/30 border border-amber-500/50 rounded-lg p-4 md:p-6 lg:p-8 mb-4">
        <h3 className="text-lg md:text-xl font-bold text-amber-400 mb-3 text-center">Madd causé par Hamza (سببه الهمزة)</h3>
        
        <div className="flex items-center justify-center gap-2 sm:gap-4 md:gap-6">
          <button
            onClick={() => setCurrentHamzaIndex((prev) => (prev - 1 + examplesHamza.length) % examplesHamza.length)}
            className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full border-2 border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-110 flex-shrink-0"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
          </button>

          <div className="flex-1 flex flex-col items-center justify-center min-h-[160px] sm:min-h-[180px] md:min-h-[200px] max-w-[500px]">
            <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-amber-400 mb-2">
              {currentHamzaExample.letter}
            </div>
            <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-amber-300 font-bold leading-relaxed mb-2 text-center">
              {currentHamzaExample.verse}
            </div>
            <div className="text-sm sm:text-base md:text-lg text-gray-300 italic">
              {currentHamzaExample.translation}
            </div>
            
            {/* Audio controls */}
            <div className="flex flex-col sm:flex-row items-center gap-2 mt-3">
              <button onClick={togglePlayHamza} disabled={isLoadingHamza}
                className="flex items-center gap-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-3 py-1 rounded-full text-xs">
                {isLoadingHamza ? <Loader2 className="w-4 h-4 animate-spin" /> : isPlayingHamza ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{isLoadingHamza ? '...' : isPlayingHamza ? 'Pause' : 'Écouter'}</span>
              </button>
              <ReciterSelect selectedReciter={selectedReciterHamza} onReciterChange={setSelectedReciterHamza} color="amber" />
            </div>
            <div className="text-[10px] text-gray-500 mt-1">Sourate {currentHamzaExample.surah}, Verset {currentHamzaExample.ayah}</div>
            
            <div className="flex gap-2 mt-4">
              {examplesHamza.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentHamzaIndex(index)}
                  className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full transition-all ${
                    index === currentHamzaIndex ? 'bg-amber-500 scale-125' : 'bg-gray-600'
                  }`}
                />
              ))}
            </div>
          </div>

          <button
            onClick={() => setCurrentHamzaIndex((prev) => (prev + 1) % examplesHamza.length)}
            className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full border-2 border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-110 flex-shrink-0"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
          </button>
        </div>
      </div>

      {/* Slider Madd causé par Sukûn */}
      <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-4 md:p-6 lg:p-8 mb-6">
        <h3 className="text-lg md:text-xl font-bold text-red-400 mb-3 text-center">Madd causé par Sukûn (سببه السكون)</h3>
        
        <div className="flex items-center justify-center gap-2 sm:gap-4 md:gap-6">
          <button
            onClick={() => setCurrentSukunIndex((prev) => (prev - 1 + examplesSukun.length) % examplesSukun.length)}
            className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-110 flex-shrink-0"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
          </button>

          <div className="flex-1 flex flex-col items-center justify-center min-h-[160px] sm:min-h-[180px] md:min-h-[200px] max-w-[500px]">
            <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-red-400 mb-2">
              {currentSukunExample.letter}
            </div>
            <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-amber-300 font-bold leading-relaxed mb-2 text-center">
              {currentSukunExample.verse}
            </div>
            <div className="text-sm sm:text-base md:text-lg text-gray-300 italic">
              {currentSukunExample.translation}
            </div>
            
            {/* Audio controls */}
            <div className="flex flex-col sm:flex-row items-center gap-2 mt-3">
              <button onClick={togglePlaySukun} disabled={isLoadingSukun}
                className="flex items-center gap-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-3 py-1 rounded-full text-xs">
                {isLoadingSukun ? <Loader2 className="w-4 h-4 animate-spin" /> : isPlayingSukun ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{isLoadingSukun ? '...' : isPlayingSukun ? 'Pause' : 'Écouter'}</span>
              </button>
              <ReciterSelect selectedReciter={selectedReciterSukun} onReciterChange={setSelectedReciterSukun} color="red" />
            </div>
            <div className="text-[10px] text-gray-500 mt-1">Sourate {currentSukunExample.surah}, Verset {currentSukunExample.ayah}</div>
            
            <div className="flex gap-2 mt-4">
              {examplesSukun.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSukunIndex(index)}
                  className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full transition-all ${
                    index === currentSukunIndex ? 'bg-red-500 scale-125' : 'bg-gray-600'
                  }`}
                />
              ))}
            </div>
          </div>

          <button
            onClick={() => setCurrentSukunIndex((prev) => (prev + 1) % examplesSukun.length)}
            className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-110 flex-shrink-0"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
          </button>
        </div>
      </div>

      <div className="px-4 md:px-8">
        <PageNavigation currentChapter={4} currentPage={13} module="TAJWID" className="mt-6 mb-4" />
      </div>

      <footer className="border-t-1 text-white text-center p-4 md:p-6 flex-shrink-0 font-semibold text-sm md:text-base">
        <div>Chapitre 4 - Page 13 : Madd Far'î</div>
        <div className="mt-1">© 2025 Tous droits réservés</div>
      </footer>
    </div>
  );
};

const Page14 = () => {
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
    ? "Leçon : Madd Far'î (المد الفرعي)"
    : "Exemples de Madd Far'î";

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
        {currentPage === 0 && <IntroductionPage />}
        {currentPage === 1 && <ExamplesPage />}
      </div>
    </div>
  );
};

export default Page14;
