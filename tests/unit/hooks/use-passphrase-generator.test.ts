import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { usePassphraseGenerator } from '@/hooks/use-passphrase-generator';
import { generatePassphrase } from '@/lib/crypto';
import { calculatePassphraseStrength } from '@/lib/strength';
import { PASSPHRASE_CONSTRAINTS } from '@/lib/crypto';
import type { Separator } from '@/types/generator';

// Mock the crypto functions
vi.mock('@/lib/crypto', async () => {
  const actual = await vi.importActual<typeof import('@/lib/crypto')>('@/lib/crypto');
  return {
    ...actual,
    generatePassphrase: vi.fn(),
  };
});

// Mock the strength calculation
vi.mock('@/lib/strength', async () => {
  const actual = await vi.importActual<typeof import('@/lib/strength')>('@/lib/strength');
  return {
    ...actual,
    calculatePassphraseStrength: vi.fn(),
  };
});

describe('usePassphraseGenerator Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Setup default mock returns
    vi.mocked(generatePassphrase).mockReturnValue('correct-horse-battery-staple');
    vi.mocked(calculatePassphraseStrength).mockReturnValue({
      level: 'VERY_STRONG',
      score: 90,
      entropy: 51.7,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Initial State', () => {
    it('should initialize with default values', () => {
      const { result } = renderHook(() => usePassphraseGenerator());
      
      expect(result.current.state.type).toBe('passphrase');
      expect(result.current.state.wordCount).toBe(PASSPHRASE_CONSTRAINTS.DEFAULT_WORDS);
      expect(result.current.state.separator).toBe(PASSPHRASE_CONSTRAINTS.DEFAULT_SEPARATOR);
      expect(result.current.state.strength).toBe('VERY_WEAK');
      expect(result.current.state.breachCheck).toBe('idle');
    });

    it('should generate initial passphrase on mount', async () => {
      const { result } = renderHook(() => usePassphraseGenerator());
      
      await waitFor(() => {
        expect(result.current.state.value).toBe('correct-horse-battery-staple');
      });
      
      expect(generatePassphrase).toHaveBeenCalledWith(
        PASSPHRASE_CONSTRAINTS.DEFAULT_WORDS,
        '-'
      );
    });

    it('should calculate initial strength', async () => {
      const { result } = renderHook(() => usePassphraseGenerator());
      
      await waitFor(() => {
        expect(result.current.state.value).toBeTruthy();
      });
      
      expect(calculatePassphraseStrength).toHaveBeenCalledWith(
        PASSPHRASE_CONSTRAINTS.DEFAULT_WORDS
      );
    });
  });

  describe('Generate Function', () => {
    it('should generate new passphrase when generate is called', async () => {
      const { result } = renderHook(() => usePassphraseGenerator());
      
      await waitFor(() => {
        expect(result.current.state.value).toBeTruthy();
      });
      
      vi.mocked(generatePassphrase).mockReturnValue('new-passphrase-words-here');
      
      act(() => {
        result.current.generate();
      });
      
      await waitFor(() => {
        expect(result.current.state.value).toBe('new-passphrase-words-here');
      });
    });

    it('should reset breach check status on generate', async () => {
      const { result } = renderHook(() => usePassphraseGenerator());
      
      await waitFor(() => {
        expect(result.current.state.value).toBeTruthy();
      });
      
      act(() => {
        result.current.setBreachCheck('breached', 3);
      });
      
      expect(result.current.state.breachCheck).toBe('breached');
      
      act(() => {
        result.current.generate();
      });
      
      expect(result.current.state.breachCheck).toBe('idle');
      expect(result.current.state.breachCount).toBeUndefined();
    });

    it('should update strength on generate', async () => {
      const { result } = renderHook(() => usePassphraseGenerator());
      
      await waitFor(() => {
        expect(result.current.state.value).toBeTruthy();
      });
      
      vi.mocked(calculatePassphraseStrength).mockReturnValue({
        level: 'STRONG',
        score: 85,
        entropy: 64.63,
      });
      
      act(() => {
        result.current.generate();
      });
      
      await waitFor(() => {
        expect(result.current.state.strength).toBe('STRONG');
      });
    });
  });

  describe('setWordCount Function', () => {
    it('should update word count', async () => {
      const { result } = renderHook(() => usePassphraseGenerator());
      
      await waitFor(() => {
        expect(result.current.state.value).toBeTruthy();
      });
      
      act(() => {
        result.current.setWordCount(6);
      });
      
      expect(result.current.state.wordCount).toBe(6);
    });

    it('should trigger regeneration when word count changes', async () => {
      const { result } = renderHook(() => usePassphraseGenerator());
      
      await waitFor(() => {
        expect(result.current.state.value).toBeTruthy();
      });
      
      vi.mocked(generatePassphrase).mockReturnValue('six-words-in-this-passphrase');
      
      act(() => {
        result.current.setWordCount(6);
      });
      
      await waitFor(() => {
        expect(result.current.state.value).toBe('six-words-in-this-passphrase');
      });
      
      expect(generatePassphrase).toHaveBeenCalledWith(6, '-');
    });

    it('should handle minimum word count', async () => {
      const { result } = renderHook(() => usePassphraseGenerator());
      
      act(() => {
        result.current.setWordCount(PASSPHRASE_CONSTRAINTS.MIN_WORDS);
      });
      
      expect(result.current.state.wordCount).toBe(PASSPHRASE_CONSTRAINTS.MIN_WORDS);
    });

    it('should handle maximum word count', async () => {
      const { result } = renderHook(() => usePassphraseGenerator());
      
      act(() => {
        result.current.setWordCount(PASSPHRASE_CONSTRAINTS.MAX_WORDS);
      });
      
      expect(result.current.state.wordCount).toBe(PASSPHRASE_CONSTRAINTS.MAX_WORDS);
    });
  });

  describe('setSeparator Function', () => {
    it('should update separator to space', async () => {
      const { result } = renderHook(() => usePassphraseGenerator());
      
      await waitFor(() => {
        expect(result.current.state.value).toBeTruthy();
      });
      
      act(() => {
        result.current.setSeparator('space' as Separator);
      });
      
      expect(result.current.state.separator).toBe('space');
    });

    it('should update separator to hyphen', async () => {
      const { result } = renderHook(() => usePassphraseGenerator());
      
      await waitFor(() => {
        expect(result.current.state.value).toBeTruthy();
      });
      
      act(() => {
        result.current.setSeparator('hyphen' as Separator);
      });
      
      expect(result.current.state.separator).toBe('hyphen');
    });

    it('should update separator to underscore', async () => {
      const { result } = renderHook(() => usePassphraseGenerator());
      
      await waitFor(() => {
        expect(result.current.state.value).toBeTruthy();
      });
      
      act(() => {
        result.current.setSeparator('underscore' as Separator);
      });
      
      expect(result.current.state.separator).toBe('underscore');
    });

    it('should update separator to period', async () => {
      const { result } = renderHook(() => usePassphraseGenerator());
      
      await waitFor(() => {
        expect(result.current.state.value).toBeTruthy();
      });
      
      act(() => {
        result.current.setSeparator('period' as Separator);
      });
      
      expect(result.current.state.separator).toBe('period');
    });

    it('should trigger regeneration when separator changes', async () => {
      const { result } = renderHook(() => usePassphraseGenerator());
      
      await waitFor(() => {
        expect(result.current.state.value).toBeTruthy();
      });
      
      vi.mocked(generatePassphrase).mockReturnValue('words with spaces here');
      
      act(() => {
        result.current.setSeparator('space' as Separator);
      });
      
      await waitFor(() => {
        expect(result.current.state.value).toBe('words with spaces here');
      });
      
      expect(generatePassphrase).toHaveBeenCalledWith(
        PASSPHRASE_CONSTRAINTS.DEFAULT_WORDS,
        ' '
      );
    });
  });

  describe('setBreachCheck Function', () => {
    it('should update breach check status to safe', async () => {
      const { result } = renderHook(() => usePassphraseGenerator());
      
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
      const { result } = renderHook(() => usePassphraseGenerator());
      
      await waitFor(() => {
        expect(result.current.state.value).toBeTruthy();
      });
      
      act(() => {
        result.current.setBreachCheck('breached', 7);
      });
      
      expect(result.current.state.breachCheck).toBe('breached');
      expect(result.current.state.breachCount).toBe(7);
    });

    it('should update breach check status to error', async () => {
      const { result } = renderHook(() => usePassphraseGenerator());
      
      await waitFor(() => {
        expect(result.current.state.value).toBeTruthy();
      });
      
      act(() => {
        result.current.setBreachCheck('error', undefined);
      });
      
      expect(result.current.state.breachCheck).toBe('error');
    });

    it('should update breach check status to checking', async () => {
      const { result } = renderHook(() => usePassphraseGenerator());
      
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
    it('should regenerate when word count changes', async () => {
      const { result } = renderHook(() => usePassphraseGenerator());
      
      await waitFor(() => {
        expect(result.current.state.value).toBeTruthy();
      });
      
      const initialPassphrase = result.current.state.value;
      
      act(() => {
        result.current.setWordCount(5);
      });
      
      await waitFor(() => {
        expect(result.current.state.value).not.toBe(initialPassphrase);
      });
    });

    it('should regenerate when separator changes', async () => {
      const { result } = renderHook(() => usePassphraseGenerator());
      
      await waitFor(() => {
        expect(result.current.state.value).toBeTruthy();
      });
      
      const initialPassphrase = result.current.state.value;
      
      act(() => {
        result.current.setSeparator('space' as Separator);
      });
      
      await waitFor(() => {
        expect(result.current.state.value).not.toBe(initialPassphrase);
      });
    });
  });

  describe('Separator Formats', () => {
    it('should use space separator correctly', async () => {
      const { result } = renderHook(() => usePassphraseGenerator());
      
      vi.mocked(generatePassphrase).mockReturnValue('word1 word2 word3');
      
      act(() => {
        result.current.setSeparator('space' as Separator);
      });
      
      await waitFor(() => {
        expect(result.current.state.value).toBe('word1 word2 word3');
        expect(result.current.state.value).toContain(' ');
      });
    });

    it('should use hyphen separator correctly', async () => {
      const { result } = renderHook(() => usePassphraseGenerator());
      
      vi.mocked(generatePassphrase).mockReturnValue('word1-word2-word3');
      
      act(() => {
        result.current.setSeparator('hyphen' as Separator);
      });
      
      await waitFor(() => {
        expect(result.current.state.value).toBe('word1-word2-word3');
        expect(result.current.state.value).toContain('-');
      });
    });

    it('should use underscore separator correctly', async () => {
      const { result } = renderHook(() => usePassphraseGenerator());
      
      vi.mocked(generatePassphrase).mockReturnValue('word1_word2_word3');
      
      act(() => {
        result.current.setSeparator('underscore' as Separator);
      });
      
      await waitFor(() => {
        expect(result.current.state.value).toBe('word1_word2_word3');
        expect(result.current.state.value).toContain('_');
      });
    });

    it('should use period separator correctly', async () => {
      const { result } = renderHook(() => usePassphraseGenerator());
      
      vi.mocked(generatePassphrase).mockReturnValue('word1.word2.word3');
      
      act(() => {
        result.current.setSeparator('period' as Separator);
      });
      
      await waitFor(() => {
        expect(result.current.state.value).toBe('word1.word2.word3');
        expect(result.current.state.value).toContain('.');
      });
    });
  });

  describe('Strength Calculation', () => {
    it('should calculate very strong strength for 4+ words', async () => {
      const { result } = renderHook(() => usePassphraseGenerator());
      
      vi.mocked(calculatePassphraseStrength).mockReturnValue({
        level: 'VERY_STRONG',
        score: 90,
        entropy: 51.7,
      });
      
      act(() => {
        result.current.setWordCount(4);
      });
      
      await waitFor(() => {
        expect(result.current.state.strength).toBe('VERY_STRONG');
      });
    });

    it('should calculate strength based on word count', async () => {
      const { result } = renderHook(() => usePassphraseGenerator());
      
      vi.mocked(calculatePassphraseStrength).mockReturnValue({
        level: 'VERY_STRONG',
        score: 100,
        entropy: 129.25,
      });
      
      act(() => {
        result.current.setWordCount(10);
      });
      
      await waitFor(() => {
        expect(result.current.state.strength).toBe('VERY_STRONG');
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle minimum word count', async () => {
      const { result } = renderHook(() => usePassphraseGenerator());
      
      vi.mocked(generatePassphrase).mockReturnValue('word1-word2-word3-word4');
      
      act(() => {
        result.current.setWordCount(PASSPHRASE_CONSTRAINTS.MIN_WORDS);
      });
      
      await waitFor(() => {
        expect(result.current.state.value).toBe('word1-word2-word3-word4');
      });
    });

    it('should handle maximum word count', async () => {
      const { result } = renderHook(() => usePassphraseGenerator());
      
      vi.mocked(generatePassphrase).mockReturnValue('word1-word2-word3-word4-word5-word6-word7-word8-word9-word10');
      
      act(() => {
        result.current.setWordCount(PASSPHRASE_CONSTRAINTS.MAX_WORDS);
      });
      
      await waitFor(() => {
        expect(result.current.state.value).toBe('word1-word2-word3-word4-word5-word6-word7-word8-word9-word10');
      });
    });

    it('should handle rapid separator changes', async () => {
      const { result } = renderHook(() => usePassphraseGenerator());
      
      await waitFor(() => {
        expect(result.current.state.value).toBeTruthy();
      });
      
      act(() => {
        result.current.setSeparator('space' as Separator);
        result.current.setSeparator('underscore' as Separator);
        result.current.setSeparator('period' as Separator);
      });
      
      await waitFor(() => {
        expect(result.current.state.separator).toBe('period');
      });
    });

    it('should handle all separator types sequentially', async () => {
      const { result } = renderHook(() => usePassphraseGenerator());
      
      const separators: Separator[] = ['space', 'hyphen', 'underscore', 'period'];
      
      for (const separator of separators) {
        act(() => {
          result.current.setSeparator(separator);
        });
        
        await waitFor(() => {
          expect(result.current.state.separator).toBe(separator);
        });
      }
    });
  });

  describe('Passphrase Format', () => {
    it('should generate passphrases with correct number of words', async () => {
      const { result } = renderHook(() => usePassphraseGenerator());
      
      act(() => {
        result.current.setWordCount(5);
      });
      
      await waitFor(() => {
        const words = result.current.state.value.split('-');
        expect(words.length).toBe(5);
      });
    });

    it('should generate passphrases with words separated by separator', async () => {
      const { result } = renderHook(() => usePassphraseGenerator());
      
      act(() => {
        result.current.setSeparator('space' as Separator);
      });
      
      await waitFor(() => {
        expect(result.current.state.value).toContain(' ');
        expect(result.current.state.value).not.toContain('-');
      });
    });
  });
});
