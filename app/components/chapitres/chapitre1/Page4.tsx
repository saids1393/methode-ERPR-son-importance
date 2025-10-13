"use client";

import React, { useState } from 'react';

// Mapping audio pour le Chapitre 1, Page 4
const chapter1Page4AudioMappings: { [key: string]: string } = {
  'ـا': 'chap0_pg0_case1',
  'ـب': 'chap0_pg0_case2',
  'ـت': 'chap0_pg0_case3',
  'ـث': 'chap0_pg0_case4',
  'ـج': 'chap0_pg0_case5',
  'ـح': 'chap0_pg0_case6',
  'ـخ': 'chap0_pg0_case7',
  'ـد': 'chap0_pg0_case8',
  'ـذ': 'chap0_pg0_case9',
  'ـر': 'chap0_pg0_case10',
  'ـز': 'chap0_pg0_case11',
  'ـس': 'chap0_pg0_case12',
  'ـش': 'chap0_pg0_case13',
  'ـص': 'chap0_pg0_case14',
  'ـض': 'chap0_pg0_case15',
  'ـط': 'chap0_pg0_case16',
  'ـظ': 'chap0_pg0_case17',
  'ـع': 'chap0_pg0_case18',
  'ـغ': 'chap0_pg0_case19',
  'ـف': 'chap0_pg0_case20',
  'ـق': 'chap0_pg0_case21',
  'ـك': 'chap0_pg0_case22',
  'ـل': 'chap0_pg0_case23',
  'ـم': 'chap0_pg0_case24',
  'ـن': 'chap0_pg0_case25',
  'ـه': 'chap0_pg0_case26',
  'ـو': 'chap0_pg0_case27',
  'ـي': 'chap0_pg0_case28',
  'ء': 'chap0_pg0_case29',
  'ـة': 'chap0_pg0_case30'
};

// Liste des 6 lettres qui ne s'attachent jamais après elles
const nonConnectingLetters = ['ا', 'د', 'ذ', 'ر', 'ز', 'و'];

// Dictionnaire des mots exemples pour chaque lettre en FIN de mot
const letterExamples: { [key: string]: { word: string; translation: string } } = {
  'ـا': { word: 'عصا', translation: 'Bâton' },
  'ـب': { word: 'كتاب', translation: 'Livre' },
  'ـت': { word: 'بيت', translation: 'Maison' },
  'ـث': { word: 'أث', translation: 'Relique' },
  'ـج': { word: 'برج', translation: 'Tour' },
  'ـح': { word: 'مفتاح', translation: 'Clé' },
  'ـخ': { word: 'سقف', translation: 'Toit' },
  'ـد': { word: 'بلد', translation: 'Pays' },
  'ـذ': { word: 'قرض', translation: 'Prêt' },
  'ـر': { word: 'بحر', translation: 'Mer' },
  'ـز': { word: 'عز', translation: 'Gloire' },
  'ـس': { word: 'قوس', translation: 'Arc' },
  'ـش': { word: 'نش', translation: 'Énergie' },
  'ـص': { word: 'قص', translation: 'Couper' },
  'ـض': { word: 'قبض', translation: 'Saisir' },
  'ـط': { word: 'خط', translation: 'Ligne' },
  'ـظ': { word: 'حفظ', translation: 'Mémoriser' },
  'ـع': { word: 'سمع', translation: 'Ouïe' },
  'ـغ': { word: 'بغ', translation: 'Désir' },
  'ـف': { word: 'خروف', translation: 'Mouton' },
  'ـق': { word: 'طلق', translation: 'Libérer' },
  'ـك': { word: 'ملك', translation: 'Roi' },
  'ـل': { word: 'جبل', translation: 'Montagne' },
  'ـم': { word: 'قلم', translation: 'Crayon' },
  'ـن': { word: 'وطن', translation: 'Patrie' },
  'ـه': { word: 'وجه', translation: 'Visage' },
  'ـو': { word: 'عرو', translation: 'Proposer' },
  'ـي': { word: 'دمي', translation: 'Mon sang' },
  'ء': { word: 'سماء', translation: 'Ciel' },
  'ـة': { word: 'سيارة', translation: 'Voiture' }
};

const Page4 = () => {
  // Fonction pour jouer l'audio avec le mapping spécifique
  const playLetterAudio = (letter: string) => {
    const audioFileName = chapter1Page4AudioMappings[letter];
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
    { letter: 'ـب', emphatic: false, violet: false },
    { letter: 'ـت', emphatic: false, violet: false },
    { letter: 'ـث', emphatic: false, violet: false },
    { letter: 'ـج', emphatic: false, violet: false },
    { letter: 'ـح', emphatic: false, violet: false },
    
    // Row 2
    { letter: 'ـخ', emphatic: true, violet: false },
    { letter: 'ـد', emphatic: false, violet: false },
    { letter: 'ـذ', emphatic: false, violet: false },
    { letter: 'ـر', emphatic: true, violet: false },
    { letter: 'ـز', emphatic: false, violet: false },
    { letter: 'ـس', emphatic: false, violet: false },
    
    // Row 3
    { letter: 'ـش', emphatic: false, violet: false },
    { letter: 'ـص', emphatic: true, violet: false },
    { letter: 'ـض', emphatic: true, violet: false },
    { letter: 'ـط', emphatic: true, violet: false },
    { letter: 'ـظ', emphatic: true, violet: false },
    { letter: 'ـع', emphatic: false, violet: false },
    
    // Row 4
    { letter: 'ـغ', emphatic: true, violet: false },
    { letter: 'ـف', emphatic: false, violet: false },
    { letter: 'ـق', emphatic: true, violet: false },
    { letter: 'ـك', emphatic: false, violet: false },
    { letter: 'ـل', emphatic: false, violet: false },
    { letter: 'ـم', emphatic: false, violet: false },
    
    // Row 5
    { letter: 'ـن', emphatic: false, violet: false },
    { letter: 'ـه', emphatic: false, violet: false },
    { letter: 'ـو', emphatic: false, violet: false },
    { letter: 'ـي', emphatic: false, violet: false },
    { letter: 'ء', emphatic: false, violet: true },
    { letter: 'ـة', emphatic: false, violet: true }
  ];

  const handleLetterClick = (letter: string) => {
    playLetterAudio(letter);
  };

  return (
    <div className="font-arabic min-h-screen bg-gray-900" style={{ direction: 'rtl' }}>
      <div className="w-full h-full overflow-hidden bg-gray-900">
        {/* Header */}
        <div className="text-white p-6 text-center border-b-2">
          <div className="text-3xl font-bold mb-4">
            Leçon : lettres attachées à la fin d'un mot
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
          
          {/* Légende simplifiée */}
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
            <div>Page 4</div>
            <div className="mt-1">© 2025 Tous droits réservés</div>
          </footer>
        </div>
      </div>
    </div>
  );
};

// Popup Component - ADAPTÉ pour les lettres en FIN de mot
const InfoPopup = ({ letter, onClose }: { letter: string; onClose: () => void }) => {
  // Nettoyer la lettre pour vérifier si elle est non-attachante
  const cleanLetter = letter.replace('ـ', '');
  const isNonConnecting = nonConnectingLetters.includes(cleanLetter);
  const example = letterExamples[letter] || { word: 'كلمة', translation: 'Mot' };
  
  // Fonction pour diviser le mot arabe en lettres pour l'affichage coloré
  const renderColoredWord = (word: string, targetLetter: string) => {
    // Nettoyer la lettre cible des caractères de connexion
    const cleanTargetLetter = targetLetter.replace('ـ', '');
    
    return word.split('').map((char, index) => {
      // Pour l'alif, on vérifie aussi les formes similaires
      const isTarget = cleanTargetLetter === 'ا' 
        ? (char === 'ا' || char === 'أ' || char === 'إ' || char === 'آ')
        : char === cleanTargetLetter;
      
      return (
        <span 
          key={index} 
          className={isTarget ? 'text-red-400' : 'text-white'}
        >
          {char}
        </span>
      );
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-2 sm:p-4">
      <div 
        className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl sm:rounded-3xl p-4 sm:p-6 w-full max-w-[95vw] sm:max-w-md mx-2 shadow-2xl border-2 border-blue-500"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-3 sm:mb-4">
          <h3 className="text-lg sm:text-xl font-bold text-white">Connexion à la fin d'un mot</h3>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-white text-2xl sm:text-3xl font-bold leading-none"
          >
            &times;
          </button>
        </div>
        
        <div className="space-y-3 sm:space-y-4">
          {/* Explication simple */}
          <div className="border rounded-xl p-3 sm:p-4 shadow-lg">
            <p className="text-white text-base sm:text-lg text-center">
              <span className="text-red-400 text-2xl sm:text-3xl font-bold mx-2">{letter}</span>
            </p>
          </div>
          
          {/* Information spéciale pour les lettres non-attachantes */}
          {isNonConnecting && (
            <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-xl p-2 sm:p-3 shadow-lg">
              <p className="text-white text-xs text-center font-semibold flex items-center justify-center gap-1">
                <span className="text-lg">⚠️</span>
                <span>Cette lettre fait partie des 6 lettres qui ne s'attacheront JAMAIS avant elles : ا, د, ذ, ر, ز, و</span>
              </p>
            </div>
          )}
          
          {/* Exemple en arabe */}
          <div className="bg-gray-700 rounded-xl p-3 sm:p-4 shadow-lg">
            <p className="text-gray-300 text-xs mb-2 text-center">📖 Exemple en fin de mot</p>
            <div className="bg-gray-800 rounded-lg p-3 sm:p-4 mb-2">
              <div className="text-3xl sm:text-4xl font-bold text-center" style={{ direction: 'rtl' }}>
                {renderColoredWord(example.word, letter)}
              </div>
            </div>
            
            {/* Traduction française séparée */}
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
                  ? "Cette lettre ne se connecte pas à la lettre précédente, donc sa forme reste identique en fin de mot"
                  : "La lettre est connectée à la lettre précédente, donc sa forme change. C'est pour cela qu'on parle de 'lettre en fin de mot' : cela fait référence à la manière dont elle s'écrit à la fin d'un mot"
                }
              </span>
            </p>
          </div>
        </div>
        
        <button 
          onClick={onClose}
          className="mt-4 sm:mt-6 w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-2 sm:py-3 rounded-lg transition-all transform hover:scale-105 shadow-lg text-base"
        >
          ✓ Compris
        </button>
      </div>
    </div>
  );
};

// Cell Component adapté pour le thème sombre - MODIFIÉ pour toutes les lettres
const Cell = ({ letter, emphatic, violet, onClick }: { 
  letter: string; 
  emphatic?: boolean;
  violet?: boolean;
  onClick?: () => void;
}) => {
  const [showPopup, setShowPopup] = useState(false);
  
  // Maintenant TOUTES les lettres ont le popup d'information
  const hasInfo = true;

  return (
    <>
      <div 
        className="border border-zinc-500 rounded-xl p-4 text-center min-h-[100px] flex flex-col justify-center items-center hover:bg-zinc-700 transition-all duration-300 hover:scale-105 cursor-pointer relative"
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

export default Page4;