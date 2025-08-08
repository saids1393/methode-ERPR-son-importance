'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Users,
  Search,
  ArrowLeft,
  Clock,
  BookOpen,
  Award,
  Calendar,
  User,
  Mail,
  TrendingUp,
  Filter,
  Eye,
  ChevronDown,
  CheckCircle,
  XCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

interface StudentSession {
  id: string;
  scheduledAt: string;
  status: string;
  zoomLink?: string;
  notes?: string;
  availabilityId?: string;
  isPast: boolean;
  statusText: string;
  cancellation?: {
    id: string;
    cancelledBy: string;
    reason: any;
    customReason?: string;
    cancelledAt: string;
  };
}

interface Student {
  id: string;
  email: string;
  username: string | null;
  gender: string;
  completedPagesCount: number;
  completedQuizzesCount: number;
  progressPercentage: number;
  studyTimeMinutes: number;
  sessions: StudentSession[];
}

export default function ProfessorStudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'progress' | 'studyTime' | 'sessions'>('progress');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [expandedStudent, setExpandedStudent] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    // Filtrer et trier les élèves
    let filtered = students.filter(student => {
      const searchLower = searchTerm.toLowerCase();
      return (
        student.email.toLowerCase().includes(searchLower) ||
        (student.username && student.username.toLowerCase().includes(searchLower))
      );
    });

    // Trier
    filtered.sort((a, b) => {
      let aValue: number | string;
      let bValue: number | string;

      switch (sortBy) {
        case 'name':
          aValue = (a.username || a.email).toLowerCase();
          bValue = (b.username || b.email).toLowerCase();
          break;
        case 'progress':
          aValue = a.progressPercentage;
          bValue = b.progressPercentage;
          break;
        case 'studyTime':
          aValue = a.studyTimeMinutes;
          bValue = b.studyTimeMinutes;
          break;
        case 'sessions':
          aValue = a.sessions.length;
          bValue = b.sessions.length;
          break;
        default:
          aValue = a.progressPercentage;
          bValue = b.progressPercentage;
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      }

      return sortOrder === 'asc' ? (aValue as number) - (bValue as number) : (bValue as number) - (aValue as number);
    });

    setFilteredStudents(filtered);
  }, [students, searchTerm, sortBy, sortOrder]);

  const fetchStudents = async () => {
    try {
      const response = await fetch('/api/professor/students');
      if (response.ok) {
        const data = await response.json();
        setStudents(data.students || []);
      } else if (response.status === 401) {
        router.push('/professor');
      } else {
        toast.error('Erreur lors du chargement');
      }
    } catch (error) {
      toast.error('Erreur de connexion');
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours > 0) {
      return `${hours}h ${mins}min`;
    }
    return `${mins}min`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SCHEDULED': return 'text-blue-400';
      case 'COMPLETED': return 'text-green-400';
      case 'CANCELLED': return 'text-red-400';
      case 'NO_SHOW': return 'text-orange-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'SCHEDULED': return 'Programmée';
      case 'COMPLETED': return 'Terminée';
      case 'CANCELLED': return 'Annulée';
      case 'NO_SHOW': return 'Absence';
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-400 mx-auto mb-6"></div>
          <p className="text-white text-lg font-medium">Chargement des élèves...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-900 to-slate-900">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/professor')}
                className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 p-2 rounded-xl transition-all duration-300 text-white"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              
              <div className="flex items-center space-x-4">
                <div className="bg-gradient-to-r from-green-500 to-pink-500 p-3 rounded-xl">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">
                    Mes Élèves
                  </h1>
                  <p className="text-green-200">Suivi détaillé de vos étudiants</p>
                </div>
              </div>
            </div>
            
            <div className="text-white text-right">
              <div className="text-sm text-slate-300">Total des élèves</div>
              <div className="text-2xl font-bold">{students.length}</div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        {/* Barre de recherche et filtres */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Barre de recherche */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Rechercher par email ou pseudo..."
                className="w-full bg-white/10 border border-white/20 rounded-xl pl-10 pr-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* Filtres de tri */}
            <div className="flex gap-3">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="progress" className="bg-slate-800">Progression</option>
                <option value="name" className="bg-slate-800">Nom</option>
                <option value="studyTime" className="bg-slate-800">Temps d'étude</option>
                <option value="sessions" className="bg-slate-800">Séances</option>
              </select>

              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl px-4 py-3 text-white transition-colors"
                title={`Tri ${sortOrder === 'asc' ? 'croissant' : 'décroissant'}`}
              >
                {sortOrder === 'asc' ? '↑' : '↓'}
              </button>
            </div>
          </div>

          {/* Statistiques rapides */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{students.length}</div>
              <div className="text-slate-400 text-sm">Total élèves</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">
                {students.reduce((sum, s) => sum + s.sessions.filter(sess => sess.status === 'COMPLETED').length, 0)}
              </div>
              <div className="text-slate-400 text-sm">Séances terminées</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">
                {students.reduce((sum, s) => sum + s.sessions.filter(sess => sess.status === 'SCHEDULED').length, 0)}
              </div>
              <div className="text-slate-400 text-sm">Séances programmées</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">
                {Math.round(students.reduce((sum, s) => sum + s.progressPercentage, 0) / (students.length || 1))}%
              </div>
              <div className="text-slate-400 text-sm">Progression moyenne</div>
            </div>
          </div>
        </div>

        {/* Liste des élèves */}
        {filteredStudents.length > 0 ? (
          <div className="space-y-4">
            {filteredStudents.map((student) => (
              <div key={student.id} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
                {/* En-tête de l'élève */}
                <div 
                  className="p-6 cursor-pointer hover:bg-white/5 transition-colors"
                  onClick={() => setExpandedStudent(expandedStudent === student.id ? null : student.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="bg-gradient-to-r from-blue-500 to-green-500 w-12 h-12 rounded-xl flex items-center justify-center">
                        <User className="h-6 w-6 text-white" />
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-semibold text-white">
                          {student.username || 'Élève'}
                        </h3>
                        <p className="text-slate-400 text-sm">{student.email}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                            student.gender === 'HOMME' 
                              ? 'bg-blue-900/30 text-blue-400' 
                              : 'bg-pink-900/30 text-pink-400'
                          }`}>
                            {student.gender === 'HOMME' ? '👨' : '👩'} {student.gender}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-6">
                      {/* Progression */}
                      <div className="text-center">
                        <div className="text-2xl font-bold text-white mb-1">
                          {student.progressPercentage}%
                        </div>
                        <div className="w-20 bg-slate-700 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-green-400 to-blue-400 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${student.progressPercentage}%` }}
                          ></div>
                        </div>
                        <div className="text-slate-400 text-xs mt-1">Progression</div>
                      </div>

                      {/* Temps d'étude */}
                      <div className="text-center">
                        <div className="text-lg font-bold text-white">
                          {formatTime(student.studyTimeMinutes)}
                        </div>
                        <div className="text-slate-400 text-xs">Temps d'étude</div>
                      </div>

                      {/* Séances */}
                      <div className="text-center">
                        <div className="text-lg font-bold text-white">
                          {student.sessions.length}
                        </div>
                        <div className="text-slate-400 text-xs">Séances</div>
                      </div>

                      {/* Flèche d'expansion */}
                      <ChevronDown 
                        className={`h-5 w-5 text-slate-400 transition-transform duration-200 ${
                          expandedStudent === student.id ? 'rotate-180' : ''
                        }`} 
                      />
                    </div>
                  </div>
                </div>

                {/* Détails étendus */}
                {expandedStudent === student.id && (
                  <div className="border-t border-white/10 p-6 bg-black/20">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Progression détaillée */}
                      <div>
                        <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                          <TrendingUp className="h-5 w-5 text-green-400" />
                          Progression détaillée
                        </h4>
                        
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="text-slate-300">Pages complétées</span>
                            <span className="text-white font-semibold">
                              {student.completedPagesCount}/29
                            </span>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <span className="text-slate-300">Quiz complétés</span>
                            <span className="text-white font-semibold">
                              {student.completedQuizzesCount}/11
                            </span>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <span className="text-slate-300">Temps d'étude total</span>
                            <span className="text-white font-semibold">
                              {formatTime(student.studyTimeMinutes)}
                            </span>
                          </div>
                          
                          <div className="pt-3 border-t border-white/10">
                            <div className="flex justify-between items-center">
                              <span className="text-slate-300">Progression globale</span>
                              <span className="text-green-400 font-bold text-lg">
                                {student.progressPercentage}%
                              </span>
                            </div>
                            <div className="w-full bg-slate-700 rounded-full h-3 mt-2">
                              <div 
                                className="bg-gradient-to-r from-green-400 to-blue-400 h-3 rounded-full transition-all duration-500"
                                style={{ width: `${student.progressPercentage}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Historique des séances */}
                      <div>
                        <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                          <Calendar className="h-5 w-5 text-blue-400" />
                          Historique des séances ({student.sessions.length})
                        </h4>
                        
                        {student.sessions.length > 0 ? (
                          <div className="space-y-3 max-h-64 overflow-y-auto">
                            {student.sessions.map((session) => (
                              <div key={session.id} className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-4">
                                <div className="flex items-center justify-between mb-2">
                                  <div className="text-white font-medium">
                                    {formatDate(session.scheduledAt)}
                                  </div>
                                  <div className={`text-sm font-medium ${getStatusColor(session.status)}`}>
                                    {getStatusText(session.status)}
                                  </div>
                                </div>
                                
                                {session.status === 'CANCELLED' && session.cancellation && (
                                  <div className="mt-2 p-2 bg-red-900/20 border border-red-500/30 rounded text-xs">
                                    <div className="text-red-400 font-medium">
                                      Annulée par {session.cancellation.cancelledBy === 'STUDENT' ? 'l\'élève' : 'vous'}
                                    </div>
                                    {session.cancellation.customReason && (
                                      <div className="text-red-300 mt-1">
                                        {session.cancellation.customReason}
                                      </div>
                                    )}
                                  </div>
                                )}
                                
                                {session.notes && (
                                  <div className="mt-2 text-slate-300 text-sm">
                                    <strong>Notes :</strong> {session.notes}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8 text-slate-400">
                            <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
                            <p>Aucune séance programmée</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-12 text-center">
            {searchTerm ? (
              <>
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  Aucun résultat trouvé
                </h3>
                <p className="text-slate-400 mb-6">
                  Aucun élève ne correspond à votre recherche "{searchTerm}"
                </p>
                <button
                  onClick={() => setSearchTerm('')}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors"
                >
                  Effacer la recherche
                </button>
              </>
            ) : (
              <>
                <div className="text-6xl mb-4">👥</div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  Aucun élève pour le moment
                </h3>
                <p className="text-slate-400 mb-6">
                  Les élèves apparaîtront ici une fois qu'ils auront réservé des séances avec vous.
                </p>
                <button
                  onClick={() => router.push('/professor/availability')}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors"
                >
                  Gérer mes disponibilités
                </button>
              </>
            )}
          </div>
        )}

        {/* Résumé en bas */}
        {filteredStudents.length > 0 && (
          <div className="mt-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Résumé</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-xl font-bold text-white">
                  {filteredStudents.filter(s => s.progressPercentage >= 75).length}
                </div>
                <div className="text-slate-400 text-sm">Élèves avancés (≥75%)</div>
              </div>
              <div>
                <div className="text-xl font-bold text-white">
                  {filteredStudents.filter(s => s.sessions.length > 0).length}
                </div>
                <div className="text-slate-400 text-sm">Avec séances</div>
              </div>
              <div>
                <div className="text-xl font-bold text-white">
                  {Math.round(filteredStudents.reduce((sum, s) => sum + s.studyTimeMinutes, 0) / 60)}h
                </div>
                <div className="text-slate-400 text-sm">Temps total d'étude</div>
              </div>
              <div>
                <div className="text-xl font-bold text-white">
                  {Math.round(filteredStudents.reduce((sum, s) => sum + s.progressPercentage, 0) / (filteredStudents.length || 1))}%
                </div>
                <div className="text-slate-400 text-sm">Progression moyenne</div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}