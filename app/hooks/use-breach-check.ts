import { useState, useCallback } from 'react';
import { checkBreach } from '@/lib/breach-check';
import type { BreachCheckResult } from '@/types/generator';

export function useBreachCheck() {
  const [status, setStatus] = useState<'idle' | 'checking' | 'safe' | 'breached' | 'error'>('idle');
  const [count, setCount] = useState<number | undefined>(undefined);
  const [error, setError] = useState<string | undefined>(undefined);

  const performBreachCheck = useCallback(async (password: string): Promise<BreachCheckResult> => {
    setStatus('checking');
    setError(undefined);
    setCount(undefined);

    try {
      const result = await checkBreach(password);
      setStatus(result.status);
      setCount(result.count);
      setError(result.error);
      return { status: result.status, count: result.count, error: result.error };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setStatus('error');
      setError(errorMessage);
      return { status: 'error', error: errorMessage };
    }
  }, []);

  const reset = useCallback(() => {
    setStatus('idle');
    setCount(undefined);
    setError(undefined);
  }, []);

  return {
    status,
    count,
    error,
    performBreachCheck,
    reset,
  };
}
