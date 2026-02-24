import { test, expect } from '@playwright/test';

test.describe('Passphrase Generation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('switches to passphrase tab', async ({ page }) => {
    const passphraseTab = page.getByTestId('tab-passphrase');
    await passphraseTab.click();

    const display = page.getByTestId('password-display');
    await expect(display).toBeVisible();

    await page.waitForTimeout(200);

    const passphraseText = await display.getByRole('paragraph').textContent();
    expect(passphraseText).toBeTruthy();
    expect(passphraseText?.length).toBeGreaterThan(0);
  });

  test('adjusts word count and auto-regenerates', async ({ page }) => {
    await page.getByTestId('tab-passphrase').click();

    const display = page.getByTestId('password-display');
    const slider = page.getByTestId('word-count-slider');
    const wordCountValue = page.getByTestId('word-count-value');

    await page.waitForTimeout(200);

    const initialPassphrase = await display.getByRole('paragraph').textContent();
    const initialWordCount = await wordCountValue.textContent();

    const sliderBoundingBox = await slider.boundingBox();
    if (sliderBoundingBox) {
      const targetX = sliderBoundingBox.x + sliderBoundingBox.width * 0.7;
      const targetY = sliderBoundingBox.y + sliderBoundingBox.height / 2;
      await page.mouse.click(targetX, targetY);
    }

    await expect(wordCountValue).toHaveText(/([678]|9|10)/, { timeout: 5000 });

    await page.waitForTimeout(200);

    const newPassphrase = await display.getByRole('paragraph').textContent();
    const words = newPassphrase?.split(/[-_\s.]+/).filter(w => w.length > 0);
    
    expect(words?.length).toBeGreaterThan(4);
    expect(newPassphrase).not.toBe(initialPassphrase);
  });

  test('changes separator to hyphen', async ({ page }) => {
    await page.getByTestId('tab-passphrase').click();

    const separatorSelector = page.getByTestId('separator-selector');
    await separatorSelector.getByRole('tab', { name: 'hyphen' }).click();

    await page.waitForTimeout(100);

    const display = page.getByTestId('password-display');
    const passphrase = await display.getByRole('paragraph').textContent();
    
    expect(passphrase).toMatch(/-/);
    expect(passphrase).not.toMatch(/[_.\s]/);
  });

  test('changes separator to space', async ({ page }) => {
    await page.getByTestId('tab-passphrase').click();

    const separatorSelector = page.getByTestId('separator-selector');
    await separatorSelector.getByRole('tab', { name: 'space' }).click();

    await page.waitForTimeout(100);

    const display = page.getByTestId('password-display');
    const passphrase = await display.getByRole('paragraph').textContent();
    
    expect(passphrase).toMatch(/\s/);
    expect(passphrase).not.toMatch(/[-_.]/);
  });

  test('changes separator to underscore', async ({ page }) => {
    await page.getByTestId('tab-passphrase').click();

    const separatorSelector = page.getByTestId('separator-selector');
    await separatorSelector.getByRole('tab', { name: 'underscore' }).click();

    await page.waitForTimeout(100);

    const display = page.getByTestId('password-display');
    const passphrase = await display.getByRole('paragraph').textContent();
    
    expect(passphrase).toMatch(/_/);
    expect(passphrase).not.toMatch(/[-.\s]/);
  });

  test('changes separator to period', async ({ page }) => {
    await page.getByTestId('tab-passphrase').click();

    const separatorSelector = page.getByTestId('separator-selector');
    await separatorSelector.getByRole('tab', { name: 'period' }).click();

    await page.waitForTimeout(100);

    const display = page.getByTestId('password-display');
    const passphrase = await display.getByRole('paragraph').textContent();
    
    expect(passphrase).toMatch(/\./);
    expect(passphrase).not.toMatch(/[-_\s]/);
  });

  test('copy button copies passphrase to clipboard and shows toast', async ({ page, browserName }) => {
    await page.getByTestId('tab-passphrase').click();

    const copyButton = page.getByTestId('copy-button');
    const display = page.getByTestId('password-display');
    
    const expectedPassphrase = await display.getByRole('paragraph').textContent();

    await copyButton.click();

    const toast = page.getByText('Copied to clipboard!');
    await expect(toast).toBeVisible();

    if (browserName === 'chromium' || browserName === 'firefox') {
      const clipboardContent = await page.evaluate(async () => {
        return navigator.clipboard.readText();
      });
      
      expect(clipboardContent).toBe(expectedPassphrase);
    }
  });
});
