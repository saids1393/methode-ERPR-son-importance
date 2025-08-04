"use client";

import React from 'react';

import { useAudio } from '@/hooks/useAudio';

const Page7 = () => {
  const { playWord } = useAudio();

  const hurufMuqattaah = [
    // Row 1
    { letters:'الٓمٓ', emphatic: false },
    { letters:'الٓمٓصٓ', emphatic: true },
    { letters: 'الٓر',emphatic: false },
    { letters: 'الٓمٓر', emphatic: true },
    
    // Row 2
    { letters: 'كٓهيعٓصٓ', emphatic: false },
    { letters: 'طه', emphatic: true },
    { letters: 'طسٓمٓ', emphatic: false },
    { letters: 'طسٓ', emphatic: true },
    
    // Row 3
    { letters: 'يسٓ', emphatic: false },
    { letters: 'صٓ', emphatic: true },
    { letters: 'قٓ', emphatic: false },
    { letters: 'نٓ', emphatic: true },
    
    // Row 4
    { letters: 'حمٓ', emphatic: false },
    { letters: 'حمٓ عٓسٓقٓ', emphatic: true }
  ];

  const handleHurufClick = (letters: string) => {
    playWord(letters);
  };

  return (
    <div 
      className="font-arabic min-h-screen"
      style={{ direction: 'rtl' }}
    >
      <div className="w-full h-full bg-zinc-900 overflow-hidden">
        {/* Header */}
        <div className="bg-arabic-gradient text-white p-6 text-center">
          <div className="text-3xl font-bold mb-4">Exercice : reconnaissance des lettres séparées au début de certaines sourates</div>
        </div>
        
        {/* Huruf Muqattaah Grid */}
        <div className="p-8 bg-zinc-900">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
            {hurufMuqattaah.map((item, index) => (
              <HurufCell 
                key={index} 
                letters={item.letters}
                emphatic={item.emphatic}
                onClick={() => handleHurufClick(item.letters)}
              />
            ))}
          </div>
          
        </div>
        
        {/* Footer standard */}
        <footer className="bg-zinc-800 text-white text-center p-6 flex-shrink-0 font-semibold text-sm">
          <div>Page 7</div>
          <div className="mt-1">© 2025 Tous droits réservés</div>
        </footer>
      </div>
    </div>
  );
};

// HurufCell Component simplifié sans le nom
const HurufCell = ({ letters, emphatic, onClick }: { 
  letters: string;
  emphatic?: boolean;
  onClick?: () => void;
}) => (
  <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-4 text-center min-h-[120px] flex flex-col justify-center items-center hover:bg-zinc-700 transition-all duration-300 hover:scale-105 cursor-pointer" onClick={onClick}>
    <div className={`text-2xl md:text-3xl font-bold transition-colors ${
      emphatic ? 'text-red-400' : 'text-white'
    }`}>
      {letters}
    </div>
  </div>
);

export default Page7;