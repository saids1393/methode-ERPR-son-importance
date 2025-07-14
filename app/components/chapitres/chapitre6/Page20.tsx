// components/chapitres/chapitre6/Page20.tsx
import React from 'react';

const Page20 = () => {
  const letterData = [
    'ب', 'ت', 'ث', 'ج', 'ح', 'خ', 'د', 'ذ', 'ر', 'ز', 
    'س', 'ش', 'ص', 'ض', 'ط', 'ظ', 'ع', 'غ'
  ];

  // Créer toutes les combinaisons pour la grille (3 variantes par lettre)
  const allCombinations: { base: string; fatha: string; layyina: string; }[] = [];
  letterData.forEach(letter => {
    // Variante 1: lettre avec fatha seulement
    allCombinations.push({
      base: letter,
      fatha: 'َ',
      layyina: ''
    });
    // Variante 2: lettre avec fatha + waw layyina
    allCombinations.push({
      base: letter,
      fatha: 'َ',
      layyina: 'وْ'
    });
    // Variante 3: lettre avec fatha + ya layyina
    allCombinations.push({
      base: letter,
      fatha: 'َ',
      layyina: 'يْ'
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
            الْحُرُوفُ مَعَ الْفَتْحَةِ وَاللَّيِّنَة
          </div>
          <div className="text-sm mt-2 opacity-90">
            تَعلُّم الحُروف مع الحركات المُركَّبة
          </div>
        </div>
        
        {/* Letters Grid */}
        <div className="p-8 bg-zinc-900">
          <div className="max-w-6xl mx-auto">
            {/* Grid des lettres avec fatha et layyina */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-8">
              {allCombinations.map((item, index) => (
                <DiphthongCard 
                  key={index} 
                  base={item.base}
                  fatha={item.fatha}
                  layyina={item.layyina}
                />
              ))}
            </div>
            
            {/* Explication des diphtongues */}
            <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-6 mb-6">
              <div className="text-center font-bold text-lg text-blue-400 mb-3 bg-blue-900/30 py-2 rounded-lg">
                الحَرَكَاتُ المُرَكَّبَةُ (اللَّيِّنَة)
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center text-sm">
                <div className="bg-blue-900/30 p-3 rounded-lg">
                  <div className="text-blue-400 font-semibold mb-2">فَتْحَةٌ بَسِيطَةٌ</div>
                  <div className="text-3xl">
                    <span className="text-white">بَ</span>
                  </div>
                  <div className="text-zinc-300 mt-2">صَوْتٌ قَصِيرٌ</div>
                </div>
                <div className="bg-red-900/30 p-3 rounded-lg">
                  <div className="text-red-400 font-semibold mb-2">فَتْحَةٌ + وْ</div>
                  <div className="text-3xl">
                    <span className="text-blue-400">بَ</span><span className="text-red-400">وْ</span>
                  </div>
                  <div className="text-zinc-300 mt-2">صَوْتُ (ao)</div>
                </div>
                <div className="bg-red-900/30 p-3 rounded-lg">
                  <div className="text-red-400 font-semibold mb-2">فَتْحَةٌ + يْ</div>
                  <div className="text-3xl">
                    <span className="text-blue-400">بَ</span><span className="text-red-400">يْ</span>
                  </div>
                  <div className="text-zinc-300 mt-2">صَوْتُ (ay)</div>
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
                <span className="text-yellow-400 font-semibold">مُلَاحَظَةٌ:</span>
                <span className="mr-2">اللَّيِّنَةُ تُغَيِّرُ صَوْتَ الْفَتْحَةِ وَتَجْعَلُهَا مُرَكَّبَةً</span>
              </div>
            </div>
            
            {/* Page Number */}
            <div className="flex justify-center">
              <div className="w-12 h-12 bg-arabic-gradient rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                ٢
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="bg-gradient-to-r from-zinc-800 to-zinc-700 text-white p-5 flex justify-between items-center">
          <div className="text-lg font-semibold">الحروف مع الفتحة واللينة</div>
          <div className="bg-arabic-gradient text-white px-5 py-2 rounded-full font-semibold">
            الصفحة العشرون
          </div>
        </div>
      </div>
    </div>
  );
};

// DiphthongCard Component avec fatha (bleu) et layyina (rouge)
const DiphthongCard = ({ base, fatha, layyina }: { 
  base: string;
  fatha: string;
  layyina: string;
}) => {
  return (
    <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-center hover:bg-zinc-700 transition-all duration-300 group min-h-[90px] flex items-center justify-center">
      <div className="text-2xl md:text-3xl font-bold leading-relaxed group-hover:scale-105 transition-transform duration-300">
        <span className="text-blue-400">{base}{fatha}</span>
        <span className="text-red-400">{layyina}</span>
      </div>
    </div>
  );
};

export default Page20;