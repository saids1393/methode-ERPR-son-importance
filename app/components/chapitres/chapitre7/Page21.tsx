"use client";

// components/chapitres/chapitre7/Page21.tsx
import React from "react";


// Interface pour le type de mot
interface WordItem {
  word: string;
  symbol?: string;
  symbolPosition?: {
    position: "fixed" | "relative" | "absolute" | "static";
    letterStyle: string;
  };
}

const chapter7Page21AudioMappings: { [key: string]: string } = {
  // Mots simples
  "بَيْتٌ": "chap7_pg21_case1",
  "قَوْمٌ": "chap7_pg21_case2",
  "نَوْمٌ": "chap7_pg21_case3",
  "صَوْتٌ": "chap7_pg21_case4",
  "لَيْلٌ": "chap7_pg21_case5",
  "رَيْحٌ": "chap7_pg21_case6",
  "بَيْضٌ": "chap7_pg21_case7",
  "خُبْزٌ": "chap7_pg21_case8",
  "الْكِتَابُ": "chap7_pg21_case9",
  "يَقُولُ": "chap7_pg21_case10",
  "كَرِيمٌ": "chap7_pg21_case11",
  "يَقِينٌ": "chap7_pg21_case12",
  "صِدِيقٌ": "chap7_pg21_case13",
  "قُلُوبُكُمْ": "chap7_pg21_case14",
  "نَارٌ": "chap7_pg21_case15",
  "بَصِيرٌ": "chap7_pg21_case16",
  "حَكِيمٌ": "chap7_pg21_case17",
  "عَصَا": "chap7_pg21_case18",
  "سَمَاءً": "chap7_pg21_case19",
  "جَزَاءً": "chap7_pg21_case20",
  "شُهُورٌ": "chap7_pg21_case21",

  // Mots avec petits madd
  "عَبِدُونَ": "chap7_pg21_case22",
  "لَهٰ": "chap7_pg21_case23",
  "مَوَازِينُهُهٰ": "chap7_pg21_case24",
  "إِنْسَانٌ": "chap7_pg21_case25",
  "صَلَوٰةٌ": "chap7_pg21_case26",
  "سَفِلِينَ": "chap7_pg21_case27",
  "عِنْدَهٰ": "chap7_pg21_case28",
};


const Page21 = () => {
// Fonction pour jouer l'audio avec le mapping spécifique
const playLetterAudio = (vowelLetter: string) => {
  const audioFileName = chapter7Page21AudioMappings[vowelLetter];
  if (audioFileName) {
    const audio = new Audio(`/audio/${audioFileName}.mp3`);
    audio.play().catch(error => {
      console.error('Erreur lors de la lecture audio:', error);
    });
  }
};

  const words: WordItem[] = [
    // Mots simples (juste word)
    { word: "بَيْتٌ" },
    { word: "قَوْمٌ" },
    { word: "نَوْمٌ" },
    { word: "صَوْتٌ" },
    { word: "لَيْلٌ" },
    { word: "رَيْحٌ" },
    { word: "بَيْضٌ" },
    { word: "خُبْزٌ" },
    { word: "الْكِتَابُ" },
    { word: "يَقُولُ" },
    { word: "كَرِيمٌ" },
    { word: "يَقِينٌ" },
    { word: "صِدِيقٌ" },
    { word: "قُلُوبُكُمْ" },
    { word: "نَارٌ" },
    { word: "بَصِيرٌ" },
    { word: "حَكِيمٌ" },
    { word: "عَصَا" },
    { word: "سَمَاءً" },
    { word: "جَزَاءً" },
    { word: "شُهُورٌ" },

    // Mots avec petits madd (plus d'infos)
    {
      word: "عَبِدُونَ",
      symbol: "ٰ",
      symbolPosition: { position: "relative", letterStyle: "top-[-8px] right-[-5px]" },
    },
    {
      word: "لَهٰ",
      symbol: "ٰ",
      symbolPosition: { position: "relative", letterStyle: "top-[-8px] right-[-5px]" },
    },
    {
      word: "مَوَازِينُهُهٰ",
      symbol: "ٰ",
      symbolPosition: { position: "relative", letterStyle: "top-[-8px] right-[-5px]" },
    },
    {
      word: "إِنْسَانٌ",
      symbol: "ٰ",
      symbolPosition: { position: "relative", letterStyle: "top-[-8px] right-[-5px]" },
    },
    {
      word: "صَلَوٰةٌ",
      symbol: "ٰ",
      symbolPosition: { position: "relative", letterStyle: "top-[-8px] right-[-5px]" },
    },
    {
      word: "سَفِلِينَ",
      symbol: "ۦ",
      symbolPosition: { position: "relative", letterStyle: "top-[-8px] right-[-5px]" },
    },
    {
      word: "عِنْدَهٰ",
      symbol: "ٰ",
      symbolPosition: { position: "relative", letterStyle: "top-[-8px] right-[-5px]" },
    },
  ];

// Modifier handleLetterClick pour utiliser la nouvelle fonction
const handleLetterClick = (vowelLetter: string) => {
  playLetterAudio(vowelLetter);
};

  function handleWordClick(word: string): void {
    throw new Error("Function not implemented.");
  }

  return (
    <div className="font-arabic min-h-screen" style={{ direction: "rtl" }}>
      <div className="w-full h-full bg-zinc-900 overflow-hidden">
        {/* Header */}
        <div className="bg-arabic-gradient text-white p-6 text-center">
          <div className="text-3xl md:text-3xl font-bold">
            Exercice : reconnaissance des mots avec voyelles doubles, prolongations et lettres douces
          </div>
        </div>

        {/* Words Grid */}
        <div className="p-8 bg-zinc-900">
          <div className="max-w-6xl mx-auto">
            {/* Nouvelle grille similaire à Page20 */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-8">
              {words.map((item, index) => (
                <VariousWordCard
                  key={index}
                  word={item.word}
                  symbol={item.symbol}
                  symbolPosition={item.symbolPosition}
                  index={index}
                  onClick={() => handleWordClick(item.word)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-zinc-800 text-white text-center p-6 flex-shrink-0 font-semibold text-sm">
          <div>Page 21</div>
          <div className="mt-1">© 2025 Tous droits réservés</div>
        </footer>
      </div>
    </div>
  );
};

interface VariousWordCardProps {
  word: string;
  index: number;
  onClick?: () => void;
  symbol?: string;
  symbolPosition?: {
    position: "fixed" | "relative" | "absolute" | "static";
    letterStyle: string;
  };
}

const VariousWordCard: React.FC<VariousWordCardProps> = ({
  word,
  index,
  onClick,
  symbol,
  symbolPosition,
}) => {
  // Parsing simple du letterStyle (ex: "top-[-8px] right-[-5px]") en objet CSS
  const parseLetterStyle = (styleString: string): React.CSSProperties => {
    const styles: React.CSSProperties = {};
    const parts = styleString.split(" ");
    parts.forEach((part) => {
      if (part.startsWith("top-")) {
        styles.top = part.replace("top-[", "").replace("]", "");
      } else if (part.startsWith("right-")) {
        styles.right = part.replace("right-[", "").replace("]", "");
      } else if (part.startsWith("left-")) {
        styles.left = part.replace("left-[", "").replace("]", "");
      } else if (part.startsWith("bottom-")) {
        styles.bottom = part.replace("bottom-[", "").replace("]", "");
      }
    });
    return styles;
  };

  return (
    <div
      className="bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-center hover:bg-zinc-700 transition-all duration-300 group min-h-[90px] flex items-center justify-center cursor-pointer relative"
      onClick={onClick}
    >
      <div className="text-2xl md:text-3xl font-bold leading-relaxed group-hover:scale-105 transition-transform duration-300 text-white" style={{ display: "inline-flex", alignItems: "center" }}>
        {word}
        {symbol && symbolPosition && (
          <span
            aria-hidden="true"
            style={{
              position: symbolPosition.position,
              ...parseLetterStyle(symbolPosition.letterStyle),
              fontSize: "1.2em",
              lineHeight: 0,
              pointerEvents: "none",
              userSelect: "none",
              marginLeft: "2px",
            }}
          >
            {symbol}
          </span>
        )}
      </div>
    </div>
  );
};

export default Page21;