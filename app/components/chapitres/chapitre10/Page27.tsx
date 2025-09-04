"use client";

import React from "react";

const chapter10Page27AudioMappings: { [key: string]: string } = {
  "مُدَّتْ": "chap10_pg27_case1",
  "حُقَّتْ": "chap10_pg27_case2",
  "خَفَّتْ": "chap10_pg27_case3",
  "تَبَّتْ": "chap10_pg27_case4",
  "قَدَّمْتُ": "chap10_pg27_case5",
  "وَالصُّبْحِ": "chap10_pg27_case6",
  "وَالشَّمْسِ": "chap10_pg27_case7",
  "وَالشَّفْعِ": "chap10_pg27_case8",
  "وَالصَّيْفِ": "chap10_pg27_case9",
  "وَالَّيْلِ": "chap10_pg27_case10",
  "سِجِّيلٍ": "chap10_pg27_case11",
  "سِجِّينٌ": "chap10_pg27_case12",
  "مُنْفَكِّينَ": "chap10_pg27_case13",
  "الثَّاقِبُ": "chap10_pg27_case14",
  "مِنْ شَرِّ": "chap10_pg27_case15",
  "الْوَسْوَاسِ": "chap10_pg27_case16",
  "تَبَّتْ يَدَا أَبِي لَهَبٍ وَتَبَّ": "chap10_pg27_case17",
};

const mixedWords: string[] = [
  "مُدَّتْ","حُقَّتْ","خَفَّتْ","تَبَّتْ",
  "قَدَّمْتُ","وَالصُّبْحِ","وَالشَّمْسِ","وَالشَّفْعِ",
  "وَالصَّيْفِ","وَالَّيْلِ","سِجِّيلٍ","سِجِّينٌ","مُنْفَكِّينَ",
  "الثَّاقِبُ",
  "مِنْ شَرِّ","الْوَسْوَاسِ"
];

const verse = "تَبَّتْ يَدَا أَبِي لَهَبٍ وَتَبَّ";

const Page27 = () => {
  const playLetterAudio = (word: string) => {
    const audioFileName = chapter10Page27AudioMappings[word];
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
            Exercice : reconnaissance des mots avec la shadda et la soukoun
          </div>
        </div>

        {/* Content */}
        <div className="p-8 bg-gray-900">
          <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-8">
            {mixedWords.map((word, index) => (
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
          <div>Page 27</div>
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

export default Page27;
