import { NextResponse } from 'next/server';
import { createPasswordResetRequest } from '@/lib/auth';
import { rateLimit, getClientIP, sanitizeInput, validateEmail, secureLog, getSecurityHeaders } from '@/lib/security';

export async function POST(req: Request) {
  try {
    // Rate limiting pour les demandes de réinitialisation
    const clientIP = getClientIP(req as any);
    const rateLimitResult = rateLimit(`forgot-password:${clientIP}`, {
      windowMs: 60 * 60 * 1000, // 1 heure
      maxAttempts: 3 // 3 tentatives max par heure
    });

    if (!rateLimitResult.success) {
      secureLog('FORGOT_PASSWORD_RATE_LIMITED', { ip: clientIP });
      return NextResponse.json(
        { 
          error: 'Trop de demandes de réinitialisation. Réessayez dans 1 heure.',
          retryAfter: Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000)
        },
        { status: 429 }
      );
    }

    const { email } = await req.json();

    if (!email) {
      secureLog('FORGOT_PASSWORD_MISSING_EMAIL', { ip: clientIP });
      return NextResponse.json(
        { error: 'Email requis' },
        { status: 400 }
      );
    }

    // Sanitiser et valider l'email
    const cleanEmail = sanitizeInput(email);
    if (!validateEmail(cleanEmail)) {
      secureLog('FORGOT_PASSWORD_INVALID_EMAIL', { ip: clientIP, email: cleanEmail });
      return NextResponse.json(
        { error: 'Format d\'email invalide' },
        { status: 400 }
      );
    }

    secureLog('FORGOT_PASSWORD_REQUEST', { ip: clientIP, email: cleanEmail });
    const result = await createPasswordResetRequest(cleanEmail);

    const response = NextResponse.json({
      success: result.success,
      message: result.message
    }, {
      headers: getSecurityHeaders()
    });

    return response;
  } catch (error) {
    console.error('Forgot password error:', error);
    secureLog('FORGOT_PASSWORD_ERROR', { error: error instanceof Error ? error.message : 'Unknown error' });
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}