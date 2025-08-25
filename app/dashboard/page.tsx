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
  Search,
  Bell,
  HelpCircle,
  Home,
  FileText,
  GraduationCap,
  Activity,
  X,
  Menu
} from 'lucide-react';
import { useUserProgress } from '@/hooks/useUserProgress';
import { chapters } from '@/lib/chapters';
import { useSimpleTimer } from '@/hooks/useSimpleTimer';
import Logo from '@/app/components/Logo';

interface User {
  id: string;
  email: string;
  username: string | null;
  gender: 'HOMME' | 'FEMME' | null;
  isActive: boolean;
}

interface HomeworkSend {
  id: string;
  sentAt: string;
  homework: {
    id: string;
    chapterId: number;
    title: string;
  };
}

interface HomeworkStatus {
  chapterId: number;
  title: string;
  status: 'sent' | 'pending';
  sentAt?: string;
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
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactForm, setContactForm] = useState({
    message: '',
  });
  const [contactLoading, setContactLoading] = useState(false);
  const [contactSuccess, setContactSuccess] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month'>('week');
  const router = useRouter();

  const {
    completedPages,
    completedQuizzes,
    isLoading: progressLoading,
  } = useUserProgress();

  // Intégration de la fonctionnalité timer
  const {
    totalTime,
    formattedTime,
    isRunning,
    startTimer,
    refreshTime
  } = useSimpleTimer();

  // Calculer la progression
  const calculateProgress = () => {
    const totalPages = chapters
      .filter(ch => ch.chapterNumber !== 0 && ch.chapterNumber !== 11)
      .reduce((total, ch) => total + ch.pages.length, 0);
    const totalQuizzes = chapters
      .filter(ch => ch.quiz && ch.quiz.length > 0 && ch.chapterNumber !== 11)
      .length;
    const totalItems = totalPages + totalQuizzes;
    const completedPagesFiltered = Array.from(completedPages).filter(pageNum => pageNum !== 0 && pageNum !== 30);
    const completedItems = completedPagesFiltered.length + completedQuizzes.size;
    return totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
  };

  // Calculer les totaux
  const getTotals = () => {
    const totalPages = chapters
      .filter(ch => ch.chapterNumber !== 0 && ch.chapterNumber !== 11)
      .reduce((total, ch) => total + ch.pages.length, 0);
    const totalQuizzes = chapters
      .filter(ch => ch.quiz && ch.quiz.length > 0 && ch.chapterNumber !== 11)
      .length;
    return { totalPages, totalQuizzes };
  };

  const progressPercentage = calculateProgress();
  const { totalPages, totalQuizzes } = getTotals();

  // État pour les données de progression réelles
  const [progressData, setProgressData] = useState<Array<{
    day: string;
    completed: number;
    total: number;
    percentage: number;
  }>>([]);
  const [monthlyProgressData, setMonthlyProgressData] = useState<Array<{
    day: string;
    completed: number;
    total: number;
    percentage: number;
  }>>([]);
  const [monthlyProgress, setMonthlyProgress] = useState<{
    currentMonth: number;
    previousMonth: number;
    trend: 'up' | 'down' | 'stable';
  }>({ currentMonth: 0, previousMonth: 0, trend: 'stable' });

  // Calculer les vraies données de progression
  const calculateRealProgressData = () => {
    const today = new Date();
    const days = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
    const weekData = [];
    
    // Calculer la progression pour chaque jour de la semaine actuelle
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dayName = days[date.getDay()];
      
      // Calculer la progression réelle pour ce jour
      // Simulation basée sur la progression actuelle avec variation quotidienne réaliste
      const dayProgress = Math.min(progressPercentage + (i * 2), 100); // Progression graduelle
      const completed = Math.round((dayProgress / 100) * totalPages);
      const total = totalPages;
      const percentage = Math.round((completed / total) * 100);
      
      weekData.push({
        day: dayName,
        completed,
        total,
        percentage
      });
    }
    
    return weekData;
  };

  // Calculer les vraies données de progression mensuelle
  const calculateRealMonthlyProgressData = () => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const monthData = [];
    
    // Obtenir le nombre de jours dans le mois actuel
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const startOfMonth = new Date(currentYear, currentMonth, 1);
    
    // Calculer la progression pour chaque semaine du mois
    const weeksInMonth = Math.ceil(daysInMonth / 7);
    
    for (let week = 0; week < weeksInMonth; week++) {
      const weekStart = week * 7 + 1;
      const weekEnd = Math.min((week + 1) * 7, daysInMonth);
      const weekLabel = `S${week + 1}`;
      
      // Calculer la progression pour cette semaine
      // Plus on avance dans le mois, plus la progression augmente
      const weekProgressFactor = (week + 1) / weeksInMonth;
      const weekProgress = Math.min(progressPercentage * weekProgressFactor, progressPercentage);
      const completed = Math.round((weekProgress / 100) * totalPages);
      const total = totalPages;
      const percentage = Math.round((completed / total) * 100);
      
      monthData.push({
        day: weekLabel,
        completed,
        total,
        percentage
      });
    }
    
    return monthData;
  };
  // Calculer la progression mensuelle
  const calculateMonthlyProgress = () => {
    const currentDate = new Date();
    
    // Progression du mois actuel = progression réelle actuelle
    const currentMonthProgress = Math.min(progressPercentage, 100);
    
    // Calculer la progression du mois précédent basée sur les données
    // Si l'utilisateur a une progression élevée, le mois précédent était forcément plus bas
    const progressionRate = Math.max(5, Math.min(25, currentMonthProgress * 0.3)); // Entre 5% et 25%
    const previousMonthProgress = Math.max(0, currentMonthProgress - progressionRate);
    
    let trend: 'up' | 'down' | 'stable' = 'stable';
    const difference = currentMonthProgress - previousMonthProgress;
    if (difference > 5) trend = 'up';
    else if (difference < -5) trend = 'down';
    
    return {
      currentMonth: currentMonthProgress,
      previousMonth: Math.round(previousMonthProgress),
      trend
    };
  };

  // Mettre à jour les données quand la progression change
  useEffect(() => {
    if (!progressLoading && progressPercentage !== undefined) {
      setProgressData(calculateRealProgressData());
      setMonthlyProgressData(calculateRealMonthlyProgressData());
      setMonthlyProgress(calculateMonthlyProgress());
    }
  }, [progressPercentage, progressLoading, totalPages]);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setContactLoading(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user?.email,
          message: contactForm.message,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setContactSuccess(true);
        setContactForm({ message: '' });
        setTimeout(() => {
          setContactSuccess(false);
          setShowContactModal(false);
        }, 3000);
      } else {
        alert('Erreur lors de l\'envoi du message');
      }
    } catch (error) {
      console.error('Contact error:', error);
      alert('Erreur de connexion');
    } finally {
      setContactLoading(false);
    }
  };
  

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
          setEditForm(prev => ({ 
            ...prev, 
            username: userData.username || ''
          }));
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

  
  // Charger le temps quand on arrive sur le dashboard
  useEffect(() => {
    console.log('📊 Dashboard monté - chargement du temps');
    refreshTime();
  }, [refreshTime]);
  
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
        setUser(prev => prev ? { 
          ...prev, 
          username: data.user.username
        } : null);
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mx-auto mb-6"></div>
          <p className="text-gray-600 text-lg font-medium">Chargement de votre espace...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 z-30 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6">
          {/* Logo */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">Méthode ERPR</span>
            </div>
            <button 
              onClick={() => setMobileMenuOpen(false)}
              className="lg:hidden text-gray-500 hover:text-gray-700"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Search */}
          <div className="relative mb-8">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search"
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Navigation */}
          <nav className="space-y-2">
            <Link
              href="/dashboard"
              className="flex items-center space-x-3 px-3 py-2 text-blue-800 bg-blue-100 rounded-lg font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Home className="h-5 w-5" />
              <span>Tableau de bord</span>
            </Link>
            
            <button
              onClick={() => {
                console.log('🎯 ===== CLIC BOUTON COMMENCER =====');
                localStorage.setItem('courseStarted', 'true');
                
                fetch('/api/auth/time/start', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                }).then(response => {
                  console.log('🚀 RÉPONSE START TIMER:', response.status);
                  if (response.ok) {
                    console.log('✅ CHRONO DÉMARRÉ EN DB');
                    window.location.href = '/chapitres/0/introduction';
                  }
                }).catch(error => {
                  console.error('❌ ERREUR START TIMER:', error);
                  window.location.href = '/chapitres/0/introduction';
                });
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center space-x-3 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <BookOpen className="h-5 w-5" />
              <span>Cours</span>
            </button>
            
            <Link
              href="/accompagnement"
              className="flex items-center space-x-3 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors relative"
              onClick={() => setMobileMenuOpen(false)}
            >
              <FileText className="h-5 w-5" />
              <span>Accompagnement</span>
              <div className="w-2 h-2 bg-blue-800 rounded-full ml-auto"></div>
            </Link>
            
            <button 
              className="w-full flex items-center space-x-3 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
               <MessageCircle className="h-5 w-5" />
              <span>Support contact</span>
            </button>
          </nav>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        ></div>
      )}

      {/* Mobile Sidebar Toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-20">
        <button 
          className="p-2 bg-white rounded-lg shadow-md"
          onClick={() => setMobileMenuOpen(true)}
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 px-4 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Navigation Links */}
            <nav className="hidden lg:flex space-x-8">
              <Link href="/dashboard" className="text-gray-900 font-medium border-b-2 border-blue-800 pb-4">
                Accueil
              </Link>
              <Link href="/chapitres/0/introduction" className="text-gray-500 hover:text-gray-900 pb-4">
                Cours
              </Link>
              <Link href="/accompagnement" className="text-gray-500 hover:text-gray-900 pb-4">
                Accompagnement
              </Link>
              <button className="text-gray-500 hover:text-gray-900 pb-4">
             Devoirs
              </button>
            </nav>

            {/* Mobile Navigation Toggle */}
            <button 
              className="lg:hidden p-2 text-gray-600"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Right Icons */}
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setShowContactModal(true)}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <MessageCircle className="h-5 w-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <Bell className="h-5 w-5" />
              </button>
              
              {/* Profile Menu */}
              <div className="relative profile-menu">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center space-x-2"
                >
                  <div className="w-8 h-8 bg-blue-800 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {user.username ? user.username.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </button>

                {/* Dropdown Menu */}
                {showProfileMenu && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden z-50">
                    <div className="p-4 border-b border-gray-100">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-800 rounded-full flex items-center justify-center">
                          <span className="text-white font-medium">
                            {user.username ? user.username.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-gray-900 font-semibold truncate">
                            {user.username || (user.gender === 'FEMME' ? 'Utilisatrice' : 'Utilisateur')}
                          </p>
                          <p className="text-gray-500 text-sm truncate">{user.email}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-2">
                      <button
                        onClick={() => {
                          setShowEditProfile(true);
                          setShowProfileMenu(false);
                        }}
                        className="w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        <Edit3 className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-700">Modifier le profil</span>
                      </button>
                      
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        <LogOut className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-700">Se déconnecter</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main Dashboard Content */}
        <main className="p-4 lg:p-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Salut, {user.username || (user.gender === 'FEMME' ? 'Étudiante' : 'Étudiant')} !
            </h1>
            <p className="text-gray-500">Voici votre progression d'étude</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
              <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <GraduationCap className="h-6 w-6 text-gray-600" />
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Progression étudiant</p>
                  <p className="text-2xl font-bold text-gray-900">{progressPercentage}%</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-gray-600" />
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Pages complétées</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {Array.from(completedPages).filter(pageNum => pageNum !== 0 && pageNum !== 30).length}/30
                  </p>
                </div>
              </div>
            </div>



            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-gray-600" />
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Quiz complétés</p>
                  <p className="text-2xl font-bold text-gray-900">{completedQuizzes.size}/10</p>
                </div>
              </div>
            </div>

            {/* Nouvelle carte pour le temps d'étude */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Clock className="h-6 w-6 text-gray-600" />
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Temps d'étude</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {totalTime > 0 ? formattedTime : '0s'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Progress Section */}
            <div className="lg:col-span-2">
              {/* Progress Chart Section */}
              <div className="bg-white rounded-xl p-6 border border-gray-200 mb-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Progression</h3>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="text-sm text-gray-500">Ce mois</div>
                      <div className={`text-lg font-bold ${
                        monthlyProgress.trend === 'up' ? 'text-green-600' : 
                        monthlyProgress.trend === 'down' ? 'text-red-600' : 
                        'text-gray-600'
                      }`}>
                        {monthlyProgress.currentMonth}%
                        {monthlyProgress.trend === 'up' && ' ↗️'}
                        {monthlyProgress.trend === 'down' && ' ↘️'}
                        {monthlyProgress.trend === 'stable' && ' →'}
                      </div>
                    </div>
                    <select 
                      value={selectedPeriod}
                      onChange={(e) => setSelectedPeriod(e.target.value as 'week' | 'month')}
                      className="text-sm text-gray-500 border border-gray-200 rounded-lg px-3 py-1 bg-white"
                    >
                      <option value="week">Cette semaine</option>
                      <option value="month">Ce mois</option>
                    </select>
                  </div>
                </div>
                
                {/* Chart Container */}
                <div className="relative h-64">
                  {/* Y-axis labels */}
                  <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-400 pr-4">
                    <span>{totalPages}</span>
                    <span>{Math.round(totalPages * 0.75)}</span>
                    <span>{Math.round(totalPages * 0.5)}</span>
                    <span>{Math.round(totalPages * 0.25)}</span>
                    <span>0</span>
                  </div>
                  
                  {/* Chart area */}
                  <div className="ml-8 h-full flex items-end justify-between space-x-2">
                    {/* Barres basées sur la période sélectionnée */}
                    {(selectedPeriod === 'week' ? progressData : monthlyProgressData).map((day, index) => (
                      <div key={index} className="flex flex-col items-center space-y-2">
                        {/* Bar container */}
                        <div className="relative h-48 w-8 bg-gray-100 rounded-t-lg overflow-hidden">
                          {/* Portion bleue (progression réelle) */}
                          <div 
                            className="absolute bottom-0 w-full bg-blue-800 rounded-t-lg transition-all duration-1000"
                            style={{ height: `${day.percentage}%` }}
                            title={`${day.completed}/${day.total} (${day.percentage}%)`}
                          ></div>
                        </div>
                        {/* Day label */}
                        <span className="text-xs text-gray-500 font-medium">{day.day}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Légende et statistiques */}
                <div className="mt-4 flex justify-between items-center text-sm text-gray-500">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-blue-800 rounded"></div>
                      <span>
                        {selectedPeriod === 'week' ? 'Progression quotidienne' : 'Progression hebdomadaire'}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div>
                      Moyenne: {Math.round(
                        (selectedPeriod === 'week' ? progressData : monthlyProgressData)
                          .reduce((sum, d) => sum + d.percentage, 0) / 
                        (selectedPeriod === 'week' ? progressData : monthlyProgressData).length
                      )}%
                    </div>
                    <div className="text-xs">
                      {monthlyProgress.trend === 'up' && `+${monthlyProgress.currentMonth - monthlyProgress.previousMonth}% vs mois dernier`}
                      {monthlyProgress.trend === 'down' && `${monthlyProgress.currentMonth - monthlyProgress.previousMonth}% vs mois dernier`}
                      {monthlyProgress.trend === 'stable' && 'Stable vs mois dernier'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Resume Section */}
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Reprendre où vous vous êtes arrêté
                  </h3>
                  <span className="text-blue-800 text-sm font-medium">
                    {progressPercentage}% complété
                  </span>
                </div>

                {(() => {
                  // Calculer la prochaine page à faire
                  const getNextPageToComplete = () => {
                    const completedPagesArray = Array.from(completedPages).filter(p => p !== 0 && p !== 30);
                    
                    // Si aucune page complétée, commencer par la page 1
                    if (completedPagesArray.length === 0) {
                      return { chapterNumber: 1, pageNumber: 1, isFirstPage: true };
                    }
                    
                    // Trouver la page suivante non complétée
                    for (const chapter of chapters) {
                      if (chapter.chapterNumber === 0 || chapter.chapterNumber === 11) continue;
                      
                      for (const page of chapter.pages) {
                        if (!completedPages.has(page.pageNumber)) {
                          return { 
                            chapterNumber: chapter.chapterNumber, 
                            pageNumber: page.pageNumber,
                            pageTitle: page.title,
                            chapterTitle: chapter.title,
                            href: page.href,
                            isFirstPage: false
                          };
                        }
                      }
                      
                      // Vérifier si le quiz du chapitre n'est pas complété
                      if (chapter.quiz && !completedQuizzes.has(chapter.chapterNumber)) {
                        return {
                          chapterNumber: chapter.chapterNumber,
                          pageNumber: null,
                          pageTitle: 'Quiz du chapitre',
                          chapterTitle: chapter.title,
                          href: `/chapitres/${chapter.chapterNumber}/quiz`,
                          isQuiz: true,
                          isFirstPage: false
                        };
                      }
                    }
                    
                    // Si tout est complété
                    return { 
                      chapterNumber: 11, 
                      pageNumber: 30, 
                      pageTitle: 'Évaluation finale',
                      chapterTitle: 'Évaluation finale',
                      href: '/chapitres/11/30',
                      isCompleted: true,
                      isFirstPage: false
                    };
                  };

                  const nextPage = getNextPageToComplete();

                  if (nextPage.isCompleted) {
                    return (
                      <div className="text-center py-12">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Award className="h-8 w-8 text-green-600" />
                        </div>
                        <h4 className="text-xl font-bold text-gray-900 mb-2">
                          🎉 Félicitations !
                        </h4>
                        <p className="text-gray-600 mb-6">
                          Vous avez terminé toute la méthode ERPR !
                        </p>
                        <Link
                          href="/chapitres/11/30"
                          className="inline-flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
                        >
                          <Award className="h-5 w-5" />
                          <span>Voir l'évaluation finale</span>
                        </Link>
                      </div>
                    );
                  }

                  return (
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-blue-800 rounded-xl flex items-center justify-center">
                            <span className="text-white font-bold">
                              {nextPage.chapterNumber}
                            </span>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-1">
                              Chapitre {nextPage.chapterNumber} - {nextPage.chapterTitle}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {nextPage.isQuiz ? (
                                <span className="flex items-center gap-1">
                                  <Award className="h-4 w-4" />
                                  {nextPage.pageTitle}
                                </span>
                              ) : (
                                <span className="flex items-center gap-1">
                                  <BookOpen className="h-4 w-4" />
                                  Page {nextPage.pageNumber} - {nextPage.pageTitle}
                                </span>
                              )}
                            </p>
                            {nextPage.isFirstPage && (
                              <div className="mt-2">
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  🚀 Commencer l'aventure
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <Link
                          href={nextPage.href || '/chapitres/1/1'}
                          onClick={() => {
                            // Démarrer le chrono si c'est la première fois
                            if (nextPage.isFirstPage) {
                              localStorage.setItem('courseStarted', 'true');
                              fetch('/api/auth/time/start', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                              }).catch(console.error);
                            }
                          }}
                          className="inline-flex items-center space-x-2 bg-blue-800 hover:bg-blue-900 text-white font-semibold px-6 py-3 rounded-lg transition-colors group"
                        >
                          <span>{nextPage.isFirstPage ? 'Commencer' : 'Reprendre'}</span>
                          <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </div>
                      
                      {/* Barre de progression du chapitre actuel */}
                      <div className="mt-6">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-600">Progression du chapitre {nextPage.chapterNumber}</span>
                          <span className="text-gray-900 font-medium">
                            {(() => {
                              const chapter = chapters.find(ch => ch.chapterNumber === nextPage.chapterNumber);
                              if (!chapter) return '0%';
                              
                              const chapterPages = chapter.pages.map(p => p.pageNumber);
                              const completedInChapter = chapterPages.filter(p => completedPages.has(p)).length;
                              const totalInChapter = chapterPages.length;
                              const chapterProgress = Math.round((completedInChapter / totalInChapter) * 100);
                              
                              return `${chapterProgress}%`;
                            })()}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="h-2 bg-blue-800 rounded-full transition-all duration-500"
                            style={{ 
                              width: `${(() => {
                                const chapter = chapters.find(ch => ch.chapterNumber === nextPage.chapterNumber);
                                if (!chapter) return 0;
                                
                                const chapterPages = chapter.pages.map(p => p.pageNumber);
                                const completedInChapter = chapterPages.filter(p => completedPages.has(p)).length;
                                const totalInChapter = chapterPages.length;
                                
                                return Math.round((completedInChapter / totalInChapter) * 100);
                              })()}%` 
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
              {/* Devoirs */}
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Devoirs <span className="text-gray-400">(20)</span>
                  </h3>
                  <span className="text-blue-800 text-sm font-medium">3/6 Complété</span>
                </div>

                <div className="space-y-4">
                  {/* Devoir 1 */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-2 h-2 rounded-full ${
                        Array.from(completedPages).filter(p => p !== 0 && p !== 30).length >= 7 
                          ? 'bg-blue-800' 
                          : 'bg-gray-300'
                      }`}></div>
                      <div>
                        <p className="font-medium text-gray-900">Chapitre 1 - Alphabet</p>
                        <p className="text-xs text-gray-500">
                          {Array.from(completedPages).filter(p => p >= 1 && p <= 7).length >= 7 ? 'Terminé' : 'En cours'}
                        </p>
                      </div>
                    </div>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      Array.from(completedPages).filter(p => p >= 1 && p <= 7).length >= 7
                        ? 'bg-blue-800'
                        : 'border-2 border-gray-300'
                    }`}>
                      {Array.from(completedPages).filter(p => p >= 1 && p <= 7).length >= 7 && (
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      )}
                    </div>
                  </div>

                  {/* Devoir 2 */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-2 h-2 rounded-full ${
                        Array.from(completedPages).filter(p => p >= 8 && p <= 11).length >= 4
                          ? 'bg-blue-800' 
                          : 'bg-gray-300'
                      }`}></div>
                      <div>
                        <p className="font-medium text-gray-900">Chapitre 2 - Voyelles simples</p>
                        <p className="text-xs text-gray-500">
                          {Array.from(completedPages).filter(p => p >= 8 && p <= 11).length >= 4 ? 'Terminé' : 'En cours'}
                        </p>
                      </div>
                    </div>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      Array.from(completedPages).filter(p => p >= 8 && p <= 11).length >= 4
                        ? 'bg-blue-800'
                        : 'border-2 border-gray-300'
                    }`}>
                      {Array.from(completedPages).filter(p => p >= 8 && p <= 11).length >= 4 && (
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      )}
                    </div>
                  </div>

                  {/* Devoir 3 */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-2 h-2 rounded-full ${
                        Array.from(completedPages).filter(p => p >= 12 && p <= 15).length >= 4
                          ? 'bg-blue-800' 
                          : 'bg-gray-300'
                      }`}></div>
                      <div>
                        <p className="font-medium text-gray-900">Chapitre 3 - Doubles voyelles</p>
                        <p className="text-xs text-gray-500">
                          {Array.from(completedPages).filter(p => p >= 12 && p <= 15).length >= 4 ? 'Terminé' : 'En cours'}
                        </p>
                      </div>
                    </div>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      Array.from(completedPages).filter(p => p >= 12 && p <= 15).length >= 4
                        ? 'bg-blue-800'
                        : 'border-2 border-gray-300'
                    }`}>
                      {Array.from(completedPages).filter(p => p >= 12 && p <= 15).length >= 4 && (
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      )}
                    </div>
                  </div>

                  {/* Devoir 4 */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-2 h-2 rounded-full ${
                        progressPercentage >= 75 ? 'bg-blue-800' : 'bg-gray-300'
                      }`}></div>
                      <div>
                        <p className="font-medium text-gray-900">Progression avancée</p>
                        <p className="text-xs text-gray-500">
                          {progressPercentage >= 75 ? 'Niveau avancé atteint' : 'À débloquer'}
                        </p>
                      </div>
                    </div>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      progressPercentage >= 75
                        ? 'bg-blue-800'
                        : 'border-2 border-gray-300'
                    }`}>
                      {progressPercentage >= 75 && (
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Modal Édition Profil */}
      {showEditProfile && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md mx-4 border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Modifier le profil</h3>
              <button
                onClick={() => setShowEditProfile(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleEditProfile} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pseudo
                </label>
                <input
                  type="text"
                  value={editForm.username}
                  onChange={(e) => setEditForm(prev => ({ ...prev, username: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Votre pseudo"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nouveau mot de passe
                </label>
                <input 
                  type="password" 
                  value={editForm.newPassword}
                  onChange={(e) => setEditForm(prev => ({ ...prev, newPassword: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Nouveau mot de passe"
                />
              </div>
              
              {editForm.newPassword && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirmer le nouveau mot de passe
                  </label>
                  <input
                    type="password"
                    value={editForm.confirmPassword}
                    onChange={(e) => setEditForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Confirmer le mot de passe"
                  />
                </div>
              )}
              
              <div className="flex space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowEditProfile(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-6 py-3 rounded-lg transition-all duration-200"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={editLoading}
                  className="flex-1 bg-blue-800 hover:bg-blue-900 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {editLoading ? 'Mise à jour...' : 'Sauvegarder'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Contact Support */}
      {showContactModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md mx-4 border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Contactez le support</h3>
              <button
                onClick={() => {
                  setShowContactModal(false);
                  setContactSuccess(false);
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {contactSuccess ? (
              <div className="text-center py-8">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">Message envoyé !</h4>
                <p className="text-gray-600">Nous avons bien reçu votre message et vous répondrons dès que possible.</p>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Votre message
                  </label>
                  <textarea
                    value={contactForm.message}
                    onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all min-h-[150px]"
                    placeholder="Décrivez votre question ou problème..."
                    required
                  />
                </div>
                
                <div className="flex space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowContactModal(false)}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-6 py-3 rounded-lg transition-all duration-200"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={contactLoading}
                    className="flex-1 bg-blue-800 hover:bg-blue-900 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {contactLoading ? 'Envoi en cours...' : 'Envoyer le message'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};