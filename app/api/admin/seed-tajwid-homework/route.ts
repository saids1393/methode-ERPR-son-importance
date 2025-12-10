import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    console.log('🌱 Début du seed des devoirs Tajwid...');

    const tajwidHomeworks = [
      {
        chapterId: 1,
        title: 'Devoir : Fondamentaux du Tajwid',
        content: `Ce devoir vous permettra de consolider vos connaissances sur les fondamentaux du Tajwid.

PARTIE 1 : QUESTIONS THÉORIQUES

1. Définissez le Tajwid en vos propres mots et expliquez son importance dans la récitation du Coran.

2. Quelles sont les trois principales caractéristiques des lettres arabes que vous avez apprises dans ce chapitre ?

3. Citez et expliquez au moins 3 signes diacritiques utilisés en Tajwid.

PARTIE 2 : EXERCICES PRATIQUES

4. Enregistrez-vous en train de prononcer les 28 lettres de l'alphabet arabe en respectant leurs points d'articulation.

5. Identifiez dans les versets suivants les lettres emphatiques et les lettres douces :
   - بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
   - الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ

PARTIE 3 : RÉFLEXION

6. Comment la pratique régulière du Tajwid peut-elle améliorer votre compréhension et votre connexion spirituelle avec le Coran ?

CONSIGNES :
- Répondez clairement et de façon structurée
- Pour les exercices audio, enregistrez-vous et envoyez le fichier
- Prenez votre temps et relisez vos réponses avant de soumettre`
      },
      {
        chapterId: 2,
        title: 'Devoir : Les lettres emphatiques',
        content: `Ce devoir évalue votre maîtrise des lettres emphatiques et leurs caractéristiques.

PARTIE 1 : IDENTIFICATION

1. Listez les 4 lettres emphatiques principales en arabe et en translittération.

2. Pour chacune de ces lettres, décrivez leur point d'articulation spécifique.

3. Quelle est la différence fondamentale entre une lettre emphatique et une lettre douce ?

PARTIE 2 : PRONONCIATION

4. Enregistrez-vous en prononçant ces paires de lettres pour montrer la différence.

5. Lisez les mots suivants à voix haute en insistant sur le son grave des lettres emphatiques.

CONSIGNES :
- Soyez précis dans vos réponses
- Les enregistrements audio sont obligatoires`
      },
      {
        chapterId: 3,
        title: 'Devoir : L\'assimilation (Al-Idgham)',
        content: `Ce devoir porte sur votre compréhension et application de l'Idgham.

PARTIE 1 : THÉORIE

1. Définissez l'Idgham et expliquez quand cette règle s'applique.

2. Quelle est la différence entre Idgham avec nasalisation et Idgham sans nasalisation ?

3. Donnez 3 exemples concrets de chaque type d'Idgham tirés du Coran.

CONSIGNES :
- Répondez de façon détaillée
- Les enregistrements sont essentiels`
      },
      {
        chapterId: 4,
        title: 'Devoir : Assimilation partielle et complète',
        content: `Ce devoir approfondit votre connaissance des différents types d'assimilation.

PARTIE 1 : DISTINCTION DES TYPES

1. Expliquez la différence entre Idgham Kamel et Idgham Naqis.

2. Quelles lettres sont concernées par chaque type ?

CONSIGNES :
- Soyez précis dans vos classifications
- L'enregistrement audio est obligatoire`
      },
      {
        chapterId: 5,
        title: 'Devoir : La nasalisation (Al-Ghunnah)',
        content: `Ce devoir évalue votre maîtrise de la Ghunnah et son application.

PARTIE 1 : COMPRÉHENSION THÉORIQUE

1. Définissez la Ghunnah et expliquez son origine phonétique.

2. Quelles sont les deux lettres principales concernées par la Ghunnah ?

3. Quelle est la durée standard d'une Ghunnah ?

CONSIGNES :
- Réponses détaillées attendues
- Enregistrements audio obligatoires`
      },
      {
        chapterId: 6,
        title: 'Devoir : Les types de prolongation (Al-Madd)',
        content: `Ce devoir porte sur les différents types de Madd et leur application.

PARTIE 1 : CLASSIFICATION DES MADD

1. Listez les 4 principaux types de Madd étudiés.

2. Pour chaque type, indiquez sa définition, sa durée en harakas, et les conditions de son application.

CONSIGNES :
- Précision requise dans les durées
- Enregistrements audio essentiels`
      },
      {
        chapterId: 7,
        title: 'Devoir : L\'arrêt et la continuité',
        content: `Ce devoir évalue votre compréhension des règles de Waqf et d'Ibtida.

PARTIE 1 : TYPES DE WAQF

1. Définissez les 4 principaux types de Waqf.

2. Pour chaque type, donnez 2 exemples du Coran.

CONSIGNES :
- Réponses structurées et détaillées
- Enregistrements obligatoires`
      },
      {
        chapterId: 8,
        title: 'Devoir : Règles du Hamza et du Tâ Marbûta',
        content: `Ce devoir approfondit les règles spéciales du Hamza et du Tâ Marbûta.

PARTIE 1 : LE HAMZA

1. Qu'est-ce qu'un Hamza d'un point de vue phonétique ?

2. Listez les 3 positions possibles du Hamza dans un mot.

CONSIGNES :
- Exemples précis avec références coraniques
- Enregistrements en récitation continue et en Waqf`
      },
      {
        chapterId: 9,
        title: 'Devoir : Intégration et pratique avancée',
        content: `Ce devoir intègre toutes les règles apprises et évalue votre récitation globale.

PARTIE 1 : RÉVISION COMPLÈTE

1. Créez un tableau récapitulatif de toutes les règles de Tajwid étudiées.

2. Enregistrez-vous en récitant des sourates complètes en appliquant TOUTES les règles de Tajwid.

CONSIGNES :
- Ce devoir est complet et exige du temps
- La qualité prime sur la quantité`
      },
      {
        chapterId: 10,
        title: 'Devoir : Évaluation finale et certification',
        content: `FÉLICITATIONS ! Vous êtes arrivé au dernier devoir du module Tajwid.

Ce devoir final évalue l'ensemble de vos connaissances et compétences acquises.

PARTIE 1 : EXAMEN THÉORIQUE COMPLET (40 points)

1. Définissez le Tajwid et expliquez son importance religieuse et linguistique.

2. Citez et expliquez les 5 règles de Tajwid que vous considérez comme les plus fondamentales.

PARTIE 2 : EXAMEN PRATIQUE (40 points)

Enregistrez une récitation de 10 minutes minimum incluant plusieurs sourates.

POUR OBTENIR LA CERTIFICATION :
- Score minimum : 70/100
- Récitation de qualité satisfaisante

Bonne chance ! Qu'Allah facilite votre apprentissage et votre pratique du Tajwid.`
      }
    ];

    const results = [];

    for (const homework of tajwidHomeworks) {
      try {
        const existing = await prisma.tajwidHomework.findUnique({
          where: { chapterId: homework.chapterId }
        });

        if (existing) {
          console.log(`✅ Devoir Tajwid chapitre ${homework.chapterId} existe déjà`);
          results.push({
            chapterId: homework.chapterId,
            status: 'exists',
            message: `Devoir chapitre ${homework.chapterId} existe déjà`
          });
          continue;
        }

        const created = await prisma.tajwidHomework.create({
          data: homework
        });

        console.log(`✅ Devoir Tajwid chapitre ${homework.chapterId} créé : ${homework.title}`);
        results.push({
          chapterId: homework.chapterId,
          status: 'created',
          id: created.id,
          message: `Devoir chapitre ${homework.chapterId} créé avec succès`
        });
      } catch (error: any) {
        console.error(`❌ Erreur création devoir chapitre ${homework.chapterId}:`, error);
        results.push({
          chapterId: homework.chapterId,
          status: 'error',
          error: error.message
        });
      }
    }

    console.log('\n🎉 Seed des devoirs Tajwid terminé !');

    return NextResponse.json({
      success: true,
      message: 'Seed des devoirs Tajwid terminé',
      results
    });

  } catch (error: any) {
    console.error('❌ Erreur globale seed devoirs Tajwid:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message
      },
      { status: 500 }
    );
  }
}
