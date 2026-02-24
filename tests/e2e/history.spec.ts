import { test, expect } from '@playwright/test';

test.describe('History Functionality E2E Tests', () => {
  test('should generate password and add to history', async ({ page }) => {
    await page.goto('http://localhost:3000');

    const passwordDisplay = page.locator('[data-testid="password-display"] p');
    const initialPassword = await passwordDisplay.textContent();

    expect(initialPassword).toBeTruthy();
    expect(initialPassword!.length).toBeGreaterThanOrEqual(8);
  });

  test('should open history slider when history button is clicked', async ({ page }) => {
    await page.goto('http://localhost:3000');

    const passwordDisplay = page.locator('[data-testid="password-display"] p');
    await expect(passwordDisplay).toBeVisible();
    await page.waitForTimeout(500);

    const historyButton = page.locator('[data-testid="history-toggle-button"]');
    await historyButton.click();

    const historySlider = page.locator('[data-testid="close-history-button"]');
    await expect(historySlider).toBeVisible();

    const backdrop = page.locator('[data-testid="history-backdrop"]');
    await backdrop.click();

    await expect(historySlider).not.toBeVisible();
  });

  test('should close history slider when close button is clicked', async ({ page }) => {
    await page.goto('http://localhost:3000');

    const passwordDisplay = page.locator('[data-testid="password-display"] p');
    await expect(passwordDisplay).toBeVisible();
    await page.waitForTimeout(500);

    const historyButton = page.locator('[data-testid="history-toggle-button"]');
    await historyButton.click();

    const historyBackdrop = page.locator('[data-testid="history-backdrop"]');
    await expect(historyBackdrop).toBeVisible();

    const closeButton = page.locator('[data-testid="close-history-button"]');
    await closeButton.click();

    await expect(historyBackdrop).not.toBeVisible();
  });

  test('should restore password from history when item is clicked', async ({ page }) => {
    await page.goto('http://localhost:3000');

    const passwordDisplay = page.locator('[data-testid="password-display"] p');
    const firstPassword = await passwordDisplay.textContent();
    await page.waitForTimeout(500);

    const refreshButton = page.locator('[data-testid="refresh-button"]');
    await refreshButton.click();
    await page.waitForTimeout(500);
    const secondPassword = await passwordDisplay.textContent();

    expect(secondPassword).not.toBe(firstPassword);

    const historyButton = page.locator('[data-testid="history-toggle-button"]');
    await historyButton.click();

    const historyItems = page.locator('[data-testid="password-history"] button[data-testid^="history-item-"]');
    await expect(historyItems).toHaveCount(2);

    await historyItems.first().click();

    const historyBackdrop = page.locator('[data-testid="history-backdrop"]');
    await expect(historyBackdrop).not.toBeVisible();

    const currentPassword = await passwordDisplay.textContent();
    expect(currentPassword).toBe(secondPassword);
  });

  test('should show empty state when history is empty', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.evaluate(() => {
      localStorage.removeItem('credentialHistory');
    });

    await page.reload();

    const passwordDisplay = page.locator('[data-testid="password-display"] p');
    await expect(passwordDisplay).toBeVisible();

    const historyButton = page.locator('[data-testid="history-toggle-button"]');
    await historyButton.click();

    const emptyHistory = page.locator('[data-testid="empty-history"]');
    await expect(emptyHistory).toBeVisible();
    await expect(emptyHistory).toContainText('No history yet');
  });

  test('should show multiple history items', async ({ page }) => {
    await page.goto('http://localhost:3000');

    const passwordDisplay = page.locator('[data-testid="password-display"] p');
    const refreshButton = page.locator('[data-testid="refresh-button"]');

    for (let i = 0; i < 5; i++) {
      await refreshButton.click();
      await page.waitForTimeout(500);
    }

    const historyButton = page.locator('[data-testid="history-toggle-button"]');
    await historyButton.click();

    const historyItems = page.locator('[data-testid="password-history"] button[data-testid^="history-item-"]');
    await expect(historyItems).toHaveCount(5);
  });

  test('should clear password history when clear button is clicked', async ({ page }) => {
    await page.goto('http://localhost:3000');

    const passwordDisplay = page.locator('[data-testid="password-display"] p');
    await expect(passwordDisplay).toBeVisible();
    await page.waitForTimeout(500);

    const refreshButton = page.locator('[data-testid="refresh-button"]');
    await refreshButton.click();
    await page.waitForTimeout(500);

    const historyButton = page.locator('[data-testid="history-toggle-button"]');
    await historyButton.click();

    const historyItems = page.locator('[data-testid="password-history"] button[data-testid^="history-item-"]');
    await expect(historyItems).toHaveCount(2);

    const clearButton = page.locator('[data-testid="clear-history-button"]');
    await clearButton.click();

    const emptyHistory = page.locator('[data-testid="empty-history"]');
    await expect(emptyHistory).toBeVisible();

    await expect(historyItems).toHaveCount(0);
  });

  test('should limit history to MAX_ITEMS', async ({ page }) => {
    await page.goto('http://localhost:3000');

    const passwordDisplay = page.locator('[data-testid="password-display"] p');
    const refreshButton = page.locator('[data-testid="refresh-button"]');

    for (let i = 0; i < 25; i++) {
      await refreshButton.click();
      await page.waitForTimeout(300);
    }

    const historyButton = page.locator('[data-testid="history-toggle-button"]');
    await historyButton.click();

    const historyItems = page.locator('[data-testid="password-history"] button[data-testid^="history-item-"]');
    await expect(historyItems).toHaveCount(10);
  });

  test('should show PIN history when PIN tab is active', async ({ page }) => {
    await page.goto('http://localhost:3000');

    const pinTab = page.locator('[data-testid="tab-pin"]');
    await pinTab.click();
    await page.waitForTimeout(500);

    const pinDisplay = page.locator('[data-testid="password-display"] p');
    const refreshButton = page.locator('[data-testid="refresh-button"]');

    for (let i = 0; i < 3; i++) {
      await refreshButton.click();
      await page.waitForTimeout(500);
    }

    const historyButton = page.locator('[data-testid="history-toggle-button"]');
    await historyButton.click();

    const historyTitle = page.locator('h2:has-text("History")');
    await expect(historyTitle).toContainText('PIN History');

    const historyItems = page.locator('[data-testid="password-history"] button[data-testid^="history-item-"]');
    await expect(historyItems).toHaveCount(3);
  });

  test('should show passphrase history when passphrase tab is active', async ({ page }) => {
    await page.goto('http://localhost:3000');

    const passphraseTab = page.locator('[data-testid="tab-passphrase"]');
    await passphraseTab.click();
    await page.waitForTimeout(500);

    const passphraseDisplay = page.locator('[data-testid="password-display"] p');
    const refreshButton = page.locator('[data-testid="refresh-button"]');

    for (let i = 0; i < 3; i++) {
      await refreshButton.click();
      await page.waitForTimeout(500);
    }

    const historyButton = page.locator('[data-testid="history-toggle-button"]');
    await historyButton.click();

    const historyTitle = page.locator('h2:has-text("History")');
    await expect(historyTitle).toContainText('Passphrase History');

    const historyItems = page.locator('[data-testid="password-history"] button[data-testid^="history-item-"]');
    await expect(historyItems).toHaveCount(3);
  });

  test('should persist history across page reloads', async ({ page }) => {
    await page.goto('http://localhost:3000');

    const passwordDisplay = page.locator('[data-testid="password-display"] p');
    const password = await passwordDisplay.textContent();

    const historyButton = page.locator('[data-testid="history-toggle-button"]');
    await historyButton.click();

    const historyItems = page.locator('[data-testid="password-history"] button[data-testid^="history-item-"]');
    await expect(historyItems).toHaveCount(1);

    await page.reload();

    await expect(passwordDisplay).toBeVisible();
    await page.waitForTimeout(500);

    await historyButton.click();

    await expect(historyItems).toHaveCount(1);
    await expect(historyItems.first()).toContainText(password!);
  });

  test('should display timestamps on history items', async ({ page }) => {
    await page.goto('http://localhost:3000');

    const passwordDisplay = page.locator('[data-testid="password-display"] p');
    const refreshButton = page.locator('[data-testid="refresh-button"]');

    await refreshButton.click();
    await page.waitForTimeout(1000);
    await refreshButton.click();
    await page.waitForTimeout(1000);

    const historyButton = page.locator('[data-testid="history-toggle-button"]');
    await historyButton.click();

    const timestamps = page.locator('[data-testid="password-history"] button[data-testid^="history-item-"] span:last-child');
    await expect(timestamps).toHaveCount(2);

    const timestamp1 = await timestamps.nth(0).textContent();
    const timestamp2 = await timestamps.nth(1).textContent();
    expect(timestamp1).toBeTruthy();
    expect(timestamp2).toBeTruthy();
    expect(timestamp1).not.toBe(timestamp2);
  });

  test('should handle long passwords in history', async ({ page }) => {
    await page.goto('http://localhost:3000');

    const lengthSlider = page.locator('[data-testid="length-slider"]');
    await lengthSlider.click();
    await page.keyboard.press('End');
    await page.waitForTimeout(500);

    const refreshButton = page.locator('[data-testid="refresh-button"]');
    await refreshButton.click();
    await page.waitForTimeout(500);

    const historyButton = page.locator('[data-testid="history-toggle-button"]');
    await historyButton.click();

    const historyItem = page.locator('[data-testid="password-history"] button[data-testid^="history-item-"]').first();
    const passwordText = await historyItem.textContent();

    expect(passwordText).toBeTruthy();
  });
});
