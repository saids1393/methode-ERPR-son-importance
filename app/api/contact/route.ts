// app/api/contact/route.ts
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Utilise la même configuration que votre fichier existant
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function POST(request: Request) {
  const { email, message } = await request.json();

  try {
    // Email pour l'admin (vous)
    await transporter.sendMail({
      from: {
        name: 'Support Méthode ERPR',
        address: process.env.SMTP_FROM || process.env.SMTP_USER || 'noreply@sonimportance.com'
      },
      to: process.env.ADMIN_EMAIL || process.env.SMTP_USER || 'votre@email.com',
      subject: `Nouveau message de support de ${email}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
          <h2 style="color: #4a5568;">Nouveau message de support</h2>
          <div style="margin-bottom: 20px;">
            <p><strong>De :</strong> ${email}</p>
            <p><strong>Date :</strong> ${new Date().toLocaleString('fr-FR')}</p>
          </div>
          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 6px; border-left: 4px solid #4299e1;">
            <p style="white-space: pre-line;">${message}</p>
          </div>
          <div style="margin-top: 30px; font-size: 14px; color: #718096;">
            <p>Vous pouvez répondre directement à cet email pour contacter l'utilisateur.</p>
          </div>
        </div>
      `,
      text: `Nouveau message de support de ${email}:\n\n${message}`
    });

    // Email de confirmation pour l'utilisateur
    await transporter.sendMail({
      from: {
        name: 'Support Méthode ERPR',
        address: process.env.SMTP_FROM || process.env.SMTP_USER || 'noreply@sonimportance.com'
      },
      to: email,
      subject: 'Confirmation de votre message de support',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
          <h2 style="color: #4a5568;">Merci pour votre message</h2>
          <p>Nous avons bien reçu votre demande de support et nous y répondrons dans les plus brefs délais.</p>
          
          <div style="margin: 20px 0; padding: 15px; background-color: #f8f9fa; border-radius: 6px;">
            <p style="font-style: italic;">"${message}"</p>
          </div>
          
          <p>En attendant, vous pouvez continuer votre apprentissage sur votre espace personnel.</p>
          
          <div style="margin-top: 30px; text-align: center;">
            <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/dashboard" 
               style="display: inline-block; padding: 10px 20px; background-color: #4299e1; color: white; text-decoration: none; border-radius: 4px;">
              Accéder à mon espace
            </a>
          </div>
          
          <div style="margin-top: 30px; font-size: 14px; color: #718096; border-top: 1px solid #e0e0e0; padding-top: 20px;">
            <p>L'équipe Méthode ERPR</p>
            <p>Professeur Soidroudine</p>
          </div>
        </div>
      `,
      text: `Confirmation de votre message de support :\n\nNous avons bien reçu votre message :\n"${message}"\n\nNous vous répondrons dans les plus brefs délais.\n\nAccédez à votre espace : ${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/dashboard`
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending support email:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur lors de l\'envoi du message' },
      { status: 500 }
    );
  }
}