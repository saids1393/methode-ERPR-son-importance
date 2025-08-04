"use client";

// components/chapitres/chapitre3/Page15.tsx
import React from 'react';
import { useAudio } from '@/hooks/useAudio';

const Page15 = () => {
  const { playLetter } = useAudio();

  const emphaticLetters = ['خ', 'ر', 'ص', 'ض', 'ط', 'ظ', 'غ', 'ق'];
  const nonConnectingLetters = ['ا', 'د', 'ذ', 'ر', 'ز', 'و']; // Lettres qui ne se connectent pas après elles
  
  const letterGroups = [
    { letter: 'ا', name: 'أَلِف', vowels: ['اً', 'اٌ', 'اٍ'] },
    { letter: 'ب', name: 'بَاء', vowels: ['بًا', 'بٌ', 'بٍ'] },
    { letter: 'ت', name: 'تَاء', vowels: ['تًا', 'تٌ', 'تٍ'] },
    { letter: 'ث', name: 'ثَاء', vowels: ['ثًا', 'ثٌ', 'ثٍ'] },
    { letter: 'ج', name: 'جِيم', vowels: ['جًا', 'جٌ', 'جٍ'] },
    { letter: 'ح', name: 'حَاء', vowels: ['حًا', 'حٌ', 'حٍ'] },
    { letter: 'خ', name: 'خَاء', vowels: ['خًا', 'خٌ', 'خٍ'] },
    { letter: 'د', name: 'دَال', vowels: ['دًا', 'دٌ', 'دٍ'] },
    { letter: 'ذ', name: 'ذَال', vowels: ['ذًا', 'ذٌ', 'ذٍ'] },
    { letter: 'ر', name: 'رَاء', vowels: ['رًا', 'رٌ', 'رٍ'] },
    { letter: 'ز', name: 'زَاي', vowels: ['زًا', 'زٌ', 'زٍ'] },
    { letter: 'س', name: 'سِين', vowels: ['سًا', 'سٌ', 'سٍ'] },
    { letter: 'ش', name: 'شِين', vowels: ['شًا', 'شٌ', 'شٍ'] },
    { letter: 'ص', name: 'صَاد', vowels: ['صًا', 'صٌ', 'صٍ'] },
    { letter: 'ض', name: 'ضَاد', vowels: ['ضًا', 'ضٌ', 'ضٍ'] },
    { letter: 'ط', name: 'طَاء', vowels: ['طًا', 'طٌ', 'طٍ'] },
    { letter: 'ظ', name: 'ظَاء', vowels: ['ظًا', 'ظٌ', 'ظٍ'] },
    { letter: 'ع', name: 'عَين', vowels: ['عًا', 'عٌ', 'عٍ'] },
    { letter: 'غ', name: 'غَين', vowels: ['غًا', 'غٌ', 'غٍ'] },
    { letter: 'ف', name: 'فَاء', vowels: ['فًا', 'فٌ', 'فٍ'] },
    { letter: 'ق', name: 'قَاف', vowels: ['قًا', 'قٌ', 'قٍ'] },
    { letter: 'ك', name: 'كَاف', vowels: ['كًا', 'كٌ', 'كٍ'] },
    { letter: 'ل', name: 'لَام', vowels: ['لًا', 'لٌ', 'لٍ'] },
    { letter: 'م', name: 'مِيم', vowels: ['مًا', 'مٌ', 'مٍ'] },
    { letter: 'ن', name: 'نُون', vowels: ['نًا', 'نٌ', 'نٍ'] },
    { letter: 'ه', name: 'هَاء', vowels: ['هًا', 'هٌ', 'هٍ'] },
    { letter: 'و', name: 'وَاو', vowels: ['وً', 'وٌ', 'وٍ'] },
    { letter: 'ي', name: 'يَاء', vowels: ['يًا', 'يٌ', 'يٍ'] }
  ];

  const vowelNames = ['Fathatane ( son : ane )', 'Dammatane ( son : oune)', 'Kassratane ( son : in)'];

  const handleLetterClick = (vowelLetter: string) => {
    playLetter(vowelLetter);
  };

  return (
    <div 
      className="font-arabic min-h-screen"
      style={{ direction: 'rtl' }}
    >
      <div className="w-full h-full bg-zinc-900 overflow-hidden">
        {/* Header */}
         <div className="bg-arabic-gradient text-white p-6 text-center">
          <div className="text-3xl md:text-3xl font-bold">
         Leçon : lettres attachées à la fin d’un mot avec voyelles doubles
          </div>
        </div>
        
        {/* Letters with Tanwin Grid */}
       {/* Letters with Vowels Grid */}
        <div className="p-8 bg-zinc-900">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {letterGroups.map((group, index) => (
              <LetterGroup 
                key={index} 
                vowels={group.vowels}
                vowelNames={vowelNames}
                emphatic={emphaticLetters.includes(group.letter)}
                nonConnecting={nonConnectingLetters.includes(group.letter)}
                onLetterClick={handleLetterClick}
              />
            ))}

          </div>
        </div>
   <footer className="bg-zinc-800 text-white text-center p-6 flex-shrink-0 font-semibold text-sm">
          <div>Page 15</div>
          <div className="mt-1">© 2025 Tous droits réservés</div>
        </footer>
      </div>
    </div>
  );
};

// LetterGroup Component
const LetterGroup = ({
  vowels,
  vowelNames,
  emphatic,
  nonConnecting,
  onLetterClick,
}: {
  vowels: string[];
  vowelNames: string[];
  emphatic?: boolean;
  nonConnecting?: boolean;
  onLetterClick?: (vowelLetter: string) => void;
}) => {
  // Extraire la forme initiale sans voyelle
  const baseForm = vowels[0].replace(/[َُِ]/g, '');

  return (
    <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-4">
      <div className="text-center font-bold text-3xl text-white mb-4">
        {baseForm}
      </div>
      <div className="grid grid-cols-3 gap-3">
        {vowels.map((vowelLetter, index) => (
          <div
            key={index}
            className="bg-zinc-700 border border-zinc-600 rounded-lg p-3 text-center hover:bg-zinc-600 transition-all duration-300 relative cursor-pointer"
            onClick={() => onLetterClick?.(vowelLetter)}
          >
            <div
              className={`text-2xl md:text-3xl font-bold mb-2 ${
                emphatic ? 'text-red-400' : 'text-white'
              }`}
            >
              {vowelLetter}
            </div>
            <div
              className={`text-xs font-semibold px-2 py-1 rounded ${
                index === 0
                  ? 'text-orange-400 bg-orange-900/30'
                  : index === 1
                  ? 'text-blue-400 bg-blue-900/30'
                  : 'text-green-400 bg-green-900/30'
              }`}
            >
              {vowelNames[index]}
            </div>

            {/* Badge non-connection */}
            {nonConnecting && index === 0 && (
              <div className="text-xs text-purple-400 bg-purple-900/30 px-1 py-1 rounded mt-2">
                لا تتصل
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};


export default Page15;