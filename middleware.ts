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
  const publicPaths = ['/', '/checkout', '/merci', '/login', '/complete-profile', '/professor/auth'];
  if (publicPaths.includes(pathname)) {
    return response;
  }

  // API routes publiques
  if (pathname.startsWith('/api/stripe') || pathname.startsWith('/api/auth')) {
    return response;
  }

  // Pour les pages protégées (dashboard et chapitres)
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/chapitres')) {
    // Récupérer tous les tokens disponibles
    const professorCourseToken = request.cookies.get('professor-course-token')?.value;
    const userToken = request.cookies.get('auth-token')?.value;
    const professorToken = request.cookies.get('professor-token')?.value;

    console.log('🔍 TOKENS DISPONIBLES:', {
      professorCourse: !!professorCourseToken,
      user: !!userToken,
      professor: !!professorToken,
      path: pathname
    });

    // PRIORITÉ 1: Accès professeur au cours (chapitres uniquement)
    if (professorCourseToken && pathname.startsWith('/chapitres')) {
      console.log('👨‍🏫 VÉRIFICATION TOKEN PROFESSEUR COURS');

      const professorPayload = await verifyJWTToken(professorCourseToken);

      if (!professorPayload || professorPayload.role !== 'professor' || !professorPayload.isProfessorMode) {
        console.log('❌ TOKEN PROFESSEUR COURS INVALIDE');
        const redirectResponse = NextResponse.redirect(new URL('/professor/auth', request.url));
        redirectResponse.cookies.delete('professor-course-token');
        Object.entries(securityHeaders).forEach(([key, value]) => {
          redirectResponse.headers.set(key, value);
        });
        return redirectResponse;
      }

      console.log('✅ ACCÈS PROFESSEUR COURS VALIDÉ:', professorPayload.username);
      return response;
    }

    // PRIORITÉ 2: Accès dashboard étudiant
    if (pathname.startsWith('/dashboard')) {
      if (!userToken) {
        // Si pas de token étudiant, mais token prof présent, redirige vers /professor
        if (professorToken) {
          return NextResponse.redirect(new URL('/professor', request.url));
        }
        console.log('🔒 DASHBOARD ÉTUDIANT - AUCUN TOKEN');
        const redirectResponse = NextResponse.redirect(new URL('/login', request.url));
        Object.entries(securityHeaders).forEach(([key, value]) => {
          redirectResponse.headers.set(key, value);
        });
        return redirectResponse;
      }

      const userPayload = await verifyJWTToken(userToken);

      if (!userPayload || userPayload.role === 'professor') {
        // Si token invalide ou rôle prof avec token étudiant => redirige vers /professor
        if (professorToken) {
          return NextResponse.redirect(new URL('/professor', request.url));
        }
        console.log('🔒 DASHBOARD ÉTUDIANT - TOKEN INVALIDE OU PROFESSEUR');
        const redirectResponse = NextResponse.redirect(new URL('/login', request.url));
        redirectResponse.cookies.delete('auth-token');
        Object.entries(securityHeaders).forEach(([key, value]) => {
          redirectResponse.headers.set(key, value);
        });
        return redirectResponse;
      }

      console.log('✅ ACCÈS DASHBOARD ÉTUDIANT VALIDÉ:', userPayload.userId);
      return response;
    }

    // PRIORITÉ 3: Accès chapitres étudiant (sans token professeur)
    if (pathname.startsWith('/chapitres')) {
      if (!userToken) {
        // Si pas de token étudiant, mais token prof présent, redirige vers /professor
        if (professorToken) {
          return NextResponse.redirect(new URL('/professor', request.url));
        }
        console.log('🔒 CHAPITRES ÉTUDIANT - AUCUN TOKEN');
        const redirectResponse = NextResponse.redirect(new URL('/login', request.url));
        Object.entries(securityHeaders).forEach(([key, value]) => {
          redirectResponse.headers.set(key, value);
        });
        return redirectResponse;
      }

      const userPayload = await verifyJWTToken(userToken);

      if (!userPayload || userPayload.role === 'professor') {
        if (professorToken) {
          return NextResponse.redirect(new URL('/professor', request.url));
        }
        console.log('🔒 CHAPITRES ÉTUDIANT - TOKEN INVALIDE OU PROFESSEUR');
        const redirectResponse = NextResponse.redirect(new URL('/login', request.url));
        redirectResponse.cookies.delete('auth-token');
        Object.entries(securityHeaders).forEach(([key, value]) => {
          redirectResponse.headers.set(key, value);
        });
        return redirectResponse;
      }

      console.log('✅ ACCÈS CHAPITRES ÉTUDIANT VALIDÉ:', userPayload.userId);
      return response;
    }
  }

  // Pages professeur - vérification séparée
  if (pathname.startsWith('/professor')) {
    // Page d'auth professeur - publique
    if (pathname === '/professor/auth') {
      return response;
    }

    // Autres pages professeur - protégées
    const professorToken = request.cookies.get('professor-token')?.value;

    if (!professorToken) {
      console.log('🔒 ESPACE PROFESSEUR - AUCUN TOKEN');
      const redirectResponse = NextResponse.redirect(new URL('/professor/auth', request.url));
      Object.entries(securityHeaders).forEach(([key, value]) => {
        redirectResponse.headers.set(key, value);
      });
      return redirectResponse;
    }

    const professorPayload = await verifyJWTToken(professorToken);

    if (!professorPayload || professorPayload.role !== 'professor') {
      console.log('🔒 ESPACE PROFESSEUR - TOKEN INVALIDE');
      const redirectResponse = NextResponse.redirect(new URL('/professor/auth', request.url));
      redirectResponse.cookies.delete('professor-token');
      Object.entries(securityHeaders).forEach(([key, value]) => {
        redirectResponse.headers.set(key, value);
      });
      return redirectResponse;
    }

    console.log('✅ ACCÈS ESPACE PROFESSEUR VALIDÉ:', professorPayload.username);
    return response;
  }

  // Pages admin - vérification supplémentaire
  if (pathname.startsWith('/admin')) {
    const token = request.cookies.get('auth-token')?.value;

    if (!token) {
      console.log('🔒 No token found for admin area, redirecting to login');
      const redirectResponse = NextResponse.redirect(new URL('/login', request.url));
      Object.entries(securityHeaders).forEach(([key, value]) => {
        redirectResponse.headers.set(key, value);
      });
      return redirectResponse;
    }

    const payload = await verifyJWTToken(token);

    if (!payload) {
      console.log('🔒 Invalid token for admin area, redirecting to login');
      const redirectResponse = NextResponse.redirect(new URL('/login', request.url));
      redirectResponse.cookies.delete('auth-token');
      Object.entries(securityHeaders).forEach(([key, value]) => {
        redirectResponse.headers.set(key, value);
      });
      return redirectResponse;
    }

    const ADMIN_EMAILS = [process.env.ADMIN_EMAIL || 'soidroudinesaid51@gmail.com'];

    if (typeof payload.email !== 'string') {
      console.warn('❌ Invalid payload.email type:', typeof payload.email);
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    if (!ADMIN_EMAILS.includes(payload.email)) {
      console.log('🔒 Non-admin user trying to access admin area:', payload.email);
      const redirectResponse = NextResponse.redirect(new URL('/dashboard', request.url));
      Object.entries(securityHeaders).forEach(([key, value]) => {
        redirectResponse.headers.set(key, value);
      });
      return redirectResponse;
    }

    console.log('✅ Admin user', payload.email, 'accessing', pathname);
    return response;
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
