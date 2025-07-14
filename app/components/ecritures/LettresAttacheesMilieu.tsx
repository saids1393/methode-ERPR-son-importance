"use client";

import React, { useRef } from "react";
import domtoimage from "dom-to-image-more";

const LettresAttacheesMilieu = () => {
  const captureRef = useRef<HTMLDivElement>(null);

  const letters = [
    { letter: "ـا" },
    { letter: "ـبـ" },
    { letter: "ـتـ" },
    { letter: "ـثـ" },
    { letter: "ـجـ" },
    { letter: "ـحـ" },
    { letter: "ـخـ" },
    { letter: "ـد" },
    { letter: "ـذ" },
    { letter: "ـر" },
    { letter: "ـز" },
    { letter: "ـسـ" },
    { letter: "ـشـ" },
    { letter: "ـصـ" },
    { letter: "ـضـ" },
    { letter: "ـطـ" },
    { letter: "ـظـ" },
    { letter: "ـعـ" },
    { letter: "ـغـ" },
    { letter: "ـفـ" },
    { letter: "ـقـ" },
    { letter: "ـكـ" },
    { letter: "ـلـ" },
    { letter: "ـمـ" },
    { letter: "ـنـ" },
    { letter: "ـهـ" },
    { letter: "ـو" },
    { letter: "ـيـ" },
    { letter: "ء" },
    { letter: "ة" },
  ];

  const emphaticLetters = [
    "ـخـ",
    "ـر",
    "ـصـ",
    "ـضـ",
    "ـطـ",
    "ـظـ",
    "ـغـ",
    "ـقـ",
  ];

  const handleDownload = () => {
    if (!captureRef.current) return;

    captureRef.current.classList.add("no-borders");

    domtoimage
      .toPng(captureRef.current)
      .then((dataUrl: string) => {
        captureRef.current?.classList.remove("no-borders");

        const link = document.createElement("a");
        link.download = "lettres-attachees-milieu.png";
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
      {/* Bouton téléchargement */}
      <div className="absolute top-4 right-4 z-50">
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-blue-600 text-white px-4 py-2 rounded-xl font-semibold shadow-lg hover:scale-105 transition-transform"
          title="Télécharger la grille"
        >
          <DownloadIcon />
          Télécharger
        </button>
      </div>

      {/* Titre principal */}
      <div
        className="text-white p-6 text-center bg-white"
        style={{
          background: "linear-gradient(to right, #a855f7, #3b82f6)",
        }}
      >
        <div className="px-5 py-1 text-2xl font-bold">
          Écriture des lettres attachées au milieu d’un mot
        </div>
      </div>

      {/* Grille de lettres */}
      <div ref={captureRef} className="p-8 bg-white">
        <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-7 gap-4 mb-6">
          {letters.map((item, index) => (
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

export default LettresAttacheesMilieu;
