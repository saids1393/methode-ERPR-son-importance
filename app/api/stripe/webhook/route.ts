import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export async function POST(req: Request) {
  try {
    const { email, paymentPlan } = await req.json();

    if (!email) {
      console.log("❌ Aucun email fourni");
      return NextResponse.json({ error: "Email requis" }, { status: 400 });
    }

    const baseUrl =
      process.env.NODE_ENV === "production"
        ? process.env.NEXTAUTH_URL
        : "http://localhost:6725";

    console.log("🔵 CREATE CHECKOUT SESSION");
    console.log("📧 Email:", email);
    console.log("💳 Payment Plan:", paymentPlan);

    // 🚀 PAIEMENT EN 2X
    if (paymentPlan === "2x") {
      // Créer ou récupérer le client Stripe
      let customer;
      const existingCustomers = await stripe.customers.list({
        email: email,
        limit: 1,
      });

      if (existingCustomers.data.length > 0) {
        customer = existingCustomers.data[0];
      } else {
        customer = await stripe.customers.create({
          email: email,
          metadata: { paymentPlan: "2x" },
        });
      }

      console.log("👤 Customer:", customer.id);

      // Session pour le 1er paiement (44,50€)
      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "eur",
              product_data: {
                name: "Méthode ERPR - 1er paiement (1/2)",
                description: "Premier versement du paiement en 2 fois",
              },
              unit_amount: 4450, // 44,50€
            },
            quantity: 1,
          },
        ],
        customer: customer.id,
        success_url: `${baseUrl}/merci?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${baseUrl}/checkout`,
        metadata: { 
          email, 
          paymentPlan: "2x", 
          paymentNumber: "1",
          customerId: customer.id 
        },
        // Sauvegarder la carte pour le 2ème paiement
        payment_intent_data: {
          setup_future_usage: "off_session",
          metadata: { 
            paymentPlan: "2x", 
            paymentNumber: "1",
            email: email
          },
        },
      });

      console.log("✅ Session 2x créée (1/2):", session.id);
      console.log("📅 Le 2ème paiement sera traité automatiquement dans 30 jours par le cron job");

      return NextResponse.json({ sessionId: session.id });
    }

    // 🚀 PAIEMENT UNIQUE 1x
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: "Méthode ERPR - Paiement 1x",
              description: "Cours complet d'arabe",
            },
            unit_amount: 8900,
          },
          quantity: 1,
        },
      ],
      customer_email: email,
      success_url: `${baseUrl}/merci?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/checkout`,
      metadata: { email, paymentPlan: "1x" },
    });

    console.log("✅ Session 1x créée:", session.id);
    return NextResponse.json({ sessionId: session.id });
  } catch (error: any) {
    console.error("❌ Erreur création session:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}