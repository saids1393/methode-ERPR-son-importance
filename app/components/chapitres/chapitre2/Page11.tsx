// components/chapitres/chapitre2/Page11.tsx
import React from 'react';

const Page11 = () => {
  const emphaticLetters = ['خ', 'ر', 'ص', 'ض', 'ط', 'ظ', 'غ', 'ق'];
  
  const letterGroups = [
    { letter: 'ا', name: 'أَلِف', vowels: ['ـاَ', 'ـاُ', 'ـاِ'] },
    { letter: 'ب', name: 'بَاء', vowels: ['ـبَ', 'ـبُ', 'ـبِ'] },
    { letter: 'ت', name: 'تَاء', vowels: ['ـتَ', 'ـتُ', 'ـتِ'] },
    { letter: 'ث', name: 'ثَاء', vowels: ['ـثَ', 'ـثُ', 'ـثِ'] },
    { letter: 'ج', name: 'جِيم', vowels: ['ـجَ', 'ـجُ', 'ـجِ'] },
    { letter: 'ح', name: 'حَاء', vowels: ['ـحَ', 'ـحُ', 'ـحِ'] },
    { letter: 'خ', name: 'خَاء', vowels: ['ـخَ', 'ـخُ', 'ـخِ'] },
    { letter: 'د', name: 'دَال', vowels: ['ـدَ', 'ـدُ', 'ـدِ'] },
    { letter: 'ذ', name: 'ذَال', vowels: ['ـذَ', 'ـذُ', 'ـذِ'] },
    { letter: 'ر', name: 'رَاء', vowels: ['ـرَ', 'ـرُ', 'ـرِ'] },
    { letter: 'ز', name: 'زَاي', vowels: ['ـزَ', 'ـزُ', 'ـزِ'] },
    { letter: 'س', name: 'سِين', vowels: ['ـسَ', 'ـسُ', 'ـسِ'] },
    { letter: 'ش', name: 'شِين', vowels: ['ـشَ', 'ـشُ', 'ـشِ'] },
    { letter: 'ص', name: 'صَاد', vowels: ['ـصَ', 'ـصُ', 'ـصِ'] },
    { letter: 'ض', name: 'ضَاد', vowels: ['ـضَ', 'ـضُ', 'ـضِ'] },
    { letter: 'ط', name: 'طَاء', vowels: ['ـطَ', 'ـطُ', 'ـطِ'] },
    { letter: 'ظ', name: 'ظَاء', vowels: ['ـظَ', 'ـظُ', 'ـظِ'] },
    { letter: 'ع', name: 'عَين', vowels: ['ـعَ', 'ـعُ', 'ـعِ'] },
    { letter: 'غ', name: 'غَين', vowels: ['ـغَ', 'ـغُ', 'ـغِ'] },
    { letter: 'ف', name: 'فَاء', vowels: ['ـفَ', 'ـفُ', 'ـفِ'] },
    { letter: 'ق', name: 'قَاف', vowels: ['ـقَ', 'ـقُ', 'ـقِ'] },
    { letter: 'ك', name: 'كَاف', vowels: ['ـكَ', 'ـكُ', 'ـكِ'] },
    { letter: 'ل', name: 'لَام', vowels: ['ـلَ', 'ـلُ', 'ـلِ'] },
    { letter: 'م', name: 'مِيم', vowels: ['ـمَ', 'ـمُ', 'ـمِ'] },
    { letter: 'ن', name: 'نُون', vowels: ['ـنَ', 'ـنُ', 'ـنِ'] },
    { letter: 'ه', name: 'هَاء', vowels: ['ـهَ', 'ـهُ', 'ـهِ'] },
    { letter: 'و', name: 'وَاو', vowels: ['ـوَ', 'ـوُ', 'ـوِ'] },
    { letter: 'ي', name: 'يَاء', vowels: ['ـيَ', 'ـيُ', 'ـيِ'] },
    { letter: 'ء', name: 'هَمْزَة', vowels: ['ءَ', 'ءُ', 'ءِ'] },
    { letter: 'ة', name: 'تَاء مَرْبُوطَة', vowels: ['ـةَ', 'ـةُ', 'ـةِ'], special: true }
  ];

  const vowelNames = ['فَتْحَة', 'ضَمَّة', 'كَسْرَة'];

  return (
    <div 
      className="font-arabic min-h-screen"
      style={{ direction: 'rtl' }}
    >
      <div className="w-full h-full bg-zinc-900 overflow-hidden">
        {/* Header */}
        <div className="bg-arabic-gradient text-white p-6 text-center">
          <div className="text-3xl font-bold mb-4">بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ</div>
          <div className="bg-white/10 px-6 py-3 rounded-full text-lg font-semibold backdrop-blur-sm border border-white/20 inline-block">
            تَعَلُّمُ الْحُرُوفِ الْعَرَبِيَّةِ فِي نِهَايَةِ الْكَلِمَةِ
          </div>
          <div className="text-sm mt-2 opacity-90">
            الشَّكْلُ النِّهَائِيُّ مَعَ الْحَرَكَاتِ الثَّلَاثِ
          </div>
        </div>
        
        {/* Letters with Vowels Grid */}
        <div className="p-8 bg-zinc-900">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {letterGroups.map((group, index) => (
              <FinalLetterGroup 
                key={index} 
                letter={group.letter}
                name={group.name}
                vowels={group.vowels}
                vowelNames={vowelNames}
                emphatic={emphaticLetters.includes(group.letter)}
                special={group.special}
              />
            ))}
          </div>
          
          {/* Progress Bar */}
          <div className="w-full h-2 bg-zinc-800 rounded-full mb-6 overflow-hidden">
            <div 
              className="h-full bg-arabic-gradient rounded-full animate-progress"
            ></div>
          </div>
          
          {/* Légende pour les voyelles */}
          <div className="bg-zinc-800 rounded-lg p-4 mb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-center gap-4 text-sm flex-wrap">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-400 rounded-full"></div>
                  <span className="text-green-400">فَتْحَة (a)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-400 rounded-full"></div>
                  <span className="text-blue-400">ضَمَّة (u)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-orange-400 rounded-full"></div>
                  <span className="text-orange-400">كَسْرَة (i)</span>
                </div>
              </div>
              <div className="flex items-center justify-center gap-4 text-sm flex-wrap">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-400 rounded-full"></div>
                  <span className="text-red-400">الحروف المفخمة</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-cyan-400 rounded-full"></div>
                  <span className="text-cyan-400">شكل خاص</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="bg-gradient-to-r from-zinc-800 to-zinc-700 text-white p-5 flex justify-between items-center">
          <div className="text-lg font-semibold">الحروف في نهاية الكلمة - الحركات الثلاث</div>
          <div className="bg-arabic-gradient text-white px-5 py-2 rounded-full font-semibold">
            الصفحة الحادية عشرة
          </div>
        </div>
      </div>
    </div>
  );
};

// FinalLetterGroup Component pour chaque groupe de lettre avec ses 3 voyelles
const FinalLetterGroup = ({ letter, name, vowels, vowelNames, emphatic, special }: { 
  letter: string; 
  name: string; 
  vowels: string[];
  vowelNames: string[];
  emphatic?: boolean;
  special?: boolean;
}) => (
  <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-4">
    {/* Titre du groupe */}
    <div className="text-center font-bold text-lg text-indigo-300 mb-4 bg-indigo-900/30 py-2 rounded-lg">
      {name}
    </div>
    
    {/* Grille des 3 voyelles */}
    <div className="grid grid-cols-3 gap-3">
      {vowels.map((vowelLetter, index) => (
        <div key={index} className="bg-zinc-700 border border-zinc-600 rounded-lg p-3 text-center hover:bg-zinc-600 transition-all duration-300 relative">
          <div className={`text-2xl md:text-3xl font-bold mb-2 ${
            emphatic ? 'text-red-400' : 'text-white'
          }`}>
            {vowelLetter}
          </div>
          <div className={`text-xs font-semibold px-2 py-1 rounded ${
            index === 0 ? 'text-green-400 bg-green-900/30' :
            index === 1 ? 'text-blue-400 bg-blue-900/30' :
            'text-orange-400 bg-orange-900/30'
          }`}>
            {vowelNames[index]}
          </div>
          
          {/* Indicateur spécial pour la taa marbouta */}
          {special && index === 0 && (
            <div className="text-xs text-cyan-400 bg-cyan-900/30 px-1 py-1 rounded mt-2">
              شكل خاص
            </div>
          )}
        </div>
      ))}
    </div>
  </div>
);

export default Page11;