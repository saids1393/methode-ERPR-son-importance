'use client';

import { useEffect, useState } from 'react';
import {
  Users,
  Clock,
  BookOpen,
  Award,
  Calendar,
  TrendingUp,
  User,
  Search,
  LogOut,
  UserPlus,
  Lock,
  Settings,
  Plus
} from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';

interface StudentSession {
  id: string;
  scheduledAt: string;
  status: string;
  isPast: boolean;
  statusText: string;
  zoomLink?: string;
  notes?: string;
}

interface Student {
  id: string;
  email: string;
  username: string | null;
  gender: 'HOMME' | 'FEMME';
  completedPagesCount: number;
  completedQuizzesCount: number;
  progressPercentage: number;
  studyTimeMinutes: number;
  sessions: StudentSession[];
}

interface Professor {
  id: string;
  email: string;
  name: string;
  gender: 'HOMME' | 'FEMME';
  zoomMeetingId?: string;
  zoomPassword?: string;
  isActive: boolean;
}

interface StudentsData {
  students: Student[];
  totalStudents: number;
}

export default function ProfessorPage() {
  const [professor, setProfessor] = useState<Professor | null>(null);
  const [studentsData, setStudentsData] = useState<StudentsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // États pour les formulaires
  const [showAuthForm, setShowAuthForm] = useState(true);
  const [authMode, setAuthMode] = useState<'login' | 'create'>('login');
  const [authForm, setAuthForm] = useState({
    email: '',
    password: '',
    name: '',
    gender: '' as 'HOMME' | 'FEMME' | '',
    secretCode: ''
  });
  const [authLoading, setAuthLoading] = useState(false);
  const [showProfileSettings, setShowProfileSettings] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: '',
    zoomMeetingId: '',
    zoomPassword: ''
  });
  const [profileLoading, setProfileLoading] = useState(false);

  useEffect(() => {
    checkProfessorAuth();
  }, []);

  const checkProfessorAuth = async () => {
    try {
      const response = await fetch('/api/professor/me');
      if (response.ok) {
        const professorData = await response.json();
        setProfessor(professorData);
        setShowAuthForm(false);
        setProfileForm({
          name: professorData.name || '',
          zoomMeetingId: professorData.zoomMeetingId || '',
          zoomPassword: professorData.zoomPassword || ''
        });
        await fetchStudents();
      } else {
        setShowAuthForm(true);
      }
    } catch (error) {
      console.error('Auth check error:', error);
      setShowAuthForm(true);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await fetch('/api/professor/students');
      
      if (response.ok) {
        const data = await response.json();
        setStudentsData(data);
        setError(null);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Erreur lors du chargement');
      }
    } catch (err) {
      setError('Erreur de connexion');
      console.error('Error fetching students:', err);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (authMode === 'create') {
      if (!authForm.email || !authForm.password || !authForm.name || !authForm.gender || !authForm.secretCode) {
        toast.error('Veuillez remplir tous les champs');
        return;
      }
    } else {
      if (!authForm.email || !authForm.password) {
        toast.error('Email et mot de passe requis');
        return;
      }
    }

    setAuthLoading(true);

    try {
      const response = await fetch('/api/professor/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: authMode,
          ...authForm
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        if (authMode === 'create') {
          toast.success('Compte créé avec succès !');
          toast.success('Configuration Zoom mise à jour ! Les élèves peuvent maintenant rejoindre vos réunions.');
        }
        toast.success('Connexion réussie !');
        
        setProfessor(data.professor);
        setShowAuthForm(false);
        setProfileForm({
          name: data.professor.name || '',
          zoomMeetingId: data.professor.zoomMeetingId || '',
          zoomPassword: data.professor.zoomPassword || ''
        });
        await fetchStudents();
      } else {
        toast.error(data.error || 'Erreur d\'authentification');
      }
    } catch (error) {
      toast.error('Erreur de connexion');
      console.error('Auth error:', error);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileLoading(true);

    try {
      const response = await fetch('/api/professor/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileForm)
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setProfessor(prev => prev ? { ...prev, ...data.professor } : null);
        setShowProfileSettings(false);
        toast.success('Configuration Zoom mise à jour ! Les élèves peuvent maintenant rejoindre vos réunions.');
      } else {
        toast.error(data.error || 'Erreur lors de la mise à jour');
      }
    } catch (error) {
      toast.error('Erreur de connexion');
      console.error('Update profile error:', error);
    } finally {
      setProfileLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/professor/logout', { method: 'POST' });
      setProfessor(null);
      setStudentsData(null);
      setShowAuthForm(true);
      setAuthForm({
        email: '',
        password: '',
        name: '',
        gender: '',
        secretCode: ''
      });
      toast.success('Déconnexion réussie');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const filteredStudents = studentsData?.students.filter(student =>
    student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (student.username && student.username.toLowerCase().includes(searchTerm.toLowerCase()))
  ) || [];

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours > 0) {
      return `${hours}h ${mins}min`;
    }
    return `${mins}min`;
  };

  if (showAuthForm) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-6">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4 rounded-2xl w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Users className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Espace Professeur
            </h1>
            <p className="text-slate-300">
              {authMode === 'create' ? 'Créer un compte professeur' : 'Connexion professeur'}
            </p>
          </div>

          {/* Boutons de mode */}
          <div className="flex mb-6 bg-white/5 rounded-xl p-1">
            <button
              type="button"
              onClick={() => setAuthMode('login')}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                authMode === 'login'
                  ? 'bg-purple-600 text-white'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Connexion
            </button>
            <button
              type="button"
              onClick={() => setAuthMode('create')}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                authMode === 'create'
                  ? 'bg-purple-600 text-white'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Créer un compte
            </button>
          </div>

          <form onSubmit={handleAuth} className="space-y-6">
            {authMode === 'create' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    <Lock className="inline h-4 w-4 mr-2" />
                    Code secret *
                  </label>
                  <input
                    type="password"
                    value={authForm.secretCode}
                    onChange={(e) => setAuthForm(prev => ({ ...prev, secretCode: e.target.value }))}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Code d'accès professeur"
                    required
                  />
                  <p className="text-xs text-slate-400 mt-1">
                    Code requis pour créer un compte professeur
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Nom complet *
                  </label>
                  <input
                    type="text"
                    value={authForm.name}
                    onChange={(e) => setAuthForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Votre nom complet"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Genre *
                  </label>
                  <select
                    value={authForm.gender}
                    onChange={(e) => setAuthForm(prev => ({ ...prev, gender: e.target.value as 'HOMME' | 'FEMME' }))}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  >
                    <option value="" className="bg-slate-800">Sélectionnez votre genre</option>
                    <option value="HOMME" className="bg-slate-800">Homme</option>
                    <option value="FEMME" className="bg-slate-800">Femme</option>
                  </select>
                </div>
              </>
            )}
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Email {authMode === 'create' ? '*' : ''}
              </label>
              <input
                type="email"
                value={authForm.email}
                onChange={(e) => setAuthForm(prev => ({ ...prev, email: e.target.value }))}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="professeur@sonimportance.com"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Mot de passe {authMode === 'create' ? '*' : ''}
              </label>
              <input
                type="password"
                value={authForm.password}
                onChange={(e) => setAuthForm(prev => ({ ...prev, password: e.target.value }))}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder={authMode === 'create' ? 'Minimum 8 caractères' : 'Votre mot de passe'}
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={authLoading}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {authLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                  {authMode === 'create' ? 'Création...' : 'Connexion...'}
                </>
              ) : (
                <>
                  {authMode === 'create' ? <UserPlus className="h-5 w-5" /> : <User className="h-5 w-5" />}
                  {authMode === 'create' ? 'Créer mon compte' : 'Se connecter'}
                </>
              )}
            </button>
          </form>
          
          {authMode === 'create' && (
            <div className="mt-6 bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <Lock className="h-5 w-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-yellow-400 font-semibold text-sm mb-1">
                    Création de compte sécurisée
                  </h4>
                  <p className="text-yellow-300 text-xs leading-relaxed">
                    Un code secret est requis pour créer un compte professeur. 
                    Contactez l'administration si vous n'avez pas ce code.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-400 mx-auto mb-6"></div>
          <p className="text-white text-lg font-medium">Chargement...</p>
        </div>
      </div>
    );
  }

  if (error || !studentsData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-6">
        <div className="text-center">
          <div className="text-red-400 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-white mb-4">Erreur d'accès</h1>
          <p className="text-slate-400 mb-6">{error}</p>
          <button
            onClick={() => {
              setShowAuthForm(true);
              setError(null);
            }}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-xl">
                <Users className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  Espace {professor?.name}
                </h1>
                <p className="text-purple-200">
                  Professeur {professor?.gender.toLowerCase()} • {studentsData.totalStudents} élève(s)
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Link
                href="/professor/availability"
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg flex items-center gap-1 sm:gap-2 transition-colors text-sm sm:text-base"
              >
                <Clock className="h-4 w-4" />
                <span className="hidden sm:inline">Mes disponibilités</span>
                <span className="sm:hidden">Créneaux</span>
              </Link>
              
              <button
                onClick={() => setShowProfileSettings(true)}
                className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 px-4 py-2 rounded-xl transition-all duration-300 text-white"
              >
                <Settings className="h-4 w-4 mr-2 inline" />
                Paramètres
              </button>
              
              <button
                onClick={handleLogout}
                className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 px-4 py-2 rounded-xl transition-all duration-300 text-white"
              >
                <LogOut className="h-4 w-4 mr-2 inline" />
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        {/* Statistiques rapides */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center">
            <div className="bg-purple-500/20 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Clock className="h-6 w-6 text-purple-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">
              {/* TODO: Compter les créneaux disponibles */}
              -
            </h3>
            <p className="text-slate-400 text-sm">Créneaux disponibles</p>
          </div>
          
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center">
            <div className="bg-blue-500/20 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Users className="h-6 w-6 text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">
              {studentsData.totalStudents}
            </h3>
            <p className="text-slate-400 text-sm">Élèves assignés</p>
          </div>
          
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center">
            <div className="bg-green-500/20 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="h-6 w-6 text-green-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">
              {studentsData.students.length > 0 ? Math.round(
                studentsData.students.reduce((sum, s) => sum + s.progressPercentage, 0) / studentsData.students.length
              ) : 0}%
            </h3>
            <p className="text-slate-400 text-sm">Progression moyenne</p>
          </div>
          
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center">
            <div className="bg-yellow-500/20 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Calendar className="h-6 w-6 text-yellow-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">
              {studentsData.students.reduce((sum, s) => sum + s.sessions.length, 0)}
            </h3>
            <p className="text-slate-400 text-sm">Séances totales</p>
          </div>
        </div>

        {/* Actions rapides */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link
            href="/professor/availability"
            className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white p-6 rounded-xl transition-all duration-300 transform hover:scale-105 group"
          >
            <div className="flex items-center gap-4 mb-4">
              <Clock className="h-8 w-8" />
              <div>
                <h4 className="font-bold text-lg">Mes Disponibilités</h4>
                <p className="text-purple-200 text-sm">Gérer mes créneaux</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Ajouter/Modifier</span>
              <div className="bg-white/20 p-1 rounded-full group-hover:translate-x-1 transition-transform">
                <Plus className="h-4 w-4" />
              </div>
            </div>
          </Link>

          <Link
            href="/professor/planning"
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white p-6 rounded-xl transition-all duration-300 transform hover:scale-105 group block"
          >
            <div className="flex items-center gap-4 mb-4">
              <Calendar className="h-8 w-8" />
              <div>
                <h4 className="font-bold text-lg">Planning</h4>
                <p className="text-blue-200 text-sm">Vue d'ensemble</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Voir le planning</span>
              <div className="bg-white/20 p-1 rounded-full group-hover:translate-x-1 transition-transform">
                <Calendar className="h-4 w-4" />
              </div>
            </div>
          </Link>

          <button className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white p-6 rounded-xl transition-all duration-300 transform hover:scale-105 group">
            <div className="flex items-center gap-4 mb-4">
              <Users className="h-8 w-8" />
              <div>
                <h4 className="font-bold text-lg">Mes Élèves</h4>
                <p className="text-green-200 text-sm">Suivi détaillé</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Voir les détails</span>
              <div className="bg-white/20 p-1 rounded-full group-hover:translate-x-1 transition-transform">
                <Users className="h-4 w-4" />
              </div>
            </div>
          </button>
        </div>

        {/* Barre de recherche */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher un élève par email ou pseudo..."
              className="w-full bg-white/10 border border-white/20 rounded-xl pl-10 pr-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        {/* Liste des élèves */}
        {filteredStudents.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredStudents.map((student) => (
              <div key={student.id} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                {/* En-tête élève */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 w-12 h-12 rounded-xl flex items-center justify-center">
                      <User className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">
                        {student.username || 'Sans pseudo'}
                      </h3>
                      <p className="text-slate-400 text-sm">{student.email}</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-2xl font-bold text-white">
                      {student.progressPercentage}%
                    </div>
                    <div className="text-slate-400 text-sm">Progression</div>
                  </div>
                </div>

                {/* Barre de progression */}
                <div className="mb-6">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-300">Avancement du cours</span>
                    <span className="text-purple-400 font-medium">
                      {student.progressPercentage}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-purple-400 to-pink-400 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${student.progressPercentage}%` }}
                    ></div>
                  </div>
                </div>

                {/* Statistiques détaillées */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center">
                    <div className="bg-blue-500/20 w-10 h-10 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <BookOpen className="h-5 w-5 text-blue-400" />
                    </div>
                    <div className="text-white font-bold">{student.completedPagesCount}/29</div>
                    <div className="text-slate-400 text-xs">Pages</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="bg-yellow-500/20 w-10 h-10 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <Award className="h-5 w-5 text-yellow-400" />
                    </div>
                    <div className="text-white font-bold">{student.completedQuizzesCount}/11</div>
                    <div className="text-slate-400 text-xs">Quiz</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="bg-green-500/20 w-10 h-10 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <Clock className="h-5 w-5 text-green-400" />
                    </div>
                    <div className="text-white font-bold">{formatTime(student.studyTimeMinutes)}</div>
                    <div className="text-slate-400 text-xs">Temps</div>
                  </div>
                </div>

                {/* Séances */}
                <div className="border-t border-white/10 pt-4">
                  <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-purple-400" />
                    Séances ({student.sessions.length})
                  </h4>
                  
                  {student.sessions.length > 0 ? (
                    <div className="space-y-2">
                      {student.sessions.slice(0, 3).map((session) => (
                        <div key={session.id} className="bg-white/5 rounded-lg p-3 flex items-center justify-between">
                          <div>
                            <div className="text-white text-sm font-medium">
                              {new Date(session.scheduledAt).toLocaleDateString('fr-FR')}
                            </div>
                            <div className="text-slate-400 text-xs">
                              {new Date(session.scheduledAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${
                              session.status === 'COMPLETED' ? 'bg-green-400' :
                              session.status === 'SCHEDULED' ? 'bg-blue-400' :
                              'bg-red-400'
                            }`}></div>
                            <span className="text-slate-300 text-xs capitalize">
                              {session.statusText}
                            </span>
                          </div>
                        </div>
                      ))}
                      
                      {student.sessions.length > 3 && (
                        <div className="text-center">
                          <span className="text-slate-400 text-xs">
                            +{student.sessions.length - 3} autres séances
                          </span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-slate-400 text-sm text-center py-4">
                      Aucune séance réservée
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-12 text-center">
            <div className="text-6xl mb-4">👥</div>
            <h3 className="text-xl font-semibold text-white mb-2">
              {searchTerm ? 'Aucun élève trouvé' : 'Aucun élève assigné'}
            </h3>
            <p className="text-slate-400 mb-6">
              {searchTerm 
                ? 'Aucun résultat pour votre recherche.' 
                : 'Les élèves apparaîtront ici une fois qu\'ils auront réservé une séance avec vous.'
              }
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors"
              >
                Effacer la recherche
              </button>
            )}
          </div>
        )}
      </main>

      {/* Modal Paramètres Profil */}
      {showProfileSettings && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800/95 backdrop-blur-xl border border-white/10 rounded-3xl p-8 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">Paramètres du profil</h3>
              <button
                onClick={() => setShowProfileSettings(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Nom d'affichage
                </label>
                <input
                  type="text"
                  value={profileForm.name}
                  onChange={(e) => setProfileForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Professeur Ahmed / Professeur Fatima"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  ID de réunion Zoom
                </label>
                <input
                  type="text"
                  value={profileForm.zoomMeetingId}
                  onChange={(e) => setProfileForm(prev => ({ ...prev, zoomMeetingId: e.target.value }))}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Ex: 1234567890"
                />
                <p className="text-xs text-slate-400 mt-1">
                  Votre ID de réunion personnelle Zoom (10-11 chiffres)
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Mot de passe Zoom (optionnel)
                </label>
                <input
                  type="text"
                  value={profileForm.zoomPassword}
                  onChange={(e) => setProfileForm(prev => ({ ...prev, zoomPassword: e.target.value }))}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Ex: abc123"
                />
                <p className="text-xs text-slate-400 mt-1">
                  Laissez vide si votre réunion n'a pas de mot de passe
                </p>
              </div>
              
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <div className="bg-blue-500/20 p-1 rounded">
                    <svg className="h-4 w-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-blue-400 font-semibold text-sm mb-1">
                      💡 Comment trouver votre ID Zoom
                    </h4>
                    <p className="text-blue-300 text-xs leading-relaxed">
                      1. Ouvrez Zoom → Réunions → Réunion personnelle<br/>
                      2. Copiez l'ID (ex: 1234567890)<br/>
                      3. Collez-le ici → Les élèves accèderont à VOTRE réunion
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <div className="bg-green-500/20 p-1 rounded">
                    <svg className="h-4 w-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-green-400 font-semibold text-sm mb-1">
                      💡 Comment ça marche
                    </h4>
                    <p className="text-green-300 text-xs leading-relaxed">
                      1. Configurez votre ID de réunion Zoom personnelle<br/>
                      2. Les élèves verront un bouton "Rejoindre la séance Zoom"<br/>
                      3. Le clic les redirige automatiquement vers VOTRE réunion
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowProfileSettings(false)}
                  className="flex-1 bg-white/10 hover:bg-white/20 text-white font-medium px-6 py-3 rounded-xl transition-all duration-200 border border-white/20"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={profileLoading}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 disabled:opacity-50"
                >
                  {profileLoading ? 'Mise à jour...' : 'Sauvegarder'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}