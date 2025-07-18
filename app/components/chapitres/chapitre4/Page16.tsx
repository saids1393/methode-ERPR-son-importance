// components/chapitres/chapitre4/Page16.tsx
import React from 'react';

const Page16 = () => {
  const disconnectedLetters = [
    { letter: 'ا', example: 'قَالَ', meaning: 'il a dit' },
    { letter: 'د', example: 'عُدْنَ', meaning: 'revenez !' },
    { letter: 'ذ', example: 'يَذْكُرُ', meaning: 'il se souvient' },
    { letter: 'ر', example: 'فَرِحَ', meaning: 'il s’est réjoui' },
    { letter: 'ز', example: 'تَزَكَّىٰ', meaning: 'il s’est purifié' },
    { letter: 'و', example: 'خَوْفٌ', meaning: 'peur' }
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
           Leçon : Exemples et compréhension des lettres qui ne s'attachent
          </div>
        </div>

        {/* Letters Grid */}
        <div className="p-8 bg-zinc-900">
          <div className="max-w-4xl mx-auto">
            {/* Grid des lettres déconnectées */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {disconnectedLetters.map((item, index) => (
                <DisconnectedLetterCard
                  key={index}
                  letter={item.letter}
                  example={item.example}
                  meaning={item.meaning}
                />
              ))}
            </div>

            {/* Explication */}
            <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-6 mb-6">
              <div className="text-center font-bold text-lg text-blue-400 mb-3 bg-blue-900/30 py-2 rounded-lg">
                Résumé
              </div>
              <div className="text-center text-zinc-300 text-base leading-relaxed">
                Les lettres qui ne s'attachent pas après elles sont en nombre de 6
                <br />
                <span className="text-red-500 text-4xl font-semibold">ا - د - ذ - ر - ز - و</span>
              </div>
            </div>

          </div>
        </div>

        {/* Footer */}
        <footer className="bg-zinc-800 text-white text-center p-6 flex-shrink-0 font-semibold text-sm">
          <div>Page 16</div>
          <div className="mt-1">© 2025 Tous droits réservés</div>
        </footer>
      </div>
    </div>
  );
};

// Remplace la lettre ciblée dans l'exemple par un <mark> stylé
const highlightLetterInExample = (example: string, targetLetter: string) => {
  const parts = example.split(targetLetter);
  return (
    <>
      {parts.map((part, i) => (
        <React.Fragment key={i}>
          {part}
          {i !== parts.length -1 && <mark className="bg-transparent text-red-500 font-semibold">{targetLetter}</mark>}
        </React.Fragment>
      ))}
    </>
  );
};

// Composant pour chaque lettre
const DisconnectedLetterCard = ({ letter, example, meaning }: {
  letter: string;
  example: string;
  meaning: string;
}) => (
  <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-6 text-center hover:bg-zinc-700 transition-all duration-300 group">
    {/* Lettre principale */}
    <div className="text-5xl md:text-6xl font-bold text-red-400 mb-4 group-hover:scale-110 transition-transform duration-300">
      {letter}
    </div>

    {/* Ligne de séparation */}
    <div className="w-full h-px bg-zinc-600 mb-4"></div>

    {/* Exemple avec voyelles, lettre mise en évidence avec <mark> */}
    <div className="text-3xl md:text-4xl font-bold text-white mb-3 leading-relaxed">
      {highlightLetterInExample(example, letter)}
    </div>

    {/* Badge indicateur */}
    <div className="inline-block bg-yellow-900/30 text-yellow-400 px-3 py-1 rounded-full text-xs font-semibold">
      Ne s'attache pas après
    </div>
  </div>
);

export default Page16;
