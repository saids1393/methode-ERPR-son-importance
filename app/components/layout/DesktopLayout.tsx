'use client';

import SidebarContent from "@/app/components/SidebarContent";

export default function DesktopLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="hidden md:flex h-screen w-full bg-zinc-950">
      {/* Sidebar desktop - version ajustée */}
      <div className="w-72 h-full flex-none relative z-10">
        <div className="fixed top-0 left-0 w-72 h-full bg-gradient-to-b from-zinc-900 to-zinc-800 border-r border-zinc-700 shadow-xl">
          <SidebarContent />
        </div>
      </div>
      
      {/* Contenu principal - version optimisée */}
      <main className="flex-1 h-full overflow-y-auto relative">
        <div className="w-full h-full">
          {children}
        </div>
      </main>
    </div>
  );
}