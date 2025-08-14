// components/chapitres/chapitre1/Page2.tsx

"use client";

import React from 'react';
import { useAudio } from '@/hooks/useAudio';

// Mapping audio pour le Chapitre 1, Page 2
const chapter1Page2AudioMappings: { [key: string]: string } = {
  'ا': 'chap1_pg2_case1',
  'بـ': 'chap1_pg2_case2',
  'تـ': 'chap1_pg2_case3',
  'ثـ': 'chap1_pg2_case4',
  'جـ': 'chap1_pg2_case5',
  'حـ': 'chap1_pg2_case6',
  'خـ': 'chap1_pg2_case7',
  'د': 'chap1_pg2_case8',
  'ذ': 'chap1_pg2_case9',
  'ر': 'chap1_pg2_case10',
  'ز': 'chap1_pg2_case11',
  'سـ': 'chap1_pg2_case12',
  'شـ': 'chap1_pg2_case13',
  'صـ': 'chap1_pg2_case14',
  'ضـ': 'chap1_pg2_case15',
  'طـ': 'chap1_pg2_case16',
  'ظـ': 'chap1_pg2_case17',
  'عـ': 'chap1_pg2_case18',
  'غـ': 'chap1_pg2_case19',
  'فـ': 'chap1_pg2_case20',
  'قـ': 'chap1_pg2_case21',
  'كـ': 'chap1_pg2_case22',
  'لـ': 'chap1_pg2_case23',
  'مـ': 'chap1_pg2_case24',
  'نـ': 'chap1_pg2_case25',
  'هـ': 'chap1_pg2_case26',
  'و': 'chap1_pg2_case27',
  'يـ': 'chap1_pg2_case28',
  'ء': 'chap1_pg2_case29'
};

const Page2 = () => {
  // Fonction pour jouer l'audio avec le mapping spécifique
  const playLetterAudio = (letter: string) => {
    const audioFileName = chapter1Page2AudioMappings[letter];
    if (audioFileName) {
      const audio = new Audio(`/audio/${audioFileName}.mp3`);
      audio.play().catch(error => {
        console.error('Erreur lors de la lecture audio:', error);
      });
    }
  };

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

  const handleLetterClick = (letter: string) => {
    // Utiliser directement la lettre avec ses attachements pour le mapping
    playLetterAudio(letter);
  };

  return (
    <div 
      className="font-arabic min-h-screen"
      style={{ direction: 'rtl' }}
    >
      <div className="w-full h-full bg-zinc-900 overflow-hidden">
        {/* Header */}
        <div className="bg-arabic-gradient text-white p-6 text-center">
          <div className="text-3xl font-bold mb-4">Leçon : lettres attachées au début d'un mot</div>
        </div>
        
        {/* Alphabet Grid */}
        <div className="p-8 bg-zinc-900">
          <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-7 gap-4 mb-6">
            {letters.map((item, index) => (
              <Cell 
                key={index} 
                letter={item.letter} 
                emphatic={item.emphatic}
                violet={item.violet}
                onClick={() => handleLetterClick(item.letter)}
              />
            ))}
          </div>
          {/* Légende simplifiée */}
          <div className="bg-zinc-800 rounded-lg p-4 mb-4">
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
           {/* Footer */}
        <footer className="bg-zinc-800 text-white text-center p-6 flex-shrink-0 font-semibold text-sm">
          <div>Page 2</div>
          <div className="mt-1">© 2025 Tous droits réservés</div>
        </footer>
        </div>
      </div>
    </div>
  );
};

// Cell Component adapté pour le thème sombre
const Cell = ({ letter, emphatic, violet, onClick }: { 
  letter: string; 
  emphatic?: boolean;
  violet?: boolean;
  onClick?: () => void;
}) => (
  <div 
    className="bg-zinc-800 border border-zinc-700 rounded-xl p-4 text-center min-h-[100px] flex flex-col justify-center items-center hover:bg-zinc-700 transition-all duration-300 hover:scale-105 cursor-pointer"
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

export default Page2;