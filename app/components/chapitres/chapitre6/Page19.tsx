import React from 'react';

const noConnect = ['ا', 'د', 'ذ', 'ر', 'ز', 'و'];

const Page19 = () => {
  // Toutes les combinaisons déjà fusionnées (base + prolongation)
  const words = [
    'بَـا', 'بُـو', 'بِـي',
    'تَـا', 'تُـو', 'تِـي',
    'ثَـا', 'ثُـو', 'ثِـي',
    'جَـا', 'جُـو', 'جِـي',
    'حَـا', 'حُـو', 'حِـي',
    'خَـا', 'خُـو', 'خِـي',
    'دَـا', 'دُـو', 'دِـي',
    'ذَـا', 'ذُـو', 'ذِـي',
    'رَـا', 'رُـو', 'رِـي',
    'زَـا', 'زُـو', 'زِـي',
    'سَـا', 'سُـو', 'سِـي',
    'شَـا', 'شُـو', 'شِـي',
    'صَـا', 'صُـو', 'صِـي',
    'ضَـا', 'ضُـو', 'ضِـي',
    'طَـا', 'طُـو', 'طِـي',
    'ظَـا', 'ظُـو', 'ظِـي',
    'عَـا', 'عُـو', 'عِـي',
    'غَـا', 'غُـو', 'غِـي',
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
  // Extraire les caractères arabes sans les diacritiques (juste pour détecter la base et la prolongation)
  const arabicLetters = [...word.replace(/[^\u0600-\u06FF]/g, '')];

  const lettreBase = arabicLetters[0];
  const prolongation = arabicLetters[arabicLetters.length - 1];

  // Vérifier si la lettre de base ne connecte pas à la suivante
  const isNoConnect = noConnect.includes(lettreBase);

  // Si la lettre ne connecte pas, retirer le tatweel (ـ) pour que la prolongation soit isolée
  const displayWord = isNoConnect ? word.replace(/ـ/g, '') : word;

  return (
    <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-center hover:bg-zinc-700 transition-all duration-300 group min-h-[90px] flex items-center justify-center">
      <div
        className="text-2xl md:text-3xl font-bold leading-relaxed text-white group-hover:scale-105 transition-transform duration-300 break-keep"
        dir="rtl"
        lang="ar"
        style={{ fontFeatureSettings: '"calt" 1, "liga" 1' }}
      >
        {displayWord}
      </div>
    </div>
  );
};

export default Page19;
