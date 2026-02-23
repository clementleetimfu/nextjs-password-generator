import { render, RenderOptions, fireEvent } from '@testing-library/react';

/**
 * Test helper for creating mock functions with Vitest
 */
export const createMockFn = () => vi.fn();

/**
 * Test helper for waiting for async operations
 */
export const waitFor = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Test helper for rendering components with default options
 */
export const renderComponent = (
  ui: React.ReactElement,
  options?: RenderOptions
) => {
  return render(ui, {
    ...options,
  });
};

/**
 * Test helper for simulating button clicks
 */
export const clickButton = (element: HTMLElement) => {
  fireEvent.click(element);
};

/**
 * Test helper for simulating input changes
 */
export const typeInput = (element: HTMLInputElement, value: string) => {
  fireEvent.change(element, { target: { value } });
};

/**
 * Test helper for simulating toggle switches
 */
export const toggleSwitch = (element: HTMLElement) => {
  fireEvent.click(element);
};

/**
 * Test helper for simulating slider changes
 */
export const changeSlider = (element: HTMLElement, value: number) => {
  // Note: Radix UI Slider uses onValueChange callback
  // This is a simplified helper - actual implementation may need adjustment
  fireEvent.change(element, { target: { value } });
};

/**
 * Test helper for simulating tab selection
 */
export const selectTab = (element: HTMLElement) => {
  fireEvent.click(element);
};

/**
 * Test helper for simulating clipboard copy
 */
export const copyToClipboard = async (text: string) => {
  await navigator.clipboard.writeText(text);
};

/**
 * Test helper for mocking fetch responses
 */
export const mockFetchResponse = (
  url: string,
  response: Response | string | object,
  options?: RequestInit
) => {
  global.fetch = vi.fn().mockImplementation(async (fetchUrl, fetchOptions) => {
    if (fetchUrl.includes(url)) {
      if (typeof response === 'string') {
        return new Response(response, {
          status: 200,
          headers: { 'Content-Type': 'text/plain' },
        });
      }
      if (response instanceof Response) {
        return response;
      }
      return new Response(JSON.stringify(response), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    throw new Error(`Unexpected fetch call to: ${fetchUrl}`);
  });
};

/**
 * Test helper for mocking fetch errors
 */
export const mockFetchError = (url: string, error: Error | number) => {
  global.fetch = vi.fn().mockImplementation(async (fetchUrl) => {
    if (fetchUrl.includes(url)) {
      if (typeof error === 'number') {
        return new Response(null, { status: error });
      }
      throw error;
    }
    throw new Error(`Unexpected fetch call to: ${fetchUrl}`);
  });
};

/**
 * Test helper for resetting fetch mock
 */
export const resetFetchMock = () => {
  global.fetch = vi.fn();
};

/**
 * Test helper for getting element by test ID
 */
export const getByTestId = (testId: string) => {
  return document.querySelector(`[data-testid="${testId}"]`);
};

/**
 * Test helper for getting element by role
 */
export const getByRole = (role: string, name?: string) => {
  const selector = name
    ? `[role="${role}"][name="${name}"]`
    : `[role="${role}"]`;
  return document.querySelector(selector);
};

/**
 * Test helper for checking if element exists
 */
export const elementExists = (selector: string) => {
  return document.querySelector(selector) !== null;
};

/**
 * Test helper for getting element text
 */
export const getElementText = (selector: string) => {
  const element = document.querySelector(selector);
  return element?.textContent || '';
};

/**
 * Test helper for checking element attribute
 */
export const getElementAttribute = (element: HTMLElement, attribute: string) => {
  return element.getAttribute(attribute);
};

/**
 * Test helper for setting localStorage item
 */
export const setLocalStorageItem = (key: string, value: string) => {
  localStorage.setItem(key, value);
};

/**
 * Test helper for getting localStorage item
 */
export const getLocalStorageItem = (key: string) => {
  return localStorage.getItem(key);
};

/**
 * Test helper for removing localStorage item
 */
export const removeLocalStorageItem = (key: string) => {
  localStorage.removeItem(key);
};

/**
 * Test helper for clearing localStorage
 */
export const clearLocalStorage = () => {
  localStorage.clear();
};

/**
 * Test helper for creating mock crypto values
 */
export const createMockCryptoValues = (length: number) => {
  const values = new Uint32Array(length);
  for (let i = 0; i < length; i++) {
    values[i] = (i * 17) % 4294967296;
  }
  return values;
};

/**
 * Test helper for creating mock SHA-1 hash
 */
export const createMockSHA1Hash = (input: string) => {
  // Simple hash for testing (not a real SHA-1)
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16).toUpperCase().padStart(40, '0');
};

/**
 * Test helper for creating mock HIBP API response
 */
export const createMockHIBPResponse = (hashSuffix: string, count: number) => {
  return `${hashSuffix}:${count}`;
};

/**
 * Test helper for creating mock HIBP API error response
 */
export const createMockHIBPErrorResponse = (status: number) => {
  return new Response(null, { status });
};

/**
 * Test helper for waiting for element to appear
 */
export const waitForElement = async (
  selector: string,
  timeout = 5000
): Promise<HTMLElement | null> => {
  const startTime = Date.now();
  while (Date.now() - startTime < timeout) {
    const element = document.querySelector(selector);
    if (element) {
      return element as HTMLElement;
    }
    await waitFor(100);
  }
  return null;
};

/**
 * Test helper for waiting for element to disappear
 */
export const waitForElementToDisappear = async (
  selector: string,
  timeout = 5000
): Promise<boolean> => {
  const startTime = Date.now();
  while (Date.now() - startTime < timeout) {
    const element = document.querySelector(selector);
    if (!element) {
      return true;
    }
    await waitFor(100);
  }
  return false;
};

/**
 * Test helper for checking element visibility
 */
export const isElementVisible = (element: HTMLElement) => {
  return (
    element.offsetParent !== null &&
    getComputedStyle(element).visibility !== 'hidden' &&
    getComputedStyle(element).display !== 'none'
  );
};

/**
 * Test helper for checking element disabled state
 */
export const isElementDisabled = (element: HTMLElement) => {
  return element.hasAttribute('disabled') || element.hasAttribute('aria-disabled');
};

/**
 * Test helper for checking element checked state
 */
export const isElementChecked = (element: HTMLElement) => {
  return element.getAttribute('aria-checked') === 'true';
};

/**
 * Test helper for getting computed style
 */
export const getComputedStyle = (element: HTMLElement) => {
  return window.getComputedStyle(element);
};

/**
 * Test helper for creating mock event
 */
export const createMockEvent = (type: string, properties?: Record<string, any>) => {
  const event = new Event(type, { bubbles: true, cancelable: true });
  Object.assign(event, properties);
  return event;
};

/**
 * Test helper for creating mock keyboard event
 */
export const createMockKeyboardEvent = (
  key: string,
  options?: KeyboardEventInit
) => {
  return new KeyboardEvent('keydown', {
    key,
    bubbles: true,
    cancelable: true,
    ...options,
  });
};

/**
 * Test helper for creating mock mouse event
 */
export const createMockMouseEvent = (
  type: string,
  options?: MouseEventInit
) => {
  return new MouseEvent(type, {
    bubbles: true,
    cancelable: true,
    ...options,
  });
};

/**
 * Test helper for delaying execution
 */
export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Test helper for creating test data
 */
export const createTestData = {
  password: {
    short: 'abc',
    medium: 'abcd1234',
    long: 'a'.repeat(50),
    withDigits: 'abcd1234',
    withSymbols: 'abcd!@#$',
    withUppercase: 'Abcd1234',
    complex: 'Abc123!@#',
  },
  pin: {
    short: '123',
    medium: '123456',
    long: '123456789012',
  },
  passphrase: {
    short: 'correct-horse-battery',
    medium: 'correct-horse-battery-staple',
    long: 'correct-horse-battery-staple-apple-banana-cherry-date-elderberry-fig-grape',
  },
  strength: {
    veryWeak: 'abc',
    weak: 'abcd1234',
    moderate: 'Abcd1234!',
    strong: 'Abc123!@#xyz',
    veryStrong: 'Abc123!@#XYZ$%^&*()',
  },
  breach: {
    safe: 'ThisIsASafePassword123!',
    breached: 'password',
  },
};

/**
 * Test helper for creating mock props
 */
export const createMockProps = <T extends Record<string, any>>(
  defaults: T,
  overrides?: Partial<T>
): T => {
  return { ...defaults, ...overrides };
};
