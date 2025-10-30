"use client";

import React, { useState } from 'react';
import { Info, X } from 'lucide-react';

// ✅ Audio mappings
const chapter0Page0AudioMappings: { [key: string]: string } = {
  'ا': 'chap0_pg0_case1','ب': 'chap0_pg0_case2','ت': 'chap0_pg0_case3','ث': 'chap0_pg0_case4',
  'ج': 'chap0_pg0_case5','ح': 'chap0_pg0_case6','خ': 'chap0_pg0_case7','د': 'chap0_pg0_case8',
  'ذ': 'chap0_pg0_case9','ر': 'chap0_pg0_case10','ز': 'chap0_pg0_case11','س': 'chap0_pg0_case12',
  'ش': 'chap0_pg0_case13','ص': 'chap0_pg0_case14','ض': 'chap0_pg0_case15','ط': 'chap0_pg0_case16',
  'ظ': 'chap0_pg0_case17','ع': 'chap0_pg0_case18','غ': 'chap0_pg0_case19','ف': 'chap0_pg0_case20',
  'ق': 'chap0_pg0_case21','ك': 'chap0_pg0_case22','ل': 'chap0_pg0_case23','م': 'chap0_pg0_case24',
  'ن': 'chap0_pg0_case25','ه': 'chap0_pg0_case26','و': 'chap0_pg0_case27','ي': 'chap0_pg0_case28',
  'ء': 'chap0_pg0_case29','ة': 'chap0_pg0_case30'
};

// ✅ Phonétique + explication (conservé)
const associations: { [key: string]: { phonetique: string; explication: string } } = {
  'ا': { phonetique: 'Alif', explication: 'Nom de la lettre' },
  'ب': { phonetique: 'Baa', explication: 'Nom de la lettre' },
  'ت': { phonetique: 'Taa', explication: 'Nom de la lettre' },
  'ث': { phonetique: 'Thaa', explication: 'Nom de la lettre' },
  'ج': { phonetique: 'Djiim', explication: 'Nom de la lettre' },
  'ح': { phonetique: 'Haa', explication: 'Nom de la lettre' },
  'خ': { phonetique: 'Khaa (prononciation avec un son grave)', explication: 'Nom de la lettre' },
  'د': { phonetique: 'Daal', explication: 'Nom de la lettre' },
  'ذ': { phonetique: 'Dhaal', explication: 'Nom de la lettre' },
  'ر': { phonetique: 'Raa (prononciation avec un son grave)', explication: 'Nom de la lettre' },
  'ز': { phonetique: 'Zaa', explication: 'Nom de la lettre' },
  'س': { phonetique: 'Siin', explication: 'Nom de la lettre' },
   'ش': { phonetique: 'Chiin', explication: 'Nom de la lettre' },
  'ص': { phonetique: 'Saad (prononciation avec un son grave)', explication: 'Nom de la lettre' },
  'ض': { phonetique: 'Daad (prononciation avec un son grave)', explication: 'Nom de la lettre' },
  'ط': { phonetique: 'Taa (prononciation avec un son grave)', explication: 'Nom de la lettre' },
  'ظ': { phonetique: 'Dhaa (prononciation avec un son grave)', explication: 'Nom de la lettre' },
  'ع': { phonetique: 'ʿAine', explication: 'Nom de la lettre' },
  'غ': { phonetique: 'Ghayne (prononciation avec un son grave)', explication: 'Nom de la lettre' },
  'ف': { phonetique: 'Faa', explication: 'Nom de la lettre' },
  'ق': { phonetique: 'Qaaf (prononciation avec un son grave)', explication: 'Nom de la lettre' },
  'ك': { phonetique: 'Kaaf', explication: 'Nom de la lettre' },
  'ل': { phonetique: 'Laam', explication: 'Nom de la lettre' },
  'م': { phonetique: 'Miim', explication: 'Nom de la lettre' },
  'ن': { phonetique: 'Noun', explication: 'Nom de la lettre' },
  'ه': { phonetique: 'Haa', explication: 'Nom de la lettre' },
  'و': { phonetique: 'Waaw', explication: 'Nom de la lettre' },
  'ي': { phonetique: 'Yaa', explication: 'Nom de la lettre' },
  'ء': { phonetique: 'Hamza', explication: 'Lettre auxiliaire' },
  'ة': { phonetique: 'Taa', explication: 'Lettre auxiliaire' }
};

// ✅ Images pour les lettres
const letterImages: { [key: string]: string } = {
  'ا': '/img/lettres/alif.png',
  'ب': '/img/lettres/baa.png',
  'ت': '/img/lettres/taa.png',
  'ث': '/img/lettres/thaa.png',
  'ج': '/img/lettres/jiim.png',
  'ح': '/img/lettres/haa.png',
  'خ': '/img/lettres/khaa.png',
  'د': '/img/lettres/daal.png',
  'ذ': '/img/lettres/dhaal.png',
  'ر': '/img/lettres/raa.png',
  'ز': '/img/lettres/zaa.png',
  'س': '/img/lettres/siin.png',
  'ش': '/img/lettres/shiin.png',
  'ص': '/img/lettres/saad.png',
  'ض': '/img/lettres/daad.png',
  'ط': '/img/lettres/taa_grave.png',
  'ظ': '/img/lettres/dhaa_grave.png',
  'ع': '/img/lettres/ain.png',
  'غ': '/img/lettres/ghayn.png',
  'ف': '/img/lettres/faa.png',
  'ق': '/img/lettres/qaaf.png',
  'ك': '/img/lettres/kaaf.png',
  'ل': '/img/lettres/laam.png',
  'م': '/img/lettres/miim.png',
  'ن': '/img/lettres/noun.png',
  'ه': '/img/lettres/haa2.png',
  'و': '/img/lettres/waaw.png',
  'ي': '/img/lettres/yaa.png',
  'ء': '/img/lettres/haa2.png',
  'ة': '/img/lettres/taa.png',
};

// ✅ Nouveaux popups pour prononciation
const pronunciationInfo: { [key: string]: { mot: string; emoji?: string } } = {
  'ا': { mot: '(A)beille', emoji: '🐝' },
  'ب': { mot: '(Ba)teau', emoji: '🚤' },
  'ت': { mot: '(Ta)rte', emoji: '🥧' },
  'ث': { mot: '(Th)ink (le verbe penser en Anglais)' },
  'ج': { mot: '(J)ean en anglais', emoji: '👖' },
  'ح': { mot: '(Ha)mdou dans le mot al hamdoulilah' },
  'خ': { mot: '(Ra)teau', emoji: '🧹' },
  'د': { mot: "Dell : marque d'ordinateur", emoji: '💻' },
  'ذ': { mot: '(Tha)t (pronom démonstratif: ce/cette/cela)' },
  'ر': { mot: 'Escoba(r) (R roulé en Espagnol)' },
  'ز': { mot: '(Za)ra', emoji: '👗' },
  'س': { mot: '(Si)gne' },
  'ش': { mot: 'Chine (bout de la langue derrière les dents du bas)' },
  'ص': { mot: "Bout de la langue derrière les dents du bas à écouter bien l'audio en immitant" },
  'ض': { mot: "Langue entière collée sur tout le palais en bloquant l'air (les joues doivent se gonfler avant la prononciation de la lettre) à écouter bien l'audio en immitant" },
  'ط': { mot: "Même sortie que la lettre [Ta], mais en la prononçant d'une façon lourde et grave à écouter bien l'audio en immitant" },
  'ظ': { mot: "Comme 'that' en Anglais, mais en rendant la lettre grave tout en freinant l'air avec la langue contre les incisives supérieures (les joues doivent normalement gonfler avant la sortie de la lettre)" },
  'ع': { mot: "Vibration en haut de la pomme d'Adam à écouter bien l'audio en immitant" },
  'غ': { mot: "Gargouillis dans la gorge après s'être brossé les dents à écouter bien l'audio en immitant" },
  'ف': { mot: 'Farine' },
  'ق': { mot: "Le fond de la langue doit entrer en contact avec le fond du palais, comme une personne qui toque à la porte : on doit sentir un petit claquement. à écouter bien l'audio en immitant" },
  'ك': { mot: 'Cave' },
  'ل': { mot: 'Lame' },
  'م': { mot: "Mimi (la parole d'une personne qui trouve mignon une chose ou une personne (c'est mimi ou tu es mimi)" },
  'ن': { mot: 'Nounours', emoji: '🐻' },
  'ه': { mot: "Air d'un bâillement à écouter bien l'audio en immitant" },
  'و': { mot: "Waww (en anglais, quand on est étonné(e))" },
  'ي': { mot: 'Yaourt' },
  'ء': { mot: "Prénom : Hamzah" },
  'ة': { mot: 'Tarte', emoji: '🥧' },
};

// ✅ Seules les lettres (affichage simplifié)
const allLetters = Object.keys(associations);

// ✅ Sons graves (rouge)
const emphaticLetters = ['خ', 'ر', 'ص', 'ض', 'ط', 'ظ', 'غ', 'ق'];

// ✅ Lettres auxiliaires (violet)
const auxiliaryLetters = ['ء', 'ة'];

const Page0 = () => {
  const [openPopup, setOpenPopup] = useState<string | null>(null);

  const playLetterAudio = (letter: string) => {
    const audioFileName = chapter0Page0AudioMappings[letter];
    if (audioFileName) {
      const audio = new Audio(`/audio/chapitre0_1/${audioFileName}.mp3`);
      audio.play();
    }
  };

  return (
    <div className="font-arabic min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 text-white p-4 md:p-6 space-y-6">
      
      {/* ✅ Titre + instruction */}
      <div className="text-center border-b-2 p-6">
        <div className="text-3xl font-bold mb-2">Leçon : Prononciation des lettres arabes</div>
        <div className="text-lg text-amber-300">Cliquez pour écouter chaque lettre et répétez après.</div>
      </div>

      {/* ✅ Légende */}
      <div className="text-center text-sm text-gray-300">
        <span className="text-red-400 font-bold">Lettres rouges = sons graves</span> |{" "}
        <span className="text-purple-400 font-bold">Lettres violettes = lettres auxiliaires (qui ne font pas partie des lettres de l'alphabet)</span>
      </div>

      {/* ✅ Liste des lettres */}
      <div className="space-y-4">
        {allLetters.map((letter, index) => {
          const assoc = associations[letter];
          const pronInfo = pronunciationInfo[letter];
          
          return (
            <div
              key={index}
              className="bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded-xl p-4 cursor-pointer transition flex items-center gap-4 relative"
            >
              <div onClick={() => playLetterAudio(letter)} className="flex items-center gap-4 flex-1">
                <span
                  className="text-4xl font-bold"
                  style={{
                    color: auxiliaryLetters.includes(letter)
                      ? '#A855F7' // violet
                      : emphaticLetters.includes(letter)
                      ? '#F87171' // rouge
                      : 'white'
                  }}
                >
                  {letter}
                </span>

                {/* ✅ Phonétique + explication (conservé) */}
                <div>
                  <div className="text-xl font-bold text-amber-300 px-2 py-1 bg-amber-900/20 rounded">
                    {assoc.phonetique}
                  </div>
                  <div className="text-sm text-gray-400">
                    → {assoc.explication}
                  </div>
                </div>
              </div>

              {/* ✅ Icône info pour ouvrir popup */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenPopup(letter);
                }}
                className="p-2 hover:bg-gray-600 rounded-full transition"
                aria-label="Information de prononciation"
              >
                <Info className="w-6 h-6 text-blue-400" />
              </button>
            </div>
          );
        })}
      </div>

      {/* ✅ Popup responsive */}
      {openPopup && (
        <div 
          className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50"
          onClick={() => setOpenPopup(null)}
        >
          <div 
            className="bg-gray-800 rounded-2xl p-6 max-w-lg w-full border-2 border-amber-500 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <span 
                  className="text-5xl font-bold"
                  style={{
                    color: auxiliaryLetters.includes(openPopup)
                      ? '#A855F7'
                      : emphaticLetters.includes(openPopup)
                      ? '#F87171'
                      : 'white'
                  }}
                >
                  {openPopup}
                </span>
                <div className="text-2xl font-bold text-amber-300">
                  {associations[openPopup].phonetique}
                </div>
              </div>
              <button
                onClick={() => setOpenPopup(null)}
                className="p-2 hover:bg-gray-700 rounded-full transition"
              >
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>

            {/* ✅ AJOUT: Image de la lettre */}
            <div className="flex justify-center my-4">
              <img 
                src={letterImages[openPopup]} 
                alt={`Lettre ${openPopup}`}
                className="max-w-[200px] max-h-[150px] object-contain rounded-lg bg-white p-2"
                onError={(e) => {
                  // Fallback si l'image ne charge pas
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            </div>

            <div className="space-y-4">
              <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
                <h3 className="text-lg font-bold text-amber-400 mb-2">
                 Technique de prononciation approximative — se référer toujours au son et à l’image. 
                </h3>
                <div className="text-white text-base leading-relaxed flex items-center gap-2">
                  {pronunciationInfo[openPopup]?.emoji && (
                    <span className="text-3xl">{pronunciationInfo[openPopup].emoji}</span>
                  )}
                  <span>{pronunciationInfo[openPopup]?.mot}</span>
                </div>
              </div>

              <button
                onClick={() => playLetterAudio(openPopup)}
                className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 px-4 rounded-lg transition"
              >
                🔊 Appuie pour écouter le son de la lettre
              </button>
            </div>
          </div>
        </div>
      )}

      <footer className="text-center text-gray-400 text-sm py-6">
        © 2025 - Page 0 - الصَّفْحَة ٠
      </footer>
    </div>
  );
};

export default Page0;