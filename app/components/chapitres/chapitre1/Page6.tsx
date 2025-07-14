import React from 'react';

const Page6 = () => {
  const words = [
    // Row 1
    'أب', 'ر', 'لا', 'بر', 'نا', 'لم',
    // Row 2
    'ما', 'حب', 'سا', 'بلب', 'كم', 'لك',
    // Row 3
    'كب', 'كا', 'دم', 'جب', 'ف', 'نك',
    // Row 4
    'تم', 'نم', 'تن', 'يد', 'با', 'شم',
    // Row 5
    'تا', 'سن', 'شا', 'ثم', 'سر', 'جد',
    // Row 6
    'عم', 'عن', 'جر', 'ثن', 'هم', 'نث',
    // Row 7
    'من', 'هل', 'مه', 'وم', 'هو', 'ود',
    // Row 8
    'قم', 'في', 'ض', 'زي', 'زر', 'ثمر',
    // Row 9
    'نب', 'nبل', 'بيل', 'بل', 'جل', 'كل'
  ];

  // Fonction pour appliquer l'alternance de couleurs
  const renderWordWithColors = (word: string) => {
    return word.split('').map((letter, index) => (
      <span
        key={index}
        className={index % 2 === 0 ? 'text-white' : 'text-blue-400'}
      >
        {letter}
      </span>
    ));
  };

  return (
    <div 
      className="font-arabic min-h-screen"
      style={{ direction: 'rtl' }}
    >
      <div className="w-full h-full bg-zinc-900 overflow-hidden">
        {/* Header */}
        <div className="bg-arabic-gradient text-white p-6 text-center">
          <div className="text-3xl font-bold mb-4">Reconnaissance des lettres d'alphabet sur toute leurs formes</div>
        </div>
        
        {/* Words Grid */}
        <div className="p-8 bg-zinc-900">
          <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-7 gap-4 mb-6">
            {words.map((word, index) => (
              <WordCell key={index} word={word} />
            ))}
          </div>
          
          
        </div>
        
        {/* Footer standard comme Page4 */}
        <footer className="bg-zinc-800 text-white text-center p-6 flex-shrink-0 font-semibold text-sm">
          <div>Page 6</div>
          <div className="mt-1">© 2025 Tous droits réservés</div>
        </footer>
      </div>
    </div>
  );
};

// WordCell Component avec alternance de couleurs
const WordCell = ({ word }: { word: string }) => {
  const renderWordWithColors = (word: string) => {
    return word.split('').map((letter, index) => (
      <span
        key={index}
        className={index % 2 === 0 ? 'text-white' : 'text-blue-400'}
      >
        {letter}
      </span>
    ));
  };

  return (
    <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-4 text-center min-h-[80px] flex flex-col justify-center items-center hover:bg-zinc-700 transition-all duration-300 hover:scale-105 cursor-pointer">
      <div className="text-3xl md:text-4xl font-bold transition-colors">
        {renderWordWithColors(word)}
      </div>
    </div>
  );
};

export default Page6;