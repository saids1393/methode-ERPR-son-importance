"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import PageNavigation from '@/app/components/PageNavigation';

// === 🎧 Mapping audio Chapitre 3, Page 12 ===
const chapter3Page12AudioMappings: { [key: string]: string } = {
  'أً': 'chap3_pg12_case1', 'أٌ': 'chap3_pg12_case2', 'إٍ': 'chap3_pg12_case3',
  'بً': 'chap3_pg12_case4', 'بٌ': 'chap3_pg12_case5', 'بٍ': 'chap3_pg12_case6',
  'تً': 'chap3_pg12_case7', 'تٌ': 'chap3_pg12_case8', 'تٍ': 'chap3_pg12_case9',
  'ثً': 'chap3_pg12_case10', 'ثٌ': 'chap3_pg12_case11', 'ثٍ': 'chap3_pg12_case12',
  'جً': 'chap3_pg12_case13', 'جٌ': 'chap3_pg12_case14', 'جٍ': 'chap3_pg12_case15',
  'حً': 'chap3_pg12_case16', 'حٌ': 'chap3_pg12_case17', 'حٍ': 'chap3_pg12_case18',
  'خً': 'chap3_pg12_case19', 'خٌ': 'chap3_pg12_case20', 'خٍ': 'chap3_pg12_case21',
  'دً': 'chap3_pg12_case22', 'دٌ': 'chap3_pg12_case23', 'دٍ': 'chap3_pg12_case24',
  'ذً': 'chap3_pg12_case25', 'ذٌ': 'chap3_pg12_case26', 'ذٍ': 'chap3_pg12_case27',
  'رً': 'chap3_pg12_case28', 'رٌ': 'chap3_pg12_case29', 'رٍ': 'chap3_pg12_case30',
  'زً': 'chap3_pg12_case31', 'زٌ': 'chap3_pg12_case32', 'زٍ': 'chap3_pg12_case33',
  'سً': 'chap3_pg12_case34', 'سٌ': 'chap3_pg12_case35', 'سٍ': 'chap3_pg12_case36',
  'شً': 'chap3_pg12_case37', 'شٌ': 'chap3_pg12_case38', 'شٍ': 'chap3_pg12_case39',
  'صً': 'chap3_pg12_case40', 'صٌ': 'chap3_pg12_case41', 'صٍ': 'chap3_pg12_case42',
  'ضً': 'chap3_pg12_case43', 'ضٌ': 'chap3_pg12_case44', 'ضٍ': 'chap3_pg12_case45',
  'طً': 'chap3_pg12_case46', 'طٌ': 'chap3_pg12_case47', 'طٍ': 'chap3_pg12_case48',
  'ظً': 'chap3_pg12_case49', 'ظٌ': 'chap3_pg12_case50', 'ظٍ': 'chap3_pg12_case51',
  'عً': 'chap3_pg12_case52', 'عٌ': 'chap3_pg12_case53', 'عٍ': 'chap3_pg12_case54',
  'غً': 'chap3_pg12_case55', 'غٌ': 'chap3_pg12_case56', 'غٍ': 'chap3_pg12_case57',
  'فً': 'chap3_pg12_case58', 'فٌ': 'chap3_pg12_case59', 'فٍ': 'chap3_pg12_case60',
  'قً': 'chap3_pg12_case61', 'قٌ': 'chap3_pg12_case62', 'قٍ': 'chap3_pg12_case63',
  'كً': 'chap3_pg12_case64', 'كٌ': 'chap3_pg12_case65', 'كٍ': 'chap3_pg12_case66',
  'لً': 'chap3_pg12_case67', 'لٌ': 'chap3_pg12_case68', 'لٍ': 'chap3_pg12_case69',
  'مً': 'chap3_pg12_case70', 'مٌ': 'chap3_pg12_case71', 'مٍ': 'chap3_pg12_case72',
  'نً': 'chap3_pg12_case73', 'نٌ': 'chap3_pg12_case74', 'نٍ': 'chap3_pg12_case75',
  'هً': 'chap3_pg12_case76', 'هٌ': 'chap3_pg12_case77', 'هٍ': 'chap3_pg12_case78',
  'وً': 'chap3_pg12_case79', 'وٌ': 'chap3_pg12_case80', 'وٍ': 'chap3_pg12_case81',
  'يً': 'chap3_pg12_case82', 'يٌ': 'chap3_pg12_case83', 'يٍ': 'chap3_pg12_case84',
};

// === 🔠 Groupes de lettres ===
const emphaticLetters = ["خ", "ر", "ص", "ض", "ط", "ظ", "غ", "ق"];
const nonConnectingLetters = ["أ", "د", "ذ", "ر", "ز", "و"];

const letterGroups = [
  { letter: "أ", vowels: ["أً", "أٌ", "إٍ"] },
  { letter: "ب", vowels: ["بً", "بٌ", "بٍ"] },
  { letter: "ت", vowels: ["تً", "تٌ", "تٍ"] },
  { letter: "ث", vowels: ["ثً", "ثٌ", "ثٍ"] },
  { letter: "ج", vowels: ["جً", "جٌ", "جٍ"] },
  { letter: "ح", vowels: ["حً", "حٌ", "حٍ"] },
  { letter: "خ", vowels: ["خً", "خٌ", "خٍ"] },
  { letter: "د", vowels: ["دً", "دٌ", "دٍ"] },
  { letter: "ذ", vowels: ["ذً", "ذٌ", "ذٍ"] },
  { letter: "ر", vowels: ["رً", "رٌ", "رٍ"] },
  { letter: "ز", vowels: ["زً", "زٌ", "زٍ"] },
  { letter: "س", vowels: ["سً", "سٌ", "سٍ"] },
  { letter: "ش", vowels: ["شً", "شٌ", "شٍ"] },
  { letter: "ص", vowels: ["صً", "صٌ", "صٍ"] },
  { letter: "ض", vowels: ["ضً", "ضٌ", "ضٍ"] },
  { letter: "ط", vowels: ["طً", "طٌ", "طٍ"] },
  { letter: "ظ", vowels: ["ظً", "ظٌ", "ظٍ"] },
  { letter: "ع", vowels: ["عً", "عٌ", "عٍ"] },
  { letter: "غ", vowels: ["غً", "غٌ", "غٍ"] },
  { letter: "ف", vowels: ["فً", "فٌ", "فٍ"] },
  { letter: "ق", vowels: ["قً", "قٌ", "قٍ"] },
  { letter: "ك", vowels: ["كً", "كٌ", "كٍ"] },
  { letter: "ل", vowels: ["لً", "لٌ", "لٍ"] },
  { letter: "م", vowels: ["مً", "مٌ", "مٍ"] },
  { letter: "ن", vowels: ["نً", "نٌ", "نٍ"] },
  { letter: "ه", vowels: ["هً", "هٌ", "هٍ"] },
  { letter: "و", vowels: ["وً", "وٌ", "وٍ"] },
  { letter: "ي", vowels: ["يً", "يٌ", "يٍ"] },
];

const vowelNames = ["Fathatane (an)", "Dammatane (oun)", "Kasratane (in)"];

const playLetterAudio = (vowelLetter: string) => {
  const audioFileName = chapter3Page12AudioMappings[vowelLetter];
  if (audioFileName) {
    const audio = new Audio(`/audio/chapitre3/${audioFileName}.mp3`);
    audio.play().catch((err) => console.error("Erreur audio:", err));
  }
};

// === 📘 Introduction ===
const IntroductionPage = () => (
  <div className="p-4 md:p-8 bg-gray-900">
    <div className="w-full bg-gray-800 rounded-lg p-6 md:p-8">
      <div className="text-white space-y-6 text-lg md:text-xl leading-relaxed">
        <p>
          Après avoir appris les voyelles courtes simples, découvrons maintenant les{" "}
          <span className="text-yellow-400 font-semibold">voyelles doubles</span>, 
          appelées aussi{" "}
          <span className="text-purple-400 font-semibold">Tanwin (تنوين)</span>.
        </p>

        <p>
          Les voyelles doubles sont une{" "}
          <span className="text-cyan-400 font-semibold">
            répétition de la voyelle courte
          </span>
          , ce qui produit un son « n » à la fin. Elles apparaissent généralement
          à la fin des mots.
        </p>

        <div className="bg-blue-900/30 border border-blue-500/50 rounded-lg p-4 md:p-6">
          <p>
            🎵 <span className="font-semibold">Les trois voyelles doubles :</span>
            <br />
            • <span className="text-orange-400 font-bold">فَتْحَتَانِ ( ً )</span> →
            son « an » (comme dans <i>banc</i>)<br />
            • <span className="text-blue-400 font-bold">ضَمَّتَانِ ( ٌ )</span> →
            son « oun » (comme dans <i>oun</i> en arabe)<br />
            • <span className="text-green-400 font-bold">كَسْرَتَانِ ( ٍ )</span> →
            son « in » (comme dans <i>pin</i>)
          </p>
        </div>

        <p>
          🧠 <span className="font-semibold">Astuce :</span> c'est comme si on
          prononçait la voyelle deux fois rapidement, ce qui crée le son « n » :
          <br />• <span className="text-orange-400">Fatha + Fatha</span> = « an »
          <br />• <span className="text-blue-400">Damma + Damma</span> = « oun »
          <br />• <span className="text-green-400">Kasra + Kasra</span> = « in »
        </p>

        <p>
          Exemple avec la lettre <span className="text-yellow-400 text-3xl inline-block">ب</span> :
          <br />•{" "}
          <span className="text-yellow-400 text-3xl inline-block">بً</span> = «
          ban » •{" "}
          <span className="text-yellow-400 text-3xl inline-block">بٌ</span> = «
          boun » •{" "}
          <span className="text-yellow-400 text-3xl inline-block">بٍ</span> = «
          bin »
        </p>

        <p>
          ⚠️ <span className="font-semibold">Note importante :</span> le Tanwin
          est souvent utilisé dans les noms indéfinis en arabe. C'est une marque
          grammaticale très importante.
        </p>

        <p>
          Dans la page suivante, clique sur chaque combinaison pour écouter et
          répéter les sons correctement.
        </p>
      </div>
    </div>

    <footer className="border-t-1 text-white text-center p-4 md:p-6 mt-8 font-semibold text-base md:text-lg">
      <div>Leçon 12 : Lettres isolées avec voyelles doubles (Tanwin)</div>
      <div className="mt-1">© 2025 Tous droits réservés</div>
    </footer>
  </div>
);

// === 🧱 Tableau des lettres + voyelles ===
const LetterGroup = ({
  letter,
  vowels,
  emphatic,
  nonConnecting,
  onClick,
}: {
  letter: string;
  vowels: string[];
  emphatic?: boolean;
  nonConnecting?: boolean;
  onClick?: (v: string) => void;
}) => (
  <div className="bg-gray-800 border border-zinc-500 rounded-xl p-4" dir="rtl">
    <div className="text-center font-bold text-5xl md:text-5xl lg:text-5xl xl:text-6xl text-white mb-4">
      {letter}
    </div>
    <div className="grid grid-cols-3 gap-3">
      {vowels.map((v, i) => (
        <div
          key={i}
          className="border border-zinc-500 rounded-xl p-2 md:p-3 lg:p-4 text-center min-h-[90px] md:min-h-[100px] lg:min-h-[110px] flex flex-col justify-center items-center hover:bg-zinc-700 transition-all duration-300 hover:scale-105 cursor-pointer mx-1"
          onClick={() => onClick?.(v)}
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
          {nonConnecting && i === 0 && (
            <div className="text-xs text-purple-400 bg-purple-900/30 px-2 py-1 rounded mt-2">
              لا تتصل
            </div>
          )}
        </div>
      ))}
    </div>
  </div>
);

const AlphabetPage = () => (
  <div className="p-4 md:p-8 bg-gray-900">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6" dir="rtl">
      {letterGroups.map((group, idx) => (
        <LetterGroup
          key={idx}
          letter={group.letter}
          vowels={group.vowels}
          emphatic={emphaticLetters.includes(group.letter)}
          nonConnecting={nonConnectingLetters.includes(group.letter)}
          onClick={playLetterAudio}
        />
      ))}
    </div>

    
      <PageNavigation currentChapter={3} currentPage={12} className="mt-6 mb-4" />

<footer className="border-t-1 text-white text-center p-4 md:p-6 mt-8 font-semibold text-sm md:text-base">
      <div>Page 12</div>
      <div className="mt-1">© 2025 Tous droits réservés</div>
    </footer>
  </div>
);

// === 📖 Composant principal ===
const Page12 = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = 2;

  return (
    <div className="font-arabic min-h-screen bg-gray-900">
      <div className="text-white p-4 md:p-6 text-center border-b-2">
        <div className="text-2xl md:text-3xl font-bold mb-2">
          {currentPage === 0
            ? "Leçon 12 : Les voyelles doubles (Tanwin)"
            : "Leçon 12 : Lettres isolées avec voyelles doubles (écoute et répète)"}
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

      {currentPage === 0 ? <IntroductionPage /> : <AlphabetPage />}
    </div>
  );
};

export default Page12;