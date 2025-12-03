-- CreateEnum
CREATE TYPE "public"."CourseModule" AS ENUM ('LECTURE', 'TAJWID');

-- AlterTable
ALTER TABLE "public"."Level" ADD COLUMN     "module" "public"."CourseModule" NOT NULL DEFAULT 'LECTURE';
