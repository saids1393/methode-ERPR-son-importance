-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "trialDay3EmailSent" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "trialDay6EmailSent" BOOLEAN NOT NULL DEFAULT false;
