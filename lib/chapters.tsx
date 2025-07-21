// lib/chapters.tsx
import React, { JSX } from "react";

export type Page = {
  title: string;
  href: string;        // URL vers la page dynamique
  pageNumber: number;  // Numéro de page
  status?: 'completed' | 'pending'; // Statut de la page
};

export type Chapter = {
  title: string;
  chapterNumber: number; // Numéro du chapitre
  pages: Page[];
  introduction?: string;
};

export const chapters: Chapter[] = [
  {
    title: " avant la méthode",
    chapterNumber: 0,
    introduction: "Imaginez que vous entrez dans une nouvelle classe avec 28 élèves. Chaque élève porte un prénom unique : le premier s'appelle Alif, le tout premier que vous rencontrerez. Le dernier s'appelle Ya, le dernier de la classe. Au début, retenir les prénoms de ces 28 camarades vous semblera difficile… mais à force de les revoir, de les entendre et de les répéter, même les prénoms les plus compliqués finiront par vous sembler familiers.\nC'est exactement pareil pour les 28 lettres de l'alphabet arabe. Chacune est comme un prénom à apprendre et à reconnaître. Ces lettres sont la base de tout : ce sont les voyelles et consonnes qui donnent vie aux mots.\nDans cette méthode, nous allons apprendre à bien prononcer chaque lettre — comme si vous prononciez correctement le prénom de chacun de vos nouveaux amis, même ceux dont le prénom semble difficile au départ.\nEt quel est le secret ?\nUn seul : l'écoute, la répétition, l'enregistrement de la lecture de ces lettres, la comparaison et réessayer jusqu'à la réussite, jusqu'à bien les prononcer.",
    pages: [
      {
        title: "Leçon : prononciation des lettres arabes",
        href: "/chapitres/0/0",
        pageNumber: 0,
        status: 'completed'
      }
    ]
  },
  {
    title: "Lettres de l'alphabet",
    chapterNumber: 1,
    introduction: "Nous avons découvert les 28 lettres de base. Il est maintenant temps d'entrer un peu plus dans le détail.\nParmi ces 28 lettres, 8 lettres particulières sont appelées lettres emphatiques, ou encore lettres graves. Dans notre méthode, elles seront colorées en rouge au début, car elles se prononcent avec un son plus grave et plus profond que les autres.\nPour mieux retenir : imaginez que, dans une classe de 28 élèves, 8 d'entre eux ont une voix grave, tandis que les autres ont une voix plus aiguë. C'est exactement cette différence que vous devrez entendre, sentir et reproduire en prononçant ces lettres.\nMais ce n'est pas tout !\nEn plus des 28 lettres principales, il existe deux caractères spéciaux que nous allons aussi apprendre à reconnaître. Dans notre méthode, ils seront colorés en violet au début :\nLa lettre Hamzah (ء) : c'est une lettre auxiliaire, souvent portée par d'autres lettres (comme Alif, Wâw, Yâ ou même isolée sur la ligne). Elle ne fait pas partie des 28 lettres de base, mais elle joue un rôle essentiel dans la prononciation des sons coupés (coupure glottale).\n\nLe Tâ Marbûta (ة), aussi appelé \"Tâ fermé\" : ce n'est pas une lettre indépendante, mais une forme particulière de la lettre Tâ (ت). On la retrouve uniquement en fin de mot, et elle sert principalement à indiquer le féminin.",
    pages: [
      {
        title: "Leçon : lettres seules (non attachées)",
        href: "/chapitres/1/1",
        pageNumber: 1,
        status: 'completed'
      },
      {
        title: "Leçon : lettres attachées au début d'un mot",
        href: "/chapitres/1/2",
        pageNumber: 2,
        status: 'completed'
      },
      {
        title: "Leçon : lettres attachées au milieu d'un mot",
        href: "/chapitres/1/3",
        pageNumber: 3,
        status: 'completed'
      },
      {
        title: "Leçon : lettres attachées à la fin d'un mot",
        href: "/chapitres/1/4",
        pageNumber: 4,
        status: 'completed'
      },
      {
        title: "Exercice : écriture des lettres seules et attachées",
        href: "/chapitres/1/5",
        pageNumber: 5,
        status: 'completed'
      },
      {
        title: " Exercice : reconnaissance des lettres seules et attachées",
        href: "/chapitres/1/6",
        pageNumber: 6,
        status: 'completed'
      },
      {
        title: "Exercice : reconnaissance des lettres séparées au début de certaines sourates",
        href: "/chapitres/1/7",
        pageNumber: 7,
        status: 'completed'
      }
    ]
  },
  {
    title: "Voyelles simples",
    introduction: "Bienvenue dans ce chapitre consacré aux voyelles simples. Bonne nouvelle : ce sera une partie très facile, car elle ne demande pas beaucoup de mémorisation, mais plutôt un peu de compréhension et de logique.\nSachez que lire et écrire en arabe, c'est simple, car il n'existe que trois voyelles principales dans cette langue :\nFatha ( ـَ ) : elle donne le son A.\n\nDammah ( ـُ ) : elle donne le son OU.\n\nKasrah ( ـِ ) : elle donne le son I.\n\nMaintenant, comment cela fonctionne ?\nVous avez appris que les 28 lettres sont comme 28 élèves, chacune ayant son prénom (sa prononciation de base). Mais lorsque l'une de ces voyelles arrive au-dessus ou au-dessous d'une lettre, la lettre ne prononce plus son prénom complet.\nElle sera lue uniquement par son point de sortie (makhraj) et le son donné par la voyelle placée sur elle.\nC'est comme si la voyelle lui disait :\n\"Chut, je prends le relais ! mais je garde une partie de toi\"\nLa lettre devient alors le support de la voyelle, et c'est ensemble qu'elles produisent le son final.",
    chapterNumber: 2,
    pages: [
      {
        title: "Leçon : lettres seules (non attachées) avec voyelles",
        href: "/chapitres/2/8",
        pageNumber: 8,
        status: 'completed'
      },
      {
        title: "Leçon : lettres attachées au début d'un mot avec voyelles simples",
        href: "/chapitres/2/9",
        pageNumber: 9,
        status: 'completed'
      },
      {
        title: "Leçon : lettres attachées au milieu d'un mot avec voyelles simples",
        href: "/chapitres/2/10",
        pageNumber: 10,
        status: 'completed'
      },
      {
        title: "Leçon : lettres attachées à la fin d'un mot avec voyelles simples",
        href: "/chapitres/2/11",
        pageNumber: 11,
        status: 'completed'
      }
    ]
  },
  {
    title: "Doubles voyelles",
    chapterNumber: 3,
    introduction: "N'ayez pas peur des doubles voyelles ! Elles découlent des voyelles simples auxquelles on ajoute à la fin un son \"n\".\nPar exemple :\nLa Fatha (qui fait le son a) devient an.\n\nLa Damma (qui fait le son ou) devient oun.\n\nLa Kasrah (qui fait le son i) devient in.\n\nAinsi, les doubles voyelles sont simplement les voyelles simples avec un petit son \"n\" ajouté à la fin.",
    pages: [
      {
        title: "Leçon : lettres seules (non attachées) avec voyelles doubles",
        href: "/chapitres/3/12",
        pageNumber: 12,
        status: 'completed'
      },
      {
        title: "Leçon : lettres attachées au début d'un mot avec voyelles doubles",
        href: "/chapitres/3/13",
        pageNumber: 13,
        status: 'completed'
      },
      {
        title: "Leçon : lettres attachées au milieu d'un mot avec voyelles doubles",
        href: "/chapitres/3/14",
        pageNumber: 14,
        status: 'completed'
      },
      {
        title: "Leçon : lettres attachées à la fin d'un mot avec voyelles doubles",
        href: "/chapitres/3/15",
        pageNumber: 15,
        status: 'completed'
      }
    ]
  },
  {
    title: "lettres qui ne s'attachent pas après elles",
    chapterNumber: 4,
    introduction: "Sachez qu'en arabe, il existe 6 lettres qui ne s'attachent pas à la lettre qui suit.\nPourquoi est-ce important de le savoir ?\nParce que, souvent, les débutants confondent la lettre Noun (ن) et la lettre Dhal (ذ). Ces deux lettres ont un point au-dessus, ce qui peut prêter à confusion lors de la lecture.\nVoici comment les différencier :\nLe Dhal (ذ) fait partie des lettres qui ne s'attachent pas à la lettre suivante. Donc, si vous voyez une lettre avec un point en haut qui ne s'attache pas à la lettre d'après, c'est sûrement un Dhal.\n\nEn revanche, si vous voyez une lettre avec un point au-dessus qui s'attache à la lettre suivante, c'est obligatoirement un Noun (ن).\n\nC'est pour cela qu'il est essentiel de connaître ces lettres qui ne s'attachent pas aux suivantes, afin d'éviter les erreurs de lecture, notamment dans le Coran.",
    pages: [
      {
        title: "Leçon : exemples et compréhension",
        href: "/chapitres/4/16",
        pageNumber: 16,
        status: 'completed'
      }
    ]
  },
  {
    title: "Mots avec voyelles simples et doubles",
    chapterNumber: 5,
    introduction: "Bravo ! Félicitations, vous avez fait le plus difficile : vous êtes déjà à la moitié de la méthode !\nSi vous avez bien suivi et pratiqué avec les lettres correctement mémorisées, vous devez maintenant être capables de lire... Eh oui, lire !\nMais alors, que reste-t-il ?\nIl reste à compléter le Tachkil.\nJusqu'ici, nous avons vu :\nLes voyelles simples,\n\nLes voyelles doubles (tanwin),\n\nCes éléments font partie du Tachkil, qui sert à indiquer comment prononcer correctement les lettres arabes grâce aux voyelles et signes écrits.\nIl ne reste plus que trois éléments à apprendre :\nLa prolongation (madd),\n\nLe sukoun (absence de voyelle),\n\nLa shaddah (doublement d'une lettre).\n\nAprès cela, la lecture sera encore plus claire et complète pour vous. 🏆",
    pages: [
      {
        title: "Exercice : reconnaissance des mots avec voyelles simples et doubles",
        href: "/chapitres/5/17",
        pageNumber: 17,
        status: 'completed'
      }
    ]
  },
  {
    title: "Prolongations / Douces",
    chapterNumber: 6,
    introduction: "On y est presque, accrochez-vous encore un peu !\nEntrons maintenant dans le chapitre des prolongations. Comme je vous l'ai déjà dit, la langue arabe est facile, et bonne nouvelle : il n'y a que trois lettres de prolongation :\nAlif (ا)\n\nWaw (و)\n\nYaa (ي)\n\nCes lettres permettent de prolonger le son d'une voyelle, c'est-à-dire d'étirer ou de retenir un peu plus longtemps le son de la lettre précédente.\nPas d'inquiétude, c'est très simple. Il faudra juste un peu de compréhension et de logique, et vous allez vite saisir.\nVoici la règle principale :\nPour qu'une prolongation soit activée, il faut que la lettre de prolongation corresponde à la voyelle placée sur la lettre précédente.\nAlif (ا) = active si la lettre précédente porte une fatha ( َ )\n\nWaw (و) = active si la lettre précédente porte une damma ( ُ )\n\nYaa (ي) = active si la lettre précédente porte une kasra ( ِ )\n\n💡 Dans le cas contraire, la lettre de prolongation ne sera pas active et sera considérée comme une simple consonne.\nEn résumé :\nVoyelle + lettre de prolongation = son allongé.\nPrenez votre temps pour bien comprendre cette logique : c'est simple et très utile pour lire correctement.\n\nRemarque importante :\nSi la lettre de prolongation ne correspond pas à la voyelle précédente, elle ne servira pas à allonger le son mais deviendra une layyinah, c'est-à-dire une lettre douce. Il n'y en a que deux : Yaa (ي) et Waw (و). Au lieu de prolonger le son, on arrête leur son en douceur.\n\nIl y a aussi des symboles qui agissent de la même manière que les prolongations Alif, Waw et Yaa, mais en plus petits. En arabe, on les appelle saghīghah (صغيرة), ce qui signifie « petite ».\nOn les nomme donc : Alif Saghīghah, Waw Saghīghah et Yaa Saghīghah.\nCes petites lettres ne s'activent qu'avec leur voyelle correspondante :\nAlif Saghīghah s'active avec la voyelle fatha ( َ )\n\nWaw Saghīghah s'active avec la voyelle damma ( ُ )\n\nYaa Saghīghah s'active avec la voyelle kasra ( ِ )",
    pages: [
      {
        title: "Leçon : symboles Alif saghirah - Ya saghirah - Waw saghirah",
        href: "/chapitres/6/18",
        pageNumber: 18,
        status: 'completed'
      },
      {
        title: "Leçon : les trois lettres de prolongation",
        href: "/chapitres/6/19",
        pageNumber: 19,
        status: 'completed'
      },
      {
        title: "Leçon : lettres douces",
        href: "/chapitres/6/20",
        pageNumber: 20,
        status: 'completed'
      }
    ]
  },
  {
    title: "Règles combinées",
    chapterNumber: 7,
    pages: [
      {
        title: "Exercice : reconnaissance des mots avec doubles voyelles, prolongations et lettres douces",
        href: "/chapitres/7/21",
        pageNumber: 21,
        status: 'completed'
      }
    ]
  },
  {
    title: "La soukoun",
    chapterNumber: 8,
    introduction: "Avant-dernier chapitre, courage ! La lumière au bout du tunnel se rapproche. Voyons ensemble ce chapitre consacré à la Soukoune.\nLa Soukoune est l'absence de voyelle sur une consonne. En arabe, cela signifie que la lettre ne porte pas de voyelle (pas de fatḥa, kasra, ou ḍamma), donc elle est dite sukūnée.\nDans la lecture du Coran, la présence d'une soukoune peut entraîner plusieurs comportements sur la lettre concernée, notamment :\nAl-Qalqalah (القَلْقَلَة)\n\nAl-Hams (الهمس)\n\nA voir",
    pages: [
      {
        title: "Leçon : la soukoun",
        href: "/chapitres/8/22",
        pageNumber: 22,
        status: 'completed'
      },
      {
        title: "Exercice : reconnaissance des mots avec la soukoun",
        href: "/chapitres/8/23",
        pageNumber: 23,
        status: 'completed'
      }
    ]
  },
  {
    title: "Lettres solaires et lunaires",
    chapterNumber: 9,
    introduction: "Chapitre 9 : Les lettres solaires et lunaires\nLes lettres solaires et lunaires sont divisées en deux groupes. Sachant qu'il y a 28 lettres dans la langue arabe, 14 sont solaires et 14 sont lunaires. Mais que signifie cela exactement ?\nCela veut dire qu'avec les lettres solaires, on ne prononce pas le \"lâm\" (ل) qui est normalement marqué d'une sukûn (absence de voyelle). Le Coran a été facilité à cet égard : il n'y a pas de sukûn au-dessus du \"lâm\" dans ces cas-là. En revanche, avec les lettres lunaires, on prononce le \"lâm\" avec la sukûn, et la sukûn est bien visible.\nPourquoi est-il important de savoir cela ?\nC'est pour éviter la fameuse question : \"Pourquoi ne prononce-t-on pas le 'lâm' ?\" De plus, cela aide quand tu auras un niveau avancé en arabe, car tu liras des phrases sans voyelles (sans tashkîl). Je te rassure, ce cas n'apparaît pas dans le Coran, où les lettres sont toujours accompagnées de tashkîl pour éviter toute erreur. Tu rencontreras surtout cette absence de voyelles dans les livres des savants, une fois que tu auras un bon niveau de vocabulaire et de grammaire.\nDans le Coran, le tashkîl est toujours présent, car le texte est préservé de toute erreur et rendu accessible.",
    pages: [
      {
        title: "Leçon : exemples et compréhension des lettres solaires et lunaires",
        href: "/chapitres/9/24",
        pageNumber: 24,
        status: 'completed'
      }
    ]
  },
  {
    title: "La shaddah",
    chapterNumber: 10,
    introduction: "Félicitations et bienvenue au dernier chapitre de la méthode ! Avant de pouvoir enfin lire le Coran sans erreur, il reste bien sûr les règles du tajwid pour apprendre à lire comme un imam, avec une belle récitation. En effet, le mot tajwid signifie « embellissement ».\nAlhamdoulilah, la méthode a tenu sa promesse : tu sais maintenant décoder les bases du Coran.\nPassons directement au sujet : qu'est-ce que la shaddah ?\nLa shaddah est un signe indiquant qu'une lettre est doublée. Par exemple, la lettre « ta » avec la voyelle fatha (qui donne le son « a ») doublée. Au lieu de prononcer « ta-ta », on appuie sur la lettre, on la prononce de manière prolongée, en insistant sur elle sans pause, en maintenant la prononciation.",
    pages: [
      {
        title: "Leçon : shaddah",
        href: "/chapitres/10/25",
        pageNumber: 25,
        status: 'completed'
      },
      {
        title: "Exercice : reconnaissance des mots avec la shaddah",
        href: "/chapitres/10/26",
        pageNumber: 26,
        status: 'completed'
      },
      {
        title: "Exercice : reconnaissance des mots avec la shaddah et la soukoun",
        href: "/chapitres/10/27",
        pageNumber: 27,
        status: 'completed'
      },
      {
        title: "Exercice : Reconnaissance des mots avec la Chaddah, la soukoun et les prolongations",
        href: "/chapitres/10/28",
        pageNumber: 28,
        status: 'completed'
      },
      {
        title: "Exercice : écriture complète des mots avec toute les bases de la",
        href: "/chapitres/10/29",
        pageNumber: 29,
        status: 'completed'
      }
    ]
  },
  {
    title: "Évaluation finale",
    chapterNumber: 11,
    pages: [
      {
        title: "Examen final sur toute la méthode",
        href: "/chapitres/11/30",
        pageNumber: 30,
        status: 'completed'
      }
    ]
  }
];

// Fonctions utilitaires pour faciliter l'utilisation

// Helper functions
export const getChapterByNumber = (chapterNumber: number): Chapter | undefined => {
  return chapters.find(chapter => chapter.chapterNumber === chapterNumber);
};

export const getPageByNumbers = (chapterNumber: number, pageNumber: number): Page | undefined => {
  const chapter = getChapterByNumber(chapterNumber);
  return chapter?.pages.find(page => page.pageNumber === pageNumber);
};

export const getAllPages = (): Page[] => {
  return chapters.flatMap(chapter => chapter.pages);
};

export const generateAllStaticParams = () => {
  return chapters.flatMap(chapter =>
    chapter.pages.map(page => ({
      chapitres: chapter.chapterNumber.toString(),
      page: page.pageNumber.toString()
    }))
  );
};

// Fonction pour obtenir la page suivante
export const getNextPage = (currentChapter: number, currentPage: number): Page | undefined => {
  const allPages = getAllPages();
  const currentIndex = allPages.findIndex(page =>
    page.pageNumber === currentPage &&
    chapters.find(ch => ch.pages.includes(page))?.chapterNumber === currentChapter
  );

  return currentIndex !== -1 && currentIndex < allPages.length - 1
    ? allPages[currentIndex + 1]
    : undefined;
};

// Fonction pour obtenir la page précédente
export const getPreviousPage = (currentChapter: number, currentPage: number): Page | undefined => {
  const allPages = getAllPages();
  const currentIndex = allPages.findIndex(page =>
    page.pageNumber === currentPage &&
    chapters.find(ch => ch.pages.includes(page))?.chapterNumber === currentChapter
  );

  return currentIndex > 0 ? allPages[currentIndex - 1] : undefined;
};