// app/checkout/page.tsx - Version avec 2 produits distincts

'use client';
import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function CheckoutPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [paymentPlan, setPaymentPlan] = useState<'1x' | '2x'>('1x');

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setError('Veuillez saisir votre email');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Vérifier si l'utilisateur existe déjà
      const checkResponse = await fetch('/api/auth/check-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      
      const checkData = await checkResponse.json();

      if (checkData.exists) {
        setError('Un compte existe déjà avec cet email. Veuillez vous connecter.');
        setTimeout(() => {
          window.location.href = `/login?email=${encodeURIComponent(email)}`;
        }, 2000);
        return;
      }

      // Créer la session selon le plan choisi
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email, 
          paymentPlan // '1x' ou '2x'
        })
      });

      const { sessionId, error: stripeError } = await response.json();

      if (stripeError) {
        setError(stripeError);
        return;
      }

      // Rediriger vers Stripe Checkout
      const stripe = await stripePromise;
      const { error: redirectError } = await stripe!.redirectToCheckout({
        sessionId
      });

      if (redirectError) {
        setError(redirectError.message || 'Erreur lors de la redirection');
      }
    } catch (err) {
      setError('Une erreur est survenue. Veuillez réessayer.');
      console.error('Checkout error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-page-dark min-h-screen relative overflow-hidden bg-black">
      <style jsx>{`
        .checkout-page-dark {
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
          {/* Logo avec image */}
          <div className="flex items-center justify-center p-3 rounded-xl bg-opacity-20">
            <img
              src="/img/logo_ecrit_blanc-point.png"
              alt="Logo Méthode ERPR"
              className="w-14 h-13 object-contain"
            />
          </div>

          {/* Titre principal */}
          <h2 className="mt-4 text-center text-3xl font-bold text-white">
            Méthode ERPR
          </h2>

          {/* Sous-titre centré */}
          <h3 className="mt-2 text-center text-xl font-bold text-white-900">
            Créer un compte
          </h3>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
          <div className="relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur opacity-30"></div>

            <div className="relative bg-gray-950/90 backdrop-blur-xl py-8 px-6 rounded-2xl border border-gray-800 sm:px-10">
              <form onSubmit={handleCheckout} className="space-y-6">
                {/* Email field */}
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
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full pl-10 pr-3 py-3 bg-gray-900/50 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200"
                      placeholder="votre@email.com"
                    />
                  </div>
                </div>

                {/* Payment plan selector */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Choisissez votre mode de paiement
                  </label>
                  <div className="space-y-3">
                    {/* Option 1x - Card style */}
                    <button
                      type="button"
                      onClick={() => setPaymentPlan('1x')}
                      className={`w-full p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                        paymentPlan === '1x'
                          ? 'border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/20'
                          : 'border-gray-800 bg-gray-900/50 hover:border-gray-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-2xl font-bold text-white">89€</span>
                            <span className="px-2 py-0.5 text-xs font-medium bg-green-500/20 text-green-400 rounded-full">
                              Recommandé
                            </span>
                          </div>
                          <p className="text-sm text-gray-400 mt-1">Paiement en 1 fois</p>
                          <p className="text-xs text-gray-500 mt-1">Accès immédiat complet</p>
                        </div>
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          paymentPlan === '1x' 
                            ? 'border-blue-500 bg-blue-500' 
                            : 'border-gray-600'
                        }`}>
                          {paymentPlan === '1x' && (
                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                      </div>
                    </button>

                    {/* Option 2x - Card style */}
                    <button
                      type="button"
                      onClick={() => setPaymentPlan('2x')}
                      className={`w-full p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                        paymentPlan === '2x'
                          ? 'border-purple-500 bg-purple-500/10 shadow-lg shadow-purple-500/20'
                          : 'border-gray-800 bg-gray-900/50 hover:border-gray-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-2xl font-bold text-white">2 × 44,50€</span>
                          </div>
                          <p className="text-sm text-gray-400 mt-1">Paiement en 2 fois</p>
                          <p className="text-xs text-gray-500 mt-1">
                            44,50€ aujourd'hui + 44,50€ dans 30 jours
                          </p>
                        </div>
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          paymentPlan === '2x' 
                            ? 'border-purple-500 bg-purple-500' 
                            : 'border-gray-600'
                        }`}>
                          {paymentPlan === '2x' && (
                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                      </div>
                    </button>
                  </div>
                  <p className="mt-3 text-xs text-center text-gray-500">
                    💳 Aucun frais supplémentaire pour le paiement en 2 fois
                  </p>
                </div>

                {/* Error message */}
                {error && (
                  <div className="text-red-500 text-sm text-center p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                    {error}
                  </div>
                )}

                {/* Checkout button */}
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
                    {loading ? 'Vérification...' : `Payer ${paymentPlan === '1x' ? '89€' : '44,50€ aujourd\'hui'}`}
                  </button>
                </div>

                {/* Login link */}
                <div className="text-center">
                  <p className="text-sm text-gray-400">
                    Vous avez déjà un compte ?{' '}
                    <a 
                      href="/login" 
                      className="text-blue-400 hover:text-blue-300 transition-colors"
                    >
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
              <div className="mt-8 flex justify-center space-x-8">
                <div className="flex flex-col items-center">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-900/50 border border-gray-800">
                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0110 1.944 11.954 11.954 0 0117.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="mt-2 text-xs text-gray-500">Sécurisé</span>
                </div>
              </div>

              {/* Features list */}
              <div className="mt-6 text-center text-xs text-gray-400 space-y-1">
                <p>✓ Accès immédiat après paiement</p>
                <p>✓ Méthode d'apprentissage de lecture et d'écriture</p>
                <p>✓ Support inclus</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}