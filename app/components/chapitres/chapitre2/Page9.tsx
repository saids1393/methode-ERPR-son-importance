"use client";

// components/chapitres/chapitre2/Page9.tsx
import React from 'react';


// Mapping audio pour le Chapitre 2, Page 9
const chapter2Page9AudioMappings: { [key: string]: string } = {
  // Alif avec voyelles
  'اَ': 'chap2_pg8_case1',
  'اُ': 'chap2_pg8_case2',
  'اِ': 'chap2_pg8_case3',
  // Ba avec voyelles (forme initiale)
  'بَـ': 'chap2_pg8_case4',
  'بُـ': 'chap2_pg8_case5',
  'بِـ': 'chap2_pg8_case6',
  // Ta avec voyelles (forme initiale)
  'تَـ': 'chap2_pg8_case7',
  'تُـ': 'chap2_pg8_case8',
  'تِـ': 'chap2_pg8_case9',
  // Tha avec voyelles (forme initiale)
  'ثَـ': 'chap2_pg8_case10',
  'ثُـ': 'chap2_pg8_case11',
  'ثِـ': 'chap2_pg8_case12',
  // Jim avec voyelles (forme initiale)
  'جَـ': 'chap2_pg8_case13',
  'جُـ': 'chap2_pg8_case14',
  'جِـ': 'chap2_pg8_case15',
  // Ha avec voyelles (forme initiale)
  'حَـ': 'chap2_pg8_case16',
  'حُـ': 'chap2_pg8_case17',
  'حِـ': 'chap2_pg8_case18',
  // Kha avec voyelles (forme initiale)
  'خَـ': 'chap2_pg8_case19',
  'خُـ': 'chap2_pg8_case20',
  'خِـ': 'chap2_pg8_case21',
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
  // Sin avec voyelles (forme initiale)
  'سَـ': 'chap2_pg8_case34',
  'سُـ': 'chap2_pg8_case35',
  'سِـ': 'chap2_pg8_case36',
  // Shin avec voyelles (forme initiale)
  'شَـ': 'chap2_pg8_case37',
  'شُـ': 'chap2_pg8_case38',
  'شِـ': 'chap2_pg8_case39',
  // Sad avec voyelles (forme initiale)
  'صَـ': 'chap2_pg8_case40',
  'صُـ': 'chap2_pg8_case41',
  'صِـ': 'chap2_pg8_case42',
  // Dad avec voyelles (forme initiale)
  'ضَـ': 'chap2_pg8_case43',
  'ضُـ': 'chap2_pg8_case44',
  'ضِـ': 'chap2_pg8_case45',
  // Ta emphatic avec voyelles (forme initiale)
  'طَـ': 'chap2_pg8_case46',
  'طُـ': 'chap2_pg8_case47',
  'طِـ': 'chap2_pg8_case48',
  // Dha emphatic avec voyelles (forme initiale)
  'ظَـ': 'chap2_pg8_case49',
  'ظُـ': 'chap2_pg8_case50',
  'ظِـ': 'chap2_pg8_case51',
  // Ayn avec voyelles (forme initiale)
  'عَـ': 'chap2_pg8_case52',
  'عُـ': 'chap2_pg8_case53',
  'عِـ': 'chap2_pg8_case54',
  // Ghayn avec voyelles (forme initiale)
  'غَـ': 'chap2_pg8_case55',
  'غُـ': 'chap2_pg8_case56',
  'غِـ': 'chap2_pg8_case57',
  // Fa avec voyelles (forme initiale)
  'فَـ': 'chap2_pg8_case58',
  'فُـ': 'chap2_pg8_case59',
  'فِـ': 'chap2_pg8_case60',
  // Qaf avec voyelles (forme initiale)
  'قَـ': 'chap2_pg8_case61',
  'قُـ': 'chap2_pg8_case62',
  'قِـ': 'chap2_pg8_case63',
  // Kaf avec voyelles (forme initiale)
  'كَـ': 'chap2_pg8_case64',
  'كُـ': 'chap2_pg8_case65',
  'كِـ': 'chap2_pg8_case66',
  // Lam avec voyelles (forme initiale)
  'لَـ': 'chap2_pg8_case67',
  'لُـ': 'chap2_pg8_case68',
  'لِـ': 'chap2_pg8_case69',
  // Mim avec voyelles (forme initiale)
  'مَـ': 'chap2_pg8_case70',
  'مُـ': 'chap2_pg8_case71',
  'مِـ': 'chap2_pg8_case72',
  // Nun avec voyelles (forme initiale)
  'نَـ': 'chap2_pg8_case73',
  'نُـ': 'chap2_pg8_case74',
  'نِـ': 'chap2_pg8_case75',
  // Ha avec voyelles (forme initiale)
  'هَـ': 'chap2_pg8_case76',
  'هُـ': 'chap2_pg8_case77',
  'هِـ': 'chap2_pg8_case78',
  // Waw avec voyelles
  'وَ': 'chap2_pg8_case79',
  'وُ': 'chap2_pg8_case80',
  'وِ': 'chap2_pg8_case81',
  // Ya avec voyelles (forme initiale)
  'يَـ': 'chap2_pg8_case82',
  'يُـ': 'chap2_pg8_case83',
  'يِـ': 'chap2_pg8_case84',
  // Hamza avec voyelles (formes spéciales)
  'أَ': 'chap2_pg8_case85',
  'أُ': 'chap2_pg8_case86',
  'إِ': 'chap2_pg8_case87'
};

const Page9 = () => {
  // Fonction pour jouer l'audio avec le mapping spécifique
const playLetterAudio = (vowelLetter: string) => {
  const audioFileName = chapter2Page9AudioMappings[vowelLetter];
  if (audioFileName) {
    const audio = new Audio(`/audio/chapitre2/${audioFileName}.mp3`);
    audio.play().catch(error => {
      console.error('Erreur lors de la lecture audio:', error);
    });
  }
};

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
    { letter: 'м', vowels: ['مَـ', 'مُـ', 'مِـ'] },
    { letter: 'ن', vowels: ['نَـ', 'نُـ', 'نِـ'] },
    { letter: 'ه', vowels: ['هَـ', 'هُـ', 'هِـ'] },
    { letter: 'و', vowels: ['وَ', 'وُ', 'وِ'] },
    { letter: 'ي', vowels: ['يَـ', 'يُـ', 'يِـ'] },
    { letter: 'ء', vowels: ['أَ', 'أُ', 'إِ'] }
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
            Leçon : lettres attachées au début d'un mot avec voyelles simples
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
                nonConnecting={nonConnectingLetters.includes(group.letter)}
                onLetterClick={handleLetterClick}
              />
            ))}
          </div>
          
          {/* Footer */}
          <footer className="border-t-1 text-white text-center p-6 flex-shrink-0 font-semibold text-sm">
            <div>Page 9</div>
            <div className="mt-1">© 2025 Tous droits réservés</div>
          </footer>
        </div>
      </div>
    </div>
  );
};

// LetterGroup Component
const LetterGroup = ({ 
  letter, 
  vowels, 
  vowelNames, 
  emphatic, 
  nonConnecting, 
  onLetterClick 
}: { 
  letter: string; 
  vowels: string[];
  vowelNames: string[];
  emphatic?: boolean;
  nonConnecting?: boolean;
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

export default Page9;