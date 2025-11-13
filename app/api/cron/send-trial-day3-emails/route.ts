import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendFreeTrialDay3Email } from '@/lib/email';

export async function GET(request: NextRequest) {
  try {
    // Vérifier le header de sécurité Vercel Cron
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Calcul des dates pour récupérer les utilisateurs
    const now = new Date();
    
    // Récupérer la date d'il y a 3 jours (minuit à 23:59)
    const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
    const threeDaysAgoStart = new Date(threeDaysAgo);
    threeDaysAgoStart.setHours(0, 0, 0, 0);
    
    const threeDaysAgoEnd = new Date(threeDaysAgo);
    threeDaysAgoEnd.setHours(23, 59, 59, 999);

    // Trouver les utilisateurs en essai gratuit depuis 3 jours
    const users = await prisma.user.findMany({
      where: {
        accountType: 'FREE_TRIAL',
        trialExpired: false,
        trialDay3EmailSent: false,
        trialStartDate: {
          gte: threeDaysAgoStart,
          lte: threeDaysAgoEnd,
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
        const success = await sendFreeTrialDay3Email(user.email, user.username || undefined);
        
        if (success) {
          // Mettre à jour le flag dans la base de données
          await prisma.user.update({
            where: { id: user.id },
            data: { trialDay3EmailSent: true },
          });
          emailsSent++;
          console.log(`✅ Email jour 3 envoyé à ${user.email}`);
        } else {
          emailsFailed++;
          console.error(`❌ Échec envoi email jour 3 à ${user.email}`);
        }
      } catch (error) {
        emailsFailed++;
        console.error(`❌ Erreur envoi email jour 3 à ${user.email}:`, error);
      }
    }

    // Logger les résultats
    console.log(`
      ========================================
      CRON: Send Trial Day 3 Emails
      ========================================
      Utilisateurs trouvés: ${users.length}
      Emails envoyés: ${emailsSent}
      Emails échoués: ${emailsFailed}
      Heure d'exécution: ${now.toISOString()}
      ========================================
    `);

    return NextResponse.json({
      success: true,
      message: `Emails jour 3 envoyés: ${emailsSent}, échoués: ${emailsFailed}`,
      totalUsers: users.length,
      emailsSent,
      emailsFailed,
      executedAt: now.toISOString(),
    });
  } catch (error) {
    console.error('Erreur cron send-trial-day3-emails:', error);
    return NextResponse.json(
      { 
        error: 'Erreur lors de l\'envoi des emails jour 3',
        details: error instanceof Error ? error.message : 'Erreur inconnue',
      },
      { status: 500 }
    );
  }
}