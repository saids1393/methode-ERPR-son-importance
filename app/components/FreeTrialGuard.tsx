'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface TrialAccessInfo {
  hasAccess: boolean;
  isFreeTrial: boolean;
  daysLeft: number;
  reason: string;
}

export default function FreeTrialGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [accessInfo, setAccessInfo] = useState<TrialAccessInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAccess();
  }, [pathname]);

  const checkAccess = async () => {
    try {
      const response = await fetch('/api/auth/check-trial-access');

      if (!response.ok) {
        router.push('/login');
        return;
      }

      const data: TrialAccessInfo = await response.json();
      setAccessInfo(data);

      if (data.isFreeTrial && !data.hasAccess) {
        router.push('/checkout');
        return;
      }

      if (data.isFreeTrial && data.hasAccess) {
        const isAllowedPath =
          pathname === '/dashboard' ||
          pathname === '/notice' ||
          pathname.startsWith('/chapitres/0') ||
          pathname.startsWith('/chapitres/1');

        if (!isAllowedPath) {
          router.push('/dashboard');
          return;
        }
      }

      setLoading(false);
    } catch (error) {
      console.error('Access check error:', error);
      router.push('/login');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white">Vérification de l'accès...</div>
      </div>
    );
  }

  if (accessInfo?.isFreeTrial && accessInfo.hasAccess && accessInfo.daysLeft > 0) {
    return (
      <>
        <div className="bg-yellow-900/20 border-b border-yellow-500/30 py-2 px-4 text-center">
          <p className="text-sm text-yellow-400">
            Essai gratuit : {accessInfo.daysLeft} jour{accessInfo.daysLeft > 1 ? 's' : ''} restant{accessInfo.daysLeft > 1 ? 's' : ''} |
            Accès limité au chapitre 1 |
            <a href="/checkout" className="underline ml-2 hover:text-yellow-300">
              Passer au complet
            </a>
          </p>
        </div>
        {children}
      </>
    );
  }

  return <>{children}</>;
}
