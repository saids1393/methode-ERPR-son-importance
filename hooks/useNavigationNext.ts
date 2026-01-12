"use client";

import { useCallback, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getNextContent, ContentType, ModuleType } from '@/lib/chapters';

interface UseNavigationNextProps {
  currentChapter: number;
  currentType: ContentType;
  currentPage?: number;
  module: ModuleType;
}

interface UseNavigationNextResult {
  handleNext: () => void;
  nextContent: ReturnType<typeof getNextContent> | undefined;
  userStatus: string | null;
  showModal: boolean;
  setShowModal: (show: boolean) => void;
}

/**
 * Hook réutilisable pour gérer la navigation suivante
 * Gère les restrictions Free Trial et les transitions entre contenus
 */
export const useNavigationNext = ({
  currentChapter,
  currentType,
  currentPage,
  module
}: UseNavigationNextProps): UseNavigationNextResult => {
  const router = useRouter();
  const nextContent = getNextContent(currentChapter, currentType, currentPage, module);
  const [userStatus, setUserStatus] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Récupérer le statut de l'utilisateur
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

  /**
   * Gère le clic sur le bouton suivant
   * Vérifie les restrictions et navigue vers le contenu suivant
   */
  const handleNext = useCallback(() => {
    if (!nextContent) return;

    // Vérifier les restrictions pour comptes inactifs
    const isInactive = userStatus === 'INACTIVE';
    const isFromChapter1Quiz = currentChapter === 1 && currentType === 'quiz';
    const isNextChapterRestricted = nextContent.chapterNumber && nextContent.chapterNumber >= 2;

    if (isInactive && isFromChapter1Quiz && isNextChapterRestricted) {
      setShowModal(true);
      return;
    }

    // Navigation
    router.push(nextContent.href);
  }, [nextContent, userStatus, currentChapter, currentType, router]);

  return {
    handleNext,
    nextContent,
    userStatus,
    showModal,
    setShowModal
  };
};
