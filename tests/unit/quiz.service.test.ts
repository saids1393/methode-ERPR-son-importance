// tests/unit/quiz.service.test.ts
// Tests unitaires pour le Quiz (TRÈS IMPORTANT pour le jury)

import { afterEach } from 'node:test';
import { describe, it, expect, vi, beforeEach } from 'vitest';

// =====================================================
// TYPES
// =====================================================

type QuizQuestion = {
  question: string;
  choices: string[];
  correctAnswerIndex: number;
};

// =====================================================
// FONCTIONS À TESTER
// =====================================================

/**
 * Calcule le score d'un quiz
 */
function calculateQuizScore(
  quiz: QuizQuestion[],
  selectedAnswers: number[]
): number {
  return quiz.reduce(
    (score, question, index) =>
      selectedAnswers[index] === question.correctAnswerIndex ? score + 1 : score,
    0
  );
}

/**
 * Calcule le pourcentage de réussite
 */
function calculateQuizPercentage(score: number, totalQuestions: number): number {
  if (totalQuestions === 0) return 0;
  return Math.round((score / totalQuestions) * 100);
}

/**
 * Détermine si le quiz est réussi (seuil: 75%)
 */
function isQuizSuccessful(percentage: number, threshold: number = 75): boolean {
  return percentage >= threshold;
}

/**
 * Valide une réponse
 */
function validateAnswer(
  question: QuizQuestion,
  selectedAnswerIndex: number
): boolean {
  return selectedAnswerIndex === question.correctAnswerIndex;
}

/**
 * Obtient les erreurs du quiz
 */
function getQuizErrors(
  quiz: QuizQuestion[],
  selectedAnswers: number[]
): Array<{ questionIndex: number; userAnswer: number; correctAnswer: number }> {
  const errors: Array<{ questionIndex: number; userAnswer: number; correctAnswer: number }> = [];
  
  quiz.forEach((question, index) => {
    if (selectedAnswers[index] !== question.correctAnswerIndex) {
      errors.push({
        questionIndex: index,
        userAnswer: selectedAnswers[index],
        correctAnswer: question.correctAnswerIndex
      });
    }
  });
  
  return errors;
}

/**
 * Vérifie si toutes les questions ont été répondues
 */
function areAllQuestionsAnswered(
  quiz: QuizQuestion[],
  selectedAnswers: number[]
): boolean {
  return quiz.every((_, index) => selectedAnswers[index] !== undefined);
}

/**
 * Gestion du timer de quiz
 */
interface QuizTimer {
  startTime: number;
  duration: number; // en secondes
  isExpired: () => boolean;
  getRemainingTime: () => number;
  getElapsedTime: () => number;
}

function createQuizTimer(durationInSeconds: number): QuizTimer {
  const startTime = Date.now();
  const duration = durationInSeconds;
  
  return {
    startTime,
    duration,
    isExpired: () => {
      const elapsed = (Date.now() - startTime) / 1000;
      return elapsed >= duration;
    },
    getRemainingTime: () => {
      const elapsed = (Date.now() - startTime) / 1000;
      const remaining = duration - elapsed;
      return Math.max(0, Math.round(remaining));
    },
    getElapsedTime: () => {
      return Math.round((Date.now() - startTime) / 1000);
    }
  };
}

/**
 * Formatte le temps restant en mm:ss
 */
function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Génère un récapitulatif du quiz
 */
interface QuizSummary {
  score: number;
  totalQuestions: number;
  percentage: number;
  passed: boolean;
  errors: Array<{ questionIndex: number; userAnswer: number; correctAnswer: number }>;
  timeSpent: number;
}

function generateQuizSummary(
  quiz: QuizQuestion[],
  selectedAnswers: number[],
  timeSpent: number
): QuizSummary {
  const score = calculateQuizScore(quiz, selectedAnswers);
  const percentage = calculateQuizPercentage(score, quiz.length);
  
  return {
    score,
    totalQuestions: quiz.length,
    percentage,
    passed: isQuizSuccessful(percentage),
    errors: getQuizErrors(quiz, selectedAnswers),
    timeSpent
  };
}

// =====================================================
// DONNÉES DE TEST
// =====================================================

const sampleQuiz: QuizQuestion[] = [
  {
    question: "Quelle est la première lettre de l'alphabet arabe ?",
    choices: ["Ba", "Alif", "Ta", "Jim"],
    correctAnswerIndex: 1
  },
  {
    question: "Comment s'écrit 'mère' en arabe ?",
    choices: ["أب", "أم", "أخ", "أخت"],
    correctAnswerIndex: 1
  },
  {
    question: "Quel est le sens de lecture en arabe ?",
    choices: ["Gauche à droite", "Droite à gauche", "Haut en bas", "Bas en haut"],
    correctAnswerIndex: 1
  },
  {
    question: "Combien de lettres compte l'alphabet arabe ?",
    choices: ["26", "28", "30", "24"],
    correctAnswerIndex: 1
  }
];

// =====================================================
// TESTS UNITAIRES
// =====================================================

describe('📝 Quiz Service - Tests Unitaires', () => {

  // =====================================================
  // 1. CALCUL DU SCORE
  // =====================================================
  describe('🎯 Calcul du Score', () => {
    
    it('✅ calcule le score avec toutes les réponses correctes', () => {
      const selectedAnswers = [1, 1, 1, 1]; // Toutes correctes
      const score = calculateQuizScore(sampleQuiz, selectedAnswers);
      expect(score).toBe(4);
    });

    it('✅ calcule le score avec aucune réponse correcte', () => {
      const selectedAnswers = [0, 0, 0, 0]; // Toutes fausses
      const score = calculateQuizScore(sampleQuiz, selectedAnswers);
      expect(score).toBe(0);
    });

    it('✅ calcule le score avec des réponses mixtes', () => {
      const selectedAnswers = [1, 0, 1, 0]; // 2 correctes, 2 fausses
      const score = calculateQuizScore(sampleQuiz, selectedAnswers);
      expect(score).toBe(2);
    });

    it('✅ calcule le score avec 75% de réussite', () => {
      const selectedAnswers = [1, 1, 1, 0]; // 3 correctes sur 4
      const score = calculateQuizScore(sampleQuiz, selectedAnswers);
      expect(score).toBe(3);
    });

    it('✅ gère les réponses manquantes (undefined)', () => {
      const selectedAnswers = [1, undefined as any, 1, 1]; // Une non répondue
      const score = calculateQuizScore(sampleQuiz, selectedAnswers);
      expect(score).toBe(3); // undefined !== correctAnswerIndex
    });
  });

  // =====================================================
  // 2. CALCUL DU POURCENTAGE
  // =====================================================
  describe('📊 Calcul du Pourcentage', () => {
    
    it('✅ calcule 100% pour score parfait', () => {
      const percentage = calculateQuizPercentage(4, 4);
      expect(percentage).toBe(100);
    });

    it('✅ calcule 0% pour aucune bonne réponse', () => {
      const percentage = calculateQuizPercentage(0, 4);
      expect(percentage).toBe(0);
    });

    it('✅ calcule 75% pour 3/4', () => {
      const percentage = calculateQuizPercentage(3, 4);
      expect(percentage).toBe(75);
    });

    it('✅ calcule 50% pour 2/4', () => {
      const percentage = calculateQuizPercentage(2, 4);
      expect(percentage).toBe(50);
    });

    it('✅ arrondit correctement (ex: 1/3 = 33%)', () => {
      const percentage = calculateQuizPercentage(1, 3);
      expect(percentage).toBe(33);
    });

    it('✅ gère un quiz vide (0 questions)', () => {
      const percentage = calculateQuizPercentage(0, 0);
      expect(percentage).toBe(0);
    });
  });

  // =====================================================
  // 3. VALIDATION RÉUSSITE / ÉCHEC
  // =====================================================
  describe('✅❌ Validation Réussite / Échec', () => {
    
    it('✅ réussite avec 75% (seuil par défaut)', () => {
      expect(isQuizSuccessful(75)).toBe(true);
    });

    it('✅ réussite avec 100%', () => {
      expect(isQuizSuccessful(100)).toBe(true);
    });

    it('✅ réussite avec 80%', () => {
      expect(isQuizSuccessful(80)).toBe(true);
    });

    it('❌ échec avec 74%', () => {
      expect(isQuizSuccessful(74)).toBe(false);
    });

    it('❌ échec avec 0%', () => {
      expect(isQuizSuccessful(0)).toBe(false);
    });

    it('✅ utilise un seuil personnalisé (50%)', () => {
      expect(isQuizSuccessful(50, 50)).toBe(true);
      expect(isQuizSuccessful(49, 50)).toBe(false);
    });

    it('✅ utilise un seuil personnalisé (90%)', () => {
      expect(isQuizSuccessful(89, 90)).toBe(false);
      expect(isQuizSuccessful(90, 90)).toBe(true);
    });
  });

  // =====================================================
  // 4. VALIDATION DES RÉPONSES INDIVIDUELLES
  // =====================================================
  describe('🔍 Validation des Réponses', () => {
    
    it('✅ valide une réponse correcte', () => {
      const question = sampleQuiz[0];
      expect(validateAnswer(question, 1)).toBe(true);
    });

    it('❌ invalide une réponse incorrecte', () => {
      const question = sampleQuiz[0];
      expect(validateAnswer(question, 0)).toBe(false);
      expect(validateAnswer(question, 2)).toBe(false);
      expect(validateAnswer(question, 3)).toBe(false);
    });

    it('✅ gère les index de réponse en limite', () => {
      const question: QuizQuestion = {
        question: "Test",
        choices: ["A", "B"],
        correctAnswerIndex: 0
      };
      expect(validateAnswer(question, 0)).toBe(true);
      expect(validateAnswer(question, 1)).toBe(false);
    });
  });

  // =====================================================
  // 5. DÉTECTION DES ERREURS
  // =====================================================
  describe('🔴 Détection des Erreurs', () => {
    
    it('✅ retourne un tableau vide si aucune erreur', () => {
      const selectedAnswers = [1, 1, 1, 1];
      const errors = getQuizErrors(sampleQuiz, selectedAnswers);
      expect(errors).toHaveLength(0);
    });

    it('✅ retourne toutes les erreurs', () => {
      const selectedAnswers = [0, 0, 0, 0];
      const errors = getQuizErrors(sampleQuiz, selectedAnswers);
      expect(errors).toHaveLength(4);
    });

    it('✅ identifie correctement les erreurs mixtes', () => {
      const selectedAnswers = [1, 0, 1, 2]; // Q2 et Q4 fausses
      const errors = getQuizErrors(sampleQuiz, selectedAnswers);
      expect(errors).toHaveLength(2);
      expect(errors[0].questionIndex).toBe(1);
      expect(errors[1].questionIndex).toBe(3);
    });

    it('✅ inclut la réponse de l\'utilisateur et la bonne réponse', () => {
      const selectedAnswers = [0, 1, 1, 1]; // Q1 fausse
      const errors = getQuizErrors(sampleQuiz, selectedAnswers);
      expect(errors[0]).toEqual({
        questionIndex: 0,
        userAnswer: 0,
        correctAnswer: 1
      });
    });
  });

  // =====================================================
  // 6. VÉRIFICATION QUESTIONS RÉPONDUES
  // =====================================================
  describe('📋 Vérification Questions Répondues', () => {
    
    it('✅ toutes les questions répondues', () => {
      const selectedAnswers = [1, 1, 1, 1];
      expect(areAllQuestionsAnswered(sampleQuiz, selectedAnswers)).toBe(true);
    });

    it('❌ question manquante', () => {
      const selectedAnswers = [1, 1, undefined as any, 1];
      expect(areAllQuestionsAnswered(sampleQuiz, selectedAnswers)).toBe(false);
    });

    it('❌ tableau vide', () => {
      const selectedAnswers: number[] = [];
      expect(areAllQuestionsAnswered(sampleQuiz, selectedAnswers)).toBe(false);
    });

    it('✅ accepte la réponse 0 comme valide', () => {
      const selectedAnswers = [0, 0, 0, 0];
      expect(areAllQuestionsAnswered(sampleQuiz, selectedAnswers)).toBe(true);
    });
  });

  // =====================================================
  // 7. GESTION DU TIMER
  // =====================================================
  describe('⏱️ Gestion du Timer', () => {
    
    beforeEach(() => {
      vi.useFakeTimers();
    });

    it('✅ initialise le timer correctement', () => {
      const timer = createQuizTimer(300); // 5 minutes
      expect(timer.duration).toBe(300);
      expect(timer.getRemainingTime()).toBe(300);
      expect(timer.isExpired()).toBe(false);
    });

    it('✅ compte le temps écoulé', () => {
      const timer = createQuizTimer(300);
      
      vi.advanceTimersByTime(60000); // 60 secondes
      
      expect(timer.getElapsedTime()).toBe(60);
      expect(timer.getRemainingTime()).toBe(240);
    });

    it('✅ détecte l\'expiration du timer', () => {
      const timer = createQuizTimer(60); // 1 minute
      
      expect(timer.isExpired()).toBe(false);
      
      vi.advanceTimersByTime(61000); // 61 secondes
      
      expect(timer.isExpired()).toBe(true);
    });

    it('✅ le temps restant ne devient pas négatif', () => {
      const timer = createQuizTimer(60);
      
      vi.advanceTimersByTime(120000); // 2 minutes
      
      expect(timer.getRemainingTime()).toBe(0);
    });

    afterEach(() => {
      vi.useRealTimers();
    });
  });

  // =====================================================
  // 8. FORMATAGE DU TEMPS
  // =====================================================
  describe('🕐 Formatage du Temps', () => {
    
    it('✅ formate 0 secondes', () => {
      expect(formatTime(0)).toBe('00:00');
    });

    it('✅ formate 59 secondes', () => {
      expect(formatTime(59)).toBe('00:59');
    });

    it('✅ formate 60 secondes (1 minute)', () => {
      expect(formatTime(60)).toBe('01:00');
    });

    it('✅ formate 90 secondes (1:30)', () => {
      expect(formatTime(90)).toBe('01:30');
    });

    it('✅ formate 300 secondes (5:00)', () => {
      expect(formatTime(300)).toBe('05:00');
    });

    it('✅ formate 3661 secondes (61:01)', () => {
      expect(formatTime(3661)).toBe('61:01');
    });
  });

  // =====================================================
  // 9. GÉNÉRATION DU RÉCAPITULATIF
  // =====================================================
  describe('📄 Génération du Récapitulatif', () => {
    
    it('✅ génère un récapitulatif complet', () => {
      const selectedAnswers = [1, 1, 1, 0]; // 3/4 correctes
      const summary = generateQuizSummary(sampleQuiz, selectedAnswers, 120);
      
      expect(summary.score).toBe(3);
      expect(summary.totalQuestions).toBe(4);
      expect(summary.percentage).toBe(75);
      expect(summary.passed).toBe(true);
      expect(summary.errors).toHaveLength(1);
      expect(summary.timeSpent).toBe(120);
    });

    it('✅ récapitulatif pour quiz raté', () => {
      const selectedAnswers = [0, 0, 0, 0];
      const summary = generateQuizSummary(sampleQuiz, selectedAnswers, 60);
      
      expect(summary.score).toBe(0);
      expect(summary.percentage).toBe(0);
      expect(summary.passed).toBe(false);
      expect(summary.errors).toHaveLength(4);
    });

    it('✅ récapitulatif pour quiz parfait', () => {
      const selectedAnswers = [1, 1, 1, 1];
      const summary = generateQuizSummary(sampleQuiz, selectedAnswers, 180);
      
      expect(summary.score).toBe(4);
      expect(summary.percentage).toBe(100);
      expect(summary.passed).toBe(true);
      expect(summary.errors).toHaveLength(0);
    });
  });

  // =====================================================
  // 10. CAS LIMITES
  // =====================================================
  describe('🔧 Cas Limites', () => {
    
    it('✅ gère un quiz avec une seule question', () => {
      const singleQuiz: QuizQuestion[] = [{
        question: "Test",
        choices: ["A", "B"],
        correctAnswerIndex: 0
      }];
      
      expect(calculateQuizScore(singleQuiz, [0])).toBe(1);
      expect(calculateQuizScore(singleQuiz, [1])).toBe(0);
    });

    it('✅ gère un quiz vide', () => {
      const emptyQuiz: QuizQuestion[] = [];
      
      expect(calculateQuizScore(emptyQuiz, [])).toBe(0);
      expect(calculateQuizPercentage(0, 0)).toBe(0);
      expect(getQuizErrors(emptyQuiz, [])).toHaveLength(0);
    });

    it('✅ gère les index de réponse hors limites', () => {
      const selectedAnswers = [99, -1, 1000, 1]; // Index invalides sauf le dernier
      const score = calculateQuizScore(sampleQuiz, selectedAnswers);
      expect(score).toBe(1); // Seule la dernière est correcte
    });
  });
});
