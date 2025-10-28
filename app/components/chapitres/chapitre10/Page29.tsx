"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const chapter10Page29AudioMappings: { [key: string]: string } = {
  "ٱلْمُصَّدِّقِينَ": "chap10_pg29_case1",
  "يُشَاقُّونَ": "chap10_pg29_case2",
  "فَأَنجَيْنَـٰهُ": "chap10_pg29_case3",
  "أَتُحَآجُّونَنَا": "chap10_pg29_case4",
  "مِّنَ ٱلسَّمَآءِ": "chap10_pg29_case5",
  "أَقَدَرُوا": "chap10_pg29_case6",
};

const quranicWords = [
  "ٱلْمُصَّدِّقِينَ",
  "يُشَاقُّونَ",
  "فَأَنجَيْنَـٰهُ",
  "أَتُحَآجُّونَنَا",
  "مِّنَ ٱلسَّمَآءِ",
  "أَقَدَرُوا"
];

const playLetterAudio = (word: string) => {
  const audioFileName = chapter10Page29AudioMappings[word];
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
          ✏️ <span className="text-amber-400 font-semibold">Exercice d'écriture : Rendre les mots</span>
        </p>

        <p>
          Maintenant que vous maîtrisez toutes les bases du Tajweed, il est temps de mettre en pratique
          ce que vous avez appris ! Cette leçon vous demande de <span className="text-yellow-400 font-semibold">rendre les mots coraniques</span>
          en écrivant leurs lettres <span className="text-cyan-400 font-semibold">de droite à gauche</span>, en appliquant
          le sens de chaque lettre que vous avez étudié au début.
        </p>

        <div className="bg-blue-900/30 border border-blue-500/50 rounded-lg p-4 md:p-6">
          <p>
            🎯 <span className="font-semibold">Ce qu'il faut faire :</span>
            <br />
            <br />
            Pour chaque mot affiché, vous devez l'<span className="text-orange-400 font-semibold">écrire complètement</span>
            en respectant :
            <br />
            • La direction : <span className="text-yellow-400">de droite à gauche</span>
            <br />
            • Les lettres individuelles et leur ordre
            <br />
            • Les signes diacritiques (voyelles, Soukoun, Chaddah, etc.)
            <br />
            • Le sens de chaque lettre selon ce que vous avez appris
          </p>
        </div>

        <p>
          💡 <span className="font-semibold">Conseils pratiques :</span>
          <br />
          1. Écoutez le mot en cliquant dessus pour référence audio
          <br />
          2. Analysez les lettres individuelles de droite à gauche
          <br />
          3. Identifiez les éléments du Tajweed (voyelles, Chaddah, etc.)
          <br />
          4. Écrivez le mot dans un cahier ou sur papier en arabe
          <br />
          5. Comparez votre écriture avec le mot original
        </p>

        <div className="bg-purple-900/30 border border-purple-500/50 rounded-lg p-4 md:p-6 space-y-3">
          <p>
            <span className="font-semibold text-amber-300">Rappel de la direction :</span>
            <br />
            L'arabe s'écrit de <span className="text-yellow-400 font-bold">DROITE vers GAUCHE</span>.
            <br />
            Quand vous analysez un mot, commencez toujours par la <span className="text-orange-400">première lettre à droite</span>
            et progressez vers la <span className="text-orange-400">gauche</span>.
          </p>

          <p>
            <span className="font-semibold text-amber-300">Exemple :</span>
            <br />
            Le mot <span className="text-yellow-400 text-lg">يُشَاقُّونَ</span> commence par :
            <br />
            ن (Noon) → و (Waw) → ق (Qaf avec Chaddah) → ا (Alif) → ش (Sheen avec Fatha) → ي (Ya avec Damma)
          </p>
        </div>

        <p>
          🌟 <span className="font-semibold">Objectif :</span>
          <br />
          Cet exercice consolide votre compréhension de la structure des mots coraniques.
          Vous pratiquez non seulement l'écriture, mais aussi la reconnaissance des patterns
          linguistiques arabes. C'est une étape cruciale vers la maîtrise complète de l'arabe écrit !
        </p>
      </div>
    </div>

    <footer className="border-t-1 text-white text-center p-4 md:p-6 mt-8 font-semibold text-base md:text-lg">
      <div>Leçon 29 : Exercice d'écriture - Rendre les mots</div>
      <div className="mt-1">© 2025 Tous droits réservés</div>
    </footer>
  </div>
);

// === 🧱 Word Card ===
const WordCard = ({ word, onClick }: { word: string; onClick?: () => void }) => (
  <div
    className="bg-gray-800 border border-gray-700 rounded-xl p-6 text-center hover:bg-gray-700 transition-all duration-300 group min-h-[140px] flex items-center justify-center cursor-pointer"
    onClick={onClick}
  >
    <div
      className="text-4xl md:text-5xl font-bold leading-relaxed text-amber-300 group-hover:scale-105 transition-transform duration-300 break-keep"
      dir="rtl"
      lang="ar"
      style={{ fontFeatureSettings: '"calt" 1, "liga" 1' }}
    >
      {word}
    </div>
  </div>
);

// === 📖 Exercise Page ===
const ExercisePage = () => (
  <div className="p-4 md:p-8 bg-gray-900" dir="rtl">
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Instructions */}
      <div className="bg-blue-900/30 border border-blue-500/50 rounded-lg p-4 md:p-6 text-center">
        <p className="text-white text-lg md:text-xl font-semibold">
          ✍️ <span className="text-yellow-400">Écrivez chaque mot de droite à gauche</span>
          <br />
          <span className="text-gray-300 text-base">Appliquez le sens des lettres que vous avez appris</span>
        </p>
      </div>

      {/* Words Grid */}
      <div>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 mb-8">
          {quranicWords.map((word, index) => (
            <WordCard key={index} word={word} onClick={() => playLetterAudio(word)} />
          ))}
        </div>
      </div>

      {/* Practice Note */}
      <div className="bg-purple-900/30 border border-purple-500/50 rounded-lg p-4 md:p-6 text-center">
        <p className="text-white text-base md:text-lg">
          💡 <span className="text-amber-300">Conseil :</span> Cliquez sur chaque mot pour l'écouter, puis écrivez-le sur papier.
        </p>
      </div>
    </div>

    <footer className="border-t-1 text-white text-center p-4 md:p-6 mt-12 font-semibold text-sm md:text-base">
      <div>Page 29 - Exercice d'écriture et rendu des mots</div>
      <div className="mt-1">© 2025 Tous droits réservés</div>
    </footer>
  </div>
);

// === 📖 Main Component ===
const Page29 = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = 2;

  return (
    <div className="font-arabic min-h-screen bg-gray-900">
      <div className="text-white p-4 md:p-6 text-center border-b-2">
        <div className="text-2xl md:text-3xl font-bold mb-2">
          {currentPage === 0
            ? "Leçon 29 : Exercice d'écriture - Rendre les mots"
            : "Leçon 29 : Écrivez les mots"}
        </div>
        {currentPage === 1 && (
          <div className="text-md md:text-lg text-amber-300">
            De droite à gauche : appliquez le sens des lettres que vous avez appris.
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

export default Page29;