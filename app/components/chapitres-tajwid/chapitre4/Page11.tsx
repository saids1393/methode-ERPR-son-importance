'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import PageNavigation from '@/app/components/PageNavigation';

const IntroductionPage = () => {
  return (
    <div className="p-4 md:p-8 bg-gray-900">
      <div className="w-full bg-gray-800 rounded-lg p-6 md:p-8">
        <div className="text-white space-y-6 text-lg md:text-xl leading-relaxed">
          <h2 className="text-3xl font-bold text-red-400 mb-4">Introduction et définition du Madd (المد)</h2>
          
          <p>
            Le <span className="text-red-400 font-semibold">Madd (المد)</span> signifie linguistiquement "extension" ou "prolongation". 
            En Tajwid, c'est <span className="text-amber-400 font-semibold">l'allongement du son d'une lettre de prolongation</span> 
            au-delà de sa durée naturelle.
          </p>
          
          <p>
            Les <span className="text-green-400 font-semibold">lettres de Madd (حروف المد)</span> sont au nombre de trois :
          </p>
          
          <div className="flex justify-center gap-8 my-6">
            <div className="text-center">
              <div className="text-5xl text-amber-400 font-bold">ا</div>
              <p className="text-gray-300 mt-2">Alif</p>
              <p className="text-gray-400 text-sm">précédé de Fatha</p>
            </div>
            <div className="text-center">
              <div className="text-5xl text-amber-400 font-bold">و</div>
              <p className="text-gray-300 mt-2">Waw</p>
              <p className="text-gray-400 text-sm">précédé de Damma</p>
            </div>
            <div className="text-center">
              <div className="text-5xl text-amber-400 font-bold">ي</div>
              <p className="text-gray-300 mt-2">Ya</p>
              <p className="text-gray-400 text-sm">précédé de Kasra</p>
            </div>
          </div>
          
          <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-4 md:p-6 my-6">
            <p>
              💡 <span className="font-semibold">Condition essentielle :</span> La lettre de Madd doit être <strong>sâkina</strong> (sans voyelle) 
              et précédée de la voyelle correspondante (Fatha pour Alif, Damma pour Waw, Kasra pour Ya).
            </p>
          </div>
          
          <p>
            Le Madd se divise en deux catégories principales :
          </p>
          <ul className="ml-4 space-y-2">
            <li>✓ <span className="text-blue-400 font-semibold">Madd Aslî (أصلي) ou Ṭabî'î (طبيعي)</span> : Madd naturel/originel</li>
            <li>✓ <span className="text-purple-400 font-semibold">Madd Far'î (فرعي)</span> : Madd secondaire/dérivé</li>
          </ul>
        </div>
      </div>
      
      <div className="px-4 md:px-8">
        <PageNavigation currentChapter={4} currentPage={11} module="TAJWID" className="mt-6 mb-4" />
      </div>

      <footer className="border-t-1 text-white text-center p-4 md:p-6 mt-8 flex-shrink-0 font-semibold text-base md:text-lg">
        <div>Chapitre 4 - Page 11</div>
        <div className="mt-1">© 2025 Tous droits réservés</div>
      </footer>
    </div>
  );
};

const OverviewPage = () => {
  return (
    <div className="p-4 md:p-8 bg-gray-900">
      <h2 className="text-2xl md:text-3xl font-bold text-red-400 mb-6 text-center">Les types de Madd</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Madd Ṭabî'î */}
        <div className="bg-blue-900/30 border-2 border-blue-500 rounded-xl p-6">
          <h3 className="text-xl font-bold text-blue-400 mb-3">Madd Ṭabî'î (طبيعي)</h3>
          <p className="text-gray-300 mb-3">Madd naturel / originel</p>
          <ul className="text-gray-300 text-sm space-y-1">
            <li>• Durée : <span className="text-amber-300">2 temps (حركتان)</span></li>
            <li>• Condition : Pas de Hamza ni Sukûn après</li>
            <li>• Exemple : <span className="text-amber-300 text-xl">قَالَ - يَقُولُ - قِيلَ</span></li>
          </ul>
        </div>
        
        {/* Madd Far'î */}
        <div className="bg-purple-900/30 border-2 border-purple-500 rounded-xl p-6">
          <h3 className="text-xl font-bold text-purple-400 mb-3">Madd Far'î (فرعي)</h3>
          <p className="text-gray-300 mb-3">Madd secondaire / dérivé</p>
          <ul className="text-gray-300 text-sm space-y-1">
            <li>• Durée : <span className="text-amber-300">Variable (4-6 temps)</span></li>
            <li>• Condition : Hamza ou Sukûn après le Madd</li>
            <li>• Types : Muttasil, Munfasil, Lâzim, etc.</li>
          </ul>
        </div>
      </div>
      
      <div className="bg-gray-800 rounded-lg p-4 md:p-6">
        <h3 className="text-xl font-bold text-amber-300 mb-4">Mesure du Madd : le temps (حركة)</h3>
        <p className="text-gray-300 mb-4">
          La durée du Madd se mesure en "temps" (حركة - haraka). Un temps équivaut approximativement 
          à la durée nécessaire pour prononcer une lettre avec sa voyelle.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-700/50 p-3 rounded-lg text-center">
            <p className="text-blue-400 font-bold">2 temps</p>
            <p className="text-gray-400 text-sm">Madd Ṭabî'î</p>
          </div>
          <div className="bg-gray-700/50 p-3 rounded-lg text-center">
            <p className="text-amber-400 font-bold">4-5 temps</p>
            <p className="text-gray-400 text-sm">Muttasil / Munfasil</p>
          </div>
          <div className="bg-gray-700/50 p-3 rounded-lg text-center">
            <p className="text-red-400 font-bold">6 temps</p>
            <p className="text-gray-400 text-sm">Madd Lâzim</p>
          </div>
        </div>
      </div>

      <div className="px-4 md:px-8">
        <PageNavigation currentChapter={4} currentPage={11} module="TAJWID" className="mt-6 mb-4" />
      </div>

      <footer className="border-t-1 text-white text-center p-4 md:p-6 mt-8 flex-shrink-0 font-semibold text-base md:text-lg">
        <div>Chapitre 4 - Page 11</div>
        <div className="mt-1">© 2025 Tous droits réservés</div>
      </footer>
    </div>
  );
};

const Page12 = () => {
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
    ? "Leçon : Introduction au Madd"
    : "Les types de Madd";

  return (
    <div className="font-arabic min-h-screen bg-gray-900">
      <div className="w-full h-full overflow-hidden bg-gray-900">
        
        {/* Header */}
        <div className="text-white p-4 md:p-6 text-center border-b-2">
          <div className="text-2xl md:text-3xl font-bold mb-2">
            {pageTitle}
          </div>
        </div>
        
        {/* Navigation Buttons */}
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

        {/* Content */}
        {currentPage === 0 && <IntroductionPage />}
        {currentPage === 1 && <OverviewPage />}
      </div>
    </div>
  );
};

export default Page12;
