'use client';
import { useState, useEffect } from 'react';
import { BookOpen, Menu, X } from 'lucide-react';
import SidebarContent from "@/app/components/SidebarContent";

export default function MobileLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [courseStarted, setCourseStarted] = useState(false);
  
  useEffect(() => {
    // Vérifier si le cours a été commencé
    setCourseStarted(localStorage.getItem('courseStarted') === 'true');
  }, []);

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

  // Si le cours n'a pas été commencé, ne pas afficher la sidebar
  if (!courseStarted) {
    return <div className="min-h-screen">{children}</div>;
  }
  return (
    <div className="md:hidden flex flex-col h-screen w-full bg-zinc-950">
      {/* Header mobile */}
      <header className="sticky top-0 z-30 p-4 bg-zinc-900 flex items-center border-b border-zinc-700">
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)} 
          className="mr-4 text-zinc-300 hover:text-white transition-colors"
          aria-label={sidebarOpen ? "Fermer le menu" : "Ouvrir le menu"}
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        <h1 className="text-xl font-bold flex items-center gap-2">
          <BookOpen className="text-blue-400" size={20} />
          <span>Sommaire</span>
        </h1>
      </header>

      {/* Contenu principal scrollable */}
      <main className="flex-1 overflow-y-auto p-4 w-full">
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
            <SidebarContent />
          </aside>
        </div>
      )}
    </div>
  );
}
