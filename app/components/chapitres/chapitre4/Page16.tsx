"use client";

// components/chapitres/chapitre4/Page16.tsx
import React from 'react';


// Mapping audio pour le Chapitre 4, Page 16 (lettres non-connectantes)
const chapter4Page16AudioMappings: { [key: string]: string } = {
  // Lettres isolées
  'ا': 'chap4_pg16_case1',
  'د': 'chap4_pg16_case2',
  'ذ': 'chap4_pg16_case3',
  'ر': 'chap4_pg16_case4',
  'ز': 'chap4_pg16_case5',
  'و': 'chap4_pg16_case6',
  
  // Exemples de mots
  'قَالَ': 'chap4_pg16_example1',
  'عُدْنَ': 'chap4_pg16_example2',
  'يَذْكُرُ': 'chap4_pg16_example3',
  'فَرِحَ': 'chap4_pg16_example4',
  'تَزَكَّىٰ': 'chap4_pg16_example5',
  'خَوْفٌ': 'chap4_pg16_example6',
  
  // Phrases explicatives
  'il a dit': 'chap4_pg16_meaning1',
  'revenez !': 'chap4_pg16_meaning2',
  'il se souvient': 'chap4_pg16_meaning3',
  'il s\'est réjoui': 'chap4_pg16_meaning4',
  'il s\'est purifié': 'chap4_pg16_meaning5',
  'peur': 'chap4_pg16_meaning6'
};

const Page16 = () => {
 // Fonction pour jouer l'audio avec le mapping spécifique
const playLetterAudio = (vowelLetter: string) => {
  const audioFileName = chapter4Page16AudioMappings[vowelLetter];
  if (audioFileName) {
    const audio = new Audio(`/audio/${audioFileName}.mp3`);
    audio.play().catch(error => {
      console.error('Erreur lors de la lecture audio:', error);
    });
  }
};

  const disconnectedLetters = [
    { letter: 'ا', example: 'قَالَ', meaning: 'il a dit' },
    { letter: 'د', example: 'عُدْنَ', meaning: 'revenez !' },
    { letter: 'ذ', example: 'يَذْكُرُ', meaning: 'il se souvient' },
    { letter: 'ر', example: 'فَرِحَ', meaning: 'il s’est réjoui' },
    { letter: 'ز', example: 'تَزَكَّىٰ', meaning: 'il s’est purifié' },
    { letter: 'و', example: 'خَوْفٌ', meaning: 'peur' }
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

        {/* Header */}
        <div className="bg-arabic-gradient text-white p-6 text-center">
          <div className="text-3xl md:text-3xl font-bold">
            Leçon : exemples et compréhension des lettres qui ne s’attachent pas après elles
          </div>
        </div>

        {/* Letters Grid */}
        <div className="p-8 bg-zinc-900">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {disconnectedLetters.map((item, index) => (
                <DisconnectedLetterCard
                  key={index}
                  letter={item.letter}
                  example={item.example}
                  meaning={item.meaning}
                  onWordClick={handleWordClick}
                />
              ))}
            </div>

            {/* Résumé */}
            <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-6 mb-6">
              <div className="text-center font-bold text-lg text-blue-400 mb-3 bg-blue-900/30 py-2 rounded-lg">
                Résumé
              </div>
              <div className="text-center text-zinc-300 text-base leading-relaxed">
                Les lettres qui ne s'attachent pas après elles sont en nombre de 6
                <br />
                <span className="text-red-500 text-4xl font-semibold">ا - د - ذ - ر - ز - و</span>
              </div>
            </div>

          </div>
        </div>

        {/* Footer */}
        <footer className="bg-zinc-800 text-white text-center p-6 flex-shrink-0 font-semibold text-sm">
          <div>Page 16</div>
          <div className="mt-1">© 2025 Tous droits réservés</div>
        </footer>

      </div>
    </div>
  );
};

// DisconnectedLetterCard Component
const DisconnectedLetterCard = ({ letter, example, meaning, onWordClick }: {
  letter: string;
  example: string;
  meaning: string;
  onWordClick?: (word: string) => void;
}) => (
  <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-6 text-center hover:bg-zinc-700 transition-all duration-300 group">
    {/* Lettre */}
    <div className="text-5xl md:text-6xl font-bold text-red-400 mb-4 group-hover:scale-110 transition-transform duration-300">
      {letter}
    </div>

    {/* Ligne de séparation */}
    <div className="w-full h-px bg-zinc-600 mb-4"></div>

    {/* Exemple : mot entier surligné */}
    <div 
      className="text-3xl md:text-4xl font-bold text-white mb-3 leading-relaxed cursor-pointer hover:text-blue-300 transition-colors"
      onClick={() => onWordClick?.(example)}
    >
      {example}
    </div>

    {/* Badge */}
    <div className="inline-block bg-yellow-900/30 text-yellow-400 px-3 py-1 rounded-full text-xs font-semibold">
      Ne s'attache pas après
    </div>
  </div>
);

export default Page16;
