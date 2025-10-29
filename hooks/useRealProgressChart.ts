'use client';

import { useEffect, useState } from 'react';

interface DayProgress {
  day: string;
  completed: number;
  total: number;
  percentage: number;
}

interface MonthlyStats {
  currentMonth: number;
  previousMonth: number;
  trend: 'up' | 'down' | 'stable';
  difference: number;
}

interface ProgressChartData {
  weekData: DayProgress[];
  monthData: DayProgress[];
  monthlyStats: MonthlyStats;
  isLoading: boolean;
  error: string | null;
  dataSource: 'REAL_DATA' | 'FALLBACK';
}

export const useRealProgressChart = () => {
  const [data, setData] = useState<ProgressChartData>({
    weekData: [],
    monthData: [],
    monthlyStats: { 
      currentMonth: 0, 
      previousMonth: 0, 
      trend: 'stable', 
      difference: 0 
    },
    isLoading: true,
    error: null,
    dataSource: 'FALLBACK',
  });

  useEffect(() => {
    const fetchProgressData = async () => {
      try {
        console.log('📡 Récupération des données de progression...');

        const response = await fetch('/api/progress/history', {
          method: 'GET',
          cache: 'no-store',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error(`❌ Erreur API: ${response.status}`, errorText);
          throw new Error(`API error ${response.status}`);
        }

        const result = await response.json();

        console.log('✅ Données reçues:', {
          source: result.source,
          weekDataLength: result.weekData?.length || 0,
          monthDataLength: result.monthData?.length || 0,
          monthlyStats: result.monthlyStats,
        });

        // Valider les données
        if (!Array.isArray(result.weekData)) {
          throw new Error('Invalid weekData format');
        }
        if (!Array.isArray(result.monthData)) {
          throw new Error('Invalid monthData format');
        }

        setData({
          weekData: result.weekData || [],
          monthData: result.monthData || [],
          monthlyStats: result.monthlyStats || {
            currentMonth: 0,
            previousMonth: 0,
            trend: 'stable',
            difference: 0,
          },
          isLoading: false,
          error: null,
          dataSource: result.source || 'REAL_DATA',
        });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error('❌ Erreur chargement données:', errorMessage);

        setData((prev) => ({
          ...prev,
          isLoading: false,
          error: errorMessage,
          dataSource: 'FALLBACK',
        }));
      }
    };

    fetchProgressData();

    // Rafraîchir toutes les 5 minutes
    const interval = setInterval(fetchProgressData, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return data;
};

export default useRealProgressChart;