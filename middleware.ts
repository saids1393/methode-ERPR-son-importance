import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';
import { getSecurityHeaders } from '@/lib/security';

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

  // Ajouter les headers de sécurité à toutes les réponses
  const response = NextResponse.next();
  const securityHeaders = getSecurityHeaders();
  
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  // Pages complètement publiques
  const publicPaths = ['/', '/checkout', '/merci', '/login', '/complete-profile'];
  if (publicPaths.includes(pathname)) {
    return response;
  }

  // API routes publiques
  if (pathname.startsWith('/api/stripe') || pathname.startsWith('/api/auth')) {
    return response;
  }

  // Pour les pages protégées (dashboard et chapitres)
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/chapitres')) {
    const token = request.cookies.get('auth-token')?.value;
    
    if (!token) {
      console.log('🔒 No token found for', pathname, ', redirecting to login');
      const redirectResponse = NextResponse.redirect(new URL('/login', request.url));
      Object.entries(securityHeaders).forEach(([key, value]) => {
        redirectResponse.headers.set(key, value);
      });
      return redirectResponse;
    }

    const payload = await verifyJWTToken(token);
    
    if (!payload) {
      console.log('🔒 Invalid token for', pathname, ', redirecting to login');
      // Supprimer le cookie invalide
      const redirectResponse = NextResponse.redirect(new URL('/login', request.url));
      redirectResponse.cookies.delete('auth-token');
      Object.entries(securityHeaders).forEach(([key, value]) => {
        redirectResponse.headers.set(key, value);
      });
      return redirectResponse;
    }

    console.log('✅ Valid token for user', payload.userId, 'accessing', pathname);
    // Token valide, laisser passer
    return response;
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};