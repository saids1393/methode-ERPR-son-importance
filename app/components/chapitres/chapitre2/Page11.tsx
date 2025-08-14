"use client";

// components/chapitres/chapitre2/Page11.tsx
import React from 'react';


// Mapping audio pour le Chapitre 2, Page 11
const chapter2Page11AudioMappings: { [key: string]: string } = {
  // Alif avec voyelles (forme finale)
  'ـاَ': 'chap2_pg11_case1',
  'ـاُ': 'chap2_pg11_case2',
  'ـاِ': 'chap2_pg11_case3',
  // Ba avec voyelles (forme finale)
  'ـبَ': 'chap2_pg11_case4',
  'ـبُ': 'chap2_pg11_case5',
  'ـبِ': 'chap2_pg11_case6',
  // Ta avec voyelles (forme finale)
  'ـتَ': 'chap2_pg11_case7',
  'ـتُ': 'chap2_pg11_case8',
  'ـتِ': 'chap2_pg11_case9',
  // Tha avec voyelles (forme finale)
  'ـثَ': 'chap2_pg11_case10',
  'ـثُ': 'chap2_pg11_case11',
  'ـثِ': 'chap2_pg11_case12',
  // Jim avec voyelles (forme finale)
  'ـجَ': 'chap2_pg11_case13',
  'ـجُ': 'chap2_pg11_case14',
  'ـجِ': 'chap2_pg11_case15',
  // Ha avec voyelles (forme finale)
  'ـحَ': 'chap2_pg11_case16',
  'ـحُ': 'chap2_pg11_case17',
  'ـحِ': 'chap2_pg11_case18',
  // Kha avec voyelles (forme finale)
  'ـخَ': 'chap2_pg11_case19',
  'ـخُ': 'chap2_pg11_case20',
  'ـخِ': 'chap2_pg11_case21',
  // Dal avec voyelles (forme finale)
  'ـدَ': 'chap2_pg11_case22',
  'ـدُ': 'chap2_pg11_case23',
  'ـدِ': 'chap2_pg11_case24',
  // Dhal avec voyelles (forme finale)
  'ـذَ': 'chap2_pg11_case25',
  'ـذُ': 'chap2_pg11_case26',
  'ـذِ': 'chap2_pg11_case27',
  // Ra avec voyelles (forme finale)
  'ـرَ': 'chap2_pg11_case28',
  'ـرُ': 'chap2_pg11_case29',
  'ـرِ': 'chap2_pg11_case30',
  // Zay avec voyelles (forme finale)
  'ـزَ': 'chap2_pg11_case31',
  'ـزُ': 'chap2_pg11_case32',
  'ـزِ': 'chap2_pg11_case33',
  // Sin avec voyelles (forme finale)
  'ـسَ': 'chap2_pg11_case34',
  'ـسُ': 'chap2_pg11_case35',
  'ـسِ': 'chap2_pg11_case36',
  // Shin avec voyelles (forme finale)
  'ـشَ': 'chap2_pg11_case37',
  'ـشُ': 'chap2_pg11_case38',
  'ـشِ': 'chap2_pg11_case39',
  // Sad avec voyelles (forme finale)
  'ـصَ': 'chap2_pg11_case40',
  'ـصُ': 'chap2_pg11_case41',
  'ـصِ': 'chap2_pg11_case42',
  // Dad avec voyelles (forme finale)
  'ـضَ': 'chap2_pg11_case43',
  'ـضُ': 'chap2_pg11_case44',
  'ـضِ': 'chap2_pg11_case45',
  // Ta emphatic avec voyelles (forme finale)
  'ـطَ': 'chap2_pg11_case46',
  'ـطُ': 'chap2_pg11_case47',
  'ـطِ': 'chap2_pg11_case48',
  // Dha emphatic avec voyelles (forme finale)
  'ـظَ': 'chap2_pg11_case49',
  'ـظُ': 'chap2_pg11_case50',
  'ـظِ': 'chap2_pg11_case51',
  // Ayn avec voyelles (forme finale)
  'ـعَ': 'chap2_pg11_case52',
  'ـعُ': 'chap2_pg11_case53',
  'ـعِ': 'chap2_pg11_case54',
  // Ghayn avec voyelles (forme finale)
  'ـغَ': 'chap2_pg11_case55',
  'ـغُ': 'chap2_pg11_case56',
  'ـغِ': 'chap2_pg11_case57',
  // Fa avec voyelles (forme finale)
  'ـفَ': 'chap2_pg11_case58',
  'ـفُ': 'chap2_pg11_case59',
  'ـفِ': 'chap2_pg11_case60',
  // Qaf avec voyelles (forme finale)
  'ـقَ': 'chap2_pg11_case61',
  'ـقُ': 'chap2_pg11_case62',
  'ـقِ': 'chap2_pg11_case63',
  // Kaf avec voyelles (forme finale)
  'ـكَ': 'chap2_pg11_case64',
  'ـكُ': 'chap2_pg11_case65',
  'ـكِ': 'chap2_pg11_case66',
  // Lam avec voyelles (forme finale)
  'ـلَ': 'chap2_pg11_case67',
  'ـلُ': 'chap2_pg11_case68',
  'ـلِ': 'chap2_pg11_case69',
  // Mim avec voyelles (forme finale)
  'ـمَ': 'chap2_pg11_case70',
  'ـمُ': 'chap2_pg11_case71',
  'ـمِ': 'chap2_pg11_case72',
  // Nun avec voyelles (forme finale)
  'ـنَ': 'chap2_pg11_case73',
  'ـنُ': 'chap2_pg11_case74',
  'ـنِ': 'chap2_pg11_case75',
  // Ha avec voyelles (forme finale)
  'ـهَ': 'chap2_pg11_case76',
  'ـهُ': 'chap2_pg11_case77',
  'ـهِ': 'chap2_pg11_case78',
  // Waw avec voyelles (forme finale)
  'ـوَ': 'chap2_pg11_case79',
  'ـوُ': 'chap2_pg11_case80',
  'ـوِ': 'chap2_pg11_case81',
  // Ya avec voyelles (forme finale)
  'ـيَ': 'chap2_pg11_case82',
  'ـيُ': 'chap2_pg11_case83',
  'ـيِ': 'chap2_pg11_case84',
  // Hamza avec voyelles
  'ءَ': 'chap2_pg11_case85',
  'ءُ': 'chap2_pg11_case86',
  'ءِ': 'chap2_pg11_case87',
  // Ta marbuta avec voyelles
  'ـةَ': 'chap2_pg11_case88',
  'ـةُ': 'chap2_pg11_case89',
  'ـةِ': 'chap2_pg11_case90'
};

const Page11 = () => {
  // Fonction pour jouer l'audio avec le mapping spécifique
const playLetterAudio = (vowelLetter: string) => {
  const audioFileName = chapter2Page11AudioMappings[vowelLetter];
  if (audioFileName) {
    const audio = new Audio(`/audio/${audioFileName}.mp3`);
    audio.play().catch(error => {
      console.error('Erreur lors de la lecture audio:', error);
    });
  }
};


  const emphaticLetters = ['خ', 'ر', 'ص', 'ض', 'ط', 'ظ', 'غ', 'ق'];
  const nonConnectingLetters = ['ا', 'د', 'ذ', 'ر', 'ز', 'و', 'ء'];

  const letterGroups = [
    { letter: 'ا', vowels: ['ـاَ', 'ـاُ', 'ـاِ'] },
    { letter: 'ب', vowels: ['ـبَ', 'ـبُ', 'ـبِ'] },
    { letter: 'ت', vowels: ['ـتَ', 'ـتُ', 'ـتِ'] },
    { letter: 'ث', vowels: ['ـثَ', 'ـثُ', 'ـثِ'] },
    { letter: 'ج', vowels: ['ـجَ', 'ـجُ', 'ـجِ'] },
    { letter: 'ح', vowels: ['ـحَ', 'ـحُ', 'ـحِ'] },
    { letter: 'خ', vowels: ['ـخَ', 'ـخُ', 'ـخِ'] },
    { letter: 'د', vowels: ['ـدَ', 'ـدُ', 'ـدِ'] },
    { letter: 'ذ', vowels: ['ـذَ', 'ـذُ', 'ـذِ'] },
    { letter: 'ر', vowels: ['ـرَ', 'ـرُ', 'ـرِ'] },
    { letter: 'ز', vowels: ['ـزَ', 'ـزُ', 'ـزِ'] },
    { letter: 'س', vowels: ['ـسَ', 'ـسُ', 'ـسِ'] },
    { letter: 'ش', vowels: ['ـشَ', 'ـشُ', 'ـشِ'] },
    { letter: 'ص', vowels: ['ـصَ', 'ـصُ', 'ـصِ'] },
    { letter: 'ض', vowels: ['ـضَ', 'ـضُ', 'ـضِ'] },
    { letter: 'ط', vowels: ['ـطَ', 'ـطُ', 'ـطِ'] },
    { letter: 'ظ', vowels: ['ـظَ', 'ـظُ', 'ـظِ'] },
    { letter: 'ع', vowels: ['ـعَ', 'ـعُ', 'ـعِ'] },
    { letter: 'غ', vowels: ['ـغَ', 'ـغُ', 'ـغِ'] },
    { letter: 'ف', vowels: ['ـفَ', 'ـفُ', 'ـفِ'] },
    { letter: 'ق', vowels: ['ـقَ', 'ـقُ', 'ـقِ'] },
    { letter: 'ك', vowels: ['ـكَ', 'ـكُ', 'ـكِ'] },
    { letter: 'ل', vowels: ['ـلَ', 'ـلُ', 'ـلِ'] },
    { letter: 'م', vowels: ['ـمَ', 'ـمُ', 'ـمِ'] },
    { letter: 'ن', vowels: ['ـنَ', 'ـنُ', 'ـنِ'] },
    { letter: 'ه', vowels: ['ـهَ', 'ـهُ', 'ـهِ'] },
    { letter: 'و', vowels: ['ـوَ', 'ـوُ', 'ـوِ'] },
    { letter: 'ي', vowels: ['ـيَ', 'ـيُ', 'ـيِ'] },
    { letter: 'ء', vowels: ['ءَ', 'ءُ', 'ءِ'] },
    { letter: 'ة', vowels: ['ـةَ', 'ـةُ', 'ـةِ'], special: true }
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
      <div className="w-full h-full bg-zinc-900 overflow-hidden">
        {/* Header */}
        <div className="bg-arabic-gradient text-white p-6 text-center">
          <div className="text-3xl md:text-3xl font-bold">
            Leçon : lettres attachées à la fin d’un mot avec voyelles simples
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
      <div className="grid grid-cols-3 gap-3">
        {vowels.map((vowelLetter, index) => (
          <div
            key={index}
            className="bg-zinc-700 border border-zinc-600 rounded-lg p-3 text-center hover:bg-zinc-600 transition-all duration-300 relative cursor-pointer"
            onClick={() => onLetterClick?.(vowelLetter)}
          >
            <div
              className={`text-2xl md:text-3xl font-bold mb-2 ${emphatic ? 'text-red-400' : 'text-white'
                }`}
            >
              {vowelLetter}
            </div>
            <div
              className={`text-xs font-semibold px-2 py-1 rounded ${index === 0
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

export default Page11;