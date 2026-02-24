import { test, expect } from '@playwright/test';

test.describe('Password Generation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('tab-password').click();
  });

  test('generates password on page load', async ({ page }) => {
    const display = page.getByTestId('password-display');
    await expect(display).toBeVisible();
    
    const passwordText = await display.getByRole('paragraph').textContent();
    expect(passwordText).toBeTruthy();
    expect(passwordText?.length).toBeGreaterThan(0);
  });

  test('adjusts length slider and auto-regenerates', async ({ page }) => {
    const display = page.getByTestId('password-display');
    const slider = page.getByTestId('length-slider');
    const lengthValue = page.getByTestId('length-value');

    const initialPassword = await display.getByRole('paragraph').textContent();
    const initialLength = await lengthValue.textContent();

    const sliderBoundingBox = await slider.boundingBox();
    if (sliderBoundingBox) {
      const targetX = sliderBoundingBox.x + sliderBoundingBox.width * 0.7;
      const targetY = sliderBoundingBox.y + sliderBoundingBox.height / 2;
      await page.mouse.click(targetX, targetY);
    }

    await expect(lengthValue).toHaveText(/3[0-9]/, { timeout: 5000 });

    const newPassword = await display.getByRole('paragraph').textContent();
    expect(newPassword?.length).toBeGreaterThan(8);
    expect(newPassword).not.toBe(initialPassword);
  });

  test('toggles digits and password contains digits', async ({ page }) => {
    const display = page.getByTestId('password-display');
    const digitsToggle = page.getByTestId('toggle-digits');

    await digitsToggle.click();
    await page.waitForTimeout(100);

    const password = await display.getByRole('paragraph').textContent();
    const hasDigits = /\d/.test(password || '');
    expect(hasDigits).toBe(true);
  });

  test('toggles symbols and password contains symbols', async ({ page }) => {
    const display = page.getByTestId('password-display');
    const symbolsToggle = page.getByTestId('toggle-symbols');

    await symbolsToggle.click();
    await page.waitForTimeout(100);

    const password = await display.getByRole('paragraph').textContent();
    const hasSymbols = /[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password || '');
    expect(hasSymbols).toBe(true);
  });

  test('toggles uppercase and password contains uppercase', async ({ page }) => {
    const display = page.getByTestId('password-display');
    const uppercaseToggle = page.getByTestId('toggle-uppercase');

    await uppercaseToggle.click();
    await page.waitForTimeout(100);

    const password = await display.getByRole('paragraph').textContent();
    const hasUppercase = /[A-Z]/.test(password || '');
    expect(hasUppercase).toBe(true);
  });

  test('copy button copies to clipboard and shows toast', async ({ page, browserName }) => {
    const copyButton = page.getByTestId('copy-button');
    const display = page.getByTestId('password-display');
    
    const expectedPassword = await display.getByRole('paragraph').textContent();

    await copyButton.click();

    const toast = page.getByText('Copied to clipboard!');
    await expect(toast).toBeVisible();

    if (browserName === 'chromium' || browserName === 'firefox') {
      const clipboardContent = await page.evaluate(async () => {
        return navigator.clipboard.readText();
      });
      
      expect(clipboardContent).toBe(expectedPassword);
    }
  });
});
