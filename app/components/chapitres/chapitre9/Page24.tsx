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
        {/* En-tête */}
        <div className="bg-arabic-gradient text-white p-6 text-center">
          <div className="text-3xl md:text-3xl font-bold">Lettres solaires et lunaires (chamssiyyah et kamariyyah)</div>
        </div>
        
        {/* Contenu */}
        <div className="p-8 bg-zinc-900">
          <div className="max-w-6xl mx-auto">
            
            {/* Section Lettres solaires */}
            <div className="mb-12">
              <SectionTitle 
                title="Lettres solaires (14 lettres)" 
                color="text-yellow-400"
                bgColor="bg-yellow-900/30"
              />
              
              {/* Grille des lettres solaires */}
              <div className="flex flex-wrap gap-3 mb-6 justify-center">
                {solarLetters.map((letter, index) => (
                  <LetterCard 
                    key={index} 
                    letter={letter} 
                    type="solar"
                  />
                ))}
              </div>
              
              <SectionSubtitle title="Exemples de lettres solaires" />
              
              {/* Grille d'exemples solaires */}
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
            
            {/* Section Lettres lunaires */}
            <div className="mb-8">
              <SectionTitle 
                title="Lettres lunaires (14 lettres)" 
                color="text-blue-400"
                bgColor="bg-blue-900/30"
              />
              
              {/* Grille des lettres lunaires */}
              <div className="flex flex-wrap gap-3 mb-6 justify-center">
                {lunarLetters.map((letter, index) => (
                  <LetterCard 
                    key={index} 
                    letter={letter} 
                    type="lunar"
                  />
                ))}
              </div>
              
              <SectionSubtitle title="Exemples de lettres lunaires" />
              
              {/* Grille d'exemples lunaires */}
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
          </div>
        </div>
        
        {/* Pied de page */}
        <footer className="bg-zinc-800 text-white text-center p-6 flex-shrink-0 font-semibold text-sm">
          <div>Page 24</div>
          <div className="mt-1">© 2025 Tous droits réservés</div>
        </footer>
      </div>
    </div>
  );
};

// Composant SectionTitle
const SectionTitle = ({ title, color, bgColor }: { 
  title: string; 
  color: string; 
  bgColor: string; 
}) => (
  <div className={`text-center font-bold text-xl ${color} mb-6 ${bgColor} py-3 rounded-lg border border-current/20`}>
    {title}
  </div>
);

// Composant SectionSubtitle
const SectionSubtitle = ({ title }: { title: string }) => (
  <div className="text-lg font-semibold text-white mb-4 text-center bg-zinc-800 py-2 rounded-lg">
    {title}
  </div>
);

// Composant LetterCard
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

// Composant ExampleCard
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
