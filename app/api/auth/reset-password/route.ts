import { NextResponse } from 'next/server';
import { resetPassword } from '@/lib/auth';
import { rateLimit, getClientIP, sanitizeInput, validatePassword, secureLog, getSecurityHeaders } from '@/lib/security';

export async function POST(req: Request) {
  try {
    // Rate limiting pour les réinitialisations
    const clientIP = getClientIP(req as any);
    const rateLimitResult = rateLimit(`reset-password:${clientIP}`, {
      windowMs: 15 * 60 * 1000, // 15 minutes
      maxAttempts: 5 // 5 tentatives max
    });

    if (!rateLimitResult.success) {
      secureLog('RESET_PASSWORD_RATE_LIMITED', { ip: clientIP });
      return NextResponse.json(
        { 
          error: 'Trop de tentatives de réinitialisation. Réessayez dans 15 minutes.',
          retryAfter: Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000)
        },
        { status: 429 }
      );
    }

    const { token, password } = await req.json();

    if (!token || !password) {
      secureLog('RESET_PASSWORD_MISSING_FIELDS', { ip: clientIP });
      return NextResponse.json(
        { error: 'Token et mot de passe requis' },
        { status: 400 }
      );
    }

    // Sanitiser le token
    const cleanToken = sanitizeInput(token);
    
    // Valider le mot de passe
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      secureLog('RESET_PASSWORD_WEAK_PASSWORD', { ip: clientIP, errors: passwordValidation.errors });
      return NextResponse.json(
        { error: passwordValidation.errors[0] },
        { status: 400 }
      );
    }

    secureLog('RESET_PASSWORD_ATTEMPT', { ip: clientIP, tokenPrefix: cleanToken.substring(0, 8) });
    const result = await resetPassword(cleanToken, password);

    if (result.success) {
      secureLog('RESET_PASSWORD_SUCCESS', { ip: clientIP });
    } else {
      secureLog('RESET_PASSWORD_FAILED', { ip: clientIP, reason: result.message });
    }

    const response = NextResponse.json({
      success: result.success,
      message: result.message
    }, {
      headers: getSecurityHeaders()
    });

    return response;
  } catch (error) {
    console.error('Reset password error:', error);
    secureLog('RESET_PASSWORD_ERROR', { error: error instanceof Error ? error.message : 'Unknown error' });
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}