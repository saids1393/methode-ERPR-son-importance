import React from 'react';

const Page22 = () => {
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

  const vowels = ['َ', 'ِ', 'ُ'];

  const allSyllables: { base1: string; vowel: string; base2: string; sukoon: string; }[] = [];
  syllableGroups.forEach(group => {
    vowels.forEach(vowel => {
      allSyllables.push({
        base1: group.base1,
        vowel: vowel,
        base2: group.base2,
        sukoon: 'ْ',
      });
    });
  });

  return (
    <div className="font-arabic min-h-screen" style={{ direction: 'rtl' }}>
      <div className="w-full h-full bg-zinc-900 overflow-hidden">
        <div className="bg-arabic-gradient text-white p-6 text-center">
          <div className="text-3xl md:text-3xl font-bold">
            Leçon : soukoun
          </div>
        </div>

        <div className="p-8 bg-zinc-900">
          <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-8">
            {allSyllables.map((syllable, index) => (
              <SukoonSyllableCard
                key={index}
                base1={syllable.base1}
                vowel={syllable.vowel}
                base2={syllable.base2}
                sukoon={syllable.sukoon}
              />
            ))}
          </div>
        </div>

        <footer className="bg-zinc-800 text-white text-center p-6 flex-shrink-0 font-semibold text-sm">
          <div>Page 22</div>
          <div className="mt-1">© 2025 Tous droits réservés</div>
        </footer>
      </div>
    </div>
  );
};

const SukoonSyllableCard = ({
  base1,
  vowel,
  base2,
  sukoon,
}: {
  base1: string;
  vowel: string;
  base2: string;
  sukoon: string;
}) => (
  <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-center hover:bg-zinc-700 transition-all duration-300 group min-h-[90px] flex items-center justify-center">
    <div className="text-2xl md:text-3xl font-bold leading-relaxed group-hover:scale-105 transition-transform duration-300 text-white">
      {base1}
      {vowel}
      {base2}
      {sukoon}
    </div>
  </div>
);

export default Page22;
