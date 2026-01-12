"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import PageNavigation from '@/app/components/PageNavigation';

// 🟢 On réutilise les clés audio de la page 18
const chapter6Page19AudioMappings: { [key: string]: string } = {
  "بَـا": "chap6_pg18_case1",
  "تَـا": "chap6_pg18_case4",
  "جِـي": "chap6_pg18_case12",
  // "ثِـي": "chap6_pg18_case9",
  // "حُـو": "chap6_pg18_case14",
  "دَـا": "chap6_pg18_case19",
  // "ذِـي": "chap6_pg18_case24",
  "رُـو": "chap6_pg18_case26",
  "زَـا": "chap6_pg18_case28",
  "سِـي": "chap6_pg18_case33",
  "شُـو": "chap6_pg18_case35",
  "صَـا": "chap6_pg18_case37",
  "ضِـي": "chap6_pg18_case42",
  "طُـو": "chap6_pg18_case44",
  "ظَـا": "chap6_pg18_case46",
  "عِـي": "chap6_pg18_case51",
  "غُـو": "chap6_pg18_case53",
};

// 🔠 Table des lettres pour l’affichage visuel
const letterData = [
  { letter: "بَ", specialSign: "ٰ", keyForAudio: "بَـا", signType: "alif", position: "top", letterStyle: "" },
  { letter: "جِ", specialSign: "ۦ", keyForAudio: "جِـي", signType: "ya", position: "bottom", letterStyle: "relative top-[-8px] right-[-5px]" },
  { letter: "تَ", specialSign: "ٰ", keyForAudio: "تَـا", signType: "alif", position: "top", letterStyle: "" },
  // { letter: "ثِ", specialSign: "ۦ", keyForAudio: "ثِـي", signType: "ya", position: "bottom", letterStyle: "relative top-[3px] right-[-7px]" },
  // { letter: "حُ", specialSign: "ۥ", keyForAudio: "حُـو", signType: "waw", position: "bottom", letterStyle: "relative top-[-3px] right-[-4px]" },
  { letter: "دَ", specialSign: "ٰ", keyForAudio: "دَـا", signType: "alif", position: "top", letterStyle: "" },
  // { letter: "ذِ", specialSign: "ۦ", keyForAudio: "ذِـي", signType: "ya", position: "bottom", letterStyle: "" },
  { letter: "رُ", specialSign: "ۥ", keyForAudio: "رُـو", signType: "waw", position: "bottom", letterStyle: "" },
  { letter: "زَ", specialSign: "ٰ", keyForAudio: "زَـا", signType: "alif", position: "top", letterStyle: "" },
  { letter: "سِ", specialSign: "ۦ", keyForAudio: "سِـي", signType: "ya", position: "bottom", letterStyle: "relative top-[-3px] right-[-10px]" },
  { letter: "شُ", specialSign: "ۥ", keyForAudio: "شُـو", signType: "waw", position: "bottom", letterStyle: "relative top-[-3px] right-[-14px]" },
  { letter: "صَ", specialSign: "ٰ", keyForAudio: "صَـا", signType: "alif", position: "top", letterStyle: "relative top-[3px] right-[-12px]" },
  { letter: "ضِ", specialSign: "ۦ", keyForAudio: "ضِـي", signType: "ya", position: "bottom", letterStyle: "relative top-[-3px] right-[-10px]" },
  { letter: "طُ", specialSign: "ۥ", keyForAudio: "طُـو", signType: "waw", position: "bottom", letterStyle: "relative top-[3px] right-[-6px]" },
  { letter: "ظَ", specialSign: "ٰ", keyForAudio: "ظَـا", signType: "alif", position: "top", letterStyle: "" },
  { letter: "عِ", specialSign: "ۦ", keyForAudio: "عِـي", signType: "ya", position: "bottom", letterStyle: "relative top-[1px] right-[-10px]" },
  { letter: "غُ", specialSign: "ۥ", keyForAudio: "غُـو", signType: "waw", position: "bottom", letterStyle: "relative top-[1px] right-[-10px]" },
];



// === 🧱 Composant visuel de lettre ===
const SpecialLetterCard = ({
  letter,
  specialSign,
  signType,
  position,
  letterStyle,
  onClick,
  isActive,
}: {
  letter: string;
  specialSign: string;
  signType: string;
  position: string;
  letterStyle?: string;
  onClick?: () => void;
  isActive?: boolean;
}) => {
  const getSignColor = (type: string) => {
    switch (type) {
      case "alif": return "text-amber-400";
      case "ya": return "text-sky-400";
      case "waw": return "text-emerald-400";
      default: return "text-zinc-400";
    }
  };
  const getSignSize = (type: string) => {
    switch (type) {
      case "alif": return "text-[40px]";
      case "ya": return "text-[24px]";
      case "waw": return "text-[27px]";
      default: return "text-xl";
    }
  };
  const getCustomPosition = (type: string, pos: string) => {
    if (type === "alif" && pos === "top") return "absolute top-[-12px] right-[25px]";
    if (pos === "bottom") return "absolute bottom-[-24px] right-[27px]";
    return "absolute";
  };

  return (
    <div
      className={`bg-gray-800 border border-zinc-500 rounded-xl p-4 text-center hover:bg-gray-700 transition-all duration-300 group min-h-[110px] flex items-center justify-center relative cursor-pointer ${
        isActive ? 'pulse-active' : ''
      }`}
      onClick={onClick}
    >
      <div className="relative">
        <div className={`text-3xl md:text-4xl font-bold text-white group-hover:scale-105 transition-transform duration-300 ${letterStyle ?? ""}`}>
          {letter}
        </div>
        <span className={`${getSignColor(signType)} ${getSignSize(signType)} ${getCustomPosition(signType, position)} font-bold select-none pointer-events-none`}>
          {specialSign}
        </span>
      </div>
    </div>
  );
};

// === 📖 Page d’exercices ===
const ExercisePage = ({ playLetterAudio, activeAudio }: { 
  playLetterAudio: (audioKey: string, index: number) => void;
  activeAudio: string;
}) => (
  <div className="p-4 md:p-8 bg-gray-900" dir="rtl">
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
        {letterData.map((item, index) => (
          <SpecialLetterCard
            key={index}
            letter={item.letter}
            specialSign={item.specialSign}
            signType={item.signType}
            position={item.position}
            letterStyle={item.letterStyle}
            onClick={() => playLetterAudio(item.keyForAudio, index)}
            isActive={activeAudio === item.keyForAudio}
          />
        ))}
      </div>
    </div>

    <footer className="border-t-1 text-white text-center p-4 md:p-6 mt-8 font-semibold text-sm md:text-base">
      <div>Page 19</div>
      <div className="mt-1">© 2025 Tous droits réservés</div>
    </footer>
  </div>
);

// === 📘 Page d’introduction ===
const IntroductionPage = () => (
  <div className="p-4 md:p-8 bg-gray-900">
    <div className="w-full bg-gray-800 rounded-lg p-6 md:p-8 text-white space-y-6 text-lg md:text-xl leading-relaxed">
      <p>
        Après avoir appris les{" "}
        <span className="text-yellow-400 font-semibold">voyelles longues simples</span>,
        découvrons maintenant les{" "}
        <span className="text-purple-400 font-semibold">voyelles longues suspendues</span>{" "}
        (حروف المد المعطوفة).
      </p>
      <p>
        Ces formes combinent une{" "}
        <span className="text-cyan-400 font-semibold">voyelle courte</span>{" "}
        avec un{" "}
        <span className="text-orange-400 font-semibold">signe miniature</span>
        , et se trouvent exclusivement dans le texte coranique.
      </p>
      <p>
        Cliquez sur chaque combinaison dans la page suivante pour écouter
        la bonne prononciation.
      </p>
    </div>
    
      <PageNavigation currentChapter={6} currentPage={19} module="LECTURE" className="mt-6 mb-4" />

<footer className="border-t text-white text-center p-4 md:p-6 mt-8 font-semibold text-base md:text-lg">
      <div>Leçon 19 : Les symboles Alif saghirah - Ya saghirah - Waw saghirah</div>
      <div className="mt-1">© 2025 Tous droits réservés</div>
    </footer>
  </div>
);

// === 📖 Composant principal ===
const Page19 = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [activeAudio, setActiveAudio] = useState("بَـا"); // Premier audio actif par défaut
  // ✅ Référence audio globale pour contrôler la lecture
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const totalPages = 2;

  const playLetterAudio = (audioKey: string, index: number = 0) => {
    // ✅ Arrêter l'audio précédent s'il existe
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }
    
    // ✅ Mettre à jour l'état visuel
    setActiveAudio(audioKey);
    
    const audioFileName = chapter6Page19AudioMappings[audioKey];
    if (audioFileName) {
      const audio = new Audio(`/audio/chapitre6/${audioFileName}.mp3`);
      
      // ✅ Gérer la fin de l'audio
      audio.addEventListener('ended', () => {
        setCurrentAudio(null);
        // Garder l'audio actif pour le clignotant
      });
      
      // ✅ Mettre à jour la référence et jouer
      setCurrentAudio(audio);
      audio.play().catch(error => {
        console.error('Erreur lors de la lecture audio:', error);
        setCurrentAudio(null);
        // Garder l'audio actif pour le clignotant
      });
    } else {
      console.warn("Aucun fichier audio trouvé pour", audioKey);
    }
  };
  return (
    <div className="font-arabic min-h-screen bg-gray-900">
      <div className="text-white p-4 md:p-6 text-center border-b-2">
        <div className="text-2xl md:text-3xl font-bold mb-2">
          {currentPage === 0
            ? "Leçon 19 : Les symboles Alif saghirah - Ya saghirah - Waw saghirah"
            : "Leçon 19 : Pratique des symboles de prolongation"}
        </div>
        {currentPage === 1 && (
          <div className="text-md md:text-lg text-amber-300">
            Cliquez sur chaque combinaison pour écouter la prononciation.
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

      {currentPage === 0 ? <IntroductionPage /> : <ExercisePage playLetterAudio={playLetterAudio} activeAudio={activeAudio} />}
    </div>
  );
};

export default Page19;
