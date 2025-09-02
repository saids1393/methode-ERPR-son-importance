'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { use } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  User,
  Mail,
  Calendar,
  CheckCircle,
  XCircle,
  Download,
  Eye,
  BookOpen,
  Clock,
  TrendingUp,
  Search,
  Filter
} from 'lucide-react';

interface HomeworkSend {
  id: string;
  sentAt: string;
  emailSent: boolean;
  user: {
    id: string;
    email: string;
    username: string | null;
    gender: 'HOMME' | 'FEMME' | null;
    completedPagesCount: number;
    completedQuizzesCount: number;
    progressPercentage: number;
    studyTimeFormatted: string;
    isActive: boolean;
    isPaid: boolean;
    createdAt: string;
  };
}

interface HomeworkDetail {
  id: string;
  chapterId: number;
  title: string;
  content: string;
  createdAt: string;
  sends: HomeworkSend[];
  stats: {
    totalSends: number;
    successfulSends: number;
    failedSends: number;
    successRate: number;
  };
}

interface HomeworkUsersPageProps {
  params: Promise<{ homeworkId: string }>;
}

export default function HomeworkUsersPage({ params }: HomeworkUsersPageProps) {
  const resolvedParams = use(params);
  const [homework, setHomework] = useState<HomeworkDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'progress'>('date');
  const router = useRouter();

  useEffect(() => {
    fetchHomeworkDetails();
  }, [resolvedParams.homeworkId]);

  const fetchHomeworkDetails = async () => {
    try {
      const response = await fetch(`/api/admin/homework/${resolvedParams.homeworkId}/users`);
      if (response.status === 403) {
        router.push('/dashboard');
        return;
      }
      if (response.ok) {
        const data = await response.json();
        setHomework(data);
      }
    } catch (error) {
      console.error('Error fetching homework details:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredSends = homework?.sends.filter(send => {
    const matchesSearch = !searchTerm || 
      send.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (send.user.username && send.user.username.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = !statusFilter ||
      (statusFilter === 'success' && send.emailSent) ||
      (statusFilter === 'failed' && !send.emailSent);
    
    return matchesSearch && matchesStatus;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime();
      case 'name':
        const nameA = a.user.username || a.user.email;
        const nameB = b.user.username || b.user.email;
        return nameA.localeCompare(nameB);
      case 'progress':
        return b.user.progressPercentage - a.user.progressPercentage;
      default:
        return 0;
    }
  }) || [];

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-900 text-white p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-orange-400 mx-auto mb-6"></div>
          <p className="text-lg">Chargement des détails...</p>
        </div>
      </div>
    );
  }

  if (!homework) {
    return (
      <div className="min-h-screen bg-zinc-900 text-white p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Devoir non trouvé</h1>
          <Link
            href="/admin/homework"
            className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Retour aux devoirs
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
          <div className="flex items-center gap-4 mb-6">
            <Link
              href="/admin/homework"
              className="bg-zinc-700 hover:bg-zinc-600 text-white p-2 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            
            <div className="flex-1">
              <h1 className="text-2xl lg:text-3xl font-bold flex items-center gap-3">
                <div className="bg-blue-600 p-2 rounded-lg">
                  <BookOpen className="h-6 w-6 lg:h-8 lg:w-8" />
                </div>
                Utilisateurs ayant reçu ce devoir
              </h1>
              <p className="text-zinc-400 mt-2">
                Chapitre {homework.chapterId} - {homework.title}
              </p>
            </div>
          </div>

          {/* Statistiques */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-zinc-700 border border-zinc-600 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-white">{homework.stats.totalSends}</div>
              <div className="text-zinc-400 text-sm">Total envois</div>
            </div>
            <div className="bg-zinc-700 border border-zinc-600 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-green-400">{homework.stats.successfulSends}</div>
              <div className="text-zinc-400 text-sm">Réussis</div>
            </div>
            <div className="bg-zinc-700 border border-zinc-600 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-red-400">{homework.stats.failedSends}</div>
              <div className="text-zinc-400 text-sm">Échecs</div>
            </div>
            <div className="bg-zinc-700 border border-zinc-600 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-blue-400">{homework.stats.successRate}%</div>
              <div className="text-zinc-400 text-sm">Taux de réussite</div>
            </div>
          </div>

          {/* Filtres */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 h-5 w-5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Rechercher par email ou pseudo..."
                className="w-full bg-zinc-700 border border-zinc-600 rounded-lg pl-10 pr-4 py-3 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-zinc-700 border border-zinc-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Tous les statuts</option>
              <option value="success">Envois réussis</option>
              <option value="failed">Envois échoués</option>
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'name' | 'progress')}
              className="bg-zinc-700 border border-zinc-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="date">Trier par date</option>
              <option value="name">Trier par nom</option>
              <option value="progress">Trier par progression</option>
            </select>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        {/* Liste des utilisateurs */}
        {filteredSends.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSends.map((send) => (
              <div key={send.id} className="bg-zinc-800 border border-zinc-700 rounded-xl p-6">
                {/* En-tête utilisateur */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-blue-600 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold">
                    {send.user.gender === 'HOMME' ? '👨' : send.user.gender === 'FEMME' ? '👩' : '👤'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white truncate">
                      {send.user.username || 'Sans pseudo'}
                    </h3>
                    <p className="text-zinc-400 text-sm truncate">{send.user.email}</p>
                  </div>
                </div>

                {/* Statut d'envoi */}
                <div className={`flex items-center gap-2 mb-4 p-3 rounded-lg ${
                  send.emailSent 
                    ? 'bg-green-900/30 border border-green-500/30' 
                    : 'bg-red-900/30 border border-red-500/30'
                }`}>
                  {send.emailSent ? (
                    <>
                      <CheckCircle className="h-5 w-5 text-green-400" />
                      <span className="text-green-400 font-medium">Envoi réussi</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-5 w-5 text-red-400" />
                      <span className="text-red-400 font-medium">Envoi échoué</span>
                    </>
                  )}
                  <div className="ml-auto text-xs text-zinc-400">
                    {new Date(send.sentAt).toLocaleDateString('fr-FR', {
                      day: '2-digit',
                      month: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>

                {/* Progression utilisateur */}
                <div className="space-y-3 mb-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-zinc-300">Progression</span>
                      <span className="text-blue-400 font-medium">{send.user.progressPercentage}%</span>
                    </div>
                    <div className="w-full bg-zinc-600 rounded-full h-2">
                      <div 
                        className="bg-blue-400 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${send.user.progressPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-zinc-400">Pages</div>
                      <div className="text-white font-semibold">
                        {send.user.completedPagesCount}/29
                      </div>
                    </div>
                    <div>
                      <div className="text-zinc-400">Quiz</div>
                      <div className="text-white font-semibold">
                        {send.user.completedQuizzesCount}/11
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-sm">
                    <div className="text-zinc-400">Temps d'étude</div>
                    <div className="text-white font-semibold">{send.user.studyTimeFormatted}</div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Link
                    href={`/admin/users/${send.user.id}`}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                  >
                    <Eye className="h-4 w-4" />
                    Voir le profil
                  </Link>
                </div>

                {/* Badges */}
                <div className="flex gap-2 mt-3">
                  {send.user.isPaid && (
                    <span className="bg-green-900/30 text-green-400 px-2 py-1 rounded-full text-xs font-medium">
                      💰 Payant
                    </span>
                  )}
                  {!send.user.isActive && (
                    <span className="bg-red-900/30 text-red-400 px-2 py-1 rounded-full text-xs font-medium">
                      ⚠️ Inactif
                    </span>
                  )}
                  <span className="bg-blue-900/30 text-blue-400 px-2 py-1 rounded-full text-xs font-medium">
                    {send.user.gender || 'Genre non spécifié'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-12 text-center">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-xl font-semibold text-white mb-2">
              {searchTerm || statusFilter ? 'Aucun résultat' : 'Aucun envoi'}
            </h3>
            <p className="text-zinc-400 mb-6">
              {searchTerm || statusFilter 
                ? 'Aucun envoi ne correspond à vos critères de recherche.'
                : 'Ce devoir n\'a encore été envoyé à aucun utilisateur.'
              }
            </p>
            {(searchTerm || statusFilter) && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('');
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
              >
                Effacer les filtres
              </button>
            )}
          </div>
        )}

        {/* Résumé en bas */}
        {homework && filteredSends.length > 0 && (
          <div className="mt-8 bg-zinc-800 border border-zinc-700 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Résumé des envois</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-xl font-bold text-white">{filteredSends.length}</div>
                <div className="text-zinc-400 text-sm">Envois affichés</div>
              </div>
              <div>
                <div className="text-xl font-bold text-green-400">
                  {filteredSends.filter(s => s.emailSent).length}
                </div>
                <div className="text-zinc-400 text-sm">Réussis</div>
              </div>
              <div>
                <div className="text-xl font-bold text-red-400">
                  {filteredSends.filter(s => !s.emailSent).length}
                </div>
                <div className="text-zinc-400 text-sm">Échecs</div>
              </div>
              <div>
                <div className="text-xl font-bold text-blue-400">
                  {Math.round(filteredSends.reduce((sum, s) => sum + s.user.progressPercentage, 0) / (filteredSends.length || 1))}%
                </div>
                <div className="text-zinc-400 text-sm">Progression moyenne</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}