// app/api/progress/history/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getAuthUserFromRequest } from '@/lib/auth';
import {
  getWeeklyProgressData,
  getMonthlyProgressData,
  getMonthlyComparison,
} from '@/lib/progressTracking';

interface DayProgress {
  day: string;
  completed: number;
  total: number;
  percentage: number;
}

export async function GET(request: NextRequest) {
  try {
    console.log('📡 [API /progress/history] Requête reçue');

    // ✅ Récupère l'utilisateur authentifié à partir du cookie JWT
    const user = await getAuthUserFromRequest(request);

    if (!user) {
      console.warn('⚠️ [API /progress/history] Utilisateur non authentifié');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log(`👤 [API /progress/history] Utilisateur: ${user.id}`);

    // ✅ Récupère les snapshots réels depuis la base
    console.log('📊 [API /progress/history] Récupération des snapshots...');
    const weekSnapshots = await getWeeklyProgressData(user.id);
    const monthSnapshots = await getMonthlyProgressData(user.id);
    const monthlyComparison = await getMonthlyComparison(user.id);

    console.log(`✅ [API /progress/history] Snapshots récupérés:`, {
      weekCount: weekSnapshots.length,
      monthCount: monthSnapshots.length,
      comparison: monthlyComparison
    });

    // ✅ Formate les données pour les graphiques
    const weekData = formatWeekData(weekSnapshots);
    const monthData = formatMonthData(monthSnapshots);

    console.log(`📈 [API /progress/history] Données formatées:`, {
      weekDataLength: weekData.length,
      monthDataLength: monthData.length
    });

    return NextResponse.json({
      weekData,
      monthData,
      monthlyStats: monthlyComparison,
      source: 'REAL_DATA',
      lastUpdated: new Date().toISOString(),
    });
  } catch (error) {
    console.error('❌ [API /progress/history] Erreur:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

/**
 * Formate les snapshots de la semaine pour le graphique
 */
function formatWeekData(snapshots: any[]): DayProgress[] {
  const days = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const weekData: DayProgress[] = [];

  // Générer les 7 derniers jours
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);

    const dayName = days[date.getDay()];

    // Trouver le snapshot pour ce jour
    const snapshot = snapshots.find((s) => {
      const snapDate = new Date(s.snapshotDate);
      snapDate.setHours(0, 0, 0, 0);
      return snapDate.getTime() === date.getTime();
    });

    // S'il n'y a pas de snapshot, chercher le dernier snapshot valide
    const dataToUse = snapshot || getLastValidSnapshot(snapshots, date);

    weekData.push({
      day: dayName,
      completed: dataToUse?.pagesCompletedCount || 0,
      total: 30, // 30 pages (page 0 incluse)
      percentage: dataToUse?.progressPercentage || 0,
    });
  }

  return weekData;
}

/**
 * Formate les snapshots du mois pour le graphique
 */
function formatMonthData(snapshots: any[]): DayProgress[] {
  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();

  const monthData: DayProgress[] = [];
  const weeksInMonth = Math.ceil(daysInMonth / 7);

  // Générer une entrée par semaine
  for (let week = 0; week < weeksInMonth; week++) {
    const weekStart = new Date(firstDayOfMonth);
    weekStart.setDate(firstDayOfMonth.getDate() + week * 7);

    const weekLabel = `S${week + 1}`;

    // Moyenne ou dernier snapshot connu pour la semaine
    const weekSnapshots = snapshots.filter((s) => {
      const snapDate = new Date(s.snapshotDate);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      return snapDate >= weekStart && snapDate <= weekEnd;
    });

    // Utiliser le dernier snapshot de la semaine
    const lastSnapshot = weekSnapshots[weekSnapshots.length - 1];

    monthData.push({
      day: weekLabel,
      completed: lastSnapshot?.pagesCompletedCount || 0,
      total: 30, // 30 pages (page 0 incluse)
      percentage: lastSnapshot?.progressPercentage || 0,
    });
  }

  return monthData;
}

/**
 * Trouve le dernier snapshot valide avant une date donnée
 */
function getLastValidSnapshot(snapshots: any[], beforeDate: Date) {
  const validSnapshots = snapshots
    .filter((s) => new Date(s.snapshotDate) <= beforeDate)
    .sort(
      (a, b) => new Date(b.snapshotDate).getTime() - new Date(a.snapshotDate).getTime()
    );

  return validSnapshots[0];
}
