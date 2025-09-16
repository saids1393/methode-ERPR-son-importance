"use client";

// components/chapitres/chapitre2/Page8.tsx
import React from 'react';


// Mapping audio pour le Chapitre 2, Page 8
const chapter2Page8AudioMappings: { [key: string]: string } = {
  // Alif avec voyelles
  'اَ': 'chap2_pg8_case1',
  'اُ': 'chap2_pg8_case2',
  'اِ': 'chap2_pg8_case3',
  // Ba avec voyelles
  'بَ': 'chap2_pg8_case4',
  'بُ': 'chap2_pg8_case5',
  'بِ': 'chap2_pg8_case6',
  // Ta avec voyelles
  'تَ': 'chap2_pg8_case7',
  'تُ': 'chap2_pg8_case8',
  'تِ': 'chap2_pg8_case9',
  // Tha avec voyelles
  'ثَ': 'chap2_pg8_case10',
  'ثُ': 'chap2_pg8_case11',
  'ثِ': 'chap2_pg8_case12',
  // Jim avec voyelles
  'جَ': 'chap2_pg8_case13',
  'جُ': 'chap2_pg8_case14',
  'جِ': 'chap2_pg8_case15',
  // Ha avec voyelles
  'حَ': 'chap2_pg8_case16',
  'حُ': 'chap2_pg8_case17',
  'حِ': 'chap2_pg8_case18',
  // Kha avec voyelles
  'خَ': 'chap2_pg8_case19',
  'خُ': 'chap2_pg8_case20',
  'خِ': 'chap2_pg8_case21',
  // Dal avec voyelles
  'دَ': 'chap2_pg8_case22',
  'دُ': 'chap2_pg8_case23',
  'دِ': 'chap2_pg8_case24',
  // Dhal avec voyelles
  'ذَ': 'chap2_pg8_case25',
  'ذُ': 'chap2_pg8_case26',
  'ذِ': 'chap2_pg8_case27',
  // Ra avec voyelles
  'رَ': 'chap2_pg8_case28',
  'رُ': 'chap2_pg8_case29',
  'رِ': 'chap2_pg8_case30',
  // Zay avec voyelles
  'زَ': 'chap2_pg8_case31',
  'زُ': 'chap2_pg8_case32',
  'زِ': 'chap2_pg8_case33',
  // Sin avec voyelles
  'سَ': 'chap2_pg8_case34',
  'سُ': 'chap2_pg8_case35',
  'سِ': 'chap2_pg8_case36',
  // Shin avec voyelles
  'شَ': 'chap2_pg8_case37',
  'شُ': 'chap2_pg8_case38',
  'شِ': 'chap2_pg8_case39',
  // Sad avec voyelles
  'صَ': 'chap2_pg8_case40',
  'صُ': 'chap2_pg8_case41',
  'صِ': 'chap2_pg8_case42',
  // Dad avec voyelles
  'ضَ': 'chap2_pg8_case43',
  'ضُ': 'chap2_pg8_case44',
  'ضِ': 'chap2_pg8_case45',
  // Ta emphatic avec voyelles
  'طَ': 'chap2_pg8_case46',
  'طُ': 'chap2_pg8_case47',
  'طِ': 'chap2_pg8_case48',
  // Dha emphatic avec voyelles
  'ظَ': 'chap2_pg8_case49',
  'ظُ': 'chap2_pg8_case50',
  'ظِ': 'chap2_pg8_case51',
  // Ayn avec voyelles
  'عَ': 'chap2_pg8_case52',
  'عُ': 'chap2_pg8_case53',
  'عِ': 'chap2_pg8_case54',
  // Ghayn avec voyelles
  'غَ': 'chap2_pg8_case55',
  'غُ': 'chap2_pg8_case56',
  'غِ': 'chap2_pg8_case57',
  // Fa avec voyelles
  'فَ': 'chap2_pg8_case58',
  'فُ': 'chap2_pg8_case59',
  'فِ': 'chap2_pg8_case60',
  // Qaf avec voyelles
  'قَ': 'chap2_pg8_case61',
  'قُ': 'chap2_pg8_case62',
  'قِ': 'chap2_pg8_case63',
  // Kaf avec voyelles
  'كَ': 'chap2_pg8_case64',
  'كُ': 'chap2_pg8_case65',
  'كِ': 'chap2_pg8_case66',
  // Lam avec voyelles
  'لَ': 'chap2_pg8_case67',
  'لُ': 'chap2_pg8_case68',
  'لِ': 'chap2_pg8_case69',
  // Mim avec voyelles
  'مَ': 'chap2_pg8_case70',
  'مُ': 'chap2_pg8_case71',
  'مِ': 'chap2_pg8_case72',
  // Nun avec voyelles
  'نَ': 'chap2_pg8_case73',
  'نُ': 'chap2_pg8_case74',
  'نِ': 'chap2_pg8_case75',
  // Ha avec voyelles
  'هَ': 'chap2_pg8_case76',
  'هُ': 'chap2_pg8_case77',
  'هِ': 'chap2_pg8_case78',
  // Waw avec voyelles
  'وَ': 'chap2_pg8_case79',
  'وُ': 'wou-chap2',
  'وِ': 'wi-chap2',
  // Ya avec voyelles
  'يَ': 'ya-chap2',
  'يُ': 'you-chap2',
  'يِ': 'yi-chap2',
  // Hamza avec voyelles
  'ءَ': 'chap2_pg8_case1',
  'ءُ': 'chap2_pg8_case2',
  'ءِ': 'chap2_pg8_case3',
  // Ta marbuta avec voyelles
  'ةَ': 'chap2_pg8_case7',
  'ةُ': 'chap2_pg8_case8',
  'ةِ': 'chap2_pg8_case9'
};



const Page8 = () => {
// Fonction pour jouer l'audio avec le mapping spécifique
const playLetterAudio = (vowelLetter: string) => {
  const audioFileName = chapter2Page8AudioMappings[vowelLetter];
  if (audioFileName) {
    const audio = new Audio(`/audio/chapitre2/${audioFileName}.mp3`);
    audio.play().catch(error => {
      console.error('Erreur lors de la lecture audio:', error);
    });
  }
};

  const emphaticLetters = ['خ', 'ر', 'ص', 'ض', 'ط', 'ظ', 'غ', 'ق'];
  
  const letterGroups = [
    { letter: 'ا', vowels: ['اَ', 'اُ', 'اِ'] },
    { letter: 'ب', vowels: ['بَ', 'بُ', 'بِ'] },
    { letter: 'ت', vowels: ['تَ', 'تُ', 'تِ'] },
    { letter: 'ث', vowels: ['ثَ', 'ثُ', 'ثِ'] },
    { letter: 'ج', vowels: ['جَ', 'جُ', 'جِ'] },
    { letter: 'ح', vowels: ['حَ', 'حُ', 'حِ'] },
    { letter: 'خ', vowels: ['خَ', 'خُ', 'خِ'] },
    { letter: 'د', vowels: ['دَ', 'دُ', 'دِ'] },
    { letter: 'ذ', vowels: ['ذَ', 'ذُ', 'ذِ'] },
    { letter: 'ر', vowels: ['رَ', 'رُ', 'رِ'] },
    { letter: 'ز', vowels: ['زَ', 'زُ', 'زِ'] },
    { letter: 'س', vowels: ['سَ', 'سُ', 'سِ'] },
    { letter: 'ش', vowels: ['شَ', 'شُ', 'شِ'] },
    { letter: 'ص', vowels: ['صَ', 'صُ', 'صِ'] },
    { letter: 'ض', vowels: ['ضَ', 'ضُ', 'ضِ'] },
    { letter: 'ط', vowels: ['طَ', 'طُ', 'طِ'] },
    { letter: 'ظ', vowels: ['ظَ', 'ظُ', 'ظِ'] },
    { letter: 'ع', vowels: ['عَ', 'عُ', 'عِ'] },
    { letter: 'غ', vowels: ['غَ', 'غُ', 'غِ'] },
    { letter: 'ف', vowels: ['فَ', 'فُ', 'فِ'] },
    { letter: 'ق', vowels: ['قَ', 'قُ', 'قِ'] },
    { letter: 'ك', vowels: ['كَ', 'كُ', 'كِ'] },
    { letter: 'ل', vowels: ['لَ', 'لُ', 'لِ'] },
    { letter: 'م', vowels: ['مَ', 'مُ', 'مِ'] },
    { letter: 'ن', vowels: ['نَ', 'نُ', 'نِ'] },
    { letter: 'ه', vowels: ['هَ', 'هُ', 'هِ'] },
    { letter: 'و', vowels: ['وَ', 'وُ', 'وِ'] },
    { letter: 'ي', vowels: ['يَ', 'يُ', 'يِ'] },
    { letter: 'ء', vowels: ['ءَ', 'ءُ', 'ءِ'] },
    { letter: 'ة', vowels: ['ةَ', 'ةُ', 'ةِ'] }
  ];

  const vowelNames = ['Fathah ( son : a )', 'Dammah ( son : ou )', 'Kassrah ( son : i )'];

// Modifier handleLetterClick pour utiliser la nouvelle fonction
const handleLetterClick = (vowelLetter: string) => {
  playLetterAudio(vowelLetter);
};
  return (
    <div 
      className="font-arabic min-h-screen"
      style={{ direction: 'rtl' }}
    >
      <div className="w-full h-full bg-gray-900 overflow-hidden">
        {/* Header */}
        <div className="text-white p-6 text-center border-b-2">
          <div className="text-3xl md:text-3xl font-bold mb-4">
            Leçon : lettres seules (non attachées) avec voyelles
          </div>
        </div>
        
        {/* Letters with Vowels Grid */}
        <div className="p-8 bg-gray-900">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {letterGroups.map((group, index) => (
              <LetterGroup 
                key={index} 
                letter={group.letter}
                vowels={group.vowels}
                vowelNames={vowelNames}
                emphatic={emphaticLetters.includes(group.letter)}
                onLetterClick={handleLetterClick}
              />
            ))}
          </div>
          
          {/* Footer */}
          <footer className="border-t-1 text-white text-center p-6 flex-shrink-0 font-semibold text-sm">
            <div>Page 8</div>
            <div className="mt-1">© 2025 Tous droits réservés</div>
          </footer>
        </div>
      </div>
    </div>
  );
};

// LetterGroup Component
const LetterGroup = ({ letter, vowels, vowelNames, emphatic, onLetterClick }: { 
  letter: string; 
  vowels: string[];
  vowelNames: string[];
  emphatic?: boolean;
  onLetterClick?: (vowelLetter: string) => void;
}) => (
  <div className="bg-gray-800 border border-zinc-500 rounded-xl p-4">
    <div className="text-center font-bold text-3xl text-white mb-4">
      {letter}
    </div>
    <div className="grid grid-cols-3 gap-3">
      {vowels.map((vowelLetter, index) => (
        <div 
          key={index} 
          className="bg-gray-900 border border-zinc-500 rounded-lg p-3 text-center hover:bg-zinc-600 transition-all duration-300 cursor-pointer"
          onClick={() => onLetterClick?.(vowelLetter)}
        >
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