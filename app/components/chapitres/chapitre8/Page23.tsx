"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import PageNavigation from '@/app/components/PageNavigation';

const chapter8Page23AudioMappings: { [key: string]: string } = {
  // Mots simples
  "قُلْ": "chap8_pg23_case1",
  "كَلْبٌ": "chap8_pg23_case2",
  "يَوْمٍ": "chap8_pg23_case3",
  "حَسْبُ": "chap8_pg23_case4",
  "رَبْعُ": "chap8_pg23_case5",
  "مَسْجِدٌ": "chap8_pg23_case6",
  "فَلْيَنْظُرْ": "chap8_pg23_case7",
  "يَلْهَثْ": "chap8_pg23_case8",
  "مِنْ": "chap8_pg23_case9",
  "لَكُمْ": "chap8_pg23_case11",
  "دِينُكُمْ": "chap8_pg23_case12",
  "وَيَمْنَعُونَ": "chap8_pg23_case13",
  "الْمَاعُونَ": "chap8_pg23_case14",
  "كَعَصْفٍ": "chap8_pg23_case15",
  "مَأْكُولٍ": "chap8_pg23_case16",
  "أَنتُمْ": "chap8_pg23_case17",
  "عَابِدُونَ": "chap8_pg23_case18",
  "أَعْبُدُ": "chap8_pg23_case19",
  "فَأَثَرْنَ": "chap8_pg23_case20",
  "نَقْعًا": "chap8_pg23_case21",
  "وَلَا": "chap8_pg23_case22",
  "تَنْهَ": "chap8_pg23_case23",
  "عَنِ": "chap8_pg23_case24",

  // Verset
  "وَيَمْنَعُونَ الْمَاعُونَ": "chap8_pg23_case25",
};

const quranicItems = [
  "قُلْ",
  "كَلْبٌ",
  "يَوْمٍ",
  "حَسْبُ",
  "رَبْعُ",
  "مَسْجِدٌ",
  "فَلْيَنْظُرْ",
  "يَلْهَثْ",
  "مِنْ",
  "لَكُمْ",
  "دِينُكُمْ",
  "وَيَمْنَعُونَ",
  "الْمَاعُونَ",
  "كَعَصْفٍ",
  "مَأْكُولٍ",
  "أَنتُمْ",
  "عَابِدُونَ",
  "أَعْبُدُ",
  "فَأَثَرْنَ",
  "نَقْعًا",
  "وَلَا",
  "تَنْهَ",
  "عَنِ",
  { text: "وَيَمْنَعُونَ الْمَاعُونَ", color: "text-violet-400" },
];

const playLetterAudio = (word: string) => {
  const audioFileName = chapter8Page23AudioMappings[word];
  if (audioFileName) {
    const audio = new Audio(`/audio/chapitre8/${audioFileName}.mp3`);
    audio.play().catch((err) => console.error("Erreur audio:", err));
  }
};

// === 📘 Introduction Page ===
const IntroductionPage = () => (
  <div className="p-4 md:p-8 bg-gray-900">
    <div className="w-full bg-gray-800 rounded-lg p-6 md:p-8">
      <div className="text-white space-y-6 text-lg md:text-xl leading-relaxed">
        <p>
          Bravo ! Vous avez maintenant compris le concept du <span className="text-yellow-400 font-semibold">Soukoun</span> —
          l'absence de voyelle qui arrête le son d'une lettre. Cette leçon vous permet
          d'appliquer ce concept à des <span className="text-cyan-400 font-semibold">aux Mots arabe</span>.
        </p>

        <div className="bg-blue-900/30 border border-blue-500/50 rounded-lg p-4 md:p-6">
          <p>
            ✨ <span className="font-semibold">Ce que vous allez pratiquer :</span>
            <br />
            <br />
            Cette collection de mots provient du Coran et contient de nombreuses lettres
            avec Soukoun. En écoutant et en prononçant ces mots, vous allez :
            <br />
            <br />
            • Pratiquer la prononciation correcte des sons arrêtés
            <br />
            • Consolider votre compréhension de ce diacritique crucial
            <br />
            • Progresser vers des textes plus complexes
          </p>
        </div>

        <p>
          🎯 <span className="font-semibold">Exemples de mots avec Soukoun :</span>
        </p>

        <div className="bg-purple-900/30 border border-purple-500/50 rounded-lg p-4 md:p-6 space-y-2">
          <p>
            <span className="text-yellow-400 text-lg">قُلْ</span> = « Qul » (dis)
            <br />
            <span className="text-gray-300">• La lettre ل porte un Soukoun → le son s'arrête net</span>
          </p>
          <p>
            <span className="text-yellow-400 text-lg">كَلْبٌ</span> = « Kalbun » (un chien)
            <br />
            <span className="text-gray-300">• La lettre ل porte un Soukoun → le son s'arrête net avant le ب</span>
          </p>
          <p>
            <span className="text-yellow-400 text-lg">يَوْمٍ</span> = « Yawmin » (un jour)
            <br />
            <span className="text-gray-300">• La lettre و porte un Soukoun → crée un son de Layyinah (douceur)</span>
          </p>
          <p>
            <span className="text-yellow-400 text-lg">مَسْجِدٌ</span> = « Masjidun » (une mosquée)
            <br />
            <span className="text-gray-300">• La lettre س porte un Soukoun → le son s'arrête avant le ج</span>
          </p>
        </div>

        <p>
          💡 <span className="font-semibold">Points d'attention :</span>
          <br />
          • Écoutez comment le Soukoun change la fluidité du mot
          <br />
          • Remarquez la différence entre deux lettres connectées quand l'une a un Soukoun
          <br />
          • Pratiquez la prononciation plusieurs fois pour acquérir un bon réflexe
          <br />
          • Le dernier verset entier combine tous ces éléments — c'est un excellent défi !
        </p>

        <p>
          🌟 <span className="font-semibold">Verset au complet :</span>
          <br />
          <span className="text-violet-400 text-lg">وَيَمْنَعُونَ الْمَاعُونَ</span>
          <br />
          <span className="text-gray-300">Sourate Al-Ma'un (107), verset 7</span>
          <br />
          <span className="text-gray-300">« Et ils refusent d'accorder les petits services »</span>
        </p>

        <p>
          Commencez la pratique maintenant. Cliquez sur chaque mot pour écouter
          la prononciation correcte avec le Soukoun. Bonne pratique ! 🎵
        </p>
      </div>
    </div>

    <footer className="border-t-1 text-white text-center p-4 md:p-6 mt-8 font-semibold text-base md:text-lg">
      <div>Leçon 23 : Application du Soukoun - Mots coraniques</div>
      <div className="mt-1">© 2025 Tous droits réservés</div>
    </footer>
  </div>
);

// === 🧱 Quranic Word Card ===
const QuranicWordCard = ({
  word,
  color,
  onClick,
  className,
  isVerse,
}: {
  word: string;
  color?: string;
  onClick?: () => void;
  className?: string;
  isVerse?: boolean;
}) => (
  <div
    className={`bg-gray-800 border border-gray-700 rounded-xl p-3 text-center hover:bg-gray-700 transition-all duration-300 group ${
      isVerse ? "min-h-[140px]" : "min-h-[120px]"
    } flex items-center justify-center cursor-pointer ${className}`}
    onClick={onClick}
  >
    <div
      className={`${isVerse ? "text-3xl md:text-4xl" : "text-4xl md:text-5xl"} font-bold leading-relaxed group-hover:scale-105 transition-transform duration-300 break-keep ${
        color ?? "text-white"
      }`}
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
        {quranicItems.map((item, index) => {
          const isVerse = typeof item !== "string";
          const word = isVerse ? item.text : item;
          const color = isVerse ? item.color : undefined;

          return (
            <QuranicWordCard
              key={index}
              word={word}
              color={color}
              isVerse={isVerse}
              onClick={() => playLetterAudio(word)}
              className={isVerse ? "col-span-2 sm:col-span-3 md:col-span-4 lg:col-span-6" : ""}
            />
          );
        })}
      </div>
    </div>

    
      <PageNavigation currentChapter={8} currentPage={23} className="mt-6 mb-4" />

<footer className="border-t-1 text-white text-center p-4 md:p-6 mt-8 font-semibold text-sm md:text-base">
      <div>Page 23 - Exercice d'application du Soukoun</div>
      <div className="mt-1">© 2025 Tous droits réservés</div>
    </footer>
  </div>
);

// === 📖 Main Component ===
const Page23 = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = 2;

  return (
    <div className="font-arabic min-h-screen bg-gray-900">
      <div className="text-white p-4 md:p-6 text-center border-b-2">
        <div className="text-2xl md:text-3xl font-bold mb-2">
          {currentPage === 0
            ? "Leçon 23 : Application du Soukoun - Mots coraniques"
            : "Leçon 23 : Exercice pratique du Soukoun"}
        </div>
        {currentPage === 1 && (
          <div className="text-md md:text-lg text-amber-300">
            Cliquez sur chaque mot pour écouter la prononciation avec Soukoun.
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

export default Page23;