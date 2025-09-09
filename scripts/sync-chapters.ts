// scripts/sync-chapters.ts
const { PrismaClient } = require('@prisma/client');
const { chapters } = require('../lib/chapters');

const prisma = new PrismaClient();

async function syncChaptersToDatabase() {
  console.log('🔄 Synchronisation des chapitres vers la base de données...');

  try {
    // Supprimer tous les chapitres existants
    console.log('🗑️ Suppression des anciens chapitres...');
    await prisma.chapter.deleteMany();

    // Créer les chapitres depuis lib/chapters
    console.log('📚 Création des nouveaux chapitres...');
    for (const chapter of chapters) {
      const createdChapter = await prisma.chapter.create({
        data: {
          chapterNumber: chapter.chapterNumber,
          title: chapter.title,
          introduction: chapter.introduction || null,
        },
      });
      console.log(`✅ Chapitre ${chapter.chapterNumber} - ${chapter.title} créé avec ID: ${createdChapter.id}`);
    }

    console.log('🎉 Synchronisation terminée avec succès !');
    console.log(`📊 Total: ${chapters.length} chapitres synchronisés`);

    // Vérification
    const count = await prisma.chapter.count();
    console.log(`✅ Vérification: ${count} chapitres en base de données`);
  } catch (error) {
    console.error('❌ Erreur lors de la synchronisation:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Exécuter la synchronisation
syncChaptersToDatabase()
  .then(() => {
    console.log('🏁 Script terminé avec succès');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Échec du script:', error);
    process.exit(1);
  });
