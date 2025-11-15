"use client";

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import PageNavigation from '@/app/components/PageNavigation';

// Mapping audio pour lettres isolées
const chapter1Page1AudioMappings: { [key: string]: string } = {
  'ا': 'chap0_pg0_case1',
  'ب': 'chap0_pg0_case2',
  'ت': 'chap0_pg0_case3',
  'ث': 'chap0_pg0_case4',
  'ج': 'chap0_pg0_case5',
  'ح': 'chap0_pg0_case6',
  'خ': 'chap0_pg0_case7',
  'د': 'chap0_pg0_case8',
  'ذ': 'chap0_pg0_case9',
  'ر': 'chap0_pg0_case10',
  'ز': 'chap0_pg0_case11',
  'س': 'chap0_pg0_case12',
  'ش': 'chap0_pg0_case13',
  'ص': 'chap0_pg0_case14',
  'ض': 'chap0_pg0_case15',
  'ط': 'chap0_pg0_case16',
  'ظ': 'chap0_pg0_case17',
  'ع': 'chap0_pg0_case18',
  'غ': 'chap0_pg0_case19',
  'ف': 'chap0_pg0_case20',
  'ق': 'chap0_pg0_case21',
  'ك': 'chap0_pg0_case22',
  'ل': 'chap0_pg0_case23',
  'م': 'chap0_pg0_case24',
  'ن': 'chap0_pg0_case25',
  'ه': 'chap0_pg0_case26',
  'و': 'chap0_pg0_case27',
  'ي': 'chap0_pg0_case28',
  'ء': 'chap0_pg0_case29'
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
    <div className={`text-5xl md:text-5xl lg:text-5xl xl:text-6xl font-bold transition-colors leading-tight ${
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
    <div className="p-4 md:p-8 bg-gray-900">
      <div className="w-full bg-gray-800 rounded-lg p-6 md:p-8">
        <div className="text-white space-y-6 text-lg md:text-xl leading-relaxed">
          <p>
            Nous avons vu la prononciation des lettres de base qui sont les lettres non attachées et que chacune d'elles avaient leur propre point de sortie.
          </p>
          
          <p>
            Parmi les 28 lettres de l'alphabet arabe, il y a <span className="text-red-400 font-semibold">8 lettres emphatiques</span> qu'on doit prononcer d'un son grave (colorées en rouge) et <span className="text-purple-400 font-semibold">2 lettres en violet</span> qui sont des lettres qui ne font pas partie des lettres de l'alphabet arabe mais qui jouent un rôle important.
          </p>
          
          <p>
            Ces lettres sont à apprendre par cœur comme l'alphabet français. Fiez-vous au son et à l'image pour essayer de les sortir de votre mieux.
          </p>
          
          <div className="bg-blue-900/30 border border-blue-500/50 rounded-lg p-4 md:p-6 my-6">
            <p>
              💡 <span className="font-semibold">Astuce :</span> Vous avez la possibilité pendant votre rendu de devoirs de m'envoyer un audio de votre prononciation pour que je puisse corriger par derrière.
            </p>
          </div>
          
          <p>
            Voici à la page précédente un tableau des lettres seules dans l'ordre où vous pourrez cliquer en illimité en essayant de répéter après et de les mémoriser.
          </p>
        </div>
      </div>
      
      <div className="px-4 md:px-8">
        <PageNavigation currentChapter={1} currentPage={1} className="mt-6 mb-4" />
      </div>

      <footer className="border-t-1 text-white text-center p-4 md:p-6 mt-8 flex-shrink-0 font-semibold text-base md:text-lg">
        <div>Leçon 1</div>
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
    { letter: 'ا', emphatic: false, violet: false },
    { letter: 'ب', emphatic: false, violet: false },
    { letter: 'ت', emphatic: false, violet: false },
    { letter: 'ث', emphatic: false, violet: false },
    { letter: 'ج', emphatic: false, violet: false },
    { letter: 'ح', emphatic: false, violet: false },
    
    // Row 2
    { letter: 'خ', emphatic: true, violet: false },
    { letter: 'د', emphatic: false, violet: false },
    { letter: 'ذ', emphatic: false, violet: false },
    { letter: 'ر', emphatic: true, violet: false },
    { letter: 'ز', emphatic: false, violet: false },
    { letter: 'س', emphatic: false, violet: false },
    
    // Row 3
    { letter: 'ش', emphatic: false, violet: false },
    { letter: 'ص', emphatic: true, violet: false },
    { letter: 'ض', emphatic: true, violet: false },
    { letter: 'ط', emphatic: true, violet: false },
    { letter: 'ظ', emphatic: true, violet: false },
    { letter: 'ع', emphatic: false, violet: false },
    
    // Row 4
    { letter: 'غ', emphatic: true, violet: false },
    { letter: 'ف', emphatic: false, violet: false },
    { letter: 'ق', emphatic: true, violet: false },
    { letter: 'ك', emphatic: false, violet: false },
    { letter: 'ل', emphatic: false, violet: false },
    { letter: 'م', emphatic: false, violet: false },
    
    // Row 5
    { letter: 'ن', emphatic: false, violet: false },
    { letter: 'ه', emphatic: false, violet: false },
    { letter: 'و', emphatic: false, violet: false },
    { letter: 'ي', emphatic: false, violet: false },
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
            isActive={activeIndex === index}
            onClick={() => {
              playLetterAudio(item.letter, index);
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

      <div className="px-4 md:px-8">
        <PageNavigation currentChapter={1} currentPage={1} className="mt-6 mb-4" />
      </div>

      <footer className="border-t-1 text-white text-center p-4 md:p-6 flex-shrink-0 font-semibold text-sm md:text-base">
        <div>Leçon 1</div>
        <div className="mt-1">© 2025 Tous droits réservés</div>
      </footer>
    </div>
  );
};

const Page1 = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0); // Première lettre active par défaut
  // ✅ Référence audio globale pour contrôler la lecture
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const totalPages = 2;

  const playLetterAudio = (letter: string, index: number = 0) => {
    // ✅ Arrêter l'audio précédent s'il existe
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }
    
    // ✅ Mettre à jour l'état visuel
    setActiveIndex(index);
    
    const audioFileName = chapter1Page1AudioMappings[letter];
    if (audioFileName) {
      const audio = new Audio(`/audio/chapitre0_1/${audioFileName}.mp3`);
      
      // ✅ Gérer la fin de l'audio
      audio.addEventListener('ended', () => {
        setCurrentAudio(null);
        // Garder la lettre active pour le clignotant
      });
      
      // ✅ Mettre à jour la référence et jouer
      setCurrentAudio(audio);
      audio.play().catch(error => {
        console.error('Erreur lors de la lecture audio:', error);
        setCurrentAudio(null);
        // Garder la lettre active pour le clignotant
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
    ? "Leçon 1 : Explication"
    : "Leçon 1 : Tableaux des lettres seules (non attachées)";

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
        {currentPage === 1 && <AlphabetPage playLetterAudio={playLetterAudio} activeIndex={activeIndex} setActiveIndex={setActiveIndex} />}
      </div>
    </div>
  );
};

export default Page1;