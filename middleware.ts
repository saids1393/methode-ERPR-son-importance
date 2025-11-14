import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-secret');

function getSecurityHeaders() {
  return {
    'Content-Security-Policy':
      "default-src 'self'; " +
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://checkout.stripe.com; " +
      "style-src 'self' 'unsafe-inline' https://checkout.stripe.com https://fonts.googleapis.com; " +
      "img-src 'self' data: blob: https: https://*.stripe.com; " +
      "connect-src 'self' https: wss: ws: https://api.stripe.com https://checkout.stripe.com; " +
      "font-src 'self' data: https://fonts.gstatic.com; " +
      "frame-src 'self' https://js.stripe.com https://checkout.stripe.com https://hooks.stripe.com; " +
      "frame-ancestors 'none'; " +
      "media-src 'self' blob:; " +
      "object-src 'none'; " +
      "base-uri 'self'; " +
      "form-action 'self' https://checkout.stripe.com; " +
      "manifest-src 'self';",
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'X-Frame-Options': 'DENY',
    'Permissions-Policy': 'geolocation=(), microphone=()',
  };
}

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

  // Crée la réponse et ajoute les headers de sécurité
  const response = NextResponse.next();
  const securityHeaders = getSecurityHeaders();
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  // Pages publiques
  const publicPaths = ['/', '/checkout', '/merci', '/login', '/signup-free', '/complete-profile', '/professor/auth', '/testEcriture'];
  if (publicPaths.includes(pathname)) {
    return response;
  }

  // API publiques
  if (pathname.startsWith('/api/stripe') || pathname.startsWith('/api/auth')) {
    return response;
  }

  // Pages protégées (dashboard, chapitres)
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/chapitres')) {
    const professorCourseToken = request.cookies.get('professor-course-token')?.value;
    const userToken = request.cookies.get('auth-token')?.value;
    const professorToken = request.cookies.get('professor-token')?.value;

    // Priorité 1: accès professeur aux chapitres
    if (professorCourseToken && pathname.startsWith('/chapitres')) {
      const professorPayload = await verifyJWTToken(professorCourseToken);
      if (!professorPayload || professorPayload.role !== 'professor' || !professorPayload.isProfessorMode) {
        const redirectResponse = NextResponse.redirect(new URL('/professor/auth', request.url));
        redirectResponse.cookies.delete('professor-course-token');
        Object.entries(securityHeaders).forEach(([key, value]) => {
          redirectResponse.headers.set(key, value);
        });
        return redirectResponse;
      }
      return response;
    }

    // Priorité 2: dashboard étudiant
    if (pathname.startsWith('/dashboard')) {
      if (!userToken) {
        if (professorToken) return NextResponse.redirect(new URL('/professor', request.url));
        const redirectResponse = NextResponse.redirect(new URL('/login', request.url));
        Object.entries(securityHeaders).forEach(([key, value]) => redirectResponse.headers.set(key, value));
        return redirectResponse;
      }
      const userPayload = await verifyJWTToken(userToken);
      if (!userPayload || userPayload.role === 'professor') {
        if (professorToken) return NextResponse.redirect(new URL('/professor', request.url));
        const redirectResponse = NextResponse.redirect(new URL('/login', request.url));
        redirectResponse.cookies.delete('auth-token');
        Object.entries(securityHeaders).forEach(([key, value]) => redirectResponse.headers.set(key, value));
        return redirectResponse;
      }
      return response;
    }

    // Priorité 3: chapitres étudiant (sans token professeur)
    if (pathname.startsWith('/chapitres')) {
      if (!userToken) {
        if (professorToken) return NextResponse.redirect(new URL('/professor', request.url));
        const redirectResponse = NextResponse.redirect(new URL('/login', request.url));
        Object.entries(securityHeaders).forEach(([key, value]) => redirectResponse.headers.set(key, value));
        return redirectResponse;
      }
      const userPayload = await verifyJWTToken(userToken);
      if (!userPayload || userPayload.role === 'professor') {
        if (professorToken) return NextResponse.redirect(new URL('/professor', request.url));
        const redirectResponse = NextResponse.redirect(new URL('/login', request.url));
        redirectResponse.cookies.delete('auth-token');
        Object.entries(securityHeaders).forEach(([key, value]) => redirectResponse.headers.set(key, value));
        return redirectResponse;
      }

      // Vérifier la restriction FREE_TRIAL pour tous les chapitres si expiré
      const chapitreMatch = pathname.match(/^\/chapitres\/(\d+)(?:\/|$)/);
      if (chapitreMatch && userPayload?.userId) {
        const chapitreNumber = parseInt(chapitreMatch[1], 10);
        try {
          const apiUrl = `${request.nextUrl.origin}/api/user/check-account`;
          const checkResponse = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: userPayload.userId })
          });

          const data = await checkResponse.json();

          // Bloquer TOUS les chapitres si FREE_TRIAL expiré
          if (data.accountType === 'FREE_TRIAL' && data.trialExpired === true) {
            const redirectResponse = NextResponse.redirect(new URL('/dashboard', request.url));
            Object.entries(securityHeaders).forEach(([key, value]) => redirectResponse.headers.set(key, value));
            return redirectResponse;
          }

          // Bloquer chapitres 2-11 si FREE_TRIAL actif (non expiré)
          if (chapitreNumber >= 2 && chapitreNumber <= 11 && data.accountType === 'FREE_TRIAL') {
            const redirectResponse = NextResponse.redirect(new URL('/dashboard', request.url));
            Object.entries(securityHeaders).forEach(([key, value]) => redirectResponse.headers.set(key, value));
            return redirectResponse;
          }
        } catch (error) {
          console.error('Error checking account type:', error);
        }
      }

      return response;
    }
  }

  // Pages professeur
  if (pathname.startsWith('/professor')) {
    if (pathname === '/professor/auth') {
      return response;
    }
    const professorToken = request.cookies.get('professor-token')?.value;
    if (!professorToken) {
      const redirectResponse = NextResponse.redirect(new URL('/professor/auth', request.url));
      Object.entries(securityHeaders).forEach(([key, value]) => redirectResponse.headers.set(key, value));
      return redirectResponse;
    }
    const professorPayload = await verifyJWTToken(professorToken);
    if (!professorPayload || professorPayload.role !== 'professor') {
      const redirectResponse = NextResponse.redirect(new URL('/professor/auth', request.url));
      redirectResponse.cookies.delete('professor-token');
      Object.entries(securityHeaders).forEach(([key, value]) => redirectResponse.headers.set(key, value));
      return redirectResponse;
    }
    return response;
  }

  // Pages restreintes pour FREE_TRIAL EXPIRÉ: devoirs, niveaux
  const restrictedPathsForExpiredTrial = ['/devoirs', '/niveaux'];
  if (restrictedPathsForExpiredTrial.includes(pathname)) {
    const userToken = request.cookies.get('auth-token')?.value;
    if (!userToken) {
      const redirectResponse = NextResponse.redirect(new URL('/login', request.url));
      Object.entries(securityHeaders).forEach(([key, value]) => redirectResponse.headers.set(key, value));
      return redirectResponse;
    }
    const userPayload = await verifyJWTToken(userToken);
    if (!userPayload || !userPayload.userId) {
      const redirectResponse = NextResponse.redirect(new URL('/login', request.url));
      redirectResponse.cookies.delete('auth-token');
      Object.entries(securityHeaders).forEach(([key, value]) => redirectResponse.headers.set(key, value));
      return redirectResponse;
    }

    try {
      const apiUrl = `${request.nextUrl.origin}/api/user/check-account`;
      const checkResponse = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: userPayload.userId })
      });

      const data = await checkResponse.json();

      // Bloquer UNIQUEMENT si FREE_TRIAL ET expiré
      if (data.accountType === 'FREE_TRIAL' && data.trialExpired === true) {
        const redirectResponse = NextResponse.redirect(new URL('/dashboard', request.url));
        Object.entries(securityHeaders).forEach(([key, value]) => redirectResponse.headers.set(key, value));
        return redirectResponse;
      }
    } catch (error) {
      console.error('Error checking account type:', error);
    }

    return response;
  }

  // Pages restreintes pour FREE_TRIAL non expiré: accompagnement, conseil
  const restrictedPathsForActiveTrial = ['/accompagnement', '/conseil'];
  if (restrictedPathsForActiveTrial.includes(pathname)) {
    const userToken = request.cookies.get('auth-token')?.value;
    if (!userToken) {
      const redirectResponse = NextResponse.redirect(new URL('/login', request.url));
      Object.entries(securityHeaders).forEach(([key, value]) => redirectResponse.headers.set(key, value));
      return redirectResponse;
    }
    const userPayload = await verifyJWTToken(userToken);
    if (!userPayload || !userPayload.userId) {
      const redirectResponse = NextResponse.redirect(new URL('/login', request.url));
      redirectResponse.cookies.delete('auth-token');
      Object.entries(securityHeaders).forEach(([key, value]) => redirectResponse.headers.set(key, value));
      return redirectResponse;
    }

    try {
      const apiUrl = `${request.nextUrl.origin}/api/user/check-account`;
      const checkResponse = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: userPayload.userId })
      });

      const data = await checkResponse.json();

      // Bloquer si FREE_TRIAL (peu importe expiré ou non)
      if (data.accountType === 'FREE_TRIAL') {
        const redirectResponse = NextResponse.redirect(new URL('/dashboard', request.url));
        Object.entries(securityHeaders).forEach(([key, value]) => redirectResponse.headers.set(key, value));
        return redirectResponse;
      }
    } catch (error) {
      console.error('Error checking account type:', error);
    }

    return response;
  }

  // Pages admin
  if (pathname.startsWith('/admin')) {
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      const redirectResponse = NextResponse.redirect(new URL('/login', request.url));
      Object.entries(securityHeaders).forEach(([key, value]) => redirectResponse.headers.set(key, value));
      return redirectResponse;
    }
    const payload = await verifyJWTToken(token);
    if (!payload) {
      const redirectResponse = NextResponse.redirect(new URL('/login', request.url));
      redirectResponse.cookies.delete('auth-token');
      Object.entries(securityHeaders).forEach(([key, value]) => redirectResponse.headers.set(key, value));
      return redirectResponse;
    }
    const ADMIN_EMAILS = [process.env.ADMIN_EMAIL || 'soidroudinesaid51@gmail.com'];
    if (typeof payload.email !== 'string' || !ADMIN_EMAILS.includes(payload.email)) {
      const redirectResponse = NextResponse.redirect(new URL('/dashboard', request.url));
      Object.entries(securityHeaders).forEach(([key, value]) => redirectResponse.headers.set(key, value));
      return redirectResponse;
    }
    return response;
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};