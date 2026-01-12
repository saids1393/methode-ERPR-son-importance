'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Play, Pause, Volume2, Loader2, ChevronDown } from 'lucide-react';
import PageNavigation from '@/app/components/PageNavigation';

const IntroductionPage = () => {
  return (
    <div className="p-4 md:p-8 bg-gray-900">
      <div className="w-full bg-gray-800 rounded-lg p-6 md:p-8">
        <div className="text-white space-y-6 text-lg md:text-xl leading-relaxed">
          <h2 className="text-3xl font-bold text-amber-400 mb-4">Idghâm (الإدغام) : Fusion du Son</h2>
          
          <p>
            L'Idghâm (الإدغام) signifie <span className="text-amber-400 font-semibold">"fusionner"</span>. C'est quand le Noon Sâkin ou le Tanwîn 
            <span className="text-purple-400 font-semibold"> fusionne avec la lettre suivante</span> pour former un seul son.
          </p>
          
          <p>
            L'Idghâm s'applique avec <span className="text-green-400 font-semibold">six lettres regroupées dans le mot : يَرْمَلُونَ</span>
          </p>
          
          <div className="text-center text-3xl text-purple-400 font-bold my-4">
            ي - ر - م - ل - و - ن
          </div>
          
          <p>
            Il existe deux types d'Idghâm :
          </p>
          <ul className="ml-4 space-y-2">
            <li>✓ <span className="text-purple-400 font-semibold">Idghâm avec Ghunna (غنة)</span> : devant ي، ن، م، و - nasalité conservée (2 temps)</li>
            <li>✓ <span className="text-blue-400 font-semibold">Idghâm sans Ghunna</span> : devant ل، ر - fusion totale sans nasalité</li>
          </ul>
          
          <div className="bg-amber-900/30 border border-amber-500/50 rounded-lg p-4 md:p-6 my-6">
            <p>
              💡 <span className="font-semibold">Règle importante :</span> L'Idghâm ne s'applique que si le Noon Sâkin/Tanwîn est à la fin d'un mot 
              et la lettre d'Idghâm au début du mot suivant. Si les deux sont dans le même mot, c'est Idh-hâr.
            </p>
          </div>
        </div>
      </div>
      
      <div className="px-4 md:px-8">
        <PageNavigation currentChapter={2} currentPage={4} module="TAJWID" className="mt-6 mb-4" />
      </div>

      <footer className="border-t-1 text-white text-center p-4 md:p-6 mt-8 flex-shrink-0 font-semibold text-base md:text-lg">
        <div>Chapitre 2 - Page 4</div>
        <div className="mt-1">© 2025 Tous droits réservés</div>
      </footer>
    </div>
  );
};

// Données des exemples pour le slider - Idghâm avec Ghunna
const examplesWithGhunna = [
  { 
    letter: 'ي', 
    verse: 'مَن يَقُولُ',
    translation: 'Celui qui dit',
    surah: 2,
    ayah: 8
  },
  { 
    letter: 'ن', 
    verse: 'مِن نِّعْمَةٍ',
    translation: 'De bienfait',
    surah: 16,
    ayah: 53
  },
  { 
    letter: 'م', 
    verse: 'مِن مَّالٍ',
    translation: 'De richesse',
    surah: 26,
    ayah: 88
  },
  { 
    letter: 'و', 
    verse: 'مِن وَلِيٍّ',
    translation: 'De protecteur',
    surah: 2,
    ayah: 107
  }
];

// Données des exemples pour le slider - Idghâm sans Ghunna
const examplesWithoutGhunna = [
  { 
    letter: 'ل', 
    verse: 'مِن لَّدُنْهُ',
    translation: 'De Sa part',
    surah: 18,
    ayah: 2
  },
  { 
    letter: 'ر', 
    verse: 'مِن رَّبِّهِمْ',
    translation: 'De leur Seigneur',
    surah: 2,
    ayah: 5
  }
];

// Liste des récitateurs disponibles
const reciters = [
  { id: 'abdul-basit', name: 'Abdoul Basit Abdous-Samad' },
  { id: 'ayman-suwaid', name: 'Ayman Souwayd' },
  { id: 'minshawi', name: 'Mohammad Siddiq Al-Minshawi' },
  { id: 'hudhaify', name: 'Ali Al-Houdhaïfi' },
  { id: 'sudais', name: 'Abdour-Rahman As-Soudaïs' },
  { id: 'afasy', name: 'Mishari Rachid Al-Afassy' },
];

// Composant Select personnalisé
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
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-2 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg border border-gray-600 transition-all duration-200"
      >
        <div className="flex flex-col items-start">
          <span className="text-sm md:text-base font-medium">{selectedReciter?.name || 'Choisir un récitateur'}</span>
        </div>
        <ChevronDown className={`w-5 h-5 flex-shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-gray-800 border border-gray-600 rounded-lg shadow-xl overflow-hidden">
          <div className="max-h-72 overflow-y-auto">
            {reciters.map((reciter) => (
              <button
                key={reciter.id}
                onClick={() => { onChange(reciter.id); setIsOpen(false); }}
                className={`w-full text-left px-4 py-3 transition-colors duration-150 ${selectedId === reciter.id ? 'bg-amber-500 text-gray-900' : 'text-gray-200 hover:bg-gray-700'}`}
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
  const [currentGhunnaIndex, setCurrentGhunnaIndex] = useState(0);
  const [currentNoGhunnaIndex, setCurrentNoGhunnaIndex] = useState(0);
  const [selectedReciterId, setSelectedReciterId] = useState<string>('afasy');
  const [isLoadingGhunna, setIsLoadingGhunna] = useState(false);
  const [isPlayingGhunna, setIsPlayingGhunna] = useState(false);
  const [isLoadingNoGhunna, setIsLoadingNoGhunna] = useState(false);
  const [isPlayingNoGhunna, setIsPlayingNoGhunna] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioGhunnaRef = useRef<HTMLAudioElement | null>(null);
  const audioNoGhunnaRef = useRef<HTMLAudioElement | null>(null);

  const currentGhunnaExample = examplesWithGhunna[currentGhunnaIndex];
  const currentNoGhunnaExample = examplesWithoutGhunna[currentNoGhunnaIndex];

  const getAudioUrl = (surah: number, ayah: number) => {
    return `/api/quran/audio?reciterId=${selectedReciterId}&surah=${surah}&ayah=${ayah}`;
  };

  useEffect(() => {
    if (audioGhunnaRef.current) {
      audioGhunnaRef.current.pause();
      audioGhunnaRef.current.currentTime = 0;
      setIsPlayingGhunna(false);
    }
  }, [selectedReciterId, currentGhunnaIndex]);

  useEffect(() => {
    if (audioNoGhunnaRef.current) {
      audioNoGhunnaRef.current.pause();
      audioNoGhunnaRef.current.currentTime = 0;
      setIsPlayingNoGhunna(false);
    }
  }, [selectedReciterId, currentNoGhunnaIndex]);

  useEffect(() => {
    return () => {
      if (audioGhunnaRef.current) { audioGhunnaRef.current.pause(); audioGhunnaRef.current = null; }
      if (audioNoGhunnaRef.current) { audioNoGhunnaRef.current.pause(); audioNoGhunnaRef.current = null; }
    };
  }, []);

  const togglePlayGhunna = async () => {
    setError(null);
    if (!audioGhunnaRef.current) {
      audioGhunnaRef.current = new Audio();
      audioGhunnaRef.current.addEventListener('ended', () => setIsPlayingGhunna(false));
      audioGhunnaRef.current.addEventListener('error', () => { setError('Impossible de lire l\'audio'); setIsPlayingGhunna(false); setIsLoadingGhunna(false); });
    }
    if (isPlayingGhunna) {
      audioGhunnaRef.current.pause();
      setIsPlayingGhunna(false);
    } else {
      try {
        setIsLoadingGhunna(true);
        audioGhunnaRef.current.src = getAudioUrl(currentGhunnaExample.surah, currentGhunnaExample.ayah);
        await audioGhunnaRef.current.play();
        setIsPlayingGhunna(true);
      } catch (err) { setError('Impossible de lire l\'audio'); }
      finally { setIsLoadingGhunna(false); }
    }
  };

  const togglePlayNoGhunna = async () => {
    setError(null);
    if (!audioNoGhunnaRef.current) {
      audioNoGhunnaRef.current = new Audio();
      audioNoGhunnaRef.current.addEventListener('ended', () => setIsPlayingNoGhunna(false));
      audioNoGhunnaRef.current.addEventListener('error', () => { setError('Impossible de lire l\'audio'); setIsPlayingNoGhunna(false); setIsLoadingNoGhunna(false); });
    }
    if (isPlayingNoGhunna) {
      audioNoGhunnaRef.current.pause();
      setIsPlayingNoGhunna(false);
    } else {
      try {
        setIsLoadingNoGhunna(true);
        audioNoGhunnaRef.current.src = getAudioUrl(currentNoGhunnaExample.surah, currentNoGhunnaExample.ayah);
        await audioNoGhunnaRef.current.play();
        setIsPlayingNoGhunna(true);
      } catch (err) { setError('Impossible de lire l\'audio'); }
      finally { setIsLoadingNoGhunna(false); }
    }
  };

  const goToNextGhunna = () => {
    setCurrentGhunnaIndex((prev) => (prev + 1) % examplesWithGhunna.length);
  };

  const goToPreviousGhunna = () => {
    setCurrentGhunnaIndex((prev) => (prev - 1 + examplesWithGhunna.length) % examplesWithGhunna.length);
  };

  const goToNextNoGhunna = () => {
    setCurrentNoGhunnaIndex((prev) => (prev + 1) % examplesWithoutGhunna.length);
  };

  const goToPreviousNoGhunna = () => {
    setCurrentNoGhunnaIndex((prev) => (prev - 1 + examplesWithoutGhunna.length) % examplesWithoutGhunna.length);
  };

  return (
    <div className="p-2 md:p-4 lg:p-8 bg-gray-900">
      
      {/* Slider Idghâm avec Ghunna */}
      <div className="bg-purple-900/30 border border-purple-500/50 rounded-lg p-4 md:p-6 lg:p-8 mb-6">
        <h3 className="text-xl md:text-2xl font-bold text-purple-400 mb-4 text-center">Idghâm avec Ghunna (إدغام بغنة)</h3>
        
        <div className="flex items-center justify-center gap-2 sm:gap-4 md:gap-6 lg:gap-8">
          {/* Flèche gauche */}
          <button
            onClick={goToPreviousGhunna}
            className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-full border-2 border-purple-500 text-purple-500 hover:bg-purple-500 hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-110 flex-shrink-0"
            aria-label="Exemple précédent"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8" />
          </button>

          {/* Contenu du slide */}
          <div className="flex-1 flex flex-col items-center justify-center min-h-[200px] sm:min-h-[240px] md:min-h-[280px] lg:min-h-[320px] max-w-[600px] md:max-w-[700px] lg:max-w-[800px]">
            {/* Lettre en haut */}
            <div className="text-center mb-4 md:mb-6 lg:mb-8">
              <div className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold text-purple-400">
                {currentGhunnaExample.letter}
              </div>
            </div>

            {/* Verset en grand */}
            <div className="text-center w-full px-2 sm:px-4">
              <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-amber-300 font-bold leading-relaxed mb-3 md:mb-4 lg:mb-6">
                {currentGhunnaExample.verse}
              </div>
              <div className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-300 italic mb-4">
                {currentGhunnaExample.translation}
              </div>
              
              <button
                onClick={togglePlayGhunna}
                disabled={isLoadingGhunna}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full mx-auto transition-all duration-300 ${
                  isPlayingGhunna ? 'bg-amber-500 text-gray-900 scale-105 shadow-lg shadow-amber-500/30' : 'bg-gray-700 text-amber-400 hover:bg-gray-600'
                } ${isLoadingGhunna ? 'opacity-50 cursor-wait' : 'hover:scale-105'}`}
              >
                {isLoadingGhunna ? <Loader2 className="w-5 h-5 animate-spin" /> : isPlayingGhunna ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                <Volume2 className="w-4 h-4" />
                <span className="text-sm font-medium">{isLoadingGhunna ? 'Chargement...' : isPlayingGhunna ? 'Pause' : 'Écouter'}</span>
              </button>
            </div>

            {/* Indicateurs de pagination */}
            <div className="flex gap-2 md:gap-3 mt-6 md:mt-8 lg:mt-10">
              {examplesWithGhunna.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentGhunnaIndex(index)}
                  className={`w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-3.5 md:h-3.5 lg:w-4 lg:h-4 rounded-full transition-all duration-300 ${
                    index === currentGhunnaIndex 
                      ? 'bg-purple-500 scale-125' 
                      : 'bg-gray-600 hover:bg-gray-500'
                  }`}
                  aria-label={`Aller à l'exemple ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Flèche droite */}
          <button
            onClick={goToNextGhunna}
            className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-full border-2 border-purple-500 text-purple-500 hover:bg-purple-500 hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-110 flex-shrink-0"
            aria-label="Exemple suivant"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8" />
          </button>
        </div>

        {/* Compteur */}
        <div className="text-center mt-4 md:mt-6 text-gray-400 text-sm md:text-base lg:text-lg">
          {currentGhunnaIndex + 1} / {examplesWithGhunna.length}
        </div>
      </div>

      {/* Slider Idghâm sans Ghunna */}
      <div className="bg-amber-900/30 border border-amber-500/50 rounded-lg p-4 md:p-6 lg:p-8 mb-6">
        <h3 className="text-xl md:text-2xl font-bold text-amber-400 mb-4 text-center">Idghâm sans Ghunna (إدغام بلا غنة)</h3>
        
        <div className="flex items-center justify-center gap-2 sm:gap-4 md:gap-6 lg:gap-8">
          {/* Flèche gauche */}
          <button
            onClick={goToPreviousNoGhunna}
            className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-full border-2 border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-110 flex-shrink-0"
            aria-label="Exemple précédent"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8" />
          </button>

          {/* Contenu du slide */}
          <div className="flex-1 flex flex-col items-center justify-center min-h-[200px] sm:min-h-[240px] md:min-h-[280px] lg:min-h-[320px] max-w-[600px] md:max-w-[700px] lg:max-w-[800px]">
            {/* Lettre en haut */}
            <div className="text-center mb-4 md:mb-6 lg:mb-8">
              <div className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold text-amber-400">
                {currentNoGhunnaExample.letter}
              </div>
            </div>

            {/* Verset en grand */}
            <div className="text-center w-full px-2 sm:px-4">
              <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-amber-300 font-bold leading-relaxed mb-3 md:mb-4 lg:mb-6">
                {currentNoGhunnaExample.verse}
              </div>
              <div className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-300 italic mb-4">
                {currentNoGhunnaExample.translation}
              </div>
              
              <button
                onClick={togglePlayNoGhunna}
                disabled={isLoadingNoGhunna}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full mx-auto transition-all duration-300 ${
                  isPlayingNoGhunna ? 'bg-amber-500 text-gray-900 scale-105 shadow-lg shadow-amber-500/30' : 'bg-gray-700 text-amber-400 hover:bg-gray-600'
                } ${isLoadingNoGhunna ? 'opacity-50 cursor-wait' : 'hover:scale-105'}`}
              >
                {isLoadingNoGhunna ? <Loader2 className="w-5 h-5 animate-spin" /> : isPlayingNoGhunna ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                <Volume2 className="w-4 h-4" />
                <span className="text-sm font-medium">{isLoadingNoGhunna ? 'Chargement...' : isPlayingNoGhunna ? 'Pause' : 'Écouter'}</span>
              </button>
            </div>

            {/* Indicateurs de pagination */}
            <div className="flex gap-2 md:gap-3 mt-6 md:mt-8 lg:mt-10">
              {examplesWithoutGhunna.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentNoGhunnaIndex(index)}
                  className={`w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-3.5 md:h-3.5 lg:w-4 lg:h-4 rounded-full transition-all duration-300 ${
                    index === currentNoGhunnaIndex 
                      ? 'bg-amber-500 scale-125' 
                      : 'bg-gray-600 hover:bg-gray-500'
                  }`}
                  aria-label={`Aller à l'exemple ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Flèche droite */}
          <button
            onClick={goToNextNoGhunna}
            className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-full border-2 border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-110 flex-shrink-0"
            aria-label="Exemple suivant"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8" />
          </button>
        </div>

        {/* Compteur */}
        <div className="text-center mt-4 md:mt-6 text-gray-400 text-sm md:text-base lg:text-lg">
          {currentNoGhunnaIndex + 1} / {examplesWithoutGhunna.length}
        </div>
      </div>

      {/* Sélecteur de récitateur */}
      <div className="bg-gray-800 rounded-lg p-4 md:p-6 mb-6">
        <p className="text-center text-gray-400 text-sm mb-3">Choisir un récitateur :</p>
        <ReciterSelect selectedId={selectedReciterId} onChange={setSelectedReciterId} />
        {error && <p className="text-red-400 text-sm mt-2 text-center">{error}</p>}
      </div>

      <div className="px-4 md:px-8">
        <PageNavigation currentChapter={2} currentPage={4} module="TAJWID" className="mt-6 mb-4" />
      </div>

      <footer className="border-t-1 text-white text-center p-4 md:p-6 flex-shrink-0 font-semibold text-sm md:text-base">
        <div>Chapitre 2 - Page 4 : Idghâm</div>
        <div className="mt-1">© 2025 Tous droits réservés</div>
      </footer>
    </div>
  );
};

const Page4 = () => {
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
    ? "Leçon : Idghâm (الإدغام)"
    : "Exemples d'Idghâm";

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
        {currentPage === 1 && <RulesPage />}
      </div>
    </div>
  );
};

export default Page4;