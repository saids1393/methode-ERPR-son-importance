// components/chapitres/chapitre0/Page0.tsx 
"use client";
import React from 'react';


// Mapping audio pour le Chapitre 0, Page 0
const chapter0Page0AudioMappings: { [key: string]: string } = {
  'ا': 'chap0_pg0_case1',
  'ب': 'chap0_pg0_case2',
  'ت': 'chap0_pg0_case3',
  'ث': 'chap0_pg0_case4',
  'ج': 'chap0_pg0_case5',
  'ح': 'chap0_pg0_case6',
  'خ': 'chap0_pg0_case7',
  'د': 'chap0_pg0_case8',
  // 'ذ': 'chap0_pg0_case9',
  'ر': 'chap0_pg0_case10',
  'ز': 'chap0_pg0_case11',
  'س': 'chap0_pg0_case12',
  'ش': 'chap0_pg0_case13',
  'ص': 'chap0_pg0_case14',
  'ض': 'chap0_pg0_case15',
  'ط': 'chap0_pg0_case16',
  'ظ': 'chap0_pg0_case17',
  'ع': 'chap0_pg0_case18',
  'غ': 'chap0_pg0_case19',
  'ف': 'chap0_pg0_case20',
  'ق': 'chap0_pg0_case21',
  'ك': 'chap0_pg0_case22',
  'ل': 'chap0_pg0_case23',
  'م': 'chap0_pg0_case24',
  'ن': 'chap0_pg0_case25',
  'ه': 'chap0_pg0_case26',
  'و': 'chap0_pg0_case27',
  'ي': 'chap0_pg0_case28',
  'ء': 'chap0_pg0_case29',
  'ة': 'chap0_pg0_case30'
};


const Page0 = () => {
  // Hook personnalisé pour jouer l'audio avec le mapping spécifique
  const playLetterAudio = (letter: string) => {
    const audioFileName = chapter0Page0AudioMappings[letter];
    if (audioFileName) {
      const audio = new Audio(`/audio/chapitre0_1/${audioFileName}.mp3`);
      audio.play().catch(error => {
        console.error('Erreur lors de la lecture audio:', error);
      });
    }
  };

  const associations: { [key: string]: { mot: string; emoji?: string } } = {
   'ا': { mot: 'Abeille', emoji: '🐝' },
    'ب': { mot: 'Bateau', emoji: '🚤' },
    'ت': { mot: 'Tarte', emoji: '🥧' },
    'ث': { mot: 'Think (le verbe penser en Anglais)' },
    'ج': { mot: 'Jean', emoji: '👖' },
    'ح': { mot: 'Le prénom Mohammad ou le début de la sourate al fatiha Al Hamdou' },
    'خ': { mot: 'Rateau', emoji: '🧹' },
    'د': { mot: 'Dell', emoji: '💻' },
    'ذ': { mot: 'That (pronom démonstratif: ce/cette/cela)' },
    'ر': { mot: 'Escobar (R roulé en Espagnol)' },
    'ز': { mot: 'Zara', emoji: '👗' },
    'س': { mot: 'Signe' },
    'ش': { mot: 'Chine (bout de la langue derrière les dents du bas)' },
    'ص': { mot: 'Bout de la langue derrière les dents du bas' },
    'ض': { mot: "Langue entière collée sur tout le palais en bloquant l'air (les joues doivent se gonfler avant la prononciation de la lettre)" },
    'ط': { mot: "Même sortie que la lettre [Ta], mais en la prononçant d'une façon lourde et grave" },
    'ظ': { mot: "Comme 'that' en Anglais, mais en rendant la lettre grave tout en freinant l'air avec la langue contre les incisives supérieures (les joues doivent normalement gonfler avant la sortie de la lettre)"  },
    'ع': { mot: "Vibration en haut de la pomme d'Adam" },
    'غ': { mot: "Gargouillis dans la gorge après s'être brossé les dents" },
    'ف': { mot: 'Farine'},
    'ق': { mot: 'Le fond de la langue doit entrer en contact avec le fond du palais, comme une personne qui toque à la porte : on doit sentir un petit claquement. ' },
    'ك': { mot: 'Cave' },
    'ل': { mot: 'Lame' },
    'م': { mot: "Mimi (la parole d'une personne qui trouve mignon une chose ou une personne (c'est mimi ou tu es mimi)" },
    'ن': { mot: 'Nounours', emoji: '🐻' },
    'ه': { mot: "Air d'un bâillement" },
    'و': { mot: "Waww (en anglais, quand on est étonné(e))" },
    'ي': { mot: 'Yaourt' },
    'ء': { mot: "Prénom : Hamzah" },
    'ة': { mot: 'Tarte', emoji: '🥧' },
  };

  const allLetters = [
    { letter: 'ا', name: 'أَلِف' },
    { letter: 'ب', name: 'بَاء' },
    { letter: 'ت', name: 'تَاء' },
    { letter: 'ث', name: 'ثَاء' },
    { letter: 'ج', name: 'جِيم' },
    { letter: 'ح', name: 'حَاء' },
    { letter: 'خ', name: 'خَاء' },
    { letter: 'د', name: 'دَال' },
    { letter: 'ذ', name: 'ذَال' },
    { letter: 'ر', name: 'رَاء' },
    { letter: 'ز', name: 'زَاي' },
    { letter: 'س', name: 'سِين' },
    { letter: 'ش', name: 'شِين' },
    { letter: 'ص', name: 'صَاد' },
    { letter: 'ض', name: 'ضَاد' },
    { letter: 'ط', name: 'طَاء' },
    { letter: 'ظ', name: 'ظَاء' },
    { letter: 'ع', name: 'عَين' },
    { letter: 'غ', name: 'غَين' },
    { letter: 'ف', name: 'فَاء' },
    { letter: 'ق', name: 'قَاف' },
    { letter: 'ك', name: 'كَاف' },
    { letter: 'ل', name: 'لاَم' },
    { letter: 'م', name: 'مِيم' },
    { letter: 'ن', name: 'نُون' },
    { letter: 'ه', name: 'هَاء' },
    { letter: 'و', name: 'وَاو' },
    { letter: 'ي', name: 'يَاء' },
    { letter: 'ء', name: 'وَاو' },
    { letter: 'ة', name: 'يَاء' }
  ];

  const emphaticLetters = ['خ', 'ر', 'ص', 'ض', 'ط', 'ظ', 'غ', 'ق'];

  const handleLetterClick = (letter: string) => {
    playLetterAudio(letter);
  };

  return (
    <div className="font-arabic min-h-screen bg-gray-900 text-white p-6 space-y-6">
      <div className="text-center mb-4">
        <div className="text-3xl font-bold mb-2">📘 Apprenons l'alphabet arabe</div>
        <div className="text-lg text-indigo-300">Association visuelle pour francophones</div>
      </div>

      <div className="space-y-6">
        {allLetters.map((item, index) => {
          const assoc = associations[item.letter];
          return (
            <div
              key={index}
              className="flex items-center justify-between bg-zinc-800 hover:bg-zinc-700 transition-all p-6 rounded-xl shadow-lg cursor-pointer"
              onClick={() => handleLetterClick(item.letter)}
            >
              {/* Lettre arabe */}
              <div
                className={`text-6xl md:text-8xl font-bold w-1/4 text-center ${
                  index >= allLetters.length - 2
                    ? 'text-purple-500'
                    : emphaticLetters.includes(item.letter)
                    ? 'text-red-500'
                    : 'text-white'
                }`}
              >
                {item.letter}
              </div>

              {/* Mot français associé */}
              <div className="w-3/4 text-left pl-6">
                <div className="text-xl md:text-3xl font-semibold text-amber-300">
                  {assoc ? (
                    <span>
                      {assoc.mot}
                      {assoc.emoji && ` ${assoc.emoji}`}
                    </span>
                  ) : (
                    <span className="text-gray-500 italic">À venir</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Légende simplifiée */}
      <div className="bg-zinc-800 rounded-lg p-4 mb-4">
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

      <div className="mt-8 text-center text-sm text-zinc-400">
        Page 0 — Méthode simple & intuitive pour débutants
      </div>
    </div>
  );
};

export default Page0;