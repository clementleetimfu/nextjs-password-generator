import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCredentialHistory } from '@/hooks/use-credential-history';
import { HISTORY_STORAGE_KEY, HISTORY } from '@/constants';

describe('useCredentialHistory hook', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('initialization', () => {
    it('initializes with empty history for all types', () => {
      const { result } = renderHook(() => useCredentialHistory());
      expect(result.current.history).toEqual({
        password: [],
        pin: [],
        passphrase: [],
      });
    });

    it('loads history from localStorage on mount', () => {
      const storedHistory = {
        password: [{ value: 'abc123', type: 'password' as const, timestamp: Date.now() }],
        pin: [],
        passphrase: [],
      };
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(storedHistory));

      const { result } = renderHook(() => useCredentialHistory());
      expect(result.current.history.password).toHaveLength(1);
      expect(result.current.history.password[0].value).toBe('abc123');
    });

    it('handles localStorage parse errors gracefully', () => {
      localStorage.setItem(HISTORY_STORAGE_KEY, 'invalid json');

      const { result } = renderHook(() => useCredentialHistory());
      expect(result.current.history).toEqual({
        password: [],
        pin: [],
        passphrase: [],
      });
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('addToHistory', () => {
    it('adds item to password history', () => {
      const { result } = renderHook(() => useCredentialHistory());

      act(() => {
        result.current.addToHistory('newPassword', 'password');
      });

      expect(result.current.history.password).toHaveLength(1);
      expect(result.current.history.password[0].value).toBe('newPassword');
      expect(result.current.history.password[0].type).toBe('password');
      expect(result.current.history.password[0].timestamp).toBeGreaterThan(0);
    });

    it('adds item to pin history', () => {
      const { result } = renderHook(() => useCredentialHistory());

      act(() => {
        result.current.addToHistory('123456', 'pin');
      });

      expect(result.current.history.pin).toHaveLength(1);
      expect(result.current.history.pin[0].value).toBe('123456');
      expect(result.current.history.pin[0].type).toBe('pin');
    });

    it('adds item to passphrase history', () => {
      const { result } = renderHook(() => useCredentialHistory());

      act(() => {
        result.current.addToHistory('word1-word2-word3-word4', 'passphrase');
      });

      expect(result.current.history.passphrase).toHaveLength(1);
      expect(result.current.history.passphrase[0].value).toBe('word1-word2-word3-word4');
      expect(result.current.history.passphrase[0].type).toBe('passphrase');
    });

    it('prepends new items to history (most recent first)', () => {
      const { result } = renderHook(() => useCredentialHistory());

      act(() => {
        result.current.addToHistory('first', 'password');
      });
      act(() => {
        result.current.addToHistory('second', 'password');
      });

      expect(result.current.history.password[0].value).toBe('second');
      expect(result.current.history.password[1].value).toBe('first');
    });

    it('limits history to MAX_ITEMS', () => {
      const { result } = renderHook(() => useCredentialHistory());

      for (let i = 0; i < HISTORY.MAX_ITEMS + 5; i++) {
        act(() => {
          result.current.addToHistory(`password${i}`, 'password');
        });
      }

      expect(result.current.history.password).toHaveLength(HISTORY.MAX_ITEMS);
    });

    it('saves to localStorage when adding item', () => {
      const { result } = renderHook(() => useCredentialHistory());
      const setItemSpy = vi.spyOn(Storage.prototype, 'setItem');

      act(() => {
        result.current.addToHistory('test', 'password');
      });

      expect(setItemSpy).toHaveBeenCalledWith(HISTORY_STORAGE_KEY, expect.stringContaining('test'));
    });

    it('handles localStorage save errors gracefully', () => {
      vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('Storage quota exceeded');
      });
      const { result } = renderHook(() => useCredentialHistory());

      act(() => {
        result.current.addToHistory('test', 'password');
      });

      expect(result.current.history.password).toHaveLength(1);
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('clearHistory', () => {
    it('clears password history only', () => {
      const { result } = renderHook(() => useCredentialHistory());

      act(() => {
        result.current.addToHistory('pass1', 'password');
        result.current.addToHistory('123456', 'pin');
        result.current.addToHistory('word1-word2', 'passphrase');
      });

      act(() => {
        result.current.clearHistory('password');
      });

      expect(result.current.history.password).toHaveLength(0);
      expect(result.current.history.pin).toHaveLength(1);
      expect(result.current.history.passphrase).toHaveLength(1);
    });

    it('clears pin history only', () => {
      const { result } = renderHook(() => useCredentialHistory());

      act(() => {
        result.current.addToHistory('pass1', 'password');
        result.current.addToHistory('123456', 'pin');
        result.current.addToHistory('word1-word2', 'passphrase');
      });

      act(() => {
        result.current.clearHistory('pin');
      });

      expect(result.current.history.password).toHaveLength(1);
      expect(result.current.history.pin).toHaveLength(0);
      expect(result.current.history.passphrase).toHaveLength(1);
    });

    it('clears passphrase history only', () => {
      const { result } = renderHook(() => useCredentialHistory());

      act(() => {
        result.current.addToHistory('pass1', 'password');
        result.current.addToHistory('123456', 'pin');
        result.current.addToHistory('word1-word2', 'passphrase');
      });

      act(() => {
        result.current.clearHistory('passphrase');
      });

      expect(result.current.history.password).toHaveLength(1);
      expect(result.current.history.pin).toHaveLength(1);
      expect(result.current.history.passphrase).toHaveLength(0);
    });

    it('saves to localStorage when clearing history', () => {
      const { result } = renderHook(() => useCredentialHistory());
      const setItemSpy = vi.spyOn(Storage.prototype, 'setItem');

      act(() => {
        result.current.addToHistory('test', 'password');
      });
      setItemSpy.mockClear();

      act(() => {
        result.current.clearHistory('password');
      });

      expect(setItemSpy).toHaveBeenCalledWith(HISTORY_STORAGE_KEY, expect.any(String));
    });

    it('handles localStorage save errors gracefully when clearing', () => {
      vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('Storage error');
      });
      const { result } = renderHook(() => useCredentialHistory());

      act(() => {
        result.current.addToHistory('test', 'password');
      });
      act(() => {
        result.current.clearHistory('password');
      });

      expect(result.current.history.password).toHaveLength(0);
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('clearAllHistory', () => {
    it('clears all history types', () => {
      const { result } = renderHook(() => useCredentialHistory());

      act(() => {
        result.current.addToHistory('pass1', 'password');
        result.current.addToHistory('123456', 'pin');
        result.current.addToHistory('word1-word2', 'passphrase');
      });

      act(() => {
        result.current.clearAllHistory();
      });

      expect(result.current.history.password).toHaveLength(0);
      expect(result.current.history.pin).toHaveLength(0);
      expect(result.current.history.passphrase).toHaveLength(0);
    });

    it('saves to localStorage when clearing all history', () => {
      const { result } = renderHook(() => useCredentialHistory());
      const setItemSpy = vi.spyOn(Storage.prototype, 'setItem');

      act(() => {
        result.current.addToHistory('test', 'password');
      });
      setItemSpy.mockClear();

      act(() => {
        result.current.clearAllHistory();
      });

      expect(setItemSpy).toHaveBeenCalledWith(HISTORY_STORAGE_KEY, expect.any(String));
    });

    it('handles localStorage save errors gracefully when clearing all', () => {
      vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('Storage error');
      });
      const { result } = renderHook(() => useCredentialHistory());

      act(() => {
        result.current.addToHistory('test', 'password');
      });
      act(() => {
        result.current.clearAllHistory();
      });

      expect(result.current.history.password).toHaveLength(0);
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('localStorage persistence', () => {
    it('persists history across hook instances', () => {
      const { result: result1, unmount: unmount1 } = renderHook(() => useCredentialHistory());

      act(() => {
        result1.current.addToHistory('persistent', 'password');
      });

      unmount1();

      const { result: result2 } = renderHook(() => useCredentialHistory());
      expect(result2.current.history.password).toHaveLength(1);
      expect(result2.current.history.password[0].value).toBe('persistent');
    });
  });

  describe('rapid operations', () => {
    it('handles rapid addToHistory calls', () => {
      const { result } = renderHook(() => useCredentialHistory());

      for (let i = 0; i < 10; i++) {
        act(() => {
          result.current.addToHistory(`password${i}`, 'password');
        });
      }

      expect(result.current.history.password).toHaveLength(10);
    });
  });
});
