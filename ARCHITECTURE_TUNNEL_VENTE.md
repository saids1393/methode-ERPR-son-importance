# 🏗️ ARCHITECTURE TUNNEL DE VENTE HYBRIDE - ARABEIMPORTANCE

## 📋 VUE D'ENSEMBLE

Ce document décrit l'architecture complète du système de tunnel de vente hybride permettant aux utilisateurs de tester gratuitement la plateforme pendant 14 jours avant de payer.

---

## 🎯 OBJECTIFS ATTEINTS

✅ **Deux chemins d'accès distincts** :
- **Chemin 1** : Paiement immédiat (existant, non modifié) → Accès complet à vie
- **Chemin 2** : Inscription gratuite → Essai 14 jours → Conversion vers paiement

✅ **Protection des données** : Les utilisateurs existants sont automatiquement migrés vers `PAID_LEGACY` et conservent leur accès complet.

✅ **Heure française** : Tous les calculs de dates utilisent le fuseau horaire `Europe/Paris`.

---

## 📊 MODÈLE DE DONNÉES

### Modifications du schéma User

```prisma
model User {
  // ... champs existants ...

  // Système d'essai gratuit
  accountType       AccountType      @default(FREE_TRIAL)
  trialStartDate    DateTime?
  trialEndDate      DateTime?
  trialExpired      Boolean          @default(false)
  conversionDate    DateTime?        // Date de conversion gratuit→payant
}

enum AccountType {
  FREE_TRIAL      // Essai gratuit (accès chapitre 1 uniquement, 14 jours)
  PAID_FULL       // Payant complet (accès à tous les chapitres, à vie)
  PAID_LEGACY     // Ancien système (utilisateurs existants, accès complet)
}
```

### Signification des types de compte

| Type | Accès | Durée | Notes |
|------|-------|-------|-------|
| `FREE_TRIAL` | Chapitre 1 uniquement | 14 jours | Nouveaux utilisateurs gratuits |
| `PAID_FULL` | Tous les chapitres | À vie | Nouveaux utilisateurs payants |
| `PAID_LEGACY` | Tous les chapitres | À vie | Utilisateurs existants (migration) |

---

## 🔐 FICHIERS CRÉÉS ET MODIFIÉS

### 1. **Migration de la base de données**

**Fichier** : `/prisma/migrations/20251111000000_add_free_trial_system/migration.sql`

**Ce qui est fait** :
- Création de l'enum `AccountType`
- Ajout des colonnes au modèle `User`
- Migration automatique des utilisateurs existants vers `PAID_LEGACY`
- Création d'index pour optimiser les requêtes

**Comment exécuter** :
```bash
npx prisma migrate deploy
```

---

### 2. **Page d'inscription gratuite**

**Fichier** : `/app/signup/page.tsx`

**URL** : `https://votre-domaine.com/signup`

**Fonctionnalités** :
- Formulaire avec email + mot de passe
- Validation stricte des emails (domaines de confiance uniquement)
- Design cohérent avec le reste de la plateforme
- Message clair : "Essai gratuit 14 jours, aucune CB requise"
- Lien vers `/checkout` pour accès complet immédiat
- Lien vers `/login` pour les utilisateurs existants

**Champs requis** :
- Email (avec validation du domaine)
- Mot de passe (minimum 8 caractères)

---

### 3. **API d'inscription gratuite**

**Fichier** : `/app/api/auth/signup/route.ts`

**Endpoint** : `POST /api/auth/signup`

**Paramètres** :
```json
{
  "email": "utilisateur@example.com",
  "password": "motdepasse123"
}
```

**Ce que fait l'API** :
1. Vérifie le rate limiting (3 tentatives/15 min)
2. Valide l'email (domaine autorisé)
3. Vérifie que l'email n'existe pas déjà
4. Hash le mot de passe
5. Crée l'utilisateur avec :
   - `accountType` = `FREE_TRIAL`
   - `isActive` = `true`
   - `trialStartDate` = maintenant
   - `trialEndDate` = dans 14 jours (23:59:59 heure de Paris)
   - `trialExpired` = `false`
6. Génère un JWT token
7. Redirige vers `/dashboard`

**Réponse en cas de succès** :
```json
{
  "success": true,
  "user": {
    "id": "cuid...",
    "email": "utilisateur@example.com",
    "accountType": "FREE_TRIAL",
    "trialEndDate": "2025-11-25T23:59:59.999Z"
  }
}
```

---

## 🚀 ÉTAPES RESTANTES À IMPLÉMENTER

Voici ce qu'il reste à faire pour compléter le système :

### ✅ FAIT
1. ✔️ Création du schéma de données (migration)
2. ✔️ Page d'inscription gratuite `/signup`
3. ✔️ API d'inscription `/api/auth/signup`

### 📝 À FAIRE

#### **4. API de vérification d'accès**
**Fichier à créer** : `/app/api/auth/check-access/route.ts`

**Rôle** : Vérifier si un utilisateur a accès à un chapitre donné.

**Logic** :
```typescript
GET /api/auth/check-access?chapter=2

// Si FREE_TRIAL et chapter > 1 → { hasAccess: false, reason: 'trial_limited' }
// Si FREE_TRIAL et trialExpired = true → { hasAccess: false, reason: 'trial_expired' }
// Si PAID_FULL ou PAID_LEGACY → { hasAccess: true }
```

---

#### **5. Middleware de restriction d'accès**
**Fichier à modifier** : `/middleware.ts`

**Logique à ajouter** :
```typescript
// Pour les routes /chapitres/[n]/...
if (pathname.startsWith('/chapitres/')) {
  const chapterNumber = parseInt(pathname.split('/')[2]);

  // Récupérer l'utilisateur depuis le JWT
  const user = await getUserFromToken(userToken);

  // Si FREE_TRIAL
  if (user.accountType === 'FREE_TRIAL') {
    // Vérifier expiration
    const now = new Date();
    const trialEnd = new Date(user.trialEndDate);

    if (now > trialEnd) {
      // Marquer comme expiré
      await prisma.user.update({
        where: { id: user.id },
        data: { trialExpired: true }
      });

      // Rediriger vers dashboard avec popup
      return NextResponse.redirect('/dashboard?trial_expired=true');
    }

    // Bloquer accès chapitres 2+
    if (chapterNumber > 1) {
      return NextResponse.redirect('/dashboard?chapter_locked=true');
    }
  }
}
```

---

#### **6. Composant Popup d'expiration**
**Fichier à créer** : `/app/components/TrialExpiredPopup.tsx`

**Trigger** : Quand `?trial_expired=true` dans l'URL OU `trialExpired === true` en base.

**Contenu du popup** :
```tsx
<div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center">
  <div className="bg-white rounded-xl p-8 max-w-lg">
    <h2>Votre essai est terminé !</h2>
    <p>Vous avez testé le chapitre 1 pendant 14 jours.</p>

    <div className="benefits">
      <h3>Débloquez tout maintenant :</h3>
      <ul>
        <li>✓ Accès à TOUS les chapitres</li>
        <li>✓ +500 audios illimités</li>
        <li>✓ Vidéos explicatives complètes</li>
        <li>✓ Suivi personnalisé 7j/7</li>
        <li>✓ Accès à vie</li>
      </ul>
    </div>

    <button onClick={() => router.push('/checkout')}>
      Débloquer tous les chapitres maintenant
    </button>

    <button className="secondary" onClick={closePopup}>
      Plus tard
    </button>
  </div>
</div>
```

---

#### **7. Composant Popup de chapitre verrouillé**
**Fichier à créer** : `/app/components/ChapterLockedPopup.tsx`

**Trigger** : Quand utilisateur FREE_TRIAL essaie d'accéder chapitre 2+.

**Contenu** :
```tsx
<div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center">
  <div className="bg-white rounded-xl p-8 max-w-lg">
    <h2>Chapitre verrouillé 🔒</h2>
    <p>Avec l'essai gratuit, vous avez accès uniquement au chapitre 1.</p>

    <p>Pour débloquer tous les chapitres, passez au compte complet !</p>

    <button onClick={() => router.push('/checkout')}>
      Débloquer maintenant - 89€
    </button>

    <button className="secondary" onClick={() => router.push('/dashboard')}>
      Retour au chapitre 1
    </button>
  </div>
</div>
```

---

#### **8. API de conversion gratuit → payant**
**Fichier à créer** : `/app/api/auth/convert-to-paid/route.ts`

**Endpoint** : `POST /api/auth/convert-to-paid`

**Paramètres** :
```json
{
  "userId": "cuid...",
  "paymentIntentId": "pi_xxx"
}
```

**Logique** :
```typescript
export async function POST(req: Request) {
  const { userId, paymentIntentId } = await req.json();

  // Vérifier que le paiement existe et est succeeded
  const payment = await prisma.payment.findUnique({
    where: { stripePaymentIntentId: paymentIntentId }
  });

  if (!payment || payment.status !== 'SUCCEEDED') {
    return NextResponse.json({ error: 'Paiement non trouvé ou invalide' });
  }

  // Convertir l'utilisateur
  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      accountType: 'PAID_FULL',
      conversionDate: new Date(),
      trialExpired: false,
      isActive: true
    }
  });

  return NextResponse.json({ success: true, user });
}
```

---

#### **9. Modification du Webhook Stripe**
**Fichier à modifier** : `/app/api/stripe/webhook/route.ts`

**Ajout dans `checkout.session.completed`** :
```typescript
case 'checkout.session.completed':
  const session = event.data.object;
  const customerEmail = session.customer_email;

  // Vérifier si l'utilisateur existe déjà
  const existingUser = await prisma.user.findUnique({
    where: { email: customerEmail }
  });

  if (existingUser) {
    // Si FREE_TRIAL, convertir vers PAID_FULL
    if (existingUser.accountType === 'FREE_TRIAL') {
      await prisma.user.update({
        where: { id: existingUser.id },
        data: {
          accountType: 'PAID_FULL',
          conversionDate: new Date(),
          trialExpired: false,
          stripeCustomerId: session.customer,
          stripeSessionId: session.id,
        }
      });
    }
  } else {
    // Créer nouvel utilisateur PAID_FULL
    await prisma.user.create({
      data: {
        email: customerEmail,
        isActive: true,
        accountType: 'PAID_FULL',
        stripeCustomerId: session.customer,
        stripeSessionId: session.id,
      }
    });
  }
  break;
```

---

#### **10. Bouton CTA dans le dashboard**
**Fichier à modifier** : `/app/dashboard/page.tsx`

**Ajout après le header** :
```tsx
{user.accountType === 'FREE_TRIAL' && !user.trialExpired && (
  <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-xl mb-6">
    <div className="flex items-center justify-between">
      <div>
        <h3 className="text-white font-bold">Essai gratuit actif</h3>
        <p className="text-white/80 text-sm">
          Plus que {daysLeft} jours pour tester le chapitre 1
        </p>
      </div>
      <button
        onClick={() => router.push('/checkout')}
        className="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100"
      >
        Débloquer tous les chapitres - 89€
      </button>
    </div>
  </div>
)}
```

---

#### **11. Système d'emails automatisés**

**Fichier à créer** : `/lib/email-trial.ts`

**Emails à envoyer** :

##### Email 1 : Bienvenue (immédiat)
```typescript
await sendEmail({
  to: user.email,
  subject: 'Bienvenue ! Vous avez 14 jours pour tester',
  body: `
    Bonjour,

    Votre essai gratuit de 14 jours a commencé !

    Vous avez accès au chapitre 1 complet jusqu'au ${formatDate(trialEndDate)}.

    Pour débloquer tous les chapitres immédiatement : [Lien]
  `
});
```

##### Email 2 : Rappel J+7
```typescript
// Cron job quotidien
const users = await prisma.user.findMany({
  where: {
    accountType: 'FREE_TRIAL',
    trialExpired: false,
    trialStartDate: {
      lte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    }
  }
});

for (const user of users) {
  await sendEmail({
    to: user.email,
    subject: 'Plus que 7 jours d\'essai gratuit',
    body: `...`
  });
}
```

##### Email 3 : Dernière chance J+13
```typescript
// Cron job quotidien
const users = await prisma.user.findMany({
  where: {
    accountType: 'FREE_TRIAL',
    trialExpired: false,
    trialEndDate: {
      lte: new Date(Date.now() + 24 * 60 * 60 * 1000) // Demain
    }
  }
});
```

##### Email 4 : Expiration + relances
```typescript
// Relance J+1, J+3, J+7 après expiration
```

**Fichier cron à créer** : `/app/api/cron/check-trials/route.ts`

---

#### **12. Tâche Cron : Vérification quotidienne**

**Fichier à créer** : `/app/api/cron/check-trials/route.ts`

**Endpoint** : `GET /api/cron/check-trials`

**Logique** :
```typescript
export async function GET() {
  const now = new Date();

  // Trouver tous les essais expirés
  const expiredUsers = await prisma.user.findMany({
    where: {
      accountType: 'FREE_TRIAL',
      trialExpired: false,
      trialEndDate: {
        lte: now
      }
    }
  });

  // Marquer comme expirés
  for (const user of expiredUsers) {
    await prisma.user.update({
      where: { id: user.id },
      data: { trialExpired: true }
    });

    // Envoyer email d'expiration
    await sendTrialExpiredEmail(user.email);
  }

  return NextResponse.json({ checked: expiredUsers.length });
}
```

**Configuration Vercel Cron** :
```json
// vercel.json
{
  "crons": [{
    "path": "/api/cron/check-trials",
    "schedule": "0 0 * * *"  // Tous les jours à minuit
  }]
}
```

---

## 🔄 FLUX UTILISATEUR COMPLET

### Scénario 1 : Inscription gratuite → Conversion avant J+14

```
1. Utilisateur va sur /signup
2. Remplit email + mot de passe
3. API crée compte FREE_TRIAL avec trialEndDate dans 14 jours
4. Redirigé vers /dashboard
5. Voit bannière "Plus que X jours d'essai"
6. Peut accéder chapitre 1 uniquement
7. Clique sur "Débloquer tous les chapitres"
8. Va sur /checkout, paie 89€
9. Webhook Stripe convertit vers PAID_FULL
10. Accès immédiat à tous les chapitres à vie
```

### Scénario 2 : Inscription gratuite → Ne paie pas → Expiration

```
1-6. Même chose que scénario 1
7. Ne paie pas
8. J+14 à minuit : Cron marque trialExpired = true
9. Prochain login : Popup "Essai terminé"
10. Ne peut plus accéder au chapitre 1
11. Reçoit emails de relance J+1, J+3, J+7
12. Peut payer à tout moment → PAID_FULL
```

### Scénario 3 : Utilisateur existant

```
1. Migration automatique vers PAID_LEGACY
2. Conserve accès complet à vie
3. Aucun changement pour lui
```

---

## 🛡️ SÉCURITÉ ET CAS LIMITES

### Protection contre les abus

1. **Rate limiting** : 3 inscriptions / 15 min par IP
2. **Validation email** : Domaines de confiance uniquement
3. **Un essai par email** : Impossible de recréer un compte gratuit avec le même email

### Gestion des cas limites

| Cas | Solution |
|-----|----------|
| Utilisateur paie pendant l'essai | Conversion immédiate vers PAID_FULL |
| Utilisateur essaie d'accéder chapitre 2+ | Popup + redirection dashboard |
| Essai expiré + tentative d'accès | Popup "Essai terminé" |
| Utilisateur supprime son compte | Soft delete, email marqué comme utilisé |
| Problème de paiement Stripe | Reste FREE_TRIAL, peut réessayer |

---

## 📊 MÉTRIQUES À TRACKER

Pour mesurer le succès du tunnel :

```sql
-- Taux de conversion gratuit → payant
SELECT
  COUNT(*) FILTER (WHERE accountType = 'PAID_FULL' AND conversionDate IS NOT NULL) * 100.0 /
  COUNT(*) FILTER (WHERE accountType IN ('FREE_TRIAL', 'PAID_FULL'))
  AS conversion_rate
FROM "User";

-- Durée moyenne avant conversion
SELECT AVG(EXTRACT(DAY FROM (conversionDate - trialStartDate)))
FROM "User"
WHERE accountType = 'PAID_FULL' AND conversionDate IS NOT NULL;

-- Abandons après expiration
SELECT COUNT(*)
FROM "User"
WHERE accountType = 'FREE_TRIAL' AND trialExpired = true;
```

---

## 🚀 DÉPLOIEMENT

### Étape 1 : Migration de la base

```bash
npx prisma migrate deploy
```

### Étape 2 : Vérifier les utilisateurs existants

```sql
SELECT COUNT(*), accountType FROM "User" GROUP BY accountType;
```

**Résultat attendu** :
- Tous les utilisateurs `isActive = true` doivent être `PAID_LEGACY`

### Étape 3 : Tester le tunnel

1. Aller sur `/signup`
2. Créer un compte test
3. Vérifier `accountType = FREE_TRIAL` en DB
4. Vérifier accès chapitre 1 uniquement
5. Tenter d'accéder chapitre 2 → doit être bloqué
6. Cliquer "Débloquer tous les chapitres"
7. Payer via Stripe (mode test)
8. Vérifier conversion vers `PAID_FULL`
9. Vérifier accès à tous les chapitres

### Étape 4 : Configuration Cron

Ajouter dans `vercel.json` :

```json
{
  "crons": [{
    "path": "/api/cron/check-trials",
    "schedule": "0 0 * * *"
  }]
}
```

---

## ✅ CHECKLIST FINALE

Avant de passer en production :

- [ ] Migration déployée et testée
- [ ] Page `/signup` accessible
- [ ] API `/api/auth/signup` fonctionnelle
- [ ] Middleware bloque chapitres 2+ pour FREE_TRIAL
- [ ] Popup d'expiration s'affiche correctement
- [ ] Popup de chapitre verrouillé s'affiche
- [ ] Conversion gratuit→payant fonctionne via Stripe
- [ ] Webhook Stripe gère les deux cas (FREE_TRIAL et nouveau)
- [ ] Emails automatisés configurés
- [ ] Cron quotidien configuré
- [ ] Utilisateurs existants migrés vers PAID_LEGACY
- [ ] Bannière CTA visible dans dashboard gratuit
- [ ] Tests de bout en bout effectués

---

## 📞 SUPPORT

Pour toute question sur l'implémentation :

1. Vérifier les logs dans `/api/auth/signup` et `/api/auth/convert-to-paid`
2. Vérifier l'état du compte en DB : `accountType`, `trialEndDate`, `trialExpired`
3. Tester le cron manuellement : `curl https://votre-domaine.com/api/cron/check-trials`

---

**Date de création** : 2025-11-11
**Version** : 1.0
**Status** : En cours de développement
