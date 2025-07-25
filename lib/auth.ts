import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { prisma } from './prisma';

export interface JWTPayload {
  userId: string;
  email: string;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export function generateToken(payload: JWTPayload): string {
  return jwt.sign(
    payload,
    process.env.JWT_SECRET!,
    { expiresIn: '7d' }
  );
}

export function verifyToken(token: string): JWTPayload {
  return jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
}

export async function getUserById(id: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        email: true,
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
      where: { email }
    });
    return user;
  } catch (error) {
    console.error('Error fetching user by email:', error);
    return null;
  }
}

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
        password: hashedPassword
      },
      select: {
        id: true,
        username: true,
        email: true,
        createdAt: true
      }
    });
    return user;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}