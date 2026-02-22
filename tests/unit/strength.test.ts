import { calculatePasswordStrength } from '../../app/lib/strength';

describe('calculatePasswordStrength', () => {
  it('should return WEAK for short passwords with only lowercase', () => {
    const result = calculatePasswordStrength(8, { lowercase: true, uppercase: false, digits: false, symbols: false });
    expect(result.level).toBe('WEAK');
    expect(result.score).toBeGreaterThanOrEqual(20);
    expect(result.score).toBeLessThan(40);
  });

  it('should return WEAK for passwords with lowercase and digits', () => {
    const result = calculatePasswordStrength(8, { lowercase: true, uppercase: false, digits: true, symbols: false });
    expect(result.level).toBe('WEAK');
    expect(result.score).toBeGreaterThanOrEqual(20);
    expect(result.score).toBeLessThan(40);
  });

  it('should return MODERATE for passwords with lowercase, uppercase, and digits', () => {
    const result = calculatePasswordStrength(12, { lowercase: true, uppercase: true, digits: true, symbols: false });
    expect(result.level).toBe('MODERATE');
    expect(result.score).toBeGreaterThanOrEqual(40);
    expect(result.score).toBeLessThanOrEqual(60);
  });

  it('should return VERY_STRONG for passwords with all character types and good length', () => {
    const result = calculatePasswordStrength(16, { lowercase: true, uppercase: true, digits: true, symbols: true });
    expect(result.level).toBe('VERY_STRONG');
    expect(result.score).toBeGreaterThanOrEqual(80);
  });

  it('should return VERY_STRONG for long passwords with all character types', () => {
    const result = calculatePasswordStrength(32, { lowercase: true, uppercase: true, digits: true, symbols: true });
    expect(result.level).toBe('VERY_STRONG');
    expect(result.score).toBeGreaterThanOrEqual(80);
  });

  it('should increase score with longer passwords', () => {
    const short = calculatePasswordStrength(8, { lowercase: true, uppercase: true, digits: true, symbols: true });
    const long = calculatePasswordStrength(24, { lowercase: true, uppercase: true, digits: true, symbols: true });
    expect(long.score).toBeGreaterThan(short.score);
  });

  it('should increase score with more character types', () => {
    const simple = calculatePasswordStrength(12, { lowercase: true, uppercase: false, digits: false, symbols: false });
    const complex = calculatePasswordStrength(12, { lowercase: true, uppercase: true, digits: true, symbols: true });
    expect(complex.score).toBeGreaterThan(simple.score);
  });

  it('should calculate entropy correctly for character set size', () => {
    const lowercaseOnly = calculatePasswordStrength(12, { lowercase: true, uppercase: false, digits: false, symbols: false });
    const allTypes = calculatePasswordStrength(12, { lowercase: true, uppercase: true, digits: true, symbols: true });
    
    // Lowercase only: 26^12
    // All types: (26+26+10+32)^12 = 94^12
    // All types should have much higher entropy
    expect(allTypes.entropy).toBeGreaterThan(lowercaseOnly.entropy);
  });

  it('should handle minimum length (8 characters)', () => {
    const result = calculatePasswordStrength(8, { lowercase: true, uppercase: true, digits: true, symbols: true });
    expect(result.level).toBeDefined();
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(100);
  });

  it('should handle maximum length (50 characters)', () => {
    const result = calculatePasswordStrength(50, { lowercase: true, uppercase: true, digits: true, symbols: true });
    expect(result.level).toBe('VERY_STRONG');
    expect(result.score).toBeGreaterThanOrEqual(80);
  });
});
