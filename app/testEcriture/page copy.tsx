'use client';

import { useState, useEffect } from "react";

const lettres = [
  {
    char: "ا",
    arrowX: 110,
    arrowY: 50,
    duration: 3000,
  },
  {
    char: "ب",
    arrowX: 100,
    arrowY: 60,
    duration: 3500,
  },
];

function LetterAnimation({
  char,
  arrowX,
  arrowY,
  duration,
}: {
  char: string;
  arrowX: number;
  arrowY: number;
  duration: number;
}) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let animationFrame: number;
    let interval: NodeJS.Timeout;
    let startTime: number | null = null;

    const animate = (currentTime: number) => {
      if (startTime === null) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const nextProgress = Math.min(elapsed / duration, 1);
      setProgress(nextProgress);
      if (nextProgress < 1) animationFrame = requestAnimationFrame(animate);
    };

    const startAnimation = () => {
      if (animationFrame) cancelAnimationFrame(animationFrame);
      setProgress(0);
      startTime = null;
      animationFrame = requestAnimationFrame(animate);
    };

    startAnimation();

    interval = setInterval(startAnimation, duration + 3000); // pause de 3s

    return () => {
      if (animationFrame) cancelAnimationFrame(animationFrame);
      if (interval) clearInterval(interval);
    };
  }, [char, duration]);

  return (
    <svg viewBox="0 0 150 200" className="w-60 h-80 sm:w-80 sm:h-96">
      <defs>
        <clipPath id="mask">
          <rect x="0" y={0} width="150" height={200 * progress} />
        </clipPath>

        <marker
          id="arrowhead"
          markerWidth="6"
          markerHeight="6"
          refX="3"
          refY="3"
          orient="auto"
        >
          <polygon points="0 0, 6 3, 0 6" fill="red" />
        </marker>
      </defs>

      <text
        x="50"
        y="150"
        fontSize="150"
        fontWeight="bold"
        fill="white"
        clipPath="url(#mask)"
      >
        {char}
      </text>

      <line
        x1={arrowX}
        y1={arrowY}
        x2={arrowX}
        y2={arrowY + 100 * progress}
        stroke="red"
        strokeWidth="4"
        markerEnd={progress > 0 ? "url(#arrowhead)" : undefined}
      />
    </svg>
  );
}

export default function TestEcriturePage() {
  const [index, setIndex] = useState(0);

  const handleNext = () => setIndex((prev) => (prev + 1) % lettres.length);
  const handlePrev = () =>
    setIndex((prev) => (prev - 1 + lettres.length) % lettres.length);

  const currentLetter = lettres[index];

  return (
    <div className="flex flex-col justify-start items-center h-screen bg-gray-900">
      {/* Titre */}
      <div className="text-white p-6 text-center border-b-2 w-full">
        <div className="text-3xl font-bold mb-4">
          Leçon : l'écriture des lettres de l'alphabet
        </div>
      </div>

      {/* SVG + boutons */}
      <div className="flex justify-center items-center flex-1 w-full relative">
        <button
          onClick={handlePrev}
          className="absolute left-4 text-white bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded"
        >
          Lettre précédente
        </button>

        <LetterAnimation
          char={currentLetter.char}
          arrowX={currentLetter.arrowX}
          arrowY={currentLetter.arrowY}
          duration={currentLetter.duration}
        />

        <button
          onClick={handleNext}
          className="absolute right-4 text-white bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded"
        >
          Lettre suivante
        </button>
      </div>
    </div>
  );
}
