"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import PageNavigation from '@/app/components/PageNavigation';

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

const words: WordItem[] = [
  // Mots simples
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
];

const playLetterAudio = (word: string) => {
  const audioFileName = chapter7Page21AudioMappings[word];
  if (audioFileName) {
    const audio = new Audio(`/audio/chapitre7/${audioFileName}.mp3`);
    audio.play().catch((err) => console.error("Erreur audio:", err));
  }
};

// === 📘 Introduction Page ===
const IntroductionPage = () => (
  <div className="p-4 md:p-8 bg-gray-900">
    <div className="w-full bg-gray-800 rounded-lg p-6 md:p-8">
      <div className="text-white space-y-6 text-lg md:text-xl leading-relaxed">
        <p>
          Félicitations ! Vous avez maintenant appris tous les éléments fondamentaux de
          la <span className="text-yellow-400 font-semibold">lecture arabe</span> :
        </p>

        <div className="bg-blue-900/30 border border-blue-500/50 rounded-lg p-4 md:p-6 space-y-3">
          <p className="font-semibold text-amber-300">✓ Les trois voyelles courtes (Fatha, Damma, Kasra)</p>
          <p className="font-semibold text-amber-300">✓ Les lettres de prolongation simples (Alif, Waw, Ya)</p>
          <p className="font-semibold text-amber-300">✓ Les lettres de prolongation suspendues (Alif saghirah, Waw saghirah, Ya saghirah)</p>
          <p className="font-semibold text-amber-300">✓ Les lettres douces (Layyinah) qui arrêtent le son en douceur</p>
        </div>

        <p>
          Vous avez également découvert comment ces éléments se combinent pour créer
          les sons de base de l'arabe. Il est maintenant temps de les <span className="text-orange-400 font-semibold">appliquer à des mots réels</span> !
        </p>

        <p>
          Cette page d'exercice présente une <span className="text-cyan-400 font-semibold">collection de mots arabes authentiques</span> qui
          utilisent tous les concepts que vous avez appris :
        </p>

        <div className="bg-purple-900/30 border border-purple-500/50 rounded-lg p-4 md:p-6 space-y-2">
          <p>
            🎯 <span className="font-semibold">Mots avec lettres douces :</span>
            <br />
            <span className="text-gray-300">• بَيْتٌ (bayt) = maison</span>
            <br />
            <span className="text-gray-300">• لَيْلٌ (layl) = nuit</span>
            <br />
            <span className="text-gray-300">• قَوْمٌ (qawm) = peuple</span>
          </p>
        </div>

        <div className="bg-green-900/30 border border-green-500/50 rounded-lg p-4 md:p-6 space-y-2">
          <p>
            💫 <span className="font-semibold">Mots avec voyelles longues :</span>
            <br />
            <span className="text-gray-300">• الْكِتَابُ (al-kitaab) = le livre</span>
            <br />
            <span className="text-gray-300">• يَقُولُ (yaqool) = il dit</span>
            <br />
            <span className="text-gray-300">• كَرِيمٌ (kareem) = généreux</span>
          </p>
        </div>

        <p>
          💡 <span className="font-semibold">Comment utiliser cette page :</span>
          <br />
          1. Cliquez sur chaque mot pour entendre sa prononciation
          <br />
          2. Essayez de reconnaître quels éléments (voyelles, prolongations, lettres douces) il contient
          <br />
          3. Pratiquez en lisant les mots à haute voix avant de cliquer
        </p>

        <p>
          Cet exercice pratique va consolider tous vos apprentissages et vous permettre
          de progresser vers des textes plus longs. Bonne pratique ! 🌟
        </p>
      </div>
    </div>

    <footer className="border-t-1 text-white text-center p-4 md:p-6 mt-8 font-semibold text-base md:text-lg">
      <div>Leçon 21 : Reconnaissance des mots - Application complète</div>
      <div className="mt-1">© 2025 Tous droits réservés</div>
    </footer>
  </div>
);

// === 🧱 Various Word Card ===
const VariousWordCard = ({ word, onClick }: { word: string; onClick?: () => void }) => (
  <div
    className="bg-gray-800 border border-gray-500 rounded-xl p-3 text-center hover:bg-gray-700 transition-all duration-300 group min-h-[120px] flex items-center justify-center cursor-pointer relative"
    onClick={onClick}
  >
    <div
      className="text-4xl md:text-5xl font-bold leading-relaxed text-white group-hover:scale-105 transition-transform duration-300 break-keep"
      dir="rtl"
      lang="ar"
    >
      {word}
    </div>
  </div>
);

// === 📖 Exercise Page ===
const ExercisePage = () => (
  <div className="p-4 md:p-8 bg-gray-900" dir="rtl">
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-8">
        {words.map((wordItem, index) => (
          <VariousWordCard
            key={index}
            word={wordItem.word}
            onClick={() => playLetterAudio(wordItem.word)}
          />
        ))}
      </div>
    </div>

    
      <PageNavigation currentChapter={7} currentPage={21} className="mt-6 mb-4" />

<footer className="border-t-1 text-white text-center p-4 md:p-6 mt-8 font-semibold text-sm md:text-base">
      <div>Page 21 - Exercice de reconnaissance</div>
      <div className="mt-1">© 2025 Tous droits réservés</div>
    </footer>
  </div>
);

// === 📖 Main Component ===
const Page21 = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = 2;

  return (
    <div className="font-arabic min-h-screen bg-gray-900">
      <div className="text-white p-4 md:p-6 text-center border-b-2">
        <div className="text-2xl md:text-3xl font-bold mb-2">
          {currentPage === 0
            ? "Leçon 21 : Reconnaissance des mots - Application complète"
            : "Leçon 21 : Exercice pratique"}
        </div>
        {currentPage === 1 && (
          <div className="text-md md:text-lg text-amber-300">
            Cliquez sur chaque mot pour écouter sa prononciation et reconnaître les éléments appris.
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

      {currentPage === 0 ? <IntroductionPage /> : <ExercisePage />}
    </div>
  );
};

export default Page21;