"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import PageNavigation from '@/app/components/PageNavigation';

// === 🎧 Mapping audio Chapitre 3, Page 14 ===
const chapter3Page14AudioMappings: { [key: string]: string } = {
  "ـأً": "chap3_pg12_case1", "ـأٌ": "chap3_pg12_case2", "ـإٍ": "chap3_pg12_case3",
  "ـبًـ": "chap3_pg12_case4", "ـبٌـ": "chap3_pg12_case5", "ـبٍـ": "chap3_pg12_case6",
  "ـتًـ": "chap3_pg12_case7", "ـتٌـ": "chap3_pg12_case8", "ـتٍـ": "chap3_pg12_case9",
  "ـثًـ": "chap3_pg12_case10", "ـثٌـ": "chap3_pg12_case11", "ـثٍـ": "chap3_pg12_case12",
  "ـجًـ": "chap3_pg12_case13", "ـجٌـ": "chap3_pg12_case14", "ـجٍـ": "chap3_pg12_case15",
  "ـحًـ": "chap3_pg12_case16", "ـحٌـ": "chap3_pg12_case17", "ـحٍـ": "chap3_pg12_case18",
  "ـخًـ": "chap3_pg12_case19", "ـخٌـ": "chap3_pg12_case20", "ـخٍـ": "chap3_pg12_case21",
  "ـدً": "chap3_pg12_case22", "ـدٌ": "chap3_pg12_case23", "ـدٍ": "chap3_pg12_case24",
  "ـذً": "chap3_pg12_case25", "ـذٌ": "chap3_pg12_case26", "ـذٍ": "chap3_pg12_case27",
  "ـرً": "chap3_pg12_case28", "ـرٌ": "chap3_pg12_case29", "ـرٍ": "chap3_pg12_case30",
  "ـزً": "chap3_pg12_case31", "ـزٌ": "chap3_pg12_case32", "ـزٍ": "chap3_pg12_case33",
  "ـسًـ": "chap3_pg12_case34", "ـسٌـ": "chap3_pg12_case35", "ـسٍـ": "chap3_pg12_case36",
  "ـشًـ": "chap3_pg12_case37", "ـشٌـ": "chap3_pg12_case38", "ـشٍـ": "chap3_pg12_case39",
  "ـصًـ": "chap3_pg12_case40", "ـصٌـ": "chap3_pg12_case41", "ـصٍـ": "chap3_pg12_case42",
  "ـضًـ": "chap3_pg12_case43", "ـضٌـ": "chap3_pg12_case44", "ـضٍـ": "chap3_pg12_case45",
  "ـطًـ": "chap3_pg12_case46", "ـطٌـ": "chap3_pg12_case47", "ـطٍـ": "chap3_pg12_case48",
  "ـظًـ": "chap3_pg12_case49", "ـظٌـ": "chap3_pg12_case50", "ـظٍـ": "chap3_pg12_case51",
  "ـعًـ": "chap3_pg12_case52", "ـعٌـ": "chap3_pg12_case53", "ـعٍـ": "chap3_pg12_case54",
  "ـغًـ": "chap3_pg12_case55", "ـغٌـ": "chap3_pg12_case56", "ـغٍـ": "chap3_pg12_case57",
  "ـفًـ": "chap3_pg12_case58", "ـفٌـ": "chap3_pg12_case59", "ـفٍـ": "chap3_pg12_case60",
  "ـقًـ": "chap3_pg12_case61", "ـقٌـ": "chap3_pg12_case62", "ـقٍـ": "chap3_pg12_case63",
  "ـكًـ": "chap3_pg12_case64", "ـكٌـ": "chap3_pg12_case65", "ـكٍـ": "chap3_pg12_case66",
  "ـلًـ": "chap3_pg12_case67", "ـلٌـ": "chap3_pg12_case68", "ـلٍـ": "chap3_pg12_case69",
  "ـمًـ": "chap3_pg12_case70", "ـمٌـ": "chap3_pg12_case71", "ـمٍـ": "chap3_pg12_case72",
  "ـنًـ": "chap3_pg12_case73", "ـنٌـ": "chap3_pg12_case74", "ـنٍـ": "chap3_pg12_case75",
  "ـهًـ": "chap3_pg12_case76", "ـهٌـ": "chap3_pg12_case77", "ـهٍـ": "chap3_pg12_case78",
  "ـوً": "chap3_pg12_case79", "ـوٌ": "chap3_pg12_case80", "ـوٍ": "chap3_pg12_case81",
  "ـيًـ": "chap3_pg12_case82", "ـيٌـ": "chap3_pg12_case83", "ـيٍـ": "chap3_pg12_case84",
};

// === 🔠 Groupes de lettres ===
const emphaticLetters = ["خ", "ر", "ص", "ض", "ط", "ظ", "غ", "ق"];
const nonConnectingLetters = ["أ", "د", "ذ", "ر", "ز", "و"];

const letterGroups = [
  { letter: "أ", vowels: ["ـأً", "ـأٌ", "ـإٍ"] },
  { letter: "ب", vowels: ["ـبًـ", "ـبٌـ", "ـبٍـ"] },
  { letter: "ت", vowels: ["ـتًـ", "ـتٌـ", "ـتٍـ"] },
  { letter: "ث", vowels: ["ـثًـ", "ـثٌـ", "ـثٍـ"] },
  { letter: "ج", vowels: ["ـجًـ", "ـجٌـ", "ـجٍـ"] },
  { letter: "ح", vowels: ["ـحًـ", "ـحٌـ", "ـحٍـ"] },
  { letter: "خ", vowels: ["ـخًـ", "ـخٌـ", "ـخٍـ"] },
  { letter: "د", vowels: ["ـدً", "ـدٌ", "ـدٍ"] },
  { letter: "ذ", vowels: ["ـذً", "ـذٌ", "ـذٍ"] },
  { letter: "ر", vowels: ["ـرً", "ـرٌ", "ـرٍ"] },
  { letter: "ز", vowels: ["ـزً", "ـزٌ", "ـزٍ"] },
  { letter: "س", vowels: ["ـسًـ", "ـسٌـ", "ـسٍـ"] },
  { letter: "ش", vowels: ["ـشًـ", "ـشٌـ", "ـشٍـ"] },
  { letter: "ص", vowels: ["ـصًـ", "ـصٌـ", "ـصٍـ"] },
  { letter: "ض", vowels: ["ـضًـ", "ـضٌـ", "ـضٍـ"] },
  { letter: "ط", vowels: ["ـطًـ", "ـطٌـ", "ـطٍـ"] },
  { letter: "ظ", vowels: ["ـظًـ", "ـظٌـ", "ـظٍـ"] },
  { letter: "ع", vowels: ["ـعًـ", "ـعٌـ", "ـعٍـ"] },
  { letter: "غ", vowels: ["ـغًـ", "ـغٌـ", "ـغٍـ"] },
  { letter: "ف", vowels: ["ـفًـ", "ـفٌـ", "ـفٍـ"] },
  { letter: "ق", vowels: ["ـقًـ", "ـقٌـ", "ـقٍـ"] },
  { letter: "ك", vowels: ["ـكًـ", "ـكٌـ", "ـكٍـ"] },
  { letter: "ل", vowels: ["ـلًـ", "ـلٌـ", "ـلٍـ"] },
  { letter: "م", vowels: ["ـمًـ", "ـمٌـ", "ـمٍـ"] },
  { letter: "ن", vowels: ["ـنًـ", "ـنٌـ", "ـنٍـ"] },
  { letter: "ه", vowels: ["ـهًـ", "ـهٌـ", "ـهٍـ"] },
  { letter: "و", vowels: ["ـوً", "ـوٌ", "ـوٍ"] },
  { letter: "ي", vowels: ["ـيًـ", "ـيٌـ", "ـيٍـ"] },
];

const vowelNames = ["Fathatane (an)", "Dammatane (oun)", "Kasratane (in)"];

const playLetterAudio = (vowelLetter: string) => {
  const audioFileName = chapter3Page14AudioMappings[vowelLetter];
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
          Continuons notre apprentissage du Tanwin en voyant comment ces voyelles
          doubles s'écrivent lorsque les lettres sont{" "}
          <span className="text-yellow-400 font-semibold">au milieu d'un mot</span>.
        </p>

        <p>
          ⚠️ <span className="font-semibold">Rappel important :</span> Le{" "}
          <span className="text-purple-400 font-semibold">Tanwin (تنوين)</span>{" "}
          apparaît presque exclusivement{" "}
          <span className="text-cyan-400 font-semibold">à la fin des mots</span>{" "}
          en arabe classique. Cette leçon est à titre pédagogique.
        </p>

        <div className="bg-blue-900/30 border border-blue-500/50 rounded-lg p-4 md:p-6">
          <p>
            🔗 <span className="font-semibold">Lettres avec Tanwin au milieu :</span>
            <br />
            • La lettre porte le Tanwin ET deux traits de liaison ( ـ...ـ )
            <br />
            • Exemple : <span className="text-yellow-400 text-3xl inline-block">ـبًـ</span> = « ban » (milieu théorique)
            <br />
            • La lettre se connecte des deux côtés
          </p>
        </div>

        <p>
          ⚠️ <span className="font-semibold">Exception importante :</span> les lettres
          qui ne se connectent jamais à droite gardent leur forme finale même au milieu :
          <br />
          <span className="text-red-400 text-2xl inline-block mr-2">أ د ذ ر ز و</span>
          <br />
          Ces lettres portent seulement le trait de liaison à gauche ( ـ ).
        </p>

        <p>
          Exemple avec la lettre <span className="text-yellow-400 text-3xl inline-block">ب</span> :
          <br />•{" "}
          <span className="text-yellow-400 text-3xl inline-block">ـبًـ</span> = «
          ban » (milieu théorique) •{" "}
          <span className="text-yellow-400 text-3xl inline-block">ـبٌـ</span> = «
          boun » (milieu théorique) •{" "}
          <span className="text-yellow-400 text-3xl inline-block">ـبٍـ</span> = «
          bin » (milieu théorique)
        </p>

        <p>
          🎯 <span className="font-semibold">Remarque :</span> les deux traits ( ـ...ـ )
          indiquent que la lettre est entourée par d'autres lettres dans le mot.
        </p>

        <p>
          💡 <span className="font-semibold">Dans la pratique :</span> vous verrez
          surtout le Tanwin à la fin des mots. Cette leçon vous aide à maîtriser
          toutes les formes possibles pour une compréhension complète.
        </p>

        <p>
          Dans la page suivante, clique sur chaque combinaison pour écouter et
          répéter les sons correctement.
        </p>
      </div>
    </div>

    <footer className="border-t-1 text-white text-center p-4 md:p-6 mt-8 font-semibold text-base md:text-lg">
      <div>Leçon 14 : Lettres attachées au milieu d'un mot avec Tanwin</div>
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

    
      <PageNavigation currentChapter={3} currentPage={14} className="mt-6 mb-4" />

<footer className="border-t-1 text-white text-center p-4 md:p-6 mt-8 font-semibold text-sm md:text-base">
      <div>Page 14</div>
      <div className="mt-1">© 2025 Tous droits réservés</div>
    </footer>
  </div>
);

// === 📖 Composant principal ===
const Page14 = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = 2;

  return (
    <div className="font-arabic min-h-screen bg-gray-900">
      <div className="text-white p-4 md:p-6 text-center border-b-2">
        <div className="text-2xl md:text-3xl font-bold mb-2">
          {currentPage === 0
            ? "Leçon 14 : Tanwin au milieu d'un mot (usage pédagogique)"
            : "Leçon 14 : Lettres attachées au milieu avec Tanwin (écoute et répète)"}
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

export default Page14;