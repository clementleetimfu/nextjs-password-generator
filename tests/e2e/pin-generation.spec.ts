import { test, expect } from '@playwright/test';

test.describe('PIN Generation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('switches to PIN tab', async ({ page }) => {
    const pinTab = page.getByTestId('tab-pin');
    await pinTab.click();

    const display = page.getByTestId('password-display');
    await expect(display).toBeVisible();

    const pinText = await display.getByRole('paragraph').textContent();
    expect(pinText).toBeTruthy();
    expect(pinText?.length).toBeGreaterThan(0);
  });

  test('adjusts PIN length and auto-regenerates', async ({ page }) => {
    await page.getByTestId('tab-pin').click();

    const display = page.getByTestId('password-display');
    const slider = page.getByTestId('length-slider');
    const lengthValue = page.getByTestId('length-value');

    const initialPin = await display.getByRole('paragraph').textContent();
    const initialLength = await lengthValue.textContent();

    const sliderBoundingBox = await slider.boundingBox();
    if (sliderBoundingBox) {
      const targetX = sliderBoundingBox.x + sliderBoundingBox.width * 0.7;
      const targetY = sliderBoundingBox.y + sliderBoundingBox.height / 2;
      await page.mouse.click(targetX, targetY);
    }

    await expect(lengthValue).toHaveText(/([89]|10|11|12)/, { timeout: 5000 });

    const newPin = await display.getByRole('paragraph').textContent();
    expect(newPin?.length).toBeGreaterThan(3);
    expect(newPin).not.toBe(initialPin);
  });

  test('generated PIN contains only digits', async ({ page }) => {
    await page.getByTestId('tab-pin').click();

    const display = page.getByTestId('password-display');
    
    const pin = await display.getByRole('paragraph').textContent();
    const isDigitsOnly = /^\d+$/.test(pin || '');
    
    expect(isDigitsOnly).toBe(true);
  });

  test('copy button copies PIN to clipboard and shows toast', async ({ page, browserName }) => {
    await page.getByTestId('tab-pin').click();

    const copyButton = page.getByTestId('copy-button');
    const display = page.getByTestId('password-display');
    
    const expectedPin = await display.getByRole('paragraph').textContent();

    await copyButton.click();

    const toast = page.getByText('Copied to clipboard!');
    await expect(toast).toBeVisible();

    if (browserName === 'chromium' || browserName === 'firefox') {
      const clipboardContent = await page.evaluate(async () => {
        return navigator.clipboard.readText();
      });
      
      expect(clipboardContent).toBe(expectedPin);
    }
  });
});
