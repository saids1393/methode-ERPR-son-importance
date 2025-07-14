// components/chapitres/chapitre9/Page24.tsx
import React from 'react';

const Page24 = () => {
  const solarLetters = [
    'ت', 'ث', 'د', 'ذ', 'ر', 'ز', 'س', 'ش', 'ص', 'ض', 'ط', 'ظ', 'ل', 'ن'
  ];

  const lunarLetters = [
    'ا', 'ب', 'ج', 'ح', 'خ', 'ع', 'غ', 'ف', 'ق', 'ك', 'م', 'و', 'ه', 'ي'
  ];

  const solarExamples = [
    { word: 'الشَّمْسُ', article: 'ال', rest: 'شَّمْسُ' },
    { word: 'النَّهْرُ', article: 'ال', rest: 'نَّهْرُ' },
    { word: 'الدَّرْسُ', article: 'ال', rest: 'دَّرْسُ' },
    { word: 'التِّينُ', article: 'ال', rest: 'تِّينُ' }
  ];

  const lunarExamples = [
    { word: 'الْقَمَرُ', article: 'الْ', rest: 'قَمَرُ' },
    { word: 'الْبَيْتُ', article: 'الْ', rest: 'بَيْتُ' },
    { word: 'الْكِتَابُ', article: 'الْ', rest: 'كِتَابُ' },
    { word: 'الْمَاءُ', article: 'الْ', rest: 'مَاءُ' }
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
            الحروف الشمسية والقمرية
          </div>
          <div className="text-sm mt-2 opacity-90">
            تَعلُّم قَوَاعِد الْأَلِف وَاللَّام
          </div>
        </div>
        
        {/* Content */}
        <div className="p-8 bg-zinc-900">
          <div className="max-w-6xl mx-auto">
            {/* Progress Bar */}
            <div className="w-full h-2 bg-zinc-800 rounded-full mb-8 overflow-hidden">
              <div className="h-full bg-arabic-gradient rounded-full animate-progress"></div>
            </div>
            
            {/* Solar Letters Section */}
            <div className="mb-12">
              <SectionTitle 
                title="الحروف الشمسية (١٤ حرفًا)" 
                color="text-yellow-400"
                bgColor="bg-yellow-900/30"
              />
              
              {/* Solar Letters Grid */}
              <div className="flex flex-wrap gap-3 mb-6 justify-center">
                {solarLetters.map((letter, index) => (
                  <LetterCard 
                    key={index} 
                    letter={letter} 
                    type="solar"
                  />
                ))}
              </div>
              
              <SectionSubtitle title="أمثلة على الحروف الشمسية" />
              
              {/* Solar Examples Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {solarExamples.map((example, index) => (
                  <ExampleCard 
                    key={index} 
                    article={example.article}
                    rest={example.rest}
                    type="solar"
                  />
                ))}
              </div>
            </div>
            
            {/* Lunar Letters Section */}
            <div className="mb-8">
              <SectionTitle 
                title="الحروف القمرية (١٤ حرفًا)" 
                color="text-blue-400"
                bgColor="bg-blue-900/30"
              />
              
              {/* Lunar Letters Grid */}
              <div className="flex flex-wrap gap-3 mb-6 justify-center">
                {lunarLetters.map((letter, index) => (
                  <LetterCard 
                    key={index} 
                    letter={letter} 
                    type="lunar"
                  />
                ))}
              </div>
              
              <SectionSubtitle title="أمثلة على الحروف القمرية" />
              
              {/* Lunar Examples Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {lunarExamples.map((example, index) => (
                  <ExampleCard 
                    key={index} 
                    article={example.article}
                    rest={example.rest}
                    type="lunar"
                  />
                ))}
              </div>
            </div>
            
            {/* Explanation Section */}
            <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-6 mb-6">
              <div className="text-center font-bold text-lg text-purple-400 mb-4 bg-purple-900/30 py-2 rounded-lg">
                الْفَرْقُ بَيْنَ الشَّمْسِيَّةِ وَالْقَمَرِيَّةِ
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="bg-yellow-900/20 p-4 rounded-lg">
                  <div className="text-yellow-400 font-semibold mb-2">الحروف الشمسية</div>
                  <div className="text-zinc-300">
                    تُدْغَمُ اللَّامُ فِي الْحَرْفِ الَّذِي بَعْدَهَا وَتُشَدَّدُ
                    <br />
                    <span className="text-yellow-400">مِثَال: الشَّمْس</span>
                  </div>
                </div>
                <div className="bg-blue-900/20 p-4 rounded-lg">
                  <div className="text-blue-400 font-semibold mb-2">الحروف القمرية</div>
                  <div className="text-zinc-300">
                    تُظْهَرُ اللَّامُ وَتُلْفَظُ بِوُضُوحٍ
                    <br />
                    <span className="text-blue-400">مِثَال: الْقَمَر</span>
                  </div>
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
          <div className="text-lg font-semibold">الحروف الشمسية والقمرية</div>
          <div className="bg-arabic-gradient text-white px-5 py-2 rounded-full font-semibold">
            الصفحة الرابعة والعشرون
          </div>
        </div>
      </div>
    </div>
  );
};

// SectionTitle Component
const SectionTitle = ({ title, color, bgColor }: { 
  title: string; 
  color: string; 
  bgColor: string; 
}) => (
  <div className={`text-center font-bold text-xl ${color} mb-6 ${bgColor} py-3 rounded-lg border border-current/20`}>
    {title}
  </div>
);

// SectionSubtitle Component
const SectionSubtitle = ({ title }: { title: string }) => (
  <div className="text-lg font-semibold text-white mb-4 text-center bg-zinc-800 py-2 rounded-lg">
    {title}
  </div>
);

// LetterCard Component
const LetterCard = ({ letter, type }: { 
  letter: string; 
  type: 'solar' | 'lunar';
}) => {
  const colorClass = type === 'solar' 
    ? 'bg-yellow-900/30 text-yellow-400 border-yellow-600' 
    : 'bg-blue-900/30 text-blue-400 border-blue-600';
    
  return (
    <div className={`
      ${colorClass} border-2 rounded-lg p-3 text-center 
      hover:scale-105 transition-transform duration-300
      min-w-[50px] min-h-[50px] flex items-center justify-center
    `}>
      <div className="text-2xl font-bold">
        {letter}
      </div>
    </div>
  );
};

// ExampleCard Component
const ExampleCard = ({ article, rest, type }: { 
  article: string; 
  rest: string; 
  type: 'solar' | 'lunar';
}) => (
  <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-6 text-center hover:bg-zinc-700 transition-all duration-300">
    <div className="text-3xl md:text-4xl font-bold leading-relaxed">
      <span className="text-red-400">{article}</span>
      <span className="text-white">{rest}</span>
    </div>
  </div>
);

export default Page24;