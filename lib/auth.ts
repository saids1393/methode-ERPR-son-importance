import { SignJWT, jwtVerify } from 'jose';
import { prisma } from './prisma';
import { NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { cookies } from 'next/headers';
import { sendPasswordResetEmail } from './email';

// ⭐ CACHE EN MÉMOIRE - TRÈS IMPORTANT !
interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const userCache = new Map<string, CacheEntry<UserData | null>>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

function getCachedUser(id: string): UserData | null | undefined {
  const cached = userCache.get(id);
  if (cached) {
    const now = Date.now();
    if (now - cached.timestamp < CACHE_DURATION) {
      return cached.data; // Cache valide
    } else {
      userCache.delete(id); // Cache expiré
    }
  }
  return undefined;
}

function setCachedUser(id: string, user: UserData | null): void {
  userCache.set(id, {
    data: user,
    timestamp: Date.now(),
  });
}

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
  [x: string]: any;
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

// ⭐ OPTIMISÉ AVEC CACHE
export async function getUserById(id: string): Promise<UserData | null> {
  try {
    // Vérifier le cache d'abord
    const cached = getCachedUser(id);
    if (cached !== undefined) {
      console.log(`[CACHE HIT] User ${id}`);
      return cached;
    }

    console.log(`[CACHE MISS] Fetching user ${id} from DB`);
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
    
    // Mettre en cache le résultat (même null)
    setCachedUser(id, user);
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
        stripeCustomerId: userData.stripeCustomerId || `default_${Date.now()}`,
        stripeSessionId: userData.stripeSessionId || `default_session_${Date.now()}`,
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
    gender?: 'HOMME' | 'FEMME';
  }
): Promise<UserData> {
  try {
    const updateData: {
      username?: string | null;
      password?: string;
      gender?: 'HOMME' | 'FEMME';
    } = {};

    if (data.username !== undefined) {
      if (data.username === '') {
        updateData.username = null;
      } else {
        if (data.username.length < 3 || data.username.length > 30) {
          throw new Error('Username must be between 3 and 30 characters');
        }
        
        const existingUser = await prisma.user.findUnique({
          where: { username: data.username }
        });
        
        if (existingUser && existingUser.id !== userId) {
          throw new Error('Pseudo utilisé veuillez choisir un autre pseudo ou ajoutez des chiffres ou des lettres');
        }
        
        updateData.username = data.username;
      }
    }

    if (data.password !== undefined) {
      if (data.password.length < 8) {
        throw new Error('Password must be at least 8 characters long');
      }
      updateData.password = await bcrypt.hash(data.password, 12);
    }

    if (data.gender !== undefined) {
      if (!['HOMME', 'FEMME'].includes(data.gender)) {
        throw new Error('Invalid gender value');
      }
      updateData.gender = data.gender;
    }

    if (Object.keys(updateData).length === 0) {
      throw new Error('No data to update');
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

    // ⭐ INVALIDER LE CACHE APRÈS UNE MISE À JOUR
    userCache.delete(userId);
    console.log(`[CACHE INVALIDATED] User ${userId} updated`);

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
      const cookieStore = await cookies();
      token = cookieStore.get('auth-token')?.value;
    }
    
    if (!token) return null;

    const decoded = await verifyToken(token);
    // ⭐ UTILISE LE CACHE - RÉDUIT LES APPELS DB DE 90%
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

export function generateResetToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

export async function createPasswordResetRequest(email: string): Promise<{ success: boolean; message: string }> {
  try {
    const user = await getUserByEmail(email);
    
    if (!user || !user.isActive) {
      return {
        success: true,
        message: 'Si cet email existe dans notre système, vous recevrez un lien de réinitialisation.'
      };
    }

    const resetToken = generateResetToken();
    const resetExpires = new Date();
    resetExpires.setHours(resetExpires.getHours() + 1);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpires: resetExpires,
      },
    });

    const BASE_URL = process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const resetUrl = `${BASE_URL}/reset-password?token=${resetToken}`;

    const emailSent = await sendPasswordResetEmail(user.email, resetUrl, user.username || undefined);
    
    if (!emailSent) {
      console.error('Erreur lors de l\'envoi de l\'email de réinitialisation');
    }

    // ⭐ INVALIDER LE CACHE
    userCache.delete(user.id);

    return {
      success: true,
      message: 'Si cet email existe dans notre système, vous recevrez un lien de réinitialisation.'
    };
  } catch (error) {
    console.error('Erreur lors de la création de la demande de réinitialisation:', error);
    return {
      success: false,
      message: 'Une erreur est survenue. Veuillez réessayer.'
    };
  }
}

export async function resetPassword(token: string, newPassword: string): Promise<{ success: boolean; message: string }> {
  try {
    if (!token || !newPassword) {
      return {
        success: false,
        message: 'Token et nouveau mot de passe requis.'
      };
    }

    if (newPassword.length < 8) {
      return {
        success: false,
        message: 'Le mot de passe doit contenir au moins 8 caractères.'
      };
    }

    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpires: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      return {
        success: false,
        message: 'Token invalide ou expiré.'
      };
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpires: null,
      },
    });

    // ⭐ INVALIDER LE CACHE
    userCache.delete(user.id);

    return {
      success: true,
      message: 'Mot de passe réinitialisé avec succès.'
    };
  } catch (error) {
    console.error('Erreur lors de la réinitialisation du mot de passe:', error);
    return {
      success: false,
      message: 'Une erreur est survenue. Veuillez réessayer.'
    };
  }
}