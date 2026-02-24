// Credential generation modes
export type CredentialType = 'password' | 'pin' | 'passphrase'

// Character sets for password generation
export type CharacterSet = 'lowercase' | 'uppercase' | 'digits' | 'symbols'

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

// Combined credential state
export type CredentialState = PasswordState | PinState | PassphraseState

// Generator state
export interface GeneratorState {
  activeType: CredentialType
  password: PasswordState
  pin: PinState
  passphrase: PassphraseState
}

// Theme state
export interface ThemeState {
  mode: ThemeMode
}

// Toast state
export interface ToastState {
  visible: boolean
  message: string
  type: 'success' | 'error'
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
