import { describe, it, expect } from 'vitest'
import {
  calculatePasswordStrength,
  calculatePinStrength,
  calculatePassphraseStrength,
} from '@/lib/strength'

describe('strength library', () => {
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

  it('pin strength scales with length', () => {
    const short = calculatePinStrength(3)
    const long = calculatePinStrength(12)

    expect(long.score).toBeGreaterThan(short.score)
    expect(long.entropy).toBeGreaterThan(short.entropy)
  })

  it('passphrase strength scales with word count', () => {
    const short = calculatePassphraseStrength(4)
    const long = calculatePassphraseStrength(10)

    expect(long.score).toBeGreaterThan(short.score)
    expect(long.entropy).toBeGreaterThan(short.entropy)
  })
})
