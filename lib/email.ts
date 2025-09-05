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

// Variables communes réutilisables
const SENDER_INFO = {
    name: 'Méthode ERPR',
    address: process.env.SMTP_FROM || process.env.SMTP_USER || 'arabeimportance@gmail.com'
};

const BASE_URL = process.env.NEXTAUTH_URL || 'http://localhost:3000';

// Styles CSS pour les emails
const getEmailStyles = () => `
<style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }
    
    body {
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        line-height: 1.6;
        color: #333333;
        background-color: #f8fafc;
    }
    
    .email-container {
        max-width: 600px;
        margin: 0 auto;
        background: linear-gradient(135deg);
        padding: 2px;
        border-radius: 16px;
    }
    
    .email-content {
        background: white;
        border-radius: 14px;
        overflow: hidden;
    }
    
    .header {
        background: linear-gradient(135deg );
        color: white;
        padding: 40px 30px;
        text-align: center;
        position: relative;
    }
    
    .header::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="%23ffffff" opacity="0.1"/><circle cx="75" cy="75" r="1" fill="%23ffffff" opacity="0.1"/></pattern></defs><rect width="100%" height="100%" fill="url(%23grain)"/></svg>');
        opacity: 0.3;
    }
    
    .header h1 {
        font-size: 28px;
        font-weight: 700;
        margin-bottom: 10px;
        position: relative;
        z-index: 1;
    }
    
    .header .subtitle {
        font-size: 16px;
        opacity: 0.9;
        position: relative;
        z-index: 1;
    }
    
    .main-content {
        padding: 40px 30px;
    }
    
    .welcome-message {
        text-align: center;
        margin-bottom: 30px;
    }
    
    .welcome-message h2 {
        color: #1e293b;
        font-size: 24px;
        font-weight: 600;
        margin-bottom: 15px;
    }
    
    .welcome-message p {
        color: #64748b;
        font-size: 16px;
        line-height: 1.7;
    }
    
    .features-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 20px;
        margin: 30px 0;
    }
    
    .feature-card {
        background: #f8fafc;
        border: 2px solid #e2e8f0;
        border-radius: 12px;
        padding: 24px;
        text-align: center;
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
    }
    
    .feature-card:hover {
        border-color: #667eea;
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(102, 126, 234, 0.15);
    }
    
    .feature-icon {
        font-size: 32px;
        margin-bottom: 12px;
        display: block;
    }
    
    .feature-title {
        color: #1e293b;
        font-size: 16px;
        font-weight: 600;
        margin-bottom: 8px;
    }
    
    .feature-description {
        color: #64748b;
        font-size: 14px;
        line-height: 1.5;
    }
    
    .highlight-number {
        color: #667eea;
        font-weight: 700;
    }
    
    .cta-section {
        text-align: center;
        margin: 40px 0;
        padding: 30px;
        background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
        border-radius: 16px;
        border: 1px solid #e2e8f0;
    }
    
    .cta-button {
        display: inline-block;
        background: linear-gradient(135deg, );
        color: white;
        text-decoration: none;
        padding: 16px 32px;
        border-radius: 12px;
        font-weight: 600;
        font-size: 16px;
        transition: all 0.3s ease;
        box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
    }
    
    .cta-button:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
    }
    
    .discipline-tip {
        background: #fef3c7;
        border: 2px solid #f59e0b;
        border-radius: 12px;
        padding: 20px;
        margin: 30px 0;
        text-align: center;
    }
    
    .discipline-tip .icon {
        font-size: 24px;
        margin-bottom: 10px;
    }
    
    .discipline-tip h3 {
        color: #92400e;
        font-size: 18px;
        font-weight: 600;
        margin-bottom: 10px;
    }
    
    .discipline-tip p {
        color: #a16207;
        font-size: 14px;
        font-weight: 500;
    }
    
    .whatsapp-support {
        background: linear-gradient(135deg, #25d366 0%, #128c7e 100%);
        color: white;
        padding: 20px;
        border-radius: 12px;
        text-align: center;
        margin: 20px 0;
    }
    
    .whatsapp-support .icon {
        font-size: 28px;
        margin-bottom: 10px;
    }
    
    .footer {
        background: #1e293b;
        color: #94a3b8;
        padding: 30px;
        text-align: center;
        border-radius: 0 0 14px 14px;
    }
    
    .footer a {
        color: #667eea;
        text-decoration: none;
    }
    
    .stats-highlight {
        background: linear-gradient(135deg, #ecfdf5 0%, #f0fdf4 100%);
        border: 2px solid #10b981;
        border-radius: 12px;
        padding: 20px;
        text-align: center;
        margin: 20px 0;
    }
    
    .stats-highlight .big-number {
        font-size: 32px;
        font-weight: 700;
        color: #059669;
        display: block;
    }
    
    @media (max-width: 600px) {
        .email-container {
            margin: 10px;
        }
        
        .header {
            padding: 30px 20px;
        }
        
        .main-content {
            padding: 30px 20px;
        }
        
        .features-grid {
            grid-template-columns: 1fr;
        }
        
        .header h1 {
            font-size: 24px;
        }
    }
</style>
`;

const getWelcomeGreeting = (username?: string, context: 'welcome' | 'reset' | 'change' = 'welcome') => {
    const greetings = {
        welcome: `🎉 Bienvenue ${username || ''} !`,
        reset: `Bonjour ${username || ''}`,
        change: `Bonjour ${username || ''}`
    };
    return greetings[context];
};

// Template principal pour l'email de bienvenue
const createWelcomeEmailTemplate = (username?: string) => {
    const welcomeGreeting = getWelcomeGreeting(username, 'welcome');
    
    return `
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
                <!-- Header -->
                <div class="header">
                    <h1>✨ Méthode ERPR</h1>
                    <p class="subtitle">Excellence • Rigueur • Progression • Résultats</p>
                </div>
                
                <!-- Main Content -->
                <div class="main-content">
                    <div class="welcome-message">
                        <h2>${welcomeGreeting}</h2>
                        <p>Félicitations ! Vous venez de rejoindre des milliers d'étudiants qui maîtrisent l'arabe grâce à notre méthode révolutionnaire.</p>
                    </div>
                    
                    <!-- Stats Highlight -->
                    <div class="stats-highlight">
                        <span class="big-number">630+</span>
                        <p><strong>Audios intégrés</strong> pour une immersion totale</p>
                    </div>
                    
                    <!-- Features Grid -->
                    <div class="features-grid">
                        <div class="feature-card">
                            <span class="feature-icon">📚</span>
                            <div class="feature-title"><span class="highlight-number">10</span> Chapitres Complets</div>
                            <div class="feature-description">Programme structuré progressif du niveau débutant à avancé</div>
                        </div>
                        
                        <div class="feature-card">
                            <span class="feature-icon">🎯</span>
                            <div class="feature-title">Quiz Automatisés</div>
                            <div class="feature-description">Évaluations intelligentes pour tester vos acquis en temps réel</div>
                        </div>
                        
                        <div class="feature-card">
                            <span class="feature-icon">📊</span>
                            <div class="feature-title">Suivi de Progression</div>
                            <div class="feature-description">Visualisez vos progrès avec des graphiques détaillés</div>
                        </div>
                        
                        <div class="feature-card">
                            <span class="feature-icon">⏱️</span>
                            <div class="feature-title">Suivi Temps d'Étude</div>
                            <div class="feature-description">Graphiques hebdomadaires et mensuels de votre activité</div>
                        </div>
                        
                        <div class="feature-card">
                            <span class="feature-icon">🔊</span>
                            <div class="feature-title">Support Numérique</div>
                            <div class="feature-description">Plus de <span class="highlight-number">630 audios</span> haute qualité intégrés</div>
                        </div>
                        
                        <div class="feature-card">
                            <span class="feature-icon">📝</span>
                            <div class="feature-title">Devoirs Automatisés</div>
                            <div class="feature-description">Exercices personnalisés envoyés automatiquement</div>
                        </div>
                    </div>
                    
                    <!-- WhatsApp Support -->
                    <div class="whatsapp-support">
                        <span class="icon">💬</span>
                        <h3>Accompagnement WhatsApp</h3>
                        <p>Support personnalisé et conseils pour maintenir votre discipline d'apprentissage</p>
                    </div>
                    
                    <!-- Discipline Tip -->
                    <div class="discipline-tip">
                        <span class="icon">💪</span>
                        <h3>Conseil de Discipline</h3>
                        <p><strong>La régularité est la clé du succès !</strong><br>
                        Consacrez 30 minutes par jour, de préférence à la même heure, pour créer une habitude durable.</p>
                    </div>
                    
                    <!-- CTA Section -->
                    <div class="cta-section">
                        <h3 style="color: #1e293b; margin-bottom: 15px;">Prêt à commencer votre voyage ?</h3>
                        <a href="${BASE_URL}/dashboard" class="cta-button">
                            🚀 Accéder à mon tableau de bord
                        </a>
                        <p style="margin-top: 15px; color: #64748b; font-size: 14px;">
                            Votre progression commence maintenant !
                        </p>
                    </div>
                </div>
                
                <!-- Footer -->
                <div class="footer">
                    <p><strong>Méthode ERPR</strong> - Excellence dans l'apprentissage de l'arabe</p>
                    <p style="margin-top: 10px;">
                        <a href="${BASE_URL}/profile">Mon profil</a> • 
                        <a href="${BASE_URL}/support">Support</a> • 
                        <a href="${BASE_URL}/progress">Ma progression</a>
                    </p>
                    <p style="margin-top: 15px; font-size: 12px;">
                        Vous recevez cet email car vous vous êtes inscrit à la Méthode ERPR.<br>
                        <a href="${BASE_URL}/unsubscribe">Se désabonner</a>
                    </p>
                </div>
            </div>
        </div>
    </body>
    </html>
    `;
};

// Fonction pour envoyer un email de bienvenue avec le nouveau design
export async function sendWelcomeEmail(email: string, username?: string): Promise<boolean> {
    try {
        const welcomeTemplate = createWelcomeEmailTemplate(username);

        const mailOptions = {
            from: SENDER_INFO,
            to: email,
            subject: `🎉 Bienvenue dans la Méthode ERPR - Votre parcours d'excellence commence !`,
            html: welcomeTemplate,
            text: `
${getWelcomeGreeting(username, 'welcome')}

Félicitations ! Vous venez de rejoindre la Méthode ERPR.

🎯 Votre plateforme d'apprentissage inclut :
• 10 chapitres complets progressifs
• Quiz automatisés intelligents  
• Suivi de progression avec graphiques
• Suivi temps d'étude (hebdomadaire/mensuel)
• Plus de 630 audios intégrés
• Devoirs automatisés personnalisés
• Accompagnement WhatsApp avec conseils de discipline

💪 Conseil de discipline : Consacrez 30 minutes par jour à la même heure pour créer une habitude durable.

🚀 Commencez maintenant : ${BASE_URL}/dashboard

La régularité est la clé du succès !
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

// Template pour email de réinitialisation avec le nouveau design
const createResetPasswordTemplate = (resetUrl: string, username?: string) => {
    const greeting = getWelcomeGreeting(username, 'reset');
    
    return `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Réinitialisation de mot de passe - Méthode ERPR</title>
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
                    <div class="welcome-message">
                        <h2>${greeting}</h2>
                        <p>Vous avez demandé la réinitialisation de votre mot de passe pour votre compte Méthode ERPR.</p>
                    </div>
                    
                    <div class="cta-section">
                        <h3 style="color: #1e293b; margin-bottom: 15px;">Réinitialisez votre mot de passe</h3>
                        <a href="${resetUrl}" class="cta-button">
                            🔐 Réinitialiser mon mot de passe
                        </a>
                        <p style="margin-top: 15px; color: #dc2626; font-size: 14px; font-weight: 600;">
                            ⚠️ Ce lien est valide pendant 1 heure seulement
                        </p>
                    </div>
                    
                    <div class="discipline-tip">
                        <span class="icon">🛡️</span>
                        <h3>Conseil de Sécurité</h3>
                        <p>Choisissez un mot de passe fort avec au moins 8 caractères, incluant majuscules, minuscules et chiffres.</p>
                    </div>
                </div>
                
                <div class="footer">
                    <p><strong>Méthode ERPR</strong> - Votre sécurité est notre priorité</p>
                    <p style="margin-top: 10px;">
                        Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.
                    </p>
                </div>
            </div>
        </div>
    </body>
    </html>
    `;
};

// Fonction pour envoyer un email de réinitialisation de mot de passe
export async function sendPasswordResetEmail(email: string, resetToken: string, username?: string): Promise<boolean> {
    try {
        const resetUrl = `${BASE_URL}/reset-password?token=${resetToken}`;
        const resetTemplate = createResetPasswordTemplate(resetUrl, username);

        const mailOptions = {
            from: SENDER_INFO,
            to: email,
            subject: `🔐 Réinitialisation de votre mot de passe - Méthode ERPR`,
            html: resetTemplate,
            text: `${getWelcomeGreeting(username, 'reset')},

Vous avez demandé la réinitialisation de votre mot de passe.

Cliquez sur ce lien pour réinitialiser votre mot de passe :
${resetUrl}

⚠️ Ce lien est valable 1h seulement.

Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.`
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email de réinitialisation envoyé:', info.messageId);
        return true;
    } catch (error) {
        console.error("Erreur lors de l'envoi de l'email de réinitialisation:", error);
        return false;
    }
}

// Template pour confirmation de changement d'email
const createEmailChangeTemplate = (newEmail: string, username?: string) => {
    const greeting = getWelcomeGreeting(username, 'change');
    
    return `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Changement d'email confirmé - Méthode ERPR</title>
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
                    <div class="welcome-message">
                        <h2>${greeting}</h2>
                        <p>Votre adresse email a été mise à jour avec succès dans votre compte Méthode ERPR.</p>
                    </div>
                    
                    <div class="stats-highlight">
                        <span style="font-size: 16px; color: #059669;">📧 Nouvel email</span>
                        <p><strong>${newEmail}</strong></p>
                    </div>
                    
                    <div class="cta-section">
                        <h3 style="color: #1e293b; margin-bottom: 15px;">Continuez votre apprentissage</h3>
                        <a href="${BASE_URL}/dashboard" class="cta-button">
                            📚 Retour au tableau de bord
                        </a>
                    </div>
                </div>
                
                <div class="footer">
                    <p><strong>Méthode ERPR</strong> - Votre parcours d'apprentissage continue</p>
                </div>
            </div>
        </div>
    </body>
    </html>
    `;
};

// Fonction pour envoyer un email de confirmation de changement d'email
export async function sendEmailChangeConfirmation(newEmail: string, username?: string): Promise<boolean> {
    try {
        const confirmationTemplate = createEmailChangeTemplate(newEmail, username);

        const mailOptions = {
            from: SENDER_INFO,
            to: newEmail,
            subject: `✅ Confirmation de changement d'email - Méthode ERPR`,
            html: confirmationTemplate,
            text: `${getWelcomeGreeting(username, 'change')},

Votre adresse email a été mise à jour avec succès.
Nouvel email : ${newEmail}

Continuez votre apprentissage : ${BASE_URL}/dashboard`
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email de confirmation envoyé:', info.messageId);
        return true;
    } catch (error) {
        console.error("Erreur lors de l'envoi de l'email de confirmation:", error);
        return false;
    }
}