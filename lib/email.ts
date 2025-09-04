import nodemailer from 'nodemailer';

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
    </head>
    <body>
        <h1>🎉 Bienvenue ${username || ''} !</h1>
        <p>
            Félicitations ! Vous venez de rejoindre des milliers d'étudiants qui apprennent 
            à lire et écrire l'arabe avec notre méthode.
        </p>
        <p>
            🚀 Commencez maintenant : 
            <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/dashboard">
                Accéder à mon tableau de bord
            </a>
        </p>
        <p>
            Conseil : Consacrez 30 minutes par jour pour progresser rapidement !
        </p>
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
Bienvenue ${username || ''} !

Félicitations ! Vous venez de rejoindre la Méthode ERPR.
Commencez maintenant : ${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/dashboard

Conseil : Consacrez 30 minutes par jour pour progresser rapidement.
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email de bienvenue envoyé avec succès:', info.messageId);
        return true;
    } catch (error) {
        console.error("Erreur lors de l'envoi de l'email de bienvenue:", error);
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
        <h1>🔐 Réinitialisation de mot de passe</h1>
        <p>Bonjour ${username || ''},</p>
        <p>Cliquez sur le lien ci-dessous pour réinitialiser votre mot de passe :</p>
        <a href="${resetUrl}">Réinitialiser mon mot de passe</a>
        <p>⚠️ Ce lien est valide 1h seulement.</p>
        `;

        const mailOptions = {
            from: {
                name: 'Méthode ERPR',
                address: process.env.SMTP_FROM || process.env.SMTP_USER || 'arabeimportance@gmail.com'
            },
            to: email,
            subject: `🔐 Réinitialisation de votre mot de passe - Méthode ERPR`,
            html: resetTemplate,
            text: `Bonjour ${username || ''},

Cliquez sur ce lien pour réinitialiser votre mot de passe :
${resetUrl}

⚠️ Ce lien est valable 1h seulement.`
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email de réinitialisation envoyé:', info.messageId);
        return true;
    } catch (error) {
        console.error("Erreur lors de l'envoi de l'email de réinitialisation:", error);
        return false;
    }
}

// Fonction pour envoyer un email de confirmation de changement d'email
export async function sendEmailChangeConfirmation(newEmail: string, username?: string): Promise<boolean> {
    try {
        const confirmationTemplate = `
        <h1>✅ Changement d'email confirmé</h1>
        <p>Bonjour ${username || ''},</p>
        <p>Votre adresse email a été mise à jour avec succès.</p>
        <p>Nouvel email : ${newEmail}</p>
        `;

        const mailOptions = {
            from: {
                name: 'Méthode ERPR',
                address: process.env.SMTP_FROM || process.env.SMTP_USER || 'arabeimportance@gmail.com'
            },
            to: newEmail,
            subject: `✅ Confirmation de changement d'email - Méthode ERPR`,
            html: confirmationTemplate,
            text: `Bonjour ${username || ''},

Votre adresse email a été mise à jour avec succès.
Nouvel email : ${newEmail}`
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email de confirmation envoyé:', info.messageId);
        return true;
    } catch (error) {
        console.error("Erreur lors de l'envoi de l'email de confirmation:", error);
        return false;
    }
}
