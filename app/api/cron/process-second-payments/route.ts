// app/api/cron/process-second-payments/route.ts (VERSION SÉCURISÉE - FINAL)
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma"; // ✅ Import correct

export async function GET(req: Request) {
  try {
    // Vérifier l'authentification (secret token)
    const authHeader = req.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("🔄 Exécution du cron - Traitement des paiements 2x...");

    // 📅 Chercher les 1ers paiements réussis depuis 30 jours
    const thirtyDaysInSeconds = 30 * 24 * 60 * 60;
    const thirtyDaysAgo = Math.floor(Date.now() / 1000) - thirtyDaysInSeconds;

    const paymentIntents = await stripe.paymentIntents.list({
      limit: 100,
      created: {
        gte: thirtyDaysAgo,
        lte: Math.floor(Date.now() / 1000),
      },
    });

    console.log(`📊 ${paymentIntents.data.length} paiements à vérifier`);

    const results: Array<{
      email: string;
      status: "success" | "failed" | "error";
      amount?: number;
      error?: string;
    }> = [];

    for (const pi of paymentIntents.data) {
      // Vérifier si c'est un 1er paiement 2x réussi
      if (
        pi.metadata?.paymentPlan === "2x" &&
        pi.metadata?.paymentNumber === "1" &&
        pi.status === "succeeded"
      ) {
        const customerId = pi.customer as string;
        const email = (pi.metadata?.email as string) || "unknown";
        const firstPaymentTime = pi.created || 0;

        // ✅ VÉRIFIER QUE 30 JOURS SONT BIEN PASSÉS
        const paymentAgeInSeconds = Math.floor(Date.now() / 1000) - firstPaymentTime;
        const thirtyDaysInSeconds = 30 * 24 * 60 * 60;

        if (paymentAgeInSeconds < thirtyDaysInSeconds) {
          console.log(
            `⏳ ${email} : Pas encore 30 jours (${Math.floor(paymentAgeInSeconds / 86400)} jours), skip`
          );
          continue;
        }

        console.log(`💳 Vérification du 2e paiement pour ${email}`);

        try {
          // ✅ ÉTAPE 1: VÉRIFIER DANS LA DB (source de vérité)
          const existingRecord = await prisma.secondPayment.findUnique({
            where: { firstPaymentIntentId: pi.id },
          });

          if (existingRecord) {
            console.log(
              `✅ ${email} : Entrée DB trouvée (status: ${existingRecord.status})`
            );

            if (existingRecord.status === "COMPLETED") {
              console.log(`✅ ${email} : 2ème paiement déjà complété, skip`);
              continue;
            }

            if (existingRecord.status === "PROCESSING") {
              console.log(
                `⏳ ${email} : 2ème paiement en cours de traitement, skip (évite race condition)`
              );
              continue;
            }

            if (existingRecord.status === "FAILED" && existingRecord.retryCount >= 3) {
              console.log(
                `❌ ${email} : 2ème paiement échoué 3 fois déjà, skip`
              );
              continue;
            }
          }

          // ✅ ÉTAPE 2: CRÉER UNE ENTRÉE "PROCESSING" DE MANIÈRE ATOMIQUE
          const processingRecord = await prisma.secondPayment.upsert({
            where: { firstPaymentIntentId: pi.id },
            update: {
              status: "PROCESSING",
              updatedAt: new Date(),
            },
            create: {
              customerId,
              firstPaymentIntentId: pi.id,
              status: "PROCESSING",
              retryCount: (existingRecord?.retryCount || 0) + 1,
            },
          });

          console.log(`📝 Entrée DB créée avec status="PROCESSING"`);

          // ✅ ÉTAPE 3: LANCER LE 2E PAIEMENT
          const baseUrl =
            process.env.NODE_ENV === "production"
              ? process.env.NEXTAUTH_URL
              : "http://localhost:3000";

          const response = await fetch(
            `${baseUrl}/api/stripe/charge-second-payment`,
            {
              method: "POST",
              headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.CRON_SECRET}`, // ✅ AUTH!
              },
              body: JSON.stringify({ 
                customerId, 
                email, 
                firstPaymentIntentId: pi.id,
                recordId: processingRecord.id, // ✅ Passer l'ID du record
              }),
            }
          );

          const result = await response.json();

          if (result.success) {
            console.log(`✅ 2ème paiement réussi pour ${email} : ${result.amount}€`);

            // ✅ ÉTAPE 4: MARQUER COMME COMPLETED
            await prisma.secondPayment.update({
              where: { id: processingRecord.id },
              data: {
                status: "COMPLETED",
                secondPaymentIntentId: result.paymentIntentId,
                updatedAt: new Date(),
              },
            });

            results.push({ email, status: "success", amount: result.amount });
          } else {
            console.error(`❌ Échec 2ème paiement pour ${email}:`, result.error);

            // ✅ ÉTAPE 4: MARQUER COMME FAILED (avec retry)
            await prisma.secondPayment.update({
              where: { id: processingRecord.id },
              data: {
                status: "FAILED",
                errorMessage: result.error,
                updatedAt: new Date(),
              },
            });

            results.push({ email, status: "failed", error: result.error });
          }
        } catch (err: any) {
          console.error(`❌ Erreur lors du 2ème paiement pour ${email}:`, err.message);

          // ✅ ÉTAPE 4: MARQUER COMME ERREUR
          try {
            await prisma.secondPayment.update({
              where: { firstPaymentIntentId: pi.id },
              data: {
                status: "FAILED",
                errorMessage: err.message,
                updatedAt: new Date(),
              },
            });
          } catch (dbErr) {
            console.error("❌ Erreur lors de la mise à jour DB:", dbErr);
          }

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

export async function POST(req: Request) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { error: "POST not allowed in production" },
      { status: 405 }
    );
  }
  return GET(req);
}