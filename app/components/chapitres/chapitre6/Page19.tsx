// components/chapitres/chapitre6/Page19.tsx
import React from 'react';

const Page19 = () => {
  const letterData = [
    // Rangée 1
    { base: 'بـ', prolongations: ['ا', 'و', 'ي'] },
    { base: 'تـ', prolongations: ['ا', 'و', 'ي'] },
    
    // Rangée 2  
    { base: 'ثـ', prolongations: ['ا', 'و', 'ي'] },
    { base: 'جـ', prolongations: ['ا', 'و', 'ي'] },
    
    // Rangée 3
    { base: 'حـ', prolongations: ['ا', 'و', 'ي'] },
    { base: 'خـ', prolongations: ['ا', 'و', 'ي'] },
    
    // Rangée 4
    { base: 'د', prolongations: ['ا', 'و', 'ي'] },
    { base: 'ذ', prolongations: ['ا', 'و', 'ي'] },
    
    // Rangée 5
    { base: 'ر', prolongations: ['ا', 'و', 'ي'] },
    { base: 'ز', prolongations: ['ا', 'و', 'ي'] },
    
    // Rangée 6
    { base: 'سـ', prolongations: ['ا', 'و', 'ي'] },
    { base: 'شـ', prolongations: ['ا', 'و', 'ي'] },
    
    // Rangée 7
    { base: 'صـ', prolongations: ['ا', 'و', 'ي'] },
    { base: 'ضـ', prolongations: ['ا', 'و', 'ي'] },
    
    // Rangée 8
    { base: 'طـ', prolongations: ['ا', 'و', 'ي'] },
    { base: 'ظـ', prolongations: ['ا', 'و', 'ي'] },
    
    // Rangée 9
    { base: 'عـ', prolongations: ['ا', 'و', 'ي'] },
    { base: 'غـ', prolongations: ['ا', 'و', 'ي'] }
  ];

  // Créer toutes les combinaisons pour la grille
  const allCombinations: { base: string; prolongation: string; }[] = [];
  letterData.forEach(letter => {
    letter.prolongations.forEach(prolongation => {
      allCombinations.push({
        base: letter.base,
        prolongation: prolongation
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
            الْحُرُوفُ فِي بِدَايَةِ الْكَلِمَةِ
          </div>
          <div className="text-sm mt-2 opacity-90">
            مَعَ حُرُوفِ الْمَدِّ وَالْإِطَالَةِ
          </div>
        </div>
        
        {/* Letters Grid */}
        <div className="p-8 bg-zinc-900">
          <div className="max-w-6xl mx-auto">
            {/* Grid des lettres avec prolongations */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-8">
              {allCombinations.map((item, index) => (
                <ProlongationCard 
                  key={index} 
                  base={item.base}
                  prolongation={item.prolongation}
                />
              ))}
            </div>
            
            {/* Explication des prolongations */}
            <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-6 mb-6">
              <div className="text-center font-bold text-lg text-red-400 mb-3 bg-red-900/30 py-2 rounded-lg">
                حُرُوفُ الْمَدِّ وَالْإِطَالَةِ
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center text-sm">
                <div className="bg-red-900/30 p-3 rounded-lg">
                  <div className="text-red-400 font-semibold mb-2">أَلِفُ الْمَدِّ</div>
                  <div className="text-4xl text-red-400">ا</div>
                  <div className="text-zinc-300 mt-2">مَدُّ الْفَتْحَةِ</div>
                </div>
                <div className="bg-red-900/30 p-3 rounded-lg">
                  <div className="text-red-400 font-semibold mb-2">وَاوُ الْمَدِّ</div>
                  <div className="text-4xl text-red-400">و</div>
                  <div className="text-zinc-300 mt-2">مَدُّ الضَّمَّةِ</div>
                </div>
                <div className="bg-red-900/30 p-3 rounded-lg">
                  <div className="text-red-400 font-semibold mb-2">يَاءُ الْمَدِّ</div>
                  <div className="text-4xl text-red-400">ي</div>
                  <div className="text-zinc-300 mt-2">مَدُّ الْكَسْرَةِ</div>
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
                <span className="text-orange-400 font-semibold">إِرْشَادٌ:</span>
                <span className="mr-2">حُرُوفُ الْمَدِّ تُطِيلُ صَوْتَ الْحَرَكَةِ الَّتِي قَبْلَهَا</span>
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
          <div className="text-lg font-semibold">الحروف في بداية الكلمة مع حروف المد</div>
          <div className="bg-arabic-gradient text-white px-5 py-2 rounded-full font-semibold">
            الصفحة التاسعة عشرة
          </div>
        </div>
      </div>
    </div>
  );
};

// ProlongationCard Component avec base + prolongation colorée
const ProlongationCard = ({ base, prolongation }: { 
  base: string;
  prolongation: string;
}) => {
  const getProlongationColor = (letter: string) => {
    switch(letter) {
      case 'ا': return 'text-red-400';
      case 'و': return 'text-red-400'; 
      case 'ي': return 'text-red-400';
      default: return 'text-red-400';
    }
  };

  return (
    <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-center hover:bg-zinc-700 transition-all duration-300 group min-h-[90px] flex items-center justify-center">
      <div className="text-2xl md:text-3xl font-bold leading-relaxed group-hover:scale-105 transition-transform duration-300">
        <span className="text-white">{base}</span>
        <span className={getProlongationColor(prolongation)}>
          {prolongation}
        </span>
      </div>
    </div>
  );
};

export default Page19;