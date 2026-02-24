import { test, expect, Page } from '@playwright/test';

const closeHistoryPanel = async (page: Page, isMobile: boolean) => {
  if (isMobile) {
    await page.getByTestId('close-history-button').click();
  } else {
    await page.getByTestId('history-backdrop').click();
  }
};

test.describe('History Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('history toggle button is present', async ({ page }) => {
    const historyToggle = page.getByTestId('history-toggle-button');
    await expect(historyToggle).toBeVisible();
  });

  test('opens history panel', async ({ page }) => {
    await page.getByTestId('history-toggle-button').click();
    await page.waitForTimeout(300);

    await expect(page.getByTestId('empty-history')).toBeVisible();
  });

  test('closes history panel via backdrop click', async ({ page, isMobile }) => {
    if (isMobile) {
      test.skip();
    }

    await page.getByTestId('history-toggle-button').click();
    await page.waitForTimeout(300);

    await expect(page.getByTestId('empty-history')).toBeVisible();

    const backdrop = page.getByTestId('history-backdrop');
    await backdrop.click();
    await page.waitForTimeout(300);

    await expect(page.getByTestId('empty-history')).not.toBeVisible();
  });

  test('closes history panel via close button on desktop', async ({ page, isMobile }) => {
    if (isMobile) {
      test.skip();
    }

    await page.getByTestId('history-toggle-button').click();
    await page.waitForTimeout(300);

    await expect(page.getByTestId('empty-history')).toBeVisible();

    const closeButton = page.getByTestId('close-history-button');
    const themeToggle = page.getByTestId('theme-toggle');

    await themeToggle.evaluate((el: HTMLElement) => {
      el.style.zIndex = '-1';
    });

    await closeButton.click();
    await page.waitForTimeout(300);

    await expect(page.getByTestId('empty-history')).not.toBeVisible();

    await themeToggle.evaluate((el: HTMLElement) => {
      el.style.zIndex = '';
    });
  });

  test('shows empty history on initial load', async ({ page }) => {
    await page.getByTestId('history-toggle-button').click();
    await page.waitForTimeout(300);

    await expect(page.getByTestId('empty-history')).toBeVisible();
    await expect(page.getByText('No history yet')).toBeVisible();
  });

  test('adds item to history when refresh is clicked', async ({ page }) => {
    await page.getByTestId('refresh-button').click();
    await page.waitForTimeout(200);

    await page.getByTestId('history-toggle-button').click();
    await page.waitForTimeout(300);

    const historyItem = page.getByTestId('history-item-0');
    await expect(historyItem).toBeVisible();

    const display = page.getByTestId('password-display');
    const currentValue = await display.getByRole('paragraph').textContent();
    const historyValue = await historyItem.textContent();
    expect(historyValue).toContain(currentValue);
  });

  test('restores value from history item', async ({ page, isMobile }) => {
    await page.getByTestId('refresh-button').click();
    await page.waitForTimeout(200);

    await page.getByTestId('history-toggle-button').click();
    await page.waitForTimeout(300);
    const firstHistoryItem = page.getByTestId('history-item-0');
    const historyValue = await firstHistoryItem.locator('p').textContent();

    await closeHistoryPanel(page, isMobile);
    await page.waitForTimeout(200);
    await page.getByTestId('refresh-button').click();
    await page.waitForTimeout(200);

    await page.getByTestId('history-toggle-button').click();
    await page.waitForTimeout(300);
    await page.getByTestId('history-item-1').click();
    await page.waitForTimeout(200);

    const display = page.getByTestId('password-display');
    const currentValue = await display.getByRole('paragraph').textContent();
    expect(currentValue).toBe(historyValue);
  });

  test('clears history when clear button clicked', async ({ page }) => {
    await page.getByTestId('refresh-button').click();
    await page.waitForTimeout(200);

    await page.getByTestId('history-toggle-button').click();
    await page.waitForTimeout(300);

    await expect(page.getByTestId('history-item-0')).toBeVisible();

    await page.getByTestId('clear-history-button').click();
    await page.waitForTimeout(200);

    await expect(page.getByTestId('empty-history')).toBeVisible();
  });

  test('history is separate per credential type', async ({ page, isMobile }) => {
    await page.getByTestId('refresh-button').click();
    await page.waitForTimeout(200);

    await page.getByTestId('tab-pin').click();
    await page.waitForTimeout(200);

    await page.getByTestId('history-toggle-button').click();
    await page.waitForTimeout(300);
    await expect(page.getByTestId('empty-history')).toBeVisible();

    await closeHistoryPanel(page, isMobile);
    await page.waitForTimeout(200);
    await page.getByTestId('refresh-button').click();
    await page.waitForTimeout(200);

    await page.getByTestId('history-toggle-button').click();
    await page.waitForTimeout(300);
    await expect(page.getByTestId('history-item-0')).toBeVisible();
  });
});
