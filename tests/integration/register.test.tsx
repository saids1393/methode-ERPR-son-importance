// tests/integration/register.test.tsx
// Test d'intégration pour le formulaire d'inscription

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React, { useState } from 'react';

// =====================================================
// MOCK DU ROUTER NEXT.JS
// =====================================================
const mockPush = vi.fn();
const mockRouter = {
  push: mockPush,
  replace: vi.fn(),
  prefetch: vi.fn(),
  back: vi.fn(),
};

vi.mock('next/navigation', () => ({
  useRouter: () => mockRouter,
  usePathname: () => '/signup',
}));

// =====================================================
// MOCK DU SERVICE D'INSCRIPTION
// =====================================================
interface RegisterResponse {
  success: boolean;
  error?: string;
  user?: {
    id: string;
    email: string;
  };
}

const mockRegisterService = {
  register: vi.fn<(email: string, password: string) => Promise<RegisterResponse>>(),
  checkEmailExists: vi.fn<(email: string) => Promise<boolean>>(),
};

// =====================================================
// FONCTIONS DE VALIDATION
// =====================================================
function validateEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email) && email.length <= 254;
}

function validateEmailDomain(email: string): { valid: boolean; error?: string } {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { valid: false, error: 'Format email invalide' };
  }

  const domain = email.split('@')[1].toLowerCase();
  const BLOCKED_DOMAINS = [
    'tempmail.com', 'mailinator.com', '10minutemail.com',
    'yopmail.com', 'guerrillamail.com', 'trashmail.com'
  ];

  if (BLOCKED_DOMAINS.includes(domain)) {
    return { valid: false, error: 'Adresse email jetable non autorisée' };
  }

  return { valid: true };
}

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
  
  const commonPasswords = ['password', '123456', '123456789', 'qwerty', 'abc123', 'password123'];
  if (commonPasswords.includes(password.toLowerCase())) {
    errors.push('Ce mot de passe est trop commun');
  }
  
  return { valid: errors.length === 0, errors };
}

function sanitizeInput(input: string): string {
  if (typeof input !== 'string') return '';
  return input.trim().replace(/[<>]/g, '').substring(0, 1000);
}

// =====================================================
// COMPOSANT DE TEST - FORMULAIRE D'INSCRIPTION
// =====================================================
interface RegisterFormProps {
  onRegister: (email: string, password: string) => Promise<RegisterResponse>;
  onSuccess?: () => void;
}

function RegisterForm({ onRegister, onSuccess }: RegisterFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [success, setSuccess] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<{
    hasMinLength: boolean;
    hasLowercase: boolean;
    hasUppercase: boolean;
    hasNumber: boolean;
  }>({
    hasMinLength: false,
    hasLowercase: false,
    hasUppercase: false,
    hasNumber: false,
  });

  const handleEmailChange = (value: string) => {
    setEmail(value);
    setError('');
    
    if (value.includes('@')) {
      const validation = validateEmailDomain(value);
      if (!validation.valid) {
        setEmailError(validation.error || '');
      } else {
        setEmailError('');
      }
    } else if (value.length > 0) {
      setEmailError('');
    }
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    setError('');
    
    // Mettre à jour l'indicateur de force
    setPasswordStrength({
      hasMinLength: value.length >= 8,
      hasLowercase: /[a-z]/.test(value),
      hasUppercase: /[A-Z]/.test(value),
      hasNumber: /[0-9]/.test(value),
    });

    const validation = validatePassword(value);
    if (!validation.valid && value.length > 0) {
      setPasswordError(validation.errors[0]);
    } else {
      setPasswordError('');
    }

    // Vérifier la confirmation si déjà remplie
    if (confirmPassword && value !== confirmPassword) {
      setConfirmPasswordError('Les mots de passe ne correspondent pas');
    } else {
      setConfirmPasswordError('');
    }
  };

  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value);
    
    if (value !== password) {
      setConfirmPasswordError('Les mots de passe ne correspondent pas');
    } else {
      setConfirmPasswordError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validations
    if (!email.trim()) {
      setError('Veuillez saisir votre email');
      return;
    }

    const emailValidation = validateEmailDomain(email);
    if (!emailValidation.valid) {
      setEmailError(emailValidation.error || 'Email invalide');
      setError(emailValidation.error || 'Email invalide');
      return;
    }

    if (!password) {
      setError('Veuillez saisir un mot de passe');
      return;
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      setPasswordError(passwordValidation.errors[0]);
      setError(passwordValidation.errors[0]);
      return;
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError('Les mots de passe ne correspondent pas');
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    setLoading(true);

    try {
      const cleanEmail = sanitizeInput(email).toLowerCase().trim();
      const result = await onRegister(cleanEmail, password);

      if (result.success) {
        setSuccess(true);
        onSuccess?.();
      } else {
        setError(result.error || 'Erreur lors de l\'inscription');
      }
    } catch (err) {
      setError('Erreur de connexion réseau');
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = 
    email.trim() && 
    password.length >= 8 && 
    password === confirmPassword &&
    !emailError && 
    !passwordError && 
    !confirmPasswordError &&
    !loading;

  return (
    <div data-testid="register-form-container">
      <h1>Inscription</h1>
      
      {success && (
        <div data-testid="success-message" className="success">
          🎉 Inscription réussie ! Bienvenue sur Méthode Lire et Écrire.
        </div>
      )}
      
      {error && (
        <div data-testid="error-message" className="error">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} data-testid="register-form">
        {/* Email */}
        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            data-testid="email-input"
            value={email}
            onChange={(e) => handleEmailChange(e.target.value)}
            placeholder="votre@email.com"
            disabled={loading || success}
          />
          {emailError && (
            <span data-testid="email-error" className="field-error">
              {emailError}
            </span>
          )}
        </div>

        {/* Mot de passe */}
        <div>
          <label htmlFor="password">Mot de passe</label>
          <input
            id="password"
            type="password"
            data-testid="password-input"
            value={password}
            onChange={(e) => handlePasswordChange(e.target.value)}
            placeholder="Mot de passe sécurisé"
            disabled={loading || success}
          />
          {passwordError && (
            <span data-testid="password-error" className="field-error">
              {passwordError}
            </span>
          )}
          
          {/* Indicateur de force du mot de passe */}
          {password.length > 0 && (
            <div data-testid="password-strength" className="password-strength">
              <div data-testid="strength-length" className={passwordStrength.hasMinLength ? 'valid' : 'invalid'}>
                {passwordStrength.hasMinLength ? '✓' : '✗'} 8 caractères minimum
              </div>
              <div data-testid="strength-lowercase" className={passwordStrength.hasLowercase ? 'valid' : 'invalid'}>
                {passwordStrength.hasLowercase ? '✓' : '✗'} Une minuscule
              </div>
              <div data-testid="strength-uppercase" className={passwordStrength.hasUppercase ? 'valid' : 'invalid'}>
                {passwordStrength.hasUppercase ? '✓' : '✗'} Une majuscule
              </div>
              <div data-testid="strength-number" className={passwordStrength.hasNumber ? 'valid' : 'invalid'}>
                {passwordStrength.hasNumber ? '✓' : '✗'} Un chiffre
              </div>
            </div>
          )}
        </div>

        {/* Confirmation mot de passe */}
        <div>
          <label htmlFor="confirmPassword">Confirmer le mot de passe</label>
          <input
            id="confirmPassword"
            type="password"
            data-testid="confirm-password-input"
            value={confirmPassword}
            onChange={(e) => handleConfirmPasswordChange(e.target.value)}
            placeholder="Confirmer le mot de passe"
            disabled={loading || success}
          />
          {confirmPasswordError && (
            <span data-testid="confirm-password-error" className="field-error">
              {confirmPasswordError}
            </span>
          )}
        </div>

        <button
          type="submit"
          data-testid="submit-button"
          disabled={!isFormValid || success}
        >
          {loading ? 'Inscription en cours...' : 'Créer mon compte'}
        </button>
      </form>
    </div>
  );
}

// =====================================================
// TESTS D'INTÉGRATION
// =====================================================

describe('📝 Register - Test d\'Intégration', () => {
  
  beforeEach(() => {
    vi.clearAllMocks();
    mockRegisterService.register.mockReset();
    mockRegisterService.checkEmailExists.mockReset();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  // =====================================================
  // 1. RENDU DU FORMULAIRE
  // =====================================================
  describe('📋 Rendu du Formulaire', () => {
    
    it('✅ affiche le formulaire d\'inscription', () => {
      render(<RegisterForm onRegister={mockRegisterService.register} />);
      
      expect(screen.getByTestId('register-form')).toBeInTheDocument();
      expect(screen.getByTestId('email-input')).toBeInTheDocument();
      expect(screen.getByTestId('password-input')).toBeInTheDocument();
      expect(screen.getByTestId('confirm-password-input')).toBeInTheDocument();
      expect(screen.getByTestId('submit-button')).toBeInTheDocument();
    });

    it('✅ affiche les labels corrects', () => {
      render(<RegisterForm onRegister={mockRegisterService.register} />);
      
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/^mot de passe$/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/confirmer/i)).toBeInTheDocument();
    });

    it('✅ le bouton est désactivé par défaut', () => {
      render(<RegisterForm onRegister={mockRegisterService.register} />);
      
      expect(screen.getByTestId('submit-button')).toBeDisabled();
    });
  });

  // =====================================================
  // 2. SAISIE DES CHAMPS
  // =====================================================
  describe('⌨️ Saisie des Champs', () => {
    
    it('✅ permet la saisie de l\'email', async () => {
      const user = userEvent.setup();
      render(<RegisterForm onRegister={mockRegisterService.register} />);
      
      const emailInput = screen.getByTestId('email-input');
      await user.type(emailInput, 'nouveau@example.com');
      
      expect(emailInput).toHaveValue('nouveau@example.com');
    });

    it('✅ permet la saisie du mot de passe', async () => {
      const user = userEvent.setup();
      render(<RegisterForm onRegister={mockRegisterService.register} />);
      
      const passwordInput = screen.getByTestId('password-input');
      await user.type(passwordInput, 'SecurePass123');
      
      expect(passwordInput).toHaveValue('SecurePass123');
    });

    it('✅ permet la confirmation du mot de passe', async () => {
      const user = userEvent.setup();
      render(<RegisterForm onRegister={mockRegisterService.register} />);
      
      const confirmInput = screen.getByTestId('confirm-password-input');
      await user.type(confirmInput, 'SecurePass123');
      
      expect(confirmInput).toHaveValue('SecurePass123');
    });

    it('✅ active le bouton quand tous les champs sont valides', async () => {
      const user = userEvent.setup();
      render(<RegisterForm onRegister={mockRegisterService.register} />);
      
      await user.type(screen.getByTestId('email-input'), 'test@example.com');
      await user.type(screen.getByTestId('password-input'), 'SecurePass123');
      await user.type(screen.getByTestId('confirm-password-input'), 'SecurePass123');
      
      expect(screen.getByTestId('submit-button')).not.toBeDisabled();
    });
  });

  // =====================================================
  // 3. VALIDATION DES CHAMPS
  // =====================================================
  describe('✅ Validation des Champs', () => {
    
    describe('📧 Validation Email', () => {
      
      it('❌ affiche erreur pour email jetable', async () => {
        const user = userEvent.setup();
        render(<RegisterForm onRegister={mockRegisterService.register} />);
        
        await user.type(screen.getByTestId('email-input'), 'test@yopmail.com');
        
        expect(screen.getByTestId('email-error')).toHaveTextContent('Adresse email jetable non autorisée');
      });

      it('❌ affiche erreur pour format invalide', async () => {
        const user = userEvent.setup();
        render(<RegisterForm onRegister={mockRegisterService.register} />);
        
        await user.type(screen.getByTestId('email-input'), 'invalid-email@');
        
        expect(screen.getByTestId('email-error')).toHaveTextContent('Format email invalide');
      });

      it('✅ accepte un email valide', async () => {
        const user = userEvent.setup();
        render(<RegisterForm onRegister={mockRegisterService.register} />);
        
        await user.type(screen.getByTestId('email-input'), 'valid@gmail.com');
        
        expect(screen.queryByTestId('email-error')).not.toBeInTheDocument();
      });
    });

    describe('🔑 Validation Mot de Passe', () => {
      
      it('❌ affiche erreur si mot de passe trop court', async () => {
        const user = userEvent.setup();
        render(<RegisterForm onRegister={mockRegisterService.register} />);
        
        await user.type(screen.getByTestId('password-input'), 'Short1');
        
        expect(screen.getByTestId('password-error')).toHaveTextContent('au moins 8 caractères');
      });

      it('✅ affiche l\'indicateur de force du mot de passe', async () => {
        const user = userEvent.setup();
        render(<RegisterForm onRegister={mockRegisterService.register} />);
        
        await user.type(screen.getByTestId('password-input'), 'Test');
        
        expect(screen.getByTestId('password-strength')).toBeInTheDocument();
        expect(screen.getByTestId('strength-length')).toBeInTheDocument();
        expect(screen.getByTestId('strength-lowercase')).toBeInTheDocument();
        expect(screen.getByTestId('strength-uppercase')).toBeInTheDocument();
        expect(screen.getByTestId('strength-number')).toBeInTheDocument();
      });

      it('✅ met à jour l\'indicateur de force', async () => {
        const user = userEvent.setup();
        render(<RegisterForm onRegister={mockRegisterService.register} />);
        
        await user.type(screen.getByTestId('password-input'), 'SecurePass123');
        
        expect(screen.getByTestId('strength-length')).toHaveTextContent('✓');
        expect(screen.getByTestId('strength-lowercase')).toHaveTextContent('✓');
        expect(screen.getByTestId('strength-uppercase')).toHaveTextContent('✓');
        expect(screen.getByTestId('strength-number')).toHaveTextContent('✓');
      });

      it('❌ indique les critères non remplis', async () => {
        const user = userEvent.setup();
        render(<RegisterForm onRegister={mockRegisterService.register} />);
        
        await user.type(screen.getByTestId('password-input'), 'lowercase');
        
        expect(screen.getByTestId('strength-uppercase')).toHaveTextContent('✗');
        expect(screen.getByTestId('strength-number')).toHaveTextContent('✗');
      });
    });

    describe('🔄 Confirmation Mot de Passe', () => {
      
      it('❌ affiche erreur si mots de passe différents', async () => {
        const user = userEvent.setup();
        render(<RegisterForm onRegister={mockRegisterService.register} />);
        
        await user.type(screen.getByTestId('password-input'), 'SecurePass123');
        await user.type(screen.getByTestId('confirm-password-input'), 'DifferentPass456');
        
        expect(screen.getByTestId('confirm-password-error')).toHaveTextContent('Les mots de passe ne correspondent pas');
      });

      it('✅ pas d\'erreur si mots de passe identiques', async () => {
        const user = userEvent.setup();
        render(<RegisterForm onRegister={mockRegisterService.register} />);
        
        await user.type(screen.getByTestId('password-input'), 'SecurePass123');
        await user.type(screen.getByTestId('confirm-password-input'), 'SecurePass123');
        
        expect(screen.queryByTestId('confirm-password-error')).not.toBeInTheDocument();
      });

      it('✅ met à jour l\'erreur quand le mot de passe principal change', async () => {
        const user = userEvent.setup();
        render(<RegisterForm onRegister={mockRegisterService.register} />);
        
        await user.type(screen.getByTestId('password-input'), 'SecurePass123');
        await user.type(screen.getByTestId('confirm-password-input'), 'SecurePass123');
        
        // Pas d'erreur
        expect(screen.queryByTestId('confirm-password-error')).not.toBeInTheDocument();
        
        // Modifier le mot de passe principal
        await user.clear(screen.getByTestId('password-input'));
        await user.type(screen.getByTestId('password-input'), 'NewPassword456');
        
        // Maintenant erreur
        expect(screen.getByTestId('confirm-password-error')).toHaveTextContent('ne correspondent pas');
      });
    });
  });

  // =====================================================
  // 4. APPEL API MOCKÉ
  // =====================================================
  describe('🔌 Appel API d\'Inscription', () => {
    
    it('✅ appelle l\'API avec les bonnes données', async () => {
      const user = userEvent.setup();
      mockRegisterService.register.mockResolvedValue({ 
        success: true, 
        user: { id: '1', email: 'new@example.com' } 
      });
      
      render(<RegisterForm onRegister={mockRegisterService.register} />);
      
      await user.type(screen.getByTestId('email-input'), 'New@Example.com');
      await user.type(screen.getByTestId('password-input'), 'SecurePass123');
      await user.type(screen.getByTestId('confirm-password-input'), 'SecurePass123');
      await user.click(screen.getByTestId('submit-button'));
      
      await waitFor(() => {
        expect(mockRegisterService.register).toHaveBeenCalledWith('new@example.com', 'SecurePass123');
      });
    });

    it('✅ affiche le chargement pendant la requête', async () => {
      const user = userEvent.setup();
      
      mockRegisterService.register.mockImplementation(() => new Promise(resolve => {
        setTimeout(() => resolve({ success: true, user: { id: '1', email: 'test@example.com' } }), 100);
      }));
      
      render(<RegisterForm onRegister={mockRegisterService.register} />);
      
      await user.type(screen.getByTestId('email-input'), 'test@example.com');
      await user.type(screen.getByTestId('password-input'), 'SecurePass123');
      await user.type(screen.getByTestId('confirm-password-input'), 'SecurePass123');
      await user.click(screen.getByTestId('submit-button'));
      
      expect(screen.getByTestId('submit-button')).toHaveTextContent('Inscription en cours...');
    });

    it('✅ désactive les champs pendant le chargement', async () => {
      const user = userEvent.setup();
      
      mockRegisterService.register.mockImplementation(() => new Promise(resolve => {
        setTimeout(() => resolve({ success: true, user: { id: '1', email: 'test@example.com' } }), 100);
      }));
      
      render(<RegisterForm onRegister={mockRegisterService.register} />);
      
      await user.type(screen.getByTestId('email-input'), 'test@example.com');
      await user.type(screen.getByTestId('password-input'), 'SecurePass123');
      await user.type(screen.getByTestId('confirm-password-input'), 'SecurePass123');
      await user.click(screen.getByTestId('submit-button'));
      
      expect(screen.getByTestId('email-input')).toBeDisabled();
      expect(screen.getByTestId('password-input')).toBeDisabled();
      expect(screen.getByTestId('confirm-password-input')).toBeDisabled();
    });
  });

  // =====================================================
  // 5. MESSAGE DE CONFIRMATION (SUCCÈS)
  // =====================================================
  describe('✅ Message de Confirmation', () => {
    
    it('✅ affiche le message de succès', async () => {
      const user = userEvent.setup();
      mockRegisterService.register.mockResolvedValue({ 
        success: true, 
        user: { id: '1', email: 'new@example.com' } 
      });
      
      render(<RegisterForm onRegister={mockRegisterService.register} />);
      
      await user.type(screen.getByTestId('email-input'), 'new@example.com');
      await user.type(screen.getByTestId('password-input'), 'SecurePass123');
      await user.type(screen.getByTestId('confirm-password-input'), 'SecurePass123');
      await user.click(screen.getByTestId('submit-button'));
      
      await waitFor(() => {
        expect(screen.getByTestId('success-message')).toHaveTextContent('Inscription réussie');
      });
    });

    it('✅ appelle onSuccess après inscription réussie', async () => {
      const user = userEvent.setup();
      const onSuccessMock = vi.fn();
      
      mockRegisterService.register.mockResolvedValue({ 
        success: true, 
        user: { id: '1', email: 'new@example.com' } 
      });
      
      render(<RegisterForm onRegister={mockRegisterService.register} onSuccess={onSuccessMock} />);
      
      await user.type(screen.getByTestId('email-input'), 'new@example.com');
      await user.type(screen.getByTestId('password-input'), 'SecurePass123');
      await user.type(screen.getByTestId('confirm-password-input'), 'SecurePass123');
      await user.click(screen.getByTestId('submit-button'));
      
      await waitFor(() => {
        expect(onSuccessMock).toHaveBeenCalled();
      });
    });

    it('✅ désactive le formulaire après succès', async () => {
      const user = userEvent.setup();
      mockRegisterService.register.mockResolvedValue({ 
        success: true, 
        user: { id: '1', email: 'new@example.com' } 
      });
      
      render(<RegisterForm onRegister={mockRegisterService.register} />);
      
      await user.type(screen.getByTestId('email-input'), 'new@example.com');
      await user.type(screen.getByTestId('password-input'), 'SecurePass123');
      await user.type(screen.getByTestId('confirm-password-input'), 'SecurePass123');
      await user.click(screen.getByTestId('submit-button'));
      
      await waitFor(() => {
        expect(screen.getByTestId('email-input')).toBeDisabled();
        expect(screen.getByTestId('submit-button')).toBeDisabled();
      });
    });

    it('✅ simule la redirection vers le dashboard', async () => {
      const user = userEvent.setup();
      
      mockRegisterService.register.mockResolvedValue({ 
        success: true, 
        user: { id: '1', email: 'new@example.com' } 
      });
      
      const handleSuccess = () => {
        mockRouter.push('/dashboard');
      };
      
      render(<RegisterForm onRegister={mockRegisterService.register} onSuccess={handleSuccess} />);
      
      await user.type(screen.getByTestId('email-input'), 'new@example.com');
      await user.type(screen.getByTestId('password-input'), 'SecurePass123');
      await user.type(screen.getByTestId('confirm-password-input'), 'SecurePass123');
      await user.click(screen.getByTestId('submit-button'));
      
      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/dashboard');
      });
    });
  });

  // =====================================================
  // 6. GESTION DES ERREURS
  // =====================================================
  describe('❌ Gestion des Erreurs', () => {
    
    it('❌ affiche erreur si email déjà utilisé', async () => {
      const user = userEvent.setup();
      mockRegisterService.register.mockResolvedValue({ 
        success: false, 
        error: 'Cet email est déjà utilisé' 
      });
      
      render(<RegisterForm onRegister={mockRegisterService.register} />);
      
      await user.type(screen.getByTestId('email-input'), 'existing@example.com');
      await user.type(screen.getByTestId('password-input'), 'SecurePass123');
      await user.type(screen.getByTestId('confirm-password-input'), 'SecurePass123');
      await user.click(screen.getByTestId('submit-button'));
      
      await waitFor(() => {
        expect(screen.getByTestId('error-message')).toHaveTextContent('Cet email est déjà utilisé');
      });
    });

    it('❌ affiche erreur réseau', async () => {
      const user = userEvent.setup();
      mockRegisterService.register.mockRejectedValue(new Error('Network error'));
      
      render(<RegisterForm onRegister={mockRegisterService.register} />);
      
      await user.type(screen.getByTestId('email-input'), 'test@example.com');
      await user.type(screen.getByTestId('password-input'), 'SecurePass123');
      await user.type(screen.getByTestId('confirm-password-input'), 'SecurePass123');
      await user.click(screen.getByTestId('submit-button'));
      
      await waitFor(() => {
        expect(screen.getByTestId('error-message')).toHaveTextContent('Erreur de connexion réseau');
      });
    });

    it('❌ affiche erreur si email vide à la soumission', async () => {
      render(<RegisterForm onRegister={mockRegisterService.register} />);
      
      // Forcer la soumission
      fireEvent.submit(screen.getByTestId('register-form'));
      
      await waitFor(() => {
        expect(screen.getByTestId('error-message')).toHaveTextContent('Veuillez saisir votre email');
      });
    });

    it('❌ affiche erreur si mot de passe faible à la soumission', async () => {
      const user = userEvent.setup();
      render(<RegisterForm onRegister={mockRegisterService.register} />);
      
      await user.type(screen.getByTestId('email-input'), 'test@example.com');
      await user.type(screen.getByTestId('password-input'), 'weak');
      await user.type(screen.getByTestId('confirm-password-input'), 'weak');
      
      // Forcer soumission via le formulaire directement
      fireEvent.submit(screen.getByTestId('register-form'));
      
      await waitFor(() => {
        expect(screen.getByTestId('error-message')).toHaveTextContent('8 caractères');
      });
    });
  });

  // =====================================================
  // 7. FLUX COMPLET D'INSCRIPTION
  // =====================================================
  describe('🔄 Flux Complet d\'Inscription', () => {
    
    it('✅ flux complet : saisie → validation → inscription → succès', async () => {
      const user = userEvent.setup();
      const onSuccessMock = vi.fn();
      
      mockRegisterService.register.mockResolvedValue({ 
        success: true, 
        user: { id: 'new-user-123', email: 'eleve@methode-lire.fr' } 
      });
      
      render(<RegisterForm onRegister={mockRegisterService.register} onSuccess={onSuccessMock} />);
      
      // 1. Saisie de l'email
      const emailInput = screen.getByTestId('email-input');
      await user.type(emailInput, 'eleve@methode-lire.fr');
      expect(screen.queryByTestId('email-error')).not.toBeInTheDocument();
      
      // 2. Saisie du mot de passe fort
      const passwordInput = screen.getByTestId('password-input');
      await user.type(passwordInput, 'MonSuperMotDePasse123');
      
      // 3. Vérifier l'indicateur de force
      expect(screen.getByTestId('strength-length')).toHaveTextContent('✓');
      expect(screen.getByTestId('strength-lowercase')).toHaveTextContent('✓');
      expect(screen.getByTestId('strength-uppercase')).toHaveTextContent('✓');
      expect(screen.getByTestId('strength-number')).toHaveTextContent('✓');
      
      // 4. Confirmation du mot de passe
      const confirmInput = screen.getByTestId('confirm-password-input');
      await user.type(confirmInput, 'MonSuperMotDePasse123');
      expect(screen.queryByTestId('confirm-password-error')).not.toBeInTheDocument();
      
      // 5. Vérifier que le bouton est actif
      expect(screen.getByTestId('submit-button')).not.toBeDisabled();
      
      // 6. Soumettre
      await user.click(screen.getByTestId('submit-button'));
      
      // 7. Vérifier l'appel API
      await waitFor(() => {
        expect(mockRegisterService.register).toHaveBeenCalledWith('eleve@methode-lire.fr', 'MonSuperMotDePasse123');
      });
      
      // 8. Vérifier le succès
      await waitFor(() => {
        expect(screen.getByTestId('success-message')).toBeInTheDocument();
        expect(onSuccessMock).toHaveBeenCalled();
      });
    });

    it('❌ flux avec erreur : email jetable bloque l\'inscription', async () => {
      const user = userEvent.setup();
      
      render(<RegisterForm onRegister={mockRegisterService.register} />);
      
      // Email jetable
      await user.type(screen.getByTestId('email-input'), 'test@tempmail.com');
      await user.type(screen.getByTestId('password-input'), 'SecurePass123');
      await user.type(screen.getByTestId('confirm-password-input'), 'SecurePass123');
      
      // Le bouton doit être désactivé
      expect(screen.getByTestId('submit-button')).toBeDisabled();
      
      // L'erreur d'email est affichée
      expect(screen.getByTestId('email-error')).toHaveTextContent('jetable');
      
      // Aucun appel API
      expect(mockRegisterService.register).not.toHaveBeenCalled();
    });

    it('❌ flux avec erreur : mots de passe différents bloque l\'inscription', async () => {
      const user = userEvent.setup();
      
      render(<RegisterForm onRegister={mockRegisterService.register} />);
      
      await user.type(screen.getByTestId('email-input'), 'test@example.com');
      await user.type(screen.getByTestId('password-input'), 'SecurePass123');
      await user.type(screen.getByTestId('confirm-password-input'), 'DifferentPass456');
      
      // Le bouton doit être désactivé
      expect(screen.getByTestId('submit-button')).toBeDisabled();
      
      // L'erreur de confirmation est affichée
      expect(screen.getByTestId('confirm-password-error')).toHaveTextContent('ne correspondent pas');
      
      // Aucun appel API
      expect(mockRegisterService.register).not.toHaveBeenCalled();
    });
  });
});
