"use client";
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import PageNavigation from '@/app/components/PageNavigation';

const chapterPage6AudioMappings: { [key: string]: string } = {
  'في': 'chap1_pg6_case1',
  'من': 'chap1_pg6_case2',
  'ق': 'chap1_pg6_case3',
  'قد': 'chap1_pg6_case4',
  'ل': 'chap1_pg6_case5',
  'هو': 'chap1_pg6_case6',
  'ما': 'chap1_pg6_case7',
  // 'أن': 'chap1_pg6_case8',
  'لم': 'chap1_pg6_case9',
  'كل': 'chap1_pg6_case10',
  'ثم': 'chap1_pg6_case11',
  'هل': 'chap1_pg6_case12',
  'عن': 'chap1_pg6_case13',
  'ر': 'chap1_pg6_case14',
  'به': 'chap1_pg6_case15',
  'له': 'chap1_pg6_case16',
  'رب': 'chap1_pg6_case17',
  'قل': 'chap1_pg6_case18',
  'هم': 'chap1_pg6_case19',
  'نا': 'chap1_pg6_case20',
  'كم': 'chap1_pg6_case21',
  // 'أي': 'chap1_pg6_case22',
  'ف': 'chap1_pg6_case23',
  'نور': 'chap1_pg6_case24',
  'عبد': 'chap1_pg6_case25',
  'نار': 'chap1_pg6_case26',
  'يدع': 'chap1_pg6_case27',
  'ع': 'chap1_pg6_case29',
  'ملك': 'chap1_pg6_case30',
  'نهر': 'chap1_pg6_case31',
  'قمر': 'chap1_pg6_case32',
  'غيب': 'chap1_pg6_case33',
  'رسل': 'chap1_pg6_case34',
  'نفس': 'chap1_pg6_case35',
  'صمت': 'chap1_pg6_case37',
  'ح': 'chap1_pg6_case38',
  'خير': 'chap1_pg6_case39',
  'علم': 'chap1_pg6_case40',
  'قلب': 'chap1_pg6_case41',
  'غفر': 'chap1_pg6_case43',
  'سجد': 'chap1_pg6_case44',
  'عدة': 'chap1_pg6_case45',
  'خوف': 'chap1_pg6_case46',
  'صدق': 'chap1_pg6_case47',
  'كفر': 'chap1_pg6_case48',
  'نصر': 'chap1_pg6_case49',
  'س': 'chap1_pg6_case50',
  'سؤل': 'chap1_pg6_case51',
  // 'أمر': 'chap1_pg6_case52',
  'يئس': 'chap1_pg6_case53',
};

const Cell = ({ word, onClick }: {
  word: string;
  onClick?: () => void;
}) => (
  <div
    className="border border-zinc-500 rounded-xl p-3 md:p-4 text-center min-h-[110px] md:min-h-[120px] flex flex-col justify-center items-center hover:bg-zinc-700 transition-all duration-300 hover:scale-105 cursor-pointer mx-1"
    onClick={onClick}
  >
    <div className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
      {word}
    </div>
  </div>
);

const IntroductionPage = () => {
  return (
    <div className="p-4 md:p-8 bg-gray-900">
      <div className="w-full bg-gray-800 rounded-lg p-6 md:p-8">
        <div className="text-white space-y-6 text-lg md:text-xl leading-relaxed">

          <p>
            <span className="text-purple-400 font-semibold">Exercice pratique ! </span>
            Maintenant que tu as appris les différentes formes des lettres arabes,
            c'est le moment de tester ta reconnaissance visuelle.
          </p>

          <p>
            Dans cet exercice, tu vas retrouver des <span className="text-yellow-400 font-semibold">lettres isolées </span>
            et des <span className="text-yellow-400 font-semibold">lettres attachées</span> qui utilisent toutes les formes
            que tu as étudiées : début, milieu et fin de mot.
          </p>

          <p>
            🎯 <span className="font-semibold">Objectif de l'exercice :</span>
            <br />
            • Reconnaître les lettres dans leurs différentes positions
            <br />
            • Identifier les lettres isolées et leurs formes attachées
            <br />
            • T'entraîner à reconnaitre les lettres sans erreurs
          </p>

          <p>
            <span className="text-green-400 font-semibold">Comment ça marche :</span>
            <br />
            • Observe bien chaque lettre et sa position
            <br />
            • Essaye de deviner la lettre ou les lettres dans chaque case
            <br />
            • Clique sur chaque mot pour entendre sa prononciation
          </p>

          <div className="bg-blue-900/30 border border-blue-500/50 rounded-lg p-4 md:p-6 my-6">
            <p>
              💡 <span className="font-semibold">Astuce :</span>
              Dans chaque mot, chaque lettre a une couleur différente pour t'aider
              à mieux les distinguer visuellement !
            </p>
          </div>

          <p>
            À la page suivante, tu trouveras la grille d'exercice avec tous les mots.
            Prends ton temps et amuse-toi à découvrir la beauté de l'écriture arabe !
          </p>
        </div>
      </div>

      <footer className="border-t-1 text-white text-center p-4 md:p-6 mt-8 flex-shrink-0 font-semibold text-base md:text-lg">
        <div>Exercice de Reconnaissance</div>
        <div className="mt-1">© 2025 Tous droits réservés</div>
      </footer>
    </div>
  );
};


const ExercisePage = ({ playWordAudio }: { playWordAudio: (word: string) => void }) => {
  const words = [
    'في', 'من', 'ق', 'قد', 'ل', 'هو',
    'ما', 'لم', 'كل', 'ثم', 'هل',
    'عن', 'ر', 'به', 'له', 'رب', 'قل',
    'هم', 'نا', 'كم', 'ف', 'نور',
    'عبد', 'نار', 'يدع', 'ع', 'ملك',
    'نهر', 'قمر', 'غيب', 'رسل', 'نفس',
    'صمت', 'ح', 'خير', 'علم', 'قلب',
    'غفر', 'سجد', 'عدة', 'خوف', 'صدق', 'كفر',
    'نصر', 'س', 'سؤل', 'يئس',
  ];

  return (
    <div className="p-2 md:p-4 lg:p-8 bg-gray-900">
      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-2 md:gap-3 lg:gap-4 mb-6" dir="rtl">
        {words.map((word, index) => (
          <div
            key={index}
            className="border border-zinc-500 rounded-xl p-2 md:p-3 lg:p-4 text-center min-h-[90px] md:min-h-[100px] lg:min-h-[110px] flex flex-col justify-center items-center hover:bg-zinc-700 transition-all duration-300 hover:scale-105 cursor-pointer mx-1"
            onClick={() => playWordAudio(word)}
          >
            <div className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight">
              {word}
            </div>
          </div>
        ))}
      </div>

      {/* Instructions de l'exercice */}
      <div className="bg-purple-900/30 border border-purple-500/50 rounded-lg p-4 md:p-6 mb-6">
        <p className="text-base md:text-lg leading-relaxed text-white text-center">
          <span className="font-semibold">🎯 Instructions :</span> Clique sur chaque mot pour écouter sa prononciation.
          <span className="block mt-2">Chaque lettre est affichée en blanc pour une meilleure lisibilité !</span>
        </p>
      </div>

      
      <PageNavigation currentChapter={1} currentPage={6} className="mt-6 mb-4" />

<footer className="border-t-1 text-white text-center p-4 md:p-6 flex-shrink-0 font-semibold text-sm md:text-base">
        <div>Exercice de Reconnaissance</div>
        <div className="mt-1">© 2025 Tous droits réservés</div>
      </footer>
    </div>
  );
};

const Page6 = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = 2;

  const playWordAudio = (word: string) => {
    const audioFileName = chapterPage6AudioMappings[word];
    if (audioFileName) {
      const audio = new Audio(`/audio/chapitre0_1/${audioFileName}.mp3`);
      audio.play().catch(error => {
        console.error('Erreur lors de la lecture audio:', error);
      });
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const pageTitle = currentPage === 0
    ? "Exercice : Reconnaissance des lettres sous toutes leurs formes"
    : "Exercice : Grille de reconnaissance";

  return (
    <div className="font-arabic min-h-screen bg-gray-900">
      <div className="w-full h-full overflow-hidden bg-gray-900">

        {/* Header */}
        <div className="text-white p-4 md:p-6 text-center border-b-2">
          <div className="text-2xl md:text-3xl font-bold mb-2">
            {pageTitle}
          </div>
          {/* Phrase ajoutée seulement pour la page d'exercice */}
          {currentPage === 1 && (
            <div className="text-md md:text-lg text-amber-300">
              Cliquez pour écouter chaque lettre et répétez après.
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center px-2 md:px-4 lg:px-8 py-4">
          <button
            onClick={goToPreviousPage}
            disabled={currentPage === 0}
            className={`w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 rounded-full border-2 flex items-center justify-center transition-all ${currentPage === 0
                ? 'border-gray-600 text-gray-600 cursor-not-allowed'
                : 'border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white hover:scale-110'
              }`}
          >
            <ChevronLeft size={16} className="md:w-5 md:h-5 lg:w-6 lg:h-6" />
          </button>

          <div className="text-white font-semibold text-xs md:text-sm lg:text-base">
            Page {currentPage + 1} / {totalPages}
          </div>

          <button
            onClick={goToNextPage}
            disabled={currentPage === totalPages - 1}
            className={`w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 rounded-full border-2 flex items-center justify-center transition-all ${currentPage === totalPages - 1
                ? 'border-gray-600 text-gray-600 cursor-not-allowed'
                : 'border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white hover:scale-110'
              }`}
          >
            <ChevronRight size={16} className="md:w-5 md:h-5 lg:w-6 lg:h-6" />
          </button>
        </div>

        {/* Content */}
        {currentPage === 0 && <IntroductionPage />}
        {currentPage === 1 && <ExercisePage playWordAudio={playWordAudio} />}
      </div>
    </div>
  );
};

export default Page6;