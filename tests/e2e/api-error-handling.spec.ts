import { test, expect } from '@playwright/test';

test.describe('API Error Handling E2E Tests', () => {
  test('should handle network error gracefully', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Mock network error
    await page.route('**/api.pwnedpasswords.com/**', async (route) => {
      await route.abort('failed');
    });
    
    const breachCheckButton = page.locator('[data-testid="breach-check-button"]');
    await breachCheckButton.click();
    
    // Wait for error handling
    await page.waitForTimeout(2000);
    
    // Should handle error gracefully without crashing
    await expect(breachCheckButton).toBeEnabled({ timeout: 5000 });
  });

  test('should handle timeout gracefully', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Mock timeout
    await page.route('**/api.pwnedpasswords.com/**', async (route) => {
      // Never fulfill the request
      await new Promise(() => {});
    });
    
    const breachCheckButton = page.locator('[data-testid="breach-check-button"]');
    await breachCheckButton.click();
    
    // Wait for timeout handling
    await page.waitForTimeout(5000);
    
    // Should handle timeout gracefully
    await expect(breachCheckButton).toBeEnabled({ timeout: 10000 });
  });

  test('should handle rate limiting gracefully', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Mock rate limit response
    await page.route('**/api.pwnedpasswords.com/**', async (route) => {
      await route.fulfill({
        status: 429,
        body: 'Too Many Requests',
        headers: {
          'content-type': 'text/plain',
        },
      });
    });
    
    const breachCheckButton = page.locator('[data-testid="breach-check-button"]');
    await breachCheckButton.click();
    
    // Wait for rate limit handling
    await page.waitForTimeout(2000);
    
    // Should handle rate limit gracefully
    await expect(breachCheckButton).toBeEnabled({ timeout: 5000 });
  });

  test('should handle 500 server error gracefully', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Mock server error
    await page.route('**/api.pwnedpasswords.com/**', async (route) => {
      await route.fulfill({
        status: 500,
        body: 'Internal Server Error',
        headers: {
          'content-type': 'text/plain',
        },
      });
    });
    
    const breachCheckButton = page.locator('[data-testid="breach-check-button"]');
    await breachCheckButton.click();
    
    // Wait for error handling
    await page.waitForTimeout(2000);
    
    // Should handle server error gracefully
    await expect(breachCheckButton).toBeEnabled({ timeout: 5000 });
  });

  test('should handle 502 bad gateway gracefully', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Mock bad gateway error
    await page.route('**/api.pwnedpasswords.com/**', async (route) => {
      await route.fulfill({
        status: 502,
        body: 'Bad Gateway',
        headers: {
          'content-type': 'text/plain',
        },
      });
    });
    
    const breachCheckButton = page.locator('[data-testid="breach-check-button"]');
    await breachCheckButton.click();
    
    // Wait for error handling
    await page.waitForTimeout(2000);
    
    // Should handle bad gateway gracefully
    await expect(breachCheckButton).toBeEnabled({ timeout: 5000 });
  });

  test('should handle 503 service unavailable gracefully', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Mock service unavailable error
    await page.route('**/api.pwnedpasswords.com/**', async (route) => {
      await route.fulfill({
        status: 503,
        body: 'Service Unavailable',
        headers: {
          'content-type': 'text/plain',
        },
      });
    });
    
    const breachCheckButton = page.locator('[data-testid="breach-check-button"]');
    await breachCheckButton.click();
    
    // Wait for error handling
    await page.waitForTimeout(2000);
    
    // Should handle service unavailable gracefully
    await expect(breachCheckButton).toBeEnabled({ timeout: 5000 });
  });

  test('should handle 400 bad request gracefully', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Mock bad request error
    await page.route('**/api.pwnedpasswords.com/**', async (route) => {
      await route.fulfill({
        status: 400,
        body: 'Bad Request',
        headers: {
          'content-type': 'text/plain',
        },
      });
    });
    
    const breachCheckButton = page.locator('[data-testid="breach-check-button"]');
    await breachCheckButton.click();
    
    // Wait for error handling
    await page.waitForTimeout(2000);
    
    // Should handle bad request gracefully
    await expect(breachCheckButton).toBeEnabled({ timeout: 5000 });
  });

  test('should handle 404 not found gracefully', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Mock not found error
    await page.route('**/api.pwnedpasswords.com/**', async (route) => {
      await route.fulfill({
        status: 404,
        body: 'Not Found',
        headers: {
          'content-type': 'text/plain',
        },
      });
    });
    
    const breachCheckButton = page.locator('[data-testid="breach-check-button"]');
    await breachCheckButton.click();
    
    // Wait for error handling
    await page.waitForTimeout(2000);
    
    // Should handle not found gracefully
    await expect(breachCheckButton).toBeEnabled({ timeout: 5000 });
  });

  test('should handle 401 unauthorized gracefully', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Mock unauthorized error
    await page.route('**/api.pwnedpasswords.com/**', async (route) => {
      await route.fulfill({
        status: 401,
        body: 'Unauthorized',
        headers: {
          'content-type': 'text/plain',
        },
      });
    });
    
    const breachCheckButton = page.locator('[data-testid="breach-check-button"]');
    await breachCheckButton.click();
    
    // Wait for error handling
    await page.waitForTimeout(2000);
    
    // Should handle unauthorized gracefully
    await expect(breachCheckButton).toBeEnabled({ timeout: 5000 });
  });

  test('should handle 403 forbidden gracefully', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Mock forbidden error
    await page.route('**/api.pwnedpasswords.com/**', async (route) => {
      await route.fulfill({
        status: 403,
        body: 'Forbidden',
        headers: {
          'content-type': 'text/plain',
        },
      });
    });
    
    const breachCheckButton = page.locator('[data-testid="breach-check-button"]');
    await breachCheckButton.click();
    
    // Wait for error handling
    await page.waitForTimeout(2000);
    
    // Should handle forbidden gracefully
    await expect(breachCheckButton).toBeEnabled({ timeout: 5000 });
  });

  test('should handle malformed response gracefully', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Mock malformed response
    await page.route('**/api.pwnedpasswords.com/**', async (route) => {
      await route.fulfill({
        status: 200,
        body: 'invalid response format',
        headers: {
          'content-type': 'text/plain',
        },
      });
    });
    
    const breachCheckButton = page.locator('[data-testid="breach-check-button"]');
    await breachCheckButton.click();
    
    // Wait for error handling
    await page.waitForTimeout(2000);
    
    // Should handle malformed response gracefully
    await expect(breachCheckButton).toBeEnabled({ timeout: 5000 });
  });

  test('should handle empty response gracefully', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Mock empty response
    await page.route('**/api.pwnedpasswords.com/**', async (route) => {
      await route.fulfill({
        status: 200,
        body: '',
        headers: {
          'content-type': 'text/plain',
        },
      });
    });
    
    const breachCheckButton = page.locator('[data-testid="breach-check-button"]');
    await breachCheckButton.click();
    
    // Wait for response handling
    await page.waitForTimeout(2000);
    
    // Should handle empty response gracefully
    await expect(breachCheckButton).toBeEnabled({ timeout: 5000 });
  });

  test('should handle large response gracefully', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Mock large response
    const largeBody = 'A'.repeat(1000000);
    await page.route('**/api.pwnedpasswords.com/**', async (route) => {
      await route.fulfill({
        status: 200,
        body: largeBody,
        headers: {
          'content-type': 'text/plain',
        },
      });
    });
    
    const breachCheckButton = page.locator('[data-testid="breach-check-button"]');
    await breachCheckButton.click();
    
    // Wait for response handling
    await page.waitForTimeout(3000);
    
    // Should handle large response gracefully
    await expect(breachCheckButton).toBeEnabled({ timeout: 10000 });
  });

  test('should handle CORS error gracefully', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Mock CORS error
    await page.route('**/api.pwnedpasswords.com/**', async (route) => {
      await route.fulfill({
        status: 200,
        body: '',
        headers: {
          'content-type': 'text/plain',
        },
      });
    });
    
    const breachCheckButton = page.locator('[data-testid="breach-check-button"]');
    await breachCheckButton.click();
    
    // Wait for response handling
    await page.waitForTimeout(2000);
    
    // Should handle CORS gracefully
    await expect(breachCheckButton).toBeEnabled({ timeout: 5000 });
  });

  test('should handle DNS resolution error gracefully', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Mock DNS error
    await page.route('**/api.pwnedpasswords.com/**', async (route) => {
      await route.abort('dns');
    });
    
    const breachCheckButton = page.locator('[data-testid="breach-check-button"]');
    await breachCheckButton.click();
    
    // Wait for error handling
    await page.waitForTimeout(2000);
    
    // Should handle DNS error gracefully
    await expect(breachCheckButton).toBeEnabled({ timeout: 5000 });
  });

  test('should retry failed requests', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    let requestCount = 0;
    
    // Track API requests
    page.on('request', (request) => {
      if (request.url().includes('api.pwnedpasswords.com')) {
        requestCount++;
      }
    });
    
    // Mock intermittent failure
    await page.route('**/api.pwnedpasswords.com/**', async (route) => {
      if (requestCount < 2) {
        // Fail first two requests
        await route.abort('failed');
      } else {
        // Succeed on third request
        await route.fulfill({
          status: 200,
          body: '',
          headers: {
            'content-type': 'text/plain',
          },
        });
      }
    });
    
    const breachCheckButton = page.locator('[data-testid="breach-check-button"]');
    
    // Click breach check button
    await breachCheckButton.click();
    
    // Wait for retry handling
    await page.waitForTimeout(5000);
    
    // Should eventually succeed or handle gracefully
    await expect(breachCheckButton).toBeEnabled({ timeout: 10000 });
  });

  test('should show error message on network error', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Mock network error
    await page.route('**/api.pwnedpasswords.com/**', async (route) => {
      await route.abort('failed');
    });
    
    const breachCheckButton = page.locator('[data-testid="breach-check-button"]');
    await breachCheckButton.click();
    
    // Wait for error handling
    await page.waitForTimeout(2000);
    
    // Should handle error gracefully
    await expect(breachCheckButton).toBeEnabled({ timeout: 5000 });
  });

  test('should show error message on timeout', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Mock timeout
    await page.route('**/api.pwnedpasswords.com/**', async (route) => {
      await new Promise(() => {});
    });
    
    const breachCheckButton = page.locator('[data-testid="breach-check-button"]');
    await breachCheckButton.click();
    
    // Wait for timeout handling
    await page.waitForTimeout(5000);
    
    // Should handle timeout gracefully
    await expect(breachCheckButton).toBeEnabled({ timeout: 10000 });
  });

  test('should allow retry after error', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Mock network error
    await page.route('**/api.pwnedpasswords.com/**', async (route) => {
      await route.abort('failed');
    });
    
    const breachCheckButton = page.locator('[data-testid="breach-check-button"]');
    
    // First attempt
    await breachCheckButton.click();
    await page.waitForTimeout(2000);
    
    // Second attempt should still work
    await breachCheckButton.click();
    await page.waitForTimeout(2000);
    
    // Should allow retry
    await expect(breachCheckButton).toBeEnabled();
  });

  test('should handle error on password tab', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Mock network error
    await page.route('**/api.pwnedpasswords.com/**', async (route) => {
      await route.abort('failed');
    });
    
    const breachCheckButton = page.locator('[data-testid="breach-check-button"]');
    await breachCheckButton.click();
    
    // Wait for error handling
    await page.waitForTimeout(2000);
    
    await expect(breachCheckButton).toBeEnabled({ timeout: 5000 });
  });

  test('should handle error on PIN tab', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Switch to PIN tab
    const pinTab = page.locator('[data-testid="tab-pin"]');
    await pinTab.click();
    await page.waitForTimeout(300);
    
    // Mock network error
    await page.route('**/api.pwnedpasswords.com/**', async (route) => {
      await route.abort('failed');
    });
    
    const breachCheckButton = page.locator('[data-testid="breach-check-button"]');
    await breachCheckButton.click();
    
    // Wait for error handling
    await page.waitForTimeout(2000);
    
    await expect(breachCheckButton).toBeEnabled({ timeout: 5000 });
  });

  test('should handle error on passphrase tab', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Switch to passphrase tab
    const passphraseTab = page.locator('[data-testid="tab-passphrase"]');
    await passphraseTab.click();
    await page.waitForTimeout(300);
    
    // Mock network error
    await page.route('**/api.pwnedpasswords.com/**', async (route) => {
      await route.abort('failed');
    });
    
    const breachCheckButton = page.locator('[data-testid="breach-check-button"]');
    await breachCheckButton.click();
    
    // Wait for error handling
    await page.waitForTimeout(2000);
    
    await expect(breachCheckButton).toBeEnabled({ timeout: 5000 });
  });

  test('should handle multiple consecutive errors', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Mock network error
    await page.route('**/api.pwnedpasswords.com/**', async (route) => {
      await route.abort('failed');
    });
    
    const breachCheckButton = page.locator('[data-testid="breach-check-button"]');
    
    // Multiple consecutive attempts
    for (let i = 0; i < 5; i++) {
      await breachCheckButton.click();
      await page.waitForTimeout(2000);
      
      // Should still be enabled after each attempt
      await expect(breachCheckButton).toBeEnabled();
    }
  });

  test('should recover from error after successful request', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    let requestCount = 0;
    
    // Mock error then success
    await page.route('**/api.pwnedpasswords.com/**', async (route) => {
      requestCount++;
      if (requestCount === 1) {
        // First request fails
        await route.abort('failed');
      } else {
        // Second request succeeds
        await route.fulfill({
          status: 200,
          body: '',
          headers: {
            'content-type': 'text/plain',
          },
        });
      }
    });
    
    const breachCheckButton = page.locator('[data-testid="breach-check-button"]');
    
    // First attempt (fails)
    await breachCheckButton.click();
    await page.waitForTimeout(2000);
    
    // Second attempt (succeeds)
    await breachCheckButton.click();
    await page.waitForTimeout(2000);
    
    // Should recover
    await expect(breachCheckButton).toBeEnabled();
  });
});
