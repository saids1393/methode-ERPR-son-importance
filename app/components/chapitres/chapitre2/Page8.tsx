"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import PageNavigation from '@/app/components/PageNavigation';

// === 🎧 Mapping audio Chapitre 2, Page 8 ===
const chapter2Page8AudioMappings: { [key: string]: string } = {
  "أَ": "chap2_pg8_case1",
  "أُ": "chap2_pg8_case2",
  "إِ": "chap2_pg8_case3",
  "بَ": "chap2_pg8_case4",
  "بُ": "chap2_pg8_case5",
  "بِ": "chap2_pg8_case6",
  "تَ": "chap2_pg8_case7",
  "تُ": "chap2_pg8_case8",
  "تِ": "chap2_pg8_case9",
  "ثَ": "chap2_pg8_case10",
  "ثُ": "chap2_pg8_case11",
  "ثِ": "chap2_pg8_case12",
  "جَ": "chap2_pg8_case13",
  "جُ": "chap2_pg8_case14",
  "جِ": "chap2_pg8_case15",
  "حَ": "chap2_pg8_case16",
  "حُ": "chap2_pg8_case17",
  "حِ": "chap2_pg8_case18",
  "خَ": "chap2_pg8_case19",
  "خُ": "chap2_pg8_case20",
  "خِ": "chap2_pg8_case21",
  "دَ": "chap2_pg8_case22",
  "دُ": "chap2_pg8_case23",
  "دِ": "chap2_pg8_case24",
  "ذَ": "chap2_pg8_case25",
  "ذُ": "chap2_pg8_case26",
  "ذِ": "chap2_pg8_case27",
  "رَ": "chap2_pg8_case28",
  "رُ": "chap2_pg8_case29",
  "رِ": "chap2_pg8_case30",
  "زَ": "chap2_pg8_case31",
  "زُ": "chap2_pg8_case32",
  "زِ": "chap2_pg8_case33",
  "سَ": "chap2_pg8_case34",
  "سُ": "chap2_pg8_case35",
  "سِ": "chap2_pg8_case36",
  "شَ": "chap2_pg8_case37",
  "شُ": "chap2_pg8_case38",
  "شِ": "chap2_pg8_case39",
  "صَ": "chap2_pg8_case40",
  "صُ": "chap2_pg8_case41",
  "صِ": "chap2_pg8_case42",
  "ضَ": "chap2_pg8_case43",
  "ضُ": "chap2_pg8_case44",
  "ضِ": "chap2_pg8_case45",
  "طَ": "chap2_pg8_case46",
  "طُ": "chap2_pg8_case47",
  "طِ": "chap2_pg8_case48",
  "ظَ": "chap2_pg8_case49",
  "ظُ": "chap2_pg8_case50",
  "ظِ": "chap2_pg8_case51",
  "عَ": "chap2_pg8_case52",
  "عُ": "chap2_pg8_case53",
  "عِ": "chap2_pg8_case54",
  "غَ": "chap2_pg8_case55",
  "غُ": "chap2_pg8_case56",
  "غِ": "chap2_pg8_case57",
  "فَ": "chap2_pg8_case58",
  "فُ": "chap2_pg8_case59",
  "فِ": "chap2_pg8_case60",
  "قَ": "chap2_pg8_case61",
  "قُ": "chap2_pg8_case62",
  "قِ": "chap2_pg8_case63",
  "كَ": "chap2_pg8_case64",
  "كُ": "chap2_pg8_case65",
  "كِ": "chap2_pg8_case66",
  "لَ": "chap2_pg8_case67",
  "لُ": "chap2_pg8_case68",
  "لِ": "chap2_pg8_case69",
  "مَ": "chap2_pg8_case70",
  "مُ": "chap2_pg8_case71",
  "مِ": "chap2_pg8_case72",
  "نَ": "chap2_pg8_case73",
  "نُ": "chap2_pg8_case74",
  "نِ": "chap2_pg8_case75",
  "هَ": "chap2_pg8_case76",
  "هُ": "chap2_pg8_case77",
  "هِ": "chap2_pg8_case78",
  "وَ": "chap2_pg8_case79",
  "وُ": "wou-chap2",
  "وِ": "wi-chap2",
  "يَ": "ya-chap2",
  "يُ": "you-chap2",
  "يِ": "yi-chap2",
  "ءَ": "chap2_pg8_case1",
  "ءُ": "chap2_pg8_case2",
  "ءِ": "chap2_pg8_case3",
  "ةَ": "chap2_pg8_case7",
  "ةُ": "chap2_pg8_case8",
  "ةِ": "chap2_pg8_case9",
};

// === 🔠 Groupes de lettres ===
const emphaticLetters = ["خ", "ر", "ص", "ض", "ط", "ظ", "غ", "ق"];

const letterGroups = [
  { letter: "أ", vowels: ["أَ", "أُ", "إِ"] },
  { letter: "ب", vowels: ["بَ", "بُ", "بِ"] },
  { letter: "ت", vowels: ["تَ", "تُ", "تِ"] },
  { letter: "ث", vowels: ["ثَ", "ثُ", "ثِ"] },
  { letter: "ج", vowels: ["جَ", "جُ", "جِ"] },
  { letter: "ح", vowels: ["حَ", "حُ", "حِ"] },
  { letter: "خ", vowels: ["خَ", "خُ", "خِ"] },
  { letter: "د", vowels: ["دَ", "دُ", "دِ"] },
  { letter: "ذ", vowels: ["ذَ", "ذُ", "ذِ"] },
  { letter: "ر", vowels: ["رَ", "رُ", "رِ"] },
  { letter: "ز", vowels: ["زَ", "زُ", "زِ"] },
  { letter: "س", vowels: ["سَ", "سُ", "سِ"] },
  { letter: "ش", vowels: ["شَ", "شُ", "شِ"] },
  { letter: "ص", vowels: ["صَ", "صُ", "صِ"] },
  { letter: "ض", vowels: ["ضَ", "ضُ", "ضِ"] },
  { letter: "ط", vowels: ["طَ", "طُ", "طِ"] },
  { letter: "ظ", vowels: ["ظَ", "ظُ", "ظِ"] },
  { letter: "ع", vowels: ["عَ", "عُ", "عِ"] },
  { letter: "غ", vowels: ["غَ", "غُ", "غِ"] },
  { letter: "ف", vowels: ["فَ", "فُ", "فِ"] },
  { letter: "ق", vowels: ["قَ", "قُ", "قِ"] },
  { letter: "ك", vowels: ["كَ", "كُ", "كِ"] },
  { letter: "ل", vowels: ["لَ", "لُ", "لِ"] },
  { letter: "م", vowels: ["مَ", "مُ", "مِ"] },
  { letter: "ن", vowels: ["نَ", "نُ", "نِ"] },
  { letter: "ه", vowels: ["هَ", "هُ", "هِ"] },
  { letter: "و", vowels: ["وَ", "وُ", "وِ"] },
  { letter: "ي", vowels: ["يَ", "يُ", "يِ"] },
  { letter: "ء", vowels: ["ءَ", "ءُ", "ءِ"] },
  { letter: "ة", vowels: ["ةَ", "ةُ", "ةِ"] },
];

const vowelNames = ["Fatha (a)", "Damma (ou)", "Kasra (i)"];

// === 📘 Introduction ===
const IntroductionPage = () => (
  <div className="p-4 md:p-8 bg-gray-900">
    <div className="w-full bg-gray-800 rounded-lg p-6 md:p-8">
      <div className="text-white space-y-6 text-lg md:text-xl leading-relaxed">
        <p>
          Après avoir appris les lettres arabes, voyons maintenant comment elles
          changent lorsqu’on leur ajoute une{" "}
          <span className="text-yellow-400 font-semibold">voyelle courte</span>.
        </p>

        <p>
          En arabe, les petites marques au-dessus ou en dessous d’une lettre
          sont appelées{" "}
          <span className="text-purple-400 font-semibold">
            voyelles brèves
          </span>
          . Elles indiquent comment prononcer la lettre.
        </p>

        <div className="bg-blue-900/30 border border-blue-500/50 rounded-lg p-4 md:p-6">
          <p>
            🎧 <span className="font-semibold">Les trois voyelles principales sont :</span>
            <br />
            • <span className="text-orange-400 font-bold">فَتْحَة ( ـَ )</span> →
            son « a » (comme dans <i>chat</i>)<br />
            • <span className="text-blue-400 font-bold">ضَمَّة ( ـُ )</span> →
            son « ou » (comme dans <i>bout</i>)<br />
            • <span className="text-green-400 font-bold">كَسْرَة ( ـِ )</span> →
            son « i » (comme dans <i>lit</i>)
          </p>
        </div>

        <p>
          🧠 <span className="font-semibold">Astuce :</span> ces voyelles se placent :
          <br />• <span className="text-orange-400">Fatha</span> →{" "}
          <span className="underline">au-dessus</span> de la lettre <br />•{" "}
          <span className="text-blue-400">Damma</span> →{" "}
          <span className="underline">au-dessus</span> (forme de boucle) <br />•
          <span className="text-green-400"> Kasra</span> →{" "}
          <span className="underline">en dessous</span> de la lettre
        </p>

        <p>
          Exemple :<br />•{" "}
          <span className="text-yellow-400 text-3xl inline-block">بَ</span> = «
          ba » •{" "}
          <span className="text-yellow-400 text-3xl inline-block">بُ</span> = «
          bou » •{" "}
          <span className="text-yellow-400 text-3xl inline-block">بِ</span> = «
          bi »
        </p>

        <p>
          Dans la page suivante, clique sur chaque combinaison pour écouter et
          répéter les sons correctement.
        </p>
      </div>
    </div>

    <footer className="border-t-1 text-white text-center p-4 md:p-6 mt-8 font-semibold text-base md:text-lg">
      <div>Leçon 8 : Lettres + Voyelles courtes</div>
      <div className="mt-1">© 2025 Tous droits réservés</div>
    </footer>
  </div>
);

// === 🧱 Tableau des lettres + voyelles ===
const LetterGroup = ({
  letter,
  vowels,
  emphatic,
  onClick,
  activeVowel,
}: {
  letter: string;
  vowels: string[];
  emphatic?: boolean;
  onClick?: (v: string, globalIndex: number) => void;
  activeVowel?: string;
}) => (
  <div className="bg-gray-800 border border-zinc-500 rounded-xl p-4" dir="rtl">
    <div className="text-center font-bold text-5xl md:text-5xl lg:text-5xl xl:text-6xl text-white mb-4">
      {letter}
    </div>
    <div className="grid grid-cols-3 gap-3">
      {vowels.map((v, i) => {
        // Calculer l'index global pour cette voyelle
        const groupIndex = letterGroups.findIndex(g => g.letter === letter);
        const globalIndex = groupIndex * 3 + i;
        
        return (
          <div
            key={i}
            className={`border border-zinc-500 rounded-xl p-2 md:p-3 lg:p-4 text-center min-h-[90px] md:min-h-[100px] lg:min-h-[110px] flex flex-col justify-center items-center hover:bg-zinc-700 transition-all duration-300 hover:scale-105 cursor-pointer mx-1 ${
              activeVowel === v ? 'pulse-active' : ''
            }`}
            onClick={() => onClick?.(v, globalIndex)}
          >
            <div
              className={`text-5xl md:text-5xl lg:text-5xl xl:text-6xl font-bold transition-colors leading-tight ${
                emphatic ? "text-red-400" : "text-white"
              }`}
            >
              {v}
            </div>
            <div
              className={`text-xs font-semibold px-2 py-1 mt-2 rounded ${
                i === 0
                  ? "text-orange-400 bg-orange-900/30"
                  : i === 1
                  ? "text-blue-400 bg-blue-900/30"
                  : "text-green-400 bg-green-900/30"
              }`}
            >
              {vowelNames[i]}
            </div>
          </div>
        );
      })}
    </div>
  </div>
);

const AlphabetPage = ({ playLetterAudio, activeVowel }: { 
  playLetterAudio: (vowel: string, globalIndex: number) => void;
  activeVowel: string;
}) => (
  <div className="p-4 md:p-8 bg-gray-900">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6" dir="rtl">
      {letterGroups.map((group, idx) => (
        <LetterGroup
          key={idx}
          letter={group.letter}
          vowels={group.vowels}
          emphatic={emphaticLetters.includes(group.letter)}
          onClick={playLetterAudio}
          activeVowel={activeVowel}
        />
      ))}
    </div>

    
      <PageNavigation currentChapter={2} currentPage={8} className="mt-6 mb-4" />

<footer className="border-t-1 text-white text-center p-4 md:p-6 mt-8 font-semibold text-sm md:text-base">
      <div>Page 8</div>
      <div className="mt-1">© 2025 Tous droits réservés</div>
    </footer>
  </div>
);

// === 📖 Composant principal ===
const Page8 = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [activeVowel, setActiveVowel] = useState("أَ"); // Première lettre active par défaut
  // ✅ Référence audio globale pour contrôler la lecture
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const totalPages = 2;

  const playLetterAudio = (vowelLetter: string, globalIndex: number = 0) => {
    // ✅ Arrêter l'audio précédent s'il existe
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }
    
    // ✅ Mettre à jour l'état visuel
    setActiveVowel(vowelLetter);
    
    const audioFileName = chapter2Page8AudioMappings[vowelLetter];
    if (audioFileName) {
      const audio = new Audio(`/audio/chapitre2/${audioFileName}.mp3`);
      
      // ✅ Gérer la fin de l'audio
      audio.addEventListener('ended', () => {
        setCurrentAudio(null);
        // Garder la voyelle active pour le clignotant
      });
      
      // ✅ Mettre à jour la référence et jouer
      setCurrentAudio(audio);
      audio.play().catch(error => {
        console.error('Erreur lors de la lecture audio:', error);
        setCurrentAudio(null);
        // Garder la voyelle active pour le clignotant
      });
    }
  };

  return (
    <div className="font-arabic min-h-screen bg-gray-900">
      <div className="text-white p-4 md:p-6 text-center border-b-2">
        <div className="text-2xl md:text-3xl font-bold mb-2">
          {currentPage === 0
            ? "Leçon 8 : Les voyelles brèves en arabe"
            : "Leçon 8 : Lettres + Voyelles courtes (écoute et répète)"}
        </div>
        {currentPage === 1 && (
          <div className="text-md md:text-lg text-amber-300">
            Cliquez sur chaque combinaison pour écouter et répéter.
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

      {currentPage === 0 ? <IntroductionPage /> : <AlphabetPage playLetterAudio={playLetterAudio} activeVowel={activeVowel} />}
    </div>
  );
};

export default Page8;
