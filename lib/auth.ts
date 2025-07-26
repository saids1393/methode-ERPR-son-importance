import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';
import { prisma } from './prisma';

export interface JWTPayload {
  userId: string;
  email: string;
}

const JWT_SECRET = process.env.JWT_SECRET!;

export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '30d' });
}

export function verifyToken(token: string): JWTPayload {
  return jwt.verify(token, JWT_SECRET) as JWTPayload;
}

export async function getUserById(id: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        isActive: true,
        createdAt: true
      }
    });
    return user;
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
}

export async function getUserByEmail(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        isActive: true,
        stripeCustomerId: true,
        stripeSessionId: true,
        createdAt: true
      }
    });
    return user;
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
    const user = await prisma.user.create({
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
        createdAt: true
      }
    });
    return user;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

export async function setAuthCookie(user: { id: string; email: string }) {
  const token = generateToken({
    userId: user.id,
    email: user.email
  });

  (await cookies()).set('auth-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 30 * 24 * 60 * 60, // 30 jours
    path: '/',
    sameSite: 'lax'
  });

  return token;
}

export async function getAuthUser() {
  try {
    const token = (await cookies()).get('auth-token')?.value;
    
    if (!token) {
      return null;
    }

    const decoded = verifyToken(token);
    const user = await getUserById(decoded.userId);
    
    if (!user || !user.isActive) {
      return null;
    }

    return user;
  } catch (error) {
    return null;
  }
}

export async function clearAuthCookie() {
  (await cookies()).delete('auth-token');
}