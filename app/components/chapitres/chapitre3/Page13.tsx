// components/chapitres/chapitre3/Page13.tsx
import React from 'react';

const Page13 = () => {
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

  return (
    <div 
      className="font-arabic min-h-screen"
      style={{ direction: 'rtl' }}
    >
      <div className="w-full h-full bg-zinc-900 overflow-hidden">
        {/* Header */}
         <div className="bg-arabic-gradient text-white p-6 text-center">
          <div className="text-3xl md:text-3xl font-bold">
             Lettres attachées en début de mot avec doubles voyelles (harakaatane)
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


export default Page13;