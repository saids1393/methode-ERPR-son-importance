"use client";

import React from "react";

const noConnect = ["ا", "د", "ذ", "ر", "ز", "و"];

// Mapping audio pour le Chapitre 6, Page 18 (lettres de prolongation)
const chapter6Page18AudioMappings: { [key: string]: string } = {
  "بَـا": "chap6_pg18_case1",
  "بُـو": "chap6_pg18_case2",
  "بِـي": "chap6_pg18_case3",

  "تَـا": "chap6_pg18_case4",
  "تُـو": "chap6_pg18_case5",
  "تِـي": "chap6_pg18_case6",

  "ثَـا": "chap6_pg18_case7",
  "ثُـو": "chap6_pg18_case8",
  "ثِـي": "chap6_pg18_case9",

  "جَـا": "chap6_pg18_case10",
  "جُـو": "chap6_pg18_case11",
  "جِـي": "chap6_pg18_case12",

  "حَـا": "chap6_pg18_case13",
  "حُـو": "chap6_pg18_case14",
  "حِـي": "chap6_pg18_case15",

  "خَـا": "chap6_pg18_case16",
  "خُـو": "chap6_pg18_case17",
  "خِـي": "chap6_pg18_case18",

  "دَـا": "chap6_pg18_case19",
  "دُـو": "chap6_pg18_case20",
  "دِـي": "chap6_pg18_case21",

  "ذَـا": "chap6_pg18_case22",
  "ذُـو": "chap6_pg18_case23",
  "ذِـي": "chap6_pg18_case24",

  "رَـا": "chap6_pg18_case25",
  "رُـو": "chap6_pg18_case26",
  "رِـي": "chap6_pg18_case27",

  "زَـا": "chap6_pg18_case28",
  "زُـو": "chap6_pg18_case29",
  "زِـي": "chap6_pg18_case30",

  "سَـا": "chap6_pg18_case31",
  "سُـو": "chap6_pg18_case32",
  "سِـي": "chap6_pg18_case33",

  "شَـا": "chap6_pg18_case34",
  "شُـو": "chap6_pg18_case35",
  "شِـي": "chap6_pg18_case36",

  "صَـا": "chap6_pg18_case37",
  "صُـو": "chap6_pg18_case38",
  "صِـي": "chap6_pg18_case39",

  "ضَـا": "chap6_pg18_case40",
  "ضُـو": "chap6_pg18_case41",
  "ضِـي": "chap6_pg18_case42",

  "طَـا": "chap6_pg18_case43",
  "طُـو": "chap6_pg18_case44",
  "طِـي": "chap6_pg18_case45",

  "ظَـا": "chap6_pg18_case46",
  "ظُـو": "chap6_pg18_case47",
  "ظِـي": "chap6_pg18_case48",

  "عَـا": "chap6_pg18_case49",
  "عُـو": "chap6_pg18_case50",
  "عِـي": "chap6_pg18_case51",

  "غَـا": "chap6_pg18_case52",
  "غُـو": "chap6_pg18_case53",
  "غِـي": "chap6_pg18_case54",
};

const Page18 = () => {
  const playLetterAudio = (vowelLetter: string) => {
    const audioFileName = chapter6Page18AudioMappings[vowelLetter];
    if (audioFileName) {
      const audio = new Audio(`/audio/chapitre6/${audioFileName}.mp3`);
      audio.play().catch((error) => {
        console.error("Erreur lors de la lecture audio:", error);
      });
    }
  };

  const words = [
    "بَـا", "بُـو", "بِـي",
    "تَـا", "تُـو", "تِـي",
    "ثَـا", "ثُـو", "ثِـي",
    "جَـا", "جُـو", "جِـي",
    "حَـا", "حُـو", "حِـي",
    "خَـا", "خُـو", "خِـي",
    "دَـا", "دُـو", "دِـي",
    "ذَـا", "ذُـو", "ذِـي",
    "رَـا", "رُـو", "رِـي",
    "زَـا", "زُـو", "زِـي",
    "سَـا", "سُـو", "سِـي",
    "شَـا", "شُـو", "شِـي",
    "صَـا", "صُـو", "صِـي",
    "ضَـا", "ضُـو", "ضِـي",
    "طَـا", "طُـو", "طِـي",
    "ظَـا", "ظُـو", "ظِـي",
    "عَـا", "عُـو", "عِـي",
    "غَـا", "غُـو", "غِـي",
  ];

  return (
    <div className="font-arabic min-h-screen" style={{ direction: "rtl" }}>
      <div className="w-full h-full bg-gray-900 overflow-hidden">
        {/* Header */}
        <div className="text-white p-6 text-center border-b-2 border-gray-700">
          <div className="text-3xl md:text-3xl font-bold">
            Leçon : les trois lettres de prolongation
          </div>
        </div>

        {/* Content */}
        <div className="p-8 bg-gray-900">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
              {words.map((word, index) => (
                <ProlongationCard
                  key={index}
                  word={word}
                  onClick={() => playLetterAudio(word)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-gray-700 text-white text-center p-6 flex-shrink-0 font-semibold text-sm">
          <div>Page 18</div>
          <div className="mt-1">© 2025 Tous droits réservés</div>
        </footer>
      </div>
    </div>
  );
};

// Carte pour afficher une combinaison prolongée
const ProlongationCard = ({
  word,
  onClick,
}: {
  word: string;
  onClick?: () => void;
}) => {
  const arabicLetters = [...word.replace(/[^\u0600-\u06FF]/g, "")];
  const lettreBase = arabicLetters[0];
  const isNoConnect = noConnect.includes(lettreBase);

  // Si la lettre ne connecte pas, on retire le tatweel (ـ)
  const displayWord = isNoConnect ? word.replace(/ـ/g, "") : word;

  return (
    <div
      className="bg-gray-800 border border-zinc-500 rounded-xl p-4 text-center hover:bg-gray-700 transition-all duration-300 group min-h-[90px] flex items-center justify-center cursor-pointer"
      onClick={onClick}
    >
      <div
        className="text-3xl md:text-4xl font-bold leading-relaxed text-white group-hover:scale-105 transition-transform duration-300 break-keep"
        dir="rtl"
        lang="ar"
        style={{ fontFeatureSettings: '"calt" 1, "liga" 1' }}
      >
        {displayWord}
      </div>
    </div>
  );
};

export default Page18;
