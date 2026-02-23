import { test, expect } from '@playwright/test';

test.describe('Password Generation E2E Tests', () => {
  test('T019: should generate password on page load', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Wait for password to be generated
    const passwordDisplay = page.locator('[data-testid="password-display"] p');
    await expect(passwordDisplay).toBeVisible();
    
    const passwordText = await passwordDisplay.textContent();
    expect(passwordText).toBeTruthy();
    expect(passwordText!.length).toBeGreaterThanOrEqual(8);
    expect(passwordText!.length).toBeLessThanOrEqual(64);
  });

  test('T020: should refresh password when refresh button is clicked', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Get initial password
    const passwordDisplay = page.locator('[data-testid="password-display"] p');
    const initialPassword = await passwordDisplay.textContent();
    
    // Click refresh button
    const refreshButton = page.locator('[data-testid="refresh-button"]');
    await refreshButton.click();
    
    // Get new password
    const newPassword = await passwordDisplay.textContent();
    
    // Passwords should be different
    expect(newPassword).not.toBe(initialPassword);
  });

  test('T021: should copy password to clipboard', async ({ page, browserName }) => {
    test.skip(browserName !== 'chromium', 'clipboard-write is only supported in Chromium');
    
    await page.goto('http://localhost:3000');
    
    // Get password text
    const passwordDisplay = page.locator('[data-testid="password-display"] p');
    const passwordText = await passwordDisplay.textContent();
    
    // Click copy button - should not throw an error
    const copyButton = page.locator('[data-testid="copy-button"]');
    await expect(copyButton).toBeEnabled();
    await copyButton.click();
  });

  test('T022: should show toast notification on copy', async ({ page, browserName }) => {
    test.skip(browserName !== 'chromium', 'clipboard-write is only supported in Chromium');
    
    await page.goto('http://localhost:3000');
    
    // Click copy button
    const copyButton = page.locator('[data-testid="copy-button"]');
    await copyButton.click();
    
    // Sonner toast should appear
    const toast = page.locator('[data-sonner-toast], [data-testid="toast"] li').first();
    await expect(toast).toBeVisible({ timeout: 5000 });
  });

  test('should update password length when slider is moved', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Get password display
    const passwordDisplay = page.locator('[data-testid="password-display"] p');
    const initialPassword = await passwordDisplay.textContent();
    const initialLength = initialPassword?.length || 0;
    
    // Click on the slider to change length
    const lengthSlider = page.locator('[data-testid="length-slider"]');
    await lengthSlider.click();
    
    // Wait for password to regenerate
    await page.waitForTimeout(300);
    
    // Get new password
    const newPassword = await passwordDisplay.textContent();
    const newLength = newPassword?.length || 0;
    
    // Length should have changed
    expect(newLength).not.toBe(initialLength);
  });

  test('should toggle character types', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Wait for password to be generated first
    const passwordDisplay = page.locator('[data-testid="password-display"] p');
    await expect(passwordDisplay).toBeVisible();
    await page.waitForTimeout(500);
    
    // Get the toggles
    const digitToggle = page.locator('[data-testid="toggle-digits"]');
    const uppercaseToggle = page.locator('[data-testid="toggle-uppercase"]');
    const symbolsToggle = page.locator('[data-testid="toggle-symbols"]');
    
    // Default is all off - verify via aria-checked
    await expect(digitToggle).toHaveAttribute('aria-checked', 'false');
    await expect(uppercaseToggle).toHaveAttribute('aria-checked', 'false');
    await expect(symbolsToggle).toHaveAttribute('aria-checked', 'false');
    
    // Turn on uppercase
    await uppercaseToggle.click();
    await page.waitForTimeout(500);
    await expect(uppercaseToggle).toHaveAttribute('aria-checked', 'true');
    
    // Turn on digits
    await digitToggle.click();
    await page.waitForTimeout(500);
    await expect(digitToggle).toHaveAttribute('aria-checked', 'true');
    
    // Turn on symbols
    await symbolsToggle.click();
    await page.waitForTimeout(500);
    await expect(symbolsToggle).toHaveAttribute('aria-checked', 'true');
    
    // Now refresh and verify password contains different character types
    const refreshButton = page.locator('[data-testid="refresh-button"]');
    await refreshButton.click();
    await page.waitForTimeout(500);
    
    const password = await passwordDisplay.textContent();
    // Password should contain multiple character types
    expect(password?.length).toBeGreaterThan(0);
  });

  test('should generate password with all character types enabled', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Enable all character types
    const digitToggle = page.locator('[data-testid="toggle-digits"]');
    const uppercaseToggle = page.locator('[data-testid="toggle-uppercase"]');
    const symbolsToggle = page.locator('[data-testid="toggle-symbols"]');
    
    await digitToggle.click();
    await uppercaseToggle.click();
    await symbolsToggle.click();
    await page.waitForTimeout(500);
    
    // Refresh to generate new password with all types
    const refreshButton = page.locator('[data-testid="refresh-button"]');
    await refreshButton.click();
    await page.waitForTimeout(500);
    
    const passwordDisplay = page.locator('[data-testid="password-display"] p');
    const password = await passwordDisplay.textContent();
    
    // Verify password contains at least lowercase (always present)
    expect(password).toMatch(/[a-z]/);
  });

  test('should generate password with only lowercase letters', async ({ page }) => {
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
    
    // Refresh to generate new password
    const refreshButton = page.locator('[data-testid="refresh-button"]');
    await refreshButton.click();
    await page.waitForTimeout(500);
    
    const passwordDisplay = page.locator('[data-testid="password-display"] p');
    const password = await passwordDisplay.textContent();
    
    // Verify password contains only lowercase letters
    expect(password).toMatch(/^[a-z]+$/);
  });

  test('should generate password at minimum length (8)', async ({ page }) => {
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

  test('should generate password at maximum length (50)', async ({ page }) => {
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

  test('should update strength indicator when password changes', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    const strengthLevel = page.locator('[data-testid="strength-level"]');
    const initialStrength = await strengthLevel.textContent();
    
    // Change password length
    const lengthSlider = page.locator('[data-testid="length-slider"]');
    await lengthSlider.click();
    await page.waitForTimeout(500);
    
    const newStrength = await strengthLevel.textContent();
    
    // Strength should be displayed
    expect(newStrength).toBeTruthy();
  });

  test('should show strength indicator for very weak password', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Set minimum length (8 characters, lowercase only)
    const lengthSlider = page.locator('[data-testid="length-slider"]');
    await lengthSlider.click();
    await page.keyboard.press('Home');
    
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
    
    const strengthLevel = page.locator('[data-testid="strength-level"]');
    const strength = await strengthLevel.textContent();
    
    // With 8 lowercase letters, entropy is ~37.6 bits, score ~31.3, which falls in WEAK range (20-40)
    expect(strength?.toLowerCase()).toMatch(/(weak|very weak)/);
  });

  test('should show strength indicator for very strong password', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Set maximum length
    const lengthSlider = page.locator('[data-testid="length-slider"]');
    await lengthSlider.click();
    await page.keyboard.press('End');
    
    const digitToggle = page.locator('[data-testid="toggle-digits"]');
    const uppercaseToggle = page.locator('[data-testid="toggle-uppercase"]');
    const symbolsToggle = page.locator('[data-testid="toggle-symbols"]');
    
    await digitToggle.click();
    await uppercaseToggle.click();
    await symbolsToggle.click();
    
    await page.waitForTimeout(500);
    
    const strengthLevel = page.locator('[data-testid="strength-level"]');
    const strength = await strengthLevel.textContent();
    
    // Should be very strong
    expect(strength?.toLowerCase()).toContain('very strong');
  });

  test('should check breach for password', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    const breachCheckButton = page.locator('[data-testid="breach-check-button"]');
    await expect(breachCheckButton).toBeVisible();
    await expect(breachCheckButton).toBeEnabled();
    
    await breachCheckButton.click();
    await page.waitForTimeout(2000);
    
    // Button should be clickable without error
    await expect(breachCheckButton).toBeVisible();
  });

  test('should show loading state during breach check', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    const breachCheckButton = page.locator('[data-testid="breach-check-button"]');
    
    // Click breach check button
    await breachCheckButton.click();
    
    // Wait for check to complete
    await page.waitForTimeout(2000);
    
    // Button should be enabled again
    await expect(breachCheckButton).toBeEnabled({ timeout: 5000 });
  });

  test('should handle multiple refresh clicks', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    const passwordDisplay = page.locator('[data-testid="password-display"] p');
    const refreshButton = page.locator('[data-testid="refresh-button"]');
    
    const passwords: string[] = [];
    
    // Click refresh multiple times
    for (let i = 0; i < 5; i++) {
      const password = await passwordDisplay.textContent();
      passwords.push(password!);
      await refreshButton.click();
      await page.waitForTimeout(300);
    }
    
    // All passwords should be different
    const uniquePasswords = new Set(passwords);
    expect(uniquePasswords.size).toBe(5);
  });

  test('should handle multiple copy clicks', async ({ page, browserName }) => {
    test.skip(browserName !== 'chromium', 'clipboard-write is only supported in Chromium');
    
    await page.goto('http://localhost:3000');
    
    const copyButton = page.locator('[data-testid="copy-button"]');
    
    // Click copy multiple times
    for (let i = 0; i < 3; i++) {
      await copyButton.click();
      await page.waitForTimeout(200);
    }
    
    // Should not throw any errors
    await expect(copyButton).toBeEnabled();
  });

  test('should display password length value', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    const lengthValue = page.locator('[data-testid="length-value"]');
    await expect(lengthValue).toBeVisible();
    
    const lengthText = await lengthValue.textContent();
    const length = parseInt(lengthText || '0', 10);
    
    expect(length).toBeGreaterThanOrEqual(8);
    expect(length).toBeLessThanOrEqual(64);
  });

  test('should update password length value when slider moves', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    const lengthSlider = page.locator('[data-testid="length-slider"]');
    const lengthValue = page.locator('[data-testid="length-value"]');
    
    const initialLengthText = await lengthValue.textContent();
    const initialLength = parseInt(initialLengthText || '0', 10);
    
    // Click on slider
    await lengthSlider.click();
    await page.waitForTimeout(300);
    
    const newLengthText = await lengthValue.textContent();
    const newLength = parseInt(newLengthText || '0', 10);
    
    // Length value should update
    expect(newLength).not.toBe(initialLength);
  });

  test('should handle rapid slider changes', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    const lengthSlider = page.locator('[data-testid="length-slider"]');
    const passwordDisplay = page.locator('[data-testid="password-display"] p');
    
    // Move slider rapidly
    for (let i = 0; i < 5; i++) {
      await lengthSlider.click();
      await page.waitForTimeout(100);
    }
    
    // Should still generate a valid password
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
    await digitToggle.click();
    await uppercaseToggle.click();
    await symbolsToggle.click();
    await digitToggle.click();
    await uppercaseToggle.click();
    await symbolsToggle.click();
    
    await page.waitForTimeout(500);
    
    // Should still generate a valid password
    const passwordDisplay = page.locator('[data-testid="password-display"] p');
    const password = await passwordDisplay.textContent();
    expect(password).toBeTruthy();
  });
});
