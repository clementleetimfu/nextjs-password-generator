import { vi } from 'vitest'
import { generatePassword } from '@/lib/crypto'
import { CHARACTER_SETS, PASSWORD_CONSTRAINTS } from '@/lib/crypto'

describe('generatePassword', () => {
  beforeEach(() => {
    // Reset random seed for consistent testing
    vi.spyOn(Math, 'random').mockReturnValue(0.5)
  })

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
