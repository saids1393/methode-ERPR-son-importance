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
      <div className="font-arabic min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="w-full h-full overflow-hidden">
          {/* Header avec style amélioré */}
          {/* Header avec le même style gradient */}
          <div className="bg-gray-900 text-white p-6 text-center border-b border-white-700">
            <div className="text-3xl font-bold mb-4">
              Synthèse : {chapter.title.toLowerCase()}
            </div>
          </div>

          {/* Contenu de l'introduction avec style amélioré */}
          <div className="p-4 md:p-8">
            <div className="bg-gray-800/80 border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl backdrop-blur-sm">
              <div className="max-w-4xl mx-auto">
                {chapter.introduction.split('\n').map((paragraph, index) => {
                  // Ignorer les paragraphes vides
                  if (!paragraph.trim()) return null;
                  
                  return (
                    <div 
                      key={index} 
                      className="mb-6 last:mb-0 transition-all duration-300 hover:translate-x-1"
                    >
                      <p className="text-lg md:text-xl leading-relaxed md:leading-loose text-gray-100">
                        {paragraph}
                      </p>
                      
                      {/* Séparateur subtil entre les paragraphes */}
                      {index < chapter.introduction!.split('\n').length - 2 && (
                        <div className="w-20 h-0.5 bg-gradient-to-r from-amber-500/50 to-transparent mt-6 mx-auto" />
                      )}
                    </div>
                  );
                })}
              </div>
              
              {/* Section d'encouragement en bas */}
              <div className="mt-8 pt-6 border-t border-white/10">
                <div className="bg-gradient-to-r from-green-900/30 to-emerald-900/30 border border-green-500/20 rounded-xl p-4">
                  <p className="text-center text-green-300 text-sm md:text-base">
                    🎯 <span className="font-semibold">Objectif :</span> Prenez le temps de bien comprendre cette introduction avant de passer aux leçons pratiques.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <footer className="border-t border-white/10 text-center p-4 text-sm text-gray-500">
            <div>Méthode d'apprentissage de l'arabe</div>
            <div className="mt-1">© 2025 Tous droits réservés</div>
          </footer>
        </div>
      </div>
    </AutoProgressWrapper>
  );
}