// app/api/stripe/charge-second-payment/route.ts (VERSION SÉCURISÉE - FINAL)
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma"; // ✅ Import correct

export async function POST(req: Request) {
  try {
    // ✅ AJOUTER L'AUTHENTIFICATION (CRITIQUE!)
    const authHeader = req.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      console.error("❌ Tentative d'accès non autorisé à charge-second-payment");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { customerId, email, firstPaymentIntentId, recordId } = await req.json();

    if (!customerId || !firstPaymentIntentId) {
      return NextResponse.json(
        { error: "customerId et firstPaymentIntentId requis" },
        { status: 400 }
      );
    }

    console.log("🔹 Tentative de 2ème paiement pour customer:", customerId);

    // ✅ VÉRIFICATION DB SUPPLÉMENTAIRE (en cas d'appel simultané)
    const dbRecord = await prisma.secondPayment.findUnique({
      where: { firstPaymentIntentId },
    });

    if (dbRecord?.status === "COMPLETED") {
      console.log(`⚠️ ${email} : 2ème paiement déjà complété (DB check)`);
      return NextResponse.json({
        success: true, // Retourner "success" pour ne pas retry
        paymentIntentId: dbRecord.secondPaymentIntentId,
        amount: 44.50, // ⚠️ À améliorer
        message: "Paiement déjà complété",
      });
    }

    if (dbRecord?.status === "PROCESSING") {
      console.log(`⏳ ${email} : 2ème paiement déjà en cours`);
      return NextResponse.json({
        success: false,
        error: "Paiement déjà en cours de traitement",
      });
    }

    // 🔍 Récupérer la dernière session de paiement pour trouver le montant
    const sessions = await stripe.checkout.sessions.list({
      customer: customerId,
      limit: 1,
    });

    let amountToCharge = 4450; // Montant par défaut (44,50€)

    if (sessions.data.length > 0) {
      const lastSession = sessions.data[0];

      if (lastSession.payment_intent) {
        const paymentIntent = await stripe.paymentIntents.retrieve(
          lastSession.payment_intent as string
        );

        amountToCharge = paymentIntent.amount;
        console.log("💰 Montant du 1er paiement récupéré:", amountToCharge / 100, "€");
      }
    }

    // Récupérer le moyen de paiement par défaut du client
    const paymentMethods = await stripe.paymentMethods.list({
      customer: customerId,
      type: "card",
      limit: 1,
    });

    if (paymentMethods.data.length === 0) {
      console.error("❌ Aucun moyen de paiement trouvé pour ce client");

      // ✅ Marquer comme failed dans la DB
      if (recordId) {
        await prisma.secondPayment.update({
          where: { id: recordId },
          data: {
            status: "FAILED",
            errorMessage: "Aucun moyen de paiement trouvé",
            updatedAt: new Date(),
          },
        });
      }

      return NextResponse.json(
        { error: "Aucun moyen de paiement sauvegardé" },
        { status: 404 }
      );
    }

    const paymentMethod = paymentMethods.data[0];
    console.log("💳 Moyen de paiement trouvé:", paymentMethod.id);

    // Créer le Payment Intent pour le 2ème paiement
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountToCharge,
      currency: "eur",
      customer: customerId,
      payment_method: paymentMethod.id,
      off_session: true,
      confirm: true,
      description: "Méthode ERPR - 2ème paiement (2/2)",
      metadata: {
        email: email,
        paymentPlan: "2x",
        paymentNumber: "2",
        firstPaymentIntentId: firstPaymentIntentId,
      },
    });

    console.log("✅ 2ème paiement effectué:", paymentIntent.id);
    console.log("💰 Montant:", paymentIntent.amount / 100, "€");
    console.log("📊 Statut:", paymentIntent.status);

    return NextResponse.json({
      success: true,
      paymentIntentId: paymentIntent.id,
      amount: paymentIntent.amount / 100,
      status: paymentIntent.status,
    });
  } catch (err: any) {
    console.error("❌ Erreur 2ème paiement:", err.message);

    if (err.type === "StripeCardError") {
      console.error("❌ Carte refusée:", err.code);
      return NextResponse.json(
        { error: `Carte refusée: ${err.code}` },
        { status: 402 }
      );
    }

    return NextResponse.json(
      { error: err.message || "Erreur lors du 2ème paiement" },
      { status: 500 }
    );
  }
}