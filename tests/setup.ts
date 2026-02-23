import { vi, beforeEach, afterAll } from 'vitest';
import '@testing-library/jest-dom';

// Mock Web Crypto API for deterministic tests
Object.defineProperty(global, 'crypto', {
  value: {
    getRandomValues: vi.fn((array: Uint8Array | Uint32Array) => {
      // Use a predictable seed for testing
      const values = array instanceof Uint8Array ? array : new Uint8Array(array.byteLength);
      for (let i = 0; i < values.length; i++) {
        values[i] = (i * 17) % 256;
      }
      return values;
    }),
    subtle: {
      digest: vi.fn(async (algorithm: string, data: Uint8Array) => {
        // Mock SHA-1 hash for testing
        const hash = new Uint8Array(20);
        for (let i = 0; i < hash.length; i++) {
          hash[i] = (data[i % data.length] + i) % 256;
        }
        return hash;
      }),
    },
  },
  writable: true,
  configurable: true,
});

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
    get length() {
      return Object.keys(store).length;
    },
    key: (index: number) => {
      const keys = Object.keys(store);
      return keys[index] || null;
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn(async (text: string) => {
      // Mock successful write
      return;
    }),
    readText: vi.fn(async () => {
      return '';
    }),
  },
});

// Mock fetch for API calls
global.fetch = vi.fn();

// Mock toast notification
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
    warning: vi.fn(),
  },
}));

// Mock EFF wordlist to avoid loading large file
vi.mock('@/lib/eff-wordlist', () => ({
  EFF_LONG_WORDLIST: [
    'correct',
    'horse',
    'battery',
    'staple',
    'apple',
    'banana',
    'cherry',
    'date',
    'elderberry',
    'fig',
  ],
}));

// Reset all mocks before each test
beforeEach(() => {
  vi.clearAllMocks();
  localStorageMock.clear();
});

// Cleanup after all tests
afterAll(() => {
  vi.restoreAllMocks();
});
