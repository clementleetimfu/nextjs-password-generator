import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { sha1Hash, checkBreach, handleBreachCheckError, clearBreachCache } from '@/lib/breach-check';
import { API_CONFIG } from '@/lib/breach-check';

// Mock global fetch
global.fetch = vi.fn() as any;

describe('Breach Check Library', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    clearBreachCache();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('sha1Hash Function', () => {
    it('should generate correct SHA-1 hash', async () => {
      const hash = await sha1Hash('password');
      expect(hash).toBe('5BAA61E4C9B93F3F0682250B6CF8331B7EE68FD8');
    });

    it('should generate hash for empty string', async () => {
      const hash = await sha1Hash('');
      expect(hash).toBe('DA39A3EE5E6B4B0D3255BFEF95601890AFD80709');
    });

    it('should generate different hashes for different inputs', async () => {
      const hash1 = await sha1Hash('password1');
      const hash2 = await sha1Hash('password2');
      expect(hash1).not.toBe(hash2);
    });

    it('should generate same hash for same input', async () => {
      const hash1 = await sha1Hash('testpassword');
      const hash2 = await sha1Hash('testpassword');
      expect(hash1).toBe(hash2);
    });

    it('should handle special characters', async () => {
      const hash = await sha1Hash('p@ssw0rd!#$');
      expect(hash).toBeTruthy();
      expect(hash.length).toBe(40);
    });

    it('should handle unicode characters', async () => {
      const hash = await sha1Hash('pàsswörd123ñ');
      expect(hash).toBeTruthy();
      expect(hash.length).toBe(40);
    });

    it('should return uppercase hash', async () => {
      const hash = await sha1Hash('password');
      expect(hash).toBe(hash.toUpperCase());
    });
  });

  describe('checkBreach Function', () => {
    it('should return error for empty password', async () => {
      const result = await checkBreach('');
      expect(result.status).toBe('error');
      expect(result.error).toBe('Password cannot be empty');
    });

    it('should return safe status for non-breached password', async () => {
      const mockResponse = `001122334455:1
002233445566:2
003344556677:3`;
      
      (global.fetch as any).mockResolvedValue({
        ok: true,
        status: 200,
        text: async () => mockResponse,
      });
      
      const result = await checkBreach('uniquepassword123');
      expect(result.status).toBe('safe');
      expect(result.count).toBeUndefined();
    });

    it('should return breached status with count for breached password', async () => {
      const hashPrefix = '5BAA6';
      const hashSuffix = '1E4C9B93F3F0682250B6CF8331B7EE68FD8';
      const mockResponse = `${hashSuffix}:100`;
      
      (global.fetch as any).mockResolvedValue({
        ok: true,
        status: 200,
        text: async () => mockResponse,
      });
      
      const result = await checkBreach('password');
      expect(result.status).toBe('breached');
      expect(result.count).toBe(100);
    });

    it('should handle rate limiting (429 status)', async () => {
      (global.fetch as any).mockResolvedValue({
        ok: false,
        status: 429,
      });
      
      const result = await checkBreach('password123');
      expect(result.status).toBe('error');
      expect(result.error).toBe('Rate limit exceeded. Please try again later.');
    });

    it('should handle network errors', async () => {
      (global.fetch as any).mockRejectedValue(new Error('Network error'));
      
      const result = await checkBreach('password123');
      expect(result.status).toBe('error');
      expect(result.error).toBe('Network error');
    });

    it('should handle API errors', async () => {
      (global.fetch as any).mockResolvedValue({
        ok: false,
        status: 500,
      });
      
      const result = await checkBreach('password123');
      expect(result.status).toBe('error');
      expect(result.error).toBe('API request failed: 500');
    });

    it('should use correct API endpoint', async () => {
      const hash = await sha1Hash('password');
      const hashPrefix = hash.substring(0, 5);
      
      (global.fetch as any).mockResolvedValue({
        ok: true,
        status: 200,
        text: async () => '',
      });
      
      await checkBreach('password');
      
      expect(global.fetch).toHaveBeenCalledWith(
        `${API_CONFIG.PROXY_URL}?hash=${hashPrefix}`,
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'Content-Type': 'text/plain',
          }),
        })
      );
    });

    it('should parse response correctly', async () => {
      const hashPrefix = '5BAA6';
      const hashSuffix = '1E4C9B93F3F0682250B6CF8331B7EE68FD8';
      const mockResponse = `001122334455:10
${hashSuffix}:42
003344556677:15`;
      
      (global.fetch as any).mockResolvedValue({
        ok: true,
        status: 200,
        text: async () => mockResponse,
      });
      
      const result = await checkBreach('password');
      expect(result.status).toBe('breached');
      expect(result.count).toBe(42);
    });

    it('should handle empty response', async () => {
      (global.fetch as any).mockResolvedValue({
        ok: true,
        status: 200,
        text: async () => '',
      });
      
      const result = await checkBreach('password123');
      expect(result.status).toBe('safe');
    });

    it('should handle malformed response lines', async () => {
      const mockResponse = `invalid line
another invalid line`;
      
      (global.fetch as any).mockResolvedValue({
        ok: true,
        status: 200,
        text: async () => mockResponse,
      });
      
      const result = await checkBreach('password123');
      expect(result.status).toBe('safe');
    });
  });

  describe('Caching', () => {
    it('should cache breach check results', async () => {
      const hashPrefix = '5BAA6';
      const hashSuffix = '1E4C9B93F3F0682250B6CF8331B7EE68FD8';
      const mockResponse = `${hashSuffix}:100`;
      
      (global.fetch as any).mockResolvedValue({
        ok: true,
        status: 200,
        text: async () => mockResponse,
      });
      
      await checkBreach('password');
      expect(global.fetch).toHaveBeenCalledTimes(1);
      
      // Second call should use cache
      await checkBreach('password');
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    it('should cache error results', async () => {
      (global.fetch as any).mockRejectedValue(new Error('Network error'));
      
      await checkBreach('password123');
      expect(global.fetch).toHaveBeenCalledTimes(1);
      
      // Second call should use cache
      await checkBreach('password123');
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    it('should cache safe results', async () => {
      (global.fetch as any).mockResolvedValue({
        ok: true,
        status: 200,
        text: async () => '',
      });
      
      await checkBreach('uniquepassword');
      expect(global.fetch).toHaveBeenCalledTimes(1);
      
      // Second call should use cache
      await checkBreach('uniquepassword');
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    it('should return cached result', async () => {
      const hashPrefix = '5BAA6';
      const hashSuffix = '1E4C9B93F3F0682250B6CF8331B7EE68FD8';
      const mockResponse = `${hashSuffix}:50`;
      
      (global.fetch as any).mockResolvedValue({
        ok: true,
        status: 200,
        text: async () => mockResponse,
      });
      
      const result1 = await checkBreach('password');
      const result2 = await checkBreach('password');
      
      expect(result1).toEqual(result2);
      expect(result2.count).toBe(50);
    });
  });

  describe('clearBreachCache Function', () => {
    it('should clear the cache', async () => {
      const hashPrefix = '5BAA6';
      const hashSuffix = '1E4C9B93F3F0682250B6CF8331B7EE68FD8';
      const mockResponse = `${hashSuffix}:100`;
      
      (global.fetch as any).mockResolvedValue({
        ok: true,
        status: 200,
        text: async () => mockResponse,
      });
      
      await checkBreach('password');
      expect(global.fetch).toHaveBeenCalledTimes(1);
      
      clearBreachCache();
      
      // Should fetch again after cache clear
      await checkBreach('password');
      expect(global.fetch).toHaveBeenCalledTimes(2);
    });
  });

  describe('handleBreachCheckError Function', () => {
    it('should return message from Error object', () => {
      const error = new Error('Test error message');
      const result = handleBreachCheckError(error);
      expect(result).toBe('Test error message');
    });

    it('should return default message for non-Error objects', () => {
      const result = handleBreachCheckError('string error');
      expect(result).toBe('An unknown error occurred');
    });

    it('should return default message for null', () => {
      const result = handleBreachCheckError(null);
      expect(result).toBe('An unknown error occurred');
    });

    it('should return default message for undefined', () => {
      const result = handleBreachCheckError(undefined);
      expect(result).toBe('An unknown error occurred');
    });

    it('should return default message for object without message property', () => {
      const result = handleBreachCheckError({ custom: 'error' });
      expect(result).toBe('An unknown error occurred');
    });
  });

  describe('Edge Cases', () => {
    it('should handle very long passwords', async () => {
      const longPassword = 'a'.repeat(1000);
      
      (global.fetch as any).mockResolvedValue({
        ok: true,
        status: 200,
        text: async () => '',
      });
      
      const result = await checkBreach(longPassword);
      expect(result.status).toBe('safe');
    });

    it('should handle passwords with special characters', async () => {
      const specialPassword = '!@#$%^&*()_+-=[]{}|;:,.<>?';
      
      (global.fetch as any).mockResolvedValue({
        ok: true,
        status: 200,
        text: async () => '',
      });
      
      const result = await checkBreach(specialPassword);
      expect(result.status).toBe('safe');
    });

    it('should handle passwords with unicode', async () => {
      const unicodePassword = 'pàsswörd123ñçé';
      
      (global.fetch as any).mockResolvedValue({
        ok: true,
        status: 200,
        text: async () => '',
      });
      
      const result = await checkBreach(unicodePassword);
      expect(result.status).toBe('safe');
    });

    it('should handle zero breach count', async () => {
      const hashPrefix = '5BAA6';
      const hashSuffix = '1E4C9B93F3F0682250B6CF8331B7EE68FD8';
      const mockResponse = `${hashSuffix}:0`;
      
      (global.fetch as any).mockResolvedValue({
        ok: true,
        status: 200,
        text: async () => mockResponse,
      });
      
      const result = await checkBreach('password');
      expect(result.status).toBe('safe');
      expect(result.count).toBeUndefined();
    });

    it('should handle very large breach count', async () => {
      const hashPrefix = '5BAA6';
      const hashSuffix = '1E4C9B93F3F0682250B6CF8331B7EE68FD8';
      const mockResponse = `${hashSuffix}:999999999`;
      
      (global.fetch as any).mockResolvedValue({
        ok: true,
        status: 200,
        text: async () => mockResponse,
      });
      
      const result = await checkBreach('password');
      expect(result.status).toBe('breached');
      expect(result.count).toBe(999999999);
    });
  });

  describe('Security', () => {
    it('should only send first 5 characters of hash (k-anonymity)', async () => {
      const hash = await sha1Hash('password');
      const hashPrefix = hash.substring(0, 5);
      
      (global.fetch as any).mockResolvedValue({
        ok: true,
        status: 200,
        text: async () => '',
      });
      
      await checkBreach('password');
      
      const fetchCall = (global.fetch as any).mock.calls[0];
      expect(fetchCall[0]).toContain(hashPrefix);
      expect(fetchCall[0]).not.toContain(hash.substring(5));
    });

    it('should not send full password to API', async () => {
      const password = 'mypassword123';
      
      (global.fetch as any).mockResolvedValue({
        ok: true,
        status: 200,
        text: async () => '',
      });
      
      await checkBreach(password);
      
      const fetchCall = (global.fetch as any).mock.calls[0][0];
      expect(fetchCall).not.toContain(password);
    });
  });

  describe('Multiple Checks', () => {
    it('should handle multiple different passwords', async () => {
      (global.fetch as any).mockResolvedValue({
        ok: true,
        status: 200,
        text: async () => '',
      });
      
      await checkBreach('password1');
      await checkBreach('password2');
      await checkBreach('password3');
      
      expect(global.fetch).toHaveBeenCalledTimes(3);
    });

    it('should cache results for multiple checks', async () => {
      (global.fetch as any).mockResolvedValue({
        ok: true,
        status: 200,
        text: async () => '',
      });
      
      await checkBreach('password1');
      await checkBreach('password1');
      await checkBreach('password2');
      await checkBreach('password2');
      
      expect(global.fetch).toHaveBeenCalledTimes(2);
    });
  });
});

