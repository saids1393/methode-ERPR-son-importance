// tests/unit/time.service.test.ts
// Tests unitaires pour la gestion du temps d'étude et le timer

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// =====================================================
// FONCTIONS À TESTER
// =====================================================

/**
 * Formate le temps en heures et minutes
 */
function formatStudyTime(seconds: number): string {
  if (seconds < 60) {
    return `${seconds}s`;
  }
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  
  if (hours > 0) {
    return minutes > 0 
      ? `${hours}h ${minutes}min` 
      : `${hours}h`;
  }
  
  return remainingSeconds > 0 
    ? `${minutes}min ${remainingSeconds}s`
    : `${minutes}min`;
}

/**
 * Formate le temps en format digital (HH:MM:SS)
 */
function formatTimeDigital(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Parse un temps formaté en secondes
 */
function parseTimeToSeconds(timeString: string): number {
  // Format: "1h 30min", "45min", "30s", "02:30:45"
  
  // Format digital HH:MM:SS
  if (/^\d{2}:\d{2}:\d{2}$/.test(timeString)) {
    const [hours, minutes, seconds] = timeString.split(':').map(Number);
    return hours * 3600 + minutes * 60 + seconds;
  }
  
  let totalSeconds = 0;
  
  // Extraire les heures
  const hoursMatch = timeString.match(/(\d+)h/);
  if (hoursMatch) {
    totalSeconds += parseInt(hoursMatch[1]) * 3600;
  }
  
  // Extraire les minutes
  const minutesMatch = timeString.match(/(\d+)min/);
  if (minutesMatch) {
    totalSeconds += parseInt(minutesMatch[1]) * 60;
  }
  
  // Extraire les secondes
  const secondsMatch = timeString.match(/(\d+)s/);
  if (secondsMatch) {
    totalSeconds += parseInt(secondsMatch[1]);
  }
  
  return totalSeconds;
}

/**
 * Classe Timer pour le temps d'étude
 */
class StudyTimer {
  private startTime: number | null = null;
  private pausedTime: number = 0;
  private totalPausedTime: number = 0;
  private isPaused: boolean = false;
  private isRunning: boolean = false;

  start(): void {
    if (this.isRunning) return;
    
    this.startTime = Date.now();
    this.isRunning = true;
    this.isPaused = false;
  }

  pause(): void {
    if (!this.isRunning || this.isPaused) return;
    
    this.pausedTime = Date.now();
    this.isPaused = true;
  }

  resume(): void {
    if (!this.isRunning || !this.isPaused) return;
    
    this.totalPausedTime += Date.now() - this.pausedTime;
    this.isPaused = false;
  }

  stop(): number {
    if (!this.isRunning) return 0;
    
    const endTime = this.isPaused ? this.pausedTime : Date.now();
    const elapsed = Math.floor((endTime - (this.startTime || 0) - this.totalPausedTime) / 1000);
    
    this.reset();
    return Math.max(0, elapsed);
  }

  reset(): void {
    this.startTime = null;
    this.pausedTime = 0;
    this.totalPausedTime = 0;
    this.isPaused = false;
    this.isRunning = false;
  }

  getElapsedTime(): number {
    if (!this.isRunning || !this.startTime) return 0;
    
    const currentTime = this.isPaused ? this.pausedTime : Date.now();
    return Math.floor((currentTime - this.startTime - this.totalPausedTime) / 1000);
  }

  getStatus(): { isRunning: boolean; isPaused: boolean } {
    return {
      isRunning: this.isRunning,
      isPaused: this.isPaused
    };
  }
}

/**
 * Calcule le temps minimum requis sur une page
 */
function isMinimumTimeElapsed(
  pageStartTime: number,
  minTimeMs: number = 6000 // 6 secondes par défaut
): boolean {
  return Date.now() - pageStartTime >= minTimeMs;
}

/**
 * Calcule le temps moyen par page
 */
function calculateAverageTimePerPage(
  totalStudyTime: number,
  completedPagesCount: number
): number {
  if (completedPagesCount === 0) return 0;
  return Math.round(totalStudyTime / completedPagesCount);
}

/**
 * Estime le temps restant pour compléter le cours
 */
function estimateRemainingTime(
  averageTimePerPage: number,
  remainingPages: number,
  remainingQuizzes: number,
  averageQuizTime: number = 300 // 5 minutes par quiz par défaut
): number {
  const pagesTime = averageTimePerPage * remainingPages;
  const quizzesTime = averageQuizTime * remainingQuizzes;
  return pagesTime + quizzesTime;
}

/**
 * Formate une durée en format lisible
 */
function formatDuration(seconds: number): string {
  if (seconds < 60) return 'moins d\'une minute';
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (hours > 24) {
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    return remainingHours > 0 
      ? `${days} jour${days > 1 ? 's' : ''} et ${remainingHours}h`
      : `${days} jour${days > 1 ? 's' : ''}`;
  }
  
  if (hours > 0) {
    return minutes > 0 
      ? `environ ${hours}h ${minutes}min`
      : `environ ${hours}h`;
  }
  
  return `environ ${minutes} minute${minutes > 1 ? 's' : ''}`;
}

/**
 * Vérifie si l'utilisateur doit être déconnecté pour inactivité
 */
function shouldLogoutForInactivity(
  lastActivityTime: number,
  timeoutMs: number = 30 * 60 * 1000 // 30 minutes par défaut
): boolean {
  return Date.now() - lastActivityTime > timeoutMs;
}

/**
 * Calcule le temps d'étude quotidien
 */
interface DailyStudyTime {
  date: string; // Format YYYY-MM-DD
  seconds: number;
}

function calculateDailyAverage(dailyStudyTimes: DailyStudyTime[]): number {
  if (dailyStudyTimes.length === 0) return 0;
  
  const total = dailyStudyTimes.reduce((sum, day) => sum + day.seconds, 0);
  return Math.round(total / dailyStudyTimes.length);
}

/**
 * Obtient les jours consécutifs d'étude (streak)
 */
function calculateStudyStreak(dailyStudyTimes: DailyStudyTime[]): number {
  if (dailyStudyTimes.length === 0) return 0;
  
  // Trier par date décroissante
  const sorted = [...dailyStudyTimes].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  let streak = 0;
  let expectedDate = new Date();
  expectedDate.setHours(0, 0, 0, 0);
  
  for (const day of sorted) {
    const dayDate = new Date(day.date);
    dayDate.setHours(0, 0, 0, 0);
    
    const diffDays = Math.round((expectedDate.getTime() - dayDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0 || diffDays === 1) {
      if (day.seconds > 0) {
        streak++;
        expectedDate = new Date(dayDate);
        expectedDate.setDate(expectedDate.getDate() - 1);
      }
    } else {
      break;
    }
  }
  
  return streak;
}

// =====================================================
// TESTS UNITAIRES
// =====================================================

describe('⏱️ Time Service - Tests Unitaires', () => {

  // =====================================================
  // 1. FORMATAGE DU TEMPS D'ÉTUDE
  // =====================================================
  describe('📝 Formatage du Temps d\'Étude', () => {
    
    it('✅ formate les secondes', () => {
      expect(formatStudyTime(30)).toBe('30s');
      expect(formatStudyTime(59)).toBe('59s');
    });

    it('✅ formate les minutes', () => {
      expect(formatStudyTime(60)).toBe('1min');
      expect(formatStudyTime(120)).toBe('2min');
      expect(formatStudyTime(90)).toBe('1min 30s');
    });

    it('✅ formate les heures', () => {
      expect(formatStudyTime(3600)).toBe('1h');
      expect(formatStudyTime(7200)).toBe('2h');
      expect(formatStudyTime(5400)).toBe('1h 30min');
    });

    it('✅ formate les combinaisons', () => {
      expect(formatStudyTime(3661)).toBe('1h 1min');
      expect(formatStudyTime(7320)).toBe('2h 2min');
    });
  });

  // =====================================================
  // 2. FORMAT DIGITAL
  // =====================================================
  describe('🔢 Format Digital (HH:MM:SS)', () => {
    
    it('✅ formate 0 secondes', () => {
      expect(formatTimeDigital(0)).toBe('00:00:00');
    });

    it('✅ formate les secondes uniquement', () => {
      expect(formatTimeDigital(45)).toBe('00:00:45');
    });

    it('✅ formate les minutes et secondes', () => {
      expect(formatTimeDigital(125)).toBe('00:02:05');
    });

    it('✅ formate les heures complètes', () => {
      expect(formatTimeDigital(3661)).toBe('01:01:01');
      expect(formatTimeDigital(36000)).toBe('10:00:00');
    });
  });

  // =====================================================
  // 3. PARSING DU TEMPS
  // =====================================================
  describe('🔄 Parsing du Temps', () => {
    
    it('✅ parse le format digital', () => {
      expect(parseTimeToSeconds('01:30:45')).toBe(5445);
      expect(parseTimeToSeconds('00:05:00')).toBe(300);
    });

    it('✅ parse le format texte avec heures', () => {
      expect(parseTimeToSeconds('1h 30min')).toBe(5400);
      expect(parseTimeToSeconds('2h')).toBe(7200);
    });

    it('✅ parse le format texte avec minutes', () => {
      expect(parseTimeToSeconds('45min')).toBe(2700);
      expect(parseTimeToSeconds('5min 30s')).toBe(330);
    });

    it('✅ parse les secondes seules', () => {
      expect(parseTimeToSeconds('30s')).toBe(30);
    });
  });

  // =====================================================
  // 4. CLASSE STUDYTIMER
  // =====================================================
  describe('⏲️ Classe StudyTimer', () => {
    let timer: StudyTimer;

    beforeEach(() => {
      vi.useFakeTimers();
      timer = new StudyTimer();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('✅ démarre le timer', () => {
      timer.start();
      const status = timer.getStatus();
      
      expect(status.isRunning).toBe(true);
      expect(status.isPaused).toBe(false);
    });

    it('✅ compte le temps écoulé', () => {
      timer.start();
      vi.advanceTimersByTime(5000); // 5 secondes
      
      expect(timer.getElapsedTime()).toBe(5);
    });

    it('✅ met en pause le timer', () => {
      timer.start();
      vi.advanceTimersByTime(3000);
      timer.pause();
      
      const status = timer.getStatus();
      expect(status.isPaused).toBe(true);
      
      vi.advanceTimersByTime(5000); // Ce temps ne doit pas être compté
      expect(timer.getElapsedTime()).toBe(3);
    });

    it('✅ reprend après pause', () => {
      timer.start();
      vi.advanceTimersByTime(3000);
      timer.pause();
      vi.advanceTimersByTime(2000);
      timer.resume();
      vi.advanceTimersByTime(2000);
      
      expect(timer.getElapsedTime()).toBe(5); // 3 + 2, sans les 2 de pause
    });

    it('✅ arrête et retourne le temps total', () => {
      timer.start();
      vi.advanceTimersByTime(10000);
      
      const elapsed = timer.stop();
      expect(elapsed).toBe(10);
      expect(timer.getStatus().isRunning).toBe(false);
    });

    it('✅ reset le timer', () => {
      timer.start();
      vi.advanceTimersByTime(5000);
      timer.reset();
      
      expect(timer.getElapsedTime()).toBe(0);
      expect(timer.getStatus().isRunning).toBe(false);
    });

    it('✅ ne démarre pas deux fois', () => {
      timer.start();
      vi.advanceTimersByTime(3000);
      timer.start(); // Deuxième appel ignoré
      vi.advanceTimersByTime(2000);
      
      expect(timer.getElapsedTime()).toBe(5);
    });
  });

  // =====================================================
  // 5. TEMPS MINIMUM SUR PAGE
  // =====================================================
  describe('⏳ Temps Minimum sur Page', () => {
    
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('❌ temps insuffisant', () => {
      const startTime = Date.now();
      vi.advanceTimersByTime(3000); // 3 secondes
      
      expect(isMinimumTimeElapsed(startTime, 6000)).toBe(false);
    });

    it('✅ temps suffisant', () => {
      const startTime = Date.now();
      vi.advanceTimersByTime(7000); // 7 secondes
      
      expect(isMinimumTimeElapsed(startTime, 6000)).toBe(true);
    });

    it('✅ exactement le temps minimum', () => {
      const startTime = Date.now();
      vi.advanceTimersByTime(6000); // Exactement 6 secondes
      
      expect(isMinimumTimeElapsed(startTime, 6000)).toBe(true);
    });
  });

  // =====================================================
  // 6. TEMPS MOYEN PAR PAGE
  // =====================================================
  describe('📊 Temps Moyen par Page', () => {
    
    it('✅ calcule la moyenne', () => {
      const average = calculateAverageTimePerPage(3600, 10); // 1h pour 10 pages
      expect(average).toBe(360); // 6 minutes par page
    });

    it('✅ gère zéro pages', () => {
      expect(calculateAverageTimePerPage(3600, 0)).toBe(0);
    });

    it('✅ arrondit correctement', () => {
      const average = calculateAverageTimePerPage(1000, 3);
      expect(average).toBe(333);
    });
  });

  // =====================================================
  // 7. ESTIMATION DU TEMPS RESTANT
  // =====================================================
  describe('⏱️ Estimation du Temps Restant', () => {
    
    it('✅ estime le temps pour pages restantes', () => {
      const remaining = estimateRemainingTime(300, 10, 0); // 5min/page, 10 pages
      expect(remaining).toBe(3000); // 50 minutes
    });

    it('✅ inclut le temps des quizzes', () => {
      const remaining = estimateRemainingTime(300, 5, 2, 300);
      expect(remaining).toBe(2100); // 5*300 + 2*300 = 2100
    });

    it('✅ gère zéro restant', () => {
      expect(estimateRemainingTime(300, 0, 0)).toBe(0);
    });
  });

  // =====================================================
  // 8. FORMATAGE DE DURÉE
  // =====================================================
  describe('📝 Formatage de Durée', () => {
    
    it('✅ moins d\'une minute', () => {
      expect(formatDuration(30)).toBe('moins d\'une minute');
    });

    it('✅ quelques minutes', () => {
      expect(formatDuration(300)).toBe('environ 5 minutes');
      expect(formatDuration(60)).toBe('environ 1 minute');
    });

    it('✅ heures et minutes', () => {
      expect(formatDuration(5400)).toBe('environ 1h 30min');
      expect(formatDuration(3600)).toBe('environ 1h');
    });

    it('✅ plusieurs jours', () => {
      expect(formatDuration(172800)).toBe('2 jours'); // 48h
      expect(formatDuration(90000)).toBe('1 jour et 1h'); // 25h
    });
  });

  // =====================================================
  // 9. DÉCONNEXION POUR INACTIVITÉ
  // =====================================================
  describe('🚪 Déconnexion pour Inactivité', () => {
    
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('❌ ne déconnecte pas si actif récemment', () => {
      const lastActivity = Date.now();
      vi.advanceTimersByTime(10 * 60 * 1000); // 10 minutes
      
      expect(shouldLogoutForInactivity(lastActivity)).toBe(false);
    });

    it('✅ déconnecte après timeout', () => {
      const lastActivity = Date.now();
      vi.advanceTimersByTime(31 * 60 * 1000); // 31 minutes
      
      expect(shouldLogoutForInactivity(lastActivity)).toBe(true);
    });

    it('✅ utilise un timeout personnalisé', () => {
      const lastActivity = Date.now();
      vi.advanceTimersByTime(10 * 60 * 1000); // 10 minutes
      
      expect(shouldLogoutForInactivity(lastActivity, 5 * 60 * 1000)).toBe(true); // Timeout 5min
    });
  });

  // =====================================================
  // 10. MOYENNE QUOTIDIENNE
  // =====================================================
  describe('📅 Moyenne Quotidienne', () => {
    
    it('✅ calcule la moyenne', () => {
      const dailyTimes: DailyStudyTime[] = [
        { date: '2026-01-10', seconds: 3600 },
        { date: '2026-01-11', seconds: 1800 },
        { date: '2026-01-12', seconds: 2700 }
      ];
      
      expect(calculateDailyAverage(dailyTimes)).toBe(2700); // (3600+1800+2700)/3
    });

    it('✅ gère un tableau vide', () => {
      expect(calculateDailyAverage([])).toBe(0);
    });
  });

  // =====================================================
  // 11. STREAK D'ÉTUDE
  // =====================================================
  describe('🔥 Streak d\'Étude', () => {
    
    beforeEach(() => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2026-01-12'));
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('✅ calcule un streak consécutif', () => {
      const dailyTimes: DailyStudyTime[] = [
        { date: '2026-01-12', seconds: 1800 },
        { date: '2026-01-11', seconds: 3600 },
        { date: '2026-01-10', seconds: 2400 }
      ];
      
      expect(calculateStudyStreak(dailyTimes)).toBe(3);
    });

    it('✅ streak interrompu', () => {
      const dailyTimes: DailyStudyTime[] = [
        { date: '2026-01-12', seconds: 1800 },
        { date: '2026-01-11', seconds: 3600 },
        // Jour manquant (10 et 09)
        { date: '2026-01-08', seconds: 2400 }
      ];
      
      expect(calculateStudyStreak(dailyTimes)).toBe(2);
    });

    it('✅ aucun streak si aujourd\'hui non étudié', () => {
      const dailyTimes: DailyStudyTime[] = [
        { date: '2026-01-10', seconds: 1800 },
        { date: '2026-01-09', seconds: 3600 }
      ];
      
      expect(calculateStudyStreak(dailyTimes)).toBe(0);
    });

    it('✅ gère un tableau vide', () => {
      expect(calculateStudyStreak([])).toBe(0);
    });
  });
});
