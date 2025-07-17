import React from 'react';

const Page4 = () => {
  const letters = [
    // Row 1
    { letter: 'ـا', emphatic: false, violet: false },
    { letter: 'ـب', emphatic: false, violet: false },
    { letter: 'ـت', emphatic: false, violet: false },
    { letter: 'ـث', emphatic: false, violet: false },
    { letter: 'ـج', emphatic: false, violet: false },
    { letter: 'ـح', emphatic: false, violet: false },
    
    // Row 2
    { letter: 'ـخ', emphatic: true, violet: false },
    { letter: 'ـد', emphatic: false, violet: false },
    { letter: 'ـذ', emphatic: false, violet: false },
    { letter: 'ـر', emphatic: true, violet: false },
    { letter: 'ـز', emphatic: false, violet: false },
    { letter: 'ـس', emphatic: false, violet: false },
    
    // Row 3
    { letter: 'ـش', emphatic: false, violet: false },
    { letter: 'ـص', emphatic: true, violet: false },
    { letter: 'ـض', emphatic: true, violet: false },
    { letter: 'ـط', emphatic: true, violet: false },
    { letter: 'ـظ', emphatic: true, violet: false },
    { letter: 'ـع', emphatic: false, violet: false },
    
    // Row 4
    { letter: 'ـغ', emphatic: true, violet: false },
    { letter: 'ـف', emphatic: false, violet: false },
    { letter: 'ـق', emphatic: true, violet: false },
    { letter: 'ـك', emphatic: false, violet: false },
    { letter: 'ـل', emphatic: false, violet: false },
    { letter: 'ـم', emphatic: false, violet: false },
    
    // Row 5
    { letter: 'ـن', emphatic: false, violet: false },
    { letter: 'ـه', emphatic: false, violet: false },
    { letter: 'ـو', emphatic: false, violet: false },
    { letter: 'ـي', emphatic: false, violet: false },
    { letter: 'ء', emphatic: false, violet: true },
    { letter: 'ـة', emphatic: false, violet: true }
  ];

  return (
    <div 
      className="font-arabic min-h-screen"
      style={{ direction: 'rtl' }}
    >
      <div className="w-full h-full bg-zinc-900 overflow-hidden">
        {/* Header */}
        <div className="bg-arabic-gradient text-white p-6 text-center">
          <div className="text-3xl font-bold mb-2">
            Les lettres en fin de mot
          </div>
        </div>
        
        {/* Alphabet Grid */}
        <div className="p-8 bg-zinc-900">
          <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-7 gap-4 mb-6">
            {letters.map((item, index) => (
              <Cell 
                key={index} 
                letter={item.letter}
                emphatic={item.emphatic}
                violet={item.violet}
              />
            ))}
          </div>
          
          {/* Légende simplifiée */}
          <div className="bg-zinc-800 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-400 rounded-full"></div>
                <span className="text-red-400">Lettres emphatiques</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-purple-400 rounded-full"></div>
                <span className="text-purple-400">Lettres spéciales</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer standard */}
        <footer className="bg-zinc-800 text-white text-center p-6 flex-shrink-0 font-semibold text-sm">
          <div>Page 4</div>
          <div className="mt-1">© 2025 Tous droits réservés</div>
        </footer>
      </div>
    </div>
  );
};

// Cell Component simplifié sans le nom
const Cell = ({ letter, emphatic, violet }: { 
  letter: string;
  emphatic?: boolean;
  violet?: boolean;
}) => (
  <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-4 text-center min-h-[100px] flex flex-col justify-center items-center hover:bg-zinc-700 transition-all duration-300 hover:scale-105 cursor-pointer">
    <div className={`text-3xl md:text-4xl font-bold transition-colors ${
      emphatic ? 'text-red-400' : 
      violet ? 'text-purple-400' : 
      'text-white'
    }`}>
      {letter}
    </div>
  </div>
);

export default Page4;