"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import PageNavigation from '@/app/components/PageNavigation';

// === 🎧 Mapping audio Chapitre 3, Page 15 ===
const chapter3Page15AudioMappings: { [key: string]: string } = {
  "أً": "chap3_pg12_case1", "أٌ": "chap3_pg12_case2", "إٍ": "chap3_pg12_case3",
  "بًا": "chap3_pg12_case4", "بٌ": "chap3_pg12_case5", "بٍ": "chap3_pg12_case6",
  "تًا": "chap3_pg12_case7", "تٌ": "chap3_pg12_case8", "تٍ": "chap3_pg12_case9",
  "ثًا": "chap3_pg12_case10", "ثٌ": "chap3_pg12_case11", "ثٍ": "chap3_pg12_case12",
  "جًا": "chap3_pg12_case13", "جٌ": "chap3_pg12_case14", "جٍ": "chap3_pg12_case15",
  "حًا": "chap3_pg12_case16", "حٌ": "chap3_pg12_case17", "حٍ": "chap3_pg12_case18",
  "خًا": "chap3_pg12_case19", "خٌ": "chap3_pg12_case20", "خٍ": "chap3_pg12_case21",
  "دًا": "chap3_pg12_case22", "دٌ": "chap3_pg12_case23", "دٍ": "chap3_pg12_case24",
  "ذًا": "chap3_pg12_case25", "ذٌ": "chap3_pg12_case26", "ذٍ": "chap3_pg12_case27",
  "رًا": "chap3_pg12_case28", "رٌ": "chap3_pg12_case29", "رٍ": "chap3_pg12_case30",
  "زًا": "chap3_pg12_case31", "زٌ": "chap3_pg12_case32", "زٍ": "chap3_pg12_case33",
  "سًا": "chap3_pg12_case34", "سٌ": "chap3_pg12_case35", "سٍ": "chap3_pg12_case36",
  "شًا": "chap3_pg12_case37", "شٌ": "chap3_pg12_case38", "شٍ": "chap3_pg12_case39",
  "صًا": "chap3_pg12_case40", "صٌ": "chap3_pg12_case41", "صٍ": "chap3_pg12_case42",
  "ضًا": "chap3_pg12_case43", "ضٌ": "chap3_pg12_case44", "ضٍ": "chap3_pg12_case45",
  "طًا": "chap3_pg12_case46", "طٌ": "chap3_pg12_case47", "طٍ": "chap3_pg12_case48",
  "ظًا": "chap3_pg12_case49", "ظٌ": "chap3_pg12_case50", "ظٍ": "chap3_pg12_case51",
  "عًا": "chap3_pg12_case52", "عٌ": "chap3_pg12_case53", "عٍ": "chap3_pg12_case54",
  "غًا": "chap3_pg12_case55", "غٌ": "chap3_pg12_case56", "غٍ": "chap3_pg12_case57",
  "فًا": "chap3_pg12_case58", "فٌ": "chap3_pg12_case59", "فٍ": "chap3_pg12_case60",
  "قًا": "chap3_pg12_case61", "قٌ": "chap3_pg12_case62", "قٍ": "chap3_pg12_case63",
  "كًا": "chap3_pg12_case64", "كٌ": "chap3_pg12_case65", "كٍ": "chap3_pg12_case66",
  "لًا": "chap3_pg12_case67", "لٌ": "chap3_pg12_case68", "لٍ": "chap3_pg12_case69",
  "مًا": "chap3_pg12_case70", "مٌ": "chap3_pg12_case71", "مٍ": "chap3_pg12_case72",
  "نًا": "chap3_pg12_case73", "نٌ": "chap3_pg12_case74", "نٍ": "chap3_pg12_case75",
  "هًا": "chap3_pg12_case76", "هٌ": "chap3_pg12_case77", "هٍ": "chap3_pg12_case78",
  "وً": "chap3_pg12_case79", "وٌ": "chap3_pg12_case80", "وٍ": "chap3_pg12_case81",
  "يًا": "chap3_pg12_case82", "يٌ": "chap3_pg12_case83", "يٍ": "chap3_pg12_case84",
  "ءً": "chap3_pg12_case1", "ءٌ": "chap3_pg12_case2", "ءٍ": "chap3_pg12_case3",
  "ـةً": "chap3_pg12_case7", "ـةٌ": "chap3_pg12_case8", "ـةٍ": "chap3_pg12_case9",
};

// === 🔠 Groupes de lettres ===
const emphaticLetters = ["خ", "ر", "ص", "ض", "ط", "ظ", "غ", "ق"];
const nonConnectingLetters = ["أ", "د", "ذ", "ر", "ز", "و", "ء"];

const letterGroups = [
  { letter: "أ", vowels: ["أً", "أٌ", "إٍ"] },
  { letter: "ب", vowels: ["بًا", "بٌ", "بٍ"] },
  { letter: "ت", vowels: ["تًا", "تٌ", "تٍ"] },
  { letter: "ث", vowels: ["ثًا", "ثٌ", "ثٍ"] },
  { letter: "ج", vowels: ["جًا", "جٌ", "جٍ"] },
  { letter: "ح", vowels: ["حًا", "حٌ", "حٍ"] },
  { letter: "خ", vowels: ["خًا", "خٌ", "خٍ"] },
  { letter: "د", vowels: ["دًا", "دٌ", "دٍ"] },
  { letter: "ذ", vowels: ["ذًا", "ذٌ", "ذٍ"] },
  { letter: "ر", vowels: ["رًا", "رٌ", "رٍ"] },
  { letter: "ز", vowels: ["زًا", "زٌ", "زٍ"] },
  { letter: "س", vowels: ["سًا", "سٌ", "سٍ"] },
  { letter: "ش", vowels: ["شًا", "شٌ", "شٍ"] },
  { letter: "ص", vowels: ["صًا", "صٌ", "صٍ"] },
  { letter: "ض", vowels: ["ضًا", "ضٌ", "ضٍ"] },
  { letter: "ط", vowels: ["طًا", "طٌ", "طٍ"] },
  { letter: "ظ", vowels: ["ظًا", "ظٌ", "ظٍ"] },
  { letter: "ع", vowels: ["عًا", "عٌ", "عٍ"] },
  { letter: "غ", vowels: ["غًا", "غٌ", "غٍ"] },
  { letter: "ف", vowels: ["فًا", "فٌ", "فٍ"] },
  { letter: "ق", vowels: ["قًا", "قٌ", "قٍ"] },
  { letter: "ك", vowels: ["كًا", "كٌ", "كٍ"] },
  { letter: "ل", vowels: ["لًا", "لٌ", "لٍ"] },
  { letter: "م", vowels: ["مًا", "مٌ", "مٍ"] },
  { letter: "ن", vowels: ["نًا", "نٌ", "نٍ"] },
  { letter: "ه", vowels: ["هًا", "هٌ", "هٍ"] },
  { letter: "و", vowels: ["وً", "وٌ", "وٍ"] },
  { letter: "ي", vowels: ["يًا", "يٌ", "يٍ"] },
  { letter: "ء", vowels: ["ءً", "ءٌ", "ءٍ"] },
  { letter: "ة", vowels: ["ـةً", "ـةٌ", "ـةٍ"], special: true },
];

const vowelNames = ["Fathatane (an)", "Dammatane (oun)", "Kasratane (in)"];

const playLetterAudio = (vowelLetter: string) => {
  const audioFileName = chapter3Page15AudioMappings[vowelLetter];
  if (audioFileName) {
    const audio = new Audio(`/audio/chapitre3/${audioFileName}.mp3`);
    audio.play().catch((err) => console.error("Erreur audio:", err));
  }
};

// === 📘 Introduction ===
const IntroductionPage = () => (
  <div className="p-4 md:p-8 bg-gray-900">
    <div className="w-full bg-gray-800 rounded-lg p-6 md:p-8">
      <div className="text-white space-y-6 text-lg md:text-xl leading-relaxed">
        <p>
          Nous voici à la position la plus importante et la plus utilisée du Tanwin :
          les voyelles doubles{" "}
          <span className="text-yellow-400 font-semibold">à la fin d'un mot</span> !
        </p>

        <p>
          ✨ <span className="font-semibold">C'est ici que vous verrez le Tanwin en pratique !</span>{" "}
          Le{" "}
          <span className="text-purple-400 font-semibold">Tanwin (تنوين)</span>{" "}
          apparaît presque toujours{" "}
          <span className="text-cyan-400 font-semibold">en position finale</span>{" "}
          dans les textes arabes.
        </p>

        <div className="bg-blue-900/30 border border-blue-500/50 rounded-lg p-4 md:p-6">
          <p>
            🎯 <span className="font-semibold">Règle spéciale du Fathatane ( ً ) :</span>
            <br />
            • Le Fathatane s'écrit avec un alif supplémentaire : <span className="text-yellow-400 text-3xl inline-block">ـًا</span>
            <br />
            • Exemple : <span className="text-yellow-400 text-3xl inline-block">بًا</span> = « ban »
            <br />
            • Les autres Tanwin (Damma et Kasra) restent simples : ٌ et ٍ
          </p>
        </div>

        <p>
          ⚠️ <span className="font-semibold">Note importante :</span> toutes les lettres
          portent le Tanwin en fin de mot, y compris celles qui ne se connectent pas :
          <br />
          <span className="text-red-400 text-2xl inline-block mr-2">أ د ذ ر ز و ء</span>
        </p>

        <p>
          ✨ <span className="font-semibold">Lettre spéciale - Ta marbouta (ة) :</span>
          <br />
          Le{" "}
          <span className="text-pink-400 font-bold text-2xl inline-block">ة</span>{" "}
          apparaît exclusivement en fin de mot et porte souvent le Tanwin.
          <br />
          Exemples : <span className="text-pink-400 text-2xl inline-block">ـةً ـةٌ ـةٍ</span>
        </p>

        <p>
          Exemples pratiques :
          <br />•{" "}
          <span className="text-yellow-400 text-3xl inline-block">كِتَابًا</span> = kitâban (un livre)
          <br />•{" "}
          <span className="text-yellow-400 text-3xl inline-block">رَجُلٌ</span> = rajuloun (un homme)
          <br />•{" "}
          <span className="text-yellow-400 text-3xl inline-block">بَيْتٍ</span> = baytin (d'une maison)
        </p>

        <p>
          💡 <span className="font-semibold">Usage grammatical :</span> le Tanwin
          indique généralement qu'un nom est indéfini (« un », « une », « des »)
          et marque les cas grammaticaux en arabe classique.
        </p>

        <p>
          Dans la page suivante, clique sur chaque combinaison pour écouter et
          répéter les sons correctement.
        </p>
      </div>
    </div>

    <footer className="border-t-1 text-white text-center p-4 md:p-6 mt-8 font-semibold text-base md:text-lg">
      <div>Leçon 15 : Lettres à la fin d'un mot avec Tanwin (usage réel)</div>
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

    
      <PageNavigation currentChapter={3} currentPage={15} className="mt-6 mb-4" />

<footer className="border-t-1 text-white text-center p-4 md:p-6 mt-8 font-semibold text-sm md:text-base">
      <div>Page 15</div>
      <div className="mt-1">© 2025 Tous droits réservés</div>
    </footer>
  </div>
);

// === 📖 Composant principal ===
const Page15 = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = 2;

  return (
    <div className="font-arabic min-h-screen bg-gray-900">
      <div className="text-white p-4 md:p-6 text-center border-b-2">
        <div className="text-2xl md:text-3xl font-bold mb-2">
          {currentPage === 0
            ? "Leçon 15 : Tanwin à la fin d'un mot (usage réel et fréquent)"
            : "Leçon 15 : Lettres à la fin d'un mot avec Tanwin (écoute et répète)"}
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

export default Page15;