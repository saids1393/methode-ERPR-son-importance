"use client";

import React from 'react';
import { useAudio } from '@/';

// Mapping audio pour le Chapitre 1, Page 3
const chapter1Page3AudioMappings: { [key: string]: string } = {
  'ـا': 'chap1_pg3_case1',
  'ـبـ': 'chap1_pg3_case2',
  'ـتـ': 'chap1_pg3_case3',
  'ـثـ': 'chap1_pg3_case4',
  'ـجـ': 'chap1_pg3_case5',
  'ـحـ': 'chap1_pg3_case6',
  'ـخـ': 'chap1_pg3_case7',
  'ـد': 'chap1_pg3_case8',
  'ـذ': 'chap1_pg3_case9',
  'ـر': 'chap1_pg3_case10',
  'ـز': 'chap1_pg3_case11',
  'ـسـ': 'chap1_pg3_case12',
  'ـشـ': 'chap1_pg3_case13',
  'ـصـ': 'chap1_pg3_case14',
  'ـضـ': 'chap1_pg3_case15',
  'ـطـ': 'chap1_pg3_case16',
  'ـظـ': 'chap1_pg3_case17',
  'ـعـ': 'chap1_pg3_case18',
  'ـغـ': 'chap1_pg3_case19',
  'ـفـ': 'chap1_pg3_case20',
  'ـقـ': 'chap1_pg3_case21',
  'ـكـ': 'chap1_pg3_case22',
  'ـلـ': 'chap1_pg3_case23',
  'ـمـ': 'chap1_pg3_case24',
  'ـنـ': 'chap1_pg3_case25',
  'ـهـ': 'chap1_pg3_case26',
  'ـو': 'chap1_pg3_case27',
  'ـيـ': 'chap1_pg3_case28',
  'ء': 'chap1_pg3_case29'
};

const Page3 = () => {
  // Fonction pour jouer l'audio avec le mapping spécifique
  const playLetterAudio = (letter: string) => {
    const audioFileName = chapter1Page3AudioMappings[letter];
    if (audioFileName) {
      const audio = new Audio(`/audio/${audioFileName}.mp3`);
      audio.play().catch(error => {
        console.error('Erreur lors de la lecture audio:', error);
      });
    }
  };

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
          <div className="text-3xl font-bold mb-2">
          Leçon : lettres attachées au milieu d'un mot
          </div>
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
        </div>
        
        
        {/* Footer standard */}
        <footer className="bg-zinc-800 text-white text-center p-6 flex-shrink-0 font-semibold text-sm">
          <div>Page 3</div>
          <div className="mt-1">© 2025 Tous droits réservés</div>
        </footer>
      </div>
    </div>
  );
};

// Cell Component simplifié sans le nom
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

export default Page3;