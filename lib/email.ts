import nodemailer from 'nodemailer';
import juice from 'juice';

// ----------------------------
// Transporteur email
// ----------------------------
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// ----------------------------
// Variables communes
// ----------------------------
const SENDER_INFO = {
  name: 'Méthode ERPR',
  address: process.env.SMTP_FROM || process.env.SMTP_USER || 'arabeimportance@gmail.com',
};
const BASE_URL = process.env.NEXTAUTH_URL || 'http://localhost:3000';

// ----------------------------
// Helper greeting
// ----------------------------
const getWelcomeGreeting = (username?: string, context: 'welcome' | 'reset' | 'change' = 'welcome') => {
  const greetings = {
    welcome: `🎉 Bienvenue ${username || ''} !`,
    reset: `Bonjour ${username || ''}`,
    change: `Bonjour ${username || ''}`,
  };
  return greetings[context];
};

// ----------------------------
// --- Templates HTML
// ----------------------------
const createWelcomeEmailTemplate = (username?: string) => `
<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Bienvenue</title>
<style>
body { font-family: 'Inter', sans-serif; line-height: 1.6; color: #333; background: #f8fafc; }
.container { max-width: 600px; margin: 0 auto; background: #f8fafc; padding: 2px; border-radius: 16px; }
.content { background: white; border-radius: 14px; overflow: hidden; padding: 40px 30px; }
.header { background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 40px 30px; text-align: center; }
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

const createEmailChangeTemplate = (newEmail: string, confirmationUrl: string) => `
<html>
<body>
<p>Bonjour,</p>
<p>Vous avez demandé à changer votre adresse email vers ${newEmail}.</p>
<p>Veuillez confirmer votre nouvelle adresse en cliquant ici :</p>
<a href="${confirmationUrl}">Confirmer mon email</a>
</body>
</html>
`;

// ----------------------------
// --- Email Functions
// ----------------------------
export async function sendWelcomeEmail(email: string, username?: string): Promise<boolean> {
  try {
    const html = createWelcomeEmailTemplate(username);
    await transporter.sendMail({
      from: SENDER_INFO,
      to: email,
      subject: `🎉 Bienvenue dans la Méthode ERPR !`,
      html: juice(html),
      text: `${getWelcomeGreeting(username, 'welcome')}\nCommencez : ${BASE_URL}/dashboard`,
    });
    return true;
  } catch (err) {
    console.error("Erreur sendWelcomeEmail:", err);
    return false;
  }
}

export async function sendPasswordResetEmail(email: string, resetUrl: string, username?: string): Promise<boolean> {
  try {
    const html = createResetPasswordTemplate(resetUrl, username);
    await transporter.sendMail({
      from: SENDER_INFO,
      to: email,
      subject: "🔐 Réinitialisation de votre mot de passe",
      html: juice(html),
      text: `Réinitialisez votre mot de passe : ${resetUrl}`,
    });
    return true;
  } catch (err) {
    console.error("Erreur sendPasswordResetEmail:", err);
    return false;
  }
}

export async function sendEmailChangeConfirmation(email: string, newEmail: string, confirmationUrl: string): Promise<boolean> {
  try {
    const html = createEmailChangeTemplate(newEmail, confirmationUrl);
    await transporter.sendMail({
      from: SENDER_INFO,
      to: email,
      subject: "Confirmez votre nouvelle adresse email",
      html: juice(html),
      text: `Confirmez votre email : ${confirmationUrl}`,
    });
    return true;
  } catch (err) {
    console.error("Erreur sendEmailChangeConfirmation:", err);
    return false;
  }
}

// ----------------------------
// --- Test SMTP
// ----------------------------
export async function testEmailConfiguration(email: string): Promise<boolean> {
  try {
    await transporter.sendMail({
      from: SENDER_INFO,
      to: email,
      subject: "Test de configuration SMTP",
      text: "Ceci est un email test pour vérifier votre configuration SMTP.",
    });
    return true;
  } catch (err) {
    console.error("Erreur testEmailConfiguration:", err);
    return false;
  }
}
