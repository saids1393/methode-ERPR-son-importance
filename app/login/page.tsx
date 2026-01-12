'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import LandingHeader from '@/app/components/LandingHeader';

// --- CONFIGURATION DE SÉCURITÉ (ALIGNÉE AVEC LE BACKEND) ---

// Fournisseurs français grand public et sécurisés
const ALLOWED_EMAIL_DOMAINS = [
  'orange.fr', 'wanadoo.fr', 'sfr.fr', 'neuf.fr', 'bbox.fr',
  'laposte.net', 'free.fr', 'numericable.fr', 'mailo.com', 'mail.fr',
  'pm.me', 'proton.me'
];

// Fournisseurs internationaux de confiance
const TRUSTED_PROVIDERS = [
  'gmail', 'yahoo', 'outlook', 'hotmail', 'live', 'msn',
  'icloud', 'protonmail'
];

// Extensions de domaines européens (TLD)
const TRUSTED_TLDS = [
  'fr', 'de', 'es', 'it', 'be', 'nl', 'ch', 'pt', 'uk', 'ie',
  'pl', 'cz', 'se', 'no', 'fi', 'dk', 'at'
];

// Domaines jetables connus
const BLOCKED_DOMAINS = [
  'tempmail.com', 'mailinator.com', '10minutemail.com',
  'yopmail.com', 'guerrillamail.com', 'trashmail.com'
];

// --- VALIDATION EMAIL AVANCÉE (IDENTIQUE AU BACKEND) ---
function validateEmailDomain(email: string): { valid: boolean; error?: string } {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { valid: false, error: 'Format email invalide' };
  }

  const domain = email.split('@')[1].toLowerCase();
  const base = domain.split('.')[0];
  const tld = domain.split('.').pop();

  // Bloquer les domaines jetables
  if (BLOCKED_DOMAINS.includes(domain)) {
    return { valid: false, error: 'Adresse email jetable non autorisée' };
  }

  // Accepter domaines explicitement whitelistés
  if (ALLOWED_EMAIL_DOMAINS.includes(domain)) {
    return { valid: true };
  }

  // Accepter les grands fournisseurs connus (toutes extensions locales)
  if (TRUSTED_PROVIDERS.some(p => domain.startsWith(p + '.') || base === p)) {
    return { valid: true };
  }

  // Accepter les TLD européens
  if (TRUSTED_TLDS.includes(tld || '')) {
    return { valid: true };
  }

  return {
    valid: false,
    error: `Le domaine ${domain} n'est pas autorisé.`
  };
}

// Sanitisation des entrées
function sanitizeInput(input: string): string {
  if (!input) return '';
  return input
    .trim()
    .slice(0, 255) // Limiter la longueur
    .replace(/[<>\"']/g, ''); // Supprimer caractères dangereux
}

export default function LoginPage() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [generalError, setGeneralError] = useState('');
  const router = useRouter();

  // Validation en temps réel lors de la saisie d'email (débouncée)
  const handleIdentifierChange = useCallback((value: string) => {
    setIdentifier(value);
    setGeneralError(''); // Effacer l'erreur générale en cas de nouvelle saisie

    // Si c'est un email, valider le domaine
    if (value.includes('@')) {
      const validation = validateEmailDomain(value);
      if (!validation.valid) {
        setEmailError(validation.error || '');
      } else {
        setEmailError('');
      }
    } else {
      setEmailError(''); // C'est un username, pas de validation de domaine
    }
  }, []);

  const handlePasswordChange = useCallback((value: string) => {
    setPassword(value);
    setGeneralError(''); // Effacer l'erreur en cas de nouvelle saisie
  }, []);

  // Validation avant envoi
  const validateBeforeSubmit = (): boolean => {
    // Vérifier les champs vides
    if (!identifier.trim() || !password) {
      setGeneralError('Identifiant et mot de passe requis');
      toast.error('Veuillez remplir tous les champs');
      return false;
    }

    // Vérifier la longueur minimale
    if (password.length < 1) {
      setGeneralError('Mot de passe invalide');
      toast.error('Mot de passe invalide');
      return false;
    }

    // Vérifier le domaine email si applicable
    if (identifier.includes('@')) {
      const emailValidation = validateEmailDomain(identifier);
      if (!emailValidation.valid) {
        setEmailError(emailValidation.error || 'Domaine email non autorisé');
        toast.error(emailValidation.error || 'Domaine email non autorisé');
        return false;
      }
    }

    return true;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError('');
    setEmailError('');

    // Validation préalable
    if (!validateBeforeSubmit()) {
      return;
    }

    setLoading(true);

    try {
      // Sanitiser les données avant envoi
      const cleanIdentifier = sanitizeInput(identifier).toLowerCase().trim();
      const cleanPassword = password;

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Pour les cookies
        body: JSON.stringify({
          identifier: cleanIdentifier,
          password: cleanPassword,
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success('Connexion réussie !');
        // Petit délai pour que le toast s'affiche avant la redirection
        setTimeout(() => {
          router.push('/dashboard');
        }, 500);
      } else if (response.status === 429) {
        // Rate limiting
        const retryAfter = data.retryAfter || 900;
        const minutes = Math.ceil(retryAfter / 60);
        setGeneralError(`Trop de tentatives. Réessayez dans ${minutes} minutes.`);
        toast.error(`Trop de tentatives. Réessayez dans ${minutes} minutes.`);
      } else if (response.status === 400) {
        // Erreur de validation
        setEmailError(data.error || 'Données invalides');
        toast.error(data.error || 'Données invalides');
      } else if (response.status === 401) {
        // Identifiants incorrects
        setGeneralError(data.error || 'Identifiants incorrects');
        toast.error('Identifiants incorrects ou compte inactif');
      } else {
        // Erreur serveur
        setGeneralError('Erreur serveur. Veuillez réessayer.');
        toast.error('Erreur serveur. Veuillez réessayer.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setGeneralError('Erreur de connexion réseau');
      toast.error('Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  // Le formulaire est valide si :
  // - identifier et password sont remplis
  // - si identifier contient @, il n'y a pas d'emailError
  // - pas en cours de chargement
  const isFormValid = 
    identifier.trim() && 
    password && 
    (identifier.includes('@') ? !emailError : true) && 
    !loading;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <LandingHeader showLogin={false} showRegister={true} />

      <div className="flex flex-col justify-center min-h-screen pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          {/* Logo et titre */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">Connexion</h1>
            <p className="mt-2 text-gray-600">
              Accédez à votre espace d'apprentissage
            </p>
          </div>

          {/* Formulaire */}
          <div className="mt-8 bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 p-8">
            {/* Erreur générale */}
            {generalError && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-sm text-red-600">{generalError}</p>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              {/* Email/Username field */}
              <div>
                <label htmlFor="identifier" className="block text-sm font-medium text-gray-700 mb-2">
                  Identifiant
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <input
                    id="identifier"
                    name="identifier"
                    type="text"
                    autoComplete="username"
                    required
                    disabled={loading}
                    value={identifier}
                    onChange={(e) => handleIdentifierChange(e.target.value)}
                    className={`block w-full pl-10 pr-3 py-3 bg-gray-50 border rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                      emailError ? 'border-red-300 bg-red-50' : 'border-gray-200'
                    }`}
                    placeholder="Pseudo ou email"
                  />
                </div>
                {emailError && (
                  <p className="mt-2 text-sm text-red-500">{emailError}</p>
                )}
              </div>

              {/* Password field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Mot de passe
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    disabled={loading}
                    value={password}
                    onChange={(e) => handlePasswordChange(e.target.value)}
                    className="block w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    disabled={loading}
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    <svg className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      {showPassword ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      )}
                    </svg>
                  </button>
                </div>
              </div>

              {/* Remember me & Forgot password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    disabled={loading}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-600">
                    Se souvenir de moi
                  </label>
                </div>

                <Link
                  href="/forgot-password"
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  Mot de passe oublié ?
                </Link>
              </div>

              {/* Login button */}
              <button
                type="submit"
                disabled={!isFormValid}
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl text-base font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-600/25"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Connexion...
                  </>
                ) : (
                  'Se connecter'
                )}
              </button>
            </form>

            {/* Separator */}
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white px-4 text-gray-500">Pas encore de compte ?</span>
                </div>
              </div>

              {/* Sign up link */}
              <div className="mt-6">
                <Link
                  href="/checkout"
                  className="w-full flex justify-center items-center py-3 px-4 border-2 border-blue-600 rounded-xl text-base font-semibold text-blue-600 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                >
                  Créer un compte
                </Link>
              </div>
            </div>
          </div>

          {/* Trust indicators */}
          <div className="mt-8 flex justify-center gap-8">
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0110 1.944 11.954 11.954 0 0117.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Connexion sécurisée</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}