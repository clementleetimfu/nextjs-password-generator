import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useStrengthCheck } from '@/hooks/use-strength-check';
import { calculatePasswordStrength, calculatePinStrength, calculatePassphraseStrength } from '@/lib/strength';

vi.mock('@/lib/strength', async () => {
  const actual = await vi.importActual<typeof import('@/lib/strength')>('@/lib/strength');
  return {
    ...actual,
    calculatePasswordStrength: vi.fn(),
    calculatePinStrength: vi.fn(),
    calculatePassphraseStrength: vi.fn(),
  };
});

describe('useStrengthCheck hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(calculatePasswordStrength).mockReturnValue({ level: 'MODERATE', score: 50, entropy: 40 });
    vi.mocked(calculatePinStrength).mockReturnValue({ level: 'STRONG', score: 70, entropy: 30 });
    vi.mocked(calculatePassphraseStrength).mockReturnValue({ level: 'VERY_STRONG', score: 90, entropy: 80 });
  });

  describe('checkPasswordStrength', () => {
    it('returns password strength level', () => {
      const { result } = renderHook(() => useStrengthCheck());
      const level = result.current.checkPasswordStrength(12, { lowercase: true, uppercase: true, digits: true, symbols: true });
      expect(level).toBe('MODERATE');
    });

    it('calls calculatePasswordStrength with correct parameters', () => {
      const { result } = renderHook(() => useStrengthCheck());
      result.current.checkPasswordStrength(16, { lowercase: true, uppercase: false, digits: true, symbols: true });
      expect(calculatePasswordStrength).toHaveBeenCalledWith(16, { lowercase: true, uppercase: false, digits: true, symbols: true });
    });

    it('returns VERY_WEAK for weak passwords', () => {
      vi.mocked(calculatePasswordStrength).mockReturnValue({ level: 'VERY_WEAK', score: 10, entropy: 10 });
      const { result } = renderHook(() => useStrengthCheck());
      const level = result.current.checkPasswordStrength(8, { lowercase: true, uppercase: false, digits: false, symbols: false });
      expect(level).toBe('VERY_WEAK');
    });

    it('returns VERY_STRONG for strong passwords', () => {
      vi.mocked(calculatePasswordStrength).mockReturnValue({ level: 'VERY_STRONG', score: 100, entropy: 100 });
      const { result } = renderHook(() => useStrengthCheck());
      const level = result.current.checkPasswordStrength(50, { lowercase: true, uppercase: true, digits: true, symbols: true });
      expect(level).toBe('VERY_STRONG');
    });

    it('handles different character set combinations', () => {
      const { result } = renderHook(() => useStrengthCheck());

      result.current.checkPasswordStrength(12, { lowercase: true, uppercase: false, digits: false, symbols: false });
      expect(calculatePasswordStrength).toHaveBeenCalledWith(12, { lowercase: true, uppercase: false, digits: false, symbols: false });

      result.current.checkPasswordStrength(12, { lowercase: false, uppercase: true, digits: false, symbols: false });
      expect(calculatePasswordStrength).toHaveBeenCalledWith(12, { lowercase: false, uppercase: true, digits: false, symbols: false });
    });
  });

  describe('checkPinStrength', () => {
    it('returns PIN strength level', () => {
      const { result } = renderHook(() => useStrengthCheck());
      const level = result.current.checkPinStrength(6);
      expect(level).toBe('STRONG');
    });

    it('calls calculatePinStrength with correct length', () => {
      const { result } = renderHook(() => useStrengthCheck());
      result.current.checkPinStrength(8);
      expect(calculatePinStrength).toHaveBeenCalledWith(8);
    });

    it('returns VERY_WEAK for short PINs', () => {
      vi.mocked(calculatePinStrength).mockReturnValue({ level: 'VERY_WEAK', score: 5, entropy: 5 });
      const { result } = renderHook(() => useStrengthCheck());
      const level = result.current.checkPinStrength(3);
      expect(level).toBe('VERY_WEAK');
    });

    it('returns VERY_STRONG for long PINs', () => {
      vi.mocked(calculatePinStrength).mockReturnValue({ level: 'VERY_STRONG', score: 95, entropy: 95 });
      const { result } = renderHook(() => useStrengthCheck());
      const level = result.current.checkPinStrength(12);
      expect(level).toBe('VERY_STRONG');
    });

    it('handles minimum PIN length', () => {
      const { result } = renderHook(() => useStrengthCheck());
      result.current.checkPinStrength(3);
      expect(calculatePinStrength).toHaveBeenCalledWith(3);
    });

    it('handles maximum PIN length', () => {
      const { result } = renderHook(() => useStrengthCheck());
      result.current.checkPinStrength(12);
      expect(calculatePinStrength).toHaveBeenCalledWith(12);
    });
  });

  describe('checkPassphraseStrength', () => {
    it('returns passphrase strength level', () => {
      const { result } = renderHook(() => useStrengthCheck());
      const level = result.current.checkPassphraseStrength(4);
      expect(level).toBe('VERY_STRONG');
    });

    it('calls calculatePassphraseStrength with correct word count', () => {
      const { result } = renderHook(() => useStrengthCheck());
      result.current.checkPassphraseStrength(6);
      expect(calculatePassphraseStrength).toHaveBeenCalledWith(6);
    });

    it('returns WEAK for short passphrases', () => {
      vi.mocked(calculatePassphraseStrength).mockReturnValue({ level: 'WEAK', score: 20, entropy: 20 });
      const { result } = renderHook(() => useStrengthCheck());
      const level = result.current.checkPassphraseStrength(4);
      expect(level).toBe('WEAK');
    });

    it('returns VERY_STRONG for long passphrases', () => {
      vi.mocked(calculatePassphraseStrength).mockReturnValue({ level: 'VERY_STRONG', score: 100, entropy: 100 });
      const { result } = renderHook(() => useStrengthCheck());
      const level = result.current.checkPassphraseStrength(10);
      expect(level).toBe('VERY_STRONG');
    });

    it('handles minimum word count', () => {
      const { result } = renderHook(() => useStrengthCheck());
      result.current.checkPassphraseStrength(4);
      expect(calculatePassphraseStrength).toHaveBeenCalledWith(4);
    });

    it('handles maximum word count', () => {
      const { result } = renderHook(() => useStrengthCheck());
      result.current.checkPassphraseStrength(10);
      expect(calculatePassphraseStrength).toHaveBeenCalledWith(10);
    });
  });

  describe('callback stability', () => {
    it('provides stable callback references', () => {
      const { result, rerender } = renderHook(() => useStrengthCheck());
      const firstCheckPassword = result.current.checkPasswordStrength;
      const firstCheckPin = result.current.checkPinStrength;
      const firstCheckPassphrase = result.current.checkPassphraseStrength;

      rerender();

      expect(result.current.checkPasswordStrength).toBe(firstCheckPassword);
      expect(result.current.checkPinStrength).toBe(firstCheckPin);
      expect(result.current.checkPassphraseStrength).toBe(firstCheckPassphrase);
    });
  });

  describe('rapid checks', () => {
    it('handles rapid strength check calls', () => {
      const { result } = renderHook(() => useStrengthCheck());

      for (let i = 0; i < 100; i++) {
        result.current.checkPasswordStrength(12 + (i % 10), { lowercase: true, uppercase: true, digits: true, symbols: true });
        result.current.checkPinStrength(3 + (i % 10));
        result.current.checkPassphraseStrength(4 + (i % 7));
      }

      expect(calculatePasswordStrength).toHaveBeenCalledTimes(100);
      expect(calculatePinStrength).toHaveBeenCalledTimes(100);
      expect(calculatePassphraseStrength).toHaveBeenCalledTimes(100);
    });
  });
});
