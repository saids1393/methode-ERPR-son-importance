"use client";

import React from "react";

const chapter9Page24AudioMappings: { [key: string]: string } = {
  "الشَّمْسُ": "chap9_pg24_case15",
  "النَّهْرُ": "chap9_pg24_case16",
  "الدَّرْسُ": "chap9_pg24_case17",
  "التِّينُ": "chap9_pg24_case18",
  "الْقَمَرُ": "chap9_pg24_case19",
  "الْبَيْتُ": "chap9_pg24_case20",
  "الْكِتَابُ": "chap9_pg24_case21",
  "الْمَاءُ": "chap9_pg24_case22",
};

const Page24 = () => {
  const playLetterAudio = (word: string) => {
    const audioFileName = chapter9Page24AudioMappings[word];
    if (audioFileName) {
      const audio = new Audio(`/audio/chapitre9/${audioFileName}.mp3`);
      audio.play().catch((error) =>
        console.error("Erreur lors de la lecture audio:", error)
      );
    }
  };

  const solarLetters = ["ت", "ث", "د", "ذ", "ر", "ز", "س", "ش", "ص", "ض", "ط", "ظ", "ل", "ن"];
  const lunarLetters = ["ا", "ب", "ج", "ح", "خ", "ع", "غ", "ف", "ق", "ك", "م", "و", "ه", "ي"];
  const solarExamples = ["الشَّمْسُ", "النَّهْرُ", "الدَّرْسُ", "التِّينُ"];
  const lunarExamples = ["الْقَمَرُ", "الْبَيْتُ", "الْكِتَابُ", "الْمَاءُ"];

  return (
    <div className="font-arabic min-h-screen" style={{ direction: "rtl" }}>
      <div className="w-full h-full bg-gray-900 overflow-hidden">
        {/* Header */}
        <div className="text-white p-6 text-center border-b border-gray-700">
          <div className="text-3xl font-bold">
            Leçon : lettres solaires et lunaires
          </div>
        </div>

        {/* Content */}
        <div className="p-8 bg-gray-900">
          <div className="max-w-6xl mx-auto">
            {/* Lettres solaires */}
            <Section
              title="Lettres solaires (14 lettres)"
              color="text-yellow-400"
              letters={solarLetters}
              examples={solarExamples}
              onLetterClick={playLetterAudio}
              onWordClick={playLetterAudio}
            />

            {/* Lettres lunaires */}
            <Section
              title="Lettres lunaires (14 lettres)"
              color="text-blue-400"
              letters={lunarLetters}
              examples={lunarExamples}
              onLetterClick={playLetterAudio}
              onWordClick={playLetterAudio}
            />
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-gray-700 text-white text-center p-6 font-semibold text-sm">
          <div>Page 24</div>
          <div className="mt-1">© 2025 Tous droits réservés</div>
        </footer>
      </div>
    </div>
  );
};

const Section = ({
  title,
  color,
  letters,
  examples,
  onLetterClick,
  onWordClick,
}: {
  title: string;
  color: string;
  letters: string[];
  examples: string[];
  onLetterClick: (letter: string) => void;
  onWordClick: (word: string) => void;
}) => (
  <div className="mb-12">
    <h2 className={`text-center text-xl font-bold mb-6 ${color}`}>{title}</h2>
    <div className="flex flex-wrap gap-3 mb-6 justify-center">
      {letters.map((letter, index) => (
        <LetterCard key={index} letter={letter} color={color} onClick={() => onLetterClick(letter)} />
      ))}
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {examples.map((word, index) => (
        <ExampleCard key={index} word={word} onClick={() => onWordClick(word)} />
      ))}
    </div>
  </div>
);

const LetterCard = ({
  letter,
  color,
  onClick,
}: {
  letter: string;
  color: string;
  onClick?: () => void;
}) => (
  <div
    className={`border-2 border-current rounded-lg p-3 cursor-pointer min-w-[50px] min-h-[50px] flex items-center justify-center hover:scale-105 transition-transform duration-300 ${color}`}
    onClick={onClick}
  >
    <div className="text-2xl font-bold">{letter}</div>
  </div>
);

const ExampleCard = ({ word, onClick }: { word: string; onClick?: () => void }) => (
  <div
    className="bg-gray-800 border border-gray-700 rounded-xl p-6 text-center hover:bg-gray-700 transition-all duration-300 cursor-pointer"
    onClick={onClick}
  >
    <div
      className="text-3xl md:text-4xl font-bold leading-relaxed text-white break-keep"
      dir="rtl"
      lang="ar"
      style={{ fontFeatureSettings: '"calt" 1, "liga" 1' }}
    >
      {word}
    </div>
  </div>
);

export default Page24;
