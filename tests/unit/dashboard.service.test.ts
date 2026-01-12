// tests/unit/dashboard.service.test.ts
// Tests unitaires pour le Dashboard élève

import { describe, it, expect, vi, beforeEach } from 'vitest';

// =====================================================
// TYPES
// =====================================================

interface UserDashboardData {
  userId: string;
  username: string;
  email: string;
  module: 'LECTURE' | 'TAJWID';
  completedPages: number[];
  completedQuizzes: number[];
  studyTime: number;
  lastActivityDate: Date;
  subscriptionPlan: 'SOLO' | 'COACHING';
  subscriptionEndDate: Date | null;
}

interface DashboardStats {
  totalProgress: number;
  completedPagesCount: number;
  completedQuizzesCount: number;
  totalPages: number;
  totalQuizzes: number;
  studyTimeFormatted: string;
  level: { level: number; title: string };
  isSubscriptionActive: boolean;
  daysRemaining: number | null;
}

interface ChapterProgress {
  chapterNumber: number;
  title: string;
  progress: number;
  isCompleted: boolean;
  pagesCompleted: number;
  totalPages: number;
  quizCompleted: boolean;
}

// =====================================================
// FONCTIONS À TESTER
// =====================================================

/**
 * Calcule les statistiques du dashboard
 */
function calculateDashboardStats(
  userData: UserDashboardData,
  totalPages: number,
  totalQuizzes: number
): DashboardStats {
  const completedPagesCount = userData.completedPages.length;
  const completedQuizzesCount = userData.completedQuizzes.length;
  
  const totalItems = totalPages + totalQuizzes;
  const completedItems = completedPagesCount + completedQuizzesCount;
  
  const totalProgress = totalItems > 0 
    ? Math.round((completedItems / totalItems) * 100) 
    : 0;

  const level = calculateLevel(totalProgress);
  
  const isSubscriptionActive = userData.subscriptionEndDate 
    ? new Date(userData.subscriptionEndDate) > new Date()
    : false;
  
  const daysRemaining = userData.subscriptionEndDate
    ? Math.max(0, Math.ceil((new Date(userData.subscriptionEndDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : null;

  return {
    totalProgress,
    completedPagesCount,
    completedQuizzesCount,
    totalPages,
    totalQuizzes,
    studyTimeFormatted: formatStudyTime(userData.studyTime),
    level,
    isSubscriptionActive,
    daysRemaining
  };
}

/**
 * Calcule le niveau basé sur la progression
 */
function calculateLevel(progress: number): { level: number; title: string } {
  if (progress >= 100) return { level: 10, title: 'Expert' };
  if (progress >= 90) return { level: 9, title: 'Maître' };
  if (progress >= 80) return { level: 8, title: 'Avancé' };
  if (progress >= 70) return { level: 7, title: 'Confirmé' };
  if (progress >= 60) return { level: 6, title: 'Intermédiaire+' };
  if (progress >= 50) return { level: 5, title: 'Intermédiaire' };
  if (progress >= 40) return { level: 4, title: 'Apprenti+' };
  if (progress >= 30) return { level: 3, title: 'Apprenti' };
  if (progress >= 15) return { level: 2, title: 'Novice' };
  return { level: 1, title: 'Débutant' };
}

/**
 * Formate le temps d'étude
 */
function formatStudyTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (hours > 0) {
    return minutes > 0 ? `${hours}h ${minutes}min` : `${hours}h`;
  }
  return `${minutes}min`;
}

/**
 * Calcule la progression de chaque chapitre
 */
function calculateChaptersProgress(
  chapters: Array<{ chapterNumber: number; title: string; pages: number[]; hasQuiz: boolean }>,
  completedPages: number[],
  completedQuizzes: number[]
): ChapterProgress[] {
  return chapters.map(chapter => {
    const pagesCompleted = chapter.pages.filter(p => completedPages.includes(p)).length;
    const totalPages = chapter.pages.length;
    const quizCompleted = chapter.hasQuiz ? completedQuizzes.includes(chapter.chapterNumber) : true;
    
    const totalItems = totalPages + (chapter.hasQuiz ? 1 : 0);
    const completedItems = pagesCompleted + (quizCompleted && chapter.hasQuiz ? 1 : 0);
    
    const progress = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
    
    return {
      chapterNumber: chapter.chapterNumber,
      title: chapter.title,
      progress,
      isCompleted: progress === 100,
      pagesCompleted,
      totalPages,
      quizCompleted
    };
  });
}

/**
 * Obtient le prochain contenu à étudier
 */
function getNextContent(
  chaptersProgress: ChapterProgress[]
): { type: 'page' | 'quiz' | 'completed'; chapterNumber?: number; pageNumber?: number } {
  for (const chapter of chaptersProgress) {
    if (!chapter.isCompleted) {
      if (chapter.pagesCompleted < chapter.totalPages) {
        return {
          type: 'page',
          chapterNumber: chapter.chapterNumber,
          pageNumber: chapter.pagesCompleted + 1
        };
      }
      if (!chapter.quizCompleted) {
        return {
          type: 'quiz',
          chapterNumber: chapter.chapterNumber
        };
      }
    }
  }
  return { type: 'completed' };
}

/**
 * Calcule les statistiques de performance
 */
function calculatePerformanceStats(
  completedQuizzes: number[],
  quizScores: Map<number, number> // chapterNumber -> score (0-100)
): { averageScore: number; bestScore: number; worstScore: number; totalQuizzesTaken: number } {
  if (completedQuizzes.length === 0) {
    return { averageScore: 0, bestScore: 0, worstScore: 0, totalQuizzesTaken: 0 };
  }

  const scores = completedQuizzes
    .map(q => quizScores.get(q) ?? 75) // Score par défaut 75 si non trouvé
    .filter(s => s !== undefined);

  const total = scores.reduce((sum, score) => sum + score, 0);
  
  return {
    averageScore: Math.round(total / scores.length),
    bestScore: Math.max(...scores),
    worstScore: Math.min(...scores),
    totalQuizzesTaken: scores.length
  };
}

/**
 * Génère un message de motivation basé sur la progression
 */
function getMotivationalMessage(progress: number, studyStreak: number): string {
  if (progress === 100) {
    return '🎉 Félicitations ! Tu as terminé tout le cours !';
  }
  if (progress >= 90) {
    return '🌟 Tu y es presque ! Encore un petit effort !';
  }
  if (progress >= 75) {
    return '💪 Excellent travail ! Continue comme ça !';
  }
  if (progress >= 50) {
    return '📚 Tu as passé la moitié du chemin ! Bravo !';
  }
  if (progress >= 25) {
    return '🚀 Bon début ! Tu progresses bien !';
  }
  if (studyStreak >= 7) {
    return `🔥 ${studyStreak} jours consécutifs ! Quelle assiduité !`;
  }
  if (studyStreak >= 3) {
    return `✨ ${studyStreak} jours de suite ! Continue !`;
  }
  return '👋 Bienvenue ! Commence ton apprentissage dès maintenant !';
}

/**
 * Vérifie si l'abonnement est proche de l'expiration
 */
function isSubscriptionExpiringSoon(endDate: Date | null, daysThreshold: number = 7): boolean {
  if (!endDate) return false;
  
  const now = new Date();
  const diffDays = Math.ceil((new Date(endDate).getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  
  return diffDays > 0 && diffDays <= daysThreshold;
}

/**
 * Calcule le pourcentage de complétion par module
 */
function getModuleCompletion(
  module: 'LECTURE' | 'TAJWID',
  completedPages: number[],
  completedQuizzes: number[],
  moduleConfig: { totalPages: number; totalQuizzes: number; excludedPages: number[] }
): number {
  const validPages = completedPages.filter(p => !moduleConfig.excludedPages.includes(p));
  const totalItems = moduleConfig.totalPages + moduleConfig.totalQuizzes;
  const completedItems = validPages.length + completedQuizzes.length;
  
  if (totalItems === 0) return 0;
  return Math.min(100, Math.round((completedItems / totalItems) * 100));
}

// =====================================================
// DONNÉES DE TEST
// =====================================================

const sampleUserData: UserDashboardData = {
  userId: 'user-123',
  username: 'TestUser',
  email: 'test@example.com',
  module: 'LECTURE',
  completedPages: [1, 2, 3, 4, 5],
  completedQuizzes: [1, 2],
  studyTime: 3600, // 1 heure
  lastActivityDate: new Date(),
  subscriptionPlan: 'SOLO',
  subscriptionEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // +30 jours
};

const sampleChapters = [
  { chapterNumber: 1, title: 'Chapitre 1', pages: [1, 2, 3], hasQuiz: true },
  { chapterNumber: 2, title: 'Chapitre 2', pages: [4, 5, 6], hasQuiz: true },
  { chapterNumber: 3, title: 'Chapitre 3', pages: [7, 8, 9], hasQuiz: true }
];

// =====================================================
// TESTS UNITAIRES
// =====================================================

describe('📊 Dashboard Service - Tests Unitaires', () => {

  // =====================================================
  // 1. CALCUL DES STATISTIQUES DU DASHBOARD
  // =====================================================
  describe('📈 Statistiques du Dashboard', () => {
    
    it('✅ calcule les stats correctement', () => {
      const stats = calculateDashboardStats(sampleUserData, 29, 8);
      
      expect(stats.completedPagesCount).toBe(5);
      expect(stats.completedQuizzesCount).toBe(2);
      expect(stats.totalPages).toBe(29);
      expect(stats.totalQuizzes).toBe(8);
    });

    it('✅ calcule la progression totale', () => {
      const stats = calculateDashboardStats(sampleUserData, 29, 8);
      // 7 items complétés sur 37 total = 18.9% arrondi à 19%
      expect(stats.totalProgress).toBe(19);
    });

    it('✅ formate le temps d\'étude', () => {
      const stats = calculateDashboardStats(sampleUserData, 29, 8);
      expect(stats.studyTimeFormatted).toBe('1h');
    });

    it('✅ calcule le niveau', () => {
      const stats = calculateDashboardStats(sampleUserData, 29, 8);
      expect(stats.level.level).toBe(2); // 19% = Novice
      expect(stats.level.title).toBe('Novice');
    });

    it('✅ vérifie l\'abonnement actif', () => {
      const stats = calculateDashboardStats(sampleUserData, 29, 8);
      expect(stats.isSubscriptionActive).toBe(true);
      expect(stats.daysRemaining).toBeGreaterThan(0);
    });

    it('✅ gère l\'abonnement expiré', () => {
      const expiredUser = {
        ...sampleUserData,
        subscriptionEndDate: new Date(Date.now() - 1000) // Passé
      };
      const stats = calculateDashboardStats(expiredUser, 29, 8);
      expect(stats.isSubscriptionActive).toBe(false);
    });
  });

  // =====================================================
  // 2. CALCUL DU NIVEAU
  // =====================================================
  describe('🎮 Calcul du Niveau', () => {
    
    it('✅ niveau Débutant (0-14%)', () => {
      expect(calculateLevel(0).title).toBe('Débutant');
      expect(calculateLevel(14).title).toBe('Débutant');
    });

    it('✅ niveau Novice (15-29%)', () => {
      expect(calculateLevel(15).title).toBe('Novice');
      expect(calculateLevel(29).title).toBe('Novice');
    });

    it('✅ niveau Intermédiaire (50-59%)', () => {
      expect(calculateLevel(50).title).toBe('Intermédiaire');
      expect(calculateLevel(59).title).toBe('Intermédiaire');
    });

    it('✅ niveau Expert (100%)', () => {
      expect(calculateLevel(100).title).toBe('Expert');
      expect(calculateLevel(100).level).toBe(10);
    });
  });

  // =====================================================
  // 3. PROGRESSION PAR CHAPITRE
  // =====================================================
  describe('📖 Progression par Chapitre', () => {
    
    it('✅ calcule la progression de chaque chapitre', () => {
      const progress = calculateChaptersProgress(
        sampleChapters,
        [1, 2, 3, 4], // Pages complétées
        [1] // Quiz complétés
      );
      
      expect(progress).toHaveLength(3);
      expect(progress[0].isCompleted).toBe(true); // Chapitre 1: 3/3 pages + quiz
      expect(progress[1].isCompleted).toBe(false); // Chapitre 2: 1/3 pages
    });

    it('✅ chapitre sans quiz complété', () => {
      const chaptersNoQuiz = [
        { chapterNumber: 1, title: 'Chapitre 1', pages: [1, 2], hasQuiz: false }
      ];
      const progress = calculateChaptersProgress(chaptersNoQuiz, [1, 2], []);
      
      expect(progress[0].isCompleted).toBe(true);
      expect(progress[0].quizCompleted).toBe(true);
    });

    it('✅ calcule le pourcentage de progression', () => {
      const progress = calculateChaptersProgress(
        sampleChapters,
        [1, 2], // 2/3 pages du chapitre 1
        []
      );
      
      // Chapitre 1: 2 pages sur 3 + quiz non fait = 2/4 = 50%
      expect(progress[0].progress).toBe(50);
    });
  });

  // =====================================================
  // 4. PROCHAIN CONTENU À ÉTUDIER
  // =====================================================
  describe('➡️ Prochain Contenu', () => {
    
    it('✅ retourne la prochaine page', () => {
      const chaptersProgress: ChapterProgress[] = [
        { chapterNumber: 1, title: 'Ch1', progress: 50, isCompleted: false, pagesCompleted: 2, totalPages: 3, quizCompleted: false }
      ];
      
      const next = getNextContent(chaptersProgress);
      expect(next.type).toBe('page');
      expect(next.chapterNumber).toBe(1);
      expect(next.pageNumber).toBe(3);
    });

    it('✅ retourne le quiz si toutes les pages sont faites', () => {
      const chaptersProgress: ChapterProgress[] = [
        { chapterNumber: 1, title: 'Ch1', progress: 75, isCompleted: false, pagesCompleted: 3, totalPages: 3, quizCompleted: false }
      ];
      
      const next = getNextContent(chaptersProgress);
      expect(next.type).toBe('quiz');
      expect(next.chapterNumber).toBe(1);
    });

    it('✅ retourne "completed" si tout est fini', () => {
      const chaptersProgress: ChapterProgress[] = [
        { chapterNumber: 1, title: 'Ch1', progress: 100, isCompleted: true, pagesCompleted: 3, totalPages: 3, quizCompleted: true }
      ];
      
      const next = getNextContent(chaptersProgress);
      expect(next.type).toBe('completed');
    });
  });

  // =====================================================
  // 5. STATISTIQUES DE PERFORMANCE
  // =====================================================
  describe('📊 Statistiques de Performance', () => {
    
    it('✅ calcule les stats avec des scores', () => {
      const scores = new Map([[1, 80], [2, 90], [3, 70]]);
      const stats = calculatePerformanceStats([1, 2, 3], scores);
      
      expect(stats.averageScore).toBe(80);
      expect(stats.bestScore).toBe(90);
      expect(stats.worstScore).toBe(70);
      expect(stats.totalQuizzesTaken).toBe(3);
    });

    it('✅ gère aucun quiz complété', () => {
      const stats = calculatePerformanceStats([], new Map());
      
      expect(stats.averageScore).toBe(0);
      expect(stats.totalQuizzesTaken).toBe(0);
    });

    it('✅ utilise le score par défaut si non trouvé', () => {
      const scores = new Map<number, number>();
      const stats = calculatePerformanceStats([1], scores);
      
      expect(stats.averageScore).toBe(75); // Score par défaut
    });
  });

  // =====================================================
  // 6. MESSAGES DE MOTIVATION
  // =====================================================
  describe('💬 Messages de Motivation', () => {
    
    it('✅ message pour 100%', () => {
      const msg = getMotivationalMessage(100, 0);
      expect(msg).toContain('Félicitations');
    });

    it('✅ message pour nouveau utilisateur', () => {
      const msg = getMotivationalMessage(0, 0);
      expect(msg).toContain('Bienvenue');
    });

    it('✅ message pour streak élevé', () => {
      const msg = getMotivationalMessage(10, 7);
      expect(msg).toContain('7 jours');
    });

    it('✅ message pour progression intermédiaire', () => {
      const msg = getMotivationalMessage(50, 0);
      expect(msg).toContain('moitié');
    });
  });

  // =====================================================
  // 7. EXPIRATION D'ABONNEMENT
  // =====================================================
  describe('⚠️ Expiration d\'Abonnement', () => {
    
    it('✅ détecte l\'expiration proche', () => {
      const endDate = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000); // +5 jours
      expect(isSubscriptionExpiringSoon(endDate)).toBe(true);
    });

    it('❌ pas proche de l\'expiration', () => {
      const endDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // +30 jours
      expect(isSubscriptionExpiringSoon(endDate)).toBe(false);
    });

    it('✅ gère null', () => {
      expect(isSubscriptionExpiringSoon(null)).toBe(false);
    });

    it('✅ seuil personnalisé', () => {
      const endDate = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000); // +10 jours
      expect(isSubscriptionExpiringSoon(endDate, 14)).toBe(true);
      expect(isSubscriptionExpiringSoon(endDate, 7)).toBe(false);
    });
  });

  // =====================================================
  // 8. COMPLÉTION PAR MODULE
  // =====================================================
  describe('📚 Complétion par Module', () => {
    
    it('✅ calcule pour le module LECTURE', () => {
      const config = { totalPages: 29, totalQuizzes: 8, excludedPages: [0, 30] };
      const completion = getModuleCompletion('LECTURE', [1, 2, 3, 4, 5], [1, 2], config);
      
      // 7 items sur 37 = 18.9% arrondi à 19%
      expect(completion).toBe(19);
    });

    it('✅ exclut les pages spécifiées', () => {
      const config = { totalPages: 10, totalQuizzes: 2, excludedPages: [30] };
      const completion = getModuleCompletion('LECTURE', [1, 2, 30], [1], config);
      
      // 30 exclu, donc 2 pages + 1 quiz = 3/12 = 25%
      expect(completion).toBe(25);
    });

    it('✅ ne dépasse pas 100%', () => {
      const config = { totalPages: 5, totalQuizzes: 2, excludedPages: [] };
      const completion = getModuleCompletion('LECTURE', [1, 2, 3, 4, 5, 6, 7, 8], [1, 2, 3], config);
      
      expect(completion).toBe(100);
    });
  });

  // =====================================================
  // 9. FORMATAGE DU TEMPS
  // =====================================================
  describe('⏱️ Formatage du Temps', () => {
    
    it('✅ formate les minutes', () => {
      expect(formatStudyTime(300)).toBe('5min');
      expect(formatStudyTime(60)).toBe('1min');
    });

    it('✅ formate les heures', () => {
      expect(formatStudyTime(3600)).toBe('1h');
      expect(formatStudyTime(7200)).toBe('2h');
    });

    it('✅ formate heures et minutes', () => {
      expect(formatStudyTime(5400)).toBe('1h 30min');
      expect(formatStudyTime(3660)).toBe('1h 1min');
    });

    it('✅ gère 0 secondes', () => {
      expect(formatStudyTime(0)).toBe('0min');
    });
  });
});
