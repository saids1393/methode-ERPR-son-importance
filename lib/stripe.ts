// lib/stripe.ts

import Stripe from 'stripe';

// Assurez-vous d'avoir STRIPE_SECRET_KEY dans .env
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not defined');
}

// 🔧 Utiliser la version d’API attendue par les types (corrige l'erreur)
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-06-30.basil',
  typescript: true,
});
