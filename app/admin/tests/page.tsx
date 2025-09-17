'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Play,
  Settings,
  Users,
  TrendingUp,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Download,
  RefreshCw,
  Zap,
  Target,
  Activity,
  BarChart3
} from 'lucide-react';
import toast from 'react-hot-toast';

interface ConnectionTestResult {
  testId: string;
  timestamp: string;
  results: {
    totalTested: number;
    successfulConnections: number;
    failedConnections: number;
    successRate: number;
    averageResponseTime: number;
    minResponseTime: number;
    maxResponseTime: number;
    timeoutCount: number;
  };
  performance: {
    dbQueryTime: number;
    authProcessTime: number;
    totalTestDuration: number;
  };
  recommendations: string[];
}

interface AssiduityTestResult {
  testId: string;
  timestamp: string;
  overview: {
    totalUsers: number;
    activeUsers: number;
    assiduousUsers: number;
    moderateUsers: number;
    inactiveUsers: number;
    atRiskUsers: number;
  };
  metrics: {
    averageStudyTime: number;
    averageProgress: number;
    averageSessionsPerWeek: number;
    dropoutRate: number;
    engagementScore: number;
  };
  trends: {
    studyTimeTrend: 'increasing' | 'stable' | 'decreasing';
    progressTrend: 'increasing' | 'stable' | 'decreasing';
    userActivityTrend: 'increasing' | 'stable' | 'decreasing';
  };
  alerts: string[];
  recommendations: string[];
}

export default function AdminTestsPage() {
  const [connectionResult, setConnectionResult] = useState<ConnectionTestResult | null>(null);
  const [assiduityResult, setAssiduityResult] = useState<AssiduityTestResult | null>(null);
  const [connectionLoading, setConnectionLoading] = useState(false);
  const [assiduityLoading, setAssiduityLoading] = useState(false);
  const [connectionConfig, setConnectionConfig] = useState({
    sampleSize: 10,
    includeInactive: false,
    testType: 'connection' as 'connection' | 'performance',
    timeout: 5000
  });
  const [assiduityConfig, setAssiduityConfig] = useState({
    analysisDepth: 'week' as 'week' | 'month' | 'quarter',
    includeInactive: false,
    minStudyTime: 300,
    minProgressThreshold: 10
  });
  const router = useRouter();

  const runConnectionTest = async () => {
    setConnectionLoading(true);
    try {
      const response = await fetch('/api/admin/tests/connection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(connectionConfig)
      });

      const data = await response.json();

      if (data.success) {
        setConnectionResult(data.result);
        toast.success('Test de connexion terminé avec succès !');
      } else {
        toast.error(data.error || 'Erreur lors du test');
      }
    } catch (error) {
      toast.error('Erreur de connexion');
      console.error('Connection test error:', error);
    } finally {
      setConnectionLoading(false);
    }
  };

  const runAssiduityTest = async () => {
    setAssiduityLoading(true);
    try {
      const response = await fetch('/api/admin/tests/assiduity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(assiduityConfig)
      });

      const data = await response.json();

      if (data.success) {
        setAssiduityResult(data.result);
        toast.success('Test d\'assiduité terminé avec succès !');
      } else {
        toast.error(data.error || 'Erreur lors du test');
      }
    } catch (error) {
      toast.error('Erreur de connexion');
      console.error('Assiduity test error:', error);
    } finally {
      setAssiduityLoading(false);
    }
  };

  const runQuickTests = async () => {
    toast.loading('Lancement des tests rapides...');
    
    try {
      const [connectionResponse, assiduityResponse] = await Promise.all([
        fetch('/api/admin/tests/connection'),
        fetch('/api/admin/tests/assiduity')
      ]);

      const [connectionData, assiduityData] = await Promise.all([
        connectionResponse.json(),
        assiduityResponse.json()
      ]);

      if (connectionData.success) setConnectionResult(connectionData.result);
      if (assiduityData.success) setAssiduityResult(assiduityData.result);

      toast.dismiss();
      toast.success('Tests rapides terminés !');
    } catch (error) {
      toast.dismiss();
      toast.error('Erreur lors des tests rapides');
      console.error('Quick tests error:', error);
    }
  };

  const exportResults = () => {
    const data = {
      connectionTest: connectionResult,
      assiduityTest: assiduityResult,
      exportedAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tests-techniques-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url);
    document.body.removeChild(a);
    toast.success('Résultats exportés !');
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}min`;
    }
    return `${minutes}min`;
  };

  return (
    <div className="min-h-screen bg-zinc-900 text-white">
      {/* Header */}
      <div className="bg-zinc-800 border-b border-zinc-700 p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Link
              href="/admin"
              className="bg-zinc-700 hover:bg-zinc-600 text-white p-2 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            
            <div className="flex-1">
              <h1 className="text-2xl lg:text-3xl font-bold flex items-center gap-3">
                <div className="bg-green-600 p-2 rounded-lg">
                  <Activity className="h-6 w-6 lg:h-8 lg:w-8" />
                </div>
                Tests Techniques
              </h1>
              <p className="text-zinc-400 mt-2">
                Diagnostics de connexion et analyse d'assiduité des utilisateurs
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={runQuickTests}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Zap className="h-4 w-4" />
                Tests Rapides
              </button>
              
              {(connectionResult || assiduityResult) && (
                <button
                  onClick={exportResults}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <Download className="h-4 w-4" />
                  Exporter
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Test de Connexion */}
          <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Test de Connexion</h2>
                <p className="text-zinc-400 text-sm">Vérification de l'authentification utilisateurs</p>
              </div>
            </div>

            {/* Configuration */}
            <div className="space-y-4 mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Taille échantillon
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={connectionConfig.sampleSize}
                    onChange={(e) => setConnectionConfig(prev => ({ 
                      ...prev, 
                      sampleSize: parseInt(e.target.value) || 10 
                    }))}
                    className="w-full bg-zinc-700 border border-zinc-600 rounded-lg px-3 py-2 text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Type de test
                  </label>
                  <select
                    value={connectionConfig.testType}
                    onChange={(e) => setConnectionConfig(prev => ({ 
                      ...prev, 
                      testType: e.target.value as 'connection' | 'performance' 
                    }))}
                    className="w-full bg-zinc-700 border border-zinc-600 rounded-lg px-3 py-2 text-white"
                  >
                    <option value="connection">Connexion</option>
                    <option value="performance">Performance</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="includeInactiveConn"
                  checked={connectionConfig.includeInactive}
                  onChange={(e) => setConnectionConfig(prev => ({ 
                    ...prev, 
                    includeInactive: e.target.checked 
                  }))}
                  className="w-4 h-4 text-blue-600 bg-zinc-700 border-zinc-600 rounded"
                />
                <label htmlFor="includeInactiveConn" className="text-zinc-300 text-sm">
                  Inclure les utilisateurs inactifs
                </label>
              </div>
            </div>

            {/* Bouton de lancement */}
            <button
              onClick={runConnectionTest}
              disabled={connectionLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:opacity-50 text-white font-semibold px-6 py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {connectionLoading ? (
                <>
                  <RefreshCw className="h-5 w-5 animate-spin" />
                  Test en cours...
                </>
              ) : (
                <>
                  <Play className="h-5 w-5" />
                  Lancer le test
                </>
              )}
            </button>

            {/* Résultats */}
            {connectionResult && (
              <div className="mt-6 space-y-4">
                <div className="bg-zinc-700 rounded-lg p-4">
                  <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-blue-400" />
                    Résultats du Test
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-zinc-400">Utilisateurs testés</div>
                      <div className="text-white font-semibold">{connectionResult.results.totalTested}</div>
                    </div>
                    <div>
                      <div className="text-zinc-400">Taux de réussite</div>
                      <div className={`font-semibold ${
                        connectionResult.results.successRate >= 90 ? 'text-green-400' :
                        connectionResult.results.successRate >= 70 ? 'text-yellow-400' : 'text-red-400'
                      }`}>
                        {connectionResult.results.successRate}%
                      </div>
                    </div>
                    <div>
                      <div className="text-zinc-400">Temps moyen</div>
                      <div className="text-white font-semibold">{connectionResult.results.averageResponseTime}ms</div>
                    </div>
                    <div>
                      <div className="text-zinc-400">Timeouts</div>
                      <div className={`font-semibold ${connectionResult.results.timeoutCount > 0 ? 'text-red-400' : 'text-green-400'}`}>
                        {connectionResult.results.timeoutCount}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recommandations */}
                {connectionResult.recommendations.length > 0 && (
                  <div className="bg-zinc-700 rounded-lg p-4">
                    <h4 className="font-semibold text-white mb-3">Recommandations</h4>
                    <div className="space-y-2">
                      {connectionResult.recommendations.map((rec, index) => (
                        <div key={index} className="text-zinc-300 text-sm flex items-start gap-2">
                          <div className="w-1 h-1 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                          <span>{rec}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Test d'Assiduité */}
          <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-purple-600 p-2 rounded-lg">
                <TrendingUp className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Test d'Assiduité</h2>
                <p className="text-zinc-400 text-sm">Analyse de l'engagement et régularité</p>
              </div>
            </div>

            {/* Configuration */}
            <div className="space-y-4 mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Profondeur d'analyse
                  </label>
                  <select
                    value={assiduityConfig.analysisDepth}
                    onChange={(e) => setAssiduityConfig(prev => ({ 
                      ...prev, 
                      analysisDepth: e.target.value as 'week' | 'month' | 'quarter' 
                    }))}
                    className="w-full bg-zinc-700 border border-zinc-600 rounded-lg px-3 py-2 text-white"
                  >
                    <option value="week">Semaine</option>
                    <option value="month">Mois</option>
                    <option value="quarter">Trimestre</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Temps min (secondes)
                  </label>
                  <input
                    type="number"
                    min="60"
                    max="7200"
                    value={assiduityConfig.minStudyTime}
                    onChange={(e) => setAssiduityConfig(prev => ({ 
                      ...prev, 
                      minStudyTime: parseInt(e.target.value) || 300 
                    }))}
                    className="w-full bg-zinc-700 border border-zinc-600 rounded-lg px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="includeInactiveAss"
                  checked={assiduityConfig.includeInactive}
                  onChange={(e) => setAssiduityConfig(prev => ({ 
                    ...prev, 
                    includeInactive: e.target.checked 
                  }))}
                  className="w-4 h-4 text-purple-600 bg-zinc-700 border-zinc-600 rounded"
                />
                <label htmlFor="includeInactiveAss" className="text-zinc-300 text-sm">
                  Inclure les utilisateurs inactifs
                </label>
              </div>
            </div>

            {/* Bouton de lancement */}
            <button
              onClick={runAssiduityTest}
              disabled={assiduityLoading}
              className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 disabled:opacity-50 text-white font-semibold px-6 py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {assiduityLoading ? (
                <>
                  <RefreshCw className="h-5 w-5 animate-spin" />
                  Analyse en cours...
                </>
              ) : (
                <>
                  <Play className="h-5 w-5" />
                  Lancer l'analyse
                </>
              )}
            </button>

            {/* Résultats */}
            {assiduityResult && (
              <div className="mt-6 space-y-4">
                {/* Alertes */}
                {assiduityResult.alerts.length > 0 && (
                  <div className="bg-red-900/30 border border-red-500/30 rounded-lg p-4">
                    <h4 className="font-semibold text-red-400 mb-3 flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5" />
                      Alertes
                    </h4>
                    <div className="space-y-2">
                      {assiduityResult.alerts.map((alert, index) => (
                        <div key={index} className="text-red-300 text-sm">{alert}</div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Vue d'ensemble */}
                <div className="bg-zinc-700 rounded-lg p-4">
                  <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                    <Target className="h-5 w-5 text-purple-400" />
                    Vue d'ensemble
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-zinc-400">Utilisateurs assidus</div>
                      <div className="text-green-400 font-semibold">{assiduityResult.overview.assiduousUsers}</div>
                    </div>
                    <div>
                      <div className="text-zinc-400">À risque</div>
                      <div className="text-red-400 font-semibold">{assiduityResult.overview.atRiskUsers}</div>
                    </div>
                    <div>
                      <div className="text-zinc-400">Score engagement</div>
                      <div className={`font-semibold ${
                        assiduityResult.metrics.engagementScore >= 70 ? 'text-green-400' :
                        assiduityResult.metrics.engagementScore >= 40 ? 'text-yellow-400' : 'text-red-400'
                      }`}>
                        {assiduityResult.metrics.engagementScore}/100
                      </div>
                    </div>
                    <div>
                      <div className="text-zinc-400">Taux d'abandon</div>
                      <div className={`font-semibold ${
                        assiduityResult.metrics.dropoutRate <= 10 ? 'text-green-400' :
                        assiduityResult.metrics.dropoutRate <= 25 ? 'text-yellow-400' : 'text-red-400'
                      }`}>
                        {assiduityResult.metrics.dropoutRate}%
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tendances */}
                <div className="bg-zinc-700 rounded-lg p-4">
                  <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-purple-400" />
                    Tendances
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Temps d'étude</span>
                      <span className={`font-semibold ${
                        assiduityResult.trends.studyTimeTrend === 'increasing' ? 'text-green-400' :
                        assiduityResult.trends.studyTimeTrend === 'decreasing' ? 'text-red-400' : 'text-yellow-400'
                      }`}>
                        {assiduityResult.trends.studyTimeTrend === 'increasing' ? '📈 Croissante' :
                         assiduityResult.trends.studyTimeTrend === 'decreasing' ? '📉 Décroissante' : '➡️ Stable'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Progression</span>
                      <span className={`font-semibold ${
                        assiduityResult.trends.progressTrend === 'increasing' ? 'text-green-400' :
                        assiduityResult.trends.progressTrend === 'decreasing' ? 'text-red-400' : 'text-yellow-400'
                      }`}>
                        {assiduityResult.trends.progressTrend === 'increasing' ? '📈 Croissante' :
                         assiduityResult.trends.progressTrend === 'decreasing' ? '📉 Décroissante' : '➡️ Stable'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Recommandations */}
                {assiduityResult.recommendations.length > 0 && (
                  <div className="bg-zinc-700 rounded-lg p-4">
                    <h4 className="font-semibold text-white mb-3">Recommandations</h4>
                    <div className="space-y-2">
                      {assiduityResult.recommendations.map((rec, index) => (
                        <div key={index} className="text-zinc-300 text-sm flex items-start gap-2">
                          <div className="w-1 h-1 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                          <span>{rec}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Résumé global */}
        {(connectionResult || assiduityResult) && (
          <div className="mt-8 bg-zinc-800 border border-zinc-700 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Activity className="h-6 w-6 text-green-400" />
              Résumé des Tests
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {connectionResult && (
                <div className="text-center">
                  <div className={`text-2xl font-bold mb-1 ${
                    connectionResult.results.successRate >= 90 ? 'text-green-400' :
                    connectionResult.results.successRate >= 70 ? 'text-yellow-400' : 'text-red-400'
                  }`}>
                    {connectionResult.results.successRate}%
                  </div>
                  <div className="text-zinc-400 text-sm">Connexions réussies</div>
                </div>
              )}

              {connectionResult && (
                <div className="text-center">
                  <div className={`text-2xl font-bold mb-1 ${
                    connectionResult.results.averageResponseTime <= 500 ? 'text-green-400' :
                    connectionResult.results.averageResponseTime <= 1000 ? 'text-yellow-400' : 'text-red-400'
                  }`}>
                    {connectionResult.results.averageResponseTime}ms
                  </div>
                  <div className="text-zinc-400 text-sm">Temps de réponse</div>
                </div>
              )}

              {assiduityResult && (
                <div className="text-center">
                  <div className={`text-2xl font-bold mb-1 ${
                    assiduityResult.metrics.engagementScore >= 70 ? 'text-green-400' :
                    assiduityResult.metrics.engagementScore >= 40 ? 'text-yellow-400' : 'text-red-400'
                  }`}>
                    {assiduityResult.metrics.engagementScore}/100
                  </div>
                  <div className="text-zinc-400 text-sm">Score d'engagement</div>
                </div>
              )}

              {assiduityResult && (
                <div className="text-center">
                  <div className={`text-2xl font-bold mb-1 ${
                    assiduityResult.metrics.dropoutRate <= 10 ? 'text-green-400' :
                    assiduityResult.metrics.dropoutRate <= 25 ? 'text-yellow-400' : 'text-red-400'
                  }`}>
                    {assiduityResult.metrics.dropoutRate}%
                  </div>
                  <div className="text-zinc-400 text-sm">Taux d'abandon</div>
                </div>
              )}
            </div>

            {/* État global du système */}
            <div className="mt-6 text-center">
              {connectionResult && assiduityResult && (
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${
                  connectionResult.results.successRate >= 90 && assiduityResult.metrics.engagementScore >= 60
                    ? 'bg-green-900/30 text-green-400 border border-green-500/30'
                    : connectionResult.results.successRate >= 70 && assiduityResult.metrics.engagementScore >= 40
                    ? 'bg-yellow-900/30 text-yellow-400 border border-yellow-500/30'
                    : 'bg-red-900/30 text-red-400 border border-red-500/30'
                }`}>
                  {connectionResult.results.successRate >= 90 && assiduityResult.metrics.engagementScore >= 60 ? (
                    <>
                      <CheckCircle className="h-5 w-5" />
                      <span className="font-semibold">Système en excellente santé</span>
                    </>
                  ) : connectionResult.results.successRate >= 70 && assiduityResult.metrics.engagementScore >= 40 ? (
                    <>
                      <Clock className="h-5 w-5" />
                      <span className="font-semibold">Système stable - Améliorations possibles</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-5 w-5" />
                      <span className="font-semibold">Attention requise - Optimisations nécessaires</span>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}