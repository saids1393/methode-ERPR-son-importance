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
};

export const chapters: Chapter[] = [
  {
    title: " avant la méthode",
    chapterNumber: 0,
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
    chapterNumber: 2,
    pages: [
      {
        title: "Leçon : lettres seules (non attachées) avec voyelles",
        href: "/chapitres/2/8",
        pageNumber: 8,
        status: 'completed'
      },
      {
        title: "Leçon : lettres attachées au début d’un mot avec voyelles simples",
        href: "/chapitres/2/9",
        pageNumber: 9,
        status: 'completed'
      },
      {
        title: "Leçon : lettres attachées au milieu d’un mot avec voyelles simples",
        href: "/chapitres/2/10",
        pageNumber: 10,
        status: 'completed'
      },
      {
        title: "Leçon : lettres attachées à la fin d’un mot avec voyelles simples",
        href: "/chapitres/2/11",
        pageNumber: 11,
        status: 'completed'
      }
    ]
  },
  {
    title: "Doubles voyelles",
    chapterNumber: 3,
    pages: [
      {
        title: "Leçon : lettres seules (non attachées) avec voyelles doubles",
        href: "/chapitres/3/12",
        pageNumber: 12,
        status: 'completed'
      },
      {
        title: "Leçon : lettres attachées au début d’un mot avec voyelles doubles",
        href: "/chapitres/3/13",
        pageNumber: 13,
        status: 'completed'
      },
      {
        title: "Leçon : lettres attachées au milieu d’un mot avec voyelles doubles",
        href: "/chapitres/3/14",
        pageNumber: 14,
        status: 'completed'
      },
      {
        title: "Leçon : lettres attachées à la fin d’un mot avec voyelles doubles",
        href: "/chapitres/3/15",
        pageNumber: 15,
        status: 'completed'
      }
    ]
  },
  {
    title: "Lettres qui ne s'attachent pas après elles",
    chapterNumber: 4,
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
        title: "Exercice : écriture complète des mots avec toute les bases de la méthode",
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