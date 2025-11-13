"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me');
        setIsAuthenticated(response.ok);
      } catch {
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center p-6 sm:p-12 text-center">
      {/* En-tête */}
      <header className="max-w-xl mb-12">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-gray-100 mb-3">
          Apprentissage de la Lecture et Écriture à votre rythme.
        </h1>
      </header>

      {/* Boutons */}
      <div className="flex flex-col sm:flex-row gap-4 max-w-2xl w-full justify-center items-center">
        {isAuthenticated === null ? (
          <div className="bg-gray-300 text-gray-500 font-semibold py-4 px-8 rounded-full">
            Chargement...
          </div>
        ) : isAuthenticated ? (
          <Link
            href="/dashboard"
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-8 rounded-full shadow-md transition transform hover:scale-105 flex justify-center items-center gap-2"
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
                d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
              />
            </svg>
            Accéder à mon espace
          </Link>
        ) : (
          <>
            <Link
              href="/signup-free"
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-8 rounded-full shadow-md transition transform hover:scale-105 flex justify-center items-center gap-2"
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
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Essai gratuit 7 jours
            </Link>
            <Link
              href="/login"
              className="bg-gray-700 hover:bg-gray-800 text-white font-semibold py-4 px-8 rounded-full shadow-md transition transform hover:scale-105 flex justify-center items-center gap-2"
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
                  d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                />
              </svg>
              Se connecter
            </Link>
          </>
        )}
      </div>

      {/* Pied de page */}
      <footer className="mt-20 max-w-md text-gray-500 dark:text-gray-400 text-sm">
        <p>© {new Date().getFullYear()} Méthode ERPR - Tous droits réservés</p>
        <p className="text-md sm:text-lg text-gray-600 dark:text-gray-400 mt-1">
          Créé par <span className="font-semibold">ArabeImportance, Prof. Soidroudine</span>
        </p>
      </footer>
    </div>
  );
}
