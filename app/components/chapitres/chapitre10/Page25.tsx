"use client";

import React from "react";

const chapter10Page25AudioMappings: { [key: string]: string } = {
  "مَدَّ": "chap10_pg25_case1",
  "حَقَّ": "chap10_pg25_case2",
  "فُرَّ": "chap10_pg25_case3",
  "وَدَّ": "chap10_pg25_case4",
  "رُدَّ": "chap10_pg25_case5",
  "عَضَّ": "chap10_pg25_case6",
  "شَدَّ": "chap10_pg25_case7",
  "طُبَّ": "chap10_pg25_case8",
  "قَطَّ": "chap10_pg25_case9",
  "غَلَّ": "chap10_pg25_case10",
  "نَبَّ": "chap10_pg25_case11",
  "ذُبَّ": "chap10_pg25_case12",
  "حُجَّ": "chap10_pg25_case13",
  "عَدَّ": "chap10_pg25_case14",
  "بَلَّ": "chap10_pg25_case15",
  "ظَنَّ": "chap10_pg25_case16",
  "زُرَّ": "chap10_pg25_case17",
  "هَبَّ": "chap10_pg25_case18",
  "كَنَّ": "chap10_pg25_case19",
  "ضَرَّ": "chap10_pg25_case20",
  "سَرَّ": "chap10_pg25_case21",
  "نَمَّ": "chap10_pg25_case22",
  "لَبَّ": "chap10_pg25_case23",
  "فَكَّ": "chap10_pg25_case24",
  "ذَكَّ": "chap10_pg25_case25",
  "خَسَّ": "chap10_pg25_case26",
  "هَجَّ": "chap10_pg25_case27",
  "جَلَّ": "chap10_pg25_case28",
  "فَضَّ": "chap10_pg25_case29",
  "سَبَّ": "chap10_pg25_case30",
};

const shaddaWords: string[] = [
  "مَدَّ","حَقَّ","فُرَّ","وَدَّ","رُدَّ","عَضَّ",
  "شَدَّ","طُبَّ","قَطَّ","غَلَّ","نَبَّ","ذُبَّ",
  "حُجَّ","عَدَّ","بَلَّ",
  "ظَنَّ","زُرَّ","هَبَّ","كَنَّ","ضَرَّ","سَرَّ",
  "نَمَّ","لَبَّ","فَكَّ","ذَكَّ","خَسَّ","هَجَّ",
  "جَلَّ","فَضَّ","سَبَّ",
];

const Page25 = () => {
  const playLetterAudio = (word: string) => {
    const audioFileName = chapter10Page25AudioMappings[word];
    if (audioFileName) {
      const audio = new Audio(`/audio/chapitre10/${audioFileName}.mp3`);
      audio.play().catch((err) => console.error("Erreur audio:", err));
    }
  };

  return (
    <div className="font-arabic min-h-screen" style={{ direction: "rtl" }}>
      <div className="w-full h-full bg-gray-900 overflow-hidden">
        {/* Header avec bg identique à bg de base */}
        <div className="bg-gray-900 text-white p-6 text-center">
          <div className="text-3xl font-bold">Leçon : la shaddah</div>
        </div>

        {/* Content */}
        <div className="p-8">
          <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-8">
            {shaddaWords.map((word, index) => (
              <ShaddaWordCard key={index} word={word} onClick={() => playLetterAudio(word)} />
            ))}
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-gray-700 text-white text-center p-6 font-semibold text-sm select-none">
          <div>Page 25</div>
          <div className="mt-1">© 2025 Tous droits réservés</div>
        </footer>
      </div>
    </div>
  );
};

const ShaddaWordCard = ({ word, onClick }: { word: string; onClick?: () => void }) => (
  <div
    className="bg-gray-800 border border-gray-700 rounded-xl p-3 text-center cursor-pointer hover:bg-gray-700 transition-all duration-300 min-h-[90px] flex items-center justify-center"
    onClick={onClick}
  >
    <div className="text-2xl md:text-3xl font-bold text-white group-hover:scale-105 transition-transform duration-300">
      {word}
    </div>
  </div>
);

export default Page25;
