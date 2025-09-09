import fs from 'fs';
import path from 'path';
import csvParser from 'csv-parser';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const filePath = path.join('C:/Users/soidr/Downloads/chapterVideo.csv');

async function importChapterVideos() {
  const videos: any[] = [];

  // Lire le CSV
  fs.createReadStream(filePath)
    .pipe(csvParser())
    .on('data', (row) => {
      videos.push({
        id: row.id,
        chapterNumber: Number(row.chapterNumber), // venant du CSV
        title: row.title,
        cloudflareVideoId: row.cloudflareVideoId,
        thumbnailUrl: row.thumbnailUrl || null,
        duration: row.duration ? Number(row.duration) : null,
        isActive: row.isActive === 'true',
        createdAt: row.createdAt ? new Date(row.createdAt) : new Date(),
        updatedAt: row.updatedAt ? new Date(row.updatedAt) : new Date(),
      });
    })
    .on('end', async () => {
      console.log(`🔄 ${videos.length} vidéos prêtes à être insérées dans Neon`);

      try {
        // Charger les chapters depuis la DB
        const chapters = await prisma.chapter.findMany({
          select: { id: true, chapterNumber: true },
        });

        // Map pour retrouver l'id du chapitre
        const chapterMap = new Map<number, number>();
        chapters.forEach((c) => chapterMap.set(c.chapterNumber, c.id));

        // Transformer les vidéos en ChapterVideo
        const videosToInsert = videos
          .map((video) => {
            const chapterId = chapterMap.get(video.chapterNumber);
            if (!chapterId) {
              console.warn(
                `⚠️ Aucun chapter trouvé pour chapterNumber ${video.chapterNumber}, video id: ${video.id}`
              );
              return null;
            }
            return {
              id: video.id,
              chapterId,
              title: video.title,
              cloudflareVideoId: video.cloudflareVideoId,
              thumbnailUrl: video.thumbnailUrl,
              duration: video.duration,
              isActive: video.isActive,
              createdAt: video.createdAt,
              updatedAt: video.updatedAt,
            };
          })
          .filter(Boolean);

        console.log(`📊 ${videosToInsert.length} vidéos valides après mapping`);

        // ⚠️ Optionnel : vider la table avant insertion
        await prisma.chapterVideo.deleteMany();
        console.log('🗑️ Table ChapterVideo vidée');

        // Insérer les vidéos
        await prisma.chapterVideo.createMany({
          data: videosToInsert as any,
          skipDuplicates: true,
        });

        console.log('🎉 Import terminé avec succès !');
      } catch (error) {
        console.error('❌ Erreur lors de l\'import:', error);
      } finally {
        await prisma.$disconnect();
      }
    });
}

// Lancer le script
importChapterVideos();
