// app/api/stripe/charge-second-payment/route.ts (VERSION AVEC LOGS COMPLETS)
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma"; // ✅ Import correct

export async function POST(req: Request) {
  try {
    // 🔐 DEBUG AUTH - TRÈS DÉTAILLÉ
    const authHeader = req.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;
    
    console.log("🔐 === DEBUG AUTH charge-second-payment START ===");
    console.log("   authHeader reçu:", authHeader ? authHeader.substring(0, 30) + "..." : "NULL");
    console.log("   CRON_SECRET env:", cronSecret ? cronSecret.substring(0, 30) + "..." : "NULL");
    console.log("   CRON_SECRET existe:", !!cronSecret);
    console.log("   authHeader existe:", !!authHeader);
    
    const expectedBearer = `Bearer ${cronSecret}`;
    console.log("   expectedBearer:", expectedBearer ? expectedBearer.substring(0, 30) + "..." : "NULL");
    console.log("   Match exact:", authHeader === expectedBearer);
    
    // Debug caractère par caractère si pas de match
    if (authHeader !== expectedBearer) {
      console.log("   ❌ MISMATCH DÉTECTÉ!");
      if (authHeader && expectedBearer) {
        console.log("   authHeader length:", authHeader.length);
        console.log("   expectedBearer length:", expectedBearer.length);
        console.log("   authHeader chars:", authHeader.split('').map((c, i) => `${i}:${c.charCodeAt(0)}`).join(", "));
        console.log("   expectedBearer chars:", expectedBearer.split('').map((c, i) => `${i}:${c.charCodeAt(0)}`).join(", "));
      }
    }
    console.log("🔐 === DEBUG AUTH charge-second-payment END ===\n");
    
    // ✅ AJOUTER L'AUTHENTIFICATION (CRITIQUE!)
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      console.error("❌ AUTHENTIFICATION ÉCHOUÉE à charge-second-payment");
      console.error("   Reçu:", authHeader);
      console.error("   Attendu:", `Bearer ${process.env.CRON_SECRET}`);
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("✅ AUTHENTIFICATION RÉUSSIE à charge-second-payment\n");

    // 📦 Parse le body
    console.log("📦 Parsing du body...");
    const { customerId, email, firstPaymentIntentId, recordId } = await req.json();
    console.log("   customerId:", customerId);
    console.log("   email:", email);
    console.log("   firstPaymentIntentId:", firstPaymentIntentId);
    console.log("   recordId:", recordId);

    if (!customerId || !firstPaymentIntentId) {
      console.error("❌ Paramètres manquants");
      return NextResponse.json(
        { error: "customerId et firstPaymentIntentId requis" },
        { status: 400 }
      );
    }

    console.log("🔹 Tentative de 2ème paiement pour customer:", customerId);

    // ✅ VÉRIFICATION DB SUPPLÉMENTAIRE (en cas d'appel simultané)
    console.log("\n🔍 Vérification DB du record...");
    const dbRecord = await prisma.secondPayment.findUnique({
      where: { firstPaymentIntentId },
    });
    console.log("   dbRecord trouvé:", !!dbRecord);
    if (dbRecord) {
      console.log("   Status:", dbRecord.status);
      console.log("   ID:", dbRecord.id);
    }

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
    console.log("\n💰 Récupération des sessions de paiement...");
    const sessions = await stripe.checkout.sessions.list({
      customer: customerId,
      limit: 1,
    });
    console.log("   Sessions trouvées:", sessions.data.length);

    let amountToCharge = 4450; // Montant par défaut (44,50€)

    if (sessions.data.length > 0) {
      const lastSession = sessions.data[0];
      console.log("   Dernière session ID:", lastSession.id);

      if (lastSession.payment_intent) {
        console.log("   Payment intent trouvé:", lastSession.payment_intent);
        try {
          const paymentIntent = await stripe.paymentIntents.retrieve(
            lastSession.payment_intent as string
          );

          amountToCharge = paymentIntent.amount;
          console.log("   ✅ Montant du 1er paiement récupéré:", amountToCharge / 100, "€");
        } catch (stripeErr: any) {
          console.error("   ❌ Erreur Stripe lors de la récupération du payment intent:", stripeErr.message);
        }
      }
    }

    console.log("   Montant à charger:", amountToCharge / 100, "€");

    // Récupérer le moyen de paiement par défaut du client
    console.log("\n💳 Récupération des moyens de paiement...");
    const paymentMethods = await stripe.paymentMethods.list({
      customer: customerId,
      type: "card",
      limit: 1,
    });
    console.log("   Moyens de paiement trouvés:", paymentMethods.data.length);

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
    console.log("   ✅ Moyen de paiement sélectionné:", paymentMethod.id);

    // Créer le Payment Intent pour le 2ème paiement
    console.log("\n📤 Création du Payment Intent...");
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

    console.log("   ✅ Payment Intent créé:", paymentIntent.id);
    console.log("   💰 Montant:", paymentIntent.amount / 100, "€");
    console.log("   📊 Statut:", paymentIntent.status);

    // Mise à jour DB
    console.log("\n💾 Mise à jour de la DB...");
    if (recordId) {
      try {
        const updated = await prisma.secondPayment.update({
          where: { id: recordId },
          data: {
            status: "COMPLETED",
            secondPaymentIntentId: paymentIntent.id,
            updatedAt: new Date(),
          },
        });
        console.log("   ✅ SecondPayment mis à jour avec recordId");
      } catch (dbErr: any) {
        console.error("   ❌ Erreur mise à jour SecondPayment:", dbErr.message);
      }
    } else if (firstPaymentIntentId) {
      try {
        const updated = await prisma.secondPayment.updateMany({
          where: {
            firstPaymentIntentId: firstPaymentIntentId,
            status: { in: ['PENDING', 'PROCESSING'] }
          },
          data: {
            status: "COMPLETED",
            secondPaymentIntentId: paymentIntent.id,
          },
        });
        console.log("   ✅ SecondPayment mis à jour via firstPaymentIntentId (count:", updated.count + ")");
      } catch (dbErr: any) {
        console.error("   ❌ Erreur mise à jour SecondPayment:", dbErr.message);
      }
    }

    console.log("\n✅ ✅ 2ème PAIEMENT RÉUSSI ✅ ✅\n");

    return NextResponse.json({
      success: true,
      paymentIntentId: paymentIntent.id,
      amount: paymentIntent.amount / 100,
      status: paymentIntent.status,
    });
  } catch (err: any) {
    console.error("\n❌ ❌ ERREUR EXCEPTION ❌ ❌");
    console.error("   Message:", err.message);
    console.error("   Type:", err.type);
    console.error("   Code:", err.code);
    console.error("   Stack:", err.stack);

    if (err.type === "StripeCardError") {
      console.error("   ❌ Carte refusée:", err.code);
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