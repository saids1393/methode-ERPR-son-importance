"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const chapter6Page19AudioMappings: { [key: string]: string } = {
  "بَٰ": "chap6_pg19_case1",
  "تَٰ": "chap6_pg19_case4",
  "جِۦ": "chap6_pg19_case12",
  "ثِۦ": "chap6_pg19_case9",
  "حُۥ": "chap6_pg19_case14",
  "دَٰ": "chap6_pg19_case19",
  "ذِۦ": "chap6_pg19_case24",
  "رُۥ": "chap6_pg19_case26",
  "زَٰ": "chap6_pg19_case28",
  "سِۦ": "chap6_pg19_case33",
  "شُۥ": "chap6_pg19_case35",
  "صَٰ": "chap6_pg19_case37",
  "ضِۦ": "chap6_pg19_case42",
  "طُۥ": "chap6_pg19_case44",
  "ظَٰ": "chap6_pg19_case46",
  "عِۦ": "chap6_pg19_case51",
  "غُۥ": "chap6_pg19_case53",
};

const letterData = [
  { letter: "بَ", specialSign: "ٰ", signType: "alif", position: "top", letterStyle: "" },
  { letter: "جِ", specialSign: "ۦ", signType: "ya", position: "bottom", letterStyle: "relative top-[-8px] right-[-5px]" },
  { letter: "تَ", specialSign: "ٰ", signType: "alif", position: "top", letterStyle: "" },
  { letter: "ثِ", specialSign: "ۦ", signType: "ya", position: "bottom", letterStyle: "relative top-[3px] right-[-7px]" },
  { letter: "حُ", specialSign: "ۥ", signType: "waw", position: "bottom", letterStyle: "relative top-[-3px] right-[-4px]" },
  { letter: "دَ", specialSign: "ٰ", signType: "alif", position: "top", letterStyle: "" },
  { letter: "ذِ", specialSign: "ۦ", signType: "ya", position: "bottom", letterStyle: "" },
  { letter: "رُ", specialSign: "ۥ", signType: "waw", position: "bottom", letterStyle: "" },
  { letter: "زَ", specialSign: "ٰ", signType: "alif", position: "top", letterStyle: "" },
  { letter: "سِ", specialSign: "ۦ", signType: "ya", position: "bottom", letterStyle: "relative top-[-3px] right-[-10px]" },
  { letter: "شُ", specialSign: "ۥ", signType: "waw", position: "bottom", letterStyle: "relative top-[-3px] right-[-14px]" },
  { letter: "صَ", specialSign: "ٰ", signType: "alif", position: "top", letterStyle: "relative top-[3px] right-[-12px]" },
  { letter: "ضِ", specialSign: "ۦ", signType: "ya", position: "bottom", letterStyle: "relative top-[-3px] right-[-10px]" },
  { letter: "طُ", specialSign: "ۥ", signType: "waw", position: "bottom", letterStyle: "relative top-[3px] right-[-6px]" },
  { letter: "ظَ", specialSign: "ٰ", signType: "alif", position: "top", letterStyle: "" },
  { letter: "عِ", specialSign: "ۦ", signType: "ya", position: "bottom", letterStyle: "relative top-[1px] right-[-10px]" },
  { letter: "غُ", specialSign: "ۥ", signType: "waw", position: "bottom", letterStyle: "relative top-[1px] right-[-10px]" },
];

const playLetterAudio = (letter: string, specialSign: string) => {
  const audioKey = `${letter}${specialSign}`;
  const audioFileName = chapter6Page19AudioMappings[audioKey];
  if (audioFileName) {
    const audio = new Audio(`/audio/chapitre6/${audioFileName}.mp3`);
    audio.play().catch((err) => console.error("Erreur audio:", err));
  }
};

// === 📘 Introduction Page ===
const IntroductionPage = () => (
  <div className="p-4 md:p-8 bg-gray-900">
    <div className="w-full bg-gray-800 rounded-lg p-6 md:p-8">
      <div className="text-white space-y-6 text-lg md:text-xl leading-relaxed">
        <p>
          Après avoir appris les{" "}
          <span className="text-yellow-400 font-semibold">voyelles longues simples</span>,
          découvrons maintenant les{" "}
          <span className="text-purple-400 font-semibold">voyelles longues suspendues</span>{" "}
          (حروف المد المعطوفة).
        </p>

        <p>
          Les voyelles longues suspendues sont des formes spéciales qui apparaissent
          dans les textes coraniques. Elles combinent une{" "}
          <span className="text-cyan-400 font-semibold">voyelle courte</span> avec des
          <span className="text-orange-400 font-semibold"> signes diacritiques spéciaux</span>.
        </p>

        <div className="bg-blue-900/30 border border-blue-500/50 rounded-lg p-4 md:p-6">
          <p>
            🎵 <span className="font-semibold">Les trois signes de prolongation suspendus :</span>
            <br />
            • <span className="text-amber-400 font-bold text-3xl inline-block">ٰ</span> Alif saghirah
            <br />
            • <span className="text-emerald-400 font-bold text-3xl inline-block">ۥ</span> Waw saghirah
            <br />
            • <span className="text-sky-400 font-bold text-3xl inline-block">ۦ</span> Ya saghirah
          </p>
        </div>

        <p>
          🎯 <span className="font-semibold">Caractéristiques distinctives :</span>
          <br />
          • Les lettres de prolongation suspendues sont des formes miniaturisées
          <br />
          • Elles apparaissent dans le Coran selon des règles spécifiques
          <br />
          • Elles possèdent les trois mêmes couleurs que leurs "grands frères"
        </p>

        <p>
          💡 <span className="font-semibold">Comment les reconnaître :</span>
          <br />
          1. Une lettre avec une voyelle courte (Fatha, Damma ou Kasra)
          <br />
          2. Surmontée ou soutenue d'un signe de prolongation miniaturisé
          <br />
          3. Ces signes sont plus petits que les lettres ordinaires
        </p>

        <p>
          🎁 <span className="font-semibold text-amber-400">BONUS - Information complémentaire :</span>
          <br />
          <span className="text-gray-300">
            Ces symboles ne font pas partie des cours de base, mais jouent un rôle très important.
            Les signes Alif saghirah, Ya saghirah et Waw saghirah agissent exactement comme les
            grandes lettres de prolongation — c'est comme si c'était leurs <span className="italic">petits frères</span> !
            <br />
            Ils fonctionnent selon les mêmes principes et régles, mais dans une forme miniaturisée
            spécifique au Coran.
          </span>
        </p>

        <p>
          Dans la page suivante, vous allez pratiquer avec les différentes formes
          suspendues de prolongation. Cliquez sur chaque combinaison pour écouter
          la prononciation correcte.
        </p>
      </div>
    </div>

    <footer className="border-t-1 text-white text-center p-4 md:p-6 mt-8 font-semibold text-base md:text-lg">
      <div>Leçon 19 : Les symboles Alif saghirah - Ya saghirah - Waw saghirah</div>
      <div className="mt-1">© 2025 Tous droits réservés</div>
    </footer>
  </div>
);

// === 🧱 Special Letter Card ===
const SpecialLetterCard = ({
  letter,
  specialSign,
  signType,
  position,
  letterStyle,
  onClick,
}: {
  letter: string;
  specialSign: string;
  signType: string;
  position: string;
  letterStyle?: string;
  onClick?: () => void;
}) => {
  const getSignColor = (type: string) => {
    switch (type) {
      case "alif":
        return "text-amber-400";
      case "ya":
        return "text-sky-400";
      case "waw":
        return "text-emerald-400";
      default:
        return "text-zinc-400";
    }
  };

  const getSignSize = (type: string) => {
    switch (type) {
      case "alif":
        return "text-[40px]";
      case "ya":
        return "text-[24px]";
      case "waw":
        return "text-[27px]";
      default:
        return "text-xl";
    }
  };

  const getCustomPosition = (type: string, pos: string) => {
    if (type === "alif" && pos === "top") {
      return "absolute top-[-12px] right-[25px]";
    } else if (type === "ya" && pos === "bottom") {
      return "absolute bottom-[-24px] right-[27px]";
    } else if (type === "waw" && pos === "bottom") {
      return "absolute bottom-[-24px] right-[27px]";
    } else {
      return "absolute";
    }
  };

  return (
    <div
      className="bg-gray-800 border border-zinc-500 rounded-xl p-4 text-center hover:bg-gray-700 transition-all duration-300 group min-h-[110px] flex items-center justify-center relative cursor-pointer"
      onClick={onClick}
    >
      <div className="relative">
        <div
          className={`text-3xl md:text-4xl font-bold text-white group-hover:scale-105 transition-transform duration-300 ${letterStyle ?? ""}`}
        >
          {letter}
        </div>
        <span
          className={`${getSignColor(signType)} ${getSignSize(signType)} ${getCustomPosition(signType, position)} font-bold select-none pointer-events-none`}
        >
          {specialSign}
        </span>
      </div>
    </div>
  );
};

// === 📖 Exercise Page ===
const ExercisePage = () => (
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
            onClick={() => playLetterAudio(item.letter, item.specialSign)}
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

// === 📖 Main Component ===
const Page19 = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = 2;

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

      {currentPage === 0 ? <IntroductionPage /> : <ExercisePage />}
    </div>
  );
};

export default Page19;