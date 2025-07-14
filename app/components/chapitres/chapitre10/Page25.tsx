// components/chapitres/chapitre10/Page25.tsx
import React from 'react';

const Page25 = () => {
  const shaddaWords = [
    // Rangée 1
    ['مَدَّ', 'حَقَّ', 'فُرَّ', 'وَدَّ', 'رُدَّ', 'عَضَّ'],
    
    // Rangée 2
    ['شَدَّ', 'طُبَّ', 'قَطَّ', 'غَلَّ', 'نَبَّ', 'ذُبَّ'],
    
    // Rangée 3
    ['كُبَّ', 'ثَبَّ', 'يَمَّ', 'حُجَّ', 'عَدَّ', 'بَلَّ'],
    
    // Rangée 4
    ['ظَنَّ', 'زُرَّ', 'هَبَّ', 'كَنَّ', 'ضَرَّ', 'سَرَّ'],
    
    // Rangée 5
    ['نَمَّ', 'لَبَّ', 'فَكَّ', 'ذَكَّ', 'خَسَّ', 'هَجَّ'],
    
    // Rangée 6
    ['طَلَّ', 'وَصَّ', 'جَلَّ', 'فَضَّ', 'سَبَّ', 'زَكَّ'],
    
    // Rangée 7
    ['ضَبَّ', 'رَكَّ', 'كَبَّ', 'قَبَّ', 'دَفَّ', 'بَغَّ'],
    
    // Rangée 8
    ['ذَمَّ', 'هَمَّ', 'رَحَّ', 'جَرَّ', 'صَبَّ', 'تَبَّ']
  ];

  // Aplatir toutes les rangées en un seul tableau
  const allWords = shaddaWords.flat();

  return (
    <div 
      className="font-arabic min-h-screen"
      style={{ direction: 'rtl' }}
    >
      <div className="w-full h-full bg-zinc-900 overflow-hidden">
        {/* Header avec gradient orange spécifique */}
        <div className="bg-gradient-to-r from-orange-600 to-orange-800 text-white p-6 text-center">
          <div className="text-3xl font-bold mb-4">بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ</div>
          <div className="bg-white/10 px-6 py-3 rounded-full text-xl font-bold backdrop-blur-sm border border-white/20 inline-block">
            الشدة في القرآن الكريم
          </div>
          <div className="text-sm mt-2 opacity-90">
            تَعلُّم الْحُرُوفِ الْمُشَدَّدَةِ
          </div>
        </div>
        
        {/* Content */}
        <div className="p-8 bg-zinc-900">
          <div className="max-w-6xl mx-auto">
            {/* Progress Bar avec gradient orange */}
            <div className="w-full h-2 bg-zinc-800 rounded-full mb-8 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-orange-600 to-orange-800 rounded-full animate-progress"></div>
            </div>
            
            {/* Shadda Words Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-8">
              {allWords.map((word, index) => (
                <ShaddaWordCard 
                  key={index} 
                  word={word}
                  index={index}
                />
              ))}
            </div>
            
            {/* Explanation Section */}
            <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-6 mb-6">
              <div className="text-center font-bold text-lg text-orange-400 mb-3 bg-orange-900/30 py-2 rounded-lg">
                عَلَامَةُ الشَّدَّةِ فِي الْقُرْآنِ
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center text-sm">
                <div className="bg-orange-900/20 p-4 rounded-lg">
                  <div className="text-orange-400 font-semibold mb-2">رَمْزُ الشَّدَّةِ</div>
                  <div className="text-4xl text-orange-400 mb-2">ّ</div>
                  <div className="text-zinc-300">تُوضَعُ فَوْقَ الْحَرْفِ الْمُشَدَّدِ</div>
                </div>
                <div className="bg-zinc-700 p-4 rounded-lg">
                  <div className="text-white font-semibold mb-2">الْمَعْنَى</div>
                  <div className="text-3xl mb-2">
                    <span className="text-white">مَدَّ</span>
                  </div>
                  <div className="text-zinc-300">الْحَرْفُ يُنْطَقُ مَرَّتَيْنِ</div>
                </div>
              </div>
            </div>
            
            {/* Quranic Context */}
            <div className="bg-gradient-to-r from-zinc-800 to-zinc-700 rounded-lg p-6 mb-6">
              <div className="text-center">
                <div className="text-orange-400 font-semibold text-lg mb-3">
                  أَهَمِّيَّةُ الشَّدَّةِ فِي التِّلَاوَةِ
                </div>
                <div className="text-zinc-300 text-sm leading-relaxed">
                  الشَّدَّةُ تُغَيِّرُ مَعْنَى الْكَلِمَةِ وَتُؤَثِّرُ عَلَى التِّلَاوَةِ الصَّحِيحَةِ لِلْقُرْآنِ الْكَرِيمِ
                  <br />
                  <span className="text-orange-400 font-semibold">
                    يَجِبُ إِظْهَارُ الشَّدَّةِ بِوُضُوحٍ عِنْدَ التِّلَاوَةِ
                  </span>
                </div>
              </div>
            </div>
            
            {/* Page Number avec style orange */}
            <div className="flex justify-center">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-600 to-orange-800 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                ٢
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="bg-gradient-to-r from-zinc-800 to-zinc-700 text-white p-5 flex justify-between items-center">
          <div className="text-lg font-semibold">الشدة في القرآن الكريم</div>
          <div className="bg-gradient-to-r from-orange-600 to-orange-800 text-white px-5 py-2 rounded-full font-semibold">
            الصفحة الخامسة والعشرون
          </div>
        </div>
      </div>
    </div>
  );
};

// ShaddaWordCard Component pour chaque mot avec shadda
const ShaddaWordCard = ({ word, index }: { 
  word: string;
  index: number;
}) => {
  // Couleurs alternées pour varier l'affichage
  const getCardColor = (index: number) => {
    const colors = [
      'border-orange-600 bg-orange-900/20',
      'border-red-600 bg-red-900/20',
      'border-yellow-600 bg-yellow-900/20',
      'border-amber-600 bg-amber-900/20'
    ];
    return colors[index % colors.length];
  };

  return (
    <div className={`
      ${getCardColor(index)}
      border-2 rounded-xl p-3 text-center 
      hover:bg-zinc-700 transition-all duration-300 group 
      min-h-[90px] flex items-center justify-center
    `}>
      <div className="text-2xl md:text-3xl font-bold text-white leading-relaxed group-hover:scale-105 transition-transform duration-300">
        {word}
      </div>
    </div>
  );
};

export default Page25;