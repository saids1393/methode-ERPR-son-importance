import React from 'react';
import { generateAllStaticParams, getPageByNumbers } from '@/lib/chapters';

type Props = {
  params: Promise<{
    chapitres: string;
    page: string;
  }>;
};

async function getComponent(chapitres: string, page: string) {
  try {
    const module = await import(
      `@/app/components/chapitres/chapitre${chapitres}/Page${page}`
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
    console.error(`Erreur de chargement: chapitre${chapitres}/Page${page}`, error);

    return function NotFound() {
      const pageInfo = getPageByNumbers(parseInt(chapitres), parseInt(page));

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
                Le chapitre {chapitres}, page {page} n'existe pas dans la configuration.
              </p>
            )}

            <p className="text-gray-500 text-sm">
              Chemin recherché : /components/chapitres/chapitre{chapitres}/Page{page}.tsx
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
    };
  }
}

export default async function Page({ params }: Props) {
  const { chapitres, page } = await params;  // <- ici, bien await !
  const Component = await getComponent(chapitres, page);
  return <Component />;
}

export async function generateStaticParams() {
  return generateAllStaticParams();
}
