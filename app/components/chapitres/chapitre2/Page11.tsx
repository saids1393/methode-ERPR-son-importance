"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import PageNavigation from '@/app/components/PageNavigation';

// === 🎧 Mapping audio Chapitre 2, Page 11 ===
const chapter2Page11AudioMappings: { [key: string]: string } = {
  "ـأَ": "chap2_pg8_case1",
  "ـأُ": "chap2_pg8_case2",
  "ـإِ": "chap2_pg8_case3",
  "ـبَ": "chap2_pg8_case4",
  "ـبُ": "chap2_pg8_case5",
  "ـبِ": "chap2_pg8_case6",
  "ـتَ": "chap2_pg8_case7",
  "ـتُ": "chap2_pg8_case8",
  "ـتِ": "chap2_pg8_case9",
  "ـثَ": "chap2_pg8_case10",
  "ـثُ": "chap2_pg8_case11",
  "ـثِ": "chap2_pg8_case12",
  "ـجَ": "chap2_pg8_case13",
  "ـجُ": "chap2_pg8_case14",
  "ـجِ": "chap2_pg8_case15",
  "ـحَ": "chap2_pg8_case16",
  "ـحُ": "chap2_pg8_case17",
  "ـحِ": "chap2_pg8_case18",
  "ـخَ": "chap2_pg8_case19",
  "ـخُ": "chap2_pg8_case20",
  "ـخِ": "chap2_pg8_case21",
  "ـدَ": "chap2_pg8_case22",
  "ـدُ": "chap2_pg8_case23",
  "ـدِ": "chap2_pg8_case24",
  "ـذَ": "chap2_pg8_case25",
  "ـذُ": "chap2_pg8_case26",
  "ـذِ": "chap2_pg8_case27",
  "ـرَ": "chap2_pg8_case28",
  "ـرُ": "chap2_pg8_case29",
  "ـرِ": "chap2_pg8_case30",
  "ـزَ": "chap2_pg8_case31",
  "ـزُ": "chap2_pg8_case32",
  "ـزِ": "chap2_pg8_case33",
  "ـسَ": "chap2_pg8_case34",
  "ـسُ": "chap2_pg8_case35",
  "ـسِ": "chap2_pg8_case36",
  "ـشَ": "chap2_pg8_case37",
  "ـشُ": "chap2_pg8_case38",
  "ـشِ": "chap2_pg8_case39",
  "ـصَ": "chap2_pg8_case40",
  "ـصُ": "chap2_pg8_case41",
  "ـصِ": "chap2_pg8_case42",
  "ـضَ": "chap2_pg8_case43",
  "ـضُ": "chap2_pg8_case44",
  "ـضِ": "chap2_pg8_case45",
  "ـطَ": "chap2_pg8_case46",
  "ـطُ": "chap2_pg8_case47",
  "ـطِ": "chap2_pg8_case48",
  "ـظَ": "chap2_pg8_case49",
  "ـظُ": "chap2_pg8_case50",
  "ـظِ": "chap2_pg8_case51",
  "ـعَ": "chap2_pg8_case52",
  "ـعُ": "chap2_pg8_case53",
  "ـعِ": "chap2_pg8_case54",
  "ـغَ": "chap2_pg8_case55",
  "ـغُ": "chap2_pg8_case56",
  "ـغِ": "chap2_pg8_case57",
  "ـفَ": "chap2_pg8_case58",
  "ـفُ": "chap2_pg8_case59",
  "ـفِ": "chap2_pg8_case60",
  "ـقَ": "chap2_pg8_case61",
  "ـقُ": "chap2_pg8_case62",
  "ـقِ": "chap2_pg8_case63",
  "ـكَ": "chap2_pg8_case64",
  "ـكُ": "chap2_pg8_case65",
  "ـكِ": "chap2_pg8_case66",
  "ـلَ": "chap2_pg8_case67",
  "ـلُ": "chap2_pg8_case68",
  "ـلِ": "chap2_pg8_case69",
  "ـمَ": "chap2_pg8_case70",
  "ـمُ": "chap2_pg8_case71",
  "ـمِ": "chap2_pg8_case72",
  "ـنَ": "chap2_pg8_case73",
  "ـنُ": "chap2_pg8_case74",
  "ـنِ": "chap2_pg8_case75",
  "ـهَ": "chap2_pg8_case76",
  "ـهُ": "chap2_pg8_case77",
  "ـهِ": "chap2_pg8_case78",
  "ـوَ": "chap2_pg8_case79",
  "ـوُ": "wou-chap2",
  "ـوِ": "wi-chap2",
  "ـيَ": "ya-chap2",
  "ـيُ": "you-chap2",
  "ـيِ": "yi-chap2",
  "ءَ": "chap2_pg8_case1",
  "ءُ": "chap2_pg8_case2",
  "ءِ": "chap2_pg8_case3",
  "ـةَ": "chap2_pg8_case7",
  "ـةُ": "chap2_pg8_case8",
  "ـةِ": "chap2_pg8_case9",
};

// === 🔠 Groupes de lettres ===
const emphaticLetters = ["خ", "ر", "ص", "ض", "ط", "ظ", "غ", "ق"];
const nonConnectingLetters = ["أ", "د", "ذ", "ر", "ز", "و", "ء"];

const letterGroups = [
  { letter: "أ", vowels: ["ـأَ", "ـأُ", "ـإِ"] },
  { letter: "ب", vowels: ["ـبَ", "ـبُ", "ـبِ"] },
  { letter: "ت", vowels: ["ـتَ", "ـتُ", "ـتِ"] },
  { letter: "ث", vowels: ["ـثَ", "ـثُ", "ـثِ"] },
  { letter: "ج", vowels: ["ـجَ", "ـجُ", "ـجِ"] },
  { letter: "ح", vowels: ["ـحَ", "ـحُ", "ـحِ"] },
  { letter: "خ", vowels: ["ـخَ", "ـخُ", "ـخِ"] },
  { letter: "د", vowels: ["ـدَ", "ـدُ", "ـدِ"] },
  { letter: "ذ", vowels: ["ـذَ", "ـذُ", "ـذِ"] },
  { letter: "ر", vowels: ["ـرَ", "ـرُ", "ـرِ"] },
  { letter: "ز", vowels: ["ـزَ", "ـزُ", "ـزِ"] },
  { letter: "س", vowels: ["ـسَ", "ـسُ", "ـسِ"] },
  { letter: "ش", vowels: ["ـشَ", "ـشُ", "ـشِ"] },
  { letter: "ص", vowels: ["ـصَ", "ـصُ", "ـصِ"] },
  { letter: "ض", vowels: ["ـضَ", "ـضُ", "ـضِ"] },
  { letter: "ط", vowels: ["ـطَ", "ـطُ", "ـطِ"] },
  { letter: "ظ", vowels: ["ـظَ", "ـظُ", "ـظِ"] },
  { letter: "ع", vowels: ["ـعَ", "ـعُ", "ـعِ"] },
  { letter: "غ", vowels: ["ـغَ", "ـغُ", "ـغِ"] },
  { letter: "ف", vowels: ["ـفَ", "ـفُ", "ـفِ"] },
  { letter: "ق", vowels: ["ـقَ", "ـقُ", "ـقِ"] },
  { letter: "ك", vowels: ["ـكَ", "ـكُ", "ـكِ"] },
  { letter: "ل", vowels: ["ـلَ", "ـلُ", "ـلِ"] },
  { letter: "م", vowels: ["ـمَ", "ـمُ", "ـمِ"] },
  { letter: "ن", vowels: ["ـنَ", "ـنُ", "ـنِ"] },
  { letter: "ه", vowels: ["ـهَ", "ـهُ", "ـهِ"] },
  { letter: "و", vowels: ["ـوَ", "ـوُ", "ـوِ"] },
  { letter: "ي", vowels: ["ـيَ", "ـيُ", "ـيِ"] },
  { letter: "ء", vowels: ["ءَ", "ءُ", "ءِ"] },
  { letter: "ة", vowels: ["ـةَ", "ـةُ", "ـةِ"], special: true },
];

const vowelNames = ["Fatha (a)", "Damma (ou)", "Kasra (i)"];

const playLetterAudio = (vowelLetter: string) => {
  const audioFileName = chapter2Page11AudioMappings[vowelLetter];
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
          Après avoir appris les formes initiales et médianes, découvrons maintenant
          comment les lettres s'écrivent lorsqu'elles sont{" "}
          <span className="text-yellow-400 font-semibold">à la fin d'un mot</span>.
        </p>

        <p>
          Lorsqu'une lettre se trouve{" "}
          <span className="text-purple-400 font-semibold">
            à la fin d'un mot
          </span>
          , elle se connecte uniquement à la lettre précédente. C'est ce qu'on appelle la{" "}
          <span className="text-cyan-400 font-semibold">forme finale</span>.
        </p>

        <div className="bg-blue-900/30 border border-blue-500/50 rounded-lg p-4 md:p-6">
          <p>
            🔗 <span className="font-semibold">Les lettres finales :</span>
            <br />
            • La lettre porte un trait de liaison à gauche ( ـ ) uniquement
            <br />
            • Exemple : <span className="text-yellow-400 text-3xl inline-block">ـبَ</span> se connecte seulement à gauche
            <br />
            • Les voyelles brèves restent les mêmes : Fatha, Damma et Kasra
          </p>
        </div>

        <p>
          ⚠️ <span className="font-semibold">Note importante :</span> toutes les lettres
          ont une forme finale qui se connecte à gauche, même celles qui ne se connectent
          pas à droite :
          <br />
          <span className="text-red-400 text-2xl inline-block mr-2">أ د ذ ر ز و ء</span>
          <br />
          Ces lettres portent aussi le trait de liaison à gauche ( ـ ) en position finale.
        </p>

        <p>
          ✨ <span className="font-semibold">Lettre spéciale :</span> le{" "}
          <span className="text-pink-400 font-bold text-2xl inline-block">ة</span> (Ta marbouta)
          est une lettre qui n'apparaît qu'à la fin des mots, souvent dans les noms féminins.
        </p>

        <p>
          Exemple avec la lettre <span className="text-yellow-400 text-3xl inline-block">ب</span> :
          <br />•{" "}
          <span className="text-yellow-400 text-3xl inline-block">ـبَ</span> = «
          ba » (fin de mot) •{" "}
          <span className="text-yellow-400 text-3xl inline-block">ـبُ</span> = «
          bou » (fin de mot) •{" "}
          <span className="text-yellow-400 text-3xl inline-block">ـبِ</span> = «
          bi » (fin de mot)
        </p>

        <p>
          🎯 <span className="font-semibold">Remarque :</span> le trait de liaison à gauche ( ـ )
          indique que la lettre termine le mot et se connecte à ce qui précède.
        </p>

        <p>
          Dans la page suivante, clique sur chaque combinaison pour écouter et
          répéter les sons correctement.
        </p>
      </div>
    </div>

    <footer className="border-t-1 text-white text-center p-4 md:p-6 mt-8 font-semibold text-base md:text-lg">
      <div>Leçon 11 : Lettres attachées à la fin d'un mot avec voyelles</div>
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
  special,
  onClick,
}: {
  letter: string;
  vowels: string[];
  emphatic?: boolean;
  nonConnecting?: boolean;
  special?: boolean;
  onClick?: (v: string) => void;
}) => (
  <div className="bg-gray-800 border border-zinc-500 rounded-xl p-4" dir="rtl">
    <div className="text-center font-bold text-5xl md:text-5xl lg:text-5xl xl:text-6xl text-white mb-4">
      {letter}
      {special && (
        <div className="text-xs text-pink-400 bg-pink-900/30 px-2 py-1 rounded mt-2 inline-block">
          Ta marbouta
        </div>
      )}
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
              emphatic ? "text-red-400" : special ? "text-pink-400" : "text-white"
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
          special={group.special}
          onClick={playLetterAudio}
        />
      ))}
    </div>

    
      <PageNavigation currentChapter={2} currentPage={11} module="LECTURE" className="mt-6 mb-4" />

<footer className="border-t-1 text-white text-center p-4 md:p-6 mt-8 font-semibold text-sm md:text-base">
      <div>Page 11</div>
      <div className="mt-1">© 2025 Tous droits réservés</div>
    </footer>
  </div>
);

// === 📖 Composant principal ===
const Page11 = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = 2;

  return (
    <div className="font-arabic min-h-screen bg-gray-900">
      <div className="text-white p-4 md:p-6 text-center border-b-2">
        <div className="text-2xl md:text-3xl font-bold mb-2">
          {currentPage === 0
            ? "Leçon 11 : Les lettres attachées à la fin d'un mot"
            : "Leçon 11 : Lettres attachées à la fin d'un mot avec voyelles (écoute et répète)"}
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

export default Page11;