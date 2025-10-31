"use client";

import React from 'react';
import UniversalNavigation from './UniversalNavigation';

interface PageNavigationProps {
  currentChapter: number;
  currentPage: number;
  className?: string;
}

const PageNavigation: React.FC<PageNavigationProps> = ({
  currentChapter,
  currentPage,
  className = ""
}) => {
  return (
    <UniversalNavigation
      currentChapter={currentChapter}
      currentType="page"
      currentPage={currentPage}
      className={className}
    />
  );
};

export default PageNavigation;