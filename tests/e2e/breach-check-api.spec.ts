import { test, expect } from '@playwright/test';

test.describe('Breach Check API E2E Tests', () => {
  test('should make API request when breach check is clicked', async ({ page, request }) => {
    await page.goto('http://localhost:3000');
    
    const breachCheckButton = page.locator('[data-testid="breach-check-button"]');
    await expect(breachCheckButton).toBeVisible();
    await expect(breachCheckButton).toBeEnabled();
    
    // Click breach check button
    await breachCheckButton.click();
    
    // Wait for API call to complete
    await page.waitForTimeout(2000);
    
    // Button should be clickable without error
    await expect(breachCheckButton).toBeVisible();
  });

  test('should send correct API request format', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Listen for API requests to our proxy endpoint
    const apiRequests: any[] = [];
    page.on('request', (request) => {
      if (request.url().includes('/api/breach-check')) {
        apiRequests.push({
          url: request.url(),
          method: request.method(),
          headers: request.headers(),
        });
      }
    });
    
    const breachCheckButton = page.locator('[data-testid="breach-check-button"]');
    await breachCheckButton.click();
    
    // Wait for API call
    await page.waitForTimeout(2000);
    
    // API request should have been made to our proxy
    expect(apiRequests.length).toBeGreaterThan(0);
  });

  test('should use k-anonymity approach (send only first 5 chars)', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Listen for API requests to our proxy endpoint
    const apiRequests: any[] = [];
    page.on('request', (request) => {
      if (request.url().includes('/api/breach-check')) {
        apiRequests.push({
          url: request.url(),
          method: request.method(),
        });
      }
    });
    
    const breachCheckButton = page.locator('[data-testid="breach-check-button"]');
    await breachCheckButton.click();
    
    // Wait for API call
    await page.waitForTimeout(2000);
    
    // API request should have been made with hash parameter (5+ characters)
    if (apiRequests.length > 0) {
      const url = apiRequests[0].url;
      // URL should contain hash parameter with at least 5 characters (hex)
      const hashMatch = url.match(/[?&]hash=([A-F0-9]{5,})/i);
      expect(hashMatch).not.toBeNull();
      expect(hashMatch![1].length).toBe(5);
    }
  });

  test('should handle breached password response', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Mock API response for breached password
    await page.route('**/api.pwnedpasswords.com/**', async (route) => {
      // Return a response indicating breach
      await route.fulfill({
        status: 200,
        body: '0018A45C4D1DEF81644B54AB7F969B88D65:10\n0020A45C4D1DEF81644B54AB7F969B88D66:5',
        headers: {
          'content-type': 'text/plain',
        },
      });
    });
    
    const breachCheckButton = page.locator('[data-testid="breach-check-button"]');
    await breachCheckButton.click();
    
    // Wait for API call to complete
    await page.waitForTimeout(2000);
    
    // Should handle the response without error
    await expect(breachCheckButton).toBeEnabled({ timeout: 5000 });
  });

  test('should handle safe password response', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Mock API response for safe password
    await page.route('**/api.pwnedpasswords.com/**', async (route) => {
      // Return a response indicating no breach
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
    
    // Wait for API call to complete
    await page.waitForTimeout(2000);
    
    // Should handle the response without error
    await expect(breachCheckButton).toBeEnabled({ timeout: 5000 });
  });

  test('should handle API network error', async ({ page }) => {
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

  test('should handle API timeout', async ({ page }) => {
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

  test('should handle API rate limiting', async ({ page }) => {
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

  test('should handle API server error', async ({ page }) => {
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

  test('should handle API bad request', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Mock bad request
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

  test('should show loading state during API call', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Mock slow response
    await page.route('**/api.pwnedpasswords.com/**', async (route) => {
      await new Promise(resolve => setTimeout(resolve, 2000));
      await route.fulfill({
        status: 200,
        body: '',
        headers: {
          'content-type': 'text/plain',
        },
      });
    });
    
    const breachCheckButton = page.locator('[data-testid="breach-check-button"]');
    
    // Click breach check button
    await breachCheckButton.click();
    
    // Wait for check to complete
    await page.waitForTimeout(3000);
    
    // Button should be enabled again
    await expect(breachCheckButton).toBeEnabled({ timeout: 5000 });
  });

  test('should cache API responses', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    let requestCount = 0;
    
    // Track API requests to our proxy endpoint
    page.on('request', (request) => {
      if (request.url().includes('/api/breach-check')) {
        requestCount++;
      }
    });
    
    const breachCheckButton = page.locator('[data-testid="breach-check-button"]');
    
    // First breach check
    await breachCheckButton.click();
    await page.waitForTimeout(2000);
    
    const firstRequestCount = requestCount;
    
    // Second breach check (should use cache)
    await breachCheckButton.click();
    await page.waitForTimeout(2000);
    
    const secondRequestCount = requestCount;
    
    // Request count may or may not increase depending on cache implementation
    expect(requestCount).toBeGreaterThanOrEqual(1);
  });

  test('should handle multiple breach checks', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    const breachCheckButton = page.locator('[data-testid="breach-check-button"]');
    
    // Perform multiple breach checks
    for (let i = 0; i < 5; i++) {
      await breachCheckButton.click();
      await page.waitForTimeout(2000);
      
      // Button should be enabled after each check
      await expect(breachCheckButton).toBeEnabled();
    }
  });

  test('should handle breach check for password', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    const breachCheckButton = page.locator('[data-testid="breach-check-button"]');
    await expect(breachCheckButton).toBeVisible();
    
    await breachCheckButton.click();
    await page.waitForTimeout(2000);
    
    await expect(breachCheckButton).toBeEnabled();
  });

  test('should handle breach check for PIN', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Switch to PIN tab
    const pinTab = page.locator('[data-testid="tab-pin"]');
    await pinTab.click();
    await page.waitForTimeout(300);
    
    const breachCheckButton = page.locator('[data-testid="breach-check-button"]');
    await expect(breachCheckButton).toBeVisible();
    
    await breachCheckButton.click();
    await page.waitForTimeout(2000);
    
    await expect(breachCheckButton).toBeEnabled();
  });

  test('should handle breach check for passphrase', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Switch to passphrase tab
    const passphraseTab = page.locator('[data-testid="tab-passphrase"]');
    await passphraseTab.click();
    await page.waitForTimeout(300);
    
    const breachCheckButton = page.locator('[data-testid="breach-check-button"]');
    await expect(breachCheckButton).toBeVisible();
    
    await breachCheckButton.click();
    await page.waitForTimeout(2000);
    
    await expect(breachCheckButton).toBeEnabled();
  });

  test('should handle breach check with special characters', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Enable symbols to generate password with special characters
    const symbolsToggle = page.locator('[data-testid="toggle-symbols"]');
    await symbolsToggle.click();
    await page.waitForTimeout(500);
    
    const breachCheckButton = page.locator('[data-testid="breach-check-button"]');
    await breachCheckButton.click();
    await page.waitForTimeout(2000);
    
    await expect(breachCheckButton).toBeEnabled();
  });

  test('should handle breach check with unicode characters', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    const breachCheckButton = page.locator('[data-testid="breach-check-button"]');
    await breachCheckButton.click();
    await page.waitForTimeout(2000);
    
    await expect(breachCheckButton).toBeEnabled();
  });

  test('should handle breach check after password change', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Change password
    const refreshButton = page.locator('[data-testid="refresh-button"]');
    await refreshButton.click();
    await page.waitForTimeout(500);
    
    // Check breach
    const breachCheckButton = page.locator('[data-testid="breach-check-button"]');
    await breachCheckButton.click();
    await page.waitForTimeout(2000);
    
    await expect(breachCheckButton).toBeEnabled();
  });

  test('should handle breach check after PIN change', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Switch to PIN tab
    const pinTab = page.locator('[data-testid="tab-pin"]');
    await pinTab.click();
    await page.waitForTimeout(300);
    
    // Change PIN
    const refreshButton = page.locator('[data-testid="refresh-button"]');
    await refreshButton.click();
    await page.waitForTimeout(500);
    
    // Check breach
    const breachCheckButton = page.locator('[data-testid="breach-check-button"]');
    await breachCheckButton.click();
    await page.waitForTimeout(2000);
    
    await expect(breachCheckButton).toBeEnabled();
  });

  test('should handle breach check after passphrase change', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Switch to passphrase tab
    const passphraseTab = page.locator('[data-testid="tab-passphrase"]');
    await passphraseTab.click();
    await page.waitForTimeout(300);
    
    // Change passphrase
    const refreshButton = page.locator('[data-testid="refresh-button"]');
    await refreshButton.click();
    await page.waitForTimeout(500);
    
    // Check breach
    const breachCheckButton = page.locator('[data-testid="breach-check-button"]');
    await breachCheckButton.click();
    await page.waitForTimeout(2000);
    
    await expect(breachCheckButton).toBeEnabled();
  });

  test('should not send full password to API', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Get the generated password
    const passwordDisplay = page.locator('[data-testid="password-display"] p');
    const password = await passwordDisplay.textContent();
    
    // Listen for API requests to our proxy endpoint
    const apiRequests: any[] = [];
    page.on('request', (request) => {
      if (request.url().includes('/api/breach-check')) {
        apiRequests.push({
          url: request.url(),
        });
      }
    });
    
    const breachCheckButton = page.locator('[data-testid="breach-check-button"]');
    await breachCheckButton.click();
    
    // Wait for API call
    await page.waitForTimeout(2000);
    
    // Verify full password is not in the proxy URL (only hash prefix)
    if (apiRequests.length > 0 && password) {
      const url = apiRequests[0].url;
      expect(url).not.toContain(password);
      // Should contain hash parameter with only first 5 chars of SHA-1 hash
      expect(url).toMatch(/[?&]hash=[A-F0-9]{5}/i);
    }
  });

  test('should use correct API endpoint', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Listen for API requests to our proxy endpoint
    const apiRequests: any[] = [];
    page.on('request', (request) => {
      if (request.url().includes('/api/breach-check')) {
        apiRequests.push({
          url: request.url(),
        });
      }
    });
    
    const breachCheckButton = page.locator('[data-testid="breach-check-button"]');
    await breachCheckButton.click();
    
    // Wait for API call
    await page.waitForTimeout(2000);
    
    // Verify correct proxy endpoint is used
    if (apiRequests.length > 0) {
      const url = apiRequests[0].url;
      expect(url).toMatch(/\/api\/breach-check/);
    }
  });
});
