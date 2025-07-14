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
    ['الظَّالِمِينَ', 'مَضَىٰ', 'بِسْمِهِ', 'تَبَّتْ', 'كَفَّرَ', 'شَدِّدْ'],
    
    // Rangée 3
    ['جَنَّاتٍ', 'يَعْمَلُونَ', 'يُبَشِّرُ', 'يُذَكِّرُ', 'السَّلَامُ', 'الْخَبِيرُ'],
    
    // Rangée 4
    ['الْمُؤْمِنِينَ', 'تَبَّتْ', 'وَنَفَّعَ', 'أَمْرَهُ', 'ضَرَّ', 'تُبِّ'],
    
    // Rangée 5
    ['يَوْمَئِذٍ', 'الْمُسْتَقِيمَةِ', 'يُؤْمِنُونَ', 'يَا مَعْشَرَ', 'النَّاسِ', 'الْمُشْرِكِينَ'],
    
    // Rangée 6
    ['يُزَكِّيهِمْ', 'كَرَّمَهُ', 'مُقَرَّبِينَ', 'الشَّيْطَانُ', 'فَسَجَدَ', 'سَجَدَ'],
    
    // Rangée 7
    ['الصَّالِحِينَ', 'مُصَدَّقِينَ', 'شُكِّرِينَ', 'وَصَّىٰ', 'ضَرَّةً', 'نَذَّرْنَا'],
    
    // Rangée 8
    ['تُشْرِكُوا', 'يُبَصِّرُكُمْ', 'يُذَكِّرُكُمْ', 'يُخْرِجُكُمْ', 'شَدِيدُ', 'مُحْسِنِينَ'],
    
    // Rangée 9
    ['مُشْرِكِينَ', 'نَذَّرْتُكُمْ', 'قَدَّرْنَا', 'تَذَكَّرُوا', 'اللَّهُ', 'الشَّهِيدُ']
  ];

  // Aplatir toutes les rangées en un seul tableau avec index
  const allWords = quranicWords.flat().map((word, index) => ({
    word,
    color: (index % 2 === 0 ? 'blue' : 'violet') as 'blue' | 'violet'
  }));

  const verse = 'إِنَّ اللَّهَ غَفُورٌ رَحِيمٌ';

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
            الشدة – Exercice coloré
          </div>
          <div className="text-sm mt-2 opacity-90">
            تَمْرِينٌ مُلَوَّنٌ عَلَى الشَّدَّةِ
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
                كَلِمَاتٌ قُرْآنِيَّةٌ مَعَ الشَّدَّةِ
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {allWords.map((item, index) => (
                  <ColoredWordCard 
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
                  آيَةٌ كَرِيمَةٌ
                </div>
                <div className="text-blue-400 text-3xl md:text-4xl font-bold leading-relaxed">
                  {verse}
                </div>
              </div>
            </div>
            
            {/* Color Legend */}
            <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-6 mb-6">
              <div className="text-center font-bold text-lg text-yellow-400 mb-3 bg-yellow-900/30 py-2 rounded-lg">
                دَلِيلُ الْأَلْوَانِ
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center text-sm">
                <div className="bg-blue-900/20 p-4 rounded-lg">
                  <div className="text-blue-400 font-semibold mb-2">الْأَزْرَقُ</div>
                  <div className="text-3xl text-blue-400 mb-2">إِنَّ</div>
                  <div className="text-zinc-300">الْكَلِمَاتُ الْفَرْدِيَّةُ</div>
                </div>
                <div className="bg-purple-900/20 p-4 rounded-lg">
                  <div className="text-purple-400 font-semibold mb-2">الْبَنَفْسَجِيُّ</div>
                  <div className="text-3xl text-purple-400 mb-2">اللَّهَ</div>
                  <div className="text-zinc-300">الْكَلِمَاتُ الزَّوْجِيَّةُ</div>
                </div>
              </div>
            </div>
            
            {/* Educational Note */}
            <div className="bg-gradient-to-r from-zinc-800 to-zinc-700 rounded-lg p-4 mb-6">
              <div className="text-center text-zinc-300 text-sm">
                <span className="text-orange-400 font-semibold">تَنْبِيهٌ:</span>
                <span className="mr-2">هَذَا التَّمْرِينُ يُسَاعِدُ عَلَى التَّمْيِيزِ بَيْنَ الْكَلِمَاتِ الْمُخْتَلِفَةِ الَّتِي تَحْتَوِي عَلَى الشَّدَّةِ</span>
              </div>
            </div>
            
            {/* Page Number */}
            <div className="flex justify-center">
              <div className="w-12 h-12 bg-arabic-gradient rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                ٢
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="bg-gradient-to-r from-zinc-800 to-zinc-700 text-white p-5 flex justify-between items-center">
          <div className="text-lg font-semibold">الشدة – تمرين ملون</div>
          <div className="bg-arabic-gradient text-white px-5 py-2 rounded-full font-semibold">
            الصفحة السادسة والعشرون
          </div>
        </div>
      </div>
    </div>
  );
};

// ColoredWordCard Component avec alternance bleu/violet
const ColoredWordCard = ({ word, color }: { 
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

export default Page26;