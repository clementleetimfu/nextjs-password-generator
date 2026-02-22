// Character sets
export const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';
export const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
export const DIGITS = '0123456789';
export const SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,.<>?';

// Character set mapping
export const CHARACTER_SETS: Record<string, string> = {
  lowercase: LOWERCASE,
  uppercase: UPPERCASE,
  digits: DIGITS,
  symbols: SYMBOLS,
} as const;

// Separator mapping
export const SEPARATORS: Record<string, string> = {
  space: ' ',
  hyphen: '-',
  underscore: '_',
  period: '.',
} as const;

// Password constraints
export const PASSWORD_CONSTRAINTS = {
  MIN_LENGTH: 8,
  MAX_LENGTH: 50,
  DEFAULT_LENGTH: 8,
} as const;

// PIN constraints
export const PIN_CONSTRAINTS = {
  MIN_LENGTH: 3,
  MAX_LENGTH: 12,
  DEFAULT_LENGTH: 3,
} as const;

// Passphrase constraints
export const PASSPHRASE_CONSTRAINTS = {
  MIN_WORDS: 4,
  MAX_WORDS: 10,
  DEFAULT_WORDS: 4,
  DEFAULT_SEPARATOR: 'hyphen',
} as const;

// Performance targets
export const PERFORMANCE_TARGETS = {
  GENERATION_TIME_MS: 100,
  THEME_TOGGLE_TIME_MS: 100,
  BREACH_CHECK_TIME_MS: 3000,
  PAGE_LOAD_TIME_MS: 2000,
  TOAST_DURATION_MS: 3000,
} as const;

// API configuration
export const API_CONFIG = {
  HIBP_BASE_URL: 'https://api.pwnedpasswords.com/range/',
  HIBP_RATE_LIMIT: 1500,
  HIBP_REQUEST_TIMEOUT_MS: 5000,
} as const;

// Generate a cryptographically secure random password
export function generatePassword(
  length: number,
  includeDigits: boolean,
  includeSymbols: boolean,
  includeUppercase: boolean
): string {
  // Build character set based on options
  let charset = CHARACTER_SETS.lowercase
  if (includeUppercase) charset += CHARACTER_SETS.uppercase
  if (includeDigits) charset += CHARACTER_SETS.digits
  if (includeSymbols) charset += CHARACTER_SETS.symbols

  // Generate random password using Web Crypto API
  const array = new Uint32Array(length)
  crypto.getRandomValues(array)
  
  let password = ''
  for (let i = 0; i < length; i++) {
    password += charset[array[i] % charset.length]
  }

  return password
}

// Generate a cryptographically secure random PIN
export function generatePin(length: number): string {
  const array = new Uint32Array(length)
  crypto.getRandomValues(array)
  
  let pin = ''
  for (let i = 0; i < length; i++) {
    pin += DIGITS[array[i] % DIGITS.length]
  }

  return pin
}

// Generate a cryptographically secure random passphrase
export function generatePassphrase(wordCount: number, separator: string): string {
  const { EFF_LONG_WORDLIST } = require('./eff-wordlist')
  const array = new Uint32Array(wordCount)
  crypto.getRandomValues(array)
  
  const words: string[] = []
  for (let i = 0; i < wordCount; i++) {
    const index = array[i] % EFF_LONG_WORDLIST.length
    words.push(EFF_LONG_WORDLIST[index])
  }

  return words.join(separator)
}

