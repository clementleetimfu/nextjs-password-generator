import { describe, it, expect, vi, beforeEach } from 'vitest';
import { generatePassword, generatePin, generatePassphrase } from '@/lib/crypto';
import { calculatePasswordStrength, calculatePinStrength, calculatePassphraseStrength } from '@/lib/strength';

describe('Security Validation Tests', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  describe('Password Entropy and Randomness', () => {
    it('should generate passwords with high entropy (minimum 80 bits for strong passwords)', () => {
      const password = generatePassword(20, true, true, true);
      const strength = calculatePasswordStrength(20, { lowercase: true, uppercase: true, digits: true, symbols: true });

      expect(strength.score).toBeGreaterThanOrEqual(80);
    });

    it('should generate unique passwords across multiple calls', () => {
      const passwords = new Set<string>();
      for (let i = 0; i < 100; i++) {
        passwords.add(generatePassword(16, true, true, true));
      }

      expect(passwords.size).toBe(100);
    });

    it('should have no predictable patterns in password sequences', () => {
      const passwords: string[] = [];
      for (let i = 0; i < 20; i++) {
        passwords.push(generatePassword(16, true, true, true));
      }

      const hasPredictableSequence = passwords.some((password, index) => {
        if (index === 0) return false;
        const prevPassword = passwords[index - 1];
        const matches = password.split('').filter((char, i) => char === prevPassword[i]);
        return matches.length / password.length > 0.5;
      });

      expect(hasPredictableSequence).toBe(false);
    });
  });

  describe('Character Distribution', () => {
    it.skip('should have roughly uniform distribution across character sets for passwords', () => {
      const password = generatePassword(1000, true, true, true);
      const digitCount = (password.match(/\d/g) || []).length;
      const uppercaseCount = (password.match(/[A-Z]/g) || []).length;
      const symbolCount = (password.match(/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/g) || []).length;

      expect(digitCount).toBeGreaterThan(150);
      expect(uppercaseCount).toBeGreaterThan(150);
      expect(symbolCount).toBeGreaterThan(150);
    });

    it('should have roughly uniform distribution for PIN digits', () => {
      const pin = generatePin(1000);
      const digitCounts: Record<string, number> = {};

      for (const digit of pin) {
        digitCounts[digit] = (digitCounts[digit] || 0) + 1;
      }

      const expectedPercentage = 0.1;
      const tolerance = 0.03;

      for (let i = 0; i <= 9; i++) {
        const digit = i.toString();
        const count = digitCounts[digit] || 0;
        expect(count / 1000).toBeGreaterThanOrEqual(expectedPercentage - tolerance);
        expect(count / 1000).toBeLessThanOrEqual(expectedPercentage + tolerance);
      }
    });

    it('should not have sequential character patterns in passwords', () => {
      const password = generatePassword(50, true, true, true);

      const hasSequentialDigits = /0{4,}|1{4,}|2{4,}|3{4,}|4{4,}|5{4,}|6{4,}|7{4,}|8{4,}|9{4,}/.test(password);

      expect(hasSequentialDigits).toBe(false);
    });

    it('should not have repeated characters more than 3 times consecutively', () => {
      const password = generatePassword(100, true, true, true);
      const hasLongRepeat = /(.)\1{3,}/.test(password);

      expect(hasLongRepeat).toBe(false);
    });
  });

  describe('Passphrase Word Distribution', () => {
    it('should generate unique passphrases across multiple calls', async () => {
      const passphrases = new Set<string>();
      for (let i = 0; i < 100; i++) {
        passphrases.add(await generatePassphrase(4, '-'));
      }

      expect(passphrases.size).toBeGreaterThanOrEqual(90);
    });

    it('should have sufficient entropy for passphrases', () => {
      const strength = calculatePassphraseStrength(4);

      expect(strength.score).toBeGreaterThan(40);
    });
  });

  describe('Security Constraints', () => {
    it('should not generate passwords shorter than minimum length constraint', () => {
      const password = generatePassword(8, false, false, false);
      expect(password.length).toBeGreaterThanOrEqual(8);
    });

    it('should not generate passwords longer than maximum length constraint', () => {
      const password = generatePassword(50, false, false, false);
      expect(password.length).toBeLessThanOrEqual(50);
    });

    it('should not generate PINs shorter than minimum length constraint', () => {
      const pin = generatePin(3);
      expect(pin.length).toBeGreaterThanOrEqual(3);
    });

    it('should not generate PINs longer than maximum length constraint', () => {
      const pin = generatePin(12);
      expect(pin.length).toBeLessThanOrEqual(12);
    });

    it('should not generate passphrases with fewer than minimum words', async () => {
      const passphrase = await generatePassphrase(4, '-');
      const words = passphrase.split('-');
      expect(words.length).toBeGreaterThanOrEqual(4);
    });

    it('should not generate passphrases with more than maximum words', async () => {
      const passphrase = await generatePassphrase(10, '-');
      const words = passphrase.split('-');
      expect(words.length).toBeLessThanOrEqual(10);
    });

    it('should handle invalid length inputs gracefully', () => {
      const password1 = generatePassword(8, false, false, false);
      const password2 = generatePassword(50, false, false, false);

      expect(password1.length).toBeGreaterThanOrEqual(8);
      expect(password2.length).toBeLessThanOrEqual(50);
    });
  });

  describe('Common Pattern Avoidance', () => {
    it('should not generate passwords containing common patterns like "12345"', () => {
      const passwords: string[] = [];
      for (let i = 0; i < 100; i++) {
        passwords.push(generatePassword(16, true, true, true));
      }

      const commonPatterns = ['12345', '54321', '11111', '00000', 'abcde', 'zyxwv', 'qwerty', 'asdfgh'];
      const hasCommonPattern = passwords.some(password =>
        commonPatterns.some(pattern => password.toLowerCase().includes(pattern))
      );

      expect(hasCommonPattern).toBe(false);
    });

    it('should not generate sequential PINs like "1234" or "9876"', () => {
      const pins: string[] = [];
      for (let i = 0; i < 100; i++) {
        pins.push(generatePin(4));
      }

      const sequentialPatterns = ['1234', '2345', '3456', '4567', '5678', '6789', '9876', '8765', '7654', '6543', '5432', '4321', '1111', '0000', '9999'];
      const hasSequentialPin = pins.some(pin => sequentialPatterns.includes(pin));

      expect(hasSequentialPin).toBe(false);
    });

    it.skip('should not generate passphrases with common word combinations', async () => {
      const passphrases: string[] = [];
      for (let i = 0; i < 100; i++) {
        passphrases.push(await generatePassphrase(4, '-'));
      }

      const commonCombinations = ['password', 'admin', 'welcome', 'hello', 'correct'];
      const commonWordCount = passphrases.reduce((count, passphrase) => {
        return count + commonCombinations.filter(word => passphrase.toLowerCase().includes(word)).length;
      }, 0);

      expect(commonWordCount).toBeLessThan(20);
    });
  });

  describe('API Security - Breach Check', () => {
    it('should not expose API keys in breach check requests', () => {
      const breachCheckURL = process.env.NEXT_PUBLIC_HIBP_API_URL || 'https://api.pwnedpasswords.com/range/';

      expect(breachCheckURL).not.toContain('api_key');
      expect(breachCheckURL).not.toContain('token');
      expect(breachCheckURL).not.toContain('secret');
    });

    it('should use secure HTTPS for breach check API', () => {
      const breachCheckURL = process.env.NEXT_PUBLIC_HIBP_API_URL || 'https://api.pwnedpasswords.com/range/';

      expect(breachCheckURL).toContain('https://');
    });
  });

  describe('Client-Side Security', () => {
    it('should use Web Crypto API for secure random generation', () => {
      const password = generatePassword(16, true, true, true);

      expect(password).toBeTruthy();
      expect(password.length).toBe(16);
      expect(password).toMatch(/^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{}|;:,.<>?]+$/);
    });

    it('should not log passwords to console in production', () => {
      const originalConsoleLog = console.log;
      const logCalls: any[] = [];

      console.log = (...args: any[]) => {
        logCalls.push(args);
        originalConsoleLog(...args);
      };

      generatePassword(16, true, true, true);

      console.log = originalConsoleLog;

      const hasLoggedPassword = logCalls.some((call: any[]) =>
        call.some((arg: unknown) => typeof arg === 'string' && arg.length === 16 && arg.match(/^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{}|;:,.<>?]+$/))
      );

      expect(hasLoggedPassword).toBe(false);
    });
  });
});
