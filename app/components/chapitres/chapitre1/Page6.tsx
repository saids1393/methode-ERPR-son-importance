"use client";
import React from 'react';

const chapterPage6AudioMappings: { [key: string]: string } = {
  'في': 'chap1_pg6_case1',
  'من': 'chap1_pg6_case2',
  'ق': 'chap1_pg6_case3',
  'قد': 'chap1_pg6_case4',
  'ل': 'chap1_pg6_case5',
  'هو': 'chap1_pg6_case6',
  'ما': 'chap1_pg6_case7',
  'أن': 'chap1_pg6_case8',
  'لم': 'chap1_pg6_case9',
  'كل': 'chap1_pg6_case10',
  'ثم': 'chap1_pg6_case11',
  'هل': 'chap1_pg6_case12',
  'عن': 'chap1_pg6_case13',
  'ر': 'chap1_pg6_case14',
  'به': 'chap1_pg6_case15',
  'له': 'chap1_pg6_case16',
  'رب': 'chap1_pg6_case17',
  'قل': 'chap1_pg6_case18',
  'هم': 'chap1_pg6_case19',
  'نا': 'chap1_pg6_case20',
  'كم': 'chap1_pg6_case21',
  'أي': 'chap1_pg6_case22',
  'ف': 'chap1_pg6_case23',
  'نور': 'chap1_pg6_case24',
  'عبد': 'chap1_pg6_case25',
  'نار': 'chap1_pg6_case26',
  'يدع': 'chap1_pg6_case27',
  // 'فوز': 'chap1_pg6_case28',
  'ع': 'chap1_pg6_case29',
  'ملك': 'chap1_pg6_case30',
  'نهر': 'chap1_pg6_case31',
  'قمر': 'chap1_pg6_case32',
  'غيب': 'chap1_pg6_case33',
  'رسل': 'chap1_pg6_case34',
  'نفس': 'chap1_pg6_case35',
  // 'ضر': 'chap1_pg6_case36',
  'صمت': 'chap1_pg6_case37',
  'ح': 'chap1_pg6_case38',
  'خير': 'chap1_pg6_case39',
  'علم': 'chap1_pg6_case40',
  'قلب': 'chap1_pg6_case41',
  // 'خلق': 'chap1_pg6_case42',
  'غفر': 'chap1_pg6_case43',
  'سجد': 'chap1_pg6_case44',
  'عدة': 'chap1_pg6_case45',
  'خوف': 'chap1_pg6_case46',
  'صدق': 'chap1_pg6_case47',
  'كفر': 'chap1_pg6_case48',
  'نصر': 'chap1_pg6_case49',
  'س': 'chap1_pg6_case50',
  'سؤل': 'chap1_pg6_case51',
  'أمر': 'chap1_pg6_case52',
  'يئس': 'chap1_pg6_case53',
};

const Page6 = () => {
  const words = [
    'في', 'من', 'ق', 'قد', 'ل', 'هو',
    'ما', 'أن', 'لم', 'كل', 'ثم', 'هل',
    'عن', 'ر', 'به', 'له', 'رب', 'قل',
    'هم', 'نا', 'كم', 'أي', 'ف', 'نور',
    'عبد', 'نار', 'يدع', 'ع', 'ملك',
    'نهر', 'قمر', 'غيب', 'رسل', 'نفس',
    'صمت', 'ح', 'خير', 'علم', 'قلب',
    'غفر', 'سجد', 'عدة', 'خوف', 'صدق', 'كفر',
    'نصر', 'س', 'سؤل', 'أمر', 'يئس',
  ];

  // Fonction pour jouer l'audio correspondant au mot
  const playWordAudio = (word: string) => {
    const audioFileName = chapterPage6AudioMappings[word];
    if (audioFileName) {
      const audio = new Audio(`/audio/chapitre0_1/${audioFileName}.mp3`);
      audio.play().catch(error => {
        console.error('Erreur lors de la lecture audio:', error);
      });
    }
  };

  // Fonction simplifiée : rendre le mot entier directement en blanc
  const renderWordWithColors = (word: string) => {
    return word;
  };

  return (
    <div className="font-arabic min-h-screen" style={{ direction: 'rtl' }}>
      <div className="w-full h-full bg-gray-900 overflow-hidden">
        {/* Header */}
        <div className="text-white p-6 text-center border-b-2">
          <div className="text-3xl font-bold mb-4">Exercice : reconnaissance des lettres seules et attachées</div>
        </div>
        {/* Words Grid */}
        <div className="p-8 bg-gray-900">
          <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-7 gap-4 mb-6">
            {words.map((word, index) => (
              <WordCell
                key={index}
                word={word}
                renderWordWithColors={renderWordWithColors}
                onClick={() => playWordAudio(word)}
              />
            ))}
          </div>
          {/* Footer */}
          <footer className="border-t-1 text-white text-center p-6 flex-shrink-0 font-semibold text-sm">
            <div>Page 6</div>
            <div className="mt-1">© 2025 Tous droits réservés</div>
          </footer>
        </div>
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
    <div
      className="bg-gray-900 border border-zinc-500 rounded-xl p-4 text-center min-h-[80px] flex flex-col justify-center items-center hover:bg-zinc-700 transition-all duration-300 hover:scale-105 cursor-pointer"
      onClick={onClick}
    >
      <div className="text-3xl md:text-4xl font-bold text-white">
        {renderWordWithColors(word)}
      </div>
    </div>
  );
};

export default Page6;