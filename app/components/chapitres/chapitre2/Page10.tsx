// components/chapitres/chapitre2/Page10.tsx
import React from 'react';

const Page10 = () => {
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
    { letter: 'ز', name: 'زَاي', vowels: ['ـزَ', 'ـزُ', 'ـزِ'] },
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

   const vowelNames = ['Kassrah ( son : a )', 'Dammah ( son : ou )', 'Fathah ( son : i )'];

  return (
    <div 
      className="font-arabic min-h-screen"
      style={{ direction: 'rtl' }}
    >
<div className="w-full h-full bg-zinc-900 overflow-hidden">
        {/* Header */}
        <div className="bg-arabic-gradient text-white p-6 text-center">
          <div className="text-3xl md:text-3xl font-bold">
       Leçon : lettres attachées au milieu d’un mot avec voyelles simples
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
          <div>Page 10</div>
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

export default Page10;