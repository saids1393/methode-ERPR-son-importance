import { NextRequest, NextResponse } from 'next/server';
import { getProfessorStudents } from '@/lib/sessions';
import { verifyToken } from '@/lib/auth';

// GET - Récupérer les élèves d'un professeur connecté (filtré par genre et réservations)
export async function GET(request: NextRequest) {
  try {
    // Vérifier l'authentification du professeur
    const token = request.cookies.get('professor-token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    const decoded = await verifyToken(token);
    const professorId = decoded.userId;

    // Récupérer les élèves filtrés par ce professeur
    const students = await getProfessorStudents(professorId);

    return NextResponse.json({
      students,
      totalStudents: students.length
    });
  } catch (error) {
    console.error('Get professor students error:', error);
    return NextResponse.json(
      { error: 'Token invalide ou erreur serveur' },
      { status: 401 }
    );
  }
}