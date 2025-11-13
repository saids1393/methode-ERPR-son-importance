import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendFreeTrialDay6Email } from '@/lib/email';

export async function GET(request: NextRequest) {
  try {
    // Vérifier le header de sécurité Vercel Cron
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Calcul des dates pour récupérer les utilisateurs
    const now = new Date();
    
    // Récupérer la date d'il y a 6 jours (minuit à 23:59)
    const sixDaysAgo = new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000);
    const sixDaysAgoStart = new Date(sixDaysAgo);
    sixDaysAgoStart.setHours(0, 0, 0, 0);
    
    const sixDaysAgoEnd = new Date(sixDaysAgo);
    sixDaysAgoEnd.setHours(23, 59, 59, 999);

    // Trouver les utilisateurs en essai gratuit depuis 6 jours
    const users = await prisma.user.findMany({
      where: {
        accountType: 'FREE_TRIAL',
        trialExpired: false,
        trialDay6EmailSent: false,
        trialStartDate: {
          gte: sixDaysAgoStart,
          lte: sixDaysAgoEnd,
        },
      },
      select: {
        id: true,
        email: true,
        username: true,
      },
    });

    let emailsSent = 0;
    let emailsFailed = 0;

    // Envoyer les emails
    for (const user of users) {
      try {
        const success = await sendFreeTrialDay6Email(user.email, user.username || undefined);
        
        if (success) {
          // Mettre à jour le flag dans la base de données
          await prisma.user.update({
            where: { id: user.id },
            data: { trialDay6EmailSent: true },
          });
          emailsSent++;
          console.log(`✅ Email jour 6 envoyé à ${user.email}`);
        } else {
          emailsFailed++;
          console.error(`❌ Échec envoi email jour 6 à ${user.email}`);
        }
      } catch (error) {
        emailsFailed++;
        console.error(`❌ Erreur envoi email jour 6 à ${user.email}:`, error);
      }
    }

    // Logger les résultats
    console.log(`
      ========================================
      CRON: Send Trial Day 6 Emails
      ========================================
      Utilisateurs trouvés: ${users.length}
      Emails envoyés: ${emailsSent}
      Emails échoués: ${emailsFailed}
      Heure d'exécution: ${now.toISOString()}
      ========================================
    `);

    return NextResponse.json({
      success: true,
      message: `Emails jour 6 envoyés: ${emailsSent}, échoués: ${emailsFailed}`,
      totalUsers: users.length,
      emailsSent,
      emailsFailed,
      executedAt: now.toISOString(),
    });
  } catch (error) {
    console.error('Erreur cron send-trial-day6-emails:', error);
    return NextResponse.json(
      { 
        error: 'Erreur lors de l\'envoi des emails jour 6',
        details: error instanceof Error ? error.message : 'Erreur inconnue',
      },
      { status: 500 }
    );
  }
}