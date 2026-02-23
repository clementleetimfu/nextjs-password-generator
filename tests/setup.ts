import { vi, beforeEach, afterAll } from 'vitest';
import '@testing-library/jest-dom';
import { webcrypto } from 'node:crypto';
import { createElement } from 'react';

// Ensure Web Crypto API exists in test runtime.
if (!globalThis.crypto) {
  Object.defineProperty(globalThis, 'crypto', {
    value: webcrypto,
    writable: true,
    configurable: true,
  });
}

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
  Toaster: (props: Record<string, unknown>) => {
    const { className, children, toastOptions, theme, ...rest } = props;
    return createElement('div', { className, ...rest }, children as React.ReactNode);
  },
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
    'diamond',
    'fig',
  ],
}));

// Radix UI uses ResizeObserver internally.
if (!globalThis.ResizeObserver) {
  class ResizeObserverMock {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  Object.defineProperty(globalThis, 'ResizeObserver', {
    value: ResizeObserverMock,
    writable: true,
    configurable: true,
  });
}

// Reset all mocks before each test
beforeEach(() => {
  vi.clearAllMocks();
  localStorageMock.clear();
});

// Cleanup after all tests
afterAll(() => {
  vi.restoreAllMocks();
});
