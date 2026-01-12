'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  CreditCard,
  Check,
  Loader2,
  Crown,
  Users,
  ExternalLink,
  Calendar,
  RefreshCw,
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
  subscriptionStartDate?: string | null;
  subscriptionEndDate?: string | null;
  stripeCustomerId?: string | null;
  stripeSubscriptionId?: string | null;
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

export default function AbonnementPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [portalLoading, setPortalLoading] = useState(false);
  const [homeworkSends, setHomeworkSends] = useState<HomeworkSend[]>([]);
  const [tajwidHomeworkSends, setTajwidHomeworkSends] = useState<TajwidHomeworkSend[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        
        if (userData.accountType === 'INACTIVE' || userData.accountType === 'EXPIRED') {
          router.push('/pricing');
          return;
        }
      } else {
        router.push('/login');
      }
    } catch (error) {
      console.error('Erreur auth:', error);
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

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

  const openCustomerPortal = async () => {
    setPortalLoading(true);
    try {
      const response = await fetch('/api/stripe/customer-portal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      
      const data = await response.json();
      
      if (response.ok && data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || 'Erreur lors de l\'ouverture du portail');
        setPortalLoading(false);
      }
    } catch (error) {
      alert('Erreur de connexion');
      setPortalLoading(false);
    }
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'Non définie';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 relative z-50">
        <div className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 z-50 lg:translate-x-0 -translate-x-full lg:block hidden">
          <div className="p-6">
            <div className="flex items-center space-x-1 mb-8">
              <div className="w-10 h-10 rounded-lg bg-gray-200 animate-pulse"></div>
              <div className="h-6 w-32 bg-gray-200 animate-pulse rounded"></div>
            </div>
            {[1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="flex items-center space-x-3 px-3 py-2 rounded-lg mb-2">
                <div className="w-5 h-5 bg-gray-200 animate-pulse rounded"></div>
                <div className="h-4 w-24 bg-gray-200 animate-pulse rounded"></div>
              </div>
            ))}
          </div>
        </div>
        <div className="lg:ml-64 relative z-50 bg-gray-50 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600 text-lg font-medium">Chargement...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const plans = [
    {
      id: 'SOLO',
      name: 'Solo',
      price: '10€',
      period: '/mois',
      description: 'Accès complet aux cours en autonomie',
      features: [
        'Accès à tous les cours',
        'Quiz et exercices',
        'Suivi de progression',
        'Support par email',
      ],
      icon: Users,
      color: 'blue',
    },
    {
      id: 'COACHING',
      name: 'Coaching',
      price: '30€',
      period: '/mois',
      description: 'Accompagnement personnalisé avec un professeur',
      features: [
        'Tout le plan Solo',
        'Accompagnement personnalisé',
        'Correction des devoirs',
        'Sessions de coaching',
        'Support prioritaire',
      ],
      icon: Crown,
      color: 'purple',
    },
  ];

  const currentPlan = plans.find(p => p.id === user.subscriptionPlan);

  return (
    <div className="min-h-screen bg-gray-50 relative z-50">
      <DashboardSidebar
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />

      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        ></div>
      )}

      <div className="lg:ml-64 relative z-40 bg-gray-50 min-h-screen">
        <DashboardHeader
          user={user}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
          homeworkSends={homeworkSends}
          tajwidHomeworkSends={tajwidHomeworkSends}
        />

        <main className="p-4 lg:p-8">
          {/* Titre */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2" style={{ fontFamily: "'Spectral', sans-serif" }}>
              Gérer mon abonnement
            </h1>
            <p className="text-gray-500">Consultez et gérez votre abonnement actuel</p>
          </div>

          {/* Abonnement actuel */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-blue-600" />
                Abonnement actuel
              </h2>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                user.accountType === 'ACTIVE' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {user.accountType === 'ACTIVE' ? 'Actif' : 'Inactif'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              {/* Plan */}
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-500 mb-1">Plan</p>
                <p className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  {user.subscriptionPlan === 'COACHING' && <Crown className="h-5 w-5 text-purple-600" />}
                  {user.subscriptionPlan === 'SOLO' && <Users className="h-5 w-5 text-blue-600" />}
                  {user.subscriptionPlan === 'COACHING' ? 'Coaching' : 'Solo'}
                </p>
              </div>

              {/* Prix */}
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-500 mb-1">Prix mensuel</p>
                <p className="text-lg font-semibold text-gray-900">
                  {user.subscriptionPlan === 'COACHING' ? '30€' : '10€'}
                </p>
              </div>

              {/* Date de début */}
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-500 mb-1 flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Début
                </p>
                <p className="text-lg font-semibold text-gray-900">
                  {formatDate(user.subscriptionStartDate)}
                </p>
              </div>

              {/* Prochaine facturation */}
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-500 mb-1 flex items-center gap-1">
                  <RefreshCw className="h-4 w-4" />
                  Prochain renouvellement
                </p>
                <p className="text-lg font-semibold text-gray-900">
                  {formatDate(user.subscriptionEndDate)}
                </p>
              </div>
            </div>

            {/* Bouton pour ouvrir le portail Stripe */}
            <div className="flex flex-col items-center">
              <button
                onClick={openCustomerPortal}
                disabled={portalLoading}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {portalLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Ouverture...
                  </>
                ) : (
                  <>
                    <ExternalLink className="h-5 w-5" />
                    Gérer mon abonnement
                  </>
                )}
              </button>
              <p className="text-sm text-gray-400 mt-3">
                Annulez pour changer votre abonnement
              </p>
            </div>
          </div>

          {/* Plans disponibles (info seulement) */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Nos plans</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {plans.map((plan) => {
                const isCurrentPlan = plan.id === user.subscriptionPlan;
                const Icon = plan.icon;
                
                return (
                  <div
                    key={plan.id}
                    className={`relative bg-white rounded-xl border-2 p-6 transition-all ${
                      isCurrentPlan 
                        ? 'border-blue-500 shadow-lg' 
                        : 'border-gray-200'
                    }`}
                  >
                    {isCurrentPlan && (
                      <div className="absolute -top-3 left-4 px-3 py-1 bg-blue-500 text-white text-xs font-medium rounded-full">
                        Plan actuel
                      </div>
                    )}
                    
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl mb-3 ${
                          plan.color === 'purple' ? 'bg-purple-100' : 'bg-blue-100'
                        }`}>
                          <Icon className={`h-6 w-6 ${
                            plan.color === 'purple' ? 'text-purple-600' : 'text-blue-600'
                          }`} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                        <p className="text-gray-500 text-sm">{plan.description}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-2xl font-bold text-gray-900">{plan.price}</span>
                        <span className="text-gray-500 text-sm">{plan.period}</span>
                      </div>
                    </div>

                    <ul className="space-y-3">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2 text-gray-600">
                          <Check className={`h-5 w-5 ${
                            plan.color === 'purple' ? 'text-purple-500' : 'text-blue-500'
                          }`} />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
            <p className="text-sm text-gray-500 mt-4 text-center">
              Pour changer de plan, cliquez sur &quot;Gérer mon abonnement&quot; ci-dessus.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
