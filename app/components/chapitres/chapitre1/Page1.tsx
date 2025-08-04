"use client";

import React from 'react';
import { useAudio } from '@/hooks/useAudio';

const Page1 = () => {
  const { playLetter } = useAudio();
  const emphaticLetters = ['خ', 'ر', 'ص', 'ض', 'ط', 'ظ', 'غ', 'ق'];

  const allLetters = [
    { letter: 'ا' },
    { letter: 'ب' },
    { letter: 'ت' },
    { letter: 'ث' },
    { letter: 'ج' },
    { letter: 'ح' },
    { letter: 'خ' },
    { letter: 'د' },
    { letter: 'ذ' },
    { letter: 'ر' },
    { letter: 'ز' },
    { letter: 'س' },
    { letter: 'ش' },
    { letter: 'ص' },
    { letter: 'ض' },
    { letter: 'ط' },
    { letter: 'ظ' },
    { letter: 'ع' },
    { letter: 'غ' },
    { letter: 'ف' },
    { letter: 'ق' },
    { letter: 'ك' },
    { letter: 'ل' },
    { letter: 'م' },
    { letter: 'ن' },
    { letter: 'ه' },
    { letter: 'و' },
    { letter: 'ي' },
    { letter: 'ء' },
    { letter: 'ة' }
  ];

  // Indices des lettres spéciales : les 3 dernières
  const specialStartIndex = allLetters.length - 2;

  const handleLetterClick = (letter: string) => {
    playLetter(letter);
  };
  return (
    <div 
      className="font-arabic min-h-screen"
      style={{ direction: 'rtl' }}
    >
      <div className="w-full h-full bg-zinc-900 overflow-hidden">
        {/* Header */}
        <div className="bg-arabic-gradient text-white p-6 text-center">
          <div className="text-3xl font-bold mb-4">
           Leçon : lettres seules (non attachées)
          </div>
        </div>

        {/* Alphabet Grid */}
        <div className="p-8 bg-zinc-900">
          <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-7 gap-4 mb-6">
            {allLetters.map((item, index) => (
              <Cell
                key={index}
                letter={item.letter}
                emphatic={emphaticLetters.includes(item.letter)}
                special={index >= specialStartIndex}
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

// Cell Component adapté pour thème sombre + emphatique + spéciale
const Cell = ({ letter, emphatic, special, onClick }: { 
  letter: string; 
  emphatic?: boolean; 
  special?: boolean;
  onClick?: () => void;
}) => {
  let textColor = 'text-white';
  if (emphatic) textColor = 'text-red-400';
  else if (special) textColor = 'text-purple-400';

  return (
    <div 
      className="bg-zinc-800 border border-zinc-700 rounded-xl p-4 text-center min-h-[100px] flex flex-col justify-center items-center hover:bg-zinc-700 transition-all duration-300 hover:scale-105 cursor-pointer"
      onClick={onClick}
    >
      <div className={`text-3xl md:text-4xl font-bold ${textColor} transition-colors`}>
        {letter}
      </div>
    </div>
  );
};

export default Page1;
