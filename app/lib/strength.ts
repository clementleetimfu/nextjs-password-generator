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

export function calculatePasswordStrength(
  length: number,
  options: CharacterSetOptions
): StrengthResult {
  // Calculate character set size
  let characterSetSize = 0;
  if (options.lowercase) characterSetSize += CHARACTER_SET_SIZES.lowercase;
  if (options.uppercase) characterSetSize += CHARACTER_SET_SIZES.uppercase;
  if (options.digits) characterSetSize += CHARACTER_SET_SIZES.digits;
  if (options.symbols) characterSetSize += CHARACTER_SET_SIZES.symbols;

  // Calculate entropy: log2(characterSetSize^length) = length * log2(characterSetSize)
  const entropy = length * Math.log2(characterSetSize);

  // Calculate score based on entropy (normalized to 0-100)
  // 40 bits of entropy is considered strong, 80 bits is very strong
  const maxEntropy = 120; // Very strong password entropy
  const score = Math.min(100, Math.max(0, (entropy / maxEntropy) * 100));

  // Determine strength level
  let level: StrengthLevel;
  if (score < STRENGTH_THRESHOLDS.VERY_WEAK) {
    level = 'VERY_WEAK';
  } else if (score < STRENGTH_THRESHOLDS.WEAK) {
    level = 'WEAK';
  } else if (score < STRENGTH_THRESHOLDS.MODERATE) {
    level = 'MODERATE';
  } else if (score < STRENGTH_THRESHOLDS.STRONG) {
    level = 'STRONG';
  } else {
    level = 'VERY_STRONG';
  }

  return {
    level,
    score: Math.round(score),
    entropy: Math.round(entropy * 100) / 100, // Round to 2 decimal places
  };
}

// Calculate PIN strength
export function calculatePinStrength(length: number): StrengthResult {
  const characterSetSize = 10; // digits only
  const entropy = length * Math.log2(characterSetSize);

  // Calculate score based on entropy (normalized to 0-100)
  const maxEntropy = 120;
  const score = Math.min(100, Math.max(0, (entropy / maxEntropy) * 100));

  // Determine strength level
  let level: StrengthLevel;
  if (score < STRENGTH_THRESHOLDS.VERY_WEAK) {
    level = 'VERY_WEAK';
  } else if (score < STRENGTH_THRESHOLDS.WEAK) {
    level = 'WEAK';
  } else if (score < STRENGTH_THRESHOLDS.MODERATE) {
    level = 'MODERATE';
  } else if (score < STRENGTH_THRESHOLDS.STRONG) {
    level = 'STRONG';
  } else {
    level = 'VERY_STRONG';
  }

  return {
    level,
    score: Math.round(score),
    entropy: Math.round(entropy * 100) / 100,
  };
}

// Calculate passphrase strength
export function calculatePassphraseStrength(wordCount: number): StrengthResult {
  const wordSetSize = 7776; // EFF Long Wordlist
  const entropy = wordCount * Math.log2(wordSetSize);

  // Calculate score based on entropy (normalized to 0-100)
  const maxEntropy = 120;
  const score = Math.min(100, Math.max(0, (entropy / maxEntropy) * 100));

  // Determine strength level
  let level: StrengthLevel;
  if (score < STRENGTH_THRESHOLDS.VERY_WEAK) {
    level = 'VERY_WEAK';
  } else if (score < STRENGTH_THRESHOLDS.WEAK) {
    level = 'WEAK';
  } else if (score < STRENGTH_THRESHOLDS.MODERATE) {
    level = 'MODERATE';
  } else if (score < STRENGTH_THRESHOLDS.STRONG) {
    level = 'STRONG';
  } else {
    level = 'VERY_STRONG';
  }

  return {
    level,
    score: Math.round(score),
    entropy: Math.round(entropy * 100) / 100,
  };
}
