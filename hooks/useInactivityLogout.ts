'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

const INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 minutes

export function useInactivityLogout() {
  const router = useRouter();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const logout = async () => {
      console.log('[INACTIVITY] Timeout déclenché - déconnexion utilisateur');
      try {
        const response = await fetch('/api/auth/logout', { method: 'POST' });
        
        if (response.ok) {
          console.log('[INACTIVITY] Logout réussi');
          router.push('/login?reason=inactivity');
        }
      } catch (error) {
        console.error('[INACTIVITY] Erreur logout:', error);
        router.push('/login?reason=inactivity');
      }
    };

    const resetTimer = () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(logout, INACTIVITY_TIMEOUT);
    };

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    events.forEach(e => document.addEventListener(e, resetTimer));
    
    resetTimer();

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      events.forEach(e => document.removeEventListener(e, resetTimer));
    };
  }, [router]);

  return null;
}