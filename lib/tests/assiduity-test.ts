import { prisma } from '@/lib/prisma';

export interface AssiduityTestConfig {
  analysisDepth: 'week' | 'month' | 'quarter';
  includeInactive: boolean;
  minStudyTime: number; // en secondes
  minProgressThreshold: number; // en pourcentage
}

export interface AssiduityTestResult {
  testId: string;
  timestamp: string;
  config: AssiduityTestConfig;
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
  categories: {
    assiduous: UserAssiduityProfile[];
    moderate: UserAssiduityProfile[];
    inactive: UserAssiduityProfile[];
    atRisk: UserAssiduityProfile[];
  };
  trends: {
    studyTimeTrend: 'increasing' | 'stable' | 'decreasing';
    progressTrend: 'increasing' | 'stable' | 'decreasing';
    userActivityTrend: 'increasing' | 'stable' | 'decreasing';
  };
  alerts: string[];
  recommendations: string[];
}

export interface UserAssiduityProfile {
  userId: string;
  email: string;
  username: string | null;
  gender: 'HOMME' | 'FEMME' | null;
  studyTimeSeconds: number;
  studyTimeFormatted: string;
  progressPercentage: number;
  completedPages: number;
  completedQuizzes: number;
  lastActivity: string;
  daysSinceLastActivity: number;
  weeklyStudyTime: number;
  monthlyStudyTime: number;
  assiduityScore: number;
  category: 'assiduous' | 'moderate' | 'inactive' | 'at_risk';
  riskFactors: string[];
  createdAt: string;
}

type TrendDirection = 'increasing' | 'stable' | 'decreasing';

export class AssiduityTester {
  private config: AssiduityTestConfig;

  constructor(config: AssiduityTestConfig) {
    this.config = config;
  }

  async runTest(): Promise<AssiduityTestResult> {
    const testId = `assiduity_test_${Date.now()}`;
    const startTime = Date.now();

    console.log(`📊 [ASSIDUITY TEST] Démarrage du test ${testId}`);
    console.log(`⚙️ [ASSIDUITY TEST] Configuration:`, this.config);

    try {
      // 1. Récupérer tous les utilisateurs avec leurs données
      const users = await this.getUsersWithActivity();
      console.log(`👥 [ASSIDUITY TEST] ${users.length} utilisateurs analysés`);

      // 2. Analyser l'assiduité de chaque utilisateur
      const userProfiles = await this.analyzeUserAssiduity(users);

      // 3. Catégoriser les utilisateurs
      const categories = this.categorizeUsers(userProfiles);

      // 4. Calculer les métriques globales
      const metrics = this.calculateMetrics(userProfiles);

      // 5. Analyser les tendances
      const trends = await this.analyzeTrends(users);

      // 6. Générer des alertes et recommandations
      const alerts = this.generateAlerts(metrics, categories);
      const recommendations = this.generateRecommendations(metrics, categories, trends);

      const overview = {
        totalUsers: users.length,
        activeUsers: users.filter(u => u.isActive).length,
        assiduousUsers: categories.assiduous.length,
        moderateUsers: categories.moderate.length,
        inactiveUsers: categories.inactive.length,
        atRiskUsers: categories.atRisk.length,
      };

      const totalTestDuration = Date.now() - startTime;
      console.log(`✅ [ASSIDUITY TEST] Test terminé en ${totalTestDuration}ms`);

      return {
        testId,
        timestamp: new Date().toISOString(),
        config: this.config,
        overview,
        metrics,
        categories,
        trends,
        alerts,
        recommendations
      };
    } catch (error) {
      console.error('❌ [ASSIDUITY TEST] Erreur:', error);
      throw new Error(`Échec du test d'assiduité: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  }

  private async getUsersWithActivity() {
    const whereCondition = this.config.includeInactive ? {} : { isActive: true };

    return await prisma.user.findMany({
      where: whereCondition,
      select: {
        id: true,
        email: true,
        username: true,
        gender: true,
        isActive: true,
        studyTimeSeconds: true,
        completedPages: true,
        completedQuizzes: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { studyTimeSeconds: 'desc' }
    });
  }

  private async analyzeUserAssiduity(users: any[]): Promise<UserAssiduityProfile[]> {
    const profiles: UserAssiduityProfile[] = [];

    for (const user of users) {
      const completedPages = user.completedPages.filter((p: number) => p !== 0 && p !== 30).length;
      const completedQuizzes = user.completedQuizzes.filter((q: number) => q !== 11).length;
      const totalPossibleItems = 29 + 11; // 29 pages + 11 quiz
      const progressPercentage = Math.round(((completedPages + completedQuizzes) / totalPossibleItems) * 100);

      const lastActivity = user.updatedAt;
      const daysSinceLastActivity = Math.floor((Date.now() - new Date(lastActivity).getTime()) / (1000 * 60 * 60 * 24));

      // Calculer le temps d'étude hebdomadaire et mensuel (estimation)
      const accountAge = Math.max(1, Math.floor((Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24)));
      const weeklyStudyTime = Math.round((user.studyTimeSeconds / accountAge) * 7);
      const monthlyStudyTime = Math.round((user.studyTimeSeconds / accountAge) * 30);

      // Calculer le score d'assiduité (0-100)
      const assiduityScore = this.calculateAssiduityScore({
        studyTime: user.studyTimeSeconds,
        progress: progressPercentage,
        daysSinceLastActivity,
        accountAge
      });

      // Identifier les facteurs de risque
      const riskFactors = this.identifyRiskFactors({
        studyTime: user.studyTimeSeconds,
        progress: progressPercentage,
        daysSinceLastActivity,
        weeklyStudyTime,
        accountAge
      });

      // Déterminer la catégorie
      const category = this.determineCategory(assiduityScore, daysSinceLastActivity, progressPercentage);

      profiles.push({
        userId: user.id,
        email: user.email,
        username: user.username,
        gender: user.gender,
        studyTimeSeconds: user.studyTimeSeconds,
        studyTimeFormatted: this.formatStudyTime(user.studyTimeSeconds),
        progressPercentage,
        completedPages,
        completedQuizzes,
        lastActivity: lastActivity.toISOString(),
        daysSinceLastActivity,
        weeklyStudyTime,
        monthlyStudyTime,
        assiduityScore,
        category,
        riskFactors,
        createdAt: user.createdAt.toISOString()
      });
    }

    return profiles;
  }

  private calculateAssiduityScore(data: {
    studyTime: number;
    progress: number;
    daysSinceLastActivity: number;
    accountAge: number;
  }): number {
    let score = 0;

    // Temps d'étude (40% du score)
    const studyTimeScore = Math.min((data.studyTime / 3600) * 10, 40); // 1h = 10 points, max 40
    score += studyTimeScore;

    // Progression (30% du score)
    const progressScore = (data.progress / 100) * 30;
    score += progressScore;

    // Activité récente (20% du score)
    const activityScore = Math.max(0, 20 - (data.daysSinceLastActivity * 2));
    score += activityScore;

    // Régularité (10% du score)
    const regularityScore = data.accountAge > 0 
      ? Math.min((data.studyTime / data.accountAge) * 0.1, 10)
      : 0;
    score += regularityScore;

    return Math.round(Math.min(score, 100));
  }

  private identifyRiskFactors(data: {
    studyTime: number;
    progress: number;
    daysSinceLastActivity: number;
    weeklyStudyTime: number;
    accountAge: number;
  }): string[] {
    const factors: string[] = [];

    if (data.daysSinceLastActivity > 7) {
      factors.push('Inactif depuis plus de 7 jours');
    }

    if (data.studyTime < 600) { // moins de 10 minutes
      factors.push('Temps d\'étude très faible');
    }

    if (data.progress < 10 && data.accountAge > 7) {
      factors.push('Progression lente malgré l\'ancienneté du compte');
    }

    if (data.weeklyStudyTime < 300) { // moins de 5 minutes par semaine
      factors.push('Rythme d\'étude insuffisant');
    }

    if (data.progress === 0 && data.accountAge > 3) {
      factors.push('Aucune progression après 3 jours');
    }

    return factors;
  }

  private determineCategory(
    assiduityScore: number, 
    daysSinceLastActivity: number, 
    progressPercentage: number
  ): 'assiduous' | 'moderate' | 'inactive' | 'at_risk' {
    if (daysSinceLastActivity > 14) {
      return 'inactive';
    }

    if (assiduityScore >= 70 && daysSinceLastActivity <= 3) {
      return 'assiduous';
    }

    if (assiduityScore < 30 || (daysSinceLastActivity > 7 && progressPercentage < 25)) {
      return 'at_risk';
    }

    return 'moderate';
  }

  private categorizeUsers(profiles: UserAssiduityProfile[]) {
    return {
      assiduous: profiles.filter(p => p.category === 'assiduous'),
      moderate: profiles.filter(p => p.category === 'moderate'),
      inactive: profiles.filter(p => p.category === 'inactive'),
      atRisk: profiles.filter(p => p.category === 'at_risk'),
    };
  }

  private calculateMetrics(profiles: UserAssiduityProfile[]) {
    const totalUsers = profiles.length;
    
    if (totalUsers === 0) {
      return {
        averageStudyTime: 0,
        averageProgress: 0,
        averageSessionsPerWeek: 0,
        dropoutRate: 0,
        engagementScore: 0
      };
    }

    const averageStudyTime = Math.round(
      profiles.reduce((sum, p) => sum + p.studyTimeSeconds, 0) / totalUsers
    );

    const averageProgress = Math.round(
      profiles.reduce((sum, p) => sum + p.progressPercentage, 0) / totalUsers
    );

    const averageSessionsPerWeek = Math.round(
      profiles.reduce((sum, p) => sum + (p.weeklyStudyTime / 1800), 0) / totalUsers // 30min = 1 session
    );

    const inactiveUsers = profiles.filter(p => p.daysSinceLastActivity > 14).length;
    const dropoutRate = Math.round((inactiveUsers / totalUsers) * 100);

    const engagementScore = Math.round(
      profiles.reduce((sum, p) => sum + p.assiduityScore, 0) / totalUsers
    );

    return {
      averageStudyTime,
      averageProgress,
      averageSessionsPerWeek,
      dropoutRate,
      engagementScore
    };
  }

  private determineTrendDirection(current: number, previous: number): TrendDirection {
    if (current > previous * 1.1) return 'increasing';
    if (current < previous * 0.9) return 'decreasing';
    return 'stable';
  }

  private async analyzeTrends(users: any[]) {
    // Analyser les tendances sur les 30 derniers jours
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    
    const recentUsers = users.filter(u => new Date(u.updatedAt) >= thirtyDaysAgo);
    const olderUsers = users.filter(u => new Date(u.updatedAt) < thirtyDaysAgo);

    // Tendance du temps d'étude
    const recentAvgStudyTime = recentUsers.length > 0 
      ? recentUsers.reduce((sum, u) => sum + u.studyTimeSeconds, 0) / recentUsers.length
      : 0;
    const olderAvgStudyTime = olderUsers.length > 0 
      ? olderUsers.reduce((sum, u) => sum + u.studyTimeSeconds, 0) / olderUsers.length
      : 0;

    const studyTimeTrend = this.determineTrendDirection(recentAvgStudyTime, olderAvgStudyTime);

    // Tendance de progression
    const recentAvgProgress = recentUsers.length > 0 
      ? recentUsers.reduce((sum, u) => {
          const completedPages = u.completedPages.filter((p: number) => p !== 0 && p !== 30).length;
          const completedQuizzes = u.completedQuizzes.filter((q: number) => q !== 11).length;
          return sum + ((completedPages + completedQuizzes) / 40) * 100;
        }, 0) / recentUsers.length
      : 0;

    const olderAvgProgress = olderUsers.length > 0 
      ? olderUsers.reduce((sum, u) => {
          const completedPages = u.completedPages.filter((p: number) => p !== 0 && p !== 30).length;
          const completedQuizzes = u.completedQuizzes.filter((q: number) => q !== 11).length;
          return sum + ((completedPages + completedQuizzes) / 40) * 100;
        }, 0) / olderUsers.length
      : 0;

    const progressTrend = this.determineTrendDirection(recentAvgProgress, olderAvgProgress);

    // Tendance d'activité utilisateur
    const userActivityTrend: TrendDirection = 
      recentUsers.length > olderUsers.length ? 'increasing' :
      recentUsers.length < olderUsers.length * 0.8 ? 'decreasing' : 'stable';

    return {
      studyTimeTrend,
      progressTrend,
      userActivityTrend
    };
  }

  private generateAlerts(metrics: any, categories: any): string[] {
    const alerts: string[] = [];

    if (metrics.dropoutRate > 30) {
      alerts.push(`🚨 CRITIQUE: Taux d'abandon élevé (${metrics.dropoutRate}%)`);
    }

    if (metrics.averageProgress < 25) {
      alerts.push(`⚠️ ATTENTION: Progression moyenne faible (${metrics.averageProgress}%)`);
    }

    if (categories.atRisk.length > categories.assiduous.length) {
      alerts.push(`🔴 URGENT: Plus d'utilisateurs à risque que d'utilisateurs assidus`);
    }

    if (metrics.engagementScore < 40) {
      alerts.push(`📉 PRÉOCCUPANT: Score d'engagement faible (${metrics.engagementScore}/100)`);
    }

    if (categories.inactive.length > 0) {
      alerts.push(`😴 INFO: ${categories.inactive.length} utilisateurs inactifs détectés`);
    }

    return alerts;
  }

  private generateRecommendations(metrics: any, categories: any, trends: any): string[] {
    const recommendations: string[] = [];

    if (categories.atRisk.length > 0) {
      recommendations.push(`📧 Envoyer des emails de motivation aux ${categories.atRisk.length} utilisateurs à risque`);
    }

    if (metrics.averageSessionsPerWeek < 3) {
      recommendations.push(`⏰ Encourager des sessions d'étude plus fréquentes (actuellement ${metrics.averageSessionsPerWeek}/semaine)`);
    }

    if (trends.studyTimeTrend === 'decreasing') {
      recommendations.push(`📈 Mettre en place des incitations pour augmenter le temps d'étude`);
    }

    if (categories.assiduous.length > 0) {
      recommendations.push(`🏆 Récompenser les ${categories.assiduous.length} utilisateurs assidus avec des badges ou certificats`);
    }

    if (metrics.dropoutRate > 20) {
      recommendations.push(`🎯 Améliorer l'onboarding pour réduire le taux d'abandon (${metrics.dropoutRate}%)`);
    }

    if (categories.inactive.length > 5) {
      recommendations.push(`🔄 Lancer une campagne de réactivation pour les ${categories.inactive.length} utilisateurs inactifs`);
    }

    return recommendations;
  }

  private formatStudyTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}min ${secs}s`;
    }
    if (minutes > 0) {
      return `${minutes}min ${secs}s`;
    }
    return `${secs}s`;
  }
}

// Fonctions utilitaires pour lancer des tests rapides
export async function runQuickAssiduityTest(): Promise<AssiduityTestResult> {
  const tester = new AssiduityTester({
    analysisDepth: 'week',
    includeInactive: false,
    minStudyTime: 300, // 5 minutes
    minProgressThreshold: 10 // 10%
  });

  return await tester.runTest();
}

export async function runDetailedAssiduityTest(): Promise<AssiduityTestResult> {
  const tester = new AssiduityTester({
    analysisDepth: 'month',
    includeInactive: true,
    minStudyTime: 1800, // 30 minutes
    minProgressThreshold: 25 // 25%
  });

  return await tester.runTest();
}