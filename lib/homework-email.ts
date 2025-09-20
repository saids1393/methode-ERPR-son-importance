// lib/homework-email.ts

import nodemailer from 'nodemailer';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { prisma } from './prisma';

// Transporteur email
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

// Nettoyage caractères non supportés
function removeUnsupportedChars(text: string): string {
  return text.replace(/[^\x00-\xFF]/g, '');
}

// Génération PDF
export async function generateHomeworkPDF(homework: HomeworkData): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  let currentPage = pdfDoc.addPage([595, 842]);
  const { width, height } = currentPage.getSize();

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const fontSize = 12;
  const titleFontSize = 18;
  const margin = 50;
  let y = height - margin;

  currentPage.drawText('MÉTHODE ERPR - DEVOIR', { x: margin, y, size: titleFontSize, font: boldFont, color: rgb(0.2,0.2,0.8) });
  y -= 30;
  currentPage.drawText(`Chapitre ${homework.chapterId}`, { x: margin, y, size: fontSize+2, font: boldFont, color: rgb(0.4,0.4,0.4) });
  y -= 40;

  const safeTitle = removeUnsupportedChars(homework.title);
  currentPage.drawText(safeTitle, { x: margin, y, size: titleFontSize-2, font: boldFont, color: rgb(0.1,0.1,0.1) });
  y -= 40;

  const lines = homework.content.split('\n');
  for (const line of lines) {
    const safeLine = removeUnsupportedChars(line);
    if (y < 100) { currentPage = pdfDoc.addPage([595,842]); y = currentPage.getSize().height - margin; }
    if (safeLine.trim()) {
      const maxWidth = width - 2*margin;
      const words = safeLine.split(' ');
      let currentLine = '';
      for (const word of words) {
        const testLine = currentLine ? `${currentLine} ${word}` : word;
        const textWidth = font.widthOfTextAtSize(testLine, fontSize);
        if (textWidth > maxWidth && currentLine) {
          currentPage.drawText(currentLine, { x: margin, y, size: fontSize, font });
          y -= 20;
          currentLine = word;
        } else { currentLine = testLine; }
      }
      if (currentLine) { currentPage.drawText(currentLine, { x: margin, y, size: fontSize, font }); y -= 20; }
    } else { y -= 15; }
  }

  y = 50;
  currentPage.drawText(`Généré le ${new Date().toLocaleDateString('fr-FR')} - Méthode ERPR`, { x: margin, y, size: 10, font, color: rgb(0.5,0.5,0.5) });

  return pdfDoc.save();
}

// Template email complet
const getHomeworkEmailTemplate = (homework: HomeworkData, user: UserData) => `
<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Nouveau devoir - Chapitre ${homework.chapterId}</title>
<style>
body { font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif; line-height:1.6; color:#333; max-width:600px; margin:0 auto; padding:20px; background:#f8f9fa;}
.container { background:#fff; border-radius:12px; padding:40px; box-shadow:0 4px 6px rgba(0,0,0,0.1);}
.header { text-align:center; margin-bottom:40px; padding-bottom:20px; border-bottom:2px solid #e9ecef;}
.logo { background:linear-gradient(135deg,#667eea 0%,#764ba2 100%); color:#fff; padding:15px 30px; border-radius:8px; display:inline-block; font-size:24px; font-weight:bold; margin-bottom:20px;}
.homework-badge { background:#28a745; color:#fff; padding:8px 20px; border-radius:20px; font-size:14px; font-weight:600; display:inline-block;}
.homework-details { background:#f8f9fa; padding:25px; border-radius:8px; margin:30px 0;}
.homework-content { background:#fff; border:1px solid #e9ecef; border-radius:8px; padding:20px; margin:20px 0; white-space:pre-line; line-height:1.8;}
.cta-button { background:#28a745; color:#fff; padding:15px 30px; text-decoration:none; border-radius:8px; display:inline-block; font-weight:bold; margin:20px 0;}
.footer { text-align:center; margin-top:40px; padding-top:20px; border-top:1px solid #e9ecef; color:#6c757d; font-size:14px;}
.tips-box { background:#e3f2fd; padding:20px; border-radius:8px; margin:20px 0; border-left:4px solid #2196f3;}
</style>
</head>
<body>
<div class="container">
<div class="header">
<div class="logo">📚 Méthode ERPR</div>
<div class="homework-badge">📝 Nouveau devoir disponible</div>
</div>

<h1 style="text-align:center;">${user.username ? `Félicitations ${user.username} !`:'Félicitations !'}</h1>
<p>Vous venez de terminer le chapitre ${homework.chapterId}! Voici votre devoir pour consolider vos acquis.</p>

<div class="homework-details">
<h3>📋 Détails du devoir</h3>
<div><strong>Chapitre :</strong> ${homework.chapterId}</div>
<div><strong>Titre :</strong> ${homework.title}</div>
<div><strong>Date d'envoi :</strong> ${new Date().toLocaleDateString('fr-FR',{year:'numeric',month:'long',day:'numeric',hour:'2-digit',minute:'2-digit'})}</div>
</div>

<div class="homework-content">
<h4>📖 Contenu :</h4>
${homework.content}
</div>

<div style="text-align:center;">
<a href="${process.env.NEXTAUTH_URL || 'http://localhost:6725'}/dashboard" class="cta-button">🚀 Continuer mon apprentissage</a>
</div>

<div class="tips-box">
<h4>💡 Conseils pour réussir</h4>
<ul>
<li>Prenez votre temps pour bien comprendre chaque exercice</li>
<li>Relisez le chapitre si nécessaire</li>
<li>Pratiquez régulièrement</li>
<li>Contactez le support si vous avez des questions</li>
</ul>
</div>

<div class="footer">
<p><strong>Méthode ERPR</strong><br>Apprenez à lire et écrire l'arabe à votre rythme<br>Créé par Professeur Soidroudine</p>
<p>Besoin d'aide ? arabeimportance@gmail.com<br>© ${new Date().getFullYear()} Tous droits réservés</p>
</div>
</div>
</body>
</html>
`;

// Envoyer devoir par email
export async function sendHomeworkEmail(homework: HomeworkData, user: UserData): Promise<boolean> {
  try {
    const pdfBytes = await generateHomeworkPDF(homework);
    await transporter.sendMail({
      from: { name:'Méthode ERPR', address:process.env.SMTP_FROM||process.env.SMTP_USER||'arabeimportance@gmail.com' },
      to: user.email,
      subject:`📝 Nouveau devoir - Chapitre ${homework.chapterId} | Méthode ERPR`,
      html:getHomeworkEmailTemplate(homework,user),
      attachments:[{ filename:`devoir-chapitre-${homework.chapterId}.pdf`, content:Buffer.from(pdfBytes), contentType:'application/pdf' }]
    });
    return true;
  } catch(err) {
    console.error('❌ Erreur envoi email devoir:',err);
    return false;
  }
}

// Vérifier et envoyer devoir si nécessaire
// Fonction principale de vérification et envoi de devoir corrigée
export async function checkAndSendHomework(userId: string, chapterNumber: number): Promise<boolean> {
  try {
    const homework = await prisma.homework.findFirst({ where: { chapterId: chapterNumber } });
    if (!homework) return false;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, username: true, gender: true, isActive: true },
    });
    if (!user || !user.isActive) return false;

    // Atomicité : tenter de créer l’envoi uniquement si aucun envoi n’existe
    const existingOrNewSend = await prisma.homeworkSend.upsert({
      where: { userId_homeworkId: { userId, homeworkId: homework.id } }, // clé composite à définir dans ton modèle
      update: {}, // ne fait rien si existant
      create: {
        userId,
        homeworkId: homework.id,
        emailSent: false, // temporaire
      },
    });

    // Si email déjà envoyé, bloquer
    if (existingOrNewSend.emailSent) {
      console.log('🚫 Email déjà envoyé, blocage.');
      return false;
    }

    // Envoyer l’email
    const emailSent = await sendHomeworkEmail(homework, user);

    // Mettre à jour l’envoi avec statut et date
    await prisma.homeworkSend.update({
      where: { id: existingOrNewSend.id },
      data: {
        emailSent,
        sentAt: emailSent ? new Date() : undefined,
      },
    });

    return emailSent;
  } catch (err) {
    console.error('❌ Erreur checkAndSendHomework:', err);
    return false;
  }
}



// Statistiques envoi devoirs
export async function getHomeworkSendStats() {
  try {
    const stats = await prisma.homeworkSend.groupBy({ by:['homeworkId'], _count:{ userId:true }, where:{ emailSent:true } });
    return await Promise.all(stats.map(async(stat)=>{
      const homework = await prisma.homework.findUnique({ where:{id:stat.homeworkId}, select:{chapterId:true,title:true} });
      return { homeworkId:stat.homeworkId, chapterId:homework?.chapterId, title:homework?.title, sentCount:stat._count.userId };
    }));
  } catch(err) { console.error(err); return []; }
}
