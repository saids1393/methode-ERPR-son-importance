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

// --- Templates HTML et texte ---
const getReceiptTemplate = (data: PaymentData) => `...`; // Copie ton HTML ici
const getReceiptTextTemplate = (data: PaymentData) => `...`; // Copie ton texte ici

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
