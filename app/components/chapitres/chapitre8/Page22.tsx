// components/chapitres/chapitre8/Page22.tsx
import React from 'react';

const Page22 = () => {
  const syllableGroups = [
    // Chaque groupe contient 3 syllabes avec fatha, kasra, damma + sukoon
    { base1: 'ب', base2: 'ت' },  // بَتْ، بِتْ، بُتْ
    { base1: 'ن', base2: 'ص' },  // نَصْ، نِصْ، نُصْ
    { base1: 'ك', base2: 'ت' },  // كَتْ، كِتْ، كُتْ
    { base1: 'م', base2: 'س' },  // مَسْ، مِسْ، مُسْ
    { base1: 'ر', base2: 'ب' },  // رَبْ، رِبْ، رُبْ
    { base1: 'س', base2: 'ف' },  // سَفْ، سِفْ، سُفْ
    { base1: 'ع', base2: 'د' },  // عَدْ، عِدْ، عُدْ
    { base1: 'ف', base2: 'ر' },  // فَرْ، فِرْ، فُرْ
    { base1: 'ح', base2: 'ب' },  // حَبْ، حِبْ، حُبْ
    { base1: 'د', base2: 'ر' },  // دَرْ، دِرْ، دُرْ
    { base1: 'ط', base2: 'ب' },  // طَبْ، طِبْ، طُبْ
    { base1: 'ق', base2: 'ل' },  // قَلْ، قِلْ، قُلْ
    { base1: 'غ', base2: 'ض' },  // غَضْ، غِضْ، غُضْ
    { base1: 'ص', base2: 'د' },  // صَدْ، صِدْ، صُدْ
    { base1: 'ض', base2: 'ح' },  // ضَحْ، ضِحْ، ضُحْ
    { base1: 'ذ', base2: 'ك' }   // ذَكْ، ذِكْ، ذُكْ
  ];

  const vowels = ['َ', 'ِ', 'ُ']; // fatha, kasra, damma

  // Créer toutes les combinaisons
  const allSyllables: { base1: string; vowel: string; base2: string; sukoon: string; }[] = [];
  syllableGroups.forEach(group => {
    vowels.forEach(vowel => {
      allSyllables.push({
        base1: group.base1,
        vowel: vowel,
        base2: group.base2,
        sukoon: 'ْ'
      });
    });
  });

  return (
    <div 
      className="font-arabic min-h-screen"
      style={{ direction: 'rtl' }}
    >
      <div className="w-full h-full bg-zinc-900 overflow-hidden">
        {/* Header */}
        <div className="bg-arabic-gradient text-white p-6 text-center">
          <div className="text-3xl font-bold mb-4">بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ</div>
          <div className="bg-white/10 px-6 py-3 rounded-full text-xl font-bold backdrop-blur-sm border border-white/20 inline-block">
            كلمات مع السكون
          </div>
          <div className="text-sm mt-2 opacity-90">
            تَعلُّم الْمَقَاطِع مَعَ السُّكُونِ
          </div>
        </div>
        
        {/* Syllables Grid */}
        <div className="p-8 bg-zinc-900">
          <div className="max-w-6xl mx-auto">
            {/* Grid des syllabes avec sukoon */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-8">
              {allSyllables.map((syllable, index) => (
                <SukoonSyllableCard 
                  key={index} 
                  base1={syllable.base1}
                  vowel={syllable.vowel}
                  base2={syllable.base2}
                  sukoon={syllable.sukoon}
                />
              ))}
            </div>
            
            {/* Explication du sukoon */}
            <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-6 mb-6">
              <div className="text-center font-bold text-lg text-red-400 mb-3 bg-red-900/30 py-2 rounded-lg">
                عَلَامَةُ السُّكُونِ
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center text-sm">
                <div className="bg-red-900/30 p-4 rounded-lg">
                  <div className="text-red-400 font-semibold mb-2">رَمْزُ السُّكُونِ</div>
                  <div className="text-4xl text-red-400 mb-2">ْ</div>
                  <div className="text-zinc-300">يُوضَعُ فَوْقَ الْحَرْفِ الْسَّاكِنِ</div>
                </div>
                <div className="bg-zinc-700 p-4 rounded-lg">
                  <div className="text-white font-semibold mb-2">مِثَالٌ</div>
                  <div className="text-3xl mb-2">
                    <span className="text-white">بَ</span>
                    <span className="text-red-400">تْ</span>
                  </div>
                  <div className="text-zinc-300">الْحَرْفُ الثَّانِي سَاكِنٌ</div>
                </div>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full h-2 bg-zinc-800 rounded-full mb-6 overflow-hidden">
              <div 
                className="h-full bg-arabic-gradient rounded-full animate-progress"
              ></div>
            </div>
            
            {/* Note pédagogique */}
            <div className="bg-gradient-to-r from-zinc-800 to-zinc-700 rounded-lg p-4 mb-6">
              <div className="text-center text-zinc-300 text-sm">
                <span className="text-blue-400 font-semibold">فَائِدَةٌ:</span>
                <span className="mr-2">السُّكُونُ يَعْنِي عَدَمَ وُجُودِ حَرَكَةٍ عَلَى الْحَرْفِ</span>
              </div>
            </div>
            
            {/* Page Number */}
            <div className="flex justify-center">
              <div className="w-12 h-12 bg-arabic-gradient rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                ١
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="bg-gradient-to-r from-zinc-800 to-zinc-700 text-white p-5 flex justify-between items-center">
          <div className="text-lg font-semibold">كلمات مع السكون</div>
          <div className="bg-arabic-gradient text-white px-5 py-2 rounded-full font-semibold">
            الصفحة الثانية والعشرون
          </div>
        </div>
      </div>
    </div>
  );
};

// SukoonSyllableCard Component avec sukoon en rouge
const SukoonSyllableCard = ({ base1, vowel, base2, sukoon }: { 
  base1: string;
  vowel: string;
  base2: string;
  sukoon: string;
}) => {
  const getVowelColor = (vowel: string) => {
    switch(vowel) {
      case 'َ': return 'text-white'; // fatha
      case 'ِ': return 'text-white'; // kasra  
      case 'ُ': return 'text-white'; // damma
      default: return 'text-white';
    }
  };

  return (
    <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-center hover:bg-zinc-700 transition-all duration-300 group min-h-[90px] flex items-center justify-center">
      <div className="text-2xl md:text-3xl font-bold leading-relaxed group-hover:scale-105 transition-transform duration-300">
        <span className={getVowelColor(vowel)}>
          {base1}{vowel}
        </span>
        <span className="text-red-400">
          {base2}{sukoon}
        </span>
      </div>
    </div>
  );
};

export default Page22;