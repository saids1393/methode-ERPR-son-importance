import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-secret');

// Rate limiting simple (en mémoire - pour production utiliser Redis)
const rateLimitMap = new Map<string, { count: number; timestamp: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 500; // 500 requêtes par minute (augmenté pour supporter les hooks)

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
    'X-XSS-Protection': '1; mode=block',
    'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  };
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now - entry.timestamp > RATE_LIMIT_WINDOW) {
    rateLimitMap.set(ip, { count: 1, timestamp: now });
    return true;
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return false;
  }

  entry.count++;
  return true;
}

function getClientIP(request: NextRequest): string {
  const xff = request.headers.get('x-forwarded-for');
  if (xff) {
    return xff.split(',')[0].trim();
  }
  return request.headers.get('x-real-ip') || 'unknown';
}

async function verifyJWTToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload;
  } catch (error) {
    return null;
  }
}

function applySecurityHeaders(response: NextResponse) {
  const securityHeaders = getSecurityHeaders();
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  return response;
}

function createRedirectResponse(url: string, request: NextRequest, deleteCookie?: string) {
  const redirectResponse = NextResponse.redirect(new URL(url, request.url));
  if (deleteCookie) {
    redirectResponse.cookies.delete(deleteCookie);
  }
  return applySecurityHeaders(redirectResponse);
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Rate limiting
  const clientIP = getClientIP(request);
  if (!checkRateLimit(clientIP)) {
    return new NextResponse('Too Many Requests', { status: 429 });
  }

  // Bloquer les requêtes suspectes
  const userAgent = request.headers.get('user-agent') || '';
  const suspiciousPatterns = [
    /sqlmap/i,
    /nikto/i,
    /nmap/i,
    /masscan/i,
    /<script/i,
    /union\s+select/i,
    /\.\.\//,
  ];
  
  if (suspiciousPatterns.some(pattern => pattern.test(pathname) || pattern.test(userAgent))) {
    return new NextResponse('Forbidden', { status: 403 });
  }

  // Crée la réponse et ajoute les headers de sécurité
  const response = NextResponse.next();
  applySecurityHeaders(response);

  // Pages publiques
  const publicPaths = [
    '/', 
    '/checkout', 
    '/merci', 
    '/login', 
    '/register',
    '/pricing',
    '/complete-profile', 
    '/professor/auth', 
    '/testEcriture',
    '/forgot-password',
    '/reset-password',
  ];
  
  if (publicPaths.includes(pathname)) {
    return response;
  }

  // API publiques (Stripe webhook doit rester accessible)
  const publicApiPaths = [
    '/api/stripe/webhook',
    '/api/stripe/create-subscription',
    '/api/stripe/verify-payment',
    '/api/auth/login',
    '/api/auth/register',
    '/api/auth/check-user',
    '/api/auth/forgot-password',
    '/api/auth/reset-password',
  ];

  // API qui nécessitent juste un token valide (pas de vérification d'abonnement)
  const authOnlyApiPaths = [
    '/api/auth/me',
    '/api/auth/get-user',
    '/api/auth/complete-profile',
    '/api/auth/logout',
    '/api/auth/time',
    '/api/user',
  ];
  
  if (publicApiPaths.some(path => pathname.startsWith(path))) {
    return response;
  }

  // API authentifiées mais sans vérification d'abonnement
  if (authOnlyApiPaths.some(path => pathname.startsWith(path))) {
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }
    
    const payload = await verifyJWTToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Token invalide' }, { status: 401 });
    }
    
    return response;
  }

  // API authentifiées (nécessitent un token valide)
  if (pathname.startsWith('/api/')) {
    const token = request.cookies.get('auth-token')?.value;
    const professorToken = request.cookies.get('professor-token')?.value;

    // API professeur
    if (pathname.startsWith('/api/professor')) {
      if (!professorToken) {
        return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
      }
      const payload = await verifyJWTToken(professorToken);
      if (!payload || payload.role !== 'professor') {
        return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
      }
      return response;
    }

    // API utilisateur standard
    if (!token) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }
    
    const payload = await verifyJWTToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Token invalide' }, { status: 401 });
    }

    // Vérifier l'abonnement pour les API de contenu
    const contentApiPaths = ['/api/cours', '/api/chapitres', '/api/videos', '/api/progression'];
    if (contentApiPaths.some(path => pathname.startsWith(path))) {
      const accountType = payload.accountType as string;
      const subscriptionEndDate = payload.subscriptionEndDate as string | null;
      
      if (!checkActiveSubscription(accountType, subscriptionEndDate)) {
        return NextResponse.json({ 
          error: 'Abonnement requis',
          code: 'SUBSCRIPTION_REQUIRED'
        }, { status: 403 });
      }
    }

    return response;
  }

  // Pages protégées (dashboard, chapitres, niveaux, accompagnement, etc.)
  const protectedPaths = ['/dashboard', '/chapitres', '/niveaux', '/accompagnement', '/tajwid', '/devoirs', '/notice', '/conseil', '/chapitres-tajwid', '/devoirs-tajwid', '/abonnement'];
  const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path));

  if (isProtectedPath) {
    const professorCourseToken = request.cookies.get('professor-course-token')?.value;
    const userToken = request.cookies.get('auth-token')?.value;
    const professorToken = request.cookies.get('professor-token')?.value;

    // Priorité 1: accès professeur aux chapitres
    if (professorCourseToken && pathname.startsWith('/chapitres')) {
      const professorPayload = await verifyJWTToken(professorCourseToken);
      if (!professorPayload || professorPayload.role !== 'professor' || !professorPayload.isProfessorMode) {
        return createRedirectResponse('/professor/auth', request, 'professor-course-token');
      }
      return response;
    }

    // Priorité 2: utilisateur connecté
    if (userToken) {
      const userPayload = await verifyJWTToken(userToken);
      
      if (!userPayload) {
        return createRedirectResponse('/login', request, 'auth-token');
      }

      // Vérifier si c'est un professeur qui essaie d'accéder au dashboard étudiant
      if (userPayload.role === 'professor') {
        if (professorToken) {
          return createRedirectResponse('/professor', request);
        }
        return createRedirectResponse('/login', request, 'auth-token');
      }

      // 🔒 Bloquer /accompagnement si pas plan COACHING - retourne 404
      if (pathname.startsWith('/accompagnement')) {
        // Vérifier le plan actuel via API (Edge Runtime ne supporte pas Prisma)
        try {
          const baseUrl = request.nextUrl.origin;
          const checkResponse = await fetch(`${baseUrl}/api/user/check-coaching`, {
            headers: {
              'Cookie': request.headers.get('cookie') || '',
            },
          });
          
          if (!checkResponse.ok) {
            return new NextResponse('Not Found', { status: 404 });
          }
          
          const data = await checkResponse.json();
          if (data.subscriptionPlan !== 'COACHING') {
            return new NextResponse('Not Found', { status: 404 });
          }
        } catch (error) {
          console.error('Erreur vérification coaching:', error);
          return new NextResponse('Not Found', { status: 404 });
        }
      }

      // L'utilisateur est connecté avec un token valide - laisser passer
      // La vérification de l'abonnement se fait côté page/API si nécessaire
      return response;
    }

    // Pas de token utilisateur
    if (professorToken) {
      return createRedirectResponse('/professor', request);
    }
    
    return createRedirectResponse('/login', request);
  }

  // Pages professeur
  if (pathname.startsWith('/professor')) {
    if (pathname === '/professor/auth') {
      return response;
    }
    
    const professorToken = request.cookies.get('professor-token')?.value;
    
    if (!professorToken) {
      return createRedirectResponse('/professor/auth', request);
    }
    
    const professorPayload = await verifyJWTToken(professorToken);
    
    if (!professorPayload || professorPayload.role !== 'professor') {
      return createRedirectResponse('/professor/auth', request, 'professor-token');
    }
    
    return response;
  }

  // Pages admin
  if (pathname.startsWith('/admin')) {
    const token = request.cookies.get('auth-token')?.value;
    
    if (!token) {
      return createRedirectResponse('/login', request);
    }
    
    const payload = await verifyJWTToken(token);
    
    if (!payload) {
      return createRedirectResponse('/login', request, 'auth-token');
    }
    
    const ADMIN_EMAILS = [
      process.env.ADMIN_EMAIL || 'soidroudinesaid51@gmail.com',
      process.env.NEXT_PUBLIC_ADMIN_EMAIL,
    ].filter(Boolean);
    
    if (typeof payload.email !== 'string' || !ADMIN_EMAILS.includes(payload.email)) {
      return createRedirectResponse('/dashboard', request);
    }
    
    return response;
  }

  return response;
}

/**
 * Vérifie si l'abonnement est actif
 */
function checkActiveSubscription(accountType: string, subscriptionEndDate: string | null): boolean {
  if (accountType === 'ACTIVE') {
    if (subscriptionEndDate) {
      return new Date(subscriptionEndDate) > new Date();
    }
    return true;
  }

  if (accountType === 'CANCELLED' && subscriptionEndDate) {
    return new Date(subscriptionEndDate) > new Date();
  }

  return false;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
};