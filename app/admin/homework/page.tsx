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
  Download,
  Eye,
  ChevronDown,
  ChevronRight,
  Mail, 
  Send,
  Users,
  TrendingUp,
  BarChart3
} from 'lucide-react';
import toast from 'react-hot-toast';

interface Homework {
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

export default function AdminHomeworkPage() {
  const [homeworks, setHomeworks] = useState<Homework[]>([]);
  const [stats, setStats] = useState<HomeworkStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingHomework, setEditingHomework] = useState<Homework | null>(null);
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
      console.log('📚 [ADMIN UI] Chargement des devoirs...');
      const response = await fetch('/api/admin/homework');
      if (response.status === 403) {
        router.push('/dashboard');
        return;
      }
      if (response.ok) {
        const data = await response.json();
        console.log('📚 [ADMIN UI] Devoirs chargés:', data);
        setHomeworks(data);
      } else {
        console.log('❌ [ADMIN UI] Erreur chargement:', response.status);
        toast.error('Erreur lors du chargement des devoirs');
      }
    } catch (error) {
      console.error('❌ [ADMIN UI] Erreur réseau:', error);
      toast.error('Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/homework/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching homework stats:', error);
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

    if (formData.chapterId < 0 || formData.chapterId > 11) {
      toast.error('Numéro de chapitre invalide (0-11)');
      return;
    }

    console.log('📝 [ADMIN UI] Envoi formulaire:', formData);
    console.log('📝 [ADMIN UI] Mode édition:', !!editingHomework);

    setFormLoading(true);

    try {
      const response = await fetch('/api/admin/homework', {
        method: editingHomework ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chapterId: formData.chapterId,
          title: formData.title.trim(),
          content: formData.content.trim(),
          id: editingHomework?.id
        }),
      });

      console.log('📡 [ADMIN UI] Réponse API:', response.status);
      const result = await response.json();
      console.log('📊 [ADMIN UI] Données de réponse:', result);

      if (response.ok) {
        toast.success(editingHomework ? 'Devoir modifié avec succès !' : 'Devoir créé avec succès !');
        setShowForm(false);
        resetForm();
        fetchHomeworks();
        fetchStats(); // Recharger les stats
      } else {
        console.log('❌ [ADMIN UI] Erreur API:', result.error);
        toast.error(result.error || 'Erreur lors de la sauvegarde');
      }
    } catch (error) {
      console.error('❌ [ADMIN UI] Erreur réseau:', error);
      toast.error('Erreur de connexion');
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = (homework: Homework) => {
    setEditingHomework(homework);
    setFormData({
      chapterId: homework.chapterId,
      title: homework.title,
      content: homework.content,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce devoir ?')) return;

    try {
      const response = await fetch('/api/admin/homework', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success('Devoir supprimé avec succès !');
        fetchHomeworks();
        fetchStats(); // Recharger les stats
      } else {
        toast.error(result.error || 'Erreur lors de la suppression');
      }
    } catch (error) {
      toast.error('Erreur de connexion');
      console.error('Delete homework error:', error);
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

  const generateHomeworkPDF = async (homework: Homework) => {
    try {
      const response = await fetch('/api/admin/homework/pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ homeworkId: homework.id }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `devoir-chapitre-${homework.chapterId}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        toast.success('PDF généré avec succès !');
      } else {
        toast.error('Erreur lors de la génération du PDF');
      }
    } catch (error) {
      toast.error('Erreur de connexion');
      console.error('Generate PDF error:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-900 text-white p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-orange-400 mx-auto mb-6"></div>
          <p className="text-lg">Chargement des devoirs...</p>
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
                href="/admin"
                className="bg-zinc-700 hover:bg-zinc-600 text-white p-1.5 sm:p-2 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
              </Link>
              
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold flex items-center gap-2 sm:gap-3">
                  <div className="bg-orange-600 p-1.5 sm:p-2 rounded-lg">
                    <FileText className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8" />
                  </div>
                  <span className="hidden sm:inline">Gestion des Devoirs</span>
                  <span className="sm:hidden">Devoirs</span>
                </h1>
                <p className="text-zinc-400 mt-1 sm:mt-2 text-sm sm:text-base">
                  {homeworks.length} devoir(s) configuré(s)
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
              <Link
                href="/admin/homework/sends"
                className="bg-green-600 hover:bg-green-700 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg flex items-center gap-1 sm:gap-2 transition-colors text-sm sm:text-base"
              >
                <Mail className="h-4 w-4" />
                <span className="hidden sm:inline">Voir tous les envois</span>
                <span className="sm:hidden">Envois</span>
              </Link>
              <button
                onClick={() => setShowForm(true)}
                className="bg-orange-600 hover:bg-orange-700 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg flex items-center gap-1 sm:gap-2 transition-colors text-sm sm:text-base"
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
        {/* Statistiques des envois */}
        {showStats && stats && !statsLoading && (
          <div className="mb-8 space-y-6">
            {/* Vue d'ensemble */}
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

            {/* Statistiques par chapitre */}
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

            {/* Top utilisateurs */}
            <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-400" />
                Top utilisateurs (devoirs reçus)
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

        {/* Liste des devoirs */}
        {homeworks.length > 0 ? (
          <div className="space-y-4">
            {homeworks.map((homework) => (
              <div key={homework.id} className="bg-zinc-800 border border-zinc-700 rounded-xl overflow-hidden">
                {/* En-tête du devoir */}
                <div 
                  className="p-6 cursor-pointer hover:bg-zinc-700/50 transition-colors"
                  onClick={() => setExpandedHomework(expandedHomework === homework.id ? null : homework.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="bg-gradient-to-r from-orange-500 to-red-500 w-12 h-12 rounded-xl flex items-center justify-center">
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
                          <Mail className="h-3 w-3" />
                          <Link 
                            href={`/admin/homework/users/${homework.id}`}
                            className="hover:underline"
                          >
                            {stats.homeworkStats.find(s => s.id === homework.id)?.sentCount || 0} envoi(s)
                          </Link>
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
                            generateHomeworkPDF(homework);
                          }}
                          className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-lg transition-colors"
                          title="Télécharger PDF"
                        >
                          <Download className="h-4 w-4" />
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

                      {/* Flèche d'expansion */}
                      <div className="text-zinc-400">
                        {expandedHomework === homework.id ? (
                          <ChevronDown className="h-5 w-5" />
                        ) : (
                          <ChevronRight className="h-5 w-5" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contenu étendu */}
                {expandedHomework === homework.id && (
                  <div className="border-t border-zinc-700 p-6 bg-zinc-900/50">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Contenu du devoir */}
                      <div>
                        <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                          <FileText className="h-5 w-5 text-orange-400" />
                          Contenu du devoir
                        </h4>
                        
                        <div className="bg-zinc-800 border border-zinc-600 rounded-lg p-4">
                          <div className="text-zinc-300 text-sm leading-relaxed whitespace-pre-wrap">
                            {homework.content}
                          </div>
                        </div>
                      </div>

                      {/* Métadonnées */}
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

                          {/* Actions rapides */}
                          <div className="space-y-2">
                            <button
                              onClick={() => generateHomeworkPDF(homework)}
                              className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                            >
                              <Download className="h-4 w-4" />
                              Télécharger en PDF
                            </button>
                            
                            <button
                              onClick={() => navigator.clipboard.writeText(homework.content)}
                              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                            >
                              📋 Copier le contenu
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-12 text-center">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Aucun devoir configuré
            </h3>
            <p className="text-zinc-400 mb-6">
              Commencez par créer des devoirs pour vos chapitres.
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              Créer le premier devoir
            </button>
          </div>
        )}
      </div>

      {/* Modal d'ajout/édition */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-800/95 backdrop-blur-xl border border-white/10 rounded-3xl p-8 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">
                {editingHomework ? 'Modifier le devoir' : 'Créer un devoir'}
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
                  <select
                    value={formData.chapterId}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      console.log('📝 [ADMIN UI] Changement chapitre:', value);
                      setFormData(prev => ({ ...prev, chapterId: value }));
                    }}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    required
                  >
                    {Array.from({ length: 12 }, (_, i) => (
                      <option key={i} value={i} className="bg-zinc-800">
                        Chapitre {i} {i === 0 ? '(Préparatoire)' : i === 11 ? '(Évaluation finale)' : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Titre du devoir *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Ex: Maîtrise de l'alphabet"
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
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Décrivez les exercices et instructions du devoir..."
                  rows={8}
                  required
                />
                <p className="text-zinc-400 text-xs mt-1">
                  Utilisez des retours à la ligne pour structurer le contenu
                </p>
              </div>

              {/* Aperçu en temps réel */}
              {formData.content && (
                <div className="bg-zinc-700 border border-zinc-600 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-zinc-300 mb-3">Aperçu :</h4>
                  <div className="text-zinc-200 text-sm leading-relaxed whitespace-pre-wrap">
                    {formData.content}
                  </div>
                </div>
              )}
              
              {/* Statistiques d'envoi (uniquement en mode édition) */}
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
                  className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
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