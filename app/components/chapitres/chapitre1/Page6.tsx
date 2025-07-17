import React from 'react';

const Page6 = () => {
  const words = [
    // Row 1 (2 lettres + 1 lettre seule)
    'في', 'من', 'ق', 'قد', 'ل\u200cا', 'هو',

    // Row 2 (2 lettres)
    'ما', 'أن', 'لم', 'كل', 'ثم', 'هل',

    // Row 3 (2 lettres + 1 lettre seule)
    'عن', 'ر', 'به', 'له', 'رب', 'قل',

    // Row 4 (2 lettres)
    'هم', 'هو', 'نا', 'كم', 'أي', 'ف',

    // Row 5 (3 lettres + 1 lettre seule)
    'نور', 'عبد', 'نار', 'يدع', 'فوز', 'ع',

    // Row 6 (3 lettres)
    'ملك', 'نهر', 'قمر', 'غيب', 'رسل', 'نفس',

    // Row 7 (3 lettres + 1 lettre seule)
    'ضر', 'صمت', 'ح', 'خير', 'علم', 'قلب',

    // Row 8 (3 lettres)
    'خلق', 'غفر', 'سجد', 'عدة', 'خوف', 'صدق',

    // Row 9 (3 lettres + 1 lettre seule)
    'كفر', 'نصر', 'س', 'سؤل', 'أمر', 'يئس',
  ];

  // Fonction pour appliquer l'alternance de couleurs
  const renderWordWithColors = (word: string) => {
    // Si le mot contient la séquence lam + ZWNJ + alif, on la traite à part
    if (word.includes('ل\u200cا')) {
      const parts = word.split('ل\u200cا');
      return (
        <>
          {parts[0] && renderLetters(parts[0])}
          <span>
            <span className="text-white">ل</span>
            <span className="text-blue-400">ا</span>
          </span>
          {parts[1] && renderLetters(parts[1])}
        </>
      );
    }
    // Sinon, alternance normale
    return renderLetters(word);
  };

  // Fonction pour rendre chaque lettre en alternance blanche / bleue
  const renderLetters = (text: string) => {
    return text.split('').map((letter, index) => (
      <span key={index} className={index % 2 === 0 ? 'text-white' : 'text-blue-400'}>
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
              <WordCell key={index} word={word} renderWordWithColors={renderWordWithColors} />
            ))}
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-zinc-800 text-white text-center p-6 flex-shrink-0 font-semibold text-sm">
          <div>Page 6</div>
          <div className="mt-1">© 2025 Tous droits réservés</div>
        </footer>
      </div>
    </div>
  );
};

// WordCell Component avec alternance de couleurs, reçoit la fonction pour gérer l'affichage
const WordCell = ({
  word,
  renderWordWithColors,
}: {
  word: string;
  renderWordWithColors: (word: string) => React.ReactNode;
}) => {
  return (
    <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-4 text-center min-h-[80px] flex flex-col justify-center items-center hover:bg-zinc-700 transition-all duration-300 hover:scale-105 cursor-pointer">
      <div className="text-3xl md:text-4xl font-bold transition-colors">
        {renderWordWithColors(word)}
      </div>
    </div>
  );
};

export default Page6;
