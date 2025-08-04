"use client";

// components/chapitres/chapitre2/Page9.tsx
import React from 'react';
import { useAudio } from '@/hooks/useAudio';

const Page9 = () => {
  const { playLetter } = useAudio();

  const emphaticLetters = ['خ', 'ر', 'ص', 'ض', 'ط', 'ظ', 'غ', 'ق'];
  const nonConnectingLetters = ['ا', 'د', 'ذ', 'ر', 'ز', 'و'];

  const letterGroups = [
    { letter: 'ا', vowels: ['اَ', 'اُ', 'اِ'] },
    { letter: 'ب', vowels: ['بَـ', 'بُـ', 'بِـ'] },
    { letter: 'ت', vowels: ['تَـ', 'تُـ', 'تِـ'] },
    { letter: 'ث', vowels: ['ثَـ', 'ثُـ', 'ثِـ'] },
    { letter: 'ج', vowels: ['جَـ', 'جُـ', 'جِـ'] },
    { letter: 'ح', vowels: ['حَـ', 'حُـ', 'حِـ'] },
    { letter: 'خ', vowels: ['خَـ', 'خُـ', 'خِـ'] },
    { letter: 'د', vowels: ['دَ', 'دُ', 'دِ'] },
    { letter: 'ذ', vowels: ['ذَ', 'ذُ', 'ذِ'] },
    { letter: 'ر', vowels: ['رَ', 'رُ', 'رِ'] },
    { letter: 'ز', vowels: ['زَ', 'زُ', 'زِ'] },
    { letter: 'س', vowels: ['سَـ', 'سُـ', 'سِـ'] },
    { letter: 'ش', vowels: ['شَـ', 'شُـ', 'شِـ'] },
    { letter: 'ص', vowels: ['صَـ', 'صُـ', 'صِـ'] },
    { letter: 'ض', vowels: ['ضَـ', 'ضُـ', 'ضِـ'] },
    { letter: 'ط', vowels: ['طَـ', 'طُـ', 'طِـ'] },
    { letter: 'ظ', vowels: ['ظَـ', 'ظُـ', 'ظِـ'] },
    { letter: 'ع', vowels: ['عَـ', 'عُـ', 'عِـ'] },
    { letter: 'غ', vowels: ['غَـ', 'غُـ', 'غِـ'] },
    { letter: 'ف', vowels: ['فَـ', 'فُـ', 'فِـ'] },
    { letter: 'ق', vowels: ['قَـ', 'قُـ', 'قِـ'] },
    { letter: 'ك', vowels: ['كَـ', 'كُـ', 'كِـ'] },
    { letter: 'ل', vowels: ['لَـ', 'لُـ', 'لِـ'] },
    { letter: 'م', vowels: ['مَـ', 'مُـ', 'مِـ'] },
    { letter: 'ن', vowels: ['نَـ', 'نُـ', 'نِـ'] },
    { letter: 'ه', vowels: ['هَـ', 'هُـ', 'هِـ'] },
    { letter: 'و', vowels: ['وَ', 'وُ', 'وِ'] },
    { letter: 'ي', vowels: ['يَـ', 'يُـ', 'يِـ'] },
    { letter: 'ء', vowels: ['أَ', 'أُ', 'إِ'] }
  ];

  const vowelNames = ['Fathah ( son : a )', 'Dammah ( son : ou )', 'Kassrah ( son : i )'];

  const handleLetterClick = (vowelLetter: string) => {
    playLetter(vowelLetter);
  };

  return (
    <div className="font-arabic min-h-screen" style={{ direction: 'rtl' }}>
      <div className="w-full h-full bg-zinc-900 overflow-hidden">
        {/* Header */}
        <div className="bg-arabic-gradient text-white p-6 text-center">
          <div className="text-3xl md:text-3xl font-bold">
          Leçon : lettres attachées au début d’un mot avec voyelles simples
          </div>
        </div>

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

        {/* Footer */}
        <footer className="bg-zinc-800 text-white text-center p-6 flex-shrink-0 font-semibold text-sm">
          <div>Page 9</div>
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
      <div className="grid grid-cols-3 gap-3" style={{ direction: 'rtl' }}>
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

export default Page9;
