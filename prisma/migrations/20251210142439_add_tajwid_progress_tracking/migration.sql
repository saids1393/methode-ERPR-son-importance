-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "completedPagesTajwid" INTEGER[] DEFAULT ARRAY[]::INTEGER[],
ADD COLUMN     "completedQuizzesTajwid" INTEGER[] DEFAULT ARRAY[]::INTEGER[];
