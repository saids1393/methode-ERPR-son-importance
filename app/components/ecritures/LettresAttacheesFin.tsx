"use client";

import React, { useRef } from "react";
import domtoimage from "dom-to-image-more";

const LettresAttacheesFin = () => {
  const captureRef = useRef<HTMLDivElement>(null);

const lettersFinMot = [
  { letter: "ـا" },  // Alif en fin de mot
  { letter: "ـب" },
  { letter: "ـت" },
  { letter: "ـث" },
  { letter: "ـج" },
  { letter: "ـح" },
  { letter: "ـخ" },
  { letter: "ـد" }, // ne s’attache pas après
  { letter: "ـذ" }, // ne s’attache pas après
  { letter: "ـر" }, // ne s’attache pas après
  { letter: "ـز" }, // ne s’attache pas après
  { letter: "ـس" },
  { letter: "ـش" },
  { letter: "ـص" },
  { letter: "ـض" },
  { letter: "ـط" },
  { letter: "ـظ" },
  { letter: "ـع" },
  { letter: "ـغ" },
  { letter: "ـف" },
  { letter: "ـق" },
  { letter: "ـك" },
  { letter: "ـل" },
  { letter: "ـم" },
  { letter: "ـن" },
  { letter: "ـه" },
  { letter: "ـو" }, // ne s’attache pas après
  { letter: "ـي" },

];


  const emphaticLetters = ["ـخ", "ـص", "ـض", "ـط", "ـظ", "ـغ", "ـق", "ـر"];

  const handleDownload = () => {
    if (!captureRef.current) return;

    captureRef.current.classList.add("no-borders");

    domtoimage
      .toPng(captureRef.current)
      .then((dataUrl: string) => {
        captureRef.current?.classList.remove("no-borders");

        const link = document.createElement("a");
        link.download = "lettres-attachees-fin.png";
        link.href = dataUrl;
        link.click();
      })
      .catch((error: any) => {
        captureRef.current?.classList.remove("no-borders");
        console.error("Erreur de capture :", error);
      });
  };

  return (
    <div
      className="font-arabic min-h-screen bg-white relative"
      style={{ direction: "rtl" }}
    >
      {/* En-tête avec titre et bouton */}
      <div
          className="text-white p-3 md:p-4 bg-gray-800 flex items-center justify-between"
      >
        <div className="w-8 flex-shrink-0"></div>

       <div className="text-3xl sm:text-lg md:text-xl lg:text-2xl font-bold text-center flex-1 px-2 py-5">
          <span className="hidden sm:inline">Écrivez par dessus - lettres fin d'un mot</span>
          <span className="sm:hidden">Écrivez par dessus - lettres fin d'un mot</span>
        </div>

        {/* Bouton de téléchargement */}
        <button
          onClick={handleDownload}
          className="flex items-center justify-center w-8 h-8 bg-white/20 backdrop-blur-sm text-white rounded-md shadow-lg hover:bg-white/30 transition-all flex-shrink-0"
          title="Télécharger la grille"
          aria-label="Télécharger"
        >
          <DownloadIcon />
        </button>
      </div>

      {/* Grille des lettres */}
      <div ref={captureRef} className="p-8 bg-white">
        <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-7 gap-4 mb-6">
          {lettersFinMot.map((item, index) => (
            <Cell
              key={index}
              letter={item.letter}
              emphatic={emphaticLetters.includes(item.letter)}
            />
          ))}
        </div>
      </div>
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
    className="h-5 w-5"
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

export default LettresAttacheesFin;
