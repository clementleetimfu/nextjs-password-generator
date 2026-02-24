import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { checkBreach, clearBreachCache } from '@/lib/breach-check';
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
      const hashPrefix = '5BAA6';
      
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
      const hashPrefix = '5BAA6';
      const hashSuffix = '1E4C9B93F3F0682250B6CF8331B7EE68FD8';
      
      (global.fetch as any).mockResolvedValue({
        ok: true,
        status: 200,
        text: async () => '',
      });
      
      await checkBreach('password');
      
      const fetchCall = (global.fetch as any).mock.calls[0];
      expect(fetchCall[0]).toContain(hashPrefix);
      expect(fetchCall[0]).not.toContain(hashSuffix);
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

