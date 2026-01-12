/*
  Warnings:

  - A unique constraint covering the columns `[userId,snapshotDate,module]` on the table `DailyProgressSnapshot` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "public"."DailyProgressSnapshot_userId_snapshotDate_key";

-- AlterTable
ALTER TABLE "public"."DailyProgressSnapshot" ADD COLUMN     "module" TEXT NOT NULL DEFAULT 'LECTURE';

-- CreateIndex
CREATE INDEX "DailyProgressSnapshot_module_idx" ON "public"."DailyProgressSnapshot"("module");

-- CreateIndex
CREATE UNIQUE INDEX "DailyProgressSnapshot_userId_snapshotDate_module_key" ON "public"."DailyProgressSnapshot"("userId", "snapshotDate", "module");
