import nodemailer from 'nodemailer';
import { prisma } from "@/lib/prisma";

// --- Transporteur email ---
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// --- Interface données de paiement ---
export interface PaymentData {
  email: string;
  amount: number;
  currency: string;
  sessionId: string;
  username?: string;
  isNewAccount: boolean;
  receiptUrl?: string; 
}

// --- Template HTML reçu Stripe ---
const getReceiptTemplate = (data: PaymentData) => `
<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<title>Reçu de paiement - Méthode ERPR</title>
<style>
  body { font-family: 'Segoe UI', sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background: #f8f9fa; }
  .container { background: white; border-radius: 12px; padding: 40px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
  .header { text-align: center; margin-bottom: 40px; }
  .logo { font-size: 24px; font-weight: bold; color: white; background: linear-gradient(135deg,#667eea 0%,#764ba2 100%); padding: 15px 30px; border-radius: 8px; display: inline-block; margin-bottom: 20px; }
  .success-badge { background: #28a745; color: white; padding: 8px 20px; border-radius: 20px; font-weight: 600; display: inline-block; }
  .receipt-details { background: #f8f9fa; padding: 25px; border-radius: 8px; margin: 30px 0; }
  .detail-row { display: flex; justify-content: space-between; margin-bottom: 15px; }
  .cta-button { background: #28a745; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold; margin: 20px 0; }
  .footer { text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e9ecef; color: #6c757d; font-size: 14px; }
</style>
</head>
<body>
<div class="container">
  <div class="header">
    <div class="logo">📚 Méthode ERPR</div>
    <div class="success-badge">✅ Paiement confirmé</div>
  </div>

  <h1 style="text-align:center;">Merci pour votre achat !</h1>

  <div class="receipt-details">
    <div class="detail-row"><span>Email :</span><span>${data.email}</span></div>
    ${data.username ? `<div class="detail-row"><span>Utilisateur :</span><span>${data.username}</span></div>` : ''}
    <div class="detail-row"><span>Montant payé :</span><span>${(data.amount / 100).toFixed(2)} ${data.currency.toUpperCase()}</span></div>
    <div class="detail-row"><span>Date :</span><span>${new Date().toLocaleString('fr-FR')}</span></div>
    <div class="detail-row"><span>ID de transaction :</span><span>${data.sessionId}</span></div>
    ${data.receiptUrl ? `<div class="detail-row"><span>Reçu officiel :</span><span><a href="${data.receiptUrl}">Voir le reçu Stripe</a></span></div>` : ''}
  </div>

  ${data.isNewAccount ? `
  <div style="background: linear-gradient(135deg,#667eea 0%,#764ba2 100%); color: white; padding: 25px; border-radius: 8px; margin: 30px 0;">
    <h3>🎉 Votre compte a été créé avec succès !</h3>
    <p>Votre compte d'apprentissage est maintenant actif :</p>
    <ul>
      <li><strong>Email :</strong> ${data.email}</li>
      ${data.username ? `<li><strong>Pseudo :</strong> ${data.username}</li>` : ''}
      <li><strong>Statut :</strong> Accès Premium Activé ✨</li>
    </ul>
  </div>` : ''}

  <div style="text-align:center;">
    <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/dashboard" class="cta-button">🚀 Commencer mon apprentissage</a>
  </div>

  <div class="footer">
    © ${new Date().getFullYear()} Méthode ERPR - Tous droits réservés
  </div>
</div>
</body>
</html>
`;

// --- Template texte simple ---
const getReceiptTextTemplate = (data: PaymentData) => `
REÇU DE PAIEMENT - Méthode ERPR

Merci pour votre achat !

Email: ${data.email}
${data.username ? `Utilisateur: ${data.username}` : ''}
Montant payé: ${(data.amount / 100).toFixed(2)} ${data.currency.toUpperCase()}
Date: ${new Date().toLocaleString('fr-FR')}
Transaction: ${data.sessionId}
${data.receiptUrl ? `Reçu officiel: ${data.receiptUrl}` : ''}

${data.isNewAccount ? `
COMPTE CRÉÉ AVEC SUCCÈS !
Votre compte d'apprentissage est maintenant actif :
- Email: ${data.email}
${data.username ? `- Pseudo: ${data.username}` : ''}
- Statut: Accès Premium Activé` : ''}

Commencez votre apprentissage : ${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/dashboard
`;

// --- Envoi d'email reçu ---
export async function sendPaymentReceiptEmail(data: PaymentData): Promise<boolean> {
  try {
    await transporter.sendMail({
      from: { name: 'Méthode ERPR', address: process.env.SMTP_FROM || process.env.SMTP_USER || 'arabeimportance@gmail.com' },
      to: data.email,
      subject: `✅ Reçu de paiement - Accès confirmé à la Méthode ERPR`,
      html: getReceiptTemplate(data),
      text: getReceiptTextTemplate(data),
    });
    return true;
  } catch (err) {
    console.error('Erreur envoi email reçu:', err);
    return false;
  }
}

// --- Envoi email bienvenue ---
export async function sendWelcomeEmail(email: string, username?: string): Promise<boolean> {
  try {
    await transporter.sendMail({
      from: { name: 'Méthode ERPR', address: process.env.SMTP_FROM || process.env.SMTP_USER || 'arabeimportance@gmail.com' },
      to: email,
      subject: `🎉 Bienvenue dans la Méthode ERPR !`,
      html: `<p>Bienvenue ${username || ''} ! Votre compte Méthode ERPR est activé.</p>`,
      text: `Bienvenue ${username || ''} ! Votre compte Méthode ERPR est activé.`,
    });
    return true;
  } catch {
    return false;
  }
}

// --- Notification de changement d'email ---
export async function sendEmailChangeNotification(newEmail: string, username?: string): Promise<boolean> {
  try {
    await transporter.sendMail({
      from: { name: 'Méthode ERPR', address: process.env.SMTP_FROM || process.env.SMTP_USER || 'arabeimportance@gmail.com' },
      to: newEmail,
      subject: `✅ Confirmation de changement d'email - Méthode ERPR`,
      html: `<p>Bonjour ${username || ''}, votre email a été modifié avec succès.</p>`,
      text: `Bonjour ${username || ''}, votre email a été modifié avec succès.`,
    });
    return true;
  } catch {
    return false;
  }
}
