"use client";
import React, { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from 'lucide-react';
import * as htmlToImage from "html-to-image";

import VisuelEcriture from "@/app/components/ecritures/VisuelEcriture";
import LettresAttacheesDebut from "@/app/components/ecritures/LettresAttacheesDebut";
import LettresAttacheesMilieu from "@/app/components/ecritures/LettresAttacheesMilieu";
import LettresAttacheesFin from "@/app/components/ecritures/LettresAttacheesFin";

// Tableau des 28 lettres de l'alphabet arabe avec leurs images
const arabicLetters = [
  { letter: "ا", name: "Alif", image: "/img/ALIF.PNG" },
  { letter: "ب", name: "Ba", image: "/images/lettres/lettre-2.png" },
  { letter: "ت", name: "Ta", image: "/images/lettres/lettre-3.png" },
  { letter: "ث", name: "Tha", image: "/images/lettres/lettre-4.png" },
  { letter: "ج", name: "Jim", image: "/images/lettres/lettre-5.png" },
  { letter: "ح", name: "Ha", image: "/images/lettres/lettre-6.png" },
  { letter: "خ", name: "Kha", image: "/images/lettres/lettre-7.png" },
  { letter: "د", name: "Dal", image: "/images/lettres/lettre-8.png" },
  { letter: "ذ", name: "Dhal", image: "/images/lettres/lettre-9.png" },
  { letter: "ر", name: "Ra", image: "/images/lettres/lettre-10.png" },
  { letter: "ز", name: "Zay", image: "/images/lettres/lettre-11.png" },
  { letter: "س", name: "Sin", image: "/images/lettres/lettre-12.png" },
  { letter: "ش", name: "Shin", image: "/images/lettres/lettre-13.png" },
  { letter: "ص", name: "Sad", image: "/images/lettres/lettre-14.png" },
  { letter: "ض", name: "Dad", image: "/images/lettres/lettre-15.png" },
  { letter: "ط", name: "Ta", image: "/images/lettres/lettre-16.png" },
  { letter: "ظ", name: "Dha", image: "/images/lettres/lettre-17.png" },
  { letter: "ع", name: "Ayn", image: "/images/lettres/lettre-18.png" },
  { letter: "غ", name: "Ghayn", image: "/images/lettres/lettre-19.png" },
  { letter: "ف", name: "Fa", image: "/images/lettres/lettre-20.png" },
  { letter: "ق", name: "Qaf", image: "/images/lettres/lettre-21.png" },
  { letter: "ك", name: "Kaf", image: "/images/lettres/lettre-22.png" },
  { letter: "ل", name: "Lam", image: "/images/lettres/lettre-23.png" },
  { letter: "م", name: "Mim", image: "/images/lettres/lettre-24.png" },
  { letter: "ن", name: "Nun", image: "/images/lettres/lettre-25.png" },
  { letter: "ه", name: "Ha", image: "/images/lettres/lettre-26.png" },
  { letter: "و", name: "Waw", image: "/images/lettres/lettre-27.png" },
  { letter: "ي", name: "Ya", image: "/images/lettres/lettre-28.png" }
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
              💡 <span className="font-semibold">Ne t'inquiète pas !</span> 
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

          <p>
            Dans les pages suivantes, tu découvriras chaque lettre de l'alphabet arabe avec ses différentes formes, 
            et à la fin tu auras accès à toutes les grilles d'écriture complètes.
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

// Composant pour chaque page de lettre individuelle
const LetterPage = ({ letterData, pageNumber }: { letterData: any, pageNumber: number }) => {
  return (
    <div className="p-4 md:p-8 bg-gray-900 min-h-screen">
      <div className="w-full bg-gray-800 rounded-lg p-4 md:p-8">
        <div className="text-white space-y-6 md:space-y-8 text-center">
          
          {/* Titre de la lettre */}
          <div className="mb-6 md:mb-8">
            <div className="text-5xl md:text-8xl font-bold text-purple-400 mb-3 md:mb-4">
              {letterData.letter}
            </div>
            <div className="text-xl md:text-3xl text-amber-300">
              Lettre {letterData.name}
            </div>
            <div className="text-sm md:text-lg text-gray-400 mt-2">
              Page {pageNumber}/28 - Alphabet Arabe
            </div>
          </div>

          {/* Image de la lettre - Version améliorée pour le responsive */}
          <div className="bg-gray-700 rounded-xl p-4 md:p-6 mb-6 md:mb-8">
            <div className="text-white text-base md:text-lg mb-3 md:mb-4 text-center">
              Toutes les formes de la lettre {letterData.letter} - {letterData.name}
            </div>
            
            {/* Conteneur d'image responsive */}
            <div className="flex justify-center">
              <div className="max-w-2xl w-full bg-gray-600 rounded-lg overflow-hidden shadow-lg">
                <img 
                  src={letterData.image}
                  alt={`Lettre arabe ${letterData.letter} - ${letterData.name} - Toutes les formes`}
                  className="w-full h-auto max-h-[50vh] object-contain"
                  loading="lazy"
                  onError={(e) => {
                    // Fallback vers une image placeholder si l'image n'est pas trouvée
                    e.currentTarget.src = "https://via.placeholder.com/800x400/4A5568/FFFFFF?text=Image+de+la+lettre+" + letterData.letter;
                  }}
                />
              </div>
            </div>
            
            <div className="text-gray-400 text-xs md:text-sm mt-3 text-center">
              Observe toutes les formes de cette lettre : isolée, début, milieu et fin
            </div>
          </div>
        </div>
      </div>

      <footer className="border-t-1 text-white text-center p-4 md:p-6 mt-6 md:mt-8 flex-shrink-0 font-semibold text-sm md:text-base">
        <div>Lettre {letterData.name} - {letterData.letter} - Toutes les formes</div>
        <div className="mt-1">© 2025 Tous droits réservés</div>
      </footer>
    </div>
  );
};

const WritingGuidePage = () => {
  const captureRef = useRef<HTMLDivElement>(null);

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
      {/* Header avec bouton */}
      <div className="text-white p-3 md:p-4 bg-gray-800 flex items-center justify-between">
        <div className="w-6 md:w-8 flex-shrink-0"></div>

        <div className="text-xl sm:text-lg md:text-2xl lg:text-3xl font-bold text-center flex-1 px-2 py-4 md:py-5">
          <span>Modèle d'écriture des lettres de l'alphabet arabe</span>
        </div>

        <button
          onClick={handleDownload}
          className="flex items-center justify-center w-6 h-6 md:w-8 md:h-8 bg-white/20 backdrop-blur-sm text-white rounded-md shadow-lg hover:bg-white/30 transition-all flex-shrink-0"
          title="Télécharger la grille"
          aria-label="Télécharger"
        >
          <DownloadIcon />
        </button>
      </div>

      {/* Grille lettres seules */}
      <div ref={captureRef} className="p-4 md:p-8 bg-white">
        <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-7 gap-3 md:gap-4" dir="rtl">
          {allLetters.map((item, index) => (
            <Cell
              key={index}
              letter={item.letter}
              emphatic={emphaticLetters.includes(item.letter)}
            />
          ))}
        </div>
      </div>

      {/* Lettres attachées - début */}
      <div className="border-t border-gray-200">
        <LettresAttacheesDebut />
      </div>

      {/* Lettres attachées - milieu */}
      <div className="border-t border-gray-200">
        <LettresAttacheesMilieu />
      </div>

      {/* Lettres attachées - fin */}
      <div className="border-t border-gray-200">
        <LettresAttacheesFin />
      </div>

      {/* Guide visuel */}
      <div className="border-t border-gray-200">
        <VisuelEcriture />
      </div>

      <footer className="border-t-1 text-white text-center p-4 md:p-6 flex-shrink-0 font-semibold text-xs md:text-sm">
        <div>Modèle d'écriture - Page 29/29</div>
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
  const totalPages = 29; // 1 introduction + 28 lettres + 1 guide écriture

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
    if (pageIndex === totalPages - 1) return "Modèle d'écriture des lettres de l'alphabet arabe";
    
    const letterIndex = pageIndex - 1;
    if (letterIndex < arabicLetters.length) {
      return `Lettre ${arabicLetters[letterIndex].name}`;
    }
    
    return "Page d'écriture";
  };

  const getPageSubtitle = (pageIndex: number) => {
    if (pageIndex === 0) return "";
    if (pageIndex === totalPages - 1) return "";
    
    return `Lettre ${arabicLetters[pageIndex - 1].letter} - Page ${pageIndex}/28 - Toutes les formes`;
  };

  return (
    <div className="font-arabic min-h-screen bg-gray-900">
      <div className="w-full h-full overflow-hidden bg-gray-900">
        
        {/* Header */}
        <div className="text-white p-4 md:p-6 text-center border-b-2">
          <div className="text-2xl md:text-3xl font-bold mb-2">
            {getPageTitle(currentPage)}
          </div>
          {currentPage > 0 && currentPage < totalPages - 1 && (
            <div className="text-base md:text-lg text-amber-300">
              {getPageSubtitle(currentPage)}
            </div>
          )}
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
        {currentPage === totalPages - 1 && <WritingGuidePage />}
        {currentPage > 0 && currentPage < totalPages - 1 && (
          <LetterPage 
            letterData={arabicLetters[currentPage - 1]} 
            pageNumber={currentPage}
          />
        )}
      </div>
    </div>
  );
};

export default Page5;