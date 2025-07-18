// components/chapitres/chapitre4/Page16.tsx
import React from 'react';

const Page16 = () => {
  // Exemple avec réglage manuel des dégradés (startPercent et widthPercent)
  const disconnectedLetters = [
    { letter: 'ا', example: 'قَالَ', meaning: 'il a dit', startPercent: 50, widthPercent: 15, color: '#ff0000ff' },
    { letter: 'د', example: 'عُدْنَ', meaning: 'revenez !', startPercent: 30, widthPercent: 25, color: '#fbbf24' },
    { letter: 'ذ', example: 'يَذْكُرُ', meaning: 'il se souvient', startPercent: 20, widthPercent: 15, color: '#f43f5e' },
    { letter: 'ر', example: 'فَرِحَ', meaning: 'il s’est réjoui', startPercent: 35, widthPercent: 20, color: '#f87171' },
    { letter: 'ز', example: 'تَزَكَّىٰ', meaning: 'il s’est purifié', startPercent: 25, widthPercent: 30, color: '#fb7185' },
    { letter: 'و', example: 'خَوْفٌ', meaning: 'peur', startPercent: 40, widthPercent: 20, color: '#f43f5e' },
  ];

  return (
    <div
      className="font-arabic min-h-screen"
      style={{ direction: 'rtl' }}
    >
      <div className="w-full h-full bg-zinc-900 overflow-hidden">
        {/* Header */}
        <div className="t text-white p-6 text-center">
          <div className="text-3xl md:text-3xl font-bold">
           Leçon : Exemples et compréhension des lettres qui ne s'attachent
          </div>
        </div>

        {/* Letters Grid */}
        <div className="p-8 bg-zinc-900">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {disconnectedLetters.map((item, index) => (
                <DisconnectedLetterCard
                  key={index}
                  letter={item.letter}
                  example={item.example}
                  meaning={item.meaning}
                  startPercent={item.startPercent}
                  widthPercent={item.widthPercent}
                  highlightColor={item.color}
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

// Composant avec dégradé contrôlé manuellement
const HighlightWord = ({
  word,
  startPercent,
  widthPercent,
  highlightColor,
}: {
  word: string;
  startPercent: number;  // où commence le dégradé (%)
  widthPercent: number;  // largeur du dégradé (%)
  highlightColor: string; // couleur du dégradé
}) => {
  // Assure que les valeurs sont dans [0,100]
  const start = Math.min(Math.max(startPercent, 0), 100);
  const width = Math.min(Math.max(widthPercent, 0), 100 - start);

  // Construction du dégradé linéaire
  const gradient = `linear-gradient(
    to right,
    white 0%,
    white ${start}%,
    ${highlightColor} ${start}%,
    ${highlightColor} ${start + width}%,
    white ${start + width}%,
    white 0%
  )`;

  return (
    <span
      style={{
        background: gradient,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        direction: 'rtl',
        fontWeight: 'bold',
        fontSize: '1.75rem',
        userSelect: 'text',
    
      }}
      className="font-arabic"
      aria-label={word}
    >
      {word}
    </span>
  );
};

const DisconnectedLetterCard = ({
  letter,
  example,
  meaning,
  startPercent,
  widthPercent,
  highlightColor,
}: {
  letter: string;
  example: string;
  meaning: string;
  startPercent: number;
  widthPercent: number;
  highlightColor: string;
}) => (
  <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-6 text-center hover:bg-zinc-700 transition-all duration-300 group">
    {/* Lettre principale */}
    <div className="text-5xl md:text-6xl font-bold text-red-400 mb-4 group-hover:scale-110 transition-transform duration-300">
      {letter}
    </div>

    {/* Ligne de séparation */}
    <div className="w-full h-px bg-zinc-600 mb-4"></div>

    {/* Exemple avec surlignage personnalisé */}
    <div className="mb-3 leading-relaxed">
      <HighlightWord
        word={example}
        startPercent={startPercent}
        widthPercent={widthPercent}
        highlightColor={highlightColor}
      />
    </div>

    {/* Badge indicateur */}
    <div className="inline-block bg-yellow-900/30 text-yellow-400 px-3 py-1 rounded-full text-xs font-semibold">
      Ne s'attache pas après
    </div>
  </div>
);

export default Page16;
