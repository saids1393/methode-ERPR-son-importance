import React from 'react';

type ParamsType = {
  number: string;
};

type Props = {
  params: Promise<ParamsType>;
};

async function getExerciseComponent(chapterNumber: number) {
  const chapterNum = parseInt(chapterNumber.toString(), 10);
  
  if (chapterNum < 1 || chapterNum > 8) {
    return null;
  }
  
  try {
    const module = await import(
      `@/app/components/chapitres-tajwid/exercices/Exercice${chapterNum}`
    );
    return module.default;
  } catch (error) {
    console.error(`Erreur de chargement exercice chapitre ${chapterNum}`, error);
    return null;
  }
}

export default async function ExercicePage({ params }: Props) {
  const { number } = await params;
  const chapterNum = parseInt(number, 10);
  
  const Component = await getExerciseComponent(chapterNum);

  if (!Component) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center p-8">
          <h1 className="text-3xl font-bold text-red-400 mb-4">Exercice non trouvé</h1>
          <p className="text-gray-400 mb-4">
            L'exercice pour le chapitre {chapterNum} n'existe pas
          </p>
          <a
            href="/dashboard"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Retour au dashboard
          </a>
        </div>
      </div>
    );
  }

  return <Component />;
}

export async function generateStaticParams() {
  const params: { number: string }[] = [];
  for (let i = 1; i <= 8; i++) {
    params.push({
      number: i.toString(),
    });
  }
  return params;
}
