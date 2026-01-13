'use client';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { BookOpen, Menu, X } from 'lucide-react';
import SidebarContentTajwid from "@/app/components/SidebarContentTajwid";

export default function MobileLayoutTajwid({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
        setSidebarOpen(true); // Ouvrir la sidebar
        localStorage.removeItem('autoOpenCourseSidebar'); // Supprimer le flag
      }
    } catch (e) {
      console.warn('localStorage non disponible:', e);
    }
  }, [pathname, mounted]); // Re-vérifier à chaque changement de page

  // Bloquer le scroll du body quand la sidebar est ouverte
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    // Nettoyage au démontage
    return () => {
      document.body.style.overflow = '';
    };
  }, [sidebarOpen]);
  return (
    <div className="md:hidden flex flex-col h-screen w-full bg-zinc-950">
      {/* Header mobile */}
<header className="sticky top-0 z-30 bg-gray-900 border-b border-white-100 backdrop-blur-sm">
  <div className="px-4 py-3 flex items-center justify-between">
    <div className="flex items-center gap-3">
      <button 
        onClick={() => setSidebarOpen(!sidebarOpen)} 
        className="p-2 -ml-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-all duration-200 active:scale-95"
        aria-label={sidebarOpen ? "Fermer le menu" : "Ouvrir le menu"}
      >
        {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
      </button>
      
      <div className="flex items-center gap-1">
  <div className="p-1.5 rounded-lg">
    <img
      src="/img/logo_ecrit_blanc-point.png" // 👉 remplace par ton chemin d'image
      alt="Logo Méthode ERPR"
      className="w-9 h-8 object-contain "
    />
  </div>
  <h1 className="md:text-xl sm:text-md font-bold text-white" style={{ fontFamily: "'Spectral', serif" }}>
    Méthode ERPR
  </h1>
</div>

    </div>
    
  </div>
</header>

      {/* Contenu principal scrollable */}
      <main className="flex-1 overflow-y-auto w-full">
        <div className="w-full h-full">
          {children}
        </div>
      </main>

      {/* Sidebar mobile en overlay */}
      {sidebarOpen && (
         <div className="fixed inset-0 z-40 flex">
          <div 
            onClick={() => setSidebarOpen(false)} 
            className="absolute inset-0 bg-black/50 transition-opacity duration-300" 
          />
          <aside className="relative z-50 h-full w-72 bg-gradient-to-b from-zinc-900 to-zinc-800 shadow-xl transform transition-transform duration-300">
            <SidebarContentTajwid />
          </aside>
        </div>
      )}
    </div>
  );
}
