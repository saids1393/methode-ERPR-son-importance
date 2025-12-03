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
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(';').shift();
      return null;
    };

    const hasStartedCourse = localStorage.getItem('courseStarted') === 'true';
    const isProfessorAccess = !!getCookie('professor-course-token');

    console.log('🔍 LAYOUT - Course started check:', hasStartedCourse, 'for path:', pathname);
    console.log('👨‍🏫 LAYOUT - Professor access check:', isProfessorAccess);

    // Logique de la sidebar
    let shouldShowSidebar = false;
    let type: 'default' | 'tajwid' = 'default';

    if (pathname.startsWith('/chapitres-tajwid/')) {
      if (isProfessorAccess) {
        shouldShowSidebar = true;
        type = 'tajwid';
        console.log('📱 SIDEBAR TAJWID PROFESSEUR activée');
      } else if (hasStartedCourse) {
        shouldShowSidebar = true;
        type = 'tajwid';
        console.log('📱 SIDEBAR TAJWID ÉLÈVE activée');
      } else {
        console.log('📱 SIDEBAR TAJWID DÉSACTIVÉE - cours non commencé par élève');
      }
    } else if (pathname.startsWith('/chapitres/')) {
      if (isProfessorAccess) {
        shouldShowSidebar = true;
        console.log('📱 SIDEBAR PROFESSEUR activée');
      } else if (hasStartedCourse) {
        shouldShowSidebar = true;
        console.log('📱 SIDEBAR ÉLÈVE activée');
      } else {
        console.log('📱 SIDEBAR DÉSACTIVÉE - cours non commencé par élève');
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