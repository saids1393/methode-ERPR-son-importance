import { useState, useEffect } from 'react';

export function useUserModule() {
  const [module, setModule] = useState<'LECTURE' | 'TAJWID' | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserModule = async () => {
      try {
        setLoading(true);
        
        // Récupérer l'utilisateur avec ses modules depuis /api/auth/me
        const res = await fetch('/api/auth/me');
        
        if (!res.ok) {
          setError('Impossible de récupérer les modules');
          setLoading(false);
          return;
        }

        const userData = await res.json();

        // Chercher d'abord le module LECTURE
        if (userData.hasLecture) {
          setModule('LECTURE');
          return;
        }

        // Sinon chercher TAJWID
        if (userData.hasTajwid) {
          setModule('TAJWID');
          return;
        }

        // Pas d'accès à aucun module
        setError('Aucun module accessible');
      } catch (err) {
        console.error('Erreur lors de la récupération du module:', err);
        setError('Erreur lors de la récupération du module');
      } finally {
        setLoading(false);
      }
    };

    fetchUserModule();
  }, []);

  return { module, loading, error };
}
