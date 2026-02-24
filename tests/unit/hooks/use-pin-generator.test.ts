import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePinGenerator } from '@/hooks/use-pin-generator';
import { generatePin } from '@/lib/crypto';
import { calculatePinStrength } from '@/lib/strength';

vi.mock('@/lib/crypto', async () => {
  const actual = await vi.importActual<typeof import('@/lib/crypto')>('@/lib/crypto');
  return { ...actual, generatePin: vi.fn() };
});

vi.mock('@/lib/strength', async () => {
  const actual = await vi.importActual<typeof import('@/lib/strength')>('@/lib/strength');
  return { ...actual, calculatePinStrength: vi.fn() };
});

describe('usePinGenerator hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(generatePin).mockReturnValue('1234');
    vi.mocked(calculatePinStrength).mockReturnValue({ level: 'WEAK', score: 20, entropy: 13.2 });
  });

  describe('Initialization', () => {
    it('initializes and generates a pin', () => {
      const { result } = renderHook(() => usePinGenerator());
      expect(result.current.state.type).toBe('pin');
      expect(result.current.state.value).toBeTruthy();
    });

    it('initializes with default length', () => {
      const { result } = renderHook(() => usePinGenerator());
      expect(result.current.state.length).toBe(3);
    });

    it('initializes with idle breach check status', () => {
      const { result } = renderHook(() => usePinGenerator());
      expect(result.current.state.breachCheck).toBe('idle');
      expect(result.current.state.breachCount).toBeUndefined();
    });
  });

  describe('Length Control', () => {
    it('updates length', () => {
      const { result } = renderHook(() => usePinGenerator());
      act(() => result.current.setLength(8));
      expect(result.current.state.length).toBe(8);
    });

    it('triggers regeneration when length changes', () => {
      const { result } = renderHook(() => usePinGenerator());
      vi.clearAllMocks();
      act(() => result.current.setLength(6));
      expect(generatePin).toHaveBeenCalled();
    });

    it('handles minimum length', () => {
      const { result } = renderHook(() => usePinGenerator());
      act(() => result.current.setLength(3));
      expect(result.current.state.length).toBe(3);
    });

    it('handles maximum length', () => {
      const { result } = renderHook(() => usePinGenerator());
      act(() => result.current.setLength(12));
      expect(result.current.state.length).toBe(12);
    });
  });

  describe('Breach Check', () => {
    it('sets breach status', () => {
      const { result } = renderHook(() => usePinGenerator());
      act(() => result.current.setBreachCheck('safe'));
      expect(result.current.state.breachCheck).toBe('safe');
    });

    it('sets breached status with count', () => {
      const { result } = renderHook(() => usePinGenerator());
      act(() => result.current.setBreachCheck('breached', 50));
      expect(result.current.state.breachCheck).toBe('breached');
      expect(result.current.state.breachCount).toBe(50);
    });

    it('sets checking status', () => {
      const { result } = renderHook(() => usePinGenerator());
      act(() => result.current.setBreachCheck('checking'));
      expect(result.current.state.breachCheck).toBe('checking');
    });

    it('sets error status', () => {
      const { result } = renderHook(() => usePinGenerator());
      act(() => result.current.setBreachCheck('error'));
      expect(result.current.state.breachCheck).toBe('error');
    });
  });

  describe('Manual Value Setting', () => {
    it('sets custom value', () => {
      const { result } = renderHook(() => usePinGenerator());
      act(() => result.current.setValue('999999'));
      expect(result.current.state.value).toBe('999999');
    });

    it('resets breach check when value is set', () => {
      const { result } = renderHook(() => usePinGenerator());
      act(() => result.current.setBreachCheck('breached', 5));
      act(() => result.current.setValue('123456'));
      expect(result.current.state.breachCheck).toBe('idle');
      expect(result.current.state.breachCount).toBeUndefined();
    });
  });

  describe('Regeneration', () => {
    it('generates new pin on generate call', () => {
      const { result } = renderHook(() => usePinGenerator());
      vi.clearAllMocks();
      act(() => result.current.generate());
      expect(generatePin).toHaveBeenCalled();
    });

    it('resets breach check on regenerate', () => {
      const { result } = renderHook(() => usePinGenerator());
      act(() => result.current.setBreachCheck('breached', 100));
      act(() => result.current.generate());
      expect(result.current.state.breachCheck).toBe('idle');
      expect(result.current.state.breachCount).toBeUndefined();
    });
  });

  describe('Strength Calculation', () => {
    it('calculates strength with current length', () => {
      const { result } = renderHook(() => usePinGenerator());
      act(() => result.current.setLength(8));
      expect(calculatePinStrength).toHaveBeenCalled();
    });
  });
});
