// app/api/cron/process-second-payments/route.ts
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export async function GET(req: Request) {
  try {
    // Vérifier l'authentification (secret token)
    const authHeader = req.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("🔄 Exécution du cron - Traitement des paiements 2x...");

    // 📅 Chercher les 1ers paiements réussis depuis 30 jours
    const thirtyDaysInSeconds = 30 * 24 * 60 * 60; // 30 jours
    const thirtyDaysAgo = Math.floor(Date.now() / 1000) - thirtyDaysInSeconds;

    console.log(
      `📅 Recherche des paiements depuis ${new Date(
        thirtyDaysAgo * 1000
      ).toLocaleString()}`
    );

    // Récupérer tous les PaymentIntents créés dans les dernières 30 jours
    const paymentIntents = await stripe.paymentIntents.list({
      limit: 100,
      created: {
        gte: thirtyDaysAgo,
        lte: Math.floor(Date.now() / 1000),
      },
    });

    console.log(`📊 ${paymentIntents.data.length} paiements à vérifier`);

    const results = [];

    for (const pi of paymentIntents.data) {
      // Vérifier si c'est un 1er paiement 2x réussi
      if (
        pi.metadata?.paymentPlan === "2x" &&
        pi.metadata?.paymentNumber === "1" &&
        pi.status === "succeeded"
      ) {
        const customerId = pi.customer as string;
        const email = pi.metadata.email;

        console.log(`💳 Traitement du 2e paiement pour ${email}`);

        // Vérifier si le 2ème paiement a déjà été effectué
        const existingSecondPayments = await stripe.paymentIntents.list({
          customer: customerId,
          limit: 10,
        });

        const alreadyPaid = existingSecondPayments.data.some(
          (p) =>
            p.metadata?.paymentPlan === "2x" &&
            p.metadata?.paymentNumber === "2" &&
            p.status === "succeeded"
        );

        if (alreadyPaid) {
          console.log(`✅ ${email} : 2ème paiement déjà effectué, skip`);
          continue;
        }

        // Lancer le 2e paiement
        try {
          const baseUrl =
            process.env.NODE_ENV === "production"
              ? process.env.NEXTAUTH_URL
              : "http://localhost:3000";

          const response = await fetch(
            `${baseUrl}/api/stripe/charge-second-payment`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ customerId, email }),
            }
          );

          const result = await response.json();

          if (result.success) {
            console.log(`✅ 2ème paiement réussi pour ${email} : ${result.amount}€`);
            results.push({ email, status: "success", amount: result.amount });
          } else {
            console.error(`❌ Échec 2ème paiement pour ${email}:`, result.error);
            results.push({ email, status: "failed", error: result.error });
          }
        } catch (err: any) {
          console.error(`❌ Erreur lors du 2ème paiement pour ${email}:`, err.message);
          results.push({ email, status: "error", error: err.message });
        }
      }
    }

    console.log(`🎉 Cron terminé : ${results.length} paiements traités`);

    return NextResponse.json({
      success: true,
      processed: results.length,
      results,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("❌ Erreur cron job:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Pour tests manuels en développement
export async function POST(req: Request) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { error: "POST not allowed in production" },
      { status: 405 }
    );
  }
  return GET(req);
}