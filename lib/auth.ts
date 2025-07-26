// lib/auth.ts

import { SignJWT, jwtVerify } from 'jose';
import { prisma } from './prisma';
import { NextRequest, NextResponse } from 'next/server';

export interface JWTPayload {
  userId: string;
  email: string;
  [key: string]: any;
}

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-secret');

export async function generateToken(payload: JWTPayload): Promise<string> {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30d')
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string): Promise<JWTPayload> {
  const { payload } = await jwtVerify(token, JWT_SECRET);
  return payload as JWTPayload;
}

export async function getUserById(id: string) {
  try {
    return await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        isActive: true,
        createdAt: true,
      },
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
}

export async function getUserByEmail(email: string) {
  try {
    return await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        isActive: true,
        stripeCustomerId: true,
        stripeSessionId: true,
        createdAt: true,
      },
    });
  } catch (error) {
    console.error('Error fetching user by email:', error);
    return null;
  }
}

export async function createUser(userData: {
  email: string;
  stripeCustomerId?: string;
  stripeSessionId?: string;
}) {
  try {
    return await prisma.user.create({
      data: {
        email: userData.email,
        isActive: true,
        stripeCustomerId: userData.stripeCustomerId,
        stripeSessionId: userData.stripeSessionId,
      },
      select: {
        id: true,
        email: true,
        isActive: true,
        stripeCustomerId: true,
        stripeSessionId: true,
        createdAt: true,
      },
    });
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

// Récupérer utilisateur à partir du token dans la requête NextRequest
export async function getAuthUserFromRequest(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value;

    if (!token) return null;

    const decoded = await verifyToken(token);
    const user = await getUserById(decoded.userId);

    if (!user || !user.isActive) return null;

    return user;
  } catch {
    return null;
  }
}

// Supprimer cookie auth-token
export function clearAuthCookie() {
  // Cette fonction sera utilisée côté client si nécessaire
  if (typeof document !== 'undefined') {
    document.cookie = 'auth-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  }
}
