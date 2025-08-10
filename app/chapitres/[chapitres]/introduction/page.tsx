import { getChapterByNumber } from '@/lib/chapters';
import { notFound } from 'next/navigation';
import AutoProgressWrapper from '@/app/components/AutoProgressWrapper';

type Props = {
  params: Promise<{ chapitres: string }>;
};

export default async function IntroductionPage({ params }: Props) {
  const resolvedParams = await params;
  const chapNum = parseInt(resolvedParams.chapitres, 10);
  const chapter = getChapterByNumber(chapNum);

  if (!chapter || !chapter.introduction) {
    return (
      <div className="w-full p-8 text-center text-red-400 bg-zinc-800 border border-zinc-700 rounded-lg shadow-lg">
        Aucune introduction disponible.
      </div>
    );
  }

  return (
    <AutoProgressWrapper>
      <div className="font-arabic min-h-screen bg-zinc-900 text-white text-center">
        <div className="w-full h-full overflow-hidden">
          {/* Header avec le même style gradient */}
          <div className="bg-arabic-gradient text-white p-6 text-center">
            <div className="text-3xl font-bold mb-4">
              introduction : {chapter.title.toLowerCase()}
            </div>
          </div>

          {/* Contenu de l'introduction */}
          <div className="p-8">
            <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-6 md:p-8 shadow-lg">
              <div className="prose prose-invert max-w-none">
                {chapter.introduction.split('\n').map((paragraph, index) => (
                  <p key={index} className="mb-6 last:mb-0 text-lg leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AutoProgressWrapper>
  );
}