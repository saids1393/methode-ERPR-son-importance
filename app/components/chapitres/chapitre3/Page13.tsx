"use client";

// components/chapitres/chapitre3/Page13.tsx
import React from 'react';


// Mapping audio pour le Chapitre 3, Page 13 (voyelles doubles en début de mot)
const chapter3Page13AudioMappings: { [key: string]: string } = {
  // Alif avec voyelles doubles (isolé)
  'اً': 'chap3_pg13_case1',
  'اٌ': 'chap3_pg13_case2',
  'اٍ': 'chap3_pg13_case3',
  
  // Ba avec voyelles doubles (début)
  'بًـ': 'chap3_pg13_case4',
  'بٌـ': 'chap3_pg13_case5',
  'بٍـ': 'chap3_pg13_case6',
  
  // Ta avec voyelles doubles (début)
  'تًـ': 'chap3_pg13_case7',
  'تٌـ': 'chap3_pg13_case8',
  'تٍـ': 'chap3_pg13_case9',
  
  // Tha avec voyelles doubles (début)
  'ثًـ': 'chap3_pg13_case10',
  'ثٌـ': 'chap3_pg13_case11',
  'ثٍـ': 'chap3_pg13_case12',
  
  // Jim avec voyelles doubles (début)
  'جًـ': 'chap3_pg13_case13',
  'جٌـ': 'chap3_pg13_case14',
  'جٍـ': 'chap3_pg13_case15',
  
  // Ha avec voyelles doubles (début)
  'حًـ': 'chap3_pg13_case16',
  'حٌـ': 'chap3_pg13_case17',
  'حٍـ': 'chap3_pg13_case18',
  
  // Kha avec voyelles doubles (début)
  'خًـ': 'chap3_pg13_case19',
  'خٌـ': 'chap3_pg13_case20',
  'خٍـ': 'chap3_pg13_case21',
  
  // Dal avec voyelles doubles (finale)
  'دً': 'chap3_pg13_case22',
  'دٌ': 'chap3_pg13_case23',
  'دٍ': 'chap3_pg13_case24',
  
  // Dhal avec voyelles doubles (finale)
  'ذً': 'chap3_pg13_case25',
  'ذٌ': 'chap3_pg13_case26',
  'ذٍ': 'chap3_pg13_case27',
  
  // Ra avec voyelles doubles (finale)
  'رً': 'chap3_pg13_case28',
  'رٌ': 'chap3_pg13_case29',
  'رٍ': 'chap3_pg13_case30',
  
  // Zay avec voyelles doubles (finale)
  'زً': 'chap3_pg13_case31',
  'زٌ': 'chap3_pg13_case32',
  'زٍ': 'chap3_pg13_case33',
  
  // Sin avec voyelles doubles (début)
  'سًـ': 'chap3_pg13_case34',
  'سٌـ': 'chap3_pg13_case35',
  'سٍـ': 'chap3_pg13_case36',
  
  // Shin avec voyelles doubles (début)
  'شًـ': 'chap3_pg13_case37',
  'شٌـ': 'chap3_pg13_case38',
  'شٍـ': 'chap3_pg13_case39',
  
  // Sad avec voyelles doubles (début)
  'صًـ': 'chap3_pg13_case40',
  'صٌـ': 'chap3_pg13_case41',
  'صٍـ': 'chap3_pg13_case42',
  
  // Dad avec voyelles doubles (début)
  'ضًـ': 'chap3_pg13_case43',
  'ضٌـ': 'chap3_pg13_case44',
  'ضٍـ': 'chap3_pg13_case45',
  
  // Ta emphatic avec voyelles doubles (début)
  'طًـ': 'chap3_pg13_case46',
  'طٌـ': 'chap3_pg13_case47',
  'طٍـ': 'chap3_pg13_case48',
  
  // Dha emphatic avec voyelles doubles (début)
  'ظًـ': 'chap3_pg13_case49',
  'ظٌـ': 'chap3_pg13_case50',
  'ظٍـ': 'chap3_pg13_case51',
  
  // Ayn avec voyelles doubles (début)
  'عًـ': 'chap3_pg13_case52',
  'عٌـ': 'chap3_pg13_case53',
  'عٍـ': 'chap3_pg13_case54',
  
  // Ghayn avec voyelles doubles (début)
  'غًـ': 'chap3_pg13_case55',
  'غٌـ': 'chap3_pg13_case56',
  'غٍـ': 'chap3_pg13_case57',
  
  // Fa avec voyelles doubles (début)
  'فًـ': 'chap3_pg13_case58',
  'فٌـ': 'chap3_pg13_case59',
  'فٍـ': 'chap3_pg13_case60',
  
  // Qaf avec voyelles doubles (début)
  'قًـ': 'chap3_pg13_case61',
  'قٌـ': 'chap3_pg13_case62',
  'قٍـ': 'chap3_pg13_case63',
  
  // Kaf avec voyelles doubles (début)
  'كًـ': 'chap3_pg13_case64',
  'كٌـ': 'chap3_pg13_case65',
  'كٍـ': 'chap3_pg13_case66',
  
  // Lam avec voyelles doubles (début)
  'لًـ': 'chap3_pg13_case67',
  'لٌـ': 'chap3_pg13_case68',
  'لٍـ': 'chap3_pg13_case69',
  
  // Mim avec voyelles doubles (début)
  'مًـ': 'chap3_pg13_case70',
  'مٌـ': 'chap3_pg13_case71',
  'مٍـ': 'chap3_pg13_case72',
  
  // Nun avec voyelles doubles (début)
  'نًـ': 'chap3_pg13_case73',
  'نٌـ': 'chap3_pg13_case74',
  'نٍـ': 'chap3_pg13_case75',
  
  // Ha avec voyelles doubles (début)
  'هًـ': 'chap3_pg13_case76',
  'هٌـ': 'chap3_pg13_case77',
  'هٍـ': 'chap3_pg13_case78',
  
  // Waw avec voyelles doubles (finale)
  'وً': 'chap3_pg13_case79',
  'وٌ': 'chap3_pg13_case80',
  'وٍ': 'chap3_pg13_case81',
  
  // Ya avec voyelles doubles (début)
  'يًـ': 'chap3_pg13_case82',
  'يٌـ': 'chap3_pg13_case83',
  'يٍـ': 'chap3_pg13_case84',
  
  // Hamza avec voyelles doubles
  'أً': 'chap3_pg13_case85',
  'أٌ': 'chap3_pg13_case86',
  'إٍ': 'chap3_pg13_case87'
};

const Page13 = () => {
  // Fonction pour jouer l'audio avec le mapping spécifique
const playLetterAudio = (vowelLetter: string) => {
  const audioFileName = chapter3Page13AudioMappings[vowelLetter];
  if (audioFileName) {
    const audio = new Audio(`/audio/${audioFileName}.mp3`);
    audio.play().catch(error => {
      console.error('Erreur lors de la lecture audio:', error);
    });
  }
};

  const emphaticLetters = ['خ', 'ر', 'ص', 'ض', 'ط', 'ظ', 'غ', 'ق'];
  const nonConnectingLetters = ['ا', 'د', 'ذ', 'ر', 'ز', 'و']; // Lettres qui ne se connectent pas après elles
  
  const letterGroups = [
    { letter: 'ا', name: 'أَلِف', vowels: ['اً', 'اٌ', 'اٍ'] },
    { letter: 'ب', name: 'بَاء', vowels: ['بًـ', 'بٌـ', 'بٍـ'] },
    { letter: 'ت', name: 'تَاء', vowels: ['تًـ', 'تٌـ', 'تٍـ'] },
    { letter: 'ث', name: 'ثَاء', vowels: ['ثًـ', 'ثٌـ', 'ثٍـ'] },
    { letter: 'ج', name: 'جِيم', vowels: ['جًـ', 'جٌـ', 'جٍـ'] },
    { letter: 'ح', name: 'حَاء', vowels: ['حًـ', 'حٌـ', 'حٍـ'] },
    { letter: 'خ', name: 'خَاء', vowels: ['خًـ', 'خٌـ', 'خٍـ'] },
    { letter: 'د', name: 'دَال', vowels: ['دً', 'دٌ', 'دٍ'] },
    { letter: 'ذ', name: 'ذَال', vowels: ['ذً', 'ذٌ', 'ذٍ'] },
    { letter: 'ر', name: 'رَاء', vowels: ['رً', 'رٌ', 'رٍ'] },
    { letter: 'ز', name: 'زَاي', vowels: ['زً', 'زٌ', 'زٍ'] },
    { letter: 'س', name: 'سِين', vowels: ['سًـ', 'سٌـ', 'سٍـ'] },
    { letter: 'ش', name: 'شِين', vowels: ['شًـ', 'شٌـ', 'شٍـ'] },
    { letter: 'ص', name: 'صَاد', vowels: ['صًـ', 'صٌـ', 'صٍـ'] },
    { letter: 'ض', name: 'ضَاد', vowels: ['ضًـ', 'ضٌـ', 'ضٍـ'] },
    { letter: 'ط', name: 'طَاء', vowels: ['طًـ', 'طٌـ', 'طٍـ'] },
    { letter: 'ظ', name: 'ظَاء', vowels: ['ظًـ', 'ظٌـ', 'ظٍـ'] },
    { letter: 'ع', name: 'عَين', vowels: ['عًـ', 'عٌـ', 'عٍـ'] },
    { letter: 'غ', name: 'غَين', vowels: ['غًـ', 'غٌـ', 'غٍـ'] },
    { letter: 'ف', name: 'فَاء', vowels: ['فًـ', 'فٌـ', 'فٍـ'] },
    { letter: 'ق', name: 'قَاف', vowels: ['قًـ', 'قٌـ', 'قٍـ'] },
    { letter: 'ك', name: 'كَاف', vowels: ['كًـ', 'كٌـ', 'كٍـ'] },
    { letter: 'ل', name: 'لَام', vowels: ['لًـ', 'لٌـ', 'لٍـ'] },
    { letter: 'م', name: 'مِيم', vowels: ['مًـ', 'مٌـ', 'مٍـ'] },
    { letter: 'ن', name: 'نُون', vowels: ['نًـ', 'نٌـ', 'نٍـ'] },
    { letter: 'ه', name: 'هَاء', vowels: ['هًـ', 'هٌـ', 'هٍـ'] },
    { letter: 'و', name: 'وَاو', vowels: ['وً', 'وٌ', 'وٍ'] },
    { letter: 'ي', name: 'يَاء', vowels: ['يًـ', 'يٌـ', 'يٍـ'] },
    { letter: 'ء', name: 'هَمْزَة', vowels: ['أً', 'أٌ', 'إٍ'] }
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
             Leçon : lettres attachées au début d’un mot avec voyelles doubles
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
          <div>Page 13</div>
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


export default Page13;