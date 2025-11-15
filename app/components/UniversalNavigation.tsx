"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import { getNextContent, ContentType } from '@/lib/chapters';
import FreeTrialRestrictionModal from './FreeTrialRestrictionModal';

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
  const [userStatus, setUserStatus] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchUserStatus = async () => {
      try {
        const response = await fetch('/api/auth/get-user');
        if (response.ok) {
          const data = await response.json();
          setUserStatus(data.user?.accountType);
        }
      } catch (error) {
        console.error('Error fetching user status:', error);
      }
    };

    fetchUserStatus();
  }, []);

  const handleNext = () => {
    if (nextContent) {
      // Vérifier si l'utilisateur est en FREE_TRIAL et essaie d'accéder au chapitre 2 ou plus
      const isFreeTrial = userStatus === 'FREE_TRIAL';
      const isFromChapter1Quiz = currentChapter === 1 && currentType === 'quiz';
      const isNextChapterRestricted = nextContent.chapterNumber && nextContent.chapterNumber >= 2;

      if (isFreeTrial && isFromChapter1Quiz && isNextChapterRestricted) {
        setShowModal(true);
        return;
      }

      router.push(nextContent.href);
    }
  };

  if (!nextContent) {
    return null;
  }

  return (
    <>
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

      <FreeTrialRestrictionModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        contentName={`chapitre ${nextContent.chapterNumber || 'suivant'}`}
      />
    </>
  );
};

export default UniversalNavigation;
