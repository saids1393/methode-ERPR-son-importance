// lib/audioMappings.ts - Mapping organisé par chapitre/page/case

// CHAPITRE 0 - Introduction aux lettres
export const chapter0AudioMappings: { [key: string]: string } = {
  // Page 1 - Lettres de base
  '1': 'chap0_pg0_case1',
  'ب': 'chap0_pg1_case2_ba',
  'ت': 'chap0_pg1_case3_ta',
  // Continuez avec les autres lettres de la page 1...
  
  // Page 2 - Suite des lettres
  'ج': 'chap0_pg2_case1_jim',
  'ح': 'chap0_pg2_case2_ha',
  'خ': 'chap0_pg2_case3_kha',
  // Continuez...
};

// CHAPITRE 1 - Lettres avec voyelles courtes (Fatha)
export const chapter1AudioMappings: { [key: string]: string } = {
  // Page 1 - Fatha avec premières lettres
  'اَ': 'chap1_pg1_case1_alif_fatha',
  'بَ': 'chap1_pg1_case2_ba_fatha',
  'تَ': 'chap1_pg1_case3_ta_fatha',
  // Continuez...
  
  // Page 2 - Fatha avec lettres suivantes
  'جَ': 'chap1_pg2_case1_jim_fatha',
  'حَ': 'chap1_pg2_case2_ha_fatha',
  'خَ': 'chap1_pg2_case3_kha_fatha',
  // Continuez...
};

// CHAPITRE 2 - Lettres avec voyelles courtes (Damma)
export const chapter2AudioMappings: { [key: string]: string } = {
  // Page 1 - Damma avec premières lettres
  'اُ': 'chap2_pg1_case1_alif_damma',
  'بُ': 'chap2_pg1_case2_ba_damma',
  'تُ': 'chap2_pg1_case3_ta_damma',
  // Continuez...
  
  // Page 2 - Damma avec lettres suivantes
  'جُ': 'chap2_pg2_case1_jim_damma',
  'حُ': 'chap2_pg2_case2_ha_damma',
  'خُ': 'chap2_pg2_case3_kha_damma',
  // Continuez...
};

// CHAPITRE 3 - Lettres avec voyelles courtes (Kasra)
export const chapter3AudioMappings: { [key: string]: string } = {
  // Page 1 - Kasra avec premières lettres
  'اِ': 'chap3_pg1_case1_alif_kasra',
  'بِ': 'chap3_pg1_case2_ba_kasra',
  'تِ': 'chap3_pg1_case3_ta_kasra',
  // Continuez...
  
  // Page 2 - Kasra avec lettres suivantes
  'جِ': 'chap3_pg2_case1_jim_kasra',
  'حِ': 'chap3_pg2_case2_ha_kasra',
  'خِ': 'chap3_pg2_case3_kha_kasra',
  // Continuez...
};

// CHAPITRE 4 - Mots de deux lettres
export const chapter4AudioMappings: { [key: string]: string } = {
  // Page 1 - Mots simples de 2 lettres
  'في': 'chap4_pg1_case1_fi',
  'من': 'chap4_pg1_case2_min',
  'قل': 'chap4_pg1_case3_qul',
  // Continuez...
  
  // Page 2 - Autres mots de 2 lettres
  'هو': 'chap4_pg2_case1_huwa',
  'ما': 'chap4_pg2_case2_ma',
  'أن': 'chap4_pg2_case3_an',
  // Continuez...
};

// CHAPITRE 5 - Mots de trois lettres
export const chapter5AudioMappings: { [key: string]: string } = {
  // Page 1 - Mots de 3 lettres sans voyelles
  'نور': 'chap5_pg1_case1_nur',
  'عبد': 'chap5_pg1_case2_abd',
  'نار': 'chap5_pg1_case3_nar',
  // Continuez...
  
  // Page 2 - Autres mots de 3 lettres
  'ملك': 'chap5_pg2_case1_malik',
  'نهر': 'chap5_pg2_case2_nahr',
  'قمر': 'chap5_pg2_case3_qamar',
  // Continuez...
};

// CHAPITRE 6 - Mots avec voyelles (Fatha)
export const chapter6AudioMappings: { [key: string]: string } = {
  // Page 1 - Mots avec fatha
  'وَرَقٌ': 'chap6_pg1_case1_waraq',
  'قَلَمٌ': 'chap6_pg1_case2_qalam',
  'مَلَكٌ': 'chap6_pg1_case3_malak',
  // Continuez...
  
  // Page 2 - Suite mots avec fatha
  'بَشَرٌ': 'chap6_pg2_case1_bashar',
  'جَبَلٌ': 'chap6_pg2_case2_jabal',
  'بَقَرٌ': 'chap6_pg2_case3_baqar',
  // Continuez...
};

// CHAPITRE 7 - Mots avec voyelles mixtes
export const chapter7AudioMappings: { [key: string]: string } = {
  // Page 1 - Mots avec voyelles mixtes
  'رَجُلٌ': 'chap7_pg1_case1_rajul',
  'سَمَكٌ': 'chap7_pg1_case2_samak',
  'يَدٌ': 'chap7_pg1_case3_yad',
  // Continuez...
  
  // Page 2 - Suite voyelles mixtes
  'زَمَنٌ': 'chap7_pg2_case1_zaman',
  'لَبَنٌ': 'chap7_pg2_case2_laban',
  'وَلَدٌ': 'chap7_pg2_case3_walad',
  // Continuez...
};

// CHAPITRE 8 - Verbes simples
export const chapter8AudioMappings: { [key: string]: string } = {
  // Page 1 - Verbes de base
  'غفر': 'chap8_pg1_case1_ghafara',
  'سجد': 'chap8_pg1_case2_sajada',
  'خلق': 'chap8_pg1_case3_khalq',
  // Continuez...
  
  // Page 2 - Autres verbes
  'صدق': 'chap8_pg2_case1_sadaqa',
  'كفر': 'chap8_pg2_case2_kafara',
  'نصر': 'chap8_pg2_case3_nasr',
  // Continuez...
};

// CHAPITRE 9 - Expressions courantes
export const chapter9AudioMappings: { [key: string]: string } = {
  // Page 1 - Expressions avec prépositions
  'به': 'chap9_pg1_case1_bihi',
  'له': 'chap9_pg1_case2_lahu',
  'عن': 'chap9_pg1_case3_an_preposition',
  // Continuez...
  
  // Page 2 - Pronoms et particules
  'هم': 'chap9_pg2_case1_hum',
  'نا': 'chap9_pg2_case2_na',
  'كم': 'chap9_pg2_case3_kam',
  // Continuez...
};

// CHAPITRE 10 - Révisions et mots avancés
export const chapter10AudioMappings: { [key: string]: string } = {
  // Page 1 - Mots avancés
  'غيب': 'chap10_pg1_case1_ghayb',
  'رسل': 'chap10_pg1_case2_rusul',
  'نفس': 'chap10_pg1_case3_nafs',
  // Continuez...
  
  // Page 2 - Concepts abstraits
  'علم': 'chap10_pg2_case1_ilm',
  'قلب': 'chap10_pg2_case2_qalb',
  'خوف': 'chap10_pg2_case3_khawf',
  // Continuez...
};

// Fonction pour fusionner tous les chapitres
export function getAllAudioMappings(): { [key: string]: string } {
  return {
    ...chapter0AudioMappings,
    ...chapter1AudioMappings,
    ...chapter2AudioMappings,
    ...chapter3AudioMappings,
    ...chapter4AudioMappings,
    ...chapter5AudioMappings,
    ...chapter6AudioMappings,
    ...chapter7AudioMappings,
    ...chapter8AudioMappings,
    ...chapter9AudioMappings,
    ...chapter10AudioMappings
  };
}

// Fonction pour obtenir le mapping d'un chapitre spécifique
export function getChapterMappings(chapterNumber: number): { [key: string]: string } {
  const chapters = [
    chapter0AudioMappings,
    chapter1AudioMappings,
    chapter2AudioMappings,
    chapter3AudioMappings,
    chapter4AudioMappings,
    chapter5AudioMappings,
    chapter6AudioMappings,
    chapter7AudioMappings,
    chapter8AudioMappings,
    chapter9AudioMappings,
    chapter10AudioMappings
  ];
  
  return chapters[chapterNumber] || {};
}

// Fonction pour obtenir le nom du fichier audio
export function getAudioFileName(text: string, chapterNumber?: number): string {
  if (chapterNumber !== undefined) {
    const chapterMappings = getChapterMappings(chapterNumber);
    return chapterMappings[text] || `chap${chapterNumber}_undefined_${text}`;
  }
  
  const allMappings = getAllAudioMappings();
  return allMappings[text] || `undefined_${text}`;
}

// Fonction helper pour générer un nom de fichier
export function generateAudioFileName(chapter: number, page: number, caseNumber: number, description: string): string {
  return `chap${chapter}_pg${page}_case${caseNumber}_${description}`;
}