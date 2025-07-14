// components/chapitres/chapitre8/Page23.tsx
import React from 'react';

const Page23 = () => {
  const quranicWords = [
    // Rangée 1
    'قُلْ', 'كَلْبٌ', 'يَوْمٍ', 'حَسْبُ', 'رَبْعُ', 'مَسْجِدٌ',
    
    // Rangée 2
    'فَلْيَنْظُرْ', 'يَلْهَثْ', 'مِنْ', 'عَنْهْ', 'لَكُمْ', 'دِينُكُمْ',
    
    // Rangée 3
    'وَيَمْنَعُونَ', 'الْمَاعُونَ', 'كَعَصْفٍ', 'مَأْكُولٍ', 'أَنتُمْ', 'عَابِدُونَ',
    
    // Rangée 4
    'أَعْبُدُ', 'فَأَثَرْنَ', 'نَقْعًا', 'وَلَا', 'تَنْهَ', 'عَنِ'
  ];

  const verseSegments = [
    { text: 'وَإِذَا الْجِبَالُ نُسِفَتْ', color: 'text-teal-400' },
    { text: 'وَيَمْنَعُونَ الْمَاعُونَ', color: 'text-red-400' },
    { text: 'وَلَا أَنتُمْ عَابِدُونَ مَا أَعْبُدُ', color: 'text-teal-400' },
    { text: 'لَكُمْ دِينُكُمْ وَلِيَ دِينِ', color: 'text-red-400' }
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
            السكون في القرآن الكريم
          </div>
          <div className="text-sm mt-2 opacity-90">
            أَمْثِلَةٌ مِنَ الْقُرْآنِ الْكَرِيمِ
          </div>
        </div>
        
        {/* Content */}
        <div className="p-8 bg-zinc-900">
          <div className="max-w-6xl mx-auto">
            {/* Progress Bar */}
            <div className="w-full h-2 bg-zinc-800 rounded-full mb-8 overflow-hidden">
              <div className="h-full bg-arabic-gradient rounded-full animate-progress"></div>
            </div>
            
            {/* Quranic Words Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-8">
              {quranicWords.map((word, index) => (
                <QuranicWordCard 
                  key={index} 
                  word={word}
                  index={index}
                />
              ))}
            </div>
            
            {/* Quranic Verse Section */}
            <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-700/30 rounded-xl p-8 mb-8">
              <div className="text-center font-bold text-lg text-blue-400 mb-6 bg-blue-900/30 py-2 rounded-lg">
                آيَاتٌ مِنَ الْقُرْآنِ الْكَرِيمِ
              </div>
              <div className="text-center leading-loose">
                {verseSegments.map((segment, index) => (
                  <span 
                    key={index}
                    className={`
                      ${segment.color} text-2xl md:text-3xl font-bold 
                      hover:bg-white/10 hover:scale-105 
                      transition-all duration-300 rounded-md px-2 py-1 
                      cursor-pointer inline-block m-1
                    `}
                  >
                    {segment.text}
                  </span>
                ))}
              </div>
            </div>
            
            {/* Explanation Section */}
            <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-6 mb-6">
              <div className="text-center font-bold text-lg text-green-400 mb-3 bg-green-900/30 py-2 rounded-lg">
                فَوَائِدُ السُّكُونِ فِي الْقُرْآنِ
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="bg-zinc-700 p-4 rounded-lg">
                  <div className="text-yellow-400 font-semibold mb-2">التَّرْتِيلُ الصَّحِيحُ</div>
                  <div className="text-zinc-300">
                    السُّكُونُ يُسَاعِدُ عَلَى التَّرْتِيلِ الصَّحِيحِ وَالنُّطْقِ السَّلِيمِ لِآيَاتِ الْقُرْآنِ
                  </div>
                </div>
                <div className="bg-zinc-700 p-4 rounded-lg">
                  <div className="text-cyan-400 font-semibold mb-2">الْوَقْفُ وَالْابْتِدَاءُ</div>
                  <div className="text-zinc-300">
                    مَعْرِفَةُ السُّكُونِ ضَرُورِيَّةٌ لِفَهْمِ قَوَاعِدِ الْوَقْفِ وَالْابْتِدَاءِ
                  </div>
                </div>
              </div>
            </div>
            
            {/* Note about Sukoon in Quran */}
            <div className="bg-gradient-to-r from-zinc-800 to-zinc-700 rounded-lg p-4 mb-6">
              <div className="text-center text-zinc-300 text-sm">
                <span className="text-orange-400 font-semibold">مُلَاحَظَةٌ:</span>
                <span className="mr-2">هَذِهِ الْكَلِمَاتُ مَأْخُوذَةٌ مِنَ الْقُرْآنِ الْكَرِيمِ وَتَحْتَوِي عَلَى السُّكُونِ</span>
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
          <div className="text-lg font-semibold">السكون في القرآن الكريم</div>
          <div className="bg-arabic-gradient text-white px-5 py-2 rounded-full font-semibold">
            الصفحة الثالثة والعشرون
          </div>
        </div>
      </div>
    </div>
  );
};

// QuranicWordCard Component pour chaque mot coranique
const QuranicWordCard = ({ word, index }: { 
  word: string;
  index: number;
}) => {
  return (
    <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-center hover:bg-zinc-700 transition-all duration-300 group min-h-[90px] flex items-center justify-center">
      <div className="text-xl md:text-2xl font-bold text-white leading-relaxed group-hover:scale-105 transition-transform duration-300">
        {word}
      </div>
    </div>
  );
};

export default Page23;