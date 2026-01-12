'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  MessageCircle,
  Send,
  ChevronRight,
  Loader2,
  Bell,
  Headphones,
  HelpCircle,
  BookOpen,
  Clock,
  UserCheck,
} from 'lucide-react';
import DashboardHeader from '@/app/components/DashboardHeader';
import DashboardSidebar from '@/app/components/DashboardSidebar';

interface User {
  id: string;
  email: string;
  username: string | null;
  gender: 'HOMME' | 'FEMME' | null;
  isActive: boolean;
  accountType?: 'ACTIVE' | 'INACTIVE' | 'PAID_LEGACY';
  subscriptionPlan?: 'SOLO' | 'COACHING' | null;
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

interface TajwidHomeworkSend {
  id: string;
  sentAt: string;
  tajwidHomework: {
    id: string;
    chapterId: number;
    title: string;
  };
}

export default function AccompagnementPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [homeworkSends, setHomeworkSends] = useState<HomeworkSend[]>([]);
  const [tajwidHomeworkSends, setTajwidHomeworkSends] = useState<TajwidHomeworkSend[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  // 🔐 Charger les informations utilisateur
  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        
        // 🔍 Vérifier si l'utilisateur a un abonnement actif
        if (userData.accountType === 'INACTIVE' || userData.accountType === 'EXPIRED') {
          // Si pas d'abonnement actif, rediriger vers pricing
          router.push('/pricing');
          return;
        }
        
        // Note: La vérification du plan COACHING se fait dans le middleware (retourne 404)
        
      } else {
        // Si pas authentifié, rediriger vers login
        router.push('/login');
      }
    } catch (error) {
      console.error('Erreur auth:', error);
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  // 🔔 Charger les notifications (devoirs envoyés)
  const fetchHomeworkSends = async () => {
    try {
      // Lecture
      const response = await fetch('/api/homework/user-sends');
      if (response.ok) {
        const data = await response.json();
        setHomeworkSends(data.sends || []);
      }
      // Tajwid
      const tajwidResponse = await fetch('/api/homework/tajwid/user-sends');
      if (tajwidResponse.ok) {
        const tajwidData = await tajwidResponse.json();
        setTajwidHomeworkSends(tajwidData.sends || []);
      }
    } catch (error) {
      console.error('Erreur de récupération des notifications :', error);
    }
  };

  useEffect(() => {
    fetchUserData();
    fetchHomeworkSends();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 text-lg font-medium">
            Chargement de votre espace d'accompagnement...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center text-gray-600">
          <p>Erreur lors du chargement des données</p>
          <Link href="/dashboard" className="text-blue-600 hover:text-blue-800">
            Retour au tableau de bord
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
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
      <div className="lg:ml-64">
        <DashboardHeader
          user={user}
          homeworkSends={homeworkSends}
          tajwidHomeworkSends={tajwidHomeworkSends}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
        />

        <main className="p-6 lg:p-10">
          {/* Titre principal */}
          <div className="mb-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-2xl mb-4">
              <Headphones className="h-8 w-8 text-indigo-600" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
              Espace d’Accompagnement
            </h1>
            <p className="text-gray-600 text-lg">
              Profitez d’un suivi personnalisé via WhatsApp ou Telegram.
            </p>
          </div>

          {/* Cartes d'accompagnement */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {/* Assistance en cas de difficulté */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="bg-red-100 w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0">
                  <HelpCircle className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Assistance en cas de difficulté
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Vous êtes bloqué sur une leçon ? Vous ne comprenez pas un concept ? 
                    Contactez-nous immédiatement et recevez une explication personnalisée 
                    adaptée à votre niveau et votre rythme d'apprentissage.
                  </p>
                </div>
              </div>
            </div>

            {/* Soutien ponctuel sur une page précise */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="bg-purple-100 w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0">
                  <BookOpen className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Soutien ponctuel sur une page précise
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Besoin d'aide sur une page ou un exercice en particulier ? 
                    Envoyez-nous le numéro de la page ou une capture d'écran, 
                    et nous vous fournirons une aide ciblée et détaillée.
                  </p>
                </div>
              </div>
            </div>

            {/* Suivi d'engagement */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="bg-amber-100 w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Clock className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Suivi d'engagement personnalisé
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Nous suivons votre progression : temps passé sur les cours, 
                    pages où vous bloquez, quiz non complétés. Ce suivi nous permet 
                    de vous accompagner au mieux et d'identifier vos points de blocage.
                  </p>
                </div>
              </div>
            </div>

            {/* Relance et aide personnalisée */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="bg-teal-100 w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0">
                  <UserCheck className="h-6 w-6 text-teal-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Relance et aide personnalisée
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Si nous remarquons une inactivité ou un blocage prolongé, 
                    nous vous contactons proactivement pour vous remotiver, 
                    comprendre vos difficultés et vous proposer des solutions adaptées.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Section Nous contacter */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Nous contacter
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* WhatsApp */}
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-green-100 w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    WhatsApp
                  </h3>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  Des problèmes, des questions, besoin de conseils ? Contactez-nous
                  directement sur WhatsApp. Nous répondons rapidement.
                </p>
                <a
                  href="https://wa.me/201022767532"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium px-5 py-2.5 rounded-lg transition-colors"
                >
                  <MessageCircle className="h-5 w-5" />
                  Contacter sur WhatsApp
                </a>
              </div>

              {/* Telegram */}
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-blue-100 w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Send className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Groupe Telegram Privé
                  </h3>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  Rejoignez notre groupe privé Telegram pour des échanges.
                </p>
                <a
                  href="https://t.me/+9QaRDegbynljNmY0"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2.5 rounded-lg transition-colors"
                >
                  <Send className="h-5 w-5" />
                  Rejoindre le groupe
                </a>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
