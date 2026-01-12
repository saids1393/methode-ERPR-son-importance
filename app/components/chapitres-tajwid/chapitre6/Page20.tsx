'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Play, Pause, Volume2, Loader2, ChevronDown } from 'lucide-react';
import PageNavigation from '@/app/components/PageNavigation';

const IntroductionPage = () => {
  return (
    <div className="p-4 md:p-8 bg-gray-900">
      <div className="w-full bg-gray-800 rounded-lg p-6 md:p-8">
        <div className="text-white space-y-6 text-lg md:text-xl leading-relaxed">
          <h2 className="text-3xl font-bold text-amber-400 mb-4">Qalqalah (القلقلة) - L'Écho</h2>
          
          <p>
            La <span className="text-amber-400 font-semibold">Qalqalah</span> signifie linguistiquement 
            "tremblement" ou "écho". C'est une <span className="text-teal-400 font-semibold">vibration sonore</span> 
            qui accompagne certaines lettres lorsqu'elles portent un sukûn.
          </p>
          
          <div className="bg-amber-900/30 border border-amber-500/50 rounded-lg p-4 md:p-6 my-6">
            <h3 className="text-xl font-bold text-amber-300 mb-4 text-center">Les 5 lettres de la Qalqalah</h3>
            <div className="flex justify-center gap-4 flex-wrap">
              {['ق', 'ط', 'ب', 'ج', 'د'].map((letter, index) => (
                <div key={index} className="w-16 h-16 md:w-20 md:h-20 bg-amber-600 rounded-xl flex items-center justify-center text-3xl md:text-4xl text-white font-bold shadow-lg">
                  {letter}
                </div>
              ))}
            </div>
            <p className="text-center text-amber-300 mt-4 text-lg">
              قُطُبُ جَدٍّ (Qutbu jadd)
            </p>
          </div>
          
          <div className="bg-teal-900/30 border border-teal-500/50 rounded-lg p-4 md:p-6 my-6">
            <p>
              💡 <span className="font-semibold">Astuce mnémotechnique :</span> Les lettres de Qalqalah sont regroupées 
              dans le mot <span className="text-amber-300 text-2xl font-bold">قُطُبُ جَدٍّ</span> qui signifie "le pôle d'un grand-père".
            </p>
          </div>
        </div>
      </div>
      
      <div className="px-4 md:px-8">
        <PageNavigation currentChapter={6} currentPage={20} module="TAJWID" className="mt-6 mb-4" />
      </div>

      <footer className="border-t-1 text-white text-center p-4 md:p-6 mt-8 flex-shrink-0 font-semibold text-base md:text-lg">
        <div>Chapitre 6 - Page 20</div>
        <div className="mt-1">© 2025 Tous droits réservés</div>
      </footer>
    </div>
  );
};

// Données des exemples - Qalqalah Sughrâ (petite)
const examplesSughra = [
  { letter: 'ق', verse: 'يَقْطَعُ', translation: 'Il coupe', surah: 2, ayah: 27 },
  { letter: 'ب', verse: 'أَبْوَابًا', translation: 'Des portes', surah: 39, ayah: 71 },
  { letter: 'ج', verse: 'يَجْعَلُ', translation: 'Il fait', surah: 6, ayah: 125 },
  { letter: 'د', verse: 'يَدْخُلُونَ', translation: 'Ils entrent', surah: 4, ayah: 124 }
];

// Données des exemples - Qalqalah Kubrâ (grande)
const examplesKubra = [
  { letter: 'ق', verse: 'الْفَلَقْ', translation: "L'aube naissante", surah: 113, ayah: 1 },
  { letter: 'د', verse: 'مَسَدْ', translation: 'Fibres', surah: 111, ayah: 5 },
  { letter: 'ج', verse: 'الْبُرُوجْ', translation: 'Les constellations', surah: 85, ayah: 1 },
  { letter: 'ب', verse: 'الْعَذَابْ', translation: 'Le châtiment', surah: 2, ayah: 7 }
];

// Données des exemples - Qalqalah Akbar (plus grande)
const examplesAkbar = [
  { letter: 'ق', verse: 'الْحَقّْ', translation: 'La vérité', surah: 69, ayah: 1 },
  { letter: 'ب', verse: 'تَبَّ', translation: 'Périssent', surah: 111, ayah: 1 }
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

const ExamplesPage = () => {
  const [currentSughraIndex, setCurrentSughraIndex] = useState(0);
  const [currentKubraIndex, setCurrentKubraIndex] = useState(0);
  const [currentAkbarIndex, setCurrentAkbarIndex] = useState(0);

  const [recSughra, setRecSughra] = useState('abdul-basit');
  const [playSughra, setPlaySughra] = useState(false);
  const [loadSughra, setLoadSughra] = useState(false);
  const audioSughraRef = useRef<HTMLAudioElement | null>(null);

  const [recKubra, setRecKubra] = useState('abdul-basit');
  const [playKubra, setPlayKubra] = useState(false);
  const [loadKubra, setLoadKubra] = useState(false);
  const audioKubraRef = useRef<HTMLAudioElement | null>(null);

  const [recAkbar, setRecAkbar] = useState('abdul-basit');
  const [playAkbar, setPlayAkbar] = useState(false);
  const [loadAkbar, setLoadAkbar] = useState(false);
  const audioAkbarRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => { if (audioSughraRef.current) { audioSughraRef.current.pause(); audioSughraRef.current = null; } setPlaySughra(false); setLoadSughra(false); }, [currentSughraIndex, recSughra]);
  useEffect(() => { if (audioKubraRef.current) { audioKubraRef.current.pause(); audioKubraRef.current = null; } setPlayKubra(false); setLoadKubra(false); }, [currentKubraIndex, recKubra]);
  useEffect(() => { if (audioAkbarRef.current) { audioAkbarRef.current.pause(); audioAkbarRef.current = null; } setPlayAkbar(false); setLoadAkbar(false); }, [currentAkbarIndex, recAkbar]);

  const toggleSughra = () => {
    const ex = examplesSughra[currentSughraIndex];
    if (playSughra && audioSughraRef.current) { audioSughraRef.current.pause(); setPlaySughra(false); return; }
    setLoadSughra(true);
    const a = new Audio(`/api/quran/audio?reciterId=${recSughra}&surah=${ex.surah}&ayah=${ex.ayah}`);
    audioSughraRef.current = a;
    a.oncanplaythrough = () => { setLoadSughra(false); a.play(); setPlaySughra(true); };
    a.onended = () => setPlaySughra(false);
    a.onerror = () => { setLoadSughra(false); setPlaySughra(false); };
    a.load();
  };

  const toggleKubra = () => {
    const ex = examplesKubra[currentKubraIndex];
    if (playKubra && audioKubraRef.current) { audioKubraRef.current.pause(); setPlayKubra(false); return; }
    setLoadKubra(true);
    const a = new Audio(`/api/quran/audio?reciterId=${recKubra}&surah=${ex.surah}&ayah=${ex.ayah}`);
    audioKubraRef.current = a;
    a.oncanplaythrough = () => { setLoadKubra(false); a.play(); setPlayKubra(true); };
    a.onended = () => setPlayKubra(false);
    a.onerror = () => { setLoadKubra(false); setPlayKubra(false); };
    a.load();
  };

  const toggleAkbar = () => {
    const ex = examplesAkbar[currentAkbarIndex];
    if (playAkbar && audioAkbarRef.current) { audioAkbarRef.current.pause(); setPlayAkbar(false); return; }
    setLoadAkbar(true);
    const a = new Audio(`/api/quran/audio?reciterId=${recAkbar}&surah=${ex.surah}&ayah=${ex.ayah}`);
    audioAkbarRef.current = a;
    a.oncanplaythrough = () => { setLoadAkbar(false); a.play(); setPlayAkbar(true); };
    a.onended = () => setPlayAkbar(false);
    a.onerror = () => { setLoadAkbar(false); setPlayAkbar(false); };
    a.load();
  };

  const currentSughraExample = examplesSughra[currentSughraIndex];
  const currentKubraExample = examplesKubra[currentKubraIndex];
  const currentAkbarExample = examplesAkbar[currentAkbarIndex];

  return (
    <div className="p-2 md:p-4 lg:p-6 bg-gray-900">
      
      {/* Slider Qalqalah Sughrâ */}
      <div className="bg-green-900/30 border border-green-500/50 rounded-lg p-3 md:p-4 lg:p-6 mb-3">
        <h3 className="text-base md:text-lg font-bold text-green-400 mb-2 text-center">Qalqalah Sughrâ (صغرى) - Légère</h3>
        
        <div className="flex items-center justify-center gap-2 sm:gap-3 md:gap-4">
          <button
            onClick={() => setCurrentSughraIndex((prev) => (prev - 1 + examplesSughra.length) % examplesSughra.length)}
            className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full border-2 border-green-500 text-green-500 hover:bg-green-500 hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-110 flex-shrink-0"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          <div className="flex-1 flex flex-col items-center justify-center min-h-[120px] sm:min-h-[140px] md:min-h-[160px] max-w-[400px]">
            <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-green-400 mb-1">
              {currentSughraExample.letter}
            </div>
            <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-amber-300 font-bold leading-relaxed mb-1 text-center">
              {currentSughraExample.verse}
            </div>
            <div className="text-xs sm:text-sm md:text-base text-gray-300 italic">
              {currentSughraExample.translation}
            </div>
            <div className="flex items-center gap-2 mt-2">
              <button onClick={toggleSughra} disabled={loadSughra} className="flex items-center gap-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-2 py-1 rounded-full text-[10px]">
                {loadSughra ? <Loader2 className="w-3 h-3 animate-spin" /> : playSughra ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                <span>{playSughra ? 'Pause' : 'Écouter'}</span>
              </button>
              <ReciterSelect selectedReciter={recSughra} onReciterChange={setRecSughra} color="green" />
            </div>
            <div className="text-[9px] text-gray-500 mt-1">S{currentSughraExample.surah}:V{currentSughraExample.ayah}</div>
            <div className="flex gap-1.5 mt-2">
              {examplesSughra.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSughraIndex(index)}
                  className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all ${
                    index === currentSughraIndex ? 'bg-green-500 scale-125' : 'bg-gray-600'
                  }`}
                />
              ))}
            </div>
          </div>

          <button
            onClick={() => setCurrentSughraIndex((prev) => (prev + 1) % examplesSughra.length)}
            className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full border-2 border-green-500 text-green-500 hover:bg-green-500 hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-110 flex-shrink-0"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>

      {/* Slider Qalqalah Kubrâ */}
      <div className="bg-amber-900/30 border border-amber-500/50 rounded-lg p-3 md:p-4 lg:p-6 mb-3">
        <h3 className="text-base md:text-lg font-bold text-amber-400 mb-2 text-center">Qalqalah Kubrâ (كبرى) - Prononcée</h3>
        
        <div className="flex items-center justify-center gap-2 sm:gap-3 md:gap-4">
          <button
            onClick={() => setCurrentKubraIndex((prev) => (prev - 1 + examplesKubra.length) % examplesKubra.length)}
            className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full border-2 border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-110 flex-shrink-0"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          <div className="flex-1 flex flex-col items-center justify-center min-h-[120px] sm:min-h-[140px] md:min-h-[160px] max-w-[400px]">
            <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-amber-400 mb-1">
              {currentKubraExample.letter}
            </div>
            <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-amber-300 font-bold leading-relaxed mb-1 text-center">
              {currentKubraExample.verse}
            </div>
            <div className="text-xs sm:text-sm md:text-base text-gray-300 italic">
              {currentKubraExample.translation}
            </div>
            <div className="flex items-center gap-2 mt-2">
              <button onClick={toggleKubra} disabled={loadKubra} className="flex items-center gap-1 bg-amber-600 hover:bg-amber-700 disabled:bg-gray-600 text-white px-2 py-1 rounded-full text-[10px]">
                {loadKubra ? <Loader2 className="w-3 h-3 animate-spin" /> : playKubra ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                <span>{playKubra ? 'Pause' : 'Écouter'}</span>
              </button>
              <ReciterSelect selectedReciter={recKubra} onReciterChange={setRecKubra} color="amber" />
            </div>
            <div className="text-[9px] text-gray-500 mt-1">S{currentKubraExample.surah}:V{currentKubraExample.ayah}</div>
            <div className="flex gap-1.5 mt-2">
              {examplesKubra.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentKubraIndex(index)}
                  className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all ${
                    index === currentKubraIndex ? 'bg-amber-500 scale-125' : 'bg-gray-600'
                  }`}
                />
              ))}
            </div>
          </div>

          <button
            onClick={() => setCurrentKubraIndex((prev) => (prev + 1) % examplesKubra.length)}
            className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full border-2 border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-110 flex-shrink-0"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>

      {/* Slider Qalqalah Akbar */}
      <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-3 md:p-4 lg:p-6 mb-6">
        <h3 className="text-base md:text-lg font-bold text-red-400 mb-2 text-center">Qalqalah Akbar (أكبر) - La plus forte</h3>
        
        <div className="flex items-center justify-center gap-2 sm:gap-3 md:gap-4">
          <button
            onClick={() => setCurrentAkbarIndex((prev) => (prev - 1 + examplesAkbar.length) % examplesAkbar.length)}
            className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-110 flex-shrink-0"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          <div className="flex-1 flex flex-col items-center justify-center min-h-[120px] sm:min-h-[140px] md:min-h-[160px] max-w-[400px]">
            <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-red-400 mb-1">
              {currentAkbarExample.letter}
            </div>
            <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-amber-300 font-bold leading-relaxed mb-1 text-center">
              {currentAkbarExample.verse}
            </div>
            <div className="text-xs sm:text-sm md:text-base text-gray-300 italic">
              {currentAkbarExample.translation}
            </div>
            <div className="flex items-center gap-2 mt-2">
              <button onClick={toggleAkbar} disabled={loadAkbar} className="flex items-center gap-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white px-2 py-1 rounded-full text-[10px]">
                {loadAkbar ? <Loader2 className="w-3 h-3 animate-spin" /> : playAkbar ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                <span>{playAkbar ? 'Pause' : 'Écouter'}</span>
              </button>
              <ReciterSelect selectedReciter={recAkbar} onReciterChange={setRecAkbar} color="red" />
            </div>
            <div className="text-[9px] text-gray-500 mt-1">S{currentAkbarExample.surah}:V{currentAkbarExample.ayah}</div>
            <div className="flex gap-1.5 mt-2">
              {examplesAkbar.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentAkbarIndex(index)}
                  className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all ${
                    index === currentAkbarIndex ? 'bg-red-500 scale-125' : 'bg-gray-600'
                  }`}
                />
              ))}
            </div>
          </div>

          <button
            onClick={() => setCurrentAkbarIndex((prev) => (prev + 1) % examplesAkbar.length)}
            className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-110 flex-shrink-0"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>

      <div className="px-4 md:px-8">
        <PageNavigation currentChapter={6} currentPage={20} module="TAJWID" className="mt-4 mb-4" />
      </div>

      <footer className="border-t-1 text-white text-center p-4 md:p-6 flex-shrink-0 font-semibold text-sm md:text-base">
        <div>Chapitre 6 - Page 20 : La Qalqalah</div>
        <div className="mt-1">© 2025 Tous droits réservés</div>
      </footer>
    </div>
  );
};

const Page22 = () => {
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
    ? "Leçon : La Qalqalah (القلقلة)"
    : "Exemples de Qalqalah";

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
        {currentPage === 1 && <ExamplesPage />}
      </div>
    </div>
  );
};

export default Page22;
