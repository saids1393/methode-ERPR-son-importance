'use client';

import { useState } from 'react';
import Link from 'next/link';
import { BookOpen, CheckCircle, AlertCircle, Loader2, ArrowLeft } from 'lucide-react';

export default function TajwidSetupPage() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const seedTajwidHomework = async () => {
    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const response = await fetch('/api/admin/seed-tajwid-homework', {
        method: 'POST',
      });

      const data = await response.json();

      if (response.ok) {
        setResults(data);
      } else {
        setError(data.error || 'Erreur lors du seed');
      }
    } catch (err: any) {
      setError(err.message || 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-zinc-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour à l'admin
        </Link>

        <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-gradient-to-r from-green-500 to-teal-500 p-3 rounded-lg">
              <BookOpen className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Configuration Tajwid</h1>
              <p className="text-zinc-400 mt-1">
                Initialiser les devoirs Tajwid dans la base de données
              </p>
            </div>
          </div>

          <div className="bg-zinc-700/50 border border-zinc-600 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">À propos de cette action</h2>
            <div className="space-y-3 text-zinc-300">
              <p>
                Cette action va créer 10 devoirs Tajwid dans la base de données, un pour chaque chapitre (1 à 10).
              </p>
              <p>
                Ces devoirs seront automatiquement envoyés par email aux utilisateurs qui complètent les chapitres Tajwid.
              </p>
              <div className="flex items-start gap-2 text-yellow-400 bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 mt-4">
                <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <strong>Important :</strong> Si les devoirs existent déjà, cette action ne fera rien.
                  Chaque devoir ne peut être créé qu'une seule fois.
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={seedTajwidHomework}
            disabled={loading}
            className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 disabled:from-zinc-600 disabled:to-zinc-600 text-white font-bold py-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Création en cours...
              </>
            ) : (
              <>
                <CheckCircle className="h-5 w-5" />
                Créer les devoirs Tajwid
              </>
            )}
          </button>

          {error && (
            <div className="mt-6 bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-red-400 font-semibold">Erreur</p>
                <p className="text-red-300 text-sm mt-1">{error}</p>
              </div>
            </div>
          )}

          {results && (
            <div className="mt-6 space-y-4">
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-green-400 font-semibold">{results.message}</p>
                </div>
              </div>

              <div className="bg-zinc-700 border border-zinc-600 rounded-lg p-4">
                <h3 className="text-lg font-bold mb-4">Résultats détaillés</h3>
                <div className="space-y-2">
                  {results.results.map((result: any, index: number) => (
                    <div
                      key={index}
                      className={`flex items-center gap-3 p-3 rounded-lg ${
                        result.status === 'created'
                          ? 'bg-green-500/10 border border-green-500/20'
                          : result.status === 'exists'
                          ? 'bg-blue-500/10 border border-blue-500/20'
                          : 'bg-red-500/10 border border-red-500/20'
                      }`}
                    >
                      {result.status === 'created' && (
                        <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
                      )}
                      {result.status === 'exists' && (
                        <CheckCircle className="h-5 w-5 text-blue-400 flex-shrink-0" />
                      )}
                      {result.status === 'error' && (
                        <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0" />
                      )}
                      <div className="flex-1">
                        <p
                          className={`font-medium ${
                            result.status === 'created'
                              ? 'text-green-300'
                              : result.status === 'exists'
                              ? 'text-blue-300'
                              : 'text-red-300'
                          }`}
                        >
                          Chapitre {result.chapterId}
                        </p>
                        <p className="text-zinc-400 text-sm">{result.message}</p>
                        {result.error && (
                          <p className="text-red-400 text-xs mt-1">{result.error}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                <p className="text-blue-300 text-sm">
                  <strong>Prochaine étape :</strong> Les utilisateurs qui complèteront les chapitres Tajwid
                  recevront automatiquement leur devoir par email.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
