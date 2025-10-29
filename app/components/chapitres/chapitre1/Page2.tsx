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
    className="border border-zinc-500 rounded-xl p-2 md:p-3 lg:p-4 text-center min-h-[90px] md:min-h-[100px] lg:min-h-[110px] flex flex-col justify-center items-center hover:bg-zinc-700 transition-all duration-300 hover:scale-105 cursor-pointer mx-1"
    onClick={onClick}
  >
    <div className={`text-5xl md:text-5xl lg:text-5xl xl:text-6xl font-bold transition-colors leading-tight ${emphatic ? 'text-red-400' :
      violet ? 'text-purple-400' :
        'text-white'
      }`}>
      {letter}
    </div>
  </div>
);

const IntroductionPage = () => {
  return (
    <div className="p-4 md:p-8 bg-gray-900">
      <div className="w-full bg-gray-800 rounded-lg p-6 md:p-8">
        <div className="text-white space-y-6 text-lg md:text-xl leading-relaxed">

          <p>
            En arabe, chaque lettre peut avoir <span className="text-purple-400 font-semibold">trois formes principales</span> :
            <br />
            ➤ au <span className="font-semibold">début</span> d'un mot,
            ➤ au <span className="font-semibold">milieu</span> d'un mot,
            ➤ à la <span className="font-semibold">fin</span> d'un mot.
          </p>

          <p>
            Dans cette leçon, nous allons nous concentrer sur les <span className="text-purple-400 font-semibold">lettres en début de mot</span>.
            Leur forme change légèrement pour pouvoir se relier à la lettre suivante.
            <br />
            👉 Et comme l’arabe se lit <span className="text-yellow-400 font-semibold">de droite vers la gauche</span>, 
            le <span className="font-semibold">wagon du début</span> se trouve donc à <span className="underline">droite</span> du mot.
            <br />
            🧠 <span className="font-semibold">Technique :</span> ce sera toujours <span className="text-yellow-400 font-semibold">la première lettre en partant de la droite</span>,
            appelée <span className="text-purple-400 font-semibold">lettre attachée au début d’un mot</span>.
          </p>

          <p>
            🧩 <span className="font-semibold">Exemples :</span>
            <br />
            • La lettre ب (Baa) devient <span dir="rtl" className="text-yellow-400 inline-block">بـ</span> → <span dir="rtl" className="font-semibold inline-block">بيت</span>
            <br />
            • La lettre س (Siin) devient <span dir="rtl" className="text-yellow-400 inline-block">سـ </span> → <span dir="rtl" className="font-semibold inline-block">سلام</span>
            <br />
            • La lettre م (Miim) devient <span dir="rtl" className="text-yellow-400 inline-block">مـ </span> → <span dir="rtl" className="font-semibold inline-block">مدرسة</span>
            <br />
            <br />
            🚂 <span className="font-semibold">Comme un wagon :</span> Les lettres s’attachent entre elles, formant une chaîne continue.
            <br />
            Exemple : <span dir="rtl" className="font-semibold inline-block text-green-400">بـ + سـ + م = بسم</span> (Bism)  
            → On voit que chaque lettre s’accroche à la suivante comme les wagons d’un train 🚃🚃🚃,
            mais <span className="underline">en partant de la droite vers la gauche</span>, car en arabe on lit de droite à gauche.
          </p>

          <p>
            Cependant, il existe <span className="text-purple-400 font-semibold">6 lettres spéciales</span> qui <span className="underline">ne s'attachent jamais après elles</span> :
            <span className="font-bold"> ا, د, ذ, ر, ز, و</span>.
            Ces lettres gardent toujours leur forme isolée, même au début d'un mot.
          </p>

          <div className="bg-blue-900/30 border border-blue-500/50 rounded-lg p-4 md:p-6 my-6">
            <p>
              💡 <span className="font-semibold">Astuce :</span> Même si les lettres changent de forme selon leur position, on peut toujours les reconnaître grâce à leurs <span className="font-semibold">points</span> et à leur <span className="font-semibold">structure générale</span>.
              En les observant bien, tu apprendras à les distinguer facilement !
            </p>
          </div>

          <p>
            À la page suivante, tu verras le <span className="text-purple-400 font-semibold">tableau complet</span> des lettres arabes dans leur forme initiale.
            Clique sur chaque lettre pour écouter sa prononciation et t'habituer à sa forme lorsqu'elle apparaît au début d'un mot.
          </p>
        </div>
      </div>

      <footer className="border-t-1 text-white text-center p-4 md:p-6 mt-8 flex-shrink-0 font-semibold text-base md:text-lg">
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
    <div className="p-2 md:p-4 lg:p-8 bg-gray-900">
      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-2 md:gap-3 lg:gap-4 mb-6" dir="rtl">
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
      <div className="bg-purple-900/30 border border-purple-500/50 rounded-lg p-4 md:p-6 mb-6">
        <p className="text-base md:text-lg leading-relaxed text-white text-center">
          <span className="font-semibold">📝 Note importante :</span> Les lettres <span className="font-bold">ا, د, ذ, ر, ز, و</span> ne s'attachent jamais après elles et conservent leur forme isolée en début de mot.
        </p>
      </div>

      <footer className="border-t-1 text-white text-center p-4 md:p-6 flex-shrink-0 font-semibold text-sm md:text-base">
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
        <div className="text-white p-4 md:p-6 text-center border-b-2">
          <div className="text-2xl md:text-3xl font-bold mb-2">
            {pageTitle}
          </div>
          {/* Phrase ajoutée seulement pour la page d'exercice */}
          {currentPage === 1 && (
            <div className="text-md md:text-lg text-amber-300">
              Cliquez pour écouter chaque lettre et répétez après.
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center px-2 md:px-4 lg:px-8 py-4">
          <button
            onClick={goToPreviousPage}
            disabled={currentPage === 0}
            className={`w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 rounded-full border-2 flex items-center justify-center transition-all ${currentPage === 0
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
            className={`w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 rounded-full border-2 flex items-center justify-center transition-all ${currentPage === totalPages - 1
              ? 'border-gray-600 text-gray-600 cursor-not-allowed'
              : 'border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white hover:scale-110'
              }`}
          >
            <ChevronRight size={16} className="md:w-5 md:h-5 lg:w-6 lg:h-6" />
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