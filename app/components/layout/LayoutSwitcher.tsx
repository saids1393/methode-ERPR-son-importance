'use client';

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import DesktopLayout from "./DesktopLayout";
import MobileLayout from "./MobileLayout";

export default function LayoutSwitcher({ children }: { children: React.ReactNode }) {
  const [isMobile, setIsMobile] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    const handleResize = () => setIsMobile(mediaQuery.matches);

    handleResize();
    mediaQuery.addEventListener('change', handleResize);
    return () => mediaQuery.removeEventListener('change', handleResize);
  }, []);

  useEffect(() => {
    let hasStartedCourse = false;
    let isProfessorAccess = false;
    
    // Vérification côté client uniquement
    if (typeof window !== 'undefined') {
      hasStartedCourse = localStorage.getItem('courseStarted') === 'true';
      isProfessorAccess = document.cookie.includes('professor-course-token');
      console.log('🔍 LAYOUT - Course started check:', hasStartedCourse, 'for path:', pathname);
      console.log('👨‍🏫 LAYOUT - Professor access check:', isProfessorAccess);
    }
    
    // LOGIQUE SÉPARÉE pour sidebar :
    let shouldShowSidebar = false;
    
    if (pathname.startsWith('/chapitres/')) {
      if (isProfessorAccess) {
        // Professeur : toujours afficher la sidebar dans les chapitres
        shouldShowSidebar = true;
        console.log('📱 SIDEBAR PROFESSEUR activée');
      } else if (hasStartedCourse) {
        // Élève : afficher seulement si le cours a été commencé
        shouldShowSidebar = true;
        console.log('📱 SIDEBAR ÉLÈVE activée');
      } else {
        console.log('📱 SIDEBAR DÉSACTIVÉE - cours non commencé par élève');
      }
    }
    
    console.log('📱 DÉCISION FINALE - Show sidebar:', shouldShowSidebar);
    setShowSidebar(shouldShowSidebar);
  }, [pathname]);

  // Si pas de sidebar nécessaire, afficher le contenu directement
  if (!showSidebar) {
    return <div className="min-h-screen">{children}</div>;
  }

  // Utiliser le layout avec sidebar
  return isMobile ? (
    <MobileLayout>{children}</MobileLayout>
  ) : (
    <DesktopLayout>{children}</DesktopLayout>
  );
}