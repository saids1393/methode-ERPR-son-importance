//app/components/AutoProgressWrapper.tsx

'use client';

import { useRealtimeProgress } from '@/hooks/useRealtimeProgress';
import { useUserProgress } from '@/hooks/useUserProgress';
import RealtimeProgressIndicator from './RealtimeProgressIndicator';

interface AutoProgressWrapperProps {
  children: React.ReactNode;
  minTimeOnPage?: number;
}

export default function AutoProgressWrapper({ 
  children, 
  minTimeOnPage = 6000 
}: AutoProgressWrapperProps) {
  const { updateFromExternal } = useUserProgress();
  
  const {
    timeOnPage,
    isValidated,
    showCheckmark,
    canValidate,
    currentPageInfo
  } = useRealtimeProgress({
    minTimeOnPage,
    onProgressUpdate: (update) => {
      console.log('🎯 [WRAPPER] Mise à jour reçue:', update);
      
      // Mettre à jour les données de progression
      updateFromExternal({
        completedPages: update.completedPages,
        completedQuizzes: update.completedQuizzes
      });
    }
  });

  // Ne pas afficher l'indicateur si pas de page éligible
  if (!currentPageInfo) {
    return <>{children}</>;
  }

  return (
    <div className="relative">
      {children}
      
      {/* Indicateur de progression temps réel */}
      <RealtimeProgressIndicator
        timeOnPage={timeOnPage}
        isValidated={isValidated}
        showCheckmark={showCheckmark}
        canValidate={canValidate}
        minTime={minTimeOnPage}
      />
    </div>
  );
}