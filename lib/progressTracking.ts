// lib/progressTracking.ts

import { prisma } from '@/lib/prisma';

/**
 * Enregistre qu'une page a été complétée
 * À appeler depuis votre API quand completedPages change
 */
export async function logPageCompletion(
  userId: string,
  pageNumber: number,
  chapterId: number
) {
  try {
    await (prisma as any).userProgressLog.create({
      data: {
        userId,
        actionType: 'PAGE_COMPLETED',
        pageNumber,
        chapterId,
        completedAt: new Date(),
      },
    });

    // Créer/mettre à jour le snapshot quotidien
    await updateDailySnapshot(userId);
  } catch (error) {
    console.error('Erreur enregistrement page complétée:', error);
  }
}

/**
 * Enregistre qu'un quiz a été complété
 */
export async function logQuizCompletion(
  userId: string,
  chapterId: number
) {
  try {
    await (prisma as any).userProgressLog.create({
      data: {
        userId,
        actionType: 'QUIZ_COMPLETED',
        chapterId,
        completedAt: new Date(),
      },
    });

    // Créer/mettre à jour le snapshot quotidien
    await updateDailySnapshot(userId);
  } catch (error) {
    console.error('Erreur enregistrement quiz complété:', error);
  }
}

/**
 * Met à jour le snapshot quotidien pour un utilisateur
 * Calcule la progression RÉELLE du jour
 */
async function updateDailySnapshot(userId: string) {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { completedPages: true, completedQuizzes: true },
    });

    if (!user) return;

    // Filtrer les données réelles (pas les 0 et 30)
    const validPages = user.completedPages.filter(p => p !== 0 && p !== 30);
    
    // Calculer la progression réelle
    // À adapter selon votre logique de totaux
    const totalPages = 29; // À récupérer depuis vos chapitres réels
    const totalQuizzes = 11; // À adapter
    const totalItems = totalPages + totalQuizzes;
    const completedItems = validPages.length + user.completedQuizzes.length;
    const progressPercentage = totalItems > 0 
      ? Math.round((completedItems / totalItems) * 100) 
      : 0;

    // Créer ou mettre à jour le snapshot
    await (prisma as any).dailyProgressSnapshot.upsert({
      where: {
        userId_snapshotDate: {
          userId,
          snapshotDate: today,
        },
      },
      create: {
        userId,
        snapshotDate: today,
        pagesCompletedCount: validPages.length,
        quizzesCompletedCount: user.completedQuizzes.length,
        progressPercentage,
      },
      update: {
        pagesCompletedCount: validPages.length,
        quizzesCompletedCount: user.completedQuizzes.length,
        progressPercentage,
      },
    });
  } catch (error) {
    console.error('Erreur mise à jour snapshot quotidien:', error);
  }
}

/**
 * Récupère les snapshots de la dernière semaine (7 jours)
 */
export async function getWeeklyProgressData(userId: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(today.getDate() - 6);

  const snapshots = await (prisma as any).dailyProgressSnapshot.findMany({
    where: {
      userId,
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
 * Récupère les snapshots du mois en cours
 */
export async function getMonthlyProgressData(userId: string) {
  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  firstDayOfMonth.setHours(0, 0, 0, 0);

  const snapshots = await (prisma as any).dailyProgressSnapshot.findMany({
    where: {
      userId,
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
 * Compare progression mois actuel vs mois précédent
 */
export async function getMonthlyComparison(userId: string) {
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