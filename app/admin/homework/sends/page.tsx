'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Mail,
  ArrowLeft,
  Calendar,
  User,
  BookOpen,
  CheckCircle,
  XCircle,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight
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
  };
  homework: {
    id: string;
    chapterId: number;
    title: string;
  };
}

interface SendsResponse {
  sends: HomeworkSend[];
  pagination: {
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export default function HomeworkSendsPage() {
  const [data, setData] = useState<SendsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedChapter, setSelectedChapter] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    fetchSends();
  }, [currentPage, selectedChapter]);

  const fetchSends = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '20'
      });

      if (selectedChapter) {
        params.append('chapterId', selectedChapter);
      }

      const response = await fetch(`/api/admin/homework/sends?${params}`);
      if (response.status === 403) {
        router.push('/dashboard');
        return;
      }
      if (response.ok) {
        const result = await response.json();
        setData(result);
      }
    } catch (error) {
      console.error('Error fetching homework sends:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchSends();
  };

  if (loading && !data) {
    return (
      <div className="min-h-screen bg-zinc-900 text-white p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-orange-400 mx-auto mb-6"></div>
          <p className="text-lg">Chargement des envois...</p>
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
            <div className="flex items-center gap-4">
              <Link
                href="/admin/homework"
                className="bg-zinc-700 hover:bg-zinc-600 text-white p-1.5 sm:p-2 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
              </Link>
              
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold flex items-center gap-2 sm:gap-3">
                  <div className="bg-blue-600 p-1.5 sm:p-2 rounded-lg">
                    <Mail className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8" />
                  </div>
                  <span className="hidden sm:inline">Envois de Devoirs</span>
                  <span className="sm:hidden">Envois</span>
                </h1>
                <p className="text-zinc-400 mt-1 sm:mt-2 text-sm sm:text-base">
                  {data?.pagination.totalCount || 0} envoi(s) au total
                </p>
              </div>
            </div>
          </div>

          {/* Filtres */}
          <div className="flex flex-col sm:flex-row gap-4">
            <form onSubmit={handleSearch} className="flex gap-4 flex-1">
              <div className="flex-1 relative">
                <Search className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 h-4 w-4 sm:h-5 sm:w-5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Rechercher par email..."
                  className="w-full bg-zinc-700 border border-zinc-600 rounded-lg pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-3 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                />
              </div>
              
              <select
                value={selectedChapter}
                onChange={(e) => setSelectedChapter(e.target.value)}
                className="bg-zinc-700 border border-zinc-600 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              >
                <option value="">Tous les chapitres</option>
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i} value={i}>Chapitre {i}</option>
                ))}
              </select>
            </form>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        {/* Tableau des envois */}
        {data && data.sends.length > 0 ? (
          <div className="bg-zinc-800 border border-zinc-700 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-zinc-700">
                  <tr>
                    <th className="text-left py-3 sm:py-4 px-3 sm:px-6 text-zinc-300 text-xs sm:text-sm">Utilisateur</th>
                    <th className="text-left py-3 sm:py-4 px-3 sm:px-6 text-zinc-300 text-xs sm:text-sm">Devoir</th>
                    <th className="text-left py-3 sm:py-4 px-3 sm:px-6 text-zinc-300 text-xs sm:text-sm hidden sm:table-cell">Statut</th>
                    <th className="text-left py-3 sm:py-4 px-3 sm:px-6 text-zinc-300 text-xs sm:text-sm">Date d'envoi</th>
                  </tr>
                </thead>
                <tbody>
                  {data.sends.map((send) => (
                    <tr key={send.id} className="border-b border-zinc-700 hover:bg-zinc-700/50">
                      <td className="py-3 sm:py-4 px-3 sm:px-6">
                        <div className="flex items-center gap-3">
                          <div className="bg-blue-600 w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold">
                            {send.user.gender === 'HOMME' ? '👨' : send.user.gender === 'FEMME' ? '👩' : '👤'}
                          </div>
                          <div>
                            <div className="font-semibold text-white text-sm sm:text-base">
                              {send.user.username || 'Sans pseudo'}
                            </div>
                            <div className="text-xs sm:text-sm text-zinc-400 truncate max-w-[150px] sm:max-w-none">
                              {send.user.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 sm:py-4 px-3 sm:px-6">
                        <div>
                          <div className="font-semibold text-white text-sm sm:text-base">
                            Chapitre {send.homework.chapterId}
                          </div>
                          <div className="text-xs sm:text-sm text-zinc-400 truncate max-w-[150px] sm:max-w-none">
                            {send.homework.title}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 sm:py-4 px-3 sm:px-6 hidden sm:table-cell">
                        <div className="flex items-center gap-2">
                          {send.emailSent ? (
                            <>
                              <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-400" />
                              <span className="text-green-400 text-sm sm:text-base">Envoyé</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-400" />
                              <span className="text-red-400 text-sm sm:text-base">Échec</span>
                            </>
                          )}
                        </div>
                      </td>
                      <td className="py-3 sm:py-4 px-3 sm:px-6 text-zinc-300 text-sm">
                        {new Date(send.sentAt).toLocaleDateString('fr-FR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {data.pagination.totalPages > 1 && (
              <div className="bg-zinc-700 px-4 sm:px-6 py-3 sm:py-4 flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-0">
                <div className="text-zinc-300 text-sm sm:text-base">
                  Page {data.pagination.page} sur {data.pagination.totalPages} 
                  ({data.pagination.totalCount} envois)
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
        ) : (
          <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-12 text-center">
            <div className="text-6xl mb-4">📧</div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Aucun envoi de devoir
            </h3>
            <p className="text-zinc-400 mb-6">
              Les envois apparaîtront ici quand les élèves termineront des chapitres.
            </p>
            <Link
              href="/admin/homework"
              className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              Gérer les devoirs
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}