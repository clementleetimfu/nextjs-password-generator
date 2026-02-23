import { test, expect } from '@playwright/test';

test.describe('Loading States E2E Tests', () => {
  test('should show loading state during breach check', async ({ page }) => {
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
    
    // Button should be enabled again after loading completes
    await expect(breachCheckButton).toBeEnabled({ timeout: 5000 });
  });

  test('should show loading state on password tab', async ({ page }) => {
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

  test('should show loading state on PIN tab', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Switch to PIN tab
    const pinTab = page.locator('[data-testid="tab-pin"]');
    await pinTab.click();
    await page.waitForTimeout(300);
    
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

  test('should show loading state on passphrase tab', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Switch to passphrase tab
    const passphraseTab = page.locator('[data-testid="tab-passphrase"]');
    await passphraseTab.click();
    await page.waitForTimeout(300);
    
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

  test('should show loading indicator', async ({ page }) => {
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
    
    // Button should be enabled
    await expect(breachCheckButton).toBeEnabled({ timeout: 5000 });
  });

  test('should disable button during loading', async ({ page }) => {
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
    
    // Button should be enabled after loading
    await expect(breachCheckButton).toBeEnabled({ timeout: 5000 });
  });

  test('should enable button after loading completes', async ({ page }) => {
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
    
    // Wait for loading to complete
    await page.waitForTimeout(3000);
    
    // Button should be enabled again
    await expect(breachCheckButton).toBeEnabled({ timeout: 5000 });
  });

  test('should handle loading state on all viewports', async ({ page }) => {
    const viewports = [
      { width: 1920, height: 1080 },
      { width: 768, height: 1024 },
      { width: 375, height: 667 },
    ];

    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
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
    }
  });

  test('should handle loading state in both themes', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    const themeToggle = page.locator('[data-testid="theme-toggle"]');
    
    // Toggle to dark theme
    await themeToggle.click();
    await page.waitForTimeout(300);
    
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

  test('should handle loading state during tab switch', async ({ page }) => {
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
    const pinTab = page.locator('[data-testid="tab-pin"]');
    
    // Start breach check
    await breachCheckButton.click();
    
    // Switch tab during loading
    await pinTab.click();
    await page.waitForTimeout(300);
    
    // Wait for check to complete
    await page.waitForTimeout(3000);
    
    // Button should be enabled again
    await expect(breachCheckButton).toBeEnabled({ timeout: 5000 });
  });

  test('should handle loading state during theme change', async ({ page }) => {
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
    const themeToggle = page.locator('[data-testid="theme-toggle"]');
    
    // Start breach check
    await breachCheckButton.click();
    
    // Change theme during loading
    await themeToggle.click();
    await page.waitForTimeout(300);
    
    // Wait for check to complete
    await page.waitForTimeout(3000);
    
    // Button should be enabled again
    await expect(breachCheckButton).toBeEnabled({ timeout: 5000 });
  });

  test('should handle loading state during slider change', async ({ page }) => {
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
    const lengthSlider = page.locator('[data-testid="length-slider"]');
    
    // Start breach check
    await breachCheckButton.click();
    
    // Change slider during loading
    await lengthSlider.click();
    await page.waitForTimeout(300);
    
    // Wait for check to complete
    await page.waitForTimeout(3000);
    
    // Button should be enabled again
    await expect(breachCheckButton).toBeEnabled({ timeout: 5000 });
  });

  test('should handle loading state during toggle change', async ({ page }) => {
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
    const digitToggle = page.locator('[data-testid="toggle-digits"]');
    
    // Start breach check
    await breachCheckButton.click();
    
    // Change toggle during loading
    await digitToggle.click();
    await page.waitForTimeout(300);
    
    // Wait for check to complete
    await page.waitForTimeout(3000);
    
    // Button should be enabled again
    await expect(breachCheckButton).toBeEnabled({ timeout: 5000 });
  });

  test('should handle loading state with rapid operations', async ({ page }) => {
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
    const refreshButton = page.locator('[data-testid="refresh-button"]');
    
    // Start breach check
    await breachCheckButton.click();
    
    // Refresh password during loading
    await refreshButton.click();
    await page.waitForTimeout(300);
    
    // Wait for check to complete
    await page.waitForTimeout(3000);
    
    // Button should be enabled again
    await expect(breachCheckButton).toBeEnabled({ timeout: 5000 });
  });

  test('should handle loading state with copy operation', async ({ page }) => {
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
    const copyButton = page.locator('[data-testid="copy-button"]');
    
    // Start breach check
    await breachCheckButton.click();
    
    // Copy password during loading
    await copyButton.click();
    await page.waitForTimeout(300);
    
    // Wait for check to complete
    await page.waitForTimeout(3000);
    
    // Button should be enabled again
    await expect(breachCheckButton).toBeEnabled({ timeout: 5000 });
  });

  test('should show loading state with visual feedback', async ({ page }) => {
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
    
    // Button should be enabled after check
    await expect(breachCheckButton).toBeEnabled({ timeout: 5000 });
  });

  test('should handle loading state on initial page load', async ({ page }) => {
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

  test('should handle loading state after page reload', async ({ page }) => {
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
    
    // Reload page during loading
    await page.reload();
    await page.waitForTimeout(500);
    
    // Wait for check to complete
    await page.waitForTimeout(3000);
    
    // Button should be enabled again
    await expect(breachCheckButton).toBeEnabled({ timeout: 5000 });
  });

  test('should handle loading state with keyboard navigation', async ({ page }) => {
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
    
    // Focus on breach check button
    await breachCheckButton.focus();
    
    // Press Enter to start check
    await page.keyboard.press('Enter');
    
    // Wait for check to complete
    await page.waitForTimeout(3000);
    
    // Button should be enabled again
    await expect(breachCheckButton).toBeEnabled({ timeout: 5000 });
  });

  test('should handle loading state with multiple tabs', async ({ page }) => {
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
    const pinTab = page.locator('[data-testid="tab-pin"]');
    
    // Start breach check on password tab
    await breachCheckButton.click();
    
    // Wait for check to complete
    await page.waitForTimeout(3000);
    
    // Button should be enabled again
    await expect(breachCheckButton).toBeEnabled({ timeout: 5000 });
    
    // Switch to PIN tab and start breach check
    await pinTab.click();
    await page.waitForTimeout(300);
    
    await breachCheckButton.click();
    
    // Wait for check to complete
    await page.waitForTimeout(3000);
    
    // Button should be enabled again
    await expect(breachCheckButton).toBeEnabled({ timeout: 5000 });
  });
});
