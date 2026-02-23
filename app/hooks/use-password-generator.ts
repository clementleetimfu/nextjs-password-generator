import { useState, useCallback, useEffect } from 'react';
import { generatePassword } from '@/lib/crypto';
import { calculatePasswordStrength } from '@/lib/strength';
import type { PasswordState } from '@/types/generator';
import { PASSWORD_CONSTRAINTS } from '@/lib/crypto';

export function usePasswordGenerator() {
  const [state, setState] = useState<PasswordState>({
    type: 'password',
    value: '',
    length: PASSWORD_CONSTRAINTS.DEFAULT_LENGTH,
    includeDigits: false,
    includeSymbols: false,
    includeUppercase: false,
    strength: 'VERY_WEAK',
    breachCheck: 'idle',
  });

  const generate = useCallback(() => {
    const password = generatePassword(
      state.length,
      state.includeDigits,
      state.includeSymbols,
      state.includeUppercase
    );
    const strengthResult = calculatePasswordStrength(state.length, {
      lowercase: true,
      uppercase: state.includeUppercase,
      digits: state.includeDigits,
      symbols: state.includeSymbols,
    });

    setState((prev) => ({
      ...prev,
      value: password,
      strength: strengthResult.level,
      breachCheck: 'idle',
      breachCount: undefined,
    }));
  }, [state.length, state.includeDigits, state.includeSymbols, state.includeUppercase]);

  const setLength = useCallback((length: number) => {
    setState((prev) => ({ ...prev, length }));
  }, []);

  const toggleDigits = useCallback(() => {
    setState((prev) => ({ ...prev, includeDigits: !prev.includeDigits }));
  }, []);

  const toggleSymbols = useCallback(() => {
    setState((prev) => ({ ...prev, includeSymbols: !prev.includeSymbols }));
  }, []);

  const toggleUppercase = useCallback(() => {
    setState((prev) => ({ ...prev, includeUppercase: !prev.includeUppercase }));
  }, []);

  const setBreachCheck = useCallback((status: PasswordState['breachCheck'], count?: number) => {
    setState((prev) => ({
      ...prev,
      breachCheck: status,
      breachCount: count,
    }));
  }, []);

  // Generate initial password on mount (client-side only to avoid hydration mismatch)
  useEffect(() => {
    generate();
  }, []);

  // Auto-regenerate when settings change
  useEffect(() => {
    generate();
  }, [state.length, state.includeDigits, state.includeSymbols, state.includeUppercase]);

  return {
    state,
    generate,
    setLength,
    toggleDigits,
    toggleSymbols,
    toggleUppercase,
    setBreachCheck,
  };
}
