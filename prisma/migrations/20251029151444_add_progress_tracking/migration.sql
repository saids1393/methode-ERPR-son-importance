-- CreateTable
CREATE TABLE "public"."UserProgressLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "actionType" TEXT NOT NULL,
    "pageNumber" INTEGER,
    "chapterId" INTEGER,
    "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserProgressLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."DailyProgressSnapshot" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "pagesCompletedCount" INTEGER NOT NULL DEFAULT 0,
    "quizzesCompletedCount" INTEGER NOT NULL DEFAULT 0,
    "progressPercentage" INTEGER NOT NULL DEFAULT 0,
    "snapshotDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DailyProgressSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "UserProgressLog_userId_idx" ON "public"."UserProgressLog"("userId");

-- CreateIndex
CREATE INDEX "UserProgressLog_completedAt_idx" ON "public"."UserProgressLog"("completedAt");

-- CreateIndex
CREATE INDEX "UserProgressLog_userId_completedAt_idx" ON "public"."UserProgressLog"("userId", "completedAt");

-- CreateIndex
CREATE INDEX "DailyProgressSnapshot_userId_idx" ON "public"."DailyProgressSnapshot"("userId");

-- CreateIndex
CREATE INDEX "DailyProgressSnapshot_snapshotDate_idx" ON "public"."DailyProgressSnapshot"("snapshotDate");

-- CreateIndex
CREATE INDEX "DailyProgressSnapshot_userId_snapshotDate_idx" ON "public"."DailyProgressSnapshot"("userId", "snapshotDate");

-- CreateIndex
CREATE UNIQUE INDEX "DailyProgressSnapshot_userId_snapshotDate_key" ON "public"."DailyProgressSnapshot"("userId", "snapshotDate");

-- AddForeignKey
ALTER TABLE "public"."UserProgressLog" ADD CONSTRAINT "UserProgressLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DailyProgressSnapshot" ADD CONSTRAINT "DailyProgressSnapshot_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
