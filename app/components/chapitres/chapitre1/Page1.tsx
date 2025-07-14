import React from 'react';

const Page1 = () => {
  const emphaticLetters = ['خ', 'ر', 'ص', 'ض', 'ط', 'ظ', 'غ', 'ق'];

  const allLetters = [
    { letter: 'ا' },
    { letter: 'ب' },
    { letter: 'ت' },
    { letter: 'ث' },
    { letter: 'ج' },
    { letter: 'ح' },
    { letter: 'خ' },
    { letter: 'د' },
    { letter: 'ذ' },
    { letter: 'ر' },
    { letter: 'ز' },
    { letter: 'س' },
    { letter: 'ش' },
    { letter: 'ص' },
    { letter: 'ض' },
    { letter: 'ط' },
    { letter: 'ظ' },
    { letter: 'ع' },
    { letter: 'غ' },
    { letter: 'ف' },
    { letter: 'ق' },
    { letter: 'ك' },
    { letter: 'ل' },
    { letter: 'م' },
    { letter: 'ن' },
    { letter: 'ه' },
    { letter: 'و' },
    { letter: 'ي' }
  ];

  return (
    <div 
      className="font-arabic min-h-screen"
      style={{ direction: 'rtl' }}
    >
      <div className="w-full h-full bg-zinc-900 overflow-hidden">
        {/* Header */}
        <div className="bg-arabic-gradient text-white p-6 text-center">
          <div className="text-3xl font-bold mb-4">
            Lettres arabes seules (non attachées)
          </div>
        </div>

        {/* Alphabet Grid */}
        <div className="p-8 bg-zinc-900">
          <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-7 gap-4 mb-6">
            {allLetters.map((item, index) => (
              <Cell
                key={index}
                letter={item.letter}
                emphatic={emphaticLetters.includes(item.letter)}
              />
            ))}
          </div>
          
          {/* Footer */}
          <footer className="bg-zinc-800 text-white text-center p-6 flex-shrink-0 font-semibold text-sm">
            <div>Page 1</div>
            <div className="mt-1">© 2025 Tous droits réservés</div>
          </footer>
        </div>
      </div>
    </div>
  );
};

// Cell Component adapté pour le thème sombre (sans le nom)
const Cell = ({ letter, emphatic }: { letter: string; emphatic?: boolean }) => (
  <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-4 text-center min-h-[100px] flex flex-col justify-center items-center hover:bg-zinc-700 transition-all duration-300 hover:scale-105 cursor-pointer">
    <div className={`text-3xl md:text-4xl font-bold ${emphatic ? 'text-red-400' : 'text-white'} transition-colors`}>
      {letter}
    </div>
  </div>
);

export default Page1;