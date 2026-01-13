'use client';

import { JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, useEffect, useState } from 'react';
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
  Menu,
  BookMarked,
  Sparkles
} from 'lucide-react';
import { useUserProgress } from '@/hooks/useUserProgress';
import { chapters } from '@/lib/chapters';
import { chaptersTajwid } from '@/lib/chapters-tajwid';
import { useSimpleTimer } from '@/hooks/useSimpleTimer';
import { getChaptersByModule, hasAccessToChapter, getModuleTotals } from '@/lib/module-access';
import useRealProgressChart from '@/hooks/useRealProgressChart';
import { useRealProgressChartTajwid } from '@/hooks/useRealProgressChartTajwid';
import Logo from '@/app/components/Logo';
import DashboardHeader from '@/app/components/DashboardHeader';
import DashboardSidebar from '@/app/components/DashboardSidebar';

interface User {
  id: string;
  email: string;
  username: string | null;
  gender: 'HOMME' | 'FEMME' | null;
  isActive: boolean;
  accountType?: 'ACTIVE' | 'INACTIVE' | 'PAID_LEGACY';
  subscriptionPlan?: 'SOLO' | 'COACHING' | null;
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

interface TajwidHomeworkSend {
  id: string;
  sentAt: string;
  tajwidHomework: {
    id: string;
    chapterId: number;
    title: string;
  };
}


export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month'>('week');
  const [homeworkSends, setHomeworkSends] = useState<HomeworkSend[]>([]);
  const [tajwidHomeworkSends, setTajwidHomeworkSends] = useState<TajwidHomeworkSend[]>([]);
  const [homeworkLoading, setHomeworkLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  
  // ✨ Sélection du module par l'utilisateur (persisté dans localStorage)
  const [selectedModule, setSelectedModule] = useState<'LECTURE' | 'TAJWID'>('LECTURE');
  
  // Charger le module sélectionné depuis localStorage
  useEffect(() => {
    const savedModule = localStorage.getItem('selectedDashboardModule');
    if (savedModule === 'TAJWID' || savedModule === 'LECTURE') {
      setSelectedModule(savedModule);
    }
  }, []);
  
  // Sauvegarder le module sélectionné
  const handleModuleChange = (module: 'LECTURE' | 'TAJWID') => {
    setSelectedModule(module);
    localStorage.setItem('selectedDashboardModule', module);
  };
  
  // Utiliser le module sélectionné par l'utilisateur
  const userModule = selectedModule;

  // Fix hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  const {
    completedPages: lectureCompletedPages,
    completedQuizzes: lectureCompletedQuizzes,
    isLoading: progressLoading,
  } = useUserProgress();

  const [completedPages, setCompletedPages] = useState<Set<number>>(new Set());
  const [completedQuizzes, setCompletedQuizzes] = useState<Set<number>>(new Set());

  const getSentHomeworkCount = () => {
    return homeworkSends.length;
  };
  // Intégration de la fonctionnalité timer
  const {
    totalTime,
    formattedTime,
    isRunning,
    startTimer,
    refreshTime
  } = useSimpleTimer();

  // ✨ NOUVEAU : Récupérer les VRAIES données du graphique pour LECTURE
  const {
    weekData: weekDataLecture,
    monthData: monthDataLecture,
    monthlyStats: monthlyStatsLecture,
    isLoading: chartDataLoadingLecture,
    dataSource: dataSourceLecture
  } = useRealProgressChart();

  // ✨ NOUVEAU : Récupérer les VRAIES données du graphique pour TAJWID
  const {
    weekData: weekDataTajwid,
    monthData: monthDataTajwid,
    monthlyStats: monthlyStatsTajwid,
    isLoading: chartDataLoadingTajwid,
    dataSource: dataSourceTajwid
  } = useRealProgressChartTajwid();

  // Sélectionner les données du graphique selon le module actif
  const weekData = userModule === 'TAJWID' ? weekDataTajwid : weekDataLecture;
  const monthData = userModule === 'TAJWID' ? monthDataTajwid : monthDataLecture;
  const monthlyStats = userModule === 'TAJWID' ? monthlyStatsTajwid : monthlyStatsLecture;
  const chartDataLoading = userModule === 'TAJWID' ? chartDataLoadingTajwid : chartDataLoadingLecture;
  const dataSource = userModule === 'TAJWID' ? dataSourceTajwid : dataSourceLecture;

  // Calculer la progression selon le module
  const calculateProgress = () => {
    if (userModule === 'TAJWID') {
      // Calcul pour Tajwid - identique à SidebarContentTajwid (exclure page 0)
      const validPageNumbers = new Set<number>();
      chaptersTajwid.forEach(ch => {
        ch.pages.forEach(p => {
          if (p.pageNumber !== 0) {
            validPageNumbers.add(p.pageNumber);
          }
        });
      });
      
      const validQuizChapters = new Set<number>();
      chaptersTajwid.forEach(ch => {
        if (ch.quiz && ch.quiz.length > 0) {
          validQuizChapters.add(ch.chapterNumber);
        }
      });

      const totalPages = validPageNumbers.size; // 33 pages (0-32)
      const totalQuizzes = validQuizChapters.size; // 8 quizzes
      const totalItems = totalPages + totalQuizzes; // 41 items

      let completedPagesCount = 0;
      completedPages.forEach(pageNum => {
        if (validPageNumbers.has(pageNum)) {
          completedPagesCount++;
        }
      });

      let completedQuizzesCount = 0;
      completedQuizzes.forEach(quizNum => {
        if (validQuizChapters.has(quizNum)) {
          completedQuizzesCount++;
        }
      });

      const completedItems = completedPagesCount + completedQuizzesCount;
      
      if (completedItems === 0) return 0;
      if (completedItems >= totalItems) return 100;
      return Math.round((completedItems / totalItems) * 100);
    } else {
      // Calcul pour Lecture (exclure page 0 et page 30)
      const totalPages = chapters
        .filter(ch => ch.chapterNumber !== 11)
        .reduce((total, ch) => total + ch.pages.filter(p => p.pageNumber !== 30 && p.pageNumber !== 0).length, 0);
      const totalQuizzes = chapters
        .filter(ch => ch.quiz && ch.quiz.length > 0 && ch.chapterNumber !== 11)
        .length;
      const totalItems = totalPages + totalQuizzes;
      const completedPagesFiltered = Array.from(completedPages).filter(pageNum => pageNum !== 30 && pageNum !== 0);
      const completedQuizzesFiltered = Array.from(completedQuizzes).filter(quizNum => quizNum !== 11);
      const completedItems = completedPagesFiltered.length + completedQuizzesFiltered.length;
      return totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
    }
  };

  // Calculer les totaux selon le module
  const getTotals = () => {
    if (userModule === 'TAJWID') {
      // Totaux pour Tajwid - identique à SidebarContentTajwid (exclure page 0)
      const validPageNumbers = new Set<number>();
      chaptersTajwid.forEach(ch => {
        ch.pages.forEach(p => {
          if (p.pageNumber !== 0) {
            validPageNumbers.add(p.pageNumber);
          }
        });
      });
      
      const validQuizChapters = new Set<number>();
      chaptersTajwid.forEach(ch => {
        if (ch.quiz && ch.quiz.length > 0) {
          validQuizChapters.add(ch.chapterNumber);
        }
      });

      return { 
        totalPages: validPageNumbers.size, // 33 pages
        totalQuizzes: validQuizChapters.size // 8 quizzes
      };
    } else {
      // Totaux pour Lecture (exclure page 0 et page 30)
      const totalPages = chapters
        .filter(ch => ch.chapterNumber !== 11)
        .reduce((total, ch) => total + ch.pages.filter(p => p.pageNumber !== 30 && p.pageNumber !== 0).length, 0);
      const totalQuizzes = chapters
        .filter(ch => ch.quiz && ch.quiz.length > 0 && ch.chapterNumber !== 11)
        .length;
      return { totalPages, totalQuizzes };
    }
  };

  // Obtenir le nombre de pages complétées selon le module
  const getCompletedPagesCount = () => {
    if (userModule === 'TAJWID') {
      const validPageNumbers = new Set<number>();
      chaptersTajwid.forEach(ch => {
        ch.pages.forEach(p => {
          if (p.pageNumber !== 0) validPageNumbers.add(p.pageNumber);
        });
      });
      let count = 0;
      completedPages.forEach(pageNum => {
        if (validPageNumbers.has(pageNum)) count++;
      });
      return count;
    } else {
      return Array.from(completedPages).filter(pageNum => pageNum !== 30 && pageNum !== 0).length;
    }
  };

  // Obtenir le nombre de quiz complétés selon le module
  const getCompletedQuizzesCount = () => {
    if (userModule === 'TAJWID') {
      const validQuizChapters = new Set<number>();
      chaptersTajwid.forEach(ch => {
        if (ch.quiz && ch.quiz.length > 0) validQuizChapters.add(ch.chapterNumber);
      });
      let count = 0;
      completedQuizzes.forEach(quizNum => {
        if (validQuizChapters.has(quizNum)) count++;
      });
      return count;
    } else {
      return Array.from(completedQuizzes).filter(quizNum => quizNum !== 11).length;
    }
  };

  const progressPercentage = calculateProgress();
  const { totalPages, totalQuizzes } = getTotals();
  const completedPagesCount = getCompletedPagesCount();
  const completedQuizzesCount = getCompletedQuizzesCount();

  // ✨ NOUVEAU : Logging pour vérifier la source des données
  useEffect(() => {
    if (dataSource === 'REAL_DATA') {
      console.log('✅ Dashboard utilise les VRAIES données du serveur');
    } else if (dataSource === 'FALLBACK') {
      console.warn('⚠️ Dashboard en mode FALLBACK (données en attente)');
    }
  }, [dataSource]);

  const getHomeworkStatuses = () => {
    const statuses: Array<{
      chapterId: number;
      title: string;
      status: 'sent' | 'pending' | 'failed';
      sentAt?: string;
    }> = [];

    // Utiliser les chapitres selon le module
    const moduleChapters = userModule === 'TAJWID' ? chaptersTajwid : chapters;
    const moduleSends = userModule === 'TAJWID' ? tajwidHomeworkSends : homeworkSends;

    // Parcourir tous les chapitres (1-10)
    for (let chapterId = 1; chapterId <= 10; chapterId++) {
      const chapter = moduleChapters.find(ch => ch.chapterNumber === chapterId);
      if (!chapter) {
        // Si le chapitre n'existe pas dans les données, créer un placeholder
        statuses.push({
          chapterId,
          title: `Devoir du chapitre ${chapterId}`,
          status: 'pending'
        });
        continue;
      }

      // Vérifier si l'utilisateur a terminé ce chapitre
      // Pour Tajwid chapitre 1, exclure la page 0 car elle n'a pas de validation
      const chapterPages = (userModule === 'TAJWID' && chapterId === 1)
        ? chapter.pages.filter(p => p.pageNumber !== 0).map(p => p.pageNumber)
        : chapter.pages.map(p => p.pageNumber);
      const chapterCompleted = chapterPages.every(pageNum => completedPages.has(pageNum));
      const chapterQuizCompleted = !chapter.quiz || completedQuizzes.has(chapterId);
      const isChapterFullyCompleted = chapterCompleted && chapterQuizCompleted;

      // Chercher si le devoir a été envoyé
      const sentHomework = userModule === 'TAJWID'
        ? (moduleSends as TajwidHomeworkSend[]).find(send => send.tajwidHomework.chapterId === chapterId)
        : (moduleSends as HomeworkSend[]).find(send => send.homework.chapterId === chapterId);

      if (sentHomework) {
        statuses.push({
          chapterId,
          title: userModule === 'TAJWID'
            ? (sentHomework as TajwidHomeworkSend).tajwidHomework.title
            : (sentHomework as HomeworkSend).homework.title,
          status: 'sent',
          sentAt: sentHomework.sentAt
        });
      } else {
        // Si le chapitre est complété mais pas de devoir envoyé, c'est une erreur
        statuses.push({
          chapterId,
          title: `Devoir du chapitre ${chapterId}`,
          status: isChapterFullyCompleted ? 'failed' : 'pending'
        });
      }
    }

    return statuses;
  };

  const fetchHomeworkSends = async () => {
    try {
      // Récupérer les devoirs Lecture
      const lectureResponse = await fetch('/api/homework/user-sends');
      if (lectureResponse.ok) {
        const lectureData = await lectureResponse.json();
        setHomeworkSends(lectureData.sends || []);
      }

      // Récupérer les devoirs Tajwid
      const tajwidResponse = await fetch('/api/homework/tajwid/user-sends');
      if (tajwidResponse.ok) {
        const tajwidData = await tajwidResponse.json();
        setTajwidHomeworkSends(tajwidData.sends || []);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des devoirs:', error);
    } finally {
      setHomeworkLoading(false);
    }
  };

  useEffect(() => {
    fetchHomeworkSends();
  }, []);

  // Récupérer les données de progression selon le module
  useEffect(() => {
    const fetchModuleProgress = async () => {
      if (userModule === 'TAJWID') {
        try {
          // Pour Tajwid, récupérer les données de progression Tajwid
          const userResponse = await fetch('/api/auth/get-user');
          if (userResponse.ok) {
            const response = await userResponse.json();
            const userData = response.user;
            setCompletedPages(new Set(userData.completedPagesTajwid || []));
            setCompletedQuizzes(new Set(userData.completedQuizzesTajwid || []));
          }
        } catch (error) {
          console.error('Erreur lors du chargement de la progression Tajwid:', error);
          // En cas d'erreur, utiliser des données vides
          setCompletedPages(new Set());
          setCompletedQuizzes(new Set());
        }
      } else {
        // Utiliser les données Lecture
        setCompletedPages(lectureCompletedPages);
        setCompletedQuizzes(lectureCompletedQuizzes);
      }
    };

    if (userModule) {
      fetchModuleProgress();
    }
  }, [userModule, lectureCompletedPages, lectureCompletedQuizzes]);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
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

  if (!mounted || loading || progressLoading) {
    return (
      <div className="min-h-screen bg-gray-50 relative z-50">
        {/* Sidebar Skeleton */}
        <div className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 z-50 lg:translate-x-0 -translate-x-full lg:block hidden">
          <div className="p-6">
            {/* Logo skeleton */}
            <div className="flex items-center space-x-1 mb-8">
              <div className="w-10 h-10 rounded-lg bg-gray-200 animate-pulse"></div>
              <div className="h-6 w-32 bg-gray-200 animate-pulse rounded"></div>
            </div>

            {/* Search skeleton */}
            <div className="relative mb-8">
              <div className="h-10 bg-gray-100 rounded-lg animate-pulse"></div>
            </div>

            {/* Menu items skeleton */}
            {[1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="flex items-center space-x-3 px-3 py-2 rounded-lg mb-2">
                <div className="w-5 h-5 bg-gray-200 animate-pulse rounded"></div>
                <div className="h-4 w-24 bg-gray-200 animate-pulse rounded"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:ml-64 relative z-50 bg-gray-50 min-h-screen">
          {/* Header Skeleton */}
          <header className="bg-white border-b border-gray-200">
            <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="lg:hidden w-6 h-6 bg-gray-200 animate-pulse rounded"></div>
                <div className="h-8 w-48 bg-gray-200 animate-pulse rounded"></div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-gray-200 animate-pulse rounded-full"></div>
                <div className="w-8 h-8 bg-gray-200 animate-pulse rounded-full"></div>
                <div className="w-8 h-8 bg-gray-200 animate-pulse rounded-full"></div>
              </div>
            </div>
          </header>

          {/* Main Dashboard Content */}
          <main className="bg-gray-50 p-4 lg:p-8">
            {/* Welcome Section Skeleton */}
            <div className="mb-8">
              <div className="h-8 w-64 bg-gray-200 animate-pulse rounded mb-2"></div>
              <div className="h-5 w-96 bg-gray-200 animate-pulse rounded"></div>
            </div>

            {/* Stats Cards Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
              {[1, 2, 3, 4].map((card) => (
                <div key={card} className="bg-white rounded-xl p-6 border border-gray-200">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-200 animate-pulse rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-4 w-24 bg-gray-200 animate-pulse rounded mb-2"></div>
                      <div className="h-8 w-16 bg-gray-200 animate-pulse rounded"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Main Content Grid Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
              {/* Progress Section Skeleton */}
              <div className="lg:col-span-2">
                {/* Progress Chart Skeleton */}
                <div className="bg-white rounded-xl p-6 border border-gray-200 mb-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <div className="h-6 w-32 bg-gray-200 animate-pulse rounded mb-2"></div>
                      <div className="h-4 w-48 bg-gray-200 animate-pulse rounded"></div>
                    </div>
                    <div className="h-8 w-32 bg-gray-200 animate-pulse rounded"></div>
                  </div>

                  {/* Chart Skeleton */}
                  <div className="relative h-64">
                    <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs pr-4">
                      {[1, 2, 3, 4, 5].map((item) => (
                        <div key={item} className="w-6 h-3 bg-gray-200 animate-pulse rounded"></div>
                      ))}
                    </div>
                    <div className="ml-8 h-full flex items-end justify-between space-x-2">
                      {[
                        { height: '140px' },
                        { height: '80px' },
                        { height: '160px' },
                        { height: '100px' },
                        { height: '120px' },
                        { height: '180px' },
                        { height: '60px' }
                      ].map((bar, index) => (
                        <div key={index} className="flex flex-col items-center space-y-2">
                          <div 
                            className="w-8 bg-gray-200 animate-pulse rounded-t-lg"
                            style={{ height: bar.height }}
                          ></div>
                          <div className="w-8 h-3 bg-gray-200 animate-pulse rounded"></div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 flex justify-between items-center">
                    <div className="h-4 w-48 bg-gray-200 animate-pulse rounded"></div>
                  </div>
                </div>

                {/* Resume Section Skeleton */}
                <div className="bg-white rounded-xl p-6 border border-gray-200">
                  <div className="flex items-center justify-between mb-6">
                    <div className="h-6 w-64 bg-gray-200 animate-pulse rounded"></div>
                    <div className="h-4 w-24 bg-gray-200 animate-pulse rounded"></div>
                  </div>

                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 flex-1">
                        <div className="w-12 h-12 bg-gray-300 animate-pulse rounded-xl"></div>
                        <div className="flex-1">
                          <div className="h-5 w-48 bg-gray-300 animate-pulse rounded mb-2"></div>
                          <div className="h-4 w-32 bg-gray-300 animate-pulse rounded"></div>
                        </div>
                      </div>
                      <div className="h-12 w-28 bg-gray-300 animate-pulse rounded-lg"></div>
                    </div>

                    <div className="mt-6">
                      <div className="flex justify-between mb-2">
                        <div className="h-3 w-32 bg-gray-300 animate-pulse rounded"></div>
                        <div className="h-3 w-8 bg-gray-300 animate-pulse rounded"></div>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full">
                        <div className="h-2 bg-gray-300 animate-pulse rounded-full w-1/3"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Sidebar Skeleton */}
              <div className="space-y-6">
                {/* Homework Section Skeleton */}
                <div className="bg-white rounded-xl p-6 border border-gray-200">
                  <div className="flex items-center justify-between mb-6">
                    <div className="h-6 w-32 bg-gray-200 animate-pulse rounded"></div>
                    <div className="h-4 w-16 bg-gray-200 animate-pulse rounded"></div>
                  </div>

                  <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map((homework) => (
                      <div key={homework} className="flex items-center justify-between py-2 px-2 rounded-lg">
                        <div className="flex items-center space-x-3 flex-1">
                          <div className="w-2 h-2 bg-gray-200 animate-pulse rounded-full"></div>
                          <div className="flex-1">
                            <div className="h-4 w-32 bg-gray-200 animate-pulse rounded mb-1"></div>
                            <div className="h-3 w-48 bg-gray-200 animate-pulse rounded"></div>
                          </div>
                        </div>
                        <div className="w-6 h-6 bg-gray-200 animate-pulse rounded-full"></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Loading indicator */}
            <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 border border-gray-200">
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-300 border-t-blue-600"></div>
                <span className="text-sm text-gray-600">Chargement de votre dashboard...</span>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const homeworkStatuses = getHomeworkStatuses();

  return (
    <div className="min-h-screen bg-gray-50 relative z-50">
      {/* Sidebar Component */}
      <DashboardSidebar
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        ></div>
      )}

      {/* Main Content */}
      <div className="lg:ml-64 relative z-40 bg-gray-50 min-h-screen">
        {/* Header Component */}
        <DashboardHeader
          user={user}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
          homeworkSends={homeworkSends}
          tajwidHomeworkSends={tajwidHomeworkSends}
        />

        {/* Main Dashboard Content */}
        <main className="p-4 lg:p-8">
          {/* Welcome Section */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2" style={{ fontFamily: "'Spectral', sans serif", fontSize: "1.7rem" }}>
              Salut, {user.username || (user.gender === 'FEMME' ? 'Étudiante' : 'Étudiant')} !
            </h1>
            <p className="text-gray-500">Prêt à progresser ? Voici votre Tableau de bord !</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center space-x-4">
                <div className="relative w-12 h-12">
                  <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#e5e7eb"
                      strokeWidth="2"
                    />
                    <path
                      d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke={progressPercentage === 100 ? "#10b981" : "#1e40af"}
                      strokeWidth="2"
                      strokeDasharray={`${progressPercentage}, 100`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <GraduationCap className="h-5 w-5 text-gray-600" />
                  </div>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Progression étudiant</p>
                  <p className="text-2xl font-bold text-gray-900">{progressPercentage}%</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center space-x-4">
                <div className="relative w-12 h-12">
                  <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#e5e7eb"
                      strokeWidth="2"
                    />
                    <path
                      d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke={
                        (completedPagesCount / totalPages * 100) === 100
                          ? "#10b981"
                          : "#1e40af"
                      }
                      strokeWidth="2"
                      strokeDasharray={`${totalPages > 0 ? (completedPagesCount / totalPages * 100) : 0}, 100`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <BookOpen className="h-5 w-5 text-gray-600" />
                  </div>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Leçons complétées</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {completedPagesCount}/{totalPages}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center space-x-4">
                <div className="relative w-12 h-12">
                  <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#e5e7eb"
                      strokeWidth="2"
                    />
                    <path
                      d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke={
                        (completedQuizzesCount / totalQuizzes * 100) === 100
                          ? "#10b981"
                          : "#1e40af"
                      }
                      strokeWidth="2"
                      strokeDasharray={`${totalQuizzes > 0 ? (completedQuizzesCount / totalQuizzes * 100) : 0}, 100`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Users className="h-5 w-5 text-gray-600" />
                  </div>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Quiz complétés</p>
                  <p className="text-2xl font-bold text-gray-900">{completedQuizzesCount}/{totalQuizzes}</p>
                </div>
              </div>
            </div>

            {/* Nouvelle carte pour le temps d'étude */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center space-x-4">
                <div className="relative w-12 h-12">
                  <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#e5e7eb"
                      strokeWidth="2"
                    />
                    <path
                      d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#1e40af"
                      strokeWidth="2"
                      strokeDasharray="75, 100"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Clock className="h-5 w-5 text-gray-600" />
                  </div>
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
  {/* Progress Chart Section - AVEC VRAIES DONNÉES */}
  <div className="bg-white rounded-xl p-6 border border-gray-200 mb-6">
    <div className="flex items-center justify-between mb-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">Progression</h3>
        {/* ✨ NOUVEAU : Afficher la source des données */}
        {dataSource === 'REAL_DATA' && (
          <p className="text-xs text-green-600 mt-1">✅ Données réelles</p>
        )}
        {dataSource === 'FALLBACK' && (
          <p className="text-xs text-orange-600 mt-1">⚠️ Données en attente de mise à jour</p>
        )}
      </div>
      <div className="flex items-center space-x-4">
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
    {chartDataLoading ? (
      <div className="h-64 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto mb-2"></div>
          <p className="text-gray-500 text-sm">Chargement des données...</p>
        </div>
      </div>
    ) : (
      <div className="relative" style={{ height: '256px' }}>
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-400 pr-4">
          <span>100</span>
          <span>75</span>
          <span>50</span>
          <span>25</span>
          <span>0</span>
        </div>

        {/* Chart area - UTILISE LES VRAIES DONNÉES */}
        <div className="ml-8 h-full flex items-end justify-between space-x-2">
          {/* Barres basées sur les VRAIES données */}
          {(selectedPeriod === 'week' ? weekData.sort((a, b) => {
            const dayOrder = { 'Lun': 0, 'Mar': 1, 'Mer': 2, 'Jeu': 3, 'Ven': 4, 'Sam': 5, 'Dim': 6 };
              const aOrder = (dayOrder as Record<string, number>)[String(a.day)] ?? 7;
              const bOrder = (dayOrder as Record<string, number>)[String(b.day)] ?? 7;
              return aOrder - bOrder;
          }) : monthData).map((day: { percentage: any; completed: any; total: any; day: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; }, index: Key | null | undefined) => (
            <div key={index} className="flex flex-col items-center space-y-2">
              {/* Bar container */}
              <div className="relative w-8 bg-gray-100 rounded-t-lg overflow-hidden" style={{ height: '216px' }}>
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
    )}

    {/* Légende et statistiques */}
    <div className="mt-4 flex justify-between items-center text-sm text-gray-500">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-blue-800 rounded"></div>
          <span>
            {selectedPeriod === 'week' ? 'Progression en semaine' : 'Progression en mois'}
          </span>
        </div>
      </div>
    </div>
  </div>

  {/* Resume Section */}
  <div className={`bg-white rounded-xl p-4 sm:p-6 border ${
    selectedModule === 'LECTURE' ? 'border-blue-200' : 'border-purple-200'
  }`}>
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6">
      <h3 className="text-lg font-semibold text-gray-900">
        Reprendre {selectedModule === 'TAJWID' ? 'Tajwid' : 'Lecture'}
      </h3>
      <span className={`${selectedModule === 'LECTURE' ? 'text-blue-800' : 'text-purple-800'} text-sm font-medium mt-2 sm:mt-0`}>
        {progressPercentage}% progression globale
      </span>
    </div>

    {(() => {
      const getNextPageToComplete = () => {
        // Utiliser les chapitres selon le module sélectionné
        const moduleChapters = selectedModule === 'TAJWID' ? chaptersTajwid : chapters;
        const completedPagesArray = Array.from(completedPages).filter(p => p !== 30 && p !== 0);
        
        // Générer le prefix d'URL basé sur le module
        const urlPrefix = selectedModule === 'TAJWID' ? '/chapitres-tajwid' : '/chapitres';

        if (completedPagesArray.length === 0 && moduleChapters.length > 0) {
          const firstChapter = moduleChapters[0];
          // Vérifier que le chapitre a des pages
          if (!firstChapter.pages || firstChapter.pages.length === 0) {
            return { 
              chapterNumber: firstChapter.chapterNumber, 
              pageNumber: 1,
              pageTitle: 'Introduction',
              chapterTitle: firstChapter.title,
              href: `${urlPrefix}/${firstChapter.chapterNumber}/1`,
              isFirstPage: true 
            };
          }
          const firstPage = firstChapter.pages.find(p => p.pageNumber !== 0) || firstChapter.pages[0];
          if (!firstPage) {
            return { 
              chapterNumber: firstChapter.chapterNumber, 
              pageNumber: 1,
              pageTitle: 'Introduction',
              chapterTitle: firstChapter.title,
              href: `${urlPrefix}/${firstChapter.chapterNumber}/1`,
              isFirstPage: true 
            };
          }
          return { 
            chapterNumber: firstChapter.chapterNumber, 
            pageNumber: firstPage.pageNumber,
            pageTitle: firstPage.title,
            chapterTitle: firstChapter.title,
            href: `${urlPrefix}/${firstChapter.chapterNumber}/${firstPage.pageNumber}`,
            isFirstPage: true 
          };
        }

        for (const chapter of moduleChapters) {
          if (chapter.chapterNumber === 11) continue;

          for (const page of chapter.pages) {
            if (!completedPages.has(page.pageNumber)) {
              return {
                chapterNumber: chapter.chapterNumber,
                pageNumber: page.pageNumber,
                pageTitle: page.title,
                chapterTitle: chapter.title,
                href: `${urlPrefix}/${chapter.chapterNumber}/${page.pageNumber}`,
                isFirstPage: false
              };
            }
          }

          if (chapter.quiz && !completedQuizzes.has(chapter.chapterNumber)) {
            return {
              chapterNumber: chapter.chapterNumber,
              pageNumber: null,
              pageTitle: 'Quiz du chapitre',
              chapterTitle: chapter.title,
              href: `${urlPrefix}/${chapter.chapterNumber}/quiz`,
              isQuiz: true,
              isFirstPage: false
            };
          }
        }

        // Si tous les chapitres sont complets
        const moduleChaptersList = selectedModule === 'TAJWID' ? chaptersTajwid : chapters;
        const lastChapter = moduleChaptersList[moduleChaptersList.length - 1];
        return {
          chapterNumber: lastChapter?.chapterNumber || 1,
          pageNumber: 1,
          pageTitle: 'Module terminé',
          chapterTitle: lastChapter?.title || 'Terminé',
          href: `${urlPrefix}/${lastChapter?.chapterNumber || 1}/1`,
          isCompleted: true,
          isFirstPage: false
        };
      };

      const nextPage = getNextPageToComplete();

      if (nextPage.isCompleted) {
        return (
          <div className="text-center py-8 sm:py-12">
            <div className={`w-16 h-16 ${selectedModule === 'LECTURE' ? 'bg-blue-100' : 'bg-purple-100'} rounded-full flex items-center justify-center mx-auto mb-4`}>
              <Award className={`h-8 w-8 ${selectedModule === 'LECTURE' ? 'text-blue-600' : 'text-purple-600'}`} />
            </div>
            <h4 className="text-xl font-bold text-gray-900 mb-2">
              Félicitations !
            </h4>
            <p className="text-gray-600 mb-6">
              Vous avez terminé le module {selectedModule === 'TAJWID' ? 'Tajwid' : 'Lecture'} !
            </p>
            <Link
              href={selectedModule === 'TAJWID' ? '/chapitres-tajwid/1/1' : '/chapitres/11/30'}
              className={`inline-flex items-center space-x-2 ${selectedModule === 'LECTURE' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-purple-600 hover:bg-purple-700'} text-white font-semibold px-6 py-3 rounded-lg transition-colors`}
            >
              <Award className="h-5 w-5" />
              <span>Revoir le cours</span>
            </Link>
          </div>
        );
      }

      return (
        <div className={`bg-gradient-to-r ${
          selectedModule === 'LECTURE' 
            ? 'from-blue-50 to-indigo-50 border-blue-200' 
            : 'from-purple-50 to-pink-50 border-purple-200'
        } rounded-xl p-4 sm:p-6 border`}>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <div className={`w-12 h-12 flex-shrink-0 ${selectedModule === 'LECTURE' ? 'bg-blue-800' : 'bg-purple-800'} rounded-xl flex items-center justify-center`}>
                <span className="text-white font-bold">
                  {nextPage.chapterNumber}
                </span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base">
                  Chapitre {nextPage.chapterNumber} - {nextPage.chapterTitle}
                </h4>
                <p className="text-xs sm:text-sm text-gray-600">
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
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      selectedModule === 'LECTURE' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                    }`}>
                      Commencer {selectedModule === 'TAJWID' ? 'le Tajwid' : 'la Lecture'}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <Link
              href={nextPage.href || (selectedModule === 'TAJWID' ? '/chapitres-tajwid/1/1' : '/chapitres/1/1')}
              onClick={() => {
                // Toujours ouvrir la sidebar cours automatiquement
                localStorage.setItem('courseStarted', 'true');
                localStorage.setItem('autoOpenCourseSidebar', 'true');
                
                if (nextPage.isFirstPage) {
                  fetch('/api/auth/time/start', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                  }).catch(console.error);
                }
              }}
              className={`mt-4 md:mt-0 inline-flex items-center space-x-2 ${
                selectedModule === 'LECTURE' ? 'bg-blue-800 hover:bg-blue-900' : 'bg-purple-800 hover:bg-purple-900'
              } text-white font-semibold px-6 py-3 rounded-lg transition-colors group`}
            >
              <span>{nextPage.isFirstPage ? 'Commencer' : 'Reprendre'}</span>
              <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="mt-4 sm:mt-6">
            <div className="flex justify-between text-xs sm:text-sm mb-2">
              <span className="text-gray-600">Progression du chapitre {nextPage.chapterNumber}</span>
              <span className="text-gray-900 font-medium">
                {(() => {
                  const moduleChaptersList = selectedModule === 'TAJWID' ? chaptersTajwid : chapters;
                  const chapter = moduleChaptersList.find(ch => ch.chapterNumber === nextPage.chapterNumber);
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
                className={`h-2 ${selectedModule === 'LECTURE' ? 'bg-blue-800' : 'bg-purple-800'} rounded-full transition-all duration-500`}
                style={{
                  width: `${(() => {
                    const moduleChaptersList = selectedModule === 'TAJWID' ? chaptersTajwid : chapters;
                    const chapter = moduleChaptersList.find(ch => ch.chapterNumber === nextPage.chapterNumber);
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
              <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Devoirs {userModule === 'TAJWID' ? 'Tajwid' : ''} <span className="text-gray-400">(10)</span>
                  </h3>
                  <Link
                    href={userModule === 'TAJWID' ? '/devoirs-tajwid' : '/devoirs'}
                    className="text-blue-800 text-sm font-medium hover:underline cursor-pointer"
                  >
                   Voir plus
                  </Link>
                </div>

                {/* Container avec scrollbar */}
                <div className="max-h-80 sm:max-h-96 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                  <div className="space-y-3 sm:space-y-4">
                    {homeworkLoading ? (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                        <p className="text-gray-500 text-sm mt-2">Chargement...</p>
                      </div>
                    ) : (
                      homeworkStatuses.map((homework, index) => (
                        <div key={homework.chapterId} className="flex items-center justify-between py-2 px-2 rounded-lg hover:bg-gray-50 transition-colors">
                          <div className="flex items-center space-x-3 min-w-0 flex-1">
                            <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                              homework.status === 'sent'
                                ? 'bg-green-500'
                                : homework.status === 'failed'
                                ? 'bg-red-500'
                                : 'bg-orange-400'
                            }`}></div>
                            <div className="min-w-0 flex-1">
                              <p className="font-medium text-gray-900 text-sm sm:text-base truncate">
                                {homework.title}
                              </p>
                              <div className="text-slate-400 text-xs mt-1">
                                {homework.status === 'pending' ? (
                                  <span className="text-orange-500">
                                    En attente - Terminez le chapitre pour recevoir le devoir
                                  </span>
                                ) : homework.status === 'sent' && homework.sentAt ? (
                                  <span className="text-green-600">
                                    Envoyé le {new Date(homework.sentAt).toLocaleDateString('fr-FR')}
                                  </span>
                                ) : homework.status === 'failed' ? (
                                  <span className="text-red-600">
                                    Échec - Chapitre complété mais devoir non envoyé
                                  </span>
                                ) : (
                                  <span className="text-gray-500">
                                    Statut inconnu
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center flex-shrink-0 ml-2 ${
                            homework.status === 'sent'
                              ? 'bg-green-500'
                              : homework.status === 'failed'
                              ? 'bg-red-500'
                              : 'border-2 border-orange-400'
                          }`}>
                            {homework.status === 'sent' && (
                              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full"></div>
                            )}
                            {homework.status === 'failed' && (
                              <X className="w-3 h-3 text-white" />
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}