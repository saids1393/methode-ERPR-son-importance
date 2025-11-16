'use client';
import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const ALLOWED_EMAIL_DOMAINS = [
  'orange.fr', 'wanadoo.fr', 'sfr.fr', 'neuf.fr', 'bbox.fr',
  'laposte.net', 'free.fr', 'numericable.fr', 'mailo.com', 'mail.fr',
  'pm.me', 'proton.me'
];

const TRUSTED_PROVIDERS = [
  'gmail', 'yahoo', 'outlook', 'hotmail', 'live', 'msn',
  'icloud', 'protonmail'
];

const TRUSTED_TLDS = [
  'fr', 'de', 'es', 'it', 'be', 'nl', 'ch', 'pt', 'uk', 'ie',
  'pl', 'cz', 'se', 'no', 'fi', 'dk', 'at'
];

const BLOCKED_DOMAINS = [
  'tempmail.com', 'mailinator.com', '10minutemail.com',
  'yopmail.com', 'guerrillamail.com', 'trashmail.com'
];

function validateEmailDomain(email: string): { valid: boolean; error?: string } {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { valid: false, error: 'Format email invalide' };
  }

  const domain = email.split('@')[1].toLowerCase();
  const base = domain.split('.')[0];
  const tld = domain.split('.').pop();

  if (BLOCKED_DOMAINS.includes(domain)) {
    return { valid: false, error: 'Adresse email jetable non autorisée' };
  }

  if (ALLOWED_EMAIL_DOMAINS.includes(domain)) {
    return { valid: true };
  }

  if (TRUSTED_PROVIDERS.some(p => domain.startsWith(p + '.') || base === p)) {
    return { valid: true };
  }

  if (TRUSTED_TLDS.includes(tld || '')) {
    return { valid: true };
  }

  return {
    valid: false,
    error: `Le domaine ${domain} n'est pas autorisé.`
  };
}

function sanitizeInput(input: string): string {
  if (!input) return '';
  return input
    .trim()
    .slice(0, 255)
    .replace(/[<>"']/g, '');
}

// ==================== DEVICE FINGERPRINT CLIENT ====================
async function generateClientDeviceFingerprint(): Promise<string> {
  const data = {
    userAgent: navigator.userAgent,
    language: navigator.language,
    platform: navigator.platform,
    hardwareConcurrency: navigator.hardwareConcurrency,
    deviceMemory: (navigator as any).deviceMemory,
    maxTouchPoints: navigator.maxTouchPoints,
    screen: {
      width: window.screen.width,
      height: window.screen.height,
      colorDepth: window.screen.colorDepth,
      pixelDepth: window.screen.pixelDepth,
    },
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    timestamp: Date.now(),
  };

  const fingerprint = JSON.stringify(data);

  // Utiliser SubtleCrypto pour le hash
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(fingerprint);
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

  return hashHex;
}

export default function SignupFreePage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [deviceFingerprint, setDeviceFingerprint] = useState<string | null>(null);

  // ========== INITIALISER LE DEVICE FINGERPRINT ==========
  useEffect(() => {
    generateClientDeviceFingerprint().then(fp => {
      setDeviceFingerprint(fp);
      // Stocker localement pour éviter de le régénérer
      localStorage.setItem('device-fp', fp);
    });
  }, []);

  const handleEmailChange = useCallback((value: string) => {
    setEmail(value);
    setError('');

    if (value.includes('@')) {
      const validation = validateEmailDomain(value);
      if (!validation.valid) {
        setEmailError(validation.error || '');
      } else {
        setEmailError('');
      }
    } else {
      setEmailError('');
    }
  }, []);

  const validateBeforeSubmit = (): boolean => {
    if (!email.trim()) {
      setError('Veuillez saisir votre email');
      return false;
    }

    const validation = validateEmailDomain(email);
    if (!validation.valid) {
      setEmailError(validation.error || 'Email invalide');
      setError(validation.error || 'Email invalide');
      return false;
    }

    return true;
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setEmailError('');

    if (!validateBeforeSubmit()) {
      return;
    }

    if (!deviceFingerprint) {
      setError('Erreur de sécurité. Veuillez rafraîchir la page.');
      return;
    }

    setLoading(true);

    try {
      const cleanEmail = sanitizeInput(email).toLowerCase().trim();

      const response = await fetch('/api/auth/signup-free', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: cleanEmail,
          deviceFingerprint: deviceFingerprint
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Une erreur est survenue');
        return;
      }

      router.push('/complete-profile');
    } catch (err) {
      console.error('Signup error:', err);
      setError('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = email.trim() && !emailError && !loading && deviceFingerprint !== null;

  return (
    <div className="signup-page-dark min-h-screen relative overflow-hidden bg-black">
      <style jsx>{`
        .signup-page-dark {
          background-color: #000000 !important;
          color: #ffffff !important;
        }
      `}</style>

      <div className="absolute inset-0">
        <div className="absolute top-0 -left-40 w-96 h-full bg-gradient-to-r from-transparent via-green-500/10 to-transparent blur-3xl"></div>
        <div className="absolute top-0 -right-40 w-96 h-full bg-gradient-to-l from-transparent via-emerald-500/10 to-transparent blur-3xl"></div>
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-to-b from-white/5 to-transparent rounded-full blur-3xl"></div>
      </div>

      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='grid' width='60' height='60' patternUnits='userSpaceOnUse'%3E%3Cpath d='M 60 0 L 0 0 0 60' fill='none' stroke='white' stroke-width='0.5' opacity='0.05'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23grid)'/%3E%3C/svg%3E")`
        }}
      ></div>

      <div className="relative z-10 flex flex-col justify-center min-h-screen py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex items-center justify-center p-3 rounded-xl bg-opacity-20">
            <img
              src="/img/logo_ecrit_blanc-point.png"
              alt="Logo Méthode ERPR"
              className="w-14 h-13 object-contain"
            />
          </div>

          <h2 className="mt-4 text-center text-3xl font-bold text-white">
            Méthode ERPR
          </h2>

          <h3 className="mt-2 text-center text-xl font-bold text-green-400">
        7 jours gratuits, puis tu décides !
          </h3>

          <p className="mt-3 text-center text-sm text-gray-400 max-w-sm">
            Rien n’est demandé après 7 jours : tu as simplement à tester la méthode gratuitement et à décider ensuite.
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
          <div className="relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-2xl blur opacity-30"></div>

            <div className="relative bg-gray-950/90 backdrop-blur-xl py-8 px-6 rounded-2xl border border-gray-800 sm:px-10">
              {error && (
                <div className="mb-6 p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
                  <p className="text-sm text-red-400">{error}</p>
                </div>
              )}

              <form onSubmit={handleSignup} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                    Adresse email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      disabled={loading || deviceFingerprint === null}
                      value={email}
                      onChange={(e) => handleEmailChange(e.target.value)}
                      className={`block w-full pl-10 pr-3 py-3 bg-gray-900/50 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${emailError ? 'border-red-500' : 'border-gray-800'
                        }`}
                      placeholder="votre@email.com"
                    />
                  </div>
                  {emailError && (
                    <p className="mt-2 text-sm text-red-500">{emailError}</p>
                  )}
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={!isFormValid}
                    className="relative group w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg text-sm font-medium text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-green-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Création du compte...
                      </>
                    ) : (
                      'Commencer mon essai gratuit'
                    )}
                  </button>
                </div>

                <div className="text-center">
                  <p className="text-sm text-gray-400">
                    Vous avez déjà un compte ?{' '}
                    <a
                      href="/login"
                      className="text-green-400 hover:text-green-300 transition-colors"
                    >
                      Se connecter
                    </a>
                  </p>
                </div>
              </form>
                  <p className="text-xs text-gray-500 mt-2 text-center">
                  En savoir plus sur la méthode ?{' '}
                  <a
                    href="https://arabeimportance.fr"
                    className="text-green-400 hover:text-green-300 transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    arabeimportance.fr
                  </a>
                </p>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-800"></div>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-gray-950 px-4 text-gray-500">Accès limité inclus</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 text-sm text-gray-400 space-y-3">
                <div className="flex items-start space-x-2">
                  <svg className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <p>Chapitre 1 sur les lettres de l’alphabet seules et attachées (8 leçons) + vidéo explicative</p>
                </div>
                 <div className="flex items-start space-x-2">
                  <svg className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <p>Bonus : Phase préparatoire avant la méthode</p>
                </div>

                <div className="flex items-start space-x-2">
                  <svg className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <p>Accès au tableau de bord, à la page notice et à la page des devoirs</p>
                </div>

                <div className="flex items-start space-x-2">
                  <svg className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <p>7 jours d'accès</p>
                </div>

                <div className="flex items-start space-x-2">
                  <svg className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <p>Aucun spam. Tu restes libre à 100 %</p>
                </div>
              </div>
              <div className="mt-6 text-center">
                <p className="text-xs text-gray-500">
                 Accès complet si tu le veux : {' '}
                  <a
                    href="/checkout"
                    className="text-green-400 hover:text-green-300 transition-colors"
                  >
                    Cliquez ici
                  </a>
                </p>


              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}