import jwt from 'jsonwebtoken';
import { User } from '@/types/auth';

export function generateToken(user: User): string {
  return jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET!,
    { expiresIn: '1d' }
  );
}

export async function verifyToken(token: string): Promise<{ id: string; email: string } | null> {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string; email: string };
    return decoded;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}