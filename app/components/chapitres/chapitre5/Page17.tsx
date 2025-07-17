import React from 'react';

const Page17 = () => {
  const words = [
    'وَرَقٌ',
    'قَلَمٌ',
    'مَلَكٌ',
    'بَشَرٌ',
    'جَبَلٌ',
    'بَقَرٌ',
    'ثَمَرٌ',
    'حَجَرٌ',
    'لَبَنٌ',
    'قَمَرٌ',
    'وَلَدٌ',
    'فَمٌ',
    'رَجُلٌ',
  ];

  return (
    <div className="font-arabic min-h-screen" style={{ direction: 'rtl' }}>
      <div className="w-full h-full bg-zinc-900 overflow-hidden">
        {/* Header */}
        <div className="bg-arabic-gradient text-white p-6 text-center">
          <div className="text-3xl md:text-3xl font-bold">
            Exercices de lecture avec voyelles simples et doubles
          </div>
        </div>

        {/* Words Grid */}
        <div className="p-8 bg-zinc-900">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
              {words.map((word, index) => (
                <WordCard key={index} word={word} />
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-zinc-800 text-white text-center p-6 flex-shrink-0 font-semibold text-sm">
          <div>Page 17</div>
          <div className="mt-1">© 2025 Tous droits réservés</div>
        </footer>
      </div>
    </div>
  );
};

const WordCard = ({ word }: { word: string }) => {
  const renderWordWithColors = (word: string) => {
    const output = [];
    let colorToggle = false; // false = blanc, true = bleu

    for (let i = 0; i < word.length; i++) {
      const char = word[i];
      output.push(
        <span
          key={`char-${i}`}
          className={colorToggle ? 'text-blue-400' : 'text-white'}
        >
          {char}
        </span>
      );
      colorToggle = !colorToggle;
    }

    return <span style={{ direction: 'rtl', unicodeBidi: 'isolate' }}>{output}</span>;
  };

  return (
    <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-4 text-center hover:bg-zinc-700 transition-all duration-300 group min-h-[100px] flex items-center justify-center">
      <div className="text-2xl md:text-3xl font-bold leading-relaxed group-hover:scale-105 transition-transform duration-300">
        {renderWordWithColors(word)}
      </div>
    </div>
  );
};

export default Page17;
