import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  if (!token) return NextResponse.redirect(new URL("/(auth)/signin", req.url));

  try {
    jwt.verify(token, process.env.JWT_SECRET!);
    return NextResponse.next();
  } catch (err) {
    return NextResponse.redirect(new URL("/(auth)/signin", req.url));
  }
}

export const config = {
  matcher: ["/chapitres/:path*", "/api/chapters/:path*"], // à adapter selon les routes à protéger
};
