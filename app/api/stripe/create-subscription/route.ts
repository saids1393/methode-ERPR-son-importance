// app/api/stripe/create-subscription/route.ts
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export async function POST(req: Request) {
  try {
    const { email, plan } = await req.json();

    // Email est maintenant optionnel - Stripe le récupérera dans son formulaire
    if (!plan || !['SOLO', 'COACHING'].includes(plan)) {
      console.log("❌ Plan invalide:", plan);
      return NextResponse.json({ error: "Plan invalide" }, { status: 400 });
    }

    const baseUrl =
      process.env.NODE_ENV === "production"
        ? process.env.NEXTAUTH_URL
        : "http://localhost:3000";

    console.log("🔵 CREATE SUBSCRIPTION SESSION");
    console.log("📧 Email:", email || '(sera demandé par Stripe)');
    console.log("📦 Plan:", plan);

    // Déterminer le Price ID selon le plan
    let priceId: string;
    let planName: string;

    if (plan === 'SOLO') {
      priceId = process.env.PLAN_SOLO_MONTHLY_PRICE_ID!;
      planName = 'Plan Solo';
    } else {
      priceId = process.env.PLAN_COACHING_MONTHLY_PRICE_ID!;
      planName = 'Plan Coaching';
    }

    if (!priceId) {
      console.error("❌ Price ID non configuré pour le plan:", plan);
      return NextResponse.json({ 
        error: "Configuration du plan manquante. Contactez le support." 
      }, { status: 500 });
    }

    // Si email fourni, créer ou récupérer le client Stripe
    let customerId: string | undefined;
    
    if (email) {
      let customer;
      const existingCustomers = await stripe.customers.list({
        email: email,
        limit: 1,
      });

      if (existingCustomers.data.length > 0) {
        customer = existingCustomers.data[0];
        console.log("👤 Client existant:", customer.id);
      } else {
        customer = await stripe.customers.create({
          email: email,
          metadata: { 
            plan: plan,
            source: 'checkout_page'
          },
        });
        console.log("👤 Nouveau client créé:", customer.id);
      }
      customerId = customer.id;
    }

    // Créer la session de checkout pour un abonnement
    const sessionConfig: any = {
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      allow_promotion_codes: true,
      success_url: `${baseUrl}/merci?session_id={CHECKOUT_SESSION_ID}&subscription=true`,
      cancel_url: `${baseUrl}/checkout?plan=${plan.toLowerCase()}`,
      metadata: { 
        plan,
      },
      subscription_data: {
        metadata: {
          plan,
        }
      }
    };

    // Si on a un customer, l'utiliser, sinon Stripe créera un customer automatiquement
    // (pour le mode subscription, Stripe demande l'email et crée le customer)
    if (customerId) {
      sessionConfig.customer = customerId;
      sessionConfig.metadata.email = email;
      sessionConfig.subscription_data.metadata.email = email;
    }
    // Pas besoin de customer_creation pour subscription mode - Stripe gère automatiquement

    const session = await stripe.checkout.sessions.create(sessionConfig);

    console.log("✅ Session d'abonnement créée:", session.id);
    return NextResponse.json({ sessionId: session.id });

  } catch (error: any) {
    console.error("❌ Erreur création session:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
