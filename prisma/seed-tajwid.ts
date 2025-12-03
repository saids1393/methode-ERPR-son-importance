// prisma/seed.ts
import { prisma } from '@/lib/prisma';

async function main() {
  try {
    // Vérifier si le niveau Tajwid existe
    const existing = await prisma.level.findFirst({
      where: { module: 'TAJWID' }
    });

    if (existing) {
      console.log('✅ Le niveau Tajwid existe déjà:', existing);
      return;
    }

    // Créer le niveau Tajwid
    const tajwid = await prisma.level.create({
      data: {
        title: 'Tajwid',
        price: 89,
        module: 'TAJWID',
        isActive: true
      }
    });

    console.log('✅ Niveau Tajwid créé:', tajwid);
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
