"use client";

import React from 'react';
import { useAudio } from '@/hooks/useAudio';

const Page20 = () => {
  const { playWord } = useAudio();

  // Prépare les mots complets
  const words = [
    'بَوْ', 'بَيْ',
    'تَوْ', 'تَيْ',
    'ثَوْ', 'ثَيْ',
    'جَوْ', 'جَيْ',
    'حَوْ', 'حَيْ',
    'خَوْ', 'خَيْ',
    'دَوْ', 'دَيْ',
    'ذَوْ', 'ذَيْ',
    'رَوْ', 'رَيْ',
    'زَوْ', 'زَيْ',
    'سَوْ', 'سَيْ',
    'شَوْ', 'شَيْ',
    'صَوْ', 'صَيْ',
    'ضَوْ', 'ضَيْ',
    'طَوْ', 'طَيْ',
    'ظَوْ', 'ظَيْ',
    'عَوْ', 'عَيْ',
    'غَوْ', 'غَيْ',
  ];

  const handleWordClick = (word: string) => {
    playWord(word);
  };

  return (
    <div className="font-arabic min-h-screen" style={{ direction: 'rtl' }}>
      <div className="w-full h-full bg-zinc-900 overflow-hidden">
        {/* En-tête */}
        <div className="bg-arabic-gradient text-white p-6 text-center">
          <div className="text-3xl md:text-3xl font-bold">
            Leçon : lettres douces
          </div>
        </div>

        {/* Contenu */}
        <div className="p-8 bg-zinc-900">
          <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-8">
            {words.map((word, index) => (
              <DiphthongCard key={index} word={word} onClick={() => handleWordClick(word)} />
            ))}
          </div>
        </div>

        {/* Pied de page */}
        <footer className="bg-zinc-800 text-white text-center p-6 flex-shrink-0 font-semibold text-sm">
          <div>Page 20</div>
          <div className="mt-1">© 2025 Tous droits réservés</div>
        </footer>
      </div>
    </div>
  );
};

// Carte pour chaque mot doux (lettre + fatha + lettre douce)
const DiphthongCard = ({ word, onClick }: { word: string; onClick?: () => void }) => (
  <div 
    className="bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-center hover:bg-zinc-700 transition-all duration-300 group min-h-[90px] flex items-center justify-center cursor-pointer"
    onClick={onClick}
  >
    <div
      className="text-2xl md:text-3xl font-bold leading-relaxed text-white group-hover:scale-105 transition-transform duration-300 break-keep"
      dir="rtl"
      lang="ar"
      style={{ fontFeatureSettings: '"calt" 1, "liga" 1' }}
    >
      {word}
    </div>
  </div>
);

export default Page20;
