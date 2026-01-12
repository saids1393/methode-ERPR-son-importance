import { NextRequest } from 'next/server';
import { verifyToken } from './auth';

// Liste des emails administrateurs autorisés
const ADMIN_EMAILS = [
  process.env.ADMIN_EMAIL || 'soidroudinesaid51@gmail.com',
  // Ajoutez d'autres emails admin ici si nécessaire
];

export async function isAdminUser(request: NextRequest): Promise<boolean> {
  try {
    const token = request.cookies.get('auth-token')?.value;
    if (!token) return false;

    const decoded = await verifyToken(token);
    if (!decoded || !decoded.email) return false;
    
    return ADMIN_EMAILS.includes(decoded.email as string);
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
}

export async function requireAdmin(request: NextRequest) {
  const isAdmin = await isAdminUser(request);
  if (!isAdmin) {
    throw new Error('Accès administrateur requis');
  }
  return true;
}