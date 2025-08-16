"use client";

// components/chapitres/chapitre10/Page25.tsx
import React from 'react';


const chapter10Page25AudioMappings: { [key: string]: string } = {
  // Rangée 1
  'مَدَّ': 'chap10_pg25_case1',
  'حَقَّ': 'chap10_pg25_case2',
  'فُرَّ': 'chap10_pg25_case3',
  'وَدَّ': 'chap10_pg25_case4',
  'رُدَّ': 'chap10_pg25_case5',
  'عَضَّ': 'chap10_pg25_case6',

  // Rangée 2
  'شَدَّ': 'chap10_pg25_case7',
  'طُبَّ': 'chap10_pg25_case8',
  'قَطَّ': 'chap10_pg25_case9',
  'غَلَّ': 'chap10_pg25_case10',
  'نَبَّ': 'chap10_pg25_case11',
  'ذُبَّ': 'chap10_pg25_case12',

  // Rangée 3

  'حُجَّ': 'chap10_pg25_case13',
  'عَدَّ': 'chap10_pg25_case14',
  'بَلَّ': 'chap10_pg25_case15',

  // Rangée 4
  'ظَنَّ': 'chap10_pg25_case16',
  'زُرَّ': 'chap10_pg25_case17',
  'هَبَّ': 'chap10_pg25_case18',
  'كَنَّ': 'chap10_pg25_case19',
  'ضَرَّ': 'chap10_pg25_case20',
  'سَرَّ': 'chap10_pg25_case21',

  // Rangée 5
  'نَمَّ': 'chap10_pg25_case22',
  'لَبَّ': 'chap10_pg25_case23',
  'فَكَّ': 'chap10_pg25_case24',
  'ذَكَّ': 'chap10_pg25_case25',
  'خَسَّ': 'chap10_pg25_case26',
  'هَجَّ': 'chap10_pg25_case27',

  // Rangée 6
  'جَلَّ': 'chap10_pg25_case28',
  'فَضَّ': 'chap10_pg25_case29',
  'سَبَّ': 'chap10_pg25_case30',

};


const Page25 = () => {
  // Fonction pour jouer l'audio avec le mapping spécifique
  const playLetterAudio = (vowelLetter: string) => {
    const audioFileName = chapter10Page25AudioMappings[vowelLetter];
    if (audioFileName) {
      const audio = new Audio(`/audio/chapitre10/${audioFileName}.mp3`);
      audio.play().catch(error => {
        console.error('Erreur lors de la lecture audio:', error);
      });
    }
  };

  const shaddaWords = [
    // Rangée 1
    ['مَدَّ', 'حَقَّ', 'فُرَّ', 'وَدَّ', 'رُدَّ', 'عَضَّ'],

    // Rangée 2
    ['شَدَّ', 'طُبَّ', 'قَطَّ', 'غَلَّ', 'نَبَّ', 'ذُبَّ'],

    // Rangée 3
    ['حُجَّ', 'عَدَّ', 'بَلَّ'],

    // Rangée 4
    ['ظَنَّ', 'زُرَّ', 'هَبَّ', 'كَنَّ', 'ضَرَّ', 'سَرَّ'],

    // Rangée 5
    ['نَمَّ', 'لَبَّ', 'فَكَّ', 'ذَكَّ', 'خَسَّ', 'هَجَّ'],

    // Rangée 6
    ['جَلَّ', 'فَضَّ', 'سَبَّ'],

  ];

  // Aplatir toutes les rangées en un seul tableau
  const allWords = shaddaWords.flat();

  // Modifier handleLetterClick pour utiliser la nouvelle fonction
  const handleLetterClick = (vowelLetter: string) => {
    playLetterAudio(vowelLetter);
  };


  return (
    <div
      className="font-arabic min-h-screen"
      style={{ direction: 'rtl' }}
    >
      <div className="w-full h-full bg-zinc-900 overflow-hidden">
        {/* Header avec gradient orange spécifique */}
        <div className="bg-arabic-gradient text-white p-6 text-center">
          <div className="text-3xl md:text-3xl font-bold">
            Leçon : la shaddah
          </div>
        </div>

        {/* Content */}
        <div className="p-8 bg-zinc-900">
          <div className="max-w-6xl mx-auto">

            {/* Shadda Words Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-8">

              {allWords.map((word, index) => (
                <ShaddaWordCard
                  key={index}
                  word={word}
                  index={index}
                  onClick={() => handleLetterClick(word)}
                />
              ))}

            </div>



          </div>
        </div>

        {/* Footer */}
        <footer className="bg-zinc-800 text-white text-center p-6 font-semibold text-sm select-none">
          <div>Page 25</div>
          <div className="mt-1">© 2025 Tous droits réservés</div>
        </footer>
      </div>
    </div>
  );
};

// ShaddaWordCard Component pour chaque mot avec shadda
const ShaddaWordCard = ({ word, index, onClick }: {
  word: string;
  index: number;
  onClick?: () => void;
}) => {
  return (
    <div className="
      bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-center cursor-pointer
      hover:bg-zinc-700 transition-all duration-300 group 
      min-h-[90px] flex items-center justify-center
    "
      onClick={onClick}
    >
      <div className="text-2xl md:text-3xl font-bold text-white leading-relaxed group-hover:scale-105 transition-transform duration-300">
        {word}
      </div>
    </div>
  );
};

export default Page25;