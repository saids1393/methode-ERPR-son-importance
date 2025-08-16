"use client";

import React from 'react';

const chapter9Page24AudioMappings: { [key: string]: string } = {
  // // Lettres solaires
  // 'ت': 'chap9_pg24_case1',
  // 'ث': 'chap9_pg24_case2',
  // 'د': 'chap9_pg24_case3',
  // 'ذ': 'chap9_pg24_case4',
  // 'ر': 'chap9_pg24_case5',
  // 'ز': 'chap9_pg24_case6',
  // 'س': 'chap9_pg24_case7',
  // 'ش': 'chap9_pg24_case8',
  // 'ص': 'chap9_pg24_case9',
  // 'ض': 'chap9_pg24_case10',
  // 'ط': 'chap9_pg24_case11',
  // 'ظ': 'chap9_pg24_case12',
  // 'ل': 'chap9_pg24_case13',
  // 'ن': 'chap9_pg24_case14',

  // // Lettres lunaires
  // 'ا': 'chap9_pg24_case1',
  // 'ب': 'chap9_pg24_case2',
  // 'ج': 'chap9_pg24_case3',
  // 'ح': 'chap9_pg24_case4',
  // 'خ': 'chap9_pg24_case5',
  // 'ع': 'chap9_pg24_case6',
  // 'غ': 'chap9_pg24_case7',
  // 'ف': 'chap9_pg24_case8',
  // 'ق': 'chap9_pg24_case9',
  // 'ك': 'chap9_pg24_case10',
  // 'م': 'chap9_pg24_case11',
  // 'و': 'chap9_pg24_case12',
  // 'ه': 'chap9_pg24_case13',
  // 'ي': 'chap9_pg24_case14',

  // Exemples solaires
  'الشَّمْسُ': 'chap9_pg24_case15',
  'النَّهْرُ': 'chap9_pg24_case16',
  'الدَّرْسُ': 'chap9_pg24_case17',
  'التِّينُ': 'chap9_pg24_case18',

  // Exemples lunaires
  'الْقَمَرُ': 'chap9_pg24_case19',
  'الْبَيْتُ': 'chap9_pg24_case20',
  'الْكِتَابُ': 'chap9_pg24_case21',
  'الْمَاءُ': 'chap9_pg24_case22',
};

const Page24 = () => {
  // Fonction pour jouer l'audio
  const playLetterAudio = (vowelLetter: string) => {
    const audioFileName = chapter9Page24AudioMappings[vowelLetter];
    if (audioFileName) {
      const audio = new Audio(`/audio/chapitre9/${audioFileName}.mp3`);
      audio.play().catch(error => {
        console.error('Erreur lors de la lecture audio:', error);
      });
    }
  };

  // Séparer les lettres et exemples
  const solarLetters = ['ت', 'ث', 'د', 'ذ', 'ر', 'ز', 'س', 'ش', 'ص', 'ض', 'ط', 'ظ', 'ل', 'ن'];
  const lunarLetters = ['ا', 'ب', 'ج', 'ح', 'خ', 'ع', 'غ', 'ف', 'ق', 'ك', 'م', 'و', 'ه', 'ي'];

  const solarExamples = ['الشَّمْسُ', 'النَّهْرُ', 'الدَّرْسُ', 'التِّينُ'];
  const lunarExamples = ['الْقَمَرُ', 'الْبَيْتُ', 'الْكِتَابُ', 'الْمَاءُ'];

  const handleLetterClick = (vowelLetter: string) => {
    playLetterAudio(vowelLetter);
  };

  const handleWordClick = (word: string) => {
    playLetterAudio(word);
  };

  return (
    <div className="font-arabic min-h-screen" style={{ direction: 'rtl' }}>
      <div className="w-full h-full bg-zinc-900 overflow-hidden">
        {/* En-tête */}
        <div className="bg-arabic-gradient text-white p-6 text-center">
          <div className="text-3xl md:text-3xl font-bold">
            Leçon : exemples et compréhension des lettres solaires et lunaires
          </div>
        </div>

        {/* Contenu */}
        <div className="p-8 bg-zinc-900">
          <div className="max-w-6xl mx-auto">
            {/* Lettres solaires */}
            <div className="mb-12">
              <SectionTitle
                title="Lettres solaires (14 lettres)"
                color="text-yellow-400"
                bgColor="bg-yellow-900/30"
              />
              <div className="flex flex-wrap gap-3 mb-6 justify-center">
                {solarLetters.map((letter, index) => (
                  <LetterCard key={index} letter={letter} type="case" onClick={() => handleLetterClick(letter)} />
                ))}
              </div>
              <SectionSubtitle title="Exemples de lettres solaires" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {solarExamples.map((word, index) => (
                  <ExampleCard key={index} word={word} onClick={() => handleWordClick(word)} />
                ))}
              </div>
            </div>

            {/* Lettres lunaires */}
            <div className="mb-8">
              <SectionTitle
                title="Lettres lunaires (14 lettres)"
                color="text-blue-400"
                bgColor="bg-blue-900/30"
              />
              <div className="flex flex-wrap gap-3 mb-6 justify-center">
                {lunarLetters.map((letter, index) => (
                  <LetterCard key={index} letter={letter} type="case" onClick={() => handleLetterClick(letter)} />
                ))}
              </div>
              <SectionSubtitle title="Exemples de lettres lunaires" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {lunarExamples.map((word, index) => (
                  <ExampleCard key={index} word={word} onClick={() => handleWordClick(word)} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Pied de page */}
        <footer className="bg-zinc-800 text-white text-center p-6 flex-shrink-0 font-semibold text-sm">
          <div>Page 24</div>
          <div className="mt-1">© 2025 Tous droits réservés</div>
        </footer>
      </div>
    </div>
  );
};

const SectionTitle = ({ title, color, bgColor }: {
  title: string;
  color: string;
  bgColor: string;
}) => (
  <div className={`text-center font-bold text-xl ${color} mb-6 ${bgColor} py-3 rounded-lg border border-current/20`}>
    {title}
  </div>
);

const SectionSubtitle = ({ title }: { title: string }) => (
  <div className="text-lg font-semibold text-white mb-4 text-center bg-zinc-800 py-2 rounded-lg">
    {title}
  </div>
);

const LetterCard = ({ letter, type, onClick }: {
  letter: string;
  type: 'case' | 'case';
  onClick?: () => void;
}) => {
  const colorClass =
    type === 'case'
      ? 'bg-yellow-900/30 text-yellow-400 border-yellow-600'
      : 'bg-blue-900/30 text-blue-400 border-blue-600';

  return (
    <div
      className={`
        ${colorClass} border-2 rounded-lg p-3 text-center cursor-pointer
        hover:scale-105 transition-transform duration-300
        min-w-[50px] min-h-[50px] flex items-center justify-center
      `}
      onClick={onClick}
    >
      <div className="text-2xl font-bold">{letter}</div>
    </div>
  );
};

const ExampleCard = ({ word, onClick }: { word: string; onClick?: () => void }) => (
  <div
    className="bg-zinc-800 border border-zinc-700 rounded-xl p-6 text-center hover:bg-zinc-700 transition-all duration-300 cursor-pointer"
    onClick={onClick}
  >
    <div
      className="text-3xl md:text-4xl font-bold leading-relaxed text-white break-keep"
      dir="rtl"
      lang="ar"
      style={{ fontFeatureSettings: '"calt" 1, "liga" 1' }}
    >
      {word}
    </div>
  </div>
);

export default Page24;
