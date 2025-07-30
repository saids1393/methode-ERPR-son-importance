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
  Activity
} from 'lucide-react';

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
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-900 text-white p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-400 mx-auto mb-6"></div>
          <p className="text-lg">Chargement du tableau de bord administrateur...</p>
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="min-h-screen bg-zinc-900 text-white p-8">
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
    );
  }

  return (
    <div className="min-h-screen bg-zinc-900 text-white">
      {/* Header */}
      <div className="bg-zinc-800 border-b border-zinc-700 p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <div className="bg-red-600 p-2 rounded-lg">
                <BarChart3 className="h-8 w-8" />
              </div>
              Monitoring Administrateur
            </h1>
            <p className="text-zinc-400 mt-2">Tableau de bord de surveillance de la plateforme</p>
          </div>
          
          <div className="flex gap-4">
            <Link
              href="/admin/users"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Users size={20} />
              Gestion Utilisateurs
            </Link>
            <Link
              href="/admin/videos"
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Settings size={20} />
              Gestion Vidéos
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Statistiques principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Utilisateurs Total"
            value={stats.overview.totalUsers}
            icon={<Users className="h-6 w-6" />}
            color="bg-blue-600"
            subtitle="Tous comptes confondus"
          />
          
          <StatCard
            title="Utilisateurs Actifs"
            value={stats.overview.activeUsers}
            icon={<UserCheck className="h-6 w-6" />}
            color="bg-green-600"
            subtitle="Comptes activés"
          />
          
          <StatCard
            title="Utilisateurs Payants"
            value={stats.overview.paidUsers}
            icon={<DollarSign className="h-6 w-6" />}
            color="bg-yellow-600"
            subtitle="Avec paiement Stripe"
          />
          
          <StatCard
            title="Nouveaux (7j)"
            value={stats.overview.recentUsers}
            icon={<Calendar className="h-6 w-6" />}
            color="bg-purple-600"
            subtitle="Dernière semaine"
          />
        </div>

        {/* Statistiques de progression */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-6">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Target className="h-6 w-6 text-green-400" />
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
              <Activity className="h-6 w-6 text-blue-400" />
              Activité Globale
            </h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-zinc-300">Temps total d'étude</span>
                <span className="text-white font-semibold">
                  {Math.floor(stats.progress.totalStudyTime / 3600)}h {Math.floor((stats.progress.totalStudyTime % 3600) / 60)}min
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-zinc-300">Utilisateurs avec cours terminé</span>
                <span className="text-white font-semibold">
                  {stats.overview.usersWithFullCompletion}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-zinc-300">Taux d'engagement</span>
                <span className="text-blue-400 font-semibold">
                  {stats.overview.activeUsers > 0 ? Math.round((stats.overview.paidUsers / stats.overview.activeUsers) * 100) : 0}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Top utilisateurs */}
        <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-6">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-yellow-400" />
            Top 10 - Utilisateurs les plus actifs
          </h3>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-600">
                  <th className="text-left py-3 px-4 text-zinc-300">Utilisateur</th>
                  <th className="text-left py-3 px-4 text-zinc-300">Temps d'étude</th>
                  <th className="text-left py-3 px-4 text-zinc-300">Pages</th>
                  <th className="text-left py-3 px-4 text-zinc-300">Quiz</th>
                  <th className="text-left py-3 px-4 text-zinc-300">Progression</th>
                </tr>
              </thead>
              <tbody>
                {stats.topUsers.map((user, index) => (
                  <tr key={user.email} className="border-b border-zinc-700 hover:bg-zinc-700/50">
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-semibold text-white">
                          {user.username || 'Sans pseudo'}
                        </div>
                        <div className="text-sm text-zinc-400">{user.email}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-white font-mono">
                      {formatTime(user.studyTimeSeconds)}
                    </td>
                    <td className="py-3 px-4 text-white">
                      {user.completedPages}/29
                    </td>
                    <td className="py-3 px-4 text-white">
                      {user.completedQuizzes}/11
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-zinc-600 rounded-full h-2">
                          <div 
                            className="bg-green-400 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${user.progressPercentage}%` }}
                          ></div>
                        </div>
                        <span className="text-white font-semibold text-sm">
                          {user.progressPercentage}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
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
  subtitle 
}: { 
  title: string; 
  value: number; 
  icon: React.ReactNode; 
  color: string; 
  subtitle: string; 
}) {
  return (
    <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`${color} p-3 rounded-lg`}>
          {icon}
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-white">{value.toLocaleString()}</div>
          <div className="text-sm text-zinc-400">{subtitle}</div>
        </div>
      </div>
      <h3 className="text-lg font-semibold text-white">{title}</h3>
    </div>
  );
}