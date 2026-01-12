"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import PageNavigation from '@/app/components/PageNavigation';

// === 🎧 Mapping audio Chapitre 4, Page 16 ===
const chapter4Page16AudioMappings: { [key: string]: string } = {
  "قَالَ": "chap0_pg0_case1",
  "عُدْنَ": "chap0_pg0_case8",
  "يَذْكُرُ": "chap0_pg0_case9",
  "فَرِحَ": "chap0_pg0_case10",
  "تَزَكَّىٰ": "chap0_pg0_case11",
  "خَوْفٌ": "chap0_pg0_case27",
};

const disconnectedLetters = [
  { letter: "أ", example: "قَالَ", meaning: "il a dit" },
  { letter: "د", example: "عُدْنَ", meaning: "revenez !" },
  { letter: "ذ", example: "يَذْكُرُ", meaning: "il se souvient" },
  { letter: "ر", example: "فَرِحَ", meaning: "il s'est réjoui" },
  { letter: "ز", example: "تَزَكَّىٰ", meaning: "il s'est purifié" },
  { letter: "و", example: "خَوْفٌ", meaning: "peur" },
];

// === 📘 Introduction ===
const IntroductionPage = () => (
  <div className="p-4 md:p-8 bg-gray-900">
    <div className="w-full bg-gray-800 rounded-lg p-6 md:p-8">
      <div className="text-white space-y-6 text-lg md:text-xl leading-relaxed">
        <p>
          Vous avez appris que la plupart des lettres arabes se connectent à la lettre
          qui les suit. Mais il existe une exception importante :{" "}
          <span className="text-yellow-400 font-semibold">6 lettres spéciales</span>{" "}
          qui ne s'attachent jamais à la lettre suivante.
        </p>

        <p>
          Ces lettres sont appelées{" "}
          <span className="text-purple-400 font-semibold">
            lettres non-connectantes à droite
          </span>{" "}
          (الحروف التي لا تتصل بما بعدها). Elles restent toujours isolées du côté droit,
          même au milieu d'un mot.
        </p>

        <div className="bg-blue-900/30 border border-blue-500/50 rounded-lg p-4 md:p-6">
          <p>
            🔗 <span className="font-semibold">Les 6 lettres non-connectantes :</span>
            <br />
            <span className="text-red-400 text-4xl font-bold inline-block mt-2">
              أ - د - ذ - ر - ز - و
            </span>
            <br />
            <span className="text-sm text-gray-300 mt-2 inline-block">
              (Alif, Dal, Dhal, Ra, Zay, Waw)
            </span>
          </p>
        </div>

        <p>
          🎯 <span className="font-semibold">Règle importante :</span>
          <br />
          • Ces lettres se connectent à la lettre <span className="text-cyan-400">PRÉCÉDENTE</span> (à gauche)
          <br />
          • Mais elles ne se connectent JAMAIS à la lettre <span className="text-red-400">SUIVANTE</span> (à droite)
          <br />
          • La lettre qui vient après elles commence toujours comme si elle était au début d'un mot
        </p>

        <p>
          💡 <span className="font-semibold">Astuce pour retenir :</span>
          <br />
          Ces 6 lettres partagent une caractéristique commune : elles sont toutes
          courtes et sans « queue » vers la droite. Leur forme ne permet pas
          naturellement de se connecter à droite.
        </p>

        <p>
          Exemple avec le mot{" "}
          <span className="text-yellow-400 text-3xl inline-block">قَالَ</span> (qala - il a dit) :
          <br />
          La lettre <span className="text-red-400 text-2xl inline-block">ا</span> (alif)
          au milieu ne se connecte pas à la lettre suivante{" "}
          <span className="text-2xl inline-block">ل</span> (lam), qui commence donc
          comme au début d'un mot.
        </p>

        <p>
          Dans la page suivante, vous verrez des exemples concrets de ces 6 lettres
          dans des mots réels. Cliquez sur chaque mot pour écouter sa prononciation.
        </p>
      </div>
    </div>

    <footer className="border-t-1 text-white text-center p-4 md:p-6 mt-8 font-semibold text-base md:text-lg">
      <div>Leçon 16 : Les lettres qui ne s'attachent pas après elles</div>
      <div className="mt-1">© 2025 Tous droits réservés</div>
    </footer>
  </div>
);

// === 🧱 Carte de lettre non-connectante ===
const DisconnectedLetterCard = ({
  letter,
  example,
  meaning,
  onClick,
  isActive,
}: {
  letter: string;
  example: string;
  meaning: string;
  onClick?: (word: string, index: number) => void;
  isActive?: boolean;
}) => (
  <div className="bg-gray-800 border border-zinc-500 rounded-xl p-6 text-center hover:bg-gray-700 transition-all duration-300 group">
    <div className="text-5xl md:text-6xl font-bold text-red-400 mb-4 group-hover:scale-110 transition-transform duration-300">
      {letter}
    </div>
    <div className="w-full h-px bg-zinc-600 mb-4"></div>
    <div
      className={`text-3xl md:text-4xl font-bold text-white mb-3 leading-relaxed cursor-pointer hover:text-blue-300 transition-colors ${
        isActive ? 'pulse-active' : ''
      }`}
      onClick={() => onClick?.(example, disconnectedLetters.findIndex(item => item.example === example))}
    >
      {example}
    </div>
    <div className="text-sm text-zinc-400 mb-3">{meaning}</div>
    <div className="inline-block bg-yellow-900/30 text-yellow-400 px-3 py-1 rounded-full text-xs font-semibold">
      Ne s'attache pas après
    </div>
  </div>
);

const ExamplesPage = ({ playLetterAudio, activeExample }: { 
  playLetterAudio: (word: string, index: number) => void;
  activeExample: string;
}) => (
  <div className="p-4 md:p-8 bg-gray-900">
    <div className="max-w-5xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {disconnectedLetters.map((item, idx) => (
          <DisconnectedLetterCard
            key={idx}
            letter={item.letter}
            example={item.example}
            meaning={item.meaning}
            onClick={playLetterAudio}
            isActive={activeExample === item.example}
          />
        ))}
      </div>

      <div className="bg-gray-800 border border-zinc-500 rounded-xl p-6 mb-6">
        <div className="text-center font-bold text-lg text-blue-400 mb-3 bg-blue-900/30 py-2 rounded-lg">
          Résumé
        </div>
        <div className="text-center text-zinc-300 text-base leading-relaxed">
          Les lettres qui ne s'attachent pas après elles sont au nombre de 6
          <br />
          <span className="text-red-500 text-4xl font-semibold">
            أ - د - ذ - ر - ز - و
          </span>
        </div>
      </div>
    </div>

    
      <PageNavigation currentChapter={4} currentPage={16} module="LECTURE" className="mt-6 mb-4" />

<footer className="border-t-1 text-white text-center p-4 md:p-6 mt-8 font-semibold text-sm md:text-base">
      <div>Page 16</div>
      <div className="mt-1">© 2025 Tous droits réservés</div>
    </footer>
  </div>
);

// === 📖 Composant principal ===
const Page16 = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [activeExample, setActiveExample] = useState("قَالَ"); // Premier mot actif par défaut
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
    setActiveExample(word);
    
    const audioFileName = chapter4Page16AudioMappings[word];
    if (audioFileName) {
      const audio = new Audio(`/audio/chapitre0_1/${audioFileName}.mp3`);
      
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
    <div className="font-arabic min-h-screen bg-gray-900">
      <div className="text-white p-4 md:p-6 text-center border-b-2">
        <div className="text-2xl md:text-3xl font-bold mb-2">
          {currentPage === 0
            ? "Leçon 16 : Les lettres qui ne s'attachent pas après elles"
            : "Exemples des lettres qui ne s'attachent pas après elles"}
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

      {currentPage === 0 ? <IntroductionPage /> : <ExamplesPage playLetterAudio={playLetterAudio} activeExample={activeExample} />}
    </div>
  );
};

export default Page16;