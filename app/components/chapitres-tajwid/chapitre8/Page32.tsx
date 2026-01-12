'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle, Award, BookOpen, Play, Pause, Volume2, Loader2, ChevronDown } from 'lucide-react';
import PageNavigation from '@/app/components/PageNavigation';

// Mapping audio pour la correction et récitation parfaite
const chapter8Page36AudioMappings: Record<string, string> = {
  'بِسْمِ اللهِ': 'bismillah',
  'الرَّحْمٰنِ الرَّحِيمِ': 'ar_rahman_rahim',
  'الْحَمْدُ لِلّٰهِ': 'alhamdulillah',
  'رَبِّ الْعَالَمِينَ': 'rabb_alamin',
  'مَالِكِ يَوْمِ الدِّينِ': 'maliki_yawm',
  'إِيَّاكَ نَعْبُدُ': 'iyyaka_nabudu',
  'وَإِيَّاكَ نَسْتَعِينُ': 'wa_iyyaka',
  'اِهْدِنَا الصِّرَاطَ': 'ihdinas_sirat'
};

const Cell = ({
  letter,
  title,
  description,
  color,
  onClick,
  isActive
}: {
  letter: string;
  title: string;
  description: string;
  color: 'red' | 'purple' | 'amber' | 'blue' | 'green';
  onClick?: () => void;
  isActive?: boolean;
}) => {
  const colorClasses: Record<typeof color, string> = {
    red: 'text-red-400',
    purple: 'text-purple-400',
    amber: 'text-amber-400',
    blue: 'text-blue-400',
    green: 'text-green-400'
  };

  return (
    <div
      className={`border border-zinc-500 rounded-xl p-3 md:p-4 lg:p-5 text-center min-h-[120px] md:min-h-[130px] lg:min-h-[140px] flex flex-col justify-center items-center hover:bg-zinc-700 transition-all duration-300 hover:scale-105 cursor-pointer mx-1 ${
        isActive ? 'pulse-active' : ''
      }`}
      onClick={onClick}
    >
      <div
        className={`text-3xl md:text-4xl lg:text-4xl xl:text-5xl font-bold transition-colors leading-tight ${
          colorClasses[color]
        }`}
      >
        {letter}
      </div>
      <div className="text-white text-sm md:text-base font-semibold mt-2">{title}</div>
      <div className="text-gray-300 text-xs md:text-sm mt-1">{description}</div>
    </div>
  );
};

const IntroductionPage = () => {
  return (
    <div className="p-4 md:p-8 bg-gray-900">
      <div className="w-full bg-gray-800 rounded-lg p-6 md:p-8">
        <div className="text-white space-y-6 text-lg md:text-xl leading-relaxed">
          <h2 className="text-3xl font-bold text-green-400 mb-4">Correction et Récitation Parfaite</h2>

          <p>
            Félicitations ! Vous avez terminé le module Tajwid. Cette dernière leçon résume les
            <span className="text-green-300 font-semibold"> méthodes de correction</span> et les
            <span className="text-green-300 font-semibold"> objectifs</span> d'une récitation parfaite.
          </p>

          <div className="bg-green-900/30 border border-green-500/50 rounded-lg p-4 md:p-6 my-6">
            <div className="flex items-center gap-2 mb-3">
              <Award className="text-green-400 w-6 h-6" />
              <span className="font-semibold text-green-200">Objectifs atteints :</span>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <CheckCircle className="text-green-400 w-5 h-5 flex-shrink-0" />
                <span>Éviter les erreurs majeures (لحن جلي)</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="text-green-400 w-5 h-5 flex-shrink-0" />
                <span>Minimiser les erreurs mineures (لحن خفي)</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="text-green-400 w-5 h-5 flex-shrink-0" />
                <span>Appliquer les règles de Tajwid correctement</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="text-green-400 w-5 h-5 flex-shrink-0" />
                <span>Réciter avec beauté et harmonie</span>
              </div>
            </div>
          </div>

          <div className="bg-blue-900/30 border border-blue-500/50 rounded-lg p-4 my-6">
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="text-blue-400 w-6 h-6" />
              <span className="font-semibold text-blue-200">Méthode ERPR :</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
              <div className="bg-blue-800/30 rounded-lg p-3">
                <p className="text-blue-300 font-bold">É</p>
                <p className="text-sm text-gray-300">Écoute</p>
              </div>
              <div className="bg-blue-800/30 rounded-lg p-3">
                <p className="text-blue-300 font-bold">R</p>
                <p className="text-sm text-gray-300">Répétition</p>
              </div>
              <div className="bg-blue-800/30 rounded-lg p-3">
                <p className="text-blue-300 font-bold">P</p>
                <p className="text-sm text-gray-300">Pratique</p>
              </div>
              <div className="bg-blue-800/30 rounded-lg p-3">
                <p className="text-blue-300 font-bold">R</p>
                <p className="text-sm text-gray-300">Régularité</p>
              </div>
            </div>
          </div>

          <p>À la page suivante : récitez Al-Fatiha avec toutes les règles apprises.</p>
        </div>
      </div>

      <div className="px-4 md:px-8">
        <PageNavigation currentChapter={8} currentPage={32} module="TAJWID" className="mt-6 mb-4" />
      </div>

      <footer className="border-t-1 text-white text-center p-4 md:p-6 mt-8 flex-shrink-0 font-semibold text-base md:text-lg">
        <div>Chapitre 8 - Page 32</div>
        <div className="mt-1">© 2025 Tous droits réservés</div>
      </footer>
    </div>
  );
};

const RulesPage = ({
  playRuleAudio,
  activeIndex
}: {
  playRuleAudio: (ruleKey: string, index?: number) => void;
  activeIndex: number;
}) => {
  const items = [
    { letter: 'بِسْمِ اللهِ', title: 'Bismi-llâhi', description: 'Lâm fine', audioKey: 'بِسْمِ اللهِ', color: 'green' as const },
    { letter: 'الرَّحْمٰنِ الرَّحِيمِ', title: 'Ar-Rahmâni...', description: 'Madd + kasra', audioKey: 'الرَّحْمٰنِ الرَّحِيمِ', color: 'green' as const },
    { letter: 'الْحَمْدُ لِلّٰهِ', title: 'Al-Hamdu li-llâhi', description: 'Lâm fine', audioKey: 'الْحَمْدُ لِلّٰهِ', color: 'blue' as const },
    { letter: 'رَبِّ الْعَالَمِينَ', title: 'Rabbi-l\'âlamîna', description: 'Idghâm', audioKey: 'رَبِّ الْعَالَمِينَ', color: 'blue' as const },
    { letter: 'مَالِكِ يَوْمِ', title: 'Mâliki yawmi', description: 'Madd', audioKey: 'مَالِكِ يَوْمِ الدِّينِ', color: 'purple' as const },
    { letter: 'إِيَّاكَ نَعْبُدُ', title: 'Iyyâka na\'budu', description: 'Fat-ha', audioKey: 'إِيَّاكَ نَعْبُدُ', color: 'purple' as const },
    { letter: 'وَإِيَّاكَ نَسْتَعِينُ', title: 'Wa iyyâka...', description: 'Damma', audioKey: 'وَإِيَّاكَ نَسْتَعِينُ', color: 'amber' as const },
    { letter: 'اِهْدِنَا الصِّرَاطَ', title: 'Ihdina-s-sirâta', description: 'ص emphatique', audioKey: 'اِهْدِنَا الصِّرَاطَ', color: 'amber' as const }
  ];

  return (
    <div className="p-2 md:p-4 lg:p-8 bg-gray-900">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-3 md:gap-4 lg:gap-5 mb-6">
        {items.map((item, index) => (
          <Cell
            key={item.audioKey}
            letter={item.letter}
            title={item.title}
            description={item.description}
            color={item.color}
            isActive={activeIndex === index}
            onClick={() => playRuleAudio(item.audioKey, index)}
          />
        ))}
      </div>

      <div className="bg-gray-800 rounded-lg p-4 md:p-6 mb-6">
        <div className="text-white space-y-4">
          <h3 className="text-xl md:text-2xl font-bold text-green-300">🎯 Récapitulatif du module Tajwid</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-green-900/30 border border-green-500/30 rounded-lg p-4">
              <h4 className="text-green-400 font-bold text-lg mb-2">Chapitres maîtrisés</h4>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>✓ Ch.1 : Fondamentaux du Tajwid</li>
                <li>✓ Ch.2 : Noon Sâkin et Tanwîn</li>
                <li>✓ Ch.3 : Mîm Sâkin</li>
                <li>✓ Ch.4 : Les Prolongations (Madd)</li>
              </ul>
            </div>

            <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-4">
              <h4 className="text-blue-400 font-bold text-lg mb-2">Chapitres maîtrisés</h4>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>✓ Ch.5 : Les Arrêts (Waqf)</li>
                <li>✓ Ch.6 : Qalqala et Caractéristiques</li>
                <li>✓ Ch.7 : Tafkhîm et Lettres Spéciales</li>
                <li>✓ Ch.8 : Les Erreurs à Éviter</li>
              </ul>
            </div>
          </div>

          <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-4">
            <h4 className="text-purple-400 font-bold text-lg mb-2">🏆 Bravo !</h4>
            <p className="text-gray-300 text-sm">
              Vous avez terminé le module Tajwid ! Continuez à pratiquer régulièrement pour perfectionner
              votre récitation. Révisez les chapitres si nécessaire et n'hésitez pas à consulter un enseignant
              qualifié pour valider vos progrès.
            </p>
          </div>

          <div className="bg-amber-900/30 border border-amber-500/30 rounded-lg p-4">
            <h4 className="text-amber-400 font-bold text-lg mb-2">Prochaines étapes</h4>
            <ul className="text-gray-300 text-sm space-y-1">
              <li>• Réciter quotidiennement avec les règles apprises</li>
              <li>• Écouter des récitateurs confirmés</li>
              <li>• Faire vérifier sa récitation par un professeur</li>
              <li>• Mémoriser de nouvelles sourates</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="px-4 md:px-8">
        <PageNavigation currentChapter={8} currentPage={32} module="TAJWID" className="mt-6 mb-4" />
      </div>

      <footer className="border-t-1 text-white text-center p-4 md:p-6 flex-shrink-0 font-semibold text-sm md:text-base">
        <div>Chapitre 8 - Correction et Récitation Parfaite</div>
        <div className="mt-1">© 2025 Tous droits réservés</div>
      </footer>
    </div>
  );
};

export default function Page32() {
  const [currentPage, setCurrentPage] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const totalPages = 2;

  const playRuleAudio = (ruleKey: string, index: number = 0) => {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }

    setActiveIndex(index);
    const audioFileName = chapter8Page36AudioMappings[ruleKey];
    if (!audioFileName) return;

    const audio = new Audio(`/audio/chapitre8/${audioFileName}.mp3`);
    audio.addEventListener('ended', () => setCurrentAudio(null));
    setCurrentAudio(audio);
    audio.play().catch(error => {
      console.error('Erreur lors de la lecture audio:', error);
      setCurrentAudio(null);
    });
  };

  const goToNextPage = () => {
    if (currentPage < totalPages - 1) setCurrentPage(currentPage + 1);
  };

  const goToPreviousPage = () => {
    if (currentPage > 0) setCurrentPage(currentPage - 1);
  };

  const pageTitle = currentPage === 0 ? 'Correction et Récitation' : 'Al-Fatiha complète';

  return (
    <div className="font-arabic min-h-screen bg-gray-900">
      <div className="w-full h-full overflow-hidden bg-gray-900">
        <div className="text-white p-4 md:p-6 text-center border-b-2">
          <div className="text-2xl md:text-3xl font-bold mb-2">{pageTitle}</div>
          {currentPage === 1 && <div className="text-md md:text-lg text-green-300">Récitez avec toutes les règles</div>}
        </div>

        <div className="flex justify-between items-center px-2 md:px-4 lg:px-8 py-4">
          <button
            onClick={goToPreviousPage}
            disabled={currentPage === 0}
            className={`w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 rounded-full border-2 flex items-center justify-center transition-all ${
              currentPage === 0
                ? 'border-gray-600 text-gray-600 cursor-not-allowed'
                : 'border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white hover:scale-110'
            }`}
          >
            <ChevronLeft size={16} className="md:w-5 md:h-5 lg:w-6 lg:h-6" />
          </button>

          <div className="text-white font-semibold text-xs md:text-sm lg:text-base">
            Page {currentPage + 1} / {totalPages}
          </div>

          <button
            onClick={goToNextPage}
            disabled={currentPage === totalPages - 1}
            className={`w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 rounded-full border-2 flex items-center justify-center transition-all ${
              currentPage === totalPages - 1
                ? 'border-gray-600 text-gray-600 cursor-not-allowed'
                : 'border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white hover:scale-110'
            }`}
          >
            <ChevronRight size={16} className="md:w-5 md:h-5 lg:w-6 lg:h-6" />
          </button>
        </div>

        {currentPage === 0 && <IntroductionPage />}
        {currentPage === 1 && <RulesPage playRuleAudio={playRuleAudio} activeIndex={activeIndex} />}
      </div>
    </div>
  );
}
