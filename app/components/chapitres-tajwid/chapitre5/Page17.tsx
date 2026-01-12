'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import PageNavigation from '@/app/components/PageNavigation';

const IntroductionPage = () => {
  return (
    <div className="p-4 md:p-8 bg-gray-900">
      <div className="w-full bg-gray-800 rounded-lg p-6 md:p-8">
        <div className="text-white space-y-6 text-lg md:text-xl leading-relaxed">
          <h2 className="text-3xl font-bold text-teal-400 mb-4">Règles fondamentales du Waqf</h2>
          
          <p>
            Les règles du Waqf sont basées sur la <span className="text-amber-400 font-semibold">préservation du sens</span> 
            des versets coraniques. Voici les principes fondamentaux à respecter :
          </p>
          
          <div className="space-y-4">
            <div className="bg-green-900/30 border border-green-500/50 rounded-lg p-4">
              <h3 className="text-xl font-bold text-green-400 mb-2">1. Le Waqf sur un mot complet</h3>
              <p className="text-gray-300">
                On ne s'arrête jamais au milieu d'un mot. L'arrêt doit toujours se faire sur la 
                <span className="text-green-400 font-semibold"> dernière lettre du mot</span>.
              </p>
            </div>
            
            <div className="bg-blue-900/30 border border-blue-500/50 rounded-lg p-4">
              <h3 className="text-xl font-bold text-blue-400 mb-2">2. La modification de la dernière lettre</h3>
              <p className="text-gray-300">
                Lors de l'arrêt, la dernière voyelle devient un <span className="text-blue-400 font-semibold">sukûn (سُكُون)</span>.
                La <span className="text-blue-400">fatḥa</span> devient <span className="text-amber-300">alif de prolongation</span> sur le Tâ' Marbûṭa.
              </p>
            </div>
            
            <div className="bg-purple-900/30 border border-purple-500/50 rounded-lg p-4">
              <h3 className="text-xl font-bold text-purple-400 mb-2">3. Le Tanwîn lors du Waqf</h3>
              <p className="text-gray-300">
                Le <span className="text-purple-400 font-semibold">Tanwîn</span> (double voyelle) perd son son "n" lors de l'arrêt.
                Le double fatḥa devient un alif de prolongation.
              </p>
            </div>
          </div>
          
          <div className="bg-teal-900/30 border border-teal-500/50 rounded-lg p-4 md:p-6 my-6">
            <p>
              💡 <span className="font-semibold">Astuce :</span> Pratiquez toujours avec les signes de Waqf présents 
              dans le Mushaf. Ils vous guident pour savoir où il est préférable de s'arrêter.
            </p>
          </div>
        </div>
      </div>
      
      <div className="px-4 md:px-8">
        <PageNavigation currentChapter={5} currentPage={17} module="TAJWID" className="mt-6 mb-4" />
      </div>

      <footer className="border-t-1 text-white text-center p-4 md:p-6 mt-8 flex-shrink-0 font-semibold text-base md:text-lg">
        <div>Chapitre 5 - Page 17</div>
        <div className="mt-1">© 2025 Tous droits réservés</div>
      </footer>
    </div>
  );
};

const ExamplesPage = () => {
  const examples = [
    {
      title: "Waqf sur Tanwîn Fatḥ",
      original: "كِتَابًا",
      waqf: "كِتَابَا",
      rule: "Le tanwîn fatḥa devient alif",
      color: "text-green-400",
      bgColor: "bg-green-900/30",
      borderColor: "border-green-500"
    },
    {
      title: "Waqf sur Tanwîn Kasra",
      original: "كِتَابٍ",
      waqf: "كِتَابْ",
      rule: "Le tanwîn kasra devient sukûn",
      color: "text-blue-400",
      bgColor: "bg-blue-900/30",
      borderColor: "border-blue-500"
    },
    {
      title: "Waqf sur Tanwîn Ḍamma",
      original: "كِتَابٌ",
      waqf: "كِتَابْ",
      rule: "Le tanwîn ḍamma devient sukûn",
      color: "text-purple-400",
      bgColor: "bg-purple-900/30",
      borderColor: "border-purple-500"
    },
    {
      title: "Waqf sur Tâ' Marbûṭa",
      original: "رَحْمَةً",
      waqf: "رَحْمَهْ",
      rule: "La tâ' marbûṭa devient hâ' sâkina",
      color: "text-amber-400",
      bgColor: "bg-amber-900/30",
      borderColor: "border-amber-500"
    },
    {
      title: "Waqf sur voyelle courte",
      original: "يَعْلَمُ",
      waqf: "يَعْلَمْ",
      rule: "La voyelle devient sukûn",
      color: "text-red-400",
      bgColor: "bg-red-900/30",
      borderColor: "border-red-500"
    },
    {
      title: "Waqf sur Hâ' du pronom",
      original: "لَهُ",
      waqf: "لَهْ",
      rule: "La voyelle du pronom devient sukûn",
      color: "text-teal-400",
      bgColor: "bg-teal-900/30",
      borderColor: "border-teal-500"
    }
  ];

  return (
    <div className="p-4 md:p-8 bg-gray-900">
      <h2 className="text-2xl md:text-3xl font-bold text-teal-400 mb-6 text-center">Exemples de modifications lors du Waqf</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {examples.map((ex, index) => (
          <div key={index} className={`${ex.bgColor} border-2 ${ex.borderColor} rounded-xl p-4`}>
            <h3 className={`text-lg font-bold ${ex.color} mb-3`}>{ex.title}</h3>
            <div className="flex items-center justify-center gap-4 mb-3">
              <div className="text-center">
                <p className="text-gray-400 text-sm mb-1">Original</p>
                <p className="text-3xl text-white font-arabic">{ex.original}</p>
              </div>
              <div className="text-2xl text-gray-400">→</div>
              <div className="text-center">
                <p className="text-gray-400 text-sm mb-1">Waqf</p>
                <p className={`text-3xl ${ex.color} font-arabic`}>{ex.waqf}</p>
              </div>
            </div>
            <p className="text-gray-300 text-sm text-center">{ex.rule}</p>
          </div>
        ))}
      </div>
      
      <div className="bg-gray-800 rounded-lg p-4 md:p-6">
        <h3 className="text-xl font-bold text-amber-300 mb-4 text-center">Règle générale</h3>
        <p className="text-gray-300 text-center">
          Lors du Waqf, toute voyelle finale devient <span className="text-teal-400 font-semibold">sukûn</span>, 
          sauf le <span className="text-amber-400 font-semibold">tanwîn fatḥa</span> qui devient un <span className="text-amber-400 font-semibold">alif</span>.
        </p>
      </div>

      <div className="px-4 md:px-8">
        <PageNavigation currentChapter={5} currentPage={17} module="TAJWID" className="mt-6 mb-4" />
      </div>

      <footer className="border-t-1 text-white text-center p-4 md:p-6 mt-8 flex-shrink-0 font-semibold text-base md:text-lg">
        <div>Chapitre 5 - Page 17</div>
        <div className="mt-1">© 2025 Tous droits réservés</div>
      </footer>
    </div>
  );
};

const Page18 = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = 2;

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
    ? "Leçon : Règles fondamentales du Waqf"
    : "Exemples de Waqf";

  return (
    <div className="font-arabic min-h-screen bg-gray-900">
      <div className="w-full h-full overflow-hidden bg-gray-900">
        
        <div className="text-white p-4 md:p-6 text-center border-b-2">
          <div className="text-2xl md:text-3xl font-bold mb-2">
            {pageTitle}
          </div>
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
        {currentPage === 1 && <ExamplesPage />}
      </div>
    </div>
  );
};

export default Page18;
