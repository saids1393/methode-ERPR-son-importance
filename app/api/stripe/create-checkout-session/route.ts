// app/api/stripe/create-checkout-session/route.ts
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export async function POST(req: Request) {
  try {
    const { email, paymentPlan, module } = await req.json();

    if (!email) {
      console.log("❌ Aucun email fourni");
      return NextResponse.json({ error: "Email requis" }, { status: 400 });
    }

    const baseUrl =
      process.env.NODE_ENV === "production"
        ? process.env.NEXTAUTH_URL
        : "http://localhost:6725";

    const normalizedModule = (module || 'LECTURE').toString().toUpperCase();

    console.log("🔵 CREATE CHECKOUT SESSION");
    console.log("📧 Email:", email);
    console.log("💳 Payment Plan:", paymentPlan);
    console.log("📦 Module:", normalizedModule);

    // 🚀 PAIEMENT EN 2X - Version corrigée (uniquement pour module LECTURE)
    if (paymentPlan === "2x" && normalizedModule !== 'TAJWID') {
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
          metadata: { paymentPlan: "2x", module: normalizedModule },
        });
      }

      console.log("👤 Customer:", customer.id);

      console.log("🎟️ Codes promo configurés pour paiement 2x");

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
        // 🔹 Permet aux clients de saisir un code promo
        allow_promotion_codes: true,
        success_url: `${baseUrl}/merci?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${baseUrl}/checkout`,
        metadata: { 
          email, 
          paymentPlan: "2x", 
          paymentNumber: "1",
          customerId: customer.id,
          module: normalizedModule,
        },
        // Sauvegarder la carte pour le 2ème paiement
        payment_intent_data: {
          setup_future_usage: "off_session",
          metadata: { paymentPlan: "2x", paymentNumber: "1", module: normalizedModule },
        },
      });

      console.log("✅ Session 2x créée (1/2):", session.id);

      // ⚠️ UNIQUEMENT EN LOCAL POUR TESTER
      if (process.env.NODE_ENV === "development") {
        console.log("🧪 [DEV ONLY] Simulation du 2e paiement dans 2 minutes...");

        const sessionToProcess = session;
        setTimeout(async () => {
          console.log("⏳ [DEV] Lancement du 2ème paiement...");
          try {
            const sessionData = await stripe.checkout.sessions.retrieve(sessionToProcess.id);
            const firstPaymentIntentId = sessionData.payment_intent as string;

            await fetch(`${baseUrl}/api/stripe/charge-second-payment`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.CRON_SECRET}`
              },
              body: JSON.stringify({
                customerId: customer.id,
                email: email,
                firstPaymentIntentId: firstPaymentIntentId
              }),
            });
          } catch (err) {
            console.error("❌ Erreur simulation 2ème paiement:", err);
          }
        }, 120000);
      } else {
        console.log("📌 [PROD] Le cron job Vercel s'en charge");
      }

      return NextResponse.json({ sessionId: session.id });
    }

    // 🚀 PAIEMENT UNIQUE 1x (LECTURE ou TAJWID)
    console.log("🎟️ Codes promo configurés pour paiement 1x");

    // Déterminer le produit et le montant
    let productName = "Méthode ERPR - Paiement 1x";
    let productDescription = normalizedModule === 'TAJWID' ? "Module Tajwid" : "Cours complet d'arabe";
    let unitAmount = 8900; // 89€ par défaut

    if (normalizedModule === 'TAJWID') {
      try {
        // Charger le prix du niveau Tajwid depuis la DB si disponible
        const { prisma } = await import('@/lib/prisma');
        const tajwidLevel = await prisma.level.findFirst({ where: { module: 'TAJWID' as any } });
        if (tajwidLevel?.price) {
          unitAmount = tajwidLevel.price * 100; // convertir en centimes
        } else {
          unitAmount = 2900; // fallback 29€ si non défini
        }
        productName = 'Module Tajwid';
      } catch (e) {
        unitAmount = 2900;
        productName = 'Module Tajwid';
      }
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: productName,
              description: productDescription,
            },
            unit_amount: unitAmount,
          },
          quantity: 1,
        },
      ],
      customer_email: email,
      // 🔹 Permet aux clients de saisir un code promo
      allow_promotion_codes: true,
      success_url: `${baseUrl}/merci?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/checkout?module=${normalizedModule.toLowerCase()}`,
      metadata: { email, paymentPlan: "1x", module: normalizedModule },
    });

    console.log("✅ Session 1x créée:", session.id);
    return NextResponse.json({ sessionId: session.id });
  } catch (error: any) {
    console.error("❌ Erreur création session:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}