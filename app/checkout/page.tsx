'use client';
import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { BookOpen, CheckCircle, Crown, Users, ArrowRight, Mail, X } from 'lucide-react';
import Link from 'next/link';
import LandingHeader from '@/app/components/LandingHeader';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

type PlanType = 'SOLO' | 'COACHING';

interface PlanInfo {
  id: PlanType;
  name: string;
  price: number;
  description: string;
  features: string[];
  popular?: boolean;
  icon: React.ReactNode;
}

const PLANS: PlanInfo[] = [
  {
    id: 'SOLO',
    name: 'Solo',
    price: 10,
    description: 'Accès complet aux cours',
    icon: <BookOpen className="h-6 w-6" />,
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
    name: 'Coaching',
    price: 30,
    description: 'Cours + accompagnement personnalisé',
    icon: <Crown className="h-6 w-6" />,
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
  const [loadingPlan, setLoadingPlan] = useState<PlanType | null>(null);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PlanType | null>(null);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [checkingEmail, setCheckingEmail] = useState(false);

  // Vérifier si l'email existe déjà
  const checkEmailExists = async (emailToCheck: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/check-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailToCheck })
      });
      const data = await response.json();
      return data.exists === true;
    } catch {
      return false;
    }
  };

  const handleEmailChange = async (value: string) => {
    setEmail(value);
    setEmailError('');
    
    // Validation basique
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (value && !emailRegex.test(value)) {
      setEmailError('Format email invalide');
      return;
    }

    // Vérifier si l'email existe (avec debounce implicite)
    if (value && emailRegex.test(value)) {
      setCheckingEmail(true);
      const exists = await checkEmailExists(value);
      setCheckingEmail(false);
      
      if (exists) {
        setEmailError('Cet email est déjà inscrit. Connectez-vous à votre compte.');
      }
    }
  };

  const handleSelectPlan = (plan: PlanType) => {
    setSelectedPlan(plan);
    setEmail('');
    setEmailError('');
    setError('');
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPlan(null);
    setEmail('');
    setEmailError('');
  };

  const handleCheckout = async () => {
    if (!selectedPlan || !email) return;
    
    // Vérification finale de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError('Format email invalide');
      return;
    }

    // Vérifier une dernière fois si l'email existe
    setCheckingEmail(true);
    const exists = await checkEmailExists(email);
    setCheckingEmail(false);
    
    if (exists) {
      setEmailError('Cet email est déjà inscrit. Connectez-vous à votre compte.');
      return;
    }

    setError('');
    setLoadingPlan(selectedPlan);

    try {
      const response = await fetch('/api/stripe/create-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: selectedPlan, email })
      });

      const { sessionId, error: stripeError } = await response.json();

      if (stripeError) {
        setError(stripeError || 'Erreur lors de la création de la session');
        setLoadingPlan(null);
        return;
      }

      const stripe = await stripePromise;
      const { error: redirectError } = await stripe!.redirectToCheckout({
        sessionId
      });

      if (redirectError) {
        setError(redirectError.message || 'Erreur lors de la redirection');
        setLoadingPlan(null);
      }
    } catch (err) {
      console.error('Checkout error:', err);
      setError('Une erreur est survenue. Veuillez réessayer.');
      setLoadingPlan(null);
    }
  };

  const isFormValid = email && !emailError && !checkingEmail;
  const currentPlan = PLANS.find(p => p.id === selectedPlan);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <LandingHeader showLogin={true} showRegister={false} />

      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Titre */}
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Choisissez votre abonnement
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Accédez aux modules <span className="text-blue-600 font-medium">Lecture</span> et <span className="text-blue-600 font-medium">Tajwid</span> avec l'abonnement de votre choix
            </p>
          </div>

          {/* Plans */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {PLANS.map((plan) => (
              <div
                key={plan.id}
                className={`relative bg-white rounded-2xl border-2 transition-all duration-300 overflow-hidden ${
                  plan.popular
                    ? 'border-blue-600 shadow-xl shadow-blue-600/10'
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-lg'
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-0 right-0 bg-blue-600 text-white text-center py-2 text-sm font-semibold">
                    ⭐ Recommandé
                  </div>
                )}
                
                <div className={`p-8 ${plan.popular ? 'pt-14' : ''}`}>
                  {/* Header du plan */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                      <span className="text-blue-600">
                        {plan.id === 'SOLO' ? <BookOpen className="h-6 w-6" /> : <Users className="h-6 w-6" />}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                      <p className="text-sm text-gray-500">{plan.description}</p>
                    </div>
                  </div>

                  {/* Prix */}
                  <div className="mb-6">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold text-gray-900">{plan.price}€</span>
                      <span className="text-gray-500">/mois</span>
                    </div>
                  </div>

                  {/* Features */}
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Bouton S'abonner */}
                  <button
                    onClick={() => handleSelectPlan(plan.id)}
                    className={`w-full flex justify-center items-center py-4 px-6 rounded-xl text-base font-semibold transition-all duration-200 ${
                      plan.popular
                        ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/25'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    }`}
                  >
                    S'abonner - {plan.price}€/mois
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Lien connexion */}
          <div className="text-center mt-8">
            <p className="text-gray-600">
              Vous avez déjà un compte ?{' '}
              <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                Se connecter
              </Link>
            </p>
          </div>

          {/* Trust indicators */}
          <div className="max-w-2xl mx-auto mt-12">
            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0110 1.944 11.954 11.954 0 0117.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Paiement sécurisé par Stripe</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Accès immédiat</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v11a3 3 0 106 0V4a2 2 0 00-2-2H4zm1 14a1 1 0 100-2 1 1 0 000 2zm5-1.757l4.9-4.9a2 2 0 000-2.828L13.485 5.1a2 2 0 00-2.828 0L10 5.757v8.486zM16 18H9.071l6-6H16a2 2 0 012 2v2a2 2 0 01-2 2z" clipRule="evenodd" />
                </svg>
                <span>Sans engagement</span>
              </div>
            </div>
            <p className="text-center text-xs text-gray-400 mt-4">
              Annulez à tout moment depuis votre espace membre
            </p>
          </div>
        </div>
      </div>

      {/* Modal Email */}
      {showModal && currentPlan && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Overlay */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={handleCloseModal}
          />
          
          {/* Modal Content */}
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 sm:p-8 animate-in fade-in zoom-in duration-200">
            {/* Close button */}
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Plan sélectionné */}
            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-100">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                {currentPlan.id === 'SOLO' ? (
                  <BookOpen className="h-6 w-6 text-blue-600" />
                ) : (
                  <Users className="h-6 w-6 text-blue-600" />
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900">Plan {currentPlan.name}</h3>
                <p className="text-sm text-gray-500">{currentPlan.description}</p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold text-gray-900">{currentPlan.price}€</span>
                <span className="text-sm text-gray-500">/mois</span>
              </div>
            </div>

            {/* Titre */}
            <h2 className="text-xl font-bold text-gray-900 mb-2 text-center">
              Entrez votre email
            </h2>
            <p className="text-sm text-gray-500 text-center mb-6">
              Pour créer votre compte et accéder aux cours
            </p>

            {/* Erreur globale */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-sm text-red-600 text-center">{error}</p>
              </div>
            )}

            {/* Champ Email */}
            <div className="mb-6">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Adresse email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  autoFocus
                  required
                  value={email}
                  onChange={(e) => handleEmailChange(e.target.value)}
                  className={`block w-full pl-10 pr-10 py-3 bg-gray-50 border rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    emailError ? 'border-red-300 bg-red-50' : 'border-gray-200'
                  }`}
                  placeholder="votre@email.com"
                />
                {checkingEmail && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <svg className="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </div>
                )}
              </div>
              {emailError && (
                <p className="mt-2 text-sm text-red-500">{emailError}</p>
              )}
              {emailError && emailError.includes('Connectez-vous') && (
                <Link 
                  href="/login" 
                  className="mt-2 inline-flex items-center text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  → Aller à la page de connexion
                </Link>
              )}
            </div>

            {/* Bouton Continuer */}
            <button
              onClick={handleCheckout}
              disabled={!isFormValid || loadingPlan !== null}
              className="w-full flex justify-center items-center py-4 px-6 rounded-xl text-base font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-600/25"
            >
              {loadingPlan ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Redirection vers le paiement...
                </>
              ) : (
                <>
                  Continuer vers le paiement
                  <ArrowRight className="h-5 w-5 ml-2" />
                </>
              )}
            </button>

            {/* Note sécurité */}
            <p className="mt-4 text-xs text-gray-400 text-center">
              🔒 Paiement sécurisé par Stripe
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
