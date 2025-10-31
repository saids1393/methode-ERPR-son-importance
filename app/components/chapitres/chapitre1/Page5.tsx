"use client";
import React, { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from 'lucide-react';
import * as htmlToImage from "html-to-image";
import PageNavigation from '@/app/components/PageNavigation';

import VisuelEcriture from "@/app/components/ecritures/VisuelEcriture";
import LettresAttacheesDebut from "@/app/components/ecritures/LettresAttacheesDebut";
import LettresAttacheesMilieu from "@/app/components/ecritures/LettresAttacheesMilieu";
import LettresAttacheesFin from "@/app/components/ecritures/LettresAttacheesFin";

const emphaticLetters = ["خ", "ر", "ص", "ض", "ط", "ظ", "غ", "ق"];

const allLetters = [
  { letter: "ا" }, { letter: "ب" }, { letter: "ت" }, { letter: "ث" },
  { letter: "ج" }, { letter: "ح" }, { letter: "خ" }, { letter: "د" },
  { letter: "ذ" }, { letter: "ر" }, { letter: "ز" }, { letter: "س" },
  { letter: "ش" }, { letter: "ص" }, { letter: "ض" }, { letter: "ط" },
  { letter: "ظ" }, { letter: "ع" }, { letter: "غ" }, { letter: "ف" },
  { letter: "ق" }, { letter: "ك" }, { letter: "ل" }, { letter: "م" },
  { letter: "ن" }, { letter: "ه" }, { letter: "و" }, { letter: "ي" },
];

const IntroductionPage = () => {
  return (
    <div className="p-4 md:p-8 bg-gray-900 min-h-screen">
      <div className="w-full bg-gray-800 rounded-lg p-4 md:p-8">
        <div className="text-white space-y-4 md:space-y-6 text-lg md:text-xl leading-relaxed">
          
          <p>
            <span className="text-purple-400 font-semibold">Pourquoi l'écriture maintenant ? </span> 
            Tu te demandes peut-être pourquoi on aborde l'écriture seulement maintenant dans ton apprentissage.
          </p>

          <p>
            Je ne voulais pas t'apprendre à écrire dès le début avec l'apprentissage de lecture des lettres 
            car cela fait <span className="text-yellow-400">trop d'informations d'un coup</span>.
          </p>

          <p>
            J'ai préféré d'abord te faire passer par la <span className="text-green-400">lecture des lettres </span> 
            et l'<span className="text-green-400">assimilation visuelle</span> pour ensuite aborder l'écriture.
          </p>

          <p>
            🎯 <span className="font-semibold">L'écriture est importante mais pas urgente :</span>
            <br />
            • C'est le point le plus facile car c'est comme dessiner
            <br />
            • La plupart du temps, le professeur écrira au tableau
            <br />
            • Tu auras juste à recopier ce que tu vois
          </p>

          <div className="bg-blue-900/30 border border-blue-500/50 rounded-lg p-4 md:p-6 my-4 md:my-6">
            <p>
              💡 <span className="font-semibold">Ne t'inquiète pas ! </span> 
              Savoir écrire est surtout important pour les dictées, mais cela n'est 
              <span className="text-amber-300"> vraiment pas crucial à ce niveau</span>.
            </p>
          </div>

          <p>
            <span className="text-green-400 font-semibold">Le plus important pour toi maintenant :</span>
            <br />
            • Savoir écrire les lettres isolées et attachées sous toutes leurs formes
            <br />
            • Savoir relier les lettres entre elles
            <br />
            • Maîtriser la reconnaissance visuelle
          </p>

          <p>
            Les dictées viendront <span className="text-purple-400">après le tajwid</span>, 
            quand tu commenceras à apprendre le vocabulaire de la langue arabe avec des études 
            de texte sous forme de dialogues.
          </p>

          <div className="bg-amber-900/30 border border-amber-500/50 rounded-lg p-4 md:p-6 my-4 md:my-6">
            <p className="font-semibold text-amber-300">
              📝 IMPORTANT POUR LA PAGE SUIVANTE :
            </p>
            <p className="mt-3 text-white">
              Sur la deuxième page, tu trouveras un tableau complet avec <span className="text-yellow-300">toutes les 28 lettres de l'alphabet arabe</span>.
            </p>
            <p className="mt-2 text-white">
              <span className="text-cyan-300">👉 Comment l'utiliser :</span> Tu dois <span className="text-yellow-300 font-semibold">copier ce tableau comme si tu dessinais</span>. 
              Prends une feuille, un crayon, et reproduis chaque lettre dans le même ordre et la même disposition en respectant le sens des flèches. 
              C'est un exercice de motricité.
            </p>
          </div>

          <p>
            Dans la page suivante, tu découvriras le modèle complet d'écriture avec toutes les formes des lettres 
            et la grille pour pratiquer.
          </p>
        </div>
      </div>

      <footer className="border-t-1 text-white text-center p-4 md:p-6 mt-6 md:mt-8 flex-shrink-0 font-semibold text-base md:text-lg">
        <div>Apprentissage de l'Écriture Arabe</div>
        <div className="mt-1">© 2025 Tous droits réservés</div>
      </footer>
    </div>
  );
};

const WritingGuidePage = () => {
  const captureRef = useRef<HTMLDivElement>(null);

  const handleDownload = () => {
    if (!captureRef.current) return;

    document.fonts.ready.then(() => {
      captureRef.current?.classList.add("no-borders");

      requestAnimationFrame(() => {
        htmlToImage
          .toPng(captureRef.current!, { cacheBust: true })
          .then((dataUrl: string) => {
            captureRef.current?.classList.remove("no-borders");

            const link = document.createElement("a");
            link.download = "grille-ecriture-complete.png";
            link.href = dataUrl;
            link.click();
          })
          .catch((error: any) => {
            captureRef.current?.classList.remove("no-borders");
            console.error("Oops, something went wrong!", error);
          });
      });
    });
  };

  return (
    <div className="bg-gray-900 min-h-screen">
      {/* Guide visuel */}
      <div className="border-t border-gray-200">
        <VisuelEcriture />
      </div>

      
      <PageNavigation currentChapter={1} currentPage={5} className="mt-6 mb-4" />

<footer className="border-t-1 text-white text-center p-4 md:p-6 flex-shrink-0 font-semibold text-xs md:text-sm">
        <div>Modèle d'écriture - Tableau complet à copier</div>
        <div className="mt-1">© 2025 Tous droits réservés</div>
      </footer>
    </div>
  );
};

const Cell = ({
  letter,
  emphatic,
}: {
  letter: string;
  emphatic?: boolean;
}) => (
  <div className="bg-white rounded-lg md:rounded-xl p-2 md:p-4 text-center min-h-[80px] md:min-h-[100px] flex flex-col justify-center items-center cursor-pointer relative">
    <div
      className={`text-3xl md:text-5xl lg:text-6xl font-bold ${
        emphatic ? "text-red-400/20" : "text-gray-400/20"
      } transition-colors select-none`}
    >
      {letter}
    </div>
    <div className="absolute inset-0 z-10 rounded-lg md:rounded-xl"></div>
  </div>
);

const DownloadIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-3 w-3 md:h-4 md:w-4"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 4v12m0 0l-4-4m4 4l4-4M4 20h16"
    />
  </svg>
);

const Page5 = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = 2; // 1 introduction + 1 guide écriture

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

  const getPageTitle = (pageIndex: number) => {
    if (pageIndex === 0) return "Pourquoi apprendre à écrire maintenant ?";
    if (pageIndex === 1) return "Modèle d'écriture des lettres de l'alphabet arabe";
    return "Page d'écriture";
  };

  return (
    <div className="font-arabic min-h-screen bg-gray-900">
      <div className="w-full h-full overflow-hidden bg-gray-900">
        
        {/* Header */}
        <div className="text-white p-4 md:p-6 text-center border-b-2">
          <div className="text-2xl md:text-3xl font-bold mb-2">
            {getPageTitle(currentPage)}
          </div>
        </div>
        
        {/* Navigation Buttons */}
        <div className="flex justify-between items-center px-3 md:px-8 py-3 md:py-4">
          <button
            onClick={goToPreviousPage}
            disabled={currentPage === 0}
            className={`w-8 h-8 md:w-12 md:h-12 rounded-full border-2 flex items-center justify-center transition-all ${
              currentPage === 0
                ? 'border-gray-600 text-gray-600 cursor-not-allowed'
                : 'border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white hover:scale-110'
            }`}
          >
            <ChevronLeft size={16} className="md:w-6 md:h-6" />
          </button>

          <div className="text-white font-semibold text-xs md:text-base">
            Page {currentPage + 1} / {totalPages}
          </div>

          <button
            onClick={goToNextPage}
            disabled={currentPage === totalPages - 1}
            className={`w-8 h-8 md:w-12 md:h-12 rounded-full border-2 flex items-center justify-center transition-all ${
              currentPage === totalPages - 1
                ? 'border-gray-600 text-gray-600 cursor-not-allowed'
                : 'border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white hover:scale-110'
            }`}
          >
            <ChevronRight size={16} className="md:w-6 md:h-6" />
          </button>
        </div>

        {/* Content */}
        {currentPage === 0 && <IntroductionPage />}
        {currentPage === 1 && <WritingGuidePage />}
      </div>
    </div>
  );
};

export default Page5;