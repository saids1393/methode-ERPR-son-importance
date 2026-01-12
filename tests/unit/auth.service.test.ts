// tests/unit/auth.service.test.ts
// Tests unitaires pour l'authentification (LOGIN / REGISTER)

import { describe, it, expect, vi, beforeEach } from 'vitest';

// =====================================================
// FONCTIONS À TESTER (extraites de lib/security.ts)
// =====================================================

/**
 * Valide le format d'un email
 */
function validateEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email) && email.length <= 254;
}

/**
 * Valide la robustesse d'un mot de passe
 */
function validatePassword(password: string): { valid: boolean; errors: string[] } {
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

/**
 * Valide un nom d'utilisateur
 */
function validateUsername(username: string): { valid: boolean; errors: string[] } {
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

/**
 * Sanitise les entrées utilisateur
 */
function sanitizeInput(input: string): string {
  if (typeof input !== 'string') return '';
  
  return input
    .trim()
    .replace(/[<>]/g, '') // Supprime les balises HTML basiques
    .substring(0, 1000); // Limite la longueur
}

/**
 * Valide le domaine d'un email (bloque les emails jetables)
 */
function validateEmailDomain(email: string): { valid: boolean; error?: string } {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { valid: false, error: 'Format email invalide' };
  }

  const domain = email.split('@')[1].toLowerCase();

  // Domaines jetables à bloquer
  const BLOCKED_DOMAINS = [
    'tempmail.com', 'mailinator.com', '10minutemail.com',
    'yopmail.com', 'guerrillamail.com', 'trashmail.com'
  ];

  if (BLOCKED_DOMAINS.includes(domain)) {
    return { valid: false, error: 'Adresse email jetable non autorisée' };
  }

  return { valid: true };
}

/**
 * Simule la logique de connexion
 */
interface LoginResult {
  success: boolean;
  error?: string;
  user?: { id: string; email: string; username: string };
}

function simulateLogin(
  identifier: string, 
  password: string, 
  users: Array<{ id: string; email: string; username: string; password: string; isActive: boolean }>
): LoginResult {
  if (!identifier || !password) {
    return { success: false, error: 'Identifiant et mot de passe requis' };
  }

  const cleanIdentifier = identifier.toLowerCase().trim();
  
  // Recherche utilisateur par email ou username
  const user = users.find(u => 
    u.email.toLowerCase() === cleanIdentifier || 
    u.username.toLowerCase() === cleanIdentifier
  );

  if (!user) {
    return { success: false, error: 'Identifiants incorrects' };
  }

  if (!user.isActive) {
    return { success: false, error: 'Compte inactif' };
  }

  // Vérification du mot de passe (simulé)
  if (user.password !== password) {
    return { success: false, error: 'Mot de passe incorrect' };
  }

  return { 
    success: true, 
    user: { id: user.id, email: user.email, username: user.username } 
  };
}

// =====================================================
// TESTS UNITAIRES
// =====================================================

describe('🔐 Auth Service - Tests Unitaires', () => {
  
  // =====================================================
  // 1. VALIDATION EMAIL
  // =====================================================
  describe('📧 Validation Email', () => {
    
    it('✅ accepte un email valide', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name@domain.fr')).toBe(true);
      expect(validateEmail('user+tag@example.org')).toBe(true);
    });

    it('❌ rejette un email sans @', () => {
      expect(validateEmail('invalid-email')).toBe(false);
    });

    it('❌ rejette un email sans domaine', () => {
      expect(validateEmail('test@')).toBe(false);
    });

    it('❌ rejette un email sans extension', () => {
      expect(validateEmail('test@domain')).toBe(false);
    });

    it('❌ rejette un email avec espaces', () => {
      expect(validateEmail('test @example.com')).toBe(false);
      expect(validateEmail('test@ example.com')).toBe(false);
    });

    it('❌ rejette un email trop long (>254 caractères)', () => {
      const longEmail = 'a'.repeat(250) + '@test.com';
      expect(validateEmail(longEmail)).toBe(false);
    });

    it('✅ accepte un email de 254 caractères', () => {
      const email = 'a'.repeat(240) + '@test.com';
      expect(validateEmail(email)).toBe(true);
    });
  });

  // =====================================================
  // 2. VALIDATION MOT DE PASSE
  // =====================================================
  describe('🔑 Validation Mot de Passe', () => {
    
    it('✅ accepte un mot de passe fort', () => {
      const result = validatePassword('MonMotDePasse1');
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('❌ rejette un mot de passe trop court (<8 caractères)', () => {
      const result = validatePassword('Short1A');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Le mot de passe doit contenir au moins 8 caractères');
    });

    it('❌ rejette un mot de passe sans minuscule', () => {
      const result = validatePassword('MAJUSCULE123');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Le mot de passe doit contenir au moins une minuscule');
    });

    it('❌ rejette un mot de passe sans majuscule', () => {
      const result = validatePassword('minuscule123');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Le mot de passe doit contenir au moins une majuscule');
    });

    it('❌ rejette un mot de passe sans chiffre', () => {
      const result = validatePassword('MotDePasseFort');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Le mot de passe doit contenir au moins un chiffre');
    });

    it('❌ rejette un mot de passe commun', () => {
      const result = validatePassword('Password123');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Ce mot de passe est trop commun');
    });

    it('❌ rejette "password" (mot de passe trop commun)', () => {
      const result = validatePassword('password');
      expect(result.valid).toBe(false);
    });

    it('❌ rejette un mot de passe trop long (>128 caractères)', () => {
      const longPassword = 'Aa1' + 'x'.repeat(130);
      const result = validatePassword(longPassword);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Le mot de passe ne peut pas dépasser 128 caractères');
    });

    it('✅ renvoie plusieurs erreurs si plusieurs critères échouent', () => {
      const result = validatePassword('abc');
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(1);
    });
  });

  // =====================================================
  // 3. VALIDATION USERNAME
  // =====================================================
  describe('👤 Validation Username', () => {
    
    it('✅ accepte un username valide', () => {
      const result = validateUsername('john_doe123');
      expect(result.valid).toBe(true);
    });

    it('✅ accepte un username avec tirets', () => {
      const result = validateUsername('jean-pierre');
      expect(result.valid).toBe(true);
    });

    it('❌ rejette un username trop court (<3 caractères)', () => {
      const result = validateUsername('ab');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Le pseudo doit contenir au moins 3 caractères');
    });

    it('❌ rejette un username trop long (>30 caractères)', () => {
      const result = validateUsername('a'.repeat(31));
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Le pseudo ne peut pas dépasser 30 caractères');
    });

    it('❌ rejette un username avec caractères spéciaux', () => {
      const result = validateUsername('user@name');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Le pseudo ne peut contenir que des lettres, chiffres, tirets et underscores');
    });

    it('❌ rejette un username interdit (admin)', () => {
      const result = validateUsername('admin');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Ce pseudo n\'est pas autorisé');
    });

    it('❌ rejette un username interdit (root)', () => {
      const result = validateUsername('ROOT');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Ce pseudo n\'est pas autorisé');
    });
  });

  // =====================================================
  // 4. VALIDATION DOMAINE EMAIL (EMAILS JETABLES)
  // =====================================================
  describe('🚫 Validation Domaine Email (Anti-Jetable)', () => {
    
    it('✅ accepte un email de domaine valide', () => {
      const result = validateEmailDomain('user@gmail.com');
      expect(result.valid).toBe(true);
    });

    it('❌ rejette un email tempmail.com', () => {
      const result = validateEmailDomain('user@tempmail.com');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Adresse email jetable non autorisée');
    });

    it('❌ rejette un email yopmail.com', () => {
      const result = validateEmailDomain('user@yopmail.com');
      expect(result.valid).toBe(false);
    });

    it('❌ rejette un email mailinator.com', () => {
      const result = validateEmailDomain('test@mailinator.com');
      expect(result.valid).toBe(false);
    });

    it('❌ rejette un format email invalide', () => {
      const result = validateEmailDomain('invalid-email');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Format email invalide');
    });
  });

  // =====================================================
  // 5. SANITISATION DES ENTRÉES
  // =====================================================
  describe('🧹 Sanitisation des Entrées', () => {
    
    it('✅ supprime les espaces en début et fin', () => {
      expect(sanitizeInput('  test  ')).toBe('test');
    });

    it('✅ supprime les balises HTML', () => {
      expect(sanitizeInput('<script>alert("xss")</script>')).toBe('scriptalert("xss")/script');
    });

    it('✅ limite la longueur à 1000 caractères', () => {
      const longInput = 'a'.repeat(2000);
      expect(sanitizeInput(longInput).length).toBe(1000);
    });

    it('✅ retourne une chaîne vide pour une entrée non-string', () => {
      expect(sanitizeInput(null as any)).toBe('');
      expect(sanitizeInput(undefined as any)).toBe('');
      expect(sanitizeInput(123 as any)).toBe('');
    });
  });

  // =====================================================
  // 6. LOGIQUE DE CONNEXION
  // =====================================================
  describe('🔐 Logique de Connexion', () => {
    
    const mockUsers = [
      { id: '1', email: 'user@test.com', username: 'testuser', password: 'Password123', isActive: true },
      { id: '2', email: 'inactive@test.com', username: 'inactiveuser', password: 'Password123', isActive: false },
    ];

    it('✅ connexion réussie avec email', () => {
      const result = simulateLogin('user@test.com', 'Password123', mockUsers);
      expect(result.success).toBe(true);
      expect(result.user?.email).toBe('user@test.com');
    });

    it('✅ connexion réussie avec username', () => {
      const result = simulateLogin('testuser', 'Password123', mockUsers);
      expect(result.success).toBe(true);
      expect(result.user?.username).toBe('testuser');
    });

    it('✅ connexion insensible à la casse', () => {
      const result = simulateLogin('USER@TEST.COM', 'Password123', mockUsers);
      expect(result.success).toBe(true);
    });

    it('❌ échec avec identifiants manquants', () => {
      const result = simulateLogin('', 'password', mockUsers);
      expect(result.success).toBe(false);
      expect(result.error).toBe('Identifiant et mot de passe requis');
    });

    it('❌ échec avec mot de passe manquant', () => {
      const result = simulateLogin('user@test.com', '', mockUsers);
      expect(result.success).toBe(false);
    });

    it('❌ échec avec utilisateur inexistant', () => {
      const result = simulateLogin('unknown@test.com', 'password', mockUsers);
      expect(result.success).toBe(false);
      expect(result.error).toBe('Identifiants incorrects');
    });

    it('❌ échec avec mauvais mot de passe', () => {
      const result = simulateLogin('user@test.com', 'wrongpassword', mockUsers);
      expect(result.success).toBe(false);
      expect(result.error).toBe('Mot de passe incorrect');
    });

    it('❌ échec avec compte inactif', () => {
      const result = simulateLogin('inactive@test.com', 'Password123', mockUsers);
      expect(result.success).toBe(false);
      expect(result.error).toBe('Compte inactif');
    });
  });

  // =====================================================
  // 7. GESTION DES ERREURS
  // =====================================================
  describe('⚠️ Gestion des Erreurs', () => {
    
    it('✅ retourne des messages d\'erreur en français', () => {
      const result = validatePassword('abc');
      expect(result.errors[0]).toMatch(/caractères/);
    });

    it('✅ accumule toutes les erreurs de validation', () => {
      const result = validatePassword('a'); // Trop court, pas de majuscule, pas de chiffre
      expect(result.errors.length).toBeGreaterThanOrEqual(3);
    });

    it('✅ le username validation retourne des erreurs explicites', () => {
      const result = validateUsername('a@');
      expect(result.errors.length).toBeGreaterThan(0);
      result.errors.forEach(error => {
        expect(typeof error).toBe('string');
        expect(error.length).toBeGreaterThan(0);
      });
    });
  });
});
