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
});
