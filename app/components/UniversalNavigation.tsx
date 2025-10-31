"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import { getNextContent, ContentType } from '@/lib/chapters';

interface UniversalNavigationProps {
  currentChapter: number;
  currentType: ContentType;
  currentPage?: number;
  className?: string;
}

const UniversalNavigation: React.FC<UniversalNavigationProps> = ({
  currentChapter,
  currentType,
  currentPage,
  className = ""
}) => {
  const router = useRouter();
  const nextContent = getNextContent(currentChapter, currentType, currentPage);

  const handleNext = () => {
    if (nextContent) {
      router.push(nextContent.href);
    }
  };

  if (!nextContent) {
    return null;
  }

  return (
    <div className={`flex justify-end items-center ${className}`}>
      <button
        onClick={handleNext}
        className="group flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
        aria-label={nextContent.label}
      >
        <span className="text-base md:text-lg">{nextContent.label}</span>
        <ChevronRight className="w-5 h-5 md:w-6 md:h-6 group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  );
};

export default UniversalNavigation;
