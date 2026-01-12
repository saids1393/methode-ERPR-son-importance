// lib/chapters-tajwid.ts
import { Chapter } from "./chapters";

/**
 * Convertit un numéro de page global en chapitre et numéro de page locale
 * @param globalPageNumber - Le numéro de page croissant continu (4, 5, 6...)
 * @returns {chapterNumber: number, localPageNumber: number} ou null si non trouvé
 */
export const getChapterAndLocalPageFromGlobalPage = (globalPageNumber: number): { chapterNumber: number; localPageNumber: number } | null => {
  for (const chapter of chaptersTajwid) {
    const pages = chapter.pages || [];
    const match = pages.find(p => p.pageNumber === globalPageNumber);
    if (match) {
      // Calculer le numéro de page local dans ce chapitre
      const localPageIndex = pages.findIndex(p => p.pageNumber === globalPageNumber);
      return {
        chapterNumber: chapter.chapterNumber,
        localPageNumber: localPageIndex,
      };
    }
  }
  return null;
};

// Original structure to be modified dynamically
const originalChaptersTajwid: Chapter[] = [
  {
    title: "Définition et sortie des lettres",
    chapterNumber: 1,
    module: 'TAJWID',
    introduction: "Le Tajwid est l'art de bien prononcer les versets du Coran en respectant les règles phonétiques et les caractéristiques des lettres arabes. Ce premier chapitre pose les bases : qu'est-ce que le Tajwid, pourquoi l'étudier, et comment commencer correctement.\n\nLe mot 'Tajwid' vient de la racine 'jauda' qui signifie 'bien faire' ou 'améliorer'. C'est un ensemble de règles qui guide la prononciation, l'articulation et l'intonation du Coran de manière magnifique et respectueuse.\n\nDans ce module, vous allez explorer :\n• Les règles fondamentales du Tajwid\n• La prononciation correcte des lettres arabes\n• Les caractéristiques des lettres (emphatiques, douces, etc.)\n• La reconnaissance des signes diacritiques\n\nChaque leçon est conçue pour être pratiquée régulièrement avec l'approche ERPR : Écoute, Répétition, Pratique et Régularité.",
    pages: [
      {
        title: "Leçon : Définition et importance du Tajwid",
        href: "/chapitres-tajwid/1/0",
        pageNumber: 0,
      },
      {
        title: "Leçon : Les sortie de lettres arabes (Makhârij al-Hurûf)",
        href: "/chapitres-tajwid/1/1",
        pageNumber: 1,
      },

    ],
    quiz: [
      {
        question: "Que signifie le mot 'Tajwid' ?",
        choices: [
          "Réciter rapidement",
          "Bien faire ou améliorer",
          "Lire le Coran",
          "Étudier l'arabe",
        ],
        correctAnswerIndex: 1,
      },
      {
        question: "Quel est le but principal du Tajwid ?",
        choices: [
          "Apprendre l'arabe classique",
          "Améliorer la prononciation du Coran selon des règles phonétiques",
          "Augmenter la vitesse de récitation",
          "Mémoriser le Coran rapidement",
        ],
        correctAnswerIndex: 1,
      },
      {
        question: "Les caractéristiques des lettres arabes sont importantes pour :",
        choices: [
          "La grammaire uniquement",
          "L'écriture du Coran",
          "Une prononciation correcte et respectueuse",
          "La traduction",
        ],
        correctAnswerIndex: 2,
      },
      {
        question: "Quelle est la première étape pour apprendre le Tajwid correctement ?",
        choices: [
          "Mémoriser le Coran",
          "Maîtriser la prononciation des lettres individuelles",
          "Lire rapidement",
          "Étudier la grammaire arabe",
        ],
        correctAnswerIndex: 1,
      },
      {
        question: "Le Tajwid s'applique à :",
        choices: [
          "Uniquement la poésie arabe",
          "La récitation du Coran et du texte coranique",
          "Seulement la langue parlée",
          "Les textes religieux non-coraniques",
        ],
        correctAnswerIndex: 1,
      },
      {
        question: "Que signifie 'Makhârij al-Hurûf' ?",
        choices: [
          "Les règles de pause",
          "Les points de sortie des lettres",
          "Les prolongations",
          "Les caractéristiques des lettres",
        ],
        correctAnswerIndex: 1,
      },
      {
        question: "Combien de points de sortie principaux (Makhârij) existe-t-il ?",
        choices: [
          "10",
          "14",
          "17",
          "28",
        ],
        correctAnswerIndex: 2,
      },
      {
        question: "La gorge (Al-Halq) est le point de sortie de :",
        choices: [
          "ب، م، و",
          "ء، هـ، ع، ح، غ، خ",
          "ت، د، ط",
          "ر، ل، ن",
        ],
        correctAnswerIndex: 1,
      },
      {
        question: "Les lettres ب، م، و sortent de :",
        choices: [
          "La gorge",
          "Les lèvres",
          "La langue",
          "Le nez",
        ],
        correctAnswerIndex: 1,
      },
      {
        question: "L'apprentissage du Tajwid est considéré comme :",
        choices: [
          "Optionnel pour tous",
          "Obligatoire collectivement (Fard Kifaya)",
          "Interdit",
          "Réservé aux savants",
        ],
        correctAnswerIndex: 1,
      },
    ],
  },

  {
    title: "Le Noon Sâkin et le Tanwîn (نْ و التنوين)",
    chapterNumber: 2,
    module: 'TAJWID',
    introduction: "Le Noon Sâkin (نْ) et le Tanwîn (ــًــٍــٌ) sont deux éléments fondamentaux du Tajwid. Ils suivent quatre règles principales selon la lettre qui les suit.\n\nCes quatre cas sont essentiels pour une récitation correcte du Coran :\n\n1. Idh-hâr (إظهار) – Prononciation claire et distincte\n2. Idghâm (إدغام) – Fusion du son avec la lettre suivante\n3. Iqlâb (إقلاب) – Transformation du ن en م avec nasalisation\n4. Ikhfâ' (إخفاء) – Dissimulation avec nasalisation (ghunna)\n\nChacun de ces cas dépend de la lettre qui suit le Noon Sâkin ou le Tanwîn dans le texte coranique.",
    pages: [
      {
        title: "Leçon : Définition du Noon Sâkin et du Tanwîn",
        href: "/chapitres-tajwid/2/2",
        pageNumber: 2,
      },
      {
        title: "Leçon : Idh-hâr (الإظهار) - Prononciation claire",
        href: "/chapitres-tajwid/2/3",
        pageNumber: 3,
      },
      {
        title: "Leçon : Idghâm (الإدغام) - Fusion du son",
        href: "/chapitres-tajwid/2/4",
        pageNumber: 4,
      },
      {
        title: "Leçon : Iqlâb (الإقلاب) - Transformation en Meem",
        href: "/chapitres-tajwid/2/5",
        pageNumber: 5,
      },
      {
        title: "Leçon : Ikhfâ' (الإخفاء) - Dissimulation avec ghunna",
        href: "/chapitres-tajwid/2/6",
        pageNumber: 6,
      },
    ],
    quiz: [
      {
        question: "Combien de règles principales s'appliquent au Noon Sâkin et Tanwîn ?",
        choices: ["2", "3", "4", "5"],
        correctAnswerIndex: 2,
      },
      {
        question: "Qu'est-ce que l'Idh-hâr ?",
        choices: [
          "Une fusion de sons",
          "Une prononciation claire et distincte",
          "Une transformation en Meem",
          "Une dissimulation",
        ],
        correctAnswerIndex: 1,
      },
      {
        question: "L'Iqlâb consiste à :",
        choices: [
          "Fusionner le Noon avec la lettre suivante",
          "Transformer le Noon en Meem",
          "Dissimuler le Noon",
          "Prononcer le Noon clairement",
        ],
        correctAnswerIndex: 1,
      },
      {
        question: "Quelle règle s'accompagne toujours d'une ghunna ?",
        choices: ["Idh-hâr", "Idghâm", "Iqlâb et Ikhfâ'", "Aucune de ces réponses"],
        correctAnswerIndex: 2,
      },
      {
        question: "Combien de lettres provoquent l'Idh-hâr ?",
        choices: ["4", "6", "8", "10"],
        correctAnswerIndex: 1,
      },
      {
        question: "Les lettres de l'Idh-hâr (ء هـ ع ح غ خ) sortent de :",
        choices: [
          "La langue",
          "Les lèvres",
          "La gorge (Al-Halq)",
          "Le nez",
        ],
        correctAnswerIndex: 2,
      },
      {
        question: "L'Idghâm se divise en combien de catégories ?",
        choices: [
          "2 (avec et sans ghunna)",
          "3",
          "4",
          "1",
        ],
        correctAnswerIndex: 0,
      },
      {
        question: "Les lettres يرملون (YARMALOUNE) provoquent :",
        choices: [
          "L'Idh-hâr",
          "L'Idghâm",
          "L'Iqlâb",
          "L'Ikhfâ'",
        ],
        correctAnswerIndex: 1,
      },
      {
        question: "L'Iqlâb se produit uniquement devant la lettre :",
        choices: [
          "ن",
          "م",
          "ب",
          "و",
        ],
        correctAnswerIndex: 2,
      },
      {
        question: "Combien de lettres provoquent l'Ikhfâ' ?",
        choices: [
          "10",
          "12",
          "15",
          "18",
        ],
        correctAnswerIndex: 2,
      },
    ],
  },

  {
    title: "Le Mîm Sâkin (مْ) - Les trois règles",
    chapterNumber: 3,
    module: 'TAJWID',
    introduction: "Le Mîm Sâkin (مْ) est une lettre avec soukoun qui suit trois règles principales selon la lettre qui la suit.\n\nContrairement au Noon Sâkin qui a quatre cas, le Mîm Sâkin suit une logique différente :\n\n1. Ikhfâ' Shafawî (إخفاء شفوي) – Cacher le Meem devant un Ba (ب)\n2. Idghâm Shafawî (إدغام شفوي) – Fusionner deux Meems identiques\n3. Izh-hâr Shafawî (إظهار شفوي) – Prononcer clairement avec les autres lettres\n\nLes trois règles sont appelées 'Shafawî' car elles impliquent les lèvres (shaafa = lèvres).",
    pages: [
      {
        title: "Leçon : Introduction au Mîm Sâkin",
        href: "/chapitres-tajwid/3/7",
        pageNumber: 7,
      },
      {
        title: "Leçon : Ikhfâ' Shafawî - Dissimulation labiale",
        href: "/chapitres-tajwid/3/8",
        pageNumber: 8,
      },
      {
        title: "Leçon : Idghâm Shafawî - Fusion des deux Meems",
        href: "/chapitres-tajwid/3/9",
        pageNumber: 9,
      },
      {
        title: "Leçon : Izh-hâr Shafawî - Prononciation claire",
        href: "/chapitres-tajwid/3/10",
        pageNumber: 10,
      },
    ],
    quiz: [
      {
        question: "Combien de règles s'appliquent au Mîm Sâkin ?",
        choices: ["2", "3", "4", "5"],
        correctAnswerIndex: 1,
      },
      {
        question: "Qu'est-ce que l'Ikhfâ' Shafawî ?",
        choices: [
          "Cacher le Meem devant un Ba",
          "Fusionner deux Meems",
          "Prononcer le Meem clairement",
          "Transformer le Meem",
        ],
        correctAnswerIndex: 0,
      },
      {
        question: "L'Idghâm Shafawî se produit quand :",
        choices: [
          "Un Meem sâkin est suivi d'un Ba",
          "Un Meem sâkin est suivi d'un autre Meem",
          "Un Meem sâkin est suivi d'une voyelle",
          "Un Meem sâkin est à la fin du mot",
        ],
        correctAnswerIndex: 1,
      },
      {
        question: "Pourquoi les règles du Mîm Sâkin sont-elles appelées 'Shafawî' ?",
        choices: [
          "Parce qu'elles impliquent les lèvres",
          "Parce qu'elles sont difficiles",
          "Parce qu'elles changent le sens",
          "Parce qu'elles ralentissent la récitation",
        ],
        correctAnswerIndex: 0,
      },
      {
        question: "L'Izh-hâr Shafawî s'applique avec toutes les lettres sauf :",
        choices: [
          "Les lettres de la gorge",
          "ب et م",
          "Les lettres emphatiques",
          "Les lettres lunaires",
        ],
        correctAnswerIndex: 1,
      },
      {
        question: "Le Mîm et le Ba partagent le même point de sortie :",
        choices: [
          "Les lèvres",
          "La gorge",
          "La langue",
          "Le nez",
        ],
        correctAnswerIndex: 0,
      },
      {
        question: "L'Ikhfâ' Shafawî s'accompagne d'une :",
        choices: [
          "Pause complète",
          "Ghunna (nasalisation)",
          "Emphase",
          "Accélération",
        ],
        correctAnswerIndex: 1,
      },
      {
        question: "Lors de l'Idghâm Shafawî (مْ + م), on entend :",
        choices: [
          "Deux Meems distincts",
          "Un seul Meem prolongé avec ghunna",
          "Un silence",
          "Un Ba",
        ],
        correctAnswerIndex: 1,
      },
      {
        question: "Dans 'هُمْ بِهِ', quelle règle s'applique ?",
        choices: [
          "Idghâm Shafawî",
          "Izh-hâr Shafawî",
          "Ikhfâ' Shafawî",
          "Aucune règle",
        ],
        correctAnswerIndex: 2,
      },
      {
        question: "Dans 'لَهُمْ مَا', quelle règle s'applique ?",
        choices: [
          "Ikhfâ' Shafawî",
          "Izh-hâr Shafawî",
          "Idghâm Shafawî",
          "Iqlâb",
        ],
        correctAnswerIndex: 2,
      },
    ],
  },
  {
    title: "Les Règles du Prolongement (المدود – Al-Madd)",
    chapterNumber: 4,
    module: 'TAJWID',
    introduction: "Al-Madd (المد) signifie 'allongement' ou 'prolongation'. C'est une règle fondamentale du Tajwid qui modifie la durée de prononciation de certaines voyelles et lettres.\n\nIl existe plusieurs types de Madd selon le contexte :\n\n1. Madd Ṭabî'î (طبيعي) – Prolongation naturelle (2 temps)\n2. Madd Far'î (فرعي) – Prolongation secondaire (4 à 6 temps)\n   - Madd Muttasil (متصل)\n   - Madd Munfasil (منفصل)\n   - Madd Lâzim (لازم)\n   - Madd 'Ârid lil-sukoun (عارض للسكون)\n   - Madd Leen (لين)\n\nComprendre ces distinctions est crucial pour une récitation correcte et en harmonie avec la tradition coranique.",
    pages: [
      {
        title: "Leçon : Introduction et définition du Madd",
        href: "/chapitres-tajwid/4/11",
        pageNumber: 11,
      },
      {
        title: "Leçon : Madd Ṭabî'î - Prolongation naturelle",
        href: "/chapitres-tajwid/4/12",
        pageNumber: 12,
      },
      {
        title: "Leçon : Madd Far'î - Prolongations secondaires",
        href: "/chapitres-tajwid/4/13",
        pageNumber: 13,
      },
      {
        title: "Leçon : Madd Muttasil et Munfasil",
        href: "/chapitres-tajwid/4/14",
        pageNumber: 14,
      },
      {
        title: "Leçon : Madd Lâzim, Arid, Leen et pratique",
        href: "/chapitres-tajwid/4/15",
        pageNumber: 15,
      },
    ],
    quiz: [
      {
        question: "Que signifie Al-Madd ?",
        choices: ["Arrêter la prononciation", "Allongement ou prolongation", "Rapidité de récitation", "Changement de ton"],
        correctAnswerIndex: 1,
      },
      {
        question: "Le Madd al-Tabi'i dure normalement :",
        choices: ["1 temps", "2 temps", "3 temps", "4 temps"],
        correctAnswerIndex: 1,
      },
      {
        question: "Combien de types de Madd Far'î existe-t-il ?",
        choices: ["2", "3", "4", "5"],
        correctAnswerIndex: 3,
      },
      {
        question: "Le Madd Muttasil se produit quand :",
        choices: [
          "La hamza est séparée par une lettre",
          "La hamza se trouve dans le même mot",
          "Il n'y a pas de hamza",
          "La hamza est à la fin du mot",
        ],
        correctAnswerIndex: 1,
      },
      {
        question: "Quelles sont les trois lettres du Madd ?",
        choices: [
          "ب، م، و",
          "ا، و، ي",
          "ن، م، ل",
          "ء، هـ، ع",
        ],
        correctAnswerIndex: 1,
      },
      {
        question: "Le Madd Munfasil se produit quand :",
        choices: [
          "La hamza est dans le même mot",
          "La hamza est dans le mot suivant",
          "Il n'y a pas de hamza",
          "La hamza est avant le Madd",
        ],
        correctAnswerIndex: 1,
      },
      {
        question: "Le Madd Lâzim dure :",
        choices: [
          "2 temps",
          "4 temps",
          "6 temps obligatoires",
          "Variable selon le récitateur",
        ],
        correctAnswerIndex: 2,
      },
      {
        question: "Le Madd 'Ârid lil-Sukûn se produit :",
        choices: [
          "Au milieu du verset",
          "À l'arrêt (Waqf) seulement",
          "Après une hamza",
          "Avant une hamza",
        ],
        correctAnswerIndex: 1,
      },
      {
        question: "Le Madd Leen concerne les lettres :",
        choices: [
          "ا، و، ي avec sukûn après fatha",
          "و، ي sâkina après fatha",
          "Toutes les lettres avec sukûn",
          "Seulement le Alif",
        ],
        correctAnswerIndex: 1,
      },
      {
        question: "Dans 'السَّمَاءِ', le Madd est de type :",
        choices: [
          "Ṭabî'î",
          "Muttasil",
          "Munfasil",
          "Lâzim",
        ],
        correctAnswerIndex: 1,
      },
    ],
  },

  {
    title: "Les Règles de l'Arrêt (الوقف – Al-Waqf)",
    chapterNumber: 5,
    module: 'TAJWID',
    introduction: "Al-Waqf (الوقف) signifie 'arrêt' ou 'pause' pendant la récitation du Coran. Ces règles gouvernent les endroits appropriés pour faire une pause sans modifier le sens ou interrompre le flux inappropriatement.\n\nRègles fondamentales du Waqf :\n• On s'arrête sur un soukoune (ْ)\n• La voyelle finale tombe\n• Le tanwîn devient soukoune avec léger arrêt nasal\n\nTypes d'arrêt :\n• Waqf tâm (complet) – arrêt absolu\n• Waqf kâfî (suffisant) – peut reprendre\n• Waqf hasân (permis) – moment approprié\n• Waqf qabîh (interdit) – à éviter absolument",
    pages: [
      {
        title: "Leçon : Définition et importance du Waqf",
        href: "/chapitres-tajwid/5/16",
        pageNumber: 16,
      },
      {
        title: "Leçon : Règles fondamentales du Waqf",
        href: "/chapitres-tajwid/5/17",
        pageNumber: 17,
      },
      {
        title: "Leçon : Types de Waqf - Complet et suffisant",
        href: "/chapitres-tajwid/5/18",
        pageNumber: 18,
      },
      {
        title: "Leçon : Waqf permis et interdit",
        href: "/chapitres-tajwid/5/19",
        pageNumber: 19,
      },
    ],
    quiz: [
      {
        question: "Que signifie Al-Waqf ?",
        choices: ["Commencer la récitation", "Arrêt ou pause pendant la récitation", "Accélérer la récitation", "Changer le ton"],
        correctAnswerIndex: 1,
      },
      {
        question: "Sur quoi s'arrête-t-on selon les règles du Waqf ?",
        choices: ["Sur une voyelle", "Sur une hamza", "Sur un soukoune", "Sur une diphthongue"],
        correctAnswerIndex: 2,
      },
      {
        question: "Quel type de Waqf est un arrêt absolu ?",
        choices: ["Waqf kâfî", "Waqf hasân", "Waqf tâm", "Waqf qabîh"],
        correctAnswerIndex: 2,
      },
      {
        question: "Que devient le tanwîn à l'arrêt (Waqf) ?",
        choices: ["Il disparaît complètement", "Il devient soukoune avec arrêt nasal", "Il devient voyelle longue", "Il se transforme en hamza"],
        correctAnswerIndex: 1,
      },
      {
        question: "Le Waqf Kâfî permet de :",
        choices: [
          "Ne jamais reprendre",
          "Reprendre la récitation",
          "Changer le sens",
          "Accélérer",
        ],
        correctAnswerIndex: 1,
      },
      {
        question: "Le Waqf Qabîh est :",
        choices: [
          "Recommandé",
          "Obligatoire",
          "À éviter absolument",
          "Optionnel",
        ],
        correctAnswerIndex: 2,
      },
      {
        question: "Le symbole 'مـ' dans le Mushaf indique :",
        choices: [
          "Waqf obligatoire",
          "Waqf interdit",
          "Waqf autorisé",
          "Prolongation",
        ],
        correctAnswerIndex: 0,
      },
      {
        question: "À l'arrêt, le Tâ' Marbûta (ة) se prononce comme :",
        choices: [
          "Un Tâ' (ت)",
          "Un Hâ' (هـ)",
          "Un Alif",
          "Un silence",
        ],
        correctAnswerIndex: 1,
      },
      {
        question: "Le symbole 'لا' dans le Mushaf signifie :",
        choices: [
          "Waqf obligatoire",
          "Ne pas s'arrêter",
          "Waqf autorisé",
          "Prolongation obligatoire",
        ],
        correctAnswerIndex: 1,
      },
      {
        question: "Le Waqf Hasân est considéré comme :",
        choices: [
          "Interdit",
          "Obligatoire",
          "Permis et approprié",
          "Blâmable",
        ],
        correctAnswerIndex: 2,
      },
    ],
  },

  {
    title: "Qalqalah & Caractéristiques (Rebond, Hams, Shiddah)",
    chapterNumber: 6,
    module: 'TAJWID',
    introduction: "Ce chapitre couvre le rebond et les caractéristiques essentielles des lettres :\n\n1. Qalqalah (القَلْقَلَة) – Le Rebond\n   Lettres : ق، ط، ب، ج، د (قطب جد)\n   • Si la lettre est sâkina, on entend un petit rebond\n   • Exemples : الحقّ – يَقْطَع – أَحَدْ\n\n2. Le Hams (الهمس) – Souffle et glissement\n   Lettres : ف ح ث ه ش خ ص س ك ت (phrase : فحثّه شخص سكت)\n\n3. La Shiddah (الشدة) – Blocage total du son\n\n4. Entre les deux (التوسط) – Son moyen, ni fermé ni soufflé",
    pages: [
      {
        title: "Leçon : Qalqalah (القَلْقَلَة) - Le rebond",
        href: "/chapitres-tajwid/6/20",
        pageNumber: 20,
      },
      {
        title: "Leçon : Le Hams (الهمس) - Souffle et glissement",
        href: "/chapitres-tajwid/6/21",
        pageNumber: 21,
      },
      {
        title: "Leçon : La Shiddah (الشدة) - Blocage du son",
        href: "/chapitres-tajwid/6/22",
        pageNumber: 22,
      },
      {
        title: "Leçon : Entre les deux (التوسط)",
        href: "/chapitres-tajwid/6/23",
        pageNumber: 23,
      },
    ],
    quiz: [
      {
        question: "Qu'est-ce que la Qalqalah ?",
        choices: ["Une pause dans la récitation", "Un petit rebond du son", "Une fusion de lettres", "Une transformation de son"],
        correctAnswerIndex: 1,
      },
      {
        question: "Combien de lettres Qalqalah existe-t-il ?",
        choices: ["3", "4", "5", "6"],
        correctAnswerIndex: 2,
      },
      {
        question: "Qu'est-ce que le Hams ?",
        choices: ["Un blocage total du son", "Un souffle avec l'air qui continue", "Un son grave et fort", "Une transformation de lettre"],
        correctAnswerIndex: 1,
      },
      {
        question: "Combien de lettres Hams existe-t-il ?",
        choices: ["8", "9", "10", "11"],
        correctAnswerIndex: 2,
      },
      {
        question: "Les lettres de la Qalqalah sont mémorisées par le mot :",
        choices: [
          "فحثّه شخص سكت",
          "قطب جد",
          "أجد قطب",
          "يرملون",
        ],
        correctAnswerIndex: 1,
      },
      {
        question: "La Qalqalah est plus forte à :",
        choices: [
          "L'arrêt (Waqf)",
          "Au milieu du mot",
          "Au début du mot",
          "Toujours identique",
        ],
        correctAnswerIndex: 0,
      },
      {
        question: "La Shiddah signifie :",
        choices: [
          "Un souffle",
          "Un blocage total du son",
          "Une prolongation",
          "Un rebond",
        ],
        correctAnswerIndex: 1,
      },
      {
        question: "Le Tawassut (التوسط) est :",
        choices: [
          "Un blocage total",
          "Un souffle complet",
          "Entre le blocage et le souffle",
          "Un silence",
        ],
        correctAnswerIndex: 2,
      },
      {
        question: "Les lettres de la Shiddah comprennent :",
        choices: [
          "ق، ط، ب، ج، د",
          "أ، ج، د، ق، ط، ب، ك، ت",
          "ف، ح، ث، هـ",
          "و، ي، ا",
        ],
        correctAnswerIndex: 1,
      },
      {
        question: "Les lettres du Hams se retiennent par la phrase :",
        choices: [
          "قطب جد",
          "يرملون",
          "فحثّه شخص سكت",
          "أجد قطب",
        ],
        correctAnswerIndex: 2,
      },
    ],
  },

  {
    title: "Tafkhîm & Lettres Spéciales (Râ', Lâm, ر, ل)",
    chapterNumber: 7,
    module: 'TAJWID',
    introduction: "Ce chapitre couvre l'emphase (Tafkhîm) et les lettres spéciales :\n\n1. Les Lettres Emphatiques (التفخيم)\n   Lettres épaisses : خ، ص، ض، غ، ط، ق، ظ، ر\n   Son plein avec bouche ouverte\n   Tarqîq (الترقيق) : l'opposé, son fin et léger\n\n2. La Lettre Râ' (ر)\n   • Épaisse (Tafkhîm) : avec fat-ha ou dhamma → رَحْمَة، رُزِقَ\n   • Fine (Tarqîq) : avec kasra → فِرْعَون\n   • Cas particuliers selon les lettres voisines\n\n3. La Lettre Lâm (ل) dans 'الله'\n   • Épaisse après fat-ha/dhamma → قالَ اللهُ\n   • Fine après kasra → بِسْمِ اللهِ",
    pages: [
      {
        title: "Leçon : Tafkhîm - Les Lettres Emphatiques (التفخيم)",
        href: "/chapitres-tajwid/7/24",
        pageNumber: 24,
      },
      {
        title: "Leçon : La Lettre Râ' (ر) - Tafkhîm et Tarqîq",
        href: "/chapitres-tajwid/7/25",
        pageNumber: 25,
      },
      {
        title: "Leçon : La Lettre Lâm (ل) et الله",
        href: "/chapitres-tajwid/7/26",
        pageNumber: 26,
      },
      {
        title: "Leçon : Tarqîq (الترقيق) - Raffinement des sons",
        href: "/chapitres-tajwid/7/27",
        pageNumber: 27,
      },
    ],
    quiz: [
      {
        question: "Les lettres emphatiques ont :",
        choices: ["Un son fin et léger", "Un son plein avec bouche ouverte", "Un son soufflé", "Un son nasal"],
        correctAnswerIndex: 1,
      },
      {
        question: "Quel est l'opposé de l'emphase (Tafkhîm) ?",
        choices: ["Le Hams", "La Shiddah", "Tarqîq (Raffinement)", "Le Waqf"],
        correctAnswerIndex: 2,
      },
      {
        question: "La Râ' est épaisse (Tafkhîm) quand elle a :",
        choices: ["Kasra", "Soukoun", "Fat-ha ou dhamma", "Tanwîn"],
        correctAnswerIndex: 2,
      },
      {
        question: "La Lâm dans 'الله' est fine (Tarqîq) après :",
        choices: ["Fat-ha", "Dhamma", "Kasra", "Soukoun"],
        correctAnswerIndex: 2,
      },
      {
        question: "Exemple de Lâm épaisse dans الله :",
        choices: ["بِسْمِ اللهِ", "قالَ اللهُ", "الله يرحم", "في الله"],
        correctAnswerIndex: 1,
      },
      {
        question: "Combien de lettres sont toujours emphatiques (Tafkhîm) ?",
        choices: [
          "5",
          "7",
          "8",
          "10",
        ],
        correctAnswerIndex: 1,
      },
      {
        question: "Les lettres خ ص ض غ ط ق ظ sont :",
        choices: [
          "Toujours fines (Tarqîq)",
          "Toujours épaisses (Tafkhîm)",
          "Variables",
          "Neutres",
        ],
        correctAnswerIndex: 1,
      },
      {
        question: "La Râ' avec sukûn après une kasra est :",
        choices: [
          "Toujours épaisse",
          "Toujours fine",
          "Variable selon le contexte",
          "Neutre",
        ],
        correctAnswerIndex: 2,
      },
      {
        question: "Dans 'الرَّحْمَنِ', la Râ' est :",
        choices: [
          "Fine (Tarqîq)",
          "Épaisse (Tafkhîm)",
          "Neutre",
          "Variable",
        ],
        correctAnswerIndex: 1,
      },
      {
        question: "Le Lâm de l'article 'ال' (hors الله) est généralement :",
        choices: [
          "Épais",
          "Fin (Tarqîq)",
          "Variable",
          "Neutre",
        ],
        correctAnswerIndex: 1,
      },
    ],
  },

  {
    title: "Les Erreurs à Éviter (اللحن - Allahhan)",
    chapterNumber: 8,
    module: 'TAJWID',
    introduction: "Ce dernier chapitre couvre les erreurs à éviter dans la récitation du Coran :\n\n1. Erreur Majeure (لحن جلي – Allahhan al-Jalî)\n   • Change le sens du Coran\n   • Affecte la grammaire ou le sens\n   • INTERDITE absolument\n   • Exemple : أنعمتُ au lieu de أنعمتَ\n\n2. Erreur Mineure (لحن خفي – Allahhan al-Khafî)\n   • N'affecte pas le sens\n   • Altère la beauté et l'harmonie\n   • À corriger pour une belle récitation\n   • Exemples : mauvaise durée du madd, ghunna oubliée\n\nL'objectif : atteindre une récitation correcte et magnifique du Coran",
    pages: [
      {
        title: "Leçon : Les Erreurs à Éviter - Introduction",
        href: "/chapitres-tajwid/8/28",
        pageNumber: 28,
      },
      {
        title: "Leçon : Erreur Majeure (لحن جلي) - Changement de sens",
        href: "/chapitres-tajwid/8/29",
        pageNumber: 29,
      },
      {
        title: "Leçon : Erreur Mineure (لحن خفي) - Perte de beauté",
        href: "/chapitres-tajwid/8/30",
        pageNumber: 30,
      },
      {
        title: "Leçon : Reconnaissance des erreurs dans les versets",
        href: "/chapitres-tajwid/8/31",
        pageNumber: 31,
      },
      {
        title: "Leçon : Correction et récitation parfaite",
        href: "/chapitres-tajwid/8/32",
        pageNumber: 32,
      },
    ],
    quiz: [
      {
        question: "Qu'est-ce que l'erreur majeure (لحن جلي) ?",
        choices: ["Une petite erreur de prononciation", "Une erreur qui change le sens du Coran", "Une erreur de rythme", "Une erreur de mémorisation"],
        correctAnswerIndex: 1,
      },
      {
        question: "L'erreur majeure est :",
        choices: ["Permise si elle ne change pas la beauté", "Toujours interdite car elle change le sens", "Correctible facilement", "Une simple variation de prononciation"],
        correctAnswerIndex: 1,
      },
      {
        question: "L'erreur mineure (لحن خفي) affecte :",
        choices: ["Le sens du Coran", "La beauté et l'harmonie de la récitation", "La grammaire", "La mémorisation"],
        correctAnswerIndex: 1,
      },
      {
        question: "Exemple d'erreur mineure :",
        choices: ["Prononcer أنعمتُ au lieu de أنعمتَ", "Mauvaise durée du madd", "Changer une voyelle", "Ajouter des lettres"],
        correctAnswerIndex: 1,
      },
      {
        question: "Le but du Tajwid est de :",
        choices: ["Réciter rapidement", "Mémoriser uniquement", "Atteindre une récitation correcte et magnifique", "Improviser avec le Coran"],
        correctAnswerIndex: 2,
      },
      {
        question: "Changer une voyelle (haraka) dans le Coran est :",
        choices: [
          "Une erreur mineure",
          "Une erreur majeure",
          "Sans importance",
          "Autorisé",
        ],
        correctAnswerIndex: 1,
      },
      {
        question: "Omettre la ghunna (nasalisation) est :",
        choices: [
          "Une erreur majeure",
          "Une erreur mineure",
          "Sans conséquence",
          "Recommandé",
        ],
        correctAnswerIndex: 1,
      },
      {
        question: "Remplacer une lettre par une autre dans le Coran est :",
        choices: [
          "Parfois autorisé",
          "Une erreur mineure",
          "Une erreur majeure interdite",
          "Une variante de récitation",
        ],
        correctAnswerIndex: 2,
      },
      {
        question: "Ne pas respecter la durée du Madd est :",
        choices: [
          "Une erreur majeure",
          "Une erreur mineure",
          "Sans importance",
          "Obligatoire",
        ],
        correctAnswerIndex: 1,
      },
      {
        question: "L'objectif ultime du Tajwid est :",
        choices: [
          "La vitesse de récitation",
          "La récitation conforme à la Sunna et respectueuse",
          "L'improvisation mélodique",
          "La mémorisation rapide",
        ],
        correctAnswerIndex: 1,
      },
    ],
  },

  {
    title: "Évaluation Finale",
    chapterNumber: 9,
    module: 'TAJWID',
    introduction: "",
    pages: [
      {
        title: "Évaluation Finale Tajwid",
        href: "/chapitres-tajwid/9/33",
        pageNumber: 33,
      },
    ],
    quiz: [],
  },
];

export const chaptersTajwid: Chapter[] = originalChaptersTajwid.map(chapter => {
  const newPages = chapter.pages.map(page => {
    // Keep the original page numbers for href - they match the file names
    return {
      ...page,
      href: `/chapitres-tajwid/${chapter.chapterNumber}/${page.pageNumber}`,
      pageNumber: page.pageNumber,
    };
  });

  return {
    ...chapter,
    pages: newPages,
  };
});