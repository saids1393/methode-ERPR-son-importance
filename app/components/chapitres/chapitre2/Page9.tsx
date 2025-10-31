"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import PageNavigation from '@/app/components/PageNavigation';

// === 🎧 Mapping audio Chapitre 2, Page 9 ===
const chapter2Page9AudioMappings: { [key: string]: string } = {
  "أَ": "chap2_pg8_case1",
  "أُ": "chap2_pg8_case2",
  "إِ": "chap2_pg8_case3",
  "بَـ": "chap2_pg8_case4",
  "بُـ": "chap2_pg8_case5",
  "بِـ": "chap2_pg8_case6",
  "تَـ": "chap2_pg8_case7",
  "تُـ": "chap2_pg8_case8",
  "تِـ": "chap2_pg8_case9",
  "ثَـ": "chap2_pg8_case10",
  "ثُـ": "chap2_pg8_case11",
  "ثِـ": "chap2_pg8_case12",
  "جَـ": "chap2_pg8_case13",
  "جُـ": "chap2_pg8_case14",
  "جِـ": "chap2_pg8_case15",
  "حَـ": "chap2_pg8_case16",
  "حُـ": "chap2_pg8_case17",
  "حِـ": "chap2_pg8_case18",
  "خَـ": "chap2_pg8_case19",
  "خُـ": "chap2_pg8_case20",
  "خِـ": "chap2_pg8_case21",
  "دَ": "chap2_pg8_case22",
  "دُ": "chap2_pg8_case23",
  "دِ": "chap2_pg8_case24",
  "ذَ": "chap2_pg8_case25",
  "ذُ": "chap2_pg8_case26",
  "ذِ": "chap2_pg8_case27",
  "رَ": "chap2_pg8_case28",
  "رُ": "chap2_pg8_case29",
  "رِ": "chap2_pg8_case30",
  "زَ": "chap2_pg8_case31",
  "زُ": "chap2_pg8_case32",
  "زِ": "chap2_pg8_case33",
  "سَـ": "chap2_pg8_case34",
  "سُـ": "chap2_pg8_case35",
  "سِـ": "chap2_pg8_case36",
  "شَـ": "chap2_pg8_case37",
  "شُـ": "chap2_pg8_case38",
  "شِـ": "chap2_pg8_case39",
  "صَـ": "chap2_pg8_case40",
  "صُـ": "chap2_pg8_case41",
  "صِـ": "chap2_pg8_case42",
  "ضَـ": "chap2_pg8_case43",
  "ضُـ": "chap2_pg8_case44",
  "ضِـ": "chap2_pg8_case45",
  "طَـ": "chap2_pg8_case46",
  "طُـ": "chap2_pg8_case47",
  "طِـ": "chap2_pg8_case48",
  "ظَـ": "chap2_pg8_case49",
  "ظُـ": "chap2_pg8_case50",
  "ظِـ": "chap2_pg8_case51",
  "عَـ": "chap2_pg8_case52",
  "عُـ": "chap2_pg8_case53",
  "عِـ": "chap2_pg8_case54",
  "غَـ": "chap2_pg8_case55",
  "غُـ": "chap2_pg8_case56",
  "غِـ": "chap2_pg8_case57",
  "فَـ": "chap2_pg8_case58",
  "فُـ": "chap2_pg8_case59",
  "فِـ": "chap2_pg8_case60",
  "قَـ": "chap2_pg8_case61",
  "قُـ": "chap2_pg8_case62",
  "قِـ": "chap2_pg8_case63",
  "كَـ": "chap2_pg8_case64",
  "كُـ": "chap2_pg8_case65",
  "كِـ": "chap2_pg8_case66",
  "لَـ": "chap2_pg8_case67",
  "لُـ": "chap2_pg8_case68",
  "لِـ": "chap2_pg8_case69",
  "مَـ": "chap2_pg8_case70",
  "مُـ": "chap2_pg8_case71",
  "مِـ": "chap2_pg8_case72",
  "نَـ": "chap2_pg8_case73",
  "نُـ": "chap2_pg8_case74",
  "نِـ": "chap2_pg8_case75",
  "هَـ": "chap2_pg8_case76",
  "هُـ": "chap2_pg8_case77",
  "هِـ": "chap2_pg8_case78",
  "وَ": "chap2_pg8_case79",
  "وُ": "wou-chap2",
  "وِ": "wi-chap2",
  "يَـ": "ya-chap2",
  "يُـ": "you-chap2",
  "يِـ": "yi-chap2",
};

// === 🔠 Groupes de lettres ===
const emphaticLetters = ["خ", "ر", "ص", "ض", "ط", "ظ", "غ", "ق"];
const nonConnectingLetters = ["أ", "د", "ذ", "ر", "ز", "و"];

const letterGroups = [
  { letter: "أ", vowels: ["أَ", "أُ", "إِ"] },
  { letter: "ب", vowels: ["بَـ", "بُـ", "بِـ"] },
  { letter: "ت", vowels: ["تَـ", "تُـ", "تِـ"] },
  { letter: "ث", vowels: ["ثَـ", "ثُـ", "ثِـ"] },
  { letter: "ج", vowels: ["جَـ", "جُـ", "جِـ"] },
  { letter: "ح", vowels: ["حَـ", "حُـ", "حِـ"] },
  { letter: "خ", vowels: ["خَـ", "خُـ", "خِـ"] },
  { letter: "د", vowels: ["دَ", "دُ", "دِ"] },
  { letter: "ذ", vowels: ["ذَ", "ذُ", "ذِ"] },
  { letter: "ر", vowels: ["رَ", "رُ", "رِ"] },
  { letter: "ز", vowels: ["زَ", "زُ", "زِ"] },
  { letter: "س", vowels: ["سَـ", "سُـ", "سِـ"] },
  { letter: "ش", vowels: ["شَـ", "شُـ", "شِـ"] },
  { letter: "ص", vowels: ["صَـ", "صُـ", "صِـ"] },
  { letter: "ض", vowels: ["ضَـ", "ضُـ", "ضِـ"] },
  { letter: "ط", vowels: ["طَـ", "طُـ", "طِـ"] },
  { letter: "ظ", vowels: ["ظَـ", "ظُـ", "ظِـ"] },
  { letter: "ع", vowels: ["عَـ", "عُـ", "عِـ"] },
  { letter: "غ", vowels: ["غَـ", "غُـ", "غِـ"] },
  { letter: "ف", vowels: ["فَـ", "فُـ", "فِـ"] },
  { letter: "ق", vowels: ["قَـ", "قُـ", "قِـ"] },
  { letter: "ك", vowels: ["كَـ", "كُـ", "كِـ"] },
  { letter: "ل", vowels: ["لَـ", "لُـ", "لِـ"] },
  { letter: "م", vowels: ["مَـ", "مُـ", "مِـ"] },
  { letter: "ن", vowels: ["نَـ", "نُـ", "نِـ"] },
  { letter: "ه", vowels: ["هَـ", "هُـ", "هِـ"] },
  { letter: "و", vowels: ["وَ", "وُ", "وِ"] },
  { letter: "ي", vowels: ["يَـ", "يُـ", "يِـ"] },
];

const vowelNames = ["Fatha (a)", "Damma (ou)", "Kasra (i)"];

const playLetterAudio = (vowelLetter: string) => {
  const audioFileName = chapter2Page9AudioMappings[vowelLetter];
  if (audioFileName) {
    const audio = new Audio(`/audio/chapitre2/${audioFileName}.mp3`);
    audio.play().catch((err) => console.error("Erreur audio:", err));
  }
};

// === 📘 Introduction ===
const IntroductionPage = () => (
  <div className="p-4 md:p-8 bg-gray-900">
    <div className="w-full bg-gray-800 rounded-lg p-6 md:p-8">
      <div className="text-white space-y-6 text-lg md:text-xl leading-relaxed">
        <p>
          Maintenant que vous avez appris les lettres avec leurs voyelles courtes,
          découvrons comment ces lettres s'écrivent lorsqu'elles sont{" "}
          <span className="text-yellow-400 font-semibold">attachées au début d'un mot</span>.
        </p>

        <p>
          En arabe, la plupart des lettres changent de forme selon leur position
          dans le mot. Quand une lettre se trouve{" "}
          <span className="text-purple-400 font-semibold">
            au début d'un mot et s'attache à la lettre suivante
          </span>
          , elle prend une forme initiale spéciale.
        </p>

        <div className="bg-blue-900/30 border border-blue-500/50 rounded-lg p-4 md:p-6">
          <p>
            🔗 <span className="font-semibold">Les lettres connectées :</span>
            <br />
            • La plupart des lettres arabes se connectent à la lettre qui suit
            <br />
            • Elles portent un petit trait de liaison ( ـ ) à droite
            <br />
            • Les voyelles brèves restent les mêmes : Fatha, Damma et Kasra
          </p>
        </div>

        <p>
          ⚠️ <span className="font-semibold">Exception importante :</span> certaines
          lettres ne se connectent jamais à la lettre qui suit :
          <br />
          <span className="text-red-400 text-2xl inline-block mr-2">أ د ذ ر ز و</span>
          <br />
          Ces lettres gardent toujours leur forme isolée.
        </p>

        <p>
          Exemple avec la lettre <span className="text-yellow-400 text-3xl inline-block">ب</span> :
          <br />•{" "}
          <span className="text-yellow-400 text-3xl inline-block">بَـ</span> = «
          ba » (début de mot) •{" "}
          <span className="text-yellow-400 text-3xl inline-block">بُـ</span> = «
          bou » (début de mot) •{" "}
          <span className="text-yellow-400 text-3xl inline-block">بِـ</span> = «
          bi » (début de mot)
        </p>

        <p>
          🎯 <span className="font-semibold">Remarque :</span> le petit trait ( ـ )
          indique que la lettre s'attache à celle qui suit.
        </p>

        <p>
          Dans la page suivante, clique sur chaque combinaison pour écouter et
          répéter les sons correctement.
        </p>
      </div>
    </div>

    <footer className="border-t-1 text-white text-center p-4 md:p-6 mt-8 font-semibold text-base md:text-lg">
      <div>Leçon 9 : Lettres attachées au début d'un mot avec voyelles</div>
      <div className="mt-1">© 2025 Tous droits réservés</div>
    </footer>
  </div>
);

// === 🧱 Tableau des lettres + voyelles ===
const LetterGroup = ({
  letter,
  vowels,
  emphatic,
  nonConnecting,
  onClick,
}: {
  letter: string;
  vowels: string[];
  emphatic?: boolean;
  nonConnecting?: boolean;
  onClick?: (v: string) => void;
}) => (
  <div className="bg-gray-800 border border-zinc-500 rounded-xl p-4" dir="rtl">
    <div className="text-center font-bold text-5xl md:text-5xl lg:text-5xl xl:text-6xl text-white mb-4">
      {letter}
    </div>
    <div className="grid grid-cols-3 gap-3">
      {vowels.map((v, i) => (
        <div
          key={i}
          className="border border-zinc-500 rounded-xl p-2 md:p-3 lg:p-4 text-center min-h-[90px] md:min-h-[100px] lg:min-h-[110px] flex flex-col justify-center items-center hover:bg-zinc-700 transition-all duration-300 hover:scale-105 cursor-pointer mx-1"
          onClick={() => onClick?.(v)}
        >
          <div
            className={`text-5xl md:text-5xl lg:text-5xl xl:text-6xl font-bold transition-colors leading-tight ${
              emphatic ? "text-red-400" : "text-white"
            }`}
          >
            {v}
          </div>
          <div
            className={`text-xs font-semibold px-2 py-1 mt-2 rounded ${
              i === 0
                ? "text-orange-400 bg-orange-900/30"
                : i === 1
                ? "text-blue-400 bg-blue-900/30"
                : "text-green-400 bg-green-900/30"
            }`}
          >
            {vowelNames[i]}
          </div>
          {nonConnecting && i === 0 && (
            <div className="text-xs text-purple-400 bg-purple-900/30 px-2 py-1 rounded mt-2">
              لا تتصل
            </div>
          )}
        </div>
      ))}
    </div>
  </div>
);

const AlphabetPage = () => (
  <div className="p-4 md:p-8 bg-gray-900">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6" dir="rtl">
      {letterGroups.map((group, idx) => (
        <LetterGroup
          key={idx}
          letter={group.letter}
          vowels={group.vowels}
          emphatic={emphaticLetters.includes(group.letter)}
          nonConnecting={nonConnectingLetters.includes(group.letter)}
          onClick={playLetterAudio}
        />
      ))}
    </div>

    
      <PageNavigation currentChapter={2} currentPage={9} className="mt-6 mb-4" />

<footer className="border-t-1 text-white text-center p-4 md:p-6 mt-8 font-semibold text-sm md:text-base">
      <div>Page 9</div>
      <div className="mt-1">© 2025 Tous droits réservés</div>
    </footer>
  </div>
);

// === 📖 Composant principal ===
const Page9 = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = 2;

  return (
    <div className="font-arabic min-h-screen bg-gray-900">
      <div className="text-white p-4 md:p-6 text-center border-b-2">
        <div className="text-2xl md:text-3xl font-bold mb-2">
          {currentPage === 0
            ? "Leçon 9 : Les lettres attachées au début d'un mot"
            : "Leçon 9 : Lettres attachées au début d'un mot avec voyelles (écoute et répète)"}
        </div>
        {currentPage === 1 && (
          <div className="text-md md:text-lg text-amber-300">
            Cliquez sur chaque combinaison pour écouter et répéter.
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center px-4 py-4">
        <button
          onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
          disabled={currentPage === 0}
          className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all ${
            currentPage === 0
              ? "border-gray-600 text-gray-600 cursor-not-allowed"
              : "border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white hover:scale-110"
          }`}
        >
          <ChevronLeft size={18} />
        </button>

        <div className="text-white font-semibold text-sm md:text-base">
          Page {currentPage + 1} / {totalPages}
        </div>

        <button
          onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
          disabled={currentPage === totalPages - 1}
          className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all ${
            currentPage === totalPages - 1
              ? "border-gray-600 text-gray-600 cursor-not-allowed"
              : "border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white hover:scale-110"
          }`}
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {currentPage === 0 ? <IntroductionPage /> : <AlphabetPage />}
    </div>
  );
};

export default Page9;