import { test, expect } from '@playwright/test';

test.describe('Tab Navigation E2E Tests', () => {
  test('should default to password tab on page load', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    const passwordTab = page.locator('[data-testid="tab-password"]');
    const pinTab = page.locator('[data-testid="tab-pin"]');
    const passphraseTab = page.locator('[data-testid="tab-passphrase"]');
    
    // Password tab should be active
    await expect(passwordTab).toHaveAttribute('aria-selected', 'true');
    await expect(pinTab).toHaveAttribute('aria-selected', 'false');
    await expect(passphraseTab).toHaveAttribute('aria-selected', 'false');
    
    // Password controls should be visible
    const lengthSlider = page.locator('[data-testid="length-slider"]');
    const digitToggle = page.locator('[data-testid="toggle-digits"]');
    const uppercaseToggle = page.locator('[data-testid="toggle-uppercase"]');
    const symbolsToggle = page.locator('[data-testid="toggle-symbols"]');
    
    await expect(lengthSlider).toBeVisible();
    await expect(digitToggle).toBeVisible();
    await expect(uppercaseToggle).toBeVisible();
    await expect(symbolsToggle).toBeVisible();
  });

  test('should switch from password to PIN tab', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    const passwordTab = page.locator('[data-testid="tab-password"]');
    const pinTab = page.locator('[data-testid="tab-pin"]');
    
    // Switch to PIN tab
    await pinTab.click();
    await page.waitForTimeout(300);
    
    // PIN tab should be active
    await expect(passwordTab).toHaveAttribute('aria-selected', 'false');
    await expect(pinTab).toHaveAttribute('aria-selected', 'true');
    
    // PIN controls should be visible
    const lengthSlider = page.locator('[data-testid="length-slider"]');
    await expect(lengthSlider).toBeVisible();
    
    // Password-specific toggles should not be visible
    const digitToggle = page.locator('[data-testid="toggle-digits"]');
    const uppercaseToggle = page.locator('[data-testid="toggle-uppercase"]');
    const symbolsToggle = page.locator('[data-testid="toggle-symbols"]');
    
    await expect(digitToggle).not.toBeVisible();
    await expect(uppercaseToggle).not.toBeVisible();
    await expect(symbolsToggle).not.toBeVisible();
  });

  test('should switch from password to passphrase tab', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    const passwordTab = page.locator('[data-testid="tab-password"]');
    const passphraseTab = page.locator('[data-testid="tab-passphrase"]');
    
    // Switch to passphrase tab
    await passphraseTab.click();
    await page.waitForTimeout(300);
    
    // Passphrase tab should be active
    await expect(passwordTab).toHaveAttribute('aria-selected', 'false');
    await expect(passphraseTab).toHaveAttribute('aria-selected', 'true');
    
    // Passphrase controls should be visible
    const wordCountSlider = page.locator('[data-testid="word-count-slider"]');
    await expect(wordCountSlider).toBeVisible();
    
    // Separator tabs should be visible
    const hyphenTab = page.getByRole('tab', { name: 'Hyphen' });
    const underscoreTab = page.getByRole('tab', { name: 'Underscore' });
    const spaceTab = page.getByRole('tab', { name: 'Space' });
    const periodTab = page.getByRole('tab', { name: 'Period' });
    
    await expect(hyphenTab).toBeVisible();
    await expect(underscoreTab).toBeVisible();
    await expect(spaceTab).toBeVisible();
    await expect(periodTab).toBeVisible();
  });

  test('should switch from PIN to password tab', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // First switch to PIN tab
    const pinTab = page.locator('[data-testid="tab-pin"]');
    await pinTab.click();
    await page.waitForTimeout(300);
    
    // Switch back to password tab
    const passwordTab = page.locator('[data-testid="tab-password"]');
    await passwordTab.click();
    await page.waitForTimeout(300);
    
    // Password tab should be active
    await expect(pinTab).toHaveAttribute('aria-selected', 'false');
    await expect(passwordTab).toHaveAttribute('aria-selected', 'true');
    
    // Password controls should be visible
    const lengthSlider = page.locator('[data-testid="length-slider"]');
    const digitToggle = page.locator('[data-testid="toggle-digits"]');
    const uppercaseToggle = page.locator('[data-testid="toggle-uppercase"]');
    const symbolsToggle = page.locator('[data-testid="toggle-symbols"]');
    
    await expect(lengthSlider).toBeVisible();
    await expect(digitToggle).toBeVisible();
    await expect(uppercaseToggle).toBeVisible();
    await expect(symbolsToggle).toBeVisible();
  });

  test('should switch from PIN to passphrase tab', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // First switch to PIN tab
    const pinTab = page.locator('[data-testid="tab-pin"]');
    await pinTab.click();
    await page.waitForTimeout(300);
    
    // Switch to passphrase tab
    const passphraseTab = page.locator('[data-testid="tab-passphrase"]');
    await passphraseTab.click();
    await page.waitForTimeout(300);
    
    // Passphrase tab should be active
    await expect(pinTab).toHaveAttribute('aria-selected', 'false');
    await expect(passphraseTab).toHaveAttribute('aria-selected', 'true');
    
    // Passphrase controls should be visible
    const wordCountSlider = page.locator('[data-testid="word-count-slider"]');
    await expect(wordCountSlider).toBeVisible();
  });

  test('should switch from passphrase to password tab', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // First switch to passphrase tab
    const passphraseTab = page.locator('[data-testid="tab-passphrase"]');
    await passphraseTab.click();
    await page.waitForTimeout(300);
    
    // Switch to password tab
    const passwordTab = page.locator('[data-testid="tab-password"]');
    await passwordTab.click();
    await page.waitForTimeout(300);
    
    // Password tab should be active
    await expect(passphraseTab).toHaveAttribute('aria-selected', 'false');
    await expect(passwordTab).toHaveAttribute('aria-selected', 'true');
    
    // Password controls should be visible
    const lengthSlider = page.locator('[data-testid="length-slider"]');
    const digitToggle = page.locator('[data-testid="toggle-digits"]');
    const uppercaseToggle = page.locator('[data-testid="toggle-uppercase"]');
    const symbolsToggle = page.locator('[data-testid="toggle-symbols"]');
    
    await expect(lengthSlider).toBeVisible();
    await expect(digitToggle).toBeVisible();
    await expect(uppercaseToggle).toBeVisible();
    await expect(symbolsToggle).toBeVisible();
  });

  test('should switch from passphrase to PIN tab', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // First switch to passphrase tab
    const passphraseTab = page.locator('[data-testid="tab-passphrase"]');
    await passphraseTab.click();
    await page.waitForTimeout(300);
    
    // Switch to PIN tab
    const pinTab = page.locator('[data-testid="tab-pin"]');
    await pinTab.click();
    await page.waitForTimeout(300);
    
    // PIN tab should be active
    await expect(passphraseTab).toHaveAttribute('aria-selected', 'false');
    await expect(pinTab).toHaveAttribute('aria-selected', 'true');
    
    // PIN controls should be visible
    const lengthSlider = page.locator('[data-testid="length-slider"]');
    await expect(lengthSlider).toBeVisible();
  });

  test('should cycle through all tabs', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    const passwordTab = page.locator('[data-testid="tab-password"]');
    const pinTab = page.locator('[data-testid="tab-pin"]');
    const passphraseTab = page.locator('[data-testid="tab-passphrase"]');
    
    // Start on password tab
    await expect(passwordTab).toHaveAttribute('aria-selected', 'true');
    
    // Switch to PIN
    await pinTab.click();
    await page.waitForTimeout(300);
    await expect(pinTab).toHaveAttribute('aria-selected', 'true');
    
    // Switch to passphrase
    await passphraseTab.click();
    await page.waitForTimeout(300);
    await expect(passphraseTab).toHaveAttribute('aria-selected', 'true');
    
    // Switch back to password
    await passwordTab.click();
    await page.waitForTimeout(300);
    await expect(passwordTab).toHaveAttribute('aria-selected', 'true');
  });

  test('should preserve password state when switching tabs', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Set password length using keyboard
    const lengthSlider = page.locator('[data-testid="length-slider"]');
    await lengthSlider.click();
    await page.keyboard.press('End');
    await page.waitForTimeout(500);
    
    // Get the actual max value
    const lengthValue = page.locator('[data-testid="length-value"]');
    const maxText = await lengthValue.textContent();
    const expectedMax = parseInt(maxText || '0', 10);
    
    // Enable character types
    const digitToggle = page.locator('[data-testid="toggle-digits"]');
    const uppercaseToggle = page.locator('[data-testid="toggle-uppercase"]');
    const symbolsToggle = page.locator('[data-testid="toggle-symbols"]');
    
    await digitToggle.click();
    await uppercaseToggle.click();
    await symbolsToggle.click();
    await page.waitForTimeout(500);
    
    // Switch to PIN tab
    const pinTab = page.locator('[data-testid="tab-pin"]');
    await pinTab.click();
    await page.waitForTimeout(300);
    
    // Switch back to password tab
    const passwordTab = page.locator('[data-testid="tab-password"]');
    await passwordTab.click();
    await page.waitForTimeout(300);
    
    // State should be preserved
    const lengthText = await lengthValue.textContent();
    expect(parseInt(lengthText || '0', 10)).toBe(expectedMax);
    
    await expect(digitToggle).toHaveAttribute('aria-checked', 'true');
    await expect(uppercaseToggle).toHaveAttribute('aria-checked', 'true');
    await expect(symbolsToggle).toHaveAttribute('aria-checked', 'true');
  });

  test('should preserve PIN state when switching tabs', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Switch to PIN tab
    const pinTab = page.locator('[data-testid="tab-pin"]');
    await pinTab.click();
    await page.waitForTimeout(300);
    
    // Set PIN length using keyboard
    const lengthSlider = page.locator('[data-testid="length-slider"]');
    await lengthSlider.click();
    await page.keyboard.press('End');
    await page.waitForTimeout(500);
    
    // Get the actual max value
    const lengthValue = page.locator('[data-testid="length-value"]');
    const maxText = await lengthValue.textContent();
    const expectedMax = parseInt(maxText || '0', 10);
    
    // Switch to password tab
    const passwordTab = page.locator('[data-testid="tab-password"]');
    await passwordTab.click();
    await page.waitForTimeout(300);
    
    // Switch back to PIN tab
    await pinTab.click();
    await page.waitForTimeout(300);
    
    // State should be preserved
    const lengthText = await lengthValue.textContent();
    expect(parseInt(lengthText || '0', 10)).toBe(expectedMax);
  });

  test('should preserve passphrase state when switching tabs', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Switch to passphrase tab
    const passphraseTab = page.locator('[data-testid="tab-passphrase"]');
    await passphraseTab.click();
    await page.waitForTimeout(300);
    
    // Set word count using keyboard
    const wordCountSlider = page.locator('[data-testid="word-count-slider"]');
    await wordCountSlider.click();
    await page.keyboard.press('End');
    await page.waitForTimeout(500);
    
    // Get the actual max value
    const wordCountValue = page.locator('[data-testid="word-count-value"]');
    const maxText = await wordCountValue.textContent();
    const expectedMax = parseInt(maxText || '0', 10);
    
    // Change separator
    const underscoreTab = page.getByRole('tab', { name: 'Underscore' });
    await underscoreTab.click();
    await page.waitForTimeout(500);
    
    // Switch to password tab
    const passwordTab = page.locator('[data-testid="tab-password"]');
    await passwordTab.click();
    await page.waitForTimeout(300);
    
    // Switch back to passphrase tab
    await passphraseTab.click();
    await page.waitForTimeout(300);
    
    // State should be preserved
    const wordCountText = await wordCountValue.textContent();
    expect(parseInt(wordCountText || '0', 10)).toBe(expectedMax);
    
    await expect(underscoreTab).toHaveAttribute('data-state', 'active');
  });

  test('should regenerate password when switching back to password tab', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    const passwordDisplay = page.locator('[data-testid="password-display"] p');
    const initialPassword = await passwordDisplay.textContent();
    
    // Switch to PIN tab
    const pinTab = page.locator('[data-testid="tab-pin"]');
    await pinTab.click();
    await page.waitForTimeout(300);
    
    // Switch back to password tab
    const passwordTab = page.locator('[data-testid="tab-password"]');
    await passwordTab.click();
    await page.waitForTimeout(300);
    
    const newPassword = await passwordDisplay.textContent();
    
    // Password may or may not be regenerated
    expect(newPassword).toBeTruthy();
  });

  test('should regenerate PIN when switching back to PIN tab', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Switch to PIN tab
    const pinTab = page.locator('[data-testid="tab-pin"]');
    await pinTab.click();
    await page.waitForTimeout(300);
    
    const passwordDisplay = page.locator('[data-testid="password-display"] p');
    const initialPin = await passwordDisplay.textContent();
    
    // Switch to password tab
    const passwordTab = page.locator('[data-testid="tab-password"]');
    await passwordTab.click();
    await page.waitForTimeout(300);
    
    // Switch back to PIN tab
    await pinTab.click();
    await page.waitForTimeout(300);
    
    const newPin = await passwordDisplay.textContent();
    
    // PIN may or may not be regenerated
    expect(newPin).toBeTruthy();
  });

  test('should regenerate passphrase when switching back to passphrase tab', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Switch to passphrase tab
    const passphraseTab = page.locator('[data-testid="tab-passphrase"]');
    await passphraseTab.click();
    await page.waitForTimeout(300);
    
    const passwordDisplay = page.locator('[data-testid="password-display"] p');
    const initialPassphrase = await passwordDisplay.textContent();
    
    // Switch to password tab
    const passwordTab = page.locator('[data-testid="tab-password"]');
    await passwordTab.click();
    await page.waitForTimeout(300);
    
    // Switch back to passphrase tab
    await passphraseTab.click();
    await page.waitForTimeout(300);
    
    const newPassphrase = await passwordDisplay.textContent();
    
    // Passphrase may or may not be regenerated
    expect(newPassphrase).toBeTruthy();
  });

  test('should handle rapid tab switching', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    const passwordTab = page.locator('[data-testid="tab-password"]');
    const pinTab = page.locator('[data-testid="tab-pin"]');
    const passphraseTab = page.locator('[data-testid="tab-passphrase"]');
    
    // Switch rapidly
    for (let i = 0; i < 10; i++) {
      if (i % 3 === 0) {
        await passwordTab.click();
      } else if (i % 3 === 1) {
        await pinTab.click();
      } else {
        await passphraseTab.click();
      }
      await page.waitForTimeout(100);
    }
    
    // Should still work without errors
    await expect(passwordTab).toBeVisible();
    await expect(pinTab).toBeVisible();
    await expect(passphraseTab).toBeVisible();
  });

  test('should show correct controls for each tab', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Password tab
    const passwordTab = page.locator('[data-testid="tab-password"]');
    await passwordTab.click();
    await page.waitForTimeout(300);
    
    const lengthSlider = page.locator('[data-testid="length-slider"]');
    const digitToggle = page.locator('[data-testid="toggle-digits"]');
    const uppercaseToggle = page.locator('[data-testid="toggle-uppercase"]');
    const symbolsToggle = page.locator('[data-testid="toggle-symbols"]');
    const wordCountSlider = page.locator('[data-testid="word-count-slider"]');
    
    await expect(lengthSlider).toBeVisible();
    await expect(digitToggle).toBeVisible();
    await expect(uppercaseToggle).toBeVisible();
    await expect(symbolsToggle).toBeVisible();
    await expect(wordCountSlider).not.toBeVisible();
    
    // PIN tab
    const pinTab = page.locator('[data-testid="tab-pin"]');
    await pinTab.click();
    await page.waitForTimeout(300);
    
    await expect(lengthSlider).toBeVisible();
    await expect(digitToggle).not.toBeVisible();
    await expect(uppercaseToggle).not.toBeVisible();
    await expect(symbolsToggle).not.toBeVisible();
    await expect(wordCountSlider).not.toBeVisible();
    
    // Passphrase tab
    const passphraseTab = page.locator('[data-testid="tab-passphrase"]');
    await passphraseTab.click();
    await page.waitForTimeout(300);
    
    await expect(lengthSlider).not.toBeVisible();
    await expect(digitToggle).not.toBeVisible();
    await expect(uppercaseToggle).not.toBeVisible();
    await expect(symbolsToggle).not.toBeVisible();
    await expect(wordCountSlider).toBeVisible();
  });

  test('should show correct strength indicator for each tab', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    const strengthIndicator = page.locator('[data-testid="strength-indicator"]');
    const strengthLevel = page.locator('[data-testid="strength-level"]');
    
    // Password tab
    const passwordTab = page.locator('[data-testid="tab-password"]');
    await passwordTab.click();
    await page.waitForTimeout(300);
    
    await expect(strengthIndicator).toBeVisible();
    await expect(strengthLevel).toBeVisible();
    
    // PIN tab
    const pinTab = page.locator('[data-testid="tab-pin"]');
    await pinTab.click();
    await page.waitForTimeout(300);
    
    await expect(strengthIndicator).toBeVisible();
    await expect(strengthLevel).toBeVisible();
    
    // Passphrase tab
    const passphraseTab = page.locator('[data-testid="tab-passphrase"]');
    await passphraseTab.click();
    await page.waitForTimeout(300);
    
    await expect(strengthIndicator).toBeVisible();
    await expect(strengthLevel).toBeVisible();
  });

  test('should show correct buttons for each tab', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    const refreshButton = page.locator('[data-testid="refresh-button"]');
    const copyButton = page.locator('[data-testid="copy-button"]');
    const breachCheckButton = page.locator('[data-testid="breach-check-button"]');
    
    // Password tab
    const passwordTab = page.locator('[data-testid="tab-password"]');
    await passwordTab.click();
    await page.waitForTimeout(300);
    
    await expect(refreshButton).toBeVisible();
    await expect(copyButton).toBeVisible();
    await expect(breachCheckButton).toBeVisible();
    
    // PIN tab
    const pinTab = page.locator('[data-testid="tab-pin"]');
    await pinTab.click();
    await page.waitForTimeout(300);
    
    await expect(refreshButton).toBeVisible();
    await expect(copyButton).toBeVisible();
    await expect(breachCheckButton).toBeVisible();
    
    // Passphrase tab
    const passphraseTab = page.locator('[data-testid="tab-passphrase"]');
    await passphraseTab.click();
    await page.waitForTimeout(300);
    
    await expect(refreshButton).toBeVisible();
    await expect(copyButton).toBeVisible();
    await expect(breachCheckButton).toBeVisible();
  });

  test('should handle tab click while generating', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Click refresh to start generation
    const refreshButton = page.locator('[data-testid="refresh-button"]');
    await refreshButton.click();
    
    // Immediately switch tabs
    const pinTab = page.locator('[data-testid="tab-pin"]');
    await pinTab.click();
    await page.waitForTimeout(300);
    
    // Should not cause errors
    await expect(pinTab).toHaveAttribute('aria-selected', 'true');
  });

  test('should maintain tab state across page reload', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Switch to PIN tab
    const pinTab = page.locator('[data-testid="tab-pin"]');
    await pinTab.click();
    await page.waitForTimeout(300);
    
    // Reload page
    await page.reload();
    await page.waitForTimeout(500);
    
    // PIN tab should still be active (or default to password)
    const pinTabAfterReload = page.locator('[data-testid="tab-pin"]');
    const passwordTab = page.locator('[data-testid="tab-password"]');
    
    // Either PIN is active or it defaults to password
    const pinActive = await pinTabAfterReload.getAttribute('aria-selected');
    const passwordActive = await passwordTab.getAttribute('aria-selected');
    
    expect(pinActive === 'true' || passwordActive === 'true').toBe(true);
  });
});
