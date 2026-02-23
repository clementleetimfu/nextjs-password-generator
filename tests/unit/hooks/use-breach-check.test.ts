import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useBreachCheck } from '@/hooks/use-breach-check';
import { checkBreach } from '@/lib/breach-check';

// Mock the breach check function
vi.mock('@/lib/breach-check', async () => {
  const actual = await vi.importActual<typeof import('@/lib/breach-check')>('@/lib/breach-check');
  return {
    ...actual,
    checkBreach: vi.fn(),
  };
});

describe('useBreachCheck Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Setup default mock returns
    vi.mocked(checkBreach).mockResolvedValue({
      status: 'safe',
      count: undefined,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Initial State', () => {
    it('should initialize with idle status', () => {
      const { result } = renderHook(() => useBreachCheck());
      
      expect(result.current.status).toBe('idle');
      expect(result.current.count).toBeUndefined();
      expect(result.current.error).toBeUndefined();
    });
  });

  describe('performBreachCheck Function', () => {
    it('should set status to checking when breach check starts', async () => {
      const { result } = renderHook(() => useBreachCheck());
      
      vi.mocked(checkBreach).mockImplementation(
        () => new Promise(resolve => {
          setTimeout(() => resolve({ status: 'safe', count: undefined }), 100);
        })
      );
      
      act(() => {
        result.current.performBreachCheck('password123');
      });
      
      expect(result.current.status).toBe('checking');
      expect(result.current.count).toBeUndefined();
      expect(result.current.error).toBeUndefined();
    });

    it('should return safe status when password is not breached', async () => {
      const { result } = renderHook(() => useBreachCheck());
      
      vi.mocked(checkBreach).mockResolvedValue({
        status: 'safe',
        count: undefined,
      });
      
      let breachResult;
      await act(async () => {
        breachResult = await result.current.performBreachCheck('password123');
      });
      
      expect(result.current.status).toBe('safe');
      expect(result.current.count).toBeUndefined();
      expect(result.current.error).toBeUndefined();
      expect(breachResult).toEqual({
        status: 'safe',
        count: undefined,
        error: undefined,
      });
    });

    it('should return breached status with count when password is found', async () => {
      const { result } = renderHook(() => useBreachCheck());
      
      vi.mocked(checkBreach).mockResolvedValue({
        status: 'breached',
        count: 42,
      });
      
      let breachResult;
      await act(async () => {
        breachResult = await result.current.performBreachCheck('password123');
      });
      
      expect(result.current.status).toBe('breached');
      expect(result.current.count).toBe(42);
      expect(result.current.error).toBeUndefined();
      expect(breachResult).toEqual({
        status: 'breached',
        count: 42,
        error: undefined,
      });
    });

    it('should return error status when check fails', async () => {
      const { result } = renderHook(() => useBreachCheck());
      
      vi.mocked(checkBreach).mockResolvedValue({
        status: 'error',
        error: 'Network error',
      });
      
      let breachResult;
      await act(async () => {
        breachResult = await result.current.performBreachCheck('password123');
      });
      
      expect(result.current.status).toBe('error');
      expect(result.current.count).toBeUndefined();
      expect(result.current.error).toBe('Network error');
      expect(breachResult).toEqual({
        status: 'error',
        error: 'Network error',
      });
    });

    it('should handle unexpected errors gracefully', async () => {
      const { result } = renderHook(() => useBreachCheck());
      
      vi.mocked(checkBreach).mockRejectedValue(new Error('Unexpected error'));
      
      let breachResult;
      await act(async () => {
        breachResult = await result.current.performBreachCheck('password123');
      });
      
      expect(result.current.status).toBe('error');
      expect(result.current.error).toBe('Unexpected error');
      expect(breachResult).toEqual({
        status: 'error',
        error: 'Unexpected error',
      });
    });

    it('should pass password to checkBreach function', async () => {
      const { result } = renderHook(() => useBreachCheck());
      
      vi.mocked(checkBreach).mockResolvedValue({
        status: 'safe',
        count: undefined,
      });
      
      await act(async () => {
        await result.current.performBreachCheck('testPassword');
      });
      
      expect(checkBreach).toHaveBeenCalledWith('testPassword');
    });
  });

  describe('reset Function', () => {
    it('should reset status to idle', async () => {
      const { result } = renderHook(() => useBreachCheck());
      
      vi.mocked(checkBreach).mockResolvedValue({
        status: 'breached',
        count: 10,
      });
      
      await act(async () => {
        await result.current.performBreachCheck('password123');
      });
      
      expect(result.current.status).toBe('breached');
      
      act(() => {
        result.current.reset();
      });
      
      expect(result.current.status).toBe('idle');
      expect(result.current.count).toBeUndefined();
      expect(result.current.error).toBeUndefined();
    });

    it('should reset after error', async () => {
      const { result } = renderHook(() => useBreachCheck());
      
      vi.mocked(checkBreach).mockResolvedValue({
        status: 'error',
        error: 'Network error',
      });
      
      await act(async () => {
        await result.current.performBreachCheck('password123');
      });
      
      expect(result.current.status).toBe('error');
      
      act(() => {
        result.current.reset();
      });
      
      expect(result.current.status).toBe('idle');
      expect(result.current.count).toBeUndefined();
      expect(result.current.error).toBeUndefined();
    });

    it('should reset after safe check', async () => {
      const { result } = renderHook(() => useBreachCheck());
      
      vi.mocked(checkBreach).mockResolvedValue({
        status: 'safe',
        count: undefined,
      });
      
      await act(async () => {
        await result.current.performBreachCheck('password123');
      });
      
      expect(result.current.status).toBe('safe');
      
      act(() => {
        result.current.reset();
      });
      
      expect(result.current.status).toBe('idle');
      expect(result.current.count).toBeUndefined();
      expect(result.current.error).toBeUndefined();
    });
  });

  describe('State Transitions', () => {
    it('should transition from checking to safe', async () => {
      const { result } = renderHook(() => useBreachCheck());
      
      vi.mocked(checkBreach).mockResolvedValue({
        status: 'safe',
        count: undefined,
      });
      
      act(() => {
        result.current.performBreachCheck('password123');
      });
      
      expect(result.current.status).toBe('checking');
      
      await waitFor(() => {
        expect(result.current.status).toBe('safe');
      });
    });

    it('should transition from checking to breached', async () => {
      const { result } = renderHook(() => useBreachCheck());
      
      vi.mocked(checkBreach).mockResolvedValue({
        status: 'breached',
        count: 100,
      });
      
      act(() => {
        result.current.performBreachCheck('password123');
      });
      
      expect(result.current.status).toBe('checking');
      
      await waitFor(() => {
        expect(result.current.status).toBe('breached');
        expect(result.current.count).toBe(100);
      });
    });

    it('should transition from checking to error', async () => {
      const { result } = renderHook(() => useBreachCheck());
      
      vi.mocked(checkBreach).mockResolvedValue({
        status: 'error',
        error: 'API error',
      });
      
      act(() => {
        result.current.performBreachCheck('password123');
      });
      
      expect(result.current.status).toBe('checking');
      
      await waitFor(() => {
        expect(result.current.status).toBe('error');
        expect(result.current.error).toBe('API error');
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty password', async () => {
      const { result } = renderHook(() => useBreachCheck());
      
      vi.mocked(checkBreach).mockResolvedValue({
        status: 'error',
        error: 'Password cannot be empty',
      });
      
      await act(async () => {
        await result.current.performBreachCheck('');
      });
      
      expect(result.current.status).toBe('error');
      expect(result.current.error).toBe('Password cannot be empty');
    });

    it('should handle very large breach count', async () => {
      const { result } = renderHook(() => useBreachCheck());
      
      vi.mocked(checkBreach).mockResolvedValue({
        status: 'breached',
        count: 999999999,
      });
      
      await act(async () => {
        await result.current.performBreachCheck('password123');
      });
      
      expect(result.current.status).toBe('breached');
      expect(result.current.count).toBe(999999999);
    });

    it('should handle zero breach count', async () => {
      const { result } = renderHook(() => useBreachCheck());
      
      vi.mocked(checkBreach).mockResolvedValue({
        status: 'safe',
        count: 0,
      });
      
      await act(async () => {
        await result.current.performBreachCheck('password123');
      });
      
      expect(result.current.status).toBe('safe');
      expect(result.current.count).toBe(0);
    });

    it('should handle concurrent breach checks', async () => {
      const { result } = renderHook(() => useBreachCheck());
      
      let checkCount = 0;
      vi.mocked(checkBreach).mockImplementation(() => {
        checkCount++;
        return Promise.resolve({
          status: 'safe',
          count: undefined,
        });
      });
      
      await act(async () => {
        await Promise.all([
          result.current.performBreachCheck('password1'),
          result.current.performBreachCheck('password2'),
          result.current.performBreachCheck('password3'),
        ]);
      });
      
      expect(checkCount).toBe(3);
    });
  });

  describe('Error Handling', () => {
    it('should handle Error objects', async () => {
      const { result } = renderHook(() => useBreachCheck());
      
      vi.mocked(checkBreach).mockRejectedValue(new Error('Test error'));
      
      await act(async () => {
        await result.current.performBreachCheck('password123');
      });
      
      expect(result.current.status).toBe('error');
      expect(result.current.error).toBe('Test error');
    });

    it('should handle non-Error objects', async () => {
      const { result } = renderHook(() => useBreachCheck());
      
      vi.mocked(checkBreach).mockRejectedValue('String error');
      
      await act(async () => {
        await result.current.performBreachCheck('password123');
      });
      
      expect(result.current.status).toBe('error');
      expect(result.current.error).toBe('Unknown error occurred');
    });

    it('should handle null errors', async () => {
      const { result } = renderHook(() => useBreachCheck());
      
      vi.mocked(checkBreach).mockRejectedValue(null);
      
      await act(async () => {
        await result.current.performBreachCheck('password123');
      });
      
      expect(result.current.status).toBe('error');
      expect(result.current.error).toBe('Unknown error occurred');
    });
  });

  describe('Multiple Checks', () => {
    it('should handle multiple sequential checks', async () => {
      const { result } = renderHook(() => useBreachCheck());
      
      vi.mocked(checkBreach)
        .mockResolvedValueOnce({ status: 'safe', count: undefined })
        .mockResolvedValueOnce({ status: 'breached', count: 5 })
        .mockResolvedValueOnce({ status: 'safe', count: undefined });
      
      await act(async () => {
        await result.current.performBreachCheck('password1');
      });
      expect(result.current.status).toBe('safe');
      
      await act(async () => {
        await result.current.performBreachCheck('password2');
      });
      expect(result.current.status).toBe('breached');
      expect(result.current.count).toBe(5);
      
      await act(async () => {
        await result.current.performBreachCheck('password3');
      });
      expect(result.current.status).toBe('safe');
    });
  });
});


