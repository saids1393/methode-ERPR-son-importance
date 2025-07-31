'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  User,
  Mail,
  Lock,
  UserPlus,
  Save,
  X,
  Eye,
  EyeOff
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function CreateUserPage() {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    gender: '' as 'HOMME' | 'FEMME' | '',
    isActive: true,
    isPaid: false
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast.error('Email et mot de passe requis');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }

    if (formData.password.length < 8) {
      toast.error('Le mot de passe doit contenir au moins 8 caractères');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/admin/users/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success('Utilisateur créé avec succès !');
        router.push('/admin/users');
      } else {
        toast.error(data.error || 'Erreur lors de la création');
      }
    } catch (error) {
      toast.error('Erreur de connexion');
      console.error('Create user error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-900 text-white">
      {/* Header */}
      <div className="bg-zinc-800 border-b border-zinc-700 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Link
              href="/admin/users"
              className="bg-zinc-700 hover:bg-zinc-600 text-white p-2 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <div className="bg-green-600 p-2 rounded-lg">
                  <UserPlus className="h-8 w-8" />
                </div>
                Créer un Utilisateur
              </h1>
              <p className="text-zinc-400 mt-2">Ajouter un nouvel utilisateur au système</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Informations de base */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  <Mail className="inline h-4 w-4 mr-2" />
                  Adresse email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full bg-zinc-700 border border-zinc-600 rounded-lg px-4 py-3 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="utilisateur@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  <User className="inline h-4 w-4 mr-2" />
                  Pseudo
                </label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                  className="w-full bg-zinc-700 border border-zinc-600 rounded-lg px-4 py-3 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Pseudo de l'utilisateur"
                />
              </div>
            </div>

            {/* Mot de passe */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  <Lock className="inline h-4 w-4 mr-2" />
                  Mot de passe *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    className="w-full bg-zinc-700 border border-zinc-600 rounded-lg px-4 py-3 pr-12 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Minimum 8 caractères"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  <Lock className="inline h-4 w-4 mr-2" />
                  Confirmer le mot de passe *
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    className="w-full bg-zinc-700 border border-zinc-600 rounded-lg px-4 py-3 pr-12 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Confirmer le mot de passe"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-400 hover:text-white"
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Genre */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Genre
              </label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value as 'HOMME' | 'FEMME' | '' }))}
                className="w-full bg-zinc-700 border border-zinc-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="HOMME">Homme</option>
                <option value="free">Gratuit</option>
                <option value="FEMME">Femme</option>
              </select>
            </div>

            {/* Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                  className="w-4 h-4 text-purple-600 bg-zinc-700 border-zinc-600 rounded focus:ring-purple-500"
                />
                <label htmlFor="isActive" className="text-zinc-300">
                  Compte actif
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Statut de paiement
                </label>
                <select
                  value={formData.isPaid ? 'paid' : 'free'}
                  onChange={(e) => setFormData(prev => ({ ...prev, isPaid: e.target.value === 'paid' }))}
                  className="w-full bg-zinc-700 border border-zinc-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="free">Gratuit</option>
                  <option value="paid">Payé</option>
                </select>
              </div>
            </div>

            <div className="bg-zinc-700 border border-zinc-600 rounded-lg p-4">
              <h4 className="text-sm font-medium text-zinc-300 mb-3">💡 Information :</h4>
              <div className="space-y-2 text-sm text-zinc-400">
                <div className="flex items-start gap-2">
                  <span className="text-green-400">💰</span>
                  <span><strong>Payé :</strong> Compté dans les revenus (64.99€) - Stripe, liquide, chèque, etc.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-blue-400">🆓</span>
                  <span><strong>Gratuit :</strong> Accès libre, n'impacte pas les revenus (0€)</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-yellow-400">ℹ️</span>
                  <span><strong>Note :</strong> Les inscriptions normales sont automatiquement "Payé"</span>
                </div>
              </div>
            </div>

            {/* Validation du mot de passe */}
            {formData.password && (
              <div className="bg-zinc-700 border border-zinc-600 rounded-lg p-4">
                <h4 className="text-sm font-medium text-zinc-300 mb-3">Validation du mot de passe :</h4>
                <div className="space-y-2 text-sm">
                  <div className={`flex items-center gap-2 ${formData.password.length >= 8 ? 'text-green-400' : 'text-red-400'}`}>
                    <div className={`w-2 h-2 rounded-full ${formData.password.length >= 8 ? 'bg-green-400' : 'bg-red-400'}`}></div>
                    Au moins 8 caractères
                  </div>
                  <div className={`flex items-center gap-2 ${formData.password === formData.confirmPassword && formData.confirmPassword ? 'text-green-400' : 'text-red-400'}`}>
                    <div className={`w-2 h-2 rounded-full ${formData.password === formData.confirmPassword && formData.confirmPassword ? 'bg-green-400' : 'bg-red-400'}`}></div>
                    Mots de passe identiques
                  </div>
                </div>
              </div>
            )}

            {/* Boutons d'action */}
            <div className="flex gap-4 pt-6 border-t border-zinc-600">
              <Link
                href="/admin/users"
                className="flex-1 bg-zinc-600 hover:bg-zinc-500 text-white font-medium px-6 py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <X size={20} />
                Annuler
              </Link>
              
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                    Création...
                  </>
                ) : (
                  <>
                    <Save size={20} />
                    Créer l'utilisateur
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}