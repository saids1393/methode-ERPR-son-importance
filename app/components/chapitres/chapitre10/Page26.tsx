// components/chapitres/chapitre10/Page26.tsx
import React from 'react';

const Page26 = () => {
  const introWords = [
    { word: 'دَرَّسَ', description: 'mot de 3 lettres' },
    { word: 'مُسَمَّىٰ', description: 'mot de 4 lettres' }
  ];

  const quranicWords = [
    // Rangée 1
    ['إِنَّ', 'اللَّهَ', 'مُصَدِّقٌ', 'الرَّحْمَٰنِ', 'الرَّحِيمِ', 'الصَّبِرِ'],
    
    // Rangée 2
    ['الظَّالِمِينَ', /* 'مَضَىٰ', 'بِسْمِهِ', */ 'تَبَّتْ', /* 'كَفَّرَ', */ 'شَدِّدْ'],
    
    // Rangée 3
    ['جَنَّاتٍ', /* 'يَعْمَلُونَ', 'يُبَشِّرُ', 'يُذَكِّرُ', */ 'السَّلَامُ', /* 'الْخَبِيرُ' */],
    
    // Rangée 4
    ['الْمُؤْمِنِينَ',  /* 'وَنَفَّعَ', 'أَمْرَهُ', */ 'ضَرَّ', 'تُبِّ'],
    
    // Rangée 5
    [/* 'يَوْمَئِذٍ', 'الْمُسْتَقِيمَةِ', 'يُؤْمِنُونَ', 'يَا مَعْشَرَ', */ 'النَّاسِ', /* 'الْمُشْرِكِينَ' */],
    
    // Rangée 6
    [/* 'يُزَكِّيهِمْ', 'كَرَّمَهُ', 'مُقَرَّبِينَ', */ 'الشَّيْطَانُ', /* 'فَسَجَدَ', 'سَجَدَ' */],
    
    // Rangée 7
    ['الصَّالِحِينَ', 'مُصَدَّقِينَ', /* 'شُكِّرِينَ', */ 'وَصَّىٰ', /* 'ضَرَّةً', 'نَذَّرْنَا' */],
    
    // Rangée 8
    [/* 'تُشْرِكُوا', 'يُبَصِّرُكُمْ', 'يُذَكِّرُكُمْ', 'يُخْرِجُكُمْ',  'شَدِيدُ', 'مُحْسِنِينَ'*/],
    
    // Rangée 9
    [/* 'مُشْرِكِينَ', */ 'نَذَّرْتُكُمْ', 'قَدَّرْنَا', 'تَذَكَّرُوا',  /* 'الشَّهِيدُ' */]
  ];

  // Aplatir toutes les rangées en un seul tableau avec index
  const allWords = quranicWords.flat();

  const verse = 'إِنَّ اللَّهَ غَفُورٌ رَحِيمٌ';

  return (
    <div 
      className="font-arabic min-h-screen"
      style={{ direction: 'rtl' }}
    >
      <div className="w-full h-full bg-zinc-900 overflow-hidden">
        {/* Header */}
        <div className="bg-arabic-gradient text-white p-6 text-center">
          <div className="text-3xl md:text-3xl font-bold">
          Exercice : reconnaissance des mots avec la shaddah
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
                <div className="text-blue-400 text-3xl md:text-4xl font-bold leading-relaxed">
                  {verse}
                </div>
              </div>
            </div>
            
          </div>
        </div>
        
        {/* Footer */}
        <footer className="bg-zinc-800 text-white text-center p-6 flex-shrink-0 font-semibold text-sm">
          <div>Page 26</div>
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

export default Page26;
