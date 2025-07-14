// components/chapitres/chapitre3/Page14.tsx
import React from 'react';

const Page14 = () => {
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

  const tanwinNames = ['تَنْوِينُ فَتْحٍ', 'تَنْوِينُ ضَمٍّ', 'تَنْوِينُ كَسْرٍ'];

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
            تَعَلُّمُ الْحُرُوفِ الْعَرَبِيَّةِ مَعَ التَّنْوِينِ فِي وَسَطِ الْكَلِمَةِ
          </div>
          <div className="text-sm mt-2 opacity-90">
            الشَّكْلُ الْوَسَطِيُّ مَعَ الْحَرَكَاتِ الْمُضَاعَفَةِ
          </div>
        </div>
        
        {/* Letters with Tanwin Grid */}
        <div className="p-8 bg-zinc-900">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {letterGroups.map((group, index) => (
              <TanwinMedialGroup 
                key={index} 
                letter={group.letter}
                name={group.name}
                vowels={group.vowels}
                tanwinNames={tanwinNames}
                emphatic={emphaticLetters.includes(group.letter)}
                nonConnecting={nonConnectingLetters.includes(group.letter)}
              />
            ))}
            
            {/* Note spéciale pour hamzah et taa marbouta */}
            <div className="md:col-span-2 bg-zinc-800 border border-zinc-700 rounded-xl p-6">
              <div className="text-center font-bold text-lg text-yellow-400 mb-3 bg-yellow-900/30 py-2 rounded-lg">
                مُلَاحَظَة مُهِمَّة
              </div>
              <div className="text-center text-zinc-300 text-base">
                هَمْزَة (ء) وَ تَاء مَرْبُوطَة (ة) لَا تَأْتِي فِي وَسَطِ الْكَلِمَةِ بِهَذَا الشَّكْلِ
              </div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full h-2 bg-zinc-800 rounded-full mb-6 overflow-hidden">
            <div 
              className="h-full bg-arabic-gradient rounded-full animate-progress"
            ></div>
          </div>
          
          {/* Légende pour les doubles voyelles */}
          <div className="bg-zinc-800 rounded-lg p-4 mb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-center gap-4 text-sm flex-wrap">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-amber-400 rounded-full"></div>
                  <span className="text-amber-400">تَنْوِينُ فَتْحٍ (an)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-sky-400 rounded-full"></div>
                  <span className="text-sky-400">تَنْوِينُ ضَمٍّ (un)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-emerald-400 rounded-full"></div>
                  <span className="text-emerald-400">تَنْوِينُ كَسْرٍ (in)</span>
                </div>
              </div>
              <div className="flex items-center justify-center gap-4 text-sm flex-wrap">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-400 rounded-full"></div>
                  <span className="text-red-400">الحروف المفخمة</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-yellow-400 rounded-full"></div>
                  <span className="text-yellow-400">لا تتصل بما بعدها</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="bg-gradient-to-r from-zinc-800 to-zinc-700 text-white p-5 flex justify-between items-center">
          <div className="text-lg font-semibold">الحروف في وسط الكلمة - التنوين</div>
          <div className="bg-arabic-gradient text-white px-5 py-2 rounded-full font-semibold">
            الصفحة الرابعة عشرة
          </div>
        </div>
      </div>
    </div>
  );
};

// TanwinMedialGroup Component pour chaque groupe de lettre avec ses 3 tanwins
const TanwinMedialGroup = ({ letter, name, vowels, tanwinNames, emphatic, nonConnecting }: { 
  letter: string; 
  name: string; 
  vowels: string[];
  tanwinNames: string[];
  emphatic?: boolean;
  nonConnecting?: boolean;
}) => (
  <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-4">
    {/* Titre du groupe */}
    <div className="text-center font-bold text-lg text-indigo-300 mb-4 bg-indigo-900/30 py-2 rounded-lg">
      {name}
    </div>
    
    {/* Grille des 3 tanwins */}
    <div className="grid grid-cols-3 gap-3">
      {vowels.map((vowelLetter, index) => (
        <div key={index} className="bg-zinc-700 border border-zinc-600 rounded-lg p-3 text-center hover:bg-zinc-600 transition-all duration-300 relative">
          <div className={`text-2xl md:text-3xl font-bold mb-2 ${
            emphatic ? 'text-red-400' : 'text-white'
          }`}>
            {vowelLetter}
          </div>
          <div className={`text-xs font-semibold px-2 py-1 rounded ${
            index === 0 ? 'text-amber-400 bg-amber-900/30' :
            index === 1 ? 'text-sky-400 bg-sky-900/30' :
            'text-emerald-400 bg-emerald-900/30'
          }`}>
            {tanwinNames[index]}
          </div>
          
          {/* Indicateur pour les lettres qui ne se connectent pas */}
          {nonConnecting && index === 0 && (
            <div className="text-xs text-yellow-400 bg-yellow-900/30 px-1 py-1 rounded mt-2">
              لا تتصل
            </div>
          )}
        </div>
      ))}
    </div>
  </div>
);

export default Page14;