import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("🔍 Recherche des paiements 2x manquants...");

    const sessions = await stripe.checkout.sessions.list({
      limit: 100,
    });

    const results = {
      found: 0,
      created: 0,
      skipped: 0,
      errors: [] as string[],
    };

    for (const session of sessions.data) {
      if (
        session.metadata?.paymentPlan === "2x" &&
        session.metadata?.paymentNumber === "1" &&
        session.payment_status === "paid"
      ) {
        results.found++;

        const customerId = session.customer as string;
        const paymentIntentId = session.payment_intent as string;
        const email = session.metadata.email || session.customer_email;

        if (!customerId || !paymentIntentId) {
          results.errors.push(`Session ${session.id}: missing customer or payment_intent`);
          continue;
        }

        try {
          const existing = await prisma.secondPayment.findUnique({
            where: { firstPaymentIntentId: paymentIntentId },
          });

          if (!existing) {
            await prisma.secondPayment.create({
              data: {
                customerId,
                firstPaymentIntentId: paymentIntentId,
                status: "PENDING",
              },
            });

            console.log(`✅ Créé SecondPayment pour ${email} (${paymentIntentId})`);
            results.created++;
          } else {
            console.log(`⏭️ Déjà existant pour ${email}`);
            results.skipped++;
          }
        } catch (err: any) {
          const errorMsg = `Error for ${email}: ${err.message}`;
          console.error(`❌ ${errorMsg}`);
          results.errors.push(errorMsg);
        }
      }
    }

    console.log(`
📊 Résultats:
   - Paiements 2x trouvés: ${results.found}
   - Entrées créées: ${results.created}
   - Déjà existantes: ${results.skipped}
   - Erreurs: ${results.errors.length}
    `);

    return NextResponse.json({
      success: true,
      ...results,
    });
  } catch (error: any) {
    console.error("❌ Erreur:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
