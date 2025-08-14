"use client";

// components/chapitres/chapitre10/Page27.tsx
import React from 'react';


const chapter10Page27AudioMappings: { [key: string]: string } = {
  // Mots d'introduction
  'أَبَّ': 'chap10_pg27_intro1',
  'أَبَّى': 'chap10_pg27_intro2',

  // Rangée 1
  'مُدَّتْ': 'chap10_pg27_case1',
  'حُقَّتْ': 'chap10_pg27_case2',
  'خَفَّتْ': 'chap10_pg27_case3',
  'تَبَّتْ': 'chap10_pg27_case4',

  // Rangée 2
  'تَخَّلَّتْ': 'chap10_pg27_case5',
  'قَدَّمْتُ': 'chap10_pg27_case6',
  'وَالصُّبْحِ': 'chap10_pg27_case7',
  'وَالشَّمْسِ': 'chap10_pg27_case8',
  'وَالشَّفْعِ': 'chap10_pg27_case9',
  'بِالصُّبْرِ': 'chap10_pg27_case10',

  // Rangée 3
  'وَالصَّيْفِ': 'chap10_pg27_case11',
  'وَالَّيْلِ': 'chap10_pg27_case12',
  'سِجِّيلٍ': 'chap10_pg27_case13',
  'سِجِّينٌ': 'chap10_pg27_case14',
  'مُنْفَكِّينَ': 'chap10_pg27_case15',

  // Rangée 4
  'انْشَقَّتْ': 'chap10_pg27_case16',
  'النَّجْمُ': 'chap10_pg27_case17',
  'الثَّاقِبُ': 'chap10_pg27_case18',

  // Rangée 5
  'مِنْ شَرِّ': 'chap10_pg27_case19',
  'الْوَسْوَاسِ': 'chap10_pg27_case20',

  // Rangée 6
  'عَنِّيْ': 'chap10_pg27_case21',

  // Verset final
  'تَبَّتْ يَدَا أَبِي لَهَبٍ وَتَبَّ': 'chap10_pg27_verse1',
};


const Page27 = () => {
// Fonction pour jouer l'audio avec le mapping spécifique
const playLetterAudio = (vowelLetter: string) => {
  const audioFileName = chapter10Page27AudioMappings[vowelLetter];
  if (audioFileName) {
    const audio = new Audio(`/audio/${audioFileName}.mp3`);
    audio.play().catch(error => {
      console.error('Erreur lors de la lecture audio:', error);
    });
  }
};

  const introWords = [
    { word: 'أَبَّ', description: 'Mot de 3 lettres avec soukoun + shadda' },
    { word: 'أَبَّى', description: 'Mot de 4 lettres' }
  ];

  const mixedWords: string[][] = [
    // Rangée 1
    ['مُدَّتْ', 'حُقَّتْ', 'خَفَّتْ', 'تَبَّتْ'],

    // Rangée 2
    ['تَخَّلَّتْ', 'قَدَّمْتُ', 'وَالصُّبْحِ', 'وَالشَّمْسِ', 'وَالشَّفْعِ', 'بِالصُّبْرِ'],

    // Rangée 3
    ['وَالصَّيْفِ', 'وَالَّيْلِ', 'سِجِّيلٍ', 'سِجِّينٌ', 'مُنْفَكِّينَ'],

    // Rangée 4
    ['انْشَقَّتْ', 'النَّجْمُ', 'الثَّاقِبُ'],

    // Rangée 5
    ['مِنْ شَرِّ', 'الْوَسْوَاسِ'],

    // Rangée 6
    ['عَنِّيْ']
  ];

  const allWords = mixedWords.flat();
  const verse = 'تَبَّتْ يَدَا أَبِي لَهَبٍ وَتَبَّ';

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
            Exercice : reconnaissance des mots avec la shadda et la soukoun
          </div>
        </div>

        {/* Contenu principal */}
        <div className="p-8 bg-zinc-900">
          <div className="max-w-6xl mx-auto">

            {/* Grille de mots */}
            <div className="mb-8">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {allWords.map((word, index) => (
                  <WordCard key={index} word={word} onClick={() => handleWordClick(word)} />
                ))}
              </div>
            </div>

            {/* Section de la verset */}
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

        {/* Pied de page */}
        <footer className="bg-zinc-800 text-white text-center p-6 flex-shrink-0 font-semibold text-sm">
          <div>Page 27</div>
          <div className="mt-1">© 2025 Tous droits réservés</div>
        </footer>
      </div>
    </div>
  );
};

// Composant WordCard simplifié
const WordCard = ({ word, onClick }: { word: string; onClick?: () => void }) => {
  return (
    <div
      className="
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

export default Page27;
