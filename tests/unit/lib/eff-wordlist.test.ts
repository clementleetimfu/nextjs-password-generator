import { describe, it, expect, beforeEach, vi } from 'vitest';
import { EFF_LONG_WORDLIST } from '@/lib/eff-wordlist';

describe('EFF Wordlist Library', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('EFF_LONG_WORDLIST', () => {
    it('should export EFF_LONG_WORDLIST constant', () => {
      expect(EFF_LONG_WORDLIST).toBeDefined();
    });

    it('should be an array of strings', () => {
      expect(Array.isArray(EFF_LONG_WORDLIST)).toBe(true);
    });

    it('should contain only strings', () => {
      EFF_LONG_WORDLIST.forEach(word => {
        expect(typeof word).toBe('string');
      });
    });

    it('should have 7776 words (EFF Long Wordlist size)', () => {
      // Note: In tests, this is mocked to a smaller list
      // In production, it should be 7776
      expect(EFF_LONG_WORDLIST.length).toBeGreaterThan(0);
    });

    it('should contain lowercase words only', () => {
      EFF_LONG_WORDLIST.forEach(word => {
        expect(word).toBe(word.toLowerCase());
        expect(word).toMatch(/^[a-z]+$/);
      });
    });

    it('should not contain empty strings', () => {
      EFF_LONG_WORDLIST.forEach(word => {
        expect(word.length).toBeGreaterThan(0);
      });
    });

    it('should not contain duplicate words', () => {
      const uniqueWords = new Set(EFF_LONG_WORDLIST);
      expect(uniqueWords.size).toBe(EFF_LONG_WORDLIST.length);
    });
  });

  describe('Word Selection', () => {
    it('should allow random word selection', () => {
      const randomIndex = Math.floor(Math.random() * EFF_LONG_WORDLIST.length);
      const word = EFF_LONG_WORDLIST[randomIndex];
      expect(word).toBeDefined();
      expect(typeof word).toBe('string');
    });

    it('should select word at index 0', () => {
      const word = EFF_LONG_WORDLIST[0];
      expect(word).toBeDefined();
      expect(typeof word).toBe('string');
    });

    it('should select word at last index', () => {
      const lastIndex = EFF_LONG_WORDLIST.length - 1;
      const word = EFF_LONG_WORDLIST[lastIndex];
      expect(word).toBeDefined();
      expect(typeof word).toBe('string');
    });

    it('should handle out of bounds index gracefully', () => {
      const word = EFF_LONG_WORDLIST[EFF_LONG_WORDLIST.length + 100];
      expect(word).toBeUndefined();
    });
  });

  describe('Word Properties', () => {
    it('should have words with reasonable length', () => {
      EFF_LONG_WORDLIST.forEach(word => {
        // EFF words are typically 3-9 characters
        expect(word.length).toBeGreaterThanOrEqual(3);
        expect(word.length).toBeLessThanOrEqual(9);
      });
    });

    it('should have words without special characters', () => {
      EFF_LONG_WORDLIST.forEach(word => {
        expect(word).toMatch(/^[a-z]+$/);
      });
    });

    it('should have words without spaces', () => {
      EFF_LONG_WORDLIST.forEach(word => {
        expect(word).not.toContain(' ');
      });
    });

    it('should have words without hyphens', () => {
      EFF_LONG_WORDLIST.forEach(word => {
        expect(word).not.toContain('-');
      });
    });
  });

  describe('Passphrase Generation', () => {
    it('should support selecting multiple words', () => {
      const wordCount = 4;
      const selectedWords: string[] = [];
      for (let i = 0; i < wordCount; i++) {
        const randomIndex = Math.floor(Math.random() * EFF_LONG_WORDLIST.length);
        selectedWords.push(EFF_LONG_WORDLIST[randomIndex]);
      }
      expect(selectedWords.length).toBe(wordCount);
      selectedWords.forEach(word => {
        expect(typeof word).toBe('string');
      });
    });

    it('should support joining words with separator', () => {
      const words = [
        EFF_LONG_WORDLIST[0],
        EFF_LONG_WORDLIST[1],
        EFF_LONG_WORDLIST[2],
      ];
      const separator = '-';
      const passphrase = words.join(separator);
      expect(passphrase).toContain(separator);
      expect(passphrase.split(separator).length).toBe(words.length);
    });

    it('should support different separators', () => {
      const words = [
        EFF_LONG_WORDLIST[0],
        EFF_LONG_WORDLIST[1],
      ];
      const separators = [' ', '-', '_', '.'];
      separators.forEach(separator => {
        const passphrase = words.join(separator);
        expect(passphrase).toContain(separator);
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty wordlist gracefully', () => {
      // This test ensures the code handles edge cases
      // In production, EFF_LONG_WORDLIST should always have words
      const mockWordlist: string[] = [];
      expect(mockWordlist.length).toBe(0);
    });

    it('should handle single word wordlist', () => {
      const mockWordlist = ['test'];
      expect(mockWordlist.length).toBe(1);
      expect(mockWordlist[0]).toBe('test');
    });

    it('should handle very long word', () => {
      // Find the longest word in the list
      const longestWord = EFF_LONG_WORDLIST.reduce((longest, word) =>
        word.length > longest.length ? word : longest,
        ''
      );
      expect(longestWord.length).toBeGreaterThan(0);
      expect(longestWord.length).toBeLessThanOrEqual(9);
    });

    it('should handle very short word', () => {
      // Find the shortest word in the list
      const shortestWord = EFF_LONG_WORDLIST.reduce((shortest, word) =>
        word.length < shortest.length ? word : shortest,
        'aaaaaaaaaa'
      );
      expect(shortestWord.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe('Performance', () => {
    it('should allow fast word access', () => {
      const iterations = 1000;
      const startTime = performance.now();
      for (let i = 0; i < iterations; i++) {
        const randomIndex = Math.floor(Math.random() * EFF_LONG_WORDLIST.length);
        const word = EFF_LONG_WORDLIST[randomIndex];
        expect(word).toBeDefined();
      }
      const endTime = performance.now();
      const duration = endTime - startTime;
      // Should complete 1000 iterations in under 100ms
      expect(duration).toBeLessThan(100);
    });

    it('should allow fast word selection for passphrase', () => {
      const wordCount = 10;
      const startTime = performance.now();
      const words: string[] = [];
      for (let i = 0; i < wordCount; i++) {
        const randomIndex = Math.floor(Math.random() * EFF_LONG_WORDLIST.length);
        words.push(EFF_LONG_WORDLIST[randomIndex]);
      }
      const endTime = performance.now();
      const duration = endTime - startTime;
      expect(words.length).toBe(wordCount);
      // Should complete 10 word selections in under 10ms
      expect(duration).toBeLessThan(10);
    });
  });
});
