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

  // Aplatir toutes les rangées en un seul tableau
  const allWords = mixedWords.flat();

  const verse = 'تَبَّتْ يَدَا أَبِي لَهَبٍ وَتَبَّ';

  return (
    <div 
      className="font-arabic min-h-screen"
      style={{ direction: 'rtl' }}
    >
      <div className="w-full h-full bg-zinc-900 overflow-hidden">
        {/* Header */}
        <div className="bg-arabic-gradient text-white p-6 text-center">
          <div className="text-3xl md:text-3xl font-bold">
           Exercice : reconnaissance des mots avec la shaddah et la soukoun
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
            
          </div>
        </div>
        
        {/* Footer */}
        <footer className="bg-zinc-800 text-white text-center p-6 flex-shrink-0 font-semibold text-sm">
          <div>Page 27</div>
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
      <div className="text-xl md:text-2xl font-bold text-white leading-relaxed group-hover:scale-105 transition-transform duration-300">
        {word}
      </div>
    </div>
  );
};

export default Page27;