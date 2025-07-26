import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-secret');

async function verifyJWTToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload;
  } catch (error) {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Pages complètement publiques
  const publicPaths = ['/', '/checkout', '/merci', '/login', '/complete-profile'];
  if (publicPaths.includes(pathname)) {
    return NextResponse.next();
  }

  // API routes publiques
  if (pathname.startsWith('/api/stripe') || pathname.startsWith('/api/auth')) {
    return NextResponse.next();
  }

  // Pour les pages protégées (dashboard et chapitres)
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/chapitres')) {
    const token = request.cookies.get('auth-token')?.value;
    
    if (!token) {
      console.log('No token found, redirecting to checkout');
      return NextResponse.redirect(new URL('/login', request.url));
    }

    const payload = await verifyJWTToken(token);
    
    if (!payload) {
      console.log('Invalid token, redirecting to checkout');
      // Supprimer le cookie invalide
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('auth-token');
      return response;
    }

    // Token valide, laisser passer
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};