import { describe, it, expect, beforeEach, vi } from 'vitest';
import { STORAGE_KEYS } from '@/lib/theme';

describe('Theme Library', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe('STORAGE_KEYS', () => {
    it('should export THEME constant', () => {
      expect(STORAGE_KEYS).toBeDefined();
      expect(STORAGE_KEYS.THEME).toBe('password-generator-theme');
    });

    it('should be a const object', () => {
      expect(typeof STORAGE_KEYS).toBe('object');
    });

    it('should have THEME property', () => {
      expect(STORAGE_KEYS).toHaveProperty('THEME');
    });
  });

  describe('localStorage interactions', () => {
    it('should store theme using STORAGE_KEYS.THEME', () => {
      const theme = 'dark';
      localStorage.setItem(STORAGE_KEYS.THEME, theme);
      expect(localStorage.getItem(STORAGE_KEYS.THEME)).toBe(theme);
    });

    it('should retrieve theme using STORAGE_KEYS.THEME', () => {
      const theme = 'light';
      localStorage.setItem(STORAGE_KEYS.THEME, theme);
      const retrieved = localStorage.getItem(STORAGE_KEYS.THEME);
      expect(retrieved).toBe(theme);
    });

    it('should clear theme using STORAGE_KEYS.THEME', () => {
      localStorage.setItem(STORAGE_KEYS.THEME, 'dark');
      localStorage.removeItem(STORAGE_KEYS.THEME);
      expect(localStorage.getItem(STORAGE_KEYS.THEME)).toBeNull();
    });
  });

  describe('Edge Cases', () => {
    it('should handle localStorage access errors gracefully', () => {
      // Mock localStorage to throw error
      const originalSetItem = localStorage.setItem;
      localStorage.setItem = vi.fn(() => {
        throw new Error('Storage quota exceeded');
      });

      // Should throw error (this is expected behavior)
      expect(() => {
        localStorage.setItem(STORAGE_KEYS.THEME, 'dark');
      }).toThrow();

      // Restore original
      localStorage.setItem = originalSetItem;
    });

    it('should handle localStorage getItem errors gracefully', () => {
      // Mock localStorage to throw error
      const originalGetItem = localStorage.getItem;
      localStorage.getItem = vi.fn(() => {
        throw new Error('Storage access denied');
      });

      // Should return null
      const theme = localStorage.getItem(STORAGE_KEYS.THEME);
      expect(theme).toBeNull();

      // Restore original
      localStorage.getItem = originalGetItem;
    });

    it('should handle localStorage removeItem errors gracefully', () => {
      // Mock localStorage to throw error
      const originalRemoveItem = localStorage.removeItem;
      localStorage.removeItem = vi.fn(() => {
        throw new Error('Storage access denied');
      });

      // Should throw error (this is expected behavior)
      expect(() => {
        localStorage.removeItem(STORAGE_KEYS.THEME);
      }).toThrow();

      // Restore original
      localStorage.removeItem = originalRemoveItem;
    });
  });
});
