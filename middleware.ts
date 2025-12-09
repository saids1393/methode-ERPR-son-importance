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

// À ajouter dans middleware.ts pour remplacer verifyJWTToken()

async function verifyJWTToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    
    // 🔍 LOGS DE DEBUG
    console.log('================================');
    console.log('🔍 [JWT VERIFY] Payload décodé:');
    console.log('   userId:', payload.userId);
    console.log('   email:', payload.email);
    console.log('   username:', payload.username);
    console.log('   Toutes les clés:', Object.keys(payload));
    console.log('   Payload complet:', JSON.stringify(payload));
    console.log('================================');
    
    return payload;
  } catch (error) {
    console.error('❌ [JWT VERIFY] Erreur lors de la vérification:', error);
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const response = NextResponse.next();
  const securityHeaders = getSecurityHeaders();
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  const publicPaths = ['/', '/checkout', '/merci', '/login', '/signup-free', '/complete-profile', '/professor/auth', '/testEcriture'];
  if (publicPaths.includes(pathname)) {
    return response;
  }

  if (pathname.startsWith('/api/stripe') || pathname.startsWith('/api/auth')) {
    return response;
  }

  if (pathname.startsWith('/dashboard') || pathname.startsWith('/chapitres')) {
    const professorCourseToken = request.cookies.get('professor-course-token')?.value;
    const userToken = request.cookies.get('auth-token')?.value;
    const professorToken = request.cookies.get('professor-token')?.value;

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

      const chapitreMatch = pathname.match(/^\/chapitres\/(\d+)(?:\/|$)/);
      if (chapitreMatch && userPayload?.userId) {
        const chapitreNumber = parseInt(chapitreMatch[1], 10);
        
        // Bloquer chapitres 2-11 pendant les 7 jours du trial, et 0-11 après expiration
        if (chapitreNumber >= 2 && chapitreNumber <= 11) {
          try {
            const apiUrl = `${request.nextUrl.origin}/api/user/check-account`;
            const checkResponse = await fetch(apiUrl, {
              method: 'POST',
              headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userToken}`
              },
              body: JSON.stringify({ userId: userPayload.userId })
            });

            const data = await checkResponse.json();
            
            // Bloquer chapitres 2-11 PENDANT le trial (pas expiré)
            if (data.accountType === 'FREE_TRIAL' && !data.trialExpired) {
              const redirectResponse = NextResponse.redirect(new URL('/dashboard', request.url));
              Object.entries(securityHeaders).forEach(([key, value]) => redirectResponse.headers.set(key, value));
              return redirectResponse;
            }
            
            // Bloquer chapitres 2-11 APRES expiration si pas PAID_FULL
            if (data.accountType === 'FREE_TRIAL' && data.trialExpired && data.accountType !== 'PAID_FULL') {
              const redirectResponse = NextResponse.redirect(new URL('/dashboard', request.url));
              Object.entries(securityHeaders).forEach(([key, value]) => redirectResponse.headers.set(key, value));
              return redirectResponse;
            }
          } catch (error) {
            console.error('Error checking account type:', error);
          }
        }

        // Bloquer chapitres 0-1 SEULEMENT après expiration
        if ((chapitreNumber === 0 || chapitreNumber === 1) && userPayload?.userId) {
          try {
            const apiUrl = `${request.nextUrl.origin}/api/user/check-account`;
            const checkResponse = await fetch(apiUrl, {
              method: 'POST',
              headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userToken}`
              },
              body: JSON.stringify({ userId: userPayload.userId })
            });

            const data = await checkResponse.json();
            
            if (data.accountType === 'FREE_TRIAL' && data.trialExpired && data.accountType !== 'PAID_FULL') {
              const redirectResponse = NextResponse.redirect(new URL('/dashboard', request.url));
              Object.entries(securityHeaders).forEach(([key, value]) => redirectResponse.headers.set(key, value));
              return redirectResponse;
            }
          } catch (error) {
            console.error('Error checking account type:', error);
          }
        }
      }

      return response;
    }
  }

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

  // Vérifier les restrictions pour FREE_TRIAL
  const needsAccountCheck = pathname.match(/^\/chapitres\/(\d+)(?:\/|$)/) ||
                            pathname === '/accompagnement' ||
                            pathname === '/conseil' ||
                            pathname === '/niveaux' ||
                            pathname === '/devoirs';
  
  if (needsAccountCheck) {
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
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`
        },
        body: JSON.stringify({ userId: userPayload.userId })
      });

      const data = await checkResponse.json();
      
      console.log('🔍 MIDDLEWARE - Chemin:', pathname);
      console.log('🔍 MIDDLEWARE - Type de compte:', data.accountType);
      console.log('🔍 MIDDLEWARE - Trial expiré:', data.trialExpired);
      
      // Si compte payant complet, tout est accessible
      if (data.accountType === 'PAID_FULL') {
        console.log('✅ MIDDLEWARE - PAID_FULL: Accès autorisé pour', pathname);
        return response;
      }
      
      // Si FREE_TRIAL
      if (data.accountType === 'FREE_TRIAL') {
        console.log('🔶 MIDDLEWARE - FREE_TRIAL détecté');
        // Si trial expiré: bloquer tout sauf dashboard et notice
        if (data.trialExpired) {
          console.log('❌ MIDDLEWARE - Trial expiré, redirection vers dashboard');
          const redirectResponse = NextResponse.redirect(new URL('/dashboard', request.url));
          Object.entries(securityHeaders).forEach(([key, value]) => redirectResponse.headers.set(key, value));
          return redirectResponse;
        }
        
        // Si trial actif: autoriser chapitres 0 et 1, devoirs, niveaux
        // Bloquer chapitres 2-11, accompagnement, conseil
        const chapterMatch = pathname.match(/^\/chapitres\/(\d+)(?:\/|$)/);
        if (chapterMatch) {
          const chapterNum = parseInt(chapterMatch[1], 10);
          if (chapterNum > 1) {
            console.log('❌ MIDDLEWARE - Chapitre', chapterNum, 'bloqué pendant trial actif');
            // Chapitres 2-11 bloqués pendant trial actif
            const redirectResponse = NextResponse.redirect(new URL('/dashboard', request.url));
            Object.entries(securityHeaders).forEach(([key, value]) => redirectResponse.headers.set(key, value));
            return redirectResponse;
          }
        }
        
        // Bloquer accompagnement et conseil pendant trial actif
        if (pathname === '/accompagnement' || pathname === '/conseil') {
          console.log('❌ MIDDLEWARE - Accompagnement/Conseil bloqué pendant trial actif');
          const redirectResponse = NextResponse.redirect(new URL('/dashboard', request.url));
          Object.entries(securityHeaders).forEach(([key, value]) => redirectResponse.headers.set(key, value));
          return redirectResponse;
        }
        
        console.log('✅ MIDDLEWARE - FREE_TRIAL: Accès autorisé pour', pathname);
        // Devoirs et niveaux sont accessibles pendant trial actif
        return response;
      }
      
      // Si aucun type de compte reconnu ou autre erreur
      console.log('❌ MIDDLEWARE - Type de compte non reconnu:', data.accountType);
      console.log('🔄 MIDDLEWARE - Autorisation par défaut pour:', pathname);
      return response;
    } catch (error) {
      console.error('❌ MIDDLEWARE - Erreur lors de la vérification du compte:', error);
      console.log('🔄 MIDDLEWARE - Autorisation par défaut (erreur API) pour:', pathname);
      // En cas d'erreur API, autoriser l'accès par défaut
      // L'utilisateur sera géré au niveau de la page
    }

    return response;
  }

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