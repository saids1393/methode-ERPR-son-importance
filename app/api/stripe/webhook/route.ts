import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature")!;
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  try {
    const event = stripe.webhooks.constructEvent(body, signature, endpointSecret);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      console.log("Paiement réussi:", session);
      // 🔐 Marquer l'utilisateur comme premium, etc.
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error(err);
    return new NextResponse("Webhook Error", { status: 400 });
  }
}
