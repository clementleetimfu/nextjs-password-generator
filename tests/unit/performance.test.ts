import { describe, it, expect } from 'vitest';
import { generatePassword, generatePin, generatePassphrase, PERFORMANCE_TARGETS } from '@/lib/crypto';
import { calculatePasswordStrength, calculatePinStrength, calculatePassphraseStrength } from '@/lib/strength';

describe('Performance Benchmark Tests', () => {
  describe('Password Generation Performance', () => {
    it('should generate short passwords within target time', () => {
      const start = performance.now();
      generatePassword(8, false, false, false);
      const duration = performance.now() - start;

      expect(duration).toBeLessThan(PERFORMANCE_TARGETS.GENERATION_TIME_MS);
    });

    it('should generate medium passwords within target time', () => {
      const start = performance.now();
      generatePassword(20, true, true, true);
      const duration = performance.now() - start;

      expect(duration).toBeLessThan(PERFORMANCE_TARGETS.GENERATION_TIME_MS);
    });

    it('should generate long passwords within target time', () => {
      const start = performance.now();
      generatePassword(50, true, true, true);
      const duration = performance.now() - start;

      expect(duration).toBeLessThan(PERFORMANCE_TARGETS.GENERATION_TIME_MS);
    });

    it('should generate 100 passwords in less than 500ms', () => {
      const start = performance.now();

      for (let i = 0; i < 100; i++) {
        generatePassword(16, true, true, true);
      }

      const duration = performance.now() - start;

      expect(duration).toBeLessThan(500);
    });

    it('should generate 1000 passwords in less than 2000ms', () => {
      const start = performance.now();

      for (let i = 0; i < 1000; i++) {
        generatePassword(16, true, true, true);
      }

      const duration = performance.now() - start;

      expect(duration).toBeLessThan(2000);
    });
  });

  describe('PIN Generation Performance', () => {
    it('should generate short PINs within target time', () => {
      const start = performance.now();
      generatePin(3);
      const duration = performance.now() - start;

      expect(duration).toBeLessThan(PERFORMANCE_TARGETS.GENERATION_TIME_MS);
    });

    it('should generate medium PINs within target time', () => {
      const start = performance.now();
      generatePin(6);
      const duration = performance.now() - start;

      expect(duration).toBeLessThan(PERFORMANCE_TARGETS.GENERATION_TIME_MS);
    });

    it('should generate long PINs within target time', () => {
      const start = performance.now();
      generatePin(12);
      const duration = performance.now() - start;

      expect(duration).toBeLessThan(PERFORMANCE_TARGETS.GENERATION_TIME_MS);
    });

    it('should generate 100 PINs in less than 500ms', () => {
      const start = performance.now();

      for (let i = 0; i < 100; i++) {
        generatePin(6);
      }

      const duration = performance.now() - start;

      expect(duration).toBeLessThan(500);
    });

    it('should generate 1000 PINs in less than 2000ms', () => {
      const start = performance.now();

      for (let i = 0; i < 1000; i++) {
        generatePin(6);
      }

      const duration = performance.now() - start;

      expect(duration).toBeLessThan(2000);
    });
  });

  describe('Passphrase Generation Performance', () => {
    it('should generate short passphrases within target time', async () => {
      const start = performance.now();
      await generatePassphrase(4, '-');
      const duration = performance.now() - start;

      expect(duration).toBeLessThan(PERFORMANCE_TARGETS.GENERATION_TIME_MS);
    });

    it('should generate medium passphrases within target time', async () => {
      const start = performance.now();
      await generatePassphrase(6, '-');
      const duration = performance.now() - start;

      expect(duration).toBeLessThan(PERFORMANCE_TARGETS.GENERATION_TIME_MS);
    });

    it('should generate long passphrases within target time', async () => {
      const start = performance.now();
      await generatePassphrase(10, '-');
      const duration = performance.now() - start;

      expect(duration).toBeLessThan(PERFORMANCE_TARGETS.GENERATION_TIME_MS);
    });

    it('should generate 100 passphrases in less than 1000ms', async () => {
      const start = performance.now();

      for (let i = 0; i < 100; i++) {
        await generatePassphrase(4, '-');
      }

      const duration = performance.now() - start;

      expect(duration).toBeLessThan(1000);
    });

    it('should generate 1000 passphrases in less than 5000ms', async () => {
      const start = performance.now();

      for (let i = 0; i < 1000; i++) {
        await generatePassphrase(4, '-');
      }

      const duration = performance.now() - start;

      expect(duration).toBeLessThan(5000);
    });
  });

  describe('Large Batch Generation', () => {
    it('should generate 10,000 passwords within 10 seconds', () => {
      const start = performance.now();

      const passwords: string[] = [];
      for (let i = 0; i < 10000; i++) {
        passwords.push(generatePassword(16, true, true, true));
      }

      const duration = performance.now() - start;

      expect(passwords.length).toBe(10000);
      expect(duration).toBeLessThan(10000);
    });

    it('should generate 10,000 PINs within 10 seconds', () => {
      const start = performance.now();

      const pins: string[] = [];
      for (let i = 0; i < 10000; i++) {
        pins.push(generatePin(6));
      }

      const duration = performance.now() - start;

      expect(pins.length).toBe(10000);
      expect(duration).toBeLessThan(10000);
    });

    it('should generate 10,000 passphrases within 15 seconds', async () => {
      const start = performance.now();

      const passphrases: string[] = [];
      for (let i = 0; i < 10000; i++) {
        passphrases.push(await generatePassphrase(4, '-'));
      }

      const duration = performance.now() - start;

      expect(passphrases.length).toBe(10000);
      expect(duration).toBeLessThan(15000);
    });

    it('should handle rapid consecutive password generation without performance degradation', () => {
      const times: number[] = [];

      for (let i = 0; i < 50; i++) {
        const start = performance.now();
        generatePassword(16, true, true, true);
        times.push(performance.now() - start);
      }

      const avgTime = times.reduce((sum, time) => sum + time, 0) / times.length;
      const maxTime = Math.max(...times);

      expect(avgTime).toBeLessThan(PERFORMANCE_TARGETS.GENERATION_TIME_MS);
      expect(maxTime).toBeLessThan(PERFORMANCE_TARGETS.GENERATION_TIME_MS * 2);
    });

    it('should handle rapid consecutive PIN generation without performance degradation', () => {
      const times: number[] = [];

      for (let i = 0; i < 50; i++) {
        const start = performance.now();
        generatePin(6);
        times.push(performance.now() - start);
      }

      const avgTime = times.reduce((sum, time) => sum + time, 0) / times.length;
      const maxTime = Math.max(...times);

      expect(avgTime).toBeLessThan(PERFORMANCE_TARGETS.GENERATION_TIME_MS);
      expect(maxTime).toBeLessThan(PERFORMANCE_TARGETS.GENERATION_TIME_MS * 2);
    });
  });

  describe('Memory Performance', () => {
    it.skip('should not leak memory when generating many passwords', () => {
      const initialMemory = process.memoryUsage().heapUsed;

      const passwords: string[] = [];
      for (let i = 0; i < 10000; i++) {
        passwords.push(generatePassword(16, true, true, true));
      }

      const finalMemory = process.memoryUsage().heapUsed;
      const memoryIncrease = finalMemory - initialMemory;

      const expectedMemoryIncrease = 10000 * 16 * 2;

      expect(memoryIncrease).toBeLessThan(expectedMemoryIncrease * 5);
    });

    it.skip('should not leak memory when generating many PINs', () => {
      const initialMemory = process.memoryUsage().heapUsed;

      const pins: string[] = [];
      for (let i = 0; i < 10000; i++) {
        pins.push(generatePin(6));
      }

      const finalMemory = process.memoryUsage().heapUsed;
      const memoryIncrease = finalMemory - initialMemory;

      const expectedMemoryIncrease = 10000 * 6 * 2;

      expect(memoryIncrease).toBeLessThan(expectedMemoryIncrease * 5);
    });

    it.skip('should release memory after clearing large batches', () => {
      const initialMemory = process.memoryUsage().heapUsed;

      const passwords: string[] = [];
      for (let i = 0; i < 10000; i++) {
        passwords.push(generatePassword(16, true, true, true));
      }

      const afterCreation = process.memoryUsage().heapUsed;

      passwords.length = 0;

      global.gc?.();

      const afterClear = process.memoryUsage().heapUsed;

      const memoryCreated = afterCreation - initialMemory;

      expect(afterClear).toBeLessThan(afterCreation);
    });
  });

  describe('Strength Calculation Performance', () => {
    it('should calculate password strength within target time', () => {
      const start = performance.now();
      calculatePasswordStrength(20, { lowercase: true, uppercase: true, digits: true, symbols: true });
      const duration = performance.now() - start;

      expect(duration).toBeLessThan(1);
    });

    it('should calculate PIN strength within target time', () => {
      const start = performance.now();
      calculatePinStrength(6);
      const duration = performance.now() - start;

      expect(duration).toBeLessThan(1);
    });

    it('should calculate passphrase strength within target time', () => {
      const start = performance.now();
      calculatePassphraseStrength(4);
      const duration = performance.now() - start;

      expect(duration).toBeLessThan(1);
    });

    it('should calculate 1000 password strengths within 100ms', () => {
      const start = performance.now();

      for (let i = 0; i < 1000; i++) {
        calculatePasswordStrength(20, { lowercase: true, uppercase: true, digits: true, symbols: true });
      }

      const duration = performance.now() - start;

      expect(duration).toBeLessThan(100);
    });
  });

  describe('Concurrent Generation Performance', () => {
    it('should handle concurrent password generation efficiently', async () => {
      const start = performance.now();

      const promises = [];
      for (let i = 0; i < 100; i++) {
        promises.push(Promise.resolve(generatePassword(16, true, true, true)));
      }

      await Promise.all(promises);

      const duration = performance.now() - start;

      expect(duration).toBeLessThan(500);
    });

    it('should handle concurrent PIN generation efficiently', async () => {
      const start = performance.now();

      const promises = [];
      for (let i = 0; i < 100; i++) {
        promises.push(Promise.resolve(generatePin(6)));
      }

      await Promise.all(promises);

      const duration = performance.now() - start;

      expect(duration).toBeLessThan(500);
    });

    it('should handle concurrent passphrase generation efficiently', async () => {
      const start = performance.now();

      const promises = [];
      for (let i = 0; i < 100; i++) {
        promises.push(generatePassphrase(4, '-'));
      }

      await Promise.all(promises);

      const duration = performance.now() - start;

      expect(duration).toBeLessThan(1000);
    });
  });
});
