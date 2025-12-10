/*
  # Add Tajwid Progress Tracking Fields

  1. New Fields
    - `completedPagesTajwid` (integer array) - Tracks completed Tajwid pages
    - `completedQuizzesTajwid` (integer array) - Tracks completed Tajwid quizzes

  2. Purpose
    - Enable separate progress tracking for Tajwid module
    - Support automatic homework sending when chapters are completed
    - Maintain data integrity for both Lecture and Tajwid modules
*/

-- Add Tajwid progress tracking fields to User table
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "completedPagesTajwid" INTEGER[] DEFAULT ARRAY[]::INTEGER[];
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "completedQuizzesTajwid" INTEGER[] DEFAULT ARRAY[]::INTEGER[];
