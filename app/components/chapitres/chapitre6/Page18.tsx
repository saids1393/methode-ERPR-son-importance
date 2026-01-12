"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import PageNavigation from '@/app/components/PageNavigation';

const noConnect = ["ا", "د", "ذ", "ر", "ز", "و"];

// === 🎧 Mapping audio Chapitre 6, Page 18 ===
const chapter6Page18AudioMappings: { [key: string]: string } = {
  "بَـا": "chap6_pg18_case1", "بُـو": "chap6_pg18_case2", "بِـي": "chap6_pg18_case3",
  "تَـا": "chap6_pg18_case4", "تُـو": "chap6_pg18_case5", "تِـي": "chap6_pg18_case6",
  "ثَـا": "chap6_pg18_case7", "ثُـو": "chap6_pg18_case8", "ثِـي": "chap6_pg18_case9",
  "جَـا": "chap6_pg18_case10", "جُـو": "chap6_pg18_case11", "جِـي": "chap6_pg18_case12",
  "حَـا": "chap6_pg18_case13", "حُـو": "chap6_pg18_case14", "حِـي": "chap6_pg18_case15",
  "خَـا": "chap6_pg18_case16", "خُـو": "chap6_pg18_case17", "خِـي": "chap6_pg18_case18",
  "دَـا": "chap6_pg18_case19", "دُـو": "chap6_pg18_case20", "دِـي": "chap6_pg18_case21",
  "ذَـا": "chap6_pg18_case22", "ذُـو": "chap6_pg18_case23", "ذِـي": "chap6_pg18_case24",
  "رَـا": "chap6_pg18_case25", "رُـو": "chap6_pg18_case26", "رِـي": "chap6_pg18_case27",
  "زَـا": "chap6_pg18_case28", "زُـو": "chap6_pg18_case29", "زِـي": "chap6_pg18_case30",
  "سَـا": "chap6_pg18_case31", "سُـو": "chap6_pg18_case32", "سِـي": "chap6_pg18_case33",
  "شَـا": "chap6_pg18_case34", "شُـو": "chap6_pg18_case35", "شِـي": "chap6_pg18_case36",
  "صَـا": "chap6_pg18_case37", "صُـو": "chap6_pg18_case38", "صِـي": "chap6_pg18_case39",
  "ضَـا": "chap6_pg18_case40", "ضُـو": "chap6_pg18_case41", "ضِـي": "chap6_pg18_case42",
  "طَـا": "chap6_pg18_case43", "طُـو": "chap6_pg18_case44", "طِـي": "chap6_pg18_case45",
  "ظَـا": "chap6_pg18_case46", "ظُـو": "chap6_pg18_case47", "ظِـي": "chap6_pg18_case48",
  "عَـا": "chap6_pg18_case49", "عُـو": "chap6_pg18_case50", "عِـي": "chap6_pg18_case51",
  "غَـا": "chap6_pg18_case52", "غُـو": "chap6_pg18_case53", "غِـي": "chap6_pg18_case54",
};

const words = [
  "بَـا", "بُـو", "بِـي",
  "تَـا", "تُـو", "تِـي",
  "ثَـا", "ثُـو", "ثِـي",
  "جَـا", "جُـو", "جِـي",
  "حَـا", "حُـو", "حِـي",
  "خَـا", "خُـو", "خِـي",
  "دَـا", "دُـو", "دِـي",
  "ذَـا", "ذُـو", "ذِـي",
  "رَـا", "رُـو", "رِـي",
  "زَـا", "زُـو", "زِـي",
  "سَـا", "سُـو", "سِـي",
  "شَـا", "شُـو", "شِـي",
  "صَـا", "صُـو", "صِـي",
  "ضَـا", "ضُـو", "ضِـي",
  "طَـا", "طُـو", "طِـي",
  "ظَـا", "ظُـو", "ظِـي",
  "عَـا", "عُـو", "عِـي",
  "غَـا", "غُـو", "غِـي",
];



// === 📘 Introduction ===
const IntroductionPage = () => (
  <div className="p-4 md:p-8 bg-gray-900">
    <div className="w-full bg-gray-800 rounded-lg p-6 md:p-8">
      <div className="text-white space-y-6 text-lg md:text-xl leading-relaxed">
        <p>
          Après avoir appris les voyelles courtes, découvrons maintenant les{" "}
          <span className="text-yellow-400 font-semibold">voyelles longues</span>,
          aussi appelées{" "}
          <span className="text-purple-400 font-semibold">lettres de prolongation</span>{" "}
          (حروف المد).
        </p>

        <p>
          Les voyelles longues sont formées en combinant une{" "}
          <span className="text-cyan-400 font-semibold">voyelle courte</span>{" "}
          avec une{" "}
          <span className="text-orange-400 font-semibold">lettre de prolongation</span>.
          Le son de la voyelle est alors prolongé sur deux temps.
        </p>

        <div className="bg-blue-900/30 border border-blue-500/50 rounded-lg p-4 md:p-6">
          <p>
            🎵 <span className="font-semibold">Les trois lettres de prolongation :</span>
            <br />
            • <span className="text-orange-400 font-bold text-3xl inline-block">ا</span> (Alif) → prolonge Fatha : <span className="text-yellow-400 text-3xl inline-block">بَـا</span> = « baa » (long)
            <br />
            • <span className="text-blue-400 font-bold text-3xl inline-block">و</span> (Waw) → prolonge Damma : <span className="text-yellow-400 text-3xl inline-block">بُـو</span> = « bou » (long)
            <br />
            • <span className="text-green-400 font-bold text-3xl inline-block">ي</span> (Ya) → prolonge Kasra : <span className="text-yellow-400 text-3xl inline-block">بِـي</span> = « bii » (long)
          </p>
        </div>

        <p>
          🎯 <span className="font-semibold">Règle importante :</span>
          <br />
          • La voyelle courte doit correspondre à la lettre de prolongation
          <br />
          • <span className="text-orange-400">Fatha ( َ )</span> + <span className="text-orange-400">Alif (ا)</span> = voyelle longue « aa »
          <br />
          • <span className="text-blue-400">Damma ( ُ )</span> + <span className="text-blue-400">Waw (و)</span> = voyelle longue « ou »
          <br />
          • <span className="text-green-400">Kasra ( ِ )</span> + <span className="text-green-400">Ya (ي)</span> = voyelle longue « ii »
        </p>

        <p>
          💡 <span className="font-semibold">Comment reconnaître une voyelle longue :</span>
          <br />
          1. Une lettre avec une voyelle courte (Fatha, Damma ou Kasra)
          <br />
          2. Suivie immédiatement d'une lettre de prolongation correspondante
          <br />
          3. La lettre de prolongation n'a PAS de voyelle propre
        </p>

        <p>
          Exemples pratiques :
          <br />
          • <span className="text-yellow-400 text-3xl inline-block">قَالَ</span> = qaala (il a dit) - Alif prolonge le Qaf
          <br />
          • <span className="text-yellow-400 text-3xl inline-block">يَقُولُ</span> = yaqoulu (il dit) - Waw prolonge le Qaf
          <br />
          • <span className="text-yellow-400 text-3xl inline-block">كَبِيرٌ</span> = kabiir (grand) - Ya prolonge le Ba
        </p>

        <p>
          ⚠️ <span className="font-semibold">Durée de la prolongation :</span>
          <br />
          Une voyelle courte dure 1 temps, tandis qu'une voyelle longue dure 2 temps.
          C'est comme tenir le son deux fois plus longtemps.
        </p>

        <p>
          Dans la page suivante, vous allez pratiquer avec différentes combinaisons
          de lettres et de prolongations. Cliquez sur chaque combinaison pour écouter
          la différence entre les sons courts et longs.
        </p>
      </div>
    </div>

    <footer className="border-t-1 text-white text-center p-4 md:p-6 mt-8 font-semibold text-base md:text-lg">
      <div>Leçon 18 : Les trois lettres de prolongation (حروف المد)</div>
      <div className="mt-1">© 2025 Tous droits réservés</div>
    </footer>
  </div>
);

// === 🧱 Carte de prolongation ===
const ProlongationCard = ({
  word,
  onClick,
  isActive,
}: {
  word: string;
  onClick?: () => void;
  isActive?: boolean;
}) => {
  const arabicLetters = [...word.replace(/[^\u0600-\u06FF]/g, "")];
  const lettreBase = arabicLetters[0];
  const isNoConnect = noConnect.includes(lettreBase);
  const displayWord = isNoConnect ? word.replace(/ـ/g, "") : word;

  return (
    <div
      className={`bg-gray-800 border border-zinc-500 rounded-xl p-4 text-center hover:bg-gray-700 transition-all duration-300 group min-h-[100px] flex items-center justify-center cursor-pointer ${
        isActive ? 'pulse-active' : ''
      }`}
      onClick={onClick}
    >
      <div
        className="text-5xl md:text-5xl font-bold leading-relaxed text-white group-hover:scale-105 transition-transform duration-300 break-keep"
        dir="rtl"
        lang="ar"
        style={{ fontFeatureSettings: '"calt" 1, "liga" 1' }}
      >
        {displayWord}
      </div>
    </div>
  );
};

const ExercisePage = ({ playLetterAudio, activeWord }: { 
  playLetterAudio: (word: string, index: number) => void;
  activeWord: string;
}) => (
  <div className="p-4 md:p-8 bg-gray-900" dir="rtl">
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
        {words.map((word, idx) => (
          <ProlongationCard 
            key={idx} 
            word={word} 
            onClick={() => playLetterAudio(word, idx)} 
            isActive={activeWord === word}
          />
        ))}
      </div>
    </div>

    
      <PageNavigation currentChapter={6} currentPage={18} module="LECTURE" className="mt-6 mb-4" />

<footer className="border-t-1 text-white text-center p-4 md:p-6 mt-8 font-semibold text-sm md:text-base">
      <div>Page 18</div>
      <div className="mt-1">© 2025 Tous droits réservés</div>
    </footer>
  </div>
);

// === 📖 Composant principal ===
const Page18 = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [activeWord, setActiveWord] = useState("بَـا"); // Premier mot actif par défaut
  // ✅ Référence audio globale pour contrôler la lecture
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const totalPages = 2;

  const playLetterAudio = (word: string, index: number = 0) => {
    // ✅ Arrêter l'audio précédent s'il existe
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }
    
    // ✅ Mettre à jour l'état visuel
    setActiveWord(word);
    
    const audioFileName = chapter6Page18AudioMappings[word];
    if (audioFileName) {
      const audio = new Audio(`/audio/chapitre6/${audioFileName}.mp3`);
      
      // ✅ Gérer la fin de l'audio
      audio.addEventListener('ended', () => {
        setCurrentAudio(null);
        // Garder le mot actif pour le clignotant
      });
      
      // ✅ Mettre à jour la référence et jouer
      setCurrentAudio(audio);
      audio.play().catch(error => {
        console.error('Erreur lors de la lecture audio:', error);
        setCurrentAudio(null);
        // Garder le mot actif pour le clignotant
      });
    }
  };

  return (
    <div className="font-arabic min-h-screen bg-gray-900" >
      <div className="text-white p-4 md:p-6 text-center border-b-2">
        <div className="text-2xl md:text-3xl font-bold mb-2">
          {currentPage === 0
            ? "Leçon 18 : Les trois lettres de prolongation"
            : "Leçon 18 : Pratique des lettres de prolongation"}
        </div>
        {currentPage === 1 && (
          <div className="text-md md:text-lg text-amber-300" >
            Cliquez sur chaque combinaison pour écouter la prolongation.
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

      {currentPage === 0 ? <IntroductionPage /> : <ExercisePage playLetterAudio={playLetterAudio} activeWord={activeWord} />}
    </div>
  );
};

export default Page18;