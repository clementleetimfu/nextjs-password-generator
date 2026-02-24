import { test, expect } from '@playwright/test';

test.describe('Tab Switching', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('preserves generated values when switching tabs', async ({ page }) => {
    const passwordDisplay = page.getByTestId('password-display');

    const passwordTab = page.getByTestId('tab-password');
    const pinTab = page.getByTestId('tab-pin');
    const passphraseTab = page.getByTestId('tab-passphrase');

    await passwordTab.click();
    await page.waitForTimeout(100);
    const passwordValue = await passwordDisplay.getByRole('paragraph').textContent();

    await pinTab.click();
    await page.waitForTimeout(100);
    const pinValue = await passwordDisplay.getByRole('paragraph').textContent();
    expect(pinValue).not.toBe(passwordValue);

    await passphraseTab.click();
    await page.waitForTimeout(100);
    const passphraseValue = await passwordDisplay.getByRole('paragraph').textContent();
    expect(passphraseValue).not.toBe(passwordValue);
    expect(passphraseValue).not.toBe(pinValue);

    await passwordTab.click();
    await page.waitForTimeout(100);
    const restoredPasswordValue = await passwordDisplay.getByRole('paragraph').textContent();
    expect(restoredPasswordValue).toBe(passwordValue);

    await pinTab.click();
    await page.waitForTimeout(100);
    const restoredPinValue = await passwordDisplay.getByRole('paragraph').textContent();
    expect(restoredPinValue).toBe(pinValue);
  });
});
