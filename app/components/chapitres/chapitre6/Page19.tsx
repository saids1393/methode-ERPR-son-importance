// components/chapitres/chapitre6/Page19.tsx
import React from 'react';

const Page19 = () => {
  const letterData = [
    // Rangée 1
    { base: 'بـ', prolongations: ['ا', 'و', 'ي'] },
    { base: 'تـ', prolongations: ['ا', 'و', 'ي'] },
    
    // Rangée 2  
    { base: 'ثـ', prolongations: ['ا', 'و', 'ي'] },
    { base: 'جـ', prolongations: ['ا', 'و', 'ي'] },
    
    // Rangée 3
    { base: 'حـ', prolongations: ['ا', 'و', 'ي'] },
    { base: 'خـ', prolongations: ['ا', 'و', 'ي'] },
    
    // Rangée 4
    { base: 'د', prolongations: ['ا', 'و', 'ي'] },
    { base: 'ذ', prolongations: ['ا', 'و', 'ي'] },
    
    // Rangée 5
    { base: 'ر', prolongations: ['ا', 'و', 'ي'] },
    { base: 'ز', prolongations: ['ا', 'و', 'ي'] },
    
    // Rangée 6
    { base: 'سـ', prolongations: ['ا', 'و', 'ي'] },
    { base: 'شـ', prolongations: ['ا', 'و', 'ي'] },
    
    // Rangée 7
    { base: 'صـ', prolongations: ['ا', 'و', 'ي'] },
    { base: 'ضـ', prolongations: ['ا', 'و', 'ي'] },
    
    // Rangée 8
    { base: 'طـ', prolongations: ['ا', 'و', 'ي'] },
    { base: 'ظـ', prolongations: ['ا', 'و', 'ي'] },
    
    // Rangée 9
    { base: 'عـ', prolongations: ['ا', 'و', 'ي'] },
    { base: 'غـ', prolongations: ['ا', 'و', 'ي'] }
  ];

  // Créer toutes les combinaisons pour la grille
  const allCombinations: { base: string; prolongation: string; }[] = [];
  letterData.forEach(letter => {
    letter.prolongations.forEach(prolongation => {
      allCombinations.push({
        base: letter.base,
        prolongation: prolongation
      });
    });
  });

  return (
    <div 
      className="font-arabic min-h-screen"
      style={{ direction: 'rtl' }}
    >
      <div className="w-full h-full bg-zinc-900 overflow-hidden">
        {/* Header */}
        <div className="bg-arabic-gradient text-white p-6 text-center">
          <div className="text-3xl md:text-3xl font-bold">
           Leçon : les trois lettres de prolongation
          </div>
        </div>
        
        {/* Letters Grid */}
        <div className="p-8 bg-zinc-900">
          <div className="max-w-6xl mx-auto">
            {/* Grid des lettres avec prolongations */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-8">
              {allCombinations.map((item, index) => (
                <ProlongationCard 
                  key={index} 
                  base={item.base}
                  prolongation={item.prolongation}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-zinc-800 text-white text-center p-6 flex-shrink-0 font-semibold text-sm">
          <div>Page 19</div>
          <div className="mt-1">© 2025 Tous droits réservés</div>
        </footer>
      </div>
    </div>
  );
};

// ProlongationCard Component avec base + prolongation colorée en violet
const ProlongationCard = ({ base, prolongation }: { 
  base: string;
  prolongation: string;
}) => {
  const getProlongationColor = (letter: string) => {
    switch(letter) {
      case 'ا': return 'text-purple-400';
      case 'و': return 'text-purple-400'; 
      case 'ي': return 'text-purple-400';
      default: return 'text-purple-400';
    }
  };

  return (
    <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-center hover:bg-zinc-700 transition-all duration-300 group min-h-[90px] flex items-center justify-center">
      <div className="text-2xl md:text-3xl font-bold leading-relaxed group-hover:scale-105 transition-transform duration-300">
        <span className="text-white">{base}</span>
        <span className={getProlongationColor(prolongation)}>
          {prolongation}
        </span>
      </div>
    </div>
  );
};

export default Page19;
