// lib/email.ts
import nodemailer from 'nodemailer';

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

// --- Interface PaymentData ---
export interface PaymentData {
  email: string;
  amount: number;
  currency: string;
  sessionId: string;
  username?: string;
  isNewAccount: boolean;
  receiptUrl?: string; 
}

// --- Templates HTML et texte ---
const getReceiptTemplate = (data: PaymentData) => `...`; // Ton HTML ici
const getReceiptTextTemplate = (data: PaymentData) => `...`; // Ton texte ici

// --- Fonctions email ---
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

// --- Réinitialisation du mot de passe ---
export async function sendPasswordResetEmail(email: string, resetToken: string, username?: string): Promise<boolean> {
  try {
    const resetUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
    await transporter.sendMail({
      from: { name: 'Méthode ERPR', address: process.env.SMTP_FROM || process.env.SMTP_USER || 'arabeimportance@gmail.com' },
      to: email,
      subject: `🔐 Réinitialisation de votre mot de passe - Méthode ERPR`,
      html: `<p>Bonjour ${username || ''},<br>Réinitialisez votre mot de passe : <a href="${resetUrl}">Cliquez ici</a></p>`,
      text: `Bonjour ${username || ''}, réinitialisez votre mot de passe ici : ${resetUrl}`
    });
    return true;
  } catch {
    return false;
  }
}

// --- Notification changement email ---
export async function sendEmailChangeNotification(newEmail: string, username?: string, p0?: string | undefined): Promise<boolean> {
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
