"use client";

import React, { useRef } from "react";
import * as htmlToImage from "html-to-image";

const Page29 = () => {
  const captureRef = useRef<HTMLDivElement>(null);

const words = [
  "ٱلْمُصَّدِّقِينَ",   // avec shadda sur ص et sur د, et alif wasla sur ال
  "يُشَاقُّونَ",       // pas de shadda sur ي, mais bien sur ق
  "فَأَنجَيْنَـٰهُ",   // orthographe coranique : أنجينا (pas أنقذنا)
  "أَتُحَآجُّونَنَا",   // alif après ح, shadda sur ج
  "مِّنَ ٱلسَّمَآءِ",    // shadda sur س, alif maqṣūra à la fin
  "أَقَدَرُوا۟"         // tanwīn ou soukoun selon le contexte, ici avec ḍamma puis signe allongé
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
            link.download = "page28-capture.png";
            link.href = dataUrl;
            link.click();
          })
          .catch((error: any) => {
            captureRef.current?.classList.remove("no-borders");
            console.error("Erreur lors de la capture :", error);
          });
      });
    });
  };

  return (
    <>
    <div className="font-arabic min-h-screen bg-white relative" style={{ direction: "rtl" }}>
      {/* Header avec bouton de téléchargement */}
      <div
        className="text-white p-3 md:p-4 bg-white flex items-center justify-between"
        style={{
          background: "linear-gradient(to right, #a855f7, #3b82f6)",
        }}
      >
        {/* Espace vide à droite pour équilibrer */}
        <div className="w-8 flex-shrink-0"></div>

        {/* Titre centré */}
        <div className="text-3xl sm:text-lg md:text-xl lg:text-2xl font-bold text-center flex-1 px-2 py-5">
          <span className="hidden sm:inline">Exercice : écriture complète des mots avec toute les bases de la méthode</span>
          <span className="sm:hidden">Exercice : écriture complète des mots avec toute les bases de la méthode</span>
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

      {/* Grille des mots */}
      <div ref={captureRef} className="p-8 bg-white">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {words.map((word, index) => (
            <WordCard key={index} word={word} />
          ))}
        </div>
      </div>

    </div>
    
        {/* Footer */}
        <footer className="bg-zinc-800 text-white text-center p-6 flex-shrink-0 font-semibold text-sm">
          <div>Page 29</div>
          <div className="mt-1">© 2025 Tous droits réservés</div>
        </footer>
    </>
  );
};

const WordCard = ({ word }: { word: string }) => (
  <div className="bg-white rounded-xl p-4 text-center min-h-[100px] flex flex-col justify-center items-center cursor-pointer relative">
    <div className="text-2xl md:text-3xl font-bold text-gray-800 opacity-30 hover:opacity-100 transition-opacity duration-300 select-none">
      {word}
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

export default Page29;
