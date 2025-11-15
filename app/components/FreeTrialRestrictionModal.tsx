'use client';

import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';
import { useState, useEffect } from 'react';

interface FreeTrialRestrictionModalProps {
  isOpen: boolean;
  onClose: () => void;
  contentName?: string;
}

export default function FreeTrialRestrictionModal({
  isOpen,
  onClose,
  contentName = 'ce contenu'
}: FreeTrialRestrictionModalProps) {
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

  const handleUpgrade = () => {
    if (userEmail) {
      router.push(`/checkout?email=${encodeURIComponent(userEmail)}`);
    } else {
      router.push('/checkout');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full border border-gray-800">
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
            Accès premium requis
          </h3>

          <p className="text-gray-300 text-center mb-2">
            L'accès "{contentName}" est réservé aux membres premium.
          </p>

          <div className="bg-gray-800/50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-300 text-center mb-3">
              Débloquez tout avec l’accès premium :
            </p>

            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Déblocage de tous les chapitres</span>
              </li>

              <li className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Suivi & accompagnement A → Z + suivi de vos progressions</span>
              </li>

              <li className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Corrections de tous vos devoirs (dès le chapitre 2)</span>
              </li>

              <li className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Paiement possible en 2x + code promo <b>ERPR15</b></span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={handleUpgrade}
              className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105"
            >
              Accédez à l'offre premium
            </button>

            <button
              onClick={onClose}
              className="w-full py-3 px-6 bg-gray-800 hover:bg-gray-700 text-gray-300 font-medium rounded-lg transition-colors"
            >
              Retour
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
