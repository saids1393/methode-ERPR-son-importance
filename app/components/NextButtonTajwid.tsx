"use client";

import React from 'react';
import { ChevronRight } from 'lucide-react';
import { useNavigationNext } from '@/hooks/useNavigationNext';
import { ContentType } from '@/lib/chapters';

interface NextButtonTajwidProps {
  currentChapter: number;
  currentType: ContentType;
  currentPage?: number;
  className?: string;
  buttonClassName?: string;
  label?: string;
}

/**
 * Composant bouton "Suivant" pour la session TAJWID
 * Variante spécialisée du bouton de navigation générique
 * Peut avoir un styling différent si besoin
 */
const NextButtonTajwid: React.FC<NextButtonTajwidProps> = ({
  currentChapter,
  currentType,
  currentPage,
  className = "",
  buttonClassName = "",
  label
}) => {
  const {
    handleNext,
    nextContent,
    showModal,
    setShowModal
  } = useNavigationNext({
    currentChapter,
    currentType,
    currentPage,
    module: 'TAJWID'
  });

  if (!nextContent) {
    return null;
  }

  const buttonLabel = label || nextContent.label;
  // Style Tajwid spécifique (peut être customisé)
  const defaultButtonClass = "group flex items-center gap-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105";
  const combinedButtonClass = buttonClassName || defaultButtonClass;

  return (
    <div className={`flex justify-end items-center ${className}`}>
      <button
        onClick={handleNext}
        className={combinedButtonClass}
        aria-label={buttonLabel}
      >
        <span className="text-base md:text-lg">{buttonLabel}</span>
        <ChevronRight className="w-5 h-5 md:w-6 md:h-6 group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  );
};

export default NextButtonTajwid;
