"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import PageNavigation from '@/app/components/PageNavigation';

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
  "مُدَّتْ", "حُقَّتْ", "خَفَّتْ", "تَبَّتْ",
  "قَدَّمْتُ", "وَالصُّبْحِ", "وَالشَّمْسِ", "وَالشَّفْعِ",
  "وَالصَّيْفِ", "وَالَّيْلِ", "سِجِّيلٍ", "سِجِّينٌ", "مُنْفَكِّينَ",
  "الثَّاقِبُ",
  "مِنْ شَرِّ", "الْوَسْوَاسِ"
];

const verse = "تَبَّتْ يَدَا أَبِي لَهَبٍ وَتَبَّ";

const playLetterAudio = (word: string) => {
  const audioFileName = chapter10Page27AudioMappings[word];
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
          🎯 <span className="text-amber-400 font-semibold">Leçon 27 : Combinaisons avancées</span>
        </p>

        <p>
          Vous progressez bien ! Cette leçon combine plusieurs concepts que vous avez appris :
          la <span className="text-yellow-400 font-semibold">Chaddah</span> avec le
          <span className="text-cyan-400 font-semibold"> Soukoun</span>, ainsi que les
          <span className="text-blue-400 font-semibold"> lettres solaires et lunaires</span> appliquées
          à des mots coraniques plus complexes.
        </p>

        <div className="bg-blue-900/30 border border-blue-500/50 rounded-lg p-4 md:p-6">
          <p>
            ✨ <span className="font-semibold">Combinaison avancée : Chaddah + Soukoun</span>
            <br />
            <br />
            Jusqu'à maintenant, vous avez appris la Chaddah sur des voyelles. Mais en arabe,
            la Chaddah peut aussi apparaître avec le <span className="text-orange-400 font-semibold">Soukoun</span> !
            <br />
            <br />
            Cela signifie : la lettre est <span className="text-orange-400 font-semibold">doublée ET arrêtée</span>.
            La première prononciation de la lettre porte la voyelle, la deuxième porte le Soukoun.
          </p>
        </div>

        <p>
          🎯 <span className="font-semibold">Exemples de Chaddah + Soukoun :</span>
        </p>

        <div className="bg-purple-900/30 border border-purple-500/50 rounded-lg p-4 md:p-6 space-y-3">
          <p>
            <span className="text-yellow-400 text-lg">تَبَّتْ</span> = Tabbat (a péri)
            <br />
            <span className="text-gray-300">• Ba porte Fatha + Chaddah → Ba est doublée</span>
            <br />
            <span className="text-gray-300">• Ta porte Soukoun → Ta s'arrête net</span>
            <br />
            <span className="text-gray-300">• Prononciation : Ta-Fatha-Ba-Ba-Ta (arrêtée)</span>
          </p>

          <p>
            <span className="text-yellow-400 text-lg">مِنْ شَرِّ</span> = Min Charr (du mal)
            <br />
            <span className="text-gray-300">• Noon porte Soukoun → s'arrête</span>
            <br />
            <span className="text-gray-300">• Sheen porte Fatha + Chaddah → Sheen est doublée</span>
            <br />
            <span className="text-gray-300">• Ra porte Kasra + Chaddah → Ra est doublée</span>
          </p>

          <p>
            <span className="text-yellow-400 text-lg">الْوَسْوَاسِ</span> = Al-waswas (le susurrement)
            <br />
            <span className="text-gray-300">• Lam et Waw portent Soukoun → arrêtées</span>
            <br />
            <span className="text-gray-300">• Waw répétée avec Fatha et Kasra</span>
          </p>
        </div>

        <p>
          💡 <span className="font-semibold">Points clés pour cette leçon :</span>
          <br />
          1. Vous verrez des mots avec <span className="text-orange-400">Chaddah + Soukoun</span> simultanément
          <br />
          2. Les <span className="text-yellow-400">lettres solaires</span> et <span className="text-blue-400">lunaires</span> continuent à s'appliquer
          <br />
          3. Les <span className="text-cyan-400">Alif saghirah, Waw saghirah, Ya saghirah</span> peuvent apparaître
        </p>

        <p>
          Pratiquez avec attention et continuez votre progression. Les leçons suivantes
          vous attendront avec d'autres concepts importants ! 🎵
        </p>
      </div>
    </div>

    <footer className="border-t-1 text-white text-center p-4 md:p-6 mt-8 font-semibold text-base md:text-lg">
      <div>Leçon 27 : Combinaisons avancées - Chaddah + Soukoun</div>
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
    className="bg-gradient-to-r from-amber-900/40 to-red-900/40 border-2 border-amber-500/50 rounded-xl p-6 md:p-8 text-center cursor-pointer hover:from-amber-900/60 hover:to-red-900/60 transition-all duration-300 min-h-[140px] flex items-center justify-center"
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
          {mixedWords.map((word, index) => (
            <WordCard key={index} word={word} onClick={() => playLetterAudio(word)} />
          ))}
        </div>
      </div>

      {/* Verse Section */}
      <div className="space-y-4">
        <div className="text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-amber-300 mb-4">
            Verset Exemple
          </h2>
          <p className="text-gray-400 text-lg">
            Sourate Al-Masad (111), verset 1
          </p>
        </div>
        <VerseCard verse={verse} onClick={() => playLetterAudio(verse)} />
      </div>
    </div>

    
      <PageNavigation currentChapter={10} currentPage={27} module="LECTURE" className="mt-6 mb-4" />

<footer className="border-t-1 text-white text-center p-4 md:p-6 mt-12 font-semibold text-sm md:text-base">
      <div>Page 27 - Exercice sur les combinaisons avancées</div>
      <div className="mt-1">© 2025 Tous droits réservés</div>
    </footer>
  </div>
);

// === 📖 Main Component ===
const Page27 = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = 2;

  return (
    <div className="font-arabic min-h-screen bg-gray-900">
      <div className="text-white p-4 md:p-6 text-center border-b-2">
        <div className="text-2xl md:text-3xl font-bold mb-2">
          {currentPage === 0
            ? "Leçon 27 : Combinaisons avancées - Chaddah + Soukoun"
            : "Leçon 27 : Exercice sur les combinaisons avancées"}
        </div>
        {currentPage === 1 && (
          <div className="text-md md:text-lg text-amber-300">
            Cliquez sur chaque mot pour écouter la shaddah et la soukoun.
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

export default Page27;