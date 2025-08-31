'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Play, Save, X } from 'lucide-react';

interface ChapterVideo {
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

export default function AdminVideosPage() {
  const [videos, setVideos] = useState<ChapterVideo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingVideo, setEditingVideo] = useState<ChapterVideo | null>(null);
  const [formData, setFormData] = useState<VideoForm>({
    chapterNumber: 0,
    title: '',
    cloudflareVideoId: '',
    thumbnailUrl: '',
    duration: 0,
  });

  useEffect(() => {
    loadVideos();
  }, []);

  const loadVideos = async () => {
    try {
      const response = await fetch('/api/videos');
      if (response.ok) {
        const data = await response.json();
        setVideos(data);
      }
    } catch (error) {
      console.error('Error loading videos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/videos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await loadVideos();
        resetForm();
        alert('Vidéo sauvegardée avec succès !');
      } else {
        alert('Erreur lors de la sauvegarde');
      }
    } catch (error) {
      console.error('Error saving video:', error);
      alert('Erreur de connexion');
    }
  };

  const handleEdit = (video: ChapterVideo) => {
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

  const handleDelete = async (chapterNumber: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette vidéo ?')) return;

    try {
      const response = await fetch(`/api/videos/${chapterNumber}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await loadVideos();
        alert('Vidéo supprimée avec succès !');
      } else {
        alert('Erreur lors de la suppression');
      }
    } catch (error) {
      console.error('Error deleting video:', error);
      alert('Erreur de connexion');
    }
  };

  const resetForm = () => {
    setFormData({
      chapterNumber: 0,
      title: '',
      cloudflareVideoId: '',
      thumbnailUrl: '',
      duration: 0,
    });
    setEditingVideo(null);
    setShowForm(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-900 text-white p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-400 mx-auto mb-6"></div>
          <p className="text-lg">Chargement des vidéos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Gestion des Vidéos</h1>
          <button
            onClick={() => setShowForm(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
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
                <button onClick={resetForm} className="text-zinc-400 hover:text-white">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Numéro de chapitre</label>
                  <input
                    type="number"
                    value={formData.chapterNumber}
                    onChange={(e) => setFormData(prev => ({ ...prev, chapterNumber: parseInt(e.target.value) }))}
                    className="w-full bg-zinc-700 border border-zinc-600 rounded-lg px-3 py-2 text-white"
                    required
                    min="0"
                    max="11"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Titre de la vidéo</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full bg-zinc-700 border border-zinc-600 rounded-lg px-3 py-2 text-white"
                    required
                    placeholder="Ex: Introduction au chapitre 1"
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
  min="0"
  placeholder="Ex: 300 (5 minutes)"
/>

                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 bg-zinc-600 hover:bg-zinc-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
                  >
                    <Save size={16} />
                    Sauvegarder
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
                  <h3 className="text-lg font-semibold text-white mb-1">
                    Chapitre {video.chapterNumber}
                  </h3>
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
                  <div className="font-mono text-xs bg-zinc-700 p-1 rounded mt-1 break-all">
                    {video.cloudflareVideoId}
                  </div>
                </div>
                
                {video.duration && (
                  <div>
                    <span className="font-medium">Durée:</span> {Math.floor(video.duration / 60)}:{(video.duration % 60).toString().padStart(2, '0')}
                  </div>
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-zinc-700">
                <a
                  href={`/chapitres/${video.chapterNumber}/video`}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
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
            <h3 className="text-xl font-semibold text-white mb-2">
              Aucune vidéo configurée
            </h3>
            <p className="text-zinc-400 mb-6">
              Commencez par ajouter des vidéos pour vos chapitres.
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              Ajouter la première vidéo
            </button>
          </div>
        )}
      </div>
    </div>
  );
}