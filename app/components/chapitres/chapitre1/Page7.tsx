"use client";
import React from 'react';

const chapterPage7AudioMappings: { [key: string]: string } = {
  // Row 1
  'الٓمٓ': 'chap_page7_case1',
  'الٓمٓصٓ': 'chap_page7_case2',
  'الٓر': 'chap_page7_case3',
  'الٓمٓر': 'chap_page7_case4',
  // Row 2
  'كٓهيعٓصٓ': 'chap_page7_case5',
  'طه': 'chap_page7_case6',
  'طسٓمٓ': 'chap_page7_case7',
  'طسٓ': 'chap_page7_case8',
  // Row 3
  'يسٓ': 'chap_page7_case9',
  'صٓ': 'chap_page7_case10',
  'قٓ': 'chap_page7_case11',
  'نٓ': 'chap_page7_case12',
  // Row 4
  'حمٓ': 'chap_page7_case13',
  'حمٓ عٓسٓقٓ': 'chap_page7_case14',
};

const Page7 = () => {
  const playLetterAudio = (letter: string) => {
    const audioFileName = chapterPage7AudioMappings[letter];
    if (audioFileName) {
      const audio = new Audio(`/audio/chapitre0_1/${audioFileName}.mp3`);
      audio.play().catch(error => {
        console.error('Erreur lors de la lecture audio:', error);
      });
    }
  };

  const hurufMuqattaah = [
    // Row 1
    { letters: 'الٓمٓ', emphatic: false },
    { letters: 'الٓمٓصٓ', emphatic: true },
    { letters: 'الٓر', emphatic: false },
    { letters: 'الٓمٓر', emphatic: true },

    // Row 2
    { letters: 'كٓهيعٓصٓ', emphatic: false },
    { letters: 'طه', emphatic: true },
    { letters: 'طسٓمٓ', emphatic: false },
    { letters: 'طسٓ', emphatic: true },

    // Row 3
    { letters: 'يسٓ', emphatic: false },
    { letters: 'صٓ', emphatic: true },
    { letters: 'قٓ', emphatic: false },
    { letters: 'نٓ', emphatic: true },

    // Row 4
    { letters: 'حمٓ', emphatic: false },
    { letters: 'حمٓ عٓسٓقٓ', emphatic: true }
  ];

  const handleLetterClick = (letter: string) => {
    playLetterAudio(letter);
  };

  return (
    <div className="font-arabic min-h-screen" style={{ direction: 'rtl' }}>
      <div className="w-full h-full bg-zinc-900 overflow-hidden">
        {/* Header */}
        <div className="bg-arabic-gradient text-white p-6 text-center">
          <div className="text-3xl font-bold mb-4">Exercice : reconnaissance des lettres séparées au début de certaines sourates</div>
        </div>

        {/* Huruf Muqattaah Grid */}
        <div className="p-8 bg-zinc-900">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
            {hurufMuqattaah.map((item, index) => (
              <HurufCell
                key={index}
                letters={item.letters}
                emphatic={item.emphatic}
                onClick={() => handleLetterClick(item.letters)}
              />
            ))}
          </div>
        </div>

        {/* Footer standard */}
        <footer className="bg-zinc-800 text-white text-center p-6 flex-shrink-0 font-semibold text-sm">
          <div>Page 7</div>
          <div className="mt-1">© 2025 Tous droits réservés</div>
        </footer>
      </div>
    </div>
  );
};

// HurufCell Component simplifié sans le nom
const HurufCell = ({ letters, emphatic, onClick }: {
  letters: string;
  emphatic?: boolean;
  onClick?: () => void;
}) => (
  <div
    className="bg-zinc-800 border border-zinc-700 rounded-xl p-4 text-center min-h-[120px] flex flex-col justify-center items-center hover:bg-zinc-700 transition-all duration-300 hover:scale-105 cursor-pointer"
    onClick={onClick}
  >
    <div className={`text-2xl md:text-3xl font-bold transition-colors ${
      emphatic ? 'text-red-400' : 'text-white'
    }`}>
      {letters}
    </div>
  </div>
);

export default Page7;
