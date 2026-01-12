'use client';

import React from 'react';
import Link from 'next/link';
import { BookOpen, PenLine, ArrowLeft } from 'lucide-react';

const Exercice2 = () => {
  return (
    <div className="min-h-screen bg-gray-900 p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/chapitres-tajwid/2/quiz" className="inline-flex items-center text-blue-400 hover:text-blue-300 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour au quiz
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            <BookOpen className="inline w-8 h-8 mr-3 text-blue-400" />
            Exercice - Chapitre 2
          </h1>
          <p className="text-gray-400 text-lg">Le Noon Sâkin et le Tanwîn (نْ و التنوين)</p>
        </div>

        {/* Consigne */}
        <div className="bg-gray-800 rounded-xl p-6 md:p-8 border border-gray-700">
          <div className="flex items-start gap-4 mb-6">
            <div className="bg-blue-600/20 rounded-full p-3">
              <PenLine className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white mb-2">Exercice de rédaction</h2>
              <p className="text-gray-400">À rendre dans la partie Devoirs du chapitre 2</p>
            </div>
          </div>

          <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-6 mb-6">
            <p className="text-white text-lg leading-relaxed">
              Rédigez un court texte <span className="text-blue-400 font-semibold">(5 lignes maximum)</span> expliquant ce que vous avez compris des <span className="text-amber-400 font-semibold">4 règles du Noon Sâkin et Tanwîn</span> : Idh-hâr, Idghâm, Iqlâb et Ikhfâ'.
            </p>
          </div>

          <div className="bg-gray-900/50 rounded-lg p-5">
            <p className="text-gray-300 mb-3">📝 <span className="font-semibold">Dans votre rédaction, citez un exemple pour chaque page :</span></p>
            <ul className="text-gray-400 space-y-2 ml-4">
              <li>• <span className="text-blue-300">Page 2</span> : Un exemple de Noon Sâkin ou Tanwîn</li>
              <li>• <span className="text-blue-300">Page 3</span> : Un exemple d'Idh-hâr (prononciation claire)</li>
              <li>• <span className="text-blue-300">Page 4</span> : Un exemple d'Idghâm (fusion)</li>
              <li>• <span className="text-blue-300">Page 5</span> : Un exemple d'Iqlâb (transformation en Mîm)</li>
              <li>• <span className="text-blue-300">Page 6</span> : Un exemple d'Ikhfâ' (dissimulation)</li>
            </ul>
          </div>

          <div className="mt-6 p-4 bg-amber-900/20 border border-amber-500/30 rounded-lg">
            <p className="text-amber-300 text-sm">
              ⚠️ Rendez votre travail dans la section <span className="font-semibold">Devoirs → Chapitre 2</span>
            </p>
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-8 flex justify-between items-center">
          <Link 
            href="/chapitres-tajwid/2/quiz"
            className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg transition-colors"
          >
            ← Retour au Quiz
          </Link>
          <Link 
            href="/chapitres-tajwid/introduction/3"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Chapitre suivant →
          </Link>
        </div>

        <footer className="text-center text-gray-500 mt-8 py-4 border-t border-gray-800">
          <p>© 2025 Tous droits réservés</p>
        </footer>
      </div>
    </div>
  );
};

export default Exercice2;
