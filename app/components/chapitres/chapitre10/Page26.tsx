"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
  "اللَّهَ", "مُصَدِّقٌ", "الرَّحْمَٰنِ", "الرَّحِيمِ", "الصَّبِرِ",
  "الظَّالِمِينَ", "تَبَّتْ", "شَدِّدْ",
  "جَنَّاتٍ", "السَّلَامُ",
  "الْمُؤْمِنِينَ", "ضَرَّ", "تُبِّ",
  "النَّاسِ",
  "الشَّيْطَانُ",
  "الصَّالِحِينَ", "مُصَدَّقِينَ", "وَصَّىٰ",
  "نَذَّرْتُكُمْ", "قَدَّرْنَا", "تَذَكَّرُوا"
];

const verse = "إِنَّ اللَّهَ غَفُورٌ رَحِيمٌ";

const playLetterAudio = (word: string) => {
  const audioFileName = chapter10Page26AudioMappings[word];
  if (audioFileName) {
    const audio = new Audio(`/audio/chapitre10/${audioFileName}.mp3`);
    audio.play().catch((err) => console.error("Erreur audio:", err));
  }
};

// === 📘 Introduction Page ===
const IntroductionPage = () => (
  <div className="p-4 md:p-8 bg-gray-900">
    <div className="w-full bg-gray-800 rounded-lg p-6 md:p-8">
      <div className="text-white space-y-6 text-lg md:text-xl leading-relaxed">
        <p>
          ✨ <span className="text-amber-400 font-semibold">Vous avez terminé le cours théorique !</span>
        </p>

        <p>
          Félicitations ! Vous avez appris tous les éléments fondamentaux du Tajweed :
          les voyelles, les prolongations, le Soukoun, les lettres solaires et lunaires,
          et la Chaddah. Maintenant, il est temps d'appliquer ces connaissances à des
          <span className="text-cyan-400 font-semibold"> mots coraniques authentiques</span>.
        </p>

        <div className="bg-blue-900/30 border border-blue-500/50 rounded-lg p-4 md:p-6">
          <p>
            🎯 <span className="font-semibold">Cette leçon de reconnaissance :</span>
            <br />
            <br />
            Cette page contient des mots réels du Coran qui utilisent TOUS les concepts
            que vous avez appris. Chaque mot est une combinaison de :
            <br />
            • Voyelles courtes (Fatha, Damma, Kasra)
            <br />
            • Prolongations (Alif, Waw, Ya)
            <br />
            • Soukoun (absence de voyelle)
            <br />
            • Lettres solaires et lunaires
            <br />
            • Chaddah (doublement de lettres)
          </p>
        </div>

        <p>
          💡 <span className="font-semibold">Comment pratiquer :</span>
          <br />
          1. Écoutez chaque mot en cliquant dessus
          <br />
          2. Essayez d'identifier quels éléments vous reconnaissez
          <br />
          3. Prononcez le mot après l'avoir entendu
          <br />
          4. Écoutez le verset complet à la fin pour voir comment tout s'assemble
        </p>

        <div className="bg-purple-900/30 border border-purple-500/50 rounded-lg p-4 md:p-6 space-y-3">
          <p>
            <span className="font-semibold text-amber-300">Exemples de mots coraniques :</span>
            <br />
            • <span className="text-yellow-400 text-lg">اللَّهَ</span> = Allah (contient Lam solaire)
            <br />
            • <span className="text-yellow-400 text-lg">الرَّحْمَٰنِ</span> = Ar-Rahman (Alif saghirah + Lam solaire)
            <br />
            • <span className="text-yellow-400 text-lg">جَنَّاتٍ</span> = Jannaat (doublement du Noon)
          </p>

          <p>
            <span className="font-semibold text-amber-300">Verset complet :</span>
            <br />
            <span className="text-yellow-400 text-lg">إِنَّ اللَّهَ غَفُورٌ رَحِيمٌ</span>
            <br />
            <span className="text-gray-300">Traduction : "Certes, Allah est Pardonneur et Miséricordieux"</span>
          </p>
        </div>

        <p>
          🌟 <span className="font-semibold">Conseil final :</span>
          <br />
          Vous avez parcouru un long chemin ! Ces mots coraniques sont la preuve que
          tous ces éléments fonctionnent ensemble pour créer la beauté du Tajweed.
          Continuez votre pratique, écoutez régulièrement, et vous verrez votre récitation
          s'améliorer considérablement. Excellente pratique ! 🎵
        </p>
      </div>
    </div>

    <footer className="border-t-1 text-white text-center p-4 md:p-6 mt-8 font-semibold text-base md:text-lg">
      <div>Leçon 26 : Application complète - Mots coraniques</div>
      <div className="mt-1">© 2025 Tous droits réservés</div>
    </footer>
  </div>
);

// === 🧱 Word Card ===
const WordCard = ({ word, onClick }: { word: string; onClick?: () => void }) => (
  <div
    className="bg-gray-800 border border-gray-700 rounded-xl p-3 text-center hover:bg-gray-700 transition-all duration-300 group min-h-[120px] flex items-center justify-center cursor-pointer"
    onClick={onClick}
  >
    <div
      className="text-4xl md:text-5xl font-bold leading-relaxed text-white group-hover:scale-105 transition-transform duration-300 break-keep"
      dir="rtl"
      lang="ar"
      style={{ fontFeatureSettings: '"calt" 1, "liga" 1' }}
    >
      {word}
    </div>
  </div>
);

// === 🧱 Verse Card ===
const VerseCard = ({ verse, onClick }: { verse: string; onClick?: () => void }) => (
  <div
    className="bg-gradient-to-r from-purple-900/40 to-blue-900/40 border-2 border-purple-500/50 rounded-xl p-6 md:p-8 text-center cursor-pointer hover:from-purple-900/60 hover:to-blue-900/60 transition-all duration-300 min-h-[140px] flex items-center justify-center"
    onClick={onClick}
  >
    <div
      className="text-4xl md:text-5xl font-bold leading-relaxed text-white group-hover:scale-105 transition-transform duration-300 break-keep"
      dir="rtl"
      lang="ar"
      style={{ fontFeatureSettings: '"calt" 1, "liga" 1' }}
    >
      {verse}
    </div>
  </div>
);

// === 📖 Exercise Page ===
const ExercisePage = () => (
  <div className="p-4 md:p-8 bg-gray-900" dir="rtl">
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Words Grid */}
      <div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-8">
          {quranicWords.map((word, index) => (
            <WordCard key={index} word={word} onClick={() => playLetterAudio(word)} />
          ))}
        </div>
      </div>

      {/* Verse Section */}
      <div className="space-y-4">
        <div className="text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-amber-300 mb-4">
            Verset Complet
          </h2>
        </div>
        <VerseCard verse={verse} onClick={() => playLetterAudio(verse)} />
      </div>
    </div>

    <footer className="border-t-1 text-white text-center p-4 md:p-6 mt-12 font-semibold text-sm md:text-base">
      <div>Page 26 - Application complète du Tajweed</div>
      <div className="mt-1">© 2025 Tous droits réservés</div>
    </footer>
  </div>
);

// === 📖 Main Component ===
const Page26 = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = 2;

  return (
    <div className="font-arabic min-h-screen bg-gray-900">
      <div className="text-white p-4 md:p-6 text-center border-b-2">
        <div className="text-2xl md:text-3xl font-bold mb-2">
          {currentPage === 0
            ? "Leçon 26 : Application complète - Mots coraniques"
            : "Leçon 26 : Exercice de reconnaissance"}
        </div>
        {currentPage === 1 && (
          <div className="text-md md:text-lg text-amber-300">
            Cliquez sur chaque mot pour écouter et reconnaître les éléments du Tajweed.
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

export default Page26;