"use client";

import React from 'react';


const chapter8Page22AudioMappings: { [key: string]: string } = {
  // ب + ت
  'بَتْ': 'chap8_pg22_case1',
  'بِتْ': 'chap8_pg22_case2',
  'بُتْ': 'chap8_pg22_case3',

  // ن + ص
  'نَصْ': 'chap8_pg22_case4',
  'نِصْ': 'chap8_pg22_case5',
  'نُصْ': 'chap8_pg22_case6',

  // ك + ت
  'كَتْ': 'chap8_pg22_case7',
  'كِتْ': 'chap8_pg22_case8',
  'كُتْ': 'chap8_pg22_case9',

  // م + س
  'مَسْ': 'chap8_pg22_case10',
  'مِسْ': 'chap8_pg22_case11',
  'مُسْ': 'chap8_pg22_case12',

  // ر + ب
  'رَبْ': 'chap8_pg22_case13',
  'رِبْ': 'chap8_pg22_case14',
  'رُبْ': 'chap8_pg22_case15',

  // س + ف
  'سَفْ': 'chap8_pg22_case16',
  'سِفْ': 'chap8_pg22_case17',
  'سُفْ': 'chap8_pg22_case18',

  // ع + د
  'عَدْ': 'chap8_pg22_case19',
  'عِدْ': 'chap8_pg22_case20',
  'عُدْ': 'chap8_pg22_case21',

  // ف + ر
  'فَرْ': 'chap8_pg22_case22',
  'فِرْ': 'chap8_pg22_case23',
  'فُرْ': 'chap8_pg22_case24',

  // ح + ب
  'حَبْ': 'chap8_pg22_case25',
  'حِبْ': 'chap8_pg22_case26',
  'حُبْ': 'chap8_pg22_case27',

  // د + ر
  'دَرْ': 'chap8_pg22_case28',
  'دِرْ': 'chap8_pg22_case29',
  'دُرْ': 'chap8_pg22_case30',

  // ط + ب
  'طَبْ': 'chap8_pg22_case31',
  'طِبْ': 'chap8_pg22_case32',
  'طُبْ': 'chap8_pg22_case33',

  // ق + ل
  'قَلْ': 'chap8_pg22_case34',
  'قِلْ': 'chap8_pg22_case35',
  'قُلْ': 'chap8_pg22_case36',

  // غ + ض
  'غَضْ': 'chap8_pg22_case37',
  'غِضْ': 'chap8_pg22_case38',
  'غُضْ': 'chap8_pg22_case39',

  // ص + د
  'صَدْ': 'chap8_pg22_case40',
  'صِدْ': 'chap8_pg22_case41',
  'صُدْ': 'chap8_pg22_case42',

  // ض + ح
  'ضَحْ': 'chap8_pg22_case43',
  'ضِحْ': 'chap8_pg22_case44',
  'ضُحْ': 'chap8_pg22_case45',

  // ذ + ك
  'ذَكْ': 'chap8_pg22_case46',
  'ذِكْ': 'chap8_pg22_case47',
  'ذُكْ': 'chap8_pg22_case48',
};


const Page22 = () => {
 // Fonction pour jouer l'audio avec le mapping spécifique
const playLetterAudio = (vowelLetter: string) => {
  const audioFileName = chapter8Page22AudioMappings[vowelLetter];
  if (audioFileName) {
    const audio = new Audio(`/audio/chapitre8/${audioFileName}.mp3`);
    audio.play().catch(error => {
      console.error('Erreur lors de la lecture audio:', error);
    });
  }
};

  // Groupes de syllabes combinées
  const syllableGroups = [
    { base1: 'ب', base2: 'ت' },
    { base1: 'ن', base2: 'ص' },
    { base1: 'ك', base2: 'ت' },
    { base1: 'م', base2: 'س' },
    { base1: 'ر', base2: 'ب' },
    { base1: 'س', base2: 'ف' },
    { base1: 'ع', base2: 'د' },
    { base1: 'ف', base2: 'ر' },
    { base1: 'ح', base2: 'ب' },
    { base1: 'د', base2: 'ر' },
    { base1: 'ط', base2: 'ب' },
    { base1: 'ق', base2: 'ل' },
    { base1: 'غ', base2: 'ض' },
    { base1: 'ص', base2: 'د' },
    { base1: 'ض', base2: 'ح' },
    { base1: 'ذ', base2: 'ك' },
  ];

  const vowels = ['َ', 'ِ', 'ُ']; // fatha, kasra, damma

  const words: string[] = [];
  syllableGroups.forEach(({ base1, base2 }) => {
    vowels.forEach(vowel => {
      words.push(`${base1}${vowel}${base2}ْ`); // Exemple : بَتْ
    });
  });

// Modifier handleLetterClick pour utiliser la nouvelle fonction
const handleLetterClick = (vowelLetter: string) => {
  playLetterAudio(vowelLetter);
};


  return (
    <div className="font-arabic min-h-screen" style={{ direction: 'rtl' }}>
      <div className="w-full h-full bg-zinc-900 overflow-hidden">
        {/* En-tête */}
        <div className="bg-arabic-gradient text-white p-6 text-center">
          <div className="text-3xl md:text-3xl font-bold">
            Leçon : soukoun
          </div>
        </div>

        {/* Contenu */}
        <div className="p-8 bg-zinc-900">
          <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-8">
             {words.map((word, index) => (
               <SukoonSyllableCard
                  key={index}
                  word={word}
                  onClick={() => handleLetterClick(word)}
                />
              ))}
          </div>
        </div>

        {/* Pied de page */}
        <footer className="bg-zinc-800 text-white text-center p-6 flex-shrink-0 font-semibold text-sm">
          <div>Page 22</div>
          <div className="mt-1">© 2025 Tous droits réservés</div>
        </footer>
      </div>
    </div>
  );
};

// Composant carte pour chaque syllabe avec soukoun
const SukoonSyllableCard = ({ word, onClick }: { word: string; onClick?: () => void }) => (
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

export default Page22;
