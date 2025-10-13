"use client";

import React, { useState } from 'react';

// Mapping audio pour le Chapitre 1, Page 3
const chapter1Page3AudioMappings: { [key: string]: string } = {
  'ـا': 'chap0_pg0_case1',
  'ـبـ': 'chap0_pg0_case2',
  'ـتـ': 'chap0_pg0_case3',
  'ـثـ': 'chap0_pg0_case4',
  'ـجـ': 'chap0_pg0_case5',
  'ـحـ': 'chap0_pg0_case6',
  'ـخـ': 'chap0_pg0_case7',
  'ـد': 'chap0_pg0_case8',
  'ـذ': 'chap0_pg0_case9',
  'ـر': 'chap0_pg0_case10',
  'ـز': 'chap0_pg0_case11',
  'ـسـ': 'chap0_pg0_case12',
  'ـشـ': 'chap0_pg0_case13',
  'ـصـ': 'chap0_pg0_case14',
  'ـضـ': 'chap0_pg0_case15',
  'ـطـ': 'chap0_pg0_case16',
  'ـظـ': 'chap0_pg0_case17',
  'ـعـ': 'chap0_pg0_case18',
  'ـغـ': 'chap0_pg0_case19',
  'ـفـ': 'chap0_pg0_case20',
  'ـقـ': 'chap0_pg0_case21',
  'ـكـ': 'chap0_pg0_case22',
  'ـلـ': 'chap0_pg0_case23',
  'ـمـ': 'chap0_pg0_case24',
  'ـنـ': 'chap0_pg0_case25',
  'ـهـ': 'chap0_pg0_case26',
  'ـو': 'chap0_pg0_case27',
  'ـيـ': 'chap0_pg0_case28',
  'ء': 'chap0_pg0_case29'
};

// Liste des 6 lettres qui ne s'attachent jamais après elles
const nonConnectingLetters = ['ا', 'د', 'ذ', 'ر', 'ز', 'و'];

// Dictionnaire des mots exemples pour chaque lettre au MILIEU du mot
const letterExamplesMiddle: { [key: string]: { word: string; translation: string; targetIndex: number } } = {
  'ـا': { word: 'سَلام', translation: 'Paix', targetIndex: 2 },
  'ـبـ': { word: 'كِتاب', translation: 'Livre', targetIndex: 2 },
  'ـتـ': { word: 'بَيت', translation: 'Maison', targetIndex: 1 },
  'ـثـ': { word: 'مِثل', translation: 'Exemple', targetIndex: 1 },
  'ـجـ': { word: 'بَحْر', translation: 'Mer', targetIndex: 1 },
  'ـحـ': { word: 'سَهْل', translation: 'Facile', targetIndex: 1 },
  'ـخـ': { word: 'مَخْبَز', translation: 'Boulangerie', targetIndex: 1 },
  'ـد': { word: 'وَرْد', translation: 'Fleur', targetIndex: 2 },
  'ـذ': { word: 'نَذْر', translation: 'Vœu', targetIndex: 1 },
  'ـر': { word: 'قَمَر', translation: 'Lune', targetIndex: 2 },
  'ـز': { word: 'عِزَّة', translation: 'Fierté', targetIndex: 1 },
  'ـسـ': { word: 'قِسْم', translation: 'Section', targetIndex: 1 },
  'ـشـ': { word: 'فَصْل', translation: 'Saison', targetIndex: 1 },
  'ـصـ': { word: 'قَصَّة', translation: 'Histoire', targetIndex: 1 },
  'ـضـ': { word: 'مِضْرَب', translation: 'Bâton', targetIndex: 1 },
  'ـطـ': { word: 'بَطَّة', translation: 'Canard', targetIndex: 1 },
  'ـظـ': { word: 'حَظّ', translation: 'Chance', targetIndex: 1 },
  'ـعـ': { word: 'سَمْع', translation: 'Ouïe', targetIndex: 2 },
  'ـغـ': { word: 'بَغْدَاد', translation: 'Bagdad', targetIndex: 1 },
  'ـفـ': { word: 'سَفْر', translation: 'Voyage', targetIndex: 1 },
  'ـقـ': { word: 'وَقْت', translation: 'Temps', targetIndex: 1 },
  'ـكـ': { word: 'شَكْر', translation: 'Remerciement', targetIndex: 1 },
  'ـلـ': { word: 'جَبَل', translation: 'Montagne', targetIndex: 2 },
  'ـمـ': { word: 'كَلِمَة', translation: 'Mot', targetIndex: 2 },
  'ـنـ': { word: 'سُنَّة', translation: 'Tradition', targetIndex: 1 },
  'ـهـ': { word: 'مَهْد', translation: 'Berceau', targetIndex: 1 },
  'ـو': { word: 'نَوْم', translation: 'Sommeil', targetIndex: 1 },
  'ـيـ': { word: 'بَيْت', translation: 'Maison', targetIndex: 1 },
  'ء': { word: 'سَأَل', translation: 'Il a demandé', targetIndex: 1 }
};

const Page3 = () => {
  const playLetterAudio = (letter: string) => {
    const audioFileName = chapter1Page3AudioMappings[letter];
    if (audioFileName) {
      const audio = new Audio(`/audio/chapitre0_1/${audioFileName}.mp3`);
      audio.play().catch(error => {
        console.error('Erreur lors de la lecture audio:', error);
      });
    }
  };

  const letters = [
    // Row 1
    { letter: 'ـا', emphatic: false, violet: false },
    { letter: 'ـبـ', emphatic: false, violet: false },
    { letter: 'ـتـ', emphatic: false, violet: false },
    { letter: 'ـثـ', emphatic: false, violet: false },
    { letter: 'ـجـ', emphatic: false, violet: false },
    { letter: 'ـحـ', emphatic: false, violet: false },
    
    // Row 2
    { letter: 'ـخـ', emphatic: true, violet: false },
    { letter: 'ـد', emphatic: false, violet: false },
    { letter: 'ـذ', emphatic: false, violet: false },
    { letter: 'ـر', emphatic: true, violet: false },
    { letter: 'ـز', emphatic: false, violet: false },
    { letter: 'ـسـ', emphatic: false, violet: false },
    
    // Row 3
    { letter: 'ـشـ', emphatic: false, violet: false },
    { letter: 'ـصـ', emphatic: true, violet: false },
    { letter: 'ـضـ', emphatic: true, violet: false },
    { letter: 'ـطـ', emphatic: true, violet: false },
    { letter: 'ـظـ', emphatic: true, violet: false },
    { letter: 'ـعـ', emphatic: false, violet: false },
    
    // Row 4
    { letter: 'ـغـ', emphatic: true, violet: false },
    { letter: 'ـفـ', emphatic: false, violet: false },
    { letter: 'ـقـ', emphatic: true, violet: false },
    { letter: 'ـكـ', emphatic: false, violet: false },
    { letter: 'ـلـ', emphatic: false, violet: false },
    { letter: 'ـمـ', emphatic: false, violet: false },
    
    // Row 5
    { letter: 'ـنـ', emphatic: false, violet: false },
    { letter: 'ـهـ', emphatic: false, violet: false },
    { letter: 'ـو', emphatic: false, violet: false },
    { letter: 'ـيـ', emphatic: false, violet: false },
    { letter: 'ء', emphatic: false, violet: true },
  ];

  const handleLetterClick = (letter: string) => {
    playLetterAudio(letter);
  };

  return (
    <div className="font-arabic min-h-screen" style={{ direction: 'rtl' }}>
      <div className="w-full h-full bg-gray-900 overflow-hidden">
        {/* Header */}
        <div className="text-white p-6 text-center border-b-2">
          <div className="text-3xl font-bold mb-4">
            Leçon : lettres attachées au milieu d'un mot
          </div>
        </div>
        
        {/* Alphabet Grid */}
        <div className="p-8 bg-gray-900">
          <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-7 gap-4 mb-6">
            {letters.map((item, index) => (
              <Cell 
                key={index} 
                letter={item.letter}
                emphatic={item.emphatic}
                violet={item.violet}
                onClick={() => handleLetterClick(item.letter)}
              />
            ))}
          </div>
          
          {/* Légende */}
          <div className="bg-gray-800 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-400 rounded-full"></div>
                <span className="text-red-400">Lettres emphatiques</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-purple-400 rounded-full"></div>
                <span className="text-purple-400">Lettres spéciales</span>
              </div>
            </div>
          </div>
          
          {/* Footer */}
          <footer className="border-t-1 text-white text-center p-6 flex-shrink-0 font-semibold text-sm">
            <div>Page 3</div>
            <div className="mt-1">© 2025 Tous droits réservés</div>
          </footer>
        </div>
      </div>
    </div>
  );
};

// Popup Component
const InfoPopup = ({ letter, onClose }: { letter: string; onClose: () => void }) => {
  const isNonConnecting = nonConnectingLetters.includes(letter.replace('ـ', ''));
  const example = letterExamplesMiddle[letter] || { word: 'كَلِمَة', translation: 'Mot', targetIndex: 2 };

  // Affiche la lettre du milieu en rouge
  const renderColoredWord = (word: string, targetIndex: number) => {
    return word.split('').map((char, index) => (
      <span 
        key={index} 
        className={index === targetIndex ? 'text-red-400' : 'text-white'}
      >
        {char}
      </span>
    ));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-2 sm:p-4">
      <div 
        className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl sm:rounded-3xl p-4 sm:p-6 w-full max-w-[95vw] sm:max-w-md mx-2 shadow-2xl border-2 border-blue-500"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-3 sm:mb-4">
          <h3 className="text-lg sm:text-xl font-bold text-white">Connexion au milieu d'un mot</h3>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-white text-2xl sm:text-3xl font-bold leading-none"
          >
            &times;
          </button>
        </div>
        
        <div className="space-y-3 sm:space-y-4">
          {/* Lettre principale */}
          <div className="border rounded-xl p-3 sm:p-4 shadow-lg">
            <p className="text-white text-base sm:text-lg text-center">
              <span className="text-red-400 text-2xl sm:text-3xl font-bold mx-2">{letter}</span>
            </p>
          </div>
          
          {/* Lettre non connectante */}
          {isNonConnecting && (
            <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-xl p-2 sm:p-3 shadow-lg">
              <p className="text-white text-xs text-center font-semibold flex items-center justify-center gap-1">
                <span className="text-lg">⚠️</span>
                <span>Cette lettre fait partie des 6 lettres qui ne s'attacheront JAMAIS après elles : ا, د, ذ, ر, ز, و</span>
              </p>
            </div>
          )}
          
          {/* Exemple */}
          <div className="bg-gray-700 rounded-xl p-3 sm:p-4 shadow-lg">
            <p className="text-gray-300 text-xs mb-2 text-center">📖 Exemple :</p>
            <div className="bg-gray-800 rounded-lg p-3 sm:p-4 mb-2">
              <div className="text-3xl sm:text-4xl font-bold text-center" style={{ direction: 'rtl' }}>
                {renderColoredWord(example.word, example.targetIndex)}
              </div>
            </div>
            
            <div className="bg-blue-900 bg-opacity-40 rounded-lg p-2 sm:p-3 border-2 border-blue-500">
              <p className="text-white text-lg sm:text-xl font-bold text-center">
                {example.translation}
              </p>
            </div>
          </div>
          
          {/* Info supplémentaire */}
          <div className="bg-gradient-to-r from-yellow-600 to-orange-600 rounded-xl p-2 sm:p-3 shadow-lg">
            <p className="text-white text-xs text-center font-semibold flex items-center justify-center gap-1">
              <span className="text-lg">💡</span>
              <span>
                {isNonConnecting 
                  ? "Cette lettre ne se connecte pas à la lettre suivante, donc sa forme reste identique au milieu du mot."
                  : "La lettre est connectée aux lettres précédente et suivante, donc sa forme change. C'est pour cela qu'on parle de 'lettre au milieu d'un mot' : cela fait référence à la manière dont elle s'écrit au milieu d'un mot."
                }
              </span>
            </p>
          </div>
        </div>
        
        <button 
          onClick={onClose}
          className="mt-4 sm:mt-6 w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-2 sm:py-3 rounded-lg transition-all transform hover:scale-105 shadow-lg text-base"
        >
          ✓ Compris !
        </button>
      </div>
    </div>
  );
};

// Cellule de la grille
const Cell = ({ letter, emphatic, violet, onClick }: { 
  letter: string;
  emphatic?: boolean;
  violet?: boolean;
  onClick?: () => void;
}) => {
  const [showPopup, setShowPopup] = useState(false);
  const hasInfo = true;

  return (
    <>
      <div 
        className="bg-gray-900 border border-zinc-500 rounded-xl p-4 text-center min-h-[100px] flex flex-col justify-center items-center hover:bg-zinc-700 transition-all duration-300 hover:scale-105 cursor-pointer relative"
        onClick={onClick}
      >
        <div className={`text-3xl md:text-4xl font-bold transition-colors ${
          emphatic ? 'text-red-400' : 
          violet ? 'text-purple-400' : 
          'text-white'
        }`}>
          {letter}
        </div>
        
        {hasInfo && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowPopup(true);
            }}
            className="absolute bottom-2 right-2 w-7 h-7 rounded-full flex items-center justify-center text-sm transition-all hover:scale-110"
            title="Plus d'infos"
          >
            ℹ️
          </button>
        )}
      </div>
      
      {showPopup && <InfoPopup letter={letter} onClose={() => setShowPopup(false)} />}
    </>
  );
};

export default Page3;
