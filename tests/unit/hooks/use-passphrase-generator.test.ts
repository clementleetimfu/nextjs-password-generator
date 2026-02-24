import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePassphraseGenerator } from '@/hooks/use-passphrase-generator';
import { generatePassphrase } from '@/lib/crypto';
import { calculatePassphraseStrength } from '@/lib/strength';

vi.mock('@/lib/crypto', async () => {
  const actual = await vi.importActual<typeof import('@/lib/crypto')>('@/lib/crypto');
  return { ...actual, generatePassphrase: vi.fn() };
});

vi.mock('@/lib/strength', async () => {
  const actual = await vi.importActual<typeof import('@/lib/strength')>('@/lib/strength');
  return { ...actual, calculatePassphraseStrength: vi.fn() };
});

describe('usePassphraseGenerator hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(generatePassphrase).mockResolvedValue('correct-horse-battery-staple');
    vi.mocked(calculatePassphraseStrength).mockReturnValue({ level: 'VERY_STRONG', score: 90, entropy: 50 });
  });

  describe('Initialization', () => {
    it('initializes and generates a passphrase', async () => {
      const { result } = renderHook(() => usePassphraseGenerator());
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });
      expect(result.current.state.type).toBe('passphrase');
      expect(result.current.state.value).toBeTruthy();
    });

    it('initializes with default settings', async () => {
      const { result } = renderHook(() => usePassphraseGenerator());
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });
      expect(result.current.state.wordCount).toBe(4);
      expect(result.current.state.separator).toBe('hyphen');
    });

    it('initializes with idle breach check status', async () => {
      const { result } = renderHook(() => usePassphraseGenerator());
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });
      expect(result.current.state.breachCheck).toBe('idle');
      expect(result.current.state.breachCount).toBeUndefined();
    });
  });

  describe('Word Count Control', () => {
    it('updates word count', () => {
      const { result } = renderHook(() => usePassphraseGenerator());
      act(() => result.current.setWordCount(8));
      expect(result.current.state.wordCount).toBe(8);
    });

    it('triggers regeneration when word count changes', async () => {
      const { result } = renderHook(() => usePassphraseGenerator());
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });
      vi.clearAllMocks();
      act(() => result.current.setWordCount(6));
      expect(generatePassphrase).toHaveBeenCalled();
    });
  });

  describe('Separator Control', () => {
    it('updates separator', () => {
      const { result } = renderHook(() => usePassphraseGenerator());
      act(() => result.current.setSeparator('space'));
      expect(result.current.state.separator).toBe('space');
    });

    it('sets underscore separator', () => {
      const { result } = renderHook(() => usePassphraseGenerator());
      act(() => result.current.setSeparator('underscore'));
      expect(result.current.state.separator).toBe('underscore');
    });

    it('sets period separator', () => {
      const { result } = renderHook(() => usePassphraseGenerator());
      act(() => result.current.setSeparator('period'));
      expect(result.current.state.separator).toBe('period');
    });

    it('triggers regeneration when separator changes', async () => {
      const { result } = renderHook(() => usePassphraseGenerator());
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });
      vi.clearAllMocks();
      act(() => result.current.setSeparator('space'));
      expect(generatePassphrase).toHaveBeenCalled();
    });
  });

  describe('Breach Check', () => {
    it('sets breach status', () => {
      const { result } = renderHook(() => usePassphraseGenerator());
      act(() => result.current.setBreachCheck('breached', 3));
      expect(result.current.state.breachCheck).toBe('breached');
      expect(result.current.state.breachCount).toBe(3);
    });

    it('sets safe breach status', () => {
      const { result } = renderHook(() => usePassphraseGenerator());
      act(() => result.current.setBreachCheck('safe'));
      expect(result.current.state.breachCheck).toBe('safe');
    });

    it('sets checking breach status', () => {
      const { result } = renderHook(() => usePassphraseGenerator());
      act(() => result.current.setBreachCheck('checking'));
      expect(result.current.state.breachCheck).toBe('checking');
    });

    it('sets error breach status', () => {
      const { result } = renderHook(() => usePassphraseGenerator());
      act(() => result.current.setBreachCheck('error'));
      expect(result.current.state.breachCheck).toBe('error');
    });
  });

  describe('Manual Value Setting', () => {
    it('sets custom value', () => {
      const { result } = renderHook(() => usePassphraseGenerator());
      act(() => result.current.setValue('custom-passphrase'));
      expect(result.current.state.value).toBe('custom-passphrase');
    });

    it('resets breach check when value is set', () => {
      const { result } = renderHook(() => usePassphraseGenerator());
      act(() => result.current.setBreachCheck('breached', 5));
      act(() => result.current.setValue('new-value'));
      expect(result.current.state.breachCheck).toBe('idle');
      expect(result.current.state.breachCount).toBeUndefined();
    });
  });

  describe('Regeneration', () => {
    it('generates new passphrase on generate call', async () => {
      const { result } = renderHook(() => usePassphraseGenerator());
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });
      vi.clearAllMocks();
      await act(async () => {
        await result.current.generate();
      });
      expect(generatePassphrase).toHaveBeenCalled();
    });

    it('resets breach check on regenerate', async () => {
      const { result } = renderHook(() => usePassphraseGenerator());
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });
      act(() => result.current.setBreachCheck('breached', 100));
      await act(async () => {
        await result.current.generate();
      });
      expect(result.current.state.breachCheck).toBe('idle');
      expect(result.current.state.breachCount).toBeUndefined();
    });
  });

  describe('Strength Calculation', () => {
    it('calculates strength when word count changes', async () => {
      const { result } = renderHook(() => usePassphraseGenerator());
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });
      vi.clearAllMocks();
      act(() => result.current.setWordCount(8));
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });
      expect(calculatePassphraseStrength).toHaveBeenCalled();
    });
  });
});
