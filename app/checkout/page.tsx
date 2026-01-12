'use client';
import { useState, useCallback, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { BookOpen, CheckCircle, Crown, Zap } from 'lucide-react';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

// --- CONFIGURATION DE SÉCURITÉ ---

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
  return input.trim().slice(0, 255).replace(/[<>\"']/g, '');
}

type PlanType = 'SOLO' | 'COACHING';

interface PlanInfo {
  id: PlanType;
  name: string;
  price: number;
  description: string;
  features: string[];
  popular?: boolean;
  icon: React.ReactNode;
  color: string;
}

const PLANS: PlanInfo[] = [
  {
    id: 'SOLO',
    name: 'Plan Solo',
    price: 10,
    description: 'Accès complet aux cours',
    icon: <BookOpen className="h-6 w-6" />,
    color: 'blue',
    features: [
      'Accès au module Lecture & Écriture',
      'Accès au module Tajwid',
      'Vidéos de cours illimitées',
      'Quiz interactifs',
      'Suivi de progression',
      'Devoirs à rendre'
    ]
  },
  {
    id: 'COACHING',
    name: 'Plan Coaching',
    price: 30,
    description: 'Cours + accompagnement personnalisé',
    icon: <Crown className="h-6 w-6" />,
    color: 'purple',
    popular: true,
    features: [
      'Tout le Plan Solo inclus',
      'Correction personnalisée des devoirs',
      'Sessions de coaching individuel',
      'Support prioritaire par WhatsApp',
      'Conseils personnalisés du professeur',
      'Suivi hebdomadaire de progression'
    ]
  }
];

export default function CheckoutPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [selectedPlan, setSelectedPlan] = useState<PlanType>('SOLO');
  const [isEmailLocked, setIsEmailLocked] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const emailParam = params.get('email');
      const planParam = params.get('plan')?.toUpperCase();
      
      if (emailParam) {
        setEmail(emailParam);
        setIsEmailLocked(true);
      }
      
      if (planParam === 'SOLO' || planParam === 'COACHING') {
        setSelectedPlan(planParam);
      }
    }
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

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setEmailError('');

    if (!validateBeforeSubmit()) {
      return;
    }

    setLoading(true);

    try {
      const cleanEmail = sanitizeInput(email).toLowerCase().trim();

      const checkResponse = await fetch('/api/auth/check-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail })
      });

      const checkData = await checkResponse.json();

      if (checkData.error) {
        setError(checkData.error || 'Erreur de validation');
        setEmailError(checkData.error || 'Erreur de validation');
        return;
      }

      if (checkData.exists) {
        setError('Un compte existe déjà avec cet email. Veuillez vous connecter.');
        setTimeout(() => {
          window.location.href = `/login?email=${encodeURIComponent(cleanEmail)}`;
        }, 2000);
        return;
      }

      const response = await fetch('/api/stripe/create-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: cleanEmail,
          plan: selectedPlan
        })
      });

      const { sessionId, error: stripeError } = await response.json();

      if (stripeError) {
        setError(stripeError || 'Erreur lors de la création de la session');
        return;
      }

      const stripe = await stripePromise;
      const { error: redirectError } = await stripe!.redirectToCheckout({
        sessionId
      });

      if (redirectError) {
        setError(redirectError.message || 'Erreur lors de la redirection');
      }
    } catch (err) {
      console.error('Checkout error:', err);
      setError('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = email.trim() && !emailError && !loading;
  const currentPlan = PLANS.find(p => p.id === selectedPlan)!;

  return (
    <div className="checkout-page-dark min-h-screen relative overflow-hidden bg-black">
      <style jsx>{`
        .checkout-page-dark {
          background-color: #000000 !important;
          color: #ffffff !important;
        }
      `}</style>

      {/* Light effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 -left-40 w-96 h-full bg-gradient-to-r from-transparent via-blue-500/10 to-transparent blur-3xl"></div>
        <div className="absolute top-0 -right-40 w-96 h-full bg-gradient-to-l from-transparent via-purple-500/10 to-transparent blur-3xl"></div>
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-to-b from-white/5 to-transparent rounded-full blur-3xl"></div>
      </div>

      {/* Grid pattern */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='grid' width='60' height='60' patternUnits='userSpaceOnUse'%3E%3Cpath d='M 60 0 L 0 0 0 60' fill='none' stroke='white' stroke-width='0.5' opacity='0.05'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23grid)'/%3E%3C/svg%3E")`
        }}
      ></div>

      <div className="relative z-10 flex flex-col justify-center min-h-screen py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center sm:mx-auto sm:w-full max-w-5xl">
          {/* Logo */}
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

          <h3 className="mt-2 text-center text-xl font-medium text-gray-300">
            Choisissez votre abonnement
          </h3>

          <p className="mt-2 text-center text-sm text-gray-400 max-w-md">
            Accédez aux modules <span className="text-blue-400 font-medium">Lecture</span> et <span className="text-purple-400 font-medium">Tajwid</span> avec l'abonnement de votre choix
          </p>

          {/* Plans */}
          <div className="mt-10 w-full px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
              {PLANS.map((plan) => (
                <button
                  key={plan.id}
                  onClick={() => setSelectedPlan(plan.id)}
                  className={`group relative p-6 rounded-2xl border-2 transition-all duration-300 text-left ${
                    selectedPlan === plan.id
                      ? plan.color === 'purple'
                        ? 'border-purple-500 bg-purple-500/10 shadow-lg shadow-purple-500/20'
                        : 'border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/20'
                      : 'border-gray-800 bg-gray-950/90 hover:border-gray-700'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="px-3 py-1 text-xs font-semibold bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full">
                        Recommandé
                      </span>
                    </div>
                  )}
                  
                  <div className="relative space-y-4">
                    <div className="flex items-center gap-3">
                      <div className={`flex items-center justify-center w-12 h-12 rounded-lg ${
                        plan.color === 'purple' ? 'bg-purple-500/20' : 'bg-blue-500/20'
                      }`}>
                        <span className={plan.color === 'purple' ? 'text-purple-400' : 'text-blue-400'}>
                          {plan.icon}
                        </span>
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-white">{plan.name}</h4>
                        <p className="text-sm text-gray-400">{plan.description}</p>
                      </div>
                    </div>

                    <div className="pt-2">
                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-bold text-white">{plan.price}€</span>
                        <span className="text-gray-400">/mois</span>
                      </div>
                    </div>

                    <ul className="space-y-2 pt-4 border-t border-gray-800">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle className={`h-5 w-5 mt-0.5 flex-shrink-0 ${
                            plan.color === 'purple' ? 'text-purple-400' : 'text-blue-400'
                          }`} />
                          <span className="text-sm text-gray-300">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="flex justify-center pt-4">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        selectedPlan === plan.id
                          ? plan.color === 'purple'
                            ? 'border-purple-500 bg-purple-500'
                            : 'border-blue-500 bg-blue-500'
                          : 'border-gray-600'
                      }`}>
                        {selectedPlan === plan.id && (
                          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Formulaire */}
          <div className="mt-10 w-full max-w-md px-4">
            <div className="relative">
              <div className={`absolute -inset-0.5 bg-gradient-to-r rounded-2xl blur opacity-30 ${
                selectedPlan === 'COACHING' 
                  ? 'from-purple-500/20 to-pink-500/20' 
                  : 'from-blue-500/20 to-cyan-500/20'
              }`}></div>

              <div className="relative bg-gray-950/90 backdrop-blur-xl py-8 px-6 rounded-2xl border border-gray-800 sm:px-10">
                {error && (
                  <div className="mb-6 p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
                    <p className="text-sm text-red-400">{error}</p>
                  </div>
                )}

                <form onSubmit={handleCheckout} className="space-y-6">
                  {/* Récap plan */}
                  <div className={`p-4 rounded-lg border ${
                    selectedPlan === 'COACHING'
                      ? 'bg-purple-500/10 border-purple-500/30'
                      : 'bg-blue-500/10 border-blue-500/30'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {currentPlan.icon}
                        <span className="font-medium text-white">{currentPlan.name}</span>
                      </div>
                      <span className="text-xl font-bold text-white">{currentPlan.price}€/mois</span>
                    </div>
                  </div>

                  {/* Email */}
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
                        disabled={loading || isEmailLocked}
                        value={email}
                        onChange={(e) => handleEmailChange(e.target.value)}
                        className={`block w-full pl-10 pr-3 py-3 bg-gray-900/50 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                          emailError ? 'border-red-500' : 'border-gray-800'
                        }`}
                        placeholder="votre@email.com"
                      />
                      {isEmailLocked && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          <svg className="h-5 w-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                    {emailError && (
                      <p className="mt-2 text-sm text-red-500">{emailError}</p>
                    )}
                  </div>

                  {/* Submit */}
                  <div>
                    <button
                      type="submit"
                      disabled={!isFormValid}
                      className={`relative group w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg text-sm font-medium text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                        selectedPlan === 'COACHING'
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500'
                          : 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500'
                      } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-500`}
                    >
                      {loading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Vérification...
                        </>
                      ) : (
                        <>
                          <Zap className="h-5 w-5 mr-2" />
                          S'abonner - {currentPlan.price}€/mois
                        </>
                      )}
                    </button>
                  </div>

                  <div className="text-center">
                    <p className="text-sm text-gray-400">
                      Vous avez déjà un compte ?{' '}
                      <a href="/login" className="text-blue-400 hover:text-blue-300 transition-colors">
                        Se connecter
                      </a>
                    </p>
                  </div>
                </form>

                {/* Separator */}
                <div className="mt-6">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-800"></div>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-gray-950 px-4 text-gray-500">Paiement sécurisé par Stripe</span>
                    </div>
                  </div>
                </div>

                {/* Trust indicators */}
                <div className="mt-6 flex justify-center space-x-8">
                  <div className="flex flex-col items-center">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-900/50 border border-gray-800">
                      <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0110 1.944 11.954 11.954 0 0117.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="mt-2 text-xs text-gray-500">Sécurisé</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-900/50 border border-gray-800">
                      <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4z"/>
                        <path fillRule="evenodd" d="M8 10a2 2 0 002-2V4a2 2 0 012 2v4a2 2 0 01-2 2H8z" clipRule="evenodd"/>
                      </svg>
                    </div>
                    <span className="mt-2 text-xs text-gray-500">Sans engagement</span>
                  </div>
                </div>

                <div className="mt-6 text-center text-xs text-gray-400 space-y-1">
                  <p>✓ Accès immédiat après paiement</p>
                  <p>✓ Annulez à tout moment</p>
                  <p>✓ Accès aux 2 modules inclus</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
