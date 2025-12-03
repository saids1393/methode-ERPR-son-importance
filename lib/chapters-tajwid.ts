// lib/chapters-tajwid.ts
import { Chapter } from "./chapters";

export const chaptersTajwid: Chapter[] = [
  {
    title: "Fondamentaux du Tajwid",
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
        title: "Leçon : Les caractéristiques des lettres arabes",
        href: "/chapitres-tajwid/1/1",
        pageNumber: 1,
      },
      {
        title: "Leçon : Les signes diacritiques du Tajwid",
        href: "/chapitres-tajwid/1/2",
        pageNumber: 2,
      },
      {
        title: "Leçon : L'articulation correcte des lettres",
        href: "/chapitres-tajwid/1/3",
        pageNumber: 3,
      },
      {
        title: "Leçon : Pratique guidée - Récitation basique",
        href: "/chapitres-tajwid/1/4",
        pageNumber: 4,
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
    ],
  },

  {
    title: "Les lettres emphatiques et leurs caractéristiques",
    chapterNumber: 2,
    module: 'TAJWID',
    introduction: "Les lettres emphatiques (الحروف المفخمة) sont un élément crucial du Tajwid. Ce chapitre vous enseigne à reconnaître et à prononcer ces 4 lettres principales avec le son grave qui les caractérise.\n\nLes 4 lettres emphatiques principales sont : خ، ق، ظ، ض\n\nEn plus de ces 4, il existe des variantes contextuelles où d'autres lettres deviennent emphatiques selon leur position ou les lettres qui les entourent.\n\nDans ce chapitre :\n• Identification des 4 lettres emphatiques\n• Prononciation avec le son grave approprié\n• Reconnaissance en contexte\n• Différence avec les lettres douces\n• Pratique d'articulation",
    pages: [
      {
        title: "Leçon : Les 4 lettres emphatiques principales",
        href: "/chapitres-tajwid/2/0",
        pageNumber: 0,
      },
      {
        title: "Leçon : Prononciation de la lettre Kaf (خ)",
        href: "/chapitres-tajwid/2/1",
        pageNumber: 1,
      },
      {
        title: "Leçon : Prononciation de la lettre Qaf (ق)",
        href: "/chapitres-tajwid/2/2",
        pageNumber: 2,
      },
      {
        title: "Leçon : Prononciation de la lettre Zay (ظ)",
        href: "/chapitres-tajwid/2/3",
        pageNumber: 3,
      },
      {
        title: "Leçon : Prononciation de la lettre Dad (ض)",
        href: "/chapitres-tajwid/2/4",
        pageNumber: 4,
      },
    ],
    quiz: [
      {
        question: "Combien de lettres emphatiques principales existe-t-il ?",
        choices: ["2", "3", "4", "5"],
        correctAnswerIndex: 2,
      },
      {
        question: "Quelle est une caractéristique du son emphatique ?",
        choices: [
          "Il est plus aigu que les autres lettres",
          "Il est grave et profond",
          "Il est très rapide",
          "Il change selon la position dans le mot",
        ],
        correctAnswerIndex: 1,
      },
      {
        question: "La lettre Qaf (ق) est :",
        choices: [
          "Une lettre douce",
          "Une voyelle",
          "Une des 4 lettres emphatiques principales",
          "Une lettre dépendante du contexte",
        ],
        correctAnswerIndex: 2,
      },
      {
        question: "L'emphase d'une lettre affecte :",
        choices: [
          "L'orthographe du mot",
          "Le sens du mot",
          "La prononciation et le son du mot",
          "La longueur du mot",
        ],
        correctAnswerIndex: 2,
      },
    ],
  },

  {
    title: "Les règles de l'assimilation (Al-Idgham)",
    chapterNumber: 3,
    module: 'TAJWID',
    introduction: "L'Idgham (الإدغام) est une règle importante du Tajwid qui traite de la fusion de deux lettres identiques ou similaires. Comprendre cette règle est essentiel pour une récitation fluide et correcte.\n\nL'Idgham signifie littéralement 'enfoncer' ou 'fusionner'. Cela se produit lorsqu'une lettre finale d'un mot se fusionne avec la lettre initiale du mot suivant.\n\nDans ce chapitre :\n• Les types d'Idgham\n• Idgham avec nasalisation (مع الغنة)\n• Idgham sans nasalisation (بغير غنة)\n• Reconnaissance des contextes d'Idgham\n• Pratique de la prononciation fluide",
    pages: [
      {
        title: "Leçon : Introduction à l'Idgham",
        href: "/chapitres-tajwid/3/0",
        pageNumber: 0,
      },
      {
        title: "Leçon : L'Idgham avec nasalisation",
        href: "/chapitres-tajwid/3/1",
        pageNumber: 1,
      },
      {
        title: "Leçon : L'Idgham sans nasalisation",
        href: "/chapitres-tajwid/3/2",
        pageNumber: 2,
      },
      {
        title: "Leçon : Différenciation des types d'Idgham",
        href: "/chapitres-tajwid/3/3",
        pageNumber: 3,
      },
      {
        title: "Leçon : Pratique - Reconnaissance et récitation",
        href: "/chapitres-tajwid/3/4",
        pageNumber: 4,
      },
    ],
    quiz: [
      {
        question: "Que signifie l'Idgham en Tajwid ?",
        choices: [
          "Séparer les lettres",
          "Fusionner deux lettres",
          "Allonger la prononciation",
          "Changer la voyelle",
        ],
        correctAnswerIndex: 1,
      },
      {
        question: "L'Idgham se produit entre :",
        choices: [
          "Deux consonnes différentes uniquement",
          "Une lettre finale et une lettre initiale du mot suivant",
          "Uniquement dans le même mot",
          "Entre les voyelles",
        ],
        correctAnswerIndex: 1,
      },
      {
        question: "Quel est le type d'Idgham avec nasalisation ?",
        choices: [
          "Idgham mutlaq",
          "Idgham mufakk",
          "Idgham maa al-ghunnah",
          "Idgham kamel",
        ],
        correctAnswerIndex: 2,
      },
    ],
  },

  {
    title: "Les règles d'assimilation partielle et complète",
    chapterNumber: 4,
    module: 'TAJWID',
    introduction: "Au-delà de l'Idgham, il existe d'autres règles d'assimilation qui modifient la prononciation du Coran. Ce chapitre couvre les nuances entre l'assimilation complète (Idgham Kamel) et partielle (Idgham Naqis).\n\nCes règles permettent une récitation plus naturelle et harmonieuse, en accord avec la tradition coranique établie.\n\nDans ce chapitre :\n• Idgham Kamel (assimilation complète)\n• Idgham Naqis (assimilation partielle)\n• Les lettres affectées\n• Application en contexte\n• Différences avec Al-Iqlab",
    pages: [
      {
        title: "Leçon : Assimilation complète (Idgham Kamel)",
        href: "/chapitres-tajwid/4/0",
        pageNumber: 0,
      },
      {
        title: "Leçon : Assimilation partielle (Idgham Naqis)",
        href: "/chapitres-tajwid/4/1",
        pageNumber: 1,
      },
      {
        title: "Leçon : Les lettres de l'Idgham",
        href: "/chapitres-tajwid/4/2",
        pageNumber: 2,
      },
      {
        title: "Leçon : Comparaison avec Al-Iqlab",
        href: "/chapitres-tajwid/4/3",
        pageNumber: 3,
      },
      {
        title: "Leçon : Pratique intégrée",
        href: "/chapitres-tajwid/4/4",
        pageNumber: 4,
      },
    ],
    quiz: [
      {
        question: "Quelle est la différence entre Idgham Kamel et Naqis ?",
        choices: [
          "Kamel est plus rapide",
          "Kamel est complète, Naqis est partielle",
          "Naqis s'applique uniquement à 2 lettres",
          "Il n'y a pas de différence réelle",
        ],
        correctAnswerIndex: 1,
      },
      {
        question: "L'Idgham Kamel implique :",
        choices: [
          "Une fusion totale avec perte d'identité de la première lettre",
          "Une modification légère du son",
          "Un allongement simple",
          "Un changement de voyelle",
        ],
        correctAnswerIndex: 0,
      },
    ],
  },

  {
    title: "La nasalisation (Al-Ghunnah)",
    chapterNumber: 5,
    introduction: "Al-Ghunnah (الغنة) est une caractéristique phonétique spécifique à la récitation coranique. C'est un son nasal qui accompagne la lettre Noon (ن) et la lettre Meem (م) en certaines positions.\n\nLa Ghunnah est très importante car elle affecte la prononciation correcte du Coran et crée la musicalité de la récitation.\n\nDans ce chapitre :\n• Définition de la Ghunnah\n• Les lettres affectées (Noon et Meem)\n• Les différents contextes de Ghunnah\n• Intensité de la Ghunnah\n• Application pratique",
    pages: [
      {
        title: "Leçon : Introduction à la Ghunnah",
        href: "/chapitres-tajwid/5/0",
        pageNumber: 0,
      },
      {
        title: "Leçon : La Ghunnah du Noon",
        href: "/chapitres-tajwid/5/1",
        pageNumber: 1,
      },
      {
        title: "Leçon : La Ghunnah du Meem",
        href: "/chapitres-tajwid/5/2",
        pageNumber: 2,
      },
      {
        title: "Leçon : Intensité et variantes de Ghunnah",
        href: "/chapitres-tajwid/5/3",
        pageNumber: 3,
      },
      {
        title: "Leçon : Pratique - Distinction auditive",
        href: "/chapitres-tajwid/5/4",
        pageNumber: 4,
      },
    ],
    quiz: [
      {
        question: "Qu'est-ce que la Ghunnah ?",
        choices: [
          "Une voyelle courte",
          "Un son nasal accompagnant certaines lettres",
          "Une règle d'assimilation",
          "Un type d'emphase",
        ],
        correctAnswerIndex: 1,
      },
      {
        question: "La Ghunnah s'applique principalement à :",
        choices: [
          "Toutes les consonnes",
          "Uniquement la lettre Alif",
          "La lettre Noon et Meem",
          "Uniquement les voyelles",
        ],
        correctAnswerIndex: 2,
      },
      {
        question: "La Ghunnah dure normalement :",
        choices: [
          "Une demi-haraka",
          "Une haraka",
          "Deux harakas (مدّ طبيعي)",
          "Trois harakas",
        ],
        correctAnswerIndex: 2,
      },
    ],
  },

  {
    title: "Les types de prolongation (Al-Madd)",
    chapterNumber: 6,
    introduction: "Al-Madd (المد) signifie 'allongement' ou 'prolongation'. C'est une règle importante du Tajwid qui modifie la durée de prononciation de certaines voyelles et lettres.\n\nIl existe plusieurs types de Madd selon le contexte, chacun avec une durée spécifique. Comprendre ces distinctions est crucial pour une récitation correcte et en harmonie avec la tradition.\n\nDans ce chapitre :\n• Al-Madd al-Tabi'i (prolongation naturelle)\n• Al-Madd al-Lazim (prolongation obligatoire)\n• Al-Madd al-Arid li-l-Sukun (prolongation accidentelle)\n• Al-Madd al-Badal (prolongation de substitution)\n• Durées et applications",
    pages: [
      {
        title: "Leçon : Introduction au Madd",
        href: "/chapitres-tajwid/6/0",
        pageNumber: 0,
      },
      {
        title: "Leçon : La prolongation naturelle",
        href: "/chapitres-tajwid/6/1",
        pageNumber: 1,
      },
      {
        title: "Leçon : La prolongation obligatoire",
        href: "/chapitres-tajwid/6/2",
        pageNumber: 2,
      },
      {
        title: "Leçon : Prolongation accidentelle et autres variantes",
        href: "/chapitres-tajwid/6/3",
        pageNumber: 3,
      },
      {
        title: "Leçon : Pratique - Récitation avec prolongations correctes",
        href: "/chapitres-tajwid/6/4",
        pageNumber: 4,
      },
    ],
    quiz: [
      {
        question: "Que signifie Al-Madd ?",
        choices: [
          "Arrêter la prononciation",
          "Allongement ou prolongation",
          "Rapidité de récitation",
          "Changement de ton",
        ],
        correctAnswerIndex: 1,
      },
      {
        question: "Le Madd al-Tabi'i (prolongation naturelle) dure :",
        choices: [
          "Une haraka",
          "Deux harakas",
          "Trois harakas",
          "Quatre harakas",
        ],
        correctAnswerIndex: 1,
      },
      {
        question: "Quel type de Madd a une durée obligatoirement plus longue ?",
        choices: [
          "Madd al-Tabi'i",
          "Madd al-Lazim",
          "Madd al-Arid",
          "Madd al-Badal",
        ],
        correctAnswerIndex: 1,
      },
    ],
  },

  {
    title: "L'arrêt et la continuité (Al-Waqf wa Al-Ibtida)",
    chapterNumber: 7,
    introduction: "Al-Waqf (الوقف) signifie 'arrêt' ou 'pause' pendant la récitation, tandis qu'Al-Ibtida (الابتداء) signifie 'commencer' ou 'reprendre'.\n\nCes règles gouvernent les endroits appropriés pour faire une pause lors de la récitation du Coran, sans modifier le sens ou interrompre le flux inappropriatement.\n\nDans ce chapitre :\n• Types de Waqf (obligatoire, interdit, permis)\n• Marquages de Waqf dans le Coran\n• Les signes conventionnels\n• Règles de continuité (Ibtida)\n• Application pratique",
    pages: [
      {
        title: "Leçon : Définition et importance du Waqf",
        href: "/chapitres-tajwid/7/0",
        pageNumber: 0,
      },
      {
        title: "Leçon : Types de Waqf - Obligatoire et interdit",
        href: "/chapitres-tajwid/7/1",
        pageNumber: 1,
      },
      {
        title: "Leçon : Waqf permis et recommandé",
        href: "/chapitres-tajwid/7/2",
        pageNumber: 2,
      },
      {
        title: "Leçon : Les marquages et signes du Waqf",
        href: "/chapitres-tajwid/7/3",
        pageNumber: 3,
      },
      {
        title: "Leçon : Pratique - Récitation avec Waqf approprié",
        href: "/chapitres-tajwid/7/4",
        pageNumber: 4,
      },
    ],
    quiz: [
      {
        question: "Que signifie Al-Waqf ?",
        choices: [
          "Commencer la récitation",
          "Arrêt ou pause pendant la récitation",
          "Changer la prononciation",
          "Accélérer la vitesse",
        ],
        correctAnswerIndex: 1,
      },
      {
        question: "Le Waqf Lazim (obligatoire) est imposé pour :",
        choices: [
          "Des raisons de confort",
          "Éviter des changements de sens ou de grammaire",
          "Accélérer la récitation",
          "Créer une musicalité",
        ],
        correctAnswerIndex: 1,
      },
    ],
  },

  {
    title: "Règles supplémentaires : Hamza et Tâ Marbûta",
    chapterNumber: 8,
    introduction: "Ce chapitre couvre des règles spécialisées concernant le Hamza (ء) et le Tâ Marbûta (ة), deux éléments importants du Tajwid qui requièrent une attention particulière.\n\nLe Hamza est une coupure glottale qui peut apparaître en début, milieu ou fin de mot. Le Tâ Marbûta est une forme spéciale de la lettre Tâ utilisée en fin de mot pour indiquer le féminin.\n\nDans ce chapitre :\n• Prononciation du Hamza dans différentes positions\n• Assimilation du Hamza\n• Règles du Tâ Marbûta\n• Différenciation avec Tâ régulier\n• Application aux versets",
    pages: [
      {
        title: "Leçon : Le Hamza - Définition et positions",
        href: "/chapitres-tajwid/8/0",
        pageNumber: 0,
      },
      {
        title: "Leçon : Hamza au début du mot",
        href: "/chapitres-tajwid/8/1",
        pageNumber: 1,
      },
      {
        title: "Leçon : Hamza au milieu et à la fin du mot",
        href: "/chapitres-tajwid/8/2",
        pageNumber: 2,
      },
      {
        title: "Leçon : Le Tâ Marbûta et ses règles",
        href: "/chapitres-tajwid/8/3",
        pageNumber: 3,
      },
      {
        title: "Leçon : Pratique - Application aux versets coraniques",
        href: "/chapitres-tajwid/8/4",
        pageNumber: 4,
      },
    ],
    quiz: [
      {
        question: "Le Hamza est :",
        choices: [
          "Une voyelle longue",
          "Une coupure glottale",
          "Une forme de Tâ",
          "Une lettre douce",
        ],
        correctAnswerIndex: 1,
      },
      {
        question: "Le Tâ Marbûta s'utilise généralement :",
        choices: [
          "Au début du mot",
          "Au milieu du mot",
          "À la fin du mot pour indiquer le féminin",
          "Dans les verbes seulement",
        ],
        correctAnswerIndex: 2,
      },
      {
        question: "La prononciation du Hamza peut être affectée par :",
        choices: [
          "Seulement la voyelle suivante",
          "Le contexte et les lettres environnantes",
          "Toujours la même",
          "Le début du verset seulement",
        ],
        correctAnswerIndex: 1,
      },
    ],
  },

  {
    title: "Récitation pratique et intégration des règles",
    chapterNumber: 9,
    introduction: "Ce chapitre intègre toutes les règles apprises dans les chapitres précédents dans une pratique de récitation holistique. Vous allez appliquer les différentes règles de manière fluide et naturelle.\n\nL'objectif est de développer une mémoire musculaire et une compréhension intuitive des règles du Tajwid, plutôt que de les appliquer mécaniquement.\n\nDans ce chapitre :\n• Récitations guidées de versets coraniques\n• Application intégrée de plusieurs règles\n• Correction auditive et feedback\n• Amélioration de la fluidité\n• Développement de la confiance en soi",
    pages: [
      {
        title: "Leçon : Versets d'entraînement - Partie 1",
        href: "/chapitres-tajwid/9/0",
        pageNumber: 0,
      },
      {
        title: "Leçon : Versets d'entraînement - Partie 2",
        href: "/chapitres-tajwid/9/1",
        pageNumber: 1,
      },
      {
        title: "Leçon : Versets d'entraînement - Partie 3",
        href: "/chapitres-tajwid/9/2",
        pageNumber: 2,
      },
      {
        title: "Leçon : Analyse de récitations correctes",
        href: "/chapitres-tajwid/9/3",
        pageNumber: 3,
      },
      {
        title: "Leçon : Évaluation personnelle et progression",
        href: "/chapitres-tajwid/9/4",
        pageNumber: 4,
      },
    ],
    quiz: [
      {
        question: "L'intégration des règles du Tajwid signifie :",
        choices: [
          "Les appliquer une par une",
          "Les appliquer toutes simultanément de manière fluide",
          "Oublier les règles et réciter naturellement",
          "Utiliser seulement les 3 règles principales",
        ],
        correctAnswerIndex: 1,
      },
      {
        question: "Pour développer une bonne récitation, faut-il :",
        choices: [
          "Étudier uniquement la théorie",
          "Pratiquer sans comprendre les règles",
          "Combiner l'étude théorique avec la pratique régulière",
          "Réciter très rapidement",
        ],
        correctAnswerIndex: 2,
      },
    ],
  },

  {
    title: "Évaluation finale et certification",
    chapterNumber: 10,
    introduction: "Félicitations ! Vous avez complété l'ensemble du module Tajwid. Ce chapitre final évalue votre compréhension globale des règles du Tajwid et votre capacité à les appliquer.\n\nCette évaluation comprend :\n• Un quiz théorique couvrant tous les chapitres\n• Une évaluation pratique de la récitation\n• Un feedback personnalisé\n• Une certification d'accomplissement\n\nAprès cette évaluation, vous aurez les connaissances de base solides pour continuer à améliorer votre récitation de manière indépendante ou avec un tuteur.",
    pages: [
      {
        title: "Évaluation : Révision théorique",
        href: "/chapitres-tajwid/10/0",
        pageNumber: 0,
      },
      {
        title: "Évaluation : Analyse de texte coranique",
        href: "/chapitres-tajwid/10/1",
        pageNumber: 1,
      },
      {
        title: "Évaluation : Identification des règles",
        href: "/chapitres-tajwid/10/2",
        pageNumber: 2,
      },
      {
        title: "Évaluation : Récitation pratique",
        href: "/chapitres-tajwid/10/3",
        pageNumber: 3,
      },
      {
        title: "Résultats et certification",
        href: "/chapitres-tajwid/10/4",
        pageNumber: 4,
      },
    ],
    quiz: [
      {
        question: "Le Tajwid combine :",
        choices: [
          "Seulement la théorie",
          "Seulement la pratique",
          "La théorie et la pratique intégrées",
          "Uniquement la phonétique",
        ],
        correctAnswerIndex: 2,
      },
      {
        question: "Après ce module, vous devriez être capable de :",
        choices: [
          "Mémoriser le Coran entièrement",
          "Réciter avec les règles de base du Tajwid appliquées",
          "Être expert du Tajwid",
          "Enseigner le Tajwid professionnellement",
        ],
        correctAnswerIndex: 1,
      },
      {
        question: "Le progrès en Tajwid requiert :",
        choices: [
          "Étude unique",
          "Étude et pratique régulière",
          "Talent naturel seulement",
          "Aucun effort",
        ],
        correctAnswerIndex: 1,
      },
      {
        question: "Quel est l'acronyme que vous avez appris au début du cours ?",
        choices: [
          "TAJWID",
          "ERPR",
          "CORAN",
          "QURAN",
        ],
        correctAnswerIndex: 1,
      },
    ],
  },
];
