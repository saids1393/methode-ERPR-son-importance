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
    // Vérifier si l'utilisateur a déjà commencé le cours
    const hasStartedCourse = localStorage.getItem('courseStarted') === 'true';
    
    // Afficher la sidebar seulement si :
    // 1. L'utilisateur a cliqué sur "Commencer maintenant" 
    // 2. ET il est dans les chapitres
    const shouldShowSidebar = hasStartedCourse && pathname.startsWith('/chapitres/');
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