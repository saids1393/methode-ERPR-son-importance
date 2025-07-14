// components/chapitres/chapitre2/Page9.tsx
import React from 'react';

const Page9 = () => {
  const emphaticLetters = ['خ', 'ر', 'ص', 'ض', 'ط', 'ظ', 'غ', 'ق'];
  const nonConnectingLetters = ['ا', 'د', 'ذ', 'ر', 'ز', 'و']; // Lettres qui ne se connectent pas après elles
  
  const letterGroups = [
    { letter: 'ا', name: 'أَلِف', vowels: ['اَ', 'اُ', 'اِ'] },
    { letter: 'ب', name: 'بَاء', vowels: ['بَـ', 'بُـ', 'بِـ'] },
    { letter: 'ت', name: 'تَاء', vowels: ['تَـ', 'تُـ', 'تِـ'] },
    { letter: 'ث', name: 'ثَاء', vowels: ['ثَـ', 'ثُـ', 'ثِـ'] },
    { letter: 'ج', name: 'جِيم', vowels: ['جَـ', 'جُـ', 'جِـ'] },
    { letter: 'ح', name: 'حَاء', vowels: ['حَـ', 'حُـ', 'حِـ'] },
    { letter: 'خ', name: 'خَاء', vowels: ['خَـ', 'خُـ', 'خِـ'] },
    { letter: 'د', name: 'دَال', vowels: ['دَ', 'دُ', 'دِ'] },
    { letter: 'ذ', name: 'ذَال', vowels: ['ذَ', 'ذُ', 'ذِ'] },
    { letter: 'ر', name: 'رَاء', vowels: ['رَ', 'رُ', 'رِ'] },
    { letter: 'ز', name: 'زَاي', vowels: ['زَ', 'زُ', 'زِ'] },
    { letter: 'س', name: 'سِين', vowels: ['سَـ', 'سُـ', 'سِـ'] },
    { letter: 'ش', name: 'شِين', vowels: ['شَـ', 'شُـ', 'شِـ'] },
    { letter: 'ص', name: 'صَاد', vowels: ['صَـ', 'صُـ', 'صِـ'] },
    { letter: 'ض', name: 'ضَاد', vowels: ['ضَـ', 'ضُـ', 'ضِـ'] },
    { letter: 'ط', name: 'طَاء', vowels: ['طَـ', 'طُـ', 'طِـ'] },
    { letter: 'ظ', name: 'ظَاء', vowels: ['ظَـ', 'ظُـ', 'ظِـ'] },
    { letter: 'ع', name: 'عَين', vowels: ['عَـ', 'عُـ', 'عِـ'] },
    { letter: 'غ', name: 'غَين', vowels: ['غَـ', 'غُـ', 'غِـ'] },
    { letter: 'ف', name: 'فَاء', vowels: ['فَـ', 'فُـ', 'فِـ'] },
    { letter: 'ق', name: 'قَاف', vowels: ['قَـ', 'قُـ', 'قِـ'] },
    { letter: 'ك', name: 'كَاف', vowels: ['كَـ', 'كُـ', 'كِـ'] },
    { letter: 'ل', name: 'لَام', vowels: ['لَـ', 'لُـ', 'لِـ'] },
    { letter: 'م', name: 'مِيم', vowels: ['مَـ', 'مُـ', 'مِـ'] },
    { letter: 'ن', name: 'نُون', vowels: ['نَـ', 'نُـ', 'نِـ'] },
    { letter: 'ه', name: 'هَاء', vowels: ['هَـ', 'هُـ', 'هِـ'] },
    { letter: 'و', name: 'وَاو', vowels: ['وَ', 'وُ', 'وِ'] },
    { letter: 'ي', name: 'يَاء', vowels: ['يَـ', 'يُـ', 'يِـ'] },
    { letter: 'ء', name: 'هَمْزَة', vowels: ['أَ', 'أُ', 'إِ'] }
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
            تَعَلُّمُ الْحُرُوفِ الْعَرَبِيَّةِ فِي بِدَايَةِ الْكَلِمَةِ
          </div>
          <div className="text-sm mt-2 opacity-90">
            الشَّكْلُ الْأَوَّلِيُّ مَعَ الْحَرَكَاتِ الثَّلَاثِ
          </div>
        </div>
        
        {/* Letters with Vowels Grid */}
        <div className="p-8 bg-zinc-900">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {letterGroups.map((group, index) => (
              <InitialLetterGroup 
                key={index} 
                letter={group.letter}
                name={group.name}
                vowels={group.vowels}
                vowelNames={vowelNames}
                emphatic={emphaticLetters.includes(group.letter)}
                nonConnecting={nonConnectingLetters.includes(group.letter)}
              />
            ))}
            
            {/* Note spéciale pour la taa marbouta */}
            <div className="md:col-span-2 bg-zinc-800 border border-zinc-700 rounded-xl p-6">
              <div className="text-center font-bold text-lg text-yellow-400 mb-3 bg-yellow-900/30 py-2 rounded-lg">
                مُلَاحَظَة مُهِمَّة
              </div>
              <div className="text-center text-zinc-300 text-base">
                تَاء مَرْبُوطَة (ة) لَا تَأْتِي فِي بِدَايَةِ الْكَلِمَةِ أَبَدًا
              </div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full h-2 bg-zinc-800 rounded-full mb-6 overflow-hidden">
            <div 
              className="h-full bg-arabic-gradient rounded-full animate-progress"
            ></div>
          </div>
          
          {/* Légende pour les voyelles et connexions */}
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
                  <div className="w-4 h-4 bg-purple-400 rounded-full"></div>
                  <span className="text-purple-400">لا تتصل بما بعدها</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="bg-gradient-to-r from-zinc-800 to-zinc-700 text-white p-5 flex justify-between items-center">
          <div className="text-lg font-semibold">الحروف في بداية الكلمة - الحركات الثلاث</div>
          <div className="bg-arabic-gradient text-white px-5 py-2 rounded-full font-semibold">
            الصفحة التاسعة
          </div>
        </div>
      </div>
    </div>
  );
};

// InitialLetterGroup Component pour chaque groupe de lettre avec ses 3 voyelles
const InitialLetterGroup = ({ letter, name, vowels, vowelNames, emphatic, nonConnecting }: { 
  letter: string; 
  name: string; 
  vowels: string[];
  vowelNames: string[];
  emphatic?: boolean;
  nonConnecting?: boolean;
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
          
          {/* Indicateur pour les lettres qui ne se connectent pas */}
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

export default Page9;