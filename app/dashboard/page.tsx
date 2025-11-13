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
  Menu
} from 'lucide-react';
import { useUserProgress } from '@/hooks/useUserProgress';
import { chapters } from '@/lib/chapters';
import { useSimpleTimer } from '@/hooks/useSimpleTimer';
import useRealProgressChart from '@/hooks/useRealProgressChart';
import Logo from '@/app/components/Logo';
import DashboardHeader from '@/app/components/DashboardHeader';
import DashboardSidebar from '@/app/components/DashboardSidebar';

interface User {
  id: string;
  email: string;
  username: string | null;
  gender: 'HOMME' | 'FEMME' | null;
  isActive: boolean;
  accountType?: 'FREE_TRIAL' | 'PAID_FULL';
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


export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month'>('week');
  const [homeworkSends, setHomeworkSends] = useState<HomeworkSend[]>([]);
  const [homeworkLoading, setHomeworkLoading] = useState(true);
  const router = useRouter();

  const {
    completedPages,
    completedQuizzes,
    isLoading: progressLoading,
  } = useUserProgress();

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

  // ✨ NOUVEAU : Récupérer les VRAIES données du graphique
  const {
    weekData,
    monthData,
    monthlyStats,
    isLoading: chartDataLoading,
    dataSource
  } = useRealProgressChart();

  // Calculer la progression
  const calculateProgress = () => {
    const totalPages = chapters
      .filter(ch => ch.chapterNumber !== 11)
      .reduce((total, ch) => total + ch.pages.filter(p => p.pageNumber !== 30).length, 0);
    const totalQuizzes = chapters
      .filter(ch => ch.quiz && ch.quiz.length > 0 && ch.chapterNumber !== 11)
      .length;
    const totalItems = totalPages + totalQuizzes;
    // Page 0 incluse, page 30 exclue
    const completedPagesFiltered = Array.from(completedPages).filter(pageNum => pageNum !== 30);
    const completedQuizzesFiltered = Array.from(completedQuizzes).filter(quizNum => quizNum !== 11);
    const completedItems = completedPagesFiltered.length + completedQuizzesFiltered.length;
    return totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
  };

  // Calculer les totaux
  const getTotals = () => {
    const totalPages = chapters
      .filter(ch => ch.chapterNumber !== 11)
      .reduce((total, ch) => total + ch.pages.filter(p => p.pageNumber !== 30).length, 0);
    const totalQuizzes = chapters
      .filter(ch => ch.quiz && ch.quiz.length > 0 && ch.chapterNumber !== 11)
      .length;
    return { totalPages, totalQuizzes };
  };

  const progressPercentage = calculateProgress();
  const { totalPages, totalQuizzes } = getTotals();

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
      status: 'sent' | 'pending';
      sentAt?: string;
    }> = [];

    // Parcourir tous les chapitres (1-10)
    for (let chapterId = 1; chapterId <= 10; chapterId++) {
      const chapter = chapters.find(ch => ch.chapterNumber === chapterId);
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
      const chapterPages = chapter.pages.map(p => p.pageNumber);
      const chapterCompleted = chapterPages.every(pageNum => completedPages.has(pageNum));
      const chapterQuizCompleted = !chapter.quiz || completedQuizzes.has(chapterId);
      const isChapterFullyCompleted = chapterCompleted && chapterQuizCompleted;

      // Chercher si le devoir a été envoyé
      const sentHomework = homeworkSends.find(send => send.homework.chapterId === chapterId);

      if (sentHomework) {
        statuses.push({
          chapterId,
          title: sentHomework.homework.title,
          status: 'sent',
          sentAt: sentHomework.sentAt
        });
      } else {
        statuses.push({
          chapterId,
          title: `Devoir du chapitre ${chapterId}`,
          status: isChapterFullyCompleted ? 'sent' : 'pending'
        });
      }
    }

    return statuses;
  };

  const fetchHomeworkSends = async () => {
    try {
      const response = await fetch('/api/homework/user-sends');
      if (response.ok) {
        const data = await response.json();
        setHomeworkSends(data.sends || []);
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

  const homeworkStatuses = getHomeworkStatuses();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar Component */}
      <DashboardSidebar
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        user={user!}
      />

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        ></div>
      )}

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Header Component */}
        <DashboardHeader
          user={user}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
          homeworkSends={homeworkSends}
        />

        {/* Main Dashboard Content */}
        <main className="p-4 lg:p-8">
          {/* Welcome Section */}
          <div className="mb-8">
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
                        (Array.from(completedPages).filter(pageNum => pageNum !== 30).length / 30 * 100) === 100
                          ? "#10b981"
                          : "#1e40af"
                      }
                      strokeWidth="2"
                      strokeDasharray={`${Array.from(completedPages).filter(pageNum => pageNum !== 30).length / 30 * 100}, 100`}
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
                    {Array.from(completedPages).filter(pageNum => pageNum !== 30).length}/30
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
                        (completedQuizzes.size / 11 * 100) === 100
                          ? "#10b981"
                          : "#1e40af"
                      }
                      strokeWidth="2"
                      strokeDasharray={`${completedQuizzes.size / 11 * 100}, 100`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Users className="h-5 w-5 text-gray-600" />
                  </div>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Quiz complétés</p>
                  <p className="text-2xl font-bold text-gray-900">{completedQuizzes.size}/11</p>
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
  <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200">
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6">
      <h3 className="text-lg font-semibold text-gray-900">
        Reprendre où vous vous êtes arrêté
      </h3>
      <span className="text-blue-800 text-sm font-medium mt-2 sm:mt-0">
        {progressPercentage}% complété
      </span>
    </div>

    {(() => {
      const getNextPageToComplete = () => {
        const completedPagesArray = Array.from(completedPages).filter(p => p !== 30);

        if (completedPagesArray.length === 0) {
          return { chapterNumber: 1, pageNumber: 1, isFirstPage: true };
        }

        for (const chapter of chapters) {
          if (chapter.chapterNumber === 11) continue;


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
          <div className="text-center py-8 sm:py-12">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="h-8 w-8 text-green-600" />
            </div>
            <h4 className="text-xl font-bold text-gray-900 mb-2">
              Félicitations !
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
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 sm:p-6 border border-blue-200">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="w-12 h-12 flex-shrink-0 bg-blue-800 rounded-xl flex items-center justify-center">
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
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Commencer l'aventure
                    </span>
                  </div>
                )}
              </div>
            </div>

            <Link
              href={nextPage.href || '/chapitres/1/1'}
              onClick={() => {
                if (nextPage.isFirstPage) {
                  localStorage.setItem('courseStarted', 'true');
                  fetch('/api/auth/time/start', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                  }).catch(console.error);
                }
              }}
              className="mt-4 md:mt-0 inline-flex items-center space-x-2 bg-blue-800 hover:bg-blue-900 text-white font-semibold px-6 py-3 rounded-lg transition-colors group"
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
              <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Devoirs <span className="text-gray-400">(10)</span>
                  </h3>
                  <Link
                    href="/devoirs"
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
                            <div className={`w-2 h-2 rounded-full flex-shrink-0 ${homework.status === 'sent' ? 'bg-blue-800' : 'bg-gray-300'
                              }`}></div>
                            <div className="min-w-0 flex-1">
                              <p className="font-medium text-gray-900 text-sm sm:text-base truncate">
                                {homework.title}
                              </p>
                              <div className="text-slate-400 text-xs mt-1">
                                {homework.status === 'pending' ? (
                                  <span className="text-orange-500">
                                    Terminez le chapitre pour recevoir le devoir
                                  </span>
                                ) : homework.sentAt ? (
                                  <span className="text-green-600">
                                    Le devoir a été envoyé le {new Date(homework.sentAt).toLocaleDateString('fr-FR')}
                                  </span>
                                ) : (
                                  <span className="text-red-600">
                                    Chapitre et quiz complétés, mais devoir inexistant.
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center flex-shrink-0 ml-2 ${homework.status === 'sent'
                            ? 'bg-blue-800'
                            : 'border-2 border-gray-300'
                            }`}>
                            {homework.status === 'sent' && (
                              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full"></div>
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