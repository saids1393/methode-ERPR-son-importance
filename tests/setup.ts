import '@testing-library/jest-dom/vitest';
import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

// Import des types pour jest-dom
import './vitest.d.ts';

// Nettoie après chaque test
afterEach(() => {
  cleanup();
});

// Mock de l'objet global Date pour les tests de temps
vi.mock('date-fns', async () => {
  const actual = await vi.importActual('date-fns');
  return {
    ...actual,
  };
});
