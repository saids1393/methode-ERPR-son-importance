'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Play, Save, X } from 'lucide-react';
import toast from 'react-hot-toast';

interface TajwidChapterVideo {
  id: string;
  chapterNumber: number;
  title: string;
  cloudflareVideoId: string;
  thumbnailUrl?: string;
  duration?: number;
}

interface VideoForm {
  chapterNumber: number;
  title: string;
  cloudflareVideoId: string;
  thumbnailUrl: string;
  duration: number;
}

export default function AdminVideosTajwidPage() {
  const [videos, setVideos] = useState<TajwidChapterVideo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingVideo, setEditingVideo] = useState<TajwidChapterVideo | null>(null);
  const [formData, setFormData] = useState<VideoForm>({
    chapterNumber: 1,
    title: '',
    cloudflareVideoId: '',
    thumbnailUrl: '',
    duration: 0,
  });

  useEffect(() => {
    loadVideos();
  }, []);

  const loadVideos = async () => {
    setIsLoading(true);
    try {
      console.log('🔄 [ADMIN TAJWID] Chargement des vidéos...');
      const response = await fetch('/api/videos-tajwid');
      if (response.ok) {
        const data = await response.json();
        console.log('📊 [ADMIN TAJWID] Vidéos chargées:', data);
        setVideos(data);
      } else {
        console.error('❌ [ADMIN TAJWID] Erreur lors du chargement:', response.status);
        toast.error('Erreur lors du chargement des vidéos');
      }
    } catch (error) {
      console.error('Error loading Tajwid videos:', error);
      toast.error('Erreur de connexion');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation côté client
    if (!formData.title.trim()) {
      toast.error('Le titre est requis');
      return;
    }
    
    if (!formData.cloudflareVideoId.trim()) {
      toast.error('L\'ID Cloudflare est requis');
      return;
    }
    
    if (formData.chapterNumber < 1 || formData.chapterNumber > 10) {
      toast.error('Le numéro de chapitre doit être entre 1 et 10');
      return;
    }
    
    setLoading(true);
    
    try {
      console.log('📤 [ADMIN TAJWID] Envoi des données vidéo:', formData);
      
      const response = await fetch('/api/videos-tajwid', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chapterNumber: formData.chapterNumber,
          title: formData.title.trim(),
          cloudflareVideoId: formData.cloudflareVideoId.trim(),
          thumbnailUrl: formData.thumbnailUrl.trim() || undefined,
          duration: formData.duration || undefined,
        }),
      });
      
      console.log('📡 [ADMIN TAJWID] Réponse API:', response.status);
      
      const result = await response.json();
      console.log('📊 [ADMIN TAJWID] Données de réponse:', result);
      
      if (response.ok) {
        toast.success(editingVideo ? 'Vidéo modifiée avec succès !' : 'Vidéo ajoutée avec succès !');
        setShowForm(false);
        resetForm();
        await loadVideos();
      } else {
        toast.error(result.error || 'Erreur lors de la sauvegarde');
      }
    } catch (error) {
      console.error('Error saving Tajwid video:', error);
      toast.error('Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (video: TajwidChapterVideo) => {
    setEditingVideo(video);
    setFormData({
      chapterNumber: video.chapterNumber,
      title: video.title,
      cloudflareVideoId: video.cloudflareVideoId,
      thumbnailUrl: video.thumbnailUrl || '',
      duration: video.duration || 0,
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      chapterNumber: 1,
      title: '',
      cloudflareVideoId: '',
      thumbnailUrl: '',
      duration: 0,
    });
    setEditingVideo(null);
  };

  const handleDelete = async (chapterNumber: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette vidéo ?')) return;
    
    try {
      const response = await fetch(`/api/videos-tajwid/${chapterNumber}`, {
        method: 'DELETE',
      });
      
      const result = await response.json();
      
      if (response.ok) {
        toast.success('Vidéo supprimée avec succès !');
        await loadVideos();
      } else {
        toast.error(result.error || 'Erreur lors de la suppression');
      }
    } catch (error) {
      console.error('Error deleting Tajwid video:', error);
      toast.error('Erreur de connexion');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-900 text-white p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-400 mx-auto mb-6"></div>
          <p className="text-lg">Chargement des vidéos Tajwid...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Gestion des Vidéos Tajwid</h1>
            <p className="text-zinc-400 mt-1">Gérez les vidéos d&apos;introduction pour chaque chapitre Tajwid</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus size={20} />
            Ajouter une vidéo
          </button>
        </div>

        {/* Formulaire */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-zinc-800 rounded-xl p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">
                  {editingVideo ? 'Modifier la vidéo' : 'Ajouter une vidéo'}
                </h2>
                <button onClick={() => { resetForm(); setShowForm(false); }} className="text-zinc-400 hover:text-white">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Numéro de chapitre Tajwid</label>
                  <input
                    type="number"
                    value={formData.chapterNumber}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      setFormData(prev => ({ ...prev, chapterNumber: isNaN(val) ? 1 : val }));
                    }}
                    className="w-full bg-zinc-700 border border-zinc-600 rounded-lg px-3 py-2 text-white"
                    required
                    min={1}
                    max={10}
                  />
                  <p className="text-xs text-zinc-400 mt-1">Chapitres Tajwid: 1 à 10</p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Titre de la vidéo</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full bg-zinc-700 border border-zinc-600 rounded-lg px-3 py-2 text-white"
                    required
                    placeholder="Ex: Introduction au Tajwid - Chapitre 1"
                    maxLength={200}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">ID Vidéo Cloudflare</label>
                  <input
                    type="text"
                    value={formData.cloudflareVideoId}
                    onChange={(e) => setFormData(prev => ({ ...prev, cloudflareVideoId: e.target.value }))}
                    className="w-full bg-zinc-700 border border-zinc-600 rounded-lg px-3 py-2 text-white"
                    required
                    placeholder="Ex: abc123def456"
                    maxLength={100}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">URL Miniature (optionnel)</label>
                  <input
                    type="url"
                    value={formData.thumbnailUrl}
                    onChange={(e) => setFormData(prev => ({ ...prev, thumbnailUrl: e.target.value }))}
                    className="w-full bg-zinc-700 border border-zinc-600 rounded-lg px-3 py-2 text-white"
                    placeholder="https://..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Durée (secondes)</label>
                  <input
                    type="number"
                    value={formData.duration || ''}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      setFormData(prev => ({ ...prev, duration: isNaN(val) ? 0 : val }));
                    }}
                    className="w-full bg-zinc-700 border border-zinc-600 rounded-lg px-3 py-2 text-white"
                    min={0}
                    max={7200}
                    placeholder="Ex: 300 (5 minutes)"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => { resetForm(); setShowForm(false); }}
                    className="flex-1 bg-zinc-600 hover:bg-zinc-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                        Sauvegarde...
                      </>
                    ) : (
                      <>
                        <Save size={16} />
                        {editingVideo ? 'Modifier' : 'Ajouter'}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Liste des vidéos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <div key={video.id} className="bg-zinc-800 border border-zinc-700 rounded-xl p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">Chapitre Tajwid {video.chapterNumber}</h3>
                  <p className="text-zinc-300 text-sm">{video.title}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(video)}
                    className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(video.chapterNumber)}
                    className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="space-y-2 text-sm text-zinc-400">
                <div>
                  <span className="font-medium">ID Cloudflare:</span>
                  <div className="font-mono text-xs bg-zinc-700 p-1 rounded mt-1 break-all">{video.cloudflareVideoId}</div>
                </div>
                
                {video.duration && (
                  <div>
                    <span className="font-medium">Durée:</span> {Math.floor(video.duration / 60)}:{(video.duration % 60).toString().padStart(2, '0')}
                  </div>
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-zinc-700">
                <a
                  href={`/chapitres-tajwid/${video.chapterNumber}/video`}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
                >
                  <Play size={16} />
                  Voir la vidéo
                </a>
              </div>
            </div>
          ))}
        </div>

        {videos.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎬</div>
            <h3 className="text-xl font-semibold text-white mb-2">Aucune vidéo Tajwid configurée</h3>
            <p className="text-zinc-400 mb-6">Commencez par ajouter des vidéos pour vos chapitres Tajwid.</p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              Ajouter la première vidéo
            </button>
          </div>
        )}
        
        {/* Debug info en développement */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-8 bg-zinc-800 border border-zinc-700 rounded-lg p-4">
            <h4 className="text-white font-semibold mb-2">Debug Info</h4>
            <pre className="text-zinc-300 text-xs overflow-auto">
              {JSON.stringify({ 
                videosCount: videos.length, 
                isLoading, 
                formData,
                editingVideo: editingVideo?.id 
              }, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
