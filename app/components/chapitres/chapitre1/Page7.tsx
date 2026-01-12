"use client";
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import PageNavigation from '@/app/components/PageNavigation';

const chapterPage7AudioMappings: { [key: string]: string } = {
  // Row 1
  'الٓمٓ': 'chap_page7_case1',
  'الٓمٓصٓ': 'chap_page7_case2',
  'الٓر': 'chap_page7_case3',
  'الٓمٓر': 'chap_page7_case4',
  // Row 2
  'كٓهيعٓصٓ': 'chap_page7_case5',
  'طه': 'chap_page7_case6',
  'طسٓمٓ': 'chap_page7_case7',
  'طسٓ': 'chap_page7_case8',
  // Row 3
  'يسٓ': 'chap_page7_case9',
  'صٓ': 'chap_page7_case10',
  'قٓ': 'chap_page7_case11',
  'نٓ': 'chap_page7_case12',
  // Row 4
  'حمٓ': 'chap_page7_case13',
  'حمٓ عٓسٓقٓ': 'chap_page7_case14',
};

const IntroductionPage = () => {
  return (
    <div className="p-8 bg-gray-900">
      <div className="w-full bg-gray-800 rounded-lg p-8">
        <div className="text-white space-y-6 text-xl leading-relaxed">
          
          <p>
            <span className="text-purple-400 font-semibold">Exercice spécial ! </span> 
            Maintenant, tu vas découvrir les <span className="text-yellow-400 font-semibold">Huruf Muqatta'at</span> - 
            les lettres séparées qui apparaissent au début de certaines sourates du Coran.
          </p>

          <p>
            Ces lettres mystérieuses sont une particularité unique du Saint Coran et 
            représentent un défi intéressant pour la reconnaissance visuelle.
          </p>

          <p>
            🎯 <span className="font-semibold">Objectif de l'exercice :</span>
            <br />
            • Reconnaître les combinaisons de lettres séparées
            <br />
            • Se familiariser avec ces formes particulières
            <br />
            • S'entraîner à l'écoute et la répétition
          </p>

          <p>
            <span className="text-green-400 font-semibold">Comment ça marche :</span>
             <br />
            • Observe bien chaque combinaison de lettres
            <br />
            • Clique sur chaque case pour entendre la prononciation
            <br />
            • Répète après avoir écouté
          </p>

          <div className="bg-blue-900/30 border border-blue-500/50 rounded-lg p-6 my-6">
            <p>
              💡 <span className="font-semibold">Note importante :</span> 
              Tu remarqueras les petites vagues (~) sur certaines lettres. 
              <span className="text-amber-300"> En tajwid, cela s'appelle "Mad Lazim" et se prolonge de 6 temps</span>, 
              mais pour le moment concentre-toi sur l'écoute et la répétition. 
              Tu apprendras les règles de prolongation bien plus tard !
            </p>
          </div>

          <div className="bg-purple-900/30 border border-purple-500/50 rounded-lg p-6 my-6">
            <p>
              💡 <span className="font-semibold">Astuce visuelle :</span> 
              Les cases alternent entre <span className="text-white">blanc</span> et 
              <span className="text-purple-400"> violet</span> pour t'aider à mieux distinguer les différentes combinaisons !
            </p>
          </div>

          <p>
            À la page suivante, tu trouveras la grille d'exercice avec toutes les combinaisons 
            de lettres séparées. Prends ton temps pour découvrir ces mystères coraniques !
          </p>
        </div>
      </div>

      <footer className="border-t-1 text-white text-center p-6 mt-8 flex-shrink-0 font-semibold text-lg">
        <div>Exercice des Lettres Séparées</div>
        <div className="mt-1">© 2025 Tous droits réservés</div>
      </footer>
    </div>
  );
};

const ExercisePage = ({ playLetterAudio, activeIndex, setActiveIndex }: { 
  playLetterAudio: (letter: string, index: number) => void;
  activeIndex: number;
  setActiveIndex: (index: number) => void;
}) => {
  const hurufMuqattaah = [
    // Row 1
    'الٓمٓ',
    'الٓمٓصٓ', 
    'الٓر',
    'الٓمٓر',

    // Row 2
    'كٓهيعٓصٓ',
    'طه',
    'طسٓمٓ', 
    'طسٓ',

    // Row 3
    'يسٓ',
    'صٓ', 
    'قٓ',
    'نٓ',

    // Row 4
    'حمٓ',
    'حمٓ عٓسٓقٓ'
  ];

  return (
    <div className="p-8 bg-gray-900">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6" style={{ direction: 'rtl' }}>
        {hurufMuqattaah.map((letters, index) => {
          // Alterner entre violet et blanc pour chaque case
          const colorClass = index % 2 === 0 ? 'text-purple-400' : 'text-white';
          return (
            <div
              key={index}
              className={`bg-gray-900 border border-zinc-500 rounded-xl p-4 text-center min-h-[120px] flex flex-col justify-center items-center hover:bg-zinc-700 transition-all duration-300 hover:scale-105 cursor-pointer ${
                activeIndex === index ? 'pulse-active' : ''
              }`}
              onClick={() => playLetterAudio(letters, index)}
            >
              <div className={`text-4xl md:text-5xl font-bold transition-colors ${colorClass}`}>
                {letters}
              </div>
            </div>
          );
        })}
      </div>

      {/* Instructions de l'exercice */}
      <div className="bg-purple-900/30 border border-purple-500/50 rounded-lg p-6 mb-6">
        <p className="text-lg leading-relaxed text-white text-center">
          <span className="font-semibold">🎯 Instructions :</span> Clique sur chaque combinaison pour écouter sa prononciation. 
          <span className="block mt-2">Les cases alternent entre violet et blanc pour mieux distinguer les combinaisons !</span>
          <span className="block mt-2 text-amber-300">Concentre-toi sur l'écoute et la répétition pour le moment.</span>
        </p>
      </div>

      
      <PageNavigation currentChapter={1} currentPage={7} module="LECTURE" className="mt-6 mb-4" />

<footer className="border-t-1 text-white text-center p-6 flex-shrink-0 font-semibold text-sm">
        <div>Exercice des Lettres Séparées</div>
        <div className="mt-1">© 2025 Tous droits réservés</div>
      </footer>
    </div>
  );
};

const Page7 = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0); // Première lettre active par défaut
  // ✅ Référence audio globale pour contrôler la lecture
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const totalPages = 2;

  const playLetterAudio = (letter: string, index: number = 0) => {
    // ✅ Arrêter l'audio précédent s'il existe
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }
    
    // ✅ Mettre à jour l'état visuel
    setActiveIndex(index);
    
    const audioFileName = chapterPage7AudioMappings[letter];
    if (audioFileName) {
      const audio = new Audio(`/audio/chapitre0_1/${audioFileName}.mp3`);
      
      // ✅ Gérer la fin de l'audio
      audio.addEventListener('ended', () => {
        setCurrentAudio(null);
        // Garder la lettre active pour le clignotant
      });
      
      // ✅ Mettre à jour la référence et jouer
      setCurrentAudio(audio);
      audio.play().catch(error => {
        console.error('Erreur lors de la lecture audio:', error);
        setCurrentAudio(null);
        // Garder la lettre active pour le clignotant
      });
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const pageTitle = currentPage === 0 
    ? "Exercice : reconnaissance des lettres séparées au début de certaines sourates"
    : "Exercice : Grille des Huruf Muqatta'at";

  return (
    <div className="font-arabic min-h-screen bg-gray-900">
      <div className="w-full h-full overflow-hidden bg-gray-900">
        
        {/* Header */}
        <div className="text-white p-6 text-center border-b-2">
          <div className="text-2xl md:text-3xl font-bold mb-2">
            {pageTitle}
          </div>
          {/* Phrase ajoutée seulement pour la page d'exercice */}
          {currentPage === 1 && (
            <div className="text-md text-amber-300">
              Cliquez pour écouter chaque lettre et répétez après.
            </div>
          )}
        </div>
        
        {/* Navigation Buttons */}
        <div className="flex justify-between items-center px-4 md:px-8 py-4">
          <button
            onClick={goToPreviousPage}
            disabled={currentPage === 0}
            className={`w-10 h-10 md:w-12 md:h-12 rounded-full border-2 flex items-center justify-center transition-all ${
              currentPage === 0
                ? 'border-gray-600 text-gray-600 cursor-not-allowed'
                : 'border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white hover:scale-110'
            }`}
          >
            <ChevronLeft size={20} className="md:w-6 md:h-6" />
          </button>

          <div className="text-white font-semibold text-sm md:text-base">
            Page {currentPage + 1} / {totalPages}
          </div>

          <button
            onClick={goToNextPage}
            disabled={currentPage === totalPages - 1}
            className={`w-10 h-10 md:w-12 md:h-12 rounded-full border-2 flex items-center justify-center transition-all ${
              currentPage === totalPages - 1
                ? 'border-gray-600 text-gray-600 cursor-not-allowed'
                : 'border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white hover:scale-110'
            }`}
          >
            <ChevronRight size={20} className="md:w-6 md:h-6" />
          </button>
        </div>

        {/* Content */}
        {currentPage === 0 && <IntroductionPage />}
        {currentPage === 1 && <ExercisePage playLetterAudio={playLetterAudio} activeIndex={activeIndex} setActiveIndex={setActiveIndex} />}
      </div>
    </div>
  );
};

export default Page7;