'use client';

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import DesktopLayout from "./DesktopLayout";
import DesktopLayoutTajwid from "./DesktopLayoutTajwid";
import MobileLayout from "./MobileLayout";
import MobileLayoutTajwid from "./MobileLayoutTajwid";
import { useInactivityLogout } from '@/hooks/useInactivityLogout';

export default function LayoutSwitcher({ children }: { children: React.ReactNode }) {
   useInactivityLogout()
  const [isMobile, setIsMobile] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [sidebarType, setSidebarType] = useState<'default' | 'tajwid'>('default');
  const [isHydrated, setIsHydrated] = useState(false); // Track hydration
  const pathname = usePathname();


  // Gérer le changement de taille d'écran (pas d'hydration mismatch)
  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    const handleResize = () => setIsMobile(mediaQuery.matches);

    handleResize();
    mediaQuery.addEventListener('change', handleResize);
    return () => mediaQuery.removeEventListener('change', handleResize);
  }, []);

  // Logique de sidebar avec gestion correcte du localStorage et cookies
  useEffect(() => {
    // Parser les cookies correctement
    const getCookie = (name: string) => {
      try {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop()?.split(';').shift();
        return null;
      } catch (e) {
        console.warn('Erreur lecture cookie:', e);
        return null;
      }
    };

    // Fonction sécurisée pour lire localStorage (Safari peut bloquer)
    const safeGetLocalStorage = (key: string): string | null => {
      try {
        return localStorage.getItem(key);
      } catch (e) {
        console.warn('localStorage non disponible:', e);
        return null;
      }
    };

    const hasStartedCourse = safeGetLocalStorage('courseStarted') === 'true';
    const isProfessorAccess = !!getCookie('professor-course-token');

    console.log('🔍 LAYOUT - Course started check:', hasStartedCourse, 'for path:', pathname);
    console.log('👨‍🏫 LAYOUT - Professor access check:', isProfessorAccess);

    // Logique de la sidebar - TOUJOURS afficher sur les pages de chapitres
    // car l'utilisateur est déjà sur la page (donc il a accès)
    let shouldShowSidebar = false;
    let type: 'default' | 'tajwid' = 'default';

    if (pathname.startsWith('/chapitres-tajwid/')) {
      // Si on est sur une page chapitres-tajwid, afficher la sidebar
      shouldShowSidebar = true;
      type = 'tajwid';
      
      if (isProfessorAccess) {
        console.log('📱 SIDEBAR TAJWID PROFESSEUR activée');
      } else if (hasStartedCourse) {
        console.log('📱 SIDEBAR TAJWID ÉLÈVE activée');
      } else {
        // Même sans courseStarted, on affiche la sidebar si on est sur la page
        console.log('📱 SIDEBAR TAJWID activée (utilisateur sur page chapitre)');
      }
    } else if (pathname.startsWith('/chapitres/')) {
      // Si on est sur une page chapitres, afficher la sidebar
      shouldShowSidebar = true;
      
      if (isProfessorAccess) {
        console.log('📱 SIDEBAR PROFESSEUR activée');
      } else if (hasStartedCourse) {
        console.log('📱 SIDEBAR ÉLÈVE activée');
      } else {
        // Même sans courseStarted, on affiche la sidebar si on est sur la page
        console.log('📱 SIDEBAR activée (utilisateur sur page chapitre)');
      }
    }

    console.log('📱 DÉCISION FINALE - Show sidebar:', shouldShowSidebar, 'Type:', type);
    setShowSidebar(shouldShowSidebar);
    setSidebarType(type);
    setIsHydrated(true); // Marquer comme hydraté après le premier calcul
  }, [pathname]);

  // Pendant l'hydration, ne pas afficher la sidebar pour éviter les mismatches
  // (Ou afficher un fallback)
  if (!isHydrated) {
    return (
      <div className="min-h-screen">
        {children}
      </div>
    );
  }

  // Si pas de sidebar nécessaire, afficher le contenu directement
  if (!showSidebar) {
    return (
      <div className="min-h-screen">
        {children}
      </div>
    );
  }

  // Utiliser le layout avec sidebar approprié
  if (sidebarType === 'tajwid') {
    return isMobile ? (
      <MobileLayoutTajwid>{children}</MobileLayoutTajwid>
    ) : (
      <DesktopLayoutTajwid>{children}</DesktopLayoutTajwid>
    );
  }

  return isMobile ? (
    <MobileLayout>{children}</MobileLayout>
  ) : (
    <DesktopLayout>{children}</DesktopLayout>
  );
}