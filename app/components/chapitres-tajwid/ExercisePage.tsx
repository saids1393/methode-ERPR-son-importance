'use client';

import React, { ReactNode } from 'react';
import InteractiveLessonLayout from './InteractiveLessonLayout';

interface ExercisePageProps {
  currentChapter: number;
  currentPage: number;
  exerciseTitle: string;
  introductionContent: ReactNode;
  exerciseContent: ReactNode;
}

const ExercisePage = ({
  currentChapter,
  currentPage,
  exerciseTitle,
  introductionContent,
  exerciseContent,
}: ExercisePageProps) => {

  const Introduction = () => (
    <div className="p-4 md:p-8 bg-gray-900">
      <div className="w-full bg-gray-800 rounded-lg p-6 md:p-8">
        <div className="text-white space-y-6 text-lg md:text-xl leading-relaxed">
          <h2 className="text-3xl md:text-4xl font-bold text-amber-300 mb-4">
            {exerciseTitle}
          </h2>
          {introductionContent}
          <div className="bg-blue-900/30 border border-blue-500/50 rounded-lg p-4 md:p-6 my-6">
            <p>
              💡 <span className="font-semibold">Instructions :</span> La page suivante contient les détails de l'exercice.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const ExerciseDetails = () => (
    <div className="p-2 md:p-4 lg:p-8 bg-gray-900">
      <div className="bg-gray-800 rounded-lg p-4 md:p-6 mb-6">
        {exerciseContent}
      </div>
      <div className="bg-gradient-to-r from-purple-900/30 to-indigo-900/30 border border-purple-500/20 rounded-xl p-6">
        <p className="text-center text-purple-300 text-sm md:text-base">
          📚 <span className="font-semibold">Rendu de l'exercice :</span> Veuillez suivre les instructions spécifiques à l'exercice pour le rendu.
        </p>
      </div>
    </div>
  );

  const pageTitles = [
    `Exercice : ${exerciseTitle}`,
    `Détails de l'Exercice : ${exerciseTitle}`
  ];

  return (
    <InteractiveLessonLayout
      currentChapter={currentChapter}
      currentPage={currentPage}
      totalPages={2}
      pageTitles={pageTitles}
      introductionPage={<Introduction />}
      rulesPage={<ExerciseDetails />}
      audioMappings={{}} // Exercises might not have audio, or audio will be handled within exerciseContent
      audioPath="" // No general audio path for exercises
    />
  );
};

export default ExercisePage;
