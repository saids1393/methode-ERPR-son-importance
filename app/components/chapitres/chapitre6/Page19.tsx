import React from 'react';

const Page19 = () => {
  // Toutes les combinaisons déjà fusionnées (base + prolongation)
  const words = [
    'با', 'بو', 'بي',
    'تا', 'تو', 'تي',
    'ثا', 'ثو', 'ثي',
    'جا', 'جو', 'جي',
    'حا', 'حو', 'حي',
    'خا', 'خو', 'خي',
    'دا', 'دو', 'دي',
    'ذا', 'ذو', 'ذي',
    'را', 'رو', 'ري',
    'زا', 'زو', 'زي',
    'سا', 'سو', 'سي',
    'شا', 'شو', 'شي',
    'صا', 'صو', 'صي',
    'ضا', 'ضو', 'ضي',
    'طا', 'طو', 'طي',
    'ظا', 'ظو', 'ظي',
    'عا', 'عو', 'عي',
    'غا', 'غو', 'غي',
  ];

  return (
    <div className="font-arabic min-h-screen" style={{ direction: 'rtl' }}>
      <div className="w-full h-full bg-zinc-900 overflow-hidden">
        {/* En-tête */}
        <div className="bg-arabic-gradient text-white p-6 text-center">
          <div className="text-3xl md:text-3xl font-bold">
            Leçon : les trois lettres de prolongation
          </div>
        </div>

        {/* Contenu */}
        <div className="p-8 bg-zinc-900">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-8">
              {words.map((word, index) => (
                <ProlongationCard key={index} word={word} />
              ))}
            </div>
          </div>
        </div>

        {/* Pied de page */}
        <footer className="bg-zinc-800 text-white text-center p-6 flex-shrink-0 font-semibold text-sm">
          <div>Page 19</div>
          <div className="mt-1">© 2025 Tous droits réservés</div>
        </footer>
      </div>
    </div>
  );
};

// Composant carte affichant un mot arabe
const ProlongationCard = ({ word }: { word: string }) => {
  return (
    <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-center hover:bg-zinc-700 transition-all duration-300 group min-h-[90px] flex items-center justify-center">
      <div
        className="text-2xl md:text-3xl font-bold leading-relaxed text-white group-hover:scale-105 transition-transform duration-300 break-keep"
        dir="rtl"
        lang="ar"
        style={{ fontFeatureSettings: '"calt" 1, "liga" 1' }}
      >
        {word}
      </div>
    </div>
  );
};

export default Page19;
