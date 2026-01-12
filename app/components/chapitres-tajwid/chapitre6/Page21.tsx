'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Play, Pause, Volume2, Loader2, ChevronDown } from 'lucide-react';
import PageNavigation from '@/app/components/PageNavigation';

const HamsPage = () => {
  const letters = ['ه', 'ث', 'ح', 'ش', 'خ', 'ص', 'س', 'ك', 'ت', 'ف'];

  return (
    <div className="p-4 md:p-8 bg-gray-900">
      <div className="w-full bg-gray-800 rounded-lg p-6 md:p-8">
        <div className="text-white space-y-6 text-lg md:text-xl leading-relaxed">
          <h2 className="text-3xl font-bold text-blue-400 mb-4">Hams (الهمس) - Le Chuchotement</h2>
          
          <p>
            Le <span className="text-blue-400 font-semibold">Hams</span> signifie "chuchotement". 
            C'est une caractéristique des lettres prononcées avec un <span className="text-amber-400 font-semibold">souffle doux</span>, 
            sans vibration des cordes vocales.
          </p>
          
          <div className="bg-blue-900/30 border border-blue-500/50 rounded-lg p-4 md:p-6 my-6">
            <h3 className="text-xl font-bold text-blue-300 mb-4 text-center">Les 10 lettres du Hams</h3>
            <div className="flex justify-center gap-3 flex-wrap">
              {letters.map((letter, index) => (
                <div key={index} className="w-12 h-12 md:w-14 md:h-14 bg-blue-600 rounded-xl flex items-center justify-center text-2xl md:text-3xl text-white font-bold shadow-lg">
                  {letter}
                </div>
              ))}
            </div>
            <p className="text-center text-blue-300 mt-4 text-lg">
              فَحَثَّهُ شَخْصٌ سَكَتَ (Fahhathuhu shakhsun sakat)
            </p>
          </div>
          
          <div className="bg-teal-900/30 border border-teal-500/50 rounded-lg p-4">
            <p className="text-teal-300">
              💡 <span className="font-semibold">Opposé :</span> Le <span className="text-amber-300 font-semibold">Jahr (الجهر)</span> 
              est l'opposé du Hams - prononciation avec vibration des cordes vocales (19 autres lettres).
            </p>
          </div>
        </div>
      </div>
      
      <div className="px-4 md:px-8">
        <PageNavigation currentChapter={6} currentPage={21} module="TAJWID" className="mt-6 mb-4" />
      </div>

      <footer className="border-t-1 text-white text-center p-4 md:p-6 mt-8 flex-shrink-0 font-semibold text-base md:text-lg">
        <div>Chapitre 6 - Page 21</div>
        <div className="mt-1">© 2025 Tous droits réservés</div>
      </footer>
    </div>
  );
};

// Données des exemples - Hams (chuchotement)
const examplesHams = [
  { letter: 'ص', verse: 'الصَّالِحَاتِ', translation: 'Les bonnes œuvres', surah: 2, ayah: 25 },
  { letter: 'س', verse: 'فَاسْتَقِمْ', translation: 'Sois droit', surah: 11, ayah: 112 },
  { letter: 'ف', verse: 'الْفَتْحُ', translation: 'La victoire', surah: 110, ayah: 1 },
  { letter: 'ت', verse: 'تَبَارَكَ', translation: 'Béni soit', surah: 67, ayah: 1 },
  { letter: 'ك', verse: 'كَبِيرًا', translation: 'Grand', surah: 4, ayah: 48 },
  { letter: 'ش', verse: 'شَهِيدًا', translation: 'Témoin', surah: 4, ayah: 41 }
];

// Données des exemples - Jahr (voix forte)
const examplesJahr = [
  { letter: 'ب', verse: 'الْبَاطِلُ', translation: 'Le faux', surah: 17, ayah: 81 },
  { letter: 'ر', verse: 'الرَّحْمَٰنِ', translation: 'Le Tout Miséricordieux', surah: 1, ayah: 1 },
  { letter: 'ظ', verse: 'الظَّالِمِينَ', translation: 'Les injustes', surah: 2, ayah: 35 },
  { letter: 'ع', verse: 'الْعَظِيمُ', translation: "L'Immense", surah: 2, ayah: 255 },
  { letter: 'ق', verse: 'الْقُرْآنَ', translation: 'Le Coran', surah: 15, ayah: 1 },
  { letter: 'م', verse: 'الْمُؤْمِنِينَ', translation: 'Les croyants', surah: 9, ayah: 111 }
];

const reciters = [
  { id: 'abdul-basit', name: 'Abdoul Basit Abdous-Samad' },
  { id: 'ayman-suwaid', name: 'Ayman Souwayd' },
  { id: 'minshawi', name: 'Mohammad Siddiq Al-Minshawi' },
  { id: 'hudhaify', name: 'Ali Al-Houdhaïfi' },
  { id: 'sudais', name: 'Abdour-Rahman As-Soudaïs' },
  { id: 'afasy', name: 'Mishari Rachid Al-Afassy' },
];

const ReciterSelect = ({ selectedReciter, onReciterChange, color = 'blue' }: {
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
  const [currentHamsIndex, setCurrentHamsIndex] = useState(0);
  const [currentJahrIndex, setCurrentJahrIndex] = useState(0);

  const [recHams, setRecHams] = useState('abdul-basit');
  const [playHams, setPlayHams] = useState(false);
  const [loadHams, setLoadHams] = useState(false);
  const audioHamsRef = useRef<HTMLAudioElement | null>(null);

  const [recJahr, setRecJahr] = useState('abdul-basit');
  const [playJahr, setPlayJahr] = useState(false);
  const [loadJahr, setLoadJahr] = useState(false);
  const audioJahrRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => { if (audioHamsRef.current) { audioHamsRef.current.pause(); audioHamsRef.current = null; } setPlayHams(false); setLoadHams(false); }, [currentHamsIndex, recHams]);
  useEffect(() => { if (audioJahrRef.current) { audioJahrRef.current.pause(); audioJahrRef.current = null; } setPlayJahr(false); setLoadJahr(false); }, [currentJahrIndex, recJahr]);

  const toggleHams = () => {
    const ex = examplesHams[currentHamsIndex];
    if (playHams && audioHamsRef.current) { audioHamsRef.current.pause(); setPlayHams(false); return; }
    setLoadHams(true);
    const a = new Audio(`/api/quran/audio?reciterId=${recHams}&surah=${ex.surah}&ayah=${ex.ayah}`);
    audioHamsRef.current = a;
    a.oncanplaythrough = () => { setLoadHams(false); a.play(); setPlayHams(true); };
    a.onended = () => setPlayHams(false);
    a.onerror = () => { setLoadHams(false); setPlayHams(false); };
    a.load();
  };

  const toggleJahr = () => {
    const ex = examplesJahr[currentJahrIndex];
    if (playJahr && audioJahrRef.current) { audioJahrRef.current.pause(); setPlayJahr(false); return; }
    setLoadJahr(true);
    const a = new Audio(`/api/quran/audio?reciterId=${recJahr}&surah=${ex.surah}&ayah=${ex.ayah}`);
    audioJahrRef.current = a;
    a.oncanplaythrough = () => { setLoadJahr(false); a.play(); setPlayJahr(true); };
    a.onended = () => setPlayJahr(false);
    a.onerror = () => { setLoadJahr(false); setPlayJahr(false); };
    a.load();
  };

  const currentHamsExample = examplesHams[currentHamsIndex];
  const currentJahrExample = examplesJahr[currentJahrIndex];

  return (
    <div className="p-2 md:p-4 lg:p-8 bg-gray-900">
      
      {/* Slider Hams */}
      <div className="bg-blue-900/30 border border-blue-500/50 rounded-lg p-4 md:p-6 lg:p-8 mb-4">
        <h3 className="text-lg md:text-xl font-bold text-blue-400 mb-3 text-center">Hams (الهمس) - 10 lettres</h3>
        
        <div className="flex items-center justify-center gap-2 sm:gap-4 md:gap-6">
          <button
            onClick={() => setCurrentHamsIndex((prev) => (prev - 1 + examplesHams.length) % examplesHams.length)}
            className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-110 flex-shrink-0"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
          </button>

          <div className="flex-1 flex flex-col items-center justify-center min-h-[160px] sm:min-h-[180px] md:min-h-[200px] max-w-[500px]">
            <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-blue-400 mb-2">
              {currentHamsExample.letter}
            </div>
            <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-amber-300 font-bold leading-relaxed mb-2 text-center">
              {currentHamsExample.verse}
            </div>
            <div className="text-sm sm:text-base md:text-lg text-gray-300 italic">
              {currentHamsExample.translation}
            </div>
            <div className="flex items-center gap-2 mt-3">
              <button onClick={toggleHams} disabled={loadHams} className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-3 py-1 rounded-full text-xs">
                {loadHams ? <Loader2 className="w-4 h-4 animate-spin" /> : playHams ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{playHams ? 'Pause' : 'Écouter'}</span>
              </button>
              <ReciterSelect selectedReciter={recHams} onReciterChange={setRecHams} color="blue" />
            </div>
            <div className="text-[10px] text-gray-500 mt-1">S{currentHamsExample.surah}:V{currentHamsExample.ayah}</div>
            <div className="flex gap-2 mt-4">
              {examplesHams.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentHamsIndex(index)}
                  className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full transition-all ${
                    index === currentHamsIndex ? 'bg-blue-500 scale-125' : 'bg-gray-600'
                  }`}
                />
              ))}
            </div>
          </div>

          <button
            onClick={() => setCurrentHamsIndex((prev) => (prev + 1) % examplesHams.length)}
            className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-110 flex-shrink-0"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
          </button>
        </div>
      </div>

      {/* Slider Jahr */}
      <div className="bg-green-900/30 border border-green-500/50 rounded-lg p-4 md:p-6 lg:p-8 mb-6">
        <h3 className="text-lg md:text-xl font-bold text-green-400 mb-3 text-center">Jahr (الجهر) - 19 lettres</h3>
        
        <div className="flex items-center justify-center gap-2 sm:gap-4 md:gap-6">
          <button
            onClick={() => setCurrentJahrIndex((prev) => (prev - 1 + examplesJahr.length) % examplesJahr.length)}
            className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full border-2 border-green-500 text-green-500 hover:bg-green-500 hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-110 flex-shrink-0"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
          </button>

          <div className="flex-1 flex flex-col items-center justify-center min-h-[160px] sm:min-h-[180px] md:min-h-[200px] max-w-[500px]">
            <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-green-400 mb-2">
              {currentJahrExample.letter}
            </div>
            <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-amber-300 font-bold leading-relaxed mb-2 text-center">
              {currentJahrExample.verse}
            </div>
            <div className="text-sm sm:text-base md:text-lg text-gray-300 italic">
              {currentJahrExample.translation}
            </div>
            <div className="flex items-center gap-2 mt-3">
              <button onClick={toggleJahr} disabled={loadJahr} className="flex items-center gap-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-3 py-1 rounded-full text-xs">
                {loadJahr ? <Loader2 className="w-4 h-4 animate-spin" /> : playJahr ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{playJahr ? 'Pause' : 'Écouter'}</span>
              </button>
              <ReciterSelect selectedReciter={recJahr} onReciterChange={setRecJahr} color="green" />
            </div>
            <div className="text-[10px] text-gray-500 mt-1">S{currentJahrExample.surah}:V{currentJahrExample.ayah}</div>
            <div className="flex gap-2 mt-4">
              {examplesJahr.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentJahrIndex(index)}
                  className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full transition-all ${
                    index === currentJahrIndex ? 'bg-green-500 scale-125' : 'bg-gray-600'
                  }`}
                />
              ))}
            </div>
          </div>

          <button
            onClick={() => setCurrentJahrIndex((prev) => (prev + 1) % examplesJahr.length)}
            className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full border-2 border-green-500 text-green-500 hover:bg-green-500 hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-110 flex-shrink-0"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
          </button>
        </div>
      </div>

      <div className="px-4 md:px-8">
        <PageNavigation currentChapter={6} currentPage={21} module="TAJWID" className="mt-6 mb-4" />
      </div>

      <footer className="border-t-1 text-white text-center p-4 md:p-6 flex-shrink-0 font-semibold text-sm md:text-base">
        <div>Chapitre 6 - Page 21 : Hams & Jahr</div>
        <div className="mt-1">© 2025 Tous droits réservés</div>
      </footer>
    </div>
  );
};

const Page23 = () => {
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
    ? "Leçon : Hams (الهمس)"
    : "Exemples de Hams & Jahr";

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

        {currentPage === 0 && <HamsPage />}
        {currentPage === 1 && <ExamplesPage />}
      </div>
    </div>
  );
};

export default Page23;
