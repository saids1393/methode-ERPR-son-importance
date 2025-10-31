"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import PageNavigation from '@/app/components/PageNavigation';

// === 🎧 Mapping audio lettres isolées (repris du modèle de la page 1) ===
const letterAudioMappings: { [key: string]: string } = {
  "ا": "chap0_pg0_case1",
  "ب": "chap0_pg0_case2",
  "ت": "chap0_pg0_case3",
  "ث": "chap0_pg0_case4",
  "ج": "chap0_pg0_case5",
  "ح": "chap0_pg0_case6",
  "خ": "chap0_pg0_case7",
  "د": "chap0_pg0_case8",
  "ذ": "chap0_pg0_case9",
  "ر": "chap0_pg0_case10",
  "ز": "chap0_pg0_case11",
  "س": "chap0_pg0_case12",
  "ش": "chap0_pg0_case13",
  "ص": "chap0_pg0_case14",
  "ض": "chap0_pg0_case15",
  "ط": "chap0_pg0_case16",
  "ظ": "chap0_pg0_case17",
  "ع": "chap0_pg0_case18",
  "غ": "chap0_pg0_case19",
  "ف": "chap0_pg0_case20",
  "ق": "chap0_pg0_case21",
  "ك": "chap0_pg0_case22",
  "ل": "chap0_pg0_case23",
  "م": "chap0_pg0_case24",
  "ن": "chap0_pg0_case25",
  "ه": "chap0_pg0_case26",
  "و": "chap0_pg0_case27",
  "ي": "chap0_pg0_case28",
  "ء": "chap0_pg0_case29",
};

// === 🎧 Mapping audio Chapitre 9, Page 24 (mots) ===
const chapter9Page24AudioMappings: { [key: string]: string } = {
  "الشَّمْسُ": "chap9_pg24_case15",
  "النَّهْرُ": "chap9_pg24_case16",
  "الدَّرْسُ": "chap9_pg24_case17",
  "التِّينُ": "chap9_pg24_case18",
  "الْقَمَرُ": "chap9_pg24_case19",
  "الْبَيْتُ": "chap9_pg24_case20",
  "الْكِتَابُ": "chap9_pg24_case21",
  "الْمَاءُ": "chap9_pg24_case22",
};

// === 🌞 Lettres et exemples ===
const solarLetters = ["ت", "ث", "د", "ذ", "ر", "ز", "س", "ش", "ص", "ض", "ط", "ظ", "ل", "ن"];
const lunarLetters = ["ا", "ب", "ج", "ح", "خ", "ع", "غ", "ف", "ق", "ك", "م", "و", "ه", "ي"];
const solarExamples = ["الشَّمْسُ", "النَّهْرُ", "الدَّرْسُ", "التِّينُ"];
const lunarExamples = ["الْقَمَرُ", "الْبَيْتُ", "الْكِتَابُ", "الْمَاءُ"];

// === 🔊 Fonction de lecture audio ===
const playLetterAudio = (item: string) => {
  // On vérifie d'abord dans les audios de lettres
  let audioFileName = letterAudioMappings[item];
  let folder = "/audio/chapitre0_1/";

  // Sinon on vérifie dans les audios de la page 24
  if (!audioFileName) {
    audioFileName = chapter9Page24AudioMappings[item];
    folder = "/audio/chapitre9/";
  }

  if (audioFileName) {
    const audio = new Audio(`${folder}${audioFileName}.mp3`);
    audio.play().catch((err) => console.error("Erreur audio:", err));
  } else {
    console.warn("Aucun audio trouvé pour :", item);
  }
};

// === 📘 Introduction Page ===
const IntroductionPage = () => (
  <div className="p-4 md:p-8 bg-gray-900">
    <div className="w-full bg-gray-800 rounded-lg p-6 md:p-8">
      <div className="text-white space-y-6 text-lg md:text-xl leading-relaxed">
        <p>
          🌟 <span className="text-amber-400 font-semibold">Avant-dernier chapitre, courage !</span>
        </p>

        <p>
          Vous avez appris le Soukoun et comment il arrête le son d'une lettre. Maintenant,
          découvrez un concept fondamental en Tajweed : les{" "}
          <span className="text-yellow-400 font-semibold">lettres solaires et lunaires</span> (حروف شمسية و قمرية).
        </p>

        <p>
          Il y a <span className="text-cyan-400 font-semibold">28 lettres en arabe</span> :
          <span className="text-yellow-400 font-semibold"> 14 solaires</span> et{" "}
          <span className="text-blue-400 font-semibold">14 lunaires</span>. Cette division affecte
          directement la prononciation du <span className="text-orange-400 font-semibold">Lam (ل)</span> de
          l'article <span className="text-cyan-400 font-semibold">(Alif et Lam - ال)</span>.
        </p>

        <div className="bg-blue-900/30 border border-blue-500/50 rounded-lg p-4 md:p-6">
          <p>
            ✨ <span className="font-semibold">Les deux catégories :</span>
            <br />
            <br />
            <span className="text-yellow-400 font-bold">Lettres solaires (حروف شمسية)</span> : 14 lettres
            <br />
            <span className="text-gray-300">ت ث د ذ ر ز س ش ص ض ط ظ ل ن</span>
            <br />
            Avec les lettres solaires, on <span className="text-orange-400 font-semibold">ne prononce pas le Lam</span>.
            Le Lam s'assimile à la lettre solaire. Les lettres solaires portent une <span className="text-orange-400 font-semibold">Chaddah (ّ)</span>
            qui indique cette assimilation.
            <br />
            <br />
            <span className="text-blue-400 font-bold">Lettres lunaires (حروف قمرية)</span> : 14 lettres
            <br />
            <span className="text-gray-300">ا ب ج ح خ ع غ ف ق ك م و ه ي</span>
            <br />
            Avec les lettres lunaires, on <span className="text-cyan-400 font-semibold">prononce le Lam</span> avec un Soukoun.
          </p>
        </div>

        <p>
          🎯 <span className="font-semibold">Comment reconnaître une lettre solaire ou lunaire ?</span>
        </p>

        <div className="bg-purple-900/30 border border-purple-500/50 rounded-lg p-4 md:p-6 space-y-3">
          <p>
            <span className="text-yellow-400 font-bold">Lettres solaires :</span>
            <br />
            • Marquées par une <span className="text-orange-400 font-bold">Chaddah (ّ)</span> sur la lettre après le Lam
            <br />
            • <span className="text-yellow-400 text-lg">الشَّمْسُ</span> = Ach-chams
          </p>

          <p>
            <span className="text-blue-400 font-bold">Lettres lunaires :</span>
            <br />
            • Le Lam porte un <span className="text-cyan-400 font-bold">Soukoun (ْ)</span>
            <br />
            • <span className="text-yellow-400 text-lg">الْقَمَرُ</span> = Al-qamar
          </p>
        </div>

        <p>
          🌟 <span className="font-semibold">Impact en Tajweed :</span>
          <br />
          Cette distinction est essentielle pour une récitation correcte du Coran.
          Écoutez bien la différence entre les deux catégories dans la page suivante !
        </p>
      </div>
    </div>

    <footer className="border-t-1 text-white text-center p-4 md:p-6 mt-8 font-semibold text-base md:text-lg">
      <div>Leçon 24 : Lettres solaires et lunaires</div>
      <div className="mt-1">© 2025 Tous droits réservés</div>
    </footer>
  </div>
);

// === 🧱 Carte Lettre ===
const LetterCard = ({
  letter,
  color,
  onClick,
}: {
  letter: string;
  color: string;
  onClick?: () => void;
}) => (
  <div
    className={`border-2 border-current rounded-lg p-3 cursor-pointer min-w-[60px] min-h-[60px] flex items-center justify-center hover:scale-110 transition-transform duration-300 ${color}`}
    onClick={onClick}
  >
    <div className="text-3xl md:text-4xl font-bold">{letter}</div>
  </div>
);

// === 🧱 Carte Exemple ===
const ExampleCard = ({ word, onClick }: { word: string; onClick?: () => void }) => (
  <div
    className="bg-gray-800 border border-gray-700 rounded-xl p-6 text-center hover:bg-gray-700 transition-all duration-300 cursor-pointer min-h-[120px] flex items-center justify-center"
    onClick={onClick}
  >
    <div
      className="text-4xl md:text-5xl font-bold leading-relaxed text-white break-keep"
      dir="rtl"
      lang="ar"
      style={{ fontFeatureSettings: '"calt" 1, "liga" 1' }}
    >
      {word}
    </div>
  </div>
);

// === 📖 Page d’exercice ===
const ExercisePage = () => (
  <div className="p-4 md:p-8 bg-gray-900" dir="rtl">
    <div className="max-w-6xl mx-auto space-y-12">
      {/* Lettres solaires */}
      <div>
        <h2 className="text-center text-2xl md:text-3xl font-bold mb-6 text-yellow-400">
          Lettres solaires (14 lettres)
        </h2>
        <div className="flex flex-wrap gap-3 mb-8 justify-center">
          {solarLetters.map((letter, index) => (
            <LetterCard
              key={index}
              letter={letter}
              color="text-yellow-400"
              onClick={() => playLetterAudio(letter)}
            />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {solarExamples.map((word, index) => (
            <ExampleCard key={index} word={word} onClick={() => playLetterAudio(word)} />
          ))}
        </div>
      </div>

      {/* Lettres lunaires */}
      <div>
        <h2 className="text-center text-2xl md:text-3xl font-bold mb-6 text-blue-400">
          Lettres lunaires (14 lettres)
        </h2>
        <div className="flex flex-wrap gap-3 mb-8 justify-center">
          {lunarLetters.map((letter, index) => (
            <LetterCard
              key={index}
              letter={letter}
              color="text-blue-400"
              onClick={() => playLetterAudio(letter)}
            />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {lunarExamples.map((word, index) => (
            <ExampleCard key={index} word={word} onClick={() => playLetterAudio(word)} />
          ))}
        </div>
      </div>
    </div>

    
      <PageNavigation currentChapter={9} currentPage={24} className="mt-6 mb-4" />

<footer className="border-t-1 text-white text-center p-4 md:p-6 mt-12 font-semibold text-sm md:text-base">
      <div>Page 24 - Exercice des lettres solaires et lunaires</div>
      <div className="mt-1">© 2025 Tous droits réservés</div>
    </footer>
  </div>
);

// === 📖 Composant Principal ===
const Page24 = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = 2;

  return (
    <div className="font-arabic min-h-screen bg-gray-900">
      <div className="text-white p-4 md:p-6 text-center border-b-2">
        <div className="text-2xl md:text-3xl font-bold mb-2">
          {currentPage === 0
            ? "Leçon 24 : Lettres solaires et lunaires"
            : "Leçon 24 : Exercice pratique"}
        </div>
        {currentPage === 1 && (
          <div className="text-md md:text-lg text-amber-300">
            Cliquez sur les lettres et les mots pour écouter la prononciation.
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

export default Page24;


