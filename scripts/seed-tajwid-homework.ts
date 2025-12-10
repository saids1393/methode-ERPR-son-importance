import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seed des devoirs Tajwid...');

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

4. Enregistrez-vous en prononçant ces paires de lettres pour montrer la différence :
   - خ (emphatique) vs ح (douce)
   - ق (emphatique) vs ك (douce)
   - ظ (emphatique) vs ز (douce)
   - ض (emphatique) vs د (douce)

5. Lisez les mots suivants à voix haute en insistant sur le son grave des lettres emphatiques :
   - خَلَقَ
   - قَالَ
   - ظَلَمَ
   - ضَرَبَ

PARTIE 3 : APPLICATION

6. Dans les versets suivants, soulignez toutes les lettres emphatiques :
   - قُلْ هُوَ اللَّهُ أَحَدٌ
   - اللَّهُ الصَّمَدُ

7. Expliquez comment l'emphase affecte la récitation et le sens du texte coranique.

CONSIGNES :
- Soyez précis dans vos réponses
- Les enregistrements audio sont obligatoires
- Utilisez les ressources du chapitre si nécessaire`
    },
    {
      chapterId: 3,
      title: 'Devoir : L\'assimilation (Al-Idgham)',
      content: `Ce devoir porte sur votre compréhension et application de l'Idgham.

PARTIE 1 : THÉORIE

1. Définissez l'Idgham et expliquez quand cette règle s'applique.

2. Quelle est la différence entre :
   - Idgham avec nasalisation (مع الغنة)
   - Idgham sans nasalisation (بغير غنة)

3. Donnez 3 exemples concrets de chaque type d'Idgham tirés du Coran.

PARTIE 2 : RECONNAISSANCE

4. Dans les versets suivants, identifiez tous les cas d'Idgham :
   - مِنْ مَاءٍ
   - مِنْ نُورٍ
   - مِنْ وَلَدٍ

5. Pour chaque cas identifié, précisez s'il s'agit d'Idgham avec ou sans nasalisation.

PARTIE 3 : PRATIQUE ORALE

6. Enregistrez-vous en récitant les exemples suivants en appliquant correctement l'Idgham :
   - مِنْ مَالٍ
   - مِنْ يَعْمَلُ
   - مِنْ نُورٍ
   - مِنْ لَدُنْهُ

7. Expliquez pourquoi l'Idgham rend la récitation plus fluide et naturelle.

PARTIE 4 : ANALYSE

8. Écoutez la récitation d'un Qari professionnel (vous pouvez utiliser YouTube) et identifiez 5 cas d'Idgham. Notez les versets et le type d'Idgham appliqué.

CONSIGNES :
- Répondez de façon détaillée
- Les enregistrements sont essentiels pour valider votre compréhension
- Citez vos sources pour la partie 4`
    },
    {
      chapterId: 4,
      title: 'Devoir : Assimilation partielle et complète',
      content: `Ce devoir approfondit votre connaissance des différents types d'assimilation.

PARTIE 1 : DISTINCTION DES TYPES

1. Expliquez la différence entre :
   - Idgham Kamel (assimilation complète)
   - Idgham Naqis (assimilation partielle)

2. Quelles lettres sont concernées par l'Idgham Kamel ? Et par l'Idgham Naqis ?

3. Donnez 3 exemples de chaque type tirés du Coran avec leur translittération.

PARTIE 2 : COMPARAISON AVEC AL-IQLAB

4. Qu'est-ce que l'Iqlab et en quoi diffère-t-il de l'Idgham ?

5. Dans quels cas précis applique-t-on l'Iqlab ?

6. Donnez 3 exemples d'Iqlab du Coran.

PARTIE 3 : EXERCICES PRATIQUES

7. Classez les exemples suivants selon qu'ils relèvent de :
   - Idgham Kamel
   - Idgham Naqis
   - Iqlab
   - Aucune de ces règles

   Exemples :
   a) مِنْ مَالٍ
   b) مِنْ بَعْدِ
   c) مِنْ وَاقٍ
   d) مِنْ يَشَاءُ

8. Enregistrez-vous en récitant les 4 exemples ci-dessus en appliquant correctement les règles.

PARTIE 4 : INTÉGRATION

9. Comment ces règles d'assimilation contribuent-elles à la beauté et à la fluidité de la récitation coranique ?

10. Quelles difficultés rencontrez-vous dans l'application de ces règles et comment comptez-vous les surmonter ?

CONSIGNES :
- Soyez précis dans vos classifications
- Les exemples doivent être exacts
- L'enregistrement audio est obligatoire`
    },
    {
      chapterId: 5,
      title: 'Devoir : La nasalisation (Al-Ghunnah)',
      content: `Ce devoir évalue votre maîtrise de la Ghunnah et son application.

PARTIE 1 : COMPRÉHENSION THÉORIQUE

1. Définissez la Ghunnah et expliquez son origine phonétique.

2. Quelles sont les deux lettres principales concernées par la Ghunnah ?

3. Quelle est la durée standard d'une Ghunnah ? Comment la mesure-t-on ?

PARTIE 2 : TYPES DE GHUNNAH

4. Listez et expliquez les différents contextes où la Ghunnah s'applique :
   - Ghunnah du Noon saakin (نْ)
   - Ghunnah du Tanwin (ً ٍ ٌ)
   - Ghunnah du Meem saakin (مْ)
   - Ghunnah dans l'Idgham

5. Donnez 2 exemples du Coran pour chaque contexte mentionné.

PARTIE 3 : INTENSITÉ DE LA GHUNNAH

6. Expliquez les différents niveaux d'intensité de la Ghunnah selon le contexte.

7. Dans quel cas la Ghunnah est-elle la plus marquée ? Et la moins marquée ?

PARTIE 4 : PRATIQUE ORALE

8. Enregistrez-vous en récitant les versets suivants en appliquant correctement la Ghunnah :
   - مِنْ أَنْصَارٍ
   - عَلِيمٌ حَكِيمٌ
   - إِنَّ اللَّهَ
   - مِمَّا

9. Pour chaque exemple, indiquez la durée de la Ghunnah appliquée (en harakas).

PARTIE 5 : ERREURS COURANTES

10. Quelles sont les erreurs les plus fréquentes dans l'application de la Ghunnah ?

11. Comment éviter ces erreurs et améliorer sa prononciation de la Ghunnah ?

CONSIGNES :
- Réponses détaillées attendues
- Enregistrements audio obligatoires
- Citez précisément les versets du Coran`
    },
    {
      chapterId: 6,
      title: 'Devoir : Les types de prolongation (Al-Madd)',
      content: `Ce devoir porte sur les différents types de Madd et leur application.

PARTIE 1 : CLASSIFICATION DES MADD

1. Listez les 4 principaux types de Madd étudiés dans ce chapitre.

2. Pour chaque type, indiquez :
   - Sa définition
   - Sa durée en harakas
   - Les conditions de son application

PARTIE 2 : MADD TABI'I (PROLONGATION NATURELLE)

3. Qu'est-ce que le Madd Tabi'i et pourquoi est-il appelé "naturel" ?

4. Quelle est sa durée standard ?

5. Donnez 5 exemples de Madd Tabi'i du Coran.

PARTIE 3 : MADD LAZIM (PROLONGATION OBLIGATOIRE)

6. Dans quels cas le Madd Lazim s'applique-t-il ?

7. Quelle est la durée du Madd Lazim ?

8. Donnez 3 exemples de Madd Lazim avec leur durée précise.

PARTIE 4 : AUTRES TYPES DE MADD

9. Expliquez le Madd Arid li-l-Sukun (prolongation accidentelle) et ses particularités.

10. Qu'est-ce que le Madd Badal et en quoi se distingue-t-il des autres Madd ?

PARTIE 5 : PRATIQUE INTENSIVE

11. Enregistrez-vous en récitant les exemples suivants en appliquant correctement les Madd :
    - قَالَ (Madd Tabi'i)
    - الضَّالِّينَ (Madd Lazim)
    - عَلَيْهِمُ (Madd Arid)
    - آمَنُوا (Madd Badal)

12. Pour chaque exemple, précisez :
    - Le type de Madd
    - Sa durée en harakas
    - Les raisons de votre choix

PARTIE 6 : ANALYSE COMPARATIVE

13. Écoutez deux récitations différentes d'une même sourate et comparez l'application des Madd. Notez les différences et expliquez si elles sont toutes deux correctes selon les règles.

CONSIGNES :
- Précision requise dans les durées
- Enregistrements audio essentiels
- Analyse comparative documentée`
    },
    {
      chapterId: 7,
      title: 'Devoir : L\'arrêt et la continuité (Al-Waqf wa Al-Ibtida)',
      content: `Ce devoir évalue votre compréhension des règles de Waqf et d'Ibtida.

PARTIE 1 : TYPES DE WAQF

1. Définissez les 4 principaux types de Waqf :
   - Waqf Lazim (obligatoire)
   - Waqf Mamnu' (interdit)
   - Waqf Ja'iz (permis)
   - Waqf Mustahabb (recommandé)

2. Pour chaque type, donnez 2 exemples du Coran et expliquez pourquoi ce Waqf s'impose.

PARTIE 2 : SIGNES DU WAQF

3. Listez les principaux marquages de Waqf que l'on trouve dans les Mushaf :
   - م (Waqf Lazim)
   - لا (Waqf interdit)
   - ج (Waqf permis)
   - صلى (Waqf recommandé)
   - قلى (Waqf préférable)

4. Expliquez la signification de chaque signe et son application.

PARTIE 3 : CONSÉQUENCES SUR LE SENS

5. Donnez 3 exemples où un Waqf inapproprié change complètement le sens d'un verset.

6. Expliquez pourquoi le Waqf est crucial pour la compréhension correcte du Coran.

PARTIE 4 : AL-IBTIDA (REPRISE)

7. Qu'est-ce que l'Ibtida et quelles sont ses règles principales ?

8. Où peut-on reprendre la récitation après un Waqf Lazim ?

9. Donnez 3 exemples de reprises correctes et incorrectes.

PARTIE 5 : PRATIQUE GUIDÉE

10. Enregistrez-vous en récitant Sourate Al-Fatiha en appliquant les Waqf appropriés. Justifiez chaque pause.

11. Récitez les 5 premiers versets de Sourate Al-Baqara avec les Waqf et Ibtida corrects.

PARTIE 6 : ANALYSE AVANCÉE

12. Écoutez une récitation d'un Qari professionnel et identifiez :
    - Les types de Waqf utilisés
    - Les endroits de reprise (Ibtida)
    - L'impact sur la compréhension du texte

13. Y a-t-il des variations acceptables dans l'application du Waqf selon les écoles de Tajwid ?

CONSIGNES :
- Réponses structurées et détaillées
- Enregistrements obligatoires avec justifications
- Citations précises des versets`
    },
    {
      chapterId: 8,
      title: 'Devoir : Règles du Hamza et du Tâ Marbûta',
      content: `Ce devoir approfondit les règles spéciales du Hamza et du Tâ Marbûta.

PARTIE 1 : LE HAMZA

1. Qu'est-ce qu'un Hamza d'un point de vue phonétique ?

2. Listez les 3 positions possibles du Hamza dans un mot :
   - Hamza initial
   - Hamza médian
   - Hamza final

3. Pour chaque position, donnez 3 exemples du Coran et expliquez les règles de prononciation.

PARTIE 2 : HAMZA ET WAQF

4. Comment prononce-t-on le Hamza lorsqu'on fait un Waqf sur le mot qui le contient ?

5. Donnez 3 exemples de Waqf sur un mot se terminant par Hamza.

6. Y a-t-il des cas particuliers où le Hamza change de prononciation au Waqf ?

PARTIE 3 : LE TÂ MARBÛTA (ة)

7. Qu'est-ce que le Tâ Marbûta et à quoi sert-il grammaticalement ?

8. Comment prononce-t-on le Tâ Marbûta :
   - En continuant la récitation ?
   - En faisant un Waqf dessus ?

9. Donnez 5 exemples de mots se terminant par Tâ Marbûta du Coran.

PARTIE 4 : TÂ MARBÛTA VS TÂ RÉGULIER

10. Quelle est la différence entre ة (Tâ Marbûta) et ت (Tâ régulier) ?

11. Comment distinguer les deux à la lecture ?

12. Donnez des paires de mots similaires pour illustrer cette différence.

PARTIE 5 : PRATIQUE ORALE

13. Enregistrez-vous en récitant les versets suivants en appliquant correctement les règles du Hamza et du Tâ Marbûta :
    - أَعُوذُ بِاللَّهِ
    - الرَّحْمَةِ
    - نِعْمَةً
    - السَّمَاءَ

14. Pour chaque exemple, expliquez votre prononciation en récitation continue puis en Waqf.

PARTIE 6 : ERREURS COURANTES

15. Quelles sont les erreurs fréquentes dans la prononciation du Hamza et du Tâ Marbûta ?

16. Comment corriger ces erreurs ?

CONSIGNES :
- Exemples précis avec références coraniques
- Enregistrements en récitation continue et en Waqf
- Explications phonétiques claires`
    },
    {
      chapterId: 9,
      title: 'Devoir : Intégration et pratique avancée',
      content: `Ce devoir intègre toutes les règles apprises et évalue votre récitation globale.

PARTIE 1 : RÉVISION COMPLÈTE

1. Créez un tableau récapitulatif de toutes les règles de Tajwid étudiées dans les 8 premiers chapitres :
   - Nom de la règle
   - Définition courte
   - Conditions d'application
   - Exemple du Coran

PARTIE 2 : RÉCITATION INTÉGRÉE

2. Enregistrez-vous en récitant les sourates suivantes en appliquant TOUTES les règles de Tajwid :
   - Sourate Al-Fatiha (complète)
   - Sourate Al-Ikhlas (complète)
   - Les 5 premiers versets de Sourate Al-Baqara

3. Pour chaque récitation, fournissez un document écrit indiquant :
   - Les règles de Tajwid appliquées à chaque mot
   - Les Madd avec leurs durées
   - Les Waqf choisis et justifiés

PARTIE 3 : AUTO-ÉVALUATION

4. Ré-écoutez vos enregistrements et identifiez :
   - 3 points forts de votre récitation
   - 3 aspects à améliorer
   - Les règles que vous maîtrisez le mieux
   - Les règles qui nécessitent plus de pratique

PARTIE 4 : ANALYSE COMPARATIVE

5. Choisissez une sourate courte (par exemple Al-Kawthar ou Al-Asr) et :
   - Écoutez-la récitée par 3 Qaris différents
   - Comparez leurs applications des règles de Tajwid
   - Notez les variations acceptables
   - Identifiez les points communs

6. Quelle récitation vous semble la plus correcte techniquement et pourquoi ?

PARTIE 5 : APPLICATION PRATIQUE

7. Récitez les versets suivants et identifiez TOUTES les règles de Tajwid qui s'y appliquent :

   إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ
   فَصَلِّ لِرَبِّكَ وَانْحَرْ
   إِنَّ شَانِئَكَ هُوَ الْأَبْتَرُ

8. Créez un guide annoté de ces versets montrant :
   - Les lettres emphatiques
   - Les Ghunnah
   - Les Madd et leurs durées
   - Les Idgham
   - Les Waqf possibles

PARTIE 6 : PROJET FINAL

9. Préparez un enregistrement de qualité de votre récitation favorite (minimum 5 versets) en appliquant toutes les règles.

10. Expliquez votre choix de sourate/versets et les défis rencontrés dans leur récitation.

PARTIE 7 : RÉFLEXION

11. Comment votre compréhension et pratique du Tajwid ont-elles évolué depuis le chapitre 1 ?

12. Quels sont vos objectifs pour continuer à améliorer votre Tajwid après ce cours ?

CONSIGNES :
- Ce devoir est complet et exige du temps
- La qualité prime sur la quantité
- Les enregistrements doivent être clairs et soignés
- L'analyse doit être approfondie`
    },
    {
      chapterId: 10,
      title: 'Devoir : Évaluation finale et certification',
      content: `FÉLICITATIONS ! Vous êtes arrivé au dernier devoir du module Tajwid.

Ce devoir final évalue l'ensemble de vos connaissances et compétences acquises.

PARTIE 1 : EXAMEN THÉORIQUE COMPLET (40 points)

Répondez à toutes les questions suivantes :

1. Définissez le Tajwid et expliquez son importance religieuse et linguistique. (5 points)

2. Citez et expliquez les 5 règles de Tajwid que vous considérez comme les plus fondamentales. (10 points)

3. Créez un glossaire des 20 termes techniques de Tajwid les plus importants avec leurs définitions. (10 points)

4. Expliquez comment les différentes règles de Tajwid interagissent entre elles dans la récitation. (5 points)

5. Quelles sont les ressources et méthodes que vous recommanderiez à quelqu'un qui débute l'apprentissage du Tajwid ? (5 points)

6. Analysez l'impact spirituel et psychologique d'une récitation correcte selon les règles du Tajwid. (5 points)

PARTIE 2 : EXAMEN PRATIQUE (40 points)

7. Enregistrez une récitation de 10 minutes minimum incluant :
   - Sourate Al-Fatiha (obligatoire)
   - Au moins 3 sourates courtes de votre choix
   - Les 10 premiers versets d'une sourate longue

   Votre récitation sera évaluée sur :
   - Application correcte des règles de Madd (10 points)
   - Application correcte de la Ghunnah (5 points)
   - Application correcte de l'Idgham et Iqlab (5 points)
   - Prononciation correcte des lettres emphatiques (5 points)
   - Respect des Waqf appropriés (5 points)
   - Fluidité et beauté de la récitation (10 points)

PARTIE 3 : ANALYSE CRITIQUE (20 points)

8. Choisissez un extrait de récitation d'un Qari professionnel (5-10 minutes) et :
   - Identifiez toutes les règles de Tajwid appliquées
   - Analysez la qualité de l'application
   - Proposez une critique constructive
   - Expliquez ce que vous avez appris de cette écoute

9. Comparez deux styles de récitation (par exemple, récitation rapide vs lente) et discutez de l'impact sur l'application des règles de Tajwid.

PARTIE 4 : PROJET PERSONNEL

10. Créez votre propre guide de référence rapide du Tajwid (2-3 pages) que vous pourrez utiliser dans votre pratique quotidienne. Ce guide doit inclure :
    - Les règles essentielles
    - Des exemples pratiques
    - Des conseils pour éviter les erreurs courantes
    - Des exercices de révision

PARTIE 5 : PLAN DE PROGRESSION

11. Établissez un plan détaillé pour continuer à améliorer votre Tajwid dans les 6 prochains mois :
    - Objectifs spécifiques et mesurables
    - Ressources nécessaires
    - Planning de pratique quotidienne/hebdomadaire
    - Méthodes d'auto-évaluation

PARTIE 6 : RÉFLEXION FINALE

12. Écrivez une réflexion personnelle (minimum 300 mots) sur :
    - Votre parcours dans ce module Tajwid
    - Les défis rencontrés et surmontés
    - Les moments de progrès marquants
    - L'impact de l'apprentissage du Tajwid sur votre pratique religieuse
    - Vos intentions pour l'avenir

CRITÈRES D'ÉVALUATION :

- Théorie : 40% (compréhension approfondie des concepts)
- Pratique : 40% (qualité de la récitation)
- Analyse et créativité : 20% (capacité d'analyse et d'innovation)

POUR OBTENIR LA CERTIFICATION :
- Score minimum : 70/100
- Récitation de qualité satisfaisante
- Projet personnel complet et soigné

CONSIGNES FINALES :
- Prenez votre temps pour ce devoir final
- La qualité et la profondeur sont essentielles
- Relisez et réécoutez vos productions avant de soumettre
- Ce devoir reflète l'ensemble de votre apprentissage
- Votre investissement dans ce devoir déterminera l'obtention de votre certification

Bonne chance ! Qu'Allah facilite votre apprentissage et votre pratique du Tajwid.`
    }
  ];

  for (const homework of tajwidHomeworks) {
    try {
      const existing = await prisma.tajwidHomework.findUnique({
        where: { chapterId: homework.chapterId }
      });

      if (existing) {
        console.log(`✅ Devoir Tajwid chapitre ${homework.chapterId} existe déjà`);
        continue;
      }

      await prisma.tajwidHomework.create({
        data: homework
      });

      console.log(`✅ Devoir Tajwid chapitre ${homework.chapterId} créé : ${homework.title}`);
    } catch (error) {
      console.error(`❌ Erreur création devoir chapitre ${homework.chapterId}:`, error);
    }
  }

  console.log('\n🎉 Seed des devoirs Tajwid terminé !');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
