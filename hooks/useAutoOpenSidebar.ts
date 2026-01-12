import { useEffect, useState } from 'react';

/**
 * Hook pour ouvrir la sidebar cours automatiquement si l'utilisateur vient du dashboard
 * Vérifie le flag 'autoOpenCourseSidebar' dans localStorage
 * @returns {boolean} sidebarOpen - état d'ouverture de la sidebar
 * @returns {function} setSidebarOpen - fonction pour modifier l'état
 */
export function useAutoOpenSidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // Vérifier si on doit ouvrir la sidebar automatiquement
    const shouldAutoOpen = localStorage.getItem('autoOpenCourseSidebar');
    if (shouldAutoOpen === 'true') {
      setSidebarOpen(true);
      // Supprimer le flag après utilisation pour ne pas réouvrir à chaque navigation
      localStorage.removeItem('autoOpenCourseSidebar');
    }
  }, []);

  return { sidebarOpen, setSidebarOpen };
}
