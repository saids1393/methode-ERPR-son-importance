'use client';

import { useEffect, useRef } from 'react';

interface ChartData {
  date?: string;
  week?: string;
  users: number;
  revenue: number;
}

interface StatsChartProps {
  data: ChartData[];
  period: 'daily' | 'weekly';
}

export default function StatsChart({ data, period }: StatsChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !data.length) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Configuration du canvas
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    
    ctx.scale(dpr, dpr);
    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';

    // Dimensions du graphique
    const padding = 60;
    const chartWidth = rect.width - padding * 2;
    const chartHeight = rect.height - padding * 2;

    // Nettoyer le canvas
    ctx.clearRect(0, 0, rect.width, rect.height);

    // Données pour le graphique
    const maxUsers = Math.max(...data.map(d => d.users), 10);
    const maxRevenue = Math.max(...data.map(d => d.revenue), 100);

    // Fonction pour obtenir les coordonnées
    const getX = (index: number) => padding + (index / (data.length - 1)) * chartWidth;
    const getUserY = (users: number) => padding + chartHeight - (users / maxUsers) * chartHeight;
    const getRevenueY = (revenue: number) => padding + chartHeight - (revenue / maxRevenue) * chartHeight;

    // Dessiner la grille
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 1;
    
    // Lignes horizontales
    for (let i = 0; i <= 5; i++) {
      const y = padding + (i / 5) * chartHeight;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(padding + chartWidth, y);
      ctx.stroke();
    }

    // Lignes verticales
    for (let i = 0; i < data.length; i++) {
      const x = getX(i);
      ctx.beginPath();
      ctx.moveTo(x, padding);
      ctx.lineTo(x, padding + chartHeight);
      ctx.stroke();
    }

    // Dessiner la courbe des utilisateurs
    ctx.strokeStyle = '#3B82F6';
    ctx.lineWidth = 3;
    ctx.beginPath();
    
    data.forEach((point, index) => {
      const x = getX(index);
      const y = getUserY(point.users);
      
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.stroke();

    // Points sur la courbe des utilisateurs
    data.forEach((point, index) => {
      const x = getX(index);
      const y = getUserY(point.users);
      
      ctx.fillStyle = '#3B82F6';
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();
      
      // Cercle blanc autour
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2;
      ctx.stroke();
    });

    // Dessiner la courbe des revenus (échelle différente)
    ctx.strokeStyle = '#10B981';
    ctx.lineWidth = 3;
    ctx.beginPath();
    
    data.forEach((point, index) => {
      const x = getX(index);
      const y = getRevenueY(point.revenue);
      
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.stroke();

    // Points sur la courbe des revenus
    data.forEach((point, index) => {
      const x = getX(index);
      const y = getRevenueY(point.revenue);
      
      ctx.fillStyle = '#10B981';
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2;
      ctx.stroke();
    });

    // Labels des axes
    ctx.fillStyle = '#9CA3AF';
    ctx.font = '12px system-ui';
    ctx.textAlign = 'center';

    // Labels X (dates)
    data.forEach((point, index) => {
      const x = getX(index);
      const label = period === 'daily' 
        ? new Date(point.date || '').toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })
        : point.week || '';
      
      ctx.fillText(label, x, rect.height - 20);
    });

    // Labels Y (utilisateurs)
    ctx.textAlign = 'right';
    for (let i = 0; i <= 5; i++) {
      const y = padding + (i / 5) * chartHeight;
      const value = Math.round(maxUsers - (i / 5) * maxUsers);
      ctx.fillText(value.toString(), padding - 10, y + 4);
    }

    // Légende
    ctx.textAlign = 'left';
    ctx.fillStyle = '#3B82F6';
    ctx.fillRect(padding, 20, 15, 3);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText('Utilisateurs', padding + 25, 25);

    ctx.fillStyle = '#10B981';
    ctx.fillRect(padding + 120, 20, 15, 3);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText('Revenus (€)', padding + 145, 25);

  }, [data, period]);

  // Générer des données de démonstration si pas de données
  const demoData = Array.from({ length: 7 }, (_, i) => ({
    date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toISOString(),
    week: `S${i + 1}`,
    users: Math.floor(Math.random() * 50) + 10,
    revenue: Math.floor(Math.random() * 1000) + 200
  }));

  const chartData = data.length > 0 ? data : demoData;

  return (
    <div className="relative w-full h-80">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ width: '100%', height: '100%' }}
      />
      
      {/* Tooltip hover (optionnel) */}
      <div className="absolute top-4 right-4 bg-zinc-700 border border-zinc-600 rounded-lg p-3 text-sm">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          <span className="text-zinc-300">Nouveaux utilisateurs</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="text-zinc-300">Revenus générés</span>
        </div>
      </div>
    </div>
  );
}