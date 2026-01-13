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
  Trash2,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Clock,
  Award,
  CheckCircle,
  XCircle,
  BarChart3,
  DollarSign,
  UserPlus,
  Download,
  MoreVertical
} from 'lucide-react';

interface User {
  id: string;
  email: string;
  username: string | null;
  gender: 'HOMME' | 'FEMME' | null;
  isActive: boolean;
  stripeCustomerId: string | null;
  subscriptionPlan: 'SOLO' | 'COACHING' | null;
  completedPagesCount: number;
  completedQuizzesCount: number;
  completedPagesTajwidCount: number;
  completedQuizzesTajwidCount: number;
  progressPercentage: number;
  progressPercentageLecture: number;
  progressPercentageTajwid: number;
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
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [showBulkActions, setShowBulkActions] = useState(false);
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

  const handleSelectUser = (userId: string) => {
    const newSelected = new Set(selectedUsers);
    if (newSelected.has(userId)) {
      newSelected.delete(userId);
    } else {
      newSelected.add(userId);
    }
    setSelectedUsers(newSelected);
    setShowBulkActions(newSelected.size > 0);
  };

  const handleSelectAll = () => {
    if (selectedUsers.size === data?.users.length) {
      setSelectedUsers(new Set());
      setShowBulkActions(false);
    } else {
      const allIds = new Set(data?.users.map(user => user.id) || []);
      setSelectedUsers(allIds);
      setShowBulkActions(true);
    }
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer ${selectedUsers.size} utilisateur(s) ?`)) {
      return;
    }

    try {
      const response = await fetch('/api/admin/users/bulk-delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userIds: Array.from(selectedUsers) })
      });

      if (response.ok) {
        const result = await response.json();
        alert(`${result.deletedCount} utilisateur(s) supprimé(s) avec succès`);
        setSelectedUsers(new Set());
        setShowBulkActions(false);
        fetchUsers();
      } else {
        alert('Erreur lors de la suppression');
      }
    } catch (error) {
      alert('Erreur de connexion');
      console.error('Bulk delete error:', error);
    }
  };

  const handleExport = async () => {
    try {
      const params = new URLSearchParams({ search, format: 'csv' });
      const response = await fetch(`/api/admin/users/export?${params}`);
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `utilisateurs-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        alert('Erreur lors de l\'export');
      }
    } catch (error) {
      alert('Erreur de connexion');
      console.error('Export error:', error);
    }
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
      <div className="bg-zinc-800 border-b border-zinc-700 p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4 sm:mb-6">
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold flex items-center gap-2 sm:gap-3">
                <div className="bg-blue-600 p-1.5 sm:p-2 rounded-lg">
                  <Users className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8" />
                </div>
                <span className="hidden sm:inline">Gestion des Utilisateurs</span>
                <span className="sm:hidden">Utilisateurs</span>
              </h1>
              <p className="text-zinc-400 mt-1 sm:mt-2 text-sm sm:text-base">
                {data?.pagination.totalCount} utilisateurs au total
              </p>
            </div>
            
            <div className="flex flex-wrap gap-2 sm:gap-3">
              <button
                onClick={handleExport}
                className="bg-green-600 hover:bg-green-700 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg flex items-center gap-1 sm:gap-2 transition-colors text-sm sm:text-base"
              >
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">Exporter CSV</span>
                <span className="sm:hidden">Export</span>
              </button>
              
              <Link
                href="/admin/users/create"
                className="bg-purple-600 hover:bg-purple-700 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg flex items-center gap-1 sm:gap-2 transition-colors text-sm sm:text-base"
              >
                <UserPlus className="h-4 w-4" />
                <span className="hidden sm:inline">Ajouter</span>
                <span className="sm:hidden">+</span>
              </Link>
              
              <Link
                href="/admin"
                className="bg-zinc-700 hover:bg-zinc-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg flex items-center gap-1 sm:gap-2 transition-colors text-sm sm:text-base"
              >
                <BarChart3 className="h-4 w-4" />
                <span className="hidden lg:inline">Retour au monitoring</span>
                <span className="lg:hidden">Monitoring</span>
              </Link>
            </div>
          </div>

          {/* Barre de recherche et actions en masse */}
          <div className="flex flex-col sm:flex-row gap-4">
            <form onSubmit={handleSearch} className="flex gap-4 flex-1">
              <div className="flex-1 relative">
                <Search className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 h-4 w-4 sm:h-5 sm:w-5" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Rechercher par email ou pseudo..."
                  className="w-full bg-zinc-700 border border-zinc-600 rounded-lg pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-3 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                />
              </div>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg transition-colors text-sm sm:text-base"
              >
                <span className="hidden sm:inline">Rechercher</span>
                <span className="sm:hidden">🔍</span>
              </button>
            </form>

            {/* Actions en masse */}
            {showBulkActions && (
              <div className="flex gap-2 items-center">
                <span className="bg-purple-600 text-white px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm">
                  {selectedUsers.size} sélectionné(s)
                </span>
                <button
                  onClick={handleBulkDelete}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg flex items-center gap-1 sm:gap-2 transition-colors text-sm"
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="hidden sm:inline">Supprimer</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        {/* Tableau des utilisateurs */}
        <div className="bg-zinc-800 border border-zinc-700 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-zinc-700">
                <tr>
                  <th className="text-left py-3 sm:py-4 px-3 sm:px-6">
                    <input
                      type="checkbox"
                      checked={selectedUsers.size === data?.users.length && data?.users.length > 0}
                      onChange={handleSelectAll}
                      className="w-4 h-4 text-purple-600 bg-zinc-600 border-zinc-500 rounded focus:ring-purple-500"
                    />
                  </th>
                  <th className="text-left py-3 sm:py-4 px-3 sm:px-6">
                    <button
                      onClick={() => handleSort('email')}
                      className="flex items-center gap-1 sm:gap-2 text-zinc-300 hover:text-white transition-colors text-xs sm:text-sm"
                    >
                      Utilisateur
                      <ArrowUpDown className="h-3 w-3 sm:h-4 sm:w-4" />
                    </button>
                  </th>
                  <th className="text-left py-3 sm:py-4 px-3 sm:px-6 hidden sm:table-cell">
                    <button
                      onClick={() => handleSort('isActive')}
                      className="flex items-center gap-1 sm:gap-2 text-zinc-300 hover:text-white transition-colors text-xs sm:text-sm"
                    >
                      Statut
                      <ArrowUpDown className="h-3 w-3 sm:h-4 sm:w-4" />
                    </button>
                  </th>
                  <th className="text-left py-3 sm:py-4 px-3 sm:px-6 hidden md:table-cell">
                    <button
                      onClick={() => handleSort('subscriptionPlan')}
                      className="flex items-center gap-1 sm:gap-2 text-zinc-300 hover:text-white transition-colors text-xs sm:text-sm"
                    >
                      Abonnement
                      <ArrowUpDown className="h-3 w-3 sm:h-4 sm:w-4" />
                    </button>
                  </th>
                  <th className="text-left py-3 sm:py-4 px-3 sm:px-6 hidden md:table-cell">
                    <button
                      onClick={() => handleSort('studyTimeSeconds')}
                      className="flex items-center gap-1 sm:gap-2 text-zinc-300 hover:text-white transition-colors text-xs sm:text-sm"
                    >
                      Temps d'étude
                      <ArrowUpDown className="h-3 w-3 sm:h-4 sm:w-4" />
                    </button>
                  </th>
                  <th className="text-left py-3 sm:py-4 px-3 sm:px-6 text-zinc-300 text-xs sm:text-sm">Progression</th>
                  <th className="text-left py-3 sm:py-4 px-3 sm:px-6 hidden lg:table-cell">
                    <button
                      onClick={() => handleSort('createdAt')}
                      className="flex items-center gap-1 sm:gap-2 text-zinc-300 hover:text-white transition-colors text-xs sm:text-sm"
                    >
                      Inscription
                      <ArrowUpDown className="h-3 w-3 sm:h-4 sm:w-4" />
                    </button>
                  </th>
                  <th className="text-left py-3 sm:py-4 px-3 sm:px-6 text-zinc-300 text-xs sm:text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data?.users.map((user) => (
                  <tr key={user.id} className="border-b border-zinc-700 hover:bg-zinc-700/50">
                    <td className="py-3 sm:py-4 px-3 sm:px-6">
                      <input
                        type="checkbox"
                        checked={selectedUsers.has(user.id)}
                        onChange={() => handleSelectUser(user.id)}
                        className="w-4 h-4 text-purple-600 bg-zinc-600 border-zinc-500 rounded focus:ring-purple-500"
                      />
                    </td>
                    <td className="py-3 sm:py-4 px-3 sm:px-6">
                      <div>
                        <div className="font-semibold text-white text-sm sm:text-base">
                          {user.username || 'Sans pseudo'}
                        </div>
                        <div className="text-xs sm:text-sm text-zinc-400 truncate max-w-[150px] sm:max-w-none">{user.email}</div>
                        <div className="flex gap-2 mt-1">
                          {user.gender && (
                            <div className="inline-flex items-center gap-1 bg-blue-900/30 text-blue-400 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs">
                              {user.gender === 'HOMME' ? '👨' : '👩'} {user.gender}
                            </div>
                          )}
                          {user.isPaid && (
                            <div className="inline-flex items-center gap-1 bg-green-900/30 text-green-400 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs">
                              <DollarSign className="h-3 w-3" />
                              Payant
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 sm:py-4 px-3 sm:px-6 hidden sm:table-cell">
                      <div className="flex items-center gap-2">
                        {user.isActive ? (
                          <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-400" />
                        ) : (
                          <XCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-400" />
                        )}
                        <span className={`${user.isActive ? 'text-green-400' : 'text-red-400'} text-sm sm:text-base`}>
                          {user.isActive ? 'Actif' : 'Inactif'}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 sm:py-4 px-3 sm:px-6 hidden md:table-cell">
                      {user.subscriptionPlan ? (
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          user.subscriptionPlan === 'COACHING' 
                            ? 'bg-purple-900/50 text-purple-300 border border-purple-700' 
                            : 'bg-blue-900/50 text-blue-300 border border-blue-700'
                        }`}>
                          {user.subscriptionPlan === 'COACHING' ? '🎓 Coaching' : '📖 Solo'}
                        </span>
                      ) : (
                        <span className="text-zinc-500 text-xs">—</span>
                      )}
                    </td>
                    <td className="py-3 sm:py-4 px-3 sm:px-6 hidden md:table-cell">
                      <div className="flex items-center gap-2">
                        <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-blue-400" />
                        <span className="text-white font-mono text-sm">{user.studyTimeFormatted}</span>
                      </div>
                    </td>
                    <td className="py-3 sm:py-4 px-3 sm:px-6">
                      <div className="space-y-2">
                        {/* Progression Lecture */}
                        <div className="flex items-center gap-2">
                          <span className="text-blue-400 text-xs w-12">Lecture</span>
                          <div className="flex-1 bg-zinc-600 rounded-full h-2 min-w-[40px] sm:min-w-[60px]">
                            <div 
                              className="bg-blue-400 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${user.progressPercentageLecture}%` }}
                            ></div>
                          </div>
                          <span className="text-white font-semibold text-xs w-8">
                            {user.progressPercentageLecture}%
                          </span>
                        </div>
                        {/* Progression Tajwid */}
                        <div className="flex items-center gap-2">
                          <span className="text-purple-400 text-xs w-12">Tajwid</span>
                          <div className="flex-1 bg-zinc-600 rounded-full h-2 min-w-[40px] sm:min-w-[60px]">
                            <div 
                              className="bg-purple-400 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${user.progressPercentageTajwid}%` }}
                            ></div>
                          </div>
                          <span className="text-white font-semibold text-xs w-8">
                            {user.progressPercentageTajwid}%
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 sm:py-4 px-3 sm:px-6 text-zinc-300 text-sm hidden lg:table-cell">
                      {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="py-3 sm:py-4 px-3 sm:px-6">
                      <div className="flex gap-1 sm:gap-2">
                        <Link
                          href={`/admin/users/${user.id}`}
                          className="bg-blue-600 hover:bg-blue-700 text-white p-1.5 sm:p-2 rounded-lg transition-colors"
                          title="Voir les détails"
                        >
                          <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                        </Link>
                        <button
                          onClick={() => {
                            if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
                              // Logique de suppression individuelle
                              handleBulkDelete();
                            }
                          }}
                          className="bg-red-600 hover:bg-red-700 text-white p-1.5 sm:p-2 rounded-lg transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {data && data.pagination.totalPages > 1 && (
            <div className="bg-zinc-700 px-4 sm:px-6 py-3 sm:py-4 flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-0">
              <div className="text-zinc-300 text-sm sm:text-base">
                Page {data.pagination.page} sur {data.pagination.totalPages} 
                ({data.pagination.totalCount} utilisateurs)
              </div>
              
              <div className="flex gap-1 sm:gap-2">
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={!data.pagination.hasPrev}
                  className="bg-zinc-600 hover:bg-zinc-500 disabled:bg-zinc-800 disabled:text-zinc-500 text-white p-1.5 sm:p-2 rounded-lg transition-colors"
                >
                  <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
                
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={!data.pagination.hasNext}
                  className="bg-zinc-600 hover:bg-zinc-500 disabled:bg-zinc-800 disabled:text-zinc-500 text-white p-1.5 sm:p-2 rounded-lg transition-colors"
                >
                  <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* État vide */}
        {data?.users.length === 0 && (
          <div className="text-center py-8 sm:py-12 px-4">
            <div className="text-4xl sm:text-6xl mb-4">👥</div>
            <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">
              Aucun utilisateur trouvé
            </h3>
            <p className="text-zinc-400 mb-4 sm:mb-6 text-sm sm:text-base">
              {search ? 'Aucun résultat pour votre recherche.' : 'Commencez par ajouter des utilisateurs.'}
            </p>
            {!search && (
              <Link
                href="/admin/users/create"
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg transition-colors text-sm sm:text-base"
              >
                Ajouter le premier utilisateur
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}


