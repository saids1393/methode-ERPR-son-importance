'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import {
  FileText,
  BookOpen,
  Calendar,
  Loader2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import DashboardHeader from '@/app/components/DashboardHeader';
import DashboardSidebar from '@/app/components/DashboardSidebar';

// Interfaces
interface User {
  id: string;
  email: string;
  username: string | null;
  gender: 'HOMME' | 'FEMME' | null;
  isActive: boolean;
}

interface Homework {
  id: string;
  chapterId: number;
  title: string;
  content: string;
  createdAt: string;
}

interface HomeworkSend {
  id: string;
  sentAt: string;
  homework: {
    id: string;
    chapterId: number;
    title: string;
  };
}

export default function DevoirsPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [homeworks, setHomeworks] = useState<Homework[]>([]);
  const [homeworkSends, setHomeworkSends] = useState<HomeworkSend[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // 🔐 Vérification de l'authentification et récupération de l'utilisateur
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const data = await response.json();
          setUser(data);
        } else {
          router.push('/checkout');
        }
      } catch (error) {
        console.error('Erreur auth:', error);
        router.push('/checkout');
      }
    };

    fetchUser();
  }, [router]);

  // 📚 Récupération des devoirs
  const fetchHomeworks = async () => {
    try {
      const response = await fetch('/api/homework/mine');
      if (response.ok) {
        const data = await response.json();
        setHomeworks(
          data.sort((a: Homework, b: Homework) => a.chapterId - b.chapterId)
        );
      } else {
        toast.error('Erreur lors du chargement des devoirs');
      }
    } catch (error) {
      console.error('Erreur lors du chargement des devoirs :', error);
      toast.error('Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  // ✉️ Récupération des envois de devoirs (notifications)
  const fetchHomeworkSends = async () => {
    try {
      const response = await fetch('/api/homework/user-sends');
      if (response.ok) {
        const data = await response.json();
        setHomeworkSends(data.sends || []);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des envois :', error);
    }
  };

  // ⚙️ Lancer les requêtes
  useEffect(() => {
    fetchHomeworks();
    fetchHomeworkSends();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Chargement des devoirs...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <DashboardSidebar
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />

      {/* Overlay mobile */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        ></div>
      )}

      {/* Contenu principal */}
      <div className="flex-1 lg:ml-64">
        {/* Header */}
        <DashboardHeader
          user={user}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
          homeworkSends={homeworkSends}
        />

        {/* Contenu principal */}
        <main className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            {/* En-tête */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4">
                <FileText className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
                Mes Devoirs
              </h1>
              <p className="text-gray-600 text-lg">
                Retrouvez ici tous vos devoirs à compléter
              </p>
            </div>

            {/* Liste des devoirs */}
            {homeworks.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                <div className="text-6xl mb-4">📚</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Aucun devoir disponible
                </h3>
                <p className="text-gray-600">
                  Les devoirs seront disponibles prochainement.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {homeworks.map((homework) => {
                  const isExpanded = expanded === homework.id;
                  return (
                    <div
                      key={homework.id}
                      className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                    >
                      {/* En-tête du devoir */}
                      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6">
                        <div className="flex items-center space-x-3">
                          <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                            <BookOpen className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-white">
                              Chapitre {homework.chapterId}
                            </h3>
                            <p className="text-blue-100 text-sm">
                              {homework.chapterId === 0
                                ? 'Préparatoire'
                                : homework.chapterId === 11
                                ? 'Évaluation finale'
                                : `Leçon ${homework.chapterId}`}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Contenu du devoir */}
                      <div className="p-6">
                        <h4 className="text-lg font-semibold text-gray-900 mb-3">
                          {homework.title}
                        </h4>

                        <div className="bg-gray-50 rounded-xl p-4 mb-4">
                          <p
                            className={`text-gray-700 text-sm leading-relaxed transition-all duration-300 ${
                              isExpanded ? '' : 'line-clamp-3'
                            }`}
                          >
                            {homework.content}
                          </p>

                          <button
                            onClick={() =>
                              setExpanded(isExpanded ? null : homework.id)
                            }
                            className="mt-2 text-blue-600 text-sm font-medium flex items-center hover:text-blue-800 transition"
                          >
                            {isExpanded ? (
                              <>
                                Voir moins{' '}
                                <ChevronUp className="h-4 w-4 ml-1" />
                              </>
                            ) : (
                              <>
                                Voir plus{' '}
                                <ChevronDown className="h-4 w-4 ml-1" />
                              </>
                            )}
                          </button>
                        </div>

                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="h-4 w-4 mr-2" />
                          <span>
                            {new Date(homework.createdAt).toLocaleDateString(
                              'fr-FR',
                              {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                              }
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
