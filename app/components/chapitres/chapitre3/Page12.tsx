"use client";

// components/chapitres/chapitre3/Page12.tsx
import React from "react";


// Mapping audio pour le Chapitre 3, Page 12 (voyelles doubles sur lettres isolées)
const chapter3Page12AudioMappings: { [key: string]: string } = {
  'اً': 'chap3_pg12_case1', 'اٌ': 'chap3_pg12_case2', 'اٍ': 'chap3_pg12_case3',
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
  'أً': 'chap3_pg12_case85', 'أٌ': 'chap3_pg12_case86', 'إٍ': 'chap3_pg12_case87'
  
};

const Page12 = () => {
  const playLetterAudio = (vowelLetter: string) => {
    const audioFileName = chapter3Page12AudioMappings[vowelLetter];
    if (audioFileName) {
      const audio = new Audio(`/audio/chapitre3/${audioFileName}.mp3`);
      audio.play().catch(error => {
        console.error("Erreur lors de la lecture audio:", error);
      });
    }
  };

  const emphaticLetters = ['خ', 'ر', 'ص', 'ض', 'ط', 'ظ', 'غ', 'ق'];
  const nonConnectingLetters = ['ا', 'د', 'ذ', 'ر', 'ز', 'و'];

  const letterGroups = [
    { vowels: ['اً', 'اٌ', 'اٍ'] },
    { vowels: ['بً', 'بٌ', 'بٍ'] },
    { vowels: ['تً', 'تٌ', 'تٍ'] },
    { vowels: ['ثً', 'ثٌ', 'ثٍ'] },
    { vowels: ['جً', 'جٌ', 'جٍ'] },
    { vowels: ['حً', 'حٌ', 'حٍ'] },
    { vowels: ['خً', 'خٌ', 'خٍ'] },
    { vowels: ['دً', 'دٌ', 'دٍ'] },
    { vowels: ['ذً', 'ذٌ', 'ذٍ'] },
    { vowels: ['رً', 'رٌ', 'رٍ'] },
    { vowels: ['زً', 'زٌ', 'زٍ'] },
    { vowels: ['سً', 'سٌ', 'سٍ'] },
    { vowels: ['شً', 'شٌ', 'شٍ'] },
    { vowels: ['صً', 'صٌ', 'صٍ'] },
    { vowels: ['ضً', 'ضٌ', 'ضٍ'] },
    { vowels: ['طً', 'طٌ', 'طٍ'] },
    { vowels: ['ظً', 'ظٌ', 'ظٍ'] },
    { vowels: ['عً', 'عٌ', 'عٍ'] },
    { vowels: ['غً', 'غٌ', 'غٍ'] },
    { vowels: ['فً', 'فٌ', 'فٍ'] },
    { vowels: ['قً', 'قٌ', 'قٍ'] },
    { vowels: ['كً', 'كٌ', 'كٍ'] },
    { vowels: ['لً', 'لٌ', 'لٍ'] },
    { vowels: ['مً', 'مٌ', 'مٍ'] },
    { vowels: ['نً', 'نٌ', 'نٍ'] },
    { vowels: ['هً', 'هٌ', 'هٍ'] },
    { vowels: ['وً', 'وٌ', 'وٍ'] },
    { vowels: ['يً', 'يٌ', 'يٍ'] },
    { vowels: ['أً', 'أٌ', 'إٍ'] }
  ];

  const vowelNames = [
    "Fathatane ( son : ane )",
    "Dammatane ( son : oune)",
    "Kassratane ( son : in)"
  ];

  return (
    <div className="font-arabic min-h-screen" style={{ direction: "rtl" }}>
      <div className="w-full h-full bg-zinc-900 overflow-hidden">
        <div className="bg-arabic-gradient text-white p-6 text-center">
          <div className="text-3xl md:text-3xl font-bold">
            Leçon : lettres seules (non attachées) avec voyelles doubles
          </div>
        </div>

        <div className="p-8 bg-zinc-900">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {letterGroups.map((group, index) => (
              <LetterGroup
                key={index}
                vowels={group.vowels}
                vowelNames={vowelNames}
                emphatic={emphaticLetters.includes(group.vowels[0].replace(/[\u064B-\u0652]/g, ""))}
                nonConnecting={nonConnectingLetters.includes(group.vowels[0].replace(/[\u064B-\u0652]/g, ""))}
                onLetterClick={playLetterAudio}
              />
            ))}
          </div>
        </div>

        <footer className="bg-zinc-800 text-white text-center p-6 flex-shrink-0 font-semibold text-sm">
          <div>Page 13</div>
          <div className="mt-1">© 2025 Tous droits réservés</div>
        </footer>
      </div>
    </div>
  );
};

const LetterGroup = ({
  vowels,
  vowelNames,
  emphatic,
  nonConnecting,
  onLetterClick
}: {
  vowels: string[];
  vowelNames: string[];
  emphatic?: boolean;
  nonConnecting?: boolean;
  onLetterClick?: (vowelLetter: string) => void;
}) => {
  // Extraction de la lettre de base sans voyelle ni tanwin
  const baseForm = vowels[0].replace(/[\u064B-\u0652]/g, "");

  return (
    <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-4">
      <div className="text-center font-bold text-3xl text-white mb-4">
        {baseForm}
      </div>
      <div className="grid grid-cols-3 gap-3">
        {vowels.map((vowelLetter, index) => (
          <div
            key={index}
            className="bg-zinc-700 border border-zinc-600 rounded-lg p-3 text-center hover:bg-zinc-600 transition-all duration-300 relative cursor-pointer"
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
};

export default Page12;
