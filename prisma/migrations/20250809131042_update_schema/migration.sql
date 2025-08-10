-- CreateTable
CREATE TABLE "public"."HomeworkSend" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "homeworkId" TEXT NOT NULL,
    "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "emailSent" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "HomeworkSend_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "HomeworkSend_userId_idx" ON "public"."HomeworkSend"("userId");

-- CreateIndex
CREATE INDEX "HomeworkSend_homeworkId_idx" ON "public"."HomeworkSend"("homeworkId");

-- CreateIndex
CREATE UNIQUE INDEX "HomeworkSend_userId_homeworkId_key" ON "public"."HomeworkSend"("userId", "homeworkId");

-- AddForeignKey
ALTER TABLE "public"."HomeworkSend" ADD CONSTRAINT "HomeworkSend_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."HomeworkSend" ADD CONSTRAINT "HomeworkSend_homeworkId_fkey" FOREIGN KEY ("homeworkId") REFERENCES "public"."Homework"("id") ON DELETE CASCADE ON UPDATE CASCADE;
