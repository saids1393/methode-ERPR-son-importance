import { chapters as allChapters } from '@/lib/chapters';
import { chaptersTajwid } from '@/lib/chapters-tajwid';

/**
 * Nouveau système d'accès - Les abonnés ont accès aux 2 modules
 * Plan SOLO et COACHING donnent tous les deux accès à LECTURE + TAJWID
 */

/**
 * Récupère les chapitres selon le module demandé
 * @param module - 'LECTURE' ou 'TAJWID'
 * @returns Tableau des chapitres du module
 */
export function getChaptersByModule(module: 'LECTURE' | 'TAJWID' | null) {
  if (!module) {
    return [];
  }

  if (module === 'TAJWID') {
    return chaptersTajwid;
  }

  return allChapters.filter(chapter => {
    const chapterModule = chapter.module || 'LECTURE';
    return chapterModule === 'LECTURE';
  });
}

/**
 * Vérifie si un utilisateur a accès à un chapitre spécifique
 * Avec le nouveau système, tous les abonnés actifs ont accès à tous les chapitres
 * @param chapterNumber - Numéro du chapitre
 * @param userModule - Le module demandé (pour filtrer les chapitres)
 * @param isActive - L'utilisateur est-il actif (abonné)
 * @returns true si l'utilisateur a accès
 */
export function hasAccessToChapter(
  chapterNumber: number,
  userModule: 'LECTURE' | 'TAJWID' | null,
  isActive: boolean = true
): boolean {
  // Si l'utilisateur n'est pas actif, pas d'accès
  if (!isActive) {
    return false;
  }

  // Si pas de module spécifié, pas d'accès
  if (!userModule) {
    return false;
  }

  // Vérifier que le chapitre existe dans le module demandé
  if (userModule === 'TAJWID') {
    const chapter = chaptersTajwid.find(ch => ch.chapterNumber === chapterNumber);
    return !!chapter;
  }

  const chapter = allChapters.find(ch => ch.chapterNumber === chapterNumber);
  if (!chapter) {
    return false;
  }

  const chapterModule = chapter.module || 'LECTURE';
  return chapterModule === userModule;
}

/**
 * Calcule le nombre total de leçons et quiz selon le module
 * @param userModule - Le module ('LECTURE' ou 'TAJWID')
 * @returns Objet avec totalPages, totalQuizzes, totalChapters
 */
export function getModuleTotals(userModule: 'LECTURE' | 'TAJWID' | null) {
  if (!userModule) {
    return { totalPages: 0, totalQuizzes: 0, totalChapters: 0 };
  }

  const accessibleChapters = getChaptersByModule(userModule);
  
  if (userModule === 'TAJWID') {
    // Pour Tajwid, exclure la page 0
    const totalPages = accessibleChapters.reduce((total, ch) => {
      const pagesCount = ch.pages.filter(p => p.pageNumber !== 0).length;
      return total + pagesCount;
    }, 0);
    
    const totalQuizzes = accessibleChapters.filter(ch => ch.quiz && ch.quiz.length > 0).length;
    const totalChapters = accessibleChapters.length;
    
    return { totalPages, totalQuizzes, totalChapters };
  }

  // Pour Lecture, exclure les chapitres spéciaux (0 et 11)
  const learnableChapters = accessibleChapters.filter(ch => ch.chapterNumber !== 0 && ch.chapterNumber !== 11);
  
  // Calculer le total des pages (leçons) - page 30 exclue
  const totalPages = learnableChapters.reduce((total, ch) => {
    const pagesCount = ch.pages.filter(p => p.pageNumber !== 28 && p.pageNumber !== 30).length;
    return total + pagesCount;
  }, 0);
  
  // Calculer le total des quiz - seulement si le chapitre a un quiz
  const totalQuizzes = learnableChapters.filter(ch => ch.quiz && ch.quiz.length > 0).length;
  
  // Total des chapitres (pour les devoirs)
  const totalChapters = learnableChapters.length;
  
  return { totalPages, totalQuizzes, totalChapters };
}

/**
 * Vérifie si un utilisateur a un abonnement actif
 * @param user - L'objet utilisateur avec accountType et subscriptionEndDate
 * @returns true si l'abonnement est actif
 */
export function hasActiveSubscription(user: {
  accountType: string;
  subscriptionEndDate?: Date | null;
  isActive: boolean;
}): boolean {
  // Vérifier que l'utilisateur est actif
  if (!user.isActive) {
    return false;
  }

  // Vérifier le type de compte
  if (user.accountType !== 'ACTIVE' && user.accountType !== 'PAID_LEGACY') {
    return false;
  }

  // Si PAID_LEGACY, accès illimité (ancien système)
  if (user.accountType === 'PAID_LEGACY') {
    return true;
  }

  // Vérifier la date de fin d'abonnement
  if (!user.subscriptionEndDate) {
    return false;
  }

  const now = new Date();
  return new Date(user.subscriptionEndDate) > now;
}

/**
 * Retourne les informations d'accès de l'utilisateur
 */
export function getUserAccessInfo(user: {
  accountType: string;
  subscriptionPlan?: string | null;
  subscriptionEndDate?: Date | null;
  isActive: boolean;
}) {
  const hasAccess = hasActiveSubscription(user);
  
  return {
    hasAccess,
    canAccessLecture: hasAccess,
    canAccessTajwid: hasAccess,
    plan: user.subscriptionPlan || null,
    expiresAt: user.subscriptionEndDate || null,
  };
}
