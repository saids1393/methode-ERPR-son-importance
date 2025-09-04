"use client";

// components/chapitres/chapitre8/Page23.tsx
import React from "react";

const chapter8Page23AudioMappings: { [key: string]: string } = {
  // Mots simples
  "قُلْ": "chap8_pg23_case1",
  "كَلْبٌ": "chap8_pg23_case2",
  "يَوْمٍ": "chap8_pg23_case3",
  "حَسْبُ": "chap8_pg23_case4",
  "رَبْعُ": "chap8_pg23_case5",
  "مَسْجِدٌ": "chap8_pg23_case6",
  "فَلْيَنْظُرْ": "chap8_pg23_case7",
  "يَلْهَثْ": "chap8_pg23_case8",
  "مِنْ": "chap8_pg23_case9",
  "عَنْهْ": "chap8_pg23_case10",
  "لَكُمْ": "chap8_pg23_case11",
  "دِينُكُمْ": "chap8_pg23_case12",
  "وَيَمْنَعُونَ": "chap8_pg23_case13",
  "الْمَاعُونَ": "chap8_pg23_case14",
  "كَعَصْفٍ": "chap8_pg23_case15",
  "مَأْكُولٍ": "chap8_pg23_case16",
  "أَنتُمْ": "chap8_pg23_case17",
  "عَابِدُونَ": "chap8_pg23_case18",
  "أَعْبُدُ": "chap8_pg23_case19",
  "فَأَثَرْنَ": "chap8_pg23_case20",
  "نَقْعًا": "chap8_pg23_case21",
  "وَلَا": "chap8_pg23_case22",
  "تَنْهَ": "chap8_pg23_case23",
  "عَنِ": "chap8_pg23_case24",

  // Verset
  "وَيَمْنَعُونَ الْمَاعُونَ": "chap8_pg23_case25",
};

const Page23 = () => {
  const playLetterAudio = (word: string) => {
    const audioFileName = chapter8Page23AudioMappings[word];
    if (audioFileName) {
      const audio = new Audio(`/audio/chapitre8/${audioFileName}.mp3`);
      audio.play().catch((error) => {
        console.error("Erreur lors de la lecture audio:", error);
      });
    }
  };

  const quranicItems = [
    "قُلْ",
    "كَلْبٌ",
    "يَوْمٍ",
    "حَسْبُ",
    "رَبْعُ",
    "مَسْجِدٌ",
    "فَلْيَنْظُرْ",
    "يَلْهَثْ",
    "مِنْ",
    "عَنْهُ",
    "لَكُمْ",
    "دِينُكُمْ",
    "وَيَمْنَعُونَ",
    "الْمَاعُونَ",
    "كَعَصْفٍ",
    "مَأْكُولٍ",
    "أَنتُمْ",
    "عَابِدُونَ",
    "أَعْبُدُ",
    "فَأَثَرْنَ",
    "نَقْعًا",
    "وَلَا",
    "تَنْهَ",
    "عَنِ",
    { text: "وَيَمْنَعُونَ الْمَاعُونَ", color: "text-violet-400" },
  ];

  return (
    <div className="font-arabic min-h-screen" style={{ direction: "rtl" }}>
      <div className="w-full h-full bg-gray-900 overflow-hidden">
        {/* Header */}
        <div className="text-white p-6 text-center border-b-2 border-gray-700">
          <div className="text-3xl md:text-3xl font-bold">
            Exercice : reconnaissance des mots avec la soukoun
          </div>
        </div>

        {/* Content */}
        <div className="p-8 bg-gray-900">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-8">
              {quranicItems.map((item, index) => {
                const isVerse = typeof item !== "string";
                const word = isVerse ? item.text : item;
                const color = isVerse ? item.color : undefined;

                return (
                  <QuranicWordCard
                    key={index}
                    word={word}
                    color={color}
                    onClick={() => playLetterAudio(word)}
                    className={
                      isVerse
                        ? "col-span-2 sm:col-span-3 md:col-span-4 lg:col-span-6"
                        : ""
                    }
                  />
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-gray-700 text-white text-center p-6 flex-shrink-0 font-semibold text-sm">
          <div>Page 23</div>
          <div className="mt-1">© 2025 Tous droits réservés</div>
        </footer>
      </div>
    </div>
  );
};

const QuranicWordCard = ({
  word,
  color,
  onClick,
  className,
}: {
  word: string;
  color?: string;
  onClick?: () => void;
  className?: string;
}) => (
  <div
    className={`bg-gray-800 border border-gray-700 rounded-xl p-3 text-center hover:bg-gray-700 transition-all duration-300 group min-h-[90px] flex items-center justify-center cursor-pointer ${className}`}
    onClick={onClick}
  >
    <div
      className={`text-xl md:text-2xl font-bold leading-relaxed group-hover:scale-105 transition-transform duration-300 ${
        color ?? "text-white"
      }`}
    >
      {word}
    </div>
  </div>
);

export default Page23;
