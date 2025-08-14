"use client";

import React from 'react';


const chapter10Page28AudioMappings: { [key: string]: string } = {
  // Sourate Al-Fatiha
  'بِسْمِ': 'chap10_pg28_fatiha1',
  'ٱللَّهِ': 'chap10_pg28_fatiha2',
  'ٱلرَّحْمَٰنِ': 'chap10_pg28_fatiha3',
  'ٱلرَّحِيمِ': 'chap10_pg28_fatiha4',
  'ٱلْحَمْدُ': 'chap10_pg28_fatiha5',
  'لِلَّهِ': 'chap10_pg28_fatiha6',
  'رَبِّ': 'chap10_pg28_fatiha7',
  'ٱلْعَالَمِينَ': 'chap10_pg28_fatiha8',
  'ٱلدِّينِ': 'chap10_pg28_fatiha9',
  'إِيَّاكَ': 'chap10_pg28_fatiha10',
  'نَعْبُدُ': 'chap10_pg28_fatiha11',
  'وَإِيَّاكَ': 'chap10_pg28_fatiha12',
  'نَسْتَعِينُ': 'chap10_pg28_fatiha13',
  'ٱهْدِنَا': 'chap10_pg28_fatiha14',
  'ٱلصِّرَٰطَ': 'chap10_pg28_fatiha15',
  'ٱلْمُسْتَقِيمَ': 'chap10_pg28_fatiha16',
  'غَيْرِ': 'chap10_pg28_fatiha17',
  'ٱلْمَغْضُوبِ': 'chap10_pg28_fatiha18',
  'وَلَا': 'chap10_pg28_fatiha19',
  'ٱلضَّالِّينَ': 'chap10_pg28_fatiha20',

  // Tanwin (doubles voyelles)
  'أَحَدٌ': 'chap10_pg28_tanwin1',
  'صَمَدٌ': 'chap10_pg28_tanwin2',
  'كُفُوًا': 'chap10_pg28_tanwin3',

  // Lettres emphatiques
  'قُلْ': 'chap10_pg28_emphatic1',
  'أَعُوذُ': 'chap10_pg28_emphatic2',
  'بِرَبِّ': 'chap10_pg28_emphatic3',
  'ٱلصَّمَدُ': 'chap10_pg28_emphatic4',
  'مِنْ': 'chap10_pg28_emphatic5',
  'شَرِّ': 'chap10_pg28_emphatic6',
  'غَاسِقٍ': 'chap10_pg28_emphatic7',
  'إِذَا': 'chap10_pg28_emphatic8',
  'وَقَبَ': 'chap10_pg28_emphatic9',

  // Hamzah et Ta Marbuta
  'سُورَةٌ': 'chap10_pg28_hamzah1',
  'ٱلْبَقَرَةِ': 'chap10_pg28_hamzah2',
  'ٱلسَّمَاءِ': 'chap10_pg28_hamzah3',
  'مَاءً': 'chap10_pg28_hamzah4',
  'ٱلصَّلَاةَ': 'chap10_pg28_hamzah5',
  'ٱلزَّكَاةَ': 'chap10_pg28_hamzah6',

  // Lettres douces (layyinah)
  'خَوْفٍ': 'chap10_pg28_soft1',
  'بَيْتِ': 'chap10_pg28_soft2',
  'قُرَيْشٍ': 'chap10_pg28_soft3',

  // Alif/Waw/Ya saghirah
  'مُوسَىٰ': 'chap10_pg28_small1',
  'عِيسَىٰ': 'chap10_pg28_small2',
  'يَحْيَىٰ': 'chap10_pg28_small3',

  // Versets
  'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ': 'chap10_pg28_verse1',
  'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ': 'chap10_pg28_verse2',
};


const Page28 = () => {
  // Fonction pour jouer l'audio avec le mapping spécifique
const playLetterAudio = (vowelLetter: string) => {
  const audioFileName = chapter10Page28AudioMappings[vowelLetter];
  if (audioFileName) {
    const audio = new Audio(`/audio/${audioFileName}.mp3`);
    audio.play().catch(error => {
      console.error('Erreur lors de la lecture audio:', error);
    });
  }
};

const quranicWords = [
    // Sourate Al-Fatiha (existant)
    ['بِسْمِ', 'ٱللَّهِ', 'ٱلرَّحْمَٰنِ', 'ٱلرَّحِيمِ', 'ٱلْحَمْدُ', 'لِلَّهِ'],
    ['رَبِّ', 'ٱلْعَالَمِينَ', 'ٱلرَّحْمَٰنِ', 'ٱلرَّحِيمِ', 'مَالِكِ', 'يَوْمِ'],
    ['ٱلدِّينِ', 'إِيَّاكَ', 'نَعْبُدُ', 'وَإِيَّاكَ', 'نَسْتَعِينُ', 'ٱهْدِنَا'],
    ['ٱلصِّرَٰطَ', 'ٱلْمُسْتَقِيمَ', 'صِرَٰطَ', 'ٱلَّذِينَ', 'أَنْعَمْتَ', 'عَلَيْهِمْ'],
    ['غَيْرِ', 'ٱلْمَغْضُوبِ', 'عَلَيْهِمْ', 'وَلَا', 'ٱلضَّالِّينَ'],
    
    // Ajouts pour les règles manquantes :
    
    // 1. Pour le Tanwin (doubles voyelles)
    ['أَحَدٌ', 'صَمَدٌ', 'كُفُوًا', 'أَحَدٌ'],  // Sourate Al-Ikhlas
    ['غَاسِقٍ', 'حَاسِدٍ'],  // Sourate Al-Falaq
    
    // 2. Pour les lettres emphatiques
    ['قُلْ', 'أَعُوذُ', 'بِرَبِّ', 'ٱلْفَلَقِ'],  // ق emphatique
    ['ٱلصَّمَدُ'],  // ص emphatique avec shaddah
    ['ٱلصِّرَٰطَ'],  // ص emphatique (déjà présent)
    ['مِنْ', 'شَرِّ', 'غَاسِقٍ', 'إِذَا', 'وَقَبَ'],  // ق emphatique
    
    // 3. Pour Hamzah (ء) et Ta Marbuta (ة)
    ['سُورَةٌ', 'ٱلْبَقَرَةِ'],  // Ta Marbuta
    ['ٱلسَّمَاءِ', 'مَاءً'],  // Hamzah
    ['ٱلصَّلَاةَ', 'ٱلزَّكَاةَ'],  // Ta Marbuta
    
    // 4. Pour les lettres douces (layyinah) - Waw et Ya avec soukoun
    ['خَوْفٍ', 'بَيْتِ'],  // و et ي avec soukoun = lettres douces
    ['قُرَيْشٍ'],  // Ya layyinah
    
    // 5. Pour Alif/Waw/Ya saghirah (petites lettres)
    ['مُوسَىٰ', 'عِيسَىٰ'],  // Alif saghirah (ىٰ)
    ['يَحْيَىٰ'],  // Alif saghirah
];
  const allWords = quranicWords.flat();

  const verseSegments = [
    { text: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', color: 'blue' },
    { text: 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ', color: 'violet' }     // verset 1 :contentReference[oaicite:1]{index=1}     // verset 6 :contentReference[oaicite:3]{index=3}
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
      {/* Header */}
        <div className="bg-arabic-gradient text-white p-6 text-center">
          <div className="text-3xl md:text-3xl font-bold">
          Exercice : reonnaissance des mots avec toutes les règles de la méthode
          </div>
        </div>

        <div className="p-8 bg-zinc-900">
          <div className="max-w-6xl mx-auto mb-8">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
              {allWords.map((word, idx) => (
                <WordCard key={idx} word={word} onClick={() => handleWordClick(word)} />
              ))}
            </div>
          </div>

          <div className="max-w-3xl mx-auto mb-8">
            <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-700/30 rounded-xl p-8 text-center">
              {verseSegments.map((seg, i) => (
                <div key={i} className="mb-4 cursor-pointer" onClick={() => handleWordClick(seg.text)}>
                  <span
                    className={`
                      text-3xl md:text-4xl font-bold
                      ${seg.color === 'blue'
                        ? 'text-blue-400'
                        : seg.color === 'violet'
                        ? 'text-violet-400'
                        : 'text-purple-300'}
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
