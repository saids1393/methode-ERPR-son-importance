// components/chapitres/chapitre4/Page16.tsx
import React from 'react';

const Page16 = () => {
  const disconnectedLetters = [
    { letter: 'ا', example: 'أَسَدٌ', meaning: 'أسد' },
    { letter: 'د', example: 'دِيكٌ', meaning: 'ديك' },
    { letter: 'ذ', example: 'ذَهَبٌ', meaning: 'ذهب' },
    { letter: 'ر', example: 'رَجُلٌ', meaning: 'رجل' },
    { letter: 'ز', example: 'زَرَافَةٌ', meaning: 'زرافة' },
    { letter: 'و', example: 'وَرْدَةٌ', meaning: 'وردة' }
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
            الحروف التي لا تتصل بما بعدها
          </div>
          <div className="text-sm mt-2 opacity-90">
            تَعلُّم الحُروف المنفصلة مع الأمثلة
          </div>
        </div>
        
        {/* Letters Grid */}
        <div className="p-8 bg-zinc-900">
          <div className="max-w-4xl mx-auto">
            {/* Grid des lettres déconnectées */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {disconnectedLetters.map((item, index) => (
                <DisconnectedLetterCard 
                  key={index} 
                  letter={item.letter}
                  example={item.example}
                  meaning={item.meaning}
                />
              ))}
            </div>
            
            {/* Explication */}
            <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-6 mb-6">
              <div className="text-center font-bold text-lg text-blue-400 mb-3 bg-blue-900/30 py-2 rounded-lg">
                مُلَاحَظَة مُهِمَّة
              </div>
              <div className="text-center text-zinc-300 text-base leading-relaxed">
                هَذِهِ الْحُرُوفُ السِّتَّةُ لَا تَتَّصِلُ بِالْحَرْفِ الَّذِي يَأْتِي بَعْدَهَا فِي الْكَلِمَةِ
                <br />
                <span className="text-yellow-400 font-semibold">ا - د - ذ - ر - ز - و</span>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full h-2 bg-zinc-800 rounded-full mb-6 overflow-hidden">
              <div 
                className="h-full bg-arabic-gradient rounded-full animate-progress"
              ></div>
            </div>
            
            {/* Instructions */}
            <div className="bg-gradient-to-r from-zinc-800 to-zinc-700 rounded-lg p-4">
              <div className="text-center text-zinc-300 text-sm">
                <span className="text-green-400 font-semibold">إِرْشَادٌ:</span>
                <span className="mr-2">لَاحِظْ كَيْفَ تَبْدُو هَذِهِ الْحُرُوفُ فِي الْكَلِمَاتِ وَكَيْفَ لَا تَتَّصِلُ بِمَا بَعْدَهَا</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="bg-gradient-to-r from-zinc-800 to-zinc-700 text-white p-5 flex justify-between items-center">
          <div className="text-lg font-semibold">تَعلُّم الحُروف المنفصلة مع الحركات</div>
          <div className="bg-arabic-gradient text-white px-5 py-2 rounded-full font-semibold">
            الصفحة السادسة عشرة
          </div>
        </div>
      </div>
    </div>
  );
};

// DisconnectedLetterCard Component pour chaque lettre avec son exemple
const DisconnectedLetterCard = ({ letter, example, meaning }: { 
  letter: string; 
  example: string;
  meaning: string;
}) => (
  <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-6 text-center hover:bg-zinc-700 transition-all duration-300 group">
    {/* La lettre principale */}
    <div className="text-5xl md:text-6xl font-bold text-red-400 mb-4 group-hover:scale-110 transition-transform duration-300">
      {letter}
    </div>
    
    {/* Ligne de séparation */}
    <div className="w-full h-px bg-zinc-600 mb-4"></div>
    
    {/* L'exemple avec voyelles */}
    <div className="text-3xl md:text-4xl font-bold text-white mb-3 leading-relaxed">
      {example}
    </div>
    
    {/* Badge indicateur */}
    <div className="inline-block bg-yellow-900/30 text-yellow-400 px-3 py-1 rounded-full text-xs font-semibold">
      لا تتصل بما بعدها
    </div>
  </div>
);

export default Page16;