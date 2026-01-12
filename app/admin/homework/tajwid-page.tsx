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
  ChevronDown,
  ChevronUp,
  ChevronRight,
  Mail,
  Users,
  TrendingUp,
  BarChart3,
  Music
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

interface TajwidHomeworkForm {
  chapterId: number;
  title: string;
  content: string;
}

export default function AdminTajwidHomeworkPage() {
  const [homeworks, setHomeworks] = useState<TajwidHomework[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingHomework, setEditingHomework] = useState<TajwidHomework | null>(null);
  const [formData, setFormData] = useState<TajwidHomeworkForm>({
    chapterId: 1,
    title: '',
    content: '',
  });
  const [formLoading, setFormLoading] = useState(false);
  const [expandedHomework, setExpandedHomework] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchHomeworks();
  }, []);

  const fetchHomeworks = async () => {
    try {
      const response = await fetch('/api/admin/homework/tajwid');
      if (response.status === 403) {
        router.push('/dashboard');
        return;
      }
      if (response.ok) {
        const data = await response.json();
        setHomeworks(data);
      } else {
        toast.error('Erreur lors du chargement');
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur de connexion');
    } finally {
      setLoading(false);
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

      const result = await response.json();

      if (response.ok) {
        toast.success(editingHomework ? 'Devoir Tajwid modifié !' : 'Devoir Tajwid créé !');
        setShowForm(false);
        resetForm();
        fetchHomeworks();
      } else {
        toast.error(result.error || 'Erreur');
      }
    } catch (error) {
      console.error('Erreur:', error);
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
    if (!confirm('Êtes-vous sûr ?')) return;

    try {
      const response = await fetch('/api/admin/homework/tajwid', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        toast.success('Supprimé !');
        fetchHomeworks();
      } else {
        toast.error('Erreur');
      }
    } catch (error) {
      toast.error('Erreur');
    }
  };

  const resetForm = () => {
    setFormData({ chapterId: 1, title: '', content: '' });
    setEditingHomework(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-900 text-white p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-purple-400 mx-auto mb-6"></div>
          <p>Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-900 text-white">
      <div className="bg-zinc-800 border-b border-zinc-700 p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="bg-zinc-700 p-2 rounded-lg">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <Music className="h-8 w-8" />
                Devoirs Tajwid
              </h1>
              <p className="text-zinc-400">{homeworks.length} devoir(s)</p>
            </div>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <Plus className="h-5 w-5" />
            Ajouter
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {homeworks.length > 0 ? (
          <div className="space-y-4">
            {homeworks.map((hw) => (
              <div key={hw.id} className="bg-zinc-800 border border-zinc-700 rounded-xl">
                <div 
                  className="p-6 cursor-pointer hover:bg-zinc-700/50"
                  onClick={() => setExpandedHomework(expandedHomework === hw.id ? null : hw.id)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-semibold">Chapitre {hw.chapterId} - {hw.title}</h3>
                      <p className="text-zinc-400 text-sm">
                        Créé le {new Date(hw.createdAt).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(hw);
                        }}
                        className="bg-blue-600 p-2 rounded-lg"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(hw.id);
                        }}
                        className="bg-red-600 p-2 rounded-lg"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                      {expandedHomework === hw.id ? <ChevronUp /> : <ChevronDown />}
                    </div>
                  </div>
                </div>

                {expandedHomework === hw.id && (
                  <div className="border-t border-zinc-700 p-6 bg-zinc-900/50">
                    <div className="bg-zinc-800 rounded-lg p-4 whitespace-pre-wrap text-zinc-300">
                      {hw.content}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Music className="h-16 w-16 mx-auto mb-4 text-zinc-600" />
            <h3 className="text-xl font-semibold mb-2">Aucun devoir</h3>
            <button
              onClick={() => setShowForm(true)}
              className="bg-purple-600 px-6 py-2 rounded-lg mt-4"
            >
              Créer un devoir
            </button>
          </div>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-800 rounded-xl p-8 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">
                {editingHomework ? 'Modifier' : 'Créer'} Devoir Tajwid
              </h2>
              <button onClick={() => { setShowForm(false); resetForm(); }}>
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Chapitre *</label>
                  <select
                    value={formData.chapterId}
                    onChange={(e) => setFormData(prev => ({ ...prev, chapterId: parseInt(e.target.value) }))}
                    className="w-full bg-zinc-700 rounded-lg px-4 py-2 text-white"
                  >
                    {Array.from({ length: 12 }, (_, i) => (
                      <option key={i} value={i}>Chapitre {i}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Titre *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full bg-zinc-700 rounded-lg px-4 py-2 text-white"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Contenu *</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  className="w-full bg-zinc-700 rounded-lg px-4 py-2 text-white h-32"
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => { setShowForm(false); resetForm(); }}
                  className="flex-1 bg-zinc-600 py-2 rounded-lg"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="flex-1 bg-purple-600 py-2 rounded-lg disabled:opacity-50"
                >
                  {formLoading ? 'Sauvegarde...' : editingHomework ? 'Modifier' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
