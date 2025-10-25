"use client";

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Mapping audio pour le Chapitre 1, Page 3
const chapter1Page3AudioMappings: { [key: string]: string } = {
  'ـا': 'chap0_pg0_case1',
  'ـبـ': 'chap0_pg0_case2',
  'ـتـ': 'chap0_pg0_case3',
  'ـثـ': 'chap0_pg0_case4',
  'ـجـ': 'chap0_pg0_case5',
  'ـحـ': 'chap0_pg0_case6',
  'ـخـ': 'chap0_pg0_case7',
  'ـد': 'chap0_pg0_case8',
  'ـذ': 'chap0_pg0_case9',
  'ـر': 'chap0_pg0_case10',
  'ـز': 'chap0_pg0_case11',
  'ـسـ': 'chap0_pg0_case12',
  'ـشـ': 'chap0_pg0_case13',
  'ـصـ': 'chap0_pg0_case14',
  'ـضـ': 'chap0_pg0_case15',
  'ـطـ': 'chap0_pg0_case16',
  'ـظـ': 'chap0_pg0_case17',
  'ـعـ': 'chap0_pg0_case18',
  'ـغـ': 'chap0_pg0_case19',
  'ـفـ': 'chap0_pg0_case20',
  'ـقـ': 'chap0_pg0_case21',
  'ـكـ': 'chap0_pg0_case22',
  'ـلـ': 'chap0_pg0_case23',
  'ـمـ': 'chap0_pg0_case24',
  'ـنـ': 'chap0_pg0_case25',
  'ـهـ': 'chap0_pg0_case26',
  'ـو': 'chap0_pg0_case27',
  'ـيـ': 'chap0_pg0_case28',
  'ء': 'chap0_pg0_case29'
};

const Cell = ({ letter, emphatic, violet, onClick }: { 
  letter: string; 
  emphatic?: boolean;
  violet?: boolean;
  onClick?: () => void;
}) => (
  <div 
    className="border border-zinc-500 rounded-xl p-4 text-center min-h-[100px] flex flex-col justify-center items-center hover:bg-zinc-700 transition-all duration-300 hover:scale-105 cursor-pointer"
    onClick={onClick}
  >
    <div className={`text-3xl md:text-4xl font-bold transition-colors ${
      emphatic ? 'text-red-400' : 
      violet ? 'text-purple-400' : 
      'text-white'
    }`}>
      {letter}
    </div>
  </div>
);

const IntroductionPage = () => {
  return (
    <div className="p-8 bg-gray-900">
      <div className="w-full bg-gray-800 rounded-lg p-8">
        <div className="text-white space-y-6 text-xl leading-relaxed">
          
          <p>
            Continuons notre exploration des formes des lettres arabes avec la <span className="text-purple-400 font-semibold">position au milieu du mot</span>.
            Cette forme est cruciale car elle montre comment les lettres se relient entre elles.
          </p>

          <p>
            Lorsqu'une lettre se trouve au <span className="font-semibold">milieu d'un mot</span>, elle doit s'attacher à la fois à la lettre précédente et à la lettre suivante.
            Cette forme est appelée <span className="font-semibold">forme médiane</span>.
          </p>

          <p>
            🧩 <span className="font-semibold">Exemples :</span>
            <br />
            • La lettre <span className="text-yellow-400 font-bold">ب</span> (b) devient <span className="text-yellow-400 font-bold">ـبـ</span> au milieu du mot → 
            <span className="font-semibold"> ك<span className="text-yellow-400">ـبـ</span>ير</span> (kabīr = grand)
            <br />
            • La lettre <span className="text-yellow-400 font-bold">س</span> (s) devient <span className="text-yellow-400 font-bold">ـسـ</span> au milieu → 
            <span className="font-semibold"> م<span className="text-yellow-400">ـسـ</span>لم</span> (muslim = musulman)
            <br />
            • La lettre <span className="text-yellow-400 font-bold">م</span> (m) devient <span className="text-yellow-400 font-bold">ـمـ</span> au milieu → 
            <span className="font-semibold"> ك<span className="text-yellow-400">ـمـ</span>ال</span> (kamāl = perfection)
          </p>

          <p>
            Comme pour la forme initiale, les <span className="text-purple-400 font-semibold">6 lettres spéciales</span> : 
            <span className="font-bold"> ا, د, ذ, ر, ز, و</span> ne s'attachent jamais après elles, même au milieu d'un mot.
            Elles conservent donc leur forme isolée.
          </p>

          <div className="bg-blue-900/30 border border-blue-500/50 rounded-lg p-6 my-6">
            <p>
              💡 <span className="font-semibold">Astuce :</span> La forme médiane est souvent une version "étirée" de la lettre qui permet une connexion fluide entre les lettres. 
              Observe bien comment le trait de connexion s'étend pour relier les lettres entre elles !
            </p>
          </div>

          <p>
            À la page suivante, tu découvriras le <span className="text-purple-400 font-semibold">tableau complet</span> des lettres arabes dans leur forme médiane.
            Clique sur chaque lettre pour écouter sa prononciation et t'habituer à sa forme lorsqu'elle apparaît au milieu d'un mot.
          </p>
        </div>
      </div>

      <footer className="border-t-1 text-white text-center p-6 mt-8 flex-shrink-0 font-semibold text-lg">
        <div>Leçon 3</div>
        <div className="mt-1">© 2025 Tous droits réservés</div>
      </footer>
    </div>
  );
};

const AlphabetPage = ({ playLetterAudio }: { playLetterAudio: (letter: string) => void }) => {
  const letters = [
    // Row 1
    { letter: 'ـا', emphatic: false, violet: false },
    { letter: 'ـبـ', emphatic: false, violet: false },
    { letter: 'ـتـ', emphatic: false, violet: false },
    { letter: 'ـثـ', emphatic: false, violet: false },
    { letter: 'ـجـ', emphatic: false, violet: false },
    { letter: 'ـحـ', emphatic: false, violet: false },
    
    // Row 2
    { letter: 'ـخـ', emphatic: true, violet: false },
    { letter: 'ـد', emphatic: false, violet: false },
    { letter: 'ـذ', emphatic: false, violet: false },
    { letter: 'ـر', emphatic: true, violet: false },
    { letter: 'ـز', emphatic: false, violet: false },
    { letter: 'ـسـ', emphatic: false, violet: false },
    
    // Row 3
    { letter: 'ـشـ', emphatic: false, violet: false },
    { letter: 'ـصـ', emphatic: true, violet: false },
    { letter: 'ـضـ', emphatic: true, violet: false },
    { letter: 'ـطـ', emphatic: true, violet: false },
    { letter: 'ـظـ', emphatic: true, violet: false },
    { letter: 'ـعـ', emphatic: false, violet: false },
    
    // Row 4
    { letter: 'ـغـ', emphatic: true, violet: false },
    { letter: 'ـفـ', emphatic: false, violet: false },
    { letter: 'ـقـ', emphatic: true, violet: false },
    { letter: 'ـكـ', emphatic: false, violet: false },
    { letter: 'ـلـ', emphatic: false, violet: false },
    { letter: 'ـمـ', emphatic: false, violet: false },
    
    // Row 5
    { letter: 'ـنـ', emphatic: false, violet: false },
    { letter: 'ـهـ', emphatic: false, violet: false },
    { letter: 'ـو', emphatic: false, violet: false },
    { letter: 'ـيـ', emphatic: false, violet: false },
    { letter: 'ء', emphatic: false, violet: true },
  ];

  return (
    <div className="p-8 bg-gray-900">
      <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-7 gap-4 mb-6" dir="rtl">
        {letters.map((item, index) => (
          <Cell 
            key={index} 
            letter={item.letter} 
            emphatic={item.emphatic}
            violet={item.violet}
            onClick={() => playLetterAudio(item.letter)}
          />
        ))}
      </div>
      
      {/* Légende simplifiée */}
      <div className="bg-gray-800 rounded-lg p-4 mb-4">
        <div className="flex items-center justify-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-400 rounded-full"></div>
            <span className="text-red-400">Lettres emphatiques</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-purple-400 rounded-full"></div>
            <span className="text-purple-400">Lettres spéciales</span>
          </div>
        </div>
      </div>

      {/* Information sur les lettres non-attachantes */}
      <div className="bg-purple-900/30 border border-purple-500/50 rounded-lg p-6 mb-6">
        <p className="text-lg leading-relaxed text-white text-center">
          <span className="font-semibold">📝 Note importante :</span> Les lettres <span className="font-bold">ا, د, ذ, ر, ز, و</span> ne s'attachent jamais après elles et conservent leur forme isolée même au milieu d'un mot.
        </p>
      </div>

      <footer className="border-t-1 text-white text-center p-6 flex-shrink-0 font-semibold text-sm">
        <div>Leçon 3</div>
        <div className="mt-1">© 2025 Tous droits réservés</div>
      </footer>
    </div>
  );
};

const Page3 = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = 2;

  const playLetterAudio = (letter: string) => {
    const audioFileName = chapter1Page3AudioMappings[letter];
    if (audioFileName) {
      const audio = new Audio(`/audio/chapitre0_1/${audioFileName}.mp3`);
      audio.play().catch(error => {
        console.error('Erreur lors de la lecture audio:', error);
      });
    }
  };

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
    ? "Leçon 3 : Lettres attachées au milieu d'un mot"
    : "Leçon 3 : Tableau des lettres attachées en position médiane";

  return (
    <div className="font-arabic min-h-screen bg-gray-900">
      <div className="w-full h-full overflow-hidden bg-gray-900">
        
        {/* Header */}
        <div className="text-white p-6 text-center border-b-2">
          <div className="text-3xl font-bold mb-4">
            {pageTitle}
          </div>
        </div>
        
        {/* Navigation Buttons */}
        <div className="flex justify-between items-center px-4 md:px-8 py-4">
          <button
            onClick={goToPreviousPage}
            disabled={currentPage === 0}
            className={`w-10 h-10 md:w-12 md:h-12 rounded-full border-2 flex items-center justify-center transition-all ${
              currentPage === 0
                ? 'border-gray-600 text-gray-600 cursor-not-allowed'
                : 'border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white hover:scale-110'
            }`}
          >
            <ChevronLeft size={20} className="md:w-6 md:h-6" />
          </button>

          <div className="text-white font-semibold text-sm md:text-base">
            Page {currentPage + 1} / {totalPages}
          </div>

          <button
            onClick={goToNextPage}
            disabled={currentPage === totalPages - 1}
            className={`w-10 h-10 md:w-12 md:h-12 rounded-full border-2 flex items-center justify-center transition-all ${
              currentPage === totalPages - 1
                ? 'border-gray-600 text-gray-600 cursor-not-allowed'
                : 'border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white hover:scale-110'
            }`}
          >
            <ChevronRight size={20} className="md:w-6 md:h-6" />
          </button>
        </div>

        {/* Content */}
        {currentPage === 0 && <IntroductionPage />}
        {currentPage === 1 && <AlphabetPage playLetterAudio={playLetterAudio} />}
      </div>
    </div>
  );
};

export default Page3;