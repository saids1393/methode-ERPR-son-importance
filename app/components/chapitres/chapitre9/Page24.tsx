import React from 'react';

const Page24 = () => {
  const solarLetters = ['ت', 'ث', 'د', 'ذ', 'ر', 'ز', 'س', 'ش', 'ص', 'ض', 'ط', 'ظ', 'ل', 'ن'];
  const lunarLetters = ['ا', 'ب', 'ج', 'ح', 'خ', 'ع', 'غ', 'ف', 'ق', 'ك', 'م', 'و', 'ه', 'ي'];

  const solarExamples = [
    { article: 'ال', rest: 'شَّمْسُ' },
    { article: 'ال', rest: 'نَّهْرُ' },
    { article: 'ال', rest: 'دَّرْسُ' },
    { article: 'ال', rest: 'تِّينُ' },
  ];

  const lunarExamples = [
    { article: 'الْ', rest: 'قَمَرُ' },
    { article: 'الْ', rest: 'بَيْتُ' },
    { article: 'الْ', rest: 'كِتَابُ' },
    { article: 'الْ', rest: 'مَاءُ' },
  ];

  return (
    <div className="font-arabic min-h-screen" style={{ direction: 'rtl' }}>
      <div className="w-full h-full bg-zinc-900 overflow-hidden">
        <div className="bg-arabic-gradient text-white p-6 text-center">
          <div className="text-3xl md:text-3xl font-bold">
            Leçon : exemples et compréhension des lettres solaires et lunaires
          </div>
        </div>

        <div className="p-8 bg-zinc-900">
          <div className="max-w-6xl mx-auto">
            <div className="mb-12">
              <SectionTitle
                title="Lettres solaires (14 lettres)"
                color="text-yellow-400"
                bgColor="bg-yellow-900/30"
              />
              <div className="flex flex-wrap gap-3 mb-6 justify-center">
                {solarLetters.map((letter, index) => (
                  <LetterCard key={index} letter={letter} type="solar" />
                ))}
              </div>
              <SectionSubtitle title="Exemples de lettres solaires" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {solarExamples.map((example, index) => (
                  <ExampleCard
                    key={index}
                    article={example.article}
                    rest={example.rest}
                  />
                ))}
              </div>
            </div>

            <div className="mb-8">
              <SectionTitle
                title="Lettres lunaires (14 lettres)"
                color="text-blue-400"
                bgColor="bg-blue-900/30"
              />
              <div className="flex flex-wrap gap-3 mb-6 justify-center">
                {lunarLetters.map((letter, index) => (
                  <LetterCard key={index} letter={letter} type="lunar" />
                ))}
              </div>
              <SectionSubtitle title="Exemples de lettres lunaires" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {lunarExamples.map((example, index) => (
                  <ExampleCard
                    key={index}
                    article={example.article}
                    rest={example.rest}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <footer className="bg-zinc-800 text-white text-center p-6 flex-shrink-0 font-semibold text-sm">
          <div>Page 24</div>
          <div className="mt-1">© 2025 Tous droits réservés</div>
        </footer>
      </div>
    </div>
  );
};

const SectionTitle = ({ title, color, bgColor }: {
  title: string;
  color: string;
  bgColor: string;
}) => (
  <div className={`text-center font-bold text-xl ${color} mb-6 ${bgColor} py-3 rounded-lg border border-current/20`}>
    {title}
  </div>
);

const SectionSubtitle = ({ title }: { title: string }) => (
  <div className="text-lg font-semibold text-white mb-4 text-center bg-zinc-800 py-2 rounded-lg">
    {title}
  </div>
);

const LetterCard = ({ letter, type }: {
  letter: string;
  type: 'solar' | 'lunar';
}) => {
  const colorClass =
    type === 'solar'
      ? 'bg-yellow-900/30 text-yellow-400 border-yellow-600'
      : 'bg-blue-900/30 text-blue-400 border-blue-600';

  return (
    <div className={`
      ${colorClass} border-2 rounded-lg p-3 text-center 
      hover:scale-105 transition-transform duration-300
      min-w-[50px] min-h-[50px] flex items-center justify-center
    `}>
      <div className="text-2xl font-bold">
        {letter}
      </div>
    </div>
  );
};

const ExampleCard = ({ article, rest }: {
  article: string;
  rest: string;
}) => (
  <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-6 text-center hover:bg-zinc-700 transition-all duration-300">
    <div className="text-3xl md:text-4xl font-bold leading-relaxed text-white">
      {article}{rest}
    </div>
  </div>
);

export default Page24;
