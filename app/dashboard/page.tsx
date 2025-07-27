'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  BookOpen, 
  Play, 
  Award, 
  Download, 
  MessageCircle, 
  TrendingUp,
  Clock,
  Target,
  Star,
  ChevronRight,
  User,
  LogOut,
  Settings,
  ChevronDown,
  Edit3
} from 'lucide-react';
import { useUserProgress } from '@/hooks/useUserProgress';
import { chapters } from '@/lib/chapters';

interface User {
  id: string;
  email: string;
  username: string | null;
  isActive: boolean;
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [editForm, setEditForm] = useState({
    username: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [editLoading, setEditLoading] = useState(false);
  const router = useRouter();

  const {
    completedPages,
    completedQuizzes,
    isLoading: progressLoading,
  } = useUserProgress();

  // Calculer la progression
  const calculateProgress = () => {
    const totalPages = chapters.reduce((total, ch) => total + ch.pages.length, 0);
    const totalQuizzes = chapters.filter(ch => ch.quiz && ch.quiz.length > 0).length;
    const totalItems = totalPages + totalQuizzes;
    const completedItems = completedPages.size + completedQuizzes.size;
    return totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
  };

  const progressPercentage = calculateProgress();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
          setEditForm(prev => ({ ...prev, username: userData.username || '' }));
        } else {
          window.location.replace('/checkout');
        }
      } catch (error) {
        console.error('Auth check error:', error);
        window.location.replace('/checkout');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Fermer le menu quand on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.profile-menu')) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleEditProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editForm.newPassword && editForm.newPassword !== editForm.confirmPassword) {
      alert('Les mots de passe ne correspondent pas');
      return;
    }

    if (editForm.newPassword && editForm.newPassword.length < 8) {
      alert('Le mot de passe doit contenir au moins 8 caractères');
      return;
    }

    setEditLoading(true);

    try {
      const updateData: any = {};
      
      if (editForm.username !== user?.username) {
        updateData.username = editForm.username;
      }
      
      if (editForm.newPassword) {
        updateData.password = editForm.newPassword;
      }

      const response = await fetch('/api/auth/complete-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setUser(prev => prev ? { ...prev, username: data.user.username } : null);
        setShowEditProfile(false);
        setEditForm(prev => ({ 
          ...prev, 
          currentPassword: '', 
          newPassword: '', 
          confirmPassword: '' 
        }));
        alert('Profil mis à jour avec succès !');
      } else {
        alert(data.error || 'Erreur lors de la mise à jour');
      }
    } catch (error) {
      console.error('Update profile error:', error);
      alert('Erreur de connexion');
    } finally {
      setEditLoading(false);
    }
  };
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-400 mx-auto mb-6"></div>
          <p className="text-white text-lg font-medium">Chargement de votre espace...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header moderne */}
      <header className="bg-black/20 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center py-4 sm:py-6">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-3 rounded-xl">
                <BookOpen className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-white truncate">
                  Méthode "Son Importance"
                </h1>
                <p className="text-purple-200 text-xs sm:text-sm hidden sm:block">Votre parcours d'apprentissage</p>
              </div>
            </div>
            
            {/* Menu Profil */}
            <div className="relative profile-menu">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center space-x-2 sm:space-x-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 hover:border-white/30 px-2 sm:px-4 py-2 sm:py-3 rounded-xl sm:rounded-2xl transition-all duration-300 group"
              >
                <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-2 rounded-xl">
                  <User className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                </div>
                <div className="text-left hidden sm:block">
                  <p className="text-white font-semibold text-xs sm:text-sm">
                    {user.username || user.email}
                  </p>
                  <p className="text-purple-200 text-xs hidden lg:block">Étudiant actif</p>
                </div>
                <ChevronDown className={`h-3 w-3 sm:h-4 sm:w-4 text-purple-200 transition-transform duration-200 ${showProfileMenu ? 'rotate-180' : ''} hidden sm:block`} />
              </button>

              {/* Dropdown Menu */}
              {showProfileMenu && (
                <div className="absolute right-0 top-full mt-2 w-56 sm:w-64 bg-slate-800/95 backdrop-blur-xl border border-white/10 rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden z-50">
                  <div className="p-4 border-b border-white/10">
                    <div className="flex items-center space-x-3">
                      <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-2 rounded-xl">
                        <User className="h-5 w-5 text-white" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-white font-semibold truncate">
                          {user.username || 'Utilisateur'}
                        </p>
                        <p className="text-slate-300 text-sm truncate">{user.email}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-2">
                    <button
                      onClick={() => {
                        setShowEditProfile(true);
                        setShowProfileMenu(false);
                      }}
                      className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-white/10 rounded-xl transition-colors duration-200 group"
                    >
                      <div className="bg-blue-500/20 p-2 rounded-lg group-hover:bg-blue-500/30 transition-colors">
                        <Edit3 className="h-4 w-4 text-blue-400" />
                      </div>
                      <div>
                        <p className="text-white font-medium">Modifier le profil</p>
                        <p className="text-slate-400 text-xs hidden sm:block">Pseudo et mot de passe</p>
                      </div>
                    </button>
                    
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-red-500/10 rounded-xl transition-colors duration-200 group"
                    >
                      <div className="bg-red-500/20 p-2 rounded-lg group-hover:bg-red-500/30 transition-colors">
                        <LogOut className="h-4 w-4 text-red-400" />
                      </div>
                      <div>
                        <p className="text-white font-medium">Se déconnecter</p>
                        <p className="text-slate-400 text-xs hidden sm:block">Fermer la session</p>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Modal Édition Profil */}
      {showEditProfile && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800/95 backdrop-blur-xl border border-white/10 rounded-2xl sm:rounded-3xl p-6 sm:p-8 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl sm:text-2xl font-bold text-white">Modifier le profil</h3>
              <button
                onClick={() => setShowEditProfile(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleEditProfile} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Pseudo
                </label>
                <input
                  type="text"
                  value={editForm.username}
                  onChange={(e) => setEditForm(prev => ({ ...prev, username: e.target.value }))}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="Votre pseudo"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Nouveau mot de passe (optionnel)
                </label>
                <input
                  type="password"
                  value={editForm.newPassword}
                  onChange={(e) => setEditForm(prev => ({ ...prev, newPassword: e.target.value }))}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="Nouveau mot de passe"
                />
              </div>
              
              {editForm.newPassword && (
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Confirmer le mot de passe
                  </label>
                  <input
                    type="password"
                    value={editForm.confirmPassword}
                    onChange={(e) => setEditForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    placeholder="Confirmer le mot de passe"
                  />
                </div>
              )}
              
              <div className="flex space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowEditProfile(false)}
                  className="flex-1 bg-white/10 hover:bg-white/20 text-white font-medium px-4 sm:px-6 py-3 rounded-xl transition-all duration-200 border border-white/20 text-sm sm:text-base"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={editLoading}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold px-4 sm:px-6 py-3 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                >
                  {editLoading ? 'Mise à jour...' : 'Sauvegarder'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Contenu principal */}
      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        {/* Section de bienvenue */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-purple-500/20 text-purple-300 px-4 py-2 rounded-full mb-6 border border-purple-500/30">
            <Star className="h-4 w-4" />
            <span className="text-sm font-medium">Accès Premium Activé</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
            Bienvenue dans votre
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent block">
              espace d'apprentissage
            </span>
          </h2>
          
          <p className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed px-4">
            Félicitations ! Vous avez maintenant accès à la méthode complète pour apprendre 
            à lire et écrire l'arabe en seulement 1 mois. Votre voyage commence ici.
          </p>
        </div>

        {/* Statistiques rapides */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center">
            <div className="bg-green-500/20 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Target className="h-6 w-6 text-green-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">
              {progressLoading ? '...' : `${progressPercentage}%`}
            </h3>
            <p className="text-slate-400 text-sm">Progression</p>
          </div>
          
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center">
            <div className="bg-blue-500/20 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Clock className="h-6 w-6 text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">30j</h3>
            <p className="text-slate-400 text-sm">Durée totale</p>
          </div>
          
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center">
            <div className="bg-purple-500/20 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4">
              <BookOpen className="h-6 w-6 text-purple-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">11</h3>
            <p className="text-slate-400 text-sm">Chapitres</p>
          </div>
          
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center">
            <div className="bg-yellow-500/20 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Award className="h-6 w-6 text-yellow-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">
              {progressLoading ? '...' : completedQuizzes.size}
            </h3>
            <p className="text-slate-400 text-sm">Quiz réussis</p>
          </div>
        </div>

        {/* Actions principales */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Commencer le cours */}
          <div className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 backdrop-blur-xl border border-purple-500/30 rounded-3xl p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="relative z-10">
              <div className="bg-purple-500/30 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                <Play className="h-8 w-8 text-purple-300" />
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-4">
                Commencer le cours
              </h3>
              
              <p className="text-slate-300 mb-8 leading-relaxed">
                Accédez à tous les chapitres de la méthode, des bases jusqu'à la lecture complète. 
                Votre parcours personnalisé vous attend.
              </p>
              
              <button
                onClick={() => {
                  localStorage.setItem('courseStarted', 'true');
                  window.location.href = '/chapitres/0/introduction';
                }}
                className="group bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold px-8 py-4 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl flex items-center space-x-3"
              >
                <span>Commencer maintenant</span>
                <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Continuer le cours */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="relative z-10">
              <div className="bg-blue-500/30 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                <TrendingUp className="h-8 w-8 text-blue-300" />
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-4">
                Continuer le cours
              </h3>
              
              <p className="text-slate-300 mb-8 leading-relaxed">
                Reprenez là où vous vous êtes arrêté dans votre apprentissage. 
                Votre progression est automatiquement sauvegardée.
              </p>
              
              <Link
                href="/chapitres/0/introduction"
                onClick={() => localStorage.setItem('courseStarted', 'true')}
                className="group inline-flex items-center space-x-3 bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-4 rounded-2xl transition-all duration-300 border border-white/20 hover:border-white/30"
              >
                <span>Accéder au cours</span>
                <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>

        {/* Ressources et support */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Progression détaillée */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-green-500/20 w-10 h-10 rounded-xl flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-white">Votre progression</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-300">Progression globale</span>
                  <span className="text-green-400 font-medium">
                    {progressLoading ? '...' : `${progressPercentage}%`}
                  </span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-green-400 to-blue-400 h-2 rounded-full transition-all duration-500" 
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="pt-4 border-t border-white/10">
                {progressPercentage === 0 ? (
                  <p className="text-slate-400 text-sm">
                    Commencez votre première leçon pour voir votre progression s'afficher ici.
                  </p>
                ) : (
                  <div className="text-slate-400 text-sm space-y-1">
                    <p>📚 {completedPages.size} leçons terminées</p>
                    <p>🏆 {completedQuizzes.size} quiz réussis</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Ressources */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-orange-500/20 w-10 h-10 rounded-xl flex items-center justify-center">
                <Download className="h-5 w-5 text-orange-400" />
              </div>
              <h3 className="text-xl font-semibold text-white">Ressources</h3>
            </div>
            
            <p className="text-slate-300 mb-6 text-sm leading-relaxed">
              Téléchargez les supports PDF et accédez aux exercices d'écriture pour compléter votre apprentissage.
            </p>
            
            <button className="w-full bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 hover:text-orange-200 font-medium px-4 py-3 rounded-xl transition-all duration-200 border border-orange-500/30">
              Voir les ressources
            </button>
          </div>

          {/* Support */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-pink-500/20 w-10 h-10 rounded-xl flex items-center justify-center">
                <MessageCircle className="h-5 w-5 text-pink-400" />
              </div>
              <h3 className="text-xl font-semibold text-white">Support</h3>
            </div>
            
            <p className="text-slate-300 mb-6 text-sm leading-relaxed">
              Besoin d'aide ? Notre équipe pédagogique est là pour vous accompagner dans votre apprentissage.
            </p>
            
            <button className="w-full bg-pink-500/20 hover:bg-pink-500/30 text-pink-300 hover:text-pink-200 font-medium px-4 py-3 rounded-xl transition-all duration-200 border border-pink-500/30">
              Contacter le support
            </button>
          </div>
        </div>

        {/* Conseil motivationnel */}
        <div className="mt-12 bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-xl border border-blue-500/20 rounded-2xl p-8 text-center">
          <div className="bg-blue-500/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Star className="h-8 w-8 text-blue-400" />
          </div>
          
          <h3 className="text-2xl font-bold text-white mb-4">
            Conseil pour réussir
          </h3>
          
          <p className="text-slate-300 text-lg leading-relaxed max-w-2xl mx-auto">
            Pour de meilleurs résultats, consacrez <span className="text-blue-400 font-semibold">30 minutes par jour</span> à votre apprentissage. 
            La régularité est la clé du succès ! Votre détermination d'aujourd\'hui sera votre fierté de demain.
          </p>
        </div>
      </main>
    </div>
  );
}