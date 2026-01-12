'use client';

import React from 'react';
import PageNavigation from '@/app/components/PageNavigation';

const Page7 = () => {
  return (
    <div className="font-arabic min-h-screen bg-gray-900">
      <div className="w-full h-full overflow-hidden bg-gray-900">
        
        {/* Header */}
        <div className="text-white p-4 md:p-6 text-center border-b-2">
          <div className="text-2xl md:text-3xl font-bold mb-2">
            Leçon : Introduction au Mîm Sâkin
          </div>
        </div>

        {/* Content */}
        <div className="p-4 md:p-8 bg-gray-900">
          <div className="w-full bg-gray-800 rounded-lg p-6 md:p-8">
            <div className="text-white space-y-6 text-lg md:text-xl leading-relaxed">
              <h2 className="text-3xl font-bold text-green-400 mb-4">Introduction au Mîm Sâkin (الميم الساكنة)</h2>
              
              <p>
                Le <span className="text-green-400 font-semibold">Mîm Sâkin (مْ)</span> est la lettre Mîm (م) portant un Soukoun (ْ), 
                c'est-à-dire sans voyelle. Comme le Noon Sâkin, le Mîm Sâkin a ses propres règles de prononciation.
              </p>
              
              <p>
                Les règles du Mîm Sâkin dépendent de la lettre qui le suit. Il existe <span className="text-amber-400 font-semibold">trois règles principales</span> :
              </p>
              
              <ul className="ml-4 space-y-3">
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 font-bold">1.</span>
                  <span><span className="text-purple-400 font-semibold">Ikhfâ' Shafawî (إخفاء شفوي)</span> : Dissimulation labiale - devant la lettre ب</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 font-bold">2.</span>
                  <span><span className="text-blue-400 font-semibold">Idghâm Shafawî (إدغام شفوي)</span> : Fusion labiale - devant la lettre م</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 font-bold">3.</span>
                  <span><span className="text-red-400 font-semibold">Izh-hâr Shafawî (إظهار شفوي)</span> : Prononciation claire - devant les 26 autres lettres</span>
                </li>
              </ul>
              
              <div className="bg-green-900/30 border border-green-500/50 rounded-lg p-4 md:p-6 my-6">
                <p>
                  💡 <span className="font-semibold">Point Important :</span> Le terme "Shafawî" (شفوي) signifie "labial", 
                  car ces règles impliquent les lèvres dans la prononciation du Mîm.
                </p>
              </div>
              
              <p>
                Dans les pages suivantes, nous étudierons chaque règle en détail avec des exemples pratiques.
              </p>
            </div>
          </div>
          
          <div className="px-4 md:px-8">
            <PageNavigation currentChapter={3} currentPage={7} module="TAJWID" className="mt-6 mb-4" />
          </div>

          <footer className="border-t-1 text-white text-center p-4 md:p-6 mt-8 flex-shrink-0 font-semibold text-base md:text-lg">
            <div>Chapitre 3 - Page 7</div>
            <div className="mt-1">© 2025 Tous droits réservés</div>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default Page7;