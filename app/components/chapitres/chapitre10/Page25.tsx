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
       <div className="bg-arabic-gradient text-white p-6 text-center">
          <div className="text-3xl md:text-3xl font-bold">
            Leçon shaddah
          </div>
        </div>
        
        {/* Content */}
        <div className="p-8 bg-zinc-900">
          <div className="max-w-6xl mx-auto">
            
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
            
            

          </div>
        </div>
        
        {/* Footer */}
      <footer className="bg-zinc-800 text-white text-center p-6 font-semibold text-sm select-none">
        <div>Page 25</div>
        <div className="mt-1">© 2025 Tous droits réservés</div>
      </footer>
      </div>
    </div>
  );
};

// ShaddaWordCard Component pour chaque mot avec shadda
const ShaddaWordCard = ({ word, index }: { 
  word: string;
  index: number;
}) => {
  return (
    <div className="
      bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-center 
      hover:bg-zinc-700 transition-all duration-300 group 
      min-h-[90px] flex items-center justify-center
    ">
      <div className="text-2xl md:text-3xl font-bold text-white leading-relaxed group-hover:scale-105 transition-transform duration-300">
        {word}
      </div>
    </div>
  );
};

export default Page25;