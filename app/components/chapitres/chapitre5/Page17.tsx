import React from 'react';

const Page17 = () => {
const words = [
  'وَرَقٌ',   // feuille – Coran 7:22
  'قَلَمٌ',   // stylo/plume – Coran 68:1
  'مَلَكٌ',   // ange – ex. Coran 2:98
  'بَشَرٌ',   // humain – Coran 15:28
  'جَبَلٌ',   // montagne – Coran 2:63
  'بَقَرٌ',   // vache – Coran 2:6    // feu – Coran 2:17
  'ثَمَرٌ',   // fruit – Coran 2:266
  'حَجَرٌ',   // pierre – Coran 2:74
  'لَبَنٌ',   // lait – Coran 16:66
  'قَمَرٌ',   // lune – Coran 2:189
  'وَلَدٌ',   // enfant – Coran 6:151
  'فَمٌ',     // bouche – Coran 5:110
  'رَجُلٌ',   // homme – Coran 18:32
     // vêtement – Coran 74:4
    // chien – Coran 18:18
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
  const simpleVowels = new Set(['َ', 'ُ', 'ِ', 'ً', 'ٌ', 'ٍ']); // fatha, damma, kasra + tanwin

  const renderWordWithColors = (word: string) => {
    const output = [];
    for (let i = 0; i < word.length; i++) {
      const char = word[i];
      const nextChar = word[i + 1];

      // Si la lettre est suivie d’une voyelle simple ou tanwin
      if (simpleVowels.has(nextChar)) {
        output.push(
          <span key={`l-${i}`} className="text-blue-400">
            {char}
          </span>
        );
      } else if (!simpleVowels.has(char)) {
        // Lettre sans voyelle simple → blanc
        output.push(
          <span key={`l-${i}`} className="text-white">
            {char}
          </span>
        );
      } else {
        // Voyelles elles-mêmes → on laisse normales (non colorées)
        output.push(
          <span key={`v-${i}`} className="text-white">
            {char}
          </span>
        );
      }
    }

    return <span style={{ unicodeBidi: 'plaintext' }}>{output}</span>;
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
