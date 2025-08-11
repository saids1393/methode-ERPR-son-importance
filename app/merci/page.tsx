import React, { Suspense } from 'react';
import MerciClient from '@/app/components/merci/MerciClient';

export default function MerciPage() {
  return (
    <Suspense fallback={<div>Chargement....</div>}>
      <MerciClient />
    </Suspense>
  );
}