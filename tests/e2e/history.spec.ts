import { test, expect } from '@playwright/test';

test.describe('History Functionality E2E Tests', () => {
  test('should generate password and add to history', async ({ page }) => {
    await page.goto('http://localhost:3000');

    // Wait for password to be generated
    const passwordDisplay = page.locator('[data-testid="password-display"] p');
    const initialPassword = await passwordDisplay.textContent();

    // Verify password is displayed
    expect(initialPassword).toBeTruthy();
    expect(initialPassword!.length).toBeGreaterThanOrEqual(8);
  });

test('should open history slider when history button is clicked', async ({ page }) => {
    await page.goto('http://localhost:3000');

    // Wait for password to be generated first
    const passwordDisplay = page.locator('[data-testid="password-display"] p');
    await expect(passwordDisplay).toBeVisible();
    await page.waitForTimeout(500);

    // Click history button
    const historyButton = page.locator('[data-testid="history-toggle-button"]');
    await historyButton.click();

    // History slider should be visible
    const historyBackdrop = page.locator('[data-testid="history-backdrop"]');
    await expect(historyBackdrop).toBeVisible();
  });

  test('should close history slider when backdrop is clicked', async ({ page }) => {
    await page.goto('http://localhost:3000');

    // Wait for password to be generated
    const passwordDisplay = page.locator('[data-testid="password-display"] p');
    await expect(passwordDisplay).toBeVisible();
    await page.waitForTimeout(500);

    // Open history
    const historyButton = page.locator('[data-testid="history-button"]');
    await historyButton.click();

    // Verify history slider is open
    const historyBackdrop = page.locator('[data-testid="history-backdrop"]');
    await expect(historyBackdrop).toBeVisible();

    // Click backdrop to close
    await historyBackdrop.click();

    // History slider should be closed
    await expect(historyBackdrop).not.toBeVisible();
  });

  test('should close history slider when close button is clicked', async ({ page }) => {
    await page.goto('http://localhost:3000');

    // Wait for password to be generated
    const passwordDisplay = page.locator('[data-testid="password-display"] p');
    await expect(passwordDisplay).toBeVisible();
    await page.waitForTimeout(500);

    // Open history
    const historyButton = page.locator('[data-testid="history-button"]');
    await historyButton.click();

    // Verify history slider is open
    const historyBackdrop = page.locator('[data-testid="history-backdrop"]');
    await expect(historyBackdrop).toBeVisible();

    // Click close button
    const closeButton = page.locator('[data-testid="close-history-button"]');
    await closeButton.click();

    // History slider should be closed
    await expect(historyBackdrop).not.toBeVisible();
  });

  test('should restore password from history when item is clicked', async ({ page }) => {
    await page.goto('http://localhost:3000');

    // Generate first password
    const passwordDisplay = page.locator('[data-testid="password-display"] p');
    const firstPassword = await passwordDisplay.textContent();
    await page.waitForTimeout(500);

    // Generate second password
    const refreshButton = page.locator('[data-testid="refresh-button"]');
    await refreshButton.click();
    await page.waitForTimeout(500);
    const secondPassword = await passwordDisplay.textContent();

    // Verify passwords are different
    expect(secondPassword).not.toBe(firstPassword);

    // Open history
    const historyButton = page.locator('[data-testid="history-button"]');
    await historyButton.click();

    // Click on first history item (should restore secondPassword since it's most recent)
    const historyItems = page.locator('[data-testid="password-history"] button[data-testid^="history-item-"]');
    await expect(historyItems).toHaveCount(2);

    // Click the first (most recent) history item
    await historyItems.first().click();

    // Wait for history to close
    const historyBackdrop = page.locator('[data-testid="history-backdrop"]');
    await expect(historyBackdrop).not.toBeVisible();

    // Password display should show the restored password
    const currentPassword = await passwordDisplay.textContent();
    expect(currentPassword).toBe(secondPassword);
  });

  test('should show empty state when history is empty', async ({ page }) => {
    // Clear localStorage before navigating
    await page.goto('http://localhost:3000');
    await page.evaluate(() => {
      localStorage.removeItem('credentialHistory');
    });

    // Reload page to clear any in-memory state
    await page.reload();

    // Wait for password to be generated
    const passwordDisplay = page.locator('[data-testid="password-display"] p');
    await expect(passwordDisplay).toBeVisible();

    // Open history
    const historyButton = page.locator('[data-testid="history-button"]');
    await historyButton.click();

    // Should show empty state
    const emptyHistory = page.locator('[data-testid="empty-history"]');
    await expect(emptyHistory).toBeVisible();
    await expect(emptyHistory).toContainText('No history yet');
  });

  test('should show multiple history items', async ({ page }) => {
    await page.goto('http://localhost:3000');

    // Generate multiple passwords
    const passwordDisplay = page.locator('[data-testid="password-display"] p');
    const refreshButton = page.locator('[data-testid="refresh-button"]');

    for (let i = 0; i < 5; i++) {
      await refreshButton.click();
      await page.waitForTimeout(500);
    }

    // Open history
    const historyButton = page.locator('[data-testid="history-button"]');
    await historyButton.click();

    // Should show multiple history items
    const historyItems = page.locator('[data-testid="password-history"] button[data-testid^="history-item-"]');
    await expect(historyItems).toHaveCount(5);
  });

  test('should clear password history when clear button is clicked', async ({ page }) => {
    await page.goto('http://localhost:3000');

    // Generate a password
    const passwordDisplay = page.locator('[data-testid="password-display"] p');
    await expect(passwordDisplay).toBeVisible();
    await page.waitForTimeout(500);

    // Generate another password
    const refreshButton = page.locator('[data-testid="refresh-button"]');
    await refreshButton.click();
    await page.waitForTimeout(500);

    // Open history
    const historyButton = page.locator('[data-testid="history-button"]');
    await historyButton.click();

    // Verify there are history items
    const historyItems = page.locator('[data-testid="password-history"] button[data-testid^="history-item-"]');
    await expect(historyItems).toHaveCount(2);

    // Click clear history button
    const clearButton = page.locator('[data-testid="clear-history-button"]');
    await clearButton.click();

    // Should show empty state
    const emptyHistory = page.locator('[data-testid="empty-history"]');
    await expect(emptyHistory).toBeVisible();

    // History items should be gone
    await expect(historyItems).toHaveCount(0);
  });

  test('should limit history to MAX_ITEMS', async ({ page }) => {
    await page.goto('http://localhost:3000');

    // Generate more passwords than MAX_ITEMS
    const passwordDisplay = page.locator('[data-testid="password-display"] p');
    const refreshButton = page.locator('[data-testid="refresh-button"]');

    for (let i = 0; i < 25; i++) {
      await refreshButton.click();
      await page.waitForTimeout(300);
    }

    // Open history
    const historyButton = page.locator('[data-testid="history-button"]');
    await historyButton.click();

    // Should limit to MAX_ITEMS (10)
    const historyItems = page.locator('[data-testid="password-history"] button[data-testid^="history-item-"]');
    await expect(historyItems).toHaveCount(10);
  });

  test('should show PIN history when PIN tab is active', async ({ page }) => {
    await page.goto('http://localhost:3000');

    // Switch to PIN tab
    const pinTab = page.locator('button:has-text("PIN")');
    await pinTab.click();
    await page.waitForTimeout(500);

    // Generate PINs
    const pinDisplay = page.locator('[data-testid="password-display"] p');
    const refreshButton = page.locator('[data-testid="refresh-button"]');

    for (let i = 0; i < 3; i++) {
      await refreshButton.click();
      await page.waitForTimeout(500);
    }

    // Open history
    const historyButton = page.locator('[data-testid="history-button"]');
    await historyButton.click();

    // History title should say "PIN History"
    const historyTitle = page.locator('[data-testid="history-slider"] h2');
    await expect(historyTitle).toContainText('PIN History');

    // Should show PIN history items
    const historyItems = page.locator('[data-testid="password-history"] button[data-testid^="history-item-"]');
    await expect(historyItems).toHaveCount(3);
  });

  test('should show passphrase history when passphrase tab is active', async ({ page }) => {
    await page.goto('http://localhost:3000');

    // Switch to passphrase tab
    const passphraseTab = page.locator('button:has-text("Passphrase")');
    await passphraseTab.click();
    await page.waitForTimeout(500);

    // Generate passphrases
    const passphraseDisplay = page.locator('[data-testid="password-display"] p');
    const refreshButton = page.locator('[data-testid="refresh-button"]');

    for (let i = 0; i < 3; i++) {
      await refreshButton.click();
      await page.waitForTimeout(500);
    }

    // Open history
    const historyButton = page.locator('[data-testid="history-button"]');
    await historyButton.click();

    // History title should say "Passphrase History"
    const historyTitle = page.locator('[data-testid="history-slider"] h2');
    await expect(historyTitle).toContainText('Passphrase History');

    // Should show passphrase history items
    const historyItems = page.locator('[data-testid="password-history"] button[data-testid^="history-item-"]');
    await expect(historyItems).toHaveCount(3);
  });

  test('should persist history across page reloads', async ({ page }) => {
    await page.goto('http://localhost:3000');

    // Generate password
    const passwordDisplay = page.locator('[data-testid="password-display"] p');
    const password = await passwordDisplay.textContent();

    // Open history
    const historyButton = page.locator('[data-testid="history-button"]');
    await historyButton.click();

    // Verify password is in history
    const historyItems = page.locator('[data-testid="password-history"] button[data-testid^="history-item-"]');
    await expect(historyItems).toHaveCount(1);

    // Reload page
    await page.reload();

    // Wait for password to be generated
    await expect(passwordDisplay).toBeVisible();
    await page.waitForTimeout(500);

    // Open history again
    await historyButton.click();

    // Password should still be in history
    await expect(historyItems).toHaveCount(1);
    await expect(historyItems.first()).toContainText(password!);
  });

  test('should display timestamps on history items', async ({ page }) => {
    await page.goto('http://localhost:3000');

    // Generate passwords with some delay to ensure different timestamps
    const passwordDisplay = page.locator('[data-testid="password-display"] p');
    const refreshButton = page.locator('[data-testid="refresh-button"]');

    await refreshButton.click();
    await page.waitForTimeout(1000);
    await refreshButton.click();
    await page.waitForTimeout(1000);

    // Open history
    const historyButton = page.locator('[data-testid="history-button"]');
    await historyButton.click();

    // Each history item should have a timestamp
    const timestamps = page.locator('[data-testid="password-history"] button[data-testid^="history-item-"] span:last-child');
    await expect(timestamps).toHaveCount(2);

    // Timestamps should be time strings
    const timestamp1 = await timestamps.nth(0).textContent();
    const timestamp2 = await timestamps.nth(1).textContent();
    expect(timestamp1).toBeTruthy();
    expect(timestamp2).toBeTruthy();
    expect(timestamp1).not.toBe(timestamp2);
  });

  test('should handle long passwords in history', async ({ page }) => {
    await page.goto('http://localhost:3000');

    // Set maximum length
    const lengthSlider = page.locator('[data-testid="length-slider"]');
    await lengthSlider.click();
    await page.keyboard.press('End');
    await page.waitForTimeout(500);

    // Generate long password
    const refreshButton = page.locator('[data-testid="refresh-button"]');
    await refreshButton.click();
    await page.waitForTimeout(500);

    // Open history
    const historyButton = page.locator('[data-testid="history-button"]');
    await historyButton.click();

    // History item should show full password
    const historyItem = page.locator('[data-testid="password-history"] button[data-testid^="history-item-"]').first();
    const passwordText = await historyItem.textContent();

    // Should contain long password
    expect(passwordText).toBeTruthy();
  });
});
