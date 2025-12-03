'use client';

import { useState, useEffect } from 'react';

export type CourseModule = 'LECTURE' | 'TAJWID';

export const useModuleContext = () => {
  const [activeModule, setActiveModule] = useState<CourseModule>('LECTURE');
  const [hasTajwidAccess, setHasTajwidAccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Charger le module depuis le localStorage au montage
  useEffect(() => {
    setIsLoading(true);
    const savedModule = localStorage.getItem('activeModule') as CourseModule;
    if (savedModule && (savedModule === 'LECTURE' || savedModule === 'TAJWID')) {
      setActiveModule(savedModule);
    }

    // Vérifier l'accès à Tajwid
    checkTajwidAccess();
    setIsLoading(false);
  }, []);

  // Sauvegarder le module dans le localStorage lors du changement
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('activeModule', activeModule);
    }
  }, [activeModule, isLoading]);

  const checkTajwidAccess = async () => {
    try {
      const response = await fetch('/api/user/check-level-access?module=TAJWID');
      if (response.ok) {
        const { hasAccess } = await response.json();
        setHasTajwidAccess(hasAccess);
      }
    } catch (error) {
      console.error('Error checking Tajwid access:', error);
      setHasTajwidAccess(false);
    }
  };

  const updateModule = (module: CourseModule) => {
    if (module === 'TAJWID' && !hasTajwidAccess) {
      console.warn('User does not have access to Tajwid module');
      return false;
    }
    setActiveModule(module);
    return true;
  };

  return {
    activeModule,
    setActiveModule: updateModule,
    hasTajwidAccess,
    setHasTajwidAccess,
    isLoading,
    checkTajwidAccess
  };
};
