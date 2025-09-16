"use client";

// components/chapitres/chapitre2/Page10.tsx
import React from 'react';


// Mapping audio pour le Chapitre 2, Page 10
const chapter2Page10AudioMappings: { [key: string]: string } = {
  // Alif avec voyelles (forme médiane)
  'ـاَ': 'chap2_pg8_case1',
  'ـاُ': 'chap2_pg8_case2',
  'ـاِ': 'chap2_pg8_case3',
  // Ba avec voyelles (forme médiane)
  'ـبَـ': 'chap2_pg8_case4',
  'ـبُـ': 'chap2_pg8_case5',
  'ـبِـ': 'chap2_pg8_case6',
  // Ta avec voyelles (forme médiane)
  'ـتَـ': 'chap2_pg8_case7',
  'ـتُـ': 'chap2_pg8_case8',
  'ـتِـ': 'chap2_pg8_case9',
  // Tha avec voyelles (forme médiane)
  'ـثَـ': 'chap2_pg8_case10',
  'ـثُـ': 'chap2_pg8_case11',
  'ـثِـ': 'chap2_pg8_case12',
  // Jim avec voyelles (forme médiane)
  'ـجَـ': 'chap2_pg8_case13',
  'ـجُـ': 'chap2_pg8_case14',
  'ـجِـ': 'chap2_pg8_case15',
  // Ha avec voyelles (forme médiane)
  'ـحَـ': 'chap2_pg8_case16',
  'ـحُـ': 'chap2_pg8_case17',
  'ـحِـ': 'chap2_pg8_case18',
  // Kha avec voyelles (forme médiane)
  'ـخَـ': 'chap2_pg8_case19',
  'ـخُـ': 'chap2_pg8_case20',
  'ـخِـ': 'chap2_pg8_case21',
  // Dal avec voyelles (forme finale)
  'ـدَ': 'chap2_pg8_case22',
  'ـدُ': 'chap2_pg8_case23',
  'ـدِ': 'chap2_pg8_case24',
  // Dhal avec voyelles (forme finale)
  'ـذَ': 'chap2_pg8_case25',
  'ـذُ': 'chap2_pg8_case26',
  'ـذِ': 'chap2_pg8_case27',
  // Ra avec voyelles (forme finale)
  'ـرَ': 'chap2_pg8_case28',
  'ـرُ': 'chap2_pg8_case29',
  'ـرِ': 'chap2_pg8_case30',
  // Zay avec voyelles (forme finale)
  'ـزَ': 'chap2_pg8_case31',
  'ـزُ': 'chap2_pg8_case32',
  'ـزِ': 'chap2_pg8_case33',
  // Sin avec voyelles (forme médiane)
  'ـسَـ': 'chap2_pg8_case34',
  'ـسُـ': 'chap2_pg8_case35',
  'ـسِـ': 'chap2_pg8_case36',
  // Shin avec voyelles (forme médiane)
  'ـشَـ': 'chap2_pg8_case37',
  'ـشُـ': 'chap2_pg8_case38',
  'ـشِـ': 'chap2_pg8_case39',
  // Sad avec voyelles (forme médiane)
  'ـصَـ': 'chap2_pg8_case40',
  'ـصُـ': 'chap2_pg8_case41',
  'ـصِـ': 'chap2_pg8_case42',
  // Dad avec voyelles (forme médiane)
  'ـضَـ': 'chap2_pg8_case43',
  'ـضُـ': 'chap2_pg8_case44',
  'ـضِـ': 'chap2_pg8_case45',
  // Ta emphatic avec voyelles (forme médiane)
  'ـطَـ': 'chap2_pg8_case46',
  'ـطُـ': 'chap2_pg8_case47',
  'ـطِـ': 'chap2_pg8_case48',
  // Dha emphatic avec voyelles (forme médiane)
  'ـظَـ': 'chap2_pg8_case49',
  'ـظُـ': 'chap2_pg8_case50',
  'ـظِـ': 'chap2_pg8_case51',
  // Ayn avec voyelles (forme médiane)
  'ـعَـ': 'chap2_pg8_case52',
  'ـعُـ': 'chap2_pg8_case53',
  'ـعِـ': 'chap2_pg8_case54',
  // Ghayn avec voyelles (forme médiane)
  'ـغَـ': 'chap2_pg8_case55',
  'ـغُـ': 'chap2_pg8_case56',
  'ـغِـ': 'chap2_pg8_case57',
  // Fa avec voyelles (forme médiane)
  'ـفَـ': 'chap2_pg8_case58',
  'ـفُـ': 'chap2_pg8_case59',
  'ـفِـ': 'chap2_pg8_case60',
  // Qaf avec voyelles (forme médiane)
  'ـقَـ': 'chap2_pg8_case61',
  'ـقُـ': 'chap2_pg8_case62',
  'ـقِـ': 'chap2_pg8_case63',
  // Kaf avec voyelles (forme médiane)
  'ـكَـ': 'chap2_pg8_case64',
  'ـكُـ': 'chap2_pg8_case65',
  'ـكِـ': 'chap2_pg8_case66',
  // Lam avec voyelles (forme médiane)
  'ـلَـ': 'chap2_pg8_case67',
  'ـلُـ': 'chap2_pg8_case68',
  'ـلِـ': 'chap2_pg8_case69',
  // Mim avec voyelles (forme médiane)
  'ـمَـ': 'chap2_pg8_case70',
  'ـمُـ': 'chap2_pg8_case71',
  'ـمِـ': 'chap2_pg8_case72',
  // Nun avec voyelles (forme médiane)
  'ـنَـ': 'chap2_pg8_case73',
  'ـنُـ': 'chap2_pg8_case74',
  'ـنِـ': 'chap2_pg8_case75',
  // Ha avec voyelles (forme médiane)
  'ـهَـ': 'chap2_pg8_case76',
  'ـهُـ': 'chap2_pg8_case77',
  'ـهِـ': 'chap2_pg8_case78',
  // Waw avec voyelles (forme finale)
  'ـوَ': 'chap2_pg8_case79',
  'ـوُ': 'wou-chap2',
  'ـوِ': 'wi-chap2',
  // Ya avec voyelles (forme médiane)
  'ـيَـ': 'ya-chap2',
  'ـيُـ': 'you-chap2',
  'ـيِـ': 'yi-chap2'
};

const Page10 = () => {
  // Fonction pour jouer l'audio avec le mapping spécifique
  const playLetterAudio = (vowelLetter: string) => {
    const audioFileName = chapter2Page10AudioMappings[vowelLetter];
    if (audioFileName) {
      const audio = new Audio(`/audio/chapitre2/${audioFileName}.mp3`);
      audio.play().catch(error => {
        console.error('Erreur lors de la lecture audio:', error);
      });
    }
  };

  const emphaticLetters = ['خ', 'ر', 'ص', 'ض', 'ط', 'ظ', 'غ', 'ق'];
  const nonConnectingLetters = ['ا', 'د', 'ذ', 'ر', 'ز', 'و']; // Lettres qui ne se connectent pas après elles

  const letterGroups = [
    { letter: 'ا', name: 'أَلِف', vowels: ['ـاَ', 'ـاُ', 'ـاِ'] },
    { letter: 'ب', name: 'بَاء', vowels: ['ـبَـ', 'ـبُـ', 'ـبِـ'] },
    { letter: 'ت', name: 'تَاء', vowels: ['ـتَـ', 'ـتُـ', 'ـتِـ'] },
    { letter: 'ث', name: 'ثَاء', vowels: ['ـثَـ', 'ـثُـ', 'ـثِـ'] },
    { letter: 'ج', name: 'جِيم', vowels: ['ـجَـ', 'ـجُـ', 'ـجِـ'] },
    { letter: 'ح', name: 'حَاء', vowels: ['ـحَـ', 'ـحُـ', 'ـحِـ'] },
    { letter: 'خ', name: 'خَاء', vowels: ['ـخَـ', 'ـخُـ', 'ـخِـ'] },
    { letter: 'د', name: 'دَال', vowels: ['ـدَ', 'ـدُ', 'ـدِ'] },
    { letter: 'ذ', name: 'ذَال', vowels: ['ـذَ', 'ـذُ', 'ـذِ'] },
    { letter: 'ر', name: 'رَاء', vowels: ['ـرَ', 'ـرُ', 'ـرِ'] },
    { letter: 'ز', name: 'زَاي', vowels: ['ـزَ', 'ـزُ', 'زِ'] },
    { letter: 'س', name: 'سِين', vowels: ['ـسَـ', 'ـسُـ', 'ـسِـ'] },
    { letter: 'ش', name: 'شِين', vowels: ['ـشَـ', 'ـشُـ', 'ـشِـ'] },
    { letter: 'ص', name: 'صَاد', vowels: ['ـصَـ', 'ـصُـ', 'ـصِـ'] },
    { letter: 'ض', name: 'ضَاد', vowels: ['ـضَـ', 'ـضُـ', 'ـضِـ'] },
    { letter: 'ط', name: 'طَاء', vowels: ['ـطَـ', 'ـطُـ', 'ـطِـ'] },
    { letter: 'ظ', name: 'ظَاء', vowels: ['ـظَـ', 'ـظُـ', 'ـظِـ'] },
    { letter: 'ع', name: 'عَين', vowels: ['ـعَـ', 'ـعُـ', 'ـعِـ'] },
    { letter: 'غ', name: 'غَين', vowels: ['ـغَـ', 'ـغُـ', 'ـغِـ'] },
    { letter: 'ف', name: 'فَاء', vowels: ['ـفَـ', 'ـفُـ', 'ـفِـ'] },
    { letter: 'ق', name: 'قَاف', vowels: ['ـقَـ', 'ـقُـ', 'ـقِـ'] },
    { letter: 'ك', name: 'كَاف', vowels: ['ـكَـ', 'ـكُـ', 'ـكِـ'] },
    { letter: 'ل', name: 'لَام', vowels: ['ـلَـ', 'ـلُـ', 'ـلِـ'] },
    { letter: 'م', name: 'مِيم', vowels: ['ـمَـ', 'ـمُـ', 'ـمِـ'] },
    { letter: 'ن', name: 'نُون', vowels: ['ـنَـ', 'ـنُـ', 'ـنِـ'] },
    { letter: 'ه', name: 'هَاء', vowels: ['ـهَـ', 'ـهُـ', 'ـهِـ'] },
    { letter: 'و', name: 'وَاو', vowels: ['ـوَ', 'ـوُ', 'ـوِ'] },
    { letter: 'ي', name: 'يَاء', vowels: ['ـيَـ', 'ـيُـ', 'ـيِـ'] }
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
            Leçon : lettres attachées au milieu d'un mot avec voyelles simples
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
            <div>Page 10</div>
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
          <div className={`text-2xl md:text-3xl font-bold mb-2 ${emphatic ? 'text-red-400' : 'text-white'
            }`}>
            {vowelLetter}
          </div>
          <div className={`text-xs font-semibold px-2 py-1 rounded ${index === 0 ? 'text-orange-400 bg-orange-900/30' :
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

export default Page10;