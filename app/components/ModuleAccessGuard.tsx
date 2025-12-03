'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle, Lock, Home } from 'lucide-react';

interface ModuleAccessGuardProps {
  chapterNumber: number;
  module?: 'LECTURE' | 'TAJWID';
  children: React.ReactNode;
}

export default function ModuleAccessGuard({
  chapterNumber,
  module = 'LECTURE',
  children
}: ModuleAccessGuardProps) {
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAccess = async () => {
      try {
        setLoading(true);
        
        // Récupérer l'utilisateur ET ses modules
        const userRes = await fetch('/api/auth/me');
        if (!userRes.ok) {
          router.push('/login');
          return;
        }

        const userData = await userRes.json();
        const userHasLecture = userData.hasLecture === true;
        const userHasTajwid = userData.hasTajwid === true;

        // Si pas d'achats du tout
        if (!userHasLecture && !userHasTajwid) {
          setError('Vous n\'avez pas acheté de cours');
          setHasAccess(false);
          setLoading(false);
          return;
        }

        // Par défaut, les chapitres sans module défini sont LECTURE
        const effectiveModule = module || 'LECTURE';

        // Vérifier l'accès
        let hasAccess = false;
        if (effectiveModule === 'LECTURE' && userHasLecture) {
          hasAccess = true;
        } else if (effectiveModule === 'TAJWID' && userHasTajwid) {
          hasAccess = true;
        }

        if (!hasAccess) {
          // L'utilisateur n'a pas accès - redirection intelligente
          let userModule = '';
          if (userHasLecture) {
            userModule = 'LECTURE';
          } else if (userHasTajwid) {
            userModule = 'TAJWID';
          }

          const moduleLabel = effectiveModule === 'TAJWID' ? 'Tajwid' : 'Lecture';
          const userModuleLabel = userModule === 'TAJWID' ? 'Tajwid' : 'Lecture';

          if (userModule) {
            setError(`Vous avez accès à ${userModuleLabel}, pas à ${moduleLabel}. Redirection vers votre module...`);
            setTimeout(() => {
              if (userModule === 'TAJWID') {
                router.push('/chapitres-tajwid/1/1');
              } else {
                router.push('/chapitres/1/1');
              }
            }, 2000);
          } else {
            setError(`Vous n'avez accès à aucun module. Veuillez acheter un cours.`);
          }
          setHasAccess(false);
        } else {
          setHasAccess(true);
        }
      } catch (err) {
        console.error('Erreur lors de la vérification d\'accès:', err);
        setError('Erreur lors de la vérification d\'accès');
        setHasAccess(false);
      } finally {
        setLoading(false);
      }
    };

    checkAccess();
  }, [module, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-300">Vérification d'accès...</p>
        </div>
      </div>
    );
  }

  if (!hasAccess || error) {
    const isRedirecting = error?.includes('Redirection vers votre module');
    
    return (
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-zinc-800 rounded-lg p-8 text-center border border-red-500/20">
          <Lock className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">
            {isRedirecting ? 'Accès au mauvais module' : 'Accès refusé'}
          </h1>
          <div className="flex items-start bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6">
            <AlertCircle className="w-5 h-5 text-red-400 mr-3 mt-0.5 flex-shrink-0" />
            <p className="text-gray-300 text-sm text-left">
              {error || `Vous n'avez pas accès à ce chapitre du module ${module}.`}
            </p>
          </div>

          {isRedirecting ? (
            <div className="space-y-3">
              <div className="flex items-center justify-center space-x-2 py-3">
                <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm text-gray-300">Redirection en cours...</span>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <a
                href="/checkout"
                className="block w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
              >
                Acheter l'accès
              </a>
              <a
                href="/dashboard"
                className="flex items-center justify-center w-full py-2 px-4 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors"
              >
                <Home className="w-4 h-4 mr-2" />
                Retour au dashboard
              </a>
            </div>
          )}

          <p className="text-xs text-gray-500 mt-4">
            Si vous pensez que c'est une erreur, contactez le support.
          </p>
        </div>
      </div>
    );
  }

  if (!hasAccess) {
    return null;
  }

  return <>{children}</>;
}
