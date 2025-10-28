"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
  "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ": "chap10_pg28_case49",
  "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ": "chap10_pg28_case50",
};

const quranicWords = [
  "بِسْمِ", "ٱللَّهِ", "ٱلرَّحْمَٰنِ", "ٱلرَّحِيمِ", "ٱلْحَمْدُ", "لِلَّهِ",
  "رَبِّ", "ٱلْعَالَمِينَ", "ٱلرَّحْمَٰنِ", "ٱلرَّحِيمِ", "مَالِكِ", "يَوْمِ",
  "ٱلدِّينِ", "إِيَّاكَ", "نَعْبُدُ", "وَإِيَّاكَ", "نَسْتَعِينُ", "ٱهْدِنَا",
  "ٱلصِّرَٰطَ", "غَيْرِ", "ٱلْمَغْضُوبِ", "وَلَا", "ٱلضَّالِّينَ",
  "أَحَدٌ", "صَمَدٌ", "كُفُوًا",
  "قُلْ", "أَعُوذُ", "بِرَبِّ", "ٱلْفَلَقِ", "مِنْ", "شَرِّ", "غَاسِقٍ", "إِذَا", "وَقَبَ",
  "سُورَةٌ", "ٱلْبَقَرَةِ", "ٱلسَّمَاءِ", "مَاءً", "ٱلصَّلَاةَ", "ٱلزَّكَاةَ",
  "خَوْفٍ", "بَيْتِ", "قُرَيْشٍ",
  "مُوسَىٰ", "عِيسَىٰ", "يَحْيَىٰ"
];

const verseSegments = [
  "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
  "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ"
];

const playLetterAudio = (word: string) => {
  const audioFileName = chapter10Page28AudioMappings[word];
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
          🎊 <span className="text-amber-400 font-semibold">Félicitations ! Vous avez terminé le cours complet du Tajweed !</span>
        </p>

        <p>
          Vous avez parcouru un chemin extraordinaire ! De la première voyelle à la combinaison
          de toutes les règles avancées, vous maîtrisez maintenant les fondamentaux du
          <span className="text-yellow-400 font-semibold"> Tajweed</span>. Cette dernière leçon vous présente
          les <span className="text-cyan-400 font-semibold">mots coraniques les plus sacrés</span> et les plus courants.
        </p>

        <div className="bg-blue-900/30 border border-blue-500/50 rounded-lg p-4 md:p-6">
          <p>
            ✨ <span className="font-semibold">Résumé de votre apprentissage :</span>
            <br />
            <br />
            ✅ Les voyelles courtes (Fatha, Damma, Kasra)
            <br />
            ✅ Le Soukoun (absence de voyelle)
            <br />
            ✅ Les prolongations (Alif, Waw, Ya)
            <br />
            ✅ Les Alif, Waw, Ya Saghirah
            <br />
            ✅ Les lettres solaires et lunaires
            <br />
            ✅ La Chaddah (doublement de lettres)
            <br />
            ✅ Les combinaisons avancées de tous ces éléments
          </p>
        </div>

        <p>
          🌟 <span className="font-semibold">Les versets de cette leçon :</span>
        </p>

        <div className="bg-purple-900/30 border border-purple-500/50 rounded-lg p-4 md:p-6 space-y-3">
          <p>
            <span className="text-yellow-400 text-lg">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</span>
            <br />
            <span className="text-gray-300">"Au nom d'Allah, le Miséricordieux, le Très Miséricordieux"</span>
            <br />
            <span className="text-amber-300 text-sm">La Basmallah - récitée au début de chaque Sourate (sauf une)</span>
          </p>

          <p>
            <span className="text-yellow-400 text-lg">إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ</span>
            <br />
            <span className="text-gray-300">"C'est Toi seul que nous adorons et c'est Toi seul dont nous sollicitons l'aide"</span>
            <br />
            <span className="text-amber-300 text-sm">Verset 5 de la Sourate Al-Fatiha</span>
          </p>
        </div>

        <p>
          💡 <span className="font-semibold">Comment continuer votre progression :</span>
          <br />
          1. Écoutez régulièrement des récitations coraniques de qualité
          <br />
          2. Pratiquez votre propre récitation avec patience et persévérance
          <br />
          3. Consultez un maître de Tajweed pour affiner votre technique
          <br />
          4. Lisez le Coran quotidiennement en appliquant les règles apprises
          <br />
          5. Écoutez les grands récitants (Qurraa) pour inspirer votre récitation
        </p>

        <div className="bg-green-900/30 border border-green-500/50 rounded-lg p-4 md:p-6">
          <p>
            🏆 <span className="font-semibold">Message final :</span>
            <br />
            <br />
            Vous avez maintenant les clés pour comprendre et réciter le Coran avec respect et beauté.
            Le Tajweed n'est pas une destination, mais un <span className="text-amber-300">voyage continu d'amélioration</span>.
            <br />
            <br />
            Que votre apprentissage soit une source de guidance et de bénédiction.
            Continuez avec dévouement, car chaque lettre récitée avec intention a une grande valeur.
            <br />
            <br />
            <span className="text-amber-300 font-semibold">Baraka Allahoufika wa Assalamu alaikum wa Rahmatoullahi wa Barakatuh</span>
            <br />
            <span className="text-gray-300 text-sm">(Que la bénédiction d'Allah soit avec vous et que la paix, la miséricorde et les bénédictions d'Allah soient sur vous)</span>
          </p>
        </div>
      </div>
    </div>

    <footer className="border-t-1 text-white text-center p-4 md:p-6 mt-8 font-semibold text-base md:text-lg">
      <div>Leçon 28 : Dernier exercice - Synthèse complète du Tajweed</div>
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
    className="bg-gradient-to-r from-green-900/40 to-emerald-900/40 border-2 border-green-500/50 rounded-xl p-6 md:p-8 text-center cursor-pointer hover:from-green-900/60 hover:to-emerald-900/60 transition-all duration-300 min-h-[140px] flex items-center justify-center"
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
        <h2 className="text-2xl md:text-3xl font-bold text-center text-amber-300 mb-6">
          Mots Coraniques
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-8">
          {quranicWords.map((word, index) => (
            <WordCard key={index} word={word} onClick={() => playLetterAudio(word)} />
          ))}
        </div>
      </div>

      {/* Verse Section */}
      <div className="space-y-4">
        <div className="text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-amber-300 mb-2">
            Versets Sacrés
          </h2>
          <p className="text-gray-400 text-lg">
            Les plus importants versets coraniques
          </p>
        </div>
        <div className="grid gap-4">
          {verseSegments.map((verse, index) => (
            <VerseCard key={index} verse={verse} onClick={() => playLetterAudio(verse)} />
          ))}
        </div>
      </div>
    </div>

    <footer className="border-t-1 text-white text-center p-4 md:p-6 mt-12 font-semibold text-sm md:text-base">
      <div>Page 28 - Dernière leçon : Synthèse complète du Tajweed</div>
      <div className="mt-1">© 2025 Tous droits réservés</div>
    </footer>
  </div>
);

// === 📖 Main Component ===
const Page28 = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = 2;

  return (
    <div className="font-arabic min-h-screen bg-gray-900">
      <div className="text-white p-4 md:p-6 text-center border-b-2">
        <div className="text-2xl md:text-3xl font-bold mb-2">
          {currentPage === 0
            ? "Leçon 28 : Dernier exercice - Synthèse complète du Tajweed"
            : "Leçon 28 : Exercice final"}
        </div>
        {currentPage === 1 && (
          <div className="text-md md:text-lg text-amber-300">
            Bravo ! Écoutez les versets sacrés - Application finale de tous vos apprentissages.
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

export default Page28;