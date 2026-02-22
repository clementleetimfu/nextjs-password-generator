import { useState, useCallback } from 'react';
import { checkBreach } from '@/lib/breach-check';

export function useBreachCheck() {
  const [status, setStatus] = useState<'idle' | 'checking' | 'safe' | 'breached' | 'error'>('idle');
  const [count, setCount] = useState<number | undefined>(undefined);
  const [error, setError] = useState<string | undefined>(undefined);

  const performBreachCheck = useCallback(async (password: string) => {
    setStatus('checking');
    setError(undefined);
    setCount(undefined);

    try {
      const result = await checkBreach(password);
      setStatus(result.status);
      setCount(result.count);
      setError(result.error);
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
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
