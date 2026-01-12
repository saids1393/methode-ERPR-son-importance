'use client';

import { use } from 'react';
import { chaptersTajwid } from "@/lib/chapters-tajwid";
import Quiz from "@/app/components/quiz/QuestionReponse";
import { notFound } from "next/navigation";
import { useAutoProgress } from "@/hooks/useAutoProgress";
import { useTajwidProgress } from "@/hooks/useTajwidProgress";
import UniversalNavigation from "@/app/components/UniversalNavigation";
import AutoProgressWrapper from "@/app/components/AutoProgressWrapper";

interface QuizPageProps {
  params: Promise<{
    chapitres: string;
  }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default function TajwidQuizPage({ params }: QuizPageProps) {
  const resolvedParams = use(params);
  const chapitre = resolvedParams.chapitres;
  
  const chapterNumber = Number(chapitre);
  const chapter = chaptersTajwid.find(ch => ch.chapterNumber === chapterNumber);
  
  // Utiliser le hook Tajwid pour la complétion
  const { toggleQuizCompletion } = useTajwidProgress();
  
  // Activer l'auto-progression pour les quiz avec la bonne option
  useAutoProgress({ 
    minTimeOnPage: 6000, // 6 secondes
    enabled: true 
  });

  if (!chapter || !chapter.quiz) return notFound();

  return (
    <AutoProgressWrapper minTimeOnPage={6000}>
      <div className="font-arabic min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="w-full h-full overflow-hidden">
          {/* Header avec le même style gradient */}
          <div className="bg-gray-900 text-white p-6 text-center border-b border-white-700">
            <div className="text-3xl font-bold mb-4">
              Quiz Tajwid : {chapter.title.toLowerCase()}
            </div>
          </div>

          {/* Contenu du quiz */}
          <div className="p-4 md:p-8">
            <div className="bg-gray-800/80 border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl backdrop-blur-sm">
              <div className="max-w-4xl mx-auto">
                <Quiz 
                  quiz={chapter.quiz} 
                  chapterNumber={chapterNumber}
                  onToggleQuizCompletion={toggleQuizCompletion}
                />
              </div>
            </div>

            {/* Navigation */}
            <div className="max-w-4xl mx-auto mt-6">
              <UniversalNavigation
                currentChapter={chapterNumber}
                currentType="quiz"
                className="mb-4"
                module="TAJWID"
              />
            </div>
          </div>

          {/* Footer */}
          <footer className="border-t border-white/10 text-center p-4 text-sm text-gray-500">
            <div>Méthode ERPR - Tajwid</div>
            <div className="mt-1">© 2025 Tous droits réservés</div>
          </footer>
        </div>
      </div>
    </AutoProgressWrapper>
  );
}
