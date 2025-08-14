"use client";

// components/chapitres/chapitre3/Page15.tsx
import React from 'react';
import { useAudio } from '@/';

// Mapping audio pour le Chapitre 3, Page 15 (voyelles doubles en fin de mot)
const chapter3Page15AudioMappings: { [key: string]: string } = {
  // Alif avec voyelles doubles (finale)
  'اً': 'chap3_pg15_case1',
  'اٌ': 'chap3_pg15_case2',
  'اٍ': 'chap3_pg15_case3',
  
  // Ba avec voyelles doubles (finale)
  'بًا': 'chap3_pg15_case4',
  'بٌ': 'chap3_pg15_case5',
  'بٍ': 'chap3_pg15_case6',
  
  // Ta avec voyelles doubles (finale)
  'تًا': 'chap3_pg15_case7',
  'تٌ': 'chap3_pg15_case8',
  'تٍ': 'chap3_pg15_case9',
  
  // Tha avec voyelles doubles (finale)
  'ثًا': 'chap3_pg15_case10',
  'ثٌ': 'chap3_pg15_case11',
  'ثٍ': 'chap3_pg15_case12',
  
  // Jim avec voyelles doubles (finale)
  'جًا': 'chap3_pg15_case13',
  'جٌ': 'chap3_pg15_case14',
  'جٍ': 'chap3_pg15_case15',
  
  // Ha avec voyelles doubles (finale)
  'حًا': 'chap3_pg15_case16',
  'حٌ': 'chap3_pg15_case17',
  'حٍ': 'chap3_pg15_case18',
  
  // Kha avec voyelles doubles (finale)
  'خًا': 'chap3_pg15_case19',
  'خٌ': 'chap3_pg15_case20',
  'خٍ': 'chap3_pg15_case21',
  
  // Dal avec voyelles doubles (finale)
  'دًا': 'chap3_pg15_case22',
  'دٌ': 'chap3_pg15_case23',
  'دٍ': 'chap3_pg15_case24',
  
  // Dhal avec voyelles doubles (finale)
  'ذًا': 'chap3_pg15_case25',
  'ذٌ': 'chap3_pg15_case26',
  'ذٍ': 'chap3_pg15_case27',
  
  // Ra avec voyelles doubles (finale)
  'رًا': 'chap3_pg15_case28',
  'رٌ': 'chap3_pg15_case29',
  'رٍ': 'chap3_pg15_case30',
  
  // Zay avec voyelles doubles (finale)
  'زًا': 'chap3_pg15_case31',
  'زٌ': 'chap3_pg15_case32',
  'زٍ': 'chap3_pg15_case33',
  
  // Sin avec voyelles doubles (finale)
  'سًا': 'chap3_pg15_case34',
  'سٌ': 'chap3_pg15_case35',
  'سٍ': 'chap3_pg15_case36',
  
  // Shin avec voyelles doubles (finale)
  'شًا': 'chap3_pg15_case37',
  'شٌ': 'chap3_pg15_case38',
  'شٍ': 'chap3_pg15_case39',
  
  // Sad avec voyelles doubles (finale)
  'صًا': 'chap3_pg15_case40',
  'صٌ': 'chap3_pg15_case41',
  'صٍ': 'chap3_pg15_case42',
  
  // Dad avec voyelles doubles (finale)
  'ضًا': 'chap3_pg15_case43',
  'ضٌ': 'chap3_pg15_case44',
  'ضٍ': 'chap3_pg15_case45',
  
  // Ta emphatic avec voyelles doubles (finale)
  'طًا': 'chap3_pg15_case46',
  'طٌ': 'chap3_pg15_case47',
  'طٍ': 'chap3_pg15_case48',
  
  // Dha emphatic avec voyelles doubles (finale)
  'ظًا': 'chap3_pg15_case49',
  'ظٌ': 'chap3_pg15_case50',
  'ظٍ': 'chap3_pg15_case51',
  
  // Ayn avec voyelles doubles (finale)
  'عًا': 'chap3_pg15_case52',
  'عٌ': 'chap3_pg15_case53',
  'عٍ': 'chap3_pg15_case54',
  
  // Ghayn avec voyelles doubles (finale)
  'غًا': 'chap3_pg15_case55',
  'غٌ': 'chap3_pg15_case56',
  'غٍ': 'chap3_pg15_case57',
  
  // Fa avec voyelles doubles (finale)
  'فًا': 'chap3_pg15_case58',
  'فٌ': 'chap3_pg15_case59',
  'فٍ': 'chap3_pg15_case60',
  
  // Qaf avec voyelles doubles (finale)
  'قًا': 'chap3_pg15_case61',
  'قٌ': 'chap3_pg15_case62',
  'قٍ': 'chap3_pg15_case63',
  
  // Kaf avec voyelles doubles (finale)
  'كًا': 'chap3_pg15_case64',
  'كٌ': 'chap3_pg15_case65',
  'كٍ': 'chap3_pg15_case66',
  
  // Lam avec voyelles doubles (finale)
  'لًا': 'chap3_pg15_case67',
  'لٌ': 'chap3_pg15_case68',
  'لٍ': 'chap3_pg15_case69',
  
  // Mim avec voyelles doubles (finale)
  'مًا': 'chap3_pg15_case70',
  'مٌ': 'chap3_pg15_case71',
  'مٍ': 'chap3_pg15_case72',
  
  // Nun avec voyelles doubles (finale)
  'نًا': 'chap3_pg15_case73',
  'نٌ': 'chap3_pg15_case74',
  'نٍ': 'chap3_pg15_case75',
  
  // Ha avec voyelles doubles (finale)
  'هًا': 'chap3_pg15_case76',
  'هٌ': 'chap3_pg15_case77',
  'هٍ': 'chap3_pg15_case78',
  
  // Waw avec voyelles doubles (finale)
  'وً': 'chap3_pg15_case79',
  'وٌ': 'chap3_pg15_case80',
  'وٍ': 'chap3_pg15_case81',
  
  // Ya avec voyelles doubles (finale)
  'يًا': 'chap3_pg15_case82',
  'يٌ': 'chap3_pg15_case83',
  'يٍ': 'chap3_pg15_case84'
};

const Page15 = () => {
      // Fonction pour jouer l'audio avec le mapping spécifique
const playLetterAudio = (vowelLetter: string) => {
  const audioFileName = chapter3Page15AudioMappings[vowelLetter];
  if (audioFileName) {
    const audio = new Audio(`/audio/${audioFileName}.mp3`);
    audio.play().catch(error => {
      console.error('Erreur lors de la lecture audio:', error);
    });
  }
}
  const emphaticLetters = ['خ', 'ر', 'ص', 'ض', 'ط', 'ظ', 'غ', 'ق'];
  const nonConnectingLetters = ['ا', 'د', 'ذ', 'ر', 'ز', 'و']; // Lettres qui ne se connectent pas après elles
  
const letterGroups = [
    { letter: 'ا', name: 'أَلِف', vowels: ['ـاً', 'ـاٌ', 'ـاٍ'] },
    { letter: 'ب', name: 'بَاء', vowels: ['ـبً', 'ـبٌ', 'ـبٍ'] },
    { letter: 'ت', name: 'تَاء', vowels: ['ـتً', 'ـتٌ', 'ـتٍ'] },
    { letter: 'ث', name: 'ثَاء', vowels: ['ـثً', 'ـثٌ', 'ـثٍ'] },
    { letter: 'ج', name: 'جِيم', vowels: ['ـجً', 'ـجٌ', 'ـجٍ'] },
    { letter: 'ح', name: 'حَاء', vowels: ['ـحً', 'ـحٌ', 'ـحٍ'] },
    { letter: 'خ', name: 'خَاء', vowels: ['ـخً', 'ـخٌ', 'ـخٍ'] },
    { letter: 'د', name: 'دَال', vowels: ['ـدً', 'ـدٌ', 'ـدٍ'] },
    { letter: 'ذ', name: 'ذَال', vowels: ['ـذً', 'ـذٌ', 'ـذٍ'] },
    { letter: 'ر', name: 'رَاء', vowels: ['ـرً', 'ـرٌ', 'ـرٍ'] },
    { letter: 'ز', name: 'زَاي', vowels: ['ـزً', 'ـزٌ', 'ـزٍ'] },
    { letter: 'س', name: 'سِين', vowels: ['ـسً', 'ـسٌ', 'ـسٍ'] },
    { letter: 'ش', name: 'شِين', vowels: ['ـشً', 'ـشٌ', 'ـشٍ'] },
    { letter: 'ص', name: 'صَاد', vowels: ['ـصً', 'ـصٌ', 'ـصٍ'] },
    { letter: 'ض', name: 'ضَاد', vowels: ['ـضً', 'ـضٌ', 'ـضٍ'] },
    { letter: 'ط', name: 'طَاء', vowels: ['ـطً', 'ـطٌ', 'ـطٍ'] },
    { letter: 'ظ', name: 'ظَاء', vowels: ['ـظً', 'ـظٌ', 'ـظٍ'] },
    { letter: 'ع', name: 'عَين', vowels: ['ـعً', 'ـعٌ', 'ـعٍ'] },
    { letter: 'غ', name: 'غَين', vowels: ['ـغً', 'ـغٌ', 'ـغٍ'] },
    { letter: 'ف', name: 'فَاء', vowels: ['ـفً', 'ـفٌ', 'ـفٍ'] },
    { letter: 'ق', name: 'قَاف', vowels: ['ـقً', 'ـقٌ', 'ـقٍ'] },
    { letter: 'ك', name: 'كَاف', vowels: ['ـكً', 'ـكٌ', 'ـكٍ'] },
    { letter: 'ل', name: 'لَام', vowels: ['ـلً', 'ـلٌ', 'ـلٍ'] },
    { letter: 'م', name: 'مِيم', vowels: ['ـمً', 'ـمٌ', 'ـمٍ'] },
    { letter: 'ن', name: 'نُون', vowels: ['ـنً', 'ـنٌ', 'ـنٍ'] },
    { letter: 'ه', name: 'هَاء', vowels: ['ـهً', 'ـهٌ', 'ـهٍ'] },
    { letter: 'و', name: 'وَاو', vowels: ['ـوً', 'ـوٌ', 'ـوٍ'] },
    { letter: 'ي', name: 'يَاء', vowels: ['ـيً', 'ـيٌ', 'ـيٍ'] },
    { letter: 'ء', name: 'هَمْزَة', vowels: ['ءً', 'ءٌ', 'ءٍ'] },
    { letter: 'ة', name: 'تاء مربوطة', vowels: ['ـةً', 'ـةٌ', 'ـةٍ'], special: true }
];
  const vowelNames = ['Fathatane ( son : ane )', 'Dammatane ( son : oune)', 'Kassratane ( son : in)'];

// Modifier handleLetterClick pour utiliser la nouvelle fonction
const handleLetterClick = (vowelLetter: string) => {
  playLetterAudio(vowelLetter);
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
const baseForm = vowels[0].replace(/[\u064B-\u0652]/g, "");

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