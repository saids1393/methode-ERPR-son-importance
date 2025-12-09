'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  FileText,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  ArrowLeft,
  BookOpen,
  Calendar,
  ChevronDown,
  ChevronRight,
  Users,
  TrendingUp,
  BarChart3
} from 'lucide-react';
import toast from 'react-hot-toast';

interface TajwidHomework {
  id: string;
  chapterId: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  sentCount?: number;
}

interface HomeworkForm {
  chapterId: number;
  title: string;
  content: string;
}

interface HomeworkStats {
  overview: {
    totalHomeworks: number;
    totalSends: number;
    uniqueUsersWithHomework: number;
    recentSends: number;
    averageSendsPerHomework: number;
  };
  homeworkStats: Array<{
    id: string;
    chapterId: number;
    title: string;
    sentCount: number;
  }>;
  topUsers: Array<{
    id: string;
    email: string;
    username: string | null;
    homeworkCount: number;
  }>;
  dailyStats: Array<{
    date: string;
    sends: number;
  }>;
}

export default function AdminTajwidHomeworkPage() {
  const [homeworks, setHomeworks] = useState<TajwidHomework[]>([]);
  const [stats, setStats] = useState<HomeworkStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingHomework, setEditingHomework] = useState<TajwidHomework | null>(null);
  const [formData, setFormData] = useState<HomeworkForm>({
    chapterId: 1,
    title: '',
    content: '',
  });
  const [formLoading, setFormLoading] = useState(false);
  const [expandedHomework, setExpandedHomework] = useState<string | null>(null);
  const [showStats, setShowStats] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchHomeworks();
    fetchStats();
  }, []);

  const fetchHomeworks = async () => {
    try {
      console.log('📚 [ADMIN TAJWID UI] Chargement des devoirs Tajwid...');
      const response = await fetch('/api/admin/homework/tajwid');
      if (response.status === 403) {
        router.push('/dashboard');
        return;
      }
      if (response.ok) {
        const data = await response.json();
        console.log('📚 [ADMIN TAJWID UI] Devoirs chargés:', data);
        setHomeworks(data);
      } else {
        console.log('❌ [ADMIN TAJWID UI] Erreur chargement:', response.status);
        toast.error('Erreur lors du chargement des devoirs Tajwid');
      }
    } catch (error) {
      console.error('❌ [ADMIN TAJWID UI] Erreur réseau:', error);
      toast.error('Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/homework/tajwid/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching tajwid homework stats:', error);
    } finally {
      setStatsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.content.trim()) {
      toast.error('Titre et contenu requis');
      return;
    }

    if (formData.chapterId < 0) {
      toast.error('Numéro de chapitre invalide');
      return;
    }

    console.log('📝 [ADMIN TAJWID UI] Envoi formulaire:', formData);
    console.log('📝 [ADMIN TAJWID UI] Mode édition:', !!editingHomework);

    setFormLoading(true);

    try {
      const response = await fetch('/api/admin/homework/tajwid', {
        method: editingHomework ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chapterId: formData.chapterId,
          title: formData.title.trim(),
          content: formData.content.trim(),
          id: editingHomework?.id
        }),
      });

      console.log('📡 [ADMIN TAJWID UI] Réponse API:', response.status);
      const result = await response.json();
      console.log('📊 [ADMIN TAJWID UI] Données de réponse:', result);

      if (response.ok) {
        toast.success(editingHomework ? 'Devoir Tajwid modifié avec succès !' : 'Devoir Tajwid créé avec succès !');
        setShowForm(false);
        resetForm();
        fetchHomeworks();
        fetchStats();
      } else {
        console.log('❌ [ADMIN TAJWID UI] Erreur API:', result.error);
        toast.error(result.error || 'Erreur lors de la sauvegarde');
      }
    } catch (error) {
      console.error('❌ [ADMIN TAJWID UI] Erreur réseau:', error);
      toast.error('Erreur de connexion');
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = (homework: TajwidHomework) => {
    setEditingHomework(homework);
    setFormData({
      chapterId: homework.chapterId,
      title: homework.title,
      content: homework.content,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce devoir Tajwid ?')) return;

    try {
      const response = await fetch('/api/admin/homework/tajwid', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success('Devoir Tajwid supprimé avec succès !');
        fetchHomeworks();
        fetchStats();
      } else {
        toast.error(result.error || 'Erreur lors de la suppression');
      }
    } catch (error) {
      toast.error('Erreur de connexion');
      console.error('Delete tajwid homework error:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      chapterId: 1,
      title: '',
      content: '',
    });
    setEditingHomework(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-900 text-white p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-400 mx-auto mb-6"></div>
          <p className="text-lg">Chargement des devoirs Tajwid...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-900 text-white">
      <div className="bg-zinc-800 border-b border-zinc-700 p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4 sm:mb-6">
            <div className="flex items-center gap-4">
              <Link
                href="/admin"
                className="bg-zinc-700 hover:bg-zinc-600 text-white p-1.5 sm:p-2 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
              </Link>

              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold flex items-center gap-2 sm:gap-3">
                  <div className="bg-green-600 p-1.5 sm:p-2 rounded-lg">
                    <FileText className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8" />
                  </div>
                  <span className="hidden sm:inline">Gestion des Devoirs Tajwid</span>
                  <span className="sm:hidden">Devoirs Tajwid</span>
                </h1>
                <p className="text-zinc-400 mt-1 sm:mt-2 text-sm sm:text-base">
                  {homeworks.length} devoir(s) Tajwid configuré(s)
                  {stats && ` • ${stats.overview.totalSends} envoi(s) effectué(s)`}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 sm:gap-3">
              <button
                onClick={() => setShowStats(!showStats)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg flex items-center gap-1 sm:gap-2 transition-colors text-sm sm:text-base"
              >
                <BarChart3 className="h-4 w-4" />
                <span className="hidden sm:inline">Statistiques</span>
                <span className="sm:hidden">Stats</span>
              </button>
              <button
                onClick={() => setShowForm(true)}
                className="bg-green-600 hover:bg-green-700 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg flex items-center gap-1 sm:gap-2 transition-colors text-sm sm:text-base"
              >
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Ajouter un devoir</span>
                <span className="sm:hidden">Ajouter</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        {showStats && stats && !statsLoading && (
          <div className="mb-8 space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-white">{stats.overview.totalHomeworks}</div>
                <div className="text-zinc-400 text-sm">Devoirs créés</div>
              </div>
              <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-green-400">{stats.overview.totalSends}</div>
                <div className="text-zinc-400 text-sm">Envois réussis</div>
              </div>
              <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-blue-400">{stats.overview.uniqueUsersWithHomework}</div>
                <div className="text-zinc-400 text-sm">Utilisateurs touchés</div>
              </div>
              <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-purple-400">{stats.overview.recentSends}</div>
                <div className="text-zinc-400 text-sm">Envois (30j)</div>
              </div>
              <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-yellow-400">{stats.overview.averageSendsPerHomework}</div>
                <div className="text-zinc-400 text-sm">Moyenne/devoir</div>
              </div>
            </div>

            <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-400" />
                Envois par chapitre
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {stats.homeworkStats.map((hw) => (
                  <div key={hw.id} className="bg-zinc-700 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-white font-medium">Chapitre {hw.chapterId}</span>
                      <span className="text-green-400 font-bold">{hw.sentCount}</span>
                    </div>
                    <div className="text-zinc-300 text-sm truncate">{hw.title}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-400" />
                Top utilisateurs (devoirs Tajwid reçus)
              </h3>
              <div className="space-y-2">
                {stats.topUsers.slice(0, 5).map((user, index) => (
                  <div key={user.id} className="flex items-center justify-between bg-zinc-700 rounded-lg p-3">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-600 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <div className="text-white font-medium">{user.username || 'Sans pseudo'}</div>
                        <div className="text-zinc-400 text-sm">{user.email}</div>
                      </div>
                    </div>
                    <div className="text-green-400 font-bold">{user.homeworkCount} devoirs</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {homeworks.length > 0 ? (
          <div className="space-y-4">
            {homeworks.map((homework) => {
              const isExpanded = expandedHomework === homework.id;

              return (
                <div key={homework.id} className="bg-zinc-800 border border-zinc-700 rounded-xl overflow-hidden">
                  <div
                    className="p-6 cursor-pointer hover:bg-zinc-700/50 transition-colors"
                    onClick={() => setExpandedHomework(isExpanded ? null : homework.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="bg-gradient-to-r from-green-500 to-teal-500 w-12 h-12 rounded-xl flex items-center justify-center">
                          <BookOpen className="h-6 w-6 text-white" />
                        </div>

                        <div>
                          <h3 className="text-lg font-semibold text-white">
                            Chapitre {homework.chapterId} - {homework.title}
                          </h3>
                          <p className="text-zinc-400 text-sm">
                            Créé le {new Date(homework.createdAt).toLocaleDateString('fr-FR')}
                          </p>
                        </div>

                        {stats && (
                          <div className="flex items-center gap-1 text-green-400 text-sm">
                            {stats.homeworkStats.find(s => s.id === homework.id)?.sentCount || 0} envoi(s)
                          </div>
                        )}
                      </div>

                      <div className="flex items-center space-x-4">
                        <div className="flex gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEdit(homework);
                            }}
                            className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors"
                            title="Modifier"
                          >
                            <Edit className="h-4 w-4" />
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(homework.id);
                            }}
                            className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition-colors"
                            title="Supprimer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="text-zinc-400">
                          {isExpanded ? (
                            <ChevronDown className="h-5 w-5" />
                          ) : (
                            <ChevronRight className="h-5 w-5" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="border-t border-zinc-700 p-6 bg-zinc-900/50">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div>
                          <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <FileText className="h-5 w-5 text-green-400" />
                            Contenu du devoir
                          </h4>

                          <div className="bg-zinc-800 border border-zinc-600 rounded-lg p-4">
                            <div className="text-zinc-300 text-sm leading-relaxed whitespace-pre-wrap">
                              {homework.content}
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <Calendar className="h-5 w-5 text-blue-400" />
                            Informations
                          </h4>

                          <div className="space-y-4">
                            <div className="bg-zinc-800 border border-zinc-600 rounded-lg p-4">
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-zinc-400 text-sm">Chapitre</span>
                                <span className="text-white font-semibold">
                                  {homework.chapterId}
                                </span>
                              </div>

                              <div className="flex justify-between items-center mb-2">
                                <span className="text-zinc-400 text-sm">Créé le</span>
                                <span className="text-white font-semibold text-sm">
                                  {new Date(homework.createdAt).toLocaleDateString('fr-FR', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                  })}
                                </span>
                              </div>

                              <div className="flex justify-between items-center">
                                <span className="text-zinc-400 text-sm">Modifié le</span>
                                <span className="text-white font-semibold text-sm">
                                  {new Date(homework.updatedAt).toLocaleDateString('fr-FR', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                  })}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-12 text-center">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Aucun devoir Tajwid configuré
            </h3>
            <p className="text-zinc-400 mb-6">
              Commencez par créer des devoirs Tajwid pour vos chapitres.
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              Créer le premier devoir Tajwid
            </button>
          </div>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-800/95 backdrop-blur-xl border border-white/10 rounded-3xl p-8 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">
                {editingHomework ? 'Modifier le devoir Tajwid' : 'Créer un devoir Tajwid'}
              </h3>
              <button
                onClick={() => {
                  setShowForm(false);
                  resetForm();
                }}
                className="text-zinc-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Numéro de chapitre *
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.chapterId}
                    onChange={(e) => {
                      const value = parseInt(e.target.value) || 0;
                      console.log('📝 [ADMIN TAJWID UI] Changement chapitre:', value);
                      setFormData(prev => ({ ...prev, chapterId: value }));
                    }}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Titre du devoir *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Ex: Règles du Noun Sakinah"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Contenu du devoir *
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Décrivez les exercices et instructions du devoir Tajwid..."
                  rows={8}
                  required
                />
                <p className="text-zinc-400 text-xs mt-1">
                  Utilisez des retours à la ligne pour structurer le contenu
                </p>
              </div>

              {formData.content && (
                <div className="bg-zinc-700 border border-zinc-600 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-zinc-300 mb-3">Aperçu :</h4>
                  <div className="text-zinc-200 text-sm leading-relaxed whitespace-pre-wrap">
                    {formData.content}
                  </div>
                </div>
              )}

              {editingHomework && stats && (
                <div className="flex justify-between items-center pt-2 border-t border-zinc-600">
                  <span className="text-zinc-400 text-sm">Envois réussis</span>
                  <span className="text-green-400 font-bold">
                    {stats.homeworkStats.find(s => s.id === editingHomework.id)?.sentCount || 0}
                  </span>
                </div>
              )}

              <div className="flex space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    resetForm();
                  }}
                  className="flex-1 bg-white/10 hover:bg-white/20 text-white font-medium px-6 py-3 rounded-xl transition-all duration-200 border border-white/20"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="flex-1 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {formLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                      Sauvegarde...
                    </>
                  ) : (
                    <>
                      <Save className="h-5 w-5" />
                      {editingHomework ? 'Modifier' : 'Créer'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
