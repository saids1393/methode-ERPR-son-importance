// components/chapitres/chapitre2/Page11.tsx
import React from 'react';

const Page11 = () => {
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
}: {
  vowels: string[];
  vowelNames: string[];
  emphatic?: boolean;
  nonConnecting?: boolean;
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
            className="bg-zinc-700 border border-zinc-600 rounded-lg p-3 text-center hover:bg-zinc-600 transition-all duration-300 relative"
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