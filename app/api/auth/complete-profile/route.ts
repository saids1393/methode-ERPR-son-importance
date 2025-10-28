// app/api/auth/complete-profile/route.ts
import { NextResponse } from 'next/server';
import { getAuthUserFromRequest, updateUserProfile } from '@/lib/auth';
import { sendWelcomeEmail } from '@/lib/email';
import { rateLimit, getClientIP, sanitizeInput, validateUsername, validatePassword, secureLog, getSecurityHeaders } from '@/lib/security';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const clientIP = getClientIP(req as any);
    const rateLimitResult = rateLimit(`complete-profile:${clientIP}`, {
      windowMs: 15 * 60 * 1000,
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

    const { username, password, gender, currentPassword } = await req.json();

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
      return NextResponse.json({ error: 'Genre invalide' }, { status: 400 });
    }

    const user = await getAuthUserFromRequest(req as any);
    if (!user) {
      secureLog('COMPLETE_PROFILE_UNAUTHORIZED', { ip: clientIP });
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    // Récupérer le mot de passe actuel de l'utilisateur depuis la base de données
    const userWithPassword = await prisma.user.findUnique({
      where: { id: user.id },
      select: { password: true }
    });

    // VÉRIFICATION DE L'ANCIEN MOT DE PASSE SI ON VEUT CHANGER LE MOT DE PASSE
    // SEULEMENT si l'utilisateur a déjà un mot de passe (= modification de profil)
    if (password && userWithPassword?.password) {
      // L'utilisateur a déjà un mot de passe, donc c'est une MODIFICATION
      // Il doit fournir l'ancien mot de passe
      if (!currentPassword) {
        secureLog('COMPLETE_PROFILE_MISSING_CURRENT_PASSWORD', { ip: clientIP, userId: user.id });
        return NextResponse.json(
          { error: 'Vous devez fournir votre ancien mot de passe pour le modifier' },
          { status: 400 }
        );
      }

      // Vérifier que l'ancien mot de passe est correct
      const isPasswordValid = await bcrypt.compare(currentPassword, userWithPassword.password);
      
      if (!isPasswordValid) {
        secureLog('COMPLETE_PROFILE_WRONG_CURRENT_PASSWORD', { ip: clientIP, userId: user.id });
        return NextResponse.json(
          { error: 'L\'ancien mot de passe est incorrect' },
          { status: 400 }
        );
      }
    }
    // Si password && !userWithPassword?.password => c'est la première fois (complétion de profil après paiement)
    // Pas besoin de vérifier currentPassword

    secureLog('COMPLETE_PROFILE_ATTEMPT', { ip: clientIP, userId: user.id });

    const updateData: any = {};
    if (cleanUsername) updateData.username = cleanUsername;
    if (password) updateData.password = password;
    if (gender) updateData.gender = gender;

    const updatedUser = await updateUserProfile(user.id, updateData);

    // Stripe fallback "dummy" si absent
    const userWithStripe = await prisma.user.findUnique({
      where: { id: user.id },
      select: { stripeCustomerId: true }
    });

    if (!userWithStripe?.stripeCustomerId) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          stripeCustomerId: `profile_complete_${Date.now()}`,
          stripeSessionId: `profile_session_${Date.now()}`
        }
      });
    }

    // ======= ANTIDUPLICATION ATOMIQUE =======
    // On "réserve" l'envoi en mettant welcomeEmailSent = true SEULEMENT si c'était false.
    const claim = await prisma.user.updateMany({
      where: { id: updatedUser.id, welcomeEmailSent: false },
      data: { welcomeEmailSent: true }
    });

    if (claim.count === 1) {
      // On est le premier à avoir revendiqué => on peut envoyer
      await sendWelcomeEmail(updatedUser.email, updatedUser.username || undefined).catch(err =>
        console.error('❌ Erreur envoi email de bienvenue (complete-profile):', err)
      );
    }
    // Si claim.count === 0 => quelqu'un l'a déjà fait ailleurs (aucun envoi)

    secureLog('COMPLETE_PROFILE_SUCCESS', { ip: clientIP, userId: user.id });

    return NextResponse.json(
      {
        success: true,
        user: {
          id: updatedUser.id,
          email: updatedUser.email,
          username: updatedUser.username,
          isActive: updatedUser.isActive
        }
      },
      { headers: getSecurityHeaders() }
    );
  } catch (error: any) {
    console.error('Complete profile error:', error);
    secureLog('COMPLETE_PROFILE_ERROR', { error: error instanceof Error ? error.message : 'Unknown error' });
    return NextResponse.json({ error: error.message || 'Erreur interne du serveur' }, { status: 500 });
  }
}