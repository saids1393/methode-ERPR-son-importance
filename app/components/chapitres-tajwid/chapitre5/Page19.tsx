'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Play, Pause, Volume2, Loader2, ChevronDown } from 'lucide-react';
import PageNavigation from '@/app/components/PageNavigation';

const WaqfHasanPage = () => {
  return (
    <div className="p-4 md:p-8 bg-gray-900">
      <div className="w-full bg-gray-800 rounded-lg p-6 md:p-8">
        <div className="text-white space-y-6 text-lg md:text-xl leading-relaxed">
          <h2 className="text-3xl font-bold text-amber-400 mb-4">Waqf Ḥasan - Arrêt Bon (الوقف الحسن)</h2>
          
          <p>
            Le <span className="text-amber-400 font-semibold">Waqf Ḥasan</span> est l'arrêt sur un mot dont 
            le sens est <span className="text-amber-400 font-semibold">acceptable</span>, mais il est préférable 
            de continuer car le sens est plus complet avec ce qui suit.
          </p>
          
          <div className="bg-amber-900/30 border border-amber-500/50 rounded-lg p-4 md:p-6">
            <h3 className="text-xl font-bold text-amber-300 mb-4">Caractéristiques :</h3>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-amber-400">✓</span>
                <span>Le sens est <span className="text-amber-400 font-semibold">bon mais incomplet</span></span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400">✓</span>
                <span>Il y a un <span className="text-amber-400 font-semibold">lien grammatical</span> avec ce qui suit</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400">✓</span>
                <span>L'arrêt est <span className="text-amber-400 font-semibold">permis si nécessaire</span></span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400">✓</span>
                <span>Symbole dans le Mushaf : <span className="text-amber-300 text-2xl font-bold">صلى</span></span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="px-4 md:px-8">
        <PageNavigation currentChapter={5} currentPage={19} module="TAJWID" className="mt-6 mb-4" />
      </div>

      <footer className="border-t-1 text-white text-center p-4 md:p-6 mt-8 flex-shrink-0 font-semibold text-base md:text-lg">
        <div>Chapitre 5 - Page 19</div>
        <div className="mt-1">© 2025 Tous droits réservés</div>
      </footer>
    </div>
  );
};

// Données des exemples - Waqf Ḥasan
const examplesHasan = [
  { letter: 'صلى', verse: 'بِسْمِ ٱللَّهِ', translation: 'Sens acceptable mais préférable de continuer', surah: 1, ayah: 1 },
  { letter: 'صلى', verse: 'ٱلرَّحْمَٰنِ', translation: 'Attribut de Allah, lié à ce qui suit', surah: 1, ayah: 1 },
  { letter: 'صلى', verse: 'إِيَّاكَ نَعْبُدُ', translation: 'Sens partiel, mieux de continuer', surah: 1, ayah: 5 }
];

// Données des exemples - Waqf Qabîḥ
const examplesQabih = [
  { letter: 'لا', verse: 'بِسْمِ ❌', translation: 'S\'arrêter sur "bismi" seul n\'a pas de sens', surah: 1, ayah: 1 },
  { letter: 'لا', verse: 'إِنَّ ٱللَّهَ لَا يَسْتَحْيِۦ ❌', translation: 'Change le sens du verset', surah: 2, ayah: 26 },
  { letter: 'لا', verse: 'فَوَيْلٌ لِّلْمُصَلِّينَ ❌', translation: 'Le verset continue pour préciser lesquels', surah: 107, ayah: 4 }
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
  const [currentHasanIndex, setCurrentHasanIndex] = useState(0);
  const [currentQabihIndex, setCurrentQabihIndex] = useState(0);

  const [recHasan, setRecHasan] = useState('abdul-basit');
  const [playHasan, setPlayHasan] = useState(false);
  const [loadHasan, setLoadHasan] = useState(false);
  const audioHasanRef = useRef<HTMLAudioElement | null>(null);

  const [recQabih, setRecQabih] = useState('abdul-basit');
  const [playQabih, setPlayQabih] = useState(false);
  const [loadQabih, setLoadQabih] = useState(false);
  const audioQabihRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => { if (audioHasanRef.current) { audioHasanRef.current.pause(); audioHasanRef.current = null; } setPlayHasan(false); setLoadHasan(false); }, [currentHasanIndex, recHasan]);
  useEffect(() => { if (audioQabihRef.current) { audioQabihRef.current.pause(); audioQabihRef.current = null; } setPlayQabih(false); setLoadQabih(false); }, [currentQabihIndex, recQabih]);

  const toggleHasan = () => {
    const ex = examplesHasan[currentHasanIndex];
    if (playHasan && audioHasanRef.current) { audioHasanRef.current.pause(); setPlayHasan(false); return; }
    setLoadHasan(true);
    const a = new Audio(`/api/quran/audio?reciterId=${recHasan}&surah=${ex.surah}&ayah=${ex.ayah}`);
    audioHasanRef.current = a;
    a.oncanplaythrough = () => { setLoadHasan(false); a.play(); setPlayHasan(true); };
    a.onended = () => setPlayHasan(false);
    a.onerror = () => { setLoadHasan(false); setPlayHasan(false); };
    a.load();
  };

  const toggleQabih = () => {
    const ex = examplesQabih[currentQabihIndex];
    if (playQabih && audioQabihRef.current) { audioQabihRef.current.pause(); setPlayQabih(false); return; }
    setLoadQabih(true);
    const a = new Audio(`/api/quran/audio?reciterId=${recQabih}&surah=${ex.surah}&ayah=${ex.ayah}`);
    audioQabihRef.current = a;
    a.oncanplaythrough = () => { setLoadQabih(false); a.play(); setPlayQabih(true); };
    a.onended = () => setPlayQabih(false);
    a.onerror = () => { setLoadQabih(false); setPlayQabih(false); };
    a.load();
  };

  const currentHasanExample = examplesHasan[currentHasanIndex];
  const currentQabihExample = examplesQabih[currentQabihIndex];

  return (
    <div className="p-2 md:p-4 lg:p-8 bg-gray-900">
      
      {/* Slider Waqf Ḥasan */}
      <div className="bg-amber-900/30 border border-amber-500/50 rounded-lg p-4 md:p-6 lg:p-8 mb-4">
        <h3 className="text-lg md:text-xl font-bold text-amber-400 mb-3 text-center">Waqf Ḥasan (الوقف الحسن)</h3>
        
        <div className="flex items-center justify-center gap-2 sm:gap-4 md:gap-6">
          <button
            onClick={() => setCurrentHasanIndex((prev) => (prev - 1 + examplesHasan.length) % examplesHasan.length)}
            className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full border-2 border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-110 flex-shrink-0"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
          </button>

          <div className="flex-1 flex flex-col items-center justify-center min-h-[160px] sm:min-h-[180px] md:min-h-[200px] max-w-[600px]">
            <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-amber-400 mb-2">
              {currentHasanExample.letter}
            </div>
            <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-amber-300 font-bold leading-relaxed mb-2 text-center" dir="rtl">
              {currentHasanExample.verse}
            </div>
            <div className="text-sm sm:text-base md:text-lg text-gray-300 italic text-center">
              {currentHasanExample.translation}
            </div>
            <div className="flex items-center gap-2 mt-3">
              <button onClick={toggleHasan} disabled={loadHasan} className="flex items-center gap-1 bg-amber-600 hover:bg-amber-700 disabled:bg-gray-600 text-white px-3 py-1 rounded-full text-xs">
                {loadHasan ? <Loader2 className="w-4 h-4 animate-spin" /> : playHasan ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{playHasan ? 'Pause' : 'Écouter'}</span>
              </button>
              <ReciterSelect selectedReciter={recHasan} onReciterChange={setRecHasan} color="amber" />
            </div>
            <div className="text-[10px] text-gray-500 mt-1">S{currentHasanExample.surah}:V{currentHasanExample.ayah}</div>
            <div className="flex gap-2 mt-4">
              {examplesHasan.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentHasanIndex(index)}
                  className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full transition-all ${
                    index === currentHasanIndex ? 'bg-amber-500 scale-125' : 'bg-gray-600'
                  }`}
                />
              ))}
            </div>
          </div>

          <button
            onClick={() => setCurrentHasanIndex((prev) => (prev + 1) % examplesHasan.length)}
            className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full border-2 border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-110 flex-shrink-0"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
          </button>
        </div>
      </div>

      {/* Slider Waqf Qabîḥ */}
      <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-4 md:p-6 lg:p-8 mb-6">
        <h3 className="text-lg md:text-xl font-bold text-red-400 mb-3 text-center">Waqf Qabîḥ (الوقف القبيح) - Interdit</h3>
        
        <div className="flex items-center justify-center gap-2 sm:gap-4 md:gap-6">
          <button
            onClick={() => setCurrentQabihIndex((prev) => (prev - 1 + examplesQabih.length) % examplesQabih.length)}
            className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-110 flex-shrink-0"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
          </button>

          <div className="flex-1 flex flex-col items-center justify-center min-h-[160px] sm:min-h-[180px] md:min-h-[200px] max-w-[600px]">
            <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-red-400 mb-2">
              {currentQabihExample.letter}
            </div>
            <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-red-300 font-bold leading-relaxed mb-2 text-center" dir="rtl">
              {currentQabihExample.verse}
            </div>
            <div className="text-sm sm:text-base md:text-lg text-gray-300 italic text-center">
              {currentQabihExample.translation}
            </div>
            <div className="flex items-center gap-2 mt-3">
              <button onClick={toggleQabih} disabled={loadQabih} className="flex items-center gap-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white px-3 py-1 rounded-full text-xs">
                {loadQabih ? <Loader2 className="w-4 h-4 animate-spin" /> : playQabih ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{playQabih ? 'Pause' : 'Écouter'}</span>
              </button>
              <ReciterSelect selectedReciter={recQabih} onReciterChange={setRecQabih} color="red" />
            </div>
            <div className="text-[10px] text-gray-500 mt-1">S{currentQabihExample.surah}:V{currentQabihExample.ayah}</div>
            <div className="flex gap-2 mt-4">
              {examplesQabih.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentQabihIndex(index)}
                  className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full transition-all ${
                    index === currentQabihIndex ? 'bg-red-500 scale-125' : 'bg-gray-600'
                  }`}
                />
              ))}
            </div>
          </div>

          <button
            onClick={() => setCurrentQabihIndex((prev) => (prev + 1) % examplesQabih.length)}
            className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-110 flex-shrink-0"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
          </button>
        </div>
      </div>

      <div className="px-4 md:px-8">
        <PageNavigation currentChapter={5} currentPage={19} module="TAJWID" className="mt-6 mb-4" />
      </div>

      <footer className="border-t-1 text-white text-center p-4 md:p-6 flex-shrink-0 font-semibold text-sm md:text-base">
        <div>Chapitre 5 - Page 19 : Waqf Ḥasan & Qabîḥ</div>
        <div className="mt-1">© 2025 Tous droits réservés</div>
      </footer>
    </div>
  );
};

const Page20 = () => {
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
    ? "Leçon : Waqf Ḥasan (الوقف الحسن)"
    : "Exemples de Waqf Ḥasan & Qabîḥ";

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

        {currentPage === 0 && <WaqfHasanPage />}
        {currentPage === 1 && <ExamplesPage />}
      </div>
    </div>
  );
};

export default Page20;
