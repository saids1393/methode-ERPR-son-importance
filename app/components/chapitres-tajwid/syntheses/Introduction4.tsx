'use client';

import React from 'react';
import PageNavigation from '@/app/components/PageNavigation';

const Introduction4 = () => {
  return (
    <div className="p-4 md:p-8 bg-gray-900 min-h-screen">
      <div className="text-white p-4 md:p-6 text-center border-b-2 mb-6">
        <h2 className="text-2xl md:text-3xl font-bold">Introduction Chapitre 4</h2>
      </div>
      
      <div className="w-full bg-gray-800 rounded-lg p-6 md:p-8">
        <div className="text-white space-y-6 text-lg md:text-xl leading-relaxed">
          <p>
            <span className="text-blue-400 font-semibold">Al-Madd</span> signifie "allongement" - une règle essentielle 
            qui détermine la durée de prononciation des voyelles longues dans le Coran.
          </p>
          
          <p>
            Ce chapitre couvre le <span className="text-blue-400 font-semibold">Madd Ṭabî'î</span> (2 temps) et les 
            <span className="text-blue-400 font-semibold"> Madd Far'î</span> (4 à 6 temps) avec leurs variantes.
          </p>
          
          <div className="bg-blue-900/30 border border-blue-500/50 rounded-lg p-4 md:p-6 my-6">
            <p>
              💡 <span className="text-blue-400 font-semibold">Objectif :</span> Maîtriser les différents types de prolongations 
              pour donner à chaque voyelle sa durée correcte.
            </p>
          </div>
        </div>
      </div>
      
      <div className="px-4 md:px-8">
        <PageNavigation currentChapter={4} currentPage={11} module="TAJWID" className="mt-6 mb-4" />
      </div>

      <footer className="border-t-1 text-white text-center p-4 md:p-6 mt-8 flex-shrink-0 font-semibold text-base md:text-lg">
        <div>Chapitre 4 - Introduction</div>
        <div className="mt-1">© 2025 Tous droits réservés</div>
      </footer>
    </div>
  );
};

export default Introduction4;
