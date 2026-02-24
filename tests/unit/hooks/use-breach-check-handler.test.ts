import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useBreachCheckHandler } from '@/hooks/use-breach-check-handler';
import { useBreachCheck } from '@/hooks/use-breach-check';

vi.mock('@/hooks/use-breach-check', () => ({
  useBreachCheck: vi.fn(),
}));

describe('useBreachCheckHandler hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useBreachCheck).mockReturnValue({
      status: 'idle',
      count: undefined,
      error: undefined,
      performBreachCheck: vi.fn(),
      reset: vi.fn(),
    });
  });

  describe('handleBreachCheck', () => {
    it('calls performBreachCheck with the value', async () => {
      const performBreachCheckMock = vi.fn().mockResolvedValue({ status: 'safe' as const, count: 0 });
      vi.mocked(useBreachCheck).mockReturnValue({
        performBreachCheck: performBreachCheckMock,
      });

      const { result } = renderHook(() => useBreachCheckHandler());
      const setBreachCheckMock = vi.fn();

      await act(async () => {
        await result.current.handleBreachCheck('testPassword', setBreachCheckMock);
      });

      expect(performBreachCheckMock).toHaveBeenCalledWith('testPassword');
    });

    it('calls setBreachCheck with safe status for non-breached password', async () => {
      const performBreachCheckMock = vi.fn().mockResolvedValue({ status: 'safe' as const, count: 0 });
      vi.mocked(useBreachCheck).mockReturnValue({
        status: 'idle',
        count: undefined,
        error: undefined,
        performBreachCheck: performBreachCheckMock,
        reset: vi.fn(),
      });

      const { result } = renderHook(() => useBreachCheckHandler());
      const setBreachCheckMock = vi.fn();

      await act(async () => {
        await result.current.handleBreachCheck('testPassword', setBreachCheckMock);
      });

      expect(setBreachCheckMock).toHaveBeenCalledWith('safe', 0);
    });

    it('calls setBreachCheck with breached status and count for breached password', async () => {
      const performBreachCheckMock = vi.fn().mockResolvedValue({ status: 'breached' as const, count: 12345 });
      vi.mocked(useBreachCheck).mockReturnValue({
        performBreachCheck: performBreachCheckMock,
      });

      const { result } = renderHook(() => useBreachCheckHandler());
      const setBreachCheckMock = vi.fn();

      await act(async () => {
        await result.current.handleBreachCheck('testPassword', setBreachCheckMock);
      });

      expect(setBreachCheckMock).toHaveBeenCalledWith('breached', 12345);
    });

    it('calls setBreachCheck with error status on API error', async () => {
      const performBreachCheckMock = vi.fn().mockResolvedValue({ status: 'error' as const, count: 0 });
      vi.mocked(useBreachCheck).mockReturnValue({
        performBreachCheck: performBreachCheckMock,
      });

      const { result } = renderHook(() => useBreachCheckHandler());
      const setBreachCheckMock = vi.fn();

      await act(async () => {
        await result.current.handleBreachCheck('testPassword', setBreachCheckMock);
      });

      expect(setBreachCheckMock).toHaveBeenCalledWith('error', 0);
    });

    it('handles checking passwords', async () => {
      const performBreachCheckMock = vi.fn().mockResolvedValue({ status: 'safe' as const, count: 0 });
      vi.mocked(useBreachCheck).mockReturnValue({
        performBreachCheck: performBreachCheckMock,
      });

      const { result } = renderHook(() => useBreachCheckHandler());
      const setBreachCheckMock = vi.fn();

      await act(async () => {
        await result.current.handleBreachCheck('MyPassword123!', setBreachCheckMock);
      });

      expect(performBreachCheckMock).toHaveBeenCalledWith('MyPassword123!');
    });

    it('handles checking PINs', async () => {
      const performBreachCheckMock = vi.fn().mockResolvedValue({ status: 'safe' as const, count: 0 });
      vi.mocked(useBreachCheck).mockReturnValue({
        performBreachCheck: performBreachCheckMock,
      });

      const { result } = renderHook(() => useBreachCheckHandler());
      const setBreachCheckMock = vi.fn();

      await act(async () => {
        await result.current.handleBreachCheck('123456', setBreachCheckMock);
      });

      expect(performBreachCheckMock).toHaveBeenCalledWith('123456');
    });

    it('handles checking passphrases', async () => {
      const performBreachCheckMock = vi.fn().mockResolvedValue({ status: 'breached' as const, count: 100 });
      vi.mocked(useBreachCheck).mockReturnValue({
        performBreachCheck: performBreachCheckMock,
      });

      const { result } = renderHook(() => useBreachCheckHandler());
      const setBreachCheckMock = vi.fn();

      await act(async () => {
        await result.current.handleBreachCheck('correct-horse-battery-staple', setBreachCheckMock);
      });

      expect(performBreachCheckMock).toHaveBeenCalledWith('correct-horse-battery-staple');
      expect(setBreachCheckMock).toHaveBeenCalledWith('breached', 100);
    });

    it('handles checking empty strings', async () => {
      const performBreachCheckMock = vi.fn().mockResolvedValue({ status: 'error' as const, count: undefined });
      vi.mocked(useBreachCheck).mockReturnValue({
        performBreachCheck: performBreachCheckMock,
      });

      const { result } = renderHook(() => useBreachCheckHandler());
      const setBreachCheckMock = vi.fn();

      await act(async () => {
        await result.current.handleBreachCheck('', setBreachCheckMock);
      });

      expect(performBreachCheckMock).toHaveBeenCalledWith('');
    });

    it('handles special characters in passwords', async () => {
      const performBreachCheckMock = vi.fn().mockResolvedValue({ status: 'safe' as const, count: 0 });
      vi.mocked(useBreachCheck).mockReturnValue({
        performBreachCheck: performBreachCheckMock,
      });

      const { result } = renderHook(() => useBreachCheckHandler());
      const setBreachCheckMock = vi.fn();

      await act(async () => {
        await result.current.handleBreachCheck('p@$$w0rd!#123', setBreachCheckMock);
      });

      expect(performBreachCheckMock).toHaveBeenCalledWith('p@$$w0rd!#123');
    });

    it('handles unicode characters', async () => {
      const performBreachCheckMock = vi.fn().mockResolvedValue({ status: 'safe' as const, count: 0 });
      vi.mocked(useBreachCheck).mockReturnValue({
        performBreachCheck: performBreachCheckMock,
      });

      const { result } = renderHook(() => useBreachCheckHandler());
      const setBreachCheckMock = vi.fn();

      await act(async () => {
        await result.current.handleBreachCheck('пароль123', setBreachCheckMock);
      });

      expect(performBreachCheckMock).toHaveBeenCalledWith('пароль123');
    });
  });

  describe('callback stability', () => {
    it('provides stable callback reference', () => {
      const { result, rerender } = renderHook(() => useBreachCheckHandler());
      const firstHandleBreachCheck = result.current.handleBreachCheck;

      rerender();

      expect(result.current.handleBreachCheck).toBe(firstHandleBreachCheck);
    });
  });

  describe('rapid checks', () => {
    it('handles rapid breach check calls', async () => {
      const performBreachCheckMock = vi
        .fn()
        .mockResolvedValue({ status: 'safe' as const, count: 0 });
      vi.mocked(useBreachCheck).mockReturnValue({
        performBreachCheck: performBreachCheckMock,
      });

      const { result } = renderHook(() => useBreachCheckHandler());
      const setBreachCheckMock = vi.fn();

      for (let i = 0; i < 10; i++) {
        await act(async () => {
          await result.current.handleBreachCheck(`password${i}`, setBreachCheckMock);
        });
      }

      expect(performBreachCheckMock).toHaveBeenCalledTimes(10);
      expect(setBreachCheckMock).toHaveBeenCalledTimes(10);
    });
  });

  describe('integration with useBreachCheck', () => {
    it('uses performBreachCheck from useBreachCheck hook', () => {
      const performBreachCheckMock = vi.fn();
      vi.mocked(useBreachCheck).mockReturnValue({
        performBreachCheck: performBreachCheckMock,
      });

      renderHook(() => useBreachCheckHandler());

      expect(useBreachCheck).toHaveBeenCalled();
    });
  });
});
