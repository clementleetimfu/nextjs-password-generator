// API configuration
export const API_CONFIG = {
  HIBP_BASE_URL: 'https://api.pwnedpasswords.com/range/',
  HIBP_RATE_LIMIT: 1500,
  HIBP_REQUEST_TIMEOUT_MS: 5000,
} as const;

// Breach check result
export interface BreachCheckResult {
  status: 'idle' | 'checking' | 'safe' | 'breached' | 'error';
  count?: number;
  error?: string;
}

// Simple in-memory cache for breach check results
const breachCache = new Map<string, BreachCheckResult>();

// Generate SHA-1 hash of a string using Web Crypto API
export async function sha1Hash(input: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hashBuffer = await crypto.subtle.digest('SHA-1', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
  return hashHex.toUpperCase();
}

// Check if a password has been breached using Have I Been Pwned API
export async function checkBreach(
  password: string
): Promise<BreachCheckResult> {
  if (!password || password.length === 0) {
    return { status: 'error', error: 'Password cannot be empty' };
  }

  // Check cache first
  const cacheKey = password;
  if (breachCache.has(cacheKey)) {
    return breachCache.get(cacheKey)!;
  }

  try {
    // Generate SHA-1 hash
    const hash = await sha1Hash(password);

    // Use k-anonymity: send only first 5 characters of hash
    const hashPrefix = hash.substring(0, 5);
    const hashSuffix = hash.substring(5);

    // Call Have I Been Pwned API
    const response = await fetch(
      `${API_CONFIG.HIBP_BASE_URL}${hashPrefix}`,
      {
        method: 'GET',
        headers: {
          'User-Agent': 'Password-Generator',
        },
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        const error = 'Rate limit exceeded. Please try again later.';
        const result: BreachCheckResult = { status: 'error', error };
        breachCache.set(cacheKey, result);
        return result;
      }
      throw new Error(`API request failed: ${response.status}`);
    }

    // Parse response
    const text = await response.text();
    const lines = text.split('\n').filter((line) => line.trim().length > 0);

    // Check if our hash suffix is in the response
    let breachCount = 0;
    for (const line of lines) {
      const [suffix, count] = line.split(':');
      if (suffix === hashSuffix) {
        breachCount = parseInt(count, 10);
        break;
      }
    }

    const result: BreachCheckResult = {
      status: breachCount > 0 ? 'breached' : 'safe',
      count: breachCount > 0 ? breachCount : undefined,
    };

    // Cache the result
    breachCache.set(cacheKey, result);
    return result;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error occurred';
    const result: BreachCheckResult = {
      status: 'error',
      error: errorMessage,
    };
    breachCache.set(cacheKey, result);
    return result;
  }
}

// Handle breach check errors
export function handleBreachCheckError(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unknown error occurred';
}

// Clear the breach cache
export function clearBreachCache(): void {
  breachCache.clear();
}
