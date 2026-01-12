import { notFound } from 'next/navigation';
import AutoProgressWrapper from '@/app/components/AutoProgressWrapper';
import {
  Introduction1,
  Introduction2,
  Introduction3,
  Introduction4,
  Introduction5,
  Introduction6,
  Introduction7,
  Introduction8,
} from '@/app/components/chapitres-tajwid/syntheses';

type Props = {
  params: Promise<{ chapitres: string }>;
};

// Mapping des composants d'introduction par numéro de chapitre
const introductionComponents: { [key: number]: React.ComponentType } = {
  1: Introduction1,
  2: Introduction2,
  3: Introduction3,
  4: Introduction4,
  5: Introduction5,
  6: Introduction6,
  7: Introduction7,
  8: Introduction8,
};

export default async function IntroductionTajwidPage({ params }: Props) {
  const resolvedParams = await params;
  const chapNum = parseInt(resolvedParams.chapitres, 10);

  // Vérifier que le chapitre existe (1-8)
  if (isNaN(chapNum) || chapNum < 1 || chapNum > 8) {
    return notFound();
  }

  const IntroductionComponent = introductionComponents[chapNum];

  if (!IntroductionComponent) {
    return notFound();
  }

  return (
    <AutoProgressWrapper>
      <IntroductionComponent />
    </AutoProgressWrapper>
  );
}
