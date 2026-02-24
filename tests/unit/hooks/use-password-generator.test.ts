import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePasswordGenerator } from '@/hooks/use-password-generator';
import { generatePassword } from '@/lib/crypto';
import { calculatePasswordStrength } from '@/lib/strength';

vi.mock('@/lib/crypto', async () => {
  const actual = await vi.importActual<typeof import('@/lib/crypto')>('@/lib/crypto');
  return { ...actual, generatePassword: vi.fn() };
});

vi.mock('@/lib/strength', async () => {
  const actual = await vi.importActual<typeof import('@/lib/strength')>('@/lib/strength');
  return { ...actual, calculatePasswordStrength: vi.fn() };
});

describe('usePasswordGenerator hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(generatePassword).mockReturnValue('abc123XYZ!');
    vi.mocked(calculatePasswordStrength).mockReturnValue({ level: 'MODERATE', score: 50, entropy: 40 });
  });

  describe('Initialization', () => {
    it('initializes and generates a value', () => {
      const { result } = renderHook(() => usePasswordGenerator());
      expect(result.current.state.type).toBe('password');
      expect(result.current.state.value).toBeTruthy();
    });

    it('initializes with default settings', () => {
      const { result } = renderHook(() => usePasswordGenerator());
      expect(result.current.state.length).toBe(8);
      expect(result.current.state.includeDigits).toBe(false);
      expect(result.current.state.includeSymbols).toBe(false);
      expect(result.current.state.includeUppercase).toBe(false);
    });

    it('initializes with idle breach check status', () => {
      const { result } = renderHook(() => usePasswordGenerator());
      expect(result.current.state.breachCheck).toBe('idle');
      expect(result.current.state.breachCount).toBeUndefined();
    });
  });

  describe('Length Control', () => {
    it('updates length', () => {
      const { result } = renderHook(() => usePasswordGenerator());
      act(() => result.current.setLength(20));
      expect(result.current.state.length).toBe(20);
    });

    it('triggers regeneration when length changes', () => {
      const { result } = renderHook(() => usePasswordGenerator());
      vi.clearAllMocks();
      act(() => result.current.setLength(16));
      expect(generatePassword).toHaveBeenCalled();
    });
  });

  describe('Toggle Options', () => {
    it('toggles option flags', () => {
      const { result } = renderHook(() => usePasswordGenerator());
      act(() => {
        result.current.toggleDigits();
        result.current.toggleSymbols();
        result.current.toggleUppercase();
      });

      expect(result.current.state.includeDigits).toBe(true);
      expect(result.current.state.includeSymbols).toBe(true);
      expect(result.current.state.includeUppercase).toBe(true);
    });

    it('toggles digits on and off', () => {
      const { result } = renderHook(() => usePasswordGenerator());
      act(() => result.current.toggleDigits());
      expect(result.current.state.includeDigits).toBe(true);
      act(() => result.current.toggleDigits());
      expect(result.current.state.includeDigits).toBe(false);
    });

    it('toggles symbols on and off', () => {
      const { result } = renderHook(() => usePasswordGenerator());
      act(() => result.current.toggleSymbols());
      expect(result.current.state.includeSymbols).toBe(true);
      act(() => result.current.toggleSymbols());
      expect(result.current.state.includeSymbols).toBe(false);
    });

    it('toggles uppercase on and off', () => {
      const { result } = renderHook(() => usePasswordGenerator());
      act(() => result.current.toggleUppercase());
      expect(result.current.state.includeUppercase).toBe(true);
      act(() => result.current.toggleUppercase());
      expect(result.current.state.includeUppercase).toBe(false);
    });

    it('triggers regeneration when toggle changes', () => {
      const { result } = renderHook(() => usePasswordGenerator());
      vi.clearAllMocks();
      act(() => result.current.toggleDigits());
      expect(generatePassword).toHaveBeenCalled();
    });
  });

  describe('Breach Check', () => {
    it('sets breach status', () => {
      const { result } = renderHook(() => usePasswordGenerator());
      act(() => result.current.setBreachCheck('breached', 10));
      expect(result.current.state.breachCheck).toBe('breached');
      expect(result.current.state.breachCount).toBe(10);
    });

    it('sets safe breach status', () => {
      const { result } = renderHook(() => usePasswordGenerator());
      act(() => result.current.setBreachCheck('safe'));
      expect(result.current.state.breachCheck).toBe('safe');
      expect(result.current.state.breachCount).toBeUndefined();
    });

    it('sets checking breach status', () => {
      const { result } = renderHook(() => usePasswordGenerator());
      act(() => result.current.setBreachCheck('checking'));
      expect(result.current.state.breachCheck).toBe('checking');
    });

    it('sets error breach status', () => {
      const { result } = renderHook(() => usePasswordGenerator());
      act(() => result.current.setBreachCheck('error'));
      expect(result.current.state.breachCheck).toBe('error');
    });
  });

  describe('Manual Value Setting', () => {
    it('sets custom value', () => {
      const { result } = renderHook(() => usePasswordGenerator());
      act(() => result.current.setValue('custom-password'));
      expect(result.current.state.value).toBe('custom-password');
    });

    it('resets breach check when value is set', () => {
      const { result } = renderHook(() => usePasswordGenerator());
      act(() => result.current.setBreachCheck('breached', 5));
      act(() => result.current.setValue('new-value'));
      expect(result.current.state.breachCheck).toBe('idle');
      expect(result.current.state.breachCount).toBeUndefined();
    });
  });

  describe('Regeneration', () => {
    it('generates new password on generate call', () => {
      const { result } = renderHook(() => usePasswordGenerator());
      vi.clearAllMocks();
      act(() => result.current.generate());
      expect(generatePassword).toHaveBeenCalled();
    });

    it('resets breach check on regenerate', () => {
      const { result } = renderHook(() => usePasswordGenerator());
      act(() => result.current.setBreachCheck('breached', 100));
      act(() => result.current.generate());
      expect(result.current.state.breachCheck).toBe('idle');
      expect(result.current.state.breachCount).toBeUndefined();
    });
  });

  describe('Strength Calculation', () => {
    it('calculates strength with current settings', () => {
      const { result } = renderHook(() => usePasswordGenerator());
      act(() => {
        result.current.setLength(20);
        result.current.toggleDigits();
        result.current.toggleSymbols();
        result.current.toggleUppercase();
      });
      expect(calculatePasswordStrength).toHaveBeenCalled();
    });
  });
});
