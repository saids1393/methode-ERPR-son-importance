'use client';

import { useRouter } from 'next/navigation';
import { X, BookOpen, Crown, CheckCircle } from 'lucide-react';
import { useState, useEffect } from 'react';

interface SubscriptionRequiredModalProps {
  isOpen: boolean;
  onClose: () => void;
  contentName?: string;
}

// Garder le même nom d'export pour la compatibilité
export default function FreeTrialRestrictionModal({
  isOpen,
  onClose,
  contentName = 'ce contenu'
}: SubscriptionRequiredModalProps) {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string>('');

  useEffect(() => {
    const fetchUserEmail = async () => {
      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const data = await response.json();
          if (data.user?.email) {
            setUserEmail(data.user.email);
          }
        }
      } catch (error) {
        console.error('Error fetching user email:', error);
      }
    };

    if (isOpen) {
      fetchUserEmail();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubscribe = (plan: 'solo' | 'coaching') => {
    const url = userEmail 
      ? `/checkout?email=${encodeURIComponent(userEmail)}&plan=${plan}`
      : `/checkout?plan=${plan}`;
    router.push(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative bg-gray-900 rounded-2xl shadow-2xl max-w-lg w-full border border-gray-800">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          aria-label="Fermer"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="p-8">
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 rounded-full bg-yellow-900/20 border border-yellow-500/30">
            <svg
              className="w-8 h-8 text-yellow-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>

          <h3 className="text-2xl font-bold text-white text-center mb-3">
            Abonnement requis
          </h3>

          <p className="text-gray-300 text-center mb-6">
            L'accès à "{contentName}" nécessite un abonnement actif.
          </p>

          {/* Options d'abonnement */}
          <div className="space-y-4 mb-6">
            {/* Plan Solo */}
            <button
              onClick={() => handleSubscribe('solo')}
              className="w-full p-4 rounded-xl border-2 border-blue-500/30 bg-blue-500/10 hover:border-blue-500/60 transition-all text-left group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-500/20">
                    <BookOpen className="h-5 w-5 text-blue-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white">Plan Solo</h4>
                    <p className="text-sm text-gray-400">Accès aux cours</p>
                  </div>
                </div>
                <span className="text-xl font-bold text-white">10€<span className="text-sm text-gray-400">/mois</span></span>
              </div>
            </button>

            {/* Plan Coaching */}
            <button
              onClick={() => handleSubscribe('coaching')}
              className="w-full p-4 rounded-xl border-2 border-purple-500/30 bg-purple-500/10 hover:border-purple-500/60 transition-all text-left group relative"
            >
              <div className="absolute -top-2 left-1/2 -translate-x-1/2">
                <span className="px-2 py-0.5 text-xs font-semibold bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full">
                  Recommandé
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-purple-500/20">
                    <Crown className="h-5 w-5 text-purple-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white">Plan Coaching</h4>
                    <p className="text-sm text-gray-400">Cours + accompagnement</p>
                  </div>
                </div>
                <span className="text-xl font-bold text-white">30€<span className="text-sm text-gray-400">/mois</span></span>
              </div>
            </button>
          </div>

          {/* Avantages */}
          <div className="bg-gray-800/50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-300 text-center mb-3">
              Avec votre abonnement :
            </p>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span>Accès aux modules Lecture & Tajwid</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span>Vidéos, quiz et exercices illimités</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span>Sans engagement - annulez à tout moment</span>
              </li>
            </ul>
          </div>

          <button
            onClick={onClose}
            className="w-full py-3 px-6 bg-gray-800 hover:bg-gray-700 text-gray-300 font-medium rounded-lg transition-colors"
          >
            Retour
          </button>
        </div>
      </div>
    </div>
  );
}
