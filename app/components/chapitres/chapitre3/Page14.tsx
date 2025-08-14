"use client";

// components/chapitres/chapitre3/Page14.tsx
import React from 'react';
import { useAudio } from '@/';
// Mapping audio pour le Chapitre 3, Page 14 (voyelles doubles en milieu de mot)
const chapter3Page14AudioMappings: { [key: string]: string } = {
  // Alif avec voyelles doubles (milieu)
  'ـاً': 'chap3_pg14_case1',
  'ـاٌ': 'chap3_pg14_case2',
  'ـاٍ': 'chap3_pg14_case3',
  
  // Ba avec voyelles doubles (milieu)
  'ـبًـ': 'chap3_pg14_case4',
  'ـبٌـ': 'chap3_pg14_case5',
  'ـبٍـ': 'chap3_pg14_case6',
  
  // Ta avec voyelles doubles (milieu)
  'ـتًـ': 'chap3_pg14_case7',
  'ـتٌـ': 'chap3_pg14_case8',
  'ـتٍـ': 'chap3_pg14_case9',
  
  // Tha avec voyelles doubles (milieu)
  'ـثًـ': 'chap3_pg14_case10',
  'ـثٌـ': 'chap3_pg14_case11',
  'ـثٍـ': 'chap3_pg14_case12',
  
  // Jim avec voyelles doubles (milieu)
  'ـجًـ': 'chap3_pg14_case13',
  'ـجٌـ': 'chap3_pg14_case14',
  'ـجٍـ': 'chap3_pg14_case15',
  
  // Ha avec voyelles doubles (milieu)
  'ـحًـ': 'chap3_pg14_case16',
  'ـحٌـ': 'chap3_pg14_case17',
  'ـحٍـ': 'chap3_pg14_case18',
  
  // Kha avec voyelles doubles (milieu)
  'ـخًـ': 'chap3_pg14_case19',
  'ـخٌـ': 'chap3_pg14_case20',
  'ـخٍـ': 'chap3_pg14_case21',
  
  // Dal avec voyelles doubles (finale)
  'ـدً': 'chap3_pg14_case22',
  'ـدٌ': 'chap3_pg14_case23',
  'ـدٍ': 'chap3_pg14_case24',
  
  // Dhal avec voyelles doubles (finale)
  'ـذً': 'chap3_pg14_case25',
  'ـذٌ': 'chap3_pg14_case26',
  'ـذٍ': 'chap3_pg14_case27',
  
  // Ra avec voyelles doubles (finale)
  'ـرً': 'chap3_pg14_case28',
  'ـرٌ': 'chap3_pg14_case29',
  'ـرٍ': 'chap3_pg14_case30',
  
  // Zay avec voyelles doubles (finale)
  'ـزً': 'chap3_pg14_case31',
  'ـزٌ': 'chap3_pg14_case32',
  'ـزٍ': 'chap3_pg14_case33',
  
  // Sin avec voyelles doubles (milieu)
  'ـسًـ': 'chap3_pg14_case34',
  'ـسٌـ': 'chap3_pg14_case35',
  'ـسٍـ': 'chap3_pg14_case36',
  
  // Shin avec voyelles doubles (milieu)
  'ـشًـ': 'chap3_pg14_case37',
  'ـشٌـ': 'chap3_pg14_case38',
  'ـشٍـ': 'chap3_pg14_case39',
  
  // Sad avec voyelles doubles (milieu)
  'ـصًـ': 'chap3_pg14_case40',
  'ـصٌـ': 'chap3_pg14_case41',
  'ـصٍـ': 'chap3_pg14_case42',
  
  // Dad avec voyelles doubles (milieu)
  'ـضًـ': 'chap3_pg14_case43',
  'ـضٌـ': 'chap3_pg14_case44',
  'ـضٍـ': 'chap3_pg14_case45',
  
  // Ta emphatic avec voyelles doubles (milieu)
  'ـطًـ': 'chap3_pg14_case46',
  'ـطٌـ': 'chap3_pg14_case47',
  'ـطٍـ': 'chap3_pg14_case48',
  
  // Dha emphatic avec voyelles doubles (milieu)
  'ـظًـ': 'chap3_pg14_case49',
  'ـظٌـ': 'chap3_pg14_case50',
  'ـظٍـ': 'chap3_pg14_case51',
  
  // Ayn avec voyelles doubles (milieu)
  'ـعًـ': 'chap3_pg14_case52',
  'ـعٌـ': 'chap3_pg14_case53',
  'ـعٍـ': 'chap3_pg14_case54',
  
  // Ghayn avec voyelles doubles (milieu)
  'ـغًـ': 'chap3_pg14_case55',
  'ـغٌـ': 'chap3_pg14_case56',
  'ـغٍـ': 'chap3_pg14_case57',
  
  // Fa avec voyelles doubles (milieu)
  'ـفًـ': 'chap3_pg14_case58',
  'ـفٌـ': 'chap3_pg14_case59',
  'ـفٍـ': 'chap3_pg14_case60',
  
  // Qaf avec voyelles doubles (milieu)
  'ـقًـ': 'chap3_pg14_case61',
  'ـقٌـ': 'chap3_pg14_case62',
  'ـقٍـ': 'chap3_pg14_case63',
  
  // Kaf avec voyelles doubles (milieu)
  'ـكًـ': 'chap3_pg14_case64',
  'ـكٌـ': 'chap3_pg14_case65',
  'ـكٍـ': 'chap3_pg14_case66',
  
  // Lam avec voyelles doubles (milieu)
  'ـلًـ': 'chap3_pg14_case67',
  'ـلٌـ': 'chap3_pg14_case68',
  'ـلٍـ': 'chap3_pg14_case69',
  
  // Mim avec voyelles doubles (milieu)
  'ـمًـ': 'chap3_pg14_case70',
  'ـمٌـ': 'chap3_pg14_case71',
  'ـمٍـ': 'chap3_pg14_case72',
  
  // Nun avec voyelles doubles (milieu)
  'ـنًـ': 'chap3_pg14_case73',
  'ـنٌـ': 'chap3_pg14_case74',
  'ـنٍـ': 'chap3_pg14_case75',
  
  // Ha avec voyelles doubles (milieu)
  'ـهًـ': 'chap3_pg14_case76',
  'ـهٌـ': 'chap3_pg14_case77',
  'ـهٍـ': 'chap3_pg14_case78',
  
  // Waw avec voyelles doubles (finale)
  'ـوً': 'chap3_pg14_case79',
  'ـوٌ': 'chap3_pg14_case80',
  'ـوٍ': 'chap3_pg14_case81',
  
  // Ya avec voyelles doubles (milieu)
  'ـيًـ': 'chap3_pg14_case82',
  'ـيٌـ': 'chap3_pg14_case83',
  'ـيٍـ': 'chap3_pg14_case84'
};

const Page14 = () => {
    // Fonction pour jouer l'audio avec le mapping spécifique
const playLetterAudio = (vowelLetter: string) => {
  const audioFileName = chapter3Page14AudioMappings[vowelLetter];
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
    { letter: 'ب', name: 'بَاء', vowels: ['ـبًـ', 'ـبٌـ', 'ـبٍـ'] },
    { letter: 'ت', name: 'تَاء', vowels: ['ـتًـ', 'ـتٌـ', 'ـتٍـ'] },
    { letter: 'ث', name: 'ثَاء', vowels: ['ـثًـ', 'ـثٌـ', 'ـثٍـ'] },
    { letter: 'ج', name: 'جِيم', vowels: ['ـجًـ', 'ـجٌـ', 'ـجٍـ'] },
    { letter: 'ح', name: 'حَاء', vowels: ['ـحًـ', 'ـحٌـ', 'ـحٍـ'] },
    { letter: 'خ', name: 'خَاء', vowels: ['ـخًـ', 'ـخٌـ', 'ـخٍـ'] },
    { letter: 'د', name: 'دَال', vowels: ['ـدً', 'ـدٌ', 'ـدٍ'] },
    { letter: 'ذ', name: 'ذَال', vowels: ['ـذً', 'ـذٌ', 'ـذٍ'] },
    { letter: 'ر', name: 'رَاء', vowels: ['ـرً', 'ـرٌ', 'ـرٍ'] },
    { letter: 'ز', name: 'زَاي', vowels: ['ـزً', 'ـزٌ', 'ـزٍ'] },
    { letter: 'س', name: 'سِين', vowels: ['ـسًـ', 'ـسٌـ', 'ـسٍـ'] },
    { letter: 'ش', name: 'شِين', vowels: ['ـشًـ', 'ـشٌـ', 'ـشٍـ'] },
    { letter: 'ص', name: 'صَاد', vowels: ['ـصًـ', 'ـصٌـ', 'ـصٍـ'] },
    { letter: 'ض', name: 'ضَاد', vowels: ['ـضًـ', 'ـضٌـ', 'ـضٍـ'] },
    { letter: 'ط', name: 'طَاء', vowels: ['ـطًـ', 'ـطٌـ', 'ـطٍـ'] },
    { letter: 'ظ', name: 'ظَاء', vowels: ['ـظًـ', 'ـظٌـ', 'ـظٍـ'] },
    { letter: 'ع', name: 'عَين', vowels: ['ـعًـ', 'ـعٌـ', 'ـعٍـ'] },
    { letter: 'غ', name: 'غَين', vowels: ['ـغًـ', 'ـغٌـ', 'ـغٍـ'] },
    { letter: 'ف', name: 'فَاء', vowels: ['ـفًـ', 'ـفٌـ', 'ـفٍـ'] },
    { letter: 'ق', name: 'قَاف', vowels: ['ـقًـ', 'ـقٌـ', 'ـقٍـ'] },
    { letter: 'ك', name: 'كَاف', vowels: ['ـكًـ', 'ـكٌـ', 'ـكٍـ'] },
    { letter: 'ل', name: 'لَام', vowels: ['ـلًـ', 'ـلٌـ', 'ـلٍـ'] },
    { letter: 'م', name: 'مِيم', vowels: ['ـمًـ', 'ـمٌـ', 'ـمٍـ'] },
    { letter: 'ن', name: 'نُون', vowels: ['ـنًـ', 'ـنٌـ', 'ـنٍـ'] },
    { letter: 'ه', name: 'هَاء', vowels: ['ـهًـ', 'ـهٌـ', 'ـهٍـ'] },
    { letter: 'و', name: 'وَاو', vowels: ['ـوً', 'ـوٌ', 'ـوٍ'] },
    { letter: 'ي', name: 'يَاء', vowels: ['ـيًـ', 'ـيٌـ', 'ـيٍـ'] }
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
           Leçon : lettres attachées au milieu d’un mot avec voyelles doubles
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
          <div>Page 14</div>
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


export default Page14;