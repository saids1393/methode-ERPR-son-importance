import { SignJWT, jwtVerify } from 'jose';
import { prisma } from './prisma';
import { NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { cookies } from 'next/headers';

// Types basés sur le schéma Prisma
export interface JWTPayload {
  userId: string;
  email: string;
  username?: string | null;
  iat?: number;
  exp?: number;
  [key: string]: any;
}

export interface UserData {
  id: string;
  email: string;
  username: string | null;
  isActive: boolean;
  createdAt: Date;
}

export interface UserWithStripe extends UserData {
  [x: string]: any;
  stripeCustomerId: string | null;
  stripeSessionId: string | null;
}

const JWT_SECRET_STRING = process.env.JWT_SECRET;
if (!JWT_SECRET_STRING) {
  throw new Error('JWT_SECRET environment variable is required');
}

const JWT_SECRET = new TextEncoder().encode(JWT_SECRET_STRING);

export async function generateToken(payload: JWTPayload): Promise<string> {
  try {
    return await new SignJWT(payload)
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('30d')
      .sign(JWT_SECRET);
  } catch (error) {
    console.error('Error generating token:', error);
    throw new Error('Failed to generate authentication token');
  }
}

export async function verifyToken(token: string): Promise<JWTPayload> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as JWTPayload;
  } catch (error) {
    console.error('Error verifying token:', error);
    throw new Error('Invalid or expired token');
  }
}

export async function getUserById(id: string): Promise<UserData | null> {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        username: true,
        isActive: true,
        createdAt: true,
      },
    });
    
    return user;
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
}

export async function getUserByEmail(email: string): Promise<UserWithStripe | null> {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        username: true,
        isActive: true,
        stripeCustomerId: true,
        stripeSessionId: true,
        createdAt: true,
      },
    });
    
    return user;
  } catch (error) {
    console.error('Error fetching user by email:', error);
    return null;
  }
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export async function createUser(userData: {
  [x: string]: any;
  email: string;
  stripeCustomerId?: string;
  stripeSessionId?: string;
}): Promise<UserWithStripe> {
  try {
    if (!isValidEmail(userData.email)) {
      throw new Error('Invalid email format');
    }

    const existingUser = await getUserByEmail(userData.email);
    if (existingUser) {
      throw new Error('User already exists');
    }

    const user = await prisma.user.create({
      data: {
        email: userData.email,
        password: userData.password,
        isActive: true,
        stripeCustomerId: userData.stripeCustomerId || null,
        stripeSessionId: userData.stripeSessionId || null,
      },
      select: {
        id: true,
        email: true,
        username: true,
        isActive: true,
        stripeCustomerId: true,
        stripeSessionId: true,
        createdAt: true,
      },
    });

    return user;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

export async function updateUserProfile(
  userId: string, 
  data: {
    username?: string;
    password?: string;
  }
): Promise<UserData> {
  try {
    const updateData: {
      username?: string;
      password?: string;
    } = {};

    if (data.username !== undefined) {
      if (data.username.length < 3 || data.username.length > 30) {
        throw new Error('Username must be between 3 and 30 characters');
      }
      
      const existingUser = await prisma.user.findUnique({
        where: { username: data.username }
      });
      
      if (existingUser && existingUser.id !== userId) {
        throw new Error('Username already taken');
      }
      
      updateData.username = data.username;
    }

    if (data.password !== undefined) {
      if (data.password.length < 8) {
        throw new Error('Password must be at least 8 characters long');
      }
      updateData.password = await bcrypt.hash(data.password, 12);
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        email: true,
        username: true,
        isActive: true,
        createdAt: true,
      },
    });

    return user;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
}

export async function getAuthUserFromRequest(request: NextRequest): Promise<UserData | null> {
  try {
    let token: string | undefined;
    
    if (request.cookies) {
      token = request.cookies.get('auth-token')?.value;
    } else {
      // Fallback pour les cas où request.cookies n'est pas disponible
      const cookieStore = await cookies();
      token = cookieStore.get('auth-token')?.value;
    }
    
    if (!token) return null;

    const decoded = await verifyToken(token);
    const user = await getUserById(decoded.userId);
    
    if (!user || !user.isActive) return null;

    return user;
  } catch (error) {
    console.error('Error verifying token from request:', error);
    return null;
  }
}

export async function verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
  try {
    return await bcrypt.compare(plainPassword, hashedPassword);
  } catch (error) {
    console.error('Error verifying password:', error);
    return false;
  }
}

export interface AuthResult {
  user: {
    id: string;
    email: string;
    username: string | null;
    isActive: boolean;
  };
  token: string;
}

export async function authenticateUser(email: string, password: string): Promise<AuthResult> {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        username: true,
        password: true,
        isActive: true,
      },
    });

    if (!user || !user.isActive) {
      throw new Error('Invalid credentials');
    }

    if (!user.password) {
      throw new Error('Invalid credentials');
    }

    const isValidPassword = await verifyPassword(password, user.password);
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    const token = await generateToken({
      userId: user.id,
      email: user.email,
      username: user.username,
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        isActive: user.isActive,
      },
      token,
    };
  } catch (error) {
    console.error('Error authenticating user:', error);
    throw error;
  }
}

export function clearAuthCookie(): void {
  if (typeof document !== 'undefined') {
    document.cookie = 'auth-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; secure; samesite=strict';
  }
}

export function setAuthCookie(token: string): void {
  if (typeof document !== 'undefined') {
    const expires = new Date();
    expires.setDate(expires.getDate() + 30);
    
    document.cookie = `auth-token=${token}; expires=${expires.toUTCString()}; path=/; secure; samesite=strict`;
  }
}