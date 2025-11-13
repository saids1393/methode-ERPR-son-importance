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
} from 'lucide-react';
import DashboardHeader from '@/app/components/DashboardHeader';
import DashboardSidebar from '@/app/components/DashboardSidebar';

interface User {
  id: string;
  email: string;
  username: string | null;
  gender: 'HOMME' | 'FEMME' | null;
  isActive: boolean;
  accountType: 'FREE_TRIAL' | 'PAID_FULL' | 'PAID_PARTIAL';
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

export default function AccompagnementPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [homeworkSends, setHomeworkSends] = useState<HomeworkSend[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  // 🔐 Charger les informations utilisateur
  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
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

  // 🔔 Charger les notifications (devoirs envoyés)
  const fetchHomeworkSends = async () => {
    try {
      const response = await fetch('/api/homework/user-sends');
      if (response.ok) {
        const data = await response.json();
        setHomeworkSends(data.sends || []);
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
        user={user!}
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Carte WhatsApp */}
            <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow duration-300 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-green-50 w-24 h-24 rounded-bl-[80px]" />
              <div className="relative z-10">
                <div className="bg-green-100 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                  <MessageCircle className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  Accompagnement individuel via WhatsApp
                </h3>
                <p className="text-gray-600 mb-8 leading-relaxed">
                  Des problèmes, des questions, besoin de conseils ? Contactez-nous
                  directement sur WhatsApp. Nous répondons rapidement, par écrit
                  ou message vocal.
                </p>
                <a
                  href="https://wa.me/201022767532"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center space-x-3"
                >
                  <MessageCircle className="h-6 w-6" />
                  <span>Contacter sur WhatsApp</span>
                  <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>

            {/* Carte Telegram */}
            <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow duration-300 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-blue-50 w-24 h-24 rounded-bl-[80px]" />
              <div className="relative z-10">
                <div className="bg-blue-100 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                  <Send className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  Groupe Telegram Privé
                </h3>
                <p className="text-gray-600 mb-8 leading-relaxed">
                  Rejoignez notre groupe privé Telegram pour des échanges, quiz,
                  et sessions de questions-réponses exclusives avec le formateur.
                </p>
                <a
                  href="https://t.me/+9QaRDegbynljNmY0"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center space-x-3"
                >
                  <Send className="h-6 w-6" />
                  <span>Rejoindre le groupe Telegram</span>
                  <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
