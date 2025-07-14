// components/chapitres/chapitre10/Page28.tsx
import React from 'react';

const Page28 = () => {
  const quranicWords = [
    // Rangée 1
    ['آلْحَاقَّةُ', 'الصَّآخَّةُ', 'وَالضَّالِّينَ', 'قَالَتْ فَأَتَتْ', 'يَتَمَاسَّا', 'مِنْ شَآءَ'],
    
    // Rangée 2
    ['الْمُصَدِّقِينَ', 'يُشَاقِّونَ', 'فَأَنْقَذْنَاهُ', 'أَتُحَاجُّونَنَا', 'مِنَ السَّمَاءِ', 'أَقَدَّرُوا'],
    
    // Rangée 3
    ['ثُمَّ يَقُولُونَ', 'نَذَّرْنَا', 'لِيُشْفِقُوا', 'خَبَّأْنَا', 'أَقَلَّةٌ', 'فَمَدَدْنَا'],
    
    // Rangée 4
    ['تَبَّتْ', 'حَاقَّةٌ', 'شَآءَءَا', 'فَأَنشَأْنَاهُنَّ', 'أَنْعَمْتَ', 'يُشْرِكُونَ'],
    
    // Rangée 5
    ['مِنْ وَلِيدٍ', 'الضَّابِطِينَ', 'أَقَامَّهُ', 'آمَنَّبَّكُمْ', 'نَشْأَءَُهُ', 'تَمَارُّوٓا'],
    
    // Rangée 6
    ['يُنَبِّئُونَ', 'ضَالِّيَاتٍ', 'أَخَفَّافِ', 'مِنْ شَرِّ', 'قَدَّرَ', 'وَالضَّالِّينَ']
  ];

  // Aplatir toutes les rangées en un seul tableau avec index
  const allWords = quranicWords.flat().map((word, index) => ({
    word,
    color: (index % 2 === 0 ? 'blue' : 'violet') as 'blue' | 'violet'
  }));

  const verseSegments = [
    { text: 'الصَّفَّاتِ صَفًّا', color: 'blue' },
    { text: 'وَالضَّالِّينَ', color: 'violet' }
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
          <div className="bg-white/10 px-6 py-3 rounded-full text-xl font-bold backdrop-blur-sm border border-white/20 inline-block">
            مد لازم قرآني – كلمات متنوعة
          </div>
          <div className="text-sm mt-2 opacity-90">
            كَلِمَاتٌ تَحْتَوِي عَلَى الشَّدَّةِ وَالسُّكُونِ وَالْمَدِّ
          </div>
        </div>
        
        {/* Content */}
        <div className="p-8 bg-zinc-900">
          <div className="max-w-6xl mx-auto">
            {/* Main Exercise Grid */}
            <div className="mb-8">
              <div className="text-center font-bold text-lg text-green-400 mb-6 bg-green-900/30 py-2 rounded-lg">
                كَلِمَاتٌ قُرْآنِيَّةٌ مَعَ الْمَدِّ اللَّازِمِ
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {allWords.map((item, index) => (
                  <MaddLazimCard 
                    key={index} 
                    word={item.word}
                    color={item.color}
                  />
                ))}
              </div>
            </div>
            
            {/* Quranic Verse Section */}
            <div className="mb-8">
              <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-700/30 rounded-xl p-8 text-center">
                <div className="text-blue-400 font-semibold text-lg mb-4">
                  آيَاتٌ مَعَ الْمَدِّ اللَّازِمِ
                </div>
                <div className="leading-loose">
                  {verseSegments.map((segment, index) => (
                    <div key={index} className="mb-2">
                      <span 
                        className={`
                          ${segment.color === 'blue' ? 'text-blue-400' : 'text-purple-400'} 
                          text-3xl md:text-4xl font-bold 
                          hover:bg-white/10 hover:scale-105 
                          transition-all duration-300 rounded-md px-2 py-1 
                          cursor-pointer inline-block
                        `}
                      >
                        {segment.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Explanation Section */}
            <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-6 mb-6">
              <div className="text-center font-bold text-lg text-cyan-400 mb-3 bg-cyan-900/30 py-2 rounded-lg">
                الْمَدُّ اللَّازِمُ الْقُرْآنِيُّ
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="bg-orange-900/20 p-4 rounded-lg">
                  <div className="text-orange-400 font-semibold mb-2">الشَّدَّةُ (ّ)</div>
                  <div className="text-zinc-300">
                    تُضَاعِفُ الْحَرْفَ
                    <br />
                    <span className="text-orange-400">مِثَال: الصَّفَّاتِ</span>
                  </div>
                </div>
                <div className="bg-red-900/20 p-4 rounded-lg">
                  <div className="text-red-400 font-semibold mb-2">السُّكُونُ (ْ)</div>
                  <div className="text-zinc-300">
                    يُسَكِّنُ الْحَرْفَ
                    <br />
                    <span className="text-red-400">مِثَال: مِنْ شَرِّ</span>
                  </div>
                </div>
                <div className="bg-cyan-900/20 p-4 rounded-lg">
                  <div className="text-cyan-400 font-semibold mb-2">الْمَدُّ (~)</div>
                  <div className="text-zinc-300">
                    يُطِيلُ الصَّوْتَ
                    <br />
                    <span className="text-cyan-400">مِثَال: آلْحَاقَّةُ</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Tajwid Rules */}
            <div className="bg-gradient-to-r from-zinc-800 to-zinc-700 rounded-lg p-6 mb-6">
              <div className="text-center">
                <div className="text-yellow-400 font-semibold text-lg mb-3">
                  قَوَاعِدُ التَّجْوِيدِ
                </div>
                <div className="text-zinc-300 text-sm leading-relaxed">
                  هَذِهِ الْكَلِمَاتُ تَتَطَلَّبُ مَعْرِفَةً دَقِيقَةً بِقَوَاعِدِ التَّجْوِيدِ لِلتِّلَاوَةِ الصَّحِيحَةِ
                  <br />
                  <span className="text-yellow-400 font-semibold">
                    الْمَدُّ اللَّازِمُ يُقَدَّرُ بِسِتِّ حَرَكَاتٍ
                  </span>
                </div>
              </div>
            </div>
            
            {/* Page Number */}
            <div className="flex justify-center">
              <div className="w-12 h-12 bg-arabic-gradient rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                ٤
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="bg-gradient-to-r from-zinc-800 to-zinc-700 text-white p-5 flex justify-between items-center">
          <div className="text-lg font-semibold">المد اللازم القرآني – كلمات متنوعة</div>
          <div className="bg-arabic-gradient text-white px-5 py-2 rounded-full font-semibold">
            الصفحة الثامنة والعشرون
          </div>
        </div>
      </div>
    </div>
  );
};

// MaddLazimCard Component avec alternance bleu/violet
const MaddLazimCard = ({ word, color }: { 
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
      <div className="text-lg md:text-xl font-bold leading-relaxed group-hover:scale-105 transition-transform duration-300">
        {word}
      </div>
    </div>
  );
};

export default Page28;