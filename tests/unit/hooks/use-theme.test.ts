import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTheme } from '@/hooks/use-theme';
import { STORAGE_KEYS } from '@/lib/theme';

describe('useTheme hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    document.documentElement.classList.remove('dark');
  });

  it('defaults to light mode', () => {
    const { result } = renderHook(() => useTheme());
    expect(result.current.mode).toBe('light');
  });

  it('loads persisted mode from localStorage', () => {
    localStorage.setItem(STORAGE_KEYS.THEME, 'dark');
    const { result } = renderHook(() => useTheme());
    expect(result.current.mode).toBe('dark');
  });

  it('setMode updates mode, storage, and class', () => {
    const { result } = renderHook(() => useTheme());

    act(() => {
      result.current.setMode('dark');
    });

    expect(result.current.mode).toBe('dark');
    expect(localStorage.getItem(STORAGE_KEYS.THEME)).toBe('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('toggle flips between light and dark', () => {
    const { result } = renderHook(() => useTheme());

    act(() => {
      result.current.toggle();
    });
    expect(result.current.mode).toBe('dark');

    act(() => {
      result.current.toggle();
    });
    expect(result.current.mode).toBe('light');
  });
});
