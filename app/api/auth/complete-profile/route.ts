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
      maxAttempts: 10
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

    if (!username && !password && !gender) {
      secureLog('COMPLETE_PROFILE_MISSING_FIELDS', { ip: clientIP });
      return NextResponse.json(
        { error: 'Au moins un champ doit être fourni pour la mise à jour' },
        { status: 400 }
      );
    }

    const cleanUsername = username ? sanitizeInput(username) : null;

    if (cleanUsername) {
      const usernameValidation = validateUsername(cleanUsername);
      if (!usernameValidation.valid) {
        secureLog('COMPLETE_PROFILE_INVALID_USERNAME', { ip: clientIP, errors: usernameValidation.errors });
        return NextResponse.json(
          { error: usernameValidation.errors[0] },
          { status: 400 }
        );
      }
    }

    if (password) {
      const passwordValidation = validatePassword(password);
      if (!passwordValidation.valid) {
        secureLog('COMPLETE_PROFILE_WEAK_PASSWORD', { ip: clientIP, errors: passwordValidation.errors });
        return NextResponse.json(
          { error: passwordValidation.errors[0] },
          { status: 400 }
        );
      }
    }

    if (gender && !['HOMME', 'FEMME'].includes(gender)) {
      secureLog('COMPLETE_PROFILE_INVALID_GENDER', { ip: clientIP });
      return NextResponse.json(
        { error: 'Genre invalide' },
        { status: 400 }
      );
    }

    const user = await getAuthUserFromRequest(req as any);
    if (!user) {
      secureLog('COMPLETE_PROFILE_UNAUTHORIZED', { ip: clientIP });
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    secureLog('COMPLETE_PROFILE_ATTEMPT', { ip: clientIP, userId: user.id });

    const updateData: any = {};
    if (cleanUsername) updateData.username = cleanUsername;
    if (password) updateData.password = password;
    if (gender) updateData.gender = gender;

    const updatedUser = await updateUserProfile(user.id, updateData);

    // Vérifier si l’utilisateur a une entrée Stripe, sinon en créer une par défaut
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

    // 🚀 Envoyer l’email de bienvenue uniquement si pas encore envoyé
    if (!updatedUser.welcomeEmailSent) {
      await sendWelcomeEmail(updatedUser.email, updatedUser.username || undefined).catch(error => {
        console.error('❌ Erreur envoi email de bienvenue:', error);
      });


      await prisma.user.update({
        where: { id: updatedUser.id },
        data: { welcomeEmailSent: true }
      });
    }

    secureLog('COMPLETE_PROFILE_SUCCESS', { ip: clientIP, userId: user.id });

    return NextResponse.json({
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

  } catch (error: any) {
    console.error('Complete profile error:', error);
    secureLog('COMPLETE_PROFILE_ERROR', { error: error instanceof Error ? error.message : 'Unknown error' });
    return NextResponse.json(
      { error: error.message || 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
