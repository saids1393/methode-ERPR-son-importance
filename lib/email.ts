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
.header { background: linear-gradient(135deg, #ffffffff, #1900ffff); color: white; padding: 100px 10px; text-align: center; }
.header h1 { font-size: 28px; font-weight: 700; margin-bottom: 10px; }
.header .subtitle { font-size: 16px; opacity: 0.9; }
.cta-button { display: inline-block; background: #2365ffff; color: white; text-decoration: none; padding: 16px 32px; border-radius: 12px; font-weight: 600; font-size: 16px; }

.feature-list {
    background: #f8f9fa;
    padding: 25px;
    border-radius: 8px;
    margin: 30px 0;
}
.feature-item {
    margin-bottom: 15px;
    padding-left: 30px;
    position: relative;
}
.feature-item::before {
    content: "✅";
    position: absolute;
    left: 0;
    top: 0;
}
h2 { text-align: center; }
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

    <div class="feature-list">
        <h3 style="margin-top: 0; color: #333;">🎯 Ce qui vous attend :</h3>
        <div class="feature-item">
            <strong>10 chapitres progressifs</strong> - De l'alphabet aux règles avancées
        </div>
        <div class="feature-item">
            <strong>Quiz interactifs</strong> - Testez vos connaissances à chaque étape
        </div>
        <div class="feature-item">
            <strong>Suivi de progression</strong> - Visualisez vos progrès en temps réel avec graphique hebdomadaire et mensuel
        </div>
        <div class="feature-item">
            <strong>Capteur de temps</strong> - Visualisez le temps passé sur l'application
        </div>
         <div class="feature-item">
            <strong>Devoirs</strong> - Recevez vos devoirs automatiquement à chaque fin de chapitre
        </div>
          <div class="feature-item">
            <strong>Audios</strong> - Support numérique avec plus de 600 audios intégrés
        </div>
          <div class="feature-item">
            <strong>Vidéos</strong> - Vidéos courtes explicatives pour chaque chapitre
        </div>
        <div class="feature-item">
            <strong>Accompagenemts et support contact</strong> - Accompagents instantannées via WhatsApp et email
        </div>
    </div>

    <p>Félicitations ! Vous venez de rejoindre la méthode ERPR</p>
    <div style="text-align:center; margin:40px 0;">
      <a href="${BASE_URL}/dashboard" class="cta-button">🚀 Accéder à mon tableau de bord</a>
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
