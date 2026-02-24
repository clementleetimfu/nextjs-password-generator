// Credential generation modes
export type CredentialType = 'password' | 'pin' | 'passphrase'

// Separator options for passphrase
export type Separator = 'space' | 'hyphen' | 'underscore' | 'period'

// Theme modes
export type ThemeMode = 'light' | 'dark'

// Strength levels
export type StrengthLevel = 'VERY_WEAK' | 'WEAK' | 'MODERATE' | 'STRONG' | 'VERY_STRONG'

// Breach check status
export type BreachCheckStatus = 'idle' | 'checking' | 'safe' | 'breached' | 'error'

// Password generation state
export interface PasswordState {
  type: 'password'
  value: string
  length: number
  includeDigits: boolean
  includeSymbols: boolean
  includeUppercase: boolean
  strength: StrengthLevel
  breachCheck: BreachCheckStatus
  breachCount?: number
}

// PIN generation state
export interface PinState {
  type: 'pin'
  value: string
  length: number
  strength: StrengthLevel
  breachCheck: BreachCheckStatus
  breachCount?: number
}

// Passphrase generation state
export interface PassphraseState {
  type: 'passphrase'
  value: string
  wordCount: number
  separator: Separator
  strength: StrengthLevel
  breachCheck: BreachCheckStatus
  breachCount?: number
}

// Breach check result
export interface BreachCheckResult {
  status: BreachCheckStatus
  count?: number
  error?: string
}

// History item
export interface HistoryItem {
  value: string;
  type: CredentialType;
  timestamp: number;
}
