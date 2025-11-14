-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "deviceFingerprint" VARCHAR(255);

-- CreateIndex
CREATE INDEX "User_deviceFingerprint_idx" ON "public"."User"("deviceFingerprint");

-- CreateIndex
CREATE INDEX "User_email_accountType_createdAt_idx" ON "public"."User"("email", "accountType", "createdAt");
