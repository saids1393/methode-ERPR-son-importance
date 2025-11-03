'use client';

import { useEffect, useState } from 'react';
import { CheckCircle, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface RealtimeProgressIndicatorProps {
  timeOnPage: number;
  isValidated: boolean;
  showCheckmark: boolean;
  canValidate: boolean;
  minTime?: number;
}

export default function RealtimeProgressIndicator({
  timeOnPage,
  isValidated,
  showCheckmark,
  canValidate,
  minTime = 6000
}: RealtimeProgressIndicatorProps) {
  const [progress, setProgress] = useState(0);
  const [showValidationMessage, setShowValidationMessage] = useState(false);

  useEffect(() => {
    const progressPercent = Math.min((timeOnPage / minTime) * 100, 100);
    setProgress(progressPercent);
  }, [timeOnPage, minTime]);

  // 👉 Quand isValidated devient true, on affiche le message 3 secondes
  useEffect(() => {
    if (isValidated) {
      setShowValidationMessage(true);
      const timer = setTimeout(() => {
        setShowValidationMessage(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isValidated]);

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    return `${seconds}s`;
  };

  return (
    <div className="fixed top-4 left-4 z-50">
      <AnimatePresence mode="wait">
        {/* Indicateur de progression */}
        {!isValidated && timeOnPage > 1000 && (
          <motion.div
            key="progress-indicator"
            initial={{ opacity: 0, scale: 0.8, x: -20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.8, x: -20 }}
            className="bg-blue-900/95 backdrop-blur-sm border border-blue-500/30 rounded-xl p-4 shadow-2xl"
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <Clock className="h-7 w-7 text-blue-400" />
                {canValidate && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                )}
              </div>

              <div className="min-w-0">
                <div className="text-white text-sm font-medium">
                  {canValidate ? 'Prêt pour validation !' : 'Temps sur la page'}
                </div>
                <div className="text-blue-300 text-xs font-mono">
                  {formatTime(timeOnPage)} / {formatTime(minTime)}
                </div>
              </div>
            </div>

            <div className="mt-3 w-48 bg-blue-800/50 rounded-full h-2">
              <motion.div
                className={`h-2 rounded-full transition-colors duration-300 ${
                  canValidate
                    ? 'bg-gradient-to-r from-green-400 to-green-500'
                    : 'bg-gradient-to-r from-blue-400 to-blue-500'
                }`}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>

            {canValidate && (
              <div className="mt-2 text-green-300 text-xs text-center animate-pulse">
                Validation automatique en cours...
              </div>
            )}
          </motion.div>
        )}

        {/* Message de validation temporaire (3 secondes) */}
        {showValidationMessage && (
          <motion.div
            key="checkmark-indicator"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.4 }}
            className="bg-green-900/95 backdrop-blur-sm border border-green-500/30 rounded-xl p-4 shadow-2xl"
          >
            <div className="flex items-center gap-3">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              >
                <CheckCircle className="h-8 w-8 text-green-400" />
              </motion.div>

              <div>
                <div className="text-white text-sm font-bold">
                  Progression enregistrée
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
