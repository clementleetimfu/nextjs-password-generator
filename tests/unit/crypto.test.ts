import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import {
  generatePassword,
  generatePin,
  generatePassphrase,
  LOWERCASE,
  UPPERCASE,
  DIGITS,
  SYMBOLS,
  CHARACTER_SETS,
  SEPARATORS,
  PASSWORD_CONSTRAINTS,
  PIN_CONSTRAINTS,
  PASSPHRASE_CONSTRAINTS,
} from '../../app/lib/crypto'
import { API_CONFIG } from '../../app/lib/breach-check'

describe('crypto.ts Constants', () => {
  describe('CHARACTER_SETS', () => {
    it('should have correct lowercase characters', () => {
      expect(LOWERCASE).toBe('abcdefghijklmnopqrstuvwxyz')
      expect(LOWERCASE).toHaveLength(26)
    })

    it('should have correct uppercase characters', () => {
      expect(UPPERCASE).toBe('ABCDEFGHIJKLMNOPQRSTUVWXYZ')
      expect(UPPERCASE).toHaveLength(26)
    })

    it('should have correct digit characters', () => {
      expect(DIGITS).toBe('0123456789')
      expect(DIGITS).toHaveLength(10)
    })

    it('should have correct symbol characters', () => {
      expect(SYMBOLS).toBe('!@#$%^&*()_+-=[]{}|;:,.<>?')
      expect(SYMBOLS).toHaveLength(26)
    })

    it('should map character sets correctly', () => {
      expect(CHARACTER_SETS.lowercase).toBe(LOWERCASE)
      expect(CHARACTER_SETS.uppercase).toBe(UPPERCASE)
      expect(CHARACTER_SETS.digits).toBe(DIGITS)
      expect(CHARACTER_SETS.symbols).toBe(SYMBOLS)
    })
  })

  describe('SEPARATORS', () => {
    it('should have correct separator mappings', () => {
      expect(SEPARATORS.space).toBe(' ')
      expect(SEPARATORS.hyphen).toBe('-')
      expect(SEPARATORS.underscore).toBe('_')
      expect(SEPARATORS.period).toBe('.')
    })
  })

  describe('PASSWORD_CONSTRAINTS', () => {
    it('should have correct password constraints', () => {
      expect(PASSWORD_CONSTRAINTS.MIN_LENGTH).toBe(8)
      expect(PASSWORD_CONSTRAINTS.MAX_LENGTH).toBe(50)
      expect(PASSWORD_CONSTRAINTS.DEFAULT_LENGTH).toBe(8)
    })

    it('should have MIN_LENGTH less than MAX_LENGTH', () => {
      expect(PASSWORD_CONSTRAINTS.MIN_LENGTH).toBeLessThan(PASSWORD_CONSTRAINTS.MAX_LENGTH)
    })

    it('should have DEFAULT_LENGTH within valid range', () => {
      expect(PASSWORD_CONSTRAINTS.DEFAULT_LENGTH).toBeGreaterThanOrEqual(PASSWORD_CONSTRAINTS.MIN_LENGTH)
      expect(PASSWORD_CONSTRAINTS.DEFAULT_LENGTH).toBeLessThanOrEqual(PASSWORD_CONSTRAINTS.MAX_LENGTH)
    })
  })

  describe('PIN_CONSTRAINTS', () => {
    it('should have correct PIN constraints', () => {
      expect(PIN_CONSTRAINTS.MIN_LENGTH).toBe(3)
      expect(PIN_CONSTRAINTS.MAX_LENGTH).toBe(12)
      expect(PIN_CONSTRAINTS.DEFAULT_LENGTH).toBe(3)
    })

    it('should have MIN_LENGTH less than MAX_LENGTH', () => {
      expect(PIN_CONSTRAINTS.MIN_LENGTH).toBeLessThan(PIN_CONSTRAINTS.MAX_LENGTH)
    })

    it('should have DEFAULT_LENGTH within valid range', () => {
      expect(PIN_CONSTRAINTS.DEFAULT_LENGTH).toBeGreaterThanOrEqual(PIN_CONSTRAINTS.MIN_LENGTH)
      expect(PIN_CONSTRAINTS.DEFAULT_LENGTH).toBeLessThanOrEqual(PIN_CONSTRAINTS.MAX_LENGTH)
    })
  })

  describe('PASSPHRASE_CONSTRAINTS', () => {
    it('should have correct passphrase constraints', () => {
      expect(PASSPHRASE_CONSTRAINTS.MIN_WORDS).toBe(4)
      expect(PASSPHRASE_CONSTRAINTS.MAX_WORDS).toBe(10)
      expect(PASSPHRASE_CONSTRAINTS.DEFAULT_WORDS).toBe(4)
      expect(PASSPHRASE_CONSTRAINTS.DEFAULT_SEPARATOR).toBe('hyphen')
    })

    it('should have MIN_WORDS less than MAX_WORDS', () => {
      expect(PASSPHRASE_CONSTRAINTS.MIN_WORDS).toBeLessThan(PASSPHRASE_CONSTRAINTS.MAX_WORDS)
    })

    it('should have DEFAULT_WORDS within valid range', () => {
      expect(PASSPHRASE_CONSTRAINTS.DEFAULT_WORDS).toBeGreaterThanOrEqual(PASSPHRASE_CONSTRAINTS.MIN_WORDS)
      expect(PASSPHRASE_CONSTRAINTS.DEFAULT_WORDS).toBeLessThanOrEqual(PASSPHRASE_CONSTRAINTS.MAX_WORDS)
    })

    it('should have DEFAULT_SEPARATOR in SEPARATORS', () => {
      expect(SEPARATORS[PASSPHRASE_CONSTRAINTS.DEFAULT_SEPARATOR]).toBeDefined()
    })
  })

  describe('API_CONFIG', () => {
    it('should have correct API configuration', () => {
      expect(API_CONFIG.HIBP_BASE_URL).toBe('https://api.pwnedpasswords.com/range/')
      expect(API_CONFIG.HIBP_RATE_LIMIT).toBe(1500)
      expect(API_CONFIG.HIBP_REQUEST_TIMEOUT_MS).toBe(5000)
    })

    it('should have valid HIBP_BASE_URL', () => {
      expect(API_CONFIG.HIBP_BASE_URL).toMatch(/^https?:\/\//)
    })

    it('should have positive rate limit and timeout', () => {
      expect(API_CONFIG.HIBP_RATE_LIMIT).toBeGreaterThan(0)
      expect(API_CONFIG.HIBP_REQUEST_TIMEOUT_MS).toBeGreaterThan(0)
    })
  })
})

describe('generatePassword', () => {
  beforeEach(() => {
    // Reset random seed for consistent testing
    vi.spyOn(Math, 'random').mockReturnValue(0.5)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('Basic Functionality', () => {
    it('should generate a password of correct length', () => {
      const password = generatePassword(12, false, false, false)
      expect(password).toHaveLength(12)
    })

    it('should generate a password with default length of 8', () => {
      const password = generatePassword(PASSWORD_CONSTRAINTS.DEFAULT_LENGTH, false, false, false)
      expect(password).toHaveLength(PASSWORD_CONSTRAINTS.DEFAULT_LENGTH)
    })

    it('should generate a password with maximum length of 50', () => {
      const password = generatePassword(PASSWORD_CONSTRAINTS.MAX_LENGTH, false, false, false)
      expect(password).toHaveLength(PASSWORD_CONSTRAINTS.MAX_LENGTH)
    })

    it('should generate a password with only lowercase letters by default', () => {
      const password = generatePassword(PASSWORD_CONSTRAINTS.DEFAULT_LENGTH, false, false, false)
      expect(password).toMatch(/^[a-z]+$/)
    })

    it('should include digits when enabled', () => {
      const password = generatePassword(12, true, false, false)
      expect(password).toMatch(/[0-9]/)
    })

    it('should include symbols when enabled', () => {
      const password = generatePassword(12, false, true, false)
      expect(password).toMatch(/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/)
    })

    it('should include uppercase letters when enabled', () => {
      const password = generatePassword(12, false, false, true)
      expect(password).toMatch(/[A-Z]/)
    })
  })

  describe('Character Set Combinations', () => {
    it('should include all character types when all options enabled', () => {
      const password = generatePassword(20, true, true, true)
      expect(password).toMatch(/[a-z]/)
      expect(password).toMatch(/[A-Z]/)
      expect(password).toMatch(/[0-9]|[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/)
      expect(password).toMatch(/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/)
    })

    it('should include lowercase and digits only', () => {
      const password = generatePassword(12, true, false, false)
      expect(password).toMatch(/^[a-z0-9]+$/)
      expect(password).not.toMatch(/[A-Z]/)
      expect(password).not.toMatch(/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/)
    })

    it('should include lowercase and symbols only', () => {
      const password = generatePassword(12, false, true, false)
      expect(password).toMatch(/[a-z]/)
      expect(password).toMatch(/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/)
      expect(password).not.toMatch(/[A-Z]/)
      expect(password).not.toMatch(/[0-9]/)
    })

    it('should include lowercase and uppercase only', () => {
      const password = generatePassword(12, false, false, true)
      expect(password).toMatch(/[a-z]/)
      expect(password).toMatch(/[A-Z]/)
      expect(password).not.toMatch(/[0-9]/)
      expect(password).not.toMatch(/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/)
    })

    it('should include digits and symbols only', () => {
      const password = generatePassword(12, true, true, false)
      expect(password).toMatch(/[a-z]/)
      expect(password).toMatch(/[0-9]/)
      expect(password).toMatch(/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/)
      expect(password).not.toMatch(/[A-Z]/)
    })
  })

  describe('Edge Cases and Boundary Conditions', () => {
    it('should handle minimum length (8)', () => {
      const password = generatePassword(PASSWORD_CONSTRAINTS.MIN_LENGTH, false, false, false)
      expect(password).toHaveLength(PASSWORD_CONSTRAINTS.MIN_LENGTH)
      expect(password).toMatch(/^[a-z]+$/)
    })

    it('should handle maximum length (50)', () => {
      const password = generatePassword(PASSWORD_CONSTRAINTS.MAX_LENGTH, true, true, true)
      expect(password).toHaveLength(PASSWORD_CONSTRAINTS.MAX_LENGTH)
    })

    it('should generate different passwords on multiple calls', () => {
      const password1 = generatePassword(12, true, true, true)
      const password2 = generatePassword(12, true, true, true)
      expect(password1).not.toBe(password2)
    })

    it('should handle length between min and max', () => {
      const password = generatePassword(25, true, true, true)
      expect(password).toHaveLength(25)
    })

    it('should not include characters outside selected character set', () => {
      const password = generatePassword(20, false, false, false)
      expect(password).toMatch(/^[a-z]+$/)
    })
  })

  describe('Security and Randomness', () => {
    it('should use Web Crypto API for random generation', () => {
      const getRandomValuesSpy = vi.spyOn(crypto, 'getRandomValues')
      generatePassword(12, true, true, true)
      expect(getRandomValuesSpy).toHaveBeenCalled()
      getRandomValuesSpy.mockRestore()
    })

    it('should generate cryptographically secure passwords', () => {
      const passwords = new Set()
      for (let i = 0; i < 100; i++) {
        passwords.add(generatePassword(12, true, true, true))
      }
      // With 100 passwords of 12 characters with 4 character types,
      // we expect very few if any duplicates
      const duplicates = 100 - passwords.size
      expect(duplicates).toBeLessThan(5)
    })
  })

  describe('Performance', () => {
    it('should generate password within performance target', () => {
      const start = performance.now()
      generatePassword(20, true, true, true)
      const duration = performance.now() - start
      expect(duration).toBeLessThan(100)
    })

    it('should generate multiple passwords efficiently', () => {
      const start = performance.now()
      for (let i = 0; i < 100; i++) {
        generatePassword(12, true, true, true)
      }
      const duration = performance.now() - start
      expect(duration).toBeLessThan(100 * 100)
    })
  })
})

describe('generatePin', () => {
  describe('Basic Functionality', () => {
    it('should generate a PIN of correct length', () => {
      const pin = generatePin(6)
      expect(pin).toHaveLength(6)
    })

    it('should generate a PIN with default length of 3', () => {
      const pin = generatePin(PIN_CONSTRAINTS.DEFAULT_LENGTH)
      expect(pin).toHaveLength(PIN_CONSTRAINTS.DEFAULT_LENGTH)
    })

    it('should generate a PIN with maximum length of 12', () => {
      const pin = generatePin(PIN_CONSTRAINTS.MAX_LENGTH)
      expect(pin).toHaveLength(PIN_CONSTRAINTS.MAX_LENGTH)
    })

    it('should only contain digits', () => {
      const pin = generatePin(6)
      expect(pin).toMatch(/^[0-9]+$/)
    })

    it('should not contain letters or symbols', () => {
      const pin = generatePin(6)
      expect(pin).not.toMatch(/[a-zA-Z]/)
      expect(pin).not.toMatch(/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/)
    })
  })

  describe('Edge Cases and Boundary Conditions', () => {
    it('should handle minimum length (3)', () => {
      const pin = generatePin(PIN_CONSTRAINTS.MIN_LENGTH)
      expect(pin).toHaveLength(PIN_CONSTRAINTS.MIN_LENGTH)
      expect(pin).toMatch(/^[0-9]+$/)
    })

    it('should handle maximum length (12)', () => {
      const pin = generatePin(PIN_CONSTRAINTS.MAX_LENGTH)
      expect(pin).toHaveLength(PIN_CONSTRAINTS.MAX_LENGTH)
      expect(pin).toMatch(/^[0-9]+$/)
    })

    it('should generate different PINs on multiple calls', () => {
      const pin1 = generatePin(6)
      const pin2 = generatePin(6)
      expect(pin1).not.toBe(pin2)
    })

    it('should handle length between min and max', () => {
      const pin = generatePin(8)
      expect(pin).toHaveLength(8)
      expect(pin).toMatch(/^[0-9]+$/)
    })
  })

  describe('Security and Randomness', () => {
    it('should use Web Crypto API for random generation', () => {
      const getRandomValuesSpy = vi.spyOn(crypto, 'getRandomValues')
      generatePin(6)
      expect(getRandomValuesSpy).toHaveBeenCalled()
      getRandomValuesSpy.mockRestore()
    })

    it('should generate cryptographically secure PINs', () => {
      const pins = new Set()
      for (let i = 0; i < 100; i++) {
        pins.add(generatePin(6))
      }
      // With 100 PINs of 6 digits, we expect very few if any duplicates
      const duplicates = 100 - pins.size
      expect(duplicates).toBeLessThan(5)
    })
  })

  describe('Performance', () => {
    it('should generate PIN within performance target', () => {
      const start = performance.now()
      generatePin(6)
      const duration = performance.now() - start
      expect(duration).toBeLessThan(100)
    })

    it('should generate multiple PINs efficiently', () => {
      const start = performance.now()
      for (let i = 0; i < 100; i++) {
        generatePin(6)
      }
      const duration = performance.now() - start
      expect(duration).toBeLessThan(100 * 100)
    })
  })
})

  describe('generatePassphrase', async () => {
  describe('Basic Functionality', async () => {
    it('should generate a passphrase with correct word count', async () => {
      const passphrase = await generatePassphrase(4, '-')
      const words = passphrase.split('-')
      expect(words).toHaveLength(4)
    })

    it('should generate a passphrase with default word count of 4', async () => {
      const passphrase = await generatePassphrase(PASSPHRASE_CONSTRAINTS.DEFAULT_WORDS, '-')
      const words = passphrase.split('-')
      expect(words).toHaveLength(PASSPHRASE_CONSTRAINTS.DEFAULT_WORDS)
    })

    it('should generate a passphrase with maximum word count of 10', async () => {
      const passphrase = await generatePassphrase(PASSPHRASE_CONSTRAINTS.MAX_WORDS, '-')
      const words = passphrase.split('-')
      expect(words).toHaveLength(PASSPHRASE_CONSTRAINTS.MAX_WORDS)
    })

    it('should use hyphen separator by default', async () => {
      const passphrase = await generatePassphrase(4, SEPARATORS.hyphen)
      expect(passphrase).toContain('-')
      expect(passphrase).not.toContain(' ')
      expect(passphrase).not.toContain('_')
      expect(passphrase).not.toContain('.')
    })
  })

  describe('Separator Options', async () => {
    it('should use space separator', async () => {
      const passphrase = await generatePassphrase(4, SEPARATORS.space)
      expect(passphrase).toContain(' ')
      expect(passphrase).not.toContain('-')
      expect(passphrase).not.toContain('_')
      expect(passphrase).not.toContain('.')
    })

    it('should use hyphen separator', async () => {
      const passphrase = await generatePassphrase(4, SEPARATORS.hyphen)
      expect(passphrase).toContain('-')
      expect(passphrase).not.toContain(' ')
      expect(passphrase).not.toContain('_')
      expect(passphrase).not.toContain('.')
    })

    it('should use underscore separator', async () => {
      const passphrase = await generatePassphrase(4, SEPARATORS.underscore)
      expect(passphrase).toContain('_')
      expect(passphrase).not.toContain('-')
      expect(passphrase).not.toContain(' ')
      expect(passphrase).not.toContain('.')
    })

    it('should use period separator', async () => {
      const passphrase = await generatePassphrase(4, SEPARATORS.period)
      expect(passphrase).toContain('.')
      expect(passphrase).not.toContain('-')
      expect(passphrase).not.toContain(' ')
      expect(passphrase).not.toContain('_')
    })
  })

  describe('Word Properties', async () => {
    it('should generate passphrases with lowercase words', async () => {
      const passphrase = await generatePassphrase(4, '-')
      const words = passphrase.split('-')
      words.forEach((word) => {
        expect(word).toMatch(/^[a-z]+$/)
        expect(word).not.toMatch(/[A-Z]/)
      })
    })

    it('should generate passphrases with reasonable word lengths', async () => {
      const passphrase = await generatePassphrase(10, '-')
      const words = passphrase.split('-')
      words.forEach((word) => {
        expect(word.length).toBeGreaterThanOrEqual(3)
        expect(word.length).toBeLessThanOrEqual(9)
      })
    })

    it('should not include special characters in words', async () => {
      const passphrase = await generatePassphrase(4, '-')
      const words = passphrase.split('-')
      words.forEach((word) => {
        expect(word).toMatch(/^[a-z]+$/)
        expect(word).not.toMatch(/[0-9!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/)
      })
    })
  })

  describe('Edge Cases and Boundary Conditions', async () => {
    it('should handle minimum word count (4)', async () => {
      const passphrase = await generatePassphrase(PASSPHRASE_CONSTRAINTS.MIN_WORDS, '-')
      const words = passphrase.split('-')
      expect(words).toHaveLength(PASSPHRASE_CONSTRAINTS.MIN_WORDS)
    })

    it('should handle maximum word count (10)', async () => {
      const passphrase = await generatePassphrase(PASSPHRASE_CONSTRAINTS.MAX_WORDS, '-')
      const words = passphrase.split('-')
      expect(words).toHaveLength(PASSPHRASE_CONSTRAINTS.MAX_WORDS)
    })

    it('should generate different passphrases on multiple calls', async () => {
      const passphrase1 = await generatePassphrase(4, '-')
      const passphrase2 = await generatePassphrase(4, '-')
      expect(passphrase1).not.toBe(passphrase2)
    })

    it('should handle word count between min and max', async () => {
      const passphrase = await generatePassphrase(7, '-')
      const words = passphrase.split('-')
      expect(words).toHaveLength(7)
    })

    it('should handle empty separator (no separator)', async () => {
      const passphrase = await generatePassphrase(4, '')
      expect(passphrase).not.toContain('-')
      expect(passphrase).not.toContain(' ')
      expect(passphrase).not.toContain('_')
      expect(passphrase).not.toContain('.')
    })
  })

  describe('Security and Randomness', async () => {
    it('should use Web Crypto API for random generation', async () => {
      const getRandomValuesSpy = vi.spyOn(crypto, 'getRandomValues')
      await generatePassphrase(4, '-')
      expect(getRandomValuesSpy).toHaveBeenCalled()
      getRandomValuesSpy.mockRestore()
    })

    it('should generate cryptographically secure passphrases', async () => {
      const passphrases = new Set()
      for (let i = 0; i < 100; i++) {
        passphrases.add(await generatePassphrase(4, '-'))
      }
      // With 100 passphrases of 4 words from 7776-word list,
      // we expect very few if any duplicates
      const duplicates = 100 - passphrases.size
      expect(duplicates).toBeLessThan(5)
    })
  })

  describe('Performance', async () => {
    it('should generate passphrase within performance target', async () => {
      const start = performance.now()
      await generatePassphrase(4, '-')
      const duration = performance.now() - start
      expect(duration).toBeLessThan(100)
    })

    it('should generate multiple passphrases efficiently', async () => {
      const start = performance.now()
      for (let i = 0; i < 100; i++) {
        await generatePassphrase(4, '-')
      }
      const duration = performance.now() - start
      expect(duration).toBeLessThan(100 * 100)
    })
  })
})

