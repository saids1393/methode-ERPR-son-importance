-- CreateEnum
CREATE TYPE "public"."HomeworkSendType" AS ENUM ('TEXT', 'AUDIO');

-- CreateEnum
CREATE TYPE "public"."HomeworkStatus" AS ENUM ('PENDING', 'REVIEWED', 'CORRECTED');

-- AlterTable
ALTER TABLE "public"."HomeworkSend" ADD COLUMN     "audioUrl" TEXT,
ADD COLUMN     "correctedAt" TIMESTAMP(3),
ADD COLUMN     "feedback" TEXT,
ADD COLUMN     "status" "public"."HomeworkStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "textContent" TEXT,
ADD COLUMN     "type" "public"."HomeworkSendType" NOT NULL DEFAULT 'TEXT';

-- CreateIndex
CREATE INDEX "HomeworkSend_status_idx" ON "public"."HomeworkSend"("status");
