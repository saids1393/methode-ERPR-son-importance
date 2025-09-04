"use client";

import React from "react";

const chapter10Page28AudioMappings: { [key: string]: string } = {
  "بِسْمِ": "chap10_pg28_case1",
  "ٱللَّهِ": "chap10_pg28_case2",
  "ٱلرَّحْمَٰنِ": "chap10_pg28_case3",
  "ٱلرَّحِيمِ": "chap10_pg28_case4",
  "ٱلْحَمْدُ": "chap10_pg28_case5",
  "لِلَّهِ": "chap10_pg28_case6",
  "رَبِّ": "chap10_pg28_case7",
  "ٱلْعَالَمِينَ": "chap10_pg28_case8",
  "مَالِكِ": "chap10_pg28_case9",
  "يَوْمِ": "chap10_pg28_case10",
  "ٱلدِّينِ": "chap10_pg28_case11",
  "إِيَّاكَ": "chap10_pg28_case12",
  "نَعْبُدُ": "chap10_pg28_case13",
  "وَإِيَّاكَ": "chap10_pg28_case14",
  "نَسْتَعِينُ": "chap10_pg28_case15",
  "ٱهْدِنَا": "chap10_pg28_case16",
  "ٱلصِّرَٰطَ": "chap10_pg28_case17",
  "غَيْرِ": "chap10_pg28_case21",
  "ٱلْمَغْضُوبِ": "chap10_pg28_case22",
  "وَلَا": "chap10_pg28_case23",
  "ٱلضَّالِّينَ": "chap10_pg28_case24",
  "أَحَدٌ": "chap10_pg28_case25",
  "صَمَدٌ": "chap10_pg28_case26",
  "كُفُوًا": "chap10_pg28_case27",
  "قُلْ": "chap10_pg28_case28",
  "أَعُوذُ": "chap10_pg28_case29",
  "بِرَبِّ": "chap10_pg28_case30",
  "ٱلْفَلَقِ": "chap10_pg28_case31",
  "مِنْ": "chap10_pg28_case32",
  "شَرِّ": "chap10_pg28_case33",
  "غَاسِقٍ": "chap10_pg28_case34",
  "إِذَا": "chap10_pg28_case35",
  "وَقَبَ": "chap10_pg28_case36",
  "سُورَةٌ": "chap10_pg28_case37",
  "ٱلْبَقَرَةِ": "chap10_pg28_case38",
  "ٱلسَّمَاءِ": "chap10_pg28_case39",
  "مَاءً": "chap10_pg28_case40",
  "ٱلصَّلَاةَ": "chap10_pg28_case41",
  "ٱلزَّكَاةَ": "chap10_pg28_case42",
  "خَوْفٍ": "chap10_pg28_case43",
  "بَيْتِ": "chap10_pg28_case44",
  "قُرَيْشٍ": "chap10_pg28_case45",
  "مُوسَىٰ": "chap10_pg28_case46",
  "عِيسَىٰ": "chap10_pg28_case47",
  "يَحْيَىٰ": "chap10_pg28_case48",
  "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ": "chap10_pg28_case49",
  "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ": "chap10_pg28_case50",
};

const quranicWords = [
  "بِسْمِ","ٱللَّهِ","ٱلرَّحْمَٰنِ","ٱلرَّحِيمِ","ٱلْحَمْدُ","لِلَّهِ",
  "رَبِّ","ٱلْعَالَمِينَ","ٱلرَّحْمَٰنِ","ٱلرَّحِيمِ","مَالِكِ","يَوْمِ",
  "ٱلدِّينِ","إِيَّاكَ","نَعْبُدُ","وَإِيَّاكَ","نَسْتَعِينُ","ٱهْدِنَا",
  "ٱلصِّرَٰطَ","غَيْرِ","ٱلْمَغْضُوبِ","وَلَا","ٱلضَّالِّينَ",
  "أَحَدٌ","صَمَدٌ","كُفُوًا",
  "قُلْ","أَعُوذُ","بِرَبِّ","ٱلْفَلَقِ","مِنْ","شَرِّ","غَاسِقٍ","إِذَا","وَقَبَ",
  "سُورَةٌ","ٱلْبَقَرَةِ","ٱلسَّمَاءِ","مَاءً","ٱلصَّلَاةَ","ٱلزَّكَاةَ",
  "خَوْفٍ","بَيْتِ","قُرَيْشٍ",
  "مُوسَىٰ","عِيسَىٰ","يَحْيَىٰ"
];

const verseSegments = [
  "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
  "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ"
];

const Page28 = () => {
  const playLetterAudio = (word: string) => {
    const audioFileName = chapter10Page28AudioMappings[word];
    if (audioFileName) {
      const audio = new Audio(`/audio/chapitre10/${audioFileName}.mp3`);
      audio.play().catch(err => console.error("Erreur audio:", err));
    }
  };

  return (
    <div className="font-arabic min-h-screen" style={{ direction: "rtl" }}>
      <div className="w-full h-full bg-gray-900 overflow-hidden">
        {/* Header */}
        <div className="text-white p-6 text-center border-b-2 border-gray-700">
          <div className="text-3xl md:text-3xl font-bold">
            Exercice : reconnaissance des mots avec toutes les règles de la méthode
          </div>
        </div>

        {/* Content */}
        <div className="p-8 bg-gray-900 max-w-6xl mx-auto">
          {/* Grid of Words */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-8">
            {quranicWords.map((word, idx) => (
              <WordCard key={idx} word={word} onClick={() => playLetterAudio(word)} />
            ))}
          </div>

          {/* Verse Section */}
          <div className="grid gap-4">
            {verseSegments.map((verse, idx) => (
              <div
                key={idx}
                className="bg-gray-800 border border-gray-700 rounded-xl p-6 text-center cursor-pointer hover:bg-gray-700 transition-colors"
                onClick={() => playLetterAudio(verse)}
              >
                <div className="text-2xl md:text-3xl font-bold leading-relaxed text-white">
                  {verse}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-gray-700 text-white text-center p-6 flex-shrink-0 font-semibold text-sm">
          <div>Page 28</div>
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
    <div className="text-2xl md:text-3xl font-bold leading-relaxed text-white">
      {word}
    </div>
  </div>
);

export default Page28;
