// app/api/cron/process-second-payments/route.ts (VERSION AVEC LOGS DE DEBUG)
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma"; // ✅ Import correct

export async function GET(req: Request) {
  try {
    // Vérifier l'authentification (secret token)
    const authHeader = req.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;
    
    console.log("🔐 === DEBUG AUTH CRON ===");
    console.log("   Header reçu:", authHeader ? authHeader.substring(0, 20) + "..." : "NULL");
    console.log("   Secret attendu:", cronSecret ? cronSecret.substring(0, 20) + "..." : "NULL");
    console.log("   NODE_ENV:", process.env.NODE_ENV);
    console.log("   Match:", authHeader === `Bearer ${cronSecret}`);
    console.log("🔐 === FIN DEBUG AUTH ===");
    
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      console.error("❌ AUTH ÉCHOUÉE - Unauthorized");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("✅ AUTH CRON réussie !");
    console.log("🔄 Exécution du cron - Traitement des paiements 2x...");

    // 📅 Calculer la date limite (30 jours en arrière)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // ✅ CHERCHER UNIQUEMENT dans SecondPayment (source de vérité)
    const pendingPayments = await prisma.secondPayment.findMany({
      where: {
        status: 'PENDING',
        createdAt: {
          lte: thirtyDaysAgo, // Créé il y a 30 jours ou plus
        },
      },
    });

    console.log(`📊 ${pendingPayments.length} paiements 2x à traiter (>30 jours)`);

    const results: Array<{
      customerId: string;
      status: "success" | "failed" | "error";
      amount?: number;
      error?: string;
    }> = [];

    for (const payment of pendingPayments) {
      console.log(`💳 Traitement du 2e paiement pour customer ${payment.customerId}`);

      try {
        // ✅ MARQUER COMME "PROCESSING"
        await prisma.secondPayment.update({
          where: { id: payment.id },
          data: {
            status: "PROCESSING",
            retryCount: payment.retryCount + 1,
          },
        });

        // ✅ RÉCUPÉRER LE PAYMENT INTENT ORIGINAL
        const originalPaymentIntent = await stripe.paymentIntents.retrieve(
          payment.firstPaymentIntentId
        );

        const email = originalPaymentIntent.metadata?.email || 'unknown';
        console.log(`   Email: ${email}`);

        // ✅ LANCER LE 2E PAIEMENT
        const baseUrl =
          process.env.NODE_ENV === "production"
            ? process.env.NEXTAUTH_URL
            : "http://localhost:3000";

        console.log(`📤 Envoi requête à: ${baseUrl}/api/stripe/charge-second-payment`);
        
        const bearerToken = `Bearer ${process.env.CRON_SECRET}`;
        console.log(`🔑 Bearer token envoyé: ${bearerToken.substring(0, 20)}...`);

        const response = await fetch(
          `${baseUrl}/api/stripe/charge-second-payment`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": bearerToken,
            },
            body: JSON.stringify({
              customerId: payment.customerId,
              email,
              firstPaymentIntentId: payment.firstPaymentIntentId,
              recordId: payment.id,
            }),
          }
        );

        console.log(`📥 Réponse status: ${response.status}`);
        
        const result = await response.json();
        console.log(`📥 Réponse body:`, result);

        if (result.success) {
          console.log(`✅ 2ème paiement réussi : ${result.amount}€`);

          await prisma.secondPayment.update({
            where: { id: payment.id },
            data: {
              status: "COMPLETED",
              secondPaymentIntentId: result.paymentIntentId,
            },
          });

          results.push({
            customerId: payment.customerId,
            status: "success",
            amount: result.amount
          });
        } else {
          console.error(`❌ Échec 2ème paiement:`, result.error);

          await prisma.secondPayment.update({
            where: { id: payment.id },
            data: {
              status: "FAILED",
              errorMessage: result.error,
            },
          });

          results.push({
            customerId: payment.customerId,
            status: "failed",
            error: result.error
          });
        }
      } catch (err: any) {
        console.error(`❌ Erreur:`, err.message);

        try {
          await prisma.secondPayment.update({
            where: { id: payment.id },
            data: {
              status: "FAILED",
              errorMessage: err.message,
            },
          });
        } catch (dbErr) {
          console.error("❌ Erreur mise à jour DB:", dbErr);
        }

        results.push({
          customerId: payment.customerId,
          status: "error",
          error: err.message
        });
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