// app/components/chapitres-tajwid/chapitre2/Page3.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Play, Pause, Volume2, Loader2, ChevronDown } from 'lucide-react';
import PageNavigation from '@/app/components/PageNavigation';

const IntroductionPage = () => {
  return (
    <div className="p-4 md:p-8 bg-gray-900">
      <div className="w-full bg-gray-800 rounded-lg p-6 md:p-8">
        <div className="text-white space-y-6 text-lg md:text-xl leading-relaxed">
          <h2 className="text-3xl font-bold text-red-400 mb-4">Idh-hâr (الإظهار) : Prononciation Claire</h2>
          
          <p>
            L'Idh-hâr (الإظهار) signifie <span className="text-red-400 font-semibold">"prononcer clairement"</span>. C'est la première règle du Noon Sâkin et du Tanwîn : 
            le Noon Sâkin ou le Tanwîn doit être prononcé de manière claire et distincte avant certaines lettres.
          </p>
          
          <p>
            L'Idh-hâr s'applique devant <span className="text-amber-400 font-semibold">six lettres de la gorge (حروف الحلق)</span> : 
          </p>
          
          <div className="text-center text-3xl text-purple-400 font-bold my-4">
            ء - ه - ع - ح - غ - خ
          </div>
          
          <p>
            Dans ce cas, le Noon ou le Tanwîn conserve sa prononciation complète et claire sans aucune fusion ou modification. 
            Il y a une légère séparation entre le Noon/Tanwîn et la lettre suivante.
          </p>
          
          <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-4 md:p-6 my-6">
            <p>
              💡 <span className="font-semibold">Point Important :</span> L'Idh-hâr signifie que vous prononcez le Noon ou le Tanwîn complètement, 
              puis la lettre de la gorge de manière claire et distincte.
            </p>
          </div>
          
          <p>
            Moyen mnémotechnique pour retenir les 6 lettres : <span className="text-amber-400 font-bold">أخي هاك علماً حازه غير خاسر</span>
          </p>
        </div>
      </div>
      
      <div className="px-4 md:px-8">
        <PageNavigation currentChapter={2} currentPage={3} module="TAJWID" className="mt-6 mb-4" />
      </div>

      <footer className="border-t-1 text-white text-center p-4 md:p-6 mt-8 flex-shrink-0 font-semibold text-base md:text-lg">
        <div>Chapitre 2 - Page 3</div>
        <div className="mt-1">© 2025 Tous droits réservés</div>
      </footer>
    </div>
  );
};

// Données des exemples
const examplesData = [
  { 
    letter: 'ء', 
    verse: 'مَنْ آمَنَ',
    translation: 'Celui qui a cru',
    surah: 2,
    ayah: 62
  },
  { 
    letter: 'ه', 
    verse: 'مِنْ هَادٍ',
    translation: 'De guide',
    surah: 13,
    ayah: 33
  },
  { 
    letter: 'ع', 
    verse: 'مِنْ عِلْمٍ',
    translation: 'De science',
    surah: 53,
    ayah: 28
  },
  { 
    letter: 'ح', 
    verse: 'مَنْ حَادَّ',
    translation: 'Celui qui s\'oppose',
    surah: 58,
    ayah: 22
  },
  { 
    letter: 'غ', 
    verse: 'مِنْ غَفُورٍ',
    translation: 'Le Pardonneur',
    surah: 41,
    ayah: 32
  },
  { 
    letter: 'خ', 
    verse: 'مِنْ خَيْرٍ',
    translation: 'De bien',
    surah: 2,
    ayah: 197
  }
];

// Liste des récitateurs disponibles sur everyayah.com
const reciters = [
  { id: 'abdul-basit', name: 'Abdoul Basit Abdous-Samad' },
  { id: 'ayman-suwaid', name: 'Ayman Souwayd' },
  { id: 'minshawi', name: 'Mohammad Siddiq Al-Minshawi' },
  { id: 'hudhaify', name: 'Ali Al-Houdhaïfi' },
  { id: 'sudais', name: 'Abdour-Rahman As-Soudaïs' },
  { id: 'afasy', name: 'Mishari Rachid Al-Afassy' },
];

// Composant Select personnalisé et responsive
interface ReciterSelectProps {
  selectedId: string;
  onChange: (id: string) => void;
}

const ReciterSelect: React.FC<ReciterSelectProps> = ({ selectedId, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  const selectedReciter = reciters.find(r => r.id === selectedId);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={selectRef} className="relative w-full max-w-sm mx-auto">
      {/* Bouton du select */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-2 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg border border-gray-600 transition-all duration-200"
      >
        <span className="text-sm md:text-base font-medium">
          {selectedReciter?.name || 'Choisir un récitateur'}
        </span>
        <ChevronDown 
          className={`w-5 h-5 flex-shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {/* Menu déroulant */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-gray-800 border border-gray-600 rounded-lg shadow-xl overflow-hidden">
          <div className="max-h-72 overflow-y-auto">
            {reciters.map((reciter) => (
              <button
                key={reciter.id}
                onClick={() => {
                  onChange(reciter.id);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-3 transition-colors duration-150 ${
                  selectedId === reciter.id
                    ? 'bg-amber-500 text-gray-900'
                    : 'text-gray-200 hover:bg-gray-700'
                }`}
              >
                <div className="font-medium text-sm md:text-base">{reciter.name}</div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const RulesPage = () => {
  const [currentExampleIndex, setCurrentExampleIndex] = useState(0);
  const [selectedReciterId, setSelectedReciterId] = useState<string>('afasy');
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentExample = examplesData[currentExampleIndex];

  const getAudioUrl = () => {
    return `/api/quran/audio?reciterId=${selectedReciterId}&surah=${currentExample.surah}&ayah=${currentExample.ayah}`;
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  }, [selectedReciterId, currentExampleIndex]);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const togglePlay = async () => {
    setError(null);

    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.addEventListener('ended', () => setIsPlaying(false));
      audioRef.current.addEventListener('error', () => {
        setError('Impossible de lire l\'audio');
        setIsPlaying(false);
        setIsLoading(false);
      });
    }

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      try {
        setIsLoading(true);
        audioRef.current.src = getAudioUrl();
        await audioRef.current.play();
        setIsPlaying(true);
      } catch (err: any) {
        console.error('Erreur lecture audio:', err);
        setError('Impossible de lire l\'audio');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const goToNextExample = () => {
    setCurrentExampleIndex((prev) => (prev + 1) % examplesData.length);
  };

  const goToPreviousExample = () => {
    setCurrentExampleIndex((prev) => (prev - 1 + examplesData.length) % examplesData.length);
  };

  return (
    <div className="p-2 md:p-4 lg:p-8 bg-gray-900">
      <div className="bg-gray-800 rounded-lg p-4 md:p-6 lg:p-8 mb-6">
        
        <div className="flex items-center justify-center gap-2 sm:gap-4 md:gap-6 lg:gap-8">
          <button
            onClick={goToPreviousExample}
            className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-full border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-110 flex-shrink-0"
            aria-label="Exemple précédent"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8" />
          </button>

          <div className="flex-1 flex flex-col items-center justify-center min-h-[280px] sm:min-h-[320px] md:min-h-[380px] lg:min-h-[420px] max-w-[600px] md:max-w-[700px] lg:max-w-[800px]">
            <div className="text-center mb-4 md:mb-6 lg:mb-8">
              <div className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold text-red-400">
                {currentExample.letter}
              </div>
            </div>

            <div className="text-center w-full px-2 sm:px-4">
              <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-amber-300 font-bold leading-relaxed mb-3 md:mb-4 lg:mb-6">
                {currentExample.verse}
              </div>
              <div className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-300 italic mb-4">
                {currentExample.translation}
              </div>
              
              <button
                onClick={togglePlay}
                disabled={isLoading}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full mx-auto transition-all duration-300 ${
                  isPlaying
                    ? 'bg-amber-500 text-gray-900 scale-105 shadow-lg shadow-amber-500/30'
                    : 'bg-gray-700 text-amber-400 hover:bg-gray-600'
                } ${isLoading ? 'opacity-50 cursor-wait' : 'hover:scale-105'}`}
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : isPlaying ? (
                  <Pause className="w-5 h-5" />
                ) : (
                  <Play className="w-5 h-5" />
                )}
                <Volume2 className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {isLoading ? 'Chargement...' : isPlaying ? 'Pause' : 'Écouter'}
                </span>
              </button>
              
              {error && (
                <p className="text-red-400 text-sm mt-2">{error}</p>
              )}
            </div>

            <div className="flex gap-2 md:gap-3 mt-6 md:mt-8 lg:mt-10">
              {examplesData.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentExampleIndex(index)}
                  className={`w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-3.5 md:h-3.5 lg:w-4 lg:h-4 rounded-full transition-all duration-300 ${
                    index === currentExampleIndex 
                      ? 'bg-red-500 scale-125' 
                      : 'bg-gray-600 hover:bg-gray-500'
                  }`}
                  aria-label={`Aller à l'exemple ${index + 1}`}
                />
              ))}
            </div>
          </div>

          <button
            onClick={goToNextExample}
            className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-full border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-110 flex-shrink-0"
            aria-label="Exemple suivant"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8" />
          </button>
        </div>

        <div className="text-center mt-4 md:mt-6 text-gray-400 text-sm md:text-base lg:text-lg">
          {currentExampleIndex + 1} / {examplesData.length}
        </div>

        <div className="mt-6 pt-4 border-t border-gray-700">
          <p className="text-center text-gray-400 text-sm mb-3">Choisir un récitateur :</p>
          <ReciterSelect
            selectedId={selectedReciterId}
            onChange={setSelectedReciterId}
          />
        </div>
      </div>

      <div className="px-4 md:px-8">
        <PageNavigation currentChapter={2} currentPage={3} module="TAJWID" className="mt-6 mb-4" />
      </div>

      <footer className="border-t-1 text-white text-center p-4 md:p-6 flex-shrink-0 font-semibold text-sm md:text-base">
        <div>Chapitre 2 - Page 3 : Idh-hâr</div>
        <div className="mt-1">© 2025 Tous droits réservés</div>
      </footer>
    </div>
  );
};

const Page3 = () => {
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
    ? "Leçon : Idh-hâr (الإظهار)"
    : "Exemples d'Idh-hâr";

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

        {currentPage === 0 && <IntroductionPage />}
        {currentPage === 1 && <RulesPage />}
      </div>
    </div>
  );
};

export default Page3;