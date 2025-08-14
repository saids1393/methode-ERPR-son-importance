"use client";

import React from 'react';
import { useAudio } from '@/';


// Mapping audio pour le Chapitre 1, Page 4
const chapter1Page4AudioMappings: { [key: string]: string } = {
  'ـا': 'chap1_pg4_case1',
  'ـب': 'chap1_pg4_case2',
  'ـت': 'chap1_pg4_case3',
  'ـث': 'chap1_pg4_case4',
  'ـج': 'chap1_pg4_case5',
  'ـح': 'chap1_pg4_case6',
  'ـخ': 'chap1_pg4_case7',
  'ـد': 'chap1_pg4_case8',
  'ـذ': 'chap1_pg4_case9',
  'ـر': 'chap1_pg4_case10',
  'ـز': 'chap1_pg4_case11',
  'ـس': 'chap1_pg4_case12',
  'ـش': 'chap1_pg4_case13',
  'ـص': 'chap1_pg4_case14',
  'ـض': 'chap1_pg4_case15',
  'ـط': 'chap1_pg4_case16',
  'ـظ': 'chap1_pg4_case17',
  'ـع': 'chap1_pg4_case18',
  'ـغ': 'chap1_pg4_case19',
  'ـف': 'chap1_pg4_case20',
  'ـق': 'chap1_pg4_case21',
  'ـك': 'chap1_pg4_case22',
  'ـل': 'chap1_pg4_case23',
  'ـم': 'chap1_pg4_case24',
  'ـن': 'chap1_pg4_case25',
  'ـه': 'chap1_pg4_case26',
  'ـو': 'chap1_pg4_case27',
  'ـي': 'chap1_pg4_case28',
  'ء': 'chap1_pg4_case29',
  'ـة': 'chap1_pg4_case30'
};


const Page4 = () => {
  
  const playLetterAudio = (letter: string) => {
  const audioFileName = chapter1Page4AudioMappings[letter];
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

// Modifier handleLetterClick pour utiliser la nouvelle fonction
const handleLetterClick = (letter: string) => {
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
            Leçon : lettres attachées à la fin d'un mot
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
          <div>Page 4</div>
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

export default Page4;