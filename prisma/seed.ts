import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  await prisma.cancellationReason.createMany({
    data: [
      { reason: 'Problème de santé', category: 'PERSONNEL' },
      { reason: 'Conflit d\'horaire', category: 'PERSONNEL' },
      { reason: 'Empêchement imprévu', category: 'IMPRÉVU' },
    ],
    skipDuplicates: true,
  })

  console.log('✅ Raisons d’annulation insérées avec succès.')
}

main()
  .catch((e) => {
    console.error('❌ Erreur dans le seed :', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
