"use client";

import React from "react";

const chapter10Page26AudioMappings: { [key: string]: string } = {
  "اللَّهَ": "chap10_pg26_case2",
  "مُصَدِّقٌ": "chap10_pg26_case3",
  "الرَّحْمَٰنِ": "chap10_pg26_case4",
  "الرَّحِيمِ": "chap10_pg26_case5",
  "الصَّبِرِ": "chap10_pg26_case6",
  "الظَّالِمِينَ": "chap10_pg26_case7",
  "تَبَّتْ": "chap10_pg26_case8",
  "شَدِّدْ": "chap10_pg26_case9",
  "جَنَّاتٍ": "chap10_pg26_case10",
  "السَّلَامُ": "chap10_pg26_case11",
  "الْمُؤْمِنِينَ": "chap10_pg26_case12",
  "ضَرَّ": "chap10_pg26_case13",
  "تُبِّ": "chap10_pg26_case14",
  "النَّاسِ": "chap10_pg26_case15",
  "الشَّيْطَانُ": "chap10_pg26_case16",
  "الصَّالِحِينَ": "chap10_pg26_case17",
  "مُصَدَّقِينَ": "chap10_pg26_case18",
  "وَصَّىٰ": "chap10_pg26_case19",
  "نَذَّرْتُكُمْ": "chap10_pg26_case20",
  "قَدَّرْنَا": "chap10_pg26_case21",
  "تَذَكَّرُوا": "chap10_pg26_case22",
  "إِنَّ اللَّهَ غَفُورٌ رَحِيمٌ": "chap10_pg26_case23",
};

const quranicWords: string[] = [
  "اللَّهَ","مُصَدِّقٌ","الرَّحْمَٰنِ","الرَّحِيمِ","الصَّبِرِ",
  "الظَّالِمِينَ","تَبَّتْ","شَدِّدْ",
  "جَنَّاتٍ","السَّلَامُ",
  "الْمُؤْمِنِينَ","ضَرَّ","تُبِّ",
  "النَّاسِ",
  "الشَّيْطَانُ",
  "الصَّالِحِينَ","مُصَدَّقِينَ","وَصَّىٰ",
  "نَذَّرْتُكُمْ","قَدَّرْنَا","تَذَكَّرُوا"
];

const verse = "إِنَّ اللَّهَ غَفُورٌ رَحِيمٌ";

const Page26 = () => {
  const playLetterAudio = (word: string) => {
    const audioFileName = chapter10Page26AudioMappings[word];
    if (audioFileName) {
      const audio = new Audio(`/audio/chapitre10/${audioFileName}.mp3`);
      audio.play().catch((err) => console.error("Erreur audio:", err));
    }
  };

  return (
    <div className="font-arabic min-h-screen" style={{ direction: "rtl" }}>
      <div className="w-full h-full bg-gray-900 overflow-hidden">
        {/* Header */}
        <div className="text-white p-6 text-center border-b-2 border-gray-700">
          <div className="text-3xl md:text-3xl font-bold">
            Exercice : reconnaissance des mots avec la shaddah
          </div>
        </div>

        {/* Content */}
        <div className="p-8 bg-gray-900">
          <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-8">
            {quranicWords.map((word, index) => (
              <WordCard key={index} word={word} onClick={() => playLetterAudio(word)} />
            ))}
          </div>

          {/* Verse Section */}
          <div
            className="bg-gray-800 border border-gray-700 rounded-xl p-8 text-center cursor-pointer hover:bg-gray-700 transition-colors"
            onClick={() => playLetterAudio(verse)}
          >
            <div className="text-2xl md:text-3xl font-bold leading-relaxed text-white">
              {verse}
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-gray-700 text-white text-center p-6 flex-shrink-0 font-semibold text-sm">
          <div>Page 26</div>
          <div className="mt-1">© 2025 Tous droits réservés</div>
        </footer>
      </div>
    </div>
  );
};

const WordCard = ({ word, onClick }: { word: string; onClick?: () => void }) => (
  <div
    className="bg-gray-800 border border-gray-700 rounded-xl p-3 text-center hover:bg-gray-700 transition-all duration-300 min-h-[90px] flex items-center justify-center cursor-pointer"
    onClick={onClick}
  >
    <div
      className="text-2xl md:text-3xl font-bold leading-relaxed text-white group-hover:scale-105 transition-transform duration-300 break-keep"
      dir="rtl"
      lang="ar"
      style={{ fontFeatureSettings: '"calt" 1, "liga" 1' }}
    >
      {word}
    </div>
  </div>
);

export default Page26;
