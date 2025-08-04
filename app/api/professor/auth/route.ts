import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { generateToken } from '@/lib/auth';
import { validateEmail, validatePassword, sanitizeInput, getSecurityHeaders } from '@/lib/security';

const PROFESSOR_SECRET_CODE = '6725';

// POST - Créer un compte professeur ou se connecter
export async function POST(request: NextRequest) {
  try {
    const { action, email, name, gender, password, secretCode } = await request.json();

    if (action === 'create') {
      // Création de compte professeur
      if (!email || !name || !gender || !password || !secretCode) {
        return NextResponse.json(
          { error: 'Tous les champs sont requis pour la création' },
          { status: 400 }
        );
      }

      // Vérifier le code secret
      if (secretCode !== PROFESSOR_SECRET_CODE) {
        return NextResponse.json(
          { error: 'Code secret incorrect' },
          { status: 403 }
        );
      }

      // Validations
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

      if (!['HOMME', 'FEMME'].includes(gender)) {
        return NextResponse.json(
          { error: 'Genre invalide' },
          { status: 400 }
        );
      }

      // Vérifier si le professeur existe déjà
      const existingProfessor = await prisma.professor.findUnique({
        where: { email }
      });

      if (existingProfessor) {
        return NextResponse.json(
          { error: 'Un compte professeur existe déjà avec cet email' },
          { status: 400 }
        );
      }

      // Hasher le mot de passe
      const hashedPassword = await bcrypt.hash(password, 12);

      // Créer le professeur
      const professor = await prisma.professor.create({
        data: {
          email: sanitizeInput(email),
          name: sanitizeInput(name),
          gender: gender as 'HOMME' | 'FEMME',
          password: hashedPassword,
          zoomMeetingId: `${Date.now()}`, // ID temporaire
          zoomPassword: 'zoom123',
        },
        select: {
          id: true,
          email: true,
          name: true,
          gender: true,
          isActive: true,
        }
      });

      // Générer un token JWT pour le professeur
      const token = await generateToken({
        userId: professor.id,
        email: professor.email,
        username: professor.name,
        role: 'professor'
      });

      const response = NextResponse.json({
        success: true,
        professor,
        message: 'Compte professeur créé avec succès'
      }, {
        headers: getSecurityHeaders()
      });

      // Définir le cookie d'authentification professeur
      response.cookies.set({
        name: 'professor-token',
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 30 * 24 * 60 * 60, // 30 jours
        path: '/',
        sameSite: 'lax',
      });

      return response;

    } else if (action === 'login') {
      // Connexion professeur
      if (!email || !password) {
        return NextResponse.json(
          { error: 'Email et mot de passe requis' },
          { status: 400 }
        );
      }

      // Chercher le professeur
      const professor = await prisma.professor.findUnique({
        where: { email: sanitizeInput(email) },
        select: {
          id: true,
          email: true,
          name: true,
          gender: true,
          password: true,
          isActive: true,
        }
      });

      if (!professor || !professor.isActive || !professor.password) {
        return NextResponse.json(
          { error: 'Identifiants incorrects ou compte inactif' },
          { status: 401 }
        );
      }

      // Vérifier le mot de passe
      const isValidPassword = await bcrypt.compare(password, professor.password);
      if (!isValidPassword) {
        return NextResponse.json(
          { error: 'Identifiants incorrects' },
          { status: 401 }
        );
      }

      // Générer un token JWT
      const token = await generateToken({
        userId: professor.id,
        email: professor.email,
        username: professor.name,
        role: 'professor'
      });

      const response = NextResponse.json({
        success: true,
        professor: {
          id: professor.id,
          email: professor.email,
          name: professor.name,
          gender: professor.gender,
          isActive: professor.isActive,
        }
      }, {
        headers: getSecurityHeaders()
      });

      response.cookies.set({
        name: 'professor-token',
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 30 * 24 * 60 * 60, // 30 jours
        path: '/',
        sameSite: 'lax',
      });

      return response;
    }

    return NextResponse.json(
      { error: 'Action invalide' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Professor auth error:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}