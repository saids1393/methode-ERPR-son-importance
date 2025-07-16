import React from 'react';

const Page20 = () => {
  // Création des combinaisons avec layyina uniquement
  const allCombinations: { base: string; fatha: string; layyina: string; }[] = [
    // Lettres avec leurs variantes layyina uniquement
    { base: 'ب', fatha: 'َ', layyina: 'وْ' },
    { base: 'ب', fatha: 'َ', layyina: 'يْ' },
    { base: 'ت', fatha: 'َ', layyina: 'وْ' },
    { base: 'ت', fatha: 'َ', layyina: 'يْ' },
    { base: 'ث', fatha: 'َ', layyina: 'وْ' },
    { base: 'ث', fatha: 'َ', layyina: 'يْ' },
    { base: 'ج', fatha: 'َ', layyina: 'وْ' },
    { base: 'ج', fatha: 'َ', layyina: 'يْ' },
    { base: 'ح', fatha: 'َ', layyina: 'وْ' },
    { base: 'ح', fatha: 'َ', layyina: 'يْ' },
    { base: 'خ', fatha: 'َ', layyina: 'وْ' },
    { base: 'خ', fatha: 'َ', layyina: 'يْ' },
    { base: 'د', fatha: 'َ', layyina: 'وْ' },
    { base: 'د', fatha: 'َ', layyina: 'يْ' },
    { base: 'ذ', fatha: 'َ', layyina: 'وْ' },
    { base: 'ذ', fatha: 'َ', layyina: 'يْ' },
    { base: 'ر', fatha: 'َ', layyina: 'وْ' },
    { base: 'ر', fatha: 'َ', layyina: 'يْ' },
    { base: 'ز', fatha: 'َ', layyina: 'وْ' },
    { base: 'ز', fatha: 'َ', layyina: 'يْ' },
    { base: 'س', fatha: 'َ', layyina: 'وْ' },
    { base: 'س', fatha: 'َ', layyina: 'يْ' },
    { base: 'ش', fatha: 'َ', layyina: 'وْ' },
    { base: 'ش', fatha: 'َ', layyina: 'يْ' },
    { base: 'ص', fatha: 'َ', layyina: 'وْ' },
    { base: 'ص', fatha: 'َ', layyina: 'يْ' },
    { base: 'ض', fatha: 'َ', layyina: 'وْ' },
    { base: 'ض', fatha: 'َ', layyina: 'يْ' },
    { base: 'ط', fatha: 'َ', layyina: 'وْ' },
    { base: 'ط', fatha: 'َ', layyina: 'يْ' },
    { base: 'ظ', fatha: 'َ', layyina: 'وْ' },
    { base: 'ظ', fatha: 'َ', layyina: 'يْ' },
    { base: 'ع', fatha: 'َ', layyina: 'وْ' },
    { base: 'ع', fatha: 'َ', layyina: 'يْ' },
    { base: 'غ', fatha: 'َ', layyina: 'وْ' },
    { base: 'غ', fatha: 'َ', layyina: 'يْ' },
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
            Lettres douces (Hourouf Layyinah)
          </div>
        </div>
        
        {/* Letters Grid */}
        <div className="p-8 bg-zinc-900">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-8">
              {allCombinations.map((item, index) => (
                <DiphthongCard 
                  key={index} 
                  base={item.base}
                  fatha={item.fatha}
                  layyina={item.layyina}
                />
              ))}
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <footer className="bg-zinc-800 text-white text-center p-6 flex-shrink-0 font-semibold text-sm">
          <div>Page 20</div>
          <div className="mt-1">© 2025 Tous droits réservés</div>
        </footer>
      </div>
    </div>
  );
};

// DiphthongCard Component
const DiphthongCard = ({ base, fatha, layyina }: { 
  base: string;
  fatha: string;
  layyina: string;
}) => {
  return (
    <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-center hover:bg-zinc-700 transition-all duration-300 group min-h-[90px] flex items-center justify-center">
      <div className="text-2xl md:text-3xl font-bold leading-relaxed group-hover:scale-105 transition-transform duration-300">
        <span className="text-white-400">{base}{fatha}</span>
        <span className="text-green-400">{layyina}</span>
      </div>
    </div>
  );
};

export default Page20;