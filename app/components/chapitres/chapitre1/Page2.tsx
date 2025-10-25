"use client";

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Mapping audio pour le Chapitre 1, Page 2
const chapter1Page2AudioMappings: { [key: string]: string } = {
  'ا': 'chap0_pg0_case1',
  'بـ': 'chap0_pg0_case2',
  'تـ': 'chap0_pg0_case3',
  'ثـ': 'chap0_pg0_case4',
  'جـ': 'chap0_pg0_case5',
  'حـ': 'chap0_pg0_case6',
  'خـ': 'chap0_pg0_case7',
  'د': 'chap0_pg0_case8',
  'ذ': 'chap0_pg0_case9',
  'ر': 'chap0_pg0_case10',
  'ز': 'chap0_pg0_case11',
  'سـ': 'chap0_pg0_case12',
  'شـ': 'chap0_pg0_case13',
  'صـ': 'chap0_pg0_case14',
  'ضـ': 'chap0_pg0_case15',
  'طـ': 'chap0_pg0_case16',
  'ظـ': 'chap0_pg0_case17',
  'عـ': 'chap0_pg0_case18',
  'غـ': 'chap0_pg0_case19',
  'فـ': 'chap0_pg0_case20',
  'قـ': 'chap0_pg0_case21',
  'كـ': 'chap0_pg0_case22',
  'لـ': 'chap0_pg0_case23',
  'مـ': 'chap0_pg0_case24',
  'نـ': 'chap0_pg0_case25',
  'هـ': 'chap0_pg0_case26',
  'و': 'chap0_pg0_case27',
  'يـ': 'chap0_pg0_case28',
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
        <div className="text-white space-y-6 text-xl leading-relaxed"> {/* ← police agrandie */}
          
          <p>
            En arabe, chaque lettre peut avoir <span className="text-purple-400 font-semibold">trois formes principales</span> :
            <br />
            ➤ au <span className="font-semibold">début</span> d’un mot,  
            ➤ au <span className="font-semibold">milieu</span> d’un mot,  
            ➤ à la <span className="font-semibold">fin</span> d’un mot.
          </p>

          <p>
            Dans cette leçon, nous allons nous concentrer sur les <span className="text-purple-400 font-semibold">lettres en début de mot</span>.
            Leur forme change légèrement pour pouvoir se relier à la lettre suivante.
            Cette forme est appelée <span className="font-semibold">forme initiale</span>.
          </p>

          <p>
            🧩 <span className="font-semibold">Exemples :</span>
            <br />
            • La lettre <span className="text-yellow-400 font-bold">ب</span> (b) devient <span className="text-yellow-400 font-bold">بـ</span> au début du mot → 
            <span className="font-semibold"> <span className="text-yellow-400">بـ</span>يت</span> (bayt = maison)
            <br />
            • La lettre <span className="text-yellow-400 font-bold">س</span> (s) devient <span className="text-yellow-400 font-bold">سـ</span> au début → 
            <span className="font-semibold"> <span className="text-yellow-400">سـ</span>لام</span> (salām = paix)
            <br />
            • La lettre <span className="text-yellow-400 font-bold">م</span> (m) devient <span className="text-yellow-400 font-bold">مـ</span> au début → 
            <span className="font-semibold"> <span className="text-yellow-400">مـ</span>درسة</span> (madrasa = école)
          </p>

          <p>
            Cependant, il existe <span className="text-purple-400 font-semibold">6 lettres spéciales</span> qui <span className="underline">ne s’attachent jamais après elles</span> :
            <span className="font-bold"> ا, د, ذ, ر, ز, و</span>.
            Ces lettres gardent toujours leur forme isolée, même au début d’un mot.
          </p>

          <div className="bg-blue-900/30 border border-blue-500/50 rounded-lg p-6 my-6">
            <p>
              💡 <span className="font-semibold">Astuce :</span> Même si les lettres changent de forme selon leur position, on peut toujours les reconnaître grâce à leurs <span className="text-yellow-400 font-semibold">points</span> et à leur <span className="text-yellow-400 font-semibold">structure générale</span>.
              En les observant bien, tu apprendras à les distinguer facilement !
            </p>
          </div>

          <p>
            À la page suivante, tu verras le <span className="text-purple-400 font-semibold">tableau complet</span> des lettres arabes dans leur forme initiale.
            Clique sur chaque lettre pour écouter sa prononciation et t’habituer à sa forme lorsqu’elle apparaît au début d’un mot.
          </p>
        </div>
      </div>

      <footer className="border-t-1 text-white text-center p-6 mt-8 flex-shrink-0 font-semibold text-lg">
        <div>Leçon 2</div>
        <div className="mt-1">© 2025 Tous droits réservés</div>
      </footer>
    </div>
  );
};



const AlphabetPage = ({ playLetterAudio }: { playLetterAudio: (letter: string) => void }) => {
  const letters = [
    // Row 1
    { letter: 'ا', emphatic: false, violet: false },
    { letter: 'بـ', emphatic: false, violet: false },
    { letter: 'تـ', emphatic: false, violet: false },
    { letter: 'ثـ', emphatic: false, violet: false },
    { letter: 'جـ', emphatic: false, violet: false },
    { letter: 'حـ', emphatic: false, violet: false },
    
    // Row 2
    { letter: 'خـ', emphatic: true, violet: false },
    { letter: 'د', emphatic: false, violet: false },
    { letter: 'ذ', emphatic: false, violet: false },
    { letter: 'ر', emphatic: true, violet: false },
    { letter: 'ز', emphatic: false, violet: false },
    { letter: 'سـ', emphatic: false, violet: false },
    
    // Row 3
    { letter: 'شـ', emphatic: false, violet: false },
    { letter: 'صـ', emphatic: true, violet: false },
    { letter: 'ضـ', emphatic: true, violet: false },
    { letter: 'طـ', emphatic: true, violet: false },
    { letter: 'ظـ', emphatic: true, violet: false },
    { letter: 'عـ', emphatic: false, violet: false },
    
    // Row 4
    { letter: 'غـ', emphatic: true, violet: false },
    { letter: 'فـ', emphatic: false, violet: false },
    { letter: 'قـ', emphatic: true, violet: false },
    { letter: 'كـ', emphatic: false, violet: false },
    { letter: 'لـ', emphatic: false, violet: false },
    { letter: 'مـ', emphatic: false, violet: false },
    
    // Row 5
    { letter: 'نـ', emphatic: false, violet: false },
    { letter: 'هـ', emphatic: false, violet: false },
    { letter: 'و', emphatic: false, violet: false },
    { letter: 'يـ', emphatic: false, violet: false },
    { letter: 'ء', emphatic: false, violet: true }
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
          <span className="font-semibold">📝 Note importante :</span> Les lettres <span className="font-bold">ا, د, ذ, ر, ز, و</span> ne s'attachent jamais après elles et conservent leur forme isolée en début de mot.
        </p>
      </div>

      <footer className="border-t-1 text-white text-center p-6 flex-shrink-0 font-semibold text-sm">
        <div>Leçon 2</div>
        <div className="mt-1">© 2025 Tous droits réservés</div>
      </footer>
    </div>
  );
};

const Page2 = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = 2;

  const playLetterAudio = (letter: string) => {
    const audioFileName = chapter1Page2AudioMappings[letter];
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
    ? "Leçon 2 : Lettres attachées au début d'un mot"
    : "Leçon 2 : Tableau des lettres en position initiale";

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

export default Page2;