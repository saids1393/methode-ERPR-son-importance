"use client";

import React, { useRef } from "react";
import domtoimage from "dom-to-image-more";

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

    captureRef.current.classList.add("no-borders");

    domtoimage
      .toPng(captureRef.current)
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
  };

  return (
    <div className="font-arabic min-h-screen bg-white relative" style={{ direction: "rtl" }}>
      {/* Bouton téléchargement en haut à droite */}
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

      {/* Header */}
      <div
        className="text-white p-6 text-center bg-white"
        style={{
          background: "linear-gradient(to right, #a855f7, #3b82f6)",
        }}
      >
        <div className="px-5 py-1 text-2xl font-bold">Écriture des lettres seules</div>
      </div>

      {/* Grille lettres seule */}
      <div ref={captureRef} className="p-8 bg-white">
        <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-7 gap-4">
          {allLetters.map((item, index) => (
            <Cell
              key={index}
              letter={item.letter}
              emphatic={emphaticLetters.includes(item.letter)}
            />
          ))}
        </div>
      </div>

      {/* Ajout de la section LettresAttacheesDebut avec un séparateur visuel */}
      <div className="border-t border-gray-200 pt-8 px-8">
        <LettresAttacheesDebut />
      </div>
       {/* Ajout de la section LettresAttacheesMilieu avec un séparateur visuel */}
      <div className="border-t border-gray-200 pt-8 px-8">
        <LettresAttacheesMilieu />
      </div>
       {/* Ajout de la section LettresAttacheesfin avec un séparateur visuel */}
      <div className="border-t border-gray-200 pt-8 px-8">
        <LettresAttacheesFin />
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

export default Page5;
