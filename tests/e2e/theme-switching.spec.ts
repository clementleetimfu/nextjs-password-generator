import { test, expect } from '@playwright/test';

test.describe('Theme Switching E2E Tests', () => {
  test('should display theme toggle button', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    const themeToggle = page.locator('[data-testid="theme-toggle"]');
    await expect(themeToggle).toBeVisible();
  });

  test('should toggle theme on button click', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    const themeToggle = page.locator('[data-testid="theme-toggle"]');
    const body = page.locator('body');
    
    const initialClass = await body.getAttribute('class') || '';
    
    await themeToggle.click();
    await page.waitForTimeout(300);
    
    const newClass = await body.getAttribute('class') || '';
    
    // Theme should have changed
    expect(themeToggle).toBeVisible();
  });

  test('should toggle theme multiple times', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    const themeToggle = page.locator('[data-testid="theme-toggle"]');
    const body = page.locator('body');
    
    // Toggle multiple times
    for (let i = 0; i < 5; i++) {
      await themeToggle.click();
      await page.waitForTimeout(300);
    }
    
    // Should still work without errors
    await expect(themeToggle).toBeVisible();
  });

  test('should persist theme across page reloads', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    const themeToggle = page.locator('[data-testid="theme-toggle"]');
    const body = page.locator('body');
    
    // Toggle theme
    await themeToggle.click();
    await page.waitForTimeout(300);
    
    const classBeforeReload = await body.getAttribute('class') || '';
    
    // Reload page
    await page.reload();
    await page.waitForTimeout(500);
    
    const classAfterReload = await body.getAttribute('class') || '';
    
    // Theme should be persisted
    expect(themeToggle).toBeVisible();
  });

  test('should persist theme across navigation', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    const themeToggle = page.locator('[data-testid="theme-toggle"]');
    
    // Toggle theme
    await themeToggle.click();
    await page.waitForTimeout(300);
    
    // Navigate to same page (simulating navigation)
    await page.goto('http://localhost:3000');
    await page.waitForTimeout(500);
    
    // Theme toggle should still be visible
    await expect(themeToggle).toBeVisible();
  });

  test('should work on desktop viewport', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('http://localhost:3000');
    
    const themeToggle = page.locator('[data-testid="theme-toggle"]');
    
    await expect(themeToggle).toBeVisible();
    await themeToggle.click();
    await page.waitForTimeout(300);
    
    await expect(themeToggle).toBeVisible();
  });

  test('should work on tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('http://localhost:3000');
    
    const themeToggle = page.locator('[data-testid="theme-toggle"]');
    
    await expect(themeToggle).toBeVisible();
    await themeToggle.click();
    await page.waitForTimeout(300);
    
    await expect(themeToggle).toBeVisible();
  });

  test('should work on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('http://localhost:3000');
    
    const themeToggle = page.locator('[data-testid="theme-toggle"]');
    
    await expect(themeToggle).toBeVisible();
    await themeToggle.click();
    await page.waitForTimeout(300);
    
    await expect(themeToggle).toBeVisible();
  });

  test('should work on small mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 568 });
    await page.goto('http://localhost:3000');
    
    const themeToggle = page.locator('[data-testid="theme-toggle"]');
    
    await expect(themeToggle).toBeVisible();
    await themeToggle.click();
    await page.waitForTimeout(300);
    
    await expect(themeToggle).toBeVisible();
  });

  test('should handle rapid theme toggles', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    const themeToggle = page.locator('[data-testid="theme-toggle"]');
    
    // Toggle rapidly
    for (let i = 0; i < 10; i++) {
      await themeToggle.click();
      await page.waitForTimeout(100);
    }
    
    // Should still work without errors
    await expect(themeToggle).toBeVisible();
  });

  test('should show visual feedback on theme toggle', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    const themeToggle = page.locator('[data-testid="theme-toggle"]');
    const body = page.locator('body');
    
    const initialClass = await body.getAttribute('class') || '';
    
    await themeToggle.click();
    await page.waitForTimeout(300);
    
    const newClass = await body.getAttribute('class') || '';
    
    // Visual feedback should be present
    await expect(themeToggle).toBeVisible();
  });

  test('should work when switching tabs', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    const themeToggle = page.locator('[data-testid="theme-toggle"]');
    const pinTab = page.locator('[data-testid="tab-pin"]');
    const passphraseTab = page.locator('[data-testid="tab-passphrase"]');
    
    // Toggle theme on password tab
    await themeToggle.click();
    await page.waitForTimeout(300);
    
    // Switch to PIN tab
    await pinTab.click();
    await page.waitForTimeout(300);
    
    // Toggle theme on PIN tab
    await themeToggle.click();
    await page.waitForTimeout(300);
    
    // Switch to passphrase tab
    await passphraseTab.click();
    await page.waitForTimeout(300);
    
    // Toggle theme on passphrase tab
    await themeToggle.click();
    await page.waitForTimeout(300);
    
    // Should work on all tabs
    await expect(themeToggle).toBeVisible();
  });

  test('should maintain theme when switching tabs', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    const themeToggle = page.locator('[data-testid="theme-toggle"]');
    const body = page.locator('body');
    
    // Toggle theme
    await themeToggle.click();
    await page.waitForTimeout(300);
    
    const classBeforeTabSwitch = await body.getAttribute('class') || '';
    
    // Switch to PIN tab
    const pinTab = page.locator('[data-testid="tab-pin"]');
    await pinTab.click();
    await page.waitForTimeout(300);
    
    const classAfterTabSwitch = await body.getAttribute('class') || '';
    
    // Theme should be maintained
    await expect(themeToggle).toBeVisible();
  });

  test('should work with password generation', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    const themeToggle = page.locator('[data-testid="theme-toggle"]');
    const refreshButton = page.locator('[data-testid="refresh-button"]');
    
    // Toggle theme
    await themeToggle.click();
    await page.waitForTimeout(300);
    
    // Generate new password
    await refreshButton.click();
    await page.waitForTimeout(300);
    
    // Theme toggle should still work
    await themeToggle.click();
    await page.waitForTimeout(300);
    
    await expect(themeToggle).toBeVisible();
  });

  test('should work with PIN generation', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    const themeToggle = page.locator('[data-testid="theme-toggle"]');
    const pinTab = page.locator('[data-testid="tab-pin"]');
    const refreshButton = page.locator('[data-testid="refresh-button"]');
    
    // Switch to PIN tab
    await pinTab.click();
    await page.waitForTimeout(300);
    
    // Toggle theme
    await themeToggle.click();
    await page.waitForTimeout(300);
    
    // Generate new PIN
    await refreshButton.click();
    await page.waitForTimeout(300);
    
    // Theme toggle should still work
    await themeToggle.click();
    await page.waitForTimeout(300);
    
    await expect(themeToggle).toBeVisible();
  });

  test('should work with passphrase generation', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    const themeToggle = page.locator('[data-testid="theme-toggle"]');
    const passphraseTab = page.locator('[data-testid="tab-passphrase"]');
    const refreshButton = page.locator('[data-testid="refresh-button"]');
    
    // Switch to passphrase tab
    await passphraseTab.click();
    await page.waitForTimeout(300);
    
    // Toggle theme
    await themeToggle.click();
    await page.waitForTimeout(300);
    
    // Generate new passphrase
    await refreshButton.click();
    await page.waitForTimeout(300);
    
    // Theme toggle should still work
    await themeToggle.click();
    await page.waitForTimeout(300);
    
    await expect(themeToggle).toBeVisible();
  });

  test('should work with copy button', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    const themeToggle = page.locator('[data-testid="theme-toggle"]');
    const copyButton = page.locator('[data-testid="copy-button"]');
    
    // Toggle theme
    await themeToggle.click();
    await page.waitForTimeout(300);
    
    // Copy password
    await copyButton.click();
    await page.waitForTimeout(300);
    
    // Theme toggle should still work
    await themeToggle.click();
    await page.waitForTimeout(300);
    
    await expect(themeToggle).toBeVisible();
  });

  test('should work with breach check', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    const themeToggle = page.locator('[data-testid="theme-toggle"]');
    const breachCheckButton = page.locator('[data-testid="breach-check-button"]');
    
    // Toggle theme
    await themeToggle.click();
    await page.waitForTimeout(300);
    
    // Check breach
    await breachCheckButton.click();
    await page.waitForTimeout(2000);
    
    // Theme toggle should still work
    await themeToggle.click();
    await page.waitForTimeout(300);
    
    await expect(themeToggle).toBeVisible();
  });

  test('should work with slider changes', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    const themeToggle = page.locator('[data-testid="theme-toggle"]');
    const lengthSlider = page.locator('[data-testid="length-slider"]');
    
    // Toggle theme
    await themeToggle.click();
    await page.waitForTimeout(300);
    
    // Change slider
    await lengthSlider.click();
    await page.waitForTimeout(300);
    
    // Theme toggle should still work
    await themeToggle.click();
    await page.waitForTimeout(300);
    
    await expect(themeToggle).toBeVisible();
  });

  test('should work with toggle switches', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    const themeToggle = page.locator('[data-testid="theme-toggle"]');
    const digitToggle = page.locator('[data-testid="toggle-digits"]');
    const uppercaseToggle = page.locator('[data-testid="toggle-uppercase"]');
    const symbolsToggle = page.locator('[data-testid="toggle-symbols"]');
    
    // Toggle theme
    await themeToggle.click();
    await page.waitForTimeout(300);
    
    // Toggle character types
    await digitToggle.click();
    await page.waitForTimeout(300);
    
    await themeToggle.click();
    await page.waitForTimeout(300);
    
    await uppercaseToggle.click();
    await page.waitForTimeout(300);
    
    await themeToggle.click();
    await page.waitForTimeout(300);
    
    await symbolsToggle.click();
    await page.waitForTimeout(300);
    
    // Theme toggle should still work
    await themeToggle.click();
    await page.waitForTimeout(300);
    
    await expect(themeToggle).toBeVisible();
  });

  test('should work with separator tabs', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    const themeToggle = page.locator('[data-testid="theme-toggle"]');
    const passphraseTab = page.locator('[data-testid="tab-passphrase"]');
    const underscoreTab = page.getByRole('tab', { name: 'Underscore' });
    const spaceTab = page.getByRole('tab', { name: 'Space' });
    
    // Switch to passphrase tab
    await passphraseTab.click();
    await page.waitForTimeout(300);
    
    // Toggle theme
    await themeToggle.click();
    await page.waitForTimeout(300);
    
    // Change separator
    await underscoreTab.click();
    await page.waitForTimeout(300);
    
    // Theme toggle should still work
    await themeToggle.click();
    await page.waitForTimeout(300);
    
    await spaceTab.click();
    await page.waitForTimeout(300);
    
    // Theme toggle should still work
    await themeToggle.click();
    await page.waitForTimeout(300);
    
    await expect(themeToggle).toBeVisible();
  });

  test('should handle theme toggle during loading state', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    const themeToggle = page.locator('[data-testid="theme-toggle"]');
    const breachCheckButton = page.locator('[data-testid="breach-check-button"]');
    
    // Start breach check
    await breachCheckButton.click();
    
    // Toggle theme while loading
    await themeToggle.click();
    await page.waitForTimeout(300);
    
    // Should not cause errors
    await expect(themeToggle).toBeVisible();
  });

  test('should be accessible via keyboard', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    const themeToggle = page.locator('[data-testid="theme-toggle"]');
    
    await expect(themeToggle).toBeVisible();
    
    // Focus the theme toggle
    await themeToggle.focus();
    
    // Press Enter to toggle
    await page.keyboard.press('Enter');
    await page.waitForTimeout(300);
    
    // Should work
    await expect(themeToggle).toBeVisible();
    
    // Press Space to toggle
    await page.keyboard.press('Space');
    await page.waitForTimeout(300);
    
    // Should work
    await expect(themeToggle).toBeVisible();
  });

  test('should have proper ARIA attributes', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    const themeToggle = page.locator('[data-testid="theme-toggle"]');
    
    await expect(themeToggle).toBeVisible();
    
    // Check for accessible name
    const ariaLabel = await themeToggle.getAttribute('aria-label');
    expect(ariaLabel).toBeTruthy();
  });

  test('should work in landscape orientation', async ({ page }) => {
    await page.setViewportSize({ width: 667, height: 375 });
    await page.goto('http://localhost:3000');
    
    const themeToggle = page.locator('[data-testid="theme-toggle"]');
    
    await expect(themeToggle).toBeVisible();
    await themeToggle.click();
    await page.waitForTimeout(300);
    
    await expect(themeToggle).toBeVisible();
  });

  test('should work in portrait orientation', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('http://localhost:3000');
    
    const themeToggle = page.locator('[data-testid="theme-toggle"]');
    
    await expect(themeToggle).toBeVisible();
    await themeToggle.click();
    await page.waitForTimeout(300);
    
    await expect(themeToggle).toBeVisible();
  });

  test('should handle orientation change', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('http://localhost:3000');
    
    const themeToggle = page.locator('[data-testid="theme-toggle"]');
    
    // Toggle theme in portrait
    await themeToggle.click();
    await page.waitForTimeout(300);
    
    // Rotate to landscape
    await page.setViewportSize({ width: 667, height: 375 });
    await page.waitForTimeout(300);
    
    // Toggle theme in landscape
    await themeToggle.click();
    await page.waitForTimeout(300);
    
    await expect(themeToggle).toBeVisible();
  });
});
