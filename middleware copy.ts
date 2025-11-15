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

  console.log('📍 [MIDDLEWARE] Request to:', pathname);

  const response = NextResponse.next();
  const securityHeaders = getSecurityHeaders();
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  const publicPaths = ['/', '/checkout', '/merci', '/login', '/signup-free', '/complete-profile', '/professor/auth', '/testEcriture'];
  if (publicPaths.includes(pathname)) {
    console.log('✅ [MIDDLEWARE] Public path, allowing');
    return response;
  }

  if (pathname.startsWith('/api/stripe') || pathname.startsWith('/api/auth')) {
    console.log('✅ [MIDDLEWARE] Public API, allowing');
    return response;
  }

  if (pathname.startsWith('/dashboard') || pathname.startsWith('/chapitres')) {
    console.log('🔒 [MIDDLEWARE] Protected route detected');
    const professorCourseToken = request.cookies.get('professor-course-token')?.value;
    const userToken = request.cookies.get('auth-token')?.value;
    const professorToken = request.cookies.get('professor-token')?.value;

    if (professorCourseToken && pathname.startsWith('/chapitres')) {
      console.log('👨‍🏫 [MIDDLEWARE] Professor token detected');
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
      console.log('📊 [MIDDLEWARE] Dashboard route');
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
      console.log('📚 [MIDDLEWARE] Chapitres route');
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
      console.log('🔍 [CHAPITRES] Pathname:', pathname);
      console.log('🔍 [CHAPITRES] Match result:', chapitreMatch);
      
      if (chapitreMatch && userPayload?.userId) {
        const chapitreNumber = parseInt(chapitreMatch[1], 10);
        console.log('🔍 [CHAPITRES] Chapitre number:', chapitreNumber);
        console.log('🔍 [CHAPITRES] User ID:', userPayload.userId);
        
     if (chapitreNumber >= 0 && chapitreNumber <= 11) {
          console.log('✅ [CHAPITRES] Chapitre 2-11 detected, calling API...');
          try {
            const apiUrl = `${request.nextUrl.origin}/api/user/check-account`;
            console.log('🔍 [CHAPITRES] API URL:', apiUrl);
            console.log('🔍 [CHAPITRES] Auth token exists:', !!userToken);
            
            const checkResponse = await fetch(apiUrl, {
              method: 'POST',
              headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userToken}`
              },
              body: JSON.stringify({ userId: userPayload.userId })
            });

            console.log('🔍 [CHAPITRES] API Response Status:', checkResponse.status);
            const data = await checkResponse.json();
            console.log('🔍 [CHAPITRES] API Response Data:', JSON.stringify(data));
            
            if (data.accountType === 'FREE_TRIAL' || data.trialExpired) {
              console.log('🚫 [CHAPITRES] BLOCKING - accountType:', data.accountType, 'trialExpired:', data.trialExpired);
              const redirectResponse = NextResponse.redirect(new URL('/dashboard', request.url));
              Object.entries(securityHeaders).forEach(([key, value]) => redirectResponse.headers.set(key, value));
              return redirectResponse;
            } else {
              console.log('✅ [CHAPITRES] ALLOWED - User is PAID_FULL');
            }
          } catch (error) {
            console.error('❌ [CHAPITRES] Error checking account type:', error);
          }
        } else {
          console.log('✅ [CHAPITRES] Chapitre 0-1 or 12+, no restriction');
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

  const restrictedPaths = ['/accompagnement', '/conseil'];
  if (restrictedPaths.includes(pathname)) {
    console.log('🔒 [RESTRICTED] Checking FREE_TRIAL restriction for:', pathname);
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
      console.log('🔍 [RESTRICTED] API Response:', data);
      
      if (data.accountType === 'FREE_TRIAL') {
        console.log('🚫 [RESTRICTED] BLOCKING - FREE_TRIAL');
        const redirectResponse = NextResponse.redirect(new URL('/dashboard', request.url));
        Object.entries(securityHeaders).forEach(([key, value]) => redirectResponse.headers.set(key, value));
        return redirectResponse;
      }
    } catch (error) {
      console.error('Error checking account type:', error);
    }

    return response;
  }

  // ✅ NOUVELLE RESTRICTION : APRÈS expiration FREE_TRIAL (trialExpired = true)
  const postTrialRestrictedMatch = pathname.match(/^\/chapitres\/(0|1|2|3|4|5|6|7|8|9|10|11)(?:\/|$)/) || 
                                   pathname === '/devoirs' || 
                                   pathname === '/niveaux';
  if (postTrialRestrictedMatch) {
    console.log('🔒 [POST-TRIAL] Checking expired trial restriction for:', pathname);
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
      console.log('🔍 [POST-TRIAL] Calling API for user:', userPayload.userId);
      const checkResponse = await fetch(apiUrl, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`
        },
        body: JSON.stringify({ userId: userPayload.userId })
      });

      const data = await checkResponse.json();
      console.log('🔍 [POST-TRIAL] API Response:', JSON.stringify(data));
      
      if (data.trialExpired && data.accountType !== 'PAID_FULL') {
        console.log('🚫 [POST-TRIAL] BLOCKING - Trial expired and not paid');
        const redirectResponse = NextResponse.redirect(new URL('/dashboard', request.url));
        Object.entries(securityHeaders).forEach(([key, value]) => redirectResponse.headers.set(key, value));
        return redirectResponse;
      } else {
        console.log('✅ [POST-TRIAL] ALLOWED - User paid or trial active');
      }
    } catch (error) {
      console.error('❌ [POST-TRIAL] Error checking account type:', error);
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