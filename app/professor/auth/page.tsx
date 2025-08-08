'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User, Mail, Lock, Eye, EyeOff, UserPlus, LogIn } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <User className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl font-extrabold text-white">
            {mode === 'create' ? 'Créer un compte professeur' : 'Connexion Professeur'}
          </h2>
          <p className="mt-2 text-purple-200">
            {mode === 'create' 
              ? 'Rejoignez l\'équipe pédagogique' 
              : 'Accédez à votre espace professeur'
            }
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 py-8 px-4 shadow-2xl sm:rounded-2xl sm:px-10">
          {/* Onglets */}
          <div className="flex mb-8 bg-white/5 rounded-xl p-1">
            <button
              onClick={() => switchMode('login')}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                mode === 'login'
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'text-purple-200 hover:text-white'
              }`}
            >
              <LogIn className="inline h-4 w-4 mr-2" />
              Connexion
            </button>
            <button
              onClick={() => switchMode('create')}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                mode === 'create'
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'text-purple-200 hover:text-white'
              }`}
            >
              <UserPlus className="inline h-4 w-4 mr-2" />
              Créer un compte
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                <Mail className="inline h-4 w-4 mr-2" />
                Adresse email
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="professeur@example.com"
              />
            </div>

            {/* Nom (création seulement) */}
            {mode === 'create' && (
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  <User className="inline h-4 w-4 mr-2" />
                  Nom complet
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Votre nom complet"
                />
              </div>
            )}

            {/* Genre (création seulement) */}
            {mode === 'create' && (
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Genre
                </label>
                <select
                  required
                  value={formData.gender}
                  onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value as 'HOMME' | 'FEMME' }))}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="" className="bg-slate-800">Sélectionnez votre genre</option>
                  <option value="HOMME" className="bg-slate-800">Homme</option>
                  <option value="FEMME" className="bg-slate-800">Femme</option>
                </select>
              </div>
            )}

            {/* Mot de passe */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                <Lock className="inline h-4 w-4 mr-2" />
                Mot de passe
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 pr-12 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder={mode === 'create' ? 'Minimum 8 caractères' : 'Votre mot de passe'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Code secret (création seulement) */}
            {mode === 'create' && (
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Code secret professeur
                </label>
                <input
                  type="text"
                  required
                  value={formData.secretCode}
                  onChange={(e) => setFormData(prev => ({ ...prev, secretCode: e.target.value }))}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Code fourni par l'administration"
                />
                <p className="text-slate-400 text-xs mt-1">
                  Contactez l'administration pour obtenir le code secret
                </p>
              </div>
            )}

            {/* Validation du mot de passe (création) */}
            {mode === 'create' && formData.password && (
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <h4 className="text-sm font-medium text-slate-300 mb-3">Validation du mot de passe :</h4>
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
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                    {mode === 'create' ? 'Création...' : 'Connexion...'}
                  </>
                ) : (
                  <>
                    {mode === 'create' ? (
                      <>
                        <UserPlus className="h-5 w-5" />
                        Créer mon compte professeur
                      </>
                    ) : (
                      <>
                        <LogIn className="h-5 w-5" />
                        Se connecter
                      </>
                    )}
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Lien vers l'espace élève */}
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/20" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-transparent text-slate-400">Vous êtes un élève ?</span>
              </div>
            </div>

            <div className="mt-6">
              <Link
                href="/dashboard"
                className="w-full flex justify-center py-2 px-4 border border-white/20 rounded-xl text-sm font-medium text-slate-300 bg-white/5 hover:bg-white/10 transition-colors"
              >
                Accéder à l'espace élève
              </Link>
            </div>
          </div>

          {/* Information sur le code secret */}
          {mode === 'create' && (
            <div className="mt-6 bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
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
  );
}