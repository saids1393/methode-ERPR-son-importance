// lib/email.ts
import nodemailer from 'nodemailer';
import juice from 'juice';
import path from "path";
import fs from "fs";

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
const BASE_URL = process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

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
.content { background: white; border-radius: 14px; overflow: hidden; padding: 10px 10px; }
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
h3 { color: #ffffffff; }
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
        <h3 style="margin-top: 0; color: #ffffffff;">🎯 Ce qui vous attend :</h3>
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

// ----------------------------
const createHomeworkSubmissionTemplate = (params: {
  userName: string;
  homeworkTitle: string;
  chapterId: number;
  submissionType: 'TEXT' | 'AUDIO';
  content: string;
  submittedAt: Date;
}) => `
<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Devoir Soumis</title>
<style>
body { font-family: 'Inter', sans-serif; line-height: 1.6; color: #333; background: #f8fafc; }
.container { max-width: 600px; margin: 0 auto; background: #f8fafc; padding: 2px; border-radius: 16px; }
.content { background: white; border-radius: 14px; overflow: hidden; padding: 40px 30px; }
.header { background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 5px 5px; text-align: center; }
.submission-details { background: #f8f9fa; padding: 25px; border-radius: 12px; margin: 25px 0; border-left: 4px solid #10b981; }
.content-preview { background: white; padding: 20px; border-radius: 8px; margin: 15px 0; border: 1px solid #e5e7eb; }
.audio-player { width: 100%; margin: 15px 0; }
.status-badge { display: inline-block; background: #fef3c7; color: #92400e; padding: 8px 16px; border-radius: 20px; font-size: 14px; font-weight: 600; }
.footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
</style>
</head>
<body>
<div class="container">
  <div class="content">
    <div class="header">
      <h1>✅ Devoir Soumis</h1>
      <p>Votre rendu a été envoyé avec succès</p>
    </div>
    
    <h2>Bonjour <strong>${params.userName}</strong>,</h2>
    
    <p>Votre devoir a été soumis avec succès et est maintenant en attente de correction.</p>
    
    <div class="submission-details">
      <h3 style="margin-top: 0; color: #059669;">📋 Détails du devoir</h3>
      
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 20px 0;">
        <div>
          <strong>Chapitre :</strong><br>
          <span style="font-size: 18px; color: #059669;">${params.chapterId}</span>
        </div>
        <div>
          <strong>Type de rendu :</strong><br>
          <span class="status-badge">
            ${params.submissionType === 'TEXT' ? '📝 Texte' : '🎧 Audio'}
          </span>
        </div>
      </div>
      
      <div>
        <strong>Titre :</strong><br>
        <span style="color: #374151;">${params.homeworkTitle}</span>
      </div>
      
      <div style="margin-top: 15px;">
        <strong>Date de soumission :</strong><br>
        <span style="color: #374151;">${params.submittedAt.toLocaleDateString('fr-FR', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit'
})}</span>
      </div>
    </div>

    <div style="margin: 25px 0;">
      <h3 style="color: #059669;">📝 Contenu soumis</h3>
      ${params.submissionType === 'TEXT'
    ? `<div class="content-preview">
             <p style="margin: 0; white-space: pre-wrap; line-height: 1.8;">${params.content}</p>
           </div>`
    : `<div class="content-preview">
             <p style="margin: 0 0 15px 0;">🎧 Fichier audio soumis :</p>
             <audio controls class="audio-player">
               <source src="${params.content}" type="audio/mpeg">
               Votre navigateur ne supporte pas l'élément audio.
             </audio>
             <p style="margin: 10px 0 0 0; font-size: 14px; color: #6b7280;">
               💡 Si vous ne voyez pas le lecteur audio, <a href="${params.content}">cliquez ici pour écouter</a>
             </p>
           </div>`
  }
    </div>

    <div style="background: #eff6ff; padding: 20px; border-radius: 12px; margin: 30px 0;">
      <h4 style="margin: 0 0 10px 0; color: #1e40af;">⏳ Prochaines étapes</h4>
      <p style="margin: 0; color: #374151;">
        Votre professeur va maintenant corriger votre travail. Vous recevrez un email dès que votre devoir sera corrigé avec le feedback détaillé.
      </p>
    </div>

    <p style="text-align: center; margin: 30px 0;">
      <a href="${BASE_URL}/devoirs" 
         style="display: inline-block; background: #10b981; color: white; text-decoration: none; padding: 16px 32px; border-radius: 12px; font-weight: 600; font-size: 16px;">
        📚 Voir mes devoirs
      </a>
    </p>

    <div class="footer">
      <p>Cet email a été envoyé automatiquement, merci de ne pas y répondre.</p>
      <p>Méthode ERPR • Ecoute • Répétition • Pratique • Régularité</p>
    </div>
  </div>
</div>
</body>
</html>
`;

// ----------------------------
// Email soumission devoir (étudiant)
// ----------------------------
interface HomeworkSubmissionEmailParams {
  userEmail: string;
  userName: string;
  homeworkTitle: string;
  chapterId: number;
  submissionType: 'TEXT' | 'AUDIO';
  content: string;
  fileUrls?: { name: string; path: string }[];
  submittedAt: Date;
}

// ----------------------------
// Email soumission devoir (étudiant)
// ----------------------------
export async function sendHomeworkSubmissionEmail(
  params: HomeworkSubmissionEmailParams
): Promise<boolean> {
  try {
    // ✅ Si AUDIO → on attache les fichiers directement
    const attachments =
      params.submissionType === "AUDIO" && params.fileUrls?.length
        ? params.fileUrls.map((f) => ({
            filename: f.name,
            path: f.path, // fichier local
          }))
        : [];

const html = `
  <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
    <h2 style="color: #4CAF50;">✅ Devoir soumis avec succès !</h2>
    <p>Bonjour <strong>${params.userName}</strong>,</p>
    <p>Votre devoir pour le chapitre <strong>${params.chapterId}</strong> a été soumis avec succès.</p>
    
    <div style="margin-top: 15px; padding: 15px; background-color: #f1f8ff; border-left: 4px solid #4CAF50; border-radius: 6px;">
      <p><strong>Titre :</strong> ${params.homeworkTitle}</p>
      <p><strong>Type :</strong> ${
        params.submissionType === "TEXT" ? "Texte" : "Fichiers joints"
      }</p>
    </div>

    ${
      params.submissionType === "TEXT"
        ? `<div style="margin-top: 15px; padding: 15px; background-color: #f9f9f9; border-radius: 6px; border: 1px solid #ddd;">
             <p>${params.content}</p>
           </div>`
        : `<p style="margin-top: 15px;">📎 Vos fichiers sont joints à cet email. Assurez-vous de les conserver pour référence.</p>`
    }

    <p style="margin-top: 20px;">Merci pour votre travail et continuez comme ça ! 💪</p>

    <p style="margin-top: 20px; font-size: 12px; color: #777;">
      Ceci est un message automatique, merci de ne pas répondre.
    </p>
  </div>
`;


    await transporter.sendMail({
      from: SENDER_INFO,
      to: params.userEmail,
      subject: `🚀 Devoir envoyé - ${params.homeworkTitle}`,
      html: juice(html),
      attachments, // ✅ fichiers joints
    });

    console.log(`✅ Email étudiant envoyé avec fichiers joints`);
    return true;
  } catch (err) {
    console.error("❌ Erreur sendHomeworkSubmissionEmail:", err);
    return false;
  }
}


// ----------------------------
// Email notification professeur
// ----------------------------
interface TeacherNotificationParams {
  teacherEmail: string;
  userName: string;
  userEmail: string;
  userId: string;
  homeworkTitle: string;
  chapterId: number;
  submissionType: "TEXT" | "AUDIO";
  content: string;
  submittedAt: Date;
  fileUrls?: { name: string; path: string }[]; // ✅ ajouté ici
}


// ----------------------------
// Email notification professeur
// ----------------------------
export async function sendTeacherHomeworkNotification(
  params: TeacherNotificationParams
): Promise<boolean> {
  try {
    // ✅ Même logique : fichiers joints locaux
    const attachments =
      params.submissionType === "AUDIO" && params.fileUrls?.length
        ? params.fileUrls.map((f) => ({
            filename: f.name,
            path: f.path,
          }))
        : [];

const html = `
  <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
    <h2 style="color: #2196F3;">📬 Nouveau devoir soumis</h2>
    <p>Bonjour,</p>
    <p>Un étudiant vient de soumettre un devoir. Voici les détails :</p>

    <div style="margin-top: 15px; padding: 15px; background-color: #f1f8ff; border-left: 4px solid #2196F3; border-radius: 6px;">
      <ul style="list-style: none; padding: 0;">
        <li><strong>Nom :</strong> ${params.userName}</li>
        <li><strong>Email :</strong> ${params.userEmail}</li>
        <li><strong>Chapitre :</strong> ${params.chapterId}</li>
        <li><strong>Titre :</strong> ${params.homeworkTitle}</li>
        <li><strong>Type :</strong> ${
          params.submissionType === "TEXT" ? "Texte" : "Fichiers joints"
        }</li>
      </ul>
    </div>

    ${
      params.submissionType === "TEXT"
        ? `<div style="margin-top: 15px; padding: 15px; background-color: #f9f9f9; border-radius: 6px; border: 1px solid #ddd;">
             <p>${params.content}</p>
           </div>`
        : `<p style="margin-top: 15px;">📎 Les fichiers sont joints à cet email.</p>`
    }

    <p style="margin-top: 20px;">Merci de vérifier et de noter le devoir dès que possible.</p>

    <p style="margin-top: 20px; font-size: 12px; color: #777;">
      Ceci est un message automatique, merci de ne pas répondre.
    </p>
  </div>
`;


    await transporter.sendMail({
      from: SENDER_INFO,
      to: params.teacherEmail,
      subject: `📬 Nouveau devoir - ${params.userName} (${params.homeworkTitle})`,
      html: juice(html),
      attachments,
    });

    console.log(`✅ Email professeur envoyé avec fichiers joints`);
    return true;
  } catch (err) {
    console.error("❌ Erreur sendTeacherHomeworkNotification:", err);
    return false;
  }
}