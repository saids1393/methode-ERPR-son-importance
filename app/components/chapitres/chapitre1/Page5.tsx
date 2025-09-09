"use client";

import React, { useRef } from "react";
import * as htmlToImage from "html-to-image";

import VisuelEcriture from "@/app/components/ecritures/VisuelEcriture";
import LettresAttacheesDebut from "@/app/components/ecritures/LettresAttacheesDebut";
import LettresAttacheesMilieu from "@/app/components/ecritures/LettresAttacheesMilieu";
import LettresAttacheesFin from "@/app/components/ecritures/LettresAttacheesFin";

const Page5 = () => {
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
            link.download = "page5-capture.png";
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
<>
      {/* Visuel écriture */}
      <div className="border-t border-gray-200">
        <VisuelEcriture />
      </div>

      {/* Header avec bouton */}
      <div
      className="text-white p-3 md:p-4 bg-gray-800 flex items-center justify-between"
      >
        {/* Espace vide à droite */}
        <div className="w-8 flex-shrink-0"></div>

        {/* Titre centré */}
        <div className="text-3xl sm:text-lg md:text-xl lg:text-2xl font-bold text-center flex-1 px-2 py-5">
          <span className="hidden sm:inline">Écrivez par dessus - lettres nons-attachées</span>
          <span className="sm:hidden">Écrivez par dessus - lettres nons-attachées</span>
        </div>

        {/* Bouton téléchargement */}
        <button
          onClick={handleDownload}
          className="flex items-center justify-center w-8 h-8 bg-white/20 backdrop-blur-sm text-white rounded-md shadow-lg hover:bg-white/30 transition-all flex-shrink-0"
          title="Télécharger la grille"
          aria-label="Télécharger"
        >
          <DownloadIcon />
        </button>
      </div>

      {/* Grille lettres seules */}
      <div ref={captureRef} className="p-8 bg-white">
        <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-7 gap-4"
          dir="rtl"
        >
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
      <div className="border-t border-gray-200 ">
        <LettresAttacheesDebut />
      </div>

      {/* Lettres attachées - milieu */}
      <div className="border-t border-gray-200 ">
        <LettresAttacheesMilieu />
      </div>

      {/* Lettres attachées - fin */}
      <div className="border-t border-gray-200 ">
        <LettresAttacheesFin />
      </div>
     </>
   
  );
};

const Cell = ({
  letter,
  emphatic,
}: {
  letter: string;
  emphatic?: boolean;
}) => (
  <div className="bg-white rounded-xl p-4 text-center min-h-[100px] flex flex-col justify-center items-center cursor-pointer relative">
    <div
      className={`text-5xl md:text-6xl font-bold ${
        emphatic ? "text-red-400/20" : "text-gray-400/20"
      } transition-colors select-none`}
    >
      {letter}
    </div>
    <div className="absolute inset-0 z-10 rounded-xl"></div>
  </div>
);

const DownloadIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-4 w-4"
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


export default Page5;
