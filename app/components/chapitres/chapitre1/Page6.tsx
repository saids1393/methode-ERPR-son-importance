"use client";

import React, { use } from 'react';

import { useAudio } from '@/hooks/useAudio';

const Page6 = () => {
  const { playWord } = useAudio();

  const words = [
    'في', 'من', 'ق', 'قد', 'ل', 'هو',
    'ما', 'أن', 'لم', 'كل', 'ثم', 'هل',
    'عن', 'ر', 'به', 'له', 'رب', 'قل',
    'هم', 'هو', 'نا', 'كم', 'أي', 'ف',
    'نور', 'عبد', 'نار', 'يدع', 'فوز', 'ع',
    'ملك', 'نهر', 'قمر', 'غيب', 'رسل', 'نفس',
    'ضر', 'صمت', 'ح', 'خير', 'علم', 'قلب',
    'خلق', 'غفر', 'سجد', 'عدة', 'خوف', 'صدق',
    'كفر', 'نصر', 'س', 'سؤل', 'أمر', 'يئس',
  ];

  // Fonction simplifiée : rendre le mot entier directement en blanc
  const renderWordWithColors = (word: string) => {
    return word;
  };

  const handleWordClick = (word: string) => {
    playWord(word);
  };

  return (
    <div
      className="font-arabic min-h-screen"
      style={{ direction: 'rtl' }}
    >
      <div className="w-full h-full bg-zinc-900 overflow-hidden">
        {/* Header */}
        <div className="bg-arabic-gradient text-white p-6 text-center">
          <div className="text-3xl font-bold mb-4">Exercice : reconnaissance des lettres seules et attachées</div>
        </div>

        {/* Words Grid */}
        <div className="p-8 bg-zinc-900">
          <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-7 gap-4 mb-6">
            {words.map((word, index) => (
              <WordCell key={index} word={word} renderWordWithColors={renderWordWithColors} onClick={() => handleWordClick(word)} />
            ))}
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-zinc-800 text-white text-center p-6 flex-shrink-0 font-semibold text-sm">
          <div>Page 6</div>
          <div className="mt-1">© 2025 Tous droits réservés</div>
        </footer>
      </div>
    </div>
  );
};

// WordCell Component avec texte blanc uniforme
const WordCell = ({
  word,
  renderWordWithColors,
  onClick,
}: {
  word: string;
  renderWordWithColors: (word: string) => React.ReactNode;
  onClick?: () => void;
}) => {
  return (
    <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-4 text-center min-h-[80px] flex flex-col justify-center items-center hover:bg-zinc-700 transition-all duration-300 hover:scale-105 cursor-pointer" onClick={onClick}>
      <div className="text-3xl md:text-4xl font-bold text-white">
        {renderWordWithColors(word)}
      </div>
    </div>
  );
};

export default Page6;
