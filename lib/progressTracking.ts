// lib/progressTracking.ts

import { prisma } from '@/lib/prisma';

// Types pour les modules
export type ModuleType = 'LECTURE' | 'TAJWID';

/**
 * Enregistre qu'une page a été complétée (MODULE LECTURE)
 * À appeler depuis votre API quand completedPages change
 */
export async function logPageCompletion(
  userId: string,
  pageNumber: number,
  chapterId: number
) {
  try {
    console.log(`📝 [TRACKING LECTURE] Tentative d'enregistrement page: userId=${userId}, page=${pageNumber}, chapter=${chapterId}`);

    const log = await (prisma as any).userProgressLog.create({
      data: {
        userId,
        actionType: 'PAGE_COMPLETED',
        pageNumber,
        chapterId,
        completedAt: new Date(),
      },
    });

    console.log(`✅ [TRACKING LECTURE] Log créé avec succès:`, log.id);

    // Créer/mettre à jour le snapshot quotidien pour LECTURE
    await updateDailySnapshot(userId, 'LECTURE');

    console.log(`✅ [TRACKING LECTURE] Snapshot mis à jour pour userId=${userId}`);
  } catch (error) {
    console.error('❌ [TRACKING LECTURE] Erreur enregistrement page complétée:', error);
    throw error;
  }
}

/**
 * Enregistre qu'un quiz a été complété (MODULE LECTURE)
 */
export async function logQuizCompletion(
  userId: string,
  chapterId: number
) {
  try {
    console.log(`📝 [TRACKING LECTURE] Tentative d'enregistrement quiz: userId=${userId}, chapter=${chapterId}`);

    const log = await (prisma as any).userProgressLog.create({
      data: {
        userId,
        actionType: 'QUIZ_COMPLETED',
        chapterId,
        completedAt: new Date(),
      },
    });

    console.log(`✅ [TRACKING LECTURE] Quiz log créé avec succès:`, log.id);

    // Créer/mettre à jour le snapshot quotidien pour LECTURE
    await updateDailySnapshot(userId, 'LECTURE');

    console.log(`✅ [TRACKING LECTURE] Snapshot mis à jour pour userId=${userId}`);
  } catch (error) {
    console.error('❌ [TRACKING LECTURE] Erreur enregistrement quiz complété:', error);
    throw error;
  }
}

/**
 * Enregistre qu'une page a été complétée (MODULE TAJWID)
 */
export async function logPageCompletionTajwid(
  userId: string,
  pageNumber: number,
  chapterId: number
) {
  try {
    console.log(`📝 [TRACKING TAJWID] Tentative d'enregistrement page: userId=${userId}, page=${pageNumber}, chapter=${chapterId}`);

    const log = await (prisma as any).userProgressLog.create({
      data: {
        userId,
        actionType: 'PAGE_COMPLETED_TAJWID',
        pageNumber,
        chapterId,
        completedAt: new Date(),
      },
    });

    console.log(`✅ [TRACKING TAJWID] Log créé avec succès:`, log.id);

    // Créer/mettre à jour le snapshot quotidien pour TAJWID
    await updateDailySnapshot(userId, 'TAJWID');

    console.log(`✅ [TRACKING TAJWID] Snapshot mis à jour pour userId=${userId}`);
  } catch (error) {
    console.error('❌ [TRACKING TAJWID] Erreur enregistrement page complétée:', error);
    throw error;
  }
}

/**
 * Enregistre qu'un quiz a été complété (MODULE TAJWID)
 */
export async function logQuizCompletionTajwid(
  userId: string,
  chapterId: number
) {
  try {
    console.log(`📝 [TRACKING TAJWID] Tentative d'enregistrement quiz: userId=${userId}, chapter=${chapterId}`);

    const log = await (prisma as any).userProgressLog.create({
      data: {
        userId,
        actionType: 'QUIZ_COMPLETED_TAJWID',
        chapterId,
        completedAt: new Date(),
      },
    });

    console.log(`✅ [TRACKING TAJWID] Quiz log créé avec succès:`, log.id);

    // Créer/mettre à jour le snapshot quotidien pour TAJWID
    await updateDailySnapshot(userId, 'TAJWID');

    console.log(`✅ [TRACKING TAJWID] Snapshot mis à jour pour userId=${userId}`);
  } catch (error) {
    console.error('❌ [TRACKING TAJWID] Erreur enregistrement quiz complété:', error);
    throw error;
  }
}

/**
 * Met à jour le snapshot quotidien pour un utilisateur
 * Calcule la progression RÉELLE du jour pour le module spécifié
 */
async function updateDailySnapshot(userId: string, module: ModuleType = 'LECTURE') {
  try {
    console.log(`📸 [SNAPSHOT ${module}] Mise à jour snapshot pour userId=${userId}`);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { 
        completedPages: true, 
        completedQuizzes: true,
        completedPagesTajwid: true,
        completedQuizzesTajwid: true,
      },
    });

    if (!user) {
      console.warn(`⚠️ [SNAPSHOT ${module}] Utilisateur ${userId} non trouvé`);
      return;
    }

    let validPages: number[];
    let validQuizzes: number[];
    let totalPages: number;
    let totalQuizzes: number;

    if (module === 'TAJWID') {
      // TAJWID: pages 1-32 (32 pages), exclure page 0 et page 33 (évaluation finale)
      // 8 quizzes (chapitres 1-8)
      validPages = (user.completedPagesTajwid || []).filter(p => p !== 0 && p !== 33);
      validQuizzes = user.completedQuizzesTajwid || [];
      totalPages = 32;
      totalQuizzes = 8;
    } else {
      // LECTURE: pages 1-29 (29 pages), exclure page 0 et page 30
      // 10 quizzes (chapitres 0-9, excluant 10 et 11)
      validPages = (user.completedPages || []).filter(p => p !== 0 && p !== 30);
      validQuizzes = (user.completedQuizzes || []).filter(q => q !== 10 && q !== 11);
      totalPages = 29;
      totalQuizzes = 10;
    }

    const totalItems = totalPages + totalQuizzes;
    const completedItems = validPages.length + validQuizzes.length;
    const progressPercentage = totalItems > 0
      ? Math.round((completedItems / totalItems) * 100)
      : 0;

    console.log(`📊 [SNAPSHOT] Stats calculées:`, {
      validPages: validPages.length,
      validQuizzes: validQuizzes.length,
      progressPercentage,
      date: today.toISOString()
    });

    // Créer ou mettre à jour le snapshot
    const snapshot = await (prisma as any).dailyProgressSnapshot.upsert({
      where: {
        userId_snapshotDate_module: {
          userId,
          snapshotDate: today,
          module,
        },
      },
      create: {
        userId,
        snapshotDate: today,
        module,
        pagesCompletedCount: validPages.length,
        quizzesCompletedCount: validQuizzes.length,
        progressPercentage,
      },
      update: {
        pagesCompletedCount: validPages.length,
        quizzesCompletedCount: validQuizzes.length,
        progressPercentage,
      },
    });

    console.log(`✅ [SNAPSHOT ${module}] Snapshot enregistré:`, snapshot.id);
  } catch (error) {
    console.error(`❌ [SNAPSHOT ${module}] Erreur mise à jour snapshot quotidien:`, error);
    throw error;
  }
}

/**
 * Récupère les snapshots de la dernière semaine (7 jours) pour un module
 */
export async function getWeeklyProgressData(userId: string, module: ModuleType = 'LECTURE') {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(today.getDate() - 6);

  const snapshots = await (prisma as any).dailyProgressSnapshot.findMany({
    where: {
      userId,
      module,
      snapshotDate: {
        gte: sevenDaysAgo,
        lte: today,
      },
    },
    orderBy: { snapshotDate: 'asc' },
  });

  return snapshots;
}

/**
 * Récupère les snapshots du mois en cours pour un module
 */
export async function getMonthlyProgressData(userId: string, module: ModuleType = 'LECTURE') {
  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  firstDayOfMonth.setHours(0, 0, 0, 0);

  const snapshots = await (prisma as any).dailyProgressSnapshot.findMany({
    where: {
      userId,
      module,
      snapshotDate: {
        gte: firstDayOfMonth,
        lte: today,
      },
    },
    orderBy: { snapshotDate: 'asc' },
  });

  return snapshots;
}

/**
 * Compare progression mois actuel vs mois précédent pour un module
 */
export async function getMonthlyComparison(userId: string, module: ModuleType = 'LECTURE') {
  const today = new Date();
  
  // Mois actuel
  const firstDayCurrentMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  firstDayCurrentMonth.setHours(0, 0, 0, 0);

  // Mois précédent
  const firstDayPreviousMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
  const lastDayPreviousMonth = new Date(today.getFullYear(), today.getMonth(), 0);
  firstDayPreviousMonth.setHours(0, 0, 0, 0);
  lastDayPreviousMonth.setHours(23, 59, 59, 999);

  const currentMonthData = await (prisma as any).dailyProgressSnapshot.findMany({
    where: {
      userId,
      module,
      snapshotDate: {
        gte: firstDayCurrentMonth,
        lte: today,
      },
    },
    orderBy: { snapshotDate: 'desc' },
    take: 1,
  });

  const previousMonthData = await (prisma as any).dailyProgressSnapshot.findMany({
    where: {
      userId,
      module,
      snapshotDate: {
        gte: firstDayPreviousMonth,
        lte: lastDayPreviousMonth,
      },
    },
    orderBy: { snapshotDate: 'desc' },
    take: 1,
  });

  const currentMonthProgress = currentMonthData[0]?.progressPercentage || 0;
  const previousMonthProgress = previousMonthData[0]?.progressPercentage || 0;
  
  const difference = currentMonthProgress - previousMonthProgress;
  
  let trend: 'up' | 'down' | 'stable' = 'stable';
  if (difference > 5) trend = 'up';
  else if (difference < -5) trend = 'down';

  return {
    currentMonth: currentMonthProgress,
    previousMonth: previousMonthProgress,
    trend,
    difference,
  };
}