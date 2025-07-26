import { redirect } from 'next/navigation';
import { getAuthUser, clearAuthCookie } from '@/lib/auth';
import Link from 'next/link';

export default async function DashboardPage() {
  const user = await getAuthUser();

  if (!user) {
    redirect('/checkout');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">
                Méthode "Son Importance"
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                Connecté en tant que: {user.email}
              </span>
              <form action="/api/auth/logout" method="POST">
                <button
                  type="submit"
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Déconnexion
                </button>
              </form>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg p-8">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-gray-900 mb-4">
                Bienvenue dans votre espace d'apprentissage !
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Félicitations ! Vous avez maintenant accès à la méthode complète d'apprentissage de l'arabe.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    🎯 Commencer le cours
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Accédez à tous les chapitres de la méthode, des bases jusqu'à la lecture complète.
                  </p>
                  <Link
                    href="/chapitres/0/introduction"
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
                  >
                    Commencer maintenant
                  </Link>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    📊 Votre progression
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Suivez votre avancement à travers les différents chapitres et exercices.
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: '0%' }}></div>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">0% complété</p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    📚 Ressources
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Téléchargez les supports PDF et accédez aux exercices d'écriture.
                  </p>
                  <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                    Voir les ressources
                  </button>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    💬 Support
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Besoin d'aide ? Contactez notre équipe pédagogique.
                  </p>
                  <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                    Contacter le support
                  </button>
                </div>
              </div>

              <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                <p className="text-blue-800">
                  <strong>Conseil :</strong> Pour de meilleurs résultats, consacrez 30 minutes par jour à votre apprentissage. 
                  La régularité est la clé du succès !
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}