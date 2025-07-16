// components/chapitres/chapitre2/Page8.tsx
import React from 'react';

const Page8 = () => {
  const emphaticLetters = ['خ', 'ر', 'ص', 'ض', 'ط', 'ظ', 'غ', 'ق'];
  
  const letterGroups = [
    { letter: 'ا', vowels: ['اِ', 'اُ', 'اَ'] },
    { letter: 'ب', vowels: ['بِ', 'بُ', 'بَ'] },
    { letter: 'ت', vowels: ['تِ', 'تُ', 'تَ'] },
    { letter: 'ث', vowels: ['ثِ', 'ثُ', 'ثَ'] },
    { letter: 'ج', vowels: ['جِ', 'جُ', 'جَ'] },
    { letter: 'ح', vowels: ['حِ', 'حُ', 'حَ'] },
    { letter: 'خ', vowels: ['خِ', 'خُ', 'خَ'] },
    { letter: 'د', vowels: ['دِ', 'دُ', 'دَ'] },
    { letter: 'ذ', vowels: ['ذِ', 'ذُ', 'ذَ'] },
    { letter: 'ر', vowels: ['رِ', 'رُ', 'رَ'] },
    { letter: 'ز', vowels: ['زِ', 'زُ', 'زَ'] },
    { letter: 'س', vowels: ['سِ', 'سُ', 'سَ'] },
    { letter: 'ش', vowels: ['شِ', 'شُ', 'شَ'] },
    { letter: 'ص', vowels: ['صِ', 'صُ', 'صَ'] },
    { letter: 'ض', vowels: ['ضِ', 'ضُ', 'ضَ'] },
    { letter: 'ط', vowels: ['طِ', 'طُ', 'طَ'] },
    { letter: 'ظ', vowels: ['ظِ', 'ظُ', 'ظَ'] },
    { letter: 'ع', vowels: ['عِ', 'عُ', 'عَ'] },
    { letter: 'غ', vowels: ['غِ', 'غُ', 'غَ'] },
    { letter: 'ف', vowels: ['فِ', 'فُ', 'فَ'] },
    { letter: 'ق', vowels: ['قِ', 'قُ', 'قَ'] },
    { letter: 'ك', vowels: ['كِ', 'كُ', 'كَ'] },
    { letter: 'ل', vowels: ['لِ', 'لُ', 'لَ'] },
    { letter: 'م', vowels: ['مِ', 'مُ', 'مَ'] },
    { letter: 'ن', vowels: ['نِ', 'نُ', 'نَ'] },
    { letter: 'ه', vowels: ['هِ', 'هُ', 'هَ'] },
    { letter: 'و', vowels: ['وِ', 'وُ', 'وَ'] },
    { letter: 'ي', vowels: ['يِ', 'يُ', 'يَ'] },
    { letter: 'ء', vowels: ['ءِ', 'ءُ', 'ءَ'] },
    { letter: 'ة', vowels: ['ةِ', 'ةُ', 'ةَ'] }
  ];

  const vowelNames = ['Kassrah ( son : i )', 'Dammah ( son : ou )', 'Fathah ( son : a )'];

  return (
    <div 
      className="font-arabic min-h-screen"
      style={{ direction: 'rtl' }}
    >
      <div className="w-full h-full bg-zinc-900 overflow-hidden">
        {/* Header */}
        <div className="bg-arabic-gradient text-white p-6 text-center">
          <div className="text-3xl md:text-3xl font-bold">
           Lttres seules avec voyelles
          </div>
        </div>
        
        {/* Letters with Vowels Grid */}
        <div className="p-8 bg-zinc-900">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {letterGroups.map((group, index) => (
              <LetterGroup 
                key={index} 
                letter={group.letter}
                vowels={group.vowels}
                vowelNames={vowelNames}
                emphatic={emphaticLetters.includes(group.letter)}
              />
            ))}
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-zinc-800 text-white text-center p-6 flex-shrink-0 font-semibold text-sm">
          <div>Page 8</div>
          <div className="mt-1">© 2025 Tous droits réservés</div>
        </footer>
      </div>
    </div>
  );
};

// LetterGroup Component
const LetterGroup = ({ letter, vowels, vowelNames, emphatic }: { 
  letter: string; 
  vowels: string[];
  vowelNames: string[];
  emphatic?: boolean;
}) => (
  <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-4">
    <div className="text-center font-bold text-3xl text-white mb-4">
      {letter}
    </div>
    <div className="grid grid-cols-3 gap-3">
      {vowels.map((vowelLetter, index) => (
        <div key={index} className="bg-zinc-700 border border-zinc-600 rounded-lg p-3 text-center hover:bg-zinc-600 transition-all duration-300">
          <div className={`text-2xl md:text-3xl font-bold mb-2 ${
            emphatic ? 'text-red-400' : 'text-white'
          }`}>
            {vowelLetter}
          </div>
          <div className={`text-xs font-semibold px-2 py-1 rounded ${
            index === 0 ? 'text-orange-400 bg-orange-900/30' :
            index === 1 ? 'text-blue-400 bg-blue-900/30' :
            'text-green-400 bg-green-900/30'
          }`}>
            {vowelNames[index]}
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default Page8;
