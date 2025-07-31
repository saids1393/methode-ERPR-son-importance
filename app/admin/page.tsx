'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Users,
  TrendingUp,
  Clock,
  Award,
  DollarSign,
  UserCheck,
  BarChart3,
  Settings,
  Eye,
  Calendar,
  Target,
  Activity,
  Menu,
  X,
  Home,
  UserPlus,
  Database,
  Shield,
  Bell,
  Search,
  ChevronRight
} from 'lucide-react';
import AdminSidebar from '@/app/admin/AdminSideBar';
import StatsChart from '@/app/admin/StartsChart';

interface AdminStats {
  overview: {
    totalUsers: number;
    activeUsers: number;
    paidUsers: number;
    recentUsers: number;
    usersWithFullCompletion: number;
    completionRate: number;
  };
  progress: {
    avgCompletedPages: number;
    avgCompletedQuizzes: number;
    avgStudyTime: number;
    totalStudyTime: number;
    totalPossiblePages: number;
    totalPossibleQuizzes: number;
  };
  topUsers: Array<{
    email: string;
    username: string | null;
    studyTimeSeconds: number;
    completedPages: number;
    completedQuizzes: number;
    progressPercentage: number;
  }>;
  chartData: {
    daily: Array<{ date: string; users: number; revenue: number; }>;
    weekly: Array<{ week: string; users: number; revenue: number; }>;
  };
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [chartPeriod, setChartPeriod] = useState<'daily' | 'weekly'>('daily');
  const router = useRouter();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/admin/stats');
        if (response.status === 403) {
          router.push('/dashboard');
          return;
        }
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        } else {
          setError('Erreur lors du chargement des statistiques');
        }
      } catch (err) {
        setError('Erreur de connexion');
        console.error('Error fetching admin stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [router]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}min`;
    }
    return `${minutes}min`;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-900 text-white flex">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-400 mx-auto mb-6"></div>
            <p className="text-lg">Chargement du monitoring...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="min-h-screen bg-zinc-900 text-white flex">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-red-400 text-6xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold mb-4">Erreur d'accès</h1>
            <p className="text-zinc-400 mb-6">{error || 'Impossible de charger les données'}</p>
            <Link
              href="/dashboard"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              Retour au tableau de bord
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-900 text-white flex">
      {/* Sidebar */}
      <AdminSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      {/* Overlay mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Contenu principal */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <header className="bg-zinc-800 border-b border-zinc-700 p-4 lg:p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden text-zinc-300 hover:text-white transition-colors"
              >
                {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold flex items-center gap-3">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-lg">
                    <BarChart3 className="h-6 w-6 lg:h-8 lg:w-8" />
                  </div>
                  Monitoring Administrateur
                </h1>
                <p className="text-zinc-400 mt-1 lg:mt-2">Tableau de bord de surveillance avancé</p>
              </div>
            </div>

            <div className="flex items-center gap-2 lg:gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  className="bg-zinc-700 border border-zinc-600 rounded-lg pl-10 pr-4 py-2 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-purple-500 w-32 lg:w-64"
                />
              </div>
              
              <button className="bg-zinc-700 hover:bg-zinc-600 text-white p-2 rounded-lg transition-colors">
                <Bell size={20} />
              </button>
            </div>
          </div>
        </header>

        {/* Contenu scrollable */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {/* Statistiques principales */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
            <StatCard
              title="Utilisateurs Total"
              value={stats.overview.totalUsers}
              icon={<Users className="h-5 w-5 lg:h-6 lg:w-6" />}
              color="from-blue-500 to-blue-600"
              subtitle="Tous comptes confondus"
              trend="+12% ce mois"
            />
            
            <StatCard
              title="Utilisateurs Actifs"
              value={stats.overview.activeUsers}
              icon={<UserCheck className="h-5 w-5 lg:h-6 lg:w-6" />}
              color="from-green-500 to-green-600"
              subtitle="Comptes activés"
              trend="+8% ce mois"
            />
            
            <StatCard
              title="Utilisateurs Payants"
              value={stats.overview.paidUsers}
              icon={<DollarSign className="h-5 w-5 lg:h-6 lg:w-6" />}
              color="from-yellow-500 to-yellow-600"
              subtitle="Avec paiement Stripe"
              trend="+15% ce mois"
              highlight={true}
            />
            
            <StatCard
              title="Nouveaux (7j)"
              value={stats.overview.recentUsers}
              icon={<Calendar className="h-5 w-5 lg:h-6 lg:w-6" />}
              color="from-purple-500 to-purple-600"
              subtitle="Dernière semaine"
              trend="+5% vs semaine précédente"
            />
          </div>

          {/* Graphiques et métriques */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
            {/* Graphique principal */}
            <div className="xl:col-span-2 bg-zinc-800 border border-zinc-700 rounded-xl p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                <h3 className="text-xl font-bold mb-4 sm:mb-0">Évolution des inscriptions</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => setChartPeriod('daily')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      chartPeriod === 'daily'
                        ? 'bg-purple-600 text-white'
                        : 'bg-zinc-700 text-zinc-300 hover:bg-zinc-600'
                    }`}
                  >
                    Quotidien
                  </button>
                  <button
                    onClick={() => setChartPeriod('weekly')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      chartPeriod === 'weekly'
                        ? 'bg-purple-600 text-white'
                        : 'bg-zinc-700 text-zinc-300 hover:bg-zinc-600'
                    }`}
                  >
                    Hebdomadaire
                  </button>
                </div>
              </div>
              <StatsChart data={stats.chartData[chartPeriod]} period={chartPeriod} />
            </div>

            {/* Métriques de performance */}
            <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-6">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Target className="h-6 w-6 text-green-400" />
                Métriques Clés
              </h3>
              
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-zinc-300 text-sm">Taux de conversion</span>
                    <span className="text-green-400 font-bold">
                      {stats.overview.activeUsers > 0 ? Math.round((stats.overview.paidUsers / stats.overview.activeUsers) * 100) : 0}%
                    </span>
                  </div>
                  <div className="w-full bg-zinc-600 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-green-400 to-green-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${stats.overview.activeUsers > 0 ? (stats.overview.paidUsers / stats.overview.activeUsers) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-zinc-300 text-sm">Taux de completion</span>
                    <span className="text-blue-400 font-bold">{stats.overview.completionRate}%</span>
                  </div>
                  <div className="w-full bg-zinc-600 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-400 to-blue-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${stats.overview.completionRate}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-zinc-300 text-sm">Engagement moyen</span>
                    <span className="text-purple-400 font-bold">
                      {formatTime(stats.progress.avgStudyTime)}
                    </span>
                  </div>
                  <div className="w-full bg-zinc-600 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-purple-400 to-purple-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min((stats.progress.avgStudyTime / 3600) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>

                <div className="pt-4 border-t border-zinc-600">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white mb-1">
                      {formatCurrency((stats.overview.paidUsers * 64.99))}
                    </div>
                    <div className="text-zinc-400 text-sm">Revenus estimés</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Progression détaillée */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-6">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Activity className="h-6 w-6 text-blue-400" />
                Progression Moyenne
              </h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-zinc-300">Pages complétées</span>
                  <span className="text-white font-semibold">
                    {stats.progress.avgCompletedPages}/{stats.progress.totalPossiblePages}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-zinc-300">Quiz complétés</span>
                  <span className="text-white font-semibold">
                    {stats.progress.avgCompletedQuizzes}/{stats.progress.totalPossibleQuizzes}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-zinc-300">Temps d'étude moyen</span>
                  <span className="text-white font-semibold">
                    {formatTime(stats.progress.avgStudyTime)}
                  </span>
                </div>
                
                <div className="flex justify-between items-center pt-4 border-t border-zinc-600">
                  <span className="text-zinc-300">Taux de completion</span>
                  <span className="text-green-400 font-bold text-lg">
                    {stats.overview.completionRate}%
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-6">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <DollarSign className="h-6 w-6 text-yellow-400" />
                Analyse Financière
              </h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-zinc-300">Revenus totaux</span>
                  <span className="text-yellow-400 font-bold text-lg">
                    {formatCurrency(stats.overview.paidUsers * 64.99)}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-zinc-300">Revenus par utilisateur</span>
                  <span className="text-white font-semibold">
                    {formatCurrency(64.99)}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-zinc-300">Taux de paiement</span>
                  <span className="text-green-400 font-semibold">
                    {stats.overview.activeUsers > 0 ? Math.round((stats.overview.paidUsers / stats.overview.activeUsers) * 100) : 0}%
                  </span>
                </div>

                <div className="pt-4 border-t border-zinc-600">
                  <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-lg p-4">
                    <div className="text-center">
                      <div className="text-lg font-bold text-yellow-400 mb-1">
                        {stats.overview.paidUsers}
                      </div>
                      <div className="text-zinc-300 text-sm">Clients payants actifs</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Top utilisateurs */}
          <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
              <h3 className="text-xl font-bold flex items-center gap-2 mb-4 sm:mb-0">
                <TrendingUp className="h-6 w-6 text-yellow-400" />
                Top 10 - Utilisateurs les plus actifs
              </h3>
              
              <Link
                href="/admin/users"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2 self-start sm:self-auto"
              >
                <Users size={16} />
                Voir tous les utilisateurs
              </Link>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-zinc-600">
                    <th className="text-left py-3 px-4 text-zinc-300 font-medium">Utilisateur</th>
                    <th className="text-left py-3 px-4 text-zinc-300 font-medium">Statut</th>
                    <th className="text-left py-3 px-4 text-zinc-300 font-medium">Temps d'étude</th>
                    <th className="text-left py-3 px-4 text-zinc-300 font-medium">Pages</th>
                    <th className="text-left py-3 px-4 text-zinc-300 font-medium">Quiz</th>
                    <th className="text-left py-3 px-4 text-zinc-300 font-medium">Progression</th>
                    <th className="text-left py-3 px-4 text-zinc-300 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {(stats.topUsers && Array.isArray(stats.topUsers) ? stats.topUsers : []).map((user, index) => (
                    <tr key={user.email} className="border-b border-zinc-700 hover:bg-zinc-700/50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="bg-gradient-to-r from-purple-500 to-pink-500 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm">
                            {index + 1}
                          </div>
                          <div>
                            <div className="font-semibold text-white">
                              {user.username || 'Sans pseudo'}
                            </div>
                            <div className="text-sm text-zinc-400">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          <span className="text-green-400 text-sm">Payant</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-white font-mono text-sm">
                        {formatTime(user.studyTimeSeconds)}
                      </td>
                      <td className="py-3 px-4 text-white font-semibold">
                        {user.completedPages}/29
                      </td>
                      <td className="py-3 px-4 text-white font-semibold">
                        {user.completedQuizzes}/11
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-zinc-600 rounded-full h-2 min-w-[60px]">
                            <div 
                              className="bg-gradient-to-r from-green-400 to-blue-400 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${user.progressPercentage}%` }}
                            ></div>
                          </div>
                          <span className="text-white font-semibold text-sm min-w-[40px]">
                            {user.progressPercentage}%
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Link
                          href={`/admin/users/${user.email}`}
                          className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors inline-flex items-center gap-1"
                          title="Voir les détails"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Actions rapides */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              href="/admin/users"
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white p-6 rounded-xl transition-all duration-300 transform hover:scale-105 group"
            >
              <div className="flex items-center gap-4 mb-4">
                <Users className="h-8 w-8" />
                <div>
                  <h4 className="font-bold">Gestion Utilisateurs</h4>
                  <p className="text-blue-200 text-sm">CRUD complet</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Gérer les comptes</span>
                <div className="bg-white/20 p-1 rounded-full group-hover:translate-x-1 transition-transform">
                  <ChevronRight size={16} />
                </div>
              </div>
            </Link>

            <Link
              href="/admin/videos"
              className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white p-6 rounded-xl transition-all duration-300 transform hover:scale-105 group"
            >
              <div className="flex items-center gap-4 mb-4">
                <Settings className="h-8 w-8" />
                <div>
                  <h4 className="font-bold">Gestion Vidéos</h4>
                  <p className="text-purple-200 text-sm">Cloudflare Stream</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Gérer le contenu</span>
                <div className="bg-white/20 p-1 rounded-full group-hover:translate-x-1 transition-transform">
                  <ChevronRight size={16} />
                </div>
              </div>
            </Link>

            <button className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white p-6 rounded-xl transition-all duration-300 transform hover:scale-105 group">
              <div className="flex items-center gap-4 mb-4">
                <Database className="h-8 w-8" />
                <div>
                  <h4 className="font-bold">Base de Données</h4>
                  <p className="text-green-200 text-sm">Maintenance</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Optimiser</span>
                <div className="bg-white/20 p-1 rounded-full group-hover:translate-x-1 transition-transform">
                  <ChevronRight size={16} />
                </div>
              </div>
            </button>

            <button className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white p-6 rounded-xl transition-all duration-300 transform hover:scale-105 group">
              <div className="flex items-center gap-4 mb-4">
                <Shield className="h-8 w-8" />
                <div>
                  <h4 className="font-bold">Sécurité</h4>
                  <p className="text-red-200 text-sm">Logs & Alertes</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Surveiller</span>
                <div className="bg-white/20 p-1 rounded-full group-hover:translate-x-1 transition-transform">
                  <ChevronRight size={16} />
                </div>
              </div>
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}

// Composant pour les cartes de statistiques
function StatCard({ 
  title, 
  value, 
  icon, 
  color, 
  subtitle,
  trend,
  highlight = false
}: { 
  title: string; 
  value: number; 
  icon: React.ReactNode; 
  color: string; 
  subtitle: string;
  trend?: string;
  highlight?: boolean;
}) {
  return (
    <div className={`bg-zinc-800 border ${highlight ? 'border-yellow-500/50' : 'border-zinc-700'} rounded-xl p-4 lg:p-6 relative overflow-hidden group hover:border-zinc-600 transition-all duration-300`}>
      {highlight && (
        <div className="absolute top-0 right-0 bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded-bl-lg">
          💰 VIP
        </div>
      )}
      
      <div className="flex items-center justify-between mb-4">
        <div className={`bg-gradient-to-r ${color} p-3 rounded-lg shadow-lg`}>
          {icon}
        </div>
        <div className="text-right">
          <div className="text-xl lg:text-2xl font-bold text-white">{value.toLocaleString()}</div>
          {trend && (
            <div className="text-xs text-green-400 font-medium">{trend}</div>
          )}
        </div>
      </div>
      
      <h3 className="text-base lg:text-lg font-semibold text-white mb-1">{title}</h3>
      <p className="text-xs lg:text-sm text-zinc-400">{subtitle}</p>
    </div>
  );
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount);
}