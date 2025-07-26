import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getAuthUser } from '@/lib/auth';

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
      const user = await getAuthUser();
      
      if (!user || !user.isActive) {
        // Rediriger vers checkout si pas authentifié ou pas actif
        return NextResponse.redirect(new URL('/checkout', request.url));
      }

      return NextResponse.next();
    } catch (error) {
      console.error('Middleware auth error:', error);
      return NextResponse.redirect(new URL('/checkout', request.url));
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