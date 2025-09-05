import nodemailer from 'nodemailer';

// === Configuration SMTP (toujours présente en haut du fichier) ===
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

// === Ta fonction refactorisée ===
export async function sendWelcomeEmail(email: string, username?: string): Promise<boolean> {
    try {
        const welcomeText = `Bienvenue ${username || ''} !`;
        const dashboardUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/dashboard`;

        const welcomeTemplate = `
        <!DOCTYPE html>
        <html lang="fr">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${welcomeText} - Méthode ERPR</title>
        </head>
        <body>
            <h1>🎉 ${welcomeText}</h1>
            <p>Félicitations ! Vous venez de rejoindre ...</p>
            <p>🚀 Commencez maintenant : <a href="${dashboardUrl}">Accéder à mon tableau de bord</a></p>
            <p>Conseil : Consacrez 30 minutes par jour pour progresser rapidement !</p>
        </body>
        </html>
        `;

        const mailOptions = {
            from: {
                name: 'Méthode ERPR',
                address: process.env.SMTP_FROM || process.env.SMTP_USER || 'arabeimportance@gmail.com'
            },
            to: email,
            subject: `🎉 ${welcomeText} - Méthode ERPR`,
            html: welcomeTemplate,
            text: `${welcomeText}\n\nFélicitations ! ...\n${dashboardUrl}`
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email de bienvenue envoyé avec succès:', info.messageId);
        return true;
    } catch (error) {
        console.error("Erreur lors de l'envoi de l'email de bienvenue:", error);
        return false;
    }
}
