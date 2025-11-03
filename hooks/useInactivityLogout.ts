'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

// 30 minutes
const INACTIVITY_TIMEOUT = 30 * 60 * 1000;

export function useInactivityLogout() {
  const router = useRouter();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login?reason=inactivity');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  const resetTimer = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(logout, INACTIVITY_TIMEOUT);
  };

  useEffect(() => {
    const events = ['mousedown','mousemove','keypress','scroll','touchstart','click'];
    const handleActivity = () => resetTimer();

    events.forEach(e => document.addEventListener(e, handleActivity));
    resetTimer();

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      events.forEach(e => document.removeEventListener(e, handleActivity));
    };
  }, []);
}
