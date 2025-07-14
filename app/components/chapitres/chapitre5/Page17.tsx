// components/chapitres/chapitre5/Page17.tsx
import React from 'react';

const Page17 = () => {
  const words = [
    // Première ligne - mots avec voyelles simples
    'بَيْتٌ', 'كَلْبٌ', 'نُورٌ', 'فَمٌ', 'يَدٌ', 'دُبٌ',
    
    // Deuxième ligne - mots avec tanwin
    'بَيْتًا', 'كَلْبٍ', 'قَلَمًا', 'شَمْسًا', 'وَرْدًا', 'فِيلًا',
    
    // Troisième ligne - mélange de positions correctes
    'نَارًا', 'مِلْحًا', 'خُبْزًا', 'تِينًا', 'زَيْتًا', 'عَسَلًا',
    
    // Quatrième ligne
    'قُفْلٌ', 'بَحْرٌ', 'جَبَلٌ', 'قَمَرٌ', 'نَجْمٌ', 'لَحْمٌ',
    
    // Cinquième ligne
    'سَمَكٌ', 'طَيْرٌ', 'فَأْرٌ', 'بَقَرٌ', 'غَنَمٌ', 'دِيكٌ',
    
    // Sixième ligne
    'كَرَمٌ', 'قَلَمٌ', 'وَرَقٌ', 'كَأْسٌ', 'بَابٌ', 'سُوقٌ',
    
    // Septième ligne
    'رَأْسٌ', 'عَيْنٌ', 'أُذُنٌ', 'أَنْفٌ', 'فَمٌ', 'حُلُمٌ',
    
    // Huitième ligne
    'رِجْلٌ', 'يَدٌ', 'ظُفْرٌ', 'شَعْرٌ', 'جِلْدٌ', 'قَلْبٌ',
    
    // Neuvième ligne
    'حَجَرٌ', 'تِبْنٌ', 'رَمْلٌ', 'طِينٌ', 'ثَلْجٌ', 'جَمْرٌ'
  ];

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
            الحركات والتنوين - الدرس الثالث
          </div>
          <div className="text-sm mt-2 opacity-90">
            تَعلُّم الكلمات بالحركات والتنوين
          </div>
        </div>
        
        {/* Words Grid */}
        <div className="p-8 bg-zinc-900">
          <div className="max-w-6xl mx-auto">
            {/* Grid des mots */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
              {words.map((word, index) => (
                <WordCard 
                  key={index} 
                  word={word}
                />
              ))}
            </div>
            
            {/* Explication */}
            <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-6 mb-6">
              <div className="text-center font-bold text-lg text-purple-400 mb-3 bg-purple-900/30 py-2 rounded-lg">
                مُلَاحَظَة تَعْلِيمِيَّة
              </div>
              <div className="text-center text-zinc-300 text-base leading-relaxed">
                هَذِهِ الكَلِمَاتُ تَحْتَوِي عَلَى الحَرَكَاتِ الأَسَاسِيَّةِ وَالتَّنْوِينِ فَقَطْ
                <br />
                <span className="text-yellow-400 font-semibold">بِدُونِ شَدَّةٍ وَمُدُودٍ</span>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full h-2 bg-zinc-800 rounded-full mb-6 overflow-hidden">
              <div 
                className="h-full bg-arabic-gradient rounded-full animate-progress"
              ></div>
            </div>
            
            {/* Légende des couleurs */}
            <div className="bg-gradient-to-r from-zinc-800 to-zinc-700 rounded-lg p-4">
              <div className="text-center text-zinc-300 text-sm">
                <span className="text-blue-400 font-semibold">الأَلْوَانُ المُتَنَاوِبَةُ:</span>
                <span className="mr-4 text-white">أَسْوَد</span>
                <span className="text-blue-400">وَأَزْرَق</span>
                <span className="mr-4 text-green-400">لِتَسْهِيلِ القِرَاءَةِ</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="bg-gradient-to-r from-zinc-800 to-zinc-700 text-white p-5 flex justify-between items-center">
          <div className="text-lg font-semibold">بدون شدة ومدود - فقط الحركات والتنوين</div>
          <div className="bg-arabic-gradient text-white px-5 py-2 rounded-full font-semibold">
            الصفحة السابعة عشرة
          </div>
        </div>
      </div>
    </div>
  );
};

// WordCard Component avec alternance de couleurs
const WordCard = ({ word }: { word: string }) => {
  const renderWordWithColors = (word: string) => {
    return word.split('').map((letter, index) => (
      <span 
        key={index} 
        className={index % 2 === 0 ? 'text-white' : 'text-blue-400'}
      >
        {letter}
      </span>
    ));
  };

  return (
    <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-4 text-center hover:bg-zinc-700 transition-all duration-300 group min-h-[100px] flex items-center justify-center">
      <div className="text-2xl md:text-3xl font-bold leading-relaxed group-hover:scale-105 transition-transform duration-300">
        {renderWordWithColors(word)}
      </div>
    </div>
  );
};

export default Page17;