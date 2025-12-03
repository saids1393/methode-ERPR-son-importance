import { chapters as allChapters } from '@/lib/chapters';

/**
 * Filtre les chapitres selon le module de l'utilisateur
 * @param userModule - Le module auquel l'utilisateur a accès ('LECTURE' ou 'TAJWID')
 * @returns Tableau des chapitres accessibles
 */
export function getChaptersByModule(userModule: 'LECTURE' | 'TAJWID' | null) {
  if (!userModule) {
    return [];
  }

  return allChapters.filter(chapter => {
    // Si le chapitre n'a pas de module défini, par défaut c'est LECTURE
    const chapterModule = chapter.module || 'LECTURE';
    return chapterModule === userModule;
  });
}

/**
 * Vérifie si un utilisateur a accès à un chapitre spécifique
 * @param chapterNumber - Numéro du chapitre
 * @param userModule - Le module auquel l'utilisateur a accès
 * @returns true si l'utilisateur a accès
 */
export function hasAccessToChapter(
  chapterNumber: number,
  userModule: 'LECTURE' | 'TAJWID' | null
): boolean {
  const chapter = allChapters.find(ch => ch.chapterNumber === chapterNumber);
  if (!chapter || !userModule) {
    return false;
  }

  const chapterModule = chapter.module || 'LECTURE';
  return chapterModule === userModule;
}

/**
 * Calcule le nombre total de leçons et quiz selon le module
 * @param userModule - Le module auquel l'utilisateur a accès
 * @returns Objet avec totalPages, totalQuizzes, totalChapters
 */
export function getModuleTotals(userModule: 'LECTURE' | 'TAJWID' | null) {
  if (!userModule) {
    return { totalPages: 0, totalQuizzes: 0, totalChapters: 0 };
  }

  const accessibleChapters = getChaptersByModule(userModule);
  
  // Exclure les chapitres spéciaux (0 et 11)
  const learnableChapters = accessibleChapters.filter(ch => ch.chapterNumber !== 0 && ch.chapterNumber !== 11);
  
  // Calculer le total des pages (leçons) - page 30 exclue
  const totalPages = learnableChapters.reduce((total, ch) => {
    const pagesCount = ch.pages.filter(p => p.pageNumber !== 30).length;
    return total + pagesCount;
  }, 0);
  
  // Calculer le total des quiz - seulement si le chapitre a un quiz
  const totalQuizzes = learnableChapters.filter(ch => ch.quiz && ch.quiz.length > 0).length;
  
  // Total des chapitres (pour les devoirs)
  const totalChapters = learnableChapters.length;
  
  return { totalPages, totalQuizzes, totalChapters };
}
