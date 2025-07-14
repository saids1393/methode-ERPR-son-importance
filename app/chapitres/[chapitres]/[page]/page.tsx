import React from 'react';
import { generateAllStaticParams, getPageByNumbers } from '@/lib/chapters';

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
            Le chapitre {chapNum}, page {pageNum} n'existe pas dans la configuration.
          </p>
        )}

        <p className="text-gray-500 text-sm">
          Chemin recherché : /app/components/chapitres/chapitre{chapNum}/Page{pageNum}.tsx
        </p>

        <div className="mt-6">
          <a
            href="/chapitres/1/1"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Retour à la page 1
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
    // Assure-toi que le chemin correspond bien à ta structure, ici casse sensible (Page avec P majuscule)
    const module = await import(
      `@/app/components/chapitres/chapitre${chapNum}/Page${pageNum}`
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
    console.error(`Erreur de chargement: chapitre${chapNum}/Page${pageNum}`, error);

    const pageInfo = getPageByNumbers(chapNum, pageNum);

    return () => <NotFoundPage chapNum={chapNum} pageNum={pageNum} pageInfo={pageInfo} />;
  }
}

export default async function Page({ params }: Props) {
  const { chapitres, page } = await params;
  const Component = await getComponent(chapitres, page);
  return <Component />;
}

export async function generateStaticParams() {
  return generateAllStaticParams();
}
