'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Users,
  Search,
  Filter,
  Eye,
  Edit,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Clock,
  Award,
  CheckCircle,
  XCircle,
  BarChart3,
  DollarSign
} from 'lucide-react';

interface User {
  id: string;
  email: string;
  username: string | null;
  isActive: boolean;
  stripeCustomerId: string | null;
  completedPagesCount: number;
  completedQuizzesCount: number;
  progressPercentage: number;
  isPaid: boolean;
  studyTimeFormatted: string;
  studyTimeSeconds: number;
  createdAt: string;
  updatedAt: string;
}

interface UsersResponse {
  users: User[];
  pagination: {
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export default function AdminUsersPage() {
  const [data, setData] = useState<UsersResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const router = useRouter();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '20',
        search,
        sortBy,
        sortOrder
      });

      const response = await fetch(`/api/admin/users?${params}`);
      if (response.status === 403) {
        router.push('/dashboard');
        return;
      }
      if (response.ok) {
        const result = await response.json();
        setData(result);
      } else {
        setError('Erreur lors du chargement des utilisateurs');
      }
    } catch (err) {
      setError('Erreur de connexion');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [currentPage, search, sortBy, sortOrder]);

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchUsers();
  };

  if (loading && !data) {
    return (
      <div className="min-h-screen bg-zinc-900 text-white p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-400 mx-auto mb-6"></div>
          <p className="text-lg">Chargement des utilisateurs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-zinc-900 text-white p-8">
        <div className="text-center">
          <div className="text-red-400 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold mb-4">Erreur d'accès</h1>
          <p className="text-zinc-400 mb-6">{error}</p>
          <Link
            href="/admin"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Retour au monitoring
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-900 text-white">
      {/* Header */}
      <div className="bg-zinc-800 border-b border-zinc-700 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <div className="bg-blue-600 p-2 rounded-lg">
                  <Users className="h-8 w-8" />
                </div>
                Gestion des Utilisateurs
              </h1>
              <p className="text-zinc-400 mt-2">
                {data?.pagination.totalCount} utilisateurs au total
              </p>
            </div>
            
            <Link
              href="/admin"
              className="bg-zinc-700 hover:bg-zinc-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <BarChart3 size={20} />
              Retour au monitoring
            </Link>
          </div>

          {/* Barre de recherche */}
          <form onSubmit={handleSearch} className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 h-5 w-5" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher par email ou pseudo..."
                className="w-full bg-zinc-700 border border-zinc-600 rounded-lg pl-10 pr-4 py-3 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              Rechercher
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Tableau des utilisateurs */}
        <div className="bg-zinc-800 border border-zinc-700 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-zinc-700">
                <tr>
                  <th className="text-left py-4 px-6">
                    <button
                      onClick={() => handleSort('email')}
                      className="flex items-center gap-2 text-zinc-300 hover:text-white transition-colors"
                    >
                      Utilisateur
                      <ArrowUpDown className="h-4 w-4" />
                    </button>
                  </th>
                  <th className="text-left py-4 px-6">
                    <button
                      onClick={() => handleSort('isActive')}
                      className="flex items-center gap-2 text-zinc-300 hover:text-white transition-colors"
                    >
                      Statut
                      <ArrowUpDown className="h-4 w-4" />
                    </button>
                  </th>
                  <th className="text-left py-4 px-6">
                    <button
                      onClick={() => handleSort('studyTimeSeconds')}
                      className="flex items-center gap-2 text-zinc-300 hover:text-white transition-colors"
                    >
                      Temps d'étude
                      <ArrowUpDown className="h-4 w-4" />
                    </button>
                  </th>
                  <th className="text-left py-4 px-6 text-zinc-300">Progression</th>
                  <th className="text-left py-4 px-6">
                    <button
                      onClick={() => handleSort('createdAt')}
                      className="flex items-center gap-2 text-zinc-300 hover:text-white transition-colors"
                    >
                      Inscription
                      <ArrowUpDown className="h-4 w-4" />
                    </button>
                  </th>
                  <th className="text-left py-4 px-6 text-zinc-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data?.users.map((user) => (
                  <tr key={user.id} className="border-b border-zinc-700 hover:bg-zinc-700/50">
                    <td className="py-4 px-6">
                      <div>
                        <div className="font-semibold text-white">
                          {user.username || 'Sans pseudo'}
                        </div>
                        <div className="text-sm text-zinc-400">{user.email}</div>
                        {user.isPaid && (
                          <div className="inline-flex items-center gap-1 bg-green-900/30 text-green-400 px-2 py-1 rounded-full text-xs mt-1">
                            <DollarSign className="h-3 w-3" />
                            Payant
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        {user.isActive ? (
                          <CheckCircle className="h-5 w-5 text-green-400" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-400" />
                        )}
                        <span className={user.isActive ? 'text-green-400' : 'text-red-400'}>
                          {user.isActive ? 'Actif' : 'Inactif'}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-blue-400" />
                        <span className="text-white font-mono">{user.studyTimeFormatted}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-zinc-600 rounded-full h-2">
                            <div 
                              className="bg-green-400 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${user.progressPercentage}%` }}
                            ></div>
                          </div>
                          <span className="text-white font-semibold text-sm w-12">
                            {user.progressPercentage}%
                          </span>
                        </div>
                        <div className="text-xs text-zinc-400">
                          {user.completedPagesCount}/29 pages • {user.completedQuizzesCount}/11 quiz
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-zinc-300">
                      {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="py-4 px-6">
                      <Link
                        href={`/admin/users/${user.id}`}
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

          {/* Pagination */}
          {data && data.pagination.totalPages > 1 && (
            <div className="bg-zinc-700 px-6 py-4 flex justify-between items-center">
              <div className="text-zinc-300">
                Page {data.pagination.page} sur {data.pagination.totalPages} 
                ({data.pagination.totalCount} utilisateurs)
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={!data.pagination.hasPrev}
                  className="bg-zinc-600 hover:bg-zinc-500 disabled:bg-zinc-800 disabled:text-zinc-500 text-white p-2 rounded-lg transition-colors"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={!data.pagination.hasNext}
                  className="bg-zinc-600 hover:bg-zinc-500 disabled:bg-zinc-800 disabled:text-zinc-500 text-white p-2 rounded-lg transition-colors"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}