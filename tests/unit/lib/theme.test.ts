import { describe, it, expect, beforeEach } from 'vitest';
import { STORAGE_KEYS } from '@/lib/theme';

describe('theme library', () => {
  beforeEach(() => localStorage.clear());

  it('exports storage key constant', () => {
    expect(STORAGE_KEYS.THEME).toBe('password-generator-theme');
  });

  it('can store and read theme via key', () => {
    localStorage.setItem(STORAGE_KEYS.THEME, 'dark');
    expect(localStorage.getItem(STORAGE_KEYS.THEME)).toBe('dark');
  });

  it('can clear theme via key', () => {
    localStorage.setItem(STORAGE_KEYS.THEME, 'light');
    localStorage.removeItem(STORAGE_KEYS.THEME);
    expect(localStorage.getItem(STORAGE_KEYS.THEME)).toBeNull();
  });
});
