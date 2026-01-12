'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Play, Pause, Volume2, Loader2, ChevronDown } from 'lucide-react';
import PageNavigation from '@/app/components/PageNavigation';

const IntroductionPage = () => {
  return (
    <div className="p-4 md:p-8 bg-gray-900">
      <div className="w-full bg-gray-800 rounded-lg p-6 md:p-8">
        <div className="text-white space-y-6 text-lg md:text-xl leading-relaxed">
          <h2 className="text-3xl font-bold text-blue-400 mb-4">La Lettre Râ' (ر) - Tafkhîm et Tarqîq</h2>

          <p>
            La lettre <span className="text-blue-300 font-semibold text-3xl">ر</span> (Râ') est une lettre spéciale en Tajwid
            car elle peut être prononcée de deux façons selon le contexte :
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
            <div className="bg-amber-900/30 border border-amber-500/50 rounded-lg p-4">
              <h3 className="text-amber-400 font-bold text-xl mb-2">Tafkhîm (تفخيم)</h3>
              <p className="text-gray-300">Râ' <span className="font-semibold text-amber-300">épaisse</span> - son plein et rond</p>
              <p className="text-sm text-gray-400 mt-2">Avec fat-ha (رَ) ou damma (رُ)</p>
            </div>

            <div className="bg-blue-900/30 border border-blue-500/50 rounded-lg p-4">
              <h3 className="text-blue-400 font-bold text-xl mb-2">Tarqîq (ترقيق)</h3>
              <p className="text-gray-300">Râ' <span className="font-semibold text-blue-300">fine</span> - son léger</p>
              <p className="text-sm text-gray-400 mt-2">Avec kasra (رِ)</p>
            </div>
          </div>

          <div className="bg-teal-900/30 border border-teal-500/50 rounded-lg p-4">
            <p className="text-teal-300">
              💡 <span className="font-semibold">Note :</span> La Râ' sâkina (رْ) dépend du contexte - 
              elle peut être épaisse ou fine selon les lettres qui l'entourent.
            </p>
          </div>
        </div>
      </div>

      <div className="px-4 md:px-8">
        <PageNavigation currentChapter={7} currentPage={25} module="TAJWID" className="mt-6 mb-4" />
      </div>

      <footer className="border-t-1 text-white text-center p-4 md:p-6 mt-8 flex-shrink-0 font-semibold text-base md:text-lg">
        <div>Chapitre 7 - Page 25</div>
        <div className="mt-1">© 2025 Tous droits réservés</div>
      </footer>
    </div>
  );
};

// Données des exemples - Râ' Tafkhîm (épaisse)
const examplesTafkhim = [
  { 
    letter: 'رَ', 
    verse: 'رَحْمَة',
    translation: 'Miséricorde',
    surah: 2,
    ayah: 218
  },
  { 
    letter: 'رُ', 
    verse: 'رُزِقَ',
    translation: 'Pourvu',
    surah: 2,
    ayah: 25
  },
  { 
    letter: 'رَ', 
    verse: 'الرَّحْمَٰنِ',
    translation: 'Le Tout Miséricordieux',
    surah: 1,
    ayah: 1
  },
  { 
    letter: 'رُ', 
    verse: 'رُسُلٌ',
    translation: 'Messagers',
    surah: 2,
    ayah: 252
  },
  { 
    letter: 'رَ', 
    verse: 'رَبِّ',
    translation: 'Seigneur',
    surah: 1,
    ayah: 2
  }
];

// Données des exemples - Râ' Tarqîq (fine)
const examplesTarqiq = [
  { 
    letter: 'رِ', 
    verse: 'رِجَالٌ',
    translation: 'Hommes',
    surah: 24,
    ayah: 37
  },
  { 
    letter: 'رِ', 
    verse: 'رِزْقًا',
    translation: 'Subsistance',
    surah: 2,
    ayah: 3
  },
  { 
    letter: 'رِ', 
    verse: 'الذِّكْرِ',
    translation: 'Le rappel',
    surah: 15,
    ayah: 9
  },
  { 
    letter: 'رِ', 
    verse: 'بَصِيرٌ',
    translation: 'Clairvoyant',
    surah: 2,
    ayah: 96
  }
];

// Données des exemples - Râ' Sâkina (selon contexte)
const examplesSakina = [
  { 
    letter: 'رْ', 
    verse: 'فِرْعَوْن',
    translation: 'Pharaon (Tafkhîm)',
    color: 'amber',
    surah: 2,
    ayah: 49
  },
  { 
    letter: 'رْ', 
    verse: 'مِرْفَق',
    translation: 'Coude (Tafkhîm)',
    color: 'amber',
    surah: 18,
    ayah: 16
  },
  { 
    letter: 'رْ', 
    verse: 'فِرْدَوْس',
    translation: 'Paradis (Tarqîq)',
    color: 'blue',
    surah: 18,
    ayah: 107
  },
  { 
    letter: 'رْ', 
    verse: 'قِرْطَاس',
    translation: 'Parchemin (Tarqîq)',
    color: 'blue',
    surah: 6,
    ayah: 7
  }
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
  const [currentTafkhimIndex, setCurrentTafkhimIndex] = useState(0);
  const [currentTarqiqIndex, setCurrentTarqiqIndex] = useState(0);
  const [currentSakinaIndex, setCurrentSakinaIndex] = useState(0);

  // Audio states for Tafkhim
  const [recTafkhim, setRecTafkhim] = useState('abdul-basit');
  const [playTafkhim, setPlayTafkhim] = useState(false);
  const [loadTafkhim, setLoadTafkhim] = useState(false);
  const audioTafkhimRef = useRef<HTMLAudioElement | null>(null);

  // Audio states for Tarqiq
  const [recTarqiq, setRecTarqiq] = useState('abdul-basit');
  const [playTarqiq, setPlayTarqiq] = useState(false);
  const [loadTarqiq, setLoadTarqiq] = useState(false);
  const audioTarqiqRef = useRef<HTMLAudioElement | null>(null);

  // Audio states for Sakina
  const [recSakina, setRecSakina] = useState('abdul-basit');
  const [playSakina, setPlaySakina] = useState(false);
  const [loadSakina, setLoadSakina] = useState(false);
  const audioSakinaRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => { if (audioTafkhimRef.current) { audioTafkhimRef.current.pause(); audioTafkhimRef.current = null; } setPlayTafkhim(false); setLoadTafkhim(false); }, [currentTafkhimIndex, recTafkhim]);
  useEffect(() => { if (audioTarqiqRef.current) { audioTarqiqRef.current.pause(); audioTarqiqRef.current = null; } setPlayTarqiq(false); setLoadTarqiq(false); }, [currentTarqiqIndex, recTarqiq]);
  useEffect(() => { if (audioSakinaRef.current) { audioSakinaRef.current.pause(); audioSakinaRef.current = null; } setPlaySakina(false); setLoadSakina(false); }, [currentSakinaIndex, recSakina]);

  const toggleTafkhim = () => {
    const ex = examplesTafkhim[currentTafkhimIndex];
    if (playTafkhim && audioTafkhimRef.current) { audioTafkhimRef.current.pause(); setPlayTafkhim(false); return; }
    setLoadTafkhim(true);
    const a = new Audio(`/api/quran/audio?reciterId=${recTafkhim}&surah=${ex.surah}&ayah=${ex.ayah}`);
    audioTafkhimRef.current = a;
    a.oncanplaythrough = () => { setLoadTafkhim(false); a.play(); setPlayTafkhim(true); };
    a.onended = () => setPlayTafkhim(false);
    a.onerror = () => { setLoadTafkhim(false); setPlayTafkhim(false); };
    a.load();
  };

  const toggleTarqiq = () => {
    const ex = examplesTarqiq[currentTarqiqIndex];
    if (playTarqiq && audioTarqiqRef.current) { audioTarqiqRef.current.pause(); setPlayTarqiq(false); return; }
    setLoadTarqiq(true);
    const a = new Audio(`/api/quran/audio?reciterId=${recTarqiq}&surah=${ex.surah}&ayah=${ex.ayah}`);
    audioTarqiqRef.current = a;
    a.oncanplaythrough = () => { setLoadTarqiq(false); a.play(); setPlayTarqiq(true); };
    a.onended = () => setPlayTarqiq(false);
    a.onerror = () => { setLoadTarqiq(false); setPlayTarqiq(false); };
    a.load();
  };

  const toggleSakina = () => {
    const ex = examplesSakina[currentSakinaIndex];
    if (playSakina && audioSakinaRef.current) { audioSakinaRef.current.pause(); setPlaySakina(false); return; }
    setLoadSakina(true);
    const a = new Audio(`/api/quran/audio?reciterId=${recSakina}&surah=${ex.surah}&ayah=${ex.ayah}`);
    audioSakinaRef.current = a;
    a.oncanplaythrough = () => { setLoadSakina(false); a.play(); setPlaySakina(true); };
    a.onended = () => setPlaySakina(false);
    a.onerror = () => { setLoadSakina(false); setPlaySakina(false); };
    a.load();
  };

  const currentTafkhimExample = examplesTafkhim[currentTafkhimIndex];
  const currentTarqiqExample = examplesTarqiq[currentTarqiqIndex];
  const currentSakinaExample = examplesSakina[currentSakinaIndex];

  const getColorClasses = (color: string) => {
    switch(color) {
      case 'amber': return { border: 'border-amber-500', text: 'text-amber-400', bg: 'bg-amber-900/30', hover: 'hover:bg-amber-500' };
      case 'blue': return { border: 'border-blue-500', text: 'text-blue-400', bg: 'bg-blue-900/30', hover: 'hover:bg-blue-500' };
      default: return { border: 'border-purple-500', text: 'text-purple-400', bg: 'bg-purple-900/30', hover: 'hover:bg-purple-500' };
    }
  };

  const sakinaColors = getColorClasses(currentSakinaExample.color);

  return (
    <div className="p-2 md:p-4 lg:p-6 bg-gray-900">
      
      {/* Slider Râ' Tafkhîm */}
      <div className="bg-amber-900/30 border border-amber-500/50 rounded-lg p-3 md:p-4 lg:p-6 mb-3">
        <h3 className="text-base md:text-lg font-bold text-amber-400 mb-2 text-center">Râ' Tafkhîm (épaisse) - رَ / رُ</h3>
        
        <div className="flex items-center justify-center gap-2 sm:gap-3 md:gap-4">
          <button
            onClick={() => setCurrentTafkhimIndex((prev) => (prev - 1 + examplesTafkhim.length) % examplesTafkhim.length)}
            className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full border-2 border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-110 flex-shrink-0"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          <div className="flex-1 flex flex-col items-center justify-center min-h-[120px] sm:min-h-[140px] md:min-h-[160px] max-w-[400px]">
            <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-amber-400 mb-1">
              {currentTafkhimExample.letter}
            </div>
            <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-amber-300 font-bold leading-relaxed mb-1 text-center">
              {currentTafkhimExample.verse}
            </div>
            <div className="text-xs sm:text-sm md:text-base text-gray-300 italic">
              {currentTafkhimExample.translation}
            </div>
            <div className="flex items-center gap-2 mt-2">
              <button onClick={toggleTafkhim} disabled={loadTafkhim} className="flex items-center gap-1 bg-amber-600 hover:bg-amber-700 disabled:bg-gray-600 text-white px-2 py-1 rounded-full text-[10px]">
                {loadTafkhim ? <Loader2 className="w-3 h-3 animate-spin" /> : playTafkhim ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                <span>{playTafkhim ? 'Pause' : 'Écouter'}</span>
              </button>
              <ReciterSelect selectedReciter={recTafkhim} onReciterChange={setRecTafkhim} color="amber" />
            </div>
            <div className="text-[9px] text-gray-500 mt-1">S{currentTafkhimExample.surah}:V{currentTafkhimExample.ayah}</div>
            <div className="flex gap-1.5 mt-2">
              {examplesTafkhim.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTafkhimIndex(index)}
                  className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all ${
                    index === currentTafkhimIndex ? 'bg-amber-500 scale-125' : 'bg-gray-600'
                  }`}
                />
              ))}
            </div>
          </div>

          <button
            onClick={() => setCurrentTafkhimIndex((prev) => (prev + 1) % examplesTafkhim.length)}
            className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full border-2 border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-110 flex-shrink-0"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>

      {/* Slider Râ' Tarqîq */}
      <div className="bg-blue-900/30 border border-blue-500/50 rounded-lg p-3 md:p-4 lg:p-6 mb-3">
        <h3 className="text-base md:text-lg font-bold text-blue-400 mb-2 text-center">Râ' Tarqîq (fine) - رِ</h3>
        
        <div className="flex items-center justify-center gap-2 sm:gap-3 md:gap-4">
          <button
            onClick={() => setCurrentTarqiqIndex((prev) => (prev - 1 + examplesTarqiq.length) % examplesTarqiq.length)}
            className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-110 flex-shrink-0"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          <div className="flex-1 flex flex-col items-center justify-center min-h-[120px] sm:min-h-[140px] md:min-h-[160px] max-w-[400px]">
            <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-blue-400 mb-1">
              {currentTarqiqExample.letter}
            </div>
            <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-amber-300 font-bold leading-relaxed mb-1 text-center">
              {currentTarqiqExample.verse}
            </div>
            <div className="text-xs sm:text-sm md:text-base text-gray-300 italic">
              {currentTarqiqExample.translation}
            </div>
            <div className="flex items-center gap-2 mt-2">
              <button onClick={toggleTarqiq} disabled={loadTarqiq} className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-2 py-1 rounded-full text-[10px]">
                {loadTarqiq ? <Loader2 className="w-3 h-3 animate-spin" /> : playTarqiq ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                <span>{playTarqiq ? 'Pause' : 'Écouter'}</span>
              </button>
              <ReciterSelect selectedReciter={recTarqiq} onReciterChange={setRecTarqiq} color="blue" />
            </div>
            <div className="text-[9px] text-gray-500 mt-1">S{currentTarqiqExample.surah}:V{currentTarqiqExample.ayah}</div>
            <div className="flex gap-1.5 mt-2">
              {examplesTarqiq.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTarqiqIndex(index)}
                  className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all ${
                    index === currentTarqiqIndex ? 'bg-blue-500 scale-125' : 'bg-gray-600'
                  }`}
                />
              ))}
            </div>
          </div>

          <button
            onClick={() => setCurrentTarqiqIndex((prev) => (prev + 1) % examplesTarqiq.length)}
            className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-110 flex-shrink-0"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>

      {/* Slider Râ' Sâkina */}
      <div className={`${sakinaColors.bg} border ${sakinaColors.border} rounded-lg p-3 md:p-4 lg:p-6 mb-6 transition-all duration-300`}>
        <h3 className="text-base md:text-lg font-bold text-purple-400 mb-2 text-center">Râ' Sâkina (رْ) - Selon contexte</h3>
        
        <div className="flex items-center justify-center gap-2 sm:gap-3 md:gap-4">
          <button
            onClick={() => setCurrentSakinaIndex((prev) => (prev - 1 + examplesSakina.length) % examplesSakina.length)}
            className={`w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full border-2 ${sakinaColors.border} ${sakinaColors.text} ${sakinaColors.hover} hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-110 flex-shrink-0`}
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          <div className="flex-1 flex flex-col items-center justify-center min-h-[120px] sm:min-h-[140px] md:min-h-[160px] max-w-[400px]">
            <div className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold ${sakinaColors.text} mb-1`}>
              {currentSakinaExample.letter}
            </div>
            <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-amber-300 font-bold leading-relaxed mb-1 text-center">
              {currentSakinaExample.verse}
            </div>
            <div className={`text-xs sm:text-sm md:text-base ${sakinaColors.text} font-semibold`}>
              {currentSakinaExample.translation}
            </div>
            <div className="flex items-center gap-2 mt-2">
              <button onClick={toggleSakina} disabled={loadSakina} className={`flex items-center gap-1 ${currentSakinaExample.color === 'amber' ? 'bg-amber-600 hover:bg-amber-700' : 'bg-blue-600 hover:bg-blue-700'} disabled:bg-gray-600 text-white px-2 py-1 rounded-full text-[10px]`}>
                {loadSakina ? <Loader2 className="w-3 h-3 animate-spin" /> : playSakina ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                <span>{playSakina ? 'Pause' : 'Écouter'}</span>
              </button>
              <ReciterSelect selectedReciter={recSakina} onReciterChange={setRecSakina} color={currentSakinaExample.color} />
            </div>
            <div className="text-[9px] text-gray-500 mt-1">S{currentSakinaExample.surah}:V{currentSakinaExample.ayah}</div>
            <div className="flex gap-1.5 mt-2">
              {examplesSakina.map((ex, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSakinaIndex(index)}
                  className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all ${
                    index === currentSakinaIndex ? `${getColorClasses(ex.color).text.replace('text', 'bg')} scale-125` : 'bg-gray-600'
                  }`}
                />
              ))}
            </div>
          </div>

          <button
            onClick={() => setCurrentSakinaIndex((prev) => (prev + 1) % examplesSakina.length)}
            className={`w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full border-2 ${sakinaColors.border} ${sakinaColors.text} ${sakinaColors.hover} hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-110 flex-shrink-0`}
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>

      <div className="px-4 md:px-8">
        <PageNavigation currentChapter={7} currentPage={25} module="TAJWID" className="mt-4 mb-4" />
      </div>

      <footer className="border-t-1 text-white text-center p-4 md:p-6 flex-shrink-0 font-semibold text-sm md:text-base">
        <div>Chapitre 7 - Page 25 : La Lettre Râ'</div>
        <div className="mt-1">© 2025 Tous droits réservés</div>
      </footer>
    </div>
  );
};

export default function Page25() {
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = 2;

  const goToNextPage = () => {
    if (currentPage < totalPages - 1) setCurrentPage(currentPage + 1);
  };

  const goToPreviousPage = () => {
    if (currentPage > 0) setCurrentPage(currentPage - 1);
  };

  const pageTitle = currentPage === 0 
    ? 'Leçon : La Lettre Râ\' (ر)' 
    : 'Exemples de Râ\'';

  return (
    <div className="font-arabic min-h-screen bg-gray-900">
      <div className="w-full h-full overflow-hidden bg-gray-900">
        <div className="text-white p-4 md:p-6 text-center border-b-2">
          <div className="text-2xl md:text-3xl font-bold mb-2">{pageTitle}</div>
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
}
