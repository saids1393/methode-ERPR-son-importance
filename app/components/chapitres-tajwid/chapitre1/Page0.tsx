'use client';

import React from 'react';
import PageNavigation from '@/app/components/PageNavigation';

const Page0 = () => {
  return (
    <div className="font-arabic min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 text-white p-4 md:p-6 space-y-6">
      <div className="text-center border-b-2 p-6">
        <div className="text-4xl font-bold mb-2">
          Leçon : Définition et importance du Tajwid
        </div>
        <div className="text-lg text-amber-300">
          Chapitre 1 - Page 0
        </div>
      </div>

      <div className="space-y-6 w-full">
        <div className="bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded-xl p-6 transition">
          <h2 className="text-3xl font-bold text-amber-300 mb-4">
            Qu'est-ce que le Tajwid ?
          </h2>

          <p className="text-2xl text-gray-200 leading-relaxed mb-4">
            Le mot <strong>Tajwid</strong> vient de la racine arabe (<em>jawa-da</em>), qui signifie
            « embellir » ou « améliorer ». Dans le contexte de la récitation du Coran,
            le Tajwid désigne l’art et la science de réciter le Coran de manière correcte
            et embellie, en respectant les règles de prononciation, d’articulation et de
            modulation propres à chaque lettre et à chaque mot.
          </p>

          <p className="text-2xl text-gray-200 leading-relaxed mb-4">
            Le Tajwid peut être comparé à un code de la route pour la récitation coranique :
            il fixe les règles à respecter afin que la récitation soit conforme à la
            tradition prophétique et qu’elle préserve la pureté du texte sacré.
          </p>

          <p className="text-2xl text-gray-200 leading-relaxed mb-4">
            Parmi ces règles, on trouve notamment :
          </p>

          <ul className="text-2xl text-gray-200 leading-relaxed list-disc list-inside space-y-2 mb-4">
            <li>
              <strong>Les droits des lettres (makhârij al-hurûf)</strong> : chaque lettre
              doit être prononcée à partir de son point d’articulation et avec ses
              caractéristiques propres.
            </li>
            <li>
              <strong>Les erreurs majeures et mineures</strong> : certaines fautes changent
              le sens du mot (erreurs majeures), tandis que d’autres altèrent la beauté
              de la récitation (erreurs mineures).
            </li>
            <li>
              <strong>Les règles d’arrêt et de reprise</strong> : savoir où et comment
              s’arrêter, marquer une pause ou enchaîner les versets.
            </li>
            <li>
              <strong>Les prolongations (madd)</strong> : durée minimale, optimale et
              maximale de l’allongement des voyelles.
            </li>
          </ul>

          <p className="text-2xl text-gray-200 leading-relaxed">
            En résumé, le Tajwid est l’ensemble des règles qui permettent de réciter
            le Coran tel qu’il a été révélé, en respectant la prononciation, le rythme
            et la mélodie, afin de préserver à la fois son sens et sa beauté.
          </p>
        </div>

        <div className="bg-gradient-to-r from-purple-900/30 to-indigo-900/30 border border-purple-500/20 rounded-xl p-6">
          <p className="text-center text-purple-300 text-sm md:text-base">
            📚 <span className="font-semibold">Approche ERPR :</span> Écoute, Répétition,
            Pratique et Régularité pour une maîtrise complète.
          </p>
        </div>
      </div>

      <PageNavigation currentChapter={1} currentPage={0} module="TAJWID" className="mt-6 mb-4" />

      <footer className="text-center text-gray-400 text-sm py-6">
        © 2025 - Tajwid Chapitre 1 - Page 0
      </footer>
    </div>
  );
};

export default Page0;
