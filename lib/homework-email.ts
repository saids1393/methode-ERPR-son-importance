import nodemailer from 'nodemailer';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { prisma } from './prisma';

// Configuration du transporteur email (réutilise la config existante)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

interface HomeworkData {
  id: string;
  chapterId: number;
  title: string;
  content: string;
}

interface UserData {
  id: string;
  email: string;
  username: string | null;
  gender: 'HOMME' | 'FEMME' | null;
}

// Générer le PDF du devoir
export async function generateHomeworkPDF(homework: HomeworkData): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]); // Format A4
  const { width, height } = page.getSize();
  
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  
  const fontSize = 12;
  const titleFontSize = 18;
  const margin = 50;
  let y = height - margin;

  // En-tête
  page.drawText('MÉTHODE ERPR - DEVOIR', {
    x: margin,
    y,
    size: titleFontSize,
    font: boldFont,
    color: rgb(0.2, 0.2, 0.8)
  });
  y -= 30;

  page.drawText(`Chapitre ${homework.chapterId}`, {
    x: margin,
    y,
    size: fontSize + 2,
    font: boldFont,
    color: rgb(0.4, 0.4, 0.4)
  });
  y -= 40;

  // Titre du devoir
  page.drawText(homework.title, {
    x: margin,
    y,
    size: titleFontSize - 2,
    font: boldFont,
    color: rgb(0.1, 0.1, 0.1)
  });
  y -= 40;

  // Contenu avec gestion des sauts de ligne
  const lines = homework.content.split('\n');
  for (const line of lines) {
    if (y < 100) {
      // Nouvelle page si nécessaire
      const newPage = pdfDoc.addPage([595, 842]);
      y = height - margin;
    }

    if (line.trim()) {
      // Découper les lignes trop longues
      const maxWidth = width - 2 * margin;
      const words = line.split(' ');
      let currentLine = '';
      
      for (const word of words) {
        const testLine = currentLine ? `${currentLine} ${word}` : word;
        const textWidth = font.widthOfTextAtSize(testLine, fontSize);
        
        if (textWidth > maxWidth && currentLine) {
          // Écrire la ligne actuelle
          page.drawText(currentLine, {
            x: margin,
            y,
            size: fontSize,
            font
          });
          y -= 20;
          currentLine = word;
        } else {
          currentLine = testLine;
        }
      }
      
      // Écrire la dernière ligne
      if (currentLine) {
        page.drawText(currentLine, {
          x: margin,
          y,
          size: fontSize,
          font
        });
        y -= 20;
      }
    } else {
      // Ligne vide
      y -= 15;
    }
  }

  // Pied de page
  y = 50;
  page.drawText(`Généré le ${new Date().toLocaleDateString('fr-FR')} - Méthode ERPR`, {
    x: margin,
    y,
    size: 10,
    font,
    color: rgb(0.5, 0.5, 0.5)
  });

  return await pdfDoc.save();
}

// Template HTML pour l'email de devoir
const getHomeworkEmailTemplate = (homework: HomeworkData, user: UserData) => `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nouveau devoir - Chapitre ${homework.chapterId}</title>
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
        .homework-badge {
            background: #28a745;
            color: white;
            padding: 8px 20px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 600;
            display: inline-block;
        }
        .homework-details {
            background: #f8f9fa;
            padding: 25px;
            border-radius: 8px;
            margin: 30px 0;
        }
        .homework-content {
            background: #fff;
            border: 1px solid #e9ecef;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
            white-space: pre-line;
            line-height: 1.8;
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
        .tips-box {
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
            <div class="homework-badge">📝 Nouveau devoir disponible</div>
        </div>

        <h1 style="color: #333; text-align: center; margin-bottom: 30px;">
            ${user.username ? `Félicitations ${user.username} !` : 'Félicitations !'}
        </h1>

        <p style="font-size: 16px; margin-bottom: 30px;">
            Vous venez de terminer le chapitre ${homework.chapterId} ! 
            Voici votre devoir pour consolider vos acquis et approfondir votre apprentissage.
        </p>

        <div class="homework-details">
            <h3 style="margin-top: 0; color: #333;">📋 Détails du devoir</h3>
            <div style="margin-bottom: 15px;">
                <strong>Chapitre :</strong> ${homework.chapterId}
            </div>
            <div style="margin-bottom: 15px;">
                <strong>Titre :</strong> ${homework.title}
            </div>
            <div style="margin-bottom: 15px;">
                <strong>Date d'envoi :</strong> ${new Date().toLocaleDateString('fr-FR', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                })}
            </div>
        </div>

        <div class="homework-content">
            <h4 style="color: #333; margin-top: 0;">📖 Contenu du devoir :</h4>
            ${homework.content}
        </div>

        <div style="text-align: center; margin: 40px 0;">
            <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/dashboard" class="cta-button">
                🚀 Continuer mon apprentissage
            </a>
        </div>

        <div class="tips-box">
            <h4 style="margin-top: 0; color: #1976d2;">💡 Conseils pour réussir</h4>
            <ul style="margin: 0; padding-left: 20px; color: #1976d2;">
                <li>Prenez votre temps pour bien comprendre chaque exercice</li>
                <li>N'hésitez pas à relire le chapitre si nécessaire</li>
                <li>Pratiquez régulièrement pour mémoriser durablement</li>
                <li>Contactez le support si vous avez des questions</li>
            </ul>
        </div>

        <div class="footer">
            <p>
                <strong>Méthode ERPR</strong><br>
                Apprenez à lire et écrire l'arabe à votre rythme<br>
                Créé par Professeur Soidroudine
            </p>
            <p style="margin-top: 20px;">
                Besoin d'aide ? Contactez-nous : support@sonimportance.com<br>
                © ${new Date().getFullYear()} Tous droits réservés
            </p>
        </div>
    </div>
</body>
</html>
`;

// Fonction pour envoyer un devoir par email
export async function sendHomeworkEmail(homework: HomeworkData, user: UserData): Promise<boolean> {
  try {
    // Générer le PDF du devoir
    const pdfBytes = await generateHomeworkPDF(homework);

    const mailOptions = {
      from: {
        name: 'Méthode ERPR',
        address: process.env.SMTP_FROM || process.env.SMTP_USER || 'noreply@sonimportance.com'
      },
      to: user.email,
      subject: `📝 Nouveau devoir - Chapitre ${homework.chapterId} | Méthode ERPR`,
      html: getHomeworkEmailTemplate(homework, user),
      text: `
Nouveau devoir - Chapitre ${homework.chapterId}

${user.username ? `Bonjour ${user.username},` : 'Bonjour,'}

Félicitations ! Vous venez de terminer le chapitre ${homework.chapterId}.

DEVOIR : ${homework.title}

CONTENU :
${homework.content}

Continuez votre apprentissage : ${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/dashboard

Besoin d'aide ? Contactez-nous : support@sonimportance.com

© ${new Date().getFullYear()} Méthode ERPR - Tous droits réservés
      `,
      attachments: [
        {
          filename: `devoir-chapitre-${homework.chapterId}.pdf`,
          content: Buffer.from(pdfBytes),
          contentType: 'application/pdf'
        }
      ]
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email de devoir envoyé avec succès:', info.messageId);
    return true;
  } catch (error) {
    console.error('❌ Erreur lors de l\'envoi de l\'email de devoir:', error);
    return false;
  }
}

// Fonction pour vérifier et envoyer un devoir si nécessaire
export async function checkAndSendHomework(userId: string, chapterNumber: number): Promise<boolean> {
  try {
    console.log(`🔍 [LIB] ===== DÉBUT VÉRIFICATION DEVOIR =====`);
    console.log(`📝 [LIB] Utilisateur: ${userId}, Chapitre: ${chapterNumber}`);

    // VÉRIFICATION ANTI-DOUBLON : Vérifier d'abord si déjà envoyé
    const existingSendCheck = await prisma.homeworkSend.findFirst({
      where: {
        userId,
        homework: {
          chapterId: chapterNumber
        }
      }
    });

    if (existingSendCheck) {
      console.log(`🚫 [LIB] DOUBLON DÉTECTÉ - Devoir déjà envoyé (ID: ${existingSendCheck.id})`);
      console.log(`🔍 [LIB] ===== FIN VÉRIFICATION (DOUBLON) =====`);
      return false;
    }
    
    console.log(`✅ [LIB] Aucun doublon détecté - Poursuite du traitement`);

    // Vérifier si un devoir existe pour ce chapitre
    const homework = await prisma.homework.findFirst({
      where: { chapterId: chapterNumber }
    });

    if (!homework) {
      console.log(`📝 [LIB] Aucun devoir trouvé pour le chapitre ${chapterNumber}`);
      console.log(`🔍 [LIB] ===== FIN VÉRIFICATION (PAS DE DEVOIR) =====`);
      return false;
    }

    console.log(`📝 [LIB] Devoir trouvé:`, homework.title);

    // Récupérer les données de l'utilisateur
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        username: true,
        gender: true,
        isActive: true
      }
    });

    if (!user || !user.isActive) {
      console.log(`❌ [LIB] Utilisateur ${userId} non trouvé ou inactif`);
      console.log(`🔍 [LIB] ===== FIN VÉRIFICATION (USER INACTIF) =====`);
      return false;
    }

    console.log(`📧 [LIB] Préparation envoi à ${user.email}`);

    // TRANSACTION RENFORCÉE pour éviter les doublons
    console.log(`💾 [LIB] DÉBUT DE LA TRANSACTION...`);
    const result = await prisma.$transaction(async (tx) => {
      // TRIPLE vérification dans la transaction (sécurité maximale)
      console.log(`🔍 [LIB] TRIPLE VÉRIFICATION dans la transaction...`);
      const doubleCheck = await tx.homeworkSend.findFirst({
        where: {
          userId,
          homework: {
            chapterId: chapterNumber
          }
        }
      });

      if (doubleCheck) {
        console.log(`🚫 [LIB] DOUBLON DÉTECTÉ dans la transaction - arrêt`);
        return { emailSent: false, homeworkSend: null };
      }
      
      console.log(`✅ [LIB] Aucun doublon dans la transaction - Envoi de l'email...`);

      // Envoyer l'email
      const emailSent = await sendHomeworkEmail(homework, user);
      console.log(`📧 [LIB] Résultat envoi email:`, emailSent);

      // Enregistrer l'envoi dans la base de données SEULEMENT si email envoyé
      console.log(`💾 [LIB] Enregistrement en DB...`);
      const homeworkSend = await tx.homeworkSend.create({
        data: {
          userId,
          homeworkId: homework.id,
          emailSent
        }
      });

      console.log(`💾 [LIB] Enregistrement en DB créé:`, homeworkSend.id);
      return { emailSent, homeworkSend };
    });

    console.log(`💾 [LIB] FIN DE LA TRANSACTION - Résultat:`, result);

    console.log(`✅ [LIB] Devoir traité:`, {
      userId,
      chapterNumber,
      emailSent: result.emailSent,
      homeworkSendId: result.homeworkSend?.id
    });
    
    console.log(`🔍 [LIB] ===== FIN VÉRIFICATION DEVOIR =====`);
    return result.emailSent;
  } catch (error) {
    console.error('❌ [LIB] Erreur lors de la vérification/envoi du devoir:', error);
    return false;
  }
}

// Fonction pour obtenir les statistiques d'envoi des devoirs
export async function getHomeworkSendStats() {
  try {
    const stats = await prisma.homeworkSend.groupBy({
      by: ['homeworkId'],
      _count: {
        userId: true
      },
      where: {
        emailSent: true
      }
    });

    const homeworkStats = await Promise.all(
      stats.map(async (stat) => {
        const homework = await prisma.homework.findUnique({
          where: { id: stat.homeworkId },
          select: { chapterId: true, title: true }
        });

        return {
          homeworkId: stat.homeworkId,
          chapterId: homework?.chapterId,
          title: homework?.title,
          sentCount: stat._count.userId
        };
      })
    );

    return homeworkStats;
  } catch (error) {
    console.error('Erreur lors de la récupération des stats de devoirs:', error);
    return [];
  }
}