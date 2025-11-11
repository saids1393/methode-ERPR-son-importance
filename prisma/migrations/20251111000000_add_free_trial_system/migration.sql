/*
  # Système d'essai gratuit 14 jours

  1. Modifications du modèle User
    - Ajout de `accountType` (FREE_TRIAL, PAID_FULL, PAID_LEGACY)
    - Ajout de `trialStartDate` pour tracker le début de l'essai
    - Ajout de `trialEndDate` pour calculer l'expiration
    - Ajout de `trialExpired` pour bloquer l'accès après 14 jours
    - Ajout de `conversionDate` pour tracker la conversion gratuit→payant

  2. Enum AccountType
    - FREE_TRIAL : Essai gratuit (accès chapitre 1 uniquement pendant 14 jours)
    - PAID_FULL : Payant complet (accès à tous les chapitres à vie)
    - PAID_LEGACY : Ancien système (pour compatibilité avec les utilisateurs existants)

  3. Migration des utilisateurs existants
    - Tous les utilisateurs actifs existants sont migrés vers PAID_LEGACY
    - Les nouveaux utilisateurs commenceront en FREE_TRIAL par défaut
*/

-- Créer l'enum AccountType
CREATE TYPE "AccountType" AS ENUM ('FREE_TRIAL', 'PAID_FULL', 'PAID_LEGACY');

-- Ajouter les colonnes au modèle User
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "accountType" "AccountType" NOT NULL DEFAULT 'FREE_TRIAL';
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "trialStartDate" TIMESTAMP(3);
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "trialEndDate" TIMESTAMP(3);
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "trialExpired" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "conversionDate" TIMESTAMP(3);

-- Migrer les utilisateurs existants vers PAID_LEGACY (accès complet)
-- Tous les utilisateurs qui sont déjà actifs (isActive = true) sont considérés comme payants
UPDATE "User"
SET "accountType" = 'PAID_LEGACY'
WHERE "isActive" = true;

-- Index pour optimiser les requêtes
CREATE INDEX IF NOT EXISTS "User_accountType_idx" ON "User"("accountType");
CREATE INDEX IF NOT EXISTS "User_trialEndDate_idx" ON "User"("trialEndDate");
CREATE INDEX IF NOT EXISTS "User_trialExpired_idx" ON "User"("trialExpired");
