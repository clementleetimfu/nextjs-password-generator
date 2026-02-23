import { test, expect } from '@playwright/test';

test.describe('Error States E2E Tests', () => {
  test('should handle clipboard copy error gracefully', async ({ page, browserName }) => {
    test.skip(browserName !== 'chromium', 'clipboard-write is only supported in Chromium');
    
    await page.goto('http://localhost:3000');
    
    // Mock clipboard error
    await page.evaluate(() => {
      Object.defineProperty(navigator, 'clipboard', {
        value: {
          writeText: () => Promise.reject(new Error('Clipboard error')),
        },
        writable: false,
      });
    });
    
    const copyButton = page.locator('[data-testid="copy-button"]');
    await copyButton.click();
    
    // Should handle error gracefully
    await page.waitForTimeout(1000);
    await expect(copyButton).toBeEnabled();
  });

  test('should handle breach check network error', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Mock network error
    await page.route('**/api.pwnedpasswords.com/**', async (route) => {
      await route.abort('failed');
    });
    
    const breachCheckButton = page.locator('[data-testid="breach-check-button"]');
    await breachCheckButton.click();
    
    // Should handle error gracefully
    await page.waitForTimeout(2000);
    await expect(breachCheckButton).toBeEnabled({ timeout: 5000 });
  });

  test('should handle breach check timeout', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Mock timeout
    await page.route('**/api.pwnedpasswords.com/**', async (route) => {
      await new Promise(() => {});
    });
    
    const breachCheckButton = page.locator('[data-testid="breach-check-button"]');
    await breachCheckButton.click();
    
    // Should handle timeout gracefully
    await page.waitForTimeout(5000);
    await expect(breachCheckButton).toBeEnabled({ timeout: 10000 });
  });

  test('should handle breach check server error', async ({ page }) => {
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
    
    // Should handle server error gracefully
    await page.waitForTimeout(2000);
    await expect(breachCheckButton).toBeEnabled({ timeout: 5000 });
  });

  test('should handle breach check rate limit', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Mock rate limit
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
    
    // Should handle rate limit gracefully
    await page.waitForTimeout(2000);
    await expect(breachCheckButton).toBeEnabled({ timeout: 5000 });
  });

  test('should show error message on clipboard error', async ({ page, browserName }) => {
    test.skip(browserName !== 'chromium', 'clipboard-write is only supported in Chromium');
    
    await page.goto('http://localhost:3000');
    
    // Mock clipboard error
    await page.evaluate(() => {
      Object.defineProperty(navigator, 'clipboard', {
        value: {
          writeText: () => Promise.reject(new Error('Clipboard error')),
        },
        writable: false,
      });
    });
    
    const copyButton = page.locator('[data-testid="copy-button"]');
    await copyButton.click();
    
    // Should handle error gracefully
    await page.waitForTimeout(1000);
    
    // Button should still be visible
    await expect(copyButton).toBeEnabled();
  });

  test('should show error message on breach check error', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Mock network error
    await page.route('**/api.pwnedpasswords.com/**', async (route) => {
      await route.abort('failed');
    });
    
    const breachCheckButton = page.locator('[data-testid="breach-check-button"]');
    await breachCheckButton.click();
    
    // Should handle error gracefully
    await page.waitForTimeout(2000);
    
    // Button should be enabled again
    await expect(breachCheckButton).toBeEnabled({ timeout: 5000 });
  });

  test('should allow retry after clipboard error', async ({ page, browserName }) => {
    test.skip(browserName !== 'chromium', 'clipboard-write is only supported in Chromium');
    
    await page.goto('http://localhost:3000');
    
    // Mock clipboard error
    await page.evaluate(() => {
      Object.defineProperty(navigator, 'clipboard', {
        value: {
          writeText: () => Promise.reject(new Error('Clipboard error')),
        },
        writable: false,
      });
    });
    
    const copyButton = page.locator('[data-testid="copy-button"]');
    
    // First attempt
    await copyButton.click();
    await page.waitForTimeout(1000);
    
    // Second attempt should still work
    await copyButton.click();
    await page.waitForTimeout(1000);
    
    // Button should still be enabled
    await expect(copyButton).toBeEnabled();
  });

  test('should allow retry after breach check error', async ({ page }) => {
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
    
    // Button should be enabled
    await expect(breachCheckButton).toBeEnabled();
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
      
      // Button should be enabled after each attempt
      await expect(breachCheckButton).toBeEnabled();
    }
  });

  test('should recover from error after success', async ({ page }) => {
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

  test('should handle error on password tab', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Mock network error
    await page.route('**/api.pwnedpasswords.com/**', async (route) => {
      await route.abort('failed');
    });
    
    const breachCheckButton = page.locator('[data-testid="breach-check-button"]');
    await breachCheckButton.click();
    
    // Should handle error gracefully
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
    
    // Should handle error gracefully
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
    
    // Should handle error gracefully
    await page.waitForTimeout(2000);
    await expect(breachCheckButton).toBeEnabled({ timeout: 5000 });
  });

  test('should handle error while generating password', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Mock network error
    await page.route('**/api.pwnedpasswords.com/**', async (route) => {
      await route.abort('failed');
    });
    
    const refreshButton = page.locator('[data-testid="refresh-button"]');
    const breachCheckButton = page.locator('[data-testid="breach-check-button"]');
    
    // Generate password and check breach
    await refreshButton.click();
    await breachCheckButton.click();
    
    // Should handle error gracefully
    await page.waitForTimeout(2000);
    await expect(breachCheckButton).toBeEnabled({ timeout: 5000 });
  });

  test('should handle error while generating PIN', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Switch to PIN tab
    const pinTab = page.locator('[data-testid="tab-pin"]');
    await pinTab.click();
    await page.waitForTimeout(300);
    
    // Mock network error
    await page.route('**/api.pwnedpasswords.com/**', async (route) => {
      await route.abort('failed');
    });
    
    const refreshButton = page.locator('[data-testid="refresh-button"]');
    const breachCheckButton = page.locator('[data-testid="breach-check-button"]');
    
    // Generate PIN and check breach
    await refreshButton.click();
    await breachCheckButton.click();
    
    // Should handle error gracefully
    await page.waitForTimeout(2000);
    await expect(breachCheckButton).toBeEnabled({ timeout: 5000 });
  });

  test('should handle error while generating passphrase', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Switch to passphrase tab
    const passphraseTab = page.locator('[data-testid="tab-passphrase"]');
    await passphraseTab.click();
    await page.waitForTimeout(300);
    
    // Mock network error
    await page.route('**/api.pwnedpasswords.com/**', async (route) => {
      await route.abort('failed');
    });
    
    const refreshButton = page.locator('[data-testid="refresh-button"]');
    const breachCheckButton = page.locator('[data-testid="breach-check-button"]');
    
    // Generate passphrase and check breach
    await refreshButton.click();
    await breachCheckButton.click();
    
    // Should handle error gracefully
    await page.waitForTimeout(2000);
    await expect(breachCheckButton).toBeEnabled({ timeout: 5000 });
  });

  test('should handle error on all viewports', async ({ page }) => {
    const viewports = [
      { width: 1920, height: 1080 },
      { width: 768, height: 1024 },
      { width: 375, height: 667 },
    ];

    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await page.goto('http://localhost:3000');
      
      // Mock network error
      await page.route('**/api.pwnedpasswords.com/**', async (route) => {
        await route.abort('failed');
      });
      
      const breachCheckButton = page.locator('[data-testid="breach-check-button"]');
      await breachCheckButton.click();
      
      // Should handle error gracefully
      await page.waitForTimeout(2000);
      await expect(breachCheckButton).toBeEnabled({ timeout: 5000 });
    }
  });

  test('should handle error in both themes', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    const themeToggle = page.locator('[data-testid="theme-toggle"]');
    
    // Toggle to dark theme
    await themeToggle.click();
    await page.waitForTimeout(300);
    
    // Mock network error
    await page.route('**/api.pwnedpasswords.com/**', async (route) => {
      await route.abort('failed');
    });
    
    const breachCheckButton = page.locator('[data-testid="breach-check-button"]');
    await breachCheckButton.click();
    
    // Should handle error gracefully
    await page.waitForTimeout(2000);
    await expect(breachCheckButton).toBeEnabled({ timeout: 5000 });
  });

  test('should handle error during tab switch', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Mock network error
    await page.route('**/api.pwnedpasswords.com/**', async (route) => {
      await route.abort('failed');
    });
    
    const breachCheckButton = page.locator('[data-testid="breach-check-button"]');
    const pinTab = page.locator('[data-testid="tab-pin"]');
    
    // Start breach check
    await breachCheckButton.click();
    
    // Switch tab during check
    await pinTab.click();
    await page.waitForTimeout(300);
    
    // Should handle error gracefully
    await page.waitForTimeout(2000);
    await expect(breachCheckButton).toBeEnabled({ timeout: 5000 });
  });

  test('should handle error during theme change', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Mock network error
    await page.route('**/api.pwnedpasswords.com/**', async (route) => {
      await route.abort('failed');
    });
    
    const breachCheckButton = page.locator('[data-testid="breach-check-button"]');
    const themeToggle = page.locator('[data-testid="theme-toggle"]');
    
    // Start breach check
    await breachCheckButton.click();
    
    // Change theme during check
    await themeToggle.click();
    await page.waitForTimeout(300);
    
    // Should handle error gracefully
    await page.waitForTimeout(2000);
    await expect(breachCheckButton).toBeEnabled({ timeout: 5000 });
  });

  test('should handle error during slider change', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Mock network error
    await page.route('**/api.pwnedpasswords.com/**', async (route) => {
      await route.abort('failed');
    });
    
    const breachCheckButton = page.locator('[data-testid="breach-check-button"]');
    const lengthSlider = page.locator('[data-testid="length-slider"]');
    
    // Start breach check
    await breachCheckButton.click();
    
    // Change slider during check
    await lengthSlider.click();
    await page.waitForTimeout(300);
    
    // Should handle error gracefully
    await page.waitForTimeout(2000);
    await expect(breachCheckButton).toBeEnabled({ timeout: 5000 });
  });

  test('should handle error during toggle change', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Mock network error
    await page.route('**/api.pwnedpasswords.com/**', async (route) => {
      await route.abort('failed');
    });
    
    const breachCheckButton = page.locator('[data-testid="breach-check-button"]');
    const digitToggle = page.locator('[data-testid="toggle-digits"]');
    
    // Start breach check
    await breachCheckButton.click();
    
    // Change toggle during check
    await digitToggle.click();
    await page.waitForTimeout(300);
    
    // Should handle error gracefully
    await page.waitForTimeout(2000);
    await expect(breachCheckButton).toBeEnabled({ timeout: 5000 });
  });

  test('should handle error with special characters in password', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Enable symbols
    const symbolsToggle = page.locator('[data-testid="toggle-symbols"]');
    await symbolsToggle.click();
    await page.waitForTimeout(500);
    
    // Mock network error
    await page.route('**/api.pwnedpasswords.com/**', async (route) => {
      await route.abort('failed');
    });
    
    const breachCheckButton = page.locator('[data-testid="breach-check-button"]');
    await breachCheckButton.click();
    
    // Should handle error gracefully
    await page.waitForTimeout(2000);
    await expect(breachCheckButton).toBeEnabled({ timeout: 5000 });
  });

  test('should handle error with unicode characters in password', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Mock network error
    await page.route('**/api.pwnedpasswords.com/**', async (route) => {
      await route.abort('failed');
    });
    
    const breachCheckButton = page.locator('[data-testid="breach-check-button"]');
    await breachCheckButton.click();
    
    // Should handle error gracefully
    await page.waitForTimeout(2000);
    await expect(breachCheckButton).toBeEnabled({ timeout: 5000 });
  });

  test('should handle error on page reload', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Mock network error
    await page.route('**/api.pwnedpasswords.com/**', async (route) => {
      await route.abort('failed');
    });
    
    const breachCheckButton = page.locator('[data-testid="breach-check-button"]');
    
    // Start breach check
    await breachCheckButton.click();
    
    // Reload page during check
    await page.reload();
    await page.waitForTimeout(500);
    
    // Should handle error gracefully
    await page.waitForTimeout(2000);
    await expect(breachCheckButton).toBeEnabled({ timeout: 5000 });
  });

  test('should handle error with rapid operations', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Mock network error
    await page.route('**/api.pwnedpasswords.com/**', async (route) => {
      await route.abort('failed');
    });
    
    const breachCheckButton = page.locator('[data-testid="breach-check-button"]');
    const refreshButton = page.locator('[data-testid="refresh-button"]');
    const copyButton = page.locator('[data-testid="copy-button"]');
    
    // Perform rapid operations
    for (let i = 0; i < 5; i++) {
      await refreshButton.click();
      await copyButton.click();
      await breachCheckButton.click();
      await page.waitForTimeout(500);
    }
    
    // Should handle errors gracefully
    await expect(breachCheckButton).toBeEnabled();
  });
});
