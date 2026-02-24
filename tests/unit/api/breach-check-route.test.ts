import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { GET } from '@/api/breach-check/route';

vi.mock('next/server', () => {
  class MockNextResponse {
    private _body: string;
    status: number;
    headers: Headers;

    constructor(body: string, options?: { status?: number; headers?: HeadersInit }) {
      this._body = body;
      this.status = options?.status || 200;
      this.headers = new Headers(options?.headers);
    }

    json() {
      return Promise.resolve(JSON.parse(this._body));
    }
    text() {
      return Promise.resolve(this._body);
    }
  }

  return {
    NextResponse: Object.assign(MockNextResponse, {
      json: vi.fn((data, options) => new MockNextResponse(JSON.stringify(data), options)),
    }),
  };
});

const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('Breach Check API Route', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('GET /api/breach-check', () => {
    it('returns 400 when hash prefix is missing', async () => {
      const request = new Request('http://localhost/api/breach-check');
      const response = await GET(request);

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data).toEqual({ error: 'Missing hash prefix' });
    });

    it('returns 400 when hash parameter is empty', async () => {
      const request = new Request('http://localhost/api/breach-check?hash=');
      const response = await GET(request);

      expect(response.status).toBe(400);
    });

    it('calls HIBP API with correct hash prefix', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve('suffix1:5\nsuffix2:10'),
      });

      const request = new Request('http://localhost/api/breach-check?hash=ABCDE');
      await GET(request);

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.pwnedpasswords.com/range/ABCDE',
        expect.objectContaining({
          headers: expect.objectContaining({
            'User-Agent': 'Password-Generator',
            'Add-Padding': 'true',
          }),
        })
      );
    });

    it('returns HIBP API response on success', async () => {
      const hibpResponse = 'suffix1:5\nsuffix2:10\nsuffix3:0';
      mockFetch.mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve(hibpResponse),
      });

      const request = new Request('http://localhost/api/breach-check?hash=ABCDE');
      const response = await GET(request);

      const data = await response.text();
      expect(data).toBe(hibpResponse);
    });

    it('returns error status when HIBP API fails', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 429,
      });

      const request = new Request('http://localhost/api/breach-check?hash=ABCDE');
      const response = await GET(request);

      expect(response.status).toBe(429);
    });

    it('returns 500 when fetch throws an error', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const request = new Request('http://localhost/api/breach-check?hash=ABCDE');
      const response = await GET(request);

      expect(response.status).toBe(500);
      const data = await response.json();
      expect(data).toEqual({ error: 'Failed to fetch from HIBP API' });
    });

    it('includes User-Agent header in request', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve(''),
      });

      const request = new Request('http://localhost/api/breach-check?hash=ABCDE');
      await GET(request);

      const fetchCall = mockFetch.mock.calls[0];
      expect(fetchCall[1].headers['User-Agent']).toBe('Password-Generator');
    });

    it('includes Add-Padding header in request', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve(''),
      });

      const request = new Request('http://localhost/api/breach-check?hash=ABCDE');
      await GET(request);

      const fetchCall = mockFetch.mock.calls[0];
      expect(fetchCall[1].headers['Add-Padding']).toBe('true');
    });

    it('handles valid hash prefix format', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve('suffix:1'),
      });

      const request = new Request('http://localhost/api/breach-check?hash=A1B2C3');
      const response = await GET(request);

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('A1B2C3'),
        expect.any(Object)
      );
    });
  });
});
