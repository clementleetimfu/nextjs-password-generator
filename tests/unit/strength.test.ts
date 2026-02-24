import { describe, it, expect } from 'vitest'
import {
  calculatePasswordStrength,
  calculatePinStrength,
  calculatePassphraseStrength,
} from '@/lib/strength'

describe('strength library', () => {
  describe('password strength', () => {
    it('returns valid result shape for password', () => {
      const r = calculatePasswordStrength(12, {
        lowercase: true,
        uppercase: true,
        digits: true,
        symbols: true,
      })

      expect(r).toHaveProperty('level')
      expect(r.score).toBeGreaterThanOrEqual(0)
      expect(r.score).toBeLessThanOrEqual(100)
      expect(r.entropy).toBeGreaterThan(0)
    })

    it('password score generally increases with length', () => {
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
      expect(long.entropy).toBeGreaterThan(short.entropy)
    })

    it('password score generally increases with character variety', () => {
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
      expect(complex.entropy).toBeGreaterThan(simple.entropy)
    })

    it('handles edge case with all character sets disabled', () => {
      const r = calculatePasswordStrength(12, {
        lowercase: false,
        uppercase: false,
        digits: false,
        symbols: false,
      })

      expect(r.score).toBe(0)
    })

    it('VERY_WEAK threshold: score < 20', () => {
      const r = calculatePasswordStrength(4, {
        lowercase: true,
        uppercase: false,
        digits: false,
        symbols: false,
      })

      expect(r.level).toBe('VERY_WEAK')
      expect(r.score).toBeLessThan(20)
    })

    it('WEAK threshold: score >= 20 and < 40', () => {
      const r = calculatePasswordStrength(8, {
        lowercase: true,
        uppercase: true,
        digits: false,
        symbols: false,
      })

      expect(r.level).toBe('WEAK')
      expect(r.score).toBeGreaterThanOrEqual(20)
      expect(r.score).toBeLessThan(40)
    })

    it('MODERATE threshold: score >= 40 and < 60', () => {
      const r = calculatePasswordStrength(11, {
        lowercase: true,
        uppercase: true,
        digits: true,
        symbols: false,
      })

      expect(r.level).toBe('MODERATE')
      expect(r.score).toBeGreaterThanOrEqual(40)
      expect(r.score).toBeLessThan(60)
    })

    it('STRONG threshold: score >= 60 and < 80', () => {
      const r = calculatePasswordStrength(14, {
        lowercase: true,
        uppercase: true,
        digits: true,
        symbols: true,
      })

      expect(r.level).toBe('STRONG')
      expect(r.score).toBeGreaterThanOrEqual(60)
      expect(r.score).toBeLessThan(80)
    })

    it('VERY_STRONG threshold: score >= 80', () => {
      const r = calculatePasswordStrength(18, {
        lowercase: true,
        uppercase: true,
        digits: true,
        symbols: true,
      })

      expect(r.level).toBe('VERY_STRONG')
      expect(r.score).toBeGreaterThanOrEqual(80)
    })

    it('handles minimum length', () => {
      const r = calculatePasswordStrength(1, {
        lowercase: true,
        uppercase: false,
        digits: false,
        symbols: false,
      })

      expect(r.level).toBe('VERY_WEAK')
      expect(r.score).toBeLessThan(20)
    })

    it('handles single character set - lowercase only', () => {
      const r = calculatePasswordStrength(12, {
        lowercase: true,
        uppercase: false,
        digits: false,
        symbols: false,
      })

      expect(r.entropy).toBeGreaterThan(0)
      expect(r.score).toBeLessThan(100)
    })

    it('handles single character set - digits only', () => {
      const r = calculatePasswordStrength(12, {
        lowercase: false,
        uppercase: false,
        digits: true,
        symbols: false,
      })

      expect(r.entropy).toBeGreaterThan(0)
      expect(r.score).toBeLessThan(100)
    })

    it('handles single character set - symbols only', () => {
      const r = calculatePasswordStrength(12, {
        lowercase: false,
        uppercase: false,
        digits: false,
        symbols: true,
      })

      expect(r.entropy).toBeGreaterThan(0)
      expect(r.score).toBeLessThan(100)
    })

    it('handles two character sets combination', () => {
      const r = calculatePasswordStrength(12, {
        lowercase: true,
        uppercase: true,
        digits: false,
        symbols: false,
      })

      expect(r.entropy).toBeGreaterThan(0)
      expect(r.score).toBeLessThan(100)
    })

    it('handles three character sets combination', () => {
      const r = calculatePasswordStrength(12, {
        lowercase: true,
        uppercase: true,
        digits: true,
        symbols: false,
      })

      expect(r.entropy).toBeGreaterThan(0)
      expect(r.score).toBeLessThan(100)
    })

    it('entropy caps at 120 for score calculation', () => {
      const r = calculatePasswordStrength(50, {
        lowercase: true,
        uppercase: true,
        digits: true,
        symbols: true,
      })

      expect(r.score).toBeLessThanOrEqual(100)
    })

    it('entropy is rounded to 2 decimal places', () => {
      const r = calculatePasswordStrength(12, {
        lowercase: true,
        uppercase: true,
        digits: true,
        symbols: true,
      })

      const decimalPlaces = r.entropy.toString().split('.')[1]?.length || 0
      expect(decimalPlaces).toBeLessThanOrEqual(2)
    })
  })

  describe('PIN strength', () => {
    it('pin strength scales with length', () => {
      const short = calculatePinStrength(4)
      const long = calculatePinStrength(20)

      expect(long.score).toBeGreaterThan(short.score)
      expect(long.entropy).toBeGreaterThan(short.entropy)
    })

    it('PIN uses character set size of 10', () => {
      const r = calculatePinStrength(4)

      expect(r.entropy).toBeCloseTo(4 * Math.log2(10), 2)
    })

    it('PIN minimum length is VERY_WEAK', () => {
      const r = calculatePinStrength(4)

      expect(r.level).toBe('VERY_WEAK')
      expect(r.score).toBeLessThan(20)
    })

    it('PIN of 8 digits is WEAK', () => {
      const r = calculatePinStrength(8)

      expect(r.level).toBe('WEAK')
      expect(r.score).toBeGreaterThanOrEqual(20)
      expect(r.score).toBeLessThan(40)
    })

    it('PIN of 12 digits is WEAK', () => {
      const r = calculatePinStrength(12)

      expect(r.level).toBe('WEAK')
      expect(r.score).toBeGreaterThanOrEqual(20)
      expect(r.score).toBeLessThan(40)
    })

    it('PIN of 14 digits is WEAK', () => {
      const r = calculatePinStrength(14)

      expect(r.level).toBe('WEAK')
      expect(r.score).toBeGreaterThanOrEqual(20)
      expect(r.score).toBeLessThan(40)
    })

    it('PIN of 16 digits is MODERATE', () => {
      const r = calculatePinStrength(16)

      expect(r.level).toBe('MODERATE')
      expect(r.score).toBeGreaterThanOrEqual(40)
      expect(r.score).toBeLessThan(60)
    })

    it('PIN of 18 digits is MODERATE', () => {
      const r = calculatePinStrength(18)

      expect(r.level).toBe('MODERATE')
      expect(r.score).toBeGreaterThanOrEqual(40)
      expect(r.score).toBeLessThan(60)
    })

    it('PIN of 20 digits is MODERATE', () => {
      const r = calculatePinStrength(20)

      expect(r.level).toBe('MODERATE')
      expect(r.score).toBeGreaterThanOrEqual(40)
      expect(r.score).toBeLessThan(60)
    })

    it('PIN of 24 digits is STRONG', () => {
      const r = calculatePinStrength(24)

      expect(r.level).toBe('STRONG')
      expect(r.score).toBeGreaterThanOrEqual(60)
      expect(r.score).toBeLessThan(80)
    })

    it('PIN of 32 digits is VERY_STRONG', () => {
      const r = calculatePinStrength(32)

      expect(r.level).toBe('VERY_STRONG')
      expect(r.score).toBeGreaterThanOrEqual(80)
    })

    it('handles PIN length of 1', () => {
      const r = calculatePinStrength(1)

      expect(r.level).toBe('VERY_WEAK')
      expect(r.score).toBeLessThan(20)
    })
  })

  describe('passphrase strength', () => {
    it('passphrase strength scales with word count', () => {
      const short = calculatePassphraseStrength(4)
      const long = calculatePassphraseStrength(10)

      expect(long.score).toBeGreaterThan(short.score)
      expect(long.entropy).toBeGreaterThan(short.entropy)
    })

    it('passphrase uses word set size of 7776', () => {
      const r = calculatePassphraseStrength(4)

      expect(r.entropy).toBeCloseTo(4 * Math.log2(7776), 2)
    })

    it('passphrase of 3 words is WEAK', () => {
      const r = calculatePassphraseStrength(3)

      expect(r.level).toBe('WEAK')
      expect(r.score).toBeGreaterThanOrEqual(20)
      expect(r.score).toBeLessThan(40)
    })

    it('passphrase of 4 words is MODERATE', () => {
      const r = calculatePassphraseStrength(4)

      expect(r.level).toBe('MODERATE')
      expect(r.score).toBeGreaterThanOrEqual(40)
      expect(r.score).toBeLessThan(60)
    })

    it('passphrase of 5 words is MODERATE', () => {
      const r = calculatePassphraseStrength(5)

      expect(r.level).toBe('MODERATE')
      expect(r.score).toBeGreaterThanOrEqual(40)
      expect(r.score).toBeLessThan(60)
    })

    it('passphrase of 6 words is STRONG', () => {
      const r = calculatePassphraseStrength(6)

      expect(r.level).toBe('STRONG')
      expect(r.score).toBeGreaterThanOrEqual(60)
      expect(r.score).toBeLessThan(80)
    })

    it('passphrase of 7 words is STRONG', () => {
      const r = calculatePassphraseStrength(7)

      expect(r.level).toBe('STRONG')
      expect(r.score).toBeGreaterThanOrEqual(60)
      expect(r.score).toBeLessThan(80)
    })

    it('passphrase of 8 words is VERY_STRONG', () => {
      const r = calculatePassphraseStrength(8)

      expect(r.level).toBe('VERY_STRONG')
      expect(r.score).toBeGreaterThanOrEqual(80)
    })

    it('handles minimum word count of 1', () => {
      const r = calculatePassphraseStrength(1)

      expect(r.level).toBe('VERY_WEAK')
      expect(r.score).toBeLessThan(20)
    })

    it('passphrase entropy caps at 120 for score calculation', () => {
      const r = calculatePassphraseStrength(10)

      expect(r.score).toBeLessThanOrEqual(100)
    })
  })
})
