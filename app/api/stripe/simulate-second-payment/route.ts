import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export async function POST(req: Request) {
  try {
    const { sessionId } = await req.json();
    if (!sessionId) {
      return NextResponse.json({ error: "sessionId requis" }, { status: 400 });
    }

    console.log("🔹 Simulation du 2e paiement pour session:", sessionId);

    // Récupérer la session Checkout
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (!session.subscription) {
      console.error("❌ Subscription non trouvée pour la session");
      return NextResponse.json({ error: "Subscription non trouvée" }, { status: 404 });
    }

    // Récupérer la subscription
    const subscription = await stripe.subscriptions.retrieve(session.subscription.toString());
    console.log("🔹 Subscription trouvée:", subscription.id);

    // Récupérer la première facture ouverte
    let invoices = await stripe.invoices.list({
      subscription: subscription.id,
      limit: 1,
      status: "open",
    });

    let invoice = invoices.data[0];

    // Si aucune facture ouverte, en créer une nouvelle factice
    if (!invoice) {
      console.log("⚠️ Aucune facture ouverte, création d'une facture factice...");
      invoice = await stripe.invoices.create({
        customer: subscription.customer as string,
        subscription: subscription.id,
        auto_advance: true, // finalise la facture immédiatement
      });
    }

    if (!invoice.id) {
      console.error("❌ Facture invalide ou sans ID");
      return NextResponse.json({ error: "Facture invalide ou sans ID" }, { status: 400 });
    }

    // Payer la facture
    const paidInvoice = await stripe.invoices.pay(invoice.id);
    console.log("✅ Facture simulée payée:", paidInvoice.id);

    // Vérifier combien de paiements ont été effectués
    const allInvoices = await stripe.invoices.list({
      subscription: subscription.id,
      status: "paid",
      limit: 100,
    });
    const count = allInvoices.data.length;

    // Annuler la subscription si 2 paiements pour le plan 2x
    if (subscription.metadata?.paymentPlan === "2x" && count >= 2) {
      await stripe.subscriptions.cancel(subscription.id);
      console.log("🎉 Subscription 2x terminée - 2 paiements complétés");
    } else {
      console.log(`💰 Paiement ${count}/2 effectué pour subscription ${subscription.id}`);
    }

    return NextResponse.json({ success: true, invoiceId: paidInvoice.id });
  } catch (err: any) {
    console.error("❌ Erreur simulate-second-payment:", err);
    return NextResponse.json({ error: err.message || "Erreur interne" }, { status: 500 });
  }
}
