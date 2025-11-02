-- CreateEnum
CREATE TYPE "public"."SecondPaymentStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED');

-- CreateTable
CREATE TABLE "public"."SecondPayment" (
    "id" TEXT NOT NULL,
    "customerId" VARCHAR(255) NOT NULL,
    "firstPaymentIntentId" VARCHAR(255) NOT NULL,
    "secondPaymentIntentId" VARCHAR(255),
    "status" "public"."SecondPaymentStatus" NOT NULL DEFAULT 'PENDING',
    "errorMessage" TEXT,
    "retryCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SecondPayment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SecondPayment_firstPaymentIntentId_key" ON "public"."SecondPayment"("firstPaymentIntentId");

-- CreateIndex
CREATE INDEX "SecondPayment_customerId_idx" ON "public"."SecondPayment"("customerId");

-- CreateIndex
CREATE INDEX "SecondPayment_status_idx" ON "public"."SecondPayment"("status");

-- CreateIndex
CREATE INDEX "SecondPayment_createdAt_idx" ON "public"."SecondPayment"("createdAt");
