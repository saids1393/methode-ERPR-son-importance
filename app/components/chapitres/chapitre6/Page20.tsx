"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import PageNavigation from '@/app/components/PageNavigation';

const chapter6Page20AudioMappings: { [key: string]: string } = {
  // Ba
  "بَوْ": "chap6_pg20_case1",
  "بَيْ": "chap6_pg20_case2",

  // Ta
  "تَوْ": "chap6_pg20_case3",
  "تَيْ": "chap6_pg20_case4",

  // Tha
  "ثَوْ": "chap6_pg20_case5",
  "ثَيْ": "chap6_pg20_case6",

  // Jim
  "جَوْ": "chap6_pg20_case7",
  "جَيْ": "chap6_pg20_case8",

  // Ha
  "حَوْ": "chap6_pg20_case9",
  "حَيْ": "chap6_pg20_case10",

  // Kha
  "خَوْ": "chap6_pg20_case11",
  "خَيْ": "chap6_pg20_case12",

  // Dal
  "دَوْ": "chap6_pg20_case13",
  "دَيْ": "chap6_pg20_case14",

  // Dhal
  "ذَوْ": "chap6_pg20_case15",
  "ذَيْ": "chap6_pg20_case16",

  // Ra
  "رَوْ": "chap6_pg20_case17",
  "رَيْ": "chap6_pg20_case18",

  // Zay
  "زَوْ": "chap6_pg20_case19",
  "زَيْ": "chap6_pg20_case20",

  // Sin
  "سَوْ": "chap6_pg20_case21",
  "سَيْ": "chap6_pg20_case22",

  // Shin
  "شَوْ": "chap6_pg20_case23",
  "شَيْ": "chap6_pg20_case24",

  // Sad
  "صَوْ": "chap6_pg20_case25",
  "صَيْ": "chap6_pg20_case26",

  // Dad
  "ضَوْ": "chap6_pg20_case27",
  "ضَيْ": "chap6_pg20_case28",

  // Ta emphatic
  "طَوْ": "chap6_pg20_case29",
  "طَيْ": "chap6_pg20_case30",

  // Dha emphatic
  "ظَوْ": "chap6_pg20_case31",
  "ظَيْ": "chap6_pg20_case32",

  // Ayn
  "عَوْ": "chap6_pg20_case33",
  "عَيْ": "chap6_pg20_case34",

  // Ghayn
  "غَوْ": "chap6_pg20_case35",
  "غَيْ": "chap6_pg20_case36",
};

const words = [
  "بَوْ", "بَيْ",
  "تَوْ", "تَيْ",
  "ثَوْ", "ثَيْ",
  "جَوْ", "جَيْ",
  "حَوْ", "حَيْ",
  "خَوْ", "خَيْ",
  "دَوْ", "دَيْ",
  "ذَوْ", "ذَيْ",
  "رَوْ", "رَيْ",
  "زَوْ", "زَيْ",
  "سَوْ", "سَيْ",
  "شَوْ", "شَيْ",
  "صَوْ", "صَيْ",
  "ضَوْ", "ضَيْ",
  "طَوْ", "طَيْ",
  "ظَوْ", "ظَيْ",
  "عَوْ", "عَيْ",
  "غَوْ", "غَيْ",
];

// === 📖 Fonction audio globale avec contrôle ===
let globalCurrentAudio: HTMLAudioElement | null = null;

const playLetterAudio = (word: string, setActiveWord: (word: string) => void) => {
  // ✅ Arrêter l'audio précédent s'il existe
  if (globalCurrentAudio) {
    globalCurrentAudio.pause();
    globalCurrentAudio.currentTime = 0;
  }
  
  // ✅ Mettre à jour l'état visuel
  setActiveWord(word);
  
  const audioFileName = chapter6Page20AudioMappings[word];
  if (audioFileName) {
    const audio = new Audio(`/audio/chapitre6/${audioFileName}.mp3`);
    
    // ✅ Gérer la fin de l'audio
    audio.addEventListener('ended', () => {
      globalCurrentAudio = null;
      // Garder le mot actif pour le clignotant
    });
    
    // ✅ Mettre à jour la référence et jouer
    globalCurrentAudio = audio;
    audio.play().catch((err) => {
      console.error("Erreur audio:", err);
      globalCurrentAudio = null;
      // Garder le mot actif pour le clignotant
    });
  }
};

// === 📘 Introduction Page ===
const IntroductionPage = () => (
  <div className="p-4 md:p-8 bg-gray-900">
    <div className="w-full bg-gray-800 rounded-lg p-6 md:p-8">
      <div className="text-white space-y-6 text-lg md:text-xl leading-relaxed">
        <p>
          Vous vous souvenez des lettres de prolongation ? Nous avons appris que
          <span className="text-cyan-400 font-semibold"> Fatha + Alif</span>,{" "}
          <span className="text-cyan-400 font-semibold">Damma + Waw</span>, et{" "}
          <span className="text-cyan-400 font-semibold">Kasra + Ya</span> allongent le son.
        </p>

        <p>
          Mais que se passe-t-il si la lettre de prolongation <span className="font-semibold">ne correspond pas</span> à
          la voyelle précédente ? Par exemple : <span className="text-yellow-400 font-semibold">Fatha + Waw</span> ou{" "}
          <span className="text-yellow-400 font-semibold">Fatha + Ya</span> ?
        </p>

        <div className="bg-blue-900/30 border border-blue-500/50 rounded-lg p-4 md:p-6">
          <p>
            ✨ <span className="font-semibold">La réponse : Les lettres douces (Layyinah) !</span>
            <br />
            <br />
            Quand la lettre de prolongation ne correspond pas à la voyelle, elle ne servira
            <span className="font-semibold"> PAS à allonger</span> le son. Au lieu de cela,
            elle devient une <span className="text-orange-400 font-semibold">lettre douce</span>.
            <br />
            <br />
            On <span className="font-semibold">arrête leur son en douceur</span> au lieu de le prolonger.
            <br />
            <br />
            Il n'y en a que deux : <span className="text-orange-400 font-bold text-3xl inline-block">ي</span> (Ya) et{" "}
            <span className="text-blue-400 font-bold text-3xl inline-block">و</span> (Waw)
            <br />
            <br />
            <span className="text-gray-300">Exemples :</span>
            <br />
            • <span className="text-yellow-400 text-lg">بَوْ</span> = « baw » (son arrêté doucement, pas prolongé)
            <br />
            • <span className="text-yellow-400 text-lg">بَيْ</span> = « bay » (son arrêté doucement, pas prolongé)
            <br />
            • <span className="text-yellow-400 text-lg">حَوْ</span> = « haw » (son arrêté doucement, pas prolongé)
            <br />
            • <span className="text-yellow-400 text-lg">حَيْ</span> = « hay » (son arrêté doucement, pas prolongé)
          </p>
        </div>

        <p>
          🎯 <span className="font-semibold">Comment les identifier :</span>
          <br />
          • Une lettre avec une <span className="text-yellow-400">Fatha</span>
          <br />
          • Suivie d'un <span className="text-blue-400">Ya (ي)</span> ou <span className="text-blue-400">Waw (و)</span> avec un Sukun
          <br />
          • La voyelle ne correspond <span className="font-semibold">PAS</span> à la lettre douce
          <br />
          • Le son s'arrête doucement, sans prolongation
        </p>

        <p>
          💡 <span className="font-semibold">Différence clé :</span>
          <br />
          <span className="text-cyan-400">Prolongation</span> : La voyelle est allongée sur 2 temps
          <br />
          <span className="text-orange-400">Lettre douce</span> : Le son s'arrête doucement sur 1 temps
        </p>

        <p>
          Pratiquez les lettres douces ci-dessous. Écoutez bien la différence
          entre un son prolongé et un son qui s'arrête doucement !
        </p>
      </div>
    </div>

    <footer className="border-t-1 text-white text-center p-4 md:p-6 mt-8 font-semibold text-base md:text-lg">
      <div>Leçon 20 : Lettres douces</div>
      <div className="mt-1">© 2025 Tous droits réservés</div>
    </footer>
  </div>
);

// === 🧱 Diphthong Card ===
const DiphthongCard = ({ word, onClick, isActive }: { 
  word: string; 
  onClick?: () => void; 
  isActive?: boolean;
}) => (
  <div
    className={`bg-gray-800 border border-zinc-500 rounded-xl p-3 text-center hover:bg-gray-700 transition-all duration-300 group min-h-[120px] flex items-center justify-center cursor-pointer ${
      isActive ? 'pulse-active' : ''
    }`}
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
const ExercisePage = ({ playLetterAudio, activeWord }: { 
  playLetterAudio: (word: string, index: number) => void;
  activeWord: string;
}) => (
  <div className="p-4 md:p-8 bg-gray-900" dir="rtl">
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-8">
        {words.map((word, index) => (
          <DiphthongCard 
            key={index} 
            word={word} 
            onClick={() => playLetterAudio(word, index)} 
            isActive={activeWord === word}
          />
        ))}
      </div>
    </div>

    
      <PageNavigation currentChapter={6} currentPage={20} module="LECTURE" className="mt-6 mb-4" />

<footer className="border-t-1 text-white text-center p-4 md:p-6 mt-8 font-semibold text-sm md:text-base">
      <div>Page 20</div>
      <div className="mt-1">© 2025 Tous droits réservés</div>
    </footer>
  </div>
);

// === 📖 Main Component ===
const Page20 = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [activeWord, setActiveWord] = useState("بَوْ"); // Premier mot actif par défaut
  const totalPages = 2;

  const handlePlayAudio = (word: string, index: number = 0) => {
    playLetterAudio(word, setActiveWord);
  };

  return (
    <div className="font-arabic min-h-screen bg-gray-900">
      <div className="text-white p-4 md:p-6 text-center border-b-2">
        <div className="text-2xl md:text-3xl font-bold mb-2">
          {currentPage === 0
            ? "Leçon 20 : Lettres douces"
            : "Leçon 20 : Pratique des lettres douces"}
        </div>
        {currentPage === 1 && (
          <div className="text-md md:text-lg text-amber-300">
            Cliquez sur chaque combinaison pour écouter les lettres douces.
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

      {currentPage === 0 ? <IntroductionPage /> : <ExercisePage playLetterAudio={handlePlayAudio} activeWord={activeWord} />}
    </div>
  );
};

export default Page20;