import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken, getUserById } from '@/lib/auth';

async function getAuthUserFromRequest(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value;
    
    if (!token) {
      return null;
    }

    const decoded = verifyToken(token);
    const user = await getUserById(decoded.userId);

    if (!user || !user.isActive) {
      return null;
    }

    return user;
  } catch (error) {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Pages publiques (pas de vérification d'auth)
  const publicPaths = ['/', '/checkout', '/merci'];
  if (publicPaths.includes(pathname)) {
    return NextResponse.next();
  }

  // Pages API publiques
  if (pathname.startsWith('/api/stripe') || pathname.startsWith('/api/auth')) {
    return NextResponse.next();
  }

  // Vérifier l'authentification pour les pages protégées
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/chapitres')) {
    try {
      const user = await getAuthUserFromRequest(request);
      
      if (!user || !user.isActive) {
        // Pour les pages de chapitres, rediriger vers checkout
        // Pour le dashboard, permettre le passage (la page se chargera de vérifier)
        if (pathname.startsWith('/chapitres')) {
          return NextResponse.redirect(new URL('/checkout', request.url));
        }
        // Pour /dashboard, laisser passer et laisser la page gérer la redirection
        return NextResponse.next();
      }

      return NextResponse.next();
    } catch (error) {
      console.error('Middleware auth error:', error);
      // Même logique : ne rediriger que pour les chapitres
      if (pathname.startsWith('/chapitres')) {
        return NextResponse.redirect(new URL('/checkout', request.url));
      }
      return NextResponse.next();
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};