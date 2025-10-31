"use client";

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import PageNavigation from '@/app/components/PageNavigation';

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

const Cell = ({ letter, emphatic, violet, onClick, isActive }: {
  letter: string;
  emphatic?: boolean;
  violet?: boolean;
  onClick?: () => void;
  isActive?: boolean;
}) => (
  <div
    className={`border border-zinc-500 rounded-xl p-2 md:p-3 lg:p-4 text-center min-h-[90px] md:min-h-[100px] lg:min-h-[110px] flex flex-col justify-center items-center hover:bg-zinc-700 transition-all duration-300 hover:scale-105 cursor-pointer mx-1 ${
      isActive ? 'pulse-active' : ''
    }`}
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
            Terminons notre exploration des formes des lettres arabes avec la <span className="text-purple-400 font-semibold">position à la fin du mot</span>.
            Cette forme est particulièrement importante car elle montre comment les lettres se terminent.
          </p>

          <p>
            Lorsqu'une lettre se trouve à la <span className="font-semibold">fin d'un mot</span>, elle ne s'attache qu'à la lettre précédente mais pas à la suivante (puisqu'il n'y en a pas).
            <br />
            👉 Et comme l’arabe se lit <span className="text-yellow-400 font-semibold">de droite vers la gauche</span>,
            la <span className="font-semibold">lettre de fin</span> sera donc <span className="underline">la dernière lettre, placée tout à gauche du mot</span>.
            <br />
            🧠 <span className="font-semibold">Technique :</span> repère toujours <span className="text-yellow-400 font-semibold">la lettre la plus à gauche</span> :
            c’est elle qu’on appelle <span className="text-purple-400 font-semibold">lettre attachée à la fin du mot</span>.
          </p>

          <p>
            🧩 <span className="font-semibold">Exemples (lettre en fin de mot) :</span>
            <br />
            • La lettre ب (Baa) devient <span dir="rtl" className="text-yellow-400 inline-block">ـب</span> → <span dir="rtl" className="font-semibold inline-block">كلب</span>
            <br />
            • La lettre م (Miim) devient <span dir="rtl" className="text-yellow-400 inline-block">ـم</span> → <span dir="rtl" className="font-semibold inline-block">قلم</span>
            <br />
            • La lettre ل (Laam) devient <span dir="rtl" className="text-yellow-400 inline-block">ـل</span> → <span dir="rtl" className="font-semibold inline-block">جبل</span>
            <br />
            <br />
            🚂 <span className="font-semibold">Comme un wagon :</span> la lettre finale est le dernier wagon du train 🚃, celui qui termine la chaîne.
            <br />
            Exemple : <span dir="rtl" className="font-semibold inline-block text-green-400">قـ + ل + ـم = قلم</span>  
            → Le dernier wagon (م) se trouve <span className="underline">à gauche</span>, car en arabe on lit toujours <span className="text-yellow-400 font-semibold">de droite vers la gauche</span>.
          </p>

          <p>
            Comme pour les autres positions, les <span className="text-purple-400 font-semibold">6 lettres spéciales</span> :
            <span className="font-bold"> ا, د, ذ, ر, ز, و</span> ne s'attachent jamais avant elles, même en fin de mot.
            Elles conservent donc leur forme isolée.
          </p>

          <p>
            <span className="text-purple-400 font-semibold">Note spéciale :</span> La lettre <span className="font-bold"> ـة </span> (Taa' marrboutah, dite en français “Taa liée/fermée”)
            est une forme particulière qui n'apparaît qu'à la fin des mots et indique souvent un nom féminin.
          </p>

          <div className="bg-blue-900/30 border border-blue-500/50 rounded-lg p-4 md:p-6 my-6">
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

      <footer className="border-t-1 text-white text-center p-4 md:p-6 mt-8 flex-shrink-0 font-semibold text-base md:text-lg">
        <div>Leçon 4</div>
        <div className="mt-1">© 2025 Tous droits réservés</div>
      </footer>
    </div>
  );
};


const AlphabetPage = ({ playLetterAudio, activeIndex, setActiveIndex }: {
  playLetterAudio: (letter: string) => void;
  activeIndex: number;
  setActiveIndex: (index: number) => void;
}) => {
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
    <div className="p-2 md:p-4 lg:p-8 bg-gray-900">
      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-2 md:gap-3 lg:gap-4 mb-6" dir="rtl">
        {letters.map((item, index) => (
          <Cell
            key={index}
            letter={item.letter}
            emphatic={item.emphatic}
            violet={item.violet}
            isActive={activeIndex === index}
            onClick={() => {
              setActiveIndex(index);
              playLetterAudio(item.letter);
            }}
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
          <span className="font-semibold">📝 Note importante :</span> Les lettres <span className="font-bold">ا, د, ذ, ر, ز, و</span> ne s'attachent jamais avant elles et conservent leur forme isolée même en fin de mot.
        </p>
      </div>

      {/* Information sur le tā' marbūṭa */}
      <div className="bg-green-900/30 border border-green-500/50 rounded-lg p-4 md:p-6 mb-6">
        <p className="text-base md:text-lg leading-relaxed text-white text-center">
          <span className="font-semibold">✨ Particularité :</span> La lettre <span className="font-bold">ـة </span> (Taa' marrboutah dit en français Taa lié/fermé) n'apparaît qu'à la fin des mots et indique souvent un nom féminin.
        </p>
      </div>

      
      <PageNavigation currentChapter={1} currentPage={4} className="mt-6 mb-4" />

<footer className="border-t-1 text-white text-center p-4 md:p-6 flex-shrink-0 font-semibold text-sm md:text-base">
        <div>Leçon 4</div>
        <div className="mt-1">© 2025 Tous droits réservés</div>
      </footer>
    </div>
  );
};

const Page4 = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
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
        {currentPage === 1 && <AlphabetPage playLetterAudio={playLetterAudio} activeIndex={activeIndex} setActiveIndex={setActiveIndex} />}
      </div>
    </div>
  );
};
export default Page4;