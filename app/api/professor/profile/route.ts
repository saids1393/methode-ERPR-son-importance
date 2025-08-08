import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { validateEmail, sanitizeInput, validatePassword } from '@/lib/security';
import bcrypt from 'bcryptjs';

// GET - Récupérer le profil du professeur
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('professor-token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    const decoded = await verifyToken(token);
    
    const professor = await prisma.professor.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        name: true,
        gender: true,
        zoomMeetingId: true,
        zoomPassword: true,
        isActive: true,
      }
    });

    if (!professor || !professor.isActive) {
      return NextResponse.json(
        { error: 'Professeur non trouvé ou inactif' },
        { status: 401 }
      );
    }

    return NextResponse.json(professor);
  } catch (error) {
    console.error('Get professor profile error:', error);
    return NextResponse.json(
      { error: 'Token invalide' },
      { status: 401 }
    );
  }
}

// PATCH - Mettre à jour le profil du professeur
export async function PATCH(request: NextRequest) {
  try {
    const token = request.cookies.get('professor-token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    const decoded = await verifyToken(token);
    const { name, zoomMeetingId, zoomPassword, password } = await request.json();

    const updateData: any = {};

    if (name !== undefined) {
      const cleanName = sanitizeInput(name);
      if (cleanName.length < 2) {
        return NextResponse.json(
          { error: 'Le nom doit contenir au moins 2 caractères' },
          { status: 400 }
        );
      }
      updateData.name = cleanName;
    }

    if (password !== undefined && password !== '') {
      const passwordValidation = validatePassword(password);
      if (!passwordValidation.valid) {
        return NextResponse.json(
          { error: passwordValidation.errors[0] },
          { status: 400 }
        );
      }
      updateData.password = await bcrypt.hash(password, 12);
    }
    if (zoomMeetingId !== undefined) {
      updateData.zoomMeetingId = sanitizeInput(zoomMeetingId);
    }

    if (zoomPassword !== undefined) {
      updateData.zoomPassword = sanitizeInput(zoomPassword);
    }

    // Mettre à jour les liens Zoom des séances futures de ce professeur
    if (zoomMeetingId !== undefined || zoomPassword !== undefined) {
      // Récupérer les données actuelles du professeur pour construire le lien complet
      const currentProfessor = await prisma.professor.findUnique({
        where: { id: decoded.userId },
        select: { zoomMeetingId: true, zoomPassword: true }
      });
      
      // Utiliser les nouvelles valeurs ou garder les anciennes
      const finalZoomId = zoomMeetingId !== undefined ? sanitizeInput(zoomMeetingId) : currentProfessor?.zoomMeetingId;
      const finalZoomPassword = zoomPassword !== undefined ? sanitizeInput(zoomPassword) : currentProfessor?.zoomPassword;
      
      let newZoomLink: string | null = null;
      if (finalZoomId) {
        newZoomLink = `https://zoom.us/j/${finalZoomId}`;
        if (finalZoomPassword) {
          newZoomLink += `?pwd=${finalZoomPassword}`;
        }
      }
        
      // Mettre à jour toutes les séances futures de ce professeur
      await prisma.session.updateMany({
        where: {
          professorId: decoded.userId,
          status: 'SCHEDULED',
          scheduledAt: { gte: new Date() }
        },
        data: { zoomLink: newZoomLink }
      });
    }

    const professor = await prisma.professor.update({
      where: { id: decoded.userId },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        gender: true,
        zoomMeetingId: true,
        zoomPassword: true,
        isActive: true,
      }
    });

    return NextResponse.json({
      success: true,
      professor
    });
  } catch (error) {
    console.error('Update professor profile error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour' },
      { status: 500 }
    );
  }
}