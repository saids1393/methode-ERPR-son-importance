'use client';

import { useInactivityLogout } from '@/hooks/useInactivityLogout';
import { useEffect, useState } from 'react';

export default function InactivityDetector() {
  const [isClient, setIsClient] = useState(false);
  
  useInactivityLogout();

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Ne pas rendre le hook côté serveur
  if (!isClient) return null;

  return null;
}