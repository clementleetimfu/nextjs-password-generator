export const HISTORY = {
  MAX_ITEMS: 10,
  STORAGE_KEY: 'password-generator-history',
} as const;

export const HISTORY_STORAGE_KEY = HISTORY.STORAGE_KEY;

export const KEYBOARD_SHORTCUTS = {
  GENERATE: 'R',
  COPY: 'C',
  BREACH_CHECK: 'B',
  TAB_PASSWORD: '1',
  TAB_PIN: '2',
  TAB_PASSPHRASE: '3',
} as const;
