import { useCallback } from 'react';
import { calculatePasswordStrength, calculatePinStrength, calculatePassphraseStrength } from '@/lib/strength';
import type { StrengthLevel } from '@/types/generator';
import type { CharacterSetOptions } from '@/lib/strength';

export function useStrengthCheck() {
  const checkPasswordStrength = useCallback((length: number, options: CharacterSetOptions): StrengthLevel => {
    const result = calculatePasswordStrength(length, options);
    return result.level;
  }, []);

  const checkPinStrength = useCallback((length: number): StrengthLevel => {
    const result = calculatePinStrength(length);
    return result.level;
  }, []);

  const checkPassphraseStrength = useCallback((wordCount: number): StrengthLevel => {
    const result = calculatePassphraseStrength(wordCount);
    return result.level;
  }, []);

  return {
    checkPasswordStrength,
    checkPinStrength,
    checkPassphraseStrength,
  };
}
