import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

export interface JWTPayload {
  userId: string;
  email: string;
}

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined in the environment variables');
}

// 🔐 Hash du mot de passe
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

// 🔐 Vérifie que le mot de passe en clair correspond au hash
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

// 🔑 Génère un JWT valable 7 jours
export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET!, { expiresIn: '7d' });
}

// 🔎 Vérifie et décode le token
export function verifyToken(token: string): JWTPayload {
  return jwt.verify(token, JWT_SECRET!) as JWTPayload;
}

// 🔍 Récupère un utilisateur par ID (pour `/me`)
export async function getUserById(id: string) {
  try {
    return await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        email: true,
        createdAt: true,
      },
    });
  } catch (error) {
    console.error('❌ Erreur lors de la récupération de l’utilisateur par ID :', error);
    return null;
  }
}

// 🔍 Récupère un utilisateur par email (pour login/signup)
export async function getUserByEmail(email: string) {
  try {
    return await prisma.user.findUnique({
      where: { email },
    });
  } catch (error) {
    console.error('❌ Erreur lors de la récupération de l’utilisateur par email :', error);
    return null;
  }
}

// ✅ Crée un nouvel utilisateur (signup)
export async function createUser(userData: {
  username: string;
  email: string;
  password: string;
}) {
  try {
    const hashedPassword = await hashPassword(userData.password);

    const user = await prisma.user.create({
      data: {
        username: userData.username,
        email: userData.email,
        password: hashedPassword,
      },
      select: {
        id: true,
        username: true,
        email: true,
        createdAt: true,
      },
    });

    return user;
  } catch (error) {
    console.error('❌ Erreur lors de la création de l’utilisateur :', error);
    throw error;
  }
}
