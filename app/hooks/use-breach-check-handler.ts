import { useCallback } from 'react';
import { useBreachCheck } from '@/hooks/use-breach-check';
import type { BreachCheckResult } from '@/types/generator';

interface UseBreachCheckHandlerReturn {
  handleBreachCheck: (value: string, setBreachCheck: (status: BreachCheckResult['status'], count?: number) => void) => Promise<void>;
}

export function useBreachCheckHandler(): UseBreachCheckHandlerReturn {
  const { performBreachCheck } = useBreachCheck();

  const handleBreachCheck = useCallback(
    async (
      value: string,
      setBreachCheck: (status: BreachCheckResult['status'], count?: number) => void
    ) => {
      const result = await performBreachCheck(value);
      setBreachCheck(result.status, result.count);
    },
    [performBreachCheck]
  );

  return {
    handleBreachCheck,
  };
}
