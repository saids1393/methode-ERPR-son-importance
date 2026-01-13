'use client';

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import SidebarContent from "@/app/components/SidebarContent";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function DesktopLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(true); // Par défaut fermé
  const [mounted, setMounted] = useState(false);
  
  // Marquer le composant comme monté côté client
  useEffect(() => {
    setMounted(true);
  }, []);
  
  useEffect(() => {
    if (!mounted) return;
    
    // Vérifier si on doit ouvrir la sidebar automatiquement (à chaque navigation)
    try {
      const shouldAutoOpen = localStorage.getItem('autoOpenCourseSidebar');
      if (shouldAutoOpen === 'true') {
        setCollapsed(false); // Ouvrir la sidebar
        localStorage.removeItem('autoOpenCourseSidebar'); // Supprimer le flag
      }
    } catch (e) {
      console.warn('localStorage non disponible:', e);
    }
  }, [pathname, mounted]); // Re-vérifier à chaque changement de page

  return (
    <div className="flex h-screen overflow-hidden relative z-[1]">
      {/* Sidebar */}
      <div
        className={`transition-all duration-300 bg-zinc-900 border-r border-zinc-800
        ${collapsed ? 'w-0' : 'w-70'}
        relative
      `}
      >
        {!collapsed && (
          <div className="h-full flex flex-col">
            <SidebarContent />
          </div>
        )}

        {/* Toggle button — flèche collée en haut à droite de la sidebar */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`
            absolute top-2 -right-4 z-50 
            bg-zinc-800 hover:bg-zinc-700 text-white 
            rounded-full p-1 shadow-md border border-zinc-700
            transition-all duration-300
            ${collapsed ? 'translate-x-4' : ''}
          `}
          title={collapsed ? "Ouvrir le menu" : "Fermer le menu"}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-1">{children}</div>
      </div>
    </div>
  );
}
