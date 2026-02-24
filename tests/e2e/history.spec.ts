import { test, expect } from '@playwright/test';

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

  test('closes history panel via backdrop click', async ({ page }) => {
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
});
