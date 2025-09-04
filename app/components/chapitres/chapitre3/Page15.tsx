"use client";

// components/chapitres/chapitre3/Page15.tsx
import React from "react";

// Mapping audio pour le Chapitre 3, Page 15 (voyelles doubles en fin de mot)
const chapter3Page15AudioMappings: { [key: string]: string } = {
  "اً": "chap3_pg12_case1",
  "اٌ": "chap3_pg12_case2",
  "اٍ": "chap3_pg12_case3",

  "بًا": "chap3_pg12_case4",
  "بٌ": "chap3_pg12_case5",
  "بٍ": "chap3_pg12_case6",

  "تًا": "chap3_pg12_case7",
  "تٌ": "chap3_pg12_case8",
  "تٍ": "chap3_pg12_case9",

  "ثًا": "chap3_pg12_case10",
  "ثٌ": "chap3_pg12_case11",
  "ثٍ": "chap3_pg12_case12",

  "جًا": "chap3_pg12_case13",
  "جٌ": "chap3_pg12_case14",
  "جٍ": "chap3_pg12_case15",

  "حًا": "chap3_pg12_case16",
  "حٌ": "chap3_pg12_case17",
  "حٍ": "chap3_pg12_case18",

  "خًا": "chap3_pg12_case19",
  "خٌ": "chap3_pg12_case20",
  "خٍ": "chap3_pg12_case21",

  "دًا": "chap3_pg12_case22",
  "دٌ": "chap3_pg12_case23",
  "دٍ": "chap3_pg12_case24",

  "ذًا": "chap3_pg12_case25",
  "ذٌ": "chap3_pg12_case26",
  "ذٍ": "chap3_pg12_case27",

  "رًا": "chap3_pg12_case28",
  "رٌ": "chap3_pg12_case29",
  "رٍ": "chap3_pg12_case30",

  "زًا": "chap3_pg12_case31",
  "زٌ": "chap3_pg12_case32",
  "زٍ": "chap3_pg12_case33",

  "سًا": "chap3_pg12_case34",
  "سٌ": "chap3_pg12_case35",
  "سٍ": "chap3_pg12_case36",

  "شًا": "chap3_pg12_case37",
  "شٌ": "chap3_pg12_case38",
  "شٍ": "chap3_pg12_case39",

  "صًا": "chap3_pg12_case40",
  "صٌ": "chap3_pg12_case41",
  "صٍ": "chap3_pg12_case42",

  "ضًا": "chap3_pg12_case43",
  "ضٌ": "chap3_pg12_case44",
  "ضٍ": "chap3_pg12_case45",

  "طًا": "chap3_pg12_case46",
  "طٌ": "chap3_pg12_case47",
  "طٍ": "chap3_pg12_case48",

  "ظًا": "chap3_pg12_case49",
  "ظٌ": "chap3_pg12_case50",
  "ظٍ": "chap3_pg12_case51",

  "عًا": "chap3_pg12_case52",
  "عٌ": "chap3_pg12_case53",
  "عٍ": "chap3_pg12_case54",

  "غًا": "chap3_pg12_case55",
  "غٌ": "chap3_pg12_case56",
  "غٍ": "chap3_pg12_case57",

  "فًا": "chap3_pg12_case58",
  "فٌ": "chap3_pg12_case59",
  "فٍ": "chap3_pg12_case60",

  "قًا": "chap3_pg12_case61",
  "قٌ": "chap3_pg12_case62",
  "قٍ": "chap3_pg12_case63",

  "كًا": "chap3_pg12_case64",
  "كٌ": "chap3_pg12_case65",
  "كٍ": "chap3_pg12_case66",

  "لًا": "chap3_pg12_case67",
  "لٌ": "chap3_pg12_case68",
  "لٍ": "chap3_pg12_case69",

  "مًا": "chap3_pg12_case70",
  "مٌ": "chap3_pg12_case71",
  "مٍ": "chap3_pg12_case72",

  "نًا": "chap3_pg12_case73",
  "نٌ": "chap3_pg12_case74",
  "نٍ": "chap3_pg12_case75",

  "هًا": "chap3_pg12_case76",
  "هٌ": "chap3_pg12_case77",
  "هٍ": "chap3_pg12_case78",

  "وً": "chap3_pg12_case79",
  "وٌ": "chap3_pg12_case80",
  "وٍ": "chap3_pg12_case81",

  "يًا": "chap3_pg12_case82",
  "يٌ": "chap3_pg12_case83",
  "يٍ": "chap3_pg12_case84",

  "ءً": "chap3_pg12_case1",
  "ءٌ": "chap3_pg12_case2",
  "ءٍ": "chap3_pg12_case3",

  "ـةً": "chap3_pg12_case7",
  "ـةٌ": "chap3_pg12_case8",
  "ـةٍ": "chap3_pg12_case9",
};

const Page15 = () => {
  const emphaticLetters = ["خ", "ر", "ص", "ض", "ط", "ظ", "غ", "ق"];
  const nonConnectingLetters = ["ا", "د", "ذ", "ر", "ز", "و"];

  const letterGroups = [
    { letter: "ا", vowels: ["اً", "اٌ", "اٍ"] },
    { letter: "ب", vowels: ["بًا", "بٌ", "بٍ"] },
    { letter: "ت", vowels: ["تًا", "تٌ", "تٍ"] },
    { letter: "ث", vowels: ["ثًا", "ثٌ", "ثٍ"] },
    { letter: "ج", vowels: ["جًا", "جٌ", "جٍ"] },
    { letter: "ح", vowels: ["حًا", "حٌ", "حٍ"] },
    { letter: "خ", vowels: ["خًا", "خٌ", "خٍ"] },
    { letter: "د", vowels: ["دًا", "دٌ", "دٍ"] },
    { letter: "ذ", vowels: ["ذًا", "ذٌ", "ذٍ"] },
    { letter: "ر", vowels: ["رًا", "رٌ", "رٍ"] },
    { letter: "ز", vowels: ["زًا", "زٌ", "زٍ"] },
    { letter: "س", vowels: ["سًا", "سٌ", "سٍ"] },
    { letter: "ش", vowels: ["شًا", "شٌ", "شٍ"] },
    { letter: "ص", vowels: ["صًا", "صٌ", "صٍ"] },
    { letter: "ض", vowels: ["ضًا", "ضٌ", "ضٍ"] },
    { letter: "ط", vowels: ["طًا", "طٌ", "طٍ"] },
    { letter: "ظ", vowels: ["ظًا", "ظٌ", "ظٍ"] },
    { letter: "ع", vowels: ["عًا", "عٌ", "عٍ"] },
    { letter: "غ", vowels: ["غًا", "غٌ", "غٍ"] },
    { letter: "ف", vowels: ["فًا", "فٌ", "فٍ"] },
    { letter: "ق", vowels: ["قًا", "قٌ", "قٍ"] },
    { letter: "ك", vowels: ["كًا", "كٌ", "كٍ"] },
    { letter: "ل", vowels: ["لًا", "لٌ", "لٍ"] },
    { letter: "م", vowels: ["مًا", "مٌ", "مٍ"] },
    { letter: "ن", vowels: ["نًا", "نٌ", "نٍ"] },
    { letter: "ه", vowels: ["هًا", "هٌ", "هٍ"] },
    { letter: "و", vowels: ["وً", "وٌ", "وٍ"] },
    { letter: "ي", vowels: ["يًا", "يٌ", "يٍ"] },
    { letter: "ء", vowels: ["ءً", "ءٌ", "ءٍ"] },
    { letter: "ة", vowels: ["ـةً", "ـةٌ", "ـةٍ"] },
  ];

  const vowelNames = [
    "Fathatane ( son : ane )",
    "Dammatane ( son : oune )",
    "Kassratane ( son : in )",
  ];

  const playLetterAudio = (vowelLetter: string) => {
    const audioFileName = chapter3Page15AudioMappings[vowelLetter];
    if (audioFileName) {
      const audio = new Audio(`/audio/chapitre3/${audioFileName}.mp3`);
      audio.play().catch((error) => {
        console.error("Erreur lors de la lecture audio:", error);
      });
    }
  };

  return (
    <div className="font-arabic min-h-screen" style={{ direction: "rtl" }}>
      <div className="w-full h-full bg-gray-900 overflow-hidden">
        {/* Header */}
        <div className="text-white p-6 text-center border-b-2">
          <div className="text-3xl md:text-3xl font-bold mb-4">
            Leçon : lettres attachées à la fin d’un mot avec voyelles doubles
          </div>
        </div>

        {/* Letters with Vowels Grid */}
        <div className="p-8 bg-gray-900">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {letterGroups.map((group, index) => (
              <LetterGroup
                key={index}
                letter={group.letter}
                vowels={group.vowels}
                vowelNames={vowelNames}
                emphatic={emphaticLetters.includes(group.letter)}
                nonConnecting={nonConnectingLetters.includes(group.letter)}
                onLetterClick={playLetterAudio}
              />
            ))}
          </div>

          {/* Footer */}
          <footer className="border-t-1 text-white text-center p-6 flex-shrink-0 font-semibold text-sm">
            <div>Page 15</div>
            <div className="mt-1">© 2025 Tous droits réservés</div>
          </footer>
        </div>
      </div>
    </div>
  );
};

// LetterGroup Component
const LetterGroup = ({
  letter,
  vowels,
  vowelNames,
  emphatic,
  nonConnecting,
  onLetterClick,
}: {
  letter: string;
  vowels: string[];
  vowelNames: string[];
  emphatic?: boolean;
  nonConnecting?: boolean;
  onLetterClick?: (vowelLetter: string) => void;
}) => (
  <div className="bg-gray-800 border border-zinc-500 rounded-xl p-4">
    <div className="text-center font-bold text-3xl text-white mb-4">
      {letter}
    </div>
    <div className="grid grid-cols-3 gap-3">
      {vowels.map((vowelLetter, index) => (
        <div
          key={index}
          className="bg-gray-900 border border-zinc-500 rounded-lg p-3 text-center hover:bg-zinc-600 transition-all duration-300 cursor-pointer"
          onClick={() => onLetterClick?.(vowelLetter)}
        >
          <div
            className={`text-2xl md:text-3xl font-bold mb-2 ${
              emphatic ? "text-red-400" : "text-white"
            }`}
          >
            {vowelLetter}
          </div>
          <div
            className={`text-xs font-semibold px-2 py-1 rounded ${
              index === 0
                ? "text-orange-400 bg-orange-900/30"
                : index === 1
                ? "text-blue-400 bg-blue-900/30"
                : "text-green-400 bg-green-900/30"
            }`}
          >
            {vowelNames[index]}
          </div>
          {nonConnecting && index === 0 && (
            <div className="text-xs text-purple-400 bg-purple-900/30 px-1 py-1 rounded mt-2">
              لا تتصل
            </div>
          )}
        </div>
      ))}
    </div>
  </div>
);

export default Page15;
