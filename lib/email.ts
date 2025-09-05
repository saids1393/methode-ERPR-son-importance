import nodemailer from 'nodemailer';
import juice from 'juice';
import { PDFDocument, StandardFonts } from 'pdf-lib';

// Configuration du transporteur email
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

// Variables communes
const SENDER_INFO = {
    name: 'Méthode ERPR',
    address: process.env.SMTP_FROM || process.env.SMTP_USER || 'arabeimportance@gmail.com'
};
const BASE_URL = process.env.NEXTAUTH_URL || 'http://localhost:3000';

// === PDF GENERATION ===
export interface PaymentData {
    email: string;
    amount: number;
    currency: string;
    sessionId: string;
    customerName?: string;
    username?: string;
    isNewAccount: boolean;
}

export async function generateReceiptPDF(data: PaymentData): Promise<Uint8Array> {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([200, 400]);
    const { width, height } = page.getSize();
    const font = await pdfDoc.embedFont(StandardFonts.Courier);
    const fontSize = 10;
    const lineHeight = fontSize + 4;
    const margin = 10;
    const maxWidth = width - 2 * margin;
    let y = height - margin;

    function drawWrappedText(text: string) {
        const words = text.split(' ');
        let line = '';
        for (const word of words) {
            const testLine = line ? line + ' ' + word : word;
            const testWidth = font.widthOfTextAtSize(testLine, fontSize);
            if (testWidth > maxWidth) {
                page.drawText(line, { x: margin, y, size: fontSize, font });
                y -= lineHeight;
                line = word;
            } else {
                line = testLine;
            }
        }
        if (line) {
            page.drawText(line, { x: margin, y, size: fontSize, font });
            y -= lineHeight;
        }
    }

    drawWrappedText('===== REÇU DE PAIEMENT =====');
    y -= lineHeight / 2;
    drawWrappedText(`Email : ${data.email}`);
    if (data.username) drawWrappedText(`Utilisateur : ${data.username}`);
    drawWrappedText(`Montant payé : ${(data.amount / 100).toFixed(2)} ${data.currency.toUpperCase()}`);
    drawWrappedText(`Date : ${new Date().toLocaleString('fr-FR')}`);
    drawWrappedText(`Transaction : ${data.sessionId}`);
    y -= lineHeight;
    drawWrappedText('Merci pour votre achat !');
    drawWrappedText('========================');

    return await pdfDoc.save();
}

// === HTML TEMPLATES ===
const getReceiptTemplate = (data: PaymentData) => `
<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<title>Reçu de paiement</title>
<style>
body { font-family: 'Segoe UI', sans-serif; line-height: 1.6; color: #333; background: #f8f9fa; }
.container { max-width: 600px; margin: auto; background: white; border-radius: 12px; padding: 40px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
.header { text-align: center; margin-bottom: 30px; }
.logo { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; border-radius: 8px; font-size: 24px; font-weight: bold; margin-bottom: 20px; display: inline-block; }
.success-badge { background: #28a745; color: white; padding: 8px 20px; border-radius: 20px; font-weight: 600; display: inline-block; }
.receipt-details { background: #f8f9fa; padding: 25px; border-radius: 8px; margin: 30px 0; }
.detail-row { display: flex; justify-content: space-between; margin-bottom: 15px; border-bottom: 1px solid #e9ecef; padding-bottom: 10px; }
.detail-row:last-child { border-bottom: none; font-weight: bold; font-size: 18px; color: #28a745; }
.cta-button { background: #28a745; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold; margin: 20px 0; }
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
    <div class="detail-row"><span>Email</span><span>${data.email}</span></div>
    <div class="detail-row"><span>Date</span><span>${new Date().toLocaleDateString('fr-FR')}</span></div>
    <div class="detail-row"><span>Transaction</span><span>${data.sessionId}</span></div>
    <div class="detail-row"><span>Montant</span><span>${(data.amount / 100).toFixed(2)} ${data.currency.toUpperCase()}</span></div>
  </div>
  <div style="text-align:center;">
    <a href="${BASE_URL}/dashboard" class="cta-button">🚀 Commencer mon apprentissage</a>
  </div>
</div>
</body>
</html>
`;

// === HELPER GREETING ===
const getWelcomeGreeting = (username?: string, context: 'welcome' | 'reset' | 'change' = 'welcome') => {
    const greetings = {
        welcome: `🎉 Bienvenue ${username || ''} !`,
        reset: `Bonjour ${username || ''}`,
        change: `Bonjour ${username || ''}`
    };
    return greetings[context];
};

// === EMAIL FUNCTIONS ===
export async function sendPaymentReceiptEmail(data: PaymentData): Promise<boolean> {
    try {
        const pdfBytes = await generateReceiptPDF(data);
        await transporter.sendMail({
            from: SENDER_INFO,
            to: data.email,
            subject: `✅ Reçu de paiement - Accès confirmé`,
            html: juice(getReceiptTemplate(data)),
            text: `Merci pour votre achat !\nTransaction : ${data.sessionId}\nMontant : ${(data.amount / 100).toFixed(2)} ${data.currency.toUpperCase()}\nAccédez à votre tableau de bord : ${BASE_URL}/dashboard`,
            attachments: [{ filename: `recu-paiement-${Date.now()}.pdf`, content: Buffer.from(pdfBytes), contentType: 'application/pdf' }]
        });
        return true;
    } catch (err) {
        console.error('Erreur sendPaymentReceiptEmail:', err);
        return false;
    }
}

const createWelcomeEmailTemplate = (username?: string) => `
<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<title>Bienvenue</title>
<style>
body { font-family: 'Inter', sans-serif; line-height: 1.6; color: #333; background: #f8fafc; }
.container { max-width: 600px; margin: 0 auto; background: #f8fafc; padding: 2px; border-radius: 16px; }
.content { background: white; border-radius: 14px; overflow: hidden; padding: 40px 30px; }
.header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 30px; text-align: center; }
.header h1 { font-size: 28px; font-weight: 700; margin-bottom: 10px; }
.header .subtitle { font-size: 16px; opacity: 0.9; }
.cta-button { display: inline-block; background: #28a745; color: white; text-decoration: none; padding: 16px 32px; border-radius: 12px; font-weight: 600; font-size: 16px; }
.footer { background: #1e293b; color: #94a3b8; padding: 30px; text-align: center; border-radius: 0 0 14px 14px; }
.footer a { color: #667eea; text-decoration: none; }
</style>
</head>
<body>
<div class="container">
  <div class="content">
    <div class="header">
      <h1>✨ Méthode ERPR</h1>
      <p class="subtitle">Ecoute • Répétition • Pratique • Régularité</p>
    </div>
    <h2>${getWelcomeGreeting(username, 'welcome')}</h2>
    <p>Félicitations ! Vous venez de rejoindre la méthode ERPR</p>
    <div style="text-align:center; margin:40px 0;">
      <a href="${BASE_URL}/dashboard" class="cta-button">🚀 Accéder à mon tableau de bord</a>
    </div>
    <div class="footer">
      <p><strong>Méthode ERPR</strong> - Excellence dans l'apprentissage</p>
    </div>
  </div>
</div>
</body>
</html>
`;

export async function sendWelcomeEmail(email: string, username?: string): Promise<boolean> {
    try {
        const raw = createWelcomeEmailTemplate(username);
        await transporter.sendMail({
            from: SENDER_INFO,
            to: email,
            subject: `🎉 Bienvenue dans la Méthode ERPR !`,
            html: juice(raw),
            text: `${getWelcomeGreeting(username, 'welcome')}\nCommencez : ${BASE_URL}/dashboard`
        });
        return true;
    } catch (err) {
        console.error("Erreur sendWelcomeEmail:", err);
        return false;
    }
}

const createResetPasswordTemplate = (resetUrl: string, username?: string) => `
<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<title>Réinitialisation du mot de passe</title>
<style>
body { font-family: 'Inter', sans-serif; line-height: 1.6; color: #333; background: #f8fafc; }
.container { max-width: 600px; margin: 0 auto; background: #f8fafc; padding: 2px; border-radius: 16px; }
.content { background: white; border-radius: 14px; overflow: hidden; padding: 40px 30px; }
.header { background: #ffc107; color: #212529; padding: 40px 30px; text-align: center; }
.cta-button { display: inline-block; background: #dc3545; color: white; text-decoration: none; padding: 16px 32px; border-radius: 12px; font-weight: 600; font-size: 16px; }
</style>
</head>
<body>
<div class="container">
  <div class="content">
    <div class="header">
      <h1>🔐 Réinitialisation</h1>
    </div>
    <h2>${getWelcomeGreeting(username, 'reset')}</h2>
    <p>Vous avez demandé la réinitialisation de votre mot de passe.</p>
    <div style="text-align:center; margin:40px 0;">
      <a href="${resetUrl}" class="cta-button">🔐 Réinitialiser mon mot de passe</a>
      <p style="color:#dc2626; font-size:14px;">⚠️ Ce lien est valide 1h</p>
    </div>
  </div>
</div>
</body>
</html>
`;

export async function sendPasswordResetEmail(email: string, resetUrl: string, username?: string): Promise<boolean> {
    try {
        const html = createResetPasswordTemplate(resetUrl, username);
        await transporter.sendMail({
            from: SENDER_INFO,
            to: email,
            subject: "🔐 Réinitialisation de votre mot de passe",
            html: juice(html),
            text: `Réinitialisez votre mot de passe : ${resetUrl}`
        });
        return true;
    } catch (err) {
        console.error("Erreur sendPasswordResetEmail:", err);
        return false;
    }
}

// --- Email changement d'adresse
export async function sendEmailChangeConfirmation(email: string, newEmail: string, confirmationUrl: string): Promise<boolean> {
    try {
        const html = `
        <html><body>
        <p>Bonjour,</p>
        <p>Vous avez demandé à changer votre adresse email vers ${newEmail}.</p>
        <p>Veuillez confirmer votre nouvelle adresse en cliquant ici :</p>
        <a href="${confirmationUrl}">Confirmer mon email</a>
        </body></html>
        `;
        await transporter.sendMail({
            from: SENDER_INFO,
            to: email,
            subject: "Confirmez votre nouvelle adresse email",
            html: juice(html),
            text: `Confirmez votre email : ${confirmationUrl}`
        });
        return true;
    } catch (err) {
        console.error("Erreur sendEmailChangeConfirmation:", err);
        return false;
    }
}

// --- Test configuration SMTP
export async function testEmailConfiguration(email: string): Promise<boolean> {
    try {
        await transporter.sendMail({
            from: SENDER_INFO,
            to: email,
            subject: "Test de configuration SMTP",
            text: "Ceci est un email test pour vérifier votre configuration SMTP."
        });
        return true;
    } catch (err) {
        console.error("Erreur testEmailConfiguration:", err);
        return false;
    }
}
