// lib/security.ts - Utilitaires de sécurité

import { NextRequest } from 'next/server';

// Rate limiting en mémoire (pour production, utilisez Redis)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export interface RateLimitConfig {
  windowMs: number; // Fenêtre de temps en millisecondes
  maxAttempts: number; // Nombre maximum de tentatives
}

export function rateLimit(
  identifier: string, 
  config: RateLimitConfig = { windowMs: 15 * 60 * 1000, maxAttempts: 5 }
): { success: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const windowStart = now - config.windowMs;
  
  // Nettoyer les anciennes entrées
  for (const [key, value] of rateLimitMap.entries()) {
    if (value.resetTime < now) {
      rateLimitMap.delete(key);
    }
  }
  
  const current = rateLimitMap.get(identifier);
  
  if (!current || current.resetTime < now) {
    // Nouvelle fenêtre
    rateLimitMap.set(identifier, {
      count: 1,
      resetTime: now + config.windowMs
    });
    return {
      success: true,
      remaining: config.maxAttempts - 1,
      resetTime: now + config.windowMs
    };
  }
  
  if (current.count >= config.maxAttempts) {
    return {
      success: false,
      remaining: 0,
      resetTime: current.resetTime
    };
  }
  
  current.count++;
  return {
    success: true,
    remaining: config.maxAttempts - current.count,
    resetTime: current.resetTime
  };
}

// Validation et sanitisation des entrées
export function sanitizeInput(input: string): string {
  if (typeof input !== 'string') return '';
  
  return input
    .trim()
    .replace(/[<>]/g, '') // Supprime les balises HTML basiques
    .substring(0, 1000); // Limite la longueur
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email) && email.length <= 254;
}

export function validatePassword(password: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Le mot de passe doit contenir au moins 8 caractères');
  }
  
  if (password.length > 128) {
    errors.push('Le mot de passe ne peut pas dépasser 128 caractères');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins une minuscule');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins une majuscule');
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins un chiffre');
  }
  
  // Vérifier les mots de passe communs
  const commonPasswords = [
    'password', '123456', '123456789', 'qwerty', 'abc123', 
    'password123', 'admin', 'letmein', 'welcome', 'monkey'
  ];
  
  if (commonPasswords.includes(password.toLowerCase())) {
    errors.push('Ce mot de passe est trop commun');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

export function validateUsername(username: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (username.length < 3) {
    errors.push('Le pseudo doit contenir au moins 3 caractères');
  }
  
  if (username.length > 30) {
    errors.push('Le pseudo ne peut pas dépasser 30 caractères');
  }
  
  if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
    errors.push('Le pseudo ne peut contenir que des lettres, chiffres, tirets et underscores');
  }
  
  // Mots interdits
  const forbiddenWords = ['admin', 'root', 'system', 'null', 'undefined'];
  if (forbiddenWords.includes(username.toLowerCase())) {
    errors.push('Ce pseudo n\'est pas autorisé');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

// Obtenir l'IP du client (même derrière un proxy)
export function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (realIP) {
    return realIP;
  }
  
  // Fallback pour les cas où aucun header n'est disponible
  return 'unknown';
}

// Générer un nonce pour CSP
export function generateNonce(): string {
  return Buffer.from(crypto.getRandomValues(new Uint8Array(16))).toString('base64');
}

// Headers de sécurité
export function getSecurityHeaders(nonce?: string) {
  const headers: Record<string, string> = {
    // Protection XSS
    'X-XSS-Protection': '1; mode=block',
    
    // Empêche le MIME sniffing
    'X-Content-Type-Options': 'nosniff',
    
    // Empêche l'embedding dans des iframes
    'X-Frame-Options': 'DENY',
    
    // Force HTTPS
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    
    // Contrôle du referrer
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    
    // Permissions Policy
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  };
  
  // CSP avec nonce si fourni
  if (nonce) {
    headers['Content-Security-Policy'] = `
      default-src 'self';
      script-src 'self' 'nonce-${nonce}' 'strict-dynamic';
      style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
      font-src 'self' https://fonts.gstatic.com;
      img-src 'self' data: https:;
      connect-src 'self' https://api.stripe.com;
      frame-src https://js.stripe.com;
    `.replace(/\s+/g, ' ').trim();
  }
  
  return headers;
}

// Logging sécurisé (ne pas logger les données sensibles)
export function secureLog(action: string, data: any, userId?: string) {
  const sanitizedData = { ...data };
  
  // Supprimer les données sensibles
  delete sanitizedData.password;
  delete sanitizedData.token;
  delete sanitizedData.resetToken;
  
  console.log(`[SECURITY] ${action}`, {
    timestamp: new Date().toISOString(),
    userId: userId || 'anonymous',
    data: sanitizedData
  });
}