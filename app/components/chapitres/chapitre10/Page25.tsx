"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import PageNavigation from '@/app/components/PageNavigation';

const chapter10Page25AudioMappings: { [key: string]: string } = {
  "مَدَّ": "chap10_pg25_case1",
  "حَقَّ": "chap10_pg25_case2",
  "فُرَّ": "chap10_pg25_case3",
  "وَدَّ": "chap10_pg25_case4",
  "رُدَّ": "chap10_pg25_case5",
  "عَضَّ": "chap10_pg25_case6",
  "شَدَّ": "chap10_pg25_case7",
  "طُبَّ": "chap10_pg25_case8",
  "قَطَّ": "chap10_pg25_case9",
  "غَلَّ": "chap10_pg25_case10",
  "نَبَّ": "chap10_pg25_case11",
  "ذُبَّ": "chap10_pg25_case12",
  "حُجَّ": "chap10_pg25_case13",
  "عَدَّ": "chap10_pg25_case14",
  "بَلَّ": "chap10_pg25_case15",
  "ظَنَّ": "chap10_pg25_case16",
  "زُرَّ": "chap10_pg25_case17",
  "هَبَّ": "chap10_pg25_case18",
  "كَنَّ": "chap10_pg25_case19",
  "ضَرَّ": "chap10_pg25_case20",
  "سَرَّ": "chap10_pg25_case21",
  "نَمَّ": "chap10_pg25_case22",
  "لَبَّ": "chap10_pg25_case23",
  "فَكَّ": "chap10_pg25_case24",
  "ذَكَّ": "chap10_pg25_case25",
  "خَسَّ": "chap10_pg25_case26",
  "جَلَّ": "chap10_pg25_case28",
  "فَضَّ": "chap10_pg25_case29",
  "سَبَّ": "chap10_pg25_case30",
};

const shaddaWords: string[] = [
  "مَدَّ", "حَقَّ", "فُرَّ", "وَدَّ", "رُدَّ", "عَضَّ",
  "شَدَّ", "طُبَّ", "قَطَّ", "غَلَّ", "نَبَّ", "ذُبَّ",
  "حُجَّ", "عَدَّ", "بَلَّ",
  "ظَنَّ", "زُرَّ", "هَبَّ", "كَنَّ", "ضَرَّ", "سَرَّ",
  "نَمَّ", "لَبَّ", "فَكَّ", "ذَكَّ", "خَسَّ",
  "جَلَّ", "فَضَّ", "سَبَّ",
];

const playLetterAudio = (word: string) => {
  const audioFileName = chapter10Page25AudioMappings[word];
  if (audioFileName) {
    const audio = new Audio(`/audio/chapitre10/${audioFileName}.mp3`);
    audio.play().catch((err) => console.error("Erreur audio:", err));
  }
};

// === 📘 Introduction Page ===
const IntroductionPage = () => (
  <div className="p-4 md:p-8 bg-gray-900">
    <div className="w-full bg-gray-800 rounded-lg p-6 md:p-8">
      <div className="text-white space-y-6 text-lg md:text-xl leading-relaxed">
        <p>
          🌟 <span className="text-amber-400 font-semibold">Dernier chapitre, vous êtes presque au bout !</span>
        </p>

        <p>
          Vous avez appris les voyelles, les prolongations, le Soukoun, et les lettres solaires et lunaires.
          Maintenant, découvrez un dernier concept essentiel : la <span className="text-yellow-400 font-semibold">Chaddah (ّ)</span> — le doublement d'une lettre.
        </p>

        <div className="bg-blue-900/30 border border-blue-500/50 rounded-lg p-4 md:p-6">
          <p>
            ✨ <span className="font-semibold">Qu'est-ce que la Chaddah ?</span>
            <br />
            <br />
            La Chaddah est un petit signe ( <span className="text-orange-400 font-bold text-3xl inline-block">ّ</span> )
            placé au-dessus d'une lettre. Elle signifie que la lettre doit être <span className="text-orange-400 font-semibold">doublée</span>.
            <br />
            <br />
            Cela veut dire : la même lettre se prononce <span className="text-orange-400 font-semibold">deux fois</span>.
            <br />
            <br />
            La Chaddah s'ajoute toujours avec une voyelle (Fatha, Damma ou Kasra) sur la lettre.
          </p>
        </div>

        <p>
          🎯 <span className="font-semibold">Comprendre le doublement :</span>
        </p>

        <div className="bg-purple-900/30 border border-purple-500/50 rounded-lg p-4 md:p-6 space-y-3">
          <p>
            <span className="text-yellow-400 text-lg">مَدَّ</span> = Madda (il a tendu)
            <br />
            <span className="text-gray-300">• Dal porte une Chaddah → Dal est doublée</span>
            <br />
            <span className="text-gray-300">• Prononciation : Meem-Fatha-Dal-Dal-Alif</span>
          </p>

          <p>
            <span className="text-yellow-400 text-lg">حَقَّ</span> = Haqqa (il a mérité)
            <br />
            <span className="text-gray-300">• Qaf porte une Chaddah → Qaf est doublée</span>
            <br />
            <span className="text-gray-300">• Prononciation : Ha-Fatha-Qaf-Qaf-Alif</span>
          </p>

          <p>
            <span className="text-yellow-400 text-lg">شَدَّ</span> = Shaddah (il a resserré)
            <br />
            <span className="text-gray-300">• Dal porte une Chaddah → Dal est doublée</span>
            <br />
            <span className="text-gray-300">• Prononciation : Sheen-Fatha-Dal-Dal-Alif</span>
          </p>
        </div>

        <p>
          💡 <span className="font-semibold">Comment prononcer correctement :</span>
          <br />
          Quand vous voyez une Chaddah :
          <br />
          1. Identifier la lettre et sa voyelle
          <br />
          2. Prononcer la lettre <span className="text-orange-400 font-semibold">deux fois</span> d'affilée
          <br />
          3. Bien marquer chaque prononciation de la lettre
          <br />
          4. Continuer naturellement
        </p>

        <p>
          🎵 <span className="font-semibold">Importance en Tajwid :</span>
          <br />
          La Chaddah est très importante car :
          <br />
          • Elle change le sens des mots
          <br />
          • Elle affecte le rythme de votre récitation du Coran
          <br />
          • Elle apparaît dans de nombreux versets coraniques
          <br />
          • Elle doit être clairement distinguée dans votre prononciation
        </p>

        <p>
          Pratiquez maintenant avec tous les mots ci-dessous. Écoutez bien chaque doublement
          et essayez de reproduire le son avec clarté. Chaque mot contient au moins une Chaddah ! 🎯
        </p>
      </div>
    </div>

    <footer className="border-t-1 text-white text-center p-4 md:p-6 mt-8 font-semibold text-base md:text-lg">
      <div>Leçon 25 : La Chaddah (le doublement de lettres)</div>
      <div className="mt-1">© 2025 Tous droits réservés</div>
    </footer>
  </div>
);

// === 🧱 Shaddah Word Card ===
const ShaddaWordCard = ({ word, onClick }: { word: string; onClick?: () => void }) => (
  <div
    className="bg-gray-800 border border-gray-700 rounded-xl p-3 text-center hover:bg-gray-700 transition-all duration-300 group min-h-[120px] flex items-center justify-center cursor-pointer"
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
        {shaddaWords.map((word, index) => (
          <ShaddaWordCard key={index} word={word} onClick={() => playLetterAudio(word)} />
        ))}
      </div>
    </div>

    
      <PageNavigation currentChapter={10} currentPage={25} className="mt-6 mb-4" />

<footer className="border-t-1 text-white text-center p-4 md:p-6 mt-8 font-semibold text-sm md:text-base">
      <div>Page 25 - Exercice de la Chaddah</div>
      <div className="mt-1">© 2025 Tous droits réservés</div>
    </footer>
  </div>
);

// === 📖 Main Component ===
const Page25 = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = 2;

  return (
    <div className="font-arabic min-h-screen bg-gray-900">
      <div className="text-white p-4 md:p-6 text-center border-b-2">
        <div className="text-2xl md:text-3xl font-bold mb-2">
          {currentPage === 0
            ? "Leçon 25 : La Chaddah (le doublement de lettres)"
            : "Leçon 25 : Pratique de la Chaddah"}
        </div>
        {currentPage === 1 && (
          <div className="text-md md:text-lg text-amber-300">
            Cliquez sur chaque mot pour écouter le doublement de lettres.
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

export default Page25;