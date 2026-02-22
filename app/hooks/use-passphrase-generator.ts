import { useState, useCallback } from 'react';
import { generatePassphrase } from '@/lib/crypto';
import { calculatePassphraseStrength } from '@/lib/strength';
import type { PassphraseState, Separator } from '@/types/generator';
import { PASSPHRASE_CONSTRAINTS, SEPARATORS } from '@/lib/crypto';

export function usePassphraseGenerator() {
  const [state, setState] = useState<PassphraseState>({
    type: 'passphrase',
    value: '',
    wordCount: PASSPHRASE_CONSTRAINTS.DEFAULT_WORDS,
    separator: PASSPHRASE_CONSTRAINTS.DEFAULT_SEPARATOR as Separator,
    strength: 'VERY_WEAK',
    breachCheck: 'idle',
  });

  const generate = useCallback(() => {
    const separatorChar = SEPARATORS[state.separator];
    const passphrase = generatePassphrase(state.wordCount, separatorChar);
    const strengthResult = calculatePassphraseStrength(state.wordCount);

    setState((prev) => ({
      ...prev,
      value: passphrase,
      strength: strengthResult.level,
      breachCheck: 'idle',
      breachCount: undefined,
    }));
  }, [state.wordCount, state.separator]);

  const setWordCount = useCallback((wordCount: number) => {
    setState((prev) => ({ ...prev, wordCount }));
  }, []);

  const setSeparator = useCallback((separator: Separator) => {
    setState((prev) => ({ ...prev, separator }));
  }, []);

  const setBreachCheck = useCallback((status: PassphraseState['breachCheck'], count?: number) => {
    setState((prev) => ({
      ...prev,
      breachCheck: status,
      breachCount: count,
    }));
  }, []);

  // Generate initial passphrase on mount
  useState(() => {
    generate();
  });

  return {
    state,
    generate,
    setWordCount,
    setSeparator,
    setBreachCheck,
  };
}
