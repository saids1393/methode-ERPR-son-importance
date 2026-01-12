import { defineConfig, devices } from '@playwright/test';

/**
 * Configuration Playwright pour les tests E2E
 * Méthode Lire et Écrire - E-learning
 */
export default defineConfig({
  // Dossier contenant les tests E2E
  testDir: './e2e',
  
  // Timeout global pour chaque test
  timeout: 60_000,
  
  // Timeout pour les assertions expect()
  expect: {
    timeout: 10_000,
  },
  
  // Exécution en parallèle
  fullyParallel: true,
  
  // Échouer le build si des test.only sont présents en CI
  forbidOnly: !!process.env.CI,
  
  // Nombre de retries
  retries: process.env.CI ? 2 : 0,
  
  // Workers en parallèle
  workers: process.env.CI ? 1 : undefined,
  
  // Reporters
  reporter: [
    ['html', { open: 'never' }],
    ['list'],
  ],
  
  // Configuration globale pour tous les tests
  use: {
    // URL de base de l'application
    baseURL: 'http://localhost:3000',
    
    // Traces pour le débogage
    trace: 'on-first-retry',
    
    // Screenshots en cas d'échec
    screenshot: 'only-on-failure',
    
    // Vidéo en cas d'échec
    video: 'on-first-retry',
    
    // Timeout des actions
    actionTimeout: 15_000,
    
    // Timeout de navigation
    navigationTimeout: 30_000,
  },

  // Projets (navigateurs)
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  // Serveur web à démarrer avant les tests
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
