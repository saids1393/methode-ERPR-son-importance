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
    const user = await getAuthUserFromRequest(request);

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const timeZone = request.headers.get('X-Timezone') || 'Europe/Paris';
    
    const weekSnapshots = await getWeeklyProgressData(user.id);
    const monthSnapshots = await getMonthlyProgressData(user.id);
    const monthlyComparison = await getMonthlyComparison(user.id);

    const weekData = formatWeekData(weekSnapshots, timeZone);
    const monthData = formatMonthData(monthSnapshots, timeZone);

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
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function formatWeekData(snapshots: any[], timeZone: string): DayProgress[] {
  const days = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
  const today = getDateInTimeZone(new Date(), timeZone);
  today.setHours(0, 0, 0, 0);

  const weekData: DayProgress[] = [];

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);

    const dayName = days[date.getDay()];

    const snapshot = snapshots.find((s) => {
      const snapDate = getDateInTimeZone(new Date(s.snapshotDate), timeZone);
      snapDate.setHours(0, 0, 0, 0);
      return snapDate.getTime() === date.getTime();
    });

    const dataToUse = snapshot || getLastValidSnapshot(snapshots, date, timeZone);

    weekData.push({
      day: dayName,
      completed: dataToUse?.pagesCompletedCount || 0,
      total: 30,
      percentage: dataToUse?.progressPercentage || 0,
    });
  }

  return weekData;
}

function formatMonthData(snapshots: any[], timeZone: string): DayProgress[] {
  const today = getDateInTimeZone(new Date(), timeZone);
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();

  const monthData: DayProgress[] = [];
  const weeksInMonth = Math.ceil(daysInMonth / 7);

  for (let week = 0; week < weeksInMonth; week++) {
    const weekStart = new Date(firstDayOfMonth);
    weekStart.setDate(firstDayOfMonth.getDate() + week * 7);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);

    const weekLabel = `S${week + 1}`;

    const weekSnapshots = snapshots.filter((s) => {
      const snapDate = getDateInTimeZone(new Date(s.snapshotDate), timeZone);
      return snapDate >= weekStart && snapDate <= weekEnd;
    });

    const lastSnapshot = weekSnapshots[weekSnapshots.length - 1];

    monthData.push({
      day: weekLabel,
      completed: lastSnapshot?.pagesCompletedCount || 0,
      total: 30,
      percentage: lastSnapshot?.progressPercentage || 0,
    });
  }

  return monthData;
}

function getLastValidSnapshot(snapshots: any[], beforeDate: Date, timeZone: string) {
  const validSnapshots = snapshots
    .filter((s) => {
      const snapDate = getDateInTimeZone(new Date(s.snapshotDate), timeZone);
      return snapDate <= beforeDate;
    })
    .sort(
      (a, b) => new Date(b.snapshotDate).getTime() - new Date(a.snapshotDate).getTime()
    );

  return validSnapshots[0];
}

function getDateInTimeZone(date: Date, timeZone: string): Date {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  const parts = formatter.formatToParts(date);
  const year = parseInt(parts.find(p => p.type === 'year')?.value || '2024');
  const month = parseInt(parts.find(p => p.type === 'month')?.value || '1') - 1;
  const day = parseInt(parts.find(p => p.type === 'day')?.value || '1');

  return new Date(year, month, day);
}