"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

export default function Home() {
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    // Countdown
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          window.location.href = "https://arabeimportance.fr";
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex flex-col items-center justify-center p-6">
      {/* Logo */}
      <div className="mb-8">
        <img
          src="/img/logo-bleu-fonce-point.png"
          alt="Logo"
          className="h-20 w-auto"
        />
      </div>

      {/* Card de redirection */}
      <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 p-8 sm:p-12 max-w-md w-full text-center">
        {/* Spinner */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
          </div>
        </div>

        {/* Titre */}
        <h1 className="text-2xl font-bold text-gray-900 mb-3">
          Un instant...
        </h1>

        {/* Message */}
        <p className="text-gray-600 mb-6">
          Vous allez être redirigé vers notre site web
        </p>

        {/* Countdown */}
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600 font-bold text-xl mb-6">
          {countdown}
        </div>

        {/* Lien arabeimportance */}
        <div className="pt-4 border-t border-gray-100">
          <a
            href="https://arabeimportance.fr"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            <span>arabeimportance.fr</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </div>
      </div>

      {/* Liens rapides */}
      <div className="mt-8 flex flex-col sm:flex-row gap-4 text-sm">
        <a
          href="/login"
          className="text-gray-600 hover:text-blue-600 transition-colors"
        >
          Déjà inscrit ? Se connecter
        </a>
        <span className="hidden sm:inline text-gray-300">|</span>
        <a
          href="/checkout"
          className="text-gray-600 hover:text-blue-600 transition-colors"
        >
          S'inscrire aux cours
        </a>
      </div>

      {/* Footer */}
      <p className="mt-12 text-xs text-gray-400">
        © {new Date().getFullYear()} Méthode ERPR by arabeimportance
      </p>
    </div>
  );
}
