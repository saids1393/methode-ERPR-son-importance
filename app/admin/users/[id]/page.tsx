'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { use } from 'react';
import Link from 'next/link';
import {
  User,
  Mail,
  Calendar,
  Clock,
  Award,
  BookOpen,
  TrendingUp,
  DollarSign,
  CheckCircle,
  XCircle,
  ArrowLeft,
  Edit,
  Save,
  X
} from 'lucide-react';

interface UserDetail {
  gender: any;
  id: string;
  email: string;
  username: string | null;
  isActive: boolean;
  stripeCustomerId: string | null;
  stripeSessionId: string | null;
  completedPages: number[];
  completedQuizzes: number[];
  completedPagesCount: number;
  completedQuizzesCount: number;
  progressPercentage: number;
  isPaid: boolean;
  studyTimeFormatted: string;
  studyTimeSeconds: number;
  createdAt: string;
  updatedAt: string;
}

interface UserDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function UserDetailPage({ params }: UserDetailPageProps) {
  const resolvedParams = use(params);
  const [user, setUser] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    username: '',
    isActive: true
  });
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`/api/admin/user/${resolvedParams.id}`);
        if (response.status === 403) {
          router.push('/dashboard');
          return;
        }
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
          setEditForm({
            username: userData.username || '',
            isActive: userData.isActive
          });
        } else if (response.status === 404) {
          setError('Utilisateur non trouvé');
        } else {
          setError('Erreur lors du chargement');
        }
      } catch (err) {
        setError('Erreur de connexion');
        console.error('Error fetching user:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [resolvedParams.id, router]);

  const handleSave = async () => {
    try {
      const response = await fetch(`/api/admin/user/${resolvedParams.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm)
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUser(prev => prev ? { ...prev, ...updatedUser } : null);
        setEditing(false);
        alert('Utilisateur mis à jour avec succès');
      } else {
        alert('Erreur lors de la mise à jour');
      }
    } catch (err) {
      alert('Erreur de connexion');
      console.error('Error updating user:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-900 text-white p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-400 mx-auto mb-6"></div>
          <p className="text-lg">Chargement des détails utilisateur...</p>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-zinc-900 text-white p-8">
        <div className="text-center">
          <div className="text-red-400 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold mb-4">Erreur</h1>
          <p className="text-zinc-400 mb-6">{error}</p>
          <Link
            href="/admin/users"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Retour à la liste
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
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Link
                href="/admin/users"
                className="bg-zinc-700 hover:bg-zinc-600 text-white p-2 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
              
              <div>
                <h1 className="text-3xl font-bold flex items-center gap-3">
                  <div className="bg-blue-600 p-2 rounded-lg">
                    <User className="h-8 w-8" />
                  </div>
                  Détails Utilisateur
                </h1>
                <p className="text-zinc-400 mt-2">{user.email}</p>
              </div>
            </div>
            
            <div className="flex gap-2">
              {editing ? (
                <>
                  <button
                    onClick={() => setEditing(false)}
                    className="bg-zinc-600 hover:bg-zinc-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                  >
                    <X size={20} />
                    Annuler
                  </button>
                  <button
                    onClick={handleSave}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                  >
                    <Save size={20} />
                    Sauvegarder
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setEditing(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <Edit size={20} />
                  Modifier
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Informations principales */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profil */}
            <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-6">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <User className="h-6 w-6 text-blue-400" />
                Informations du Profil
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">Email</label>
                  <div className="bg-zinc-700 border border-zinc-600 rounded-lg px-4 py-3 text-white">
                    {user.email}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">Pseudo</label>
                  {editing ? (
                    <input
                      type="text"
                      value={editForm.username}
                      onChange={(e) => setEditForm(prev => ({ ...prev, username: e.target.value }))}
                      className="w-full bg-zinc-700 border border-zinc-600 rounded-lg px-4 py-3 text-white"
                      placeholder="Aucun pseudo"
                    />
                  ) : (
                    <div className="bg-zinc-700 border border-zinc-600 rounded-lg px-4 py-3 text-white">
                      {user.username || 'Aucun pseudo'}
                    </div>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">Genre</label>
                  <div className="bg-zinc-700 border border-zinc-600 rounded-lg px-4 py-3 text-white flex items-center gap-2">
                    {user.gender ? (
                      <>
                        <span>{user.gender === 'HOMME' ? '👨' : '👩'}</span>
                        <span>{user.gender}</span>
                      </>
                    ) : (
                      <span className="text-zinc-400">Non spécifié</span>
                    )}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">Statut du compte</label>
                  {editing ? (
                    <select
                      value={editForm.isActive ? 'active' : 'inactive'}
                      onChange={(e) => setEditForm(prev => ({ ...prev, isActive: e.target.value === 'active' }))}
                      className="w-full bg-zinc-700 border border-zinc-600 rounded-lg px-4 py-3 text-white"
                    >
                      <option value="active">Actif</option>
                      <option value="inactive">Inactif</option>
                    </select>
                  ) : (
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
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">Type de compte</label>
                  <div className="flex items-center gap-2">
                    {user.isPaid ? (
                      <>
                        <DollarSign className="h-5 w-5 text-green-400" />
                        <span className="text-green-400">Payant</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="h-5 w-5 text-zinc-400" />
                        <span className="text-zinc-400">Gratuit</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Progression détaillée */}
            <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-6">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <TrendingUp className="h-6 w-6 text-green-400" />
                Progression Détaillée
              </h3>
              
              <div className="space-y-6">
                {/* Barre de progression globale */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-zinc-300">Progression globale</span>
                    <span className="text-green-400 font-bold text-lg">
                      {user.progressPercentage}%
                    </span>
                  </div>
                  <div className="w-full bg-zinc-600 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-green-400 to-blue-400 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${user.progressPercentage}%` }}
                    ></div>
                  </div>
                </div>

                {/* Détails par type */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-zinc-700 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <BookOpen className="h-5 w-5 text-blue-400" />
                      <span className="font-semibold text-white">Pages complétées</span>
                    </div>
                    <div className="text-2xl font-bold text-white">
                      {user.completedPagesCount}/29
                    </div>
                    <div className="text-sm text-zinc-400">
                      {Math.round((user.completedPagesCount / 29) * 100)}% des leçons
                    </div>
                  </div>
                  
                  <div className="bg-zinc-700 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Award className="h-5 w-5 text-yellow-400" />
                      <span className="font-semibold text-white">Quiz complétés</span>
                    </div>
                    <div className="text-2xl font-bold text-white">
                      {user.completedQuizzesCount}/11
                    </div>
                    <div className="text-sm text-zinc-400">
                      {Math.round((user.completedQuizzesCount / 11) * 100)}% des quiz
                    </div>
                  </div>
                </div>

                {/* Pages complétées en détail */}
                <div>
                  <h4 className="font-semibold text-white mb-3">Pages complétées :</h4>
                  <div className="flex flex-wrap gap-2">
                    {user.completedPages.filter(p => p !== 0 && p !== 30).map(pageNum => (
                      <span
                        key={pageNum}
                        className="bg-green-900/30 text-green-400 px-2 py-1 rounded text-sm"
                      >
                        Page {pageNum}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Quiz complétés en détail */}
                <div>
                  <h4 className="font-semibold text-white mb-3">Quiz complétés :</h4>
                  <div className="flex flex-wrap gap-2">
                    {user.completedQuizzes.filter(q => q !== 11).map(quizNum => (
                      <span
                        key={quizNum}
                        className="bg-yellow-900/30 text-yellow-400 px-2 py-1 rounded text-sm"
                      >
                        Chapitre {quizNum}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar avec statistiques */}
          <div className="space-y-6">
            {/* Temps d'étude */}
            <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-6">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-400" />
                Temps d'étude
              </h3>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">
                  {user.studyTimeFormatted}
                </div>
                <div className="text-sm text-zinc-400">
                  {user.studyTimeSeconds} secondes au total
                </div>
              </div>
            </div>

            {/* Informations système */}
            <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-6">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-purple-400" />
                Informations système
              </h3>
              
              <div className="space-y-3">
                <div>
                  <div className="text-sm text-zinc-400">Inscription</div>
                  <div className="text-white">
                    {new Date(user.createdAt).toLocaleDateString('fr-FR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
                
                <div>
                  <div className="text-sm text-zinc-400">Dernière activité</div>
                  <div className="text-white">
                    {new Date(user.updatedAt).toLocaleDateString('fr-FR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
                
                {user.stripeCustomerId && (
                  <div>
                    <div className="text-sm text-zinc-400">ID Client Stripe</div>
                    <div className="text-white font-mono text-xs break-all">
                      {user.stripeCustomerId}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Actions rapides */}
            <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-6">
              <h3 className="text-lg font-bold mb-4">Actions rapides</h3>
              
              <div className="space-y-3">
                <button
                  onClick={() => navigator.clipboard.writeText(user.email)}
                  className="w-full bg-zinc-700 hover:bg-zinc-600 text-white px-4 py-2 rounded-lg transition-colors text-left"
                >
                  📋 Copier l'email
                </button>
                
                <button
                  onClick={() => navigator.clipboard.writeText(user.id)}
                  className="w-full bg-zinc-700 hover:bg-zinc-600 text-white px-4 py-2 rounded-lg transition-colors text-left"
                >
                  🆔 Copier l'ID utilisateur
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}