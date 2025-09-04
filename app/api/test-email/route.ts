import { NextResponse } from 'next/server';
import { sendWelcomeEmail } from '@/lib/email';

// --- Fonction simple pour tester la configuration SMTP ---
async function testEmailConfiguration(): Promise<boolean> {
  try {
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.error('❌ Configuration SMTP manquante');
      return false;
    }
    return true;
  } catch (err) {
    console.error('Erreur testEmailConfiguration:', err);
    return false;
  }
}

export async function GET() {
  try {
    const configValid = await testEmailConfiguration();

    if (!configValid) {
      return NextResponse.json({
        success: false,
        error: 'Configuration email invalide'
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Configuration email valide'
    });
  } catch (error) {
    console.error('Test email error:', error);
    return NextResponse.json({
      success: false,
      error: 'Erreur lors du test email'
    }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { type, email } = await req.json();

    if (!email) {
      return NextResponse.json({
        success: false,
        error: 'Email requis'
      }, { status: 400 });
    }

    let result = false;

    if (type === 'welcome') {
      // Test d'envoi de bienvenue
      result = await sendWelcomeEmail(email, 'Utilisateur Test');
    } else {
      return NextResponse.json({
        success: false,
        error: 'Type invalide. Utilisez "welcome"'
      }, { status: 400 });
    }

    return NextResponse.json({
      success: result,
      message: result ? 'Email envoyé avec succès' : 'Échec de l\'envoi'
    });
  } catch (error) {
    console.error('Send test email error:', error);
    return NextResponse.json({
      success: false,
      error: 'Erreur lors de l\'envoi du test'
    }, { status: 500 });
  }
}
