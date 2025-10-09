//app/api/stripe/charge-second-payment/route.ts
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export async function POST(req: Request) {
  try {
    const { customerId, email } = await req.json();

    if (!customerId) {
      return NextResponse.json({ error: "customerId requis" }, { status: 400 });
    }

    console.log("🔹 Tentative de 2ème paiement pour customer:", customerId);

    // 🔍 Récupérer la dernière session de paiement pour trouver le montant
    const sessions = await stripe.checkout.sessions.list({
      customer: customerId,
      limit: 1,
    });

    let amountToCharge = 4450; // Montant par défaut (44,50€)

    if (sessions.data.length > 0) {
      const lastSession = sessions.data[0];
      
      // Récupérer le Payment Intent de la session
      if (lastSession.payment_intent) {
        const paymentIntent = await stripe.paymentIntents.retrieve(
          lastSession.payment_intent as string
        );
        
        // Utiliser le même montant que le 1er paiement
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
      return NextResponse.json(
        { error: "Aucun moyen de paiement sauvegardé" },
        { status: 404 }
      );
    }

    const paymentMethod = paymentMethods.data[0];
    console.log("💳 Moyen de paiement trouvé:", paymentMethod.id);

    // Créer le Payment Intent pour le 2ème paiement avec le même montant
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountToCharge, // Même montant que le 1er paiement
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
    
    // Si la carte est refusée, logger l'erreur
    if (err.type === "StripeCardError") {
      console.error("❌ Carte refusée:", err.code);
    }

    return NextResponse.json(
      { error: err.message || "Erreur lors du 2ème paiement" },
      { status: 500 }
    );
  }
}