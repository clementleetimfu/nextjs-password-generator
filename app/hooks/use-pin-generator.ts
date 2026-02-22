import { useState, useCallback } from 'react';
import { generatePin } from '@/lib/crypto';
import { calculatePinStrength } from '@/lib/strength';
import type { PinState } from '@/types/generator';
import { PIN_CONSTRAINTS } from '@/lib/crypto';

export function usePinGenerator() {
  const [state, setState] = useState<PinState>({
    type: 'pin',
    value: '',
    length: PIN_CONSTRAINTS.DEFAULT_LENGTH,
    strength: 'VERY_WEAK',
    breachCheck: 'idle',
  });

  const generate = useCallback(() => {
    const pin = generatePin(state.length);
    const strengthResult = calculatePinStrength(state.length);

    setState((prev) => ({
      ...prev,
      value: pin,
      strength: strengthResult.level,
      breachCheck: 'idle',
      breachCount: undefined,
    }));
  }, [state.length]);

  const setLength = useCallback((length: number) => {
    setState((prev) => ({ ...prev, length }));
  }, []);

  const setBreachCheck = useCallback((status: PinState['breachCheck'], count?: number) => {
    setState((prev) => ({
      ...prev,
      breachCheck: status,
      breachCount: count,
    }));
  }, []);

  // Generate initial PIN on mount
  useState(() => {
    generate();
  });

  return {
    state,
    generate,
    setLength,
    setBreachCheck,
  };
}
