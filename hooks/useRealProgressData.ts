// hooks/useRealProgressData.ts

import { useEffect, useState } from 'react';

interface DayProgress {
  day: string;
  completed: number;
  total: number;
  percentage: number;
  date: string;
}

interface ProgressData {
  weekData: DayProgress[];
  monthData: DayProgress[];
  monthlyStats: {
    currentMonth: number;
    previousMonth: number;
    trend: 'up' | 'down' | 'stable';
  };
  isLoading: boolean;
}

export const useRealProgressData = () => {
  const [data, setData] = useState<ProgressData>({
    weekData: [],
    monthData: [],
    monthlyStats: { currentMonth: 0, previousMonth: 0, trend: 'stable' },
    isLoading: true,
  });

  useEffect(() => {
    const fetchProgressData = async () => {
      try {
        const response = await fetch('/api/progress/history');
        if (!response.ok) throw new Error('Failed to fetch progress data');

        const result = await response.json();
        setData({
          weekData: result.weekData || [],
          monthData: result.monthData || [],
          monthlyStats: result.monthlyStats || { currentMonth: 0, previousMonth: 0, trend: 'stable' },
          isLoading: false,
        });
      } catch (error) {
        console.error('Erreur chargement données de progression:', error);
        setData(prev => ({ ...prev, isLoading: false }));
      }
    };

    fetchProgressData();
    // Rafraîchir toutes les heures
    const interval = setInterval(fetchProgressData, 3600000);
    return () => clearInterval(interval);
  }, []);

  return data;
};

export default useRealProgressData;