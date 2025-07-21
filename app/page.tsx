"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center p-6 sm:p-12 text-center">
      {/* En-tête */}
      <header className="max-w-xl mb-12">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-gray-100 mb-3">
          Apprentissage de la Lecture et Écriture en 1 mois
        </h1>
      </header>

      {/* Boutons */}
      <div className="flex flex-col sm:flex-row gap-8 max-w-md w-full justify-center items-center">
        <Link
          href="/chapitres/0/0"
          className="bg-indigo-700 hover:bg-indigo-800 text-white font-semibold py-4 px-8 rounded-full shadow-md transition transform hover:scale-105 flex justify-center items-center gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
          Commencer l'apprentissage
        </Link>
      </div>

      {/* Pied de page */}
      <footer className="mt-20 max-w-md text-gray-500 dark:text-gray-400 text-sm">
        <p>© {new Date().getFullYear()} Méthode "Son Importance" - Tous droits réservés</p>
        <p className="text-md sm:text-lg text-gray-600 dark:text-gray-400 mt-1">
          Créé par <span className="font-semibold">Son Importance, Professeur Soidroudine</span>
        </p>
      </footer>
    </div>
  );
}
