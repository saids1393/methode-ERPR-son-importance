// components/chapitres/chapitre8/Page23.tsx
import React from 'react';

const Page23 = () => {
  const quranicItems = [
    // Mots simples
    'قُلْ', 'كَلْبٌ', 'يَوْمٍ', 'حَسْبُ', 'رَبْعُ', 'مَسْجِدٌ',
    'فَلْيَنْظُرْ', 'يَلْهَثْ', 'مِنْ', 'عَنْهْ', 'لَكُمْ', 'دِينُكُمْ',
    'وَيَمْنَعُونَ', 'الْمَاعُونَ', 'كَعَصْفٍ', 'مَأْكُولٍ', 'أَنتُمْ', 'عَابِدُونَ',
    'أَعْبُدُ', 'فَأَثَرْنَ', 'نَقْعًا', 'وَلَا', 'تَنْهَ', 'عَنِ',

    // Versets
    { text: 'وَإِذَا الْجِبَالُ نُسِفَتْ', color: 'text-blue-400' },
    { text: 'وَيَمْنَعُونَ الْمَاعُونَ', color: 'text-violet-400' },
    { text: 'وَلَا أَنتُمْ عَابِدُونَ مَا أَعْبُدُ', color: 'text-blue-400' },
    { text: 'لَكُمْ دِينُكُمْ وَلِيَ دِينِ', color: 'text-violet-400' }
  ];

  return (
    <div className="font-arabic min-h-screen" style={{ direction: 'rtl' }}>
      <div className="w-full h-full bg-zinc-900 overflow-hidden">
        {/* Header */}
        <div className="bg-arabic-gradient text-white p-6 text-center">
          <div className="text-3xl md:text-3xl font-bold">
            Lecture des mots avec la soukoune
          </div>
        </div>

        {/* Content */}
        <div className="p-8 bg-zinc-900">
          <div className="max-w-6xl mx-auto">
            {/* Grille combinée */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-8">
              {quranicItems.map((item, index) => {
                const isVerse = typeof item !== 'string';

                return (
                  <div
                    key={index}
                    className={isVerse ? 'col-span-2 sm:col-span-3 md:col-span-4 lg:col-span-6' : ''}
                  >
                    <QuranicWordCard
                      word={isVerse ? item.text : item}
                      color={isVerse ? item.color : undefined}
                      index={index}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-zinc-800 text-white text-center p-6 flex-shrink-0 font-semibold text-sm">
          <div>Page 23</div>
          <div className="mt-1">© 2025 Tous droits réservés</div>
        </footer>
      </div>
    </div>
  );
};

// Composant pour chaque mot ou verset
const QuranicWordCard = ({
  word,
  index,
  color,
}: {
  word: string;
  index: number;
  color?: string;
}) => {
  return (
    <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-center hover:bg-zinc-700 transition-all duration-300 group min-h-[90px] flex items-center justify-center">
      <div
        className={`text-xl md:text-2xl font-bold leading-relaxed group-hover:scale-105 transition-transform duration-300 ${
          color ?? 'text-white'
        }`}
      >
        {word}
      </div>
    </div>
  );
};

export default Page23;
