"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import PageNavigation from '@/app/components/PageNavigation';

// === 🎧 Mapping audio Chapitre 3, Page 13 ===
const chapter3Page13AudioMappings: { [key: string]: string } = {
  'أً': 'chap3_pg12_case1', 'أٌ': 'chap3_pg12_case2', 'إٍ': 'chap3_pg12_case3',
  'بًـ': 'chap3_pg12_case4', 'بٌـ': 'chap3_pg12_case5', 'بٍـ': 'chap3_pg12_case6',
  'تًـ': 'chap3_pg12_case7', 'تٌـ': 'chap3_pg12_case8', 'تٍـ': 'chap3_pg12_case9',
  'ثًـ': 'chap3_pg12_case10', 'ثٌـ': 'chap3_pg12_case11', 'ثٍـ': 'chap3_pg12_case12',
  'جًـ': 'chap3_pg12_case13', 'جٌـ': 'chap3_pg12_case14', 'جٍـ': 'chap3_pg12_case15',
  'حًـ': 'chap3_pg12_case16', 'حٌـ': 'chap3_pg12_case17', 'حٍـ': 'chap3_pg12_case18',
  'خًـ': 'chap3_pg12_case19', 'خٌـ': 'chap3_pg12_case20', 'خٍـ': 'chap3_pg12_case21',
  'دً': 'chap3_pg12_case22', 'دٌ': 'chap3_pg12_case23', 'دٍ': 'chap3_pg12_case24',
  'ذً': 'chap3_pg12_case25', 'ذٌ': 'chap3_pg12_case26', 'ذٍ': 'chap3_pg12_case27',
  'رً': 'chap3_pg12_case28', 'رٌ': 'chap3_pg12_case29', 'رٍ': 'chap3_pg12_case30',
  'زً': 'chap3_pg12_case31', 'زٌ': 'chap3_pg12_case32', 'زٍ': 'chap3_pg12_case33',
  'سًـ': 'chap3_pg12_case34', 'سٌـ': 'chap3_pg12_case35', 'سٍـ': 'chap3_pg12_case36',
  'شًـ': 'chap3_pg12_case37', 'شٌـ': 'chap3_pg12_case38', 'شٍـ': 'chap3_pg12_case39',
  'صًـ': 'chap3_pg12_case40', 'صٌـ': 'chap3_pg12_case41', 'صٍـ': 'chap3_pg12_case42',
  'ضًـ': 'chap3_pg12_case43', 'ضٌـ': 'chap3_pg12_case44', 'ضٍـ': 'chap3_pg12_case45',
  'طًـ': 'chap3_pg12_case46', 'طٌـ': 'chap3_pg12_case47', 'طٍـ': 'chap3_pg12_case48',
  'ظًـ': 'chap3_pg12_case49', 'ظٌـ': 'chap3_pg12_case50', 'ظٍـ': 'chap3_pg12_case51',
  'عًـ': 'chap3_pg12_case52', 'عٌـ': 'chap3_pg12_case53', 'عٍـ': 'chap3_pg12_case54',
  'غًـ': 'chap3_pg12_case55', 'غٌـ': 'chap3_pg12_case56', 'غٍـ': 'chap3_pg12_case57',
  'فًـ': 'chap3_pg12_case58', 'فٌـ': 'chap3_pg12_case59', 'فٍـ': 'chap3_pg12_case60',
  'قًـ': 'chap3_pg12_case61', 'قٌـ': 'chap3_pg12_case62', 'قٍـ': 'chap3_pg12_case63',
  'كًـ': 'chap3_pg12_case64', 'كٌـ': 'chap3_pg12_case65', 'كٍـ': 'chap3_pg12_case66',
  'لًـ': 'chap3_pg12_case67', 'لٌـ': 'chap3_pg12_case68', 'لٍـ': 'chap3_pg12_case69',
  'مًـ': 'chap3_pg12_case70', 'مٌـ': 'chap3_pg12_case71', 'مٍـ': 'chap3_pg12_case72',
  'نًـ': 'chap3_pg12_case73', 'نٌـ': 'chap3_pg12_case74', 'نٍـ': 'chap3_pg12_case75',
  'هًـ': 'chap3_pg12_case76', 'هٌـ': 'chap3_pg12_case77', 'هٍـ': 'chap3_pg12_case78',
  'وً': 'chap3_pg12_case79', 'وٌ': 'chap3_pg12_case80', 'وٍ': 'chap3_pg12_case81',
  'يًـ': 'chap3_pg12_case82', 'يٌـ': 'chap3_pg12_case83', 'يٍـ': 'chap3_pg12_case84',
};

// === 🔠 Groupes de lettres ===
const emphaticLetters = ["خ", "ر", "ص", "ض", "ط", "ظ", "غ", "ق"];
const nonConnectingLetters = ["أ", "د", "ذ", "ر", "ز", "و"];

const letterGroups = [
  { letter: "أ", vowels: ["أً", "أٌ", "إٍ"] },
  { letter: "ب", vowels: ["بًـ", "بٌـ", "بٍـ"] },
  { letter: "ت", vowels: ["تًـ", "تٌـ", "تٍـ"] },
  { letter: "ث", vowels: ["ثًـ", "ثٌـ", "ثٍـ"] },
  { letter: "ج", vowels: ["جًـ", "جٌـ", "جٍـ"] },
  { letter: "ح", vowels: ["حًـ", "حٌـ", "حٍـ"] },
  { letter: "خ", vowels: ["خًـ", "خٌـ", "خٍـ"] },
  { letter: "د", vowels: ["دً", "دٌ", "دٍ"] },
  { letter: "ذ", vowels: ["ذً", "ذٌ", "ذٍ"] },
  { letter: "ر", vowels: ["رً", "رٌ", "رٍ"] },
  { letter: "ز", vowels: ["زً", "زٌ", "زٍ"] },
  { letter: "س", vowels: ["سًـ", "سٌـ", "سٍـ"] },
  { letter: "ش", vowels: ["شًـ", "شٌـ", "شٍـ"] },
  { letter: "ص", vowels: ["صًـ", "صٌـ", "صٍـ"] },
  { letter: "ض", vowels: ["ضًـ", "ضٌـ", "ضٍـ"] },
  { letter: "ط", vowels: ["طًـ", "طٌـ", "طٍـ"] },
  { letter: "ظ", vowels: ["ظًـ", "ظٌـ", "ظٍـ"] },
  { letter: "ع", vowels: ["عًـ", "عٌـ", "عٍـ"] },
  { letter: "غ", vowels: ["غًـ", "غٌـ", "غٍـ"] },
  { letter: "ف", vowels: ["فًـ", "فٌـ", "فٍـ"] },
  { letter: "ق", vowels: ["قًـ", "قٌـ", "قٍـ"] },
  { letter: "ك", vowels: ["كًـ", "كٌـ", "كٍـ"] },
  { letter: "ل", vowels: ["لًـ", "لٌـ", "لٍـ"] },
  { letter: "م", vowels: ["مًـ", "مٌـ", "مٍـ"] },
  { letter: "ن", vowels: ["نًـ", "نٌـ", "نٍـ"] },
  { letter: "ه", vowels: ["هًـ", "هٌـ", "هٍـ"] },
  { letter: "و", vowels: ["وً", "وٌ", "وٍ"] },
  { letter: "ي", vowels: ["يًـ", "يٌـ", "يٍـ"] },
];

const vowelNames = ["Fathatane (an)", "Dammatane (oun)", "Kasratane (in)"];

const playLetterAudio = (vowelLetter: string) => {
  const audioFileName = chapter3Page13AudioMappings[vowelLetter];
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
          Après avoir appris le Tanwin sur les lettres isolées, voyons maintenant
          comment ces voyelles doubles s'écrivent lorsque les lettres sont{" "}
          <span className="text-yellow-400 font-semibold">au début d'un mot</span>.
        </p>

        <p>
          ⚠️ <span className="font-semibold">Note importante :</span> En réalité, le{" "}
          <span className="text-purple-400 font-semibold">Tanwin (تنوين)</span>{" "}
          apparaît presque exclusivement{" "}
          <span className="text-cyan-400 font-semibold">à la fin des mots</span>{" "}
          en arabe classique. Cette leçon est à titre pédagogique pour vous familiariser
          avec toutes les formes possibles.
        </p>

        <div className="bg-blue-900/30 border border-blue-500/50 rounded-lg p-4 md:p-6">
          <p>
            🔗 <span className="font-semibold">Lettres avec Tanwin au début :</span>
            <br />
            • La lettre porte le Tanwin ET un trait de liaison à droite ( ـ )
            <br />
            • Exemple : <span className="text-yellow-400 text-3xl inline-block">بًـ</span> = « ban » (début de mot théorique)
            <br />
            • Les trois formes : ً (an), ٌ (oun), ٍ (in)
          </p>
        </div>

        <p>
          ⚠️ <span className="font-semibold">Exception importante :</span> les lettres
          qui ne se connectent jamais à droite gardent leur forme isolée même au début :
          <br />
          <span className="text-red-400 text-2xl inline-block mr-2">أ د ذ ر ز و</span>
          <br />
          Ces lettres n'ont pas de trait de liaison à droite.
        </p>

        <p>
          Exemple avec la lettre <span className="text-yellow-400 text-3xl inline-block">ب</span> :
          <br />•{" "}
          <span className="text-yellow-400 text-3xl inline-block">بًـ</span> = «
          ban » (début théorique) •{" "}
          <span className="text-yellow-400 text-3xl inline-block">بٌـ</span> = «
          boun » (début théorique) •{" "}
          <span className="text-yellow-400 text-3xl inline-block">بٍـ</span> = «
          bin » (début théorique)
        </p>

        <p>
          💡 <span className="font-semibold">Rappel :</span> dans la pratique,
          vous verrez surtout le Tanwin à la fin des mots. Cette leçon vous aide
          à comprendre toutes les combinaisons possibles.
        </p>

        <p>
          Dans la page suivante, clique sur chaque combinaison pour écouter et
          répéter les sons correctement.
        </p>
      </div>
    </div>

    <footer className="border-t-1 text-white text-center p-4 md:p-6 mt-8 font-semibold text-base md:text-lg">
      <div>Leçon 13 : Lettres attachées au début d'un mot avec Tanwin</div>
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

    
      <PageNavigation currentChapter={3} currentPage={13} className="mt-6 mb-4" />

<footer className="border-t-1 text-white text-center p-4 md:p-6 mt-8 font-semibold text-sm md:text-base">
      <div>Page 13</div>
      <div className="mt-1">© 2025 Tous droits réservés</div>
    </footer>
  </div>
);

// === 📖 Composant principal ===
const Page13 = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = 2;

  return (
    <div className="font-arabic min-h-screen bg-gray-900">
      <div className="text-white p-4 md:p-6 text-center border-b-2">
        <div className="text-2xl md:text-3xl font-bold mb-2">
          {currentPage === 0
            ? "Leçon 13 : Tanwin au début d'un mot (usage pédagogique)"
            : "Leçon 13 : Lettres attachées au début avec Tanwin (écoute et répète)"}
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

export default Page13;