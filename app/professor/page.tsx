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
  Edit3,
  BarChart3,
  Users,
  Calendar,
  Video
} from 'lucide-react';
import toast from 'react-hot-toast';

interface Professor {
  id: string;
  email: string;
  name: string;
  gender: 'HOMME' | 'FEMME';
  zoomMeetingId?: string;
  zoomPassword?: string;
  isActive: boolean;
}

export default function ProfessorDashboard() {
  const [professor, setProfessor] = useState<Professor | null>(null);
  const [loading, setLoading] = useState(true);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    zoomMeetingId: '',
    zoomPassword: '',
    password: ''
  });
  const [editLoading, setEditLoading] = useState(false);
  const router = useRouter();

  // Personnalisation selon le genre (même logique que l'espace élève)
  const getGenderConfig = () => {
    if (professor?.gender === 'FEMME') {
      return {
        primaryColor: 'from-purple-500 to-pink-500',
        primaryColorHover: 'from-purple-600 to-pink-600',
        primaryBg: 'bg-purple-500',
        primaryBgHover: 'bg-purple-600',
        primaryText: 'text-purple-400',
        primaryBorder: 'border-purple-500/30',
        primaryGlow: 'bg-purple-500/20',
        primaryGlowHover: 'bg-purple-500/30',
        gradientBg: 'from-slate-900 via-purple-900 to-slate-900',
        accentColor: 'from-purple-400 to-pink-400',
        welcomeText: professor.name ? `Bienvenue ${professor.name}` : 'Bienvenue',
        profileText: 'Professeure connectée',
        agreementText: 'connectée',
        studentText: 'professeure'
      };
    } else {
      return {
        primaryColor: 'from-blue-500 to-cyan-500',
        primaryColorHover: 'from-blue-600 to-cyan-600',
        primaryBg: 'bg-blue-500',
        primaryBgHover: 'bg-blue-600',
        primaryText: 'text-blue-400',
        primaryBorder: 'border-blue-500/30',
        primaryGlow: 'bg-blue-500/20',
        primaryGlowHover: 'bg-blue-500/30',
        gradientBg: 'from-slate-900 via-blue-900 to-slate-900',
        accentColor: 'from-blue-400 to-cyan-400',
        welcomeText: professor?.name ? `Bienvenue ${professor.name}` : 'Bienvenue',
        profileText: 'Professeur connecté',
        agreementText: 'connecté',
        studentText: 'professeur'
      };
    }
  };

  const genderConfig = getGenderConfig();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/professor/me');
        if (response.ok) {
          const professorData = await response.json();
          setProfessor(professorData);
          setEditForm(prev => ({ 
            ...prev, 
            name: professorData.name || '',
            zoomMeetingId: professorData.zoomMeetingId || '',
            zoomPassword: professorData.zoomPassword || ''
          }));
        } else {
          router.push('/professor/auth');
        }
      } catch (error) {
        console.error('Auth check error:', error);
        router.push('/professor/auth');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

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
      await fetch('/api/professor/logout', { method: 'POST' });
      router.push('/professor/auth');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleEditProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditLoading(true);

    try {
      const updateData: any = {};
      
      if (editForm.name !== professor?.name) {
        updateData.name = editForm.name;
      }
      
      if (editForm.zoomMeetingId !== professor?.zoomMeetingId) {
        updateData.zoomMeetingId = editForm.zoomMeetingId;
      }
      
      if (editForm.zoomPassword !== professor?.zoomPassword) {
        updateData.zoomPassword = editForm.zoomPassword;
      }
      
      if (editForm.password) {
        updateData.password = editForm.password;
      }

      const response = await fetch('/api/professor/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setProfessor(data.professor);
        setShowEditProfile(false);
        setEditForm(prev => ({ ...prev, password: '' }));
        toast.success('Profil mis à jour avec succès !');
      } else {
        toast.error(data.error || 'Erreur lors de la mise à jour');
      }
    } catch (error) {
      console.error('Update profile error:', error);
      toast.error('Erreur de connexion');
    } finally {
      setEditLoading(false);
    }
  };

  // Fonction pour créer un token temporaire professeur pour accéder au cours
  const handleAccessCourse = async () => {
    console.log('👨‍🏫 ===== CLIC BOUTON PROFESSEUR - ACCÈS COURS =====');
    
    try {
      // Créer un token temporaire pour le professeur pour accéder au cours
      const response = await fetch('/api/professor/course-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      console.log('🚀 RÉPONSE PROFESSOR COURSE ACCESS:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          console.log('✅ TOKEN PROFESSEUR CRÉÉ - REDIRECTION');
          // Rediriger dans le même onglet avec le token professeur
          window.location.href = '/chapitres/0/introduction';
        } else {
          console.log('❌ ERREUR TOKEN - REDIRECTION DIRECTE');
          toast.error('Erreur lors de l\'accès au cours');
          window.location.href = '/chapitres/0/introduction';
        }
      } else {
        // Fallback : ouvrir directement
        console.log('❌ ERREUR RÉPONSE - REDIRECTION DIRECTE');
        window.location.href = '/chapitres/0/introduction';
      }
    } catch (error) {
      console.error('❌ ERREUR PROFESSOR COURSE ACCESS:', error);
      // Fallback : ouvrir directement
      window.location.href = '/chapitres/0/introduction';
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen bg-gradient-to-br ${genderConfig.gradientBg} flex items-center justify-center`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-400 mx-auto mb-6"></div>
          <p className="text-white text-lg font-medium">Chargement de votre espace professeur...</p>
        </div>
      </div>
    );
  }

  if (!professor) {
    return null;
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${genderConfig.gradientBg}`}>
      {/* Header moderne */}
      <header className="bg-black/20 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center py-4 sm:py-6">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className={`bg-gradient-to-r ${genderConfig.primaryColor} p-3 rounded-xl`}>
                <BookOpen className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-white truncate">
                  Espace Professeur
                </h1>
                <p className={`${genderConfig.primaryText.replace('400', '200')} text-xs sm:text-sm hidden sm:block`}>Méthode ERPR - Accompagnement</p>
              </div>
            </div>
            
            {/* Menu Profil */}
            <div className="relative profile-menu">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className={`flex items-center space-x-2 sm:space-x-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 hover:border-purple-500/30 px-2 sm:px-4 py-2 sm:py-3 rounded-xl sm:rounded-2xl transition-all duration-300 group`}
              >
                <div className={`bg-gradient-to-r ${genderConfig.primaryColor} p-2 rounded-xl`}>
                  <User className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                </div>
                <div className="text-left hidden sm:block">
                  <p className="text-white font-semibold text-xs sm:text-sm">
                    {professor.name}
                  </p>
                  <p className="text-purple-200 text-xs hidden lg:block">{genderConfig.profileText}</p>
                </div>
                <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4 text-purple-200 transition-transform duration-200 rotate-180 hidden sm:block" />
              </button>

              {/* Dropdown Menu */}
              {showProfileMenu && (
                <div className="absolute right-0 top-full mt-2 w-56 sm:w-64 bg-slate-800/95 backdrop-blur-xl border border-white/10 rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden z-50">
                  <div className="p-4 border-b border-white/10">
                    <div className="flex items-center space-x-3">
                      <div className={`bg-gradient-to-r ${genderConfig.primaryColor} p-2 rounded-xl`}>
                        <User className="h-5 w-5 text-white" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-white font-semibold truncate">
                          {professor.name}
                        </p>
                        <p className="text-slate-300 text-sm truncate">{professor.email}</p>
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
                      <div className={`${genderConfig.primaryGlow} group-hover:${genderConfig.primaryGlowHover} p-2 rounded-lg transition-colors`}>
                        <Edit3 className={`h-4 w-4 ${genderConfig.primaryText}`} />
                      </div>
                      <div>
                        <p className="text-white font-medium">Modifier le profil</p>
                        <p className="text-slate-400 text-xs hidden sm:block">Nom, Zoom ou mot de passe</p>
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
                  Nom
                </label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                  className={`w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 ${professor?.gender === 'FEMME' ? 'focus:ring-purple-500' : 'focus:ring-blue-500'} focus:border-transparent transition-all`}
                  placeholder="Votre nom"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  ID de réunion Zoom
                </label>
                <input
                  type="text"
                  value={editForm.zoomMeetingId}
                  onChange={(e) => setEditForm(prev => ({ ...prev, zoomMeetingId: e.target.value }))}
                  className={`w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 ${professor?.gender === 'FEMME' ? 'focus:ring-purple-500' : 'focus:ring-blue-500'} focus:border-transparent transition-all`}
                  placeholder="Ex: 123456789"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Mot de passe Zoom
                </label>
                <input
                  type="text"
                  value={editForm.zoomPassword}
                  onChange={(e) => setEditForm(prev => ({ ...prev, zoomPassword: e.target.value }))}
                  className={`w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 ${professor?.gender === 'FEMME' ? 'focus:ring-purple-500' : 'focus:ring-blue-500'} focus:border-transparent transition-all`}
                  placeholder="Mot de passe de la réunion"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Nouveau mot de passe (optionnel)
                </label>
                <input
                  type="password"
                  value={editForm.password}
                  onChange={(e) => setEditForm(prev => ({ ...prev, password: e.target.value }))}
                  className={`w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 ${professor?.gender === 'FEMME' ? 'focus:ring-purple-500' : 'focus:ring-blue-500'} focus:border-transparent transition-all`}
                  placeholder="Nouveau mot de passe"
                />
              </div>
              
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
                  className={`flex-1 bg-gradient-to-r ${genderConfig.primaryColor} hover:${genderConfig.primaryColorHover} text-white font-semibold px-4 sm:px-6 py-3 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base`}
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
          <div className={`inline-flex items-center space-x-2 ${genderConfig.primaryGlow} px-4 py-2 rounded-full mb-6 border ${genderConfig.primaryBorder}`}>
            <Star className="h-4 w-4" />
            <span className={`text-sm font-medium ${genderConfig.primaryText.replace('400', '300')}`}>Espace Professeur</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
            {genderConfig.welcomeText} dans votre
            <span className={`bg-gradient-to-r ${genderConfig.accentColor} bg-clip-text text-transparent block`}>
              espace d'accompagnement
            </span>
          </h2>
          
          <p className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed px-4">
            Gérez vos disponibilités, suivez vos élèves et organisez vos séances d'accompagnement individuel. 
            Vous avez également accès au contenu pédagogique pour mieux préparer vos séances.
          </p>
        </div>

        {/* Actions principales */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Accéder au contenu pédagogique */}
          <div className={`bg-gradient-to-br ${professor?.gender === 'FEMME' ? 'from-purple-500/20 to-pink-500/20' : 'from-blue-500/20 to-cyan-500/20'} backdrop-blur-xl border ${professor?.gender === 'FEMME' ? 'border-purple-500/30' : 'border-blue-500/30'} rounded-3xl p-8 relative overflow-hidden`}>
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-white/5 to-transparent rounded-full -mr-32 -mt-32"></div>
            
            <div className={`${professor?.gender === 'FEMME' ? 'bg-purple-500/30' : 'bg-blue-500/30'} w-16 h-16 rounded-2xl flex items-center justify-center mb-6`}>
              <BookOpen className={`h-8 w-8 ${professor?.gender === 'FEMME' ? 'text-purple-300' : 'text-blue-300'}`} />
            </div>
            
            <h3 className="text-2xl font-bold text-white mb-4">
              Contenu Pédagogique
            </h3>
            
            <p className="text-slate-300 mb-8 leading-relaxed">
              Consultez le cours complet de la méthode ERPR pour préparer vos séances d'accompagnement et mieux guider vos élèves.
            </p>
            
            <button
              onClick={handleAccessCourse}
              className={`group bg-gradient-to-r ${professor?.gender === 'FEMME' ? 'from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600' : 'from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600'} text-white font-semibold px-8 py-4 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl flex items-center space-x-3`}
            >
              <span>Accéder au contenu</span>
              <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Gérer les accompagnements */}
          <div className={`bg-gradient-to-br ${professor?.gender === 'FEMME' ? 'from-purple-500/20 to-pink-500/20' : 'from-blue-500/20 to-cyan-500/20'} backdrop-blur-xl border ${professor?.gender === 'FEMME' ? 'border-purple-500/30' : 'border-blue-500/30'} rounded-3xl p-8 relative overflow-hidden`}>
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-white/5 to-transparent rounded-full -mr-32 -mt-32"></div>
            
            <div className={`${professor?.gender === 'FEMME' ? 'bg-purple-500/30' : 'bg-blue-500/30'} w-16 h-16 rounded-2xl flex items-center justify-center mb-6`}>
              <Video className={`h-8 w-8 ${professor?.gender === 'FEMME' ? 'text-purple-300' : 'text-blue-300'}`} />
            </div>
            
            <h3 className="text-2xl font-bold text-white mb-4">
              Séances Zoom
            </h3>
            
            <p className="text-slate-300 mb-8 leading-relaxed">
              Organisez et gérez vos séances d'accompagnement individuel avec vos élèves via Zoom.
            </p>
            
            <Link
              href="/professor/sessions"
              className={`group bg-gradient-to-r ${professor?.gender === 'FEMME' ? 'from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600' : 'from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600'} text-white font-semibold px-8 py-4 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl flex items-center space-x-3`}
            >
              <span>Gérer les séances</span>
              <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Ressources et actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Mes disponibilités */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className={`${genderConfig.primaryGlow} w-10 h-10 rounded-xl flex items-center justify-center`}>
                <Calendar className={`h-5 w-5 ${genderConfig.primaryText}`} />
              </div>
              <h3 className="text-xl font-semibold text-white">Mes Disponibilités</h3>
            </div>
            
            <p className="text-slate-300 mb-6 text-sm leading-relaxed">
              Configurez vos créneaux d'accompagnement pour que les élèves puissent réserver.
            </p>
            
            <Link
              href="/professor/availability"
              className={`w-full ${genderConfig.primaryGlow} hover:${genderConfig.primaryGlowHover} ${genderConfig.primaryText} hover:text-white font-medium px-4 py-3 rounded-xl transition-all duration-200 border ${genderConfig.primaryBorder} block text-center`}
            >
              Gérer mes créneaux
            </Link>
          </div>

          {/* Planning */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-green-500/20 w-10 h-10 rounded-xl flex items-center justify-center">
                <Clock className="h-5 w-5 text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-white">Planning</h3>
            </div>
            
            <p className="text-slate-300 mb-6 text-sm leading-relaxed">
              Consultez vos séances programmées et gérez votre emploi du temps.
            </p>
            
            <Link
              href="/professor/planning"
              className="w-full bg-green-500/20 hover:bg-green-500/30 text-green-300 hover:text-green-200 font-medium px-4 py-3 rounded-xl transition-all duration-200 border border-green-500/30 block text-center"
            >
              Voir mon planning
            </Link>
          </div>

          {/* Mes élèves */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-orange-500/20 w-10 h-10 rounded-xl flex items-center justify-center">
                <Users className="h-5 w-5 text-orange-400" />
              </div>
              <h3 className="text-xl font-semibold text-white">Mes Élèves</h3>
            </div>
            
            <p className="text-slate-300 mb-6 text-sm leading-relaxed">
              Suivez la progression de vos élèves et consultez l'historique des séances.
            </p>
            
            <Link
              href="/professor/students"
              className="w-full bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 hover:text-orange-200 font-medium px-4 py-3 rounded-xl transition-all duration-200 border border-orange-500/30 block text-center"
            >
              Voir mes élèves
            </Link>
          </div>
        </div>

    {/* Conseil pour les professeurs */}
        <div className={`mt-12 bg-gradient-to-r ${professor?.gender === 'FEMME' ? 'from-purple-500/10 to-pink-500/10' : 'from-blue-500/10 to-cyan-500/10'} backdrop-blur-xl border ${professor?.gender === 'FEMME' ? 'border-purple-500/20' : 'border-blue-500/20'} rounded-2xl p-8 text-center`}>
          <div className={`${genderConfig.primaryGlow} w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6`}>
            <Star className={`h-8 w-8 ${genderConfig.primaryText}`} />
          </div>
          
          <h3 className="text-2xl font-bold text-white mb-4">
            Conseils pour un accompagnement efficace
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-white/5 rounded-2xl p-6">
              <div className="text-4xl mb-4">🎯</div>
              <h4 className="text-lg font-semibold text-white mb-2">Personnalisation</h4>
              <p className="text-slate-300 text-sm">
                Adaptez votre approche selon le niveau et les difficultés de chaque élève.
              </p>
            </div>
            
            <div className="bg-white/5 rounded-2xl p-6">
              <div className="text-4xl mb-4">⏰</div>
              <h4 className="text-lg font-semibold text-white mb-2">Ponctualité</h4>
              <p className="text-slate-300 text-sm">
                Respectez les horaires de séance pour maintenir la confiance de vos élèves.
              </p>
            </div>
            
            <div className="bg-white/5 rounded-2xl p-6">
              <div className="text-4xl mb-4">💬</div>
              <h4 className="text-lg font-semibold text-white mb-2">Communication</h4>
              <p className="text-slate-300 text-sm">
                Encouragez et motivez vos élèves dans leur parcours d'apprentissage.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}