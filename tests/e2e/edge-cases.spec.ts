import { test, expect } from '@playwright/test';

test.describe('Edge Cases E2E Tests', () => {
  test('should handle password at minimum length (8)', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    const lengthValue = page.locator('[data-testid="length-value"]');
    const lengthSlider = page.locator('[data-testid="length-slider"]');
    
    // Focus on slider and press Home to set to minimum
    await lengthSlider.click();
    await page.keyboard.press('Home');
    await page.waitForTimeout(300);
    
    // Verify the length is at minimum
    const value = await lengthValue.textContent();
    expect(value).toBe('8');
    
    // Generate a new password
    const refreshButton = page.locator('[data-testid="refresh-button"]');
    await refreshButton.click();
    await page.waitForTimeout(300);
    
    const passwordDisplay = page.locator('[data-testid="password-display"] p');
    const password = await passwordDisplay.textContent();
    
    expect(password?.length).toBe(8);
  });

  test('should handle password at maximum length (50)', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    const lengthValue = page.locator('[data-testid="length-value"]');
    const lengthSlider = page.locator('[data-testid="length-slider"]');
    
    // Focus on slider and press End to set to maximum
    await lengthSlider.click();
    await page.keyboard.press('End');
    await page.waitForTimeout(300);
    
    // Verify the length is at maximum
    const value = await lengthValue.textContent();
    expect(value).toBe('50');
    
    // Generate a new password
    const refreshButton = page.locator('[data-testid="refresh-button"]');
    await refreshButton.click();
    await page.waitForTimeout(300);
    
    const passwordDisplay = page.locator('[data-testid="password-display"] p');
    const password = await passwordDisplay.textContent();
    
    expect(password?.length).toBe(50);
  });

  test('should handle PIN at minimum length (3)', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Switch to PIN tab
    const pinTab = page.locator('[data-testid="tab-pin"]');
    await pinTab.click();
    await page.waitForTimeout(300);
    
    const lengthValue = page.locator('[data-testid="length-value"]');
    const lengthSlider = page.locator('[data-testid="length-slider"]');
    
    // Focus on slider and press Home to set to minimum
    await lengthSlider.click();
    await page.keyboard.press('Home');
    await page.waitForTimeout(300);
    
    // Verify the length is at minimum
    const value = await lengthValue.textContent();
    expect(value).toBe('3');
    
    // Generate a new PIN
    const refreshButton = page.locator('[data-testid="refresh-button"]');
    await refreshButton.click();
    await page.waitForTimeout(300);
    
    const passwordDisplay = page.locator('[data-testid="password-display"] p');
    const pin = await passwordDisplay.textContent();
    
    expect(pin?.length).toBe(3);
  });

  test('should handle PIN at maximum length (12)', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Switch to PIN tab
    const pinTab = page.locator('[data-testid="tab-pin"]');
    await pinTab.click();
    await page.waitForTimeout(300);
    
    const lengthValue = page.locator('[data-testid="length-value"]');
    const lengthSlider = page.locator('[data-testid="length-slider"]');
    
    // Focus on slider and press End to set to maximum
    await lengthSlider.click();
    await page.keyboard.press('End');
    await page.waitForTimeout(300);
    
    // Verify the length is at maximum
    const value = await lengthValue.textContent();
    expect(value).toBe('12');
    
    // Generate a new PIN
    const refreshButton = page.locator('[data-testid="refresh-button"]');
    await refreshButton.click();
    await page.waitForTimeout(300);
    
    const passwordDisplay = page.locator('[data-testid="password-display"] p');
    const pin = await passwordDisplay.textContent();
    
    expect(pin?.length).toBe(12);
  });

  test('should handle passphrase at minimum word count (4)', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Switch to passphrase tab
    const passphraseTab = page.locator('[data-testid="tab-passphrase"]');
    await passphraseTab.click();
    await page.waitForTimeout(300);
    
    const wordCountValue = page.locator('[data-testid="word-count-value"]');
    const wordCountSlider = page.locator('[data-testid="word-count-slider"]');
    
    // Focus on slider and press Home to set to minimum
    await wordCountSlider.click();
    await page.keyboard.press('Home');
    await page.waitForTimeout(300);
    
    // Verify the word count is at minimum
    const value = await wordCountValue.textContent();
    expect(value).toBe('4');
    
    // Generate a new passphrase
    const refreshButton = page.locator('[data-testid="refresh-button"]');
    await refreshButton.click();
    await page.waitForTimeout(300);
    
    const passwordDisplay = page.locator('[data-testid="password-display"] p');
    const passphrase = await passwordDisplay.textContent();
    const words = passphrase!.split(/[-_. ]/);
    
    expect(words.length).toBe(4);
  });

  test('should handle passphrase at maximum word count (10)', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Switch to passphrase tab
    const passphraseTab = page.locator('[data-testid="tab-passphrase"]');
    await passphraseTab.click();
    await page.waitForTimeout(300);
    
    const wordCountValue = page.locator('[data-testid="word-count-value"]');
    const wordCountSlider = page.locator('[data-testid="word-count-slider"]');
    
    // Focus on slider and press End to set to maximum
    await wordCountSlider.click();
    await page.keyboard.press('End');
    await page.waitForTimeout(300);
    
    // Verify the word count is at maximum
    const value = await wordCountValue.textContent();
    expect(value).toBe('10');
    
    // Generate a new passphrase
    const refreshButton = page.locator('[data-testid="refresh-button"]');
    await refreshButton.click();
    await page.waitForTimeout(300);
    
    const passwordDisplay = page.locator('[data-testid="password-display"] p');
    const passphrase = await passwordDisplay.textContent();
    const words = passphrase!.split(/[-_. ]/);
    
    expect(words.length).toBe(10);
  });

  test('should handle password with no character types enabled', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Ensure all toggles are off
    const digitToggle = page.locator('[data-testid="toggle-digits"]');
    const uppercaseToggle = page.locator('[data-testid="toggle-uppercase"]');
    const symbolsToggle = page.locator('[data-testid="toggle-symbols"]');
    
    const digitChecked = await digitToggle.getAttribute('aria-checked');
    const uppercaseChecked = await uppercaseToggle.getAttribute('aria-checked');
    const symbolsChecked = await symbolsToggle.getAttribute('aria-checked');
    
    if (digitChecked === 'true') {
      await digitToggle.click();
    }
    if (uppercaseChecked === 'true') {
      await uppercaseToggle.click();
    }
    if (symbolsChecked === 'true') {
      await symbolsToggle.click();
    }
    await page.waitForTimeout(500);
    
    const passwordDisplay = page.locator('[data-testid="password-display"] p');
    const password = await passwordDisplay.textContent();
    
    // Should only contain lowercase letters
    expect(password).toMatch(/^[a-z]+$/);
  });

  test('should handle password with all character types enabled', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Enable all toggles (they might already be enabled)
    const digitToggle = page.locator('[data-testid="toggle-digits"]');
    const uppercaseToggle = page.locator('[data-testid="toggle-uppercase"]');
    const symbolsToggle = page.locator('[data-testid="toggle-symbols"]');
    
    // Check current state and enable if needed
    let digitChecked = await digitToggle.getAttribute('aria-checked');
    if (digitChecked !== 'true') {
      await digitToggle.click();
    }
    
    let uppercaseChecked = await uppercaseToggle.getAttribute('aria-checked');
    if (uppercaseChecked !== 'true') {
      await uppercaseToggle.click();
    }
    
    let symbolsChecked = await symbolsToggle.getAttribute('aria-checked');
    if (symbolsChecked !== 'true') {
      await symbolsToggle.click();
    }
    
    await page.waitForTimeout(500);
    
    const passwordDisplay = page.locator('[data-testid="password-display"] p');
    const password = await passwordDisplay.textContent();
    
    // Should contain at least lowercase and possibly other types
    expect(password).toMatch(/[a-z]/);
  });

  test('should handle very long password copy', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Set slider to maximum
    const lengthSlider = page.locator('[data-testid="length-slider"]');
    await lengthSlider.evaluate((slider: any) => {
      slider.value = slider.max;
      slider.dispatchEvent(new Event('input', { bubbles: true }));
      slider.dispatchEvent(new Event('change', { bubbles: true }));
    });
    await page.waitForTimeout(500);
    
    const copyButton = page.locator('[data-testid="copy-button"]');
    await copyButton.click();
    
    // Should handle long password copy
    await page.waitForTimeout(1000);
    
    await expect(copyButton).toBeEnabled();
  });

  test('should handle very short password copy', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Set slider to minimum
    const lengthSlider = page.locator('[data-testid="length-slider"]');
    await lengthSlider.evaluate((slider: any) => {
      slider.value = slider.min;
      slider.dispatchEvent(new Event('input', { bubbles: true }));
      slider.dispatchEvent(new Event('change', { bubbles: true }));
    });
    await page.waitForTimeout(500);
    
    const copyButton = page.locator('[data-testid="copy-button"]');
    await copyButton.click();
    
    // Should handle short password copy
    await page.waitForTimeout(1000);
    
    await expect(copyButton).toBeEnabled();
  });

  test('should handle rapid slider changes', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    const lengthSlider = page.locator('[data-testid="length-slider"]');
    const passwordDisplay = page.locator('[data-testid="password-display"] p');
    
    // Change slider rapidly
    for (let i = 0; i < 10; i++) {
      await lengthSlider.click();
      await page.waitForTimeout(100);
    }
    
    // Should still generate valid password
    const password = await passwordDisplay.textContent();
    expect(password).toBeTruthy();
    expect(password!.length).toBeGreaterThanOrEqual(8);
    expect(password!.length).toBeLessThanOrEqual(64);
  });

  test('should handle rapid toggle changes', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    const digitToggle = page.locator('[data-testid="toggle-digits"]');
    const uppercaseToggle = page.locator('[data-testid="toggle-uppercase"]');
    const symbolsToggle = page.locator('[data-testid="toggle-symbols"]');
    
    // Toggle rapidly
    for (let i = 0; i < 10; i++) {
      await digitToggle.click();
      await uppercaseToggle.click();
      await symbolsToggle.click();
      await page.waitForTimeout(100);
    }
    
    // Should still generate valid password
    const passwordDisplay = page.locator('[data-testid="password-display"] p');
    const password = await passwordDisplay.textContent();
    expect(password).toBeTruthy();
  });

  test('should handle rapid refresh clicks', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    const refreshButton = page.locator('[data-testid="refresh-button"]');
    const passwordDisplay = page.locator('[data-testid="password-display"] p');
    
    // Click refresh rapidly
    for (let i = 0; i < 10; i++) {
      await refreshButton.click();
      await page.waitForTimeout(100);
    }
    
    // Should still generate valid password
    const password = await passwordDisplay.textContent();
    expect(password).toBeTruthy();
  });

  test('should handle rapid copy clicks', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    const copyButton = page.locator('[data-testid="copy-button"]');
    
    // Click copy rapidly
    for (let i = 0; i < 10; i++) {
      await copyButton.click();
      await page.waitForTimeout(100);
    }
    
    // Should not cause errors
    await expect(copyButton).toBeEnabled();
  });

  test('should handle rapid tab switches', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    const passwordTab = page.locator('[data-testid="tab-password"]');
    const pinTab = page.locator('[data-testid="tab-pin"]');
    const passphraseTab = page.locator('[data-testid="tab-passphrase"]');
    
    // Switch tabs rapidly
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
    
    // Should not cause errors
    await expect(passwordTab).toBeVisible();
    await expect(pinTab).toBeVisible();
    await expect(passphraseTab).toBeVisible();
  });

  test('should handle rapid separator changes', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Switch to passphrase tab
    const passphraseTab = page.locator('[data-testid="tab-passphrase"]');
    await passphraseTab.click();
    await page.waitForTimeout(300);
    
    const hyphenTab = page.getByRole('tab', { name: 'Hyphen' });
    const underscoreTab = page.getByRole('tab', { name: 'Underscore' });
    const spaceTab = page.getByRole('tab', { name: 'Space' });
    const periodTab = page.getByRole('tab', { name: 'Period' });
    
    // Change separators rapidly
    for (let i = 0; i < 10; i++) {
      if (i % 4 === 0) {
        await hyphenTab.click();
      } else if (i % 4 === 1) {
        await underscoreTab.click();
      } else if (i % 4 === 2) {
        await spaceTab.click();
      } else {
        await periodTab.click();
      }
      await page.waitForTimeout(100);
    }
    
    // Should not cause errors
    await expect(hyphenTab).toBeVisible();
    await expect(underscoreTab).toBeVisible();
    await expect(spaceTab).toBeVisible();
    await expect(periodTab).toBeVisible();
  });

  test('should handle password with special characters', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Enable symbols
    const symbolsToggle = page.locator('[data-testid="toggle-symbols"]');
    await symbolsToggle.click();
    await page.waitForTimeout(500);
    
    const passwordDisplay = page.locator('[data-testid="password-display"] p');
    const password = await passwordDisplay.textContent();
    
    // Should contain special characters
    expect(password).toMatch(/[!@#$%^&*(),.?":{}|<>]/);
  });

  test('should handle password with unicode characters', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    const refreshButton = page.locator('[data-testid="refresh-button"]');
    await refreshButton.click();
    await page.waitForTimeout(300);
    
    const passwordDisplay = page.locator('[data-testid="password-display"] p');
    const password = await passwordDisplay.textContent();
    
    // Should be a valid password
    expect(password).toBeTruthy();
    expect(password!.length).toBeGreaterThanOrEqual(8);
  });

  test('should handle very long passphrase', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Switch to passphrase tab
    const passphraseTab = page.locator('[data-testid="tab-passphrase"]');
    await passphraseTab.click();
    await page.waitForTimeout(300);
    
    // Set slider to maximum
    const wordCountSlider = page.locator('[data-testid="word-count-slider"]');
    await wordCountSlider.evaluate((slider: any) => {
      slider.value = slider.max;
      slider.dispatchEvent(new Event('input', { bubbles: true }));
      slider.dispatchEvent(new Event('change', { bubbles: true }));
    });
    await page.waitForTimeout(500);
    
    const passwordDisplay = page.locator('[data-testid="password-display"] p');
    const passphrase = await passwordDisplay.textContent();
    
    // Should be a valid passphrase
    expect(passphrase).toBeTruthy();
    expect(passphrase!.length).toBeGreaterThan(0);
  });

  test('should handle very short passphrase', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Switch to passphrase tab
    const passphraseTab = page.locator('[data-testid="tab-passphrase"]');
    await passphraseTab.click();
    await page.waitForTimeout(300);
    
    // Set slider to minimum
    const wordCountSlider = page.locator('[data-testid="word-count-slider"]');
    await wordCountSlider.evaluate((slider: any) => {
      slider.value = slider.min;
      slider.dispatchEvent(new Event('input', { bubbles: true }));
      slider.dispatchEvent(new Event('change', { bubbles: true }));
    });
    await page.waitForTimeout(500);
    
    const passwordDisplay = page.locator('[data-testid="password-display"] p');
    const passphrase = await passwordDisplay.textContent();
    
    // Should be a valid passphrase
    expect(passphrase).toBeTruthy();
    expect(passphrase!.length).toBeGreaterThan(0);
  });

  test('should handle passphrase with space separator', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Switch to passphrase tab
    const passphraseTab = page.locator('[data-testid="tab-passphrase"]');
    await passphraseTab.click();
    await page.waitForTimeout(300);
    
    // Select space separator
    const spaceTab = page.getByRole('tab', { name: 'Space' });
    await spaceTab.click();
    await page.waitForTimeout(500);
    
    const passwordDisplay = page.locator('[data-testid="password-display"] p');
    const passphrase = await passwordDisplay.textContent();
    
    // Should contain spaces
    expect(passphrase).toContain(' ');
  });

  test('should handle passphrase with period separator', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Switch to passphrase tab
    const passphraseTab = page.locator('[data-testid="tab-passphrase"]');
    await passphraseTab.click();
    await page.waitForTimeout(300);
    
    // Select period separator
    const periodTab = page.getByRole('tab', { name: 'Period' });
    await periodTab.click();
    await page.waitForTimeout(500);
    
    const passwordDisplay = page.locator('[data-testid="password-display"] p');
    const passphrase = await passwordDisplay.textContent();
    
    // Should contain periods
    expect(passphrase).toContain('.');
  });

  test('should handle passphrase with underscore separator', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Switch to passphrase tab
    const passphraseTab = page.locator('[data-testid="tab-passphrase"]');
    await passphraseTab.click();
    await page.waitForTimeout(300);
    
    // Select underscore separator
    const underscoreTab = page.getByRole('tab', { name: 'Underscore' });
    await underscoreTab.click();
    await page.waitForTimeout(500);
    
    const passwordDisplay = page.locator('[data-testid="password-display"] p');
    const passphrase = await passwordDisplay.textContent();
    
    // Should contain underscores
    expect(passphrase).toContain('_');
  });

  test('should handle passphrase with hyphen separator', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Switch to passphrase tab
    const passphraseTab = page.locator('[data-testid="tab-passphrase"]');
    await passphraseTab.click();
    await page.waitForTimeout(300);
    
    // Select hyphen separator
    const hyphenTab = page.getByRole('tab', { name: 'Hyphen' });
    await hyphenTab.click();
    await page.waitForTimeout(500);
    
    const passwordDisplay = page.locator('[data-testid="password-display"] p');
    const passphrase = await passwordDisplay.textContent();
    
    // Should contain hyphens
    expect(passphrase).toContain('-');
  });

  test('should handle breach check on very long password', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Set slider to maximum
    const lengthSlider = page.locator('[data-testid="length-slider"]');
    await lengthSlider.evaluate((slider: any) => {
      slider.value = slider.max;
      slider.dispatchEvent(new Event('input', { bubbles: true }));
      slider.dispatchEvent(new Event('change', { bubbles: true }));
    });
    await page.waitForTimeout(500);
    
    const breachCheckButton = page.locator('[data-testid="breach-check-button"]');
    await breachCheckButton.click();
    
    // Should handle breach check
    await page.waitForTimeout(2000);
    
    await expect(breachCheckButton).toBeEnabled({ timeout: 5000 });
  });

  test('should handle breach check on very short password', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Set slider to minimum
    const lengthSlider = page.locator('[data-testid="length-slider"]');
    await lengthSlider.evaluate((slider: any) => {
      slider.value = slider.min;
      slider.dispatchEvent(new Event('input', { bubbles: true }));
      slider.dispatchEvent(new Event('change', { bubbles: true }));
    });
    await page.waitForTimeout(500);
    
    const breachCheckButton = page.locator('[data-testid="breach-check-button"]');
    await breachCheckButton.click();
    
    // Should handle breach check
    await page.waitForTimeout(2000);
    
    await expect(breachCheckButton).toBeEnabled({ timeout: 5000 });
  });

  test('should handle multiple operations simultaneously', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    const refreshButton = page.locator('[data-testid="refresh-button"]');
    const copyButton = page.locator('[data-testid="copy-button"]');
    const breachCheckButton = page.locator('[data-testid="breach-check-button"]');
    
    // Perform multiple operations
    await refreshButton.click();
    await copyButton.click();
    await breachCheckButton.click();
    
    // Should handle without errors
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
    
    // Perform operations on each tab
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
    
    // Should handle without errors
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
      
      // Should handle without errors
      await expect(refreshButton).toBeEnabled();
    }
  });

  test('should handle operations in both themes', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    const themeToggle = page.locator('[data-testid="theme-toggle"]');
    const refreshButton = page.locator('[data-testid="refresh-button"]');
    
    // Toggle theme
    await themeToggle.click();
    await page.waitForTimeout(300);
    
    // Perform operation
    await refreshButton.click();
    await page.waitForTimeout(300);
    
    // Toggle theme again
    await themeToggle.click();
    await page.waitForTimeout(300);
    
    // Perform operation again
    await refreshButton.click();
    await page.waitForTimeout(300);
    
    // Should handle without errors
    await expect(refreshButton).toBeEnabled();
  });

  test('should handle operations on page reload', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    const refreshButton = page.locator('[data-testid="refresh-button"]');
    
    // Perform operation
    await refreshButton.click();
    await page.waitForTimeout(300);
    
    // Reload page
    await page.reload();
    await page.waitForTimeout(500);
    
    // Perform operation again
    await refreshButton.click();
    await page.waitForTimeout(300);
    
    // Should handle without errors
    await expect(refreshButton).toBeEnabled();
  });

  test('should handle very rapid state changes', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    const lengthSlider = page.locator('[data-testid="length-slider"]');
    const digitToggle = page.locator('[data-testid="toggle-digits"]');
    const uppercaseToggle = page.locator('[data-testid="toggle-uppercase"]');
    const symbolsToggle = page.locator('[data-testid="toggle-symbols"]');
    const refreshButton = page.locator('[data-testid="refresh-button"]');
    
    // Change everything rapidly
    for (let i = 0; i < 5; i++) {
      await lengthSlider.click();
      await digitToggle.click();
      await uppercaseToggle.click();
      await symbolsToggle.click();
      await refreshButton.click();
      await page.waitForTimeout(100);
    }
    
    // Should handle without errors
    const passwordDisplay = page.locator('[data-testid="password-display"] p');
    const password = await passwordDisplay.textContent();
    expect(password).toBeTruthy();
  });
});
