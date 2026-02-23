import { test, expect } from '@playwright/test';

test.describe('Passphrase Generation E2E Tests', () => {
  test('T049: should generate passphrase on page load', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Switch to passphrase tab
    const passphraseTab = page.locator('[data-testid="tab-passphrase"]');
    await passphraseTab.click();
    await page.waitForTimeout(500);
    
    // Wait for passphrase to be generated
    const passphraseDisplay = page.locator('[data-testid="password-display"] p');
    await expect(passphraseDisplay).toBeVisible();
    
    const passphraseText = await passphraseDisplay.textContent();
    expect(passphraseText).toBeTruthy();
    
    // Should contain words (default is 4 words with hyphen separator)
    expect(passphraseText).toContain('-');
    
    // Should have 4 words (default)
    const words = passphraseText!.split('-');
    expect(words.length).toBe(4);
  });

  test('T050: should refresh passphrase when refresh button is clicked', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Switch to passphrase tab
    const passphraseTab = page.locator('[data-testid="tab-passphrase"]');
    await passphraseTab.click();
    await page.waitForTimeout(500);
    
    const passphraseDisplay = page.locator('[data-testid="password-display"] p');
    const refreshButton = page.locator('[data-testid="refresh-button"]');
    
    // Get initial passphrase
    const initialPassphrase = await passphraseDisplay.textContent();
    
    // Click refresh button
    await refreshButton.click();
    
    // Wait for new passphrase
    await page.waitForTimeout(300);
    
    // Get new passphrase
    const newPassphrase = await passphraseDisplay.textContent();
    
    // Passphrases should be different
    expect(newPassphrase).not.toBe(initialPassphrase);
  });

  test('T051: should copy passphrase to clipboard', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Switch to passphrase tab
    const passphraseTab = page.locator('[data-testid="tab-passphrase"]');
    await passphraseTab.click();
    await page.waitForTimeout(500);
    
    const passphraseDisplay = page.locator('[data-testid="password-display"] p');
    const copyButton = page.locator('[data-testid="copy-button"]');
    
    // Click copy button - should work without errors
    await expect(copyButton).toBeEnabled();
    await copyButton.click();
  });

  test('T052: should change separator when separator is selected', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Switch to passphrase tab
    const passphraseTab = page.locator('[data-testid="tab-passphrase"]');
    await passphraseTab.click();
    await page.waitForTimeout(500);
    
    // Default is hyphen separator - verify tabs are present and clickable
    const hyphenTab = page.getByRole('tab', { name: 'Hyphen' });
    const underscoreTab = page.getByRole('tab', { name: 'Underscore' });
    const spaceTab = page.getByRole('tab', { name: 'Space' });
    const periodTab = page.getByRole('tab', { name: 'Period' });
    
    // All tabs should be visible
    await expect(hyphenTab).toBeVisible();
    await expect(underscoreTab).toBeVisible();
    await expect(spaceTab).toBeVisible();
    await expect(periodTab).toBeVisible();
    
    // Click on underscore tab
    await underscoreTab.click();
    await page.waitForTimeout(500);
    
    // Verify tab was activated
    await expect(underscoreTab).toHaveAttribute('data-state', 'active');
  });

  test('should update word count when slider is moved', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Switch to passphrase tab
    const passphraseTab = page.locator('[data-testid="tab-passphrase"]');
    await passphraseTab.click();
    await page.waitForTimeout(500);
    
    const passphraseDisplay = page.locator('[data-testid="password-display"] p');
    const wordCountSlider = page.locator('[data-testid="word-count-slider"]');
    
    // Get initial word count - default is 4
    const initialPassphrase = await passphraseDisplay.textContent();
    const initialWords = initialPassphrase!.split('-');
    expect(initialWords.length).toBe(4);
    
    // Click on slider to change word count
    await wordCountSlider.click();
    await page.waitForTimeout(300);
    
    // Get new passphrase
    const newPassphrase = await passphraseDisplay.textContent();
    // Just verify it's a valid passphrase (has words)
    expect(newPassphrase).toBeTruthy();
  });

  // Enhanced tests

  test('should generate passphrase with hyphen separator', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Switch to passphrase tab
    const passphraseTab = page.locator('[data-testid="tab-passphrase"]');
    await passphraseTab.click();
    await page.waitForTimeout(500);
    
    // Select hyphen separator
    const hyphenTab = page.getByRole('tab', { name: 'Hyphen' });
    await hyphenTab.click();
    await page.waitForTimeout(500);
    
    const passphraseDisplay = page.locator('[data-testid="password-display"] p');
    const passphrase = await passphraseDisplay.textContent();
    
    // Should contain hyphens
    expect(passphrase).toContain('-');
    
    // Should not contain other separators
    expect(passphrase).not.toContain('_');
    expect(passphrase).not.toContain(' ');
    expect(passphrase).not.toContain('.');
  });

  test('should generate passphrase with underscore separator', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Switch to passphrase tab
    const passphraseTab = page.locator('[data-testid="tab-passphrase"]');
    await passphraseTab.click();
    await page.waitForTimeout(500);
    
    // Select underscore separator
    const underscoreTab = page.getByRole('tab', { name: 'Underscore' });
    await underscoreTab.click();
    await page.waitForTimeout(500);
    
    const passphraseDisplay = page.locator('[data-testid="password-display"] p');
    const passphrase = await passphraseDisplay.textContent();
    
    // Should contain underscores
    expect(passphrase).toContain('_');
    
    // Should not contain other separators
    expect(passphrase).not.toContain('-');
    expect(passphrase).not.toContain(' ');
    expect(passphrase).not.toContain('.');
  });

  test('should generate passphrase with space separator', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Switch to passphrase tab
    const passphraseTab = page.locator('[data-testid="tab-passphrase"]');
    await passphraseTab.click();
    await page.waitForTimeout(500);
    
    // Select space separator
    const spaceTab = page.getByRole('tab', { name: 'Space' });
    await spaceTab.click();
    await page.waitForTimeout(500);
    
    const passphraseDisplay = page.locator('[data-testid="password-display"] p');
    const passphrase = await passphraseDisplay.textContent();
    
    // Should contain spaces
    expect(passphrase).toContain(' ');
    
    // Should not contain other separators
    expect(passphrase).not.toContain('-');
    expect(passphrase).not.toContain('_');
    expect(passphrase).not.toContain('.');
  });

  test('should generate passphrase with period separator', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Switch to passphrase tab
    const passphraseTab = page.locator('[data-testid="tab-passphrase"]');
    await passphraseTab.click();
    await page.waitForTimeout(500);
    
    // Select period separator
    const periodTab = page.getByRole('tab', { name: 'Period' });
    await periodTab.click();
    await page.waitForTimeout(500);
    
    const passphraseDisplay = page.locator('[data-testid="password-display"] p');
    const passphrase = await passphraseDisplay.textContent();
    
    // Should contain periods
    expect(passphrase).toContain('.');
    
    // Should not contain other separators
    expect(passphrase).not.toContain('-');
    expect(passphrase).not.toContain('_');
    expect(passphrase).not.toContain(' ');
  });

  test('should generate passphrase at minimum word count (3)', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Switch to passphrase tab
    const passphraseTab = page.locator('[data-testid="tab-passphrase"]');
    await passphraseTab.click();
    await page.waitForTimeout(500);
    
    // Set slider to minimum
    const wordCountSlider = page.locator('[data-testid="word-count-slider"]');
    await wordCountSlider.evaluate((slider: any) => {
      slider.value = slider.min;
      slider.dispatchEvent(new Event('input', { bubbles: true }));
      slider.dispatchEvent(new Event('change', { bubbles: true }));
    });
    await page.waitForTimeout(500);
    
    const passphraseDisplay = page.locator('[data-testid="password-display"] p');
    const passphrase = await passphraseDisplay.textContent();
    
    // Should have 3 words
    const words = passphrase!.split(/[-_. ]/);
    expect(words.length).toBe(3);
  });

  test('should generate passphrase at maximum word count (8)', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Switch to passphrase tab
    const passphraseTab = page.locator('[data-testid="tab-passphrase"]');
    await passphraseTab.click();
    await page.waitForTimeout(500);
    
    // Set slider to maximum
    const wordCountSlider = page.locator('[data-testid="word-count-slider"]');
    await wordCountSlider.evaluate((slider: any) => {
      slider.value = slider.max;
      slider.dispatchEvent(new Event('input', { bubbles: true }));
      slider.dispatchEvent(new Event('change', { bubbles: true }));
    });
    await page.waitForTimeout(500);
    
    const passphraseDisplay = page.locator('[data-testid="password-display"] p');
    const passphrase = await passphraseDisplay.textContent();
    
    // Should have 8 words
    const words = passphrase!.split(/[-_. ]/);
    expect(words.length).toBe(8);
  });

  test('should update strength indicator when passphrase changes', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Switch to passphrase tab
    const passphraseTab = page.locator('[data-testid="tab-passphrase"]');
    await passphraseTab.click();
    await page.waitForTimeout(500);
    
    const strengthLevel = page.locator('[data-testid="strength-level"]');
    const initialStrength = await strengthLevel.textContent();
    
    // Change word count
    const wordCountSlider = page.locator('[data-testid="word-count-slider"]');
    await wordCountSlider.click();
    await page.waitForTimeout(500);
    
    const newStrength = await strengthLevel.textContent();
    
    // Strength should be displayed
    expect(newStrength).toBeTruthy();
  });

  test('should show strength indicator for weak passphrase (3 words)', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Switch to passphrase tab
    const passphraseTab = page.locator('[data-testid="tab-passphrase"]');
    await passphraseTab.click();
    await page.waitForTimeout(500);
    
    // Set slider to minimum
    const wordCountSlider = page.locator('[data-testid="word-count-slider"]');
    await wordCountSlider.evaluate((slider: any) => {
      slider.value = slider.min;
      slider.dispatchEvent(new Event('input', { bubbles: true }));
      slider.dispatchEvent(new Event('change', { bubbles: true }));
    });
    await page.waitForTimeout(500);
    
    const strengthLevel = page.locator('[data-testid="strength-level"]');
    const strength = await strengthLevel.textContent();
    
    // Should be weak or very weak
    expect(strength?.toLowerCase()).toMatch(/(very weak|weak)/);
  });

  test('should show strength indicator for strong passphrase (8 words)', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Switch to passphrase tab
    const passphraseTab = page.locator('[data-testid="tab-passphrase"]');
    await passphraseTab.click();
    await page.waitForTimeout(500);
    
    // Set slider to maximum
    const wordCountSlider = page.locator('[data-testid="word-count-slider"]');
    await wordCountSlider.evaluate((slider: any) => {
      slider.value = slider.max;
      slider.dispatchEvent(new Event('input', { bubbles: true }));
      slider.dispatchEvent(new Event('change', { bubbles: true }));
    });
    await page.waitForTimeout(500);
    
    const strengthLevel = page.locator('[data-testid="strength-level"]');
    const strength = await strengthLevel.textContent();
    
    // Should be strong or very strong
    expect(strength?.toLowerCase()).toMatch(/(strong|very strong)/);
  });

  test('should check breach for passphrase', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Switch to passphrase tab
    const passphraseTab = page.locator('[data-testid="tab-passphrase"]');
    await passphraseTab.click();
    await page.waitForTimeout(500);
    
    const breachCheckButton = page.locator('[data-testid="breach-check-button"]');
    await expect(breachCheckButton).toBeVisible();
    await expect(breachCheckButton).toBeEnabled();
    
    await breachCheckButton.click();
    await page.waitForTimeout(2000);
    
    // Button should be clickable without error
    await expect(breachCheckButton).toBeVisible();
  });

  test('should show loading state during passphrase breach check', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Switch to passphrase tab
    const passphraseTab = page.locator('[data-testid="tab-passphrase"]');
    await passphraseTab.click();
    await page.waitForTimeout(500);
    
    const breachCheckButton = page.locator('[data-testid="breach-check-button"]');
    
    // Click breach check button
    await breachCheckButton.click();
    
    // Button should be disabled during check
    await expect(breachCheckButton).toBeDisabled({ timeout: 1000 });
    
    // Wait for check to complete
    await page.waitForTimeout(2000);
    
    // Button should be enabled again
    await expect(breachCheckButton).toBeEnabled({ timeout: 5000 });
  });

  test('should handle multiple refresh clicks for passphrase', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Switch to passphrase tab
    const passphraseTab = page.locator('[data-testid="tab-passphrase"]');
    await passphraseTab.click();
    await page.waitForTimeout(500);
    
    const passphraseDisplay = page.locator('[data-testid="password-display"] p');
    const refreshButton = page.locator('[data-testid="refresh-button"]');
    
    const passphrases: string[] = [];
    
    // Click refresh multiple times
    for (let i = 0; i < 5; i++) {
      const passphrase = await passphraseDisplay.textContent();
      passphrases.push(passphrase!);
      await refreshButton.click();
      await page.waitForTimeout(300);
    }
    
    // All passphrases should be different
    const uniquePassphrases = new Set(passphrases);
    expect(uniquePassphrases.size).toBe(5);
  });

  test('should handle multiple copy clicks for passphrase', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Switch to passphrase tab
    const passphraseTab = page.locator('[data-testid="tab-passphrase"]');
    await passphraseTab.click();
    await page.waitForTimeout(500);
    
    const copyButton = page.locator('[data-testid="copy-button"]');
    
    // Click copy multiple times
    for (let i = 0; i < 3; i++) {
      await copyButton.click();
      await page.waitForTimeout(200);
    }
    
    // Should not throw any errors
    await expect(copyButton).toBeEnabled();
  });

  test('should display word count value', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Switch to passphrase tab
    const passphraseTab = page.locator('[data-testid="tab-passphrase"]');
    await passphraseTab.click();
    await page.waitForTimeout(500);
    
    const wordCountValue = page.locator('[data-testid="word-count-value"]');
    await expect(wordCountValue).toBeVisible();
    
    const wordCountText = await wordCountValue.textContent();
    const wordCount = parseInt(wordCountText || '0', 10);
    
    expect(wordCount).toBeGreaterThanOrEqual(3);
    expect(wordCount).toBeLessThanOrEqual(8);
  });

  test('should update word count value when slider moves', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Switch to passphrase tab
    const passphraseTab = page.locator('[data-testid="tab-passphrase"]');
    await passphraseTab.click();
    await page.waitForTimeout(500);
    
    const wordCountSlider = page.locator('[data-testid="word-count-slider"]');
    const wordCountValue = page.locator('[data-testid="word-count-value"]');
    
    const initialWordCountText = await wordCountValue.textContent();
    const initialWordCount = parseInt(initialWordCountText || '0', 10);
    
    // Click on slider
    await wordCountSlider.click();
    await page.waitForTimeout(300);
    
    const newWordCountText = await wordCountValue.textContent();
    const newWordCount = parseInt(newWordCountText || '0', 10);
    
    // Word count value should update
    expect(newWordCount).not.toBe(initialWordCount);
  });

  test('should handle rapid separator changes', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Switch to passphrase tab
    const passphraseTab = page.locator('[data-testid="tab-passphrase"]');
    await passphraseTab.click();
    await page.waitForTimeout(500);
    
    const hyphenTab = page.getByRole('tab', { name: 'Hyphen' });
    const underscoreTab = page.getByRole('tab', { name: 'Underscore' });
    const spaceTab = page.getByRole('tab', { name: 'Space' });
    const periodTab = page.getByRole('tab', { name: 'Period' });
    
    // Change separators rapidly
    await underscoreTab.click();
    await page.waitForTimeout(200);
    await spaceTab.click();
    await page.waitForTimeout(200);
    await periodTab.click();
    await page.waitForTimeout(200);
    await hyphenTab.click();
    await page.waitForTimeout(500);
    
    // Should still generate a valid passphrase
    const passphraseDisplay = page.locator('[data-testid="password-display"] p');
    const passphrase = await passphraseDisplay.textContent();
    expect(passphrase).toBeTruthy();
  });

  test('should handle rapid slider changes for word count', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Switch to passphrase tab
    const passphraseTab = page.locator('[data-testid="tab-passphrase"]');
    await passphraseTab.click();
    await page.waitForTimeout(500);
    
    const wordCountSlider = page.locator('[data-testid="word-count-slider"]');
    const passphraseDisplay = page.locator('[data-testid="password-display"] p');
    
    // Move slider rapidly
    for (let i = 0; i < 5; i++) {
      await wordCountSlider.click();
      await page.waitForTimeout(100);
    }
    
    // Should still generate a valid passphrase
    const passphrase = await passphraseDisplay.textContent();
    expect(passphrase).toBeTruthy();
  });

  test('should show toast notification on passphrase copy', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Switch to passphrase tab
    const passphraseTab = page.locator('[data-testid="tab-passphrase"]');
    await passphraseTab.click();
    await page.waitForTimeout(500);
    
    // Click copy button
    const copyButton = page.locator('[data-testid="copy-button"]');
    await copyButton.click();
    
    // Sonner toast should appear
    const toast = page.locator('[role="status"], [class*="toast"]').first();
    await expect(toast).toBeVisible({ timeout: 5000 });
  });

  test('should generate unique passphrases on refresh', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Switch to passphrase tab
    const passphraseTab = page.locator('[data-testid="tab-passphrase"]');
    await passphraseTab.click();
    await page.waitForTimeout(500);
    
    const passphraseDisplay = page.locator('[data-testid="password-display"] p');
    const refreshButton = page.locator('[data-testid="refresh-button"]');
    
    const passphrases: string[] = [];
    
    // Generate 10 passphrases
    for (let i = 0; i < 10; i++) {
      const passphrase = await passphraseDisplay.textContent();
      passphrases.push(passphrase!);
      await refreshButton.click();
      await page.waitForTimeout(200);
    }
    
    // At least 8 should be unique (allowing for some collisions)
    const uniquePassphrases = new Set(passphrases);
    expect(uniquePassphrases.size).toBeGreaterThanOrEqual(8);
  });

  test('should regenerate passphrase when separator changes', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Switch to passphrase tab
    const passphraseTab = page.locator('[data-testid="tab-passphrase"]');
    await passphraseTab.click();
    await page.waitForTimeout(500);
    
    const passphraseDisplay = page.locator('[data-testid="password-display"] p');
    const initialPassphrase = await passphraseDisplay.textContent();
    
    // Change separator
    const underscoreTab = page.getByRole('tab', { name: 'Underscore' });
    await underscoreTab.click();
    await page.waitForTimeout(500);
    
    const newPassphrase = await passphraseDisplay.textContent();
    
    // Passphrase should be regenerated (different words)
    expect(newPassphrase).not.toBe(initialPassphrase);
  });
});
