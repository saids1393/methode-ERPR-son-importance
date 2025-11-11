-- CreateEnum
CREATE TYPE "public"."AccountType" AS ENUM ('FREE_TRIAL', 'PAID_FULL', 'PAID_LEGACY');

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "accountType" "public"."AccountType" NOT NULL DEFAULT 'FREE_TRIAL',
ADD COLUMN     "conversionDate" TIMESTAMP(3),
ADD COLUMN     "trialEndDate" TIMESTAMP(3),
ADD COLUMN     "trialExpired" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "trialStartDate" TIMESTAMP(3);
