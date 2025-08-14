"use client";

// components/chapitres/chapitre10/Page26.tsx
import React from 'react';
import { useAudio } from '@/hooks/useAudio';

const chapter10Page26AudioMappings: { [key: string]: string } = {
  // Mots d'introduction
  'دَرَّسَ': 'chap10_pg26_intro1',
  'مُسَمَّىٰ': 'chap10_pg26_intro2',

  // Rangée 1
  'إِنَّ': 'chap10_pg26_case1',
  'اللَّهَ': 'chap10_pg26_case2',
  'مُصَدِّقٌ': 'chap10_pg26_case3',
  'الرَّحْمَٰنِ': 'chap10_pg26_case4',
  'الرَّحِيمِ': 'chap10_pg26_case5',
  'الصَّبِرِ': 'chap10_pg26_case6',

  // Rangée 2
  'الظَّالِمِينَ': 'chap10_pg26_case7',
  'تَبَّتْ': 'chap10_pg26_case8',
  'شَدِّدْ': 'chap10_pg26_case9',

  // Rangée 3
  'جَنَّاتٍ': 'chap10_pg26_case10',
  'السَّلَامُ': 'chap10_pg26_case11',

  // Rangée 4
  'الْمُؤْمِنِينَ': 'chap10_pg26_case12',
  'ضَرَّ': 'chap10_pg26_case13',
  'تُبِّ': 'chap10_pg26_case14',

  // Rangée 5
  'النَّاسِ': 'chap10_pg26_case15',

  // Rangée 6
  'الشَّيْطَانُ': 'chap10_pg26_case16',

  // Rangée 7
  'الصَّالِحِينَ': 'chap10_pg26_case17',
  'مُصَدَّقِينَ': 'chap10_pg26_case18',
  'وَصَّىٰ': 'chap10_pg26_case19',

  // Rangée 9
  'نَذَّرْتُكُمْ': 'chap10_pg26_case20',
  'قَدَّرْنَا': 'chap10_pg26_case21',
  'تَذَكَّرُوا': 'chap10_pg26_case22',

  // Verset final
  'إِنَّ اللَّهَ غَفُورٌ رَحِيمٌ': 'chap10_pg26_verse1',
};


const Page26 = () => {
 // Fonction pour jouer l'audio avec le mapping spécifique
const playLetterAudio = (vowelLetter: string) => {
  const audioFileName = chapter10Page26AudioMappings[vowelLetter];
  if (audioFileName) {
    const audio = new Audio(`/audio/${audioFileName}.mp3`);
    audio.play().catch(error => {
      console.error('Erreur lors de la lecture audio:', error);
    });
  }
};

  const introWords = [
    { word: 'دَرَّسَ', description: 'mot de 3 lettres' },
    { word: 'مُسَمَّىٰ', description: 'mot de 4 lettres' }
  ];

  const quranicWords = [
    // Rangée 1
    ['إِنَّ', 'اللَّهَ', 'مُصَدِّقٌ', 'الرَّحْمَٰنِ', 'الرَّحِيمِ', 'الصَّبِرِ'],
    
    // Rangée 2
    ['الظَّالِمِينَ', /* 'مَضَىٰ', 'بِسْمِهِ', */ 'تَبَّتْ', /* 'كَفَّرَ', */ 'شَدِّدْ'],
    
    // Rangée 3
    ['جَنَّاتٍ', /* 'يَعْمَلُونَ', 'يُبَشِّرُ', 'يُذَكِّرُ', */ 'السَّلَامُ', /* 'الْخَبِيرُ' */],
    
    // Rangée 4
    ['الْمُؤْمِنِينَ',  /* 'وَنَفَّعَ', 'أَمْرَهُ', */ 'ضَرَّ', 'تُبِّ'],
    
    // Rangée 5
    [/* 'يَوْمَئِذٍ', 'الْمُسْتَقِيمَةِ', 'يُؤْمِنُونَ', 'يَا مَعْشَرَ', */ 'النَّاسِ', /* 'الْمُشْرِكِينَ' */],
    
    // Rangée 6
    [/* 'يُزَكِّيهِمْ', 'كَرَّمَهُ', 'مُقَرَّبِينَ', */ 'الشَّيْطَانُ', /* 'فَسَجَدَ', 'سَجَدَ' */],
    
    // Rangée 7
    ['الصَّالِحِينَ', 'مُصَدَّقِينَ', /* 'شُكِّرِينَ', */ 'وَصَّىٰ', /* 'ضَرَّةً', 'نَذَّرْنَا' */],
    
    // Rangée 8
    [/* 'تُشْرِكُوا', 'يُبَصِّرُكُمْ', 'يُذَكِّرُكُمْ', 'يُخْرِجُكُمْ',  'شَدِيدُ', 'مُحْسِنِينَ'*/],
    
    // Rangée 9
    [/* 'مُشْرِكِينَ', */ 'نَذَّرْتُكُمْ', 'قَدَّرْنَا', 'تَذَكَّرُوا',  /* 'الشَّهِيدُ' */]
  ];

  // Aplatir toutes les rangées en un seul tableau avec index
  const allWords = quranicWords.flat();

  const verse = 'إِنَّ اللَّهَ غَفُورٌ رَحِيمٌ';

// Modifier handleLetterClick pour utiliser la nouvelle fonction
const handleLetterClick = (vowelLetter: string) => {
  playLetterAudio(vowelLetter);
};

  function handleWordClick(word: string): void {
    throw new Error('Function not implemented.');
  }

  return (
    <div 
      className="font-arabic min-h-screen"
      style={{ direction: 'rtl' }}
    >
      <div className="w-full h-full bg-zinc-900 overflow-hidden">
        {/* Header */}
        <div className="bg-arabic-gradient text-white p-6 text-center">
          <div className="text-3xl md:text-3xl font-bold">
          Exercice : reconnaissance des mots avec la shaddah
          </div>
        </div>
        
        {/* Content */}
        <div className="p-8 bg-zinc-900">
          <div className="max-w-6xl mx-auto">
          
            {/* Main Exercise Grid */}
            <div className="mb-8">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {allWords.map((word, index) => (
                  <WordCard 
                    key={index} 
                    word={word}
                    onClick={() => handleWordClick(word)}
                  />
                ))}
              </div>
            </div>
            
            {/* Verse Section */}
            <div className="mb-8">
              <div 
                className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-700/30 rounded-xl p-8 text-center cursor-pointer hover:bg-blue-900/30 transition-colors"
                onClick={() => handleWordClick(verse)}
              >
                <div className="text-blue-400 text-3xl md:text-4xl font-bold leading-relaxed">
                  {verse}
                </div>
              </div>
            </div>
            
          </div>
        </div>
        
        {/* Footer */}
        <footer className="bg-zinc-800 text-white text-center p-6 flex-shrink-0 font-semibold text-sm">
          <div>Page 26</div>
          <div className="mt-1">© 2025 Tous droits réservés</div>
        </footer>
      </div>
    </div>
  );
};

// WordCard Component simplifié sans couleurs
const WordCard = ({ word, onClick }: { 
  word: string;
  onClick?: () => void;
}) => {
  return (
    <div className="
      bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-center cursor-pointer
      hover:bg-zinc-700 transition-all duration-300 group 
      min-h-[90px] flex items-center justify-center
    "
    onClick={onClick}
    >
      <div className="text-xl md:text-2xl font-bold text-white leading-relaxed group-hover:scale-105 transition-transform duration-300">
        {word}
      </div>
    </div>
  );
};

export default Page26;
