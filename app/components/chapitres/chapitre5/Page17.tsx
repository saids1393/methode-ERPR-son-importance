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
    'وَلَدٌ',
    'سَمَكٌ',
     'يَدٌ',
    'زَمَنٌ',
    
  ];

  return (
    <div className="min-h-screen bg-zinc-900 text-white font-serif font-amiri" dir="rtl">
      <div className="bg-arabic-gradient text-white p-6 text-center">
          <div className="text-3xl md:text-3xl font-bold">
           Exercice : reconnaissance des mots avec voyelles simples et doubles
          </div>
        </div>

      {/* Main grid */}
      <main className="max-w-6xl mx-auto p-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {words.map((word, index) => (
          <WordCard key={index} word={word} />
        ))}
      </main>

      {/* Footer */}
      <footer className="bg-zinc-800 text-white text-center p-6 font-semibold text-sm select-none">
        <div>Page 17</div>
        <div className="mt-1">© 2025 Tous droits réservés</div>
      </footer>
    </div>
  );
};

const WordCard = ({ word }: { word: string }) => {
  return (
    <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-4 min-h-[100px] flex items-center justify-center cursor-default select-none hover:bg-zinc-700 transition-colors duration-300">
      <div className="text-2xl font-bold leading-relaxed text-white">
        {word}
      </div>
    </div>
  );
};

export default Page17;
