import React from 'react';

const Page22 = () => {
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
              <SukoonSyllableCard key={index} word={word} />
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
const SukoonSyllableCard = ({ word }: { word: string }) => (
  <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-center hover:bg-zinc-700 transition-all duration-300 group min-h-[90px] flex items-center justify-center">
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
