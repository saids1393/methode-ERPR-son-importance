// components/chapitres/chapitre7/Page21.tsx
import React from 'react';

const Page21 = () => {
  const words = [
    // Rangée 1
    'بَيْتٌ', 'قَوْمٌ', 'سَمَاءٌ',
    
    // Rangée 2
    'نَوْمٌ', 'حَيَوَانٌ', 'كِتَابٌ',
    
    // Rangée 3
    'يَدٌ', 'صَوْتٌ', 'مَاءٌ',
    
    // Rangée 4
    'لَيْلٌ', 'جَبَلٌ', 'رَيْحٌ',
    
    // Rangée 5
    'نَهْرٌ', 'بَيْضٌ', 'خُبْزٌ',
    
    // Rangée 6
    'شَمْسٌ', 'قَمَرٌ', 'عَيْنٌ',
    
    // Rangée 7
    'وَرْدٌ', 'بَحْرٌ', 'رَمْضٌ',
    
    // Rangée 8
    'زَيْتٌ', 'طَيْرٌ', 'حُبٌّ',
    
    // Rangée 9
    'نَجْمٌ', 'بَيْتٌ', 'سَوْفٌ'
  ];

  const wordMeanings = [
    'بَيْتٌ', 'قَوْمٌ', 'سَمَاءٌ', 'نَوْمٌ', 'حَيَوَانٌ', 'كِتَابٌ',
    'يَدٌ', 'صَوْتٌ', 'مَاءٌ', 'لَيْلٌ', 'جَبَلٌ', 'رَيْحٌ',
    'نَهْرٌ', 'بَيْضٌ', 'خُبْزٌ', 'شَمْسٌ', 'قَمَرٌ', 'عَيْنٌ',
    'وَرْدٌ', 'بَحْرٌ', 'رَمْضٌ', 'زَيْتٌ', 'طَيْرٌ', 'حُبٌّ',
    'نَجْمٌ', 'بَيْتٌ', 'سَوْفٌ'
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
            كلمات متنوعة
          </div>
          <div className="text-sm mt-2 opacity-90">
            مَجْمُوعَةٌ مِنَ الْكَلِمَاتِ الْعَرَبِيَّةِ الْمُتَنَوِّعَةِ
          </div>
        </div>
        
        {/* Words Grid */}
        <div className="p-8 bg-zinc-900">
          <div className="max-w-5xl mx-auto">
            {/* Grid des mots */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {words.map((word, index) => (
                <VariousWordCard 
                  key={index} 
                  word={word}
                  index={index}
                />
              ))}
            </div>
            
            {/* Explication pédagogique */}
            <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-6 mb-6">
              <div className="text-center font-bold text-lg text-green-400 mb-3 bg-green-900/30 py-2 rounded-lg">
                تَنْوِيعُ الْمُفْرَدَاتِ الْعَرَبِيَّةِ
              </div>
              <div className="text-center text-zinc-300 text-base leading-relaxed">
                هَذِهِ مَجْمُوعَةٌ مُتَنَوِّعَةٌ مِنَ الْكَلِمَاتِ الْعَرَبِيَّةِ تَشْمَلُ أَسْمَاءَ مُخْتَلِفَةً
                <br />
                <span className="text-yellow-400 font-semibold">
                  أَشْيَاء مِنَ الطَّبِيعَةِ وَالْحَيَاةِ الْيَوْمِيَّةِ
                </span>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full h-2 bg-zinc-800 rounded-full mb-6 overflow-hidden">
              <div 
                className="h-full bg-arabic-gradient rounded-full animate-progress"
              ></div>
            </div>
            
            {/* Catégories */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              <div className="bg-gradient-to-r from-blue-900/30 to-blue-800/30 rounded-lg p-4">
                <div className="text-blue-400 font-semibold text-center mb-2">الطَّبِيعَة</div>
                <div className="text-zinc-300 text-sm text-center">
                  سَمَاءٌ، مَاءٌ، جَبَلٌ، بَحْرٌ، نَهْرٌ
                </div>
              </div>
              <div className="bg-gradient-to-r from-orange-900/30 to-orange-800/30 rounded-lg p-4">
                <div className="text-orange-400 font-semibold text-center mb-2">الْحَيَاةُ الْيَوْمِيَّة</div>
                <div className="text-zinc-300 text-sm text-center">
                  بَيْتٌ، كِتَابٌ، خُبْزٌ، زَيْتٌ
                </div>
              </div>
              <div className="bg-gradient-to-r from-purple-900/30 to-purple-800/30 rounded-lg p-4">
                <div className="text-purple-400 font-semibold text-center mb-2">الْجِسْم</div>
                <div className="text-zinc-300 text-sm text-center">
                  يَدٌ، عَيْنٌ، صَوْتٌ
                </div>
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
          <div className="text-lg font-semibold">مجموعة من الكلمات العربية المتنوعة</div>
          <div className="bg-arabic-gradient text-white px-5 py-2 rounded-full font-semibold">
            الصفحة الحادية والعشرون
          </div>
        </div>
      </div>
    </div>
  );
};

// VariousWordCard Component pour chaque mot
const VariousWordCard = ({ word, index }: { 
  word: string;
  index: number;
}) => {
  // Couleurs alternées pour varier l'affichage
  const getCardColor = (index: number) => {
    const colors = [
      'border-blue-600 bg-blue-900/20',
      'border-green-600 bg-green-900/20',
      'border-purple-600 bg-purple-900/20',
      'border-orange-600 bg-orange-900/20',
      'border-pink-600 bg-pink-900/20',
      'border-cyan-600 bg-cyan-900/20'
    ];
    return colors[index % colors.length];
  };

  return (
    <div className={`
      ${getCardColor(index)}
      border-2 rounded-xl p-6 text-center 
      hover:bg-zinc-700 transition-all duration-300 group 
      min-h-[120px] flex items-center justify-center
    `}>
      <div className="text-3xl md:text-4xl font-bold text-white leading-relaxed group-hover:scale-105 transition-transform duration-300">
        {word}
      </div>
    </div>
  );
};

export default Page21;