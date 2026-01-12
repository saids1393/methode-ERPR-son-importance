// tests/integration/login.test.tsx
// Test d'intégration pour le formulaire de connexion

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
  usePathname: () => '/login',
}));

// =====================================================
// MOCK DU SERVICE D'AUTHENTIFICATION
// =====================================================
interface LoginResponse {
  success: boolean;
  error?: string;
  user?: {
    id: string;
    email: string;
    username: string;
  };
}

const mockAuthService = {
  login: vi.fn<(identifier: string, password: string) => Promise<LoginResponse>>(),
};

// =====================================================
// FONCTIONS DE VALIDATION (identiques à celles du projet)
// =====================================================
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

function sanitizeInput(input: string): string {
  if (typeof input !== 'string') return '';
  return input.trim().replace(/[<>]/g, '').substring(0, 1000);
}

// =====================================================
// COMPOSANT DE TEST - FORMULAIRE DE CONNEXION
// =====================================================
interface LoginFormProps {
  onLogin: (identifier: string, password: string) => Promise<LoginResponse>;
  onSuccess?: () => void;
}

function LoginForm({ onLogin, onSuccess }: LoginFormProps) {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleIdentifierChange = (value: string) => {
    setIdentifier(value);
    setError('');
    
    if (value.includes('@')) {
      const validation = validateEmailDomain(value);
      if (!validation.valid) {
        setEmailError(validation.error || '');
      } else {
        setEmailError('');
      }
    } else {
      setEmailError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setEmailError('');

    // Validation
    if (!identifier.trim() || !password) {
      setError('Identifiant et mot de passe requis');
      return;
    }

    if (identifier.includes('@')) {
      const validation = validateEmailDomain(identifier);
      if (!validation.valid) {
        setEmailError(validation.error || '');
        return;
      }
    }

    setLoading(true);

    try {
      const cleanIdentifier = sanitizeInput(identifier).toLowerCase().trim();
      const result = await onLogin(cleanIdentifier, password);

      if (result.success) {
        setSuccess(true);
        onSuccess?.();
      } else {
        setError(result.error || 'Erreur de connexion');
      }
    } catch (err) {
      setError('Erreur de connexion réseau');
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = identifier.trim() && password && !emailError && !loading;

  return (
    <div data-testid="login-form-container">
      <h1>Connexion</h1>
      
      {success && (
        <div data-testid="success-message" className="success">
          Connexion réussie !
        </div>
      )}
      
      {error && (
        <div data-testid="error-message" className="error">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} data-testid="login-form">
        <div>
          <label htmlFor="identifier">Email ou pseudo</label>
          <input
            id="identifier"
            type="text"
            data-testid="identifier-input"
            value={identifier}
            onChange={(e) => handleIdentifierChange(e.target.value)}
            placeholder="Email ou pseudo"
            disabled={loading}
          />
          {emailError && (
            <span data-testid="email-error" className="field-error">
              {emailError}
            </span>
          )}
        </div>

        <div>
          <label htmlFor="password">Mot de passe</label>
          <input
            id="password"
            type="password"
            data-testid="password-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mot de passe"
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          data-testid="submit-button"
          disabled={!isFormValid}
        >
          {loading ? 'Connexion...' : 'Se connecter'}
        </button>
      </form>
    </div>
  );
}

// =====================================================
// TESTS D'INTÉGRATION
// =====================================================

describe('🔐 Login - Test d\'Intégration', () => {
  
  beforeEach(() => {
    vi.clearAllMocks();
    mockAuthService.login.mockReset();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  // =====================================================
  // 1. RENDU DU FORMULAIRE
  // =====================================================
  describe('📝 Rendu du Formulaire', () => {
    
    it('✅ affiche le formulaire de connexion', () => {
      render(<LoginForm onLogin={mockAuthService.login} />);
      
      expect(screen.getByTestId('login-form')).toBeInTheDocument();
      expect(screen.getByTestId('identifier-input')).toBeInTheDocument();
      expect(screen.getByTestId('password-input')).toBeInTheDocument();
      expect(screen.getByTestId('submit-button')).toBeInTheDocument();
    });

    it('✅ affiche les labels corrects', () => {
      render(<LoginForm onLogin={mockAuthService.login} />);
      
      expect(screen.getByLabelText(/email ou pseudo/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/mot de passe/i)).toBeInTheDocument();
    });

    it('✅ le bouton est désactivé par défaut', () => {
      render(<LoginForm onLogin={mockAuthService.login} />);
      
      const submitButton = screen.getByTestId('submit-button');
      expect(submitButton).toBeDisabled();
    });
  });

  // =====================================================
  // 2. SAISIE DES CHAMPS
  // =====================================================
  describe('⌨️ Saisie Email / Mot de passe', () => {
    
    it('✅ permet la saisie de l\'identifiant', async () => {
      const user = userEvent.setup();
      render(<LoginForm onLogin={mockAuthService.login} />);
      
      const identifierInput = screen.getByTestId('identifier-input');
      await user.type(identifierInput, 'test@example.com');
      
      expect(identifierInput).toHaveValue('test@example.com');
    });

    it('✅ permet la saisie du mot de passe', async () => {
      const user = userEvent.setup();
      render(<LoginForm onLogin={mockAuthService.login} />);
      
      const passwordInput = screen.getByTestId('password-input');
      await user.type(passwordInput, 'MonMotDePasse123');
      
      expect(passwordInput).toHaveValue('MonMotDePasse123');
    });

    it('✅ active le bouton quand les champs sont remplis', async () => {
      const user = userEvent.setup();
      render(<LoginForm onLogin={mockAuthService.login} />);
      
      const identifierInput = screen.getByTestId('identifier-input');
      const passwordInput = screen.getByTestId('password-input');
      const submitButton = screen.getByTestId('submit-button');
      
      await user.type(identifierInput, 'test@example.com');
      await user.type(passwordInput, 'Password123');
      
      expect(submitButton).not.toBeDisabled();
    });

    it('✅ accepte un username au lieu d\'un email', async () => {
      const user = userEvent.setup();
      render(<LoginForm onLogin={mockAuthService.login} />);
      
      const identifierInput = screen.getByTestId('identifier-input');
      const passwordInput = screen.getByTestId('password-input');
      const submitButton = screen.getByTestId('submit-button');
      
      await user.type(identifierInput, 'monpseudo');
      await user.type(passwordInput, 'Password123');
      
      expect(submitButton).not.toBeDisabled();
      expect(screen.queryByTestId('email-error')).not.toBeInTheDocument();
    });
  });

  // =====================================================
  // 3. VALIDATION EN TEMPS RÉEL
  // =====================================================
  describe('✅ Validation des Champs', () => {
    
    it('❌ affiche une erreur pour un email jetable', async () => {
      const user = userEvent.setup();
      render(<LoginForm onLogin={mockAuthService.login} />);
      
      const identifierInput = screen.getByTestId('identifier-input');
      await user.type(identifierInput, 'test@yopmail.com');
      
      expect(screen.getByTestId('email-error')).toHaveTextContent('Adresse email jetable non autorisée');
    });

    it('❌ affiche une erreur pour un format email invalide', async () => {
      const user = userEvent.setup();
      render(<LoginForm onLogin={mockAuthService.login} />);
      
      const identifierInput = screen.getByTestId('identifier-input');
      await user.type(identifierInput, 'invalid@');
      
      expect(screen.getByTestId('email-error')).toHaveTextContent('Format email invalide');
    });

    it('✅ efface l\'erreur quand l\'email devient valide', async () => {
      const user = userEvent.setup();
      render(<LoginForm onLogin={mockAuthService.login} />);
      
      const identifierInput = screen.getByTestId('identifier-input');
      
      // Email invalide d'abord
      await user.type(identifierInput, 'test@yopmail.com');
      expect(screen.getByTestId('email-error')).toBeInTheDocument();
      
      // Effacer et mettre un email valide
      await user.clear(identifierInput);
      await user.type(identifierInput, 'test@gmail.com');
      
      expect(screen.queryByTestId('email-error')).not.toBeInTheDocument();
    });

    it('✅ désactive le bouton si erreur email', async () => {
      const user = userEvent.setup();
      render(<LoginForm onLogin={mockAuthService.login} />);
      
      const identifierInput = screen.getByTestId('identifier-input');
      const passwordInput = screen.getByTestId('password-input');
      const submitButton = screen.getByTestId('submit-button');
      
      await user.type(identifierInput, 'test@tempmail.com');
      await user.type(passwordInput, 'Password123');
      
      expect(submitButton).toBeDisabled();
    });
  });

  // =====================================================
  // 4. APPEL DU SERVICE D'AUTH (MOCKÉ)
  // =====================================================
  describe('🔌 Appel du Service d\'Authentification', () => {
    
    it('✅ appelle le service avec les bonnes données', async () => {
      const user = userEvent.setup();
      mockAuthService.login.mockResolvedValue({ success: true, user: { id: '1', email: 'test@example.com', username: 'testuser' } });
      
      render(<LoginForm onLogin={mockAuthService.login} />);
      
      await user.type(screen.getByTestId('identifier-input'), 'Test@Example.com');
      await user.type(screen.getByTestId('password-input'), 'Password123');
      await user.click(screen.getByTestId('submit-button'));
      
      await waitFor(() => {
        expect(mockAuthService.login).toHaveBeenCalledWith('test@example.com', 'Password123');
      });
    });

    it('✅ affiche le chargement pendant la requête', async () => {
      const user = userEvent.setup();
      
      // Simuler une requête lente
      mockAuthService.login.mockImplementation(() => new Promise(resolve => {
        setTimeout(() => resolve({ success: true, user: { id: '1', email: 'test@example.com', username: 'test' } }), 100);
      }));
      
      render(<LoginForm onLogin={mockAuthService.login} />);
      
      await user.type(screen.getByTestId('identifier-input'), 'test@example.com');
      await user.type(screen.getByTestId('password-input'), 'Password123');
      await user.click(screen.getByTestId('submit-button'));
      
      expect(screen.getByTestId('submit-button')).toHaveTextContent('Connexion...');
    });

    it('✅ désactive les champs pendant le chargement', async () => {
      const user = userEvent.setup();
      
      mockAuthService.login.mockImplementation(() => new Promise(resolve => {
        setTimeout(() => resolve({ success: true, user: { id: '1', email: 'test@example.com', username: 'test' } }), 100);
      }));
      
      render(<LoginForm onLogin={mockAuthService.login} />);
      
      await user.type(screen.getByTestId('identifier-input'), 'test@example.com');
      await user.type(screen.getByTestId('password-input'), 'Password123');
      await user.click(screen.getByTestId('submit-button'));
      
      expect(screen.getByTestId('identifier-input')).toBeDisabled();
      expect(screen.getByTestId('password-input')).toBeDisabled();
    });
  });

  // =====================================================
  // 5. CONNEXION RÉUSSIE
  // =====================================================
  describe('✅ Connexion Réussie', () => {
    
    it('✅ affiche le message de succès', async () => {
      const user = userEvent.setup();
      mockAuthService.login.mockResolvedValue({ 
        success: true, 
        user: { id: '1', email: 'test@example.com', username: 'testuser' } 
      });
      
      render(<LoginForm onLogin={mockAuthService.login} />);
      
      await user.type(screen.getByTestId('identifier-input'), 'test@example.com');
      await user.type(screen.getByTestId('password-input'), 'Password123');
      await user.click(screen.getByTestId('submit-button'));
      
      await waitFor(() => {
        expect(screen.getByTestId('success-message')).toHaveTextContent('Connexion réussie');
      });
    });

    it('✅ appelle onSuccess après connexion réussie', async () => {
      const user = userEvent.setup();
      const onSuccessMock = vi.fn();
      
      mockAuthService.login.mockResolvedValue({ 
        success: true, 
        user: { id: '1', email: 'test@example.com', username: 'testuser' } 
      });
      
      render(<LoginForm onLogin={mockAuthService.login} onSuccess={onSuccessMock} />);
      
      await user.type(screen.getByTestId('identifier-input'), 'test@example.com');
      await user.type(screen.getByTestId('password-input'), 'Password123');
      await user.click(screen.getByTestId('submit-button'));
      
      await waitFor(() => {
        expect(onSuccessMock).toHaveBeenCalled();
      });
    });

    it('✅ simule la redirection après succès', async () => {
      const user = userEvent.setup();
      
      mockAuthService.login.mockResolvedValue({ 
        success: true, 
        user: { id: '1', email: 'test@example.com', username: 'testuser' } 
      });
      
      const handleSuccess = () => {
        mockRouter.push('/dashboard');
      };
      
      render(<LoginForm onLogin={mockAuthService.login} onSuccess={handleSuccess} />);
      
      await user.type(screen.getByTestId('identifier-input'), 'test@example.com');
      await user.type(screen.getByTestId('password-input'), 'Password123');
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
    
    it('❌ affiche erreur pour identifiants incorrects', async () => {
      const user = userEvent.setup();
      mockAuthService.login.mockResolvedValue({ 
        success: false, 
        error: 'Identifiants incorrects' 
      });
      
      render(<LoginForm onLogin={mockAuthService.login} />);
      
      await user.type(screen.getByTestId('identifier-input'), 'wrong@example.com');
      await user.type(screen.getByTestId('password-input'), 'WrongPassword');
      await user.click(screen.getByTestId('submit-button'));
      
      await waitFor(() => {
        expect(screen.getByTestId('error-message')).toHaveTextContent('Identifiants incorrects');
      });
    });

    it('❌ affiche erreur pour compte inactif', async () => {
      const user = userEvent.setup();
      mockAuthService.login.mockResolvedValue({ 
        success: false, 
        error: 'Compte inactif' 
      });
      
      render(<LoginForm onLogin={mockAuthService.login} />);
      
      await user.type(screen.getByTestId('identifier-input'), 'inactive@example.com');
      await user.type(screen.getByTestId('password-input'), 'Password123');
      await user.click(screen.getByTestId('submit-button'));
      
      await waitFor(() => {
        expect(screen.getByTestId('error-message')).toHaveTextContent('Compte inactif');
      });
    });

    it('❌ affiche erreur réseau', async () => {
      const user = userEvent.setup();
      mockAuthService.login.mockRejectedValue(new Error('Network error'));
      
      render(<LoginForm onLogin={mockAuthService.login} />);
      
      await user.type(screen.getByTestId('identifier-input'), 'test@example.com');
      await user.type(screen.getByTestId('password-input'), 'Password123');
      await user.click(screen.getByTestId('submit-button'));
      
      await waitFor(() => {
        expect(screen.getByTestId('error-message')).toHaveTextContent('Erreur de connexion réseau');
      });
    });

    it('❌ affiche erreur si champs vides à la soumission', async () => {
      const user = userEvent.setup();
      render(<LoginForm onLogin={mockAuthService.login} />);
      
      // Forcer la soumission du formulaire manuellement
      const form = screen.getByTestId('login-form');
      fireEvent.submit(form);
      
      await waitFor(() => {
        expect(screen.getByTestId('error-message')).toHaveTextContent('Identifiant et mot de passe requis');
      });
    });
  });

  // =====================================================
  // 7. FLUX COMPLET
  // =====================================================
  describe('🔄 Flux Complet de Connexion', () => {
    
    it('✅ flux complet : saisie → validation → connexion → succès', async () => {
      const user = userEvent.setup();
      const onSuccessMock = vi.fn();
      
      mockAuthService.login.mockResolvedValue({ 
        success: true, 
        user: { id: '1', email: 'eleve@methode-lire.com', username: 'eleve' } 
      });
      
      render(<LoginForm onLogin={mockAuthService.login} onSuccess={onSuccessMock} />);
      
      // 1. Saisie des identifiants
      const identifierInput = screen.getByTestId('identifier-input');
      const passwordInput = screen.getByTestId('password-input');
      
      await user.type(identifierInput, 'eleve@methode-lire.com');
      await user.type(passwordInput, 'SecurePass123');
      
      // 2. Vérifier que le formulaire est valide
      expect(screen.getByTestId('submit-button')).not.toBeDisabled();
      
      // 3. Soumettre
      await user.click(screen.getByTestId('submit-button'));
      
      // 4. Vérifier l'appel API
      await waitFor(() => {
        expect(mockAuthService.login).toHaveBeenCalledWith('eleve@methode-lire.com', 'SecurePass123');
      });
      
      // 5. Vérifier le succès
      await waitFor(() => {
        expect(screen.getByTestId('success-message')).toBeInTheDocument();
        expect(onSuccessMock).toHaveBeenCalled();
      });
    });

    it('❌ flux complet : saisie → validation échouée → pas de requête', async () => {
      const user = userEvent.setup();
      
      render(<LoginForm onLogin={mockAuthService.login} />);
      
      // Saisie d'un email jetable
      await user.type(screen.getByTestId('identifier-input'), 'test@mailinator.com');
      await user.type(screen.getByTestId('password-input'), 'Password123');
      
      // Le bouton doit être désactivé
      expect(screen.getByTestId('submit-button')).toBeDisabled();
      
      // Aucun appel API
      expect(mockAuthService.login).not.toHaveBeenCalled();
    });
  });
});
