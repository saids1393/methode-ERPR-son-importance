import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/auth';

export function middleware(req: NextRequest) {
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
