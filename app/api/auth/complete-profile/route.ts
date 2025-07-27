import { NextResponse } from 'next/server';
import { getAuthUserFromRequest, updateUserProfile } from '@/lib/auth';
import { sendWelcomeEmail } from '@/lib/email';

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Pseudo et mot de passe requis' },
        { status: 400 }
      );
    }

    // Vérifier que l'utilisateur est connecté
    const user = await getAuthUserFromRequest(req as any);
    if (!user) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    // Mettre à jour le profil
    const updatedUser = await updateUserProfile(user.id, {
      username,
      password
    });

    // Envoyer un email de bienvenue personnalisé avec le nouveau pseudo
    if (username && username !== user.username) {
      sendWelcomeEmail(updatedUser.email, updatedUser.username || undefined).catch(error => {
        console.error('❌ Erreur envoi email de bienvenue:', error);
      });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        username: updatedUser.username,
        isActive: updatedUser.isActive,
      }
    });
  } catch (error: any) {
    console.error('Complete profile error:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}