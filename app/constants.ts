export const SPACING = {
  xs: '0.5rem',
  sm: '0.75rem',
  md: '1rem',
  lg: '1.5rem',
  xl: '2rem',
  '2xl': '3rem',
} as const;

export const ANIMATION = {
  FAST: '100ms',
  NORMAL: '200ms',
  SLOW: '300ms',
  VERY_SLOW: '500ms',
} as const;

export const HISTORY = {
  MAX_ITEMS: 10,
  STORAGE_KEY: 'password-history',
} as const;

export const HISTORY_STORAGE_KEY = 'password-generator-history';

export const KEYBOARD_SHORTCUTS = {
  GENERATE: 'R',
  COPY: 'C',
  BREACH_CHECK: 'B',
  TAB_PASSWORD: '1',
  TAB_PIN: '2',
  TAB_PASSPHRASE: '3',
} as const;
