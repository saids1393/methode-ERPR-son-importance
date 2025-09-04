import { createUser, getUserByEmail } from "@/lib/auth";
import { sendPaymentReceiptEmail, sendWelcomeEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import Stripe from "stripe";

interface PaymentData {
  email: string;
  amount: number;
  currency: string;
  sessionId: string;
  username?: string;
  isNewAccount: boolean;
  receiptUrl?: string;
}

export async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  try {
    const email = session.customer_email || session.metadata?.email;
    if (!email) {
      console.error("❌ Aucun email trouvé dans la session Stripe");
      return;
    }

    console.log(`✅ Paiement réussi pour l'email ${email}`);

    // Vérifier si le paiement a déjà été traité
    const existingPayment = await prisma.payment.findUnique({
      where: { stripeSessionId: session.id },
    });

    if (existingPayment) {
      console.log(`⚠️ Paiement déjà traité pour la session ${session.id}`);
      return;
    }

    // Vérifier ou créer l'utilisateur
    let user = await getUserByEmail(email);
    let isNewAccount = false;

    if (!user) {
      user = await createUser({
        email,
        stripeCustomerId: session.customer as string,
        stripeSessionId: session.id,
      });
      console.log(`🆕 Nouvel utilisateur créé: ${user.id}`);
      isNewAccount = true;
    } else {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          isActive: true,
          stripeCustomerId: session.customer as string,
          stripeSessionId: session.id,
        },
      });
      console.log(`🔓 Utilisateur activé: ${user.id}`);
    }

    // Créer une session Prisma si metadata fournie
    if (
      session.metadata?.availabilityId &&
      session.metadata?.professorId &&
      session.metadata?.scheduledAt
    ) {
      await prisma.session.create({
        data: {
          userId: user.id,
          professorId: session.metadata.professorId,
          availabilityId: session.metadata.availabilityId,
          scheduledAt: new Date(session.metadata.scheduledAt),
          status: "SCHEDULED",
        },
      });
      console.log("📅 Session Prisma créée pour l’utilisateur");
    }

    // Récupérer le reçu Stripe officiel
    type ExpandedPaymentIntent = Stripe.PaymentIntent & {
      charges?: { data: Array<{ receipt_url?: string }> };
    };

    const paymentIntent = (await stripe.paymentIntents.retrieve(
      session.payment_intent as string,
      { expand: ["charges"] }
    )) as ExpandedPaymentIntent;

    const receiptUrl = paymentIntent.charges?.data?.[0]?.receipt_url || undefined;

    if (!receiptUrl) {
      console.warn("⚠️ Aucun reçu Stripe disponible pour ce paiement");
    }

    // Préparer les données pour l'email
    const paymentData: PaymentData = {
      email: user.email,
      amount: session.amount_total || 9700,
      currency: session.currency || "eur",
      sessionId: session.id,
      username: user.username || undefined,
      isNewAccount,
      receiptUrl,
    };

    // Enregistrer le paiement comme traité
    await prisma.payment.create({
      data: {
        stripeSessionId: session.id,
        stripePaymentIntentId: session.payment_intent as string,
        amount: paymentData.amount,
        currency: paymentData.currency,
        userId: user.id,
      },
    });

    // Envoyer emails en parallèle
    try {
      await Promise.all([
        sendPaymentReceiptEmail(paymentData),
        isNewAccount ? sendWelcomeEmail(user.email, user.username || undefined) : Promise.resolve(true),
      ]);
      console.log("📧 Emails envoyés avec succès à:", email);
    } catch (emailError) {
      console.error("❌ Erreur lors de l'envoi des emails:", emailError);
    }
  } catch (error) {
    console.error("❌ Erreur handleCheckoutSessionCompleted:", error);
  }
}
