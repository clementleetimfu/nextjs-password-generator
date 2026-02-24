import type { StrengthLevel } from '@/types/generator';

export interface CharacterSetOptions {
  lowercase: boolean;
  uppercase: boolean;
  digits: boolean;
  symbols: boolean;
}

export interface StrengthResult {
  level: StrengthLevel;
  score: number;
  entropy: number;
}

const CHARACTER_SET_SIZES = {
  lowercase: 26,
  uppercase: 26,
  digits: 10,
  symbols: 32,
};

const STRENGTH_THRESHOLDS = {
  VERY_WEAK: 20,
  WEAK: 40,
  MODERATE: 60,
  STRONG: 80,
};

function getStrengthLevel(score: number): StrengthLevel {
  if (score < STRENGTH_THRESHOLDS.VERY_WEAK) {
    return 'VERY_WEAK';
  } else if (score < STRENGTH_THRESHOLDS.WEAK) {
    return 'WEAK';
  } else if (score < STRENGTH_THRESHOLDS.MODERATE) {
    return 'MODERATE';
  } else if (score < STRENGTH_THRESHOLDS.STRONG) {
    return 'STRONG';
  } else {
    return 'VERY_STRONG';
  }
}

function calculateStrengthResult(entropy: number): StrengthResult {
  const maxEntropy = 120;
  const score = Math.min(100, Math.max(0, (entropy / maxEntropy) * 100));
  return {
    level: getStrengthLevel(score),
    score: Math.round(score),
    entropy: Math.round(entropy * 100) / 100,
  };
}

export function calculatePasswordStrength(
  length: number,
  options: CharacterSetOptions
): StrengthResult {
  let characterSetSize = 0;
  if (options.lowercase) characterSetSize += CHARACTER_SET_SIZES.lowercase;
  if (options.uppercase) characterSetSize += CHARACTER_SET_SIZES.uppercase;
  if (options.digits) characterSetSize += CHARACTER_SET_SIZES.digits;
  if (options.symbols) characterSetSize += CHARACTER_SET_SIZES.symbols;

  const entropy = length * Math.log2(characterSetSize);
  return calculateStrengthResult(entropy);
}

export function calculatePinStrength(length: number): StrengthResult {
  const characterSetSize = 10;
  const entropy = length * Math.log2(characterSetSize);
  return calculateStrengthResult(entropy);
}

export function calculatePassphraseStrength(wordCount: number): StrengthResult {
  const wordSetSize = 7776;
  const entropy = wordCount * Math.log2(wordSetSize);
  return calculateStrengthResult(entropy);
}
