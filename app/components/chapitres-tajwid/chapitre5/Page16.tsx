'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import PageNavigation from '@/app/components/PageNavigation';

const IntroductionPage = () => {
  return (
    <div className="p-4 md:p-8 bg-gray-900">
      <div className="w-full bg-gray-800 rounded-lg p-6 md:p-8">
        <div className="text-white space-y-6 text-lg md:text-xl leading-relaxed">
          <h2 className="text-3xl font-bold text-teal-400 mb-4">Définition et importance du Waqf (الوقف)</h2>
          
          <p>
            Le <span className="text-teal-400 font-semibold">Waqf (الوقف)</span> signifie linguistiquement "arrêt" ou "pause". 
            En Tajwid, c'est <span className="text-amber-400 font-semibold">l'interruption de la voix à la fin d'un mot</span> 
            pendant un temps permettant de reprendre son souffle.
          </p>
          
          <p>
            Le Waqf est l'un des aspects les plus importants de la récitation coranique car :
          </p>
          
          <ul className="ml-4 space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-teal-400">✓</span>
              <span>Il <span className="text-amber-400 font-semibold">préserve le sens</span> des versets coraniques</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-teal-400">✓</span>
              <span>Il permet une <span className="text-amber-400 font-semibold">récitation correcte</span> sans altérer la signification</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-teal-400">✓</span>
              <span>Il facilite la <span className="text-amber-400 font-semibold">compréhension</span> pour l'auditeur</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-teal-400">✓</span>
              <span>Il respecte les <span className="text-amber-400 font-semibold">règles grammaticales</span> de l'arabe</span>
            </li>
          </ul>
          
          <div className="bg-teal-900/30 border border-teal-500/50 rounded-lg p-4 md:p-6 my-6">
            <p>
              💡 <span className="font-semibold">Important :</span> Un mauvais arrêt peut changer complètement le sens d'un verset, 
              voire mener à une signification contraire à l'intention divine. C'est pourquoi la maîtrise du Waqf est essentielle.
            </p>
          </div>
          
          <p>
            Le Waqf est accompagné de l'<span className="text-purple-400 font-semibold">Ibtidâ' (الإبتداء)</span> - 
            la reprise de la récitation après l'arrêt - qui est tout aussi important.
          </p>
        </div>
      </div>
      
      <div className="px-4 md:px-8">
        <PageNavigation currentChapter={5} currentPage={16} module="TAJWID" className="mt-6 mb-4" />
      </div>

      <footer className="border-t-1 text-white text-center p-4 md:p-6 mt-8 flex-shrink-0 font-semibold text-base md:text-lg">
        <div>Chapitre 5 - Page 16</div>
        <div className="mt-1">© 2025 Tous droits réservés</div>
      </footer>
    </div>
  );
};

const TypesOverviewPage = () => {
  return (
    <div className="p-4 md:p-8 bg-gray-900">
      <h2 className="text-2xl md:text-3xl font-bold text-teal-400 mb-6 text-center">Les catégories de Waqf</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-green-900/30 border-2 border-green-500 rounded-xl p-5">
          <h3 className="text-xl font-bold text-green-400 mb-3">Waqf Tâmm (تام)</h3>
          <p className="text-gray-300 mb-2">Arrêt complet</p>
          <p className="text-gray-400 text-sm">Le sens est complet, pas de lien grammatical avec ce qui suit</p>
          <div className="mt-3 p-2 bg-gray-800 rounded text-amber-300 text-center">
            مـ
          </div>
        </div>
        
        <div className="bg-blue-900/30 border-2 border-blue-500 rounded-xl p-5">
          <h3 className="text-xl font-bold text-blue-400 mb-3">Waqf Kâfî (كافٍ)</h3>
          <p className="text-gray-300 mb-2">Arrêt suffisant</p>
          <p className="text-gray-400 text-sm">Le sens est suffisant mais il y a un lien avec ce qui suit</p>
          <div className="mt-3 p-2 bg-gray-800 rounded text-amber-300 text-center">
            ج
          </div>
        </div>
        
        <div className="bg-amber-900/30 border-2 border-amber-500 rounded-xl p-5">
          <h3 className="text-xl font-bold text-amber-400 mb-3">Waqf Ḥasan (حسن)</h3>
          <p className="text-gray-300 mb-2">Arrêt bon/acceptable</p>
          <p className="text-gray-400 text-sm">Le sens est acceptable mais il est préférable de continuer</p>
          <div className="mt-3 p-2 bg-gray-800 rounded text-amber-300 text-center">
            صلى
          </div>
        </div>
        
        <div className="bg-red-900/30 border-2 border-red-500 rounded-xl p-5">
          <h3 className="text-xl font-bold text-red-400 mb-3">Waqf Qabîḥ (قبيح)</h3>
          <p className="text-gray-300 mb-2">Arrêt mauvais/interdit</p>
          <p className="text-gray-400 text-sm">Change le sens, déforme la signification du verset</p>
          <div className="mt-3 p-2 bg-gray-800 rounded text-amber-300 text-center">
            لا
          </div>
        </div>
      </div>
      
      <div className="bg-gray-800 rounded-lg p-4 md:p-6">
        <h3 className="text-xl font-bold text-amber-300 mb-4">Les signes de Waqf dans le Mushaf</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-3xl text-teal-400 font-bold mb-2">مـ</div>
            <p className="text-gray-300 text-sm">Waqf obligatoire</p>
          </div>
          <div className="text-center">
            <div className="text-3xl text-teal-400 font-bold mb-2">ج</div>
            <p className="text-gray-300 text-sm">Waqf permis</p>
          </div>
          <div className="text-center">
            <div className="text-3xl text-teal-400 font-bold mb-2">صلى</div>
            <p className="text-gray-300 text-sm">Continuer préférable</p>
          </div>
          <div className="text-center">
            <div className="text-3xl text-teal-400 font-bold mb-2">لا</div>
            <p className="text-gray-300 text-sm">Ne pas s'arrêter</p>
          </div>
        </div>
      </div>

      <div className="px-4 md:px-8">
        <PageNavigation currentChapter={5} currentPage={16} module="TAJWID" className="mt-6 mb-4" />
      </div>

      <footer className="border-t-1 text-white text-center p-4 md:p-6 mt-8 flex-shrink-0 font-semibold text-base md:text-lg">
        <div>Chapitre 5 - Page 16</div>
        <div className="mt-1">© 2025 Tous droits réservés</div>
      </footer>
    </div>
  );
};

const Page17 = () => {
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
    ? "Leçon : Définition du Waqf"
    : "Les catégories de Waqf";

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
        {currentPage === 1 && <TypesOverviewPage />}
      </div>
    </div>
  );
};

export default Page17;
