import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDesktop } from '@/hooks/use-desktop';

describe('useDesktop hook', () => {
  let matchMediaListeners: Array<(e: MediaQueryListEvent) => void> = [];
  let matchMediaMatches = true;

  const mockMatchMedia = vi.fn((query: string) => ({
    matches: matchMediaMatches,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn((_event: string, listener: (e: MediaQueryListEvent) => void) => {
      matchMediaListeners.push(listener);
    }),
    removeEventListener: vi.fn((_event: string, listener: (e: MediaQueryListEvent) => void) => {
      matchMediaListeners = matchMediaListeners.filter((l) => l !== listener);
    }),
    dispatchEvent: vi.fn(),
  }));

  beforeEach(() => {
    matchMediaListeners = [];
    matchMediaMatches = true;
    vi.clearAllMocks();
    Object.defineProperty(window, 'matchMedia', {
      value: mockMatchMedia,
      writable: true,
      configurable: true,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Initial State', () => {
    it('returns true when window matches desktop breakpoint', () => {
      matchMediaMatches = true;
      const { result } = renderHook(() => useDesktop());
      expect(result.current).toBe(true);
    });

    it('returns false when window does not match desktop breakpoint', () => {
      matchMediaMatches = false;
      const { result } = renderHook(() => useDesktop());
      expect(result.current).toBe(false);
    });

    it('calls matchMedia with correct breakpoint query', () => {
      renderHook(() => useDesktop());
      expect(mockMatchMedia).toHaveBeenCalledWith('(min-width: 1024px)');
    });
  });

  describe('Media Query Changes', () => {
    it('updates state when media query changes to match', () => {
      matchMediaMatches = false;
      const { result } = renderHook(() => useDesktop());
      expect(result.current).toBe(false);

      act(() => {
        matchMediaListeners.forEach((listener) =>
          listener({ matches: true } as MediaQueryListEvent)
        );
      });

      expect(result.current).toBe(true);
    });

    it('updates state when media query changes to not match', () => {
      matchMediaMatches = true;
      const { result } = renderHook(() => useDesktop());
      expect(result.current).toBe(true);

      act(() => {
        matchMediaListeners.forEach((listener) =>
          listener({ matches: false } as MediaQueryListEvent)
        );
      });

      expect(result.current).toBe(false);
    });
  });

  describe('Cleanup', () => {
    it('removes event listener on unmount', () => {
      const { unmount } = renderHook(() => useDesktop());
      const initialListenerCount = matchMediaListeners.length;
      expect(initialListenerCount).toBeGreaterThan(0);

      unmount();

      expect(matchMediaListeners.length).toBe(0);
    });
  });

  describe('SSR Safety', () => {
    it('handles window being defined', () => {
      const { result } = renderHook(() => useDesktop());
      expect(typeof result.current).toBe('boolean');
    });
  });
});
