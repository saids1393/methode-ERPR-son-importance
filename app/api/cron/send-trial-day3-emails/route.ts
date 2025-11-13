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

    const now = new Date();
    
    // Calculer les timestamps pour "aujourd'hui - 3 jours"
    // Si on est le 14 novembre, on cherche les utilisateurs du 11 novembre
    const threeDaysInMs = 3 * 24 * 60 * 60 * 1000;
    const targetDate = new Date(now.getTime() - threeDaysInMs);
    
    // Début et fin de la journée cible
    const dayStart = new Date(targetDate);
    dayStart.setHours(0, 0, 0, 0);
    
    const dayEnd = new Date(targetDate);
    dayEnd.setHours(23, 59, 59, 999);

    console.log(`
      🔍 CRON JOUR 3 - PRODUCTION
      Heure actuelle: ${now.toISOString()}
      Recherche: users avec trialStartDate entre ${dayStart.toISOString()} et ${dayEnd.toISOString()}
    `);

    // Trouver tous les utilisateurs qui ont commencé leur essai il y a 3 jours
    const users = await prisma.user.findMany({
      where: {
        accountType: 'FREE_TRIAL',
        trialExpired: false,
        trialDay3EmailSent: false,
        trialStartDate: {
          gte: dayStart,
          lte: dayEnd,
        },
      },
      select: {
        id: true,
        email: true,
        username: true,
        trialStartDate: true,
      },
    });

    console.log(`📊 ${users.length} utilisateur(s) trouvé(s)`);

    let emailsSent = 0;
    let emailsFailed = 0;

    // Envoyer les emails
    for (const user of users) {
      try {
        const startDate = user.trialStartDate ? user.trialStartDate.toISOString() : 'N/A';
        console.log(`📨 Envoi email jour 3 à ${user.email} (commencé: ${startDate})`);
        
        const success = await sendFreeTrialDay3Email(user.email, user.username || undefined);
        
        if (success) {
          // Mettre à jour le flag pour éviter de renvoyer
          await prisma.user.update({
            where: { id: user.id },
            data: { trialDay3EmailSent: true },
          });
          emailsSent++;
          console.log(`✅ Email jour 3 envoyé avec succès à ${user.email}`);
        } else {
          emailsFailed++;
          console.error(`❌ Échec envoi email jour 3 à ${user.email}`);
        }
      } catch (error) {
        emailsFailed++;
        console.error(`❌ Erreur lors de l'envoi à ${user.email}:`, error);
      }
    }

    console.log(`
      ========================================
      ✅ CRON: Send Trial Day 3 Emails
      ========================================
      Utilisateurs trouvés: ${users.length}
      Emails envoyés: ${emailsSent}
      Emails échoués: ${emailsFailed}
      Exécution: ${now.toISOString()}
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
    console.error('❌ Erreur cron send-trial-day3-emails:', error);
    return NextResponse.json(
      { 
        error: 'Erreur lors de l\'envoi des emails jour 3',
        details: error instanceof Error ? error.message : 'Erreur inconnue',
      },
      { status: 500 }
    );
  }
}