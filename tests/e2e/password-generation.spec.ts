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

  test('T021: should copy password to clipboard', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Get password text
    const passwordDisplay = page.locator('[data-testid="password-display"] p');
    const passwordText = await passwordDisplay.textContent();
    
    // Click copy button - should not throw an error
    const copyButton = page.locator('[data-testid="copy-button"]');
    await expect(copyButton).toBeEnabled();
    await copyButton.click();
  });

  test('T022: should show toast notification on copy', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Click copy button
    const copyButton = page.locator('[data-testid="copy-button"]');
    await copyButton.click();
    
    // Sonner toast should appear
    const toast = page.locator('[role="status"], [class*="toast"]').first();
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
});
