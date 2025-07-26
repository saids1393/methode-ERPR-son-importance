import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken, getUserById } from '@/lib/auth';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Protéger /dashboard et /chapitres
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/chapitres')) {
    const token = req.cookies.get("auth-token")?.value;

    if (!token) {
      return NextResponse.redirect(new URL("/checkout", req.url));
    }

    try {
      const decoded = verifyToken(token);
      
      // Vérifier que l'utilisateur existe et est actif
      const user = await getUserById(decoded.userId);
      if (!user || !user.isActive) {
        return NextResponse.redirect(new URL("/checkout", req.url));
      }

      return NextResponse.next();
    } catch (error) {
      return NextResponse.redirect(new URL("/checkout", req.url));
    }
  }

  // Rediriger les utilisateurs connectés depuis les pages d'auth
  if (pathname === '/checkout' || pathname === '/signin' || pathname === '/signup') {
    const token = req.cookies.get("auth-token")?.value;

    if (token) {
      try {
        const decoded = verifyToken(token);
        const user = await getUserById(decoded.userId);
        
        if (user && user.isActive) {
          return NextResponse.redirect(new URL("/dashboard", req.url));
        }
      } catch (error) {
        // Token invalide, continuer vers la page demandée
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/chapitres/:path*',
    '/checkout',
    '/signin',
    '/signup'
  ],
};
  const token = req.cookies.get("auth-token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/signin", req.url));
  }

  try {
    verifyToken(token);
    return NextResponse.next();
  } catch (error) {
    return NextResponse.redirect(new URL("/signin", req.url));
  }
}

export const config = {
  matcher: [
    "/chapitres/:path*", 
    "/api/chapters/:path*",
    "/api/auth/me"
  ],
};
