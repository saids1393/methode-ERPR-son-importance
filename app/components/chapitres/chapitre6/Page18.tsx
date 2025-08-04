// components/chapitres/chapitre6/Page18.tsx
"use client";

import React from 'react';
import { useAudio } from '@/hooks/useAudio';

const Page18 = () => {
  const { playLetter } = useAudio();

  const letterData = [
    { letter: 'بَ', specialSign: 'ٰ', signType: 'alif', position: 'top', letterStyle: '' },
    { letter: 'جِ', specialSign: 'ۦ', signType: 'ya', position: 'bottom', letterStyle: 'relative top-[-8px] right-[-5px]' },
    { letter: 'مُ', specialSign: 'ۥ', signType: 'waw', position: 'bottom', letterStyle: '' },
    { letter: 'تَ', specialSign: 'ٰ', signType: 'alif', position: 'top', letterStyle: '' },
    { letter: 'ثِ', specialSign: 'ۦ', signType: 'ya', position: 'bottom', letterStyle: 'relative top-[3px] right-[-7px]' },
    { letter: 'حُ', specialSign: 'ۥ', signType: 'waw', position: 'bottom', letterStyle: 'relative top-[-3px] right-[-4px]' },

    { letter: 'دَ', specialSign: 'ٰ', signType: 'alif', position: 'top', letterStyle: '' },
    { letter: 'ذِ', specialSign: 'ۦ', signType: 'ya', position: 'bottom', letterStyle: '' },
    { letter: 'رُ', specialSign: 'ۥ', signType: 'waw', position: 'bottom', letterStyle: '' },
    { letter: 'زَ', specialSign: 'ٰ', signType: 'alif', position: 'top', letterStyle: '' },
    { letter: 'سِ', specialSign: 'ۦ', signType: 'ya', position: 'bottom', letterStyle: 'relative top-[-3px] right-[-10px]' },
    { letter: 'شُ', specialSign: 'ۥ', signType: 'waw', position: 'bottom', letterStyle: 'relative top-[-3px] right-[-14px]' },

    { letter: 'صَ', specialSign: 'ٰ', signType: 'alif', position: 'top', letterStyle: 'relative top-[3px] right-[-12px]' },
    { letter: 'ضِ', specialSign: 'ۦ', signType: 'ya', position: 'bottom', letterStyle: 'relative top-[-3px] right-[-10px]' },
    { letter: 'طُ', specialSign: 'ۥ', signType: 'waw', position: 'bottom', letterStyle: 'relative top-[3px] right-[-6px]' },
    { letter: 'ظَ', specialSign: 'ٰ', signType: 'alif', position: 'top', letterStyle: '' },
    { letter: 'عِ', specialSign: 'ۦ', signType: 'ya', position: 'bottom', letterStyle: 'relative top-[1px] right-[-10px]' },
    { letter: 'غُ', specialSign: 'ۥ', signType: 'waw', position: 'bottom', letterStyle: 'relative top-[1px] right-[-10px]' },

    { letter: 'فَ', specialSign: 'ٰ', signType: 'alif', position: 'top', letterStyle: '' },
    { letter: 'قِ', specialSign: 'ۦ', signType: 'ya', position: 'bottom', letterStyle: '' },
    { letter: 'كُ', specialSign: 'ۥ', signType: 'waw', position: 'bottom', letterStyle: '' },
    { letter: 'لَ', specialSign: 'ٰ', signType: 'alif', position: 'top', letterStyle: '' },
    { letter: 'مِ', specialSign: 'ۦ', signType: 'ya', position: 'bottom', letterStyle: '' },
    { letter: 'نُ', specialSign: 'ۥ', signType: 'waw', position: 'bottom', letterStyle: 'relative top-[1px] right-[-10px]' },

    { letter: 'هَ', specialSign: 'ٰ', signType: 'alif', position: 'top', letterStyle: '' },
    { letter: 'وَ', specialSign: 'ٰ', signType: 'alif', position: 'top', letterStyle: '' },
    { letter: 'يِ', specialSign: 'ۦ', signType: 'ya', position: 'bottom', letterStyle: 'relative top-[1px] right-[-10px]' },
    { letter: 'أُ', specialSign: 'ۥ', signType: 'waw', position: 'bottom', letterStyle: '' },
    { letter: 'إِ', specialSign: 'ۦ', signType: 'ya', position: 'bottom', letterStyle: '' },
   

 
    { letter: 'ةِ', specialSign: 'ۦ', signType: 'ya', position: 'bottom', letterStyle: '' },
    { letter: 'ءُ', specialSign: 'ۥ', signType: 'waw', position: 'bottom', letterStyle: '' },
    { letter: 'خَ', specialSign: 'ٰ', signType: 'alif', position: 'top', letterStyle: '' },
    { letter: 'ذِ', specialSign: 'ۦ', signType: 'ya', position: 'bottom', letterStyle: '' },
    { letter: 'زُ', specialSign: 'ۥ', signType: 'waw', position: 'bottom', letterStyle: '' }
  ];

  const handleLetterClick = (letter: string) => {
    const cleanLetter = letter.replace(/[َُِ]/g, '');
    playLetter(cleanLetter);
  };

  return (
    <div className="font-arabic min-h-screen" style={{ direction: 'rtl' }}>
      <div className="w-full h-full bg-zinc-900 overflow-hidden">
        {/* Header */}
        <div className="bg-arabic-gradient text-white p-6 text-center">
          <div className="text-3xl md:text-3xl font-bold">Leçon : symbole Alif saghirah - Ya saghirah - Waw saghirah</div>
        </div>

        {/* Letters Grid */}
        <div className="p-8 bg-zinc-900">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
              {letterData.map((item, index) => (
                <SpecialLetterCard
                  key={index}
                  letter={item.letter}
                  specialSign={item.specialSign}
                  signType={item.signType}
                  position={item.position}
                  letterStyle={item.letterStyle}
                  onClick={() => handleLetterClick(item.letter)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-zinc-800 text-white text-center p-6 flex-shrink-0 font-semibold text-sm">
          <div>Page 18</div>
          <div className="mt-1">© 2025 Tous droits réservés</div>
        </footer>
      </div>
    </div>
  );
};

// Composant individuel avec positionnement inspiré du CSS original
const SpecialLetterCard = ({
  letter,
  specialSign,
  signType,
  position,
  letterStyle,
  onClick,
}: {
  letter: string;
  specialSign: string;
  signType: string;
  position: string;
  letterStyle?: string;
  onClick?: () => void;
}) => {
  const getSignColor = (type: string) => {
    switch (type) {
      case 'alif':
        return 'text-amber-400';
      case 'ya':
        return 'text-sky-400';
      case 'waw':
        return 'text-emerald-400';
      default:
        return 'text-zinc-400';
    }
  };

  const getSignSize = (type: string) => {
    switch (type) {
      case 'alif':
        return 'text-[40px]';
      case 'ya':
        return 'text-[24px]';
      case 'waw':
        return 'text-[27px]';
      default:
        return 'text-xl';
    }
  };

  const getCustomPosition = (type: string, pos: string) => {
    if (type === 'alif' && pos === 'top') {
      return 'absolute top-[-12px] right-[25px]';
    } else if (type === 'ya' && pos === 'bottom') {
      return 'absolute bottom-[-24px] right-[27px]';
    } else if (type === 'waw' && pos === 'bottom') {
      return 'absolute bottom-[-24px] right-[27px]';
    } else {
      return 'absolute';
    }
  };

  return (
    <div 
      className="bg-zinc-800 border border-zinc-700 rounded-xl p-4 text-center hover:bg-zinc-700 transition-all duration-300 group min-h-[110px] flex items-center justify-center relative cursor-pointer"
      onClick={onClick}
    >
      <div className="relative">
        {/* Lettre principale */}
        <div
          className={`
            text-3xl md:text-4xl font-bold text-white group-hover:scale-105 transition-transform duration-300
            ${letterStyle ?? ''}
          `}
        >
          {letter}
        </div>

        {/* Signe spécial avec position précise */}
        <span
          className={`
            ${getSignColor(signType)} 
            ${getSignSize(signType)} 
            ${getCustomPosition(signType, position)}
            font-bold select-none pointer-events-none
          `}
        >
          {specialSign}
        </span>
      </div>
    </div>
  );
};

export default Page18;
