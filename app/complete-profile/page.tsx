'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { BookOpen, User, Lock, Eye, EyeOff, CheckCircle2 } from 'lucide-react';

export default function CompleteProfilePage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [gender, setGender] = useState<'HOMME' | 'FEMME' | ''>('');
  const [loading, setLoading] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const userData = await response.json();
          setUserEmail(userData.email);

          if (userData.username && userData.hasPassword) {
            router.push('/dashboard');
          }
        } else {
          router.push('/checkout');
        }
      } catch (error) {
        console.error('Error checking user:', error);
        router.push('/checkout');
      }
    };
    checkUser();
  }, [router]);

  const handleCompleteProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password || !confirmPassword || !gender) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }

    if (password.length < 8) {
      toast.error('Le mot de passe doit contenir au moins 8 caractères');
      return;
    }

    if (username.length < 3) {
      toast.error('Le pseudo doit contenir au moins 3 caractères');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/complete-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, gender })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success('Profil complété avec succès !');
        setTimeout(() => {
          window.location.replace('/dashboard');
        }, 500);
      } else {
        toast.error(data.error || 'Erreur lors de la complétion du profil');
      }
    } catch (error) {
      toast.error('Erreur de connexion');
      console.error('Complete profile error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="complete-profile-page-dark min-h-screen relative overflow-hidden bg-black">
      <style jsx>{`
        .complete-profile-page-dark {
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
            Félicitations !
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            Votre paiement a été confirmé. Complétez votre profil pour accéder au cours.
          </p>
          <p className="mt-1 text-center text-xs text-gray-500">
            Connecté avec : {userEmail}
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
          <div className="relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur opacity-30"></div>
            <div className="relative bg-gray-950/90 backdrop-blur-xl py-8 px-6 rounded-2xl border border-gray-800 sm:px-10">
              <form onSubmit={handleCompleteProfile} className="space-y-6">
                {/* Pseudo */}
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
                    <User className="inline h-4 w-4 mr-2" />
                    Choisissez un pseudo
                  </label>
                  <div className="relative">
                    <input
                      id="username"
                      name="username"
                      type="text"
                      autoComplete="username"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="block w-full pl-10 pr-3 py-3 bg-gray-900/50 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200"
                      placeholder="Votre pseudo (min. 3 caractères)"
                    />
                  </div>
                </div>

                {/* Genre */}
                <div>
                  <label htmlFor="gender" className="block text-sm font-medium text-gray-300 mb-2">
                    Genre
                  </label>
                  <div className="relative">
                    <select
                      id="gender"
                      name="gender"
                      required
                      value={gender}
                      onChange={(e) => setGender(e.target.value as 'HOMME' | 'FEMME')}
                      className="block w-full pl-3 pr-3 py-3 bg-gray-900/50 border border-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200"
                    >
                      <option value="" className="bg-gray-900">Sélectionnez votre genre</option>
                      <option value="HOMME" className="bg-gray-900">Homme</option>
                      <option value="FEMME" className="bg-gray-900">Femme</option>
                    </select>
                  </div>
                </div>

                {/* Mot de passe */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                    <Lock className="inline h-4 w-4 mr-2" />
                    Mot de passe
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full pl-10 pr-10 py-3 bg-gray-900/50 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200"
                      placeholder="Mot de passe (min. 8 caractères)"
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

                {/* Confirmer le mot de passe */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                    <Lock className="inline h-4 w-4 mr-2" />
                    Confirmer le mot de passe
                  </label>
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="block w-full pl-10 pr-10 py-3 bg-gray-900/50 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200"
                      placeholder="Confirmez votre mot de passe"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-500 hover:text-gray-400 transition-colors" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-500 hover:text-gray-400 transition-colors" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Validation du mot de passe */}
                {password && (
                  <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-300 mb-3">Validation du mot de passe :</h4>
                    <div className="space-y-2 text-sm">
                      <div className={`flex items-center gap-2 ${password.length >= 8 ? 'text-green-400' : 'text-red-400'}`}>
                        <div className={`w-2 h-2 rounded-full ${password.length >= 8 ? 'bg-green-400' : 'bg-red-400'}`}></div>
                        Au moins 8 caractères
                      </div>
                      <div className={`flex items-center gap-2 ${/[A-Z]/.test(password) ? 'text-green-400' : 'text-red-400'}`}>
                        <div className={`w-2 h-2 rounded-full ${/[A-Z]/.test(password) ? 'bg-green-400' : 'bg-red-400'}`}></div>
                        Au moins une majuscule
                      </div>
                      <div className={`flex items-center gap-2 ${/[0-9]/.test(password) ? 'text-green-400' : 'text-red-400'}`}>
                        <div className={`w-2 h-2 rounded-full ${/[0-9]/.test(password) ? 'bg-green-400' : 'bg-red-400'}`}></div>
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
                    {loading ? 'Finalisation...' : 'Accéder au cours'}
                  </button>
                </div>
              </form>

              {/* Conditions d'utilisation */}
              <div className="mt-6 text-center">
                <p className="text-xs text-gray-500">
                  En complétant votre profil, vous acceptez nos conditions d'utilisation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
