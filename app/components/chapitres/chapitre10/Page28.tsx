"use client";
import React from 'react';

const chapter10Page28AudioMappings: { [key: string]: string } = {
  // Sourate Al-Fatiha
  'بِسْمِ': 'chap10_pg28_case1',
  'ٱللَّهِ': 'chap10_pg28_case2',
  'ٱلرَّحْمَٰنِ': 'chap10_pg28_case3',
  'ٱلرَّحِيمِ': 'chap10_pg28_case4',
  'ٱلْحَمْدُ': 'chap10_pg28_case5',
  'لِلَّهِ': 'chap10_pg28_case6',
  'رَبِّ': 'chap10_pg28_case7',
  'ٱلْعَالَمِينَ': 'chap10_pg28_case8',
  'مَالِكِ': 'chap10_pg28_case9',
  'يَوْمِ': 'chap10_pg28_case10',
  'ٱلدِّينِ': 'chap10_pg28_case11',
  'إِيَّاكَ': 'chap10_pg28_case12',
  'نَعْبُدُ': 'chap10_pg28_case13',
  'وَإِيَّاكَ': 'chap10_pg28_case14',
  'نَسْتَعِينُ': 'chap10_pg28_case15',
  'ٱهْدِنَا': 'chap10_pg28_case16',
  'ٱلصِّرَٰطَ': 'chap10_pg28_case17',
  'غَيْرِ': 'chap10_pg28_case21',
  'ٱلْمَغْضُوبِ': 'chap10_pg28_case22',
  'وَلَا': 'chap10_pg28_case23',
  'ٱلضَّالِّينَ': 'chap10_pg28_case24',

  // Doubles voyelles
  'أَحَدٌ': 'chap10_pg28_case25',
  'صَمَدٌ': 'chap10_pg28_case26',
  'كُفُوًا': 'chap10_pg28_case27',

  // Lettres emphatiques
  'قُلْ': 'chap10_pg28_case28',
  'أَعُوذُ': 'chap10_pg28_case29',
  'بِرَبِّ': 'chap10_pg28_case30',
  'ٱلْفَلَقِ': 'chap10_pg28_case31',
  'مِنْ': 'chap10_pg28_case32',
  'شَرِّ': 'chap10_pg28_case33',
  'غَاسِقٍ': 'chap10_pg28_case34',
  'إِذَا': 'chap10_pg28_case35',
  'وَقَبَ': 'chap10_pg28_case36',

  // Case et Ta Marbuta
  'سُورَةٌ': 'chap10_pg28_case37',
  'ٱلْبَقَرَةِ': 'chap10_pg28_case38',
  'ٱلسَّمَاءِ': 'chap10_pg28_case39',
  'مَاءً': 'chap10_pg28_case40',
  'ٱلصَّلَاةَ': 'chap10_pg28_case41',
  'ٱلزَّكَاةَ': 'chap10_pg28_case42',

  // Lettres douces (layyinah)
  'خَوْفٍ': 'chap10_pg28_case43',
  'بَيْتِ': 'chap10_pg28_case44',
  'قُرَيْشٍ': 'chap10_pg28_case45',

  // Alif/Waw/Ya saghirah
  'مُوسَىٰ': 'chap10_pg28_case46',
  'عِيسَىٰ': 'chap10_pg28_case47',
  'يَحْيَىٰ': 'chap10_pg28_case48',

  // Versets
  'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ': 'chap10_pg28_case49',
  'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ': 'chap10_pg28_case50',
};

const Page28 = () => {
  // Fonction pour jouer l'audio avec le mapping spécifique
  const playLetterAudio = (word: string) => {
    const audioFileName = chapter10Page28AudioMappings[word];
    if (audioFileName) {
      const audio = new Audio(`/audio/chapitre10/${audioFileName}.mp3`);
      audio.play().catch(error => {
        console.error('Erreur lors de la lecture audio:', error);
      });
    }
  };

  const quranicWords = [
    // Sourate Al-Fatiha
    ['بِسْمِ', 'ٱللَّهِ', 'ٱلرَّحْمَٰنِ', 'ٱلرَّحِيمِ', 'ٱلْحَمْدُ', 'لِلَّهِ'],
    ['رَبِّ', 'ٱلْعَالَمِينَ', 'ٱلرَّحْمَٰنِ', 'ٱلرَّحِيمِ', 'مَالِكِ', 'يَوْمِ'],
    ['ٱلدِّينِ', 'إِيَّاكَ', 'نَعْبُدُ', 'وَإِيَّاكَ', 'نَسْتَعِينُ', 'ٱهْدِنَا'],
    ['ٱلصِّرَٰطَ', 'ٱلَّذِينَ', 'أَنْعَمْتَ', 'عَلَيْهِمْ'],
    ['غَيْرِ', 'ٱلْمَغْضُوبِ', 'عَلَيْهِمْ', 'وَلَا', 'ٱلضَّالِّينَ'],

    // Doubles voyelles
    ['أَحَدٌ', 'صَمَدٌ', 'كُفُوًا'],

    // Lettres emphatiques
    ['قُلْ', 'أَعُوذُ', 'بِرَبِّ', 'ٱلْفَلَقِ', 'مِنْ', 'شَرِّ', 'غَاسِقٍ', 'إِذَا', 'وَقَبَ'],

    // Case et Ta Marbuta
    ['سُورَةٌ', 'ٱلْبَقَرَةِ', 'ٱلسَّمَاءِ', 'مَاءً', 'ٱلصَّلَاةَ', 'ٱلزَّكَاةَ'],

    // Lettres douces (layyinah)
    ['خَوْفٍ', 'بَيْتِ'],

    // Alif/Waw/Ya saghirah
    ['مُوسَىٰ', 'عِيسَىٰ', 'يَحْيَىٰ'],
  ];

  const allWords = quranicWords.flat();

  const verseSegments = [
    { text: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', color: 'blue' },
    { text: 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ', color: 'violet' },
  ];

  const handleWordClick = (word: string) => {
    playLetterAudio(word);
  };

  return (
    <div className="font-arabic min-h-screen" style={{ direction: 'rtl' }}>
      <div className="w-full h-full bg-zinc-900 overflow-hidden">
        {/* Header */}
        <div className="bg-arabic-gradient text-white p-6 text-center">
          <div className="text-3xl md:text-3xl font-bold">
            Exercice : reconnaissance des mots avec toutes les règles de la méthode
          </div>
        </div>

        {/* Content */}
        <div className="p-8 bg-zinc-900">
          {/* Grille des mots */}
          <div className="max-w-6xl mx-auto mb-8">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
              {allWords.map((word, idx) => (
                <WordCard
                  key={idx}
                  word={word}
                  onClick={() => handleWordClick(word)}
                />
              ))}
            </div>
          </div>

          {/* Versets */}
          <div className="max-w-3xl mx-auto mb-8">
            <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-700/30 rounded-xl p-8 text-center">
              {verseSegments.map((seg, i) => (
                <div key={i} className="mb-4 cursor-pointer" onClick={() => handleWordClick(seg.text)}>
                  <span
                    className={`
                      text-3xl md:text-4xl font-bold
                      ${seg.color === 'blue' ? 'text-blue-400' : 'text-violet-400'}
                      hover:bg-white/10 hover:scale-105
                      transition-all duration-300 rounded-md px-2 py-1 inline-block
                    `}
                  >
                    {seg.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-zinc-800 text-white text-center p-6 font-semibold text-sm">
          <div>Page 28</div>
          <div className="mt-1">© 2025 Tous droits réservés</div>
        </footer>
      </div>
    </div>
  );
};

const WordCard = ({ word, onClick }: { word: string; onClick?: () => void }) => (
  <div
    className="bg-zinc-800 border border-zinc-700 rounded-xl p-4 min-h-[90px] flex items-center justify-center hover:bg-zinc-700 transition-all duration-300 cursor-pointer"
    onClick={onClick}
  >
    <div className="text-2xl md:text-3xl font-extrabold text-white leading-snug">
      {word}
    </div>
  </div>
);

export default Page28;
