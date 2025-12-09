-- CreateTable
CREATE TABLE "public"."TajwidHomework" (
    "id" TEXT NOT NULL,
    "chapterId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TajwidHomework_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."TajwidHomeworkSend" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tajwidHomeworkId" TEXT NOT NULL,
    "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "emailSent" BOOLEAN NOT NULL DEFAULT false,
    "type" "public"."HomeworkSendType" NOT NULL DEFAULT 'TEXT',
    "textContent" TEXT,
    "audioUrl" TEXT,
    "fileUrls" TEXT,
    "status" "public"."HomeworkStatus" NOT NULL DEFAULT 'PENDING',
    "feedback" TEXT,
    "correctedAt" TIMESTAMP(3),

    CONSTRAINT "TajwidHomeworkSend_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TajwidHomework_chapterId_key" ON "public"."TajwidHomework"("chapterId");

-- CreateIndex
CREATE INDEX "TajwidHomework_chapterId_idx" ON "public"."TajwidHomework"("chapterId");

-- CreateIndex
CREATE INDEX "TajwidHomework_isActive_idx" ON "public"."TajwidHomework"("isActive");

-- CreateIndex
CREATE INDEX "TajwidHomeworkSend_userId_idx" ON "public"."TajwidHomeworkSend"("userId");

-- CreateIndex
CREATE INDEX "TajwidHomeworkSend_tajwidHomeworkId_idx" ON "public"."TajwidHomeworkSend"("tajwidHomeworkId");

-- CreateIndex
CREATE INDEX "TajwidHomeworkSend_status_idx" ON "public"."TajwidHomeworkSend"("status");

-- CreateIndex
CREATE UNIQUE INDEX "TajwidHomeworkSend_userId_tajwidHomeworkId_key" ON "public"."TajwidHomeworkSend"("userId", "tajwidHomeworkId");

-- AddForeignKey
ALTER TABLE "public"."TajwidHomeworkSend" ADD CONSTRAINT "TajwidHomeworkSend_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TajwidHomeworkSend" ADD CONSTRAINT "TajwidHomeworkSend_tajwidHomeworkId_fkey" FOREIGN KEY ("tajwidHomeworkId") REFERENCES "public"."TajwidHomework"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
