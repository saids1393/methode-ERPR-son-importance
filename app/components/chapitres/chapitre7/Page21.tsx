// components/chapitres/chapitre7/Page21.tsx
import React from 'react';

const Page21 = () => {
  const words = [
    'بَيْتٌ', 'قَوْمٌ', 'سَمَاءٌ',
    'نَوْمٌ', 'حَيَوَانٌ', 'كِتَابٌ',
    'يَدٌ', 'صَوْتٌ', 'مَاءٌ',
    'لَيْلٌ', 'جَبَلٌ', 'رَيْحٌ',
    'نَهْرٌ', 'بَيْضٌ', 'خُبْزٌ',
    'شَمْسٌ', 'قَمَرٌ', 'عَيْنٌ',
    'وَرْدٌ', 'بَحْرٌ', 'رَمْضٌ',
    'زَيْتٌ', 'طَيْرٌ', 'حُبٌّ',
    'نَجْمٌ', 'بَيْتٌ', 'سَوْفٌ'
  ];

  return (
    <div 
      className="font-arabic min-h-screen"
      style={{ direction: 'rtl' }}
    >
      <div className="w-full h-full bg-zinc-900 overflow-hidden">
        {/* Header */}
        <div className="bg-arabic-gradient text-white p-6 text-center">
          <div className="text-3xl md:text-3xl font-bold">
           Exercice : reconnaissance des mots avec voyelles doubles, prolongations et lettres douces
          </div>
        </div>
        
        {/* Words Grid */}
        <div className="p-8 bg-zinc-900">
          <div className="max-w-6xl mx-auto">
            {/* Nouvelle grille similaire à Page20 */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-8">
              {words.map((word, index) => (
                <VariousWordCard 
                  key={index} 
                  word={word}
                  index={index}
                />
              ))}
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <footer className="bg-zinc-800 text-white text-center p-6 flex-shrink-0 font-semibold text-sm">
          <div>Page 21</div>
          <div className="mt-1">© 2025 Tous droits réservés</div>
        </footer>
      </div>
    </div>
  );
};

// VariousWordCard Component mis à jour au style de DiphthongCard
const VariousWordCard = ({ word, index }: { 
  word: string;
  index: number;
}) => {
  return (
    <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-center hover:bg-zinc-700 transition-all duration-300 group min-h-[90px] flex items-center justify-center">
      <div className="text-2xl md:text-3xl font-bold leading-relaxed group-hover:scale-105 transition-transform duration-300 text-white">
        {word}
      </div>
    </div>
  );
};

export default Page21;
