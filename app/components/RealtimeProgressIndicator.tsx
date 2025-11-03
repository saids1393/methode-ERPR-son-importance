'use client';

import { useEffect, useState, useRef } from 'react';
import { CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface RealtimeProgressIndicatorProps {
  /** Affiche le message quand la validation passe à true */
  isValidated: boolean;
}

export default function RealtimeProgressIndicator({
  isValidated,
}: RealtimeProgressIndicatorProps) {
  const [showValidationMessage, setShowValidationMessage] = useState(false);
  const previousIsValidatedRef = useRef(false);

  // 🧩 Affiche le message de validation une seule fois à chaque passage false -> true
  useEffect(() => {
    if (isValidated && !previousIsValidatedRef.current) {
      previousIsValidatedRef.current = true;
      setShowValidationMessage(true);

      // ⏱️ Le message reste environ 4 secondes visibles (animations incluses)
      const timer = setTimeout(() => {
        setShowValidationMessage(false);
      }, 2500); // 2.5 s visibles + 1 s animations = ~4 s totales

      return () => clearTimeout(timer);
    }

    // Réinitialise si la validation repasse à false
    if (!isValidated) {
      previousIsValidatedRef.current = false;
    }
  }, [isValidated]);

  return (
    <div className="fixed top-4 left-4 z-50">
      {showValidationMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="bg-green-900/95 backdrop-blur-sm border border-green-500/30 rounded-xl p-4 shadow-2xl"
        >
          <div className="flex items-center gap-3">
            <CheckCircle className="h-8 w-8 text-green-400" />
            <div className="text-white text-sm font-bold">
              Progression enregistrée
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
