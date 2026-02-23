import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useTheme } from '@/hooks/use-theme';
import type { ThemeMode } from '@/types/generator';

describe('useTheme Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock localStorage
    const localStorageMock = (() => {
      let store: Record<string, string> = {};
      return {
        getItem: (key: string) => store[key] || null,
        setItem: (key: string, value: string) => {
          store[key] = value.toString();
        },
        removeItem: (key: string) => {
          delete store[key];
        },
        clear: () => {
          store = {};
        },
      };
    })();
    
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true,
    });
    
    // Mock document.documentElement
    Object.defineProperty(document.documentElement, 'classList', {
      value: {
        toggle: vi.fn(),
        add: vi.fn(),
        remove: vi.fn(),
        contains: vi.fn(),
      },
      writable: true,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  describe('Initial State', () => {
    it('should initialize with light mode as default', () => {
      const { result } = renderHook(() => useTheme());
      
      expect(result.current.mode).toBe('light');
    });

    it('should load theme from localStorage if available', async () => {
      localStorage.setItem('theme', 'dark');
      
      const { result } = renderHook(() => useTheme());
      
      await waitFor(() => {
        expect(result.current.mode).toBe('dark');
      });
    });

    it('should apply dark class to document when loading dark theme from localStorage', async () => {
      localStorage.setItem('theme', 'dark');
      
      renderHook(() => useTheme());
      
      await waitFor(() => {
        expect(document.documentElement.classList.toggle).toHaveBeenCalledWith('dark', true);
      });
    });

    it('should not apply dark class when loading light theme from localStorage', async () => {
      localStorage.setItem('theme', 'light');
      
      renderHook(() => useTheme());
      
      await waitFor(() => {
        expect(document.documentElement.classList.toggle).toHaveBeenCalledWith('dark', false);
      });
    });

    it('should handle invalid theme in localStorage', async () => {
      localStorage.setItem('theme', 'invalid');
      
      const { result } = renderHook(() => useTheme());
      
      await waitFor(() => {
        // Should fall back to default light mode
        expect(result.current.mode).toBe('light');
      });
    });
  });

  describe('setMode Function', () => {
    it('should set mode to dark', async () => {
      const { result } = renderHook(() => useTheme());
      
      act(() => {
        result.current.setMode('dark');
      });
      
      expect(result.current.mode).toBe('dark');
    });

    it('should set mode to light', async () => {
      const { result } = renderHook(() => useTheme());
      
      act(() => {
        result.current.setMode('dark');
      });
      
      expect(result.current.mode).toBe('dark');
      
      act(() => {
        result.current.setMode('light');
      });
      
      expect(result.current.mode).toBe('light');
    });

    it('should save theme to localStorage', async () => {
      const { result } = renderHook(() => useTheme());
      
      act(() => {
        result.current.setMode('dark');
      });
      
      expect(localStorage.getItem('theme')).toBe('dark');
    });

    it('should apply dark class to document when setting dark mode', async () => {
      const { result } = renderHook(() => useTheme());
      
      act(() => {
        result.current.setMode('dark');
      });
      
      expect(document.documentElement.classList.toggle).toHaveBeenCalledWith('dark', true);
    });

    it('should remove dark class from document when setting light mode', async () => {
      const { result } = renderHook(() => useTheme());
      
      act(() => {
        result.current.setMode('dark');
      });
      
      act(() => {
        result.current.setMode('light');
      });
      
      expect(document.documentElement.classList.toggle).toHaveBeenCalledWith('dark', false);
    });

    it('should handle localStorage errors gracefully', async () => {
      const { result } = renderHook(() => useTheme());
      
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      // Mock localStorage to throw error
      const originalSetItem = localStorage.setItem;
      localStorage.setItem = vi.fn(() => {
        throw new Error('Storage quota exceeded');
      });
      
      act(() => {
        result.current.setMode('dark');
      });
      
      // Should still update state even if localStorage fails
      expect(result.current.mode).toBe('dark');
      expect(consoleSpy).toHaveBeenCalled();
      
      // Restore
      localStorage.setItem = originalSetItem;
      consoleSpy.mockRestore();
    });
  });

  describe('toggle Function', () => {
    it('should toggle from light to dark', async () => {
      const { result } = renderHook(() => useTheme());
      
      expect(result.current.mode).toBe('light');
      
      act(() => {
        result.current.toggle();
      });
      
      expect(result.current.mode).toBe('dark');
    });

    it('should toggle from dark to light', async () => {
      const { result } = renderHook(() => useTheme());
      
      act(() => {
        result.current.setMode('dark');
      });
      
      expect(result.current.mode).toBe('dark');
      
      act(() => {
        result.current.toggle();
      });
      
      expect(result.current.mode).toBe('light');
    });

    it('should save toggled theme to localStorage', async () => {
      const { result } = renderHook(() => useTheme());
      
      act(() => {
        result.current.toggle();
      });
      
      expect(localStorage.getItem('theme')).toBe('dark');
    });

    it('should apply correct class when toggling to dark', async () => {
      const { result } = renderHook(() => useTheme());
      
      act(() => {
        result.current.toggle();
      });
      
      expect(document.documentElement.classList.toggle).toHaveBeenCalledWith('dark', true);
    });

    it('should apply correct class when toggling to light', async () => {
      const { result } = renderHook(() => useTheme());
      
      act(() => {
        result.current.setMode('dark');
      });
      
      act(() => {
        result.current.toggle();
      });
      
      expect(document.documentElement.classList.toggle).toHaveBeenCalledWith('dark', false);
    });
  });

  describe('State Persistence', () => {
    it('should persist theme across re-renders', async () => {
      const { result, rerender } = renderHook(() => useTheme());
      
      act(() => {
        result.current.setMode('dark');
      });
      
      expect(result.current.mode).toBe('dark');
      
      rerender();
      
      expect(result.current.mode).toBe('dark');
    });

    it('should load saved theme on subsequent renders', async () => {
      localStorage.setItem('theme', 'dark');
      
      const { result } = renderHook(() => useTheme());
      
      await waitFor(() => {
        expect(result.current.mode).toBe('dark');
      });
    });
  });

  describe('Multiple Toggles', () => {
    it('should handle multiple rapid toggles', async () => {
      const { result } = renderHook(() => useTheme());
      
      act(() => {
        result.current.toggle();
      });
      expect(result.current.mode).toBe('dark');
      
      act(() => {
        result.current.toggle();
      });
      expect(result.current.mode).toBe('light');
      
      act(() => {
        result.current.toggle();
      });
      expect(result.current.mode).toBe('dark');
      
      act(() => {
        result.current.toggle();
      });
      expect(result.current.mode).toBe('light');
    });

    it('should save final theme after multiple toggles', async () => {
      const { result } = renderHook(() => useTheme());
      
      act(() => {
        result.current.toggle();
        result.current.toggle();
        result.current.toggle();
      });
      
      expect(result.current.mode).toBe('dark');
      expect(localStorage.getItem('theme')).toBe('dark');
    });
  });

  describe('Edge Cases', () => {
    it('should handle localStorage being unavailable', async () => {
      // Mock localStorage to be undefined
      const originalLocalStorage = window.localStorage;
      Object.defineProperty(window, 'localStorage', {
        value: undefined,
        writable: true,
      });
      
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      const { result } = renderHook(() => useTheme());
      
      await waitFor(() => {
        // Should still work with default theme
        expect(result.current.mode).toBe('light');
      });
      
      // Restore
      Object.defineProperty(window, 'localStorage', {
        value: originalLocalStorage,
        writable: true,
      });
      consoleSpy.mockRestore();
    });

    it('should handle corrupted localStorage data', async () => {
      localStorage.setItem('theme', 'corrupted-data');
      
      const { result } = renderHook(() => useTheme());
      
      await waitFor(() => {
        // Should fall back to default
        expect(result.current.mode).toBe('light');
      });
    });

    it('should handle document.classList being unavailable', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      const originalToggle = document.documentElement.classList.toggle;
      document.documentElement.classList.toggle = vi.fn(() => {
        throw new Error('DOM error');
      });
      
      const { result } = renderHook(() => useTheme());
      
      act(() => {
        result.current.setMode('dark');
      });
      
      // Should still update state
      expect(result.current.mode).toBe('dark');
      expect(consoleSpy).toHaveBeenCalled();
      
      // Restore
      document.documentElement.classList.toggle = originalToggle;
      consoleSpy.mockRestore();
    });
  });

  describe('Theme Mode Types', () => {
    it('should accept light mode', async () => {
      const { result } = renderHook(() => useTheme());
      
      act(() => {
        result.current.setMode('light' as ThemeMode);
      });
      
      expect(result.current.mode).toBe('light');
    });

    it('should accept dark mode', async () => {
      const { result } = renderHook(() => useTheme());
      
      act(() => {
        result.current.setMode('dark' as ThemeMode);
      });
      
      expect(result.current.mode).toBe('dark');
    });
  });

  describe('Integration with Document', () => {
    it('should update document class on theme change', async () => {
      const { result } = renderHook(() => useTheme());
      
      act(() => {
        result.current.setMode('dark');
      });
      
      expect(document.documentElement.classList.toggle).toHaveBeenCalledWith('dark', true);
      
      act(() => {
        result.current.setMode('light');
      });
      
      expect(document.documentElement.classList.toggle).toHaveBeenCalledWith('dark', false);
    });

    it('should only toggle dark class, not remove other classes', async () => {
      const { result } = renderHook(() => useTheme());
      
      act(() => {
        result.current.setMode('dark');
      });
      
      expect(document.documentElement.classList.toggle).toHaveBeenCalledWith('dark', true);
      expect(document.documentElement.classList.toggle).toHaveBeenCalledTimes(1);
    });
  });
});
