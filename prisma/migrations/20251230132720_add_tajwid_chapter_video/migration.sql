-- CreateTable
CREATE TABLE "public"."TajwidChapterVideo" (
    "id" TEXT NOT NULL,
    "chapterNumber" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "cloudflareVideoId" TEXT NOT NULL,
    "thumbnailUrl" TEXT,
    "duration" INTEGER,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TajwidChapterVideo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TajwidChapterVideo_chapterNumber_key" ON "public"."TajwidChapterVideo"("chapterNumber");

-- CreateIndex
CREATE UNIQUE INDEX "TajwidChapterVideo_cloudflareVideoId_key" ON "public"."TajwidChapterVideo"("cloudflareVideoId");

-- CreateIndex
CREATE INDEX "TajwidChapterVideo_chapterNumber_idx" ON "public"."TajwidChapterVideo"("chapterNumber");

-- CreateIndex
CREATE INDEX "TajwidChapterVideo_isActive_idx" ON "public"."TajwidChapterVideo"("isActive");
