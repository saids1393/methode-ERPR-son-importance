import { SignJWT, jwtVerify } from 'jose';
import { prisma } from './prisma';
import bcrypt from 'bcryptjs';
import { NextRequest } from 'next/server';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-secret');

/**
 * Vérifie un token JWT et retourne le payload
 */
export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload;
  } catch (error) {
    return null;
  }
}

/**
 * Génère un token JWT pour un utilisateur
 */
export async function generateAuthToken(user: {
  id: string;
  email: string;
  accountType: string;
  subscriptionPlan?: string | null;
  subscriptionEndDate?: Date | null;
}): Promise<string> {
  const token = await new SignJWT({
    userId: user.id,
    email: user.email,
    accountType: user.accountType,
    subscriptionPlan: user.subscriptionPlan || null,
    subscriptionEndDate: user.subscriptionEndDate?.toISOString() || null,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET);

  return token;
}

/**
 * Récupère l'utilisateur authentifié depuis une requête
 */
export async function getAuthUserFromRequest(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value;
  
  if (!token) {
    return null;
  }

  try {
    const payload = await verifyToken(token);
    
    if (!payload?.userId) {
      return null;
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId as string },
      select: {
        id: true,
        email: true,
        username: true,
        gender: true,
        isActive: true,
        accountType: true,
        subscriptionPlan: true,
        subscriptionStartDate: true,
        subscriptionEndDate: true,
        stripeCustomerId: true,
        completedPages: true,
        completedQuizzes: true,
        completedPagesTajwid: true,
        completedQuizzesTajwid: true,
        studyTimeSeconds: true,
        createdAt: true,
      }
    });

    return user;
  } catch (error) {
    return null;
  }
}

/**
 * Vérifie si un utilisateur a un abonnement actif
 */
export function hasActiveSubscription(user: {
  accountType: string;
  subscriptionEndDate?: Date | null;
}): boolean {
  // Liste des types de compte qui ont accès
  const activeAccountTypes = ['ACTIVE', 'PAID', 'PAID_FULL', 'PAID_LEGACY', 'FREE_TRIAL'];
  
  if (activeAccountTypes.includes(user.accountType)) {
    // Si date de fin définie, vérifier qu'elle n'est pas expirée
    if (user.subscriptionEndDate) {
      return new Date(user.subscriptionEndDate) > new Date();
    }
    // Pas de date de fin = accès illimité
    return true;
  }

  // Compte annulé mais encore dans la période payée
  if (user.accountType === 'CANCELLED' && user.subscriptionEndDate) {
    return new Date(user.subscriptionEndDate) > new Date();
  }

  return false;
}

/**
 * Hash un mot de passe
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

/**
 * Compare un mot de passe avec son hash
 */
export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

/**
 * Crée un nouvel utilisateur après paiement Stripe
 */
export async function createUser(userData: {
  email: string;
  password?: string;
  stripeCustomerId?: string;
  stripeSessionId?: string;
  subscriptionPlan?: 'SOLO' | 'COACHING';
  stripeSubscriptionId?: string;
}) {
  // Vérifier si l'utilisateur existe déjà
  const existingUser = await prisma.user.findUnique({
    where: { email: userData.email }
  });

  if (existingUser) {
    // Mettre à jour l'utilisateur existant avec l'abonnement
    const updatedUser = await prisma.user.update({
      where: { id: existingUser.id },
      data: {
        isActive: true,
        accountType: 'ACTIVE',
        stripeCustomerId: userData.stripeCustomerId,
        stripeSessionId: userData.stripeSessionId,
        subscriptionPlan: userData.subscriptionPlan,
        stripeSubscriptionId: userData.stripeSubscriptionId,
        subscriptionStartDate: new Date(),
      },
      select: {
        id: true,
        email: true,
        username: true,
        isActive: true,
        accountType: true,
        subscriptionPlan: true,
        stripeCustomerId: true,
        stripeSessionId: true,
        createdAt: true,
      }
    });
    return updatedUser;
  }

  // Créer un nouvel utilisateur
  const hashedPassword = userData.password 
    ? await hashPassword(userData.password) 
    : null;

  const user = await prisma.user.create({
    data: {
      email: userData.email,
      password: hashedPassword,
      isActive: true,
      accountType: 'ACTIVE',
      stripeCustomerId: userData.stripeCustomerId,
      stripeSessionId: userData.stripeSessionId,
      subscriptionPlan: userData.subscriptionPlan,
      stripeSubscriptionId: userData.stripeSubscriptionId,
      subscriptionStartDate: new Date(),
    },
    select: {
      id: true,
      email: true,
      username: true,
      isActive: true,
      accountType: true,
      subscriptionPlan: true,
      stripeCustomerId: true,
      stripeSessionId: true,
      createdAt: true,
    }
  });

  return user;
}

/**
 * Récupère un utilisateur par email
 */
export async function getUserByEmail(email: string) {
  return await prisma.user.findUnique({
    where: { email },
  });
}