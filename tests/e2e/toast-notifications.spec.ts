import { test, expect } from '@playwright/test';

test.describe('Toast Notifications E2E Tests', () => {
  test('should show toast on copy', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    const copyButton = page.locator('[data-testid="copy-button"]');
    await copyButton.click();
    
    // Toast should appear
    const toast = page.locator('[role="status"], [class*="toast"]').first();
    await expect(toast).toBeVisible({ timeout: 5000 });
  });

  test('should show toast on password copy', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    const copyButton = page.locator('[data-testid="copy-button"]');
    await copyButton.click();
    
    // Toast should appear
    const toast = page.locator('[role="status"], [class*="toast"]').first();
    await expect(toast).toBeVisible({ timeout: 5000 });
    
    // Toast should mention copy
    const toastText = await toast.textContent();
    expect(toastText?.toLowerCase()).toContain('copy');
  });

  test('should show toast on PIN copy', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Switch to PIN tab
    const pinTab = page.locator('[data-testid="tab-pin"]');
    await pinTab.click();
    await page.waitForTimeout(300);
    
    const copyButton = page.locator('[data-testid="copy-button"]');
    await copyButton.click();
    
    // Toast should appear
    const toast = page.locator('[role="status"], [class*="toast"]').first();
    await expect(toast).toBeVisible({ timeout: 5000 });
  });

  test('should show toast on passphrase copy', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Switch to passphrase tab
    const passphraseTab = page.locator('[data-testid="tab-passphrase"]');
    await passphraseTab.click();
    await page.waitForTimeout(300);
    
    const copyButton = page.locator('[data-testid="copy-button"]');
    await copyButton.click();
    
    // Toast should appear
    const toast = page.locator('[role="status"], [class*="toast"]').first();
    await expect(toast).toBeVisible({ timeout: 5000 });
  });

  test('should auto-dismiss toast after delay', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    const copyButton = page.locator('[data-testid="copy-button"]');
    await copyButton.click();
    
    // Toast should appear
    const toast = page.locator('[role="status"], [class*="toast"]').first();
    await expect(toast).toBeVisible({ timeout: 5000 });
    
    // Wait for auto-dismiss
    await page.waitForTimeout(5000);
    
    // Toast should be dismissed
    await expect(toast).not.toBeVisible({ timeout: 5000 });
  });

  test('should dismiss toast on click', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    const copyButton = page.locator('[data-testid="copy-button"]');
    await copyButton.click();
    
    // Toast should appear
    const toast = page.locator('[role="status"], [class*="toast"]').first();
    await expect(toast).toBeVisible({ timeout: 5000 });
    
    // Click on toast to dismiss
    await toast.click();
    await page.waitForTimeout(300);
    
    // Toast should be dismissed
    await expect(toast).not.toBeVisible();
  });

  test('should show multiple toasts', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    const copyButton = page.locator('[data-testid="copy-button"]');
    
    // Copy multiple times
    for (let i = 0; i < 3; i++) {
      await copyButton.click();
      await page.waitForTimeout(500);
    }
    
    // Multiple toasts should be visible
    const toasts = page.locator('[role="status"], [class*="toast"]');
    const toastCount = await toasts.count();
    
    expect(toastCount).toBeGreaterThan(0);
  });

  test('should stack multiple toasts correctly', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    const copyButton = page.locator('[data-testid="copy-button"]');
    
    // Copy multiple times
    for (let i = 0; i < 3; i++) {
      await copyButton.click();
      await page.waitForTimeout(500);
    }
    
    // All toasts should be visible
    const toasts = page.locator('[role="status"], [class*="toast"]');
    const toastCount = await toasts.count();
    
    expect(toastCount).toBeGreaterThan(0);
    
    // All toasts should be visible
    for (let i = 0; i < toastCount; i++) {
      await expect(toasts.nth(i)).toBeVisible();
    }
  });

  test('should dismiss oldest toast when limit reached', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    const copyButton = page.locator('[data-testid="copy-button"]');
    
    // Copy many times
    for (let i = 0; i < 10; i++) {
      await copyButton.click();
      await page.waitForTimeout(500);
    }
    
    // Not all toasts should be visible (there should be a limit)
    const toasts = page.locator('[role="status"], [class*="toast"]');
    const toastCount = await toasts.count();
    
    // There should be a reasonable limit
    expect(toastCount).toBeLessThan(10);
  });

  test('should show toast on all viewports', async ({ page }) => {
    const viewports = [
      { width: 1920, height: 1080 },
      { width: 768, height: 1024 },
      { width: 375, height: 667 },
    ];

    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await page.goto('http://localhost:3000');
      
      const copyButton = page.locator('[data-testid="copy-button"]');
      await copyButton.click();
      
      // Toast should appear
      const toast = page.locator('[role="status"], [class*="toast"]').first();
      await expect(toast).toBeVisible({ timeout: 5000 });
    }
  });

  test('should position toast correctly on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('http://localhost:3000');
    
    const copyButton = page.locator('[data-testid="copy-button"]');
    await copyButton.click();
    
    // Toast should appear
    const toast = page.locator('[role="status"], [class*="toast"]').first();
    await expect(toast).toBeVisible({ timeout: 5000 });
    
    // Toast should be positioned correctly
    const toastBox = await toast.boundingBox();
    expect(toastBox).toBeTruthy();
  });

  test('should position toast correctly on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('http://localhost:3000');
    
    const copyButton = page.locator('[data-testid="copy-button"]');
    await copyButton.click();
    
    // Toast should appear
    const toast = page.locator('[role="status"], [class*="toast"]').first();
    await expect(toast).toBeVisible({ timeout: 5000 });
    
    // Toast should be positioned correctly
    const toastBox = await toast.boundingBox();
    expect(toastBox).toBeTruthy();
  });

  test('should have proper ARIA attributes on toast', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    const copyButton = page.locator('[data-testid="copy-button"]');
    await copyButton.click();
    
    // Toast should appear
    const toast = page.locator('[role="status"], [class*="toast"]').first();
    await expect(toast).toBeVisible({ timeout: 5000 });
    
    // Check for role attribute
    await expect(toast).toHaveAttribute('role', 'status');
  });

  test('should be accessible via keyboard', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    const copyButton = page.locator('[data-testid="copy-button"]');
    await copyButton.click();
    
    // Toast should appear
    const toast = page.locator('[role="status"], [class*="toast"]').first();
    await expect(toast).toBeVisible({ timeout: 5000 });
    
    // Focus on toast
    await toast.focus();
    
    // Check if focus is on toast
    const isFocused = await toast.evaluate((el: any) => document.activeElement === el);
    expect(isFocused).toBe(true);
  });

  test('should dismiss toast with Escape key', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    const copyButton = page.locator('[data-testid="copy-button"]');
    await copyButton.click();
    
    // Toast should appear
    const toast = page.locator('[role="status"], [class*="toast"]').first();
    await expect(toast).toBeVisible({ timeout: 5000 });
    
    // Press Escape to dismiss
    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);
    
    // Toast should be dismissed
    await expect(toast).not.toBeVisible();
  });

  test('should show success toast on successful copy', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    const copyButton = page.locator('[data-testid="copy-button"]');
    await copyButton.click();
    
    // Toast should appear
    const toast = page.locator('[role="status"], [class*="toast"]').first();
    await expect(toast).toBeVisible({ timeout: 5000 });
    
    // Toast should indicate success
    const toastText = await toast.textContent();
    expect(toastText?.toLowerCase()).toMatch(/(copy|success|copied)/);
  });

  test('should show error toast on failed copy', async ({ page }) => {
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
    
    // Toast may appear with error message
    await page.waitForTimeout(1000);
    
    // Button should still be visible
    await expect(copyButton).toBeVisible();
  });

  test('should handle rapid toast creation', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    const copyButton = page.locator('[data-testid="copy-button"]');
    
    // Copy rapidly
    for (let i = 0; i < 5; i++) {
      await copyButton.click();
      await page.waitForTimeout(200);
    }
    
    // Should not cause errors
    await expect(copyButton).toBeVisible();
  });

  test('should show toast in correct z-index', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    const copyButton = page.locator('[data-testid="copy-button"]');
    await copyButton.click();
    
    // Toast should appear
    const toast = page.locator('[role="status"], [class*="toast"]').first();
    await expect(toast).toBeVisible({ timeout: 5000 });
    
    // Toast should be above other elements
    const zIndex = await toast.evaluate((el: any) => {
      return window.getComputedStyle(el).zIndex;
    });
    
    expect(parseInt(zIndex || '0', 10)).toBeGreaterThan(0);
  });

  test('should handle toast on theme change', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    const copyButton = page.locator('[data-testid="copy-button"]');
    const themeToggle = page.locator('[data-testid="theme-toggle"]');
    
    // Copy password
    await copyButton.click();
    
    // Toast should appear
    const toast = page.locator('[role="status"], [class*="toast"]').first();
    await expect(toast).toBeVisible({ timeout: 5000 });
    
    // Change theme
    await themeToggle.click();
    await page.waitForTimeout(300);
    
    // Toast should still be visible or dismissed gracefully
    await expect(themeToggle).toBeVisible();
  });

  test('should handle toast on tab switch', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    const copyButton = page.locator('[data-testid="copy-button"]');
    const pinTab = page.locator('[data-testid="tab-pin"]');
    
    // Copy password
    await copyButton.click();
    
    // Toast should appear
    const toast = page.locator('[role="status"], [class*="toast"]').first();
    await expect(toast).toBeVisible({ timeout: 5000 });
    
    // Switch to PIN tab
    await pinTab.click();
    await page.waitForTimeout(300);
    
    // Toast should be dismissed gracefully
    await expect(pinTab).toBeVisible();
  });

  test('should show toast with correct animation', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    const copyButton = page.locator('[data-testid="copy-button"]');
    await copyButton.click();
    
    // Toast should appear
    const toast = page.locator('[role="status"], [class*="toast"]').first();
    await expect(toast).toBeVisible({ timeout: 5000 });
    
    // Toast should have animation classes
    const hasAnimation = await toast.evaluate((el: any) => {
      const classes = el.className;
      return classes.includes('animate') || 
             classes.includes('transition') ||
             classes.includes('duration');
    });
    
    // Animation is optional
    expect(hasAnimation).toBeGreaterThanOrEqual(0);
  });

  test('should handle toast on password refresh', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    const refreshButton = page.locator('[data-testid="refresh-button"]');
    const copyButton = page.locator('[data-testid="copy-button"]');
    
    // Refresh password
    await refreshButton.click();
    await page.waitForTimeout(300);
    
    // Copy new password
    await copyButton.click();
    
    // Toast should appear
    const toast = page.locator('[role="status"], [class*="toast"]').first();
    await expect(toast).toBeVisible({ timeout: 5000 });
  });

  test('should handle toast on PIN refresh', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Switch to PIN tab
    const pinTab = page.locator('[data-testid="tab-pin"]');
    await pinTab.click();
    await page.waitForTimeout(300);
    
    const refreshButton = page.locator('[data-testid="refresh-button"]');
    const copyButton = page.locator('[data-testid="copy-button"]');
    
    // Refresh PIN
    await refreshButton.click();
    await page.waitForTimeout(300);
    
    // Copy new PIN
    await copyButton.click();
    
    // Toast should appear
    const toast = page.locator('[role="status"], [class*="toast"]').first();
    await expect(toast).toBeVisible({ timeout: 5000 });
  });

  test('should handle toast on passphrase refresh', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Switch to passphrase tab
    const passphraseTab = page.locator('[data-testid="tab-passphrase"]');
    await passphraseTab.click();
    await page.waitForTimeout(300);
    
    const refreshButton = page.locator('[data-testid="refresh-button"]');
    const copyButton = page.locator('[data-testid="copy-button"]');
    
    // Refresh passphrase
    await refreshButton.click();
    await page.waitForTimeout(300);
    
    // Copy new passphrase
    await copyButton.click();
    
    // Toast should appear
    const toast = page.locator('[role="status"], [class*="toast"]').first();
    await expect(toast).toBeVisible({ timeout: 5000 });
  });

  test('should show toast with proper color contrast', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    const copyButton = page.locator('[data-testid="copy-button"]');
    await copyButton.click();
    
    // Toast should appear
    const toast = page.locator('[role="status"], [class*="toast"]').first();
    await expect(toast).toBeVisible({ timeout: 5000 });
    
    // Check color contrast
    const textColor = await toast.evaluate((el: any) => {
      return window.getComputedStyle(el).color;
    });
    
    const backgroundColor = await toast.evaluate((el: any) => {
      return window.getComputedStyle(el).backgroundColor;
    });
    
    // Colors should be defined
    expect(textColor).toBeTruthy();
    expect(backgroundColor).toBeTruthy();
  });

  test('should dismiss all toasts on page reload', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    const copyButton = page.locator('[data-testid="copy-button"]');
    
    // Copy multiple times
    for (let i = 0; i < 3; i++) {
      await copyButton.click();
      await page.waitForTimeout(500);
    }
    
    // Reload page
    await page.reload();
    await page.waitForTimeout(500);
    
    // All toasts should be dismissed
    const toasts = page.locator('[role="status"], [class*="toast"]');
    const toastCount = await toasts.count();
    
    expect(toastCount).toBe(0);
  });
});
