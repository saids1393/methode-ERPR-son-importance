'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Play, Pause, Volume2, Loader2, ChevronDown } from 'lucide-react';
import PageNavigation from '@/app/components/PageNavigation';

const IntroductionPage = () => {
  return (
    <div className="p-4 md:p-8 bg-gray-900">
      <div className="w-full bg-gray-800 rounded-lg p-6 md:p-8">
        <div className="text-white space-y-6 text-lg md:text-xl leading-relaxed">
          <h2 className="text-3xl font-bold text-blue-400 mb-4">Idghâm Shafawî (الإدغام الشفوي)</h2>
          
          <p>
            L'<span className="text-blue-400 font-semibold">Idghâm Shafawî</span> signifie "fusion labiale". 
            Cette règle s'applique quand le <span className="text-green-400 font-semibold">Mîm Sâkin (مْ)</span> est suivi 
            d'une autre lettre <span className="text-amber-400 font-semibold">Mîm (م)</span>.
          </p>
          
          <div className="text-center my-6">
            <div className="inline-block bg-blue-900/50 border-2 border-blue-500 rounded-xl p-6">
              <p className="text-gray-300 text-lg mb-2">La règle :</p>
              <p className="text-4xl text-blue-400 font-bold">مْ + م = إدغام شفوي</p>
            </div>
          </div>
          
          <p>
            Dans ce cas, le premier Mîm <span className="text-blue-400 font-semibold">fusionne complètement</span> avec le second, 
            produisant un seul Mîm prolongé (mushaddad) avec une <span className="text-amber-400 font-semibold">Ghunna</span> de 2 temps.
          </p>
          
          <div className="bg-blue-900/30 border border-blue-500/50 rounded-lg p-4 md:p-6 my-6">
            <p>
              💡 <span className="font-semibold">Comment prononcer :</span> Les deux Mîm deviennent un seul son. 
              Fermez les lèvres et maintenez la nasalité (Ghunna) pendant 2 temps, comme un Mîm avec Shaddah (مّ).
            </p>
          </div>
          
          <p>
            On l'appelle aussi <span className="text-purple-400 font-semibold">"Idghâm Mithlain Saghîr"</span> (fusion de deux lettres identiques, petit).
          </p>
        </div>
      </div>
      
      <div className="px-4 md:px-8">
        <PageNavigation currentChapter={3} currentPage={9} module="TAJWID" className="mt-6 mb-4" />
      </div>

      <footer className="border-t-1 text-white text-center p-4 md:p-6 mt-8 flex-shrink-0 font-semibold text-base md:text-lg">
        <div>Chapitre 3 - Page 9</div>
        <div className="mt-1">© 2025 Tous droits réservés</div>
      </footer>
    </div>
  );
};

// Données des exemples pour le slider - Idghâm Shafawî (مْ + م)
const examplesData = [
  { 
    letter: 'م', 
    verse: 'لَهُم مَّا يَشَاءُونَ',
    translation: "Ils ont ce qu'ils désirent",
    surah: 16,
    ayah: 31
  },
  { 
    letter: 'م', 
    verse: 'كَم مِّن فِئَةٍ',
    translation: 'Combien de groupes',
    surah: 2,
    ayah: 249
  },
  { 
    letter: 'م', 
    verse: 'أَم مَّن يَكُونُ',
    translation: 'Ou bien celui qui est',
    surah: 43,
    ayah: 52
  },
  { 
    letter: 'م', 
    verse: 'وَهُم مُّهْتَدُونَ',
    translation: 'Et ils sont guidés',
    surah: 7,
    ayah: 30
  },
  { 
    letter: 'م', 
    verse: 'فِي قُلُوبِهِم مَّرَضٌ',
    translation: 'Dans leurs cœurs une maladie',
    surah: 2,
    ayah: 10
  },
  { 
    letter: 'م', 
    verse: 'أَزْوَاجُهُم مُّطَهَّرَةٌ',
    translation: 'Leurs épouses purifiées',
    surah: 2,
    ayah: 25
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
const ReciterSelect = ({ selectedReciter, onReciterChange, reciters }: {
  selectedReciter: string;
  onReciterChange: (reciterId: string) => void;
  reciters: { id: string; name: string }[];
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
        className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded-lg transition-colors min-w-[180px] justify-between"
      >
        <div className="flex items-center gap-2">
          <Volume2 className="w-4 h-4 text-blue-400" />
          <span className="text-sm">{selectedReciterData?.name}</span>
        </div>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-gray-800 border border-gray-600 rounded-lg shadow-xl z-50 min-w-[200px] overflow-hidden">
          {reciters.map((reciter) => (
            <button
              key={reciter.id}
              onClick={() => {
                onReciterChange(reciter.id);
                setIsOpen(false);
              }}
              className={`w-full px-4 py-3 text-left hover:bg-gray-700 transition-colors flex flex-col ${
                selectedReciter === reciter.id ? 'bg-blue-900/50' : ''
              }`}
            >
              <span className="text-white text-sm">{reciter.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const ExamplesPage = () => {
  const [currentExampleIndex, setCurrentExampleIndex] = useState(0);
  const [selectedReciterId, setSelectedReciterId] = useState('abdul-basit');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Arrêter l'audio quand on change d'exemple
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setIsPlaying(false);
    setIsLoading(false);
  }, [currentExampleIndex, selectedReciterId]);

  const togglePlay = async () => {
    const currentExample = examplesData[currentExampleIndex];
    
    if (isPlaying && audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      return;
    }

    setIsLoading(true);
    try {
      const audioUrl = `/api/quran/audio?reciterId=${selectedReciterId}&surah=${currentExample.surah}&ayah=${currentExample.ayah}`;
      
      if (audioRef.current) {
        audioRef.current.pause();
      }
      
      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      
      audio.oncanplaythrough = () => {
        setIsLoading(false);
        audio.play();
        setIsPlaying(true);
      };
      
      audio.onended = () => {
        setIsPlaying(false);
      };
      
      audio.onerror = () => {
        setIsLoading(false);
        setIsPlaying(false);
        console.error('Erreur de chargement audio');
      };
      
      audio.load();
    } catch (error) {
      setIsLoading(false);
      console.error('Erreur:', error);
    }
  };

  const goToNextExample = () => {
    setCurrentExampleIndex((prev) => (prev + 1) % examplesData.length);
  };

  const goToPreviousExample = () => {
    setCurrentExampleIndex((prev) => (prev - 1 + examplesData.length) % examplesData.length);
  };

  const currentExample = examplesData[currentExampleIndex];

  return (
    <div className="p-2 md:p-4 lg:p-8 bg-gray-900">
      {/* Slider d'exemples */}
      <div className="bg-blue-900/30 border border-blue-500/50 rounded-lg p-4 md:p-6 lg:p-8 mb-6">
        
        <div className="flex items-center justify-center gap-2 sm:gap-4 md:gap-6 lg:gap-8">
          {/* Flèche gauche */}
          <button
            onClick={goToPreviousExample}
            className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-full border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-110 flex-shrink-0"
            aria-label="Exemple précédent"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8" />
          </button>

          {/* Contenu du slide */}
          <div className="flex-1 flex flex-col items-center justify-center min-h-[280px] sm:min-h-[320px] md:min-h-[380px] lg:min-h-[420px] max-w-[600px] md:max-w-[700px] lg:max-w-[800px]">
            {/* Lettre en haut */}
            <div className="text-center mb-4 md:mb-6 lg:mb-8">
              <div className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold text-blue-400">
                {currentExample.letter}
              </div>
            </div>

            {/* Verset en grand */}
            <div className="text-center w-full px-2 sm:px-4">
              <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-amber-300 font-bold leading-relaxed mb-3 md:mb-4 lg:mb-6">
                {currentExample.verse}
              </div>
              <div className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-300 italic mb-4">
                {currentExample.translation}
              </div>
              
              {/* Bouton audio et sélecteur */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-4">
                <button
                  onClick={togglePlay}
                  disabled={isLoading}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-full transition-all"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : isPlaying ? (
                    <Pause className="w-5 h-5" />
                  ) : (
                    <Play className="w-5 h-5" />
                  )}
                  <span>{isLoading ? 'Chargement...' : isPlaying ? 'Pause' : 'Écouter'}</span>
                </button>
                
                <ReciterSelect
                  selectedReciter={selectedReciterId}
                  onReciterChange={setSelectedReciterId}
                  reciters={reciters}
                />
              </div>
              
              <div className="text-xs text-gray-500 mt-2">
                Sourate {currentExample.surah}, Verset {currentExample.ayah}
              </div>
            </div>

            {/* Indicateurs de pagination */}
            <div className="flex gap-2 md:gap-3 mt-6 md:mt-8 lg:mt-10">
              {examplesData.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentExampleIndex(index)}
                  className={`w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-3.5 md:h-3.5 lg:w-4 lg:h-4 rounded-full transition-all duration-300 ${
                    index === currentExampleIndex 
                      ? 'bg-blue-500 scale-125' 
                      : 'bg-gray-600 hover:bg-gray-500'
                  }`}
                  aria-label={`Aller à l'exemple ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Flèche droite */}
          <button
            onClick={goToNextExample}
            className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-full border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-110 flex-shrink-0"
            aria-label="Exemple suivant"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8" />
          </button>
        </div>

        {/* Compteur */}
        <div className="text-center mt-4 md:mt-6 text-gray-400 text-sm md:text-base lg:text-lg">
          {currentExampleIndex + 1} / {examplesData.length}
        </div>
      </div>

      <div className="px-4 md:px-8">
        <PageNavigation currentChapter={3} currentPage={9} module="TAJWID" className="mt-6 mb-4" />
      </div>

      <footer className="border-t-1 text-white text-center p-4 md:p-6 flex-shrink-0 font-semibold text-sm md:text-base">
        <div>Chapitre 3 - Page 9 : Idghâm Shafawî</div>
        <div className="mt-1">© 2025 Tous droits réservés</div>
      </footer>
    </div>
  );
};

const Page9 = () => {
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
    ? "Leçon : Idghâm Shafawî (الإدغام الشفوي)"
    : "Exemples d'Idghâm Shafawî";

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

export default Page9;