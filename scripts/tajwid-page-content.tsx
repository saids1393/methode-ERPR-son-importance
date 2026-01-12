import React from 'react';
import { generateAllStaticParams, getPageByNumbers, chapters } from '@/lib/chapters';
import { chaptersTajwid } from '@/lib/chapters-tajwid';
import AutoProgressWrapper from '@/app/components/AutoProgressWrapper';

type ParamsType = {
  chapitres: string;
  page: string;
};

type Props = {
  params: Promise<ParamsType>;
};

function NotFoundPage({
  chapNum,
  pageNum,
  pageInfo,
}: {
  chapNum: number;
  pageNum: number;
  pageInfo: ReturnType<typeof getPageByNumbers> | null;
}) {
  return (
    <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
      <div className="text-center p-8">
        <h1 className="text-3xl font-bold text-red-400 mb-4">صفحة غير موجودة</h1>
        <h2 className="text-xl font-bold text-red-400 mb-4">Page non trouvée</h2>

        {pageInfo ? (
          <div className="text-gray-400 mb-4">
            <p className="mb-2">
              La page <strong>"{pageInfo.title}"</strong> existe dans la configuration
            </p>
            <p className="mb-2">mais le composant n'a pas encore été créé.</p>
          </div>
        ) : (
          <p className="text-gray-400 mb-4">
            Le chapitre Tajwid {chapNum}, page {pageNum} n'existe pas dans la configuration.
          </p>
        )}

        <p className="text-gray-500 text-sm">
          Chemin recherché : /app/components/chapitres-tajwid/chapitre{chapNum}/Page{pageNum}.tsx
        </p>

        <div className="mt-6">
          <a
            href="/dashboard"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Retour au dashboard
          </a>
        </div>
      </div>
    </div>
  );
}

async function getComponent(chapitres: string, page: string) {
  const chapNum = parseInt(chapitres, 10);
  const pageNum = parseInt(page, 10);

  try {
    const tajwidChapter = chaptersTajwid.find(ch => ch.chapterNumber === chapNum);

    if (tajwidChapter) {
      return () => (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-white mb-4">{tajwidChapter.title}</h1>
            <p className="text-xl text-gray-300 mb-8 whitespace-pre-wrap">{tajwidChapter.introduction}</p>

            {tajwidChapter.pages && tajwidChapter.pages.length > 0 && (
              <div className="bg-white/10 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-6 mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">Pages du chapitre</h2>
                <div className="space-y-3">
                  {tajwidChapter.pages.map((p, idx) => (
                    <div key={idx} className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3 text-gray-300">
                      <p className="font-semibold text-purple-300">Page {p.pageNumber}: {p.title}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {tajwidChapter.quiz && tajwidChapter.quiz.length > 0 && (
              <div className="bg-white/10 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-6 mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">Quiz du chapitre</h2>
                <p className="text-gray-300">{tajwidChapter.quiz.length} questions disponibles</p>
              </div>
            )}

            <div className="mt-8 flex gap-4 flex-wrap">
              <a
                href="/dashboard"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
              >
                ← Retour au dashboard
              </a>
              {chapNum > Math.min(...chaptersTajwid.map(ch => ch.chapterNumber)) && (
                <a
                  href={`/chapitres-tajwid/${chapNum - 1}/0`}
                  className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg transition-colors"
                >
                  ← Chapitre précédent
                </a>
              )}
              {chapNum < Math.max(...chaptersTajwid.map(ch => ch.chapterNumber)) && (
                <a
                  href={`/chapitres-tajwid/${chapNum + 1}/0`}
                  className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg transition-colors"
                >
                  Chapitre suivant →
                </a>
              )}
            </div>
          </div>
        </div>
      );
    }

    const module = await import(
      `@/app/components/chapitres-tajwid/chapitre${chapNum}/Page${pageNum}`
    );

    if (
      module.default &&
      (typeof module.default === 'function' || typeof module.default === 'object')
    ) {
      return module.default;
    } else {
      throw new Error('Composant invalide ou manquant dans le module importé');
    }
  } catch (error) {
    console.error(`Erreur de chargement: chapitres-tajwid/chapitre${chapNum}/Page${pageNum}`, error);
    const pageInfo = getPageByNumbers(chapNum, pageNum);
    return () => <NotFoundPage chapNum={chapNum} pageNum={pageNum} pageInfo={pageInfo} />;
  }
}

export default async function Page({ params }: Props) {
  const { chapitres, page } = await params;
  const Component = await getComponent(chapitres, page);

  return (
    <AutoProgressWrapper>
      <Component />
    </AutoProgressWrapper>
  );
}

export async function generateStaticParams() {
  const params: { chapitres: string; page: string }[] = [];
  for (const chapter of chaptersTajwid) {
    if (chapter.pages && chapter.pages.length > 0) {
      for (const page of chapter.pages) {
        params.push({
          chapitres: chapter.chapterNumber.toString(),
          page: page.pageNumber.toString(),
        });
      }
    } else {
      params.push({
        chapitres: chapter.chapterNumber.toString(),
        page: '0',
      });
    }
  }
  return params;
}
