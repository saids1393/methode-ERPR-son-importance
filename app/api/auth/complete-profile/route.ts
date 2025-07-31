import { NextResponse } from 'next/server';
import { getAuthUserFromRequest, updateUserProfile } from '@/lib/auth';
import { sendWelcomeEmail } from '@/lib/email';
import { rateLimit, getClientIP, sanitizeInput, validateUsername, validatePassword, secureLog, getSecurityHeaders } from '@/lib/security';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    // Rate limiting
    const clientIP = getClientIP(req as any);
    const rateLimitResult = rateLimit(`complete-profile:${clientIP}`, {
      windowMs: 15 * 60 * 1000, // 15 minutes
      maxAttempts: 10 // 10 tentatives max
    });

    if (!rateLimitResult.success) {
      secureLog('COMPLETE_PROFILE_RATE_LIMITED', { ip: clientIP });
      return NextResponse.json(
        { 
          error: 'Trop de tentatives. Réessayez dans 15 minutes.',
          retryAfter: Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000)
        },
        { status: 429 }
      );
    }

    const { username, password, gender } = await req.json();

    if (!username || !password || !gender) {
      secureLog('COMPLETE_PROFILE_MISSING_FIELDS', { ip: clientIP });
      return NextResponse.json(
        { error: 'Pseudo, mot de passe et genre requis' },
        { status: 400 }
      );
    }

    // Sanitiser et valider les entrées
    const cleanUsername = sanitizeInput(username);
    
    const usernameValidation = validateUsername(cleanUsername);
    if (!usernameValidation.valid) {
      secureLog('COMPLETE_PROFILE_INVALID_USERNAME', { ip: clientIP, errors: usernameValidation.errors });
      return NextResponse.json(
        { error: usernameValidation.errors[0] },
        { status: 400 }
      );
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      secureLog('COMPLETE_PROFILE_WEAK_PASSWORD', { ip: clientIP, errors: passwordValidation.errors });
      return NextResponse.json(
        { error: passwordValidation.errors[0] },
        { status: 400 }
      );
    }

    // Valider le genre
    if (!['HOMME', 'FEMME'].includes(gender)) {
      secureLog('COMPLETE_PROFILE_INVALID_GENDER', { ip: clientIP });
      return NextResponse.json(
        { error: 'Genre invalide' },
        { status: 400 }
      );
    }

    // Vérifier que l'utilisateur est connecté
    const user = await getAuthUserFromRequest(req as any);
    if (!user) {
      secureLog('COMPLETE_PROFILE_UNAUTHORIZED', { ip: clientIP });
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    secureLog('COMPLETE_PROFILE_ATTEMPT', { ip: clientIP, userId: user.id });

    // Mettre à jour le profil et s'assurer qu'il est marqué comme payant
    const updatedUser = await updateUserProfile(user.id, {
      username: cleanUsername,
      password,
      gender
    });

    // S'assurer que l'utilisateur a des données de paiement (par défaut payant)
    const userWithStripe = await prisma.user.findUnique({
      where: { id: user.id },
      select: { stripeCustomerId: true }
    });

    if (!userWithStripe?.stripeCustomerId) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          stripeCustomerId: `profile_complete_${Date.now()}`,
          stripeSessionId: `profile_session_${Date.now()}`,
        }
      });
    }

    // Envoyer un email de bienvenue personnalisé avec le nouveau pseudo
    if (username && username !== user.username) {
      sendWelcomeEmail(updatedUser.email, updatedUser.username || undefined).catch(error => {
        console.error('❌ Erreur envoi email de bienvenue:', error);
      });
    }

    secureLog('COMPLETE_PROFILE_SUCCESS', { ip: clientIP, userId: user.id });

    const response = NextResponse.json({
      success: true,
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        username: updatedUser.username,
        isActive: updatedUser.isActive,
      }
    }, {
      headers: getSecurityHeaders()
    });

    return response;
  } catch (error: any) {
    console.error('Complete profile error:', error);
    secureLog('COMPLETE_PROFILE_ERROR', { error: error instanceof Error ? error.message : 'Unknown error' });
    return NextResponse.json(
      { error: error.message || 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}