"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import PageNavigation from '@/app/components/PageNavigation';

const chapter8Page22AudioMappings: { [key: string]: string } = {
  // ب + ت
  "بَتْ": "chap8_pg22_case1",
  "بِتْ": "chap8_pg22_case2",
  "بُتْ": "chap8_pg22_case3",

  // ن + ص
  "نَصْ": "chap8_pg22_case4",
  "نِصْ": "chap8_pg22_case5",
  "نُصْ": "chap8_pg22_case6",

  // ك + ت
  "كَتْ": "chap8_pg22_case7",
  "كِتْ": "chap8_pg22_case8",
  "كُتْ": "chap8_pg22_case9",

  // م + س
  "مَسْ": "chap8_pg22_case10",
  "مِسْ": "chap8_pg22_case11",
  "مُسْ": "chap8_pg22_case12",

  // ر + ب
  "رَبْ": "chap8_pg22_case13",
  "رِبْ": "chap8_pg22_case14",
  "رُبْ": "chap8_pg22_case15",

  // س + ف
  "سَفْ": "chap8_pg22_case16",
  "سِفْ": "chap8_pg22_case17",
  "سُفْ": "chap8_pg22_case18",

  // ع + د
  "عَدْ": "chap8_pg22_case19",
  "عِدْ": "chap8_pg22_case20",
  "عُدْ": "chap8_pg22_case21",

  // ف + ر
  "فَرْ": "chap8_pg22_case22",
  "فِرْ": "chap8_pg22_case23",
  "فُرْ": "chap8_pg22_case24",

  // ح + ب
  "حَبْ": "chap8_pg22_case25",
  "حِبْ": "chap8_pg22_case26",
  "حُبْ": "chap8_pg22_case27",

  // د + ر
  "دَرْ": "chap8_pg22_case28",
  "دِرْ": "chap8_pg22_case29",
  "دُرْ": "chap8_pg22_case30",

  // ط + ب
  "طَبْ": "chap8_pg22_case31",
  "طِبْ": "chap8_pg22_case32",
  "طُبْ": "chap8_pg22_case33",

  // ق + ل
  "قَلْ": "chap8_pg22_case34",
  "قِلْ": "chap8_pg22_case35",
  "قُلْ": "chap8_pg22_case36",

  // غ + ض
  "غَضْ": "chap8_pg22_case37",
  "غِضْ": "chap8_pg22_case38",
  "غُضْ": "chap8_pg22_case39",

  // ص + د
  "صَدْ": "chap8_pg22_case40",
  "صِدْ": "chap8_pg22_case41",
  "صُدْ": "chap8_pg22_case42",

  // ض + ح
  "ضَحْ": "chap8_pg22_case43",
  "ضِحْ": "chap8_pg22_case44",
  "ضُحْ": "chap8_pg22_case45",

  // ذ + ك
  "ذَكْ": "chap8_pg22_case46",
  "ذِكْ": "chap8_pg22_case47",
  "ذُكْ": "chap8_pg22_case48",
};

const syllableGroups = [
  { base1: "ب", base2: "ت" },
  { base1: "ن", base2: "ص" },
  { base1: "ك", base2: "ت" },
  { base1: "م", base2: "س" },
  { base1: "ر", base2: "ب" },
  { base1: "س", base2: "ف" },
  { base1: "ع", base2: "د" },
  { base1: "ف", base2: "ر" },
  { base1: "ح", base2: "ب" },
  { base1: "د", base2: "ر" },
  { base1: "ط", base2: "ب" },
  { base1: "ق", base2: "ل" },
  { base1: "غ", base2: "ض" },
  { base1: "ص", base2: "د" },
  { base1: "ض", base2: "ح" },
  { base1: "ذ", base2: "ك" },
];

const vowels = ["َ", "ِ", "ُ"]; // fatha, kasra, damma

const generateWords = () => {
  const words: string[] = [];
  syllableGroups.forEach(({ base1, base2 }) => {
    vowels.forEach((vowel) => {
      words.push(`${base1}${vowel}${base2}ْ`);
    });
  });
  return words;
};

const words = generateWords();

const playLetterAudio = (syllable: string) => {
  const audioFileName = chapter8Page22AudioMappings[syllable];
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
          Jusqu'à présent, vous avez appris à lire les lettres avec des voyelles courtes
          et les lettres qui se prolongent. Maintenant, découvrez un concept crucial :
          la <span className="text-yellow-400 font-semibold">Soukoun</span> (السُّكُون).
        </p>

        <div className="bg-blue-900/30 border border-blue-500/50 rounded-lg p-4 md:p-6">
          <p>
            ✨ <span className="font-semibold">Qu'est-ce que la Soukoun ?</span>
            <br />
            <br />
            Le Soukoun est <span className="text-orange-400 font-semibold">l'absence de voyelle</span> sur une consonne.
            Il est représenté par un <span className="text-orange-400 font-bold text-3xl inline-block">ْ</span> (petit cercle)
            placé au-dessus de la lettre.
            <br />
            <br />
            Cela signifie que la lettre <span className="font-semibold">ne porte pas de voyelle</span> :
            <br />
            • Pas de <span className="text-cyan-400">Fatha</span> ( َ )
            <br />
            • Pas de <span className="text-blue-400">Damma</span> ( ُ )
            <br />
            • Pas de <span className="text-green-400">Kasra</span> ( ِ )
          </p>
        </div>

        <p>
          💡 <span className="font-semibold">Comprendre la Soukoun :</span>
          <br />
          Jusqu'à maintenant, chaque lettre que vous avez lue portait une voyelle. Le Soukoun
          est différent : il <span className="text-orange-400 font-semibold">stoppe complètement le son</span> de la lettre.
          <br />
          <br />
          Exemples :
          <br />
          • <span className="text-yellow-400 text-lg">بَتْ</span> = la lettre ب (ba) + Soukoun sur ت = « bat » (son coupé net)
          <br />
          • <span className="text-yellow-400 text-lg">كِتْ</span> = la lettre ك (ki) + Soukoun sur ت = « kit » (son coupé net)
          <br />
          • <span className="text-yellow-400 text-lg">قُلْ</span> = la lettre ق (qu) + Soukoun sur ل = « qul » (son coupé net)
        </p>

        <div className="bg-purple-900/30 border border-purple-500/50 rounded-lg p-4 md:p-6">
          <p>
            🎯 <span className="font-semibold text-amber-400">Important - Impact du Soukoun en Tajwid :</span>
            <br />
            <br />
            Quand une lettre porte une Soukoun, plusieurs comportements spéciaux peuvent se produire :
            <br />
            <br />
            • <span className="text-orange-400 font-semibold">Al-Qalqalah</span> (القَلْقَلَة) : Certaines lettres avec Soukoun
            créent un son de rebondissement particulier
            <br />
            • <span className="text-orange-400 font-semibold">Al-Hams</span> (الهمس) : Certaines lettres deviennent chuchotées
            <br />
            • Et d'autres règles de Tajwidd qui s'appliquent selon la lettre et son contexte
          </p>
        </div>

        <p>
          🎯 <span className="font-semibold">Objectif de cette leçon :</span>
          <br />
          Prenez le temps de bien comprendre cette introduction avant de passer aux leçons pratiques.
          La Soukoun est la base de nombreuses règles de Tajwid que vous apprendrez par la suite.
        </p>

        <p>
          Dans la page suivante, vous allez pratiquer avec différentes combinaisons de
          lettres + voyelles + Soukoun. Écoutez attentivement chaque syllabe pour sentir
          la différence entre un son prolongé et un son arrêté net par la Soukoun.
        </p>
      </div>
    </div>

    <footer className="border-t-1 text-white text-center p-4 md:p-6 mt-8 font-semibold text-base md:text-lg">
      <div>Leçon 22 : Le Soukoun (l'absence de voyelle)</div>
      <div className="mt-1">© 2025 Tous droits réservés</div>
    </footer>
  </div>
);

// === 🧱 Sukoon Syllable Card ===
const SukoonSyllableCard = ({ word, onClick }: { word: string; onClick?: () => void }) => (
  <div
    className="bg-gray-800 border border-gray-500 rounded-xl p-3 text-center hover:bg-gray-700 transition-all duration-300 group min-h-[120px] flex items-center justify-center cursor-pointer"
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

// === 📖 Exercise Page ===
const ExercisePage = () => (
  <div className="p-4 md:p-8 bg-gray-900" dir="rtl">
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-8">
        {words.map((word, index) => (
          <SukoonSyllableCard key={index} word={word} onClick={() => playLetterAudio(word)} />
        ))}
      </div>
    </div>

    
      <PageNavigation currentChapter={8} currentPage={22} className="mt-6 mb-4" />

<footer className="border-t-1 text-white text-center p-4 md:p-6 mt-8 font-semibold text-sm md:text-base">
      <div>Page 22 - Exercice du Soukoun</div>
      <div className="mt-1">© 2025 Tous droits réservés</div>
    </footer>
  </div>
);

// === 📖 Main Component ===
const Page22 = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = 2;

  return (
    <div className="font-arabic min-h-screen bg-gray-900">
      <div className="text-white p-4 md:p-6 text-center border-b-2">
        <div className="text-2xl md:text-3xl font-bold mb-2">
          {currentPage === 0
            ? "Leçon 22 : La Soukoun (l'absence de voyelle)"
            : "Leçon 22 : Pratique du Soukoun"}
        </div>
        {currentPage === 1 && (
          <div className="text-md md:text-lg text-amber-300">
            Cliquez sur chaque case pour écouter le son avec la Soukoun.
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

export default Page22;