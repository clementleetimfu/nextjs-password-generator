import { useState, useCallback, useEffect } from 'react';
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

    return pin;
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

  const setValue = useCallback((value: string) => {
    setState((prev) => ({
      ...prev,
      value,
      breachCheck: 'idle',
      breachCount: undefined,
    }));
  }, []);

  // Generate initial PIN on mount (client-side only to avoid hydration mismatch)
  useEffect(() => {
    generate();
  }, []);

  // Auto-regenerate when length changes
  useEffect(() => {
    generate();
  }, [state.length]);

  return {
    state,
    generate,
    setLength,
    setBreachCheck,
    setValue,
  };
}
