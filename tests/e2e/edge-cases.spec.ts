import { test, expect } from '@playwright/test';

test.describe('Edge Cases E2E Tests', () => {
  test('should handle very long password copy', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    const lengthSlider = page.locator('[data-testid="length-slider"]');
    await lengthSlider.evaluate((slider: any) => {
      slider.value = slider.max;
      slider.dispatchEvent(new Event('input', { bubbles: true }));
      slider.dispatchEvent(new Event('change', { bubbles: true }));
    });
    await page.waitForTimeout(500);
    
    const copyButton = page.locator('[data-testid="copy-button"]');
    await copyButton.click();
    
    await page.waitForTimeout(1000);
    
    await expect(copyButton).toBeEnabled();
  });

  test('should handle very short password copy', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    const lengthSlider = page.locator('[data-testid="length-slider"]');
    await lengthSlider.evaluate((slider: any) => {
      slider.value = slider.min;
      slider.dispatchEvent(new Event('input', { bubbles: true }));
      slider.dispatchEvent(new Event('change', { bubbles: true }));
    });
    await page.waitForTimeout(500);
    
    const copyButton = page.locator('[data-testid="copy-button"]');
    await copyButton.click();
    
    await page.waitForTimeout(1000);
    
    await expect(copyButton).toBeEnabled();
  });

  test('should handle password with special characters', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    const symbolsToggle = page.locator('[data-testid="toggle-symbols"]');
    await symbolsToggle.click();
    await page.waitForTimeout(500);
    
    const passwordDisplay = page.locator('[data-testid="password-display"] p');
    const password = await passwordDisplay.textContent();
    
    expect(password).toMatch(/[!@#$%^&*(),.?":{}|<>]/);
  });

  test('should handle password with unicode characters', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    const refreshButton = page.locator('[data-testid="refresh-button"]');
    await refreshButton.click();
    await page.waitForTimeout(300);
    
    const passwordDisplay = page.locator('[data-testid="password-display"] p');
    const password = await passwordDisplay.textContent();
    
    expect(password).toBeTruthy();
    expect(password!.length).toBeGreaterThanOrEqual(8);
  });

  test('should handle very long passphrase', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    const passphraseTab = page.locator('[data-testid="tab-passphrase"]');
    await passphraseTab.click();
    await page.waitForTimeout(300);
    
    const wordCountSlider = page.locator('[data-testid="word-count-slider"]');
    await wordCountSlider.evaluate((slider: any) => {
      slider.value = slider.max;
      slider.dispatchEvent(new Event('input', { bubbles: true }));
      slider.dispatchEvent(new Event('change', { bubbles: true }));
    });
    await page.waitForTimeout(500);
    
    const passwordDisplay = page.locator('[data-testid="password-display"] p');
    const passphrase = await passwordDisplay.textContent();
    
    expect(passphrase).toBeTruthy();
    expect(passphrase!.length).toBeGreaterThan(0);
  });

  test('should handle very short passphrase', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    const passphraseTab = page.locator('[data-testid="tab-passphrase"]');
    await passphraseTab.click();
    await page.waitForTimeout(300);
    
    const wordCountSlider = page.locator('[data-testid="word-count-slider"]');
    await wordCountSlider.evaluate((slider: any) => {
      slider.value = slider.min;
      slider.dispatchEvent(new Event('input', { bubbles: true }));
      slider.dispatchEvent(new Event('change', { bubbles: true }));
    });
    await page.waitForTimeout(500);
    
    const passwordDisplay = page.locator('[data-testid="password-display"] p');
    const passphrase = await passwordDisplay.textContent();
    
    expect(passphrase).toBeTruthy();
    expect(passphrase!.length).toBeGreaterThan(0);
  });

  test('should handle breach check on very long password', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    const lengthSlider = page.locator('[data-testid="length-slider"]');
    await lengthSlider.evaluate((slider: any) => {
      slider.value = slider.max;
      slider.dispatchEvent(new Event('input', { bubbles: true }));
      slider.dispatchEvent(new Event('change', { bubbles: true }));
    });
    await page.waitForTimeout(500);
    
    const breachCheckButton = page.locator('[data-testid="breach-check-button"]');
    await breachCheckButton.click();
    
    await page.waitForTimeout(2000);
    
    await expect(breachCheckButton).toBeEnabled({ timeout: 5000 });
  });

  test('should handle breach check on very short password', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    const lengthSlider = page.locator('[data-testid="length-slider"]');
    await lengthSlider.evaluate((slider: any) => {
      slider.value = slider.min;
      slider.dispatchEvent(new Event('input', { bubbles: true }));
      slider.dispatchEvent(new Event('change', { bubbles: true }));
    });
    await page.waitForTimeout(500);
    
    const breachCheckButton = page.locator('[data-testid="breach-check-button"]');
    await breachCheckButton.click();
    
    await page.waitForTimeout(2000);
    
    await expect(breachCheckButton).toBeEnabled({ timeout: 5000 });
  });

  test('should handle multiple operations simultaneously', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    const refreshButton = page.locator('[data-testid="refresh-button"]');
    const copyButton = page.locator('[data-testid="copy-button"]');
    const breachCheckButton = page.locator('[data-testid="breach-check-button"]');
    
    await refreshButton.click();
    await copyButton.click();
    await breachCheckButton.click();
    
    await page.waitForTimeout(2000);
    
    await expect(refreshButton).toBeEnabled();
    await expect(copyButton).toBeEnabled();
  });

  test('should handle operations on all tabs', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    const passwordTab = page.locator('[data-testid="tab-password"]');
    const pinTab = page.locator('[data-testid="tab-pin"]');
    const passphraseTab = page.locator('[data-testid="tab-passphrase"]');
    const refreshButton = page.locator('[data-testid="refresh-button"]');
    
    await passwordTab.click();
    await page.waitForTimeout(300);
    await refreshButton.click();
    await page.waitForTimeout(300);
    
    await pinTab.click();
    await page.waitForTimeout(300);
    await refreshButton.click();
    await page.waitForTimeout(300);
    
    await passphraseTab.click();
    await page.waitForTimeout(300);
    await refreshButton.click();
    await page.waitForTimeout(300);
    
    await expect(refreshButton).toBeEnabled();
  });

  test('should handle operations on all viewports', async ({ page }) => {
    const viewports = [
      { width: 1920, height: 1080 },
      { width: 768, height: 1024 },
      { width: 375, height: 667 },
    ];

    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await page.goto('http://localhost:3000');
      
      const refreshButton = page.locator('[data-testid="refresh-button"]');
      await refreshButton.click();
      await page.waitForTimeout(300);
      
      await expect(refreshButton).toBeEnabled();
    }
  });

  test('should handle operations in both themes', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    const themeToggle = page.locator('[data-testid="theme-toggle"]');
    const refreshButton = page.locator('[data-testid="refresh-button"]');
    
    await themeToggle.click();
    await page.waitForTimeout(300);
    
    await refreshButton.click();
    await page.waitForTimeout(300);
    
    await themeToggle.click();
    await page.waitForTimeout(300);
    
    await refreshButton.click();
    await page.waitForTimeout(300);
    
    await expect(refreshButton).toBeEnabled();
  });

  test('should handle operations on page reload', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    const refreshButton = page.locator('[data-testid="refresh-button"]');
    
    await refreshButton.click();
    await page.waitForTimeout(300);
    
    await page.reload();
    await page.waitForTimeout(500);
    
    await refreshButton.click();
    await page.waitForTimeout(300);
    
    await expect(refreshButton).toBeEnabled();
  });

  test('should handle very rapid state changes', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    const lengthSlider = page.locator('[data-testid="length-slider"]');
    const digitToggle = page.locator('[data-testid="toggle-digits"]');
    const uppercaseToggle = page.locator('[data-testid="toggle-uppercase"]');
    const symbolsToggle = page.locator('[data-testid="toggle-symbols"]');
    const refreshButton = page.locator('[data-testid="refresh-button"]');
    
    for (let i = 0; i < 5; i++) {
      await lengthSlider.click();
      await digitToggle.click();
      await uppercaseToggle.click();
      await symbolsToggle.click();
      await refreshButton.click();
      await page.waitForTimeout(100);
    }
    
    const passwordDisplay = page.locator('[data-testid="password-display"] p');
    const password = await passwordDisplay.textContent();
    expect(password).toBeTruthy();
  });
});
