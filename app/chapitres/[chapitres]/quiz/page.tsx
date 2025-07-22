'use client';

import { use } from 'react';
import { getChapterByNumber } from "@/lib/chapters";
import Quiz from "@/app/components/quiz/QuestionReponse";
import { notFound } from "next/navigation";

interface QuizPageProps {
  params: Promise<{
    chapitres: string;
  }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default function QuizPage({ params }: QuizPageProps) {
  const resolvedParams = use(params);
  const chapitre = resolvedParams.chapitres;
  
  const chapterNumber = Number(chapitre);
  const chapter = getChapterByNumber(chapterNumber);

  if (!chapter || !chapter.quiz) return notFound();

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Quiz – {chapter.title}</h1>
      <Quiz quiz={chapter.quiz} />
    </div>
  );
}