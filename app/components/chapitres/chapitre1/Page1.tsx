// components/chapitres/chapitre1/Page1.tsx

"use client";

import React from 'react';

// Mapping audio pour lettres isolées (Chapitre 1 - Page 1)
const chapter1Page1AudioMappings: { [key: string]: string } = {
  'ا': 'chap0_pg0_case1',
  'ب': 'chap0_pg0_case2',
  'ت': 'chap0_pg0_case3',
  'ث': 'chap0_pg0_case4',
  'ج': 'chap0_pg0_case5',
  'ح': 'chap0_pg0_case6',
  'خ': 'chap0_pg0_case7',
  'د': 'chap0_pg0_case8',
  // 'ذ': 'chap0_pg0_case9',
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

const Page1 = () => {
  const playLetterAudio = (letter: string) => {
    const audioFileName = chapter1Page1AudioMappings[letter];
    if (audioFileName) {
      const audio = new Audio(`/audio/chapitre0_1/${audioFileName}.mp3`);
      audio.play().catch(error => {
        console.error('Erreur lors de la lecture audio:', error);
      });
    }
  };

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

  const handleLetterClick = (letter: string) => {
    playLetterAudio(letter);
  };

  return (
    <div className="font-arabic min-h-screen" style={{ direction: 'rtl' }}>
      <div className="w-full h-full bg-zinc-900 overflow-hidden">
        
        {/* Header */}
        <div className="bg-arabic-gradient text-white p-6 text-center">
          <div className="text-3xl font-bold mb-4">
            Leçon : lettres isolées
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

          {/* Footer */}
          <footer className="bg-zinc-800 text-white text-center p-6 flex-shrink-0 font-semibold text-sm">
            <div>Page 1</div>
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

export default Page1;
