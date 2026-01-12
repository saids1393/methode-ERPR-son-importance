'use client';

import React from 'react';
import PageNavigation from '@/app/components/PageNavigation';

const Introduction3 = () => {
  return (
    <div className="p-4 md:p-8 bg-gray-900 min-h-screen">
      <div className="text-white p-4 md:p-6 text-center border-b-2 mb-6">
        <h2 className="text-2xl md:text-3xl font-bold">Introduction Chapitre 3</h2>
      </div>
      
      <div className="w-full bg-gray-800 rounded-lg p-6 md:p-8">
        <div className="text-white space-y-6 text-lg md:text-xl leading-relaxed">
          <p>
            Le <span className="text-blue-400 font-semibold">Mîm Sâkin (مْ)</span> est une lettre fondamentale avec trois règles 
            spécifiques appelées "Shafawî" car elles impliquent les lèvres.
          </p>
          
          <p>
            Contrairement au Noon Sâkin (4 règles), le Mîm Sâkin suit une logique plus simple avec 
            <span className="text-blue-400 font-semibold"> Ikhfâ', Idghâm et Izh-hâr Shafawî</span>.
          </p>
          
          <div className="bg-blue-900/30 border border-blue-500/50 rounded-lg p-4 md:p-6 my-6">
            <p>
              💡 <span className="text-blue-400 font-semibold">Objectif :</span> Comprendre et appliquer les trois règles labiales 
              du Mîm Sâkin dans la récitation coranique.
            </p>
          </div>
        </div>
      </div>
      
      <div className="px-4 md:px-8">
        <PageNavigation currentChapter={3} currentPage={7} module="TAJWID" className="mt-6 mb-4" />
      </div>

      <footer className="border-t-1 text-white text-center p-4 md:p-6 mt-8 flex-shrink-0 font-semibold text-base md:text-lg">
        <div>Chapitre 3 - Introduction</div>
        <div className="mt-1">© 2025 Tous droits réservés</div>
      </footer>
    </div>
  );
};

export default Introduction3;
