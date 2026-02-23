import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { usePasswordGenerator } from '@/hooks/use-password-generator';
import { generatePassword } from '@/lib/crypto';
import { calculatePasswordStrength } from '@/lib/strength';
import { PASSWORD_CONSTRAINTS } from '@/lib/crypto';

// Mock the crypto functions
vi.mock('@/lib/crypto', async () => {
  const actual = await vi.importActual<typeof import('@/lib/crypto')>('@/lib/crypto');
  return {
    ...actual,
    generatePassword: vi.fn(),
  };
});

// Mock the strength calculation
vi.mock('@/lib/strength', async () => {
  const actual = await vi.importActual<typeof import('@/lib/strength')>('@/lib/strength');
  return {
    ...actual,
    calculatePasswordStrength: vi.fn(),
  };
});

describe('usePasswordGenerator Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Setup default mock returns
    vi.mocked(generatePassword).mockReturnValue('testPassword123');
    vi.mocked(calculatePasswordStrength).mockReturnValue({
      level: 'MODERATE',
      score: 50,
      entropy: 40.0,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Initial State', () => {
    it('should initialize with default values', () => {
      const { result } = renderHook(() => usePasswordGenerator());
      
      expect(result.current.state.type).toBe('password');
      expect(result.current.state.length).toBe(PASSWORD_CONSTRAINTS.DEFAULT_LENGTH);
      expect(result.current.state.includeDigits).toBe(false);
      expect(result.current.state.includeSymbols).toBe(false);
      expect(result.current.state.includeUppercase).toBe(false);
      expect(result.current.state.strength).toBe('VERY_WEAK');
      expect(result.current.state.breachCheck).toBe('idle');
    });

    it('should generate initial password on mount', async () => {
      const { result } = renderHook(() => usePasswordGenerator());
      
      await waitFor(() => {
        expect(result.current.state.value).toBe('testPassword123');
      });
      
      expect(generatePassword).toHaveBeenCalledWith(
        PASSWORD_CONSTRAINTS.DEFAULT_LENGTH,
        false,
        false,
        false
      );
    });

    it('should calculate initial strength', async () => {
      const { result } = renderHook(() => usePasswordGenerator());
      
      await waitFor(() => {
        expect(result.current.state.strength).toBe('MODERATE');
      });
      
      expect(calculatePasswordStrength).toHaveBeenCalledWith(
        PASSWORD_CONSTRAINTS.DEFAULT_LENGTH,
        {
          lowercase: true,
          uppercase: false,
          digits: false,
          symbols: false,
        }
      );
    });
  });

  describe('Generate Function', () => {
    it('should generate new password when generate is called', async () => {
      const { result } = renderHook(() => usePasswordGenerator());
      
      await waitFor(() => {
        expect(result.current.state.value).toBeTruthy();
      });
      
      vi.mocked(generatePassword).mockReturnValue('newPassword456');
      
      act(() => {
        result.current.generate();
      });
      
      await waitFor(() => {
        expect(result.current.state.value).toBe('newPassword456');
      });
    });

    it('should reset breach check status on generate', async () => {
      const { result } = renderHook(() => usePasswordGenerator());
      
      await waitFor(() => {
        expect(result.current.state.value).toBeTruthy();
      });
      
      act(() => {
        result.current.setBreachCheck('breached', 10);
      });
      
      expect(result.current.state.breachCheck).toBe('breached');
      
      act(() => {
        result.current.generate();
      });
      
      expect(result.current.state.breachCheck).toBe('idle');
      expect(result.current.state.breachCount).toBeUndefined();
    });

    it('should update strength on generate', async () => {
      const { result } = renderHook(() => usePasswordGenerator());
      
      await waitFor(() => {
        expect(result.current.state.value).toBeTruthy();
      });
      
      vi.mocked(calculatePasswordStrength).mockReturnValue({
        level: 'STRONG',
        score: 80,
        entropy: 60.0,
      });
      
      act(() => {
        result.current.generate();
      });
      
      await waitFor(() => {
        expect(result.current.state.strength).toBe('STRONG');
      });
    });
  });

  describe('setLength Function', () => {
    it('should update password length', async () => {
      const { result } = renderHook(() => usePasswordGenerator());
      
      await waitFor(() => {
        expect(result.current.state.value).toBeTruthy();
      });
      
      act(() => {
        result.current.setLength(16);
      });
      
      expect(result.current.state.length).toBe(16);
    });

    it('should trigger regeneration when length changes', async () => {
      const { result } = renderHook(() => usePasswordGenerator());
      
      await waitFor(() => {
        expect(result.current.state.value).toBeTruthy();
      });
      
      vi.mocked(generatePassword).mockReturnValue('longPassword123456');
      
      act(() => {
        result.current.setLength(20);
      });
      
      await waitFor(() => {
        expect(result.current.state.value).toBe('longPassword123456');
      });
      
      expect(generatePassword).toHaveBeenCalledWith(20, false, false, false);
    });

    it('should handle minimum length', async () => {
      const { result } = renderHook(() => usePasswordGenerator());
      
      act(() => {
        result.current.setLength(PASSWORD_CONSTRAINTS.MIN_LENGTH);
      });
      
      expect(result.current.state.length).toBe(PASSWORD_CONSTRAINTS.MIN_LENGTH);
    });

    it('should handle maximum length', async () => {
      const { result } = renderHook(() => usePasswordGenerator());
      
      act(() => {
        result.current.setLength(PASSWORD_CONSTRAINTS.MAX_LENGTH);
      });
      
      expect(result.current.state.length).toBe(PASSWORD_CONSTRAINTS.MAX_LENGTH);
    });
  });

  describe('toggleDigits Function', () => {
    it('should toggle digits from false to true', async () => {
      const { result } = renderHook(() => usePasswordGenerator());
      
      await waitFor(() => {
        expect(result.current.state.value).toBeTruthy();
      });
      
      act(() => {
        result.current.toggleDigits();
      });
      
      expect(result.current.state.includeDigits).toBe(true);
    });

    it('should toggle digits from true to false', async () => {
      const { result } = renderHook(() => usePasswordGenerator());
      
      await waitFor(() => {
        expect(result.current.state.value).toBeTruthy();
      });
      
      act(() => {
        result.current.toggleDigits();
        result.current.toggleDigits();
      });
      
      expect(result.current.state.includeDigits).toBe(false);
    });

    it('should trigger regeneration when digits toggled', async () => {
      const { result } = renderHook(() => usePasswordGenerator());
      
      await waitFor(() => {
        expect(result.current.state.value).toBeTruthy();
      });
      
      vi.mocked(generatePassword).mockReturnValue('passwordWithDigits123');
      
      act(() => {
        result.current.toggleDigits();
      });
      
      await waitFor(() => {
        expect(result.current.state.value).toBe('passwordWithDigits123');
      });
      
      expect(generatePassword).toHaveBeenCalledWith(
        PASSWORD_CONSTRAINTS.DEFAULT_LENGTH,
        true,
        false,
        false
      );
    });
  });

  describe('toggleSymbols Function', () => {
    it('should toggle symbols from false to true', async () => {
      const { result } = renderHook(() => usePasswordGenerator());
      
      await waitFor(() => {
        expect(result.current.state.value).toBeTruthy();
      });
      
      act(() => {
        result.current.toggleSymbols();
      });
      
      expect(result.current.state.includeSymbols).toBe(true);
    });

    it('should toggle symbols from true to false', async () => {
      const { result } = renderHook(() => usePasswordGenerator());
      
      await waitFor(() => {
        expect(result.current.state.value).toBeTruthy();
      });
      
      act(() => {
        result.current.toggleSymbols();
        result.current.toggleSymbols();
      });
      
      expect(result.current.state.includeSymbols).toBe(false);
    });

    it('should trigger regeneration when symbols toggled', async () => {
      const { result } = renderHook(() => usePasswordGenerator());
      
      await waitFor(() => {
        expect(result.current.state.value).toBeTruthy();
      });
      
      vi.mocked(generatePassword).mockReturnValue('passwordWithSymbols!');
      
      act(() => {
        result.current.toggleSymbols();
      });
      
      await waitFor(() => {
        expect(result.current.state.value).toBe('passwordWithSymbols!');
      });
      
      expect(generatePassword).toHaveBeenCalledWith(
        PASSWORD_CONSTRAINTS.DEFAULT_LENGTH,
        false,
        true,
        false
      );
    });
  });

  describe('toggleUppercase Function', () => {
    it('should toggle uppercase from false to true', async () => {
      const { result } = renderHook(() => usePasswordGenerator());
      
      await waitFor(() => {
        expect(result.current.state.value).toBeTruthy();
      });
      
      act(() => {
        result.current.toggleUppercase();
      });
      
      expect(result.current.state.includeUppercase).toBe(true);
    });

    it('should toggle uppercase from true to false', async () => {
      const { result } = renderHook(() => usePasswordGenerator());
      
      await waitFor(() => {
        expect(result.current.state.value).toBeTruthy();
      });
      
      act(() => {
        result.current.toggleUppercase();
        result.current.toggleUppercase();
      });
      
      expect(result.current.state.includeUppercase).toBe(false);
    });

    it('should trigger regeneration when uppercase toggled', async () => {
      const { result } = renderHook(() => usePasswordGenerator());
      
      await waitFor(() => {
        expect(result.current.state.value).toBeTruthy();
      });
      
      vi.mocked(generatePassword).mockReturnValue('PasswordWithUppercase');
      
      act(() => {
        result.current.toggleUppercase();
      });
      
      await waitFor(() => {
        expect(result.current.state.value).toBe('PasswordWithUppercase');
      });
      
      expect(generatePassword).toHaveBeenCalledWith(
        PASSWORD_CONSTRAINTS.DEFAULT_LENGTH,
        false,
        false,
        true
      );
    });
  });

  describe('setBreachCheck Function', () => {
    it('should update breach check status to safe', async () => {
      const { result } = renderHook(() => usePasswordGenerator());
      
      await waitFor(() => {
        expect(result.current.state.value).toBeTruthy();
      });
      
      act(() => {
        result.current.setBreachCheck('safe', undefined);
      });
      
      expect(result.current.state.breachCheck).toBe('safe');
      expect(result.current.state.breachCount).toBeUndefined();
    });

    it('should update breach check status to breached with count', async () => {
      const { result } = renderHook(() => usePasswordGenerator());
      
      await waitFor(() => {
        expect(result.current.state.value).toBeTruthy();
      });
      
      act(() => {
        result.current.setBreachCheck('breached', 42);
      });
      
      expect(result.current.state.breachCheck).toBe('breached');
      expect(result.current.state.breachCount).toBe(42);
    });

    it('should update breach check status to error', async () => {
      const { result } = renderHook(() => usePasswordGenerator());
      
      await waitFor(() => {
        expect(result.current.state.value).toBeTruthy();
      });
      
      act(() => {
        result.current.setBreachCheck('error', undefined);
      });
      
      expect(result.current.state.breachCheck).toBe('error');
    });

    it('should update breach check status to checking', async () => {
      const { result } = renderHook(() => usePasswordGenerator());
      
      await waitFor(() => {
        expect(result.current.state.value).toBeTruthy();
      });
      
      act(() => {
        result.current.setBreachCheck('checking', undefined);
      });
      
      expect(result.current.state.breachCheck).toBe('checking');
    });
  });

  describe('Auto-regeneration', () => {
    it('should regenerate when length changes', async () => {
      const { result } = renderHook(() => usePasswordGenerator());
      
      await waitFor(() => {
        expect(result.current.state.value).toBeTruthy();
      });
      
      const initialPassword = result.current.state.value;
      
      act(() => {
        result.current.setLength(16);
      });
      
      await waitFor(() => {
        expect(result.current.state.value).not.toBe(initialPassword);
      });
    });

    it('should regenerate when digits toggle changes', async () => {
      const { result } = renderHook(() => usePasswordGenerator());
      
      await waitFor(() => {
        expect(result.current.state.value).toBeTruthy();
      });
      
      const initialPassword = result.current.state.value;
      
      act(() => {
        result.current.toggleDigits();
      });
      
      await waitFor(() => {
        expect(result.current.state.value).not.toBe(initialPassword);
      });
    });

    it('should regenerate when symbols toggle changes', async () => {
      const { result } = renderHook(() => usePasswordGenerator());
      
      await waitFor(() => {
        expect(result.current.state.value).toBeTruthy();
      });
      
      const initialPassword = result.current.state.value;
      
      act(() => {
        result.current.toggleSymbols();
      });
      
      await waitFor(() => {
        expect(result.current.state.value).not.toBe(initialPassword);
      });
    });

    it('should regenerate when uppercase toggle changes', async () => {
      const { result } = renderHook(() => usePasswordGenerator());
      
      await waitFor(() => {
        expect(result.current.state.value).toBeTruthy();
      });
      
      const initialPassword = result.current.state.value;
      
      act(() => {
        result.current.toggleUppercase();
      });
      
      await waitFor(() => {
        expect(result.current.state.value).not.toBe(initialPassword);
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle all character types enabled simultaneously', async () => {
      const { result } = renderHook(() => usePasswordGenerator());
      
      await waitFor(() => {
        expect(result.current.state.value).toBeTruthy();
      });
      
      act(() => {
        result.current.toggleDigits();
        result.current.toggleSymbols();
        result.current.toggleUppercase();
      });
      
      expect(result.current.state.includeDigits).toBe(true);
      expect(result.current.state.includeSymbols).toBe(true);
      expect(result.current.state.includeUppercase).toBe(true);
    });

    it('should handle rapid state changes', async () => {
      const { result } = renderHook(() => usePasswordGenerator());
      
      await waitFor(() => {
        expect(result.current.state.value).toBeTruthy();
      });
      
      act(() => {
        result.current.setLength(10);
        result.current.toggleDigits();
        result.current.toggleSymbols();
        result.current.toggleUppercase();
      });
      
      expect(result.current.state.length).toBe(10);
      expect(result.current.state.includeDigits).toBe(true);
      expect(result.current.state.includeSymbols).toBe(true);
      expect(result.current.state.includeUppercase).toBe(true);
    });
  });
});
