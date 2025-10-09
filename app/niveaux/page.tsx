'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Gift,
  BookOpen,
  GraduationCap,
  Sparkles,
  Clock,
  Lock,
} from 'lucide-react';
import DashboardHeader from '@/app/components/DashboardHeader';
import DashboardSidebar from '@/app/components/DashboardSidebar';

interface User {
  id: string;
  email: string;
  username: string | null;
  gender: 'HOMME' | 'FEMME' | null;
  isActive: boolean;
}

export default function NiveauxPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  const fetchUserData = async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        setUser(data);
      } else {
        router.push('/checkout');
      }
    } catch (error) {
      console.error('Erreur auth:', error);
      router.push('/checkout');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Chargement des niveaux...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const niveaux = [
    {
      id: 1,
      title: 'Blog Tajwid',
      icon: <BookOpen className="h-10 w-10 text-indigo-600" />,
      description:
        "Un espace d’apprentissage du Tajwid sous forme d’articles clairs et audio-guidés. Disponible avant le mois béni du Ramadan إن شاء الله.",
      badge: 'Sortie avant Ramadan 2026',
      comingSoon: true,
      color: 'indigo',
    },
    {
      id: 2,
      title: 'Niveau Tamhidi',
      icon: <GraduationCap className="h-10 w-10 text-emerald-600" />,
      description:
        "Introduction à la langue arabe : conjugaison, vocabulaire, étude de texte. Parfait pour bien démarrer et consolider les bases.",
      badge: 'Disponible courant 2026',
      comingSoon: true,
      color: 'emerald',
    },
    {
      id: 3,
      title: 'Niveau 1',
      icon: <Sparkles className="h-10 w-10 text-rose-600" />,
      description:
        "Un parcours complet : étude de texte, vocabulaire, conjugaison et grammaire. Structuré pour progresser pas à pas vers la maîtrise.",
      badge: 'Disponible courant 2026',
      comingSoon: true,
      color: 'rose',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardSidebar
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />

      {/* Overlay mobile */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Contenu principal */}
      <div className="lg:ml-64">
       <DashboardHeader
  user={user}
  mobileMenuOpen={mobileMenuOpen}
  setMobileMenuOpen={setMobileMenuOpen}
  homeworkSends={[]}
/>


        <main className="p-6 lg:p-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-2xl mb-4">
              <Gift className="h-8 w-8 text-indigo-600" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
              Niveaux et Modules à Venir
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Découvrez les prochains modules et niveaux à débloquer, conçus
              pour approfondir votre apprentissage étape par étape.
            </p>
          </div>

          {/* Grille responsive */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {niveaux.map((niveau) => (
              <div
                key={niveau.id}
                className="relative bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group"
              >
                {/* Bande colorée */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br from-${niveau.color}-50 to-white opacity-70 group-hover:opacity-100 transition duration-500`}
                />
                <div className="relative z-10 p-8 flex flex-col items-start">
                  <div
                    className={`bg-${niveau.color}-100 rounded-xl w-16 h-16 flex items-center justify-center mb-6`}
                  >
                    {niveau.icon}
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                    {niveau.title}
                  </h2>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {niveau.description}
                  </p>

                  <div className="mt-auto flex items-center justify-between w-full">
                    <span
                      className={`text-sm font-medium bg-${niveau.color}-50 text-${niveau.color}-700 px-3 py-1 rounded-full flex items-center space-x-1`}
                    >
                      <Clock className="h-4 w-4" />
                      <span>{niveau.badge}</span>
                    </span>

                    {niveau.comingSoon && (
                      <div className="bg-gray-100 p-2 rounded-full">
                        <Lock className="h-5 w-5 text-gray-500" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Ruban “À venir” */}
                {niveau.comingSoon && (
                  <div className="absolute top-4 right-[-40px] rotate-45 bg-gradient-to-r from-indigo-500 to-indigo-700 text-white text-sm font-semibold py-1 px-12 shadow-md">
                    À venir
                  </div>
                )}
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
