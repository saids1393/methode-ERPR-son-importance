// components/chapitres/chapitre8/Page22.tsx
import React from 'react';

const Page22 = () => {
  const syllableGroups = [
    // Chaque groupe contient 3 syllabes avec fatha, kasra, damma + sukoon
    { base1: 'ب', base2: 'ت' },  // بَتْ، بِتْ، بُتْ
    { base1: 'ن', base2: 'ص' },  // نَصْ، نِصْ، نُصْ
    { base1: 'ك', base2: 'ت' },  // كَتْ، كِتْ، كُتْ
    { base1: 'م', base2: 'س' },  // مَسْ، مِسْ، مُسْ
    { base1: 'ر', base2: 'ب' },  // رَبْ، رِبْ، رُبْ
    { base1: 'س', base2: 'ف' },  // سَفْ، سِفْ، سُفْ
    { base1: 'ع', base2: 'د' },  // عَدْ، عِدْ، عُدْ
    { base1: 'ف', base2: 'ر' },  // فَرْ، فِرْ، فُرْ
    { base1: 'ح', base2: 'ب' },  // حَبْ، حِبْ، حُبْ
    { base1: 'د', base2: 'ر' },  // دَرْ، دِرْ، دُرْ
    { base1: 'ط', base2: 'ب' },  // طَبْ، طِبْ، طُبْ
    { base1: 'ق', base2: 'ل' },  // قَلْ، قِلْ، قُلْ
    { base1: 'غ', base2: 'ض' },  // غَضْ، غِضْ، غُضْ
    { base1: 'ص', base2: 'د' },  // صَدْ، صِدْ، صُدْ
    { base1: 'ض', base2: 'ح' },  // ضَحْ، ضِحْ، ضُحْ
    { base1: 'ذ', base2: 'ك' }   // ذَكْ، ذِكْ، ذُكْ
  ];

  const vowels = ['َ', 'ِ', 'ُ']; // fatha, kasra, damma

  // Créer toutes les combinaisons
  const allSyllables: { base1: string; vowel: string; base2: string; sukoon: string; }[] = [];
  syllableGroups.forEach(group => {
    vowels.forEach(vowel => {
      allSyllables.push({
        base1: group.base1,
        vowel: vowel,
        base2: group.base2,
        sukoon: 'ْ'
      });
    });
  });

  return (
    <div 
      className="font-arabic min-h-screen"
      style={{ direction: 'rtl' }}
    >
      <div className="w-full h-full bg-zinc-900 overflow-hidden">
         {/* Header */}
        <div className="bg-arabic-gradient text-white p-6 text-center">
          <div className="text-3xl md:text-3xl font-bold">
            Absence de voyelle sur une lettre (soukoune)
          </div>
        </div>
        
        {/* Syllables Grid */}
        <div className="p-8 bg-zinc-900">
          <div className="max-w-6xl mx-auto">
            {/* Grid des syllabes avec sukoon */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-8">
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
        </div>
        
        {/* Footer */}
        <footer className="bg-zinc-800 text-white text-center p-6 flex-shrink-0 font-semibold text-sm">
          <div>Page 22</div>
          <div className="mt-1">© 2025 Tous droits réservés</div>
        </footer>
      </div>
    </div>
  );
};

// SukoonSyllableCard Component avec sukoon en rouge
const SukoonSyllableCard = ({ base1, vowel, base2, sukoon }: { 
  base1: string;
  vowel: string;
  base2: string;
  sukoon: string;
}) => {
  const getVowelColor = (vowel: string) => {
    switch(vowel) {
      case 'َ': return 'text-white'; // fatha
      case 'ِ': return 'text-white'; // kasra  
      case 'ُ': return 'text-white'; // damma
      default: return 'text-white';
    }
  };

  return (
    <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-center hover:bg-zinc-700 transition-all duration-300 group min-h-[90px] flex items-center justify-center">
      <div className="text-2xl md:text-3xl font-bold leading-relaxed group-hover:scale-105 transition-transform duration-300">
        <span className={getVowelColor(vowel)}>
          {base1}{vowel}
        </span>
        <span className="text-red-400">
          {base2}{sukoon}
        </span>
      </div>
    </div>
  );
};

export default Page22;