'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User, Mail, Lock, Eye, EyeOff, UserPlus, LogIn, BookOpen } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProfessorAuthPage() {
  const [mode, setMode] = useState<'login' | 'create'>('login');
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    gender: '' as 'HOMME' | 'FEMME' | '',
    password: '',
    secretCode: ''
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === 'create') {
      if (!formData.email || !formData.name || !formData.gender || !formData.password || !formData.secretCode) {
        toast.error('Veuillez remplir tous les champs');
        return;
      }

      if (formData.password.length < 8) {
        toast.error('Le mot de passe doit contenir au moins 8 caractères');
        return;
      }
    } else {
      if (!formData.email || !formData.password) {
        toast.error('Email et mot de passe requis');
        return;
      }
    }

    setLoading(true);

    try {
      const response = await fetch('/api/professor/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: mode,
          ...formData
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success(mode === 'create' ? 'Compte créé avec succès !' : 'Connexion réussie !');
        router.push('/professor');
      } else {
        toast.error(data.error || 'Erreur lors de l\'authentification');
      }
    } catch (error) {
      toast.error('Erreur de connexion');
      console.error('Professor auth error:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      email: '',
      name: '',
      gender: '',
      password: '',
      secretCode: ''
    });
  };

  const switchMode = (newMode: 'login' | 'create') => {
    setMode(newMode);
    resetForm();
  };

  return (
    <div className="professor-auth-page-dark min-h-screen relative overflow-hidden bg-black">
      <style jsx>{`
        .professor-auth-page-dark {
          background-color: #000000 !important;
          color: #ffffff !important;
        }
      `}</style>

      {/* Light effects on sides */}
      <div className="absolute inset-0">
        <div className="absolute top-0 -left-40 w-96 h-full bg-gradient-to-r from-transparent via-blue-500/10 to-transparent blur-3xl"></div>
        <div className="absolute top-0 -right-40 w-96 h-full bg-gradient-to-l from-transparent via-purple-500/10 to-transparent blur-3xl"></div>
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-to-b from-white/5 to-transparent rounded-full blur-3xl"></div>
      </div>

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='grid' width='60' height='60' patternUnits='userSpaceOnUse'%3E%3Cpath d='M 60 0 L 0 0 0 60' fill='none' stroke='white' stroke-width='0.5' opacity='0.05'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23grid)'/%3E%3C/svg%3E")`
        }}
      ></div>

      <div className="relative z-10 flex flex-col justify-center min-h-screen py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex items-center justify-center p-3 rounded-xl bg-opacity-20">
            <BookOpen className="h-8 w-8 text-white" />
          </div>
          <h2 className="mt-4 text-center text-3xl font-bold text-white">
            {mode === 'create' ? 'Créer un compte professeur' : 'Connexion Professeur'}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            {mode === 'create' ? 'Rejoignez l\'équipe pédagogique' : 'Accédez à votre espace professeur'}
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
          <div className="relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur opacity-30"></div>

            <div className="relative bg-gray-950/90 backdrop-blur-xl py-8 px-6 rounded-2xl border border-gray-800 sm:px-10">
              {/* Onglets */}
              <div className="flex mb-8 bg-gray-800/50 rounded-xl p-1">
                <button
                  onClick={() => switchMode('login')}
                  className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                    mode === 'login'
                      ? 'bg-blue-600/80 text-white shadow-lg'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800/30'
                  }`}
                >
                  <LogIn className="inline h-4 w-4 mr-2" />
                  Connexion
                </button>
                <button
                  onClick={() => switchMode('create')}
                  className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                    mode === 'create'
                      ? 'bg-blue-600/80 text-white shadow-lg'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800/30'
                  }`}
                >
                  <UserPlus className="inline h-4 w-4 mr-2" />
                  Créer un compte
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                    <Mail className="inline h-4 w-4 mr-2" />
                    Adresse email
                  </label>
                  <div className="relative">
                    <input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className="block w-full pl-10 pr-3 py-3 bg-gray-900/50 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200"
                      placeholder="professeur@example.com"
                    />
                  </div>
                </div>

                {/* Nom (création seulement) */}
                {mode === 'create' && (
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                      <User className="inline h-4 w-4 mr-2" />
                      Nom complet
                    </label>
                    <div className="relative">
                      <input
                        id="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        className="block w-full pl-10 pr-3 py-3 bg-gray-900/50 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200"
                        placeholder="Votre nom complet"
                      />
                    </div>
                  </div>
                )}

                {/* Genre (création seulement) */}
                {mode === 'create' && (
                  <div>
                    <label htmlFor="gender" className="block text-sm font-medium text-gray-300 mb-2">
                      Genre
                    </label>
                    <div className="relative">
                      <select
                        id="gender"
                        required
                        value={formData.gender}
                        onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value as 'HOMME' | 'FEMME' }))}
                        className="block w-full pl-3 pr-3 py-3 bg-gray-900/50 border border-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200"
                      >
                        <option value="" className="bg-gray-900">Sélectionnez votre genre</option>
                        <option value="HOMME" className="bg-gray-900">Homme</option>
                        <option value="FEMME" className="bg-gray-900">Femme</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* Mot de passe */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                    <Lock className="inline h-4 w-4 mr-2" />
                    Mot de passe
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={formData.password}
                      onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                      className="block w-full pl-10 pr-10 py-3 bg-gray-900/50 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200"
                      placeholder={mode === 'create' ? 'Minimum 8 caractères' : 'Votre mot de passe'}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-500 hover:text-gray-400 transition-colors" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-500 hover:text-gray-400 transition-colors" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Code secret (création seulement) */}
                {mode === 'create' && (
                  <div>
                    <label htmlFor="secretCode" className="block text-sm font-medium text-gray-300 mb-2">
                      Code secret professeur
                    </label>
                    <div className="relative">
                      <input
                        id="secretCode"
                        type="text"
                        required
                        value={formData.secretCode}
                        onChange={(e) => setFormData(prev => ({ ...prev, secretCode: e.target.value }))}
                        className="block w-full pl-3 pr-3 py-3 bg-gray-900/50 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200"
                        placeholder="Code fourni par l'administration"
                      />
                    </div>
                    <p className="text-gray-400 text-xs mt-1">
                      Contactez l'administration pour obtenir le code secret
                    </p>
                  </div>
                )}

                {/* Validation du mot de passe (création) */}
                {mode === 'create' && formData.password && (
                  <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-300 mb-3">Validation du mot de passe :</h4>
                    <div className="space-y-2 text-sm">
                      <div className={`flex items-center gap-2 ${formData.password.length >= 8 ? 'text-green-400' : 'text-red-400'}`}>
                        <div className={`w-2 h-2 rounded-full ${formData.password.length >= 8 ? 'bg-green-400' : 'bg-red-400'}`}></div>
                        Au moins 8 caractères
                      </div>
                      <div className={`flex items-center gap-2 ${/[A-Z]/.test(formData.password) ? 'text-green-400' : 'text-red-400'}`}>
                        <div className={`w-2 h-2 rounded-full ${/[A-Z]/.test(formData.password) ? 'bg-green-400' : 'bg-red-400'}`}></div>
                        Au moins une majuscule
                      </div>
                      <div className={`flex items-center gap-2 ${/[0-9]/.test(formData.password) ? 'text-green-400' : 'text-red-400'}`}>
                        <div className={`w-2 h-2 rounded-full ${/[0-9]/.test(formData.password) ? 'bg-green-400' : 'bg-red-400'}`}></div>
                        Au moins un chiffre
                      </div>
                    </div>
                  </div>
                )}

                {/* Bouton de soumission */}
                <div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="relative group w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : null}
                    {loading ? (mode === 'create' ? 'Création...' : 'Connexion...') : (mode === 'create' ? 'Créer mon compte professeur' : 'Se connecter')}
                  </button>
                </div>
              </form>

              {/* Lien vers l'espace élève */}
              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-800"></div>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-gray-950 px-4 text-gray-500">Vous êtes un élève ?</span>
                  </div>
                </div>
                <div className="mt-6">
                  <Link
                    href="/dashboard"
                    className="group relative w-full flex justify-center items-center py-3 px-4 border border-gray-700 rounded-lg text-sm font-medium text-gray-300 bg-transparent hover:bg-gray-900/50 hover:border-gray-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-gray-500 transition-all duration-200"
                  >
                    Accéder à l'espace élève
                  </Link>
                </div>
              </div>

              {/* Information sur le code secret */}
              {mode === 'create' && (
                <div className="mt-6 bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="text-blue-400 text-lg">ℹ️</div>
                    <div>
                      <h4 className="text-blue-400 font-semibold text-sm mb-1">
                        Code secret requis
                      </h4>
                      <p className="text-blue-300 text-xs leading-relaxed">
                        Le code secret est nécessaire pour créer un compte professeur.
                        Contactez l'administration si vous ne l'avez pas reçu.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
