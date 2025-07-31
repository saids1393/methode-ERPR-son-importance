import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin-auth';
import bcrypt from 'bcryptjs';
import { validateEmail, validatePassword, validateUsername } from '@/lib/security';

export async function POST(request: NextRequest) {
  try {
    await requireAdmin(request);

    const { email, username, password, gender, isActive, isPaid } = await request.json();

    // Validations
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email et mot de passe requis' },
        { status: 400 }
      );
    }

    if (!validateEmail(email)) {
      return NextResponse.json(
        { error: 'Format d\'email invalide' },
        { status: 400 }
      );
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      return NextResponse.json(
        { error: passwordValidation.errors[0] },
        { status: 400 }
      );
    }

    if (username) {
      const usernameValidation = validateUsername(username);
      if (!usernameValidation.valid) {
        return NextResponse.json(
          { error: usernameValidation.errors[0] },
          { status: 400 }
        );
      }

      // Vérifier si le username existe déjà
      const existingUsername = await prisma.user.findUnique({
        where: { username }
      });

      if (existingUsername) {
        return NextResponse.json(
          { error: 'Ce pseudo est déjà utilisé' },
          { status: 400 }
        );
      }
    }

    // Vérifier si l'email existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Cet email est déjà utilisé' },
        { status: 400 }
      );
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 12);

    // Créer l'utilisateur
    const userData: any = {
      email,
      password: hashedPassword,
      isActive: isActive ?? true,
    };

    if (username) userData.username = username;
    if (gender) userData.gender = gender;

    // Si isPaid est true, simuler un paiement Stripe
    if (isPaid) {
      userData.stripeCustomerId = `manual_${Date.now()}`;
      userData.stripeSessionId = `manual_session_${Date.now()}`;
    } else {
      // Si gratuit, pas de données de paiement
      userData.stripeCustomerId = null;
      userData.stripeSessionId = null;
    }

    const user = await prisma.user.create({
      data: userData,
      select: {
        id: true,
        email: true,
        username: true,
        gender: true,
        isActive: true,
        stripeCustomerId: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      user,
      message: 'Utilisateur créé avec succès'
    });
  } catch (error) {
    console.error('Create user error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création de l\'utilisateur' },
      { status: 500 }
    );
  }
}