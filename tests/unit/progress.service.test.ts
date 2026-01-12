// tests/unit/progress.service.test.ts
// Tests unitaires pour la progression des élèves et les leçons complétées

import { describe, it, expect, vi, beforeEach } from 'vitest';

// =====================================================
// TYPES
// =====================================================

type ModuleType = 'LECTURE' | 'TAJWID';

interface UserProgress {
  userId: string;
  completedPages: Set<number>;
  completedQuizzes: Set<number>;
  studyTime: number; // en secondes
  lastActivityDate: Date;
  module: ModuleType;
}

interface Chapter {
  chapterNumber: number;
  title: string;
  pages: Array<{ pageNumber: number }>;
  quiz?: Array<{ question: string }>;
}

// =====================================================
// FONCTIONS À TESTER
// =====================================================

/**
 * Calcule la progression globale en pourcentage
 */
function calculateProgress(
  completedPages: Set<number>,
  completedQuizzes: Set<number>,
  totalPages: number,
  totalQuizzes: number
): number {
  const totalItems = totalPages + totalQuizzes;
  if (totalItems === 0) return 0;
  
  const completedItems = completedPages.size + completedQuizzes.size;
  if (completedItems === 0) return 0;
  if (completedItems >= totalItems) return 100;
  
  return Math.round((completedItems / totalItems) * 100);
}

/**
 * Calcule le niveau de l'utilisateur basé sur la progression
 */
function calculateUserLevel(progressPercentage: number): {
  level: number;
  title: string;
  nextLevelAt: number;
} {
  if (progressPercentage >= 100) {
    return { level: 10, title: 'Expert', nextLevelAt: 100 };
  }
  if (progressPercentage >= 90) {
    return { level: 9, title: 'Maître', nextLevelAt: 100 };
  }
  if (progressPercentage >= 80) {
    return { level: 8, title: 'Avancé', nextLevelAt: 90 };
  }
  if (progressPercentage >= 70) {
    return { level: 7, title: 'Confirmé', nextLevelAt: 80 };
  }
  if (progressPercentage >= 60) {
    return { level: 6, title: 'Intermédiaire+', nextLevelAt: 70 };
  }
  if (progressPercentage >= 50) {
    return { level: 5, title: 'Intermédiaire', nextLevelAt: 60 };
  }
  if (progressPercentage >= 40) {
    return { level: 4, title: 'Apprenti+', nextLevelAt: 50 };
  }
  if (progressPercentage >= 30) {
    return { level: 3, title: 'Apprenti', nextLevelAt: 40 };
  }
  if (progressPercentage >= 15) {
    return { level: 2, title: 'Novice', nextLevelAt: 30 };
  }
  return { level: 1, title: 'Débutant', nextLevelAt: 15 };
}

/**
 * Marque une page comme complétée (évite les doublons)
 */
function markPageAsCompleted(
  completedPages: Set<number>,
  pageNumber: number,
  excludedPages: number[] = [30] // Page 30 exclue par défaut
): { success: boolean; alreadyCompleted: boolean; newSet: Set<number> } {
  // Vérifier si la page est exclue
  if (excludedPages.includes(pageNumber)) {
    return { success: false, alreadyCompleted: false, newSet: completedPages };
  }
  
  // Vérifier si déjà complétée
  if (completedPages.has(pageNumber)) {
    return { success: false, alreadyCompleted: true, newSet: completedPages };
  }
  
  // Créer un nouveau Set avec la page ajoutée
  const newSet = new Set(completedPages);
  newSet.add(pageNumber);
  
  return { success: true, alreadyCompleted: false, newSet };
}

/**
 * Marque un quiz comme complété
 */
function markQuizAsCompleted(
  completedQuizzes: Set<number>,
  quizNumber: number,
  excludedQuizzes: number[] = [11] // Quiz 11 exclu par défaut
): { success: boolean; alreadyCompleted: boolean; newSet: Set<number> } {
  // Vérifier si le quiz est exclu
  if (excludedQuizzes.includes(quizNumber)) {
    return { success: false, alreadyCompleted: false, newSet: completedQuizzes };
  }
  
  // Vérifier si déjà complété
  if (completedQuizzes.has(quizNumber)) {
    return { success: false, alreadyCompleted: true, newSet: completedQuizzes };
  }
  
  const newSet = new Set(completedQuizzes);
  newSet.add(quizNumber);
  
  return { success: true, alreadyCompleted: false, newSet };
}

/**
 * Calcule la progression par chapitre
 */
function calculateChapterProgress(
  chapter: Chapter,
  completedPages: Set<number>,
  completedQuizzes: Set<number>
): { pagesCompleted: number; totalPages: number; quizCompleted: boolean; percentage: number } {
  const validPages = chapter.pages.filter(p => p.pageNumber !== 0 && p.pageNumber !== 30);
  const totalPages = validPages.length;
  
  const pagesCompleted = validPages.filter(p => completedPages.has(p.pageNumber)).length;
  const quizCompleted = chapter.quiz && chapter.quiz.length > 0 
    ? completedQuizzes.has(chapter.chapterNumber) 
    : true;
  
  const totalItems = totalPages + (chapter.quiz && chapter.quiz.length > 0 ? 1 : 0);
  const completedItems = pagesCompleted + (quizCompleted && chapter.quiz?.length ? 1 : 0);
  
  const percentage = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
  
  return {
    pagesCompleted,
    totalPages,
    quizCompleted,
    percentage
  };
}

/**
 * Vérifie si un chapitre est entièrement complété
 */
function isChapterCompleted(
  chapter: Chapter,
  completedPages: Set<number>,
  completedQuizzes: Set<number>
): boolean {
  const progress = calculateChapterProgress(chapter, completedPages, completedQuizzes);
  return progress.percentage === 100;
}

/**
 * Obtient les pages manquantes pour compléter un chapitre
 */
function getMissingPagesForChapter(
  chapter: Chapter,
  completedPages: Set<number>
): number[] {
  const validPages = chapter.pages
    .filter(p => p.pageNumber !== 0 && p.pageNumber !== 30)
    .map(p => p.pageNumber);
  
  return validPages.filter(pageNum => !completedPages.has(pageNum));
}

/**
 * Vérifie si l'utilisateur est connecté (a une activité récente)
 */
function isUserActive(lastActivityDate: Date, timeoutMinutes: number = 30): boolean {
  const now = new Date();
  const diffMs = now.getTime() - lastActivityDate.getTime();
  const diffMinutes = diffMs / (1000 * 60);
  return diffMinutes < timeoutMinutes;
}

/**
 * Calcule le score d'assiduité
 */
function calculateAssiduityScore(
  studyTime: number,
  progress: number,
  daysSinceLastActivity: number,
  accountAge: number
): number {
  let score = 0;

  // Temps d'étude (40% du score)
  const studyTimeScore = Math.min((studyTime / 3600) * 10, 40); // 1h = 10 points, max 40
  score += studyTimeScore;

  // Progression (30% du score)
  const progressScore = (progress / 100) * 30;
  score += progressScore;

  // Activité récente (20% du score)
  const activityScore = Math.max(0, 20 - (daysSinceLastActivity * 2));
  score += activityScore;

  // Régularité (10% du score basé sur l'ancienneté)
  const regularityScore = accountAge > 0 
    ? Math.min((studyTime / (accountAge * 24 * 60)) * 10, 10) 
    : 0;
  score += regularityScore;

  return Math.round(Math.min(score, 100));
}

/**
 * Détermine le prochain chapitre à étudier
 */
function getNextChapterToStudy(
  chapters: Chapter[],
  completedPages: Set<number>,
  completedQuizzes: Set<number>
): Chapter | null {
  for (const chapter of chapters) {
    if (!isChapterCompleted(chapter, completedPages, completedQuizzes)) {
      return chapter;
    }
  }
  return null; // Tous les chapitres sont complétés
}

// =====================================================
// DONNÉES DE TEST
// =====================================================

const sampleChapters: Chapter[] = [
  {
    chapterNumber: 1,
    title: "Les bases de l'arabe",
    pages: [
      { pageNumber: 1 },
      { pageNumber: 2 },
      { pageNumber: 3 }
    ],
    quiz: [{ question: "Question 1" }]
  },
  {
    chapterNumber: 2,
    title: "Les lettres",
    pages: [
      { pageNumber: 4 },
      { pageNumber: 5 },
      { pageNumber: 6 },
      { pageNumber: 7 }
    ],
    quiz: [{ question: "Question 1" }]
  },
  {
    chapterNumber: 3,
    title: "Les voyelles",
    pages: [
      { pageNumber: 8 },
      { pageNumber: 9 },
      { pageNumber: 10 }
    ],
    quiz: [{ question: "Question 1" }]
  }
];

// =====================================================
// TESTS UNITAIRES
// =====================================================

describe('📚 Progress Service - Tests Unitaires', () => {

  // =====================================================
  // 1. CALCUL DE LA PROGRESSION GLOBALE
  // =====================================================
  describe('📊 Calcul de la Progression Globale', () => {
    
    it('✅ calcule 0% pour aucune progression', () => {
      const completedPages = new Set<number>();
      const completedQuizzes = new Set<number>();
      const progress = calculateProgress(completedPages, completedQuizzes, 29, 8);
      expect(progress).toBe(0);
    });

    it('✅ calcule 100% pour progression complète', () => {
      const completedPages = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
      const completedQuizzes = new Set([1, 2, 3, 4, 5]);
      const progress = calculateProgress(completedPages, completedQuizzes, 10, 5);
      expect(progress).toBe(100);
    });

    it('✅ calcule progression partielle', () => {
      const completedPages = new Set([1, 2, 3, 4, 5]); // 5 pages
      const completedQuizzes = new Set([1, 2]); // 2 quizzes
      // Total: 7 complétés sur 15 (10 pages + 5 quizzes) = 46.67% arrondi à 47%
      const progress = calculateProgress(completedPages, completedQuizzes, 10, 5);
      expect(progress).toBe(47);
    });

    it('✅ gère le cas sans quiz', () => {
      const completedPages = new Set([1, 2, 3]);
      const completedQuizzes = new Set<number>();
      const progress = calculateProgress(completedPages, completedQuizzes, 10, 0);
      expect(progress).toBe(30);
    });

    it('✅ gère le cas avec 0 total', () => {
      const progress = calculateProgress(new Set(), new Set(), 0, 0);
      expect(progress).toBe(0);
    });
  });

  // =====================================================
  // 2. CALCUL DU NIVEAU UTILISATEUR
  // =====================================================
  describe('🎮 Calcul du Niveau Utilisateur', () => {
    
    it('✅ niveau 1 (Débutant) pour 0%', () => {
      const level = calculateUserLevel(0);
      expect(level.level).toBe(1);
      expect(level.title).toBe('Débutant');
      expect(level.nextLevelAt).toBe(15);
    });

    it('✅ niveau 2 (Novice) pour 15%', () => {
      const level = calculateUserLevel(15);
      expect(level.level).toBe(2);
      expect(level.title).toBe('Novice');
    });

    it('✅ niveau 5 (Intermédiaire) pour 50%', () => {
      const level = calculateUserLevel(50);
      expect(level.level).toBe(5);
      expect(level.title).toBe('Intermédiaire');
    });

    it('✅ niveau 10 (Expert) pour 100%', () => {
      const level = calculateUserLevel(100);
      expect(level.level).toBe(10);
      expect(level.title).toBe('Expert');
    });

    it('✅ progression vers le niveau suivant', () => {
      const level = calculateUserLevel(75);
      expect(level.level).toBe(7);
      expect(level.nextLevelAt).toBe(80);
    });
  });

  // =====================================================
  // 3. MARQUER UNE LEÇON COMME TERMINÉE
  // =====================================================
  describe('✅ Marquer une Leçon Terminée', () => {
    
    it('✅ marque une nouvelle page comme complétée', () => {
      const completedPages = new Set([1, 2, 3]);
      const result = markPageAsCompleted(completedPages, 4);
      
      expect(result.success).toBe(true);
      expect(result.alreadyCompleted).toBe(false);
      expect(result.newSet.has(4)).toBe(true);
    });

    it('❌ empêche les doublons', () => {
      const completedPages = new Set([1, 2, 3]);
      const result = markPageAsCompleted(completedPages, 2);
      
      expect(result.success).toBe(false);
      expect(result.alreadyCompleted).toBe(true);
      expect(result.newSet.size).toBe(3);
    });

    it('❌ refuse les pages exclues (page 30)', () => {
      const completedPages = new Set([1, 2]);
      const result = markPageAsCompleted(completedPages, 30);
      
      expect(result.success).toBe(false);
      expect(result.alreadyCompleted).toBe(false);
    });

    it('✅ accepte page 0 si non exclue', () => {
      const completedPages = new Set<number>();
      const result = markPageAsCompleted(completedPages, 0);
      
      expect(result.success).toBe(true);
    });

    it('✅ ne modifie pas le Set original', () => {
      const completedPages = new Set([1, 2, 3]);
      const result = markPageAsCompleted(completedPages, 4);
      
      expect(completedPages.size).toBe(3);
      expect(result.newSet.size).toBe(4);
    });
  });

  // =====================================================
  // 4. MARQUER UN QUIZ COMME TERMINÉ
  // =====================================================
  describe('🎯 Marquer un Quiz Terminé', () => {
    
    it('✅ marque un nouveau quiz comme complété', () => {
      const completedQuizzes = new Set([1, 2]);
      const result = markQuizAsCompleted(completedQuizzes, 3);
      
      expect(result.success).toBe(true);
      expect(result.newSet.has(3)).toBe(true);
    });

    it('❌ empêche les doublons de quiz', () => {
      const completedQuizzes = new Set([1, 2, 3]);
      const result = markQuizAsCompleted(completedQuizzes, 2);
      
      expect(result.success).toBe(false);
      expect(result.alreadyCompleted).toBe(true);
    });

    it('❌ refuse le quiz 11 (exclu)', () => {
      const completedQuizzes = new Set([1, 2]);
      const result = markQuizAsCompleted(completedQuizzes, 11);
      
      expect(result.success).toBe(false);
    });
  });

  // =====================================================
  // 5. PROGRESSION PAR CHAPITRE
  // =====================================================
  describe('📖 Progression par Chapitre', () => {
    
    it('✅ calcule la progression d\'un chapitre vide', () => {
      const completedPages = new Set<number>();
      const completedQuizzes = new Set<number>();
      const progress = calculateChapterProgress(sampleChapters[0], completedPages, completedQuizzes);
      
      expect(progress.pagesCompleted).toBe(0);
      expect(progress.totalPages).toBe(3);
      expect(progress.quizCompleted).toBe(false);
      expect(progress.percentage).toBe(0);
    });

    it('✅ calcule la progression d\'un chapitre partiellement complété', () => {
      const completedPages = new Set([1, 2]);
      const completedQuizzes = new Set<number>();
      const progress = calculateChapterProgress(sampleChapters[0], completedPages, completedQuizzes);
      
      expect(progress.pagesCompleted).toBe(2);
      expect(progress.percentage).toBe(50); // 2/4 (3 pages + 1 quiz)
    });

    it('✅ calcule la progression d\'un chapitre complété', () => {
      const completedPages = new Set([1, 2, 3]);
      const completedQuizzes = new Set([1]);
      const progress = calculateChapterProgress(sampleChapters[0], completedPages, completedQuizzes);
      
      expect(progress.percentage).toBe(100);
      expect(progress.quizCompleted).toBe(true);
    });
  });

  // =====================================================
  // 6. PAGES MANQUANTES
  // =====================================================
  describe('📝 Pages Manquantes', () => {
    
    it('✅ retourne toutes les pages si aucune complétée', () => {
      const completedPages = new Set<number>();
      const missing = getMissingPagesForChapter(sampleChapters[0], completedPages);
      
      expect(missing).toEqual([1, 2, 3]);
    });

    it('✅ retourne les pages manquantes', () => {
      const completedPages = new Set([1, 3]);
      const missing = getMissingPagesForChapter(sampleChapters[0], completedPages);
      
      expect(missing).toEqual([2]);
    });

    it('✅ retourne un tableau vide si tout est complété', () => {
      const completedPages = new Set([1, 2, 3]);
      const missing = getMissingPagesForChapter(sampleChapters[0], completedPages);
      
      expect(missing).toEqual([]);
    });
  });

  // =====================================================
  // 7. ÉTAT CONNECTÉ / DÉCONNECTÉ
  // =====================================================
  describe('🔌 État Connecté / Déconnecté', () => {
    
    it('✅ utilisateur actif (activité < 30min)', () => {
      const lastActivity = new Date(Date.now() - 10 * 60 * 1000); // 10 minutes ago
      expect(isUserActive(lastActivity)).toBe(true);
    });

    it('❌ utilisateur inactif (activité > 30min)', () => {
      const lastActivity = new Date(Date.now() - 45 * 60 * 1000); // 45 minutes ago
      expect(isUserActive(lastActivity)).toBe(false);
    });

    it('✅ utilisateur actif à la limite (29min)', () => {
      const lastActivity = new Date(Date.now() - 29 * 60 * 1000);
      expect(isUserActive(lastActivity)).toBe(true);
    });

    it('❌ utilisateur inactif à la limite (31min)', () => {
      const lastActivity = new Date(Date.now() - 31 * 60 * 1000);
      expect(isUserActive(lastActivity)).toBe(false);
    });

    it('✅ timeout personnalisé', () => {
      const lastActivity = new Date(Date.now() - 50 * 60 * 1000); // 50 min
      expect(isUserActive(lastActivity, 60)).toBe(true); // Timeout 60 min
      expect(isUserActive(lastActivity, 30)).toBe(false); // Timeout 30 min
    });
  });

  // =====================================================
  // 8. SCORE D'ASSIDUITÉ
  // =====================================================
  describe('📈 Score d\'Assiduité', () => {
    
    it('✅ score maximum possible', () => {
      const score = calculateAssiduityScore(14400, 100, 0, 30); // 4h, 100%, actif, 30 jours
      expect(score).toBeGreaterThanOrEqual(90); // Score élevé attendu
      expect(score).toBeLessThanOrEqual(100);
    });

    it('✅ score pour nouvel utilisateur', () => {
      const score = calculateAssiduityScore(0, 0, 0, 1);
      expect(score).toBe(20); // Seulement le score d'activité récente
    });

    it('✅ score avec temps d\'étude', () => {
      const score = calculateAssiduityScore(3600, 0, 0, 1); // 1h d'étude
      expect(score).toBeGreaterThanOrEqual(30); // Au moins le temps + activité
    });

    it('✅ pénalité pour inactivité', () => {
      const scoreActif = calculateAssiduityScore(3600, 50, 0, 10);
      const scoreInactif = calculateAssiduityScore(3600, 50, 5, 10);
      expect(scoreActif).toBeGreaterThan(scoreInactif);
    });
  });

  // =====================================================
  // 9. PROCHAIN CHAPITRE À ÉTUDIER
  // =====================================================
  describe('📖 Prochain Chapitre à Étudier', () => {
    
    it('✅ retourne le premier chapitre si rien n\'est complété', () => {
      const completedPages = new Set<number>();
      const completedQuizzes = new Set<number>();
      const next = getNextChapterToStudy(sampleChapters, completedPages, completedQuizzes);
      
      expect(next?.chapterNumber).toBe(1);
    });

    it('✅ retourne le chapitre suivant si le premier est complété', () => {
      const completedPages = new Set([1, 2, 3]);
      const completedQuizzes = new Set([1]);
      const next = getNextChapterToStudy(sampleChapters, completedPages, completedQuizzes);
      
      expect(next?.chapterNumber).toBe(2);
    });

    it('✅ retourne null si tous les chapitres sont complétés', () => {
      const completedPages = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
      const completedQuizzes = new Set([1, 2, 3]);
      const next = getNextChapterToStudy(sampleChapters, completedPages, completedQuizzes);
      
      expect(next).toBeNull();
    });
  });

  // =====================================================
  // 10. CHAPITRE COMPLÉTÉ
  // =====================================================
  describe('✔️ Vérification Chapitre Complété', () => {
    
    it('✅ chapitre non complété', () => {
      const completedPages = new Set([1, 2]);
      const completedQuizzes = new Set<number>();
      
      expect(isChapterCompleted(sampleChapters[0], completedPages, completedQuizzes)).toBe(false);
    });

    it('✅ chapitre complété', () => {
      const completedPages = new Set([1, 2, 3]);
      const completedQuizzes = new Set([1]);
      
      expect(isChapterCompleted(sampleChapters[0], completedPages, completedQuizzes)).toBe(true);
    });

    it('✅ chapitre incomplet (quiz manquant)', () => {
      const completedPages = new Set([1, 2, 3]);
      const completedQuizzes = new Set<number>(); // Pas de quiz complété
      
      expect(isChapterCompleted(sampleChapters[0], completedPages, completedQuizzes)).toBe(false);
    });
  });
});
