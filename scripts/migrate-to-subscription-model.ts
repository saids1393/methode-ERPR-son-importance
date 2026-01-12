// scripts/migrate-to-subscription-model.ts
// Script pour migrer les utilisateurs existants vers le nouveau modèle d'abonnement
// À exécuter une seule fois après le déploiement

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function migrateUsers() {
  console.log('🚀 Début de la migration vers le modèle d\'abonnement...\n');

  // 1. Migrer les utilisateurs PAID_FULL vers PAID_LEGACY (accès illimité)
  const paidFullUsers = await prisma.user.updateMany({
    where: { 
      accountType: 'PAID_FULL' as any 
    },
    data: {
      accountType: 'PAID_LEGACY',
      isActive: true,
    }
  });
  console.log(`✅ ${paidFullUsers.count} utilisateurs PAID_FULL migrés vers PAID_LEGACY`);

  // 2. Migrer les utilisateurs FREE_TRIAL vers INACTIVE
  const freeTrialUsers = await prisma.user.updateMany({
    where: { 
      accountType: 'FREE_TRIAL' as any 
    },
    data: {
      accountType: 'INACTIVE',
      isActive: false,
    }
  });
  console.log(`✅ ${freeTrialUsers.count} utilisateurs FREE_TRIAL migrés vers INACTIVE`);

  // 3. Récapitulatif
  const stats = await prisma.user.groupBy({
    by: ['accountType'],
    _count: true
  });

  console.log('\n📊 Répartition des comptes après migration:');
  stats.forEach(stat => {
    console.log(`   - ${stat.accountType}: ${stat._count} utilisateurs`);
  });

  console.log('\n✨ Migration terminée avec succès!');
}

migrateUsers()
  .catch((error) => {
    console.error('❌ Erreur lors de la migration:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
