// lib/promo-config.ts
// Configuration centralisée de tous les coupons de réduction

export interface PromoCode {
  id: string; // ID Stripe du promotion code
  name: string; // Nom affiché
  description: string; // Description
  validFor: "1x" | "2x" | "both"; // Pour quel type de paiement
  active: boolean; // Actif ou non
}

export const PROMO_CODES: PromoCode[] = [
  {
    id: "promo_1SOk35GYlym3LEYwTDHGsLsz", // Code: ERPRMETHODE9113061393
    name: "Réduction 30€",
    description: "30€ de réduction sur le paiement 1x",
    validFor: "1x",
    active: true,
  },
  {
    id: "promo_1SOk4RGYlym3LEYwggrRoow1", // Code: ERPRx2
    name: "Réduction 15€ (2x)",
    description: "15€ de réduction sur chaque paiement (paiement 2x)",
    validFor: "2x",
    active: true,
  },
  {
    id: "promo_1SOj5CGYlym3LEYwwE9745Yr", 
    name: "Offre de lancement 15%",
    description: "15% de réduction - Offre de lancement",
    validFor: "both", 
    active: true,
  },

  {
    id: "promo_1SOyihGYlym3LEYwnsuXmLKu",
    name: "test",
    description: "100% de réduction",
    validFor: "both",
    active: true,
  },
    {
    id: "promo_1SOz46GYlym3LEYw7EucdoBb",
    name: "testb",
    description: "90% de réduction",
    validFor: "both",
    active: true,
  },
      {
    id: "promo_1SOzLWGYlym3LEYw8yfeBNHI",
    name: "testc",
    description: "99% de réduction",
    validFor: "both",
    active: true,
  },
];

/**
 * Récupère les codes promo valides pour un type de paiement
 */
export function getValidPromoCodes(paymentPlan: "1x" | "2x"): PromoCode[] {
  return PROMO_CODES.filter(
    (promo) =>
      promo.active &&
      (promo.validFor === paymentPlan || promo.validFor === "both")
  );
}

/**
 * Récupère les IDs des codes promo valides pour Stripe
 */
export function getPromoCodeIds(paymentPlan: "1x" | "2x"): string[] {
  return getValidPromoCodes(paymentPlan).map((promo) => promo.id);
}