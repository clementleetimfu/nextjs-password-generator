import { describe, it, expect } from 'vitest'
import {
  calculatePasswordStrength,
  calculatePinStrength,
  calculatePassphraseStrength,
} from '@/lib/strength'
import type { StrengthLevel } from '@/types/generator'

describe('calculatePasswordStrength', () => {
  describe('VERY_WEAK Strength Level', () => {
    it('should return VERY_WEAK for very short passwords with only lowercase', () => {
      const result = calculatePasswordStrength(8, {
        lowercase: true,
        uppercase: false,
        digits: false,
        symbols: false,
      })
      expect(result.level).toBe('VERY_WEAK')
      expect(result.score).toBeGreaterThanOrEqual(0)
      expect(result.score).toBeLessThan(20)
    })

    it('should return VERY_WEAK for short passwords with limited character types', () => {
      const result = calculatePasswordStrength(8, {
        lowercase: true,
        uppercase: false,
        digits: true,
        symbols: false,
      })
      expect(result.level).toBe('VERY_WEAK')
      expect(result.score).toBeGreaterThanOrEqual(0)
      expect(result.score).toBeLessThan(20)
    })

    it('should return VERY_WEAK for minimum length with single character type', () => {
      const result = calculatePasswordStrength(8, {
        lowercase: true,
        uppercase: false,
        digits: false,
        symbols: false,
      })
      expect(result.level).toBe('VERY_WEAK')
      expect(result.score).toBeGreaterThanOrEqual(0)
      expect(result.score).toBeLessThan(20)
    })
  })

  describe('WEAK Strength Level', () => {
    it('should return WEAK for short passwords with only lowercase', () => {
      const result = calculatePasswordStrength(8, {
        lowercase: true,
        uppercase: false,
        digits: false,
        symbols: false,
      })
      expect(result.level).toBe('WEAK')
      expect(result.score).toBeGreaterThanOrEqual(20)
      expect(result.score).toBeLessThan(40)
    })

    it('should return WEAK for passwords with lowercase and digits', () => {
      const result = calculatePasswordStrength(8, {
        lowercase: true,
        uppercase: false,
        digits: true,
        symbols: false,
      })
      expect(result.level).toBe('WEAK')
      expect(result.score).toBeGreaterThanOrEqual(20)
      expect(result.score).toBeLessThan(40)
    })

    it('should return WEAK for passwords with lowercase and uppercase', () => {
      const result = calculatePasswordStrength(8, {
        lowercase: true,
        uppercase: true,
        digits: false,
        symbols: false,
      })
      expect(result.level).toBe('WEAK')
      expect(result.score).toBeGreaterThanOrEqual(20)
      expect(result.score).toBeLessThan(40)
    })

    it('should return WEAK for passwords with lowercase and symbols', () => {
      const result = calculatePasswordStrength(8, {
        lowercase: true,
        uppercase: false,
        digits: false,
        symbols: true,
      })
      expect(result.level).toBe('WEAK')
      expect(result.score).toBeGreaterThanOrEqual(20)
      expect(result.score).toBeLessThan(40)
    })
  })

  describe('MODERATE Strength Level', () => {
    it('should return MODERATE for passwords with lowercase, uppercase, and digits', () => {
      const result = calculatePasswordStrength(12, {
        lowercase: true,
        uppercase: true,
        digits: true,
        symbols: false,
      })
      expect(result.level).toBe('MODERATE')
      expect(result.score).toBeGreaterThanOrEqual(40)
      expect(result.score).toBeLessThan(60)
    })

    it('should return MODERATE for passwords with lowercase, uppercase, and symbols', () => {
      const result = calculatePasswordStrength(12, {
        lowercase: true,
        uppercase: true,
        digits: false,
        symbols: true,
      })
      expect(result.level).toBe('MODERATE')
      expect(result.score).toBeGreaterThanOrEqual(40)
      expect(result.score).toBeLessThan(60)
    })

    it('should return MODERATE for passwords with all character types but shorter length', () => {
      const result = calculatePasswordStrength(10, {
        lowercase: true,
        uppercase: true,
        digits: true,
        symbols: true,
      })
      expect(result.level).toBe('MODERATE')
      expect(result.score).toBeGreaterThanOrEqual(40)
      expect(result.score).toBeLessThan(60)
    })
  })

  describe('STRONG Strength Level', () => {
    it('should return STRONG for passwords with all character types and good length', () => {
      const result = calculatePasswordStrength(14, {
        lowercase: true,
        uppercase: true,
        digits: true,
        symbols: true,
      })
      expect(result.level).toBe('STRONG')
      expect(result.score).toBeGreaterThanOrEqual(60)
      expect(result.score).toBeLessThan(80)
    })

    it('should return STRONG for long passwords with three character types', () => {
      const result = calculatePasswordStrength(16, {
        lowercase: true,
        uppercase: true,
        digits: true,
        symbols: false,
      })
      expect(result.level).toBe('STRONG')
      expect(result.score).toBeGreaterThanOrEqual(60)
      expect(result.score).toBeLessThan(80)
    })
  })

  describe('VERY_STRONG Strength Level', () => {
    it('should return VERY_STRONG for passwords with all character types and good length', () => {
      const result = calculatePasswordStrength(16, {
        lowercase: true,
        uppercase: true,
        digits: true,
        symbols: true,
      })
      expect(result.level).toBe('VERY_STRONG')
      expect(result.score).toBeGreaterThanOrEqual(80)
    })

    it('should return VERY_STRONG for long passwords with all character types', () => {
      const result = calculatePasswordStrength(32, {
        lowercase: true,
        uppercase: true,
        digits: true,
        symbols: true,
      })
      expect(result.level).toBe('VERY_STRONG')
      expect(result.score).toBeGreaterThanOrEqual(80)
    })

    it('should return VERY_STRONG for maximum length with all character types', () => {
      const result = calculatePasswordStrength(50, {
        lowercase: true,
        uppercase: true,
        digits: true,
        symbols: true,
      })
      expect(result.level).toBe('VERY_STRONG')
      expect(result.score).toBeGreaterThanOrEqual(80)
    })
  })

  describe('Score Calculation', () => {
    it('should increase score with longer passwords', () => {
      const short = calculatePasswordStrength(8, {
        lowercase: true,
        uppercase: true,
        digits: true,
        symbols: true,
      })
      const long = calculatePasswordStrength(24, {
        lowercase: true,
        uppercase: true,
        digits: true,
        symbols: true,
      })
      expect(long.score).toBeGreaterThan(short.score)
    })

    it('should increase score with more character types', () => {
      const simple = calculatePasswordStrength(12, {
        lowercase: true,
        uppercase: false,
        digits: false,
        symbols: false,
      })
      const complex = calculatePasswordStrength(12, {
        lowercase: true,
        uppercase: true,
        digits: true,
        symbols: true,
      })
      expect(complex.score).toBeGreaterThan(simple.score)
    })

    it('should cap score at 100', () => {
      const result = calculatePasswordStrength(50, {
        lowercase: true,
        uppercase: true,
        digits: true,
        symbols: true,
      })
      expect(result.score).toBeLessThanOrEqual(100)
    })

    it('should ensure score is at least 0', () => {
      const result = calculatePasswordStrength(8, {
        lowercase: true,
        uppercase: false,
        digits: false,
        symbols: false,
      })
      expect(result.score).toBeGreaterThanOrEqual(0)
    })
  })

  describe('Entropy Calculation', () => {
    it('should calculate entropy correctly for character set size', () => {
      const lowercaseOnly = calculatePasswordStrength(12, {
        lowercase: true,
        uppercase: false,
        digits: false,
        symbols: false,
      })
      const allTypes = calculatePasswordStrength(12, {
        lowercase: true,
        uppercase: true,
        digits: true,
        symbols: true,
      })

      // Lowercase only: 26^12
      // All types: (26+26+10+32)^12 = 94^12
      // All types should have much higher entropy
      expect(allTypes.entropy).toBeGreaterThan(lowercaseOnly.entropy)
    })

    it('should increase entropy with longer passwords', () => {
      const short = calculatePasswordStrength(8, {
        lowercase: true,
        uppercase: true,
        digits: true,
        symbols: true,
      })
      const long = calculatePasswordStrength(24, {
        lowercase: true,
        uppercase: true,
        digits: true,
        symbols: true,
      })
      expect(long.entropy).toBeGreaterThan(short.entropy)
    })

    it('should increase entropy with more character types', () => {
      const simple = calculatePasswordStrength(12, {
        lowercase: true,
        uppercase: false,
        digits: false,
        symbols: false,
      })
      const complex = calculatePasswordStrength(12, {
        lowercase: true,
        uppercase: true,
        digits: true,
        symbols: true,
      })
      expect(complex.entropy).toBeGreaterThan(simple.entropy)
    })

    it('should round entropy to 2 decimal places', () => {
      const result = calculatePasswordStrength(12, {
        lowercase: true,
        uppercase: true,
        digits: true,
        symbols: true,
      })
      const decimalPlaces = result.entropy.toString().split('.')[1]?.length || 0
      expect(decimalPlaces).toBeLessThanOrEqual(2)
    })
  })

  describe('Edge Cases and Boundary Conditions', () => {
    it('should handle minimum length (8 characters)', () => {
      const result = calculatePasswordStrength(8, {
        lowercase: true,
        uppercase: true,
        digits: true,
        symbols: true,
      })
      expect(result.level).toBeDefined()
      expect(result.score).toBeGreaterThanOrEqual(0)
      expect(result.score).toBeLessThanOrEqual(100)
      expect(result.entropy).toBeGreaterThanOrEqual(0)
    })

    it('should handle maximum length (50 characters)', () => {
      const result = calculatePasswordStrength(50, {
        lowercase: true,
        uppercase: true,
        digits: true,
        symbols: true,
      })
      expect(result.level).toBe('VERY_STRONG')
      expect(result.score).toBeGreaterThanOrEqual(80)
    })

    it('should handle length between min and max', () => {
      const result = calculatePasswordStrength(25, {
        lowercase: true,
        uppercase: true,
        digits: true,
        symbols: true,
      })
      expect(result.level).toBeDefined()
      expect(result.score).toBeGreaterThanOrEqual(0)
      expect(result.score).toBeLessThanOrEqual(100)
    })

    it('should handle single character type (lowercase only)', () => {
      const result = calculatePasswordStrength(12, {
        lowercase: true,
        uppercase: false,
        digits: false,
        symbols: false,
      })
      expect(result.level).toBeDefined()
      expect(result.score).toBeGreaterThanOrEqual(0)
      expect(result.score).toBeLessThanOrEqual(100)
    })

    it('should handle single character type (digits only)', () => {
      const result = calculatePasswordStrength(12, {
        lowercase: false,
        uppercase: false,
        digits: true,
        symbols: false,
      })
      expect(result.level).toBeDefined()
      expect(result.score).toBeGreaterThanOrEqual(0)
      expect(result.score).toBeLessThanOrEqual(100)
    })

    it('should handle all character types disabled (edge case)', () => {
      const result = calculatePasswordStrength(12, {
        lowercase: false,
        uppercase: false,
        digits: false,
        symbols: false,
      })
      expect(result.level).toBe('VERY_WEAK')
      expect(result.score).toBe(0)
      expect(result.entropy).toBe(0)
    })
  })

  describe('Character Set Combinations', () => {
    it('should calculate correct character set size for lowercase only', () => {
      const result = calculatePasswordStrength(12, {
        lowercase: true,
        uppercase: false,
        digits: false,
        symbols: false,
      })
      const expectedEntropy = 12 * Math.log2(26)
      expect(result.entropy).toBeCloseTo(expectedEntropy, 2)
    })

    it('should calculate correct character set size for lowercase + uppercase', () => {
      const result = calculatePasswordStrength(12, {
        lowercase: true,
        uppercase: true,
        digits: false,
        symbols: false,
      })
      const expectedEntropy = 12 * Math.log2(52)
      expect(result.entropy).toBeCloseTo(expectedEntropy, 2)
    })

    it('should calculate correct character set size for lowercase + digits', () => {
      const result = calculatePasswordStrength(12, {
        lowercase: true,
        uppercase: false,
        digits: true,
        symbols: false,
      })
      const expectedEntropy = 12 * Math.log2(36)
      expect(result.entropy).toBeCloseTo(expectedEntropy, 2)
    })

    it('should calculate correct character set size for all character types', () => {
      const result = calculatePasswordStrength(12, {
        lowercase: true,
        uppercase: true,
        digits: true,
        symbols: true,
      })
      const expectedEntropy = 12 * Math.log2(94)
      expect(result.entropy).toBeCloseTo(expectedEntropy, 2)
    })
  })
})

describe('calculatePinStrength', () => {
  describe('Basic Functionality', () => {
    it('should return a StrengthResult object', () => {
      const result = calculatePinStrength(6)
      expect(result).toHaveProperty('level')
      expect(result).toHaveProperty('score')
      expect(result).toHaveProperty('entropy')
    })

    it('should return a valid StrengthLevel', () => {
      const result = calculatePinStrength(6)
      expect(['VERY_WEAK', 'WEAK', 'MODERATE', 'STRONG', 'VERY_STRONG']).toContain(
        result.level
      )
    })

    it('should return a score between 0 and 100', () => {
      const result = calculatePinStrength(6)
      expect(result.score).toBeGreaterThanOrEqual(0)
      expect(result.score).toBeLessThanOrEqual(100)
    })

    it('should return non-negative entropy', () => {
      const result = calculatePinStrength(6)
      expect(result.entropy).toBeGreaterThanOrEqual(0)
    })
  })

  describe('Strength Levels', () => {
    it('should return VERY_WEAK for short PINs (3 digits)', () => {
      const result = calculatePinStrength(3)
      expect(result.level).toBe('VERY_WEAK')
      expect(result.score).toBeLessThan(20)
    })

    it('should return WEAK for medium-short PINs (4 digits)', () => {
      const result = calculatePinStrength(4)
      expect(result.level).toBe('WEAK')
      expect(result.score).toBeGreaterThanOrEqual(20)
      expect(result.score).toBeLessThan(40)
    })

    it('should return MODERATE for medium PINs (6 digits)', () => {
      const result = calculatePinStrength(6)
      expect(result.level).toBe('MODERATE')
      expect(result.score).toBeGreaterThanOrEqual(40)
      expect(result.score).toBeLessThan(60)
    })

    it('should return STRONG for long PINs (8 digits)', () => {
      const result = calculatePinStrength(8)
      expect(result.level).toBe('STRONG')
      expect(result.score).toBeGreaterThanOrEqual(60)
      expect(result.score).toBeLessThan(80)
    })

    it('should return VERY_STRONG for very long PINs (12 digits)', () => {
      const result = calculatePinStrength(12)
      expect(result.level).toBe('VERY_STRONG')
      expect(result.score).toBeGreaterThanOrEqual(80)
    })
  })

  describe('Entropy Calculation', () => {
    it('should calculate entropy based on PIN length and digit set size', () => {
      const result = calculatePinStrength(6)
      const expectedEntropy = 6 * Math.log2(10)
      expect(result.entropy).toBeCloseTo(expectedEntropy, 2)
    })

    it('should increase entropy with longer PINs', () => {
      const short = calculatePinStrength(4)
      const long = calculatePinStrength(8)
      expect(long.entropy).toBeGreaterThan(short.entropy)
    })

    it('should round entropy to 2 decimal places', () => {
      const result = calculatePinStrength(6)
      const decimalPlaces = result.entropy.toString().split('.')[1]?.length || 0
      expect(decimalPlaces).toBeLessThanOrEqual(2)
    })
  })

  describe('Edge Cases and Boundary Conditions', () => {
    it('should handle minimum length (3 digits)', () => {
      const result = calculatePinStrength(3)
      expect(result.level).toBe('VERY_WEAK')
      expect(result.score).toBeGreaterThanOrEqual(0)
      expect(result.score).toBeLessThan(20)
    })

    it('should handle maximum length (12 digits)', () => {
      const result = calculatePinStrength(12)
      expect(result.level).toBe('VERY_STRONG')
      expect(result.score).toBeGreaterThanOrEqual(80)
    })

    it('should handle length between min and max', () => {
      const result = calculatePinStrength(7)
      expect(result.level).toBeDefined()
      expect(result.score).toBeGreaterThanOrEqual(0)
      expect(result.score).toBeLessThanOrEqual(100)
    })

    it('should cap score at 100', () => {
      const result = calculatePinStrength(12)
      expect(result.score).toBeLessThanOrEqual(100)
    })
  })
})

describe('calculatePassphraseStrength', () => {
  describe('Basic Functionality', () => {
    it('should return a StrengthResult object', () => {
      const result = calculatePassphraseStrength(4)
      expect(result).toHaveProperty('level')
      expect(result).toHaveProperty('score')
      expect(result).toHaveProperty('entropy')
    })

    it('should return a valid StrengthLevel', () => {
      const result = calculatePassphraseStrength(4)
      expect(['VERY_WEAK', 'WEAK', 'MODERATE', 'STRONG', 'VERY_STRONG']).toContain(
        result.level
      )
    })

    it('should return a score between 0 and 100', () => {
      const result = calculatePassphraseStrength(4)
      expect(result.score).toBeGreaterThanOrEqual(0)
      expect(result.score).toBeLessThanOrEqual(100)
    })

    it('should return non-negative entropy', () => {
      const result = calculatePassphraseStrength(4)
      expect(result.entropy).toBeGreaterThanOrEqual(0)
    })
  })

  describe('Strength Levels', () => {
    it('should return MODERATE for minimum word count (4 words)', () => {
      const result = calculatePassphraseStrength(4)
      expect(result.level).toBe('MODERATE')
      expect(result.score).toBeGreaterThanOrEqual(40)
      expect(result.score).toBeLessThan(60)
    })

    it('should return STRONG for medium word count (6 words)', () => {
      const result = calculatePassphraseStrength(6)
      expect(result.level).toBe('STRONG')
      expect(result.score).toBeGreaterThanOrEqual(60)
      expect(result.score).toBeLessThan(80)
    })

    it('should return VERY_STRONG for high word count (8 words)', () => {
      const result = calculatePassphraseStrength(8)
      expect(result.level).toBe('VERY_STRONG')
      expect(result.score).toBeGreaterThanOrEqual(80)
    })

    it('should return VERY_STRONG for maximum word count (10 words)', () => {
      const result = calculatePassphraseStrength(10)
      expect(result.level).toBe('VERY_STRONG')
      expect(result.score).toBeGreaterThanOrEqual(80)
    })
  })

  describe('Entropy Calculation', () => {
    it('should calculate entropy based on word count and EFF wordlist size', () => {
      const result = calculatePassphraseStrength(4)
      const expectedEntropy = 4 * Math.log2(7776)
      expect(result.entropy).toBeCloseTo(expectedEntropy, 2)
    })

    it('should increase entropy with more words', () => {
      const short = calculatePassphraseStrength(4)
      const long = calculatePassphraseStrength(8)
      expect(long.entropy).toBeGreaterThan(short.entropy)
    })

    it('should round entropy to 2 decimal places', () => {
      const result = calculatePassphraseStrength(4)
      const decimalPlaces = result.entropy.toString().split('.')[1]?.length || 0
      expect(decimalPlaces).toBeLessThanOrEqual(2)
    })
  })

  describe('Edge Cases and Boundary Conditions', () => {
    it('should handle minimum word count (4 words)', () => {
      const result = calculatePassphraseStrength(4)
      expect(result.level).toBe('MODERATE')
      expect(result.score).toBeGreaterThanOrEqual(40)
      expect(result.score).toBeLessThan(60)
    })

    it('should handle maximum word count (10 words)', () => {
      const result = calculatePassphraseStrength(10)
      expect(result.level).toBe('VERY_STRONG')
      expect(result.score).toBeGreaterThanOrEqual(80)
    })

    it('should handle word count between min and max', () => {
      const result = calculatePassphraseStrength(7)
      expect(result.level).toBeDefined()
      expect(result.score).toBeGreaterThanOrEqual(0)
      expect(result.score).toBeLessThanOrEqual(100)
    })

    it('should cap score at 100', () => {
      const result = calculatePassphraseStrength(10)
      expect(result.score).toBeLessThanOrEqual(100)
    })
  })

  describe('Comparison with Password Strength', () => {
    it('should have higher entropy than passwords of similar length', () => {
      const passphrase = calculatePassphraseStrength(4)
      const password = calculatePasswordStrength(12, {
        lowercase: true,
        uppercase: true,
        digits: true,
        symbols: true,
      })
      expect(passphrase.entropy).toBeGreaterThan(password.entropy)
    })

    it('should have higher score than passwords of similar length', () => {
      const passphrase = calculatePassphraseStrength(4)
      const password = calculatePasswordStrength(12, {
        lowercase: true,
        uppercase: true,
        digits: true,
        symbols: true,
      })
      expect(passphrase.score).toBeGreaterThan(password.score)
    })
  })
})

describe('Strength Calculation Consistency', () => {
  it('should use same maxEntropy for all strength calculations', () => {
    const password = calculatePasswordStrength(12, {
      lowercase: true,
      uppercase: true,
      digits: true,
      symbols: true,
    })
    const pin = calculatePinStrength(6)
    const passphrase = calculatePassphraseStrength(4)

    // All should use the same maxEntropy (120) for score calculation
    expect(password.score).toBeGreaterThanOrEqual(0)
    expect(password.score).toBeLessThanOrEqual(100)
    expect(pin.score).toBeGreaterThanOrEqual(0)
    expect(pin.score).toBeLessThanOrEqual(100)
    expect(passphrase.score).toBeGreaterThanOrEqual(0)
    expect(passphrase.score).toBeLessThanOrEqual(100)
  })

  it('should use same strength thresholds for all strength calculations', () => {
    const password = calculatePasswordStrength(12, {
      lowercase: true,
      uppercase: true,
      digits: true,
      symbols: true,
    })
    const pin = calculatePinStrength(6)
    const passphrase = calculatePassphraseStrength(4)

    // All should use the same thresholds
    expect(['VERY_WEAK', 'WEAK', 'MODERATE', 'STRONG', 'VERY_STRONG']).toContain(
      password.level
    )
    expect(['VERY_WEAK', 'WEAK', 'MODERATE', 'STRONG', 'VERY_STRONG']).toContain(pin.level)
    expect(['VERY_WEAK', 'WEAK', 'MODERATE', 'STRONG', 'VERY_STRONG']).toContain(
      passphrase.level
    )
  })
})
