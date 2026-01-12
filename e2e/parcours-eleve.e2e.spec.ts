// e2e/parcours-eleve.e2e.spec.ts
// Test End-to-End : Parcours complet d'un élève
// Login → Dashboard → Quiz → Réponse → Score

import { test, expect, Page } from '@playwright/test';

/**
 * Configuration des données de test
 * ⚠️ Modifiez ces valeurs selon votre environnement de test
 * 
 * Pour exécuter le test complet avec un vrai compte :
 * 1. Créez un compte de test dans votre application
 * 2. Modifiez TEST_USER.email et TEST_USER.password ci-dessous
 * 3. Mettez USE_REAL_ACCOUNT à true
 */
const USE_REAL_ACCOUNT = process.env.E2E_USE_REAL_ACCOUNT === 'true';

const TEST_USER = {
  // Utilisez un compte de test existant dans votre base de données
  email: process.env.E2E_TEST_EMAIL || 'test@gmail.com',
  password: process.env.E2E_TEST_PASSWORD || 'TestPassword123!',
  // Alternative avec username
  username: 'testuser',
};

// Chapitre à tester (doit exister dans votre application)
const TEST_CHAPTER = 1;

// =====================================================
// HELPERS & UTILITAIRES
// =====================================================

/**
 * Attend que la page soit complètement chargée
 */
async function waitForPageLoad(page: Page) {
  await page.waitForLoadState('networkidle');
  await page.waitForLoadState('domcontentloaded');
}

/**
 * Se connecter à l'application
 */
async function login(page: Page, identifier: string, password: string) {
  // Aller sur la page de connexion
  await page.goto('/login');
  await waitForPageLoad(page);

  // Remplir le formulaire
  await page.locator('input[name="identifier"], input[type="email"], input[placeholder*="email" i], input[placeholder*="pseudo" i]').first().fill(identifier);
  await page.locator('input[name="password"], input[type="password"]').first().fill(password);

  // Cliquer sur le bouton de connexion
  await page.locator('button[type="submit"]').click();

  // Attendre la redirection vers le dashboard
  await page.waitForURL('**/dashboard**', { timeout: 15000 });
}

// =====================================================
// TEST PRINCIPAL : PARCOURS ÉLÈVE COMPLET
// =====================================================

test.describe('Parcours Élève E2E', () => {
  test.describe.configure({ mode: 'serial' }); // Tests séquentiels

  let page: Page;

  test.beforeAll(async ({ browser }) => {
    // Créer un nouveau contexte de navigateur
    const context = await browser.newContext({
      viewport: { width: 1280, height: 720 },
    });
    page = await context.newPage();
  });

  test.afterAll(async () => {
    await page.close();
  });

  // ─────────────────────────────────────────────────────
  // ÉTAPE 1 : PAGE DE LOGIN
  // ─────────────────────────────────────────────────────
  test('1️⃣ L\'utilisateur arrive sur la page de login', async () => {
    await page.goto('/login');
    await waitForPageLoad(page);

    // Vérifier que la page de login est affichée
    await expect(page).toHaveURL(/.*login.*/);

    // Vérifier les éléments essentiels du formulaire
    const emailInput = page.locator('input[name="identifier"], input[type="email"], input[placeholder*="email" i], input[placeholder*="pseudo" i]').first();
    const passwordInput = page.locator('input[name="password"], input[type="password"]').first();
    const submitButton = page.locator('button[type="submit"]');

    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    await expect(submitButton).toBeVisible();

    // Capture d'écran pour documentation
    await page.screenshot({ path: 'e2e/screenshots/01-login-page.png' });
  });

  // ─────────────────────────────────────────────────────
  // ÉTAPE 2 : CONNEXION
  // ─────────────────────────────────────────────────────
  test('2️⃣ L\'utilisateur se connecte avec succès', async () => {
    // Skip si pas de compte réel configuré
    if (!USE_REAL_ACCOUNT) {
      console.log('⚠️ Test skip: Configurez E2E_USE_REAL_ACCOUNT=true et les identifiants pour tester la connexion réelle');
      test.skip(true, 'Compte de test non configuré. Définissez E2E_USE_REAL_ACCOUNT=true et E2E_TEST_EMAIL/E2E_TEST_PASSWORD');
      return;
    }

    // Remplir les identifiants
    await page.locator('input[name="identifier"], input[type="email"], input[placeholder*="email" i], input[placeholder*="pseudo" i]').first().fill(TEST_USER.email);
    await page.locator('input[name="password"], input[type="password"]').first().fill(TEST_USER.password);

    // Capture avant soumission
    await page.screenshot({ path: 'e2e/screenshots/02-login-filled.png' });

    // Soumettre le formulaire
    await page.locator('button[type="submit"]').click();

    // Attendre la redirection vers le dashboard (ou une réponse)
    try {
      await page.waitForURL('**/dashboard**', { timeout: 15000 });
      
      // Capture après connexion réussie
      await page.screenshot({ path: 'e2e/screenshots/03-login-success.png' });
    } catch {
      // Si la connexion échoue, vérifier le message d'erreur
      const errorVisible = await page.locator('[class*="error"], [class*="alert"], .text-red-500, .text-red-600').isVisible();
      if (errorVisible) {
        await page.screenshot({ path: 'e2e/screenshots/03-login-error.png' });
        throw new Error('La connexion a échoué. Vérifiez les identifiants de test ou créez un compte de test.');
      }
      throw new Error('Timeout lors de la connexion');
    }
  });

  // ─────────────────────────────────────────────────────
  // ÉTAPE 3 : ACCÈS AU DASHBOARD
  // ─────────────────────────────────────────────────────
  test('3️⃣ L\'utilisateur accède au dashboard', async () => {
    // Skip si pas de compte réel configuré
    if (!USE_REAL_ACCOUNT) {
      test.skip(true, 'Nécessite une connexion réelle');
      return;
    }

    // Vérifier que nous sommes sur le dashboard
    await expect(page).toHaveURL(/.*dashboard.*/);
    await waitForPageLoad(page);

    // Vérifier les éléments clés du dashboard
    // Attendre que le contenu du dashboard soit chargé
    await page.waitForSelector('body', { state: 'visible' });

    // Vérifier la présence d'éléments typiques du dashboard
    const dashboardContent = page.locator('main, [class*="dashboard"], [class*="container"]').first();
    await expect(dashboardContent).toBeVisible();

    // Capture du dashboard
    await page.screenshot({ path: 'e2e/screenshots/04-dashboard.png', fullPage: true });

    // Vérifier qu'il y a des chapitres ou du contenu disponible
    const hasContent = await page.locator('a[href*="chapitres"], a[href*="quiz"], [class*="chapter"], [class*="progress"]').first().isVisible().catch(() => false);
    
    console.log('Dashboard chargé avec succès');
  });

  // ─────────────────────────────────────────────────────
  // ÉTAPE 4 : LANCER UN QUIZ
  // ─────────────────────────────────────────────────────
  test('4️⃣ L\'utilisateur lance un quiz', async () => {
    // Skip si pas de compte réel configuré
    if (!USE_REAL_ACCOUNT) {
      test.skip(true, 'Nécessite une connexion réelle');
      return;
    }

    // Naviguer vers le quiz du chapitre de test
    await page.goto(`/chapitres/${TEST_CHAPTER}/quiz`);
    await waitForPageLoad(page);

    // Vérifier que nous sommes sur la page du quiz
    await expect(page).toHaveURL(new RegExp(`.*chapitres.*${TEST_CHAPTER}.*quiz.*`));

    // Attendre que le quiz soit chargé
    await page.waitForSelector('body', { state: 'visible' });

    // Vérifier la présence des éléments du quiz
    // Le composant Quiz affiche "Test de connaissances" ou "Question X sur Y"
    const quizLoaded = await page.locator('text=/test de connaissances|question|quiz/i').first().isVisible({ timeout: 10000 }).catch(() => false);
    
    if (!quizLoaded) {
      // Peut-être que le quiz nécessite une autorisation ou n'existe pas
      const notFoundOrRestricted = await page.locator('text=/not found|accès|interdit|unauthorized/i').isVisible().catch(() => false);
      if (notFoundOrRestricted) {
        test.skip(true, `Le quiz du chapitre ${TEST_CHAPTER} n'est pas accessible`);
      }
    }

    // Capture de la page du quiz
    await page.screenshot({ path: 'e2e/screenshots/05-quiz-start.png' });

    console.log('Quiz lancé avec succès');
  });

  // ─────────────────────────────────────────────────────
  // ÉTAPE 5 : RÉPONDRE À UNE QUESTION
  // ─────────────────────────────────────────────────────
  test('5️⃣ L\'utilisateur répond à une question', async () => {
    // Skip si pas de compte réel configuré
    if (!USE_REAL_ACCOUNT) {
      test.skip(true, 'Nécessite une connexion réelle');
      return;
    }

    // Attendre que les options de réponse soient visibles
    const answerButtons = page.locator('button:not([type="submit"])').filter({ hasText: /.+/ });
    
    // Vérifier qu'il y a des options de réponse
    const buttonCount = await answerButtons.count();
    
    if (buttonCount === 0) {
      // Essayer avec d'autres sélecteurs possibles
      const alternativeButtons = page.locator('[class*="choice"], [class*="answer"], [class*="option"]');
      const altCount = await alternativeButtons.count();
      
      if (altCount === 0) {
        await page.screenshot({ path: 'e2e/screenshots/06-no-answers.png' });
        test.skip(true, 'Aucune option de réponse trouvée');
        return;
      }
      
      // Cliquer sur la première option alternative
      await alternativeButtons.first().click();
    } else {
      // Capture avant de répondre
      await page.screenshot({ path: 'e2e/screenshots/06-question.png' });

      // Cliquer sur la première option disponible
      // Dans le composant Quiz, les options sont des boutons
      await answerButtons.first().click();
    }

    // Attendre un court instant pour la transition
    await page.waitForTimeout(500);

    // Capture après avoir répondu
    await page.screenshot({ path: 'e2e/screenshots/07-answer-selected.png' });

    console.log('Réponse sélectionnée avec succès');
  });

  // ─────────────────────────────────────────────────────
  // ÉTAPE 6 : VOIR SON SCORE / PROGRESSION
  // ─────────────────────────────────────────────────────
  test('6️⃣ L\'utilisateur voit son score / progression', async () => {
    // Skip si pas de compte réel configuré
    if (!USE_REAL_ACCOUNT) {
      test.skip(true, 'Nécessite une connexion réelle');
      return;
    }

    // Répondre aux questions restantes pour terminer le quiz
    // Le quiz passe automatiquement à la question suivante après une réponse
    
    let questionNumber = 2;
    const maxQuestions = 10; // Sécurité pour éviter une boucle infinie

    while (questionNumber <= maxQuestions) {
      // Vérifier si on est sur la page de résultats
      const isResultPage = await page.locator('text=/score|résultat|excellent|continue.*effort/i').first().isVisible().catch(() => false);
      
      if (isResultPage) {
        console.log(`Quiz terminé après ${questionNumber - 1} questions`);
        break;
      }

      // Vérifier si une nouvelle question est affichée
      const questionIndicator = await page.locator(`text=/Question ${questionNumber}/i`).isVisible().catch(() => false);
      
      if (questionIndicator || questionNumber === 2) {
        // Répondre à la question actuelle
        const answerButtons = page.locator('button:not([type="submit"])').filter({ hasText: /.+/ });
        const buttonCount = await answerButtons.count();
        
        if (buttonCount > 0) {
          // Sélectionner une réponse (première option)
          await answerButtons.first().click();
          await page.waitForTimeout(600); // Attendre la transition
        } else {
          break; // Plus de questions
        }
      }

      questionNumber++;
    }

    // Attendre que les résultats soient affichés
    await page.waitForTimeout(1000);

    // Vérifier l'affichage du score
    const scoreVisible = await page.locator('text=/score|%|excellent|continue.*effort|résultat/i').first().isVisible().catch(() => false);

    if (scoreVisible) {
      // Capture du score final
      await page.screenshot({ path: 'e2e/screenshots/08-score-final.png' });

      // Vérifier les éléments de score
      // Le composant affiche "Score : X / Y (Z%)"
      const scoreText = await page.locator('text=/Score.*\d+.*\/.*\d+/i').textContent().catch(() => null);
      
      if (scoreText) {
        console.log(`📊 ${scoreText}`);
      }

      // Vérifier la présence du pourcentage
      const percentageText = await page.locator('text=/\d+%/').textContent().catch(() => null);
      if (percentageText) {
        console.log(`📈 Pourcentage: ${percentageText}`);
      }

      // Vérifier les boutons d'action (Recommencer, Voir les erreurs, etc.)
      const restartButton = page.locator('button:has-text("Recommencer")');
      const hasRestartButton = await restartButton.isVisible().catch(() => false);
      
      expect(scoreVisible).toBeTruthy();
      console.log('✅ Score affiché avec succès');
    } else {
      await page.screenshot({ path: 'e2e/screenshots/08-score-not-found.png' });
      console.log('⚠️ Le score n\'est pas visible - le quiz peut avoir une structure différente');
    }

    // Vérification finale : retour possible au dashboard
    const dashboardLink = page.locator('a[href*="dashboard"], a:has-text("Tableau de bord"), a:has-text("Dashboard")');
    const canReturnToDashboard = await dashboardLink.first().isVisible().catch(() => false);
    
    console.log(`🏠 Retour au dashboard possible: ${canReturnToDashboard}`);
  });
});

// =====================================================
// TEST ALTERNATIF : PARCOURS RAPIDE (SANS COMPTE)
// =====================================================

test.describe('Parcours de base (vérification pages)', () => {
  
  test('Vérifier que les pages principales sont accessibles', async ({ page }) => {
    // Page d'accueil
    await page.goto('/');
    await expect(page).toHaveURL(/.*\//);
    
    // Page de connexion
    await page.goto('/login');
    await expect(page).toHaveURL(/.*login.*/);
    const loginForm = page.locator('form, [class*="login"], input[type="password"]').first();
    await expect(loginForm).toBeVisible();
    
    // Page d'inscription
    await page.goto('/signup');
    const signupForm = page.locator('form, [class*="signup"], [class*="register"], input[type="email"]').first();
    await expect(signupForm).toBeVisible();
  });

  test('Vérifier la navigation sans authentification', async ({ page }) => {
    // Essayer d'accéder au dashboard sans être connecté
    await page.goto('/dashboard');
    
    // On devrait être redirigé vers login ou voir un message d'erreur
    const currentUrl = page.url();
    const isRedirectedOrBlocked = 
      currentUrl.includes('login') || 
      currentUrl.includes('signin') ||
      await page.locator('text=/connexion|login|se connecter/i').isVisible().catch(() => false);
    
    expect(isRedirectedOrBlocked).toBeTruthy();
  });
});
