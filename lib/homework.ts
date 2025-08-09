// lib/homework.ts - Gestion des devoirs par chapitre

export interface HomeworkData {
  chapterNumber: number;
  title: string;
  description: string;
  exercises: Exercise[];
  instructions: string[];
  dueDate?: string;
}

export interface Exercise {
  id: string;
  title: string;
  description: string;
  type: 'writing' | 'reading' | 'pronunciation' | 'comprehension';
  content: string;
  expectedAnswer?: string;
}

// Définition des devoirs pour chaque chapitre
export const homeworkByChapter: { [key: number]: HomeworkData } = {
  1: {
    chapterNumber: 1,
    title: "Devoir Chapitre 1 - Maîtrise de l'alphabet",
    description: "Exercices de reconnaissance et d'écriture des lettres arabes sous toutes leurs formes",
    instructions: [
      "Imprimez les grilles d'écriture fournies",
      "Pratiquez l'écriture de chaque lettre 10 fois",
      "Enregistrez-vous en prononçant chaque lettre",
      "Envoyez votre enregistrement audio par email"
    ],
    exercises: [
      {
        id: "ex1_1",
        title: "Reconnaissance des lettres isolées",
        description: "Identifiez et nommez chaque lettre présentée",
        type: "reading",
        content: "ا - ب - ت - ث - ج - ح - خ - د - ذ - ر - ز - س - ش - ص - ض - ط - ظ - ع - غ - ف - ق - ك - ل - م - ن - ه - و - ي"
      },
      {
        id: "ex1_2", 
        title: "Écriture des lettres en début de mot",
        description: "Écrivez chaque lettre dans sa forme de début de mot",
        type: "writing",
        content: "Utilisez la grille fournie pour écrire : بـ - تـ - ثـ - جـ - حـ - خـ - سـ - شـ - صـ - ضـ - طـ - ظـ - عـ - غـ - فـ - قـ - كـ - لـ - مـ - نـ - هـ - يـ"
      },
      {
        id: "ex1_3",
        title: "Distinction lettres emphatiques",
        description: "Identifiez et prononcez correctement les 8 lettres emphatiques",
        type: "pronunciation",
        content: "خ - ر - ص - ض - ط - ظ - غ - ق",
        expectedAnswer: "Prononciation grave et profonde pour chaque lettre"
      }
    ]
  },
  2: {
    chapterNumber: 2,
    title: "Devoir Chapitre 2 - Voyelles simples",
    description: "Maîtrise des trois voyelles principales et leur application",
    instructions: [
      "Pratiquez la lecture des lettres avec voyelles",
      "Enregistrez-vous en lisant les exercices",
      "Écrivez 20 combinaisons lettre + voyelle",
      "Identifiez les voyelles dans un texte simple"
    ],
    exercises: [
      {
        id: "ex2_1",
        title: "Lecture avec Fatha",
        description: "Lisez chaque lettre avec la voyelle Fatha (son 'a')",
        type: "reading",
        content: "بَ - تَ - ثَ - جَ - حَ - خَ - دَ - ذَ - رَ - زَ - سَ - شَ - صَ - ضَ - طَ - ظَ - عَ - غَ - فَ - قَ - كَ - لَ - مَ - نَ - هَ - وَ - يَ"
      },
      {
        id: "ex2_2",
        title: "Lecture avec Damma",
        description: "Lisez chaque lettre avec la voyelle Damma (son 'ou')",
        type: "reading", 
        content: "بُ - تُ - ثُ - جُ - حُ - خُ - دُ - ذُ - رُ - زُ - سُ - شُ - صُ - ضُ - طُ - ظُ - عُ - غُ - فُ - قُ - كُ - لُ - مُ - نُ - هُ - وُ - يُ"
      },
      {
        id: "ex2_3",
        title: "Lecture avec Kasra",
        description: "Lisez chaque lettre avec la voyelle Kasra (son 'i')",
        type: "reading",
        content: "بِ - تِ - ثِ - جِ - حِ - خِ - دِ - ذِ - رِ - زِ - سِ - شِ - صِ - ضِ - طِ - ظِ - عِ - غِ - فِ - قِ - كِ - لِ - مِ - نِ - هِ - وِ - يِ"
      }
    ]
  },
  3: {
    chapterNumber: 3,
    title: "Devoir Chapitre 3 - Voyelles doubles (Tanwin)",
    description: "Application des voyelles doubles dans la lecture et l'écriture",
    instructions: [
      "Maîtrisez la prononciation du 'n' final",
      "Pratiquez l'écriture des signes de tanwin",
      "Lisez des mots avec tanwin",
      "Enregistrez votre lecture"
    ],
    exercises: [
      {
        id: "ex3_1",
        title: "Tanwin Fath (son 'an')",
        description: "Lisez les lettres avec tanwin fath",
        type: "reading",
        content: "بً - تً - ثً - جً - حً - خً - دً - ذً - رً - زً - سً - شً - صً - ضً - طً - ظً - عً - غً - فً - قً - كً - لً - مً - نً - هً - وً - يً"
      },
      {
        id: "ex3_2",
        title: "Tanwin Damm (son 'oun')",
        description: "Lisez les lettres avec tanwin damm",
        type: "reading",
        content: "بٌ - تٌ - ثٌ - جٌ - حٌ - خٌ - دٌ - ذٌ - رٌ - زٌ - سٌ - شٌ - صٌ - ضٌ - طٌ - ظٌ - عٌ - غٌ - فٌ - قٌ - كٌ - لٌ - مٌ - نٌ - هٌ - وٌ - يٌ"
      },
      {
        id: "ex3_3",
        title: "Tanwin Kasr (son 'in')",
        description: "Lisez les lettres avec tanwin kasr",
        type: "reading",
        content: "بٍ - تٍ - ثٍ - جٍ - حٍ - خٍ - دٍ - ذٍ - رٍ - زٍ - سٍ - شٍ - صٍ - ضٍ - طٍ - ظٍ - عٍ - غٍ - فٍ - قٍ - كٍ - لٍ - مٍ - نٍ - هٍ - وٍ - يٍ"
      }
    ]
  },
  4: {
    chapterNumber: 4,
    title: "Devoir Chapitre 4 - Lettres non-connectées",
    description: "Identification et application des 6 lettres qui ne s'attachent pas",
    instructions: [
      "Mémorisez les 6 lettres : ا - د - ذ - ر - ز - و",
      "Pratiquez leur reconnaissance dans des mots",
      "Différenciez ذ et ن selon leur connexion",
      "Lisez des exemples pratiques"
    ],
    exercises: [
      {
        id: "ex4_1",
        title: "Identification des lettres non-connectées",
        description: "Dans les mots suivants, identifiez les lettres qui ne s'attachent pas",
        type: "comprehension",
        content: "قَالَ - عُدْنَ - يَذْكُرُ - فَرِحَ - تَزَكَّىٰ - خَوْفٌ",
        expectedAnswer: "ا dans قَالَ, د dans عُدْنَ, ذ dans يَذْكُرُ, ر dans فَرِحَ, ز dans تَزَكَّىٰ, و dans خَوْفٌ"
      },
      {
        id: "ex4_2",
        title: "Différenciation ذ et ن",
        description: "Expliquez pourquoi ces lettres sont différentes selon leur connexion",
        type: "comprehension",
        content: "Analysez : نَذْرٌ vs ذَنْبٌ",
        expectedAnswer: "Dans نَذْرٌ, ن s'attache à ذ. Dans ذَنْبٌ, ذ ne s'attache pas à ن"
      }
    ]
  },
  5: {
    chapterNumber: 5,
    title: "Devoir Chapitre 5 - Synthèse voyelles et mots",
    description: "Application pratique de toutes les voyelles dans des mots complets",
    instructions: [
      "Lisez les mots avec fluidité",
      "Identifiez les types de voyelles utilisées",
      "Pratiquez l'écriture de mots complets",
      "Enregistrez votre lecture de 10 mots"
    ],
    exercises: [
      {
        id: "ex5_1",
        title: "Lecture de mots complets",
        description: "Lisez ces mots en appliquant toutes les règles apprises",
        type: "reading",
        content: "وَرَقٌ - قَلَمٌ - مَلَكٌ - بَشَرٌ - جَبَلٌ - بَقَرٌ - ثَمَرٌ - حَجَرٌ - لَبَنٌ - قَمَرٌ"
      },
      {
        id: "ex5_2",
        title: "Analyse des voyelles",
        description: "Pour chaque mot, identifiez le type de voyelles utilisées",
        type: "comprehension",
        content: "Analysez : كِتَابٌ - مُعَلِّمٌ - طَالِبٌ",
        expectedAnswer: "كِتَابٌ: kasra, fatha, tanwin fath / مُعَلِّمٌ: damma, fatha, kasra, tanwin damm / طَالِبٌ: fatha, kasra, tanwin damm"
      }
    ]
  },
  6: {
    chapterNumber: 6,
    title: "Devoir Chapitre 6 - Prolongations et lettres douces",
    description: "Maîtrise des prolongations et des lettres layyinah",
    instructions: [
      "Pratiquez les trois types de prolongations",
      "Différenciez prolongation et lettre douce",
      "Lisez des mots avec prolongations",
      "Identifiez les Alif/Waw/Ya saghirah"
    ],
    exercises: [
      {
        id: "ex6_1",
        title: "Lecture avec prolongations",
        description: "Lisez en prolongeant correctement",
        type: "reading",
        content: "بَا - بُو - بِي - تَا - تُو - تِي - جَا - جُو - جِي - حَا - حُو - حِي"
      },
      {
        id: "ex6_2",
        title: "Lettres douces (layyinah)",
        description: "Lisez ces combinaisons avec lettres douces",
        type: "reading",
        content: "بَوْ - بَيْ - تَوْ - تَيْ - جَوْ - جَيْ - حَوْ - حَيْ"
      },
      {
        id: "ex6_3",
        title: "Identification des prolongations",
        description: "Dans ces mots, identifiez les prolongations actives",
        type: "comprehension",
        content: "مُوسَىٰ - عِيسَىٰ - يَحْيَىٰ",
        expectedAnswer: "مُوسَىٰ: prolongation waw + alif saghirah / عِيسَىٰ: prolongation ya + alif saghirah / يَحْيَىٰ: alif saghirah finale"
      }
    ]
  },
  7: {
    chapterNumber: 7,
    title: "Devoir Chapitre 7 - Règles combinées",
    description: "Application de toutes les règles apprises ensemble",
    instructions: [
      "Combinez voyelles, prolongations et lettres douces",
      "Lisez des mots complexes",
      "Analysez la structure des mots",
      "Pratiquez la fluidité de lecture"
    ],
    exercises: [
      {
        id: "ex7_1",
        title: "Lecture de mots complexes",
        description: "Lisez ces mots en appliquant toutes les règles",
        type: "reading",
        content: "بَيْتٌ - قَوْمٌ - نَوْمٌ - صَوْتٌ - لَيْلٌ - رَيْحٌ - بَيْضٌ - خُبْزٌ - عَيْنٌ - زَيْتٌ"
      },
      {
        id: "ex7_2",
        title: "Analyse structurelle",
        description: "Décomposez ces mots en leurs éléments",
        type: "comprehension",
        content: "Analysez : بَيْتٌ - قَوْمٌ - لَيْلٌ",
        expectedAnswer: "بَيْتٌ: ba+fatha+ya douce+ta+tanwin / قَوْمٌ: qaf+fatha+waw douce+mim+tanwin / لَيْلٌ: lam+fatha+ya douce+lam+tanwin"
      }
    ]
  },
  8: {
    chapterNumber: 8,
    title: "Devoir Chapitre 8 - La Soukoune",
    description: "Application de la soukoune dans la lecture",
    instructions: [
      "Maîtrisez l'arrêt net de la soukoune",
      "Pratiquez avec des mots coraniques",
      "Différenciez soukoune et voyelles",
      "Lisez des versets avec soukoune"
    ],
    exercises: [
      {
        id: "ex8_1",
        title: "Lecture avec soukoune",
        description: "Lisez en marquant bien l'arrêt de la soukoune",
        type: "reading",
        content: "قُلْ - كَلْبٌ - يَوْمٍ - حَسْبُ - رَبْعُ - مَسْجِدٌ - فَلْيَنْظُرْ - يَلْهَثْ"
      },
      {
        id: "ex8_2",
        title: "Versets coraniques",
        description: "Lisez ces versets en appliquant la soukoune",
        type: "reading",
        content: "وَإِذَا الْجِبَالُ نُسِفَتْ - وَيَمْنَعُونَ الْمَاعُونَ - لَكُمْ دِينُكُمْ وَلِيَ دِينِ"
      }
    ]
  },
  9: {
    chapterNumber: 9,
    title: "Devoir Chapitre 9 - Lettres solaires et lunaires",
    description: "Maîtrise de la prononciation de l'article défini",
    instructions: [
      "Mémorisez les 14 lettres solaires",
      "Mémorisez les 14 lettres lunaires", 
      "Pratiquez la prononciation de l'article",
      "Lisez des exemples coraniques"
    ],
    exercises: [
      {
        id: "ex9_1",
        title: "Classification des lettres",
        description: "Classez ces lettres en solaires ou lunaires",
        type: "comprehension",
        content: "ت - ب - ن - ق - ش - ك - ر - م - ص - ع",
        expectedAnswer: "Solaires: ت, ن, ش, ر, ص / Lunaires: ب, ق, ك, م, ع"
      },
      {
        id: "ex9_2",
        title: "Lecture avec article défini",
        description: "Lisez en prononçant correctement l'article",
        type: "reading",
        content: "الشَّمْسُ - النَّهْرُ - الْقَمَرُ - الْبَيْتُ - الصَّبْرُ - الْكِتَابُ"
      }
    ]
  },
  10: {
    chapterNumber: 10,
    title: "Devoir Chapitre 10 - La Shaddah",
    description: "Maîtrise du doublement des lettres avec shaddah",
    instructions: [
      "Pratiquez l'insistance sur les lettres doublées",
      "Lisez des mots coraniques avec shaddah",
      "Combinez shaddah avec autres règles",
      "Enregistrez votre lecture finale"
    ],
    exercises: [
      {
        id: "ex10_1",
        title: "Lecture avec shaddah",
        description: "Lisez en insistant sur les lettres doublées",
        type: "reading",
        content: "مَدَّ - حَقَّ - فُرَّ - وَدَّ - رُدَّ - عَضَّ - شَدَّ - طُبَّ - قَطَّ - غَلَّ"
      },
      {
        id: "ex10_2",
        title: "Versets avec shaddah",
        description: "Lisez ces versets coraniques",
        type: "reading",
        content: "إِنَّ اللَّهَ غَفُورٌ رَحِيمٌ - تَبَّتْ يَدَا أَبِي لَهَبٍ وَتَبَّ"
      },
      {
        id: "ex10_3",
        title: "Synthèse complète",
        description: "Lisez en appliquant toutes les règles de la méthode",
        type: "reading",
        content: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ - الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ"
      }
    ]
  }
};

// Fonction pour obtenir le devoir d'un chapitre
export function getHomeworkForChapter(chapterNumber: number): HomeworkData | null {
  return homeworkByChapter[chapterNumber] || null;
}

// Fonction pour vérifier si un utilisateur a complété toutes les pages d'un chapitre
export function hasCompletedChapter(chapterNumber: number, completedPages: number[]): boolean {
  // Définir les pages par chapitre selon la structure existante
  const chapterPages: { [key: number]: number[] } = {
    1: [1, 2, 3, 4, 5, 6, 7],
    2: [8, 9, 10, 11],
    3: [12, 13, 14, 15],
    4: [16],
    5: [17],
    6: [18, 19, 20],
    7: [21],
    8: [22, 23],
    9: [24],
    10: [25, 26, 27, 28, 29]
  };

  const requiredPages = chapterPages[chapterNumber];
  if (!requiredPages) return false;

  // Vérifier que toutes les pages du chapitre sont complétées
  return requiredPages.every(pageNum => completedPages.includes(pageNum));
}

// Fonction pour générer le PDF du devoir
export async function generateHomeworkPDF(homework: HomeworkData): Promise<Uint8Array> {
  const { PDFDocument, StandardFonts, rgb } = await import('pdf-lib');
  
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]); // Format A4
  const { width, height } = page.getSize();
  
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  
  const fontSize = 12;
  const titleFontSize = 18;
  const margin = 50;
  let y = height - margin;

  // Titre
  page.drawText(homework.title, {
    x: margin,
    y,
    size: titleFontSize,
    font: boldFont,
    color: rgb(0.2, 0.2, 0.8)
  });
  y -= 40;

  // Description
  page.drawText('Description :', {
    x: margin,
    y,
    size: fontSize,
    font: boldFont
  });
  y -= 20;

  page.drawText(homework.description, {
    x: margin,
    y,
    size: fontSize,
    font
  });
  y -= 40;

  // Instructions
  page.drawText('Instructions :', {
    x: margin,
    y,
    size: fontSize,
    font: boldFont
  });
  y -= 20;

  homework.instructions.forEach((instruction, index) => {
    page.drawText(`${index + 1}. ${instruction}`, {
      x: margin,
      y,
      size: fontSize,
      font
    });
    y -= 20;
  });
  y -= 20;

  // Exercices
  page.drawText('Exercices :', {
    x: margin,
    y,
    size: fontSize,
    font: boldFont
  });
  y -= 20;

  homework.exercises.forEach((exercise, index) => {
    if (y < 100) {
      // Nouvelle page si nécessaire
      const newPage = pdfDoc.addPage([595, 842]);
      y = height - margin;
    }

    page.drawText(`Exercice ${index + 1}: ${exercise.title}`, {
      x: margin,
      y,
      size: fontSize,
      font: boldFont,
      color: rgb(0.8, 0.2, 0.2)
    });
    y -= 20;

    page.drawText(exercise.description, {
      x: margin,
      y,
      size: fontSize,
      font
    });
    y -= 20;

    page.drawText(exercise.content, {
      x: margin,
      y,
      size: fontSize + 2,
      font: boldFont
    });
    y -= 40;
  });

  return await pdfDoc.save();
}