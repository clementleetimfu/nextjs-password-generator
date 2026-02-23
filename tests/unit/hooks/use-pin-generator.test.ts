import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { usePinGenerator } from '@/hooks/use-pin-generator';
import { generatePin } from '@/lib/crypto';
import { calculatePinStrength } from '@/lib/strength';
import { PIN_CONSTRAINTS } from '@/lib/crypto';

// Mock the crypto functions
vi.mock('@/lib/crypto', async () => {
  const actual = await vi.importActual<typeof import('@/lib/crypto')>('@/lib/crypto');
  return {
    ...actual,
    generatePin: vi.fn(),
  };
});

// Mock the strength calculation
vi.mock('@/lib/strength', async () => {
  const actual = await vi.importActual<typeof import('@/lib/strength')>('@/lib/strength');
  return {
    ...actual,
    calculatePinStrength: vi.fn(),
  };
});

describe('usePinGenerator Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Setup default mock returns
    vi.mocked(generatePin).mockReturnValue('1234');
    vi.mocked(calculatePinStrength).mockReturnValue({
      level: 'WEAK',
      score: 25,
      entropy: 13.29,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Initial State', () => {
    it('should initialize with default values', () => {
      const { result } = renderHook(() => usePinGenerator());
      
      expect(result.current.state.type).toBe('pin');
      expect(result.current.state.length).toBe(PIN_CONSTRAINTS.DEFAULT_LENGTH);
      expect(result.current.state.strength).toBe('VERY_WEAK');
      expect(result.current.state.breachCheck).toBe('idle');
    });

    it('should generate initial PIN on mount', async () => {
      const { result } = renderHook(() => usePinGenerator());
      
      await waitFor(() => {
        expect(result.current.state.value).toBe('1234');
      });
      
      expect(generatePin).toHaveBeenCalledWith(PIN_CONSTRAINTS.DEFAULT_LENGTH);
    });

    it('should calculate initial strength', async () => {
      const { result } = renderHook(() => usePinGenerator());
      
      await waitFor(() => {
        expect(result.current.state.value).toBeTruthy();
      });
      
      expect(calculatePinStrength).toHaveBeenCalledWith(PIN_CONSTRAINTS.DEFAULT_LENGTH);
    });
  });

  describe('Generate Function', () => {
    it('should generate new PIN when generate is called', async () => {
      const { result } = renderHook(() => usePinGenerator());
      
      await waitFor(() => {
        expect(result.current.state.value).toBeTruthy();
      });
      
      vi.mocked(generatePin).mockReturnValue('5678');
      
      act(() => {
        result.current.generate();
      });
      
      await waitFor(() => {
        expect(result.current.state.value).toBe('5678');
      });
    });

    it('should reset breach check status on generate', async () => {
      const { result } = renderHook(() => usePinGenerator());
      
      await waitFor(() => {
        expect(result.current.state.value).toBeTruthy();
      });
      
      act(() => {
        result.current.setBreachCheck('breached', 5);
      });
      
      expect(result.current.state.breachCheck).toBe('breached');
      
      act(() => {
        result.current.generate();
      });
      
      expect(result.current.state.breachCheck).toBe('idle');
      expect(result.current.state.breachCount).toBeUndefined();
    });

    it('should update strength on generate', async () => {
      const { result } = renderHook(() => usePinGenerator());
      
      await waitFor(() => {
        expect(result.current.state.value).toBeTruthy();
      });
      
      vi.mocked(calculatePinStrength).mockReturnValue({
        level: 'MODERATE',
        score: 50,
        entropy: 26.58,
      });
      
      act(() => {
        result.current.generate();
      });
      
      await waitFor(() => {
        expect(result.current.state.strength).toBe('MODERATE');
      });
    });
  });

  describe('setLength Function', () => {
    it('should update PIN length', async () => {
      const { result } = renderHook(() => usePinGenerator());
      
      await waitFor(() => {
        expect(result.current.state.value).toBeTruthy();
      });
      
      act(() => {
        result.current.setLength(6);
      });
      
      expect(result.current.state.length).toBe(6);
    });

    it('should trigger regeneration when length changes', async () => {
      const { result } = renderHook(() => usePinGenerator());
      
      await waitFor(() => {
        expect(result.current.state.value).toBeTruthy();
      });
      
      vi.mocked(generatePin).mockReturnValue('123456');
      
      act(() => {
        result.current.setLength(6);
      });
      
      await waitFor(() => {
        expect(result.current.state.value).toBe('123456');
      });
      
      expect(generatePin).toHaveBeenCalledWith(6);
    });

    it('should handle minimum length', async () => {
      const { result } = renderHook(() => usePinGenerator());
      
      act(() => {
        result.current.setLength(PIN_CONSTRAINTS.MIN_LENGTH);
      });
      
      expect(result.current.state.length).toBe(PIN_CONSTRAINTS.MIN_LENGTH);
    });

    it('should handle maximum length', async () => {
      const { result } = renderHook(() => usePinGenerator());
      
      act(() => {
        result.current.setLength(PIN_CONSTRAINTS.MAX_LENGTH);
      });
      
      expect(result.current.state.length).toBe(PIN_CONSTRAINTS.MAX_LENGTH);
    });
  });

  describe('setBreachCheck Function', () => {
    it('should update breach check status to safe', async () => {
      const { result } = renderHook(() => usePinGenerator());
      
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
      const { result } = renderHook(() => usePinGenerator());
      
      await waitFor(() => {
        expect(result.current.state.value).toBeTruthy();
      });
      
      act(() => {
        result.current.setBreachCheck('breached', 10);
      });
      
      expect(result.current.state.breachCheck).toBe('breached');
      expect(result.current.state.breachCount).toBe(10);
    });

    it('should update breach check status to error', async () => {
      const { result } = renderHook(() => usePinGenerator());
      
      await waitFor(() => {
        expect(result.current.state.value).toBeTruthy();
      });
      
      act(() => {
        result.current.setBreachCheck('error', undefined);
      });
      
      expect(result.current.state.breachCheck).toBe('error');
    });

    it('should update breach check status to checking', async () => {
      const { result } = renderHook(() => usePinGenerator());
      
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
      const { result } = renderHook(() => usePinGenerator());
      
      await waitFor(() => {
        expect(result.current.state.value).toBeTruthy();
      });
      
      const initialPin = result.current.state.value;
      
      act(() => {
        result.current.setLength(5);
      });
      
      await waitFor(() => {
        expect(result.current.state.value).not.toBe(initialPin);
      });
    });
  });

  describe('Strength Calculation', () => {
    it('should calculate weak strength for short PINs', async () => {
      const { result } = renderHook(() => usePinGenerator());
      
      vi.mocked(calculatePinStrength).mockReturnValue({
        level: 'WEAK',
        score: 25,
        entropy: 13.29,
      });
      
      act(() => {
        result.current.setLength(4);
      });
      
      await waitFor(() => {
        expect(result.current.state.strength).toBe('WEAK');
      });
    });

    it('should calculate moderate strength for medium PINs', async () => {
      const { result } = renderHook(() => usePinGenerator());
      
      vi.mocked(calculatePinStrength).mockReturnValue({
        level: 'MODERATE',
        score: 50,
        entropy: 26.58,
      });
      
      act(() => {
        result.current.setLength(6);
      });
      
      await waitFor(() => {
        expect(result.current.state.strength).toBe('MODERATE');
      });
    });

    it('should calculate strong strength for long PINs', async () => {
      const { result } = renderHook(() => usePinGenerator());
      
      vi.mocked(calculatePinStrength).mockReturnValue({
        level: 'STRONG',
        score: 75,
        entropy: 39.86,
      });
      
      act(() => {
        result.current.setLength(10);
      });
      
      await waitFor(() => {
        expect(result.current.state.strength).toBe('STRONG');
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle minimum length PIN', async () => {
      const { result } = renderHook(() => usePinGenerator());
      
      vi.mocked(generatePin).mockReturnValue('123');
      
      act(() => {
        result.current.setLength(PIN_CONSTRAINTS.MIN_LENGTH);
      });
      
      await waitFor(() => {
        expect(result.current.state.value).toBe('123');
        expect(result.current.state.value.length).toBe(PIN_CONSTRAINTS.MIN_LENGTH);
      });
    });

    it('should handle maximum length PIN', async () => {
      const { result } = renderHook(() => usePinGenerator());
      
      vi.mocked(generatePin).mockReturnValue('123456789012');
      
      act(() => {
        result.current.setLength(PIN_CONSTRAINTS.MAX_LENGTH);
      });
      
      await waitFor(() => {
        expect(result.current.state.value).toBe('123456789012');
        expect(result.current.state.value.length).toBe(PIN_CONSTRAINTS.MAX_LENGTH);
      });
    });

    it('should handle rapid length changes', async () => {
      const { result } = renderHook(() => usePinGenerator());
      
      await waitFor(() => {
        expect(result.current.state.value).toBeTruthy();
      });
      
      act(() => {
        result.current.setLength(4);
        result.current.setLength(5);
        result.current.setLength(6);
      });
      
      await waitFor(() => {
        expect(result.current.state.length).toBe(6);
      });
    });
  });

  describe('PIN Format', () => {
    it('should generate PINs with only digits', async () => {
      const { result } = renderHook(() => usePinGenerator());
      
      await waitFor(() => {
        expect(result.current.state.value).toBeTruthy();
      });
      
      const pin = result.current.state.value;
      expect(pin).toMatch(/^\d+$/);
    });

    it('should generate PINs with correct length', async () => {
      const { result } = renderHook(() => usePinGenerator());
      
      act(() => {
        result.current.setLength(8);
      });
      
      await waitFor(() => {
        expect(result.current.state.value.length).toBe(8);
      });
    });
  });
});
