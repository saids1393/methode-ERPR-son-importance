// components/chapitres/chapitre10/Page27.tsx
import React from 'react';

const Page27 = () => {
  const introWords = [
    { word: 'أَبَّ', description: 'mot de 3 lettres avec sukoon + shadda' },
    { word: 'أَبَّى', description: 'mot de 4 lettres' }
  ];

  const mixedWords = [
    // Rangée 1
    ['مَرُّوا', 'رَبِّى', 'مُدَّتْ', 'حُقَّتْ', 'خَفَّتْ', 'تَبَّتْ'],
    
    // Rangée 2
    ['تَخَّلَّتْ', 'قَدَّمْتُ', 'وَالصُّبْحِ', 'وَالشَّمْسِ', 'وَالشَّفْعِ', 'بِالصُّبْرِ'],
    
    // Rangée 3
    ['وَالصَّيْفِ', 'وَالَّيْلِ', 'سِجِّيلٍ', 'سِجِّينٌ', 'مُنْفَكِّينَ', 'فَإِنَّ'],
    
    // Rangée 4
    ['لِحُبِّ', 'إِذَا السَّمَاءُ', 'انْشَقَّتْ', 'مَا الطَّارِقُ', 'النَّجْمُ', 'الثَّاقِبُ'],
    
    // Rangée 5
    ['مِنْ شَرِّ', 'الْوَسْوَاسِ', 'الْخَنَّاسِ', 'سَيَّارَةٌ', 'وَلِيٌّ', 'جَيِّدٌ'],
    
    // Rangée 6
    ['سَبُّورة', 'تُفَّاحٌ', 'رُمَّانٌ', 'جَنَّةٌ', 'أَشِدَّاءُ', 'عَنِّيْ']
  ];

  // Aplatir toutes les rangées en un seul tableau avec index
  const allWords = mixedWords.flat().map((word, index) => ({
    word,
    color: (index % 2 === 0 ? 'blue' : 'violet') as 'blue' | 'violet'
  }));

  const verse = 'تَبَّتْ يَدَا أَبِي لَهَبٍ وَتَبَّ';

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
            الشدة والسكون فقط – Exercice
          </div>
          <div className="text-sm mt-2 opacity-90">
            تَمْرِينٌ مُخْتَلِطٌ عَلَى الشَّدَّةِ وَالسُّكُونِ
          </div>
        </div>
        
        {/* Content */}
        <div className="p-8 bg-zinc-900">
          <div className="max-w-6xl mx-auto">
            {/* Introduction Words */}
            <div className="mb-8">
              <div className="text-center font-bold text-lg text-cyan-400 mb-4 bg-cyan-900/30 py-2 rounded-lg">
                أَمْثِلَةٌ تَمْهِيدِيَّةٌ
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {introWords.map((item, index) => (
                  <div key={index} className="bg-zinc-800 border border-zinc-700 rounded-xl p-6 text-center">
                    <div className={`text-4xl font-bold mb-2 ${index === 0 ? 'text-blue-400' : 'text-purple-400'}`}>
                      {item.word}
                    </div>
                    <div className="text-zinc-400 text-sm">{item.description}</div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Main Exercise Grid */}
            <div className="mb-8">
              <div className="text-center font-bold text-lg text-green-400 mb-4 bg-green-900/30 py-2 rounded-lg">
                كَلِمَاتٌ تَحْتَوِي عَلَى الشَّدَّةِ وَالسُّكُونِ
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {allWords.map((item, index) => (
                  <MixedWordCard 
                    key={index} 
                    word={item.word}
                    color={item.color}
                  />
                ))}
              </div>
            </div>
            
            {/* Verse Section */}
            <div className="mb-8">
              <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-700/30 rounded-xl p-8 text-center">
                <div className="text-blue-400 font-semibold text-lg mb-4">
                  آيَةٌ كَرِيمَةٌ مَعَ الشَّدَّةِ
                </div>
                <div className="text-blue-400 text-3xl md:text-4xl font-bold leading-relaxed">
                  {verse}
                </div>
                <div className="text-zinc-400 text-sm mt-3">
                  سُورَة الْمَسَد
                </div>
              </div>
            </div>
            
            {/* Explanation Section */}
            <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-6 mb-6">
              <div className="text-center font-bold text-lg text-orange-400 mb-3 bg-orange-900/30 py-2 rounded-lg">
                الْجَمْعُ بَيْنَ الشَّدَّةِ وَالسُّكُونِ
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="bg-orange-900/20 p-4 rounded-lg">
                  <div className="text-orange-400 font-semibold mb-2">الشَّدَّةُ (ّ)</div>
                  <div className="text-zinc-300">
                    تُشَدِّدُ الْحَرْفَ وَتَجْعَلُهُ يُنْطَقُ مَرَّتَيْنِ
                    <br />
                    <span className="text-orange-400">مِثَال: تَبَّتْ</span>
                  </div>
                </div>
                <div className="bg-red-900/20 p-4 rounded-lg">
                  <div className="text-red-400 font-semibold mb-2">السُّكُونُ (ْ)</div>
                  <div className="text-zinc-300">
                    يَجْعَلُ الْحَرْفَ سَاكِنًا بِلَا حَرَكَةٍ
                    <br />
                    <span className="text-red-400">مِثَال: وَالصُّبْحِ</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Educational Note */}
            <div className="bg-gradient-to-r from-zinc-800 to-zinc-700 rounded-lg p-4 mb-6">
              <div className="text-center text-zinc-300 text-sm">
                <span className="text-yellow-400 font-semibold">فَائِدَةٌ:</span>
                <span className="mr-2">هَذَا التَّمْرِينُ يُطَوِّرُ الْقُدْرَةَ عَلَى التَّمْيِيزِ بَيْنَ الْعَلَامَتَيْنِ الْمُهِمَّتَيْنِ فِي الْقِرَاءَةِ</span>
              </div>
            </div>
            
            {/* Page Number */}
            <div className="flex justify-center">
              <div className="w-12 h-12 bg-arabic-gradient rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                ٣
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="bg-gradient-to-r from-zinc-800 to-zinc-700 text-white p-5 flex justify-between items-center">
          <div className="text-lg font-semibold">الشدة والسكون فقط – تمرين مختلط</div>
          <div className="bg-arabic-gradient text-white px-5 py-2 rounded-full font-semibold">
            الصفحة السابعة والعشرون
          </div>
        </div>
      </div>
    </div>
  );
};

// MixedWordCard Component avec alternance bleu/violet
const MixedWordCard = ({ word, color }: { 
  word: string;
  color: 'blue' | 'violet';
}) => {
  const colorClass = color === 'blue' 
    ? 'text-blue-400 border-blue-600 bg-blue-900/20' 
    : 'text-purple-400 border-purple-600 bg-purple-900/20';
    
  return (
    <div className={`
      ${colorClass} border-2 rounded-xl p-3 text-center 
      hover:bg-zinc-700 transition-all duration-300 group 
      min-h-[90px] flex items-center justify-center
    `}>
      <div className="text-xl md:text-2xl font-bold leading-relaxed group-hover:scale-105 transition-transform duration-300">
        {word}
      </div>
    </div>
  );
};

export default Page27;