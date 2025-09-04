import nodemailer from 'nodemailer';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

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

// Interface pour les données de paiement
interface PaymentData {
    email: string;
    amount: number;
    currency: string;
    sessionId: string;
    customerName?: string;
    username?: string;
    isNewAccount: boolean;
}

// Fonction pour générer le PDF du reçu
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

    if (data.username) {
        drawWrappedText(`Utilisateur : ${data.username}`);
    }

    drawWrappedText(`Montant payé : ${(data.amount / 100).toFixed(2)} ${data.currency.toUpperCase()}`);
    drawWrappedText(`Date : ${new Date().toLocaleString('fr-FR')}`);
    drawWrappedText(`Transaction : ${data.sessionId}`);

    y -= lineHeight;

    drawWrappedText('Merci pour votre achat !');
    drawWrappedText('========================');

    const pdfBytes = await pdfDoc.save();
    return pdfBytes;
}

// Template HTML pour le reçu de paiement
const getReceiptTemplate = (data: PaymentData) => `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reçu de paiement - Méthode ERPR</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8f9fa;
        }
        .container {
            background: white;
            border-radius: 12px;
            padding: 40px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 40px;
            padding-bottom: 20px;
            border-bottom: 2px solid #e9ecef;
        }
        .logo {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 15px 30px;
            border-radius: 8px;
            display: inline-block;
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 20px;
        }
        .success-badge {
            background: #28a745;
            color: white;
            padding: 8px 20px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 600;
            display: inline-block;
        }
        .receipt-details {
            background: #f8f9fa;
            padding: 25px;
            border-radius: 8px;
            margin: 30px 0;
        }
        .detail-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 15px;
            padding-bottom: 10px;
            border-bottom: 1px solid #e9ecef;
        }
        .detail-row:last-child {
            border-bottom: none;
            font-weight: bold;
            font-size: 18px;
            color: #28a745;
        }
        .account-info {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 25px;
            border-radius: 8px;
            margin: 30px 0;
        }
        .cta-button {
            background: #28a745;
            color: white;
            padding: 15px 30px;
            text-decoration: none;
            border-radius: 8px;
            display: inline-block;
            font-weight: bold;
            margin: 20px 0;
        }
        .footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e9ecef;
            color: #6c757d;
            font-size: 14px;
        }
        .support-info {
            background: #e3f2fd;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            border-left: 4px solid #2196f3;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">📚 Méthode ERPR</div>
            <div class="success-badge">✅ Paiement confirmé</div>
        </div>

        <h1 style="color: #333; text-align: center; margin-bottom: 30px;">
            Merci pour votre achat !
        </h1>

        <p style="font-size: 16px; margin-bottom: 30px;">
            Bonjour,<br><br>
            Nous avons bien reçu votre paiement pour la Méthode ERPR. 
            Voici les détails de votre transaction :
        </p>

        <div class="receipt-details">
            <h3 style="margin-top: 0; color: #333;">📋 Détails de la commande</h3>
            <div class="detail-row">
                <span>Produit :</span>
                <span>Méthode ERPR - Cours d'arabe complet</span>
            </div>
            <div class="detail-row">
                <span>Email :</span>
                <span>${data.email}</span>
            </div>
            <div class="detail-row">
                <span>Date :</span>
                <span>${new Date().toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
})}</span>
            </div>
            <div class="detail-row">
                <span>ID de transaction :</span>
                <span>${data.sessionId.substring(0, 20)}...</span>
            </div>
            <div class="detail-row">
                <span>Montant total :</span>
                <span>${(data.amount / 100).toFixed(2)} ${data.currency.toUpperCase()}</span>
            </div>
        </div>

        ${data.isNewAccount ? `
        <div class="account-info">
            <h3 style="margin-top: 0; color: white;">🎉 Votre compte a été créé avec succès !</h3>
            <p style="margin-bottom: 15px;">
                Votre compte d'apprentissage est maintenant actif avec les informations suivantes :
            </p>
            <ul style="margin: 0; padding-left: 20px;">
                <li><strong>Email :</strong> ${data.email}</li>
                ${data.username ? `<li><strong>Pseudo :</strong> ${data.username}</li>` : ''}
                <li><strong>Statut :</strong> Accès Premium Activé ✨</li>
            </ul>
        </div>
        ` : `
        <div class="account-info">
            <h3 style="margin-top: 0; color: white;">✅ Votre compte a été activé !</h3>
            <p style="margin: 0;">
                Votre accès premium à la Méthode ERPR est maintenant actif.
            </p>
        </div>
        `}

        <div style="text-align: center; margin: 40px 0;">
            <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/dashboard" class="cta-button">
                🚀 Commencer mon apprentissage
            </a>
        </div>

        <div class="support-info">
            <h4 style="margin-top: 0; color: #1976d2;">📞 Besoin d'aide ?</h4>
            <p style="margin-bottom: 10px;">
                Notre équipe pédagogique est là pour vous accompagner dans votre apprentissage.
            </p>
            <p style="margin: 0;">
                <strong>Support :</strong> arabeimportance@gmail.com<br>
                <strong>Réponse :</strong> Sous 24h maximum
            </p>
        </div>

        <div style="background: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107;">
            <h4 style="margin-top: 0; color: #856404;">💡 Conseil pour réussir</h4>
            <p style="margin: 0; color: #856404;">
                Pour de meilleurs résultats, consacrez <strong>30 minutes par jour</strong> à votre apprentissage. 
                La régularité est la clé du succès !
            </p>
        </div>

        <div class="footer">
            <p>
                <strong>Méthode ERPR</strong><br>
                Apprenez à lire et écrire l'arabe à votre rythme<br>
                Créé par Professeur Soidroudine
            </p>
            <p style="margin-top: 20px;">
                © ${new Date().getFullYear()} Tous droits réservés<br>
                Cet email a été envoyé à ${data.email}
            </p>
        </div>
    </div>
</body>
</html>
`;

// Template texte simple
const getReceiptTextTemplate = (data: PaymentData) => `
REÇU DE PAIEMENT - Méthode ERPR
==========================================

Merci pour votre achat !

DÉTAILS DE LA COMMANDE :
- Produit : Méthode ERPR - Cours d'arabe complet
- Email : ${data.email}
- Date : ${new Date().toLocaleDateString('fr-FR')}
- ID de transaction : ${data.sessionId.substring(0, 20)}...
- Montant total : ${(data.amount / 100).toFixed(2)} ${data.currency.toUpperCase()}

${data.isNewAccount ? `
COMPTE CRÉÉ AVEC SUCCÈS !
Votre compte d'apprentissage est maintenant actif :
- Email : ${data.email}
${data.username ? `- Pseudo : ${data.username}` : ''}
- Statut : Accès Premium Activé
` : `
COMPTE ACTIVÉ !
Votre accès premium à la Méthode ERPR est maintenant actif.
`}

Commencez votre apprentissage : ${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/dashboard

SUPPORT :
Email : arabeimportance@gmail.com
Réponse sous 24h maximum

Conseil : Consacrez 30 minutes par jour pour de meilleurs résultats !

© ${new Date().getFullYear()} Méthode ERPR - Tous droits réservés
Professeur Soidroudine
`;

// Fonction pour envoyer l'email de reçu
export async function sendPaymentReceiptEmail(data: PaymentData): Promise<boolean> {
    try {
        const pdfBytes: Uint8Array = await generateReceiptPDF(data);

        const mailOptions = {
            from: {
                name: 'Méthode ERPR',
                address: process.env.SMTP_FROM || process.env.SMTP_USER || 'arabeimportance@gmail.com'
            },
            to: data.email,
            subject: `✅ Reçu de paiement - Accès confirmé à la Méthode ERPR`,
            html: getReceiptTemplate(data),
            text: getReceiptTextTemplate(data),
            attachments: [
                {
                    filename: `recu-paiement-${Date.now()}.pdf`,
                    content: Buffer.from(pdfBytes),
                    contentType: 'application/pdf'
                }
            ]
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email de reçu envoyé avec succès:', info.messageId);
        return true;
    } catch (error) {
        console.error('Erreur lors de l\'envoi de l\'email de reçu:', error);
        return false;
    }
}

// Fonction pour envoyer un email de bienvenue (uniquement pour les nouveaux comptes)
export async function sendWelcomeEmail(email: string, username?: string): Promise<boolean> {
    try {
        const welcomeTemplate = `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Bienvenue dans la Méthode ERPR</title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #f8f9fa;
            }
            .container {
                background: white;
                border-radius: 12px;
                padding: 40px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            .header {
                text-align: center;
                margin-bottom: 40px;
            }
            .logo {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 15px 30px;
                border-radius: 8px;
                display: inline-block;
                font-size: 24px;
                font-weight: bold;
                margin-bottom: 20px;
            }
            .welcome-badge {
                background: #28a745;
                color: white;
                padding: 8px 20px;
                border-radius: 20px;
                font-size: 14px;
                font-weight: 600;
                display: inline-block;
            }
            .cta-button {
                background: #28a745;
                color: white;
                padding: 15px 30px;
                text-decoration: none;
                border-radius: 8px;
                display: inline-block;
                font-weight: bold;
                margin: 20px 0;
            }
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
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">📚 Méthode ERPR</div>
                <div class="welcome-badge">🎉 Bienvenue !</div>
            </div>

            <h1 style="color: #333; text-align: center; margin-bottom: 30px;">
                ${username ? `Bienvenue ${username} !` : 'Bienvenue dans votre parcours d\'apprentissage !'}
            </h1>

            <p style="font-size: 16px; margin-bottom: 30px;">
                Félicitations ! Vous venez de rejoindre des milliers d'étudiants qui apprennent 
                à lire et écrire l'arabe avec notre méthode éprouvée.
            </p>

            <div class="feature-list">
                <h3 style="margin-top: 0; color: #333;">🎯 Ce qui vous attend :</h3>
                <div class="feature-item">
                    <strong>10 chapitres progressifs</strong> - De l'alphabet aux règles avancées
                </div>
                <div class="feature-item">
                    <strong>Quiz interactifs</strong> - Testez vos connaissances à chaque étape
                </div>
                <div class="feature-item">
                    <strong>Suivi de progression</strong> - Visualisez vos progrès en temps réel
                </div>
                <div class="feature-item">
                    <strong>Exercices d'écriture</strong> - Téléchargez et imprimez vos supports
                </div>
                <div class="feature-item">
                    <strong>Support pédagogique numérique</strong> - Notre équipe vous accompagne
                </div>
            </div>

            <div style="text-align: center; margin: 40px 0;">
                <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/dashboard" class="cta-button">
                    🚀 Commencer maintenant
                </a>
            </div>

            <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2196f3;">
                <h4 style="margin-top: 0; color: #1976d2;">💡 Conseil de votre professeur</h4>
                <p style="margin: 0; color: #1976d2;">
                    "La clé du succès dans l'apprentissage de l'arabe est la régularité. 
                    Consacrez 30 minutes par jour, et vous serez surpris de vos progrès !"
                </p>
                <p style="margin: 10px 0 0 0; font-style: italic; color: #1976d2;">
                    - Professeur Soidroudine
                </p>
            </div>

            <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e9ecef; color: #6c757d; font-size: 14px;">
                <p>
                    <strong>Méthode ERPR</strong><br>
                    Apprenez à lire et écrire l'arabe à votre rythme
                </p>
                <p style="margin-top: 20px;">
                    Besoin d'aide ? Contactez-nous : arabeimportance@gmail.com
                </p>
            </div>
        </div>
    </body>
    </html>
    `;

        const mailOptions = {
            from: {
                name: 'Méthode ERPR',
                address: process.env.SMTP_FROM || process.env.SMTP_USER || 'arabeimportance@gmail.com'
            },
            to: email,
            subject: `🎉 Bienvenue dans la Méthode ERPR !`,
            html: welcomeTemplate,
            text: `
Bienvenue dans la Méthode ERPR !

${username ? `Bonjour ${username},` : 'Bonjour,'}

Félicitations ! Vous venez de rejoindre nos étudiants qui apprennent à lire et écrire l'arabe avec notre méthode.

CE QUI VOUS ATTEND :
✅ 11 chapitres progressifs : de l'alphabet aux règles avancées
✅ Quiz interactifs : testez vos connaissances à chaque étape
✅ Suivi de progression : visualisez vos progrès en temps réel
✅ Exercices d'écriture : téléchargez et imprimez vos supports
✅ Support pédagogique : notre équipe vous accompagne

Commencez maintenant : ${process.env.NEXTAUTH_URL || 'https://methode-erpr-v1.vercel.app'}/dashboard

CONSEIL DE VOTRE PROFESSEUR :
"La clé du succès dans l'apprentissage de l'arabe est la régularité. Consacrez 30 minutes par jour, et vous serez surpris de vos progrès !"
— Professeur Soidroudine

Besoin d'aide ? Contactez-nous : arabeimportance@gmail.com

© ${new Date().getFullYear()} Méthode ERPR - Tous droits réservés
      `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email de bienvenue envoyé avec succès:', info.messageId);
        return true;
    } catch (error) {
        console.error('Erreur lors de l\'envoi de l\'email de bienvenue:', error);
        return false;
    }
}

// Fonction pour tester la configuration email
export async function testEmailConfiguration(): Promise<boolean> {
    try {
        await transporter.verify();
        console.log('Configuration email valide');
        return true;
    } catch (error) {
        console.error('Erreur de configuration email:', error);
        return false;
    }
}

// Fonction pour envoyer un email de réinitialisation de mot de passe
export async function sendPasswordResetEmail(email: string, resetToken: string, username?: string): Promise<boolean> {
    try {
        const resetUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;

        const resetTemplate = `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Réinitialisation de votre mot de passe</title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #f8f9fa;
            }
            .container {
                background: white;
                border-radius: 12px;
                padding: 40px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            .header {
                text-align: center;
                margin-bottom: 40px;
            }
            .logo {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 15px 30px;
                border-radius: 8px;
                display: inline-block;
                font-size: 24px;
                font-weight: bold;
                margin-bottom: 20px;
            }
            .reset-badge {
                background: #ffc107;
                color: #212529;
                padding: 8px 20px;
                border-radius: 20px;
                font-size: 14px;
                font-weight: 600;
                display: inline-block;
            }
            .cta-button {
                background: #dc3545;
                color: white;
                padding: 15px 30px;
                text-decoration: none;
                border-radius: 8px;
                display: inline-block;
                font-weight: bold;
                margin: 20px 0;
            }
            .warning-box {
                background: #fff3cd;
                border: 1px solid #ffeaa7;
                border-radius: 8px;
                padding: 20px;
                margin: 30px 0;
            }
            .security-info {
                background: #e3f2fd;
                padding: 20px;
                border-radius: 8px;
                margin: 20px 0;
                border-left: 4px solid #2196f3;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">📚 Méthode ERPR</div>
                <div class="reset-badge">🔐 Réinitialisation</div>
            </div>

            <h1 style="color: #333; text-align: center; margin-bottom: 30px;">
                Réinitialisation de votre mot de passe
            </h1>

            <p style="font-size: 16px; margin-bottom: 30px;">
                ${username ? `Bonjour ${username},` : 'Bonjour,'}<br><br>
                Vous avez demandé la réinitialisation de votre mot de passe pour votre compte 
                sur la Méthode ERPR.
            </p>

            <div class="warning-box">
                <h4 style="margin-top: 0; color: #856404;">⚠️ Important</h4>
                <p style="margin: 0; color: #856404;">
                    Si vous n'avez pas demandé cette réinitialisation, ignorez cet email. 
                    Votre mot de passe actuel restera inchangé.
                </p>
            </div>

            <div style="text-align: center; margin: 40px 0;">
                <a href="${resetUrl}" class="cta-button">
                    🔑 Réinitialiser mon mot de passe
                </a>
            </div>

            <div class="security-info">
                <h4 style="margin-top: 0; color: #1976d2;">🔒 Informations de sécurité</h4>
                <ul style="margin: 0; padding-left: 20px; color: #1976d2;">
                    <li>Ce lien est valide pendant <strong>1 heure</strong> seulement</li>
                    <li>Il ne peut être utilisé qu'une seule fois</li>
                    <li>Votre nouveau mot de passe doit contenir au moins 8 caractères</li>
                </ul>
            </div>

            <p style="font-size: 14px; color: #6c757d; margin-top: 30px;">
                Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre navigateur :<br>
                <a href="${resetUrl}" style="color: #007bff; word-break: break-all;">${resetUrl}</a>
            </p>

            <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e9ecef; color: #6c757d; font-size: 14px;">
                <p>
                    <strong>Méthode ERPR</strong><br>
                    Apprenez à lire et écrire l'arabe à votre rythme
                </p>
                <p style="margin-top: 20px;">
                    Besoin d'aide ? Contactez-nous : arabeimportance@gmail.com
                </p>
            </div>
        </div>
    </body>
    </html>
    `;

        const mailOptions = {
            from: {
                name: 'Méthode ERPR',
                address: process.env.SMTP_FROM || process.env.SMTP_USER || 'arabeimportance@gmail.com'
            },
            to: email,
            subject: `🔐 Réinitialisation de votre mot de passe - Méthode ERPR`,
            html: resetTemplate,
            text: `
Réinitialisation de votre mot de passe - Méthode ERPR

${username ? `Bonjour ${username},` : 'Bonjour,'}

Vous avez demandé la réinitialisation de votre mot de passe pour votre compte sur la Méthode ERPR.

IMPORTANT : Si vous n'avez pas demandé cette réinitialisation, ignorez cet email. Votre mot de passe actuel restera inchangé.

Pour réinitialiser votre mot de passe, cliquez sur le lien suivant :
${resetUrl}

INFORMATIONS DE SÉCURITÉ :
- Ce lien est valide pendant 1 heure seulement
- Il ne peut être utilisé qu'une seule fois
- Votre nouveau mot de passe doit contenir au moins 8 caractères

Besoin d'aide ? Contactez-nous : arabeimportance@gmail.com

© ${new Date().getFullYear()} Méthode ERPR - Tous droits réservés
      `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Email de réinitialisation envoyé avec succès:', info.messageId);
        return true;
    } catch (error) {
        console.error('❌ Erreur lors de l\'envoi de l\'email de réinitialisation:', error);
        return false;
    }
}

// Fonction pour envoyer un email de confirmation de changement d'email
export async function sendEmailChangeConfirmation(newEmail: string, username?: string): Promise<boolean> {
    try {
        const confirmationTemplate = `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Confirmation de changement d'email - Méthode ERPR</title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #f8f9fa;
            }
            .container {
                background: white;
                border-radius: 12px;
                padding: 40px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            .header {
                text-align: center;
                margin-bottom: 40px;
                padding-bottom: 20px;
                border-bottom: 2px solid #e9ecef;
            }
            .logo {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 15px 30px;
                border-radius: 8px;
                display: inline-block;
                font-size: 24px;
                font-weight: bold;
                margin-bottom: 20px;
            }
            .success-badge {
                background: #28a745;
                color: white;
                padding: 8px 20px;
                border-radius: 20px;
                font-size: 14px;
                font-weight: 600;
                display: inline-block;
            }
            .info-box {
                background: #e3f2fd;
                padding: 20px;
                border-radius: 8px;
                margin: 20px 0;
                border-left: 4px solid #2196f3;
            }
            .footer {
                text-align: center;
                margin-top: 40px;
                padding-top: 20px;
                border-top: 1px solid #e9ecef;
                color: #6c757d;
                font-size: 14px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">📚 Méthode ERPR</div>
                <div class="success-badge">✅ Email modifié</div>
            </div>

            <h1 style="color: #333; text-align: center; margin-bottom: 30px;">
                Votre email a été modifié avec succès
            </h1>

            <p style="font-size: 16px; margin-bottom: 30px;">
                ${username ? `Bonjour ${username},` : 'Bonjour,'}
            </p>

            <p style="font-size: 16px; margin-bottom: 30px;">
                Nous vous confirmons que l'adresse email de votre compte Méthode ERPR a été modifiée avec succès.
            </p>

            <div class="info-box">
                <h4 style="margin-top: 0; color: #1976d2;">📧 Nouvelle adresse email</h4>
                <p style="margin: 0;">
                    <strong>${newEmail}</strong>
                </p>
            </div>

            <p style="font-size: 16px; margin: 30px 0;">
                Cette modification a été effectuée le <strong>${new Date().toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })}</strong>.
            </p>

            <div style="background: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107;">
                <h4 style="margin-top: 0; color: #856404;">🔒 Sécurité</h4>
                <p style="margin: 0; color: #856404;">
                    Si vous n'avez pas effectué cette modification, contactez immédiatement notre support à 
                    <strong>arabeimportance@gmail.com</strong>
                </p>
            </div>

            <div class="footer">
                <p>
                    <strong>Méthode ERPR</strong><br>
                    Apprenez à lire et écrire l'arabe à votre rythme<br>
                    Créé par Professeur Soidroudine
                </p>
                <p style="margin-top: 20px;">
                    © ${new Date().getFullYear()} Tous droits réservés
                </p>
            </div>
        </div>
    </body>
    </html>
    `;
        const mailOptions = {
            from: {
                name: 'Méthode ERPR',
                address: process.env.SMTP_FROM || process.env.SMTP_USER || 'arabeimportance@gmail.com'
            },
            to: newEmail,
            subject: `✅ Confirmation de changement d'email - Méthode ERPR`,
            html: confirmationTemplate,
            text: `
Confirmation de changement d'email - Méthode ERPR

${username ? `Bonjour ${username},` : 'Bonjour,'}

Nous vous confirmons que l'adresse email de votre compte Méthode ERPR a été modifiée avec succès.

Nouvelle adresse email : ${newEmail}

Cette modification a été effectuée le ${new Date().toLocaleDateString('fr-FR')}.

SÉCURITÉ : Si vous n'avez pas effectué cette modification, contactez immédiatement notre support à arabeimportance@gmail.com

© ${new Date().getFullYear()} Méthode ERPR - Tous droits réservés
      `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Email de notification de changement envoyé avec succès:', info.messageId);
        return true;
    } catch (error) {
        console.error('❌ Erreur lors de l\'envoi de l\'email de notification de changement:', error);
        return false;
    }
}

function generatePDF(data: PaymentData) {
    throw new Error('Function not implemented.');
}

