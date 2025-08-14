"use client";

// components/chapitres/chapitre2/Page9.tsx
import React from 'react';
import { useAudio } from '@/hooks/useAudio';

// Mapping audio pour le Chapitre 2, Page 9
const chapter2Page9AudioMappings: { [key: string]: string } = {
  // Alif avec voyelles
  'اَ': 'chap2_pg9_case1',
  'اُ': 'chap2_pg9_case2',
  'اِ': 'chap2_pg9_case3',
  // Ba avec voyelles (forme initiale)
  'بَـ': 'chap2_pg9_case4',
  'بُـ': 'chap2_pg9_case5',
  'بِـ': 'chap2_pg9_case6',
  // Ta avec voyelles (forme initiale)
  'تَـ': 'chap2_pg9_case7',
  'تُـ': 'chap2_pg9_case8',
  'تِـ': 'chap2_pg9_case9',
  // Tha avec voyelles (forme initiale)
  'ثَـ': 'chap2_pg9_case10',
  'ثُـ': 'chap2_pg9_case11',
  'ثِـ': 'chap2_pg9_case12',
  // Jim avec voyelles (forme initiale)
  'جَـ': 'chap2_pg9_case13',
  'جُـ': 'chap2_pg9_case14',
  'جِـ': 'chap2_pg9_case15',
  // Ha avec voyelles (forme initiale)
  'حَـ': 'chap2_pg9_case16',
  'حُـ': 'chap2_pg9_case17',
  'حِـ': 'chap2_pg9_case18',
  // Kha avec voyelles (forme initiale)
  'خَـ': 'chap2_pg9_case19',
  'خُـ': 'chap2_pg9_case20',
  'خِـ': 'chap2_pg9_case21',
  // Dal avec voyelles
  'دَ': 'chap2_pg9_case22',
  'دُ': 'chap2_pg9_case23',
  'دِ': 'chap2_pg9_case24',
  // Dhal avec voyelles
  'ذَ': 'chap2_pg9_case25',
  'ذُ': 'chap2_pg9_case26',
  'ذِ': 'chap2_pg9_case27',
  // Ra avec voyelles
  'رَ': 'chap2_pg9_case28',
  'رُ': 'chap2_pg9_case29',
  'رِ': 'chap2_pg9_case30',
  // Zay avec voyelles
  'زَ': 'chap2_pg9_case31',
  'زُ': 'chap2_pg9_case32',
  'زِ': 'chap2_pg9_case33',
  // Sin avec voyelles (forme initiale)
  'سَـ': 'chap2_pg9_case34',
  'سُـ': 'chap2_pg9_case35',
  'سِـ': 'chap2_pg9_case36',
  // Shin avec voyelles (forme initiale)
  'شَـ': 'chap2_pg9_case37',
  'شُـ': 'chap2_pg9_case38',
  'شِـ': 'chap2_pg9_case39',
  // Sad avec voyelles (forme initiale)
  'صَـ': 'chap2_pg9_case40',
  'صُـ': 'chap2_pg9_case41',
  'صِـ': 'chap2_pg9_case42',
  // Dad avec voyelles (forme initiale)
  'ضَـ': 'chap2_pg9_case43',
  'ضُـ': 'chap2_pg9_case44',
  'ضِـ': 'chap2_pg9_case45',
  // Ta emphatic avec voyelles (forme initiale)
  'طَـ': 'chap2_pg9_case46',
  'طُـ': 'chap2_pg9_case47',
  'طِـ': 'chap2_pg9_case48',
  // Dha emphatic avec voyelles (forme initiale)
  'ظَـ': 'chap2_pg9_case49',
  'ظُـ': 'chap2_pg9_case50',
  'ظِـ': 'chap2_pg9_case51',
  // Ayn avec voyelles (forme initiale)
  'عَـ': 'chap2_pg9_case52',
  'عُـ': 'chap2_pg9_case53',
  'عِـ': 'chap2_pg9_case54',
  // Ghayn avec voyelles (forme initiale)
  'غَـ': 'chap2_pg9_case55',
  'غُـ': 'chap2_pg9_case56',
  'غِـ': 'chap2_pg9_case57',
  // Fa avec voyelles (forme initiale)
  'فَـ': 'chap2_pg9_case58',
  'فُـ': 'chap2_pg9_case59',
  'فِـ': 'chap2_pg9_case60',
  // Qaf avec voyelles (forme initiale)
  'قَـ': 'chap2_pg9_case61',
  'قُـ': 'chap2_pg9_case62',
  'قِـ': 'chap2_pg9_case63',
  // Kaf avec voyelles (forme initiale)
  'كَـ': 'chap2_pg9_case64',
  'كُـ': 'chap2_pg9_case65',
  'كِـ': 'chap2_pg9_case66',
  // Lam avec voyelles (forme initiale)
  'لَـ': 'chap2_pg9_case67',
  'لُـ': 'chap2_pg9_case68',
  'لِـ': 'chap2_pg9_case69',
  // Mim avec voyelles (forme initiale)
  'مَـ': 'chap2_pg9_case70',
  'مُـ': 'chap2_pg9_case71',
  'مِـ': 'chap2_pg9_case72',
  // Nun avec voyelles (forme initiale)
  'نَـ': 'chap2_pg9_case73',
  'نُـ': 'chap2_pg9_case74',
  'نِـ': 'chap2_pg9_case75',
  // Ha avec voyelles (forme initiale)
  'هَـ': 'chap2_pg9_case76',
  'هُـ': 'chap2_pg9_case77',
  'هِـ': 'chap2_pg9_case78',
  // Waw avec voyelles
  'وَ': 'chap2_pg9_case79',
  'وُ': 'chap2_pg9_case80',
  'وِ': 'chap2_pg9_case81',
  // Ya avec voyelles (forme initiale)
  'يَـ': 'chap2_pg9_case82',
  'يُـ': 'chap2_pg9_case83',
  'يِـ': 'chap2_pg9_case84',
  // Hamza avec voyelles (formes spéciales)
  'أَ': 'chap2_pg9_case85',
  'أُ': 'chap2_pg9_case86',
  'إِ': 'chap2_pg9_case87'
};

const Page9 = () => {
  // Fonction pour jouer l'audio avec le mapping spécifique
const playLetterAudio = (vowelLetter: string) => {
  const audioFileName = chapter2Page9AudioMappings[vowelLetter];
  if (audioFileName) {
    const audio = new Audio(`/audio/${audioFileName}.mp3`);
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
    { letter: 'م', vowels: ['مَـ', 'مُـ', 'مِـ'] },
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
