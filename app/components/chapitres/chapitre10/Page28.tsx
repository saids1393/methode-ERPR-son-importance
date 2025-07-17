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

  // Aplatir toutes les rangées en un seul tableau
  const allWords = quranicWords.flat();

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
          <div className="text-3xl md:text-3xl font-bold">
          Exercice : reconnaissance des mots avec la shaddah, la soukoun et les prolongations
          </div>
        </div>
        
        {/* Content */}
        <div className="p-8 bg-zinc-900">
          <div className="max-w-6xl mx-auto">
            {/* Main Exercise Grid */}
            <div className="mb-8">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {allWords.map((word, index) => (
                  <WordCard 
                    key={index} 
                    word={word}
                  />
                ))}
              </div>
            </div>
            
            {/* Quranic Verse Section */}
            <div className="mb-8">
              <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-700/30 rounded-xl p-8 text-center">
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
          </div>
        </div>
        
        {/* Footer */}
        <footer className="bg-zinc-800 text-white text-center p-6 flex-shrink-0 font-semibold text-sm">
          <div>Page 28</div>
          <div className="mt-1">© 2025 Tous droits réservés</div>
        </footer>
      </div>
    </div>
  );
};

// WordCard Component simplifié sans couleurs
const WordCard = ({ word }: { 
  word: string;
}) => {
  return (
    <div className="
      bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-center 
      hover:bg-zinc-700 transition-all duration-300 group 
      min-h-[90px] flex items-center justify-center
    ">
      <div className="text-lg md:text-xl font-bold text-white leading-relaxed group-hover:scale-105 transition-transform duration-300">
        {word}
      </div>
    </div>
  );
};

export default Page28;