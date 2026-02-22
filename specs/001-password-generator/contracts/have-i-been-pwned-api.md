# API Contract: Have I Been Pwned API

**Feature**: Password Generator Web Application
**Date**: 2026-02-22
**Purpose**: Define API contract for Have I Been Pwned Pwned Passwords API integration

## Overview

The password generator application integrates with the Have I Been Pwned Pwned Passwords API to check if generated credentials (passwords, PINs, passphrases) have been involved in data breaches. This integration uses the k-anonymity approach to protect user privacy.

## API Endpoint

### Pwned Passwords - Range Search

**Endpoint**: `GET https://api.pwnedpasswords.com/range/{hashPrefix}`

**Description**: Retrieves all password hash suffixes that match the given hash prefix. The API uses k-anonymity by only requiring the first 5 characters of the SHA-1 hash.

**Authentication**: None required (public API)

**Rate Limiting**: 1500 requests/day per IP address

## Request

### URL Parameters

| Parameter | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| `hashPrefix` | string | Yes | First 5 characters of SHA-1 hash (hexadecimal, lowercase) | `5BAA61` |

### Headers

| Header | Type | Required | Description | Example |
|--------|------|----------|-------------|---------|
| `User-Agent` | string | No | Application identifier (optional but recommended) | `password-generator/1.0.0` |
| `Add-Padding` | boolean | No | Add random padding to obscure request size (optional) | `true` |

### Example Request

```http
GET /range/5BAA61 HTTP/1.1
Host: api.pwnedpasswords.com
User-Agent: password-generator/1.0.0
Accept: application/json
```

## Response

### Success Response (200 OK)

**Content-Type**: `application/json; charset=utf-8`

**Body**: JSON object where keys are hash suffixes (35 characters) and values are the number of times the full hash has been seen in data breaches.

**Format**:
```json
{
  "0018A45C4D1DEF816F3A363F4846F7976B": 1,
  "002F8E45C4D1DEF816F3A363F4846F7976B": 3,
  "0034A45C4D1DEF816F3A363F4846F7976B": 2,
  ...
}
```

### Error Responses

| Status Code | Description | Body |
|-------------|-------------|------|
| 400 Bad Request | Invalid hash prefix format | `{"message":"Invalid hash prefix"}` |
| 404 Not Found | API endpoint not found | `{"message":"Not found"}` |
| 429 Too Many Requests | Rate limit exceeded | `{"message":"Too many requests"}` |
| 500 Internal Server Error | Server error | `{"message":"Internal server error"}` |

## Implementation Details

### Hash Generation

1. Convert credential (password, PIN, or passphrase) to SHA-1 hash
2. Convert hash to hexadecimal (40 characters, lowercase)
3. Extract first 5 characters as `hashPrefix`
4. Extract remaining 35 characters as `hashSuffix`

### SHA-1 Hash Example

```typescript
async function sha1Hash(input: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(input)
  const hashBuffer = await crypto.subtle.digest('SHA-1', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  return hashHex.toLowerCase()
}

// Example
const password = 'correct-horse-battery-staple'
const hash = await sha1Hash(password)
// hash = '5baa61e4c4d1def816f3a363f4846f7976b'
// hashPrefix = '5baa6'
// hashSuffix = '1e4c4d1def816f3a363f4846f7976b'
```

### Breach Check Logic

```typescript
async function checkBreach(credential: string): Promise<BreachCheckResult> {
  // 1. Generate SHA-1 hash
  const hash = await sha1Hash(credential)
  const hashPrefix = hash.substring(0, 5)
  const hashSuffix = hash.substring(5)

  // 2. Call API
  const response = await fetch(`https://api.pwnedpasswords.com/range/${hashPrefix}`)
  
  if (!response.ok) {
    if (response.status === 429) {
      return { status: 'error', error: 'Rate limit exceeded' }
    }
    throw new Error(`API error: ${response.status}`)
  }

  // 3. Parse response
  const data = await response.json() as Record<string, number>
  
  // 4. Check if suffix matches
  const breachCount = data[hashSuffix]
  
  if (breachCount) {
    return { status: 'breached', count: breachCount }
  }
  
  return { status: 'safe' }
}
```

### Caching Strategy

To avoid repeated API calls for the same credential:

```typescript
const breachCache = new Map<string, BreachCheckResult>()

async function checkBreachWithCache(credential: string): Promise<BreachCheckResult> {
  // Check cache first
  if (breachCache.has(credential)) {
    return breachCache.get(credential)!
  }

  // Perform breach check
  const result = await checkBreach(credential)
  
  // Cache result
  breachCache.set(credential, result)
  
  return result
}
```

### Error Handling

```typescript
interface BreachCheckError {
  type: 'network' | 'rate_limit' | 'api_error' | 'unknown'
  message: string
}

function handleBreachCheckError(error: unknown): BreachCheckError {
  if (error instanceof TypeError && error.message.includes('fetch')) {
    return {
      type: 'network',
      message: 'Network error. Please check your connection.',
    }
  }

  if (error instanceof Error && error.message.includes('Rate limit')) {
    return {
      type: 'rate_limit',
      message: 'Rate limit exceeded. Please try again later.',
    }
  }

  return {
    type: 'unknown',
    message: 'An error occurred. Please try again.',
  }
}
```

## Security Considerations

### K-Anonymity

The API uses k-anonymity with k=5:
- Only first 5 characters of SHA-1 hash are sent
- This provides k=5 anonymity (5-character prefix has ~1 million possible values)
- Full credential is never transmitted
- Aligns with privacy best practices

### HTTPS Only

All API calls MUST use HTTPS:
- URL: `https://api.pwnedpasswords.com/range/{hashPrefix}`
- Never use HTTP
- Browser enforces HTTPS for this domain

### User-Agent Header

Include a descriptive User-Agent header:
- Helps the API provider identify legitimate traffic
- Recommended format: `{application-name}/{version}`
- Example: `password-generator/1.0.0`

### No Credentials

No authentication or API keys required:
- Public API with rate limiting
- No sensitive data to store or manage
- Reduces security surface area

## Performance Considerations

### Response Time

Target: Under 3 seconds for typical breach checks (SC-005)

Factors affecting response time:
- Network latency
- API server load
- Number of matching hash suffixes (typically 400-500)

### Rate Limiting

- 1500 requests/day per IP address
- Implement client-side throttling to avoid hitting limits
- Cache results to reduce API calls
- Show user-friendly message when limit exceeded

### Request Size

- Small request (only 5-character hash prefix)
- Add-Padding header can obscure request size (optional)
- Minimal bandwidth usage

## Testing Strategy

### Unit Tests

Mock the API for unit tests:
```typescript
import { vi } from 'vitest'

vi.mock('node-fetch', () => ({
  default: vi.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ '0018A45C4D1DEF816F3A363F4846F7976B': 1 }),
  }),
}))
```

### Integration Tests

Test with real API for integration tests:
- Use test credentials that are known to be safe
- Use test credentials that are known to be breached
- Verify error handling for rate limits
- Verify error handling for network errors

### E2E Tests

Test breach check flow with Playwright:
- Generate a password
- Click breach check button
- Verify loading state
- Verify result display (safe or breached)
- Verify error handling for network issues

## Compliance

### Privacy

- Full credentials never transmitted
- Only hash prefixes sent (k-anonymity)
- No user tracking or logging
- Aligns with GDPR and similar regulations

### Terms of Service

- Use of API implies acceptance of Have I Been Pwned terms
- Commercial use requires attribution
- Rate limiting must be respected
- No scraping or abuse

## References

- [Have I Been Pwned API Documentation](https://haveibeenpwned.com/API/v3)
- [Pwned Passwords API](https://haveibeenpwned.com/PwnedPasswords)
- [k-Anonymity Explained](https://en.wikipedia.org/wiki/K-anonymity)
