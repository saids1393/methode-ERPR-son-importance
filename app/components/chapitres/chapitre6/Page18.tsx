// components/chapitres/chapitre6/Page18.tsx
import React from 'react';

const Page18 = () => {
  const letterData = [
    // Première rangée
    { letter: 'بَ', specialSign: 'ٰ', signType: 'alif', position: 'top' },
    { letter: 'جِ', specialSign: 'ۦ', signType: 'ya', position: 'bottom' },
    { letter: 'مُ', specialSign: 'ۥ', signType: 'waw', position: 'bottom' },
    { letter: 'تَ', specialSign: 'ٰ', signType: 'alif', position: 'top' },
    { letter: 'ثِ', specialSign: 'ۦ', signType: 'ya', position: 'bottom' },
    { letter: 'حُ', specialSign: 'ۥ', signType: 'waw', position: 'bottom' },
    
    // Deuxième rangée
    { letter: 'دَ', specialSign: 'ٰ', signType: 'alif', position: 'top' },
    { letter: 'ذِ', specialSign: 'ۦ', signType: 'ya', position: 'bottom' },
    { letter: 'رُ', specialSign: 'ۥ', signType: 'waw', position: 'bottom' },
    { letter: 'زَ', specialSign: 'ٰ', signType: 'alif', position: 'top' },
    { letter: 'سِ', specialSign: 'ۦ', signType: 'ya', position: 'bottom' },
    { letter: 'شُ', specialSign: 'ۥ', signType: 'waw', position: 'bottom' },
    
    // Troisième rangée
    { letter: 'صَ', specialSign: 'ٰ', signType: 'alif', position: 'top' },
    { letter: 'ضِ', specialSign: 'ۦ', signType: 'ya', position: 'bottom' },
    { letter: 'طُ', specialSign: 'ۥ', signType: 'waw', position: 'bottom' },
    { letter: 'ظَ', specialSign: 'ٰ', signType: 'alif', position: 'top' },
    { letter: 'عِ', specialSign: 'ۦ', signType: 'ya', position: 'bottom' },
    { letter: 'غُ', specialSign: 'ۥ', signType: 'waw', position: 'bottom' },
    
    // Quatrième rangée
    { letter: 'فَ', specialSign: 'ٰ', signType: 'alif', position: 'top' },
    { letter: 'قِ', specialSign: 'ۦ', signType: 'ya', position: 'bottom' },
    { letter: 'كُ', specialSign: 'ۥ', signType: 'waw', position: 'bottom' },
    { letter: 'لَ', specialSign: 'ٰ', signType: 'alif', position: 'top' },
    { letter: 'مِ', specialSign: 'ۦ', signType: 'ya', position: 'bottom' },
    { letter: 'نُ', specialSign: 'ۥ', signType: 'waw', position: 'bottom' },
    
    // Cinquième rangée
    { letter: 'هَ', specialSign: 'ٰ', signType: 'alif', position: 'top' },
    { letter: 'وَ', specialSign: 'ٰ', signType: 'alif', position: 'top' },
    { letter: 'يِ', specialSign: 'ۦ', signType: 'ya', position: 'bottom' },
    { letter: 'أُ', specialSign: 'ۥ', signType: 'waw', position: 'bottom' },
    { letter: 'إِ', specialSign: 'ۦ', signType: 'ya', position: 'bottom' },
    { letter: 'ؤُ', specialSign: 'ۥ', signType: 'waw', position: 'bottom' },
    
    // Sixième rangée
    { letter: 'ئَ', specialSign: 'ٰ', signType: 'alif', position: 'top' },
    { letter: 'ةِ', specialSign: 'ۦ', signType: 'ya', position: 'bottom' },
    { letter: 'ءُ', specialSign: 'ۥ', signType: 'waw', position: 'bottom' },
    { letter: 'خَ', specialSign: 'ٰ', signType: 'alif', position: 'top' },
    { letter: 'ذِ', specialSign: 'ۦ', signType: 'ya', position: 'bottom' },
    { letter: 'زُ', specialSign: 'ۥ', signType: 'waw', position: 'bottom' }
  ];

  return (
    <div 
      className="font-arabic min-h-screen"
      style={{ direction: 'rtl' }}
    >
      <div className="w-full h-full bg-zinc-900 overflow-hidden">
        {/* Header */}
        <div className="bg-arabic-gradient text-white p-6 text-center">
          <div className="text-3xl font-bold mb-4">بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ</div>
          <div className="bg-white/10 px-6 py-3 rounded-full text-xl font-bold backdrop-blur-sm border border-white/20 inline-block">
            الْحُرُوفُ فِي بِدَايَةِ الْكَلِمَةِ
          </div>
          <div className="text-sm mt-2 opacity-90">
            مَعَ الْعَلَامَاتِ الْخَاصَّةِ وَالْحَرَكَاتِ
          </div>
        </div>
        
        {/* Letters Grid */}
        <div className="p-8 bg-zinc-900">
          <div className="max-w-6xl mx-auto">
            {/* Grid des lettres */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
              {letterData.map((item, index) => (
                <SpecialLetterCard 
                  key={index} 
                  letter={item.letter}
                  specialSign={item.specialSign}
                  signType={item.signType}
                  position={item.position}
                />
              ))}
            </div>
            
            {/* Explication */}
            <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-6 mb-6">
              <div className="text-center font-bold text-lg text-cyan-400 mb-3 bg-cyan-900/30 py-2 rounded-lg">
                أَنْوَاعُ الْعَلَامَاتِ الْخَاصَّةِ
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center text-sm">
                <div className="bg-amber-900/30 p-3 rounded-lg">
                  <div className="text-amber-400 font-semibold mb-2">أَلِفٌ صَغِيرَةٌ</div>
                  <div className="text-3xl text-amber-400">ٰ</div>
                  <div className="text-zinc-300 mt-2">مَعَ الْفَتْحَةِ</div>
                </div>
                <div className="bg-sky-900/30 p-3 rounded-lg">
                  <div className="text-sky-400 font-semibold mb-2">يَاءٌ صَغِيرَةٌ</div>
                  <div className="text-3xl text-sky-400">ۦ</div>
                  <div className="text-zinc-300 mt-2">مَعَ الْكَسْرَةِ</div>
                </div>
                <div className="bg-emerald-900/30 p-3 rounded-lg">
                  <div className="text-emerald-400 font-semibold mb-2">وَاوٌ صَغِيرَةٌ</div>
                  <div className="text-3xl text-emerald-400">ۥ</div>
                  <div className="text-zinc-300 mt-2">مَعَ الضَّمَّةِ</div>
                </div>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full h-2 bg-zinc-800 rounded-full mb-6 overflow-hidden">
              <div 
                className="h-full bg-arabic-gradient rounded-full animate-progress"
              ></div>
            </div>
            
            {/* Instructions */}
            <div className="bg-gradient-to-r from-zinc-800 to-zinc-700 rounded-lg p-4">
              <div className="text-center text-zinc-300 text-sm">
                <span className="text-purple-400 font-semibold">مُلَاحَظَةٌ:</span>
                <span className="mr-2">هَذِهِ الْعَلَامَاتُ تُسَاعِدُ فِي نُطْقِ الْحُرُوفِ بِشَكْلٍ صَحِيحٍ</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="bg-gradient-to-r from-zinc-800 to-zinc-700 text-white p-5 flex justify-between items-center">
          <div className="text-lg font-semibold">الحروف في بداية الكلمة مع العلامات الخاصة</div>
          <div className="bg-arabic-gradient text-white px-5 py-2 rounded-full font-semibold">
            الصفحة الثامنة عشرة
          </div>
        </div>
      </div>
    </div>
  );
};

// SpecialLetterCard Component avec positionnement des signes spéciaux
const SpecialLetterCard = ({ letter, specialSign, signType, position }: { 
  letter: string;
  specialSign: string;
  signType: string;
  position: string;
}) => {
  const getSignColor = (type: string) => {
    switch(type) {
      case 'alif': return 'text-amber-400';
      case 'ya': return 'text-sky-400';
      case 'waw': return 'text-emerald-400';
      default: return 'text-zinc-400';
    }
  };

  const getSignSize = (type: string) => {
    switch(type) {
      case 'alif': return 'text-3xl';
      case 'ya': return 'text-xl';
      case 'waw': return 'text-2xl';
      default: return 'text-xl';
    }
  };

  const getPositionClasses = (type: string, pos: string) => {
    if (pos === 'top') {
      return 'absolute -top-1 left-1/2 transform -translate-x-1/2';
    } else {
      return 'absolute -bottom-1 left-1/2 transform -translate-x-1/2';
    }
  };

  return (
    <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-4 text-center hover:bg-zinc-700 transition-all duration-300 group min-h-[110px] flex items-center justify-center relative">
      <div className="relative">
        {/* La lettre principale */}
        <div className="text-3xl md:text-4xl font-bold text-white group-hover:scale-105 transition-transform duration-300">
          {letter}
        </div>
        
        {/* Le signe spécial positionné */}
        <span 
          className={`
            ${getSignColor(signType)} 
            ${getSignSize(signType)} 
            ${getPositionClasses(signType, position)}
            font-bold select-none pointer-events-none
          `}
        >
          {specialSign}
        </span>
      </div>
    </div>
  );
};

export default Page18;