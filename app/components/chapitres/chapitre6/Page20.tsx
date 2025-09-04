"use client";
import React from "react";

const chapter6Page20AudioMappings: { [key: string]: string } = {
  // Ba
  "بَوْ": "chap6_pg20_case1",
  "بَيْ": "chap6_pg20_case2",

  // Ta
  "تَوْ": "chap6_pg20_case3",
  "تَيْ": "chap6_pg20_case4",

  // Tha
  "ثَوْ": "chap6_pg20_case5",
  "ثَيْ": "chap6_pg20_case6",

  // Jim
  "جَوْ": "chap6_pg20_case7",
  "جَيْ": "chap6_pg20_case8",

  // Ha
  "حَوْ": "chap6_pg20_case9",
  "حَيْ": "chap6_pg20_case10",

  // Kha
  "خَوْ": "chap6_pg20_case11",
  "خَيْ": "chap6_pg20_case12",

  // Dal
  "دَوْ": "chap6_pg20_case13",
  "دَيْ": "chap6_pg20_case14",

  // Dhal
  "ذَوْ": "chap6_pg20_case15",
  "ذَيْ": "chap6_pg20_case16",

  // Ra
  "رَوْ": "chap6_pg20_case17",
  "رَيْ": "chap6_pg20_case18",

  // Zay
  "زَوْ": "chap6_pg20_case19",
  "زَيْ": "chap6_pg20_case20",

  // Sin
  "سَوْ": "chap6_pg20_case21",
  "سَيْ": "chap6_pg20_case22",

  // Shin
  "شَوْ": "chap6_pg20_case23",
  "شَيْ": "chap6_pg20_case24",

  // Sad
  "صَوْ": "chap6_pg20_case25",
  "صَيْ": "chap6_pg20_case26",

  // Dad
  "ضَوْ": "chap6_pg20_case27",
  "ضَيْ": "chap6_pg20_case28",

  // Ta emphatic
  "طَوْ": "chap6_pg20_case29",
  "طَيْ": "chap6_pg20_case30",

  // Dha emphatic
  "ظَوْ": "chap6_pg20_case31",
  "ظَيْ": "chap6_pg20_case32",

  // Ayn
  "عَوْ": "chap6_pg20_case33",
  "عَيْ": "chap6_pg20_case34",

  // Ghayn
  "غَوْ": "chap6_pg20_case35",
  "غَيْ": "chap6_pg20_case36",
};

const Page20 = () => {
  const playLetterAudio = (vowelLetter: string) => {
    const audioFileName = chapter6Page20AudioMappings[vowelLetter];
    if (audioFileName) {
      const audio = new Audio(`/audio/chapitre6/${audioFileName}.mp3`);
      audio.play().catch((error) => {
        console.error("Erreur lors de la lecture audio:", error);
      });
    }
  };

  const words = [
    "بَوْ", "بَيْ",
    "تَوْ", "تَيْ",
    "ثَوْ", "ثَيْ",
    "جَوْ", "جَيْ",
    "حَوْ", "حَيْ",
    "خَوْ", "خَيْ",
    "دَوْ", "دَيْ",
    "ذَوْ", "ذَيْ",
    "رَوْ", "رَيْ",
    "زَوْ", "زَيْ",
    "سَوْ", "سَيْ",
    "شَوْ", "شَيْ",
    "صَوْ", "صَيْ",
    "ضَوْ", "ضَيْ",
    "طَوْ", "طَيْ",
    "ظَوْ", "ظَيْ",
    "عَوْ", "عَيْ",
    "غَوْ", "غَيْ",
  ];

  return (
    <div className="font-arabic min-h-screen" style={{ direction: "rtl" }}>
      <div className="w-full h-full bg-gray-900 overflow-hidden">
        {/* Header */}
        <div className="text-white p-6 text-center border-b-2 border-gray-700">
          <div className="text-3xl md:text-3xl font-bold">Leçon : lettres douces</div>
        </div>

        {/* Content */}
        <div className="p-8 bg-gray-900">
          <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-8">
            {words.map((word, index) => (
              <DiphthongCard
                key={index}
                word={word}
                onClick={() => playLetterAudio(word)}
              />
            ))}
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-gray-700 text-white text-center p-6 flex-shrink-0 font-semibold text-sm">
          <div>Page 20</div>
          <div className="mt-1">© 2025 Tous droits réservés</div>
        </footer>
      </div>
    </div>
  );
};

// Carte pour chaque combinaison (lettre + fatha + lettre douce)
const DiphthongCard = ({ word, onClick }: { word: string; onClick?: () => void }) => (
  <div
    className="bg-gray-800 border border-zinc-500 rounded-xl p-3 text-center hover:bg-gray-700 transition-all duration-300 group min-h-[90px] flex items-center justify-center cursor-pointer"
    onClick={onClick}
  >
    <div
      className="text-2xl md:text-3xl font-bold leading-relaxed text-white group-hover:scale-105 transition-transform duration-300 break-keep"
      dir="rtl"
      lang="ar"
      style={{ fontFeatureSettings: '"calt" 1, "liga" 1' }}
    >
      {word}
    </div>
  </div>
);

export default Page20;
