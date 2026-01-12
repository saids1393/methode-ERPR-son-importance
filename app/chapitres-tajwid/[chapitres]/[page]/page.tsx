import React from 'react';
import { chaptersTajwid } from '@/lib/chapters-tajwid';
import AutoProgressWrapper from '@/app/components/AutoProgressWrapper';
import type { Page } from '@/lib/chapters';

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
  pageInfo: (Page & { chapterNumber: number }) | null;
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
    const pageInfo = chaptersTajwid
      .flatMap(ch => (ch.pages || []).map(p => ({ ...p, chapterNumber: ch.chapterNumber })))
      .find(p => p.chapterNumber === chapNum && p.pageNumber === pageNum);
    return () => <NotFoundPage chapNum={chapNum} pageNum={pageNum} pageInfo={pageInfo as any} />;
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
