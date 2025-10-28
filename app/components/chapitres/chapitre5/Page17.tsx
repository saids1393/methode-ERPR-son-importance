"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// === 🎧 Mapping audio Chapitre 5, Page 17 ===
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

const playWordAudio = (word: string) => {
  const audioFileName = chapter5Page17AudioMappings[word];
  if (audioFileName) {
    const audio = new Audio(`/audio/chapitre5/${audioFileName}.mp3`);
    audio.play().catch((err) => console.error("Erreur audio:", err));
  }
};

// === 📘 Introduction ===
const IntroductionPage = () => (
  <div className="p-4 md:p-8 bg-gray-900">
    <div className="w-full bg-gray-800 rounded-lg p-6 md:p-8">
      <div className="text-white space-y-6 text-lg md:text-xl leading-relaxed">
        <p>
          Félicitations ! 🎉 Vous avez maintenant des bonnes bases :{" "}
          <span className="text-yellow-400 font-semibold">
            les lettres, les voyelles courtes, les voyelles doubles (Tanwin)
          </span>
          , et les{" "}
          <span className="text-purple-400 font-semibold">
            différentes formes de connexion
          </span>
          .
        </p>

        <p>
          Il est maintenant temps de{" "}
          <span className="text-cyan-400 font-semibold">
            mettre en pratique
          </span>{" "}
          tout ce que vous avez appris ! Cette leçon est un exercice de lecture
          où vous allez reconnaître et lire des mots arabes complets.
        </p>

        <div className="bg-blue-900/30 border border-blue-500/50 rounded-lg p-4 md:p-6">
          <p>
            🎯 <span className="font-semibold">Objectifs de cet exercice :</span>
            <br />
            • Reconnaître les lettres dans leurs différentes formes (isolée, début, milieu, fin)
            <br />
            • Identifier les voyelles courtes (Fatha, Damma, Kasra)
            <br />
            • Reconnaître le Tanwin (voyelles doubles)
            <br />
            • Lire des mots complets avec fluidité
          </p>
        </div>

        <p>
          💡 <span className="font-semibold">Comment utiliser cet exercice :</span>
          <br />
          1. <span className="text-green-400">Essayez de lire</span> chaque mot à haute voix avant de cliquer
          <br />
          2. <span className="text-blue-400">Cliquez sur le mot</span> pour écouter la prononciation correcte
          <br />
          3. <span className="text-orange-400">Répétez</span> après l'audio pour améliorer votre prononciation
          <br />
          4. <span className="text-purple-400">Pratiquez régulièrement</span> pour développer votre fluidité
        </p>

        <p>
          📚 <span className="font-semibold">Les mots de cette leçon :</span>
          <br />
          Vous allez pratiquer avec 16 mots arabes courants. Ces mots utilisent
          différentes combinaisons de lettres et de voyelles pour vous donner
          une expérience de lecture variée.
        </p>

        <p>
          ⚠️ <span className="font-semibold">Conseil important :</span>
          <br />
          Ne vous découragez pas si vous ne lisez pas parfaitement du premier coup !
          La lecture de l'arabe demande de la pratique. Chaque répétition améliore
          votre reconnaissance des lettres et votre prononciation.
        </p>

        <p>
          🌟 <span className="font-semibold">Astuce :</span>
          <br />
          Concentrez-vous d'abord sur les voyelles courtes (les petits signes),
          puis sur les lettres, et enfin sur la connexion entre elles. Avec le
          temps, la lecture deviendra naturelle !
        </p>

        <p className="text-center text-cyan-400 font-bold text-2xl">
          Bonne pratique ! 📖✨
        </p>
      </div>
    </div>

    <footer className="border-t-1 text-white text-center p-4 md:p-6 mt-8 font-semibold text-base md:text-lg">
      <div>Leçon 17 : Exercice de reconnaissance et lecture de mots</div>
      <div className="mt-1">© 2025 Tous droits réservés</div>
    </footer>
  </div>
);

// === 🧱 Carte de mot ===
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

const ExercisePage = () => (
  <div className="p-4 md:p-8 bg-gray-900">
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
        {words.map((word, idx) => (
          <WordCard key={idx} word={word} onClick={() => playWordAudio(word)} />
        ))}
      </div>
    </div>

    <footer className="border-t-1 text-white text-center p-4 md:p-6 mt-8 font-semibold text-sm md:text-base">
      <div>Page 17</div>
      <div className="mt-1">© 2025 Tous droits réservés</div>
    </footer>
  </div>
);

// === 📖 Composant principal ===
const Page17 = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = 2;

  return (
    <div className="font-arabic min-h-screen bg-gray-900">
      <div className="text-white p-4 md:p-6 text-center border-b-2">
        <div className="text-2xl md:text-3xl font-bold mb-2">
          {currentPage === 0
            ? "Leçon 17 : Exercice de lecture des mots arabes"
            : "Exercice : reconnaissance des mots avec voyelles simples et doubles"}
        </div>
        {currentPage === 1 && (
          <div className="text-md md:text-lg text-amber-300">
            Cliquez sur chaque mot pour écouter sa prononciation.
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

export default Page17;