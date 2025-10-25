"use client";

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Mapping audio pour le Chapitre 1, Page 4
const chapter1Page4AudioMappings: { [key: string]: string } = {
  'ـا': 'chap0_pg0_case1',
  'ـب': 'chap0_pg0_case2',
  'ـت': 'chap0_pg0_case3',
  'ـث': 'chap0_pg0_case4',
  'ـج': 'chap0_pg0_case5',
  'ـح': 'chap0_pg0_case6',
  'ـخ': 'chap0_pg0_case7',
  'ـد': 'chap0_pg0_case8',
  'ـذ': 'chap0_pg0_case9',
  'ـر': 'chap0_pg0_case10',
  'ـز': 'chap0_pg0_case11',
  'ـس': 'chap0_pg0_case12',
  'ـش': 'chap0_pg0_case13',
  'ـص': 'chap0_pg0_case14',
  'ـض': 'chap0_pg0_case15',
  'ـط': 'chap0_pg0_case16',
  'ـظ': 'chap0_pg0_case17',
  'ـع': 'chap0_pg0_case18',
  'ـغ': 'chap0_pg0_case19',
  'ـف': 'chap0_pg0_case20',
  'ـق': 'chap0_pg0_case21',
  'ـك': 'chap0_pg0_case22',
  'ـل': 'chap0_pg0_case23',
  'ـم': 'chap0_pg0_case24',
  'ـن': 'chap0_pg0_case25',
  'ـه': 'chap0_pg0_case26',
  'ـو': 'chap0_pg0_case27',
  'ـي': 'chap0_pg0_case28',
  'ء': 'chap0_pg0_case29',
  'ـة': 'chap0_pg0_case30'
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
            Terminons notre exploration des formes des lettres arabes avec la <span className="text-purple-400 font-semibold">position à la fin du mot</span>.
            Cette forme est particulièrement importante car elle montre comment les lettres se terminent.
          </p>

          <p>
            Lorsqu'une lettre se trouve à la <span className="font-semibold">fin d'un mot</span>, elle ne s'attache qu'à la lettre précédente mais pas à la suivante (puisqu'il n'y en a pas).
            Cette forme est appelée <span className="font-semibold">forme finale</span>.
          </p>

          <p>
            🧩 <span className="font-semibold">Exemples :</span>
            <br />
            • La lettre <span className="text-yellow-400 font-bold">ب</span> (b) devient <span className="text-yellow-400 font-bold">ـب</span> à la fin du mot → 
            <span className="font-semibold"> كت<span className="text-yellow-400">ـب</span></span> (kitab = livre)
            <br />
            • La lettre <span className="text-yellow-400 font-bold">م</span> (m) devient <span className="text-yellow-400 font-bold">ـم</span> à la fin → 
            <span className="font-semibold"> قل<span className="text-yellow-400">ـم</span></span> (qalam = crayon)
            <br />
            • La lettre <span className="text-yellow-400 font-bold">ل</span> (l) devient <span className="text-yellow-400 font-bold">ـل</span> à la fin → 
            <span className="font-semibold"> جب<span className="text-yellow-400">ـل</span></span> (jabal = montagne)
          </p>

          <p>
            Comme pour les autres positions, les <span className="text-purple-400 font-semibold">6 lettres spéciales</span> : 
            <span className="font-bold"> ا, د, ذ, ر, ز, و</span> ne s'attachent jamais avant elles, même en fin de mot.
            Elles conservent donc leur forme isolée.
          </p>

          <p>
            <span className="text-purple-400 font-semibold">Note spéciale :</span> La lettre <span className="font-bold">ـة</span> (tā' marbūṭa) 
            est une forme particulière qui n'apparaît qu'à la fin des mots et indique souvent un nom féminin.
          </p>

          <div className="bg-blue-900/30 border border-blue-500/50 rounded-lg p-6 my-6">
            <p>
              💡 <span className="font-semibold">Astuce :</span> La forme finale est souvent reconnaissable par sa "queue" ou son extension vers la gauche. 
              C'est comme si la lettre s'étirait pour se connecter à la précédente mais s'arrêtait net à la fin du mot.
            </p>
          </div>

          <p>
            À la page suivante, tu découvriras le <span className="text-purple-400 font-semibold">tableau complet</span> des lettres arabes dans leur forme finale.
            Clique sur chaque lettre pour écouter sa prononciation et t'habituer à sa forme lorsqu'elle apparaît à la fin d'un mot.
          </p>
        </div>
      </div>

      <footer className="border-t-1 text-white text-center p-6 mt-8 flex-shrink-0 font-semibold text-lg">
        <div>Leçon 4</div>
        <div className="mt-1">© 2025 Tous droits réservés</div>
      </footer>
    </div>
  );
};

const AlphabetPage = ({ playLetterAudio }: { playLetterAudio: (letter: string) => void }) => {
  const letters = [
    // Row 1
    { letter: 'ـا', emphatic: false, violet: false },
    { letter: 'ـب', emphatic: false, violet: false },
    { letter: 'ـت', emphatic: false, violet: false },
    { letter: 'ـث', emphatic: false, violet: false },
    { letter: 'ـج', emphatic: false, violet: false },
    { letter: 'ـح', emphatic: false, violet: false },
    
    // Row 2
    { letter: 'ـخ', emphatic: true, violet: false },
    { letter: 'ـد', emphatic: false, violet: false },
    { letter: 'ـذ', emphatic: false, violet: false },
    { letter: 'ـر', emphatic: true, violet: false },
    { letter: 'ـز', emphatic: false, violet: false },
    { letter: 'ـس', emphatic: false, violet: false },
    
    // Row 3
    { letter: 'ـش', emphatic: false, violet: false },
    { letter: 'ـص', emphatic: true, violet: false },
    { letter: 'ـض', emphatic: true, violet: false },
    { letter: 'ـط', emphatic: true, violet: false },
    { letter: 'ـظ', emphatic: true, violet: false },
    { letter: 'ـع', emphatic: false, violet: false },
    
    // Row 4
    { letter: 'ـغ', emphatic: true, violet: false },
    { letter: 'ـف', emphatic: false, violet: false },
    { letter: 'ـق', emphatic: true, violet: false },
    { letter: 'ـك', emphatic: false, violet: false },
    { letter: 'ـل', emphatic: false, violet: false },
    { letter: 'ـم', emphatic: false, violet: false },
    
    // Row 5
    { letter: 'ـن', emphatic: false, violet: false },
    { letter: 'ـه', emphatic: false, violet: false },
    { letter: 'ـو', emphatic: false, violet: false },
    { letter: 'ـي', emphatic: false, violet: false },
    { letter: 'ء', emphatic: false, violet: true },
    { letter: 'ـة', emphatic: false, violet: true }
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
          <span className="font-semibold">📝 Note importante :</span> Les lettres <span className="font-bold">ا, د, ذ, ر, ز, و</span> ne s'attachent jamais avant elles et conservent leur forme isolée même en fin de mot.
        </p>
      </div>

      {/* Information sur le tā' marbūṭa */}
      <div className="bg-green-900/30 border border-green-500/50 rounded-lg p-6 mb-6">
        <p className="text-lg leading-relaxed text-white text-center">
          <span className="font-semibold">✨ Particularité :</span> La lettre <span className="font-bold">ـة</span> (tā' marbūṭa) n'apparaît qu'à la fin des mots et indique souvent un nom féminin.
        </p>
      </div>

      <footer className="border-t-1 text-white text-center p-6 flex-shrink-0 font-semibold text-sm">
        <div>Leçon 4</div>
        <div className="mt-1">© 2025 Tous droits réservés</div>
      </footer>
    </div>
  );
};

const Page4 = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = 2;

  const playLetterAudio = (letter: string) => {
    const audioFileName = chapter1Page4AudioMappings[letter];
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
    ? "Leçon 4 : Lettres attachées à la fin d'un mot"
    : "Leçon 4 : Tableau des lettres en position finale";

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

export default Page4;