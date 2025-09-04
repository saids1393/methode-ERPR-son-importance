"use client";

import React from "react";

// Mapping audio pour le Chapitre 5, Page 17 (mots avec voyelles)
const chapter5Page17AudioMappings: { [key: string]: string } = {
  "وَرَقٌ": "chap5_pg17_case1",
  "قَلَمٌ": "chap5_pg17_case2",
  "مَلَكٌ": "chap5_pg17_case3",
  "بَشَرٌ": "chap5_pg17_case4",
  "جَبَلٌ": "chap5_pg17_case5",
  "بَقَرٌ": "chap5_pg17_case6",
  "ثَمَرٌ": "chap5_pg17_case7",
  "حَجَرٌ": "chap5_pg17_case8",
  "لَبَنٌ": "chap5_pg17_case9",
  "قَمَرٌ": "chap5_pg17_case10",
  "وَلَدٌ": "chap5_pg17_case11",
  "فَمٌ": "chap5_pg17_case12",
  "رَجُلٌ": "chap5_pg17_case13",
  "سَمَكٌ": "chap5_pg17_case14",
  "يَدٌ": "chap5_pg17_case15",
  "زَمَنٌ": "chap5_pg17_case16",
};

const Page17 = () => {
  const playWordAudio = (word: string) => {
    const audioFileName = chapter5Page17AudioMappings[word];
    if (audioFileName) {
      const audio = new Audio(`/audio/chapitre5/${audioFileName}.mp3`);
      audio.play().catch((error) => {
        console.error("Erreur lors de la lecture audio:", error);
      });
    }
  };

  const words = [
    "وَرَقٌ",
    "قَلَمٌ",
    "مَلَكٌ",
    "بَشَرٌ",
    "جَبَلٌ",
    "بَقَرٌ",
    "ثَمَرٌ",
    "حَجَرٌ",
    "لَبَنٌ",
    "قَمَرٌ",
    "وَلَدٌ",
    "فَمٌ",
    "رَجُلٌ",
    "سَمَكٌ",
    "يَدٌ",
    "زَمَنٌ",
  ];

  return (
    <div className="font-arabic min-h-screen" style={{ direction: "rtl" }}>
      <div className="w-full h-full bg-gray-900 overflow-hidden">
        {/* Header */}
        <div className="text-white p-6 text-center border-b-2 border-gray-700">
          <div className="text-3xl md:text-3xl font-bold">
            Exercice : reconnaissance des mots avec voyelles simples et doubles
          </div>
        </div>

        {/* Words Grid */}
        <div className="p-8 bg-gray-900">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
              {words.map((word, index) => (
                <WordCard key={index} word={word} onClick={() => playWordAudio(word)} />
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-gray-700 text-white text-center p-6 flex-shrink-0 font-semibold text-sm">
          <div>Page 17</div>
          <div className="mt-1">© 2025 Tous droits réservés</div>
        </footer>
      </div>
    </div>
  );
};

const WordCard = ({ word, onClick }: { word: string; onClick?: () => void }) => (
  <div
    className="bg-gray-800 border border-zinc-500 rounded-xl p-4 text-center hover:bg-gray-700 transition-all duration-300 group min-h-[100px] flex items-center justify-center cursor-pointer"
    onClick={onClick}
  >
    <div
      className="text-4xl md:text-5xl font-bold leading-relaxed text-white group-hover:scale-105 transition-transform duration-300 break-keep"
      dir="rtl"
      lang="ar"
      style={{ fontFeatureSettings: '"calt" 1, "liga" 1' }}
    >
      {word}
    </div>
  </div>
);

export default Page17;
