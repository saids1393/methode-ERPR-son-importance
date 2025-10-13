"use client";

import React, { useState } from 'react';

// Mapping audio pour le Chapitre 1, Page 2
const chapter1Page2AudioMappings: { [key: string]: string } = {
  'ا': 'chap0_pg0_case1',
  'بـ': 'chap0_pg0_case2',
  'تـ': 'chap0_pg0_case3',
  'ثـ': 'chap0_pg0_case4',
  'جـ': 'chap0_pg0_case5',
  'حـ': 'chap0_pg0_case6',
  'خـ': 'chap0_pg0_case7',
  'د': 'chap0_pg0_case8',
  'ذ': 'chap0_pg0_case9',
  'ر': 'chap0_pg0_case10',
  'ز': 'chap0_pg0_case11',
  'سـ': 'chap0_pg0_case12',
  'شـ': 'chap0_pg0_case13',
  'صـ': 'chap0_pg0_case14',
  'ضـ': 'chap0_pg0_case15',
  'طـ': 'chap0_pg0_case16',
  'ظـ': 'chap0_pg0_case17',
  'عـ': 'chap0_pg0_case18',
  'غـ': 'chap0_pg0_case19',
  'فـ': 'chap0_pg0_case20',
  'قـ': 'chap0_pg0_case21',
  'كـ': 'chap0_pg0_case22',
  'لـ': 'chap0_pg0_case23',
  'مـ': 'chap0_pg0_case24',
  'نـ': 'chap0_pg0_case25',
  'هـ': 'chap0_pg0_case26',
  'و': 'chap0_pg0_case27',
  'يـ': 'chap0_pg0_case28',
  'ء': 'chap0_pg0_case29'
};

// Liste des 6 lettres qui ne s'attachent jamais après elles
const nonConnectingLetters = ['ا', 'د', 'ذ', 'ر', 'ز', 'و'];

// Dictionnaire des mots exemples pour chaque lettre
const letterExamples: { [key: string]: { word: string; translation: string } } = {
  'ا': { word: 'أرنب', translation: 'Lapin' },
  'بـ': { word: 'بطة', translation: 'Canard' },
  'تـ': { word: 'تفاحة', translation: 'Pomme' },
  'ثـ': { word: 'ثعلب', translation: 'Renard' },
  'جـ': { word: 'جمل', translation: 'Chameau' },
  'حـ': { word: 'حليب', translation: 'Lait' },
  'خـ': { word: 'خروف', translation: 'Mouton' },
  'د': { word: 'دجاجة', translation: 'Poule' },
  'ذ': { word: 'ذهب', translation: 'Or' },
  'ر': { word: 'وردة', translation: 'Rose' },
  'ز': { word: 'زرافة', translation: 'Girafe' },
  'سـ': { word: 'سيارة', translation: 'Voiture' },
  'شـ': { word: 'شمس', translation: 'Soleil' },
  'صـ': { word: 'صابون', translation: 'Savon' },
  'ضـ': { word: 'ضفدع', translation: 'Grenouille' },
  'طـ': { word: 'طائرة', translation: 'Avion' },
  'ظـ': { word: 'ظبي', translation: 'Gazelle' },
  'عـ': { word: 'عسل', translation: 'Miel' },
  'غـ': { word: 'غيمة', translation: 'Nuage' },
  'فـ': { word: 'فيل', translation: 'Éléphant' },
  'قـ': { word: 'قلم', translation: 'Crayon' },
  'كـ': { word: 'كتاب', translation: 'Livre' },
  'لـ': { word: 'ليمون', translation: 'Citron' },
  'مـ': { word: 'موز', translation: 'Banane' },
  'نـ': { word: 'نحلة', translation: 'Abeille' },
  'هـ': { word: 'هدية', translation: 'Cadeau' },
  'و': { word: 'ورقة', translation: 'Feuille' },
  'يـ': { word: 'يمامة', translation: 'Colombe' },
  'ء': { word: 'أسد', translation: 'Lion' }
};

const Page2 = () => {
  // Fonction pour jouer l'audio avec le mapping spécifique
  const playLetterAudio = (letter: string) => {
    const audioFileName = chapter1Page2AudioMappings[letter];
    if (audioFileName) {
      const audio = new Audio(`/audio/chapitre0_1/${audioFileName}.mp3`);
      audio.play().catch(error => {
        console.error('Erreur lors de la lecture audio:', error);
      });
    }
  };

  const letters = [
    // Row 1
    { letter: 'ا', emphatic: false, violet: false },
    { letter: 'بـ', emphatic: false, violet: false },
    { letter: 'تـ', emphatic: false, violet: false },
    { letter: 'ثـ', emphatic: false, violet: false },
    { letter: 'جـ', emphatic: false, violet: false },
    { letter: 'حـ', emphatic: false, violet: false },
    
    // Row 2
    { letter: 'خـ', emphatic: true, violet: false },
    { letter: 'د', emphatic: false, violet: false },
    { letter: 'ذ', emphatic: false, violet: false },
    { letter: 'ر', emphatic: true, violet: false },
    { letter: 'ز', emphatic: false, violet: false },
    { letter: 'سـ', emphatic: false, violet: false },
    
    // Row 3
    { letter: 'شـ', emphatic: false, violet: false },
    { letter: 'صـ', emphatic: true, violet: false },
    { letter: 'ضـ', emphatic: true, violet: false },
    { letter: 'طـ', emphatic: true, violet: false },
    { letter: 'ظـ', emphatic: true, violet: false },
    { letter: 'عـ', emphatic: false, violet: false },
    
    // Row 4
    { letter: 'غـ', emphatic: true, violet: false },
    { letter: 'فـ', emphatic: false, violet: false },
    { letter: 'قـ', emphatic: true, violet: false },
    { letter: 'كـ', emphatic: false, violet: false },
    { letter: 'لـ', emphatic: false, violet: false },
    { letter: 'مـ', emphatic: false, violet: false },
    
    // Row 5
    { letter: 'نـ', emphatic: false, violet: false },
    { letter: 'هـ', emphatic: false, violet: false },
    { letter: 'و', emphatic: false, violet: false },
    { letter: 'يـ', emphatic: false, violet: false },
    { letter: 'ء', emphatic: false, violet: true }
  ];

  const handleLetterClick = (letter: string) => {
    // Utiliser directement la lettre avec ses attachements pour le mapping
    playLetterAudio(letter);
  };

  return (
    <div className="font-arabic min-h-screen bg-gray-900" style={{ direction: 'rtl' }}>
      <div className="w-full h-full overflow-hidden bg-gray-900">
        {/* Header */}
        <div className="text-white p-6 text-center border-b-2">
          <div className="text-3xl font-bold mb-4">
            Leçon : lettres attachées au début d'un mot
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
            <div>Page 2</div>
            <div className="mt-1">© 2025 Tous droits réservés</div>
          </footer>
        </div>
      </div>
    </div>
  );
};

// Popup Component - MODIFIÉ pour toutes les lettres avec des mots spécifiques
const InfoPopup = ({ letter, onClose }: { letter: string; onClose: () => void }) => {
  const isNonConnecting = nonConnectingLetters.includes(letter);
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
          <h3 className="text-lg sm:text-xl font-bold text-white">Connexion au début d'un mot</h3>
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
                <span>Cette lettre fait partie des 6 lettres qui ne s'attacheront JAMAIS après elles : ا, د, ذ, ر, ز, و</span>
              </p>
            </div>
          )}
          
          {/* Exemple en arabe */}
          <div className="bg-gray-700 rounded-xl p-3 sm:p-4 shadow-lg">
            <p className="text-gray-300 text-xs mb-2 text-center">📖 Exemple </p>
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
                  ? "Cette lettre ne se connecte pas à la lettre suivante, donc sa forme reste identique en début de mot"
                  : "La lettre est connectée à la lettre suivante, donc sa forme change. C'est pour cela qu'on parle de 'lettre en début de mot' : cela fait référence à la manière dont elle s'écrit au début d'un mot"
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

export default Page2;