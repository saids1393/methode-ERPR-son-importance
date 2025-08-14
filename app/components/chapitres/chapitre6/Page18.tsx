"use client";

import React from 'react';
import { useAudio } from '@/hooks/useAudio';

const noConnect = ['ا', 'د', 'ذ', 'ر', 'ز', 'و'];
// Mapping audio pour le Chapitre 6, Page 18 (lettres de prolongation)
const chapter6Page18AudioMappings: { [key: string]: string } = {
  // Ba avec prolongations
  'بَـا': 'chap6_pg18_case1',
  'بُـو': 'chap6_pg18_case2',
  'بِـي': 'chap6_pg18_case3',
  
  // Ta avec prolongations
  'تَـا': 'chap6_pg18_case4',
  'تُـو': 'chap6_pg18_case5',
  'تِـي': 'chap6_pg18_case6',
  
  // Tha avec prolongations
  'ثَـا': 'chap6_pg18_case7',
  'ثُـو': 'chap6_pg18_case8',
  'ثِـي': 'chap6_pg18_case9',
  
  // Jim avec prolongations
  'جَـا': 'chap6_pg18_case10',
  'جُـو': 'chap6_pg18_case11',
  'جِـي': 'chap6_pg18_case12',
  
  // Ha avec prolongations
  'حَـا': 'chap6_pg18_case13',
  'حُـو': 'chap6_pg18_case14',
  'حِـي': 'chap6_pg18_case15',
  
  // Kha avec prolongations
  'خَـا': 'chap6_pg18_case16',
  'خُـو': 'chap6_pg18_case17',
  'خِـي': 'chap6_pg18_case18',
  
  // Dal avec prolongations
  'دَـا': 'chap6_pg18_case19',
  'دُـو': 'chap6_pg18_case20',
  'دِـي': 'chap6_pg18_case21',
  
  // Dhal avec prolongations
  'ذَـا': 'chap6_pg18_case22',
  'ذُـو': 'chap6_pg18_case23',
  'ذِـي': 'chap6_pg18_case24',
  
  // Ra avec prolongations
  'رَـا': 'chap6_pg18_case25',
  'رُـو': 'chap6_pg18_case26',
  'رِـي': 'chap6_pg18_case27',
  
  // Zay avec prolongations
  'زَـا': 'chap6_pg18_case28',
  'زُـو': 'chap6_pg18_case29',
  'زِـي': 'chap6_pg18_case30',
  
  // Sin avec prolongations
  'سَـا': 'chap6_pg18_case31',
  'سُـو': 'chap6_pg18_case32',
  'سِـي': 'chap6_pg18_case33',
  
  // Shin avec prolongations
  'شَـا': 'chap6_pg18_case34',
  'شُـو': 'chap6_pg18_case35',
  'شِـي': 'chap6_pg18_case36',
  
  // Sad avec prolongations
  'صَـا': 'chap6_pg18_case37',
  'صُـو': 'chap6_pg18_case38',
  'صِـي': 'chap6_pg18_case39',
  
  // Dad avec prolongations
  'ضَـا': 'chap6_pg18_case40',
  'ضُـو': 'chap6_pg18_case41',
  'ضِـي': 'chap6_pg18_case42',
  
  // Ta emphatic avec prolongations
  'طَـا': 'chap6_pg18_case43',
  'طُـو': 'chap6_pg18_case44',
  'طِـي': 'chap6_pg18_case45',
  
  // Dha emphatic avec prolongations
  'ظَـا': 'chap6_pg18_case46',
  'ظُـو': 'chap6_pg18_case47',
  'ظِـي': 'chap6_pg18_case48',
  
  // Ayn avec prolongations
  'عَـا': 'chap6_pg18_case49',
  'عُـو': 'chap6_pg18_case50',
  'عِـي': 'chap6_pg18_case51',
  
  // Ghayn avec prolongations
  'غَـا': 'chap6_pg18_case52',
  'غُـو': 'chap6_pg18_case53',
  'غِـي': 'chap6_pg18_case54'
};

const Page18 = () => {
  // Fonction pour jouer l'audio avec le mapping spécifique
const playLetterAudio = (vowelLetter: string) => {
  const audioFileName = chapter6Page18AudioMappings[vowelLetter];
  if (audioFileName) {
    const audio = new Audio(`/audio/${audioFileName}.mp3`);
    audio.play().catch(error => {
      console.error('Erreur lors de la lecture audio:', error);
    });
  }
};

  // Toutes les combinaisons déjà fusionnées (base + prolongation)
  const words = [
    'بَـا', 'بُـو', 'بِـي',
    'تَـا', 'تُـو', 'تِـي',
    'ثَـا', 'ثُـو', 'ثِـي',
    'جَـا', 'جُـو', 'جِـي',
    'حَـا', 'حُـو', 'حِـي',
    'خَـا', 'خُـو', 'خِـي',
    'دَـا', 'دُـو', 'دِـي',
    'ذَـا', 'ذُـو', 'ذِـي',
    'رَـا', 'رُـو', 'رِـي',
    'زَـا', 'زُـو', 'زِـي',
    'سَـا', 'سُـو', 'سِـي',
    'شَـا', 'شُـو', 'شِـي',
    'صَـا', 'صُـو', 'صِـي',
    'ضَـا', 'ضُـو', 'ضِـي',
    'طَـا', 'طُـو', 'طِـي',
    'ظَـا', 'ظُـو', 'ظِـي',
    'عَـا', 'عُـو', 'عِـي',
    'غَـا', 'غُـو', 'غِـي',
  ];

// Modifier handleLetterClick pour utiliser la nouvelle fonction
const handleLetterClick = (vowelLetter: string) => {
  playLetterAudio(vowelLetter);
};

  function handleWordClick(word: string): void {
    throw new Error('Function not implemented.');
  }

  return (
    <div className="font-arabic min-h-screen" style={{ direction: 'rtl' }}>
      <div className="w-full h-full bg-zinc-900 overflow-hidden">
        {/* En-tête */}
        <div className="bg-arabic-gradient text-white p-6 text-center">
          <div className="text-3xl md:text-3xl font-bold">
            Leçon : les trois lettres de prolongation
          </div>
        </div>

        {/* Contenu */}
        <div className="p-8 bg-zinc-900">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-8">
              {words.map((word, index) => (
                <ProlongationCard key={index} word={word} onClick={() => handleWordClick(word)} />
              ))}
            </div>
          </div>
        </div>

        {/* Pied de page */}
        <footer className="bg-zinc-800 text-white text-center p-6 flex-shrink-0 font-semibold text-sm">
          <div>Page 18</div>
          <div className="mt-1">© 2025 Tous droits réservés</div>
        </footer>
      </div>
    </div>
  );
};

// Composant carte affichant un mot arabe
const ProlongationCard = ({ word, onClick }: { word: string; onClick?: () => void }) => {
  // Extraire les caractères arabes sans les diacritiques (juste pour détecter la base et la prolongation)
  const arabicLetters = [...word.replace(/[^\u0600-\u06FF]/g, '')];

  const lettreBase = arabicLetters[0];
  const prolongation = arabicLetters[arabicLetters.length - 1];

  // Vérifier si la lettre de base ne connecte pas à la suivante
  const isNoConnect = noConnect.includes(lettreBase);

  // Si la lettre ne connecte pas, retirer le tatweel (ـ) pour que la prolongation soit isolée
  const displayWord = isNoConnect ? word.replace(/ـ/g, '') : word;

  return (
    <div 
      className="bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-center hover:bg-zinc-700 transition-all duration-300 group min-h-[90px] flex items-center justify-center cursor-pointer"
      onClick={onClick}
    >
      <div
        className="text-2xl md:text-3xl font-bold leading-relaxed text-white group-hover:scale-105 transition-transform duration-300 break-keep"
        dir="rtl"
        lang="ar"
        style={{ fontFeatureSettings: '"calt" 1, "liga" 1' }}
      >
        {displayWord}
      </div>
    </div>
  );
};

export default Page18;
