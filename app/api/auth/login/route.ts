import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateToken, verifyPassword } from '@/lib/auth';
import { rateLimit, getClientIP, sanitizeInput, validateEmail, secureLog, getSecurityHeaders } from '@/lib/security';

export async function POST(req: Request) {
  try {
    // Rate limiting par IP
    const clientIP = getClientIP(req as any);
    const rateLimitResult = rateLimit(`login:${clientIP}`, {
      windowMs: 15 * 60 * 1000, // 15 minutes
      maxAttempts: 5 // 5 tentatives max
    });

    if (!rateLimitResult.success) {
      secureLog('LOGIN_RATE_LIMITED', { ip: clientIP });
      return NextResponse.json(
        { 
          error: 'Trop de tentatives de connexion. Réessayez dans 15 minutes.',
          retryAfter: Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000)
        },
        { status: 429 }
      );
    }

    const { identifier, password } = await req.json();

    if (!identifier || !password) {
      secureLog('LOGIN_MISSING_FIELDS', { ip: clientIP });
      return NextResponse.json(
        { error: 'Identifiant et mot de passe requis' },
        { status: 400 }
      );
    }

    // Sanitiser les entrées
    const cleanIdentifier = sanitizeInput(identifier);
    const cleanPassword = password; // Le mot de passe ne doit pas être sanitisé

    // Validation basique
    if (cleanIdentifier.length === 0 || cleanPassword.length === 0) {
      secureLog('LOGIN_INVALID_INPUT', { ip: clientIP });
      return NextResponse.json(
        { error: 'Données invalides' },
        { status: 400 }
      );
    }

    // Chercher l'utilisateur par email ou username
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: cleanIdentifier },
          { username: cleanIdentifier }
        ]
      },
      select: {
        id: true,
        email: true,
        username: true,
        password: true,
        isActive: true,
      },
    });

    if (!user || !user.isActive || !user.password) {
      secureLog('LOGIN_FAILED', { 
        ip: clientIP, 
        identifier: cleanIdentifier,
        reason: !user ? 'user_not_found' : !user.isActive ? 'user_inactive' : 'no_password'
      });
      return NextResponse.json(
        { error: 'Identifiants incorrects, compte inactif ou profil incomplet' },
        { status: 401 }
      );
    }

    const isValidPassword = await verifyPassword(cleanPassword, user.password);
    if (!isValidPassword) {
      secureLog('LOGIN_INVALID_PASSWORD', { 
        ip: clientIP, 
        userId: user.id 
      });
      return NextResponse.json(
        { error: 'Identifiants incorrects' },
        { status: 401 }
      );
    }

    secureLog('LOGIN_SUCCESS', { 
      ip: clientIP, 
      userId: user.id 
    });

    const token = await generateToken({
      userId: user.id,
      email: user.email,
      username: user.username,
    });

    const responseData = {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        isActive: user.isActive,
      }
    };

    const response = NextResponse.json(responseData, {
      headers: getSecurityHeaders()
    });

    response.cookies.set({
      name: 'auth-token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 30 * 24 * 60 * 60, // 30 jours
      path: '/',
      sameSite: 'lax',
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    secureLog('LOGIN_ERROR', { error: error instanceof Error ? error.message : 'Unknown error' });
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}