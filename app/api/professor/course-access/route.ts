import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, generateToken } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// POST - Créer un token temporaire pour accéder au cours en tant que professeur
export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('professor-token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Non autorisé - token professeur manquant' },
        { status: 401 }
      );
    }

    const decoded = await verifyToken(token);
    
    // Vérifier que c'est bien un professeur
    const professor = await prisma.professor.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        name: true,
        gender: true,
        isActive: true,
      }
    });

    if (!professor || !professor.isActive) {
      return NextResponse.json(
        { error: 'Professeur non trouvé ou inactif' },
        { status: 401 }
      );
    }

    // Générer un token temporaire SPÉCIFIQUE pour l'accès au cours
    const courseToken = await generateToken({
      userId: professor.id,
      email: professor.email,
      username: professor.name,
      role: 'professor',
      courseAccess: true,
      isProfessorMode: true, // Flag explicite pour le mode professeur
      exp: Math.floor(Date.now() / 1000) + (8 * 60 * 60) // Expire dans 8 heures
    });

    const response = NextResponse.json({
      success: true,
      message: 'Token d\'accès au cours généré pour le professeur',
      professorId: professor.id,
      professorName: professor.name
    });

    // Définir un cookie temporaire SPÉCIFIQUE pour l'accès au cours professeur
    response.cookies.set({
      name: 'professor-course-token',
      value: courseToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 8 * 60 * 60, // 8 heures
      path: '/',
      sameSite: 'lax',
    });

    // SUPPRIMER explicitement tout token élève pour éviter les conflits
    response.cookies.set({
      name: 'auth-token',
      value: '',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      expires: new Date(0),
      path: '/',
      sameSite: 'lax',
    });

    return response;
  } catch (error) {
    console.error('Professor course access error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la génération du token professeur' },
      { status: 500 }
    );
  }
}