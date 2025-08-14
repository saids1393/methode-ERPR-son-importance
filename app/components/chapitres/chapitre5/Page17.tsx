"use client";

import React from 'react';
import { useAudio } from '@/';

// Mapping audio pour le Chapitre 5, Page 17 (mots avec voyelles)
const chapter5Page17AudioMappings: { [key: string]: string } = {
  // Mots avec voyelles simples et doubles
  'وَرَقٌ': 'chap5_pg17_word1',
  'قَلَمٌ': 'chap5_pg17_word2',
  'مَلَكٌ': 'chap5_pg17_word3',
  'بَشَرٌ': 'chap5_pg17_word4',
  'جَبَلٌ': 'chap5_pg17_word5',
  'بَقَرٌ': 'chap5_pg17_word6',
  'ثَمَرٌ': 'chap5_pg17_word7',
  'حَجَرٌ': 'chap5_pg17_word8',
  'لَبَنٌ': 'chap5_pg17_word9',
  'قَمَرٌ': 'chap5_pg17_word10',
  'وَلَدٌ': 'chap5_pg17_word11',
  'فَمٌ': 'chap5_pg17_word12',
  'رَجُلٌ': 'chap5_pg17_word13',
  'سَمَكٌ': 'chap5_pg17_word14',
  'يَدٌ': 'chap5_pg17_word15',
  'زَمَنٌ': 'chap5_pg17_word16'
};

const Page17 = () => {
  // Fonction pour jouer l'audio avec le mapping spécifique
  const playLetterAudio = (vowelLetter: string) => {
    const audioFileName = chapter5Page17AudioMappings[vowelLetter];
    if (audioFileName) {
      const audio = new Audio(`/audio/${audioFileName}.mp3`);
      audio.play().catch(error => {
        console.error('Erreur lors de la lecture audio:', error);
      });
    }
  };

  const words = [
    'وَرَقٌ',
    'قَلَمٌ',
    'مَلَكٌ',
    'بَشَرٌ',
    'جَبَلٌ',
    'بَقَرٌ',
    'ثَمَرٌ',
    'حَجَرٌ',
    'لَبَنٌ',
    'قَمَرٌ',
    'وَلَدٌ',
    'فَمٌ',
    'رَجُلٌ',
    'وَلَدٌ',
    'سَمَكٌ',
    'يَدٌ',
    'زَمَنٌ',
  ];

  // Modifier handleLetterClick pour utiliser la nouvelle fonction
  const handleLetterClick = (vowelLetter: string) => {
    playLetterAudio(vowelLetter);
  };

  function handleWordClick(word: string): void {
    throw new Error('Function not implemented.');
  }

  return (
    <div className="font-arabic min-h-screen" style={{ direction: 'rtl' }}>
      <div className="w-full h-full bg-zinc-900 overflow-hidden">
        {/* En-tête */}
        <div className="bg-arabic-gradient text-white p-6 text-center">
          <div className="text-3xl md:text-3xl font-bold">
            Exercice : reconnaissance des mots avec voyelles simples et doubles
          </div>
        </div>

        {/* Contenu */}
        <div className="p-8 bg-zinc-900">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-8">
              {words.map((word, index) => (
                <WordCard key={index} word={word} onClick={() => handleWordClick(word)} />
              ))}
            </div>
          </div>
        </div>

        {/* Pied de page */}
        <footer className="bg-zinc-800 text-white text-center p-6 flex-shrink-0 font-semibold text-sm">
          <div>Page 17</div>
          <div className="mt-1">© 2025 Tous droits réservés</div>
        </footer>
      </div>
    </div>
  );
};

const WordCard = ({ word, onClick }: { word: string; onClick?: () => void }) => {
  return (
    <div 
      className="bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-center hover:bg-zinc-700 transition-all duration-300 group min-h-[90px] flex items-center justify-center cursor-pointer"
      onClick={onClick}
    >
      <div
        className="text-5xl md:text-5xl font-bold leading-relaxed text-white group-hover:scale-105 transition-transform duration-300 break-keep"
        dir="rtl"
        lang="ar"
        style={{ fontFeatureSettings: '"calt" 1, "liga" 1' }}
      >
        {word}
      </div>
    </div>
  );
};

export default Page17;