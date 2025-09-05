import nodemailer from 'nodemailer';
import juice from 'juice';

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

// Variables communes réutilisables
const SENDER_INFO = {
    name: 'Méthode ERPR',
    address: process.env.SMTP_FROM || process.env.SMTP_USER || 'arabeimportance@gmail.com'
};

const BASE_URL = process.env.NEXTAUTH_URL || 'http://localhost:3000';

// Styles CSS
const getEmailStyles = () => `
<style>
    body {
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        line-height: 1.6;
        color: #333333;
        background-color: #f8fafc;
    }
    .email-container { max-width: 600px; margin: 0 auto; background: #f8fafc; padding: 2px; border-radius: 16px; }
    .email-content { background: white; border-radius: 14px; overflow: hidden; }
    .header { background: linear-gradient(135deg); color: white; padding: 40px 30px; text-align: center; }
    .header h1 { font-size: 28px; font-weight: 700; margin-bottom: 10px; }
    .header .subtitle { font-size: 16px; opacity: 0.9; }
    .main-content { padding: 40px 30px; }
    .cta-section { text-align: center; margin: 40px 0; padding: 30px; background: #f1f5f9; border-radius: 16px; }
    .cta-button { display: inline-block; background: linear-gradient(135deg); color: white; text-decoration: none; padding: 16px 32px; border-radius: 12px; font-weight: 600; font-size: 16px; }
    .footer { background: #1e293b; color: #94a3b8; padding: 30px; text-align: center; border-radius: 0 0 14px 14px; }
    .footer a { color: #667eea; text-decoration: none; }
</style>
`;

// Helpers
const getWelcomeGreeting = (username?: string, context: 'welcome' | 'reset' | 'change' = 'welcome') => {
    const greetings = {
        welcome: `🎉 Bienvenue ${username || ''} !`,
        reset: `Bonjour ${username || ''}`,
        change: `Bonjour ${username || ''}`
    };
    return greetings[context];
};

// === Templates ===

// Welcome email
const createWelcomeEmailTemplate = (username?: string) => `
<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Bienvenue dans la Méthode ERPR</title>
${getEmailStyles()}
</head>
<body>
<div class="email-container">
  <div class="email-content">
    <div class="header">
      <h1>✨ Méthode ERPR</h1>
      <p class="subtitle">Ecoute • Répétition • Pratique • Régularité</p>
    </div>
    <div class="main-content">
      <h2>${getWelcomeGreeting(username, 'welcome')}</h2>
      <p>Félicitations ! Vous venez de rejoindre la méthode ERPR</p>
      <div class="cta-section">
        <h3 style="color:#1e293b; margin-bottom:15px;">Prêt à commencer ?</h3>
        <a href="${BASE_URL}/dashboard" class="cta-button">🚀 Accéder à mon tableau de bord</a>
      </div>
    </div>
    <div class="footer">
      <p><strong>Méthode ERPR</strong> - Excellence dans l'apprentissage</p>
      <p><a href="${BASE_URL}/profile">Mon profil</a> • <a href="${BASE_URL}/support">Support</a> • <a href="${BASE_URL}/progress">Ma progression</a></p>
    </div>
  </div>
</div>
</body>
</html>
`;

// Reset password
const createResetPasswordTemplate = (resetUrl: string, username?: string) => `
<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Réinitialisation du mot de passe</title>
${getEmailStyles()}
</head>
<body>
<div class="email-container">
  <div class="email-content">
    <div class="header">
      <h1>🔐 Méthode ERPR</h1>
      <p class="subtitle">Réinitialisation de mot de passe</p>
    </div>
    <div class="main-content">
      <h2>${getWelcomeGreeting(username, 'reset')}</h2>
      <p>Vous avez demandé la réinitialisation de votre mot de passe.</p>
      <div class="cta-section">
        <a href="${resetUrl}" class="cta-button">🔐 Réinitialiser mon mot de passe</a>
        <p style="margin-top:15px; color:#dc2626; font-size:14px;">⚠️ Ce lien est valide 1h</p>
      </div>
    </div>
    <div class="footer">
      <p><strong>Méthode ERPR</strong> - Votre sécurité est notre priorité</p>
    </div>
  </div>
</div>
</body>
</html>
`;

// Email change
const createEmailChangeTemplate = (newEmail: string, username?: string) => `
<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Changement d'email confirmé</title>
${getEmailStyles()}
</head>
<body>
<div class="email-container">
  <div class="email-content">
    <div class="header">
      <h1>✅ Méthode ERPR</h1>
      <p class="subtitle">Changement d'email confirmé</p>
    </div>
    <div class="main-content">
      <h2>${getWelcomeGreeting(username, 'change')}</h2>
      <p>Votre adresse email a été mise à jour : <strong>${newEmail}</strong></p>
      <div class="cta-section">
        <a href="${BASE_URL}/dashboard" class="cta-button">📚 Retour au tableau de bord</a>
      </div>
    </div>
    <div class="footer">
      <p><strong>Méthode ERPR</strong> - Votre parcours continue</p>
    </div>
  </div>
</div>
</body>
</html>
`;

// === Fonctions d’envoi ===

// Bienvenue
export async function sendWelcomeEmail(email: string, username?: string): Promise<boolean> {
    try {
        const raw = createWelcomeEmailTemplate(username);
        const inlined = juice(raw);
        await transporter.sendMail({
            from: SENDER_INFO,
            to: email,
            subject: `🎉 Bienvenue dans la Méthode ERPR - Votre parcours d'apprentissage !`,
            html: inlined,
            text: `${getWelcomeGreeting(username, 'welcome')}\n\nCommencez : ${BASE_URL}/dashboard`
        });
        return true;
    } catch (err) {
        console.error("Erreur sendWelcomeEmail:", err);
        return false;
    }
}

// Reset password
export async function sendPasswordResetEmail(email: string, resetToken: string, username?: string): Promise<boolean> {
    try {
        const resetUrl = `${BASE_URL}/reset-password?token=${resetToken}`;
        const raw = createResetPasswordTemplate(resetUrl, username);
        const inlined = juice(raw);
        await transporter.sendMail({
            from: SENDER_INFO,
            to: email,
            subject: `🔐 Réinitialisation de votre mot de passe - Méthode ERPR`,
            html: inlined,
            text: `${getWelcomeGreeting(username, 'reset')}\n\nRéinitialisez ici : ${resetUrl}`
        });
        return true;
    } catch (err) {
        console.error("Erreur sendPasswordResetEmail:", err);
        return false;
    }
}

// Changement d’email
export async function sendEmailChangeConfirmation(newEmail: string, username?: string): Promise<boolean> {
    try {
        const raw = createEmailChangeTemplate(newEmail, username);
        const inlined = juice(raw);
        await transporter.sendMail({
            from: SENDER_INFO,
            to: newEmail,
            subject: `✅ Confirmation de changement d'email - Méthode ERPR`,
            html: inlined,
            text: `${getWelcomeGreeting(username, 'change')}\n\nNouvel email : ${newEmail}`
        });
        return true;
    } catch (err) {
        console.error("Erreur sendEmailChangeConfirmation:", err);
        return false;
    }
}

// Vérification de la config
export async function testEmailConfiguration(): Promise<boolean> {
    try {
        await transporter.verify();
        console.log('Configuration email valide');
        return true;
    } catch (err) {
        console.error('Erreur config email:', err);
        return false;
    }
}
